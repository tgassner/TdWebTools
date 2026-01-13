<?php

use businessGenerator\include\VariaTools;
use businessGenerator\souDbService\AbstractBusinessObjectRemoteService;

header('Content-Type: application/json; charset=utf-8');

include_once "include/DB.php";
include_once "include/VariaTools.php";
require_once "AbstractBusinessObjectRemoteService.php";

class OfferRemoteService extends AbstractBusinessObjectRemoteService
{

    public function generateNewOfferNumber()
    {
        return $this->generateNewBusinessObjectNumber("A", "ANGEBOT");
    }
}

$variaTools = new VariaTools();
$action = $variaTools->readFromRequestGetPost("action", "");
$offerRemoteService = new OfferRemoteService();

switch ($action) {
    case "generateNewOfferNumber" :
        $json = $offerRemoteService->convertJson($offerRemoteService->generateNewOfferNumber());
        //sleep(3); // TODO remove (throttling for testing purpose)
        echo $json;
        break;
    default:
        break;
}
?>