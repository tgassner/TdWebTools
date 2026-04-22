<?php
header('Content-Type: application/json; charset=utf-8');

include_once("include/DBServiceTools.php");
include_once("include/DB.php");
include_once("AbstractBusinessObjectRemoteService.php");

class GpartnerRemoteService extends AbstractBusinessObjectRemoteService
{

    public function findAllGpartner()
    {

        $sql = "select Nr, Suchname From Gpartner where Suchname is not null and TRIM(Suchname) <> '' ";

        return $this->dbTool->runQueryList($sql, function ($row) {
            $gpartner = [];
            $gpartner["Nr"] = $row["Nr"];
            $gpartner["Suchname"] = $row["Suchname"];
            return $gpartner;
        }, []);

    }
}

$dbServiceTools = new DBServiceTools();
$gpartnerRemoteService = new GpartnerRemoteService();

$action = $dbServiceTools->readFromRequestGetPost("action", "");

switch ($action) {
    case "findAllGpartner" :
        $json = $gpartnerRemoteService->convertJson($gpartnerRemoteService->findAllGpartner());
        //sleep(3); // TODO remove (throttling for testing purpose)
        echo($json);
        break;
    default:
        break;
}


