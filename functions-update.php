<?php
/**
 * ADD THESE TO YOUR EXISTING functions.php
 * Don't replace the whole file — just add these functions
 */

// ── Enqueue app page CSS ───────────────────────────────────────
// Add this INSIDE rom_enqueue_assets() after the existing rom-tech.css enqueue:

/*
    wp_enqueue_style(
        'rom-app-page-style',
        get_stylesheet_directory_uri() . '/assets/css/app-page.css',
        array( 'rom-technology-style' ),
        wp_get_theme()->get( 'Version' )
    );
*/

// ── Register blank page template ──────────────────────────────
// Add this as a NEW function:

function rom_register_blank_template( $templates ) {
    $templates['templates/blank.html'] = __( 'Blank (No Header/Footer)', 'rom-technology' );
    return $templates;
}
add_filter( 'theme_page_templates', 'rom_register_blank_template' );

// ── Add app page body class ────────────────────────────────────
// Add this to your existing rom_body_classes() function:

/*
    // Inside rom_body_classes():
    if ( is_page( array( 'berkshire-tennis', 'heads-up-sport', 'headsup-sport' ) ) ) {
        $classes[] = 'rom-app-page';
    }
*/

// ── Suppress ROM header/footer on app pages via PHP ───────────
function rom_suppress_header_on_app_pages() {
    $app_slugs = array( 'berkshire-tennis', 'heads-up-sport', 'headsup-sport' );
    if ( is_page( $app_slugs ) ) {
        // Remove circuit overlay on app pages (app has its own background)
        remove_action( 'wp_body_open', 'rom_hero_pattern' );
    }
}
add_action( 'wp', 'rom_suppress_header_on_app_pages' );