<?php

function generate_random_email()
{
    // 5 lower case @ 10 lower case . 3 lower case
    $email = substr(str_shuffle('abcdefghijklmnopqrstuvwxyz'), 1, 5)
        . '@'
        . substr(str_shuffle('abcdefghijklmnopqrstuvwxyz'), 1, 10)
        . '.'
        . substr(str_shuffle('abcdefghijklmnopqrstuvwxyz'), 1, 3);

    return $email;
}

function generate_random_name()
{
    // 1 upper case + 8 lower case
    $name = substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 1, 1) .
        substr(str_shuffle('abcdefghijklmnopqrstuvwxyz'), 1, 8);
    return $name;
}

function generate_random_password()
{
    $password = substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@&%$*#'), 1, 12);
    return $password;
}

function getCsrfToken($ch)
{
    curl_setopt($ch, CURLOPT_URL, "http://localhost:3000/api/auth/csrf");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPGET, true); 
    curl_setopt($ch, CURLOPT_COOKIEJAR, "cookies");
    //curl_setopt($ch, CURLOPT_VERBOSE, 1);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo "Errore nella richiesta cURL: " . curl_error($ch);
        curl_close($ch);
        exit;
    }

    $data = json_decode($response, true);

    $csrfToken = null;

    if (isset($data['csrfToken'])) {
        $csrfToken = $data['csrfToken'];
    }

    return $csrfToken;
}