<?php
require_once "include/constants.php";

$action = $_GET["action"] ?? 'ERROR';

$fileGetContents = file_get_contents('php://input');
$json = "";
if (!empty($fileGetContents)) {
    $json = json_decode($fileGetContents, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        doErrorAndDie("Json from Webclient is illegal!");
    }
}

$afpsConfig = json_decode(file_get_contents("AfpsHttpClientConfig.json"), true);
if (json_last_error() !== JSON_ERROR_NONE
    || !isset($afpsConfig)
    || !isset($afpsConfig['username'])
    || !isset($afpsConfig['userpassword'])
    || !isset($afpsConfig['AfpsHttpEndpoint'])
    || !isset($afpsConfig['instance'])) {

    doErrorAndDie("AfpsHttpClientConfig.json is missing or illegal!");
}

switch ($action) {
    case "createAngebot":
        doCreateAngebot($json, $afpsConfig);
        break;
    case "createAuftrag":
        doCreateAuftrag($json, $afpsConfig);
        break;
    case "instanceInfo":
        doReturnInstanceInfo($afpsConfig);
        break;
    default:
        doErrorAndDie("not set or illegal action= " . $action);
}

function doReturnInstanceInfo(array $afpsConfig) {
    $ret["ok"] = false;
    $ret["msg"] = "";
    $ret["value"] = [];
    $ret["value"]['instance'] = $afpsConfig['instance'];
    header("Content-type: application/json; charset=utf-8");
    echo(json_encode($ret, JSON_UNESCAPED_UNICODE));
}

function doCreateAngebot(array $json, array $afpsConfig) :void {
    doCreateBusinessObject($json, $afpsConfig, "Angebot", "Angebot", "createAngebot");
}

function doCreateAuftrag(array $json, array $afpsConfig) :void {
    doCreateBusinessObject($json, $afpsConfig, "Auftrag", "Auftrag", "createAuftrag");
}

function doCreateBusinessObject(array $json, array $afpsConfig, string $businessObjectType, string $functionName, string $methodname): void {
    $xml = createXML($json, $functionName, $methodname, $afpsConfig, $businessObjectType);
    $tempZip = createTmpZipFile($xml);

    handleWsCall($tempZip, $afpsConfig, $xml);
}

function handleWsCall(string $tempZip, array $afpsConfig, string $xml): void {
    $responseXMLString = doSyncWsCall($tempZip, $afpsConfig);

    $ret["ok"] = false;
    $ret["value"] = -1;
    $ret["msg"] = "";

    // Ersetzt den Wert von userpassword="..." durch "******"
    $patterns = [
        '/username="[^"]+"/',
        '/password="[^"]+"/'
    ];
    $loggerXml = preg_replace($patterns, 'password="************"', $xml);
    $ret["xmlToErp"] = $loggerXml;

    $responseXML = extractXmlStructureFromString($responseXMLString);
    $ret["xmlFromErp"] = $responseXML;

    $hasResponseErrorTag = false;
    if (isset($responseXML->{'response-error'})) {
        $hasResponseErrorTag = true;
        $errorName = "";
        $errorDescription = "";
        if (isset($responseXML->{'response-error'}['name'])) {
            $errorName = $responseXML->{'response-error'}['name'];
        }
        if (isset($responseXML->{'response-error'}['description'])) {
            $errorDescription = $responseXML->{'response-error'}['description'];
        }

        $ret["msg"] = $errorName . " " . $errorDescription;

        $lines = preg_split('/\r?\n/', $errorDescription, -1, PREG_SPLIT_NO_EMPTY);

        $ret["pureMsg"] = "";
        foreach ($lines as $line) {
            $line = trim($line); // Leerzeichen am Anfang/Ende entfernen

            // 2. Prüfen, ob die Zeile mit "Details: " beginnt
            if (str_starts_with($line, "Details: ")) {

                // 3. Den Anfang abschneiden (9 Zeichen)
                $cleanLine = substr($line, 9);

                $ret["pureMsg"] = $cleanLine . "\n";
            }
        }
        $ret["pureMsg"] = trim($ret["pureMsg"]);
    }

    if (isset($responseXML->{'response-data-object'})) {
        if (!$hasResponseErrorTag) {
            $ret["ok"] = true;
        }
        if (isset($responseXML->{'response-data-object'}->attribute)) {
            $attributes = [];
            foreach ($responseXML->{'response-data-object'}->attribute as $item) {
                $key = (string)$item['name'];
                $attributes[$key] = [
                    'type' => (string)$item['type'],
                    'value' => (string)$item['value']
                ];
            }
            $ret["value"] = [];
            $ret["value"]["attributes"] = $attributes;
        }
    }
    header("Content-type: application/json; charset=utf-8");
    echo(json_encode($ret, JSON_UNESCAPED_UNICODE));
}

function extractXmlStructureFromString(string $responseXMLString): SimpleXMLElement {
    $responseXML = simplexml_load_string($responseXMLString);
    if ($responseXML === false) {
        $errors = libxml_get_errors();
        $errorDetails = [];

        foreach ($errors as $error) {
            $errorDetails[] = sprintf(
                "Fehler in Zeile %d: %s",
                $error->line,
                trim($error->message)
            );
        }

        libxml_clear_errors();

        doErrorAndDie("XML-Parsing fehlgeschlagen:\n" . implode("\n", $errorDetails) . "\n\n" . $responseXMLString);
    }
    return $responseXML;
}

function doSyncWsCall(string $tempZip, $afpsConfig): string
{
    $ch = curl_init($afpsConfig['AfpsHttpEndpoint']);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents($tempZip));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/zip']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $responseZipData = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    unlink($tempZip);

    if ($httpCode !== 200 || empty($responseZipData)) {
        if ($httpCode === 0) {
            doErrorAndDie("Middleware AfpsHttpClient meldet:\nVerbindungsproblem\nKeine Verbindung zum Sou.Matrixx Server möglich.\n" . $afpsConfig['AfpsHttpEndpoint']);
        } else {
            doErrorAndDie("Middleware AfpsHttpClient meldet:\nVerbindungsproblem\nFehler bei der Verbindung zum Sou.Matrixx Server.\nStatus: " . $httpCode . " - " . STATUS_TEXTS[$httpCode]);
        }
    }

    return extractResponseZipFile($responseZipData);
}

function extractResponseZipFile(bool|string $responseZipData): string|false
{
// Response-ZIP temporär speichern, um es zu entpacken
    $respZipPath = __DIR__ . '/resp_temp.zip';
    file_put_contents($respZipPath, $responseZipData);

    $resZip = new ZipArchive();
    $openResult = $resZip->open($respZipPath);
    $responseXMLString = "";
    if ($openResult === TRUE) {
        $responseXMLString = $resZip->getFromIndex(0);
        $resZip->close();
        unlink($respZipPath);
    } else {
        doErrorAndDie("Fehler beim Öffnen des SouMatrixx Response ZIP-Files: " . getZipErrorMessage($openResult) . "  (Code= " . $openResult . " )");
    }
    return $responseXMLString;
}

function getZipErrorMessage($errno) {
    $zipErrors = [
        ZipArchive::ER_EXISTS => 'Datei existiert bereits.',
        ZipArchive::ER_INCONS => 'Inkonsistentes Archiv.',
        ZipArchive::ER_INVAL  => 'Ungültiges Argument.',
        ZipArchive::ER_MEMORY => 'Speicherfehler.',
        ZipArchive::ER_NOENT  => 'Datei nicht gefunden.',
        ZipArchive::ER_NOZIP  => 'Kein gültiges ZIP-Archiv.',
        ZipArchive::ER_OPEN   => 'Datei konnte nicht geöffnet werden.',
        ZipArchive::ER_READ   => 'Lesefehler.',
        ZipArchive::ER_SEEK   => 'Positionsfehler (Seek).'
    ];
    return $zipErrors[$errno] ?? 'Unbekannter Fehler';
}

function createTmpZipFile(string $xml): string
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

function createXML(array $json, string $functionname, string $methodname, array $afpsConfig, string $businessObjectType): string {
    $xml = new SimpleXMLElement('<soap-request/>');
    // <request ... > Request Metadata
    $request = $xml->addChild('request');
    $request->addAttribute('functionname', $functionname);
    $request->addAttribute('methodname', $methodname);
    $request->addAttribute('username', $afpsConfig['username']);
    $request->addAttribute('userpassword', $afpsConfig['userpassword']);

    //<request-parameter>
    $param = $xml->addChild('request-parameter');
    createXmlBusinessObject($param, $json, $businessObjectType);
    return $xml->asXML();
}

function createXmlBusinessObject(SimpleXMLElement $param, array $json, string $businessObjectType): void {
    $objRootXml = $param->addChild('object');

    $fields = [];

    switch (strtolower($businessObjectType)) {
        case "angebot":
            $objRootXml->addAttribute('name', 'Angebot');
            addHardCodedInteger("AngebotArt", $fields);
            addHardCodedString("AngebotTyp", $fields);
            break;
        case "auftrag":
            $objRootXml->addAttribute('name', 'Auftrag');
            addHardCodedString("AuftragTyp", $fields, "AB");

            break;
        default:
    }

    addCleanString("GpartnerNr", $fields, $json, false, "20");
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
    addCleanInteger("ZahlTage", $fields, $json);

    convertMapToXml($fields, $objRootXml);

    addAddresses($json, $objRootXml);
    addAllPos($json, $objRootXml);
}

function addAddresses(array $json, SimpleXMLElement $objRootXml): void {
    getSingleAddress("adresse", $json, $objRootXml);
    getSingleAddress("lieferadresse", $json, $objRootXml);
    getSingleAddress("rechnadresse", $json, $objRootXml);
}

function getSingleAddress(string $addressType, array $json, SimpleXMLElement $objRootXml): void {
    if (isset($json[$addressType])) {
        $addressJson = $json[$addressType];

        $posAddressObjectXml = $objRootXml->addChild('object');
        $posAddressObjectXml->addAttribute('name', $addressType);

        $addressFields = [];
        addCleanString("ApartnerName", $addressFields, $addressJson);
        addCleanString("Email", $addressFields, $addressJson);
        addCleanString("Firma1", $addressFields, $addressJson);
        addCleanString("Firma2", $addressFields, $addressJson);
        addCleanString("Lkz", $addressFields, $addressJson);
        addCleanString("Ort", $addressFields, $addressJson);
        addCleanString("Plz", $addressFields, $addressJson);
        addCleanString("Strasse", $addressFields, $addressJson);
        addCleanString("Telefon", $addressFields, $addressJson);
        convertMapToXml($addressFields, $posAddressObjectXml);
    }
}

function addAllPos(array $json, SimpleXMLElement $objRootXml): void {
    if (isset($json["pos"]) && !empty($json["pos"])) {
        $posListObjectXml = $objRootXml->addChild('object');
        $posListObjectXml->addAttribute('name', "angebotposlist");

        addSinglePos($json["pos"], $posListObjectXml);
    }
}

function addSinglePos($pos, SimpleXMLElement $posListObjectXml): void
{
    foreach ($pos as $posJson) {
        $posObjectXml = $posListObjectXml->addChild('object');
        $posObjectXml->addAttribute('name', "angebotpos");

        $posFields = [];
        addCleanInteger("PosNr", $posFields, $posJson);
        addCleanString("Baustein", $posFields, $posJson);
        addCleanString("ArtikelNr", $posFields, $posJson);
        addCleanString("Bezeichnung", $posFields, $posJson);
        addCleanDecimal("Menge", $posFields, $posJson);
        addCleanString("Einheit", $posFields, $posJson);
        addCleanDecimal("Preis", $posFields, $posJson);
        addCleanDecimal("Rabatt", $posFields, $posJson);
        addCleanDecimal("Gesamtpreis", $posFields, $posJson);
        addCleanString("LangtextHtml", $posFields, $posJson);
        addCleanString("MwStNr", $posFields, $posJson, false, "20");
        addCleanDecimal("MwStSatz", $posFields, $posJson, false, "20");
        addCleanString("SachkontoNr", $posFields, $posJson, false, "4022");

        convertMapToXml($posFields, $posObjectXml);

        adPosFreeField($posObjectXml, $posJson["FreieFelder"]);
    }
}

function adPosFreeField(SimpleXMLElement $posObjectXml, $freieFelder): void
{
    $freieFelderlistObjectXml = $posObjectXml->addChild('object');
    $freieFelderlistObjectXml->addAttribute('name', "freiefelderlist");

    foreach ($freieFelder as $freiesFeld) {
        $freiesFeldObjectXml = $freieFelderlistObjectXml->addChild('object');
        $freiesFeldObjectXml->addAttribute('name', "freiesfeld");
        $freiesFeldAttrName = $freiesFeldObjectXml->addChild('attribute');
        $freiesFeldAttrName->addAttribute('name', 'name');
        $freiesFeldAttrName->addAttribute('type', 'string');
        $freiesFeldAttrValue = $freiesFeldObjectXml->addChild('attribute');
        $freiesFeldAttrValue->addAttribute('name', 'wert');
        switch ($freiesFeld["Name"]) {
            case "PosLaenge":
                $freiesFeldAttrName->addAttribute('value', 'PosLaenge');
                $freiesFeldAttrValue->addAttribute('type', 'decimal');
                break;
            case "PosBreite":
                $freiesFeldAttrName->addAttribute('value', 'PosBreite');
                $freiesFeldAttrValue->addAttribute('type', 'decimal');
                break;
            case "PosAnzahl":
                $freiesFeldAttrName->addAttribute('value', 'PosAnzahl');
                $freiesFeldAttrValue->addAttribute('type', 'string');
                break;
            case "PosLaengeEinheit":
                $freiesFeldAttrName->addAttribute('value', 'PosLaengeEinheit');
                $freiesFeldAttrValue->addAttribute('type', 'string');
                break;
            case "PosBreiteEinheit":
                $freiesFeldAttrName->addAttribute('value', 'PosBreiteEinheit');
                $freiesFeldAttrValue->addAttribute('type', 'string');
                break;
            default:

        }
        $freiesFeldAttrValue->addAttribute('value', $freiesFeld["Wert"]);
    }
}

function convertMapToXml(array $fields, SimpleXMLElement $obj): void
{
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
        if (filter_var($strVal, FILTER_VALIDATE_INT) !== false) {
            $value = intval($strVal);
        }
    } else if ($omitIfnotSet) {
        return;
    }
    $fields[$arraySchluessel] =  ['type' => "integer", 'value' => $value];
}

function addCleanDecimal(string $arraySchluessel, array &$fields, array $json, bool $omitIfnotSet = true, int $defaultValue = 0): void {
    $value = $defaultValue;
    if (isset($json[$arraySchluessel])) {
        $strVal = $json[$arraySchluessel];
        if (is_numeric($strVal)) {
            $value = floatval($strVal);
        }
    } else if ($omitIfnotSet) {
        return;
    }
    $fields[$arraySchluessel] =  ['type' => "decimal", 'value' => $value];
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
    header("Content-type: application/json; charset=utf-8");
    echo(json_encode($ret, JSON_UNESCAPED_UNICODE));
    die;
}