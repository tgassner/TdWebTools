<?php
  header('Cache-Control: no-cache, no-store');
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <script type="text/javascript" src="js/businessGenerator.js"></script>
    <link rel="stylesheet" href="css/businessGenerator.css">
    <meta charset="UTF-8">
    <meta http-equiv="cache-control" content="max-age=0" />
    <meta http-equiv="cache-control" content="no-cache" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="icon" href="img/favicon114.png" sizes="32x32" />
    <link rel="icon" href="img/favicon114.png" sizes="192x192" />
    <link rel="apple-touch-icon" href="img/favicon114.png" />
    <meta name="msapplication-TileImage" content="img/favicon114.png" />

    <script src="js/autoComplete.min.js"></script>
    <link rel="stylesheet" href="css/autoComplete.min.css">

    <title>TD Business Generator</title>

</head>
<body style="margin: 0px; ">

<div style="display: flex; flex-flow: row; background-color: #ffdc14; background: linear-gradient(135deg, rgba(255,205,0,1) 0%, rgba(255,220,20,1) 35%, rgba(255,205,0,1) 100%);padding-left: 20px; justify-content: space-between;height:100px">
    <div style="display: flex; flex-flow: column;">
        <h1 style="display: flex;margin-top: 5px;margin-bottom: 2px;font-family: Khand, Helvetia, Arial, sans-serif; font-size: 34px; font-weight: 600; color:#000000;">TD Business Generator</h1>
        <div id="headerLowerDiv" style="display: flex; margin-top: 0px;margin-bottom: 15px;">
            Version 0.9.11&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;12.01.2026
            <span id="statusSpan" style="margin-left: 10px"> </span>
            <span id="statusSpanEnvironment" style="margin-left: 10px"> </span>
        </div>
    </div>
    <img src="img/td_header.png" height="150px" style="; display: flex; justify-content: right; align-self: center;filter: drop-shadow(8px 8px 40px #FFB214);">
</div>

<div style="" class="formAtAllDiv">

    <!-- Businessnummer -->
    <div style="" class="fullFormElementDiv">
        <div style="" class="labelFormElementDiv">
            <label for="BusinessNummer">Business Nummer:</label>
        </div>
        <div style="" class="inputFormElementDiv">
            <div class="inputElement">
                <img id="animationWaitStribeBusinessNummer" style="display: none" src="img/animationWaitStribe.png" alt="Waiting Animation">
                <input type="text" id="BusinessNummer" name="BusinessNummer" disabled="disabled"/>
                <input style="display: none; margin-left: 10px" type="text" id="BusinessType" name="BusinessType" disabled="disabled"/>
            </div>
        </div>
    </div>

    <!-- MitarbeiterNr -->
    <div style="" class="fullFormElementDiv">
        <div style="" class="labelFormElementDiv">
            <label for="MitarbeiterNr">Mitarbeiter:</label>
        </div>
        <div style="" class="inputFormElementDiv">
            <select id="MitarbeiterNr" name="MitarbeiterNr" class="inputElement">
                <option value=""></option>
                <option value="LST">Ludwig</option>
                <option value="RRI">Richard</option>
                <option value="SSC">Silvia</option>
                <option value="MMU">Martina</option>
                <option value="WPU">Wolfgang</option>
            </select>
        </div>
    </div>

    <!-- Versandart -->
    <div style="" class="fullFormElementDiv">
        <div style="" class="labelFormElementDiv">
            <label for="Versandart">Versandart:</label>
        </div>
        <div style="" class="inputFormElementDiv">
            <select id="Versandart" name="Versandart" class="inputElement">
                <option value=""></option>
                <option value="AA">Abholung Aviso</option>
                <option value="Post">Post</option>
                <option value="o">Bis datto undefiniert ob Abholung oder Versand</option>
                <option value="AB">Zahlung bei Abholung</option>
                <option value="u">Unfrei</option>
                <option value="Zust">Zustellung</option>
                <option value="Sped">Spedition</option>
                <option value="BO">Botendienst</option>
                <option value="uu">Unfrei Unverzollt</option>
                <option value="M">Montage</option>
            </select>
        </div>
    </div>

    <!-- Versandart -->
    <div style="" class="fullFormElementDiv">
        <div style="" class="labelFormElementDiv">
            <label for="ZahlBedText">Zahlungs Bed:</label>
        </div>
        <div style="" class="inputFormElementDiv">
            <select id="ZahlBedText" name="ZahlBedText" class="inputElement">
                <option value="0"></option>
                <option value="30">14 Tage 2%, 30 Tage netto</option>
                <option value="0">Vorauskasse</option>
                <option value="0">zahlbar bei Abholung</option>
                <option value="30">14 Tage 3%, 30 Tage netto</option>
                <option value="0">bei Erstbestellung: zahlbar bei Abholung oder Vorauskassa</option>
                <option value="0">zahlbar bei Abholung oder Vorauskassa</option>
                <option value="10">10 Tage netto</option>
                <option value="0">bei Erstbestellung: zahlbar bei Abholung, Vorauskassa oder Nachnahme</option>
                <option value="0">zahlbar bei Abholung, Vorauskassa oder Nachnahme</option>
                <option value="60">30 Tage 3%, 60 Tage netto</option>
                <option value="30">10 Tage 3%, 30 Tage netto</option>
                <option value="30">10 Tage 2%, 30 Tage netto</option>
                <option value="60">30 Tage 5%, 60 Tage netto</option>
                <option value="60">14 Tage 3%, 60 Tage netto</option>
                <option value="30">21 Tage 3%, 30 Tage netto</option>
                <option value="90">30 Tage 3%, 90 Tage netto</option>
                <option value="0">sofort nach Rechnungserhalt ohne Abzug</option>
                <option value="60">60 Tage netto</option>
                <option value="0">bei Erstbestellung: Vorauskassa oder Nachnahme</option>
                <option value="0">bei Erstbestellung: zahlbar bei Abholung, Vorauskassa oder Nachnahme (NN-Gebühr 20,-- + 20% MWST.)</option>
                <option value="30">21 Tage 2% Skonto, 30 Tage netto</option>
                <option value="0">zahlbar bei Abholung, Vorauskassa oder Nachnahme (NN-Gebühr 20,-- + 20% MWST.)</option>
                <option value="0">Vorauskassa oder Nachnahme</option>
                <option value="0">bei Erstbestellung: zahlbar bei Abholung</option>
                <option value="0">Zahlung per Nachnahme</option>
                <option value="60">14 Tage 2%, 60 Tage netto</option>
                <option value="30">30 Tage netto</option>
                <option value="0">bei Erstbestellung: Vorauskassa</option>
                <option value="7">7 Tage netto</option>
                <option value="30">19 Tage 3%, 30 Tage netto</option>
                <option value="30">7 Tage 5%, 14 Tage 3%, 30 Tage netto</option>
                <option value="45">14 Tage 2%, 45 Tage netto</option>
                <option value="0">nach Vereinbarung</option>
                <option value="0">prepayment</option>
                <option value="0">zahlbar bei Zustellung</option>
                <option value="90">30 Tage 3%, 45 Tage 2%, 90 Tage netto</option>
                <option value="30">7 Tage 3%, 30 Tage netto</option>
            </select>
        </div>
    </div>

    <!-- IhreZeichen -->
    <div id="ihreZeichenFormElementDiv" style="" class="fullFormElementDiv">
        <div style="" class="labelFormElementDiv">
            <label for="IhreZeichen">IhreZeichen:</label>
        </div>
        <div style="" class="inputFormElementDiv">
            <input type="text" id="IhreZeichen" name="IhreZeichen" class="inputElement" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
        </div>
    </div>

    <!-- Lieferzeit -->
    <div id="lieferZeitFormElementDiv" style="" class="fullFormElementDiv">
        <div style="" class="labelFormElementDiv">
            <label for="Lieferzeit">Lieferzeit:</label>
        </div>
        <div style="" class="inputFormElementDiv">
            <input type="text" id="Lieferzeit" name="Lieferzeit" class="inputElement" list="lieferzeitVorschlaege"  autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
            <datalist id="lieferzeitVorschlaege">
                <option>1-2 Werktage</option>
                <option>3-4 Werktage</option>
                <option>1 Woche</option>
                <option>1-2 Wochen</option>
                <option>2 Wochen</option>
                <option>2-3 Wochen</option>
                <option>3 Wochen</option>
            </datalist>
        </div>
    </div>

    <!-- Liefertermin -->
    <div id="lieferTerminFormElementDiv" style="" class="fullFormElementDiv">
        <div style="" class="labelFormElementDiv">
            <label for="Liefertermin">Liefertermin:</label>
        </div>
        <div style="" class="inputFormElementDiv">
            <input type="date" id="Liefertermin" name="Liefertermin" class="inputElement" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
        </div>
    </div>

    <!-- Versandvermerk -->
    <div style="" class="fullFormElementDiv">
        <div style="" class="labelFormElementDiv">
            <label for="Versandvermerk">Versandvermerk:</label>
        </div>
        <div style="" class="inputFormElementDiv">
            <input type="text" id="Versandvermerk" name="Versandvermerk" class="inputElement" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
        </div>
    </div>

    <!-- LiefBedText -->
    <div style="" class="fullFormElementDiv">
        <div style="" class="labelFormElementDiv">
            <label for="LiefBedText">Liefer Bedingung:</label>
        </div>
        <div style="" class="inputFormElementDiv">
            <select id="LiefBedText" name="LiefBedText" class="inputElement">
                <option value=""></option>
                <option value="ab Werk, unverpackt">ab Werk, unverpackt</option>
                <option value="Versand unfrei">Versand unfrei</option>
                <option value="Frei Haus">Frei Haus</option>
                <option value="Zustellung unfrei">Zustellung unfrei</option>
                <option value="Versand unfrei - Spedition">Versand unfrei - Spedition</option>
                <option value="Versand unfrei, unverzollt">Versand unfrei, unverzollt</option>
                <option value="ab Werk">ab Werk</option>
                <option value="ab Werk, verpackt">ab Werk, verpackt</option>
            </select>
        </div>
    </div>

    <!-- GpartnerNr -->
    <div style="" class="fullFormElementDiv">
        <div style="" class="labelFormElementDiv">
            <label for="GpartnerNr">Gesch. Partner Nr:</label>
        </div>
        <div style="" class="inputFormElementDiv">
            <input type="number" id="GpartnerNr" name="GpartnerNr" value="20" class="inputElement" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
        </div>
    </div>

    <!-- BEGIN Adress Reiter Container -->
    <div style="" class="adressContainerDivClass">
        <div style="" class="reiterButtonContainerDiv">
            <div id="reiterAdresse" style="" class="reiterElementDiv reiterSelectedElementDiv" onclick="onClickAdresseReiter()">
                Adresse
            </div>
            <div id="reiterLieferanschrift" style="" class="reiterElementDiv" onclick="onClickLieferanschriftReiter()">
                Lieferanschrift
            </div>
            <div id="reiterRechnungsanschrift" style="" class="reiterElementDiv" onclick="onClickRechnungsanschriftReiter()">
                Rechnungsanschrift
            </div>
        </div>
        <!-- BEGIN Adresse Reiter -->
        <div id="reiterContentAdresse" style="" class="adressReiterDiv">

            <!-- Firma1 -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="adresseFirma1">Firma:</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="text" id="adresseFirma1" name="adresseFirma1" class="inputElement" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
                </div>
            </div>

            <!-- Firma2 -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="adresseFirma2">-</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="text" id="adresseFirma2" name="adresseFirma2" class="inputElement" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
                </div>
            </div>

            <!-- Ansprech Partner Name -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="adresseApartnerName">Anspr.partner:</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="text" id="adresseApartnerName" name="adresseApartnerName" class="inputElement" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
                </div>
            </div>

            <!-- Strasse -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="adresseStrasse">Strasse:</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="text" id="adresseStrasse" name="adresseStrasse" class="inputElement" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
                </div>
            </div>

            <!-- Lkz-Plz-Ort -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="adresseLkz">LKZ-PLZ-Ort:</label>
                </div>
                <div class="lkzPlzOrtDivClass">
                    <div style="" class="LkzAllAddressElementDiv">
                        <select id="adresseLkz" name="adresseLkz" class="inputElement">
                            <option value=""></option>
                            <option value="AT">Österreich</option>
                            <option value="DE">Deutschland</option>
                            <option value="CH">Schweiz</option>
                            <option value="IT">Italien</option>
                            <option value="SI">Slowenien</option>
                            <option value="NL">Holland</option>
                            <option value="LU">Luxenburg</option>
                            <option value="HU">Ungarn</option>
                            <option value="SK">Slowakei</option>
                            <option value="ES">Spanien</option>
                            <option value="FR">Frankreich</option>
                            <option value="CZ">Tschechien</option>
                            <option value="LI">Liechtenstein</option>
                            <option value="PL">Polen</option>
                            <option value="HR">Kroatien</option>
                            <option value="RO">Rumänien</option>
                            <option value="GB">Großbritannien</option>
                        </select>
                    </div>
                    <div style="" class="PlzAllAddressElementDiv">
                        <input type="text" id="adressePlz" name="adressePlz" class="inputElement" placeholder="PLZ" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
                    </div>
                    <div style="" class="inputFormElementDiv">
                        <input type="text" id="adresseOrt" name="adresseOrt" class="inputElement" placeholder="Ort" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
                    </div>
                </div>
            </div>

            <!-- Tel -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="adresseTel">Tel:</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="tel" id="adresseTel" name="adresseTel" class="inputElement"/>
                </div>
            </div>

            <!-- email -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="adresseemail">E-Mail:</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="email" id="adresseemail" name="adresseemail" class="inputElement"/>
                </div>
            </div>
        </div> <!-- END Adresse Reiter -->

        <!-- BEGIN Lieferanschrift -->
        <div id="reiterContentLieferanschrift" style="display: none" class="adressReiterDiv">

            <!-- Firma1 -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="lieferanschriftFirma1">Firma:</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="text" id="lieferanschriftFirma1" name="lieferanschriftFirma1" class="inputElement" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
                </div>
            </div>

            <!-- Firma2 -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="lieferanschriftFirma2">-</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="text" id="lieferanschriftFirma2" name="lieferanschriftFirma2" class="inputElement" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
                </div>
            </div>

            <!-- Ansprech Partner Name -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="lieferanschriftApartnerName">Anspr.partner:</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="text" id="lieferanschriftApartnerName" name="lieferanschriftApartnerName" class="inputElement" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
                </div>
            </div>

            <!-- Strasse -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="lieferanschriftStrasse">Strasse:</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="text" id="lieferanschriftStrasse" name="lieferanschriftStrasse" class="inputElement" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
                </div>
            </div>

            <!-- Lkz-Plz-Ort -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="lieferanschriftLkz">LKZ-PLZ-Ort:</label>
                </div>
                <div class="lkzPlzOrtDivClass">
                    <div style="" class="LkzAllAddressElementDiv">
                        <select id="lieferanschriftLkz" name="lieferanschriftLkz" class="inputElement">
                            <option value=""></option>
                            <option value="AT">Österreich</option>
                            <option value="DE">Deutschland</option>
                            <option value="CH">Schweiz</option>
                            <option value="IT">Italien</option>
                            <option value="SI">Slowenien</option>
                            <option value="NL">Holland</option>
                            <option value="LU">Luxenburg</option>
                            <option value="HU">Ungarn</option>
                            <option value="SK">Slowakei</option>
                            <option value="ES">Spanien</option>
                            <option value="FR">Frankreich</option>
                            <option value="CZ">Tschechien</option>
                            <option value="LI">Liechtenstein</option>
                            <option value="PL">Polen</option>
                            <option value="HR">Kroatien</option>
                            <option value="RO">Rumänien</option>
                            <option value="GB">Großbritannien</option>
                        </select>
                    </div>
                    <div style="" class="PlzAllAddressElementDiv">
                        <input type="text" id="lieferanschriftPlz" name="lieferanschriftPlz" class="inputElement" placeholder="PLZ" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
                    </div>
                    <div style="" class="inputFormElementDiv">
                        <input type="text" id="lieferanschriftOrt" name="lieferanschriftOrt" class="inputElement" placeholder="Ort" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
                    </div>
                </div>
            </div>

            <!-- Tel -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="lieferanschriftTel">Tel:</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="tel" id="lieferanschriftTel" name="lieferanschriftTel" class="inputElement"/>
                </div>
            </div>

            <!-- email -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="lieferanschriftemail">E-Mail:</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="email" id="lieferanschriftemail" name="lieferanschriftemail" class="inputElement"/>
                </div>
            </div>
        </div>
        <!-- END Lieferanschrift -->

        <!-- BEGIN Rechnungsanschrift -->
        <div id="reiterContentRechnungsanschrift" style="display: none" class="adressReiterDiv">

            <!-- Firma1 -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="rechnungsanschriftFirma1">Firma:</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="text" id="rechnungsanschriftFirma1" name="rechnungsanschriftFirma1" class="inputElement"/>
                </div>
            </div>

            <!-- Firma2 -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="rechnungsanschriftFirma2">-</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="text" id="rechnungsanschriftFirma2" name="rechnungsanschriftFirma2" class="inputElement"/>
                </div>
            </div>

            <!-- Ansprech Partner Name -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="rechnungsanschriftApartnerName">Anspr.partner:</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="text" id="rechnungsanschriftApartnerName" name="rechnungsanschriftApartnerName" class="inputElement"/>
                </div>
            </div>

            <!-- Strasse -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="rechnungsanschriftStrasse">Strasse:</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="text" id="rechnungsanschriftStrasse" name="rechnungsanschriftStrasse" class="inputElement"/>
                </div>
            </div>

            <!-- Lkz-Plz-Ort -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="rechnungsanschriftLkz">LKZ-PLZ-Ort:</label>
                </div>
                <div class="lkzPlzOrtDivClass">
                    <div style="" class="LkzAllAddressElementDiv">
                        <select id="rechnungsanschriftLkz" name="rechnungsanschriftLkz" class="inputElement">
                            <option value=""></option>
                            <option value="AT">Österreich</option>
                            <option value="DE">Deutschland</option>
                            <option value="CH">Schweiz</option>
                            <option value="IT">Italien</option>
                            <option value="SI">Slowenien</option>
                            <option value="NL">Holland</option>
                            <option value="LU">Luxenburg</option>
                            <option value="HU">Ungarn</option>
                            <option value="SK">Slowakei</option>
                            <option value="ES">Spanien</option>
                            <option value="FR">Frankreich</option>
                            <option value="CZ">Tschechien</option>
                            <option value="LI">Liechtenstein</option>
                            <option value="PL">Polen</option>
                            <option value="HR">Kroatien</option>
                            <option value="RO">Rumänien</option>
                            <option value="GB">Großbritannien</option>
                        </select>
                    </div>
                    <div style="" class="PlzAllAddressElementDiv">
                        <input type="text" id="rechnungsanschriftPlz" name="rechnungsanschriftPlz" class="inputElement" placeholder="PLZ" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
                    </div>
                    <div style="" class="inputFormElementDiv">
                        <input type="text" id="rechnungsanschriftOrt" name="rechnungsanschriftOrt" class="inputElement"  placeholder="Ort" autocomplete="off" spellcheck="false" autocapitalize="sentences"/>
                    </div>
                </div>
            </div>

            <!-- Tel -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="rechnungsanschriftTel">Tel:</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="tel" id="rechnungsanschriftTel" name="rechnungsanschriftTel" class="inputElement"/>
                </div>
            </div>

            <!-- email -->
            <div style="" class="fullFormElementDiv">
                <div style="" class="labelFormElementDiv">
                    <label for="rechnungsanschriftemail">E-Mail:</label>
                </div>
                <div style="" class="inputFormElementDiv">
                    <input type="email" id="rechnungsanschriftemail" name="rechnungsanschriftemail" class="inputElement"/>
                </div>
            </div>
        </div>
        <!-- END Rechnungsanschrift -->

    </div> <!-- END Adress Reiter Container -->

    <!-- BEGIN POSITIONEN DIV -->
    <div id="positionenContainerGridDiv" class="positionenContainerGridDiv">
        <div class="positionenHeadlineContainerDiv">
            <div class="addPositionenButtonDiv" onclick="addPosition()">
                <img src="img/add.svg" alt="Button Add Position">
            </div>
            <div class="positionenTextHeadlinePosDiv hideAtStartup posHeader">Pos</div>
            <div class="positionenEmptyExpandEndCollapseButtonHeadlineDiv hideAtStartup posHeader"></div>
            <div class="positionenTextHeadlineBDiv hideAtStartup posHeader">B</div>
            <div class="positionenTextHeadlineArtikelNrDiv hideAtStartup posHeader">ArtikelNr</div>
            <div class="positionenTextHeadlineBezeichnungDiv hideAtStartup posHeader">Bezeichnung</div>
            <div class="positionenTextHeadlineLängeDiv hideAtStartup posHeader">Länge</div>
            <div class="positionenTextHeadlineBreiteDiv hideAtStartup posHeader">Breite</div>
            <div class="positionenTextHeadlineAnzahlDiv hideAtStartup posHeader">Anzahl</div>
            <div class="positionenTextHeadlineMengeDiv hideAtStartup posHeader">Menge</div>
            <div class="positionenTextHeadlineEinheitDiv hideAtStartup posHeader">Einheit</div>
            <div class="positionenTextHeadlinePreisDiv hideAtStartup posHeader">Preis</div>
            <div class="positionenTextHeadlineRabattDiv hideAtStartup posHeader">Rabatt<span style="font-size: 50%; vertical-align: text-top">[%]</span></div>
            <div class="positionenTextHeadlineGesamtpreisDiv hideAtStartup posHeader">Ges.Preis</div>
        </div>
    </div>

    <div id="ButtonsOfferOrOrderDiv" style="" class="buttonsDivClass">
        <button id="prepareOfferButton" onclick="doPrepareOffer()" class="defaultButtonClass">Angebot</button>
        <button id="prepareOrderButton" onclick="doPrepareOrder()" class="defaultButtonClass">Auftrag</button>
        <button id="resetButton1" onclick="doReset()" class="defaultButtonClass">Reset</button>
    </div>

    <div  id="ButtonsDownloadOrShowDiv" style="display: none" class="buttonsDivClass">
        <button id="downloadButton" onclick="doDownloadFile()" class="defaultButtonClass">Download XML-File</button>
        <button id="viewButton" onclick="doShowFile()" class="defaultButtonClass">Anzeigen XML-File</button>
        <button id="resetButton2" onclick="doReset()" class="defaultButtonClass">Reset</button>
    </div>
    <div id="preViewDiv" style="display: none" class="preViewDivClass">
        <textarea id="offerXmlPreView" style="" class="previewTextAreaClass"></textarea>
    </div>
</div>
</body>
</html>