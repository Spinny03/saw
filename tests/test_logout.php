<?php
function logout($baseurl)
{
    $cookieFile = "cookies";

    $curl_handler = curl_init();

    $csrfToken = getCsrfToken($curl_handler);

    if(!isset($csrfToken)) {
        echo "CSRF token non trovato\n";
        die();
    }

    $postFields = http_build_query([
        'csrfToken' => $csrfToken,
    ]);

    curl_setopt($curl_handler, CURLOPT_URL, $baseurl."/api/auth/signout");
    curl_setopt($curl_handler, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl_handler, CURLOPT_POST, true);
    curl_setopt($curl_handler, CURLOPT_POSTFIELDS, $postFields);
    curl_setopt($curl_handler, CURLOPT_HTTPHEADER, [
        'Cookie:next-auth.csrf-token='.$csrfToken,
    ]);
    curl_setopt($curl_handler, CURLOPT_VERBOSE, true);
    curl_setopt($curl_handler, CURLOPT_COOKIEFILE, "");
    curl_setopt($curl_handler, CURLOPT_COOKIEJAR, $cookieFile);
    curl_setopt($curl_handler, CURLOPT_FOLLOWLOCATION, 0);

    $result = curl_exec($curl_handler);
    $httpCode = curl_getinfo($curl_handler, CURLINFO_HTTP_CODE);
    //echo $result;

    if (curl_errno($curl_handler)) {
        echo 'Error:' . curl_error($curl_handler);
    }
    echo "Response: " . $httpCode . "<br/>";
    curl_close($curl_handler);
}
?>