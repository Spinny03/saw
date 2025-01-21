<?php
function show_logged_user($baseurl, $user_id) {
    $cookieFile = "cookies";

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $baseurl . "/api/user/".$user_id);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
    ]);

    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 0);

    curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
    curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);

    //curl_setopt($ch, CURLOPT_VERBOSE, 1);

    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);


    if (curl_errno($ch)) {
        echo 'Error:' . curl_error($ch);
    }

    return $result;
}

function check_correct_user($email, $first_name, $last_name, $user_id, $user_data_json) {
    $user = json_decode($user_data_json, true);

    if (!isset($user['email'], $user['name'], $user['surname'], $user['id'])) {
        return false;
    }

    if (
        $user['email'] === $email &&
        $user['name'] === $first_name &&
        $user['surname'] === $last_name &&
        $user['id'] === $user_id
    ) {
        return true;
    }

    return false;
}
?>
