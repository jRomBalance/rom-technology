param(
    [Parameter(Mandatory = $true)]
    [string]$SvgPath,

    [Parameter(Mandatory = $true)]
    [string]$OutputPath,

    [Parameter(Mandatory = $true)]
    [int]$Width,

    [Parameter(Mandatory = $true)]
    [int]$Height,

    [string]$BackgroundColor = "#0d1b2a"
)

$ErrorActionPreference = "Stop"

$workspace = Get-Location
$svgFullPath = (Resolve-Path $SvgPath).Path
$outputFullPath = [System.IO.Path]::GetFullPath((Join-Path $workspace $OutputPath))

$outDir = Split-Path -Parent $outputFullPath
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

$edgePath = (Get-Command msedge -ErrorAction SilentlyContinue).Source
if (-not $edgePath) {
    $edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
}
if (-not (Test-Path $edgePath)) {
    throw "Microsoft Edge not found. Install Edge or provide a browser-based alternative."
}

$svgUri = [Uri]$svgFullPath
$html = @"
<!doctype html>
<html>
<head>
  <meta charset=\"utf-8\" />
  <style>
    html, body {
      margin: 0;
      width: ${Width}px;
      height: ${Height}px;
      overflow: hidden;
      background: ${BackgroundColor};
    }
    .stage {
      width: ${Width}px;
      height: ${Height}px;
      display: grid;
      place-items: center;
      background: ${BackgroundColor};
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      image-rendering: -webkit-optimize-contrast;
    }
  </style>
</head>
<body>
  <div class=\"stage\">
    <img src=\"$($svgUri.AbsoluteUri)\" alt=\"svg\" />
  </div>
</body>
</html>
"@

$tempHtml = Join-Path $env:TEMP ("svg-export-" + [Guid]::NewGuid().ToString("N") + ".html")
Set-Content -Path $tempHtml -Value $html -Encoding UTF8

try {
    & $edgePath --headless --disable-gpu --hide-scrollbars --window-size="$Width,$Height" --screenshot="$outputFullPath" "file:///$($tempHtml.Replace('\\', '/'))" | Out-Null
    if (-not (Test-Path $outputFullPath)) {
        throw "Edge did not produce output file: $outputFullPath"
    }
    Write-Output "Created: $outputFullPath"
}
finally {
    if (Test-Path $tempHtml) {
        Remove-Item $tempHtml -Force
    }
}
