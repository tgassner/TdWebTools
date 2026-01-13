<?php

use businessGenerator\include\VariaTools;
use businessGenerator\souDbService\AbstractBusinessObjectRemoteService;

header('Content-Type: application/json; charset=utf-8');

include_once "include/DB.php";
include_once "include/VariaTools.php";
require_once "AbstractBusinessObjectRemoteService.php";

class OrderRemoteService extends AbstractBusinessObjectRemoteService
{

    public function generateNewOrderNumber()
    {
        return $this->generateNewBusinessObjectNumber("K", "AUFTRAG");
    }

    public function getOpenOrderByEmployeeJsonResponse()
    {
        $sql =
            " select                                                                                                                                                              \n" .
            " a.Nr, a.Gpartner_Nr, a.BestellNr, a.BestellDatum, Versandart, a.Liefertermin, a.Versandtermin, a.Nettobetrag, a.Bruttobetrag, a.LiefBedText,                        \n" .
            " aa.Firma1 as Firma1_aa,  aa.Firma2 as Firma2_aa,  aa.Firma3 as Firma3_aa,  aa.Strasse as Strasse_aa,  aa.LKZ as LKZ_aa,                                             \n" .
            " aa.PLZ as PLZ_aa,  aa.Ort as Ort_aa,  aa.Anschrift as Anschrift_aa,  aa.ApartnerName as ApartnerName_aa,  aa.Email as Email_aa,  aa.Telefon as Telefon_aa,          \n" .
            " ala.Firma1 as Firma1_ala, ala.Firma2 as Firma2_ala, ala.Firma3 as Firma3_ala, ala.Strasse as Strasse_ala, ala.LKZ as LKZ_ala,                                       \n" .
            " ala.PLZ as PLZ_ala, ala.Ort as Ort_ala, ala.Anschrift as Anschrift_ala, ala.ApartnerName as ApartnerName_ala, ala.Email as Email_ala, ala.Telefon as Telefon_ala,   \n" .
            " ara.Firma1 as Firma1_ara, ara.Firma2 as Firma2_ara, ara.Firma3 as Firma3_ara, ara.Strasse as Strasse_ara, ara.LKZ as LKZ_ara,                                       \n" .
            " ara.PLZ as PLZ_ara, ara.Ort as Ort_ara, ara.Anschrift as Anschrift_ara, ara.ApartnerName as ApartnerName_ara, ara.Email as Email_ara, ara.Telefon as Telefon_ara,   \n" .
            " ap.PosNr, ap.Baustein, ap.ArtikelNr, ap.Bezeichnung, ap.Menge, ap.Einheit, ap.Preis, ap.PreisEinheit, ap.Gesamtpreis, ap.Langtext, ap.LangtextHtml                  \n" .
            " from Auftrag a                                                                                                                                                      \n" .
            " left join AuftragAdr aa on a.AuftragAdr_ID = aa.ID                                                                                                                  \n" .
            " left join AuftragAdr ala on a.AuftragLiefAdr_ID = ala.ID                                                                                                            \n" .
            " left join AuftragAdr ara on a.AuftragRechAdr_ID = ara.ID                                                                                                            \n" .
            " left join AuftragPos ap on a.ID = ap.Auftrag_ID                                                                                                                     \n" .
            " where 1 = 1                                                                                                                                                         \n" .
            " and MitarbeiterNr = :MitarbeiterNr                                                                                                                                  \n" .
            " and AbschlFertigung = 0                                                                                                                                             \n" .
            " order by a.Liefertermin, a.Versandtermin, a.Nr, ap.PosNr                                                                                                            \n";

        $mitarbeiterId = $this->variaTools->readFromRequestGetPost("MitarbeiterNr", "");

        $ret = $this->dbTool->runQueryList($sql, function ($row) {
            $order = [];
            $order["Nr"] = $row["Nr"];
            $order["Gpartner_Nr"] = $row["Gpartner_Nr"];
            $order["BestellNr"] = $row["BestellNr"];
            $order["BestellDatum"] = $row["BestellDatum"];
            $order["Versandart"] = $row["Versandart"];
            $order["Liefertermin"] = $row["Liefertermin"];
            $order["Versandtermin"] = $row["Versandtermin"];
            $order["Nettobetrag"] = $row["Nettobetrag"];
            $order["Bruttobetrag"] = $row["Bruttobetrag"];
            $order["LiefBedText"] = $row["LiefBedText"];
            $order["Firma1_aa"] = $row["Firma1_aa"];
            $order["Firma2_aa"] = $row["Firma2_aa"];
            $order["Firma3_aa"] = $row["Firma3_aa"];
            $order["Strasse_aa"] = $row["Strasse_aa"];
            $order["LKZ_aa"] = $row["LKZ_aa"];
            $order["PLZ_aa"] = $row["PLZ_aa"];
            $order["Ort_aa"] = $row["Ort_aa"];
            $order["Anschrift_aa"] = $row["Anschrift_aa"];
            $order["ApartnerName_aa"] = $row["ApartnerName_aa"];
            $order["Email_aa"] = $row["Email_aa"];
            $order["Telefon_aa"] = $row["Telefon_aa"];
            $order["Firma1_ala"] = $row["Firma1_ala"];
            $order["Firma2_ala"] = $row["Firma2_ala"];
            $order["Firma3_ala"] = $row["Firma3_ala"];
            $order["Strasse_ala"] = $row["Strasse_ala"];
            $order["LKZ_ala"] = $row["LKZ_ala"];
            $order["PLZ_ala"] = $row["PLZ_ala"];
            $order["Ort_ala"] = $row["Ort_ala"];
            $order["Anschrift_ala"] = $row["Anschrift_ala"];
            $order["ApartnerName_ala"] = $row["ApartnerName_ala"];
            $order["Email_ala"] = $row["Email_ala"];
            $order["Telefon_ala"] = $row["Telefon_ala"];
            $order["Firma1_ara"] = $row["Firma1_ara"];
            $order["Firma2_ara"] = $row["Firma2_ara"];
            $order["Firma3_ara"] = $row["Firma3_ara"];
            $order["Strasse_ara"] = $row["Strasse_ara"];
            $order["LKZ_ara"] = $row["LKZ_ara"];
            $order["PLZ_ara"] = $row["PLZ_ara"];
            $order["Ort_ara"] = $row["Ort_ara"];
            $order["Anschrift_ara"] = $row["Anschrift_ara"];
            $order["ApartnerName_ara"] = $row["ApartnerName_ara"];
            $order["Email_ara"] = $row["Email_ara"];
            $order["Telefon_ara"] = $row["Telefon_ara"];
            $order["PosNr"] = $row["PosNr"];
            $order["Baustein"] = $row["Baustein"];
            $order["ArtikelNr"] = $row["ArtikelNr"];
            $order["Bezeichnung"] = $row["Bezeichnung"];
            $order["Menge"] = $row["Menge"];
            $order["Einheit"] = $row["Einheit"];
            $order["Preis"] = $row["Preis"];
            $order["PreisEinheit"] = $row["PreisEinheit"];
            $order["Gesamtpreis"] = $row["Gesamtpreis"];
            $order["Langtext"] = $row["Langtext"];
            $order["LangtextHtml"] = $row["LangtextHtml"];
            return $order;
        }, array('MitarbeiterNr' => $mitarbeiterId));

        $ordersUnfiltered = $ret["value"];

        $ordersFiltered = [];
        $lastOrderNr = "";
        $currentOrder = null;

        foreach ($ordersUnfiltered as $orderUnfiltered) {
            if ($lastOrderNr != $orderUnfiltered["Nr"]) {

                if ($currentOrder != null) { // not in the beginning
                    $ordersFiltered[] = $currentOrder;
                }

                $lastOrderNr = $orderUnfiltered["Nr"];

                $currentOrder = [];

                $currentOrder["Nr"] = $orderUnfiltered["Nr"];
                $currentOrder["Gpartner_Nr"] = $orderUnfiltered["Gpartner_Nr"];
                $currentOrder["BestellNr"] = $orderUnfiltered["BestellNr"];
                $currentOrder["BestellDatum"] = $orderUnfiltered["BestellDatum"];
                $currentOrder["Versandart"] = $orderUnfiltered["Versandart"];
                $currentOrder["Liefertermin"] = $orderUnfiltered["Liefertermin"];
                $currentOrder["Versandtermin"] = $orderUnfiltered["Versandtermin"];
                $currentOrder["Nettobetrag"] = $orderUnfiltered["Nettobetrag"];
                $currentOrder["Bruttobetrag"] = $orderUnfiltered["Bruttobetrag"];
                $currentOrder["LiefBedText"] = $orderUnfiltered["LiefBedText"];
                $currentOrder["Firma1_aa"] = $orderUnfiltered["Firma1_aa"];
                $currentOrder["Firma2_aa"] = $orderUnfiltered["Firma2_aa"];
                $currentOrder["Firma3_aa"] = $orderUnfiltered["Firma3_aa"];
                $currentOrder["Strasse_aa"] = $orderUnfiltered["Strasse_aa"];
                $currentOrder["LKZ_aa"] = $orderUnfiltered["LKZ_aa"];
                $currentOrder["PLZ_aa"] = $orderUnfiltered["PLZ_aa"];
                $currentOrder["Ort_aa"] = $orderUnfiltered["Ort_aa"];
                $currentOrder["Anschrift_aa"] = $orderUnfiltered["Anschrift_aa"];
                $currentOrder["ApartnerName_aa"] = $orderUnfiltered["ApartnerName_aa"];
                $currentOrder["Email_aa"] = $orderUnfiltered["Email_aa"];
                $currentOrder["Telefon_aa"] = $orderUnfiltered["Telefon_aa"];
                $currentOrder["Firma1_ala"] = $orderUnfiltered["Firma1_ala"];
                $currentOrder["Firma2_ala"] = $orderUnfiltered["Firma2_ala"];
                $currentOrder["Firma3_ala"] = $orderUnfiltered["Firma3_ala"];
                $currentOrder["Strasse_ala"] = $orderUnfiltered["Strasse_ala"];
                $currentOrder["LKZ_ala"] = $orderUnfiltered["LKZ_ala"];
                $currentOrder["PLZ_ala"] = $orderUnfiltered["PLZ_ala"];
                $currentOrder["Ort_ala"] = $orderUnfiltered["Ort_ala"];
                $currentOrder["Anschrift_ala"] = $orderUnfiltered["Anschrift_ala"];
                $currentOrder["ApartnerName_ala"] = $orderUnfiltered["ApartnerName_ala"];
                $currentOrder["Email_ala"] = $orderUnfiltered["Email_ala"];
                $currentOrder["Telefon_ala"] = $orderUnfiltered["Telefon_ala"];
                $currentOrder["Firma1_ara"] = $orderUnfiltered["Firma1_ara"];
                $currentOrder["Firma2_ara"] = $orderUnfiltered["Firma2_ara"];
                $currentOrder["Firma3_ara"] = $orderUnfiltered["Firma3_ara"];
                $currentOrder["Strasse_ara"] = $orderUnfiltered["Strasse_ara"];
                $currentOrder["LKZ_ara"] = $orderUnfiltered["LKZ_ara"];
                $currentOrder["PLZ_ara"] = $orderUnfiltered["PLZ_ara"];
                $currentOrder["Ort_ara"] = $orderUnfiltered["Ort_ara"];
                $currentOrder["Anschrift_ara"] = $orderUnfiltered["Anschrift_ara"];
                $currentOrder["ApartnerName_ara"] = $orderUnfiltered["ApartnerName_ara"];
                $currentOrder["Email_ara"] = $orderUnfiltered["Email_ara"];
                $currentOrder["Telefon_ara"] = $orderUnfiltered["Telefon_ara"];

                $currentOrder["pos"] = [];
            }
            $pos = [];
            $pos["PosNr"] = $orderUnfiltered["PosNr"];
            $pos["Baustein"] = $orderUnfiltered["Baustein"];
            $pos["ArtikelNr"] = $orderUnfiltered["ArtikelNr"];
            $pos["Bezeichnung"] = $orderUnfiltered["Bezeichnung"];
            $pos["Menge"] = $orderUnfiltered["Menge"];
            $pos["Einheit"] = $orderUnfiltered["Einheit"];
            $pos["Preis"] = $orderUnfiltered["Preis"];
            $pos["PreisEinheit"] = $orderUnfiltered["PreisEinheit"];
            $pos["Gesamtpreis"] = $orderUnfiltered["Gesamtpreis"];
            $pos["Langtext"] = $orderUnfiltered["Langtext"];
            $pos["LangtextHtml"] = $orderUnfiltered["LangtextHtml"];

            $currentOrder["pos"][] = $pos;
        }
        if ($currentOrder != null) { // the last one (if there is any)
            $ordersFiltered[] = $currentOrder;
        }

        $ret["value"] = $ordersFiltered;

        return $ret;
    }
}

$variaTools = new VariaTools();
$orderRemoteService = new OrderRemoteService($variaTools);

$action = $variaTools->readFromRequestGetPost("action", "");

switch ($action) {
    case "getOpenOrderByEmployee" :
        $json = $orderRemoteService->convertJson($orderRemoteService->getOpenOrderByEmployeeJsonResponse());
        echo $json;
        break;
    case "generateNewOrderNumber" :
        $json = $orderRemoteService->convertJson($orderRemoteService->generateNewOrderNumber());
        //sleep(3); // TODO remove (throttling for testing purpose)
        echo $json;
        break;
    default:
        break;
}