<?php
/*
Plugin Name: Content Quality Checker
Description: Detects large images and lorem ipsum placeholder text
Version: 1.1
Author: Your Name
Update URI: https://your-update-server.com/content-checker/update.json
*/

// Add update checker
add_filter('pre_set_site_transient_update_plugins', 'check_for_plugin_update');

function check_for_plugin_update($transient) {
    if (empty($transient->checked)) {
        return $transient;
    }

    // Get plugin info
    $plugin_slug = basename(dirname(__FILE__));
    $plugin_file = basename(__FILE__);
    $plugin_path = $plugin_slug . '/' . $plugin_file;

    // Get the remote version
    $remote_version = '1.1'; // This would come from your server
    $current_version = $transient->checked[$plugin_path];

    if (version_compare($current_version, $remote_version, '<')) {
        $obj = new stdClass();
        $obj->slug = $plugin_slug;
        $obj->new_version = $remote_version;
        $obj->url = 'https://your-update-server.com/content-checker/';
        $obj->package = 'https://your-update-server.com/content-checker/content-checker.zip';
        $transient->response[$plugin_path] = $obj;
    }

    return $transient;
}

public function scan_for_large_images($post_content) {
    $large_images = array();
    
    // Scan for regular image tags
    preg_match_all('/<img[^>]+>/i', $post_content, $img_tags);
    foreach ($img_tags[0] as $img_tag) {
        preg_match('/src=[\'"]([^\'"]+)[\'"]/i', $img_tag, $src);
        if (!empty($src[1])) {
            // Get the absolute path of the image
            $parsed_url = parse_url($src[1]);
            $file_path = ABSPATH . ltrim($parsed_url['path'], '/');
            
            // Check if file exists and get its size
            if (file_exists($file_path)) {
                $size = filesize($file_path);
                if ($size > 1048576) { // 1MB in bytes
                    $large_images[] = array(
                        'src' => $src[1],
                        'size' => size_format($size, 2)
                    );
                }
            }
            
            // Also check in uploads directory
            $upload_dir = wp_upload_dir();
            $upload_path = str_replace(
                array($upload_dir['baseurl'], site_url()),
                array($upload_dir['basedir'], ABSPATH),
                $src[1]
            );
            
            if (file_exists($upload_path)) {
                $size = filesize($upload_path);
                if ($size > 1048576 && !in_array($src[1], array_column($large_images, 'src'))) {
                    $large_images[] = array(
                        'src' => $src[1],
                        'size' => size_format($size, 2)
                    );
                }
            }
        }
    }
    
    // Also scan for background images in inline styles
    preg_match_all('/background-image:\s*url\([\'"]?([^\'")\s]+)[\'"]?\)/i', $post_content, $bg_images);
    if (!empty($bg_images[1])) {
        foreach ($bg_images[1] as $bg_url) {
            $upload_dir = wp_upload_dir();
            $file_path = str_replace(
                array($upload_dir['baseurl'], site_url()),
                array($upload_dir['basedir'], ABSPATH),
                $bg_url
            );
            
            if (file_exists($file_path)) {
                $size = filesize($file_path);
                if ($size > 1048576) {
                    $large_images[] = array(
                        'src' => $bg_url,
                        'size' => size_format($size, 2)
                    );
                }
            }
        }
    }
    
    return $large_images;
}

