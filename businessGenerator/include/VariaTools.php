<?php

class VariaTools
{
    public function readFromRequestGetPost($parName, $defaultValue = "")
    {
        if (isset($_POST[$parName]) && $_POST[$parName] != "") {
            $retval = $_POST[$parName];
        } else if (isset($_GET[$parName]) && $_GET[$parName] != "") {
            $retval = $_GET[$parName];
        } else {
            $retval = $defaultValue;
        }
        return $retval;
    }

    public function getEnvironment() {
        $environment = json_decode(file_get_contents("Environment.json"));
        return $environment;
    }

    public function doRemoteServiceCall($service)
    {

        header('Content-Type: application/json; charset=utf-8');

        $remoteServiceConfig = json_decode(file_get_contents("RemoteServiceInfo.json"));
        $serviceEntpoint = $remoteServiceConfig->services->$service;

        $action = (new VariaTools())->readFromRequestGetPost("action", "");
        $serviceEntpoint .= "?action={$action}";

        foreach ($_GET as $getParam => $value) {
            if ($getParam != "action") {
                $serviceEntpoint .= "&{$getParam}={$value}";
            }
        }

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
                $ret["msg"] = $message . "  \n" . $severity . "  \n" . $file . "  \n" . $line;
                echo(json_encode($ret, JSON_UNESCAPED_UNICODE));
                die();
            }
        );

        $offerNumberJson = file_get_contents($serviceEntpoint, false, $context);

        restore_error_handler();

        echo($offerNumberJson);
    }
}