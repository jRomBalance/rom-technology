<?php
/**
 * ROM Technology Theme Functions
 * Built to Last — jeROMe Allen
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ── Theme setup ────────────────────────────────────────────────
function rom_theme_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array(
        'height'      => 120,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    add_theme_support( 'html5', array(
        'search-form', 'comment-form', 'comment-list', 'gallery', 'caption'
    ));

    register_nav_menus( array(
        'primary' => __( 'Primary Navigation', 'rom-technology' ),
        'footer'  => __( 'Footer Navigation',  'rom-technology' ),
    ));
}
add_action( 'after_setup_theme', 'rom_theme_setup' );

// ── Enqueue styles & scripts ───────────────────────────────────
function rom_enqueue_assets() {
    // Parent theme styles
    wp_enqueue_style(
        'twentytwentyfour-style',
        get_template_directory_uri() . '/style.css',
        array(),
        wp_get_theme( 'twentytwentyfour' )->get( 'Version' )
    );

    // ROM Technology styles
    wp_enqueue_style(
        'rom-technology-style',
        get_stylesheet_directory_uri() . '/assets/css/rom-tech.css',
        array( 'twentytwentyfour-style' ),
        wp_get_theme()->get( 'Version' )
    );

    // ROM Technology scripts
    wp_enqueue_script(
        'rom-technology-script',
        get_stylesheet_directory_uri() . '/assets/js/rom-tech.js',
        array(),
        wp_get_theme()->get( 'Version' ),
        true  // load in footer
    );

    // Pass theme data to JS
    wp_localize_script( 'rom-technology-script', 'romTheme', array(
        'logoUrl'     => get_stylesheet_directory_uri() . '/assets/images/Rom_logo_master.svg',
        'faviconUrl'  => get_stylesheet_directory_uri() . '/assets/images/favicon-512.png',
        'siteUrl'     => home_url('/'),
        'themePath'   => get_stylesheet_directory_uri(),
    ));
}
add_action( 'wp_enqueue_scripts', 'rom_enqueue_assets' );

// ── Favicon / site icon ────────────────────────────────────────
function rom_add_favicon() {
    $favicon = get_stylesheet_directory_uri() . '/assets/images/favicon-32.png';
    $apple   = get_stylesheet_directory_uri() . '/assets/images/favicon-180.png';
    $android = get_stylesheet_directory_uri() . '/assets/images/favicon-192.png';
    ?>
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo esc_url( $favicon ); ?>">
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo esc_url( $apple ); ?>">
    <link rel="icon" type="image/png" sizes="192x192" href="<?php echo esc_url( $android ); ?>">
    <meta name="theme-color" content="#0d1b2a">
    <meta name="msapplication-TileColor" content="#0d1b2a">
    <?php
}
add_action( 'wp_head', 'rom_add_favicon' );

// ── Open Graph meta tags ───────────────────────────────────────
function rom_og_meta() {
    global $post;
    $og_image = get_stylesheet_directory_uri() . '/assets/images/favicon-512.png';
    if ( has_post_thumbnail() ) {
        $og_image = get_the_post_thumbnail_url( $post, 'large' );
    }
    ?>
    <meta property="og:site_name" content="ROM Allen — Built to Last">
    <meta property="og:type" content="website">
    <meta property="og:image" content="<?php echo esc_url( $og_image ); ?>">
    <meta property="og:title" content="<?php echo esc_attr( get_the_title() ); ?> — ROM Allen">
    <meta property="og:description" content="A technologist rooted in resilience, building tools that restore connection.">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="<?php echo esc_url( $og_image ); ?>">
    <?php
}
add_action( 'wp_head', 'rom_og_meta' );

// ── Custom body classes ────────────────────────────────────────
function rom_body_classes( $classes ) {
    $classes[] = 'rom-technology';
    if ( is_front_page() ) {
        $classes[] = 'rom-front-page';
    }
    return $classes;
}
add_filter( 'body_class', 'rom_body_classes' );

// ── Remove WordPress emoji scripts (performance) ──────────────
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

// ── Allow SVG uploads (reliability) ──────────────
function rom_allow_svg( $mimes ) {
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter( 'upload_mimes', 'rom_allow_svg' );

// ── Add circuit grid pattern to hero ──────────────────────────
function rom_hero_pattern() {
    if ( ! is_front_page() ) return;
    ?>
    <div class="rom-circuit-overlay" aria-hidden="true"></div>
    <?php
}
add_action( 'wp_body_open', 'rom_hero_pattern' );