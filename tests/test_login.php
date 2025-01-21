<?php

function login($email, $password, $baseurl)
{
    $cookieFile = "cookies"; // Dove verranno salvati i cookie

    $curl_handler = curl_init();
    $csrfToken = getCsrfToken($curl_handler);

    if(!isset($csrfToken)) {
        echo "CSRF token non trovato\n";
        die();
    }

    $data = [
        'email' => $email,
        'password' => $password,
        'csrfToken' => $csrfToken
    ];
    curl_setopt($curl_handler, CURLOPT_URL, $baseurl."/api/auth/callback/credentials");
    curl_setopt($curl_handler, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl_handler, CURLOPT_POST, true);
    curl_setopt($curl_handler, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($curl_handler, CURLOPT_COOKIEFILE, $cookieFile);
    curl_setopt($curl_handler, CURLOPT_COOKIEJAR, $cookieFile);
    curl_setopt($curl_handler, CURLOPT_HTTPHEADER, [
        'Content-Type: application/x-www-form-urlencoded',
    ]);
    //curl_setopt($curl_handler, CURLOPT_VERBOSE, 1);

    $response = curl_exec($curl_handler);
    # $cookieId = curl_getinfo($curl_handler, CURLINFO_COOKIELIST);
    $httpCode = curl_getinfo($curl_handler, CURLINFO_HTTP_CODE);
    $redirectUrl = curl_getinfo($curl_handler, CURLINFO_REDIRECT_URL);
    curl_close($curl_handler);

    if(curl_errno($curl_handler)) {
        echo "Errore nella richiesta cURL: " . curl_error($curl_handler);
        die();
    }

    if(strpos($redirectUrl, $baseurl."/api/auth/error")  !== false) {
        echo "Errore durante il login\n";
        die();
    }
    echo"[-] Login effettuato: ".$httpCode." <br />";
}
