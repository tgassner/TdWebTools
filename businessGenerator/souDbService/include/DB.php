<?php

class DBTool
{
    public function openConnection()
    {
        $DB_LOGIN = json_decode(file_get_contents("DB.json", true));

        $dbhost = $DB_LOGIN->dbhost;
        $dbuser = $DB_LOGIN->dbuser;
        $dbpass = $DB_LOGIN->dbpass;
        $dbname = $DB_LOGIN->dbname;

        $dbh = new PDO(
            "sqlsrv:Server=$dbhost;Database=$dbname",
            $dbuser,
            $dbpass,
            array(//PDO::ATTR_PERSISTENT => true, // Verbindung bleibt bis scriptende gecached !
                //PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

        return $dbh;
    }

    public function runQueryList(string $sql, callable $rowHandler, array $params = [])
    {
        $ret["ok"] = false;
        $ret["value"] = [];
        $ret["msg"] = "";
        $ret["rowCount"] = 0;
        try {
            $conn = $this->OpenConnection();
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $ret["value"][] = $rowHandler($row);
            }
            $ret["rowCount"] = $stmt->rowCount();
            $ret["ok"] = true;
            $conn = null;
            return $ret;
        } catch (PDOException $e) {
            $conn = null;
            $ret["msg"] = $e->getMessage();
            $ret["errCode"] = $e->getCode();
            return $ret;
        }
    }

    public function runQueryOneResult(string $sql, callable $rowHandler, array $params = [])
    {
        $ret["ok"] = false;
        $ret["value"] = null;
        $ret["msg"] = "";
        $ret["rowCount"] = 0;
        try {
            $conn = $this->OpenConnection();
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                $ret["value"] = $rowHandler($row);
                $ret["ok"] = true;
            } else {
                $ret["msg"] = "No result from DB";
            }
            $ret["rowCount"] = $stmt->rowCount();
            $conn = null;
            return $ret;
        } catch (PDOException $e) {
            $conn = null;
            $ret["errCode"] = $e->getCode();
            $ret["msg"] = $e->getMessage();
            return $ret;
        }
    }
}