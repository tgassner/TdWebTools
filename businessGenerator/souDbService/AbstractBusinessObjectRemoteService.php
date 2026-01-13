<?php

namespace businessGenerator\souDbService;

use businessGenerator\include\VariaTools;
use businessGenerator\souDbService\include\DBTool;

abstract class AbstractBusinessObjectRemoteService
{

    protected DBTool $dbTool;
    protected VariaTools $variaTools;

    public function __construct($variaTools = null, $dbTool = null)
    {
        if ($variaTools == null) {
            $this->variaTools = new VariaTools();
        } else {
            $this->variaTools = $variaTools;
        }

        if ($dbTool == null) {
            $this->dbTool = new DBTool();
        } else {
            $this->dbTool = $dbTool;
        }
    }

    protected function getYearYY()
    {
        return date("y");
    }

    protected function generateNewBusinessObjectNumber($prefix, $keyName)
    {
        $sql = " update BKey              \n" .
            " set lfdNr = lfdNr + 1    \n" .
            " output inserted.lfdNr    \n" .
            " where 1 = 1              \n" .
            " and KeyName = :KeyName   \n" .
            " and Org_Nr = :OrgNr      \n" .
            " and BereichID = :Bereich \n" .
            " and Maske = :Maske       \n";

        $maske = $prefix . $this->getYearYY() . "0000";

        $ret = $this->dbTool->runQueryOneResult($sql, function ($row) use ($prefix) {
            $nr = $row["lfdNr"];
            return $prefix . $this->getYearYY() . str_pad($nr, 4, '0', STR_PAD_LEFT);
        }, array("KeyName" => $keyName,
            "OrgNr" => "_alle_",
            "Bereich" => 0,
            "Maske" => $maske));

        if ($ret["rowCount"] == 0 && !array_key_exists("errCode", $ret)) {
            $ret["msg"] = $ret["msg"] . "  Vielleicht wurde in diesem Kalenderjahr noch kein solchen BusinessObject via Sou.Matrixx erstellt?";
        }

        return $ret;
    }

    public function convertJson($input)
    {
        return json_encode($input, JSON_UNESCAPED_UNICODE);
    }
}

?>