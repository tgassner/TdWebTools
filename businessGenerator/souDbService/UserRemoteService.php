<?php

header('Content-Type: application/json; charset=utf-8');

include_once("include/DBServiceTools.php");
include_once("include/DB.php");
include_once("AbstractBusinessObjectRemoteService.php");

class UserRemoteService extends AbstractBusinessObjectRemoteService
{

    public function getActiveUsers()
    {
        $sql = "select Nr, Vorname, Name \n" .
            " from Personal           \n" .
            " where ausgeschieden = 0 \n" .
            " order by Name, Vorname  \n";

        return $this->dbTool->runQueryList($sql, function ($row) {
            $user = [];
            $user["Nr"] = $row["Nr"];
            $user["Vorname"] = $row["Vorname"];
            $user["Name"] = $row["Name"];
            return $user;
        }, []);
    }
}

$dbServiceTools = new DBServiceTools();
$action = $dbServiceTools->readFromRequestGetPost("action", "");
$userRemoteService = new UserRemoteService();

switch ($action) {
    case "getActiveUsers" :
        $json = $userRemoteService->convertJson($userRemoteService->getActiveUsers());
        //sleep(3); // TODO remove (throttling for testing purpose)
        echo $json;
        break;
    default:
        break;
}
?>