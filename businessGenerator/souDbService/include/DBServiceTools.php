<?php

class DBServiceTools
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
}