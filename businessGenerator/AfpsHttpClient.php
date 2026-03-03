<?php

$action = $_GET["action"] ?? 'ERROR';
$json = json_decode(file_get_contents('php://input'), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    doErrorAndDie("Json from Webclient is illegal!");
}

$afpsConfig = json_decode(file_get_contents("AfpsHttpClientConfig.json"), true);
if (json_last_error() !== JSON_ERROR_NONE
    || !isset($afpsConfig)
    || !isset($afpsConfig['username'])
    || !isset($afpsConfig['userpassword'])
    || !isset($afpsConfig['AfpsHttpEndpoint'])) {

    doErrorAndDie("AfpsHttpClientConfig.json is missing or illegal!");
}

switch ($action) {
    case "createAngebot":
        doCreateAngebot($json, $afpsConfig);
    default:
        doErrorAndDie("not set or illegal action= " . $action);
}

function doCreateAngebot(array $json, array $afpsConfig) {

    $xml = createXML($json, "Angebot", "createAngebot", $afpsConfig);

    $tempZip = createTmpZipFile($xml);

    list($response, $httpCode) = doSyncWsCall($tempZip, $afpsConfig);

    $ret["ok"] = false;
    $ret["value"] = -1;
    $ret["msg"] = "";

    if ($httpCode === 200 && !empty($response)) {
        // Response-ZIP temporär speichern, um es zu entpacken
        $respZipPath = __DIR__ . '/resp_temp.zip';
        file_put_contents($respZipPath, $response);

        $resZip = new ZipArchive();
        if ($resZip->open($respZipPath) === TRUE) {
            // SOU schickt die Antwort immer in einer Datei namens "soap-response" (oder ähnlich) im ZIP
            // Wir suchen einfach die erste Datei im Archiv
            $responseXMLString = $resZip->getFromIndex(0);
            $resZip->close();
            unlink($respZipPath);

            $responseXML = simplexml_load_string($responseXMLString);

            if (isset($responseXML->{'response-error'})) {
                $errorName = "";
                $errorDescription = "";
                if (isset($responseXML->{'response-error'}['name'])) {
                    $errorName = $responseXML->{'response-error'}['name'];
                }
                if (isset($responseXML->{'response-error'}['description'])) {
                    $errorDescription = $responseXML->{'response-error'}['description'];
                }

                $ret["msg"] = $errorName . " " . $errorDescription;
            }

            if (isset($responseXML->{'response-data-object'})) {
                $ret["ok"] = true;
                if (isset($responseXML->{'response-data-object'}->attribute)) {
                    $attributes = [];
                    foreach ($responseXML->{'response-data-object'}->attribute as $item) {
                        $key = (string)$item['name'];
                        $attributes[$key] = [
                            'type'  => (string)$item['type'],
                            'value' => (string)$item['value']
                        ];
                    }
                    $ret["attributes"] = $attributes;
                }
            }
        } else {
            $ret["msg"] = "Antwort kein gültiges ZIP im Response von AFPS - Sou.Matrixx";
        }
    } else {
        $ret["msg"] = "HTTP Fehler $httpCode";
    }

    echo(json_encode($ret, JSON_UNESCAPED_UNICODE));
}

function doSyncWsCall(string $tempZip, $afpsConfig): array
{
    // Per cURL an SOU schicken
    $ch = curl_init($afpsConfig['AfpsHttpEndpoint']);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents($tempZip));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/zip']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    unlink($tempZip);
    return array($response, $httpCode);
}

function createTmpZipFile(string $xml): string|false
{
    $tempZip = tempnam(sys_get_temp_dir(), 'sou');

    if (!$tempZip) {
        doErrorAndDie("Tmp Zip-File not created");
    }

    $zip = new ZipArchive();
    $zip->open($tempZip, ZipArchive::OVERWRITE);

// Falls ein Bild mitkommt (Base64 vom Signature Pad)
//if (isset($input['image'])) {
//    $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['image']));
//    $zip->addFromString('unterschrift.png', $imageData);
//}

    $zip->addFromString('requestXML', $xml);

    $zip->close();
    return $tempZip;
}

function createXML(array $json, string $functionname, string $methodname, array $afpsConfig): string {
    $xml = new SimpleXMLElement('<soap-request/>');
    // <request ... > Request Metadata
    $request = $xml->addChild('request');
    $request->addAttribute('functionname', $functionname);
    $request->addAttribute('methodname', $methodname);
    $request->addAttribute('username', $afpsConfig['username']);
    $request->addAttribute('userpassword', $afpsConfig['userpassword']);

    //<request-parameter>
    $param = $xml->addChild('request-parameter');
    createXmlBusinessObject($param, $json);
    return $xml->asXML();
}

function createXmlBusinessObject(SimpleXMLElement $param, array $json): void {
    $obj = $param->addChild('object');
    $obj->addAttribute('name', 'Angebot');

    $fields = [];

    addHardCodedInteger("AngebotArt", $fields);
    addHardCodedString("AngebotTyp", $fields);
    addCleanString("Lieferzeit", $fields, $json);
    addCleanString("IhreZeichen", $fields, $json);
    addCleanString("MitarbeiterNr", $fields, $json);
    addCleanString("ErstelltVon", $fields, $json);
    addHardCodedString("SachkontoNr", $fields, "4022");
    addHardCodedString("MwStNr", $fields, "20");
    addCleanString("LiefBedText", $fields, $json);
    addCleanString("Versandart", $fields, $json);
    addCleanString("Versandvermerk", $fields, $json);
    addCleanString("ZahlBedText", $fields, $json);
    //addCleanInteger("ZahlTage", $fields, $json);

    foreach ($fields as $name => $info) {
        $attr = $obj->addChild('attribute');
        $attr->addAttribute('name', $name);
        $attr->addAttribute('type', $info['type']);
        $attr->addAttribute('value', $info['value']);
    }
}

function addCleanString(string $arraySchluessel, array &$fields, array $json, bool $omitIfnotSet = true, string $defaultValue = ''): void
{
    $value = $defaultValue;
    if (isset($json[$arraySchluessel])) {
        $value = strip_tags($json[$arraySchluessel]);
    } else if ($omitIfnotSet) {
        return;
    }
    $fields[$arraySchluessel] =  ['type' => "string", 'value' => $value];
}

function addHardCodedString(string $arraySchluessel, array &$fields, string $value = ''): void {
    $fields[$arraySchluessel] =  ['type' => "string", 'value' => $value];
}

function addCleanInteger(string $arraySchluessel, array &$fields, array $json, bool $omitIfnotSet = true, int $defaultValue = 0): void {
    $value = $defaultValue;
    if (isset($json[$arraySchluessel])) {
        $strVal = $json[$arraySchluessel];
        if (is_int($strVal)) {
            $value = intval($strVal);
        }
    } else if ($omitIfnotSet) {
        return;
    }
    $fields[$arraySchluessel] =  ['type' => "integer", 'value' => $value];
}

function addHardCodedInteger(string $arraySchluessel, array &$fields, int $value = 0): void {
    $fields[$arraySchluessel] =  ['type' => "integer", 'value' => $value];
}

function doErrorAndDie(string $message): void
{
    $ret = [];
    $ret["ok"] = false;
    $ret["value"] = -1;
    $ret["msg"] = $message;
    echo(json_encode($ret, JSON_UNESCAPED_UNICODE));
    die;
}