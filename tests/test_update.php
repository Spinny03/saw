<?php

function update($user_id, $email, $first_name, $last_name, $baseurl)
{
    $cookieFile = "cookies";
    $ch = curl_init();

    // Costruisci l'endpoint
    $url = $baseurl . "/api/user/" . $user_id;
    echo "URL: " . $url . "<br/>";

    // Imposta l'URL e l'opzione per restituire il risultato come stringa
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Specifica che la richiesta è di tipo PUT
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");

    // Prepara il body della richiesta in formato JSON
    $data = json_encode([
        'email' => $email,
        'name' => $first_name,
        'surname' => $last_name
    ]);

    // Imposta i dati da inviare come body della richiesta
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

    // Imposta le intestazioni
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($data),
    ]);

    // Gestione dei cookie
    curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
    curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);

    // Esegui la richiesta
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    echo $httpCode;
    // Gestione errori cURL
    if (curl_errno($ch)) {
        echo 'Errore cURL: ' . curl_error($ch);
    } else {
        echo "Response: " . $result . "<br/>";
    }

    // Chiude la sessione cURL
    curl_close($ch);

    return $result;
}
?>
