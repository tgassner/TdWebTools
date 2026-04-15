function doDownloadFile() {
    let businessType = businessTypeFromString(document.getElementById("BusinessType").value);
    download(doCreateBusinessObjectWithExistingBusinessNummer(businessType));
}

function doShowFile() {
    let businessType = businessTypeFromString(document.getElementById("BusinessType").value);
    document.getElementById("preViewDiv").style.display = "flex";
    document.getElementById("offerXmlPreView").innerHTML = formatXml(doCreateBusinessObjectWithExistingBusinessNummer(businessType));
}

function doCreateBusinessObjectWithExistingBusinessNummer(businessType) {
    let xmlOffDoc = document.implementation.createDocument("", "", null);

    let businessobjectsRootElement = createXmlElement(xmlOffDoc, xmlOffDoc, "", "", "", "businessobjects");

    let businessObjectElem;

    switch (businessType) {
        case BusinessTypes.OFFER:
            businessObjectElem = createXmlObject(xmlOffDoc, businessobjectsRootElement, "Angebot", "", "32");
            // AngebotArt
            createXmlField(xmlOffDoc, businessObjectElem, "AngebotArt", "0");

            // AngebotTyp
            createXmlField(xmlOffDoc, businessObjectElem, "AngebotTyp", "");

            // Lieferzeit
            createXmlField(xmlOffDoc, businessObjectElem, "Lieferzeit", document.getElementById("Lieferzeit").value);

            // IhreZeichen
            createXmlField(xmlOffDoc, businessObjectElem, "IhreZeichen", document.getElementById("IhreZeichen").value);

            break;
        case BusinessTypes.ORDER:
            businessObjectElem = createXmlObject(xmlOffDoc, businessobjectsRootElement, "Auftrag", "", "33");

            // AuftragTyp   - BusiGen
            createXmlField(xmlOffDoc, businessObjectElem, "AuftragTyp", "AB");

            // GpartnerNr -
            createXmlField(xmlOffDoc, businessObjectElem, "GpartnerNr", document.getElementById("GpartnerNr").value);

            // Liefertermin
            createXmlField(xmlOffDoc, businessObjectElem, "Liefertermin", document.getElementById("Liefertermin").value);

            break;
        default:
            alert("do hots greber wos!!");
            return;
    }
    // Business Object / Angebot / Auftrag Object


    // Nr  BusinessObject Nr - Angebot / Auftrags Nummer
    createXmlField(xmlOffDoc, businessObjectElem, "Nr", document.getElementById("BusinessNummer").value);

    // MitarbeiterNr
    createXmlField(xmlOffDoc, businessObjectElem, "MitarbeiterNr", document.getElementById("MitarbeiterNr").value);

    // ErstelltVon
    createXmlField(xmlOffDoc, businessObjectElem, "ErstelltVon", document.getElementById("MitarbeiterNr").value);

    // SachkontoNr
    createXmlField(xmlOffDoc, businessObjectElem, "SachkontoNr", "4022");

    // MwStNr
    createXmlField(xmlOffDoc, businessObjectElem, "MwStNr", "20");

    // LiefBedText
    createXmlField(xmlOffDoc, businessObjectElem, "LiefBedText", document.getElementById("LiefBedText").value);

    //let fieldNr1 = xmlOffDoc.createElement("field");
    //fieldNr1.setAttribute("name", "Nr");
    //fieldNr1.textContent = "K259397";
    //businessObjectElem.appendChild(fieldNr1);

    // Versandart
    createXmlField(xmlOffDoc, businessObjectElem, "Versandart", document.getElementById("Versandart").value);

    // Versandvermerk
    createXmlField(xmlOffDoc, businessObjectElem, "Versandvermerk", document.getElementById("Versandvermerk").value);

    // ZahlBedText
    createXmlField(xmlOffDoc, businessObjectElem, "ZahlBedText", document.getElementById("ZahlBedText").value);

    // ZahlTage
    let zahlBedTextSelectElement = document.getElementById("ZahlBedText")
    let option = zahlBedTextSelectElement.options[zahlBedTextSelectElement.selectedIndex];
    let fieldZahlTage1 = xmlOffDoc.createElement("field");
    createXmlField(xmlOffDoc, businessObjectElem, "ZahlTage", option.getAttribute("zahlTage"));

    // Adresse BEGIN
    let adresseElement = createXmlObject(xmlOffDoc, businessObjectElem, "Adresse", "", "")
    // ApartnerName
    createXmlField(xmlOffDoc, adresseElement, "ApartnerName", document.getElementById("adresseApartnerName").value);
    // Email
    createXmlField(xmlOffDoc, adresseElement, "Email", document.getElementById("adresseemail").value);
    // Firma1
    createXmlField(xmlOffDoc, adresseElement, "Firma1", document.getElementById("adresseFirma1").value);
    // Firma2
    createXmlField(xmlOffDoc, adresseElement, "Firma2", document.getElementById("adresseFirma2").value);
    // Lkz
    createXmlField(xmlOffDoc, adresseElement, "Lkz", document.getElementById("adresseLkz").value);
    // Ort
    createXmlField(xmlOffDoc, adresseElement, "Ort", document.getElementById("adresseOrt").value);
    // Plz
    createXmlField(xmlOffDoc, adresseElement, "Plz", document.getElementById("adressePlz").value);
    // Strasse
    createXmlField(xmlOffDoc, adresseElement, "Strasse", document.getElementById("adresseStrasse").value);
    // Telefon
    createXmlField(xmlOffDoc, adresseElement, "Telefon", document.getElementById("adresseTel").value);
    // Adresse END

    // Lieferanschrift BEGIN
    let lieferAnschriftElement = createXmlObject(xmlOffDoc, businessObjectElem, "Lieferanschrift", "", "")
    // ApartnerName
    createXmlField(xmlOffDoc, lieferAnschriftElement, "ApartnerName", document.getElementById("lieferanschriftApartnerName").value);
    // Email
    createXmlField(xmlOffDoc, lieferAnschriftElement, "Email", document.getElementById("lieferanschriftemail").value);
    // Firma1
    createXmlField(xmlOffDoc, lieferAnschriftElement, "Firma1", document.getElementById("lieferanschriftFirma1").value);
    // Firma2
    createXmlField(xmlOffDoc, lieferAnschriftElement, "Firma2", document.getElementById("lieferanschriftFirma2").value);
    // Lkz
    createXmlField(xmlOffDoc, lieferAnschriftElement, "Lkz", document.getElementById("lieferanschriftLkz").value);
    // Ort
    createXmlField(xmlOffDoc, lieferAnschriftElement, "Ort", document.getElementById("lieferanschriftOrt").value);
    // Plz
    createXmlField(xmlOffDoc, lieferAnschriftElement, "Plz", document.getElementById("lieferanschriftPlz").value);
    // Strasse
    createXmlField(xmlOffDoc, lieferAnschriftElement, "Strasse", document.getElementById("lieferanschriftStrasse").value);
    // Telefon
    createXmlField(xmlOffDoc, lieferAnschriftElement, "Telefon", document.getElementById("lieferanschriftTel").value);
    // Lieferanschrift END

    // Rechnungsanschrift BEGIN
    let rechnungsAnschriftElement = createXmlObject(xmlOffDoc, businessObjectElem, "Rechnungsanschrift", "", "")
    // ApartnerName
    createXmlField(xmlOffDoc, rechnungsAnschriftElement, "ApartnerName", document.getElementById("rechnungsanschriftApartnerName").value);
    // Email
    createXmlField(xmlOffDoc, rechnungsAnschriftElement, "Email", document.getElementById("rechnungsanschriftemail").value);
    // Firma1
    createXmlField(xmlOffDoc, rechnungsAnschriftElement, "Firma1", document.getElementById("rechnungsanschriftFirma1").value);
    // Firma2
    createXmlField(xmlOffDoc, rechnungsAnschriftElement, "Firma2", document.getElementById("rechnungsanschriftFirma2").value);
    // Lkz
    createXmlField(xmlOffDoc, rechnungsAnschriftElement, "Lkz", document.getElementById("rechnungsanschriftLkz").value);
    // Ort
    createXmlField(xmlOffDoc, rechnungsAnschriftElement, "Ort", document.getElementById("rechnungsanschriftOrt").value);
    // Plz
    createXmlField(xmlOffDoc, rechnungsAnschriftElement, "Plz", document.getElementById("rechnungsanschriftPlz").value);
    // Strasse
    createXmlField(xmlOffDoc, rechnungsAnschriftElement, "Strasse", document.getElementById("rechnungsanschriftStrasse").value);
    // Telefon
    createXmlField(xmlOffDoc, rechnungsAnschriftElement, "Telefon", document.getElementById("rechnungsanschriftTel").value);
    // Rechnungsanschrift END


    // Positionen BEGIN
    let posElements = document.getElementsByName("positionHiddenPos");
    if (posElements) {
        posElements.forEach(pos => {
            let posNumber = pos.value;

            // object position
            let posElement = createXmlObject(xmlOffDoc, businessObjectElem, "Position", "", "");

            // PosNr
            createXmlField(xmlOffDoc, posElement, "PosNr", posNumber);

            // Baustein
            createXmlField(xmlOffDoc, posElement, "Baustein", document.getElementById("positionBausteinSelect" + posNumber).value);

            // ArtikelNr
            createXmlField(xmlOffDoc, posElement, "ArtikelNr", document.getElementById("positionArtikelNrInput" + posNumber).value);

            // Bezeichnung
            createXmlField(xmlOffDoc, posElement, "Bezeichnung", document.getElementById("positionBezeichnungInput" + posNumber).value);

            freieFelderElement = createXmlObject(xmlOffDoc, posElement, "FreieFelder", "")

            freiesFeldePosLaengeElement = createXmlObject(xmlOffDoc, freieFelderElement, "FreiesFeld", "")
            createXmlField(xmlOffDoc, freiesFeldePosLaengeElement, "Name", "PosLaenge");
            createXmlField(xmlOffDoc, freiesFeldePosLaengeElement, "Wert", document.getElementById("positionLengthInput" + posNumber).value);

            freiesFeldePosLaengeEinheitElement = createXmlObject(xmlOffDoc, freieFelderElement, "FreiesFeld", "")
            createXmlField(xmlOffDoc, freiesFeldePosLaengeEinheitElement, "Name", "PosLaengeEinheit");
            createXmlField(xmlOffDoc, freiesFeldePosLaengeEinheitElement, "Wert", "mm");

            freiesFeldePosBreiteElement = createXmlObject(xmlOffDoc, freieFelderElement, "FreiesFeld", "")
            createXmlField(xmlOffDoc, freiesFeldePosBreiteElement, "Name", "PosBreite");
            createXmlField(xmlOffDoc, freiesFeldePosBreiteElement, "Wert", document.getElementById("positionWidthInput" + posNumber).value);

            freiesFeldePosBreiteEinheitElement = createXmlObject(xmlOffDoc, freieFelderElement, "FreiesFeld", "")
            createXmlField(xmlOffDoc, freiesFeldePosBreiteEinheitElement, "Name", "PosBreiteEinheit");
            createXmlField(xmlOffDoc, freiesFeldePosBreiteEinheitElement, "Wert", "mm");

            freiesFeldePosAnzahlEinheitElement = createXmlObject(xmlOffDoc, freieFelderElement, "FreiesFeld", "")
            createXmlField(xmlOffDoc, freiesFeldePosAnzahlEinheitElement, "Name", "PosAnzahl");
            createXmlField(xmlOffDoc, freiesFeldePosAnzahlEinheitElement, "Wert", document.getElementById("positionAnzahlInput" + posNumber).value);

            // Menge
            createXmlField(xmlOffDoc, posElement, "Menge", document.getElementById("positionMengeInput" + posNumber).value);

            // Einheit
            createXmlField(xmlOffDoc, posElement, "Einheit", document.getElementById("positionEinheitSelect" + posNumber).value);

            // Preis
            createXmlField(xmlOffDoc, posElement, "Preis", document.getElementById("positionPreisInput" + posNumber).value);

            // Rabatt
            createXmlField(xmlOffDoc, posElement, "Rabatt", document.getElementById("positionRabattInput" + posNumber).value);

            // Gesamtpreis
            createXmlField(xmlOffDoc, posElement, "Gesamtpreis", document.getElementById("positionGesamtpreisInput" + posNumber).value);

            // LangtextHtml
            let langtext = document.getElementById("posLangTextTextArea" + posNumber).value;
            createXmlField(xmlOffDoc, posElement, "LangtextHtml", processLangtextHtml(langtext));

            // MwStNr
            createXmlField(xmlOffDoc, posElement, "MwStNr", "20");

            // MwStSatz
            createXmlField(xmlOffDoc, posElement, "MwStSatz", "20");

            // SachkontoNr
            createXmlField(xmlOffDoc, posElement, "SachkontoNr", "4022");
        })
    }
    // Positionen BEGIN

    let serializer = new XMLSerializer();
    let xmlOfferDocString = serializer.serializeToString(xmlOffDoc);

    xmlOfferDocString = "<" + "?xml version=\"1.0\" encoding=\"utf-8\"?>\n" + xmlOfferDocString;

    return xmlOfferDocString;
}

/**
 * thx to arcturus on Stackoverflow
 * https://stackoverflow.com/questions/376373/pretty-printing-xml-with-javascript
 * @param xml the XML String
 * @param tab intent optional indent value, default is tab (\t)
 * @returns formated XML
 */
function formatXml(xml, tab) {
    let formatted = '', indent = '';
    tab = tab || '\t';
    let regexIntent = new RegExp("^" + "<" + "?" + "\\" + "w[^>]*[^" + "\\" + "/]$");
    xml.split(/>\s*</).forEach(function (node) {
        if (node.match(/^\/\w/)) indent = indent.substring(tab.length); // decrease indent by one 'tab'
        formatted += indent + '<' + node + '>\r\n';

        console.log(regexIntent);
        if (node.match(regexIntent)) {
            indent += tab;
        }
    });
    return formatted.substring(1, formatted.length - 3);
}

function createXmlElement(document, parentElement, name, textContent = "", id, tag) {
    let element = document.createElement(tag);

    if (name) {
        element.setAttribute("name", name);
    }

    if (id) {
        element.setAttribute("id", id);
    }

    if (textContent) {
        element.textContent = textContent;
    }

    parentElement.appendChild(element);

    return element;
}

function createXmlField(document, parentElement, name, textContent = "") {
    return createXmlElement(document, parentElement, name, textContent, "", "field");
}

function createXmlObject(document, parentElement, name, textContent = "", id) {
    return createXmlElement(document, parentElement, name, textContent, id, "object");
}

function determineFilename() {
    let mitarbeiter = document.getElementById("MitarbeiterNr").value.trim();
    let currentDate = new Date();
    let dateTime =
        currentDate.getFullYear() + "-" +
        String(currentDate.getMonth() + 1).padStart(2, '0') + "-" +
        String(currentDate.getDate()).padStart(2, '0') + "_" +
        String(currentDate.getHours()).padStart(2, '0') + "." +
        String(currentDate.getMinutes()).padStart(2, '0') + "." +
        String(currentDate.getSeconds()).padStart(2, '0');
    let businessNummer = document.getElementById("BusinessNummer").value;
    let businessType = document.getElementById("BusinessType").value;

    return dateTime + "_" + mitarbeiter + "_" + businessNummer + "_" + businessType + ".xml";
}

function download(data) {
    let file = new Blob([data], {type: "application/xml"});
    let a = document.createElement("a"),
        url = URL.createObjectURL(file);
    a.href = url;
    a.download = determineFilename();
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}