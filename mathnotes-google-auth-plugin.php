<?php
/**
 * Plugin Name: Mathnotes Google OAuth Gateway
 * Description: Enables 1-Tap Google OAuth Sign-In for Mathnotes Mobile Apps (Student & Teacher) into Tutor LMS.
 * Version: 1.0.0
 * Author: Mathnotes Team
 * Author URI: https://mathnotes.courses
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('tutor/v1', '/auth/google', [
        'methods' => 'POST',
        'callback' => 'mathnotes_handle_google_oauth',
        'permission_callback' => '__return_true',
    ]);
});

function mathnotes_handle_google_oauth(WP_REST_Request $request) {
    $params = $request->get_json_params();
    $id_token = sanitize_text_field($params['id_token'] ?? '');
    $role = sanitize_text_field($params['role'] ?? 'student');
    $email = sanitize_email($params['email'] ?? '');
    $name = sanitize_text_field($params['name'] ?? '');
    $photo_url = esc_url_raw($params['photo_url'] ?? '');

    if (empty($id_token) && empty($email)) {
        return new WP_Error('missing_params', 'Google ID token or email is required.', ['status' => 400]);
    }

    // Optional: Validate token with Google API if id_token provided
    if (!empty($id_token)) {
        $verify_url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($id_token);
        $verify_resp = wp_remote_get($verify_url, ['timeout' => 8]);
        if (!is_wp_error($verify_resp) && wp_remote_retrieve_response_code($verify_resp) === 200) {
            $google_data = json_decode(wp_remote_retrieve_body($verify_resp), true);
            if (!empty($google_data['email'])) {
                $email = sanitize_email($google_data['email']);
                $name = !empty($google_data['name']) ? sanitize_text_field($google_data['name']) : $name;
            }
        }
    }

    // 1. Check if user already exists
    $user = get_user_by('email', $email);
    if (!$user) {
        // Auto-provision new user
        $username = sanitize_user(current(explode('@', $email)), true);
        if (username_exists($username)) {
            $username .= '_' . wp_rand(100, 999);
        }
        $random_password = wp_generate_password(24, true);

        $user_id = wp_create_user($username, $random_password, $email);
        if (is_wp_error($user_id)) {
            return new WP_Error('user_creation_failed', $user_id->get_error_message(), ['status' => 500]);
        }

        // Set Display Name
        wp_update_user([
            'ID' => $user_id,
            'display_name' => $name,
            'first_name' => $name,
        ]);

        $user = get_user_by('id', $user_id);

        // Assign Tutor LMS Role
        if ($role === 'instructor') {
            $user->set_role('tutor_instructor');
            update_user_meta($user_id, '_is_tutor_instructor', 'yes');
        } else {
            $user->set_role('subscriber');
        }
    }

    // Generate Application Authentication Token
    $auth_token = wp_generate_password(32, false);
    update_user_meta($user->ID, 'mathnotes_app_token', $auth_token);

    return rest_ensure_response([
        'status' => 'success',
        'token' => $auth_token,
        'user_id' => $user->ID,
        'email' => $user->user_email,
        'name' => $user->display_name,
        'roles' => (array) $user->roles,
    ]);
}
