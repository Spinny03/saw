<?php

function register($email, $password, $first_name, $last_name, $baseurl)
{
    $ch = curl_init();

    $cookieFile = "cookies";
    if (!file_exists($cookieFile)) {
        $fh = fopen($cookieFile, "w");
        fwrite($fh, "");
        fclose($fh);
    }

    // Prepara il payload JSON
    $data = json_encode([
        'email' => $email,
        'name' => $first_name,
        'surname' => $last_name,
        'password' => $password,
    ]);

    curl_setopt($ch, CURLOPT_URL, $baseurl . "/api/user");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data); // Passa il JSON

    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json', // Specifica il tipo di contenuto JSON
        'Content-Length: ' . strlen($data), // Imposta la lunghezza del contenuto
    ]);

    curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
    curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);

    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 0);

    $result = curl_exec($ch);
    $user_id = json_decode($result, true)['id'];

    // Mostra la risposta per debug (facoltativo)
    // echo $result;

    if (curl_errno($ch)) {
        echo 'Error:' . curl_error($ch);
    } else {
        echo "Response: " . $result . "<br/>";
    }
    
    curl_close($ch);
    return $user_id;
}
?>
