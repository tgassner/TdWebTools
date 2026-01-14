<?php

include_once ("include/VariaTools.php");

header('Content-Type: application/json; charset=utf-8');

$remoteServiceConfig = json_decode(file_get_contents("RemoteServiceInfo.json"));
$serviceEntpoint = $remoteServiceConfig->services->ArtikelRemoteService;

$action =  (new VariaTools())->readFromRequestGetPost("action", "");
$serviceEntpoint .= "?action={$action}";

$opts = [
    "http" => [
        "method" => "GET",
        "header" => "Accept-language: de-AT, de;q=0.9, en;q=0.7, *;q=0.2\r\n" .
            "Content-Type: application/json\r\n" .
            "User-Agent: Business Generator\r\n"
    ]
];

$context = stream_context_create($opts);

set_error_handler(
    function ($severity, $message, $file, $line) {
        $ret = [];
        $ret["ok"] = false;
        $ret["value"] = -1;
        $ret["msg"] = $message . "  \n" .  $severity . "  \n" . $file . "  \n" . $line;
        echo(json_encode($ret, JSON_UNESCAPED_UNICODE));
        die();
    }
);

$auftragsNummerInfoJson = file_get_contents($serviceEntpoint, false, $context);

restore_error_handler();

echo($auftragsNummerInfoJson);
