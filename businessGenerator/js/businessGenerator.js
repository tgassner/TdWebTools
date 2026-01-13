const BusinessTypes = Object.freeze({
    OFFER:  Symbol("OFFER"),
    ORDER:  Symbol("ORDER")
});

function businessTypeFromString(businessTypeString) {
    switch (businessTypeString) {
        case Object(BusinessTypes.OFFER).description:
            return BusinessTypes.OFFER;
        case Object(BusinessTypes.ORDER).description:
            return BusinessTypes.ORDER;
        default:
            return null;
    }
}

const Einheiten = Object.freeze({
    STUECK:  Symbol("Stück"),
    QUADRATMETER:  Symbol("m²"),
    METER: Symbol("m"),
    SET: Symbol("Set"),
    PAUSCHALE:  Symbol("Pau"),
});

function einheitFromString(einheitString) {
    switch (einheitString) {
        case Object(Einheiten.STUECK).description:
            return Einheiten.STUECK;
        case Object(Einheiten.QUADRATMETER).description:
            return Einheiten.QUADRATMETER;
        case Object(Einheiten.METER).description:
            return Einheiten.METER;
        case Object(Einheiten.SET).description:
            return Einheiten.SET;
        case Object(Einheiten.PAUSCHALE).description:
            return Einheiten.PAUSCHALE;
        default:
            return null;
    }
}

window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
});

function deletePosition(posNumber) {
    document.getElementById("singlePositionenContainerDiv" + posNumber).remove();
    document.getElementById("posLangTextDiv" + posNumber).remove();
    let posElements = document.getElementsByName("positionHiddenPos");
    if (posElements.length <= 0) {
        Array.from(document.getElementsByClassName("posHeader")).forEach(element => {
            element.classList.add("hideAtStartup");
        })
    }
}

function expandLangtextPosition(posNumber) {
    document.getElementById("posLangTextTextArea" + posNumber).classList.remove("hiddenClass");
    let collapseDiv = document.getElementById("positionCollapseLangTextButtonDiv" + posNumber);
    collapseDiv.classList.remove("hiddenClass")
    let expandDiv = document.getElementById("positionExpandLangTextButtonDiv" + posNumber);
    expandDiv.classList.add("hiddenClass");
}

function collapseLangtextPosition(posNumber) {
    document.getElementById("posLangTextTextArea" + posNumber).classList.add("hiddenClass");
    document.getElementById("positionCollapseLangTextButtonDiv" + posNumber).classList.add("hiddenClass");
    document.getElementById("positionExpandLangTextButtonDiv" + posNumber).classList.remove("hiddenClass");
}

function createDivWithClassname(classname) {
    let divElement = document.createElement('div');
    divElement.classList.add(classname);
    return divElement;
}

function createInputWithTypeAndId(type, id, name = "", value = "", cssClass = "") {
    let inputElement = document.createElement('input');
    inputElement.type = type;
    inputElement.id = id;
    if (name) {
        inputElement.name = name;
    }
    if (value) {
        inputElement.value = value;
    }

    if (cssClass) {
        inputElement.classList.add(cssClass);
    }

    inputElement.autocomplete = "off";
    inputElement.spellcheck = false;
    inputElement.autocapitalize = "sentence";

    return inputElement;
}

function createSelectOptionAndAddToList(value, text, selectElement, selected = false) {
    let optionElement = document.createElement('option');
    optionElement.value = value;
    optionElement.innerHTML = text;
    optionElement.selected = selected;
    selectElement.appendChild(optionElement);
    return optionElement;
}

function calculateNewPosNr() {
    let posElements = document.getElementsByName("positionHiddenPos");

    let maxPos = posElements.length * 10;
    if (posElements) {
        posElements.forEach(pos => {
            let intValue =  parseInt(pos.value, 10);
            maxPos = (intValue > maxPos) ? intValue : maxPos;
        })
    }

    return maxPos + 10;
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function einheitChanged(posNumber) {
    let laengeElement = document.getElementById('positionLengthInput' + posNumber);
    let breiteElement = document.getElementById('positionWidthInput' + posNumber);
    let einheitElement = document.getElementById('positionEinheitSelect' + posNumber);

    if (!einheitElement) {
        enableInput(laengeElement, false);
        enableInput(breiteElement, false);
        return;
    }

    switch (einheitFromString(einheitElement.value)) {
        case Einheiten.STUECK:
            enableInput(laengeElement, false);
            enableInput(breiteElement, false);
            break;
        case Einheiten.QUADRATMETER:
            enableInput(laengeElement, true);
            enableInput(breiteElement, true);
            break;
        case Einheiten.METER:
            enableInput(laengeElement, true);
            enableInput(breiteElement, false);
            break;
        case Einheiten.SET:
            enableInput(laengeElement, false);
            enableInput(breiteElement, false);
            break;
        case Einheiten.PAUSCHALE:
            enableInput(laengeElement, false);
            enableInput(breiteElement, false);
            break;
        default:
            console.log("Default");
            enableInput(laengeElement, false);
            enableInput(breiteElement, false);
            break;
    }
}

function enableInput(htmlElement, enabled = true) {
    if (htmlElement) {
        if (!enabled) {
            htmlElement.value = "";
        }
        htmlElement.disabled = !enabled;
    }
}

function calcMenge(posNumber) {
    let laengeElement = document.getElementById('positionLengthInput' + posNumber);
    let breiteElement = document.getElementById('positionWidthInput' + posNumber);
    let anzahlElement = document.getElementById('positionAnzahlInput' + posNumber);
    let einheitElement = document.getElementById('positionEinheitSelect' + posNumber);
    let mengeElement = document.getElementById('positionMengeInput' + posNumber);

    if (!einheitElement || !mengeElement) {
        return;
    }

    let laenge = (laengeElement && laengeElement.value && isNumeric(laengeElement.value)) ? parseFloat(laengeElement.value) : 0;
    let breite = (breiteElement && breiteElement.value && isNumeric(breiteElement.value)) ? parseFloat(breiteElement.value) : 0;
    let anzahl= (anzahlElement && anzahlElement.value && isNumeric(anzahlElement.value)) ? parseFloat(anzahlElement.value) : 0;
    let einheit = (einheitElement.value) ? einheitElement.value : "";

    switch (einheitFromString(einheit)) {
        case Einheiten.QUADRATMETER:
            if (laenge <= 0 && breite <= 0 && anzahl <= 0) {
                break;
            }
            let flaecheM2 = (laenge * breite * anzahl) / (1000 * 1000);
            mengeElement.value = flaecheM2;
            mengeElement.dispatchEvent(new Event('change'));
            break;
        case Einheiten.METER:
            if (laenge <= 0 && breite <= 0) {
                break;
            }
            mengeElement.value = laenge * anzahl / 1000;
            mengeElement.dispatchEvent(new Event('change'));
            break;
        default:
            break;
    }
}
function calcGesamtPreis(posNumber) {
    let mengeElement = document.getElementById('positionMengeInput' + posNumber);
    let preisElement = document.getElementById('positionPreisInput' + posNumber);
    let anzahlElement = document.getElementById('positionAnzahlInput' + posNumber);
    let rabattElement = document.getElementById('positionRabattInput' + posNumber);

    if (!mengeElement || ! preisElement || !anzahlElement) {
        document.getElementById("positionGesamtpreisInput" + posNumber).value = "";
        return;
    }

    let mengeValueString = mengeElement.value;
    let preisValueString = preisElement.value;
    let anzahlValueString = anzahlElement.value;
    let rabattValueString = (!rabattElement || !rabattElement.value) ? "0" : rabattElement.value;

    if (!isNumeric(mengeValueString) || !isNumeric(preisValueString) || !isNumeric(anzahlValueString) || !isNumeric(rabattValueString)) {
        return;
    }

    let mengeValueNumber = parseFloat(mengeValueString);
    let preisValueNumber = parseFloat(preisValueString);
    let anzahlValueNumber = parseFloat(anzahlValueString);
    let rabattValueNumber = parseFloat(rabattValueString);

    let rabattMultiplier = 1 - (rabattValueNumber / 100);

    let gesamtPreisNumber = (mengeValueNumber * preisValueNumber * anzahlValueNumber) * rabattMultiplier;

    document.getElementById("positionGesamtpreisInput" + posNumber).value = gesamtPreisNumber;
}

function addPosition() {
    // Show Healine of Pos Table if not already
    let posHeadlineElementsAreNowHidden = document.getElementsByClassName("hideAtStartup");
    if (posHeadlineElementsAreNowHidden) {
        Array.from(posHeadlineElementsAreNowHidden).forEach(element => {
            element.classList.remove("hideAtStartup");
        })
    }

    let posContainer = document.getElementById("positionenContainerGridDiv");
    let newPosNumber = calculateNewPosNr();

    let singlePositionContainerDiv = createDivWithClassname('singlePositionContainerDivClass');
    singlePositionContainerDiv.id = "singlePositionenContainerDiv" + newPosNumber;
    posContainer.appendChild(singlePositionContainerDiv);

    let positionDeleteButtonDiv = createDivWithClassname('positionDeleteButtonDivClass');
    let deleteImgElem = document.createElement("img");
    deleteImgElem.src = "img/delete.svg";
    deleteImgElem.alt = "Delete Button";
    positionDeleteButtonDiv.appendChild(deleteImgElem);
    positionDeleteButtonDiv.addEventListener('click', () => deletePosition(newPosNumber));
    singlePositionContainerDiv.appendChild(positionDeleteButtonDiv);

    // Position - Pos
    let positionPosDiv = createDivWithClassname('positionPosDivClass');
    positionPosDiv.innerHTML = newPosNumber;
    let positionHiddenPosIdInput = createInputWithTypeAndId("hidden", "positionHiddenPosId" + newPosNumber, "positionHiddenPos", newPosNumber + "");
    positionPosDiv.appendChild(positionHiddenPosIdInput);
    singlePositionContainerDiv.appendChild(positionPosDiv);

    // expand Langtext
    let positionExpandLangTextButtonDiv = createDivWithClassname('positionExpandLangTextButtonDivClass');
    positionExpandLangTextButtonDiv.id = "positionExpandLangTextButtonDiv" + newPosNumber;
    let expandImgElem = document.createElement("img");
    expandImgElem.src = "img/expand.svg";
    expandImgElem.alt = "Aufklappen Button";
    positionExpandLangTextButtonDiv.appendChild(expandImgElem);
    positionExpandLangTextButtonDiv.addEventListener('click', () => expandLangtextPosition(newPosNumber));
    singlePositionContainerDiv.appendChild(positionExpandLangTextButtonDiv);

    // collapse Langtext
    let positionCollapseLangTextButtonDiv = createDivWithClassname('positionCollapseLangTextButtonDivClass');
    positionCollapseLangTextButtonDiv.id = "positionCollapseLangTextButtonDiv" + newPosNumber;
    let collapseImgElem = document.createElement("img");
    collapseImgElem.src = "img/collapse.svg";
    collapseImgElem.alt = "Einklappen Button";
    positionCollapseLangTextButtonDiv.appendChild(collapseImgElem);
    positionCollapseLangTextButtonDiv.addEventListener('click', () => collapseLangtextPosition(newPosNumber));
    positionCollapseLangTextButtonDiv.classList.add("hiddenClass");
    singlePositionContainerDiv.appendChild(positionCollapseLangTextButtonDiv);

    // Baustein
    let positionBausteinDiv = createDivWithClassname('positionBausteinDivClass');
    let positionBausteinSelect = document.createElement('select');
    let positionBausteinSelectElementId = "positionBausteinSelect" + newPosNumber;
    positionBausteinSelect.id = positionBausteinSelectElementId;
    positionBausteinSelect.classList.add("positionBausteinSelectClass");
    createSelectOptionAndAddToList("", "", positionBausteinSelect);
    createSelectOptionAndAddToList("D", "D", positionBausteinSelect);
    createSelectOptionAndAddToList("F", "F", positionBausteinSelect);
    createSelectOptionAndAddToList("T", "T", positionBausteinSelect);
    createSelectOptionAndAddToList("Z", "Z", positionBausteinSelect);
    positionBausteinDiv.appendChild(positionBausteinSelect);
    singlePositionContainerDiv.appendChild(positionBausteinDiv);

    // Artikel Nr
    let positionArtikelNrDiv = createDivWithClassname("positionArtikelNrDivClass");
    let artikelNrInputElementId = "positionArtikelNrInput" + newPosNumber;
    let positionArtikelNrInput = createInputWithTypeAndId("text", artikelNrInputElementId, null, null, "positionArtikelNrInputClass");
    positionArtikelNrInput.spellcheck = false;
    positionArtikelNrInput.autocomplete = "off";
    positionArtikelNrInput.autocorrect = "off";
    positionArtikelNrInput.autocapitalize = "off";
    positionArtikelNrDiv.appendChild(positionArtikelNrInput);
    singlePositionContainerDiv.appendChild(positionArtikelNrDiv);

    // Bezeichnung
    let positionBezeichnungDiv = createDivWithClassname('positionBezeichnungDivClass');
    let artikelBezeichnungInputElementId = "positionBezeichnungInput" + newPosNumber;
    let positionBezeichnungInput = createInputWithTypeAndId("text", artikelBezeichnungInputElementId, null, null, "positionBezeichnungInputClass");
    positionBezeichnungDiv.appendChild(positionBezeichnungInput);
    singlePositionContainerDiv.appendChild(positionBezeichnungDiv);

    // Länge
    let positionLengthDiv = createDivWithClassname('positionLengthDivClass');
    let positionLengthInput = createInputWithTypeAndId("number", "positionLengthInput" + newPosNumber, null, null, "positionLengthInputClass");
    positionLengthInput.addEventListener('change', () => calcMenge(newPosNumber));
    positionLengthInput.disabled = true;
    positionLengthDiv.appendChild(positionLengthInput);
    singlePositionContainerDiv.appendChild(positionLengthDiv);

    // Breite
    let positionWidthDiv = createDivWithClassname('positionWidthDivClass');
    let positionWidthInput = createInputWithTypeAndId("number", "positionWidthInput" + newPosNumber, null, null, "positionWidthInputClass");
    positionWidthInput.addEventListener('change', () => calcMenge(newPosNumber));
    positionWidthInput.disabled = true;
    positionWidthDiv.appendChild(positionWidthInput);
    singlePositionContainerDiv.appendChild(positionWidthDiv);

    // Anzahl
    let positionAnzahlDiv = createDivWithClassname('positionAnzahlDivClass');
    let positionAnzahlInput = createInputWithTypeAndId("number", "positionAnzahlInput" + newPosNumber, null, null, "positionAnzahlInputClass");
    positionAnzahlInput.addEventListener('change', () => calcMenge(newPosNumber));
    positionAnzahlInput.step = "1";
    positionAnzahlInput.addEventListener('change', () => calcGesamtPreis(newPosNumber));
    positionAnzahlDiv.appendChild(positionAnzahlInput);
    singlePositionContainerDiv.appendChild(positionAnzahlDiv);

    // Menge
    let positionMengeDiv = createDivWithClassname('positionMengeDivClass');
    let positionMengeInput = createInputWithTypeAndId("number", "positionMengeInput" + newPosNumber, null, null, "positionMengeInputClass");
    positionMengeInput.addEventListener('change', () => calcGesamtPreis(newPosNumber));
    positionMengeInput.step = "0.0001";
    positionMengeDiv.appendChild(positionMengeInput);
    singlePositionContainerDiv.appendChild(positionMengeDiv);

    // Einheit
    let positionEinheitDiv = createDivWithClassname('positionEinheitDivClass');
    let positionEinheitList = document.createElement('select');
    positionEinheitList.addEventListener('change', () => calcMenge(newPosNumber));
    positionEinheitList.addEventListener('change', () => einheitChanged(newPosNumber));
    let positionEinheitSelectElementId = "positionEinheitSelect" + newPosNumber;
    positionEinheitList.id = positionEinheitSelectElementId;
    positionEinheitList.classList.add("positionEinheitListSelectClass");
    createSelectOptionAndAddToList("", "", positionEinheitList);
    createSelectOptionAndAddToList("Stück", "Stück", positionEinheitList);
    createSelectOptionAndAddToList("m²", "m²", positionEinheitList);
    createSelectOptionAndAddToList("m", "m", positionEinheitList);
    createSelectOptionAndAddToList("Set", "Set", positionEinheitList);
    createSelectOptionAndAddToList("Pau", "Pau", positionEinheitList);
    positionEinheitDiv.appendChild(positionEinheitList);
    singlePositionContainerDiv.appendChild(positionEinheitDiv);

    // Preis
    let positionPreisDiv = createDivWithClassname('positionPreisDivClass');
    let positionPreisInputElementId = "positionPreisInput" + newPosNumber;
    let positionPreisInput = createInputWithTypeAndId("number", positionPreisInputElementId, null, null, "positionPreisInputClass");
    positionPreisInput.addEventListener('change', () => calcGesamtPreis(newPosNumber));
    positionPreisDiv.appendChild(positionPreisInput);
    singlePositionContainerDiv.appendChild(positionPreisDiv);

    // Rabatt
    let positionRabattDiv = createDivWithClassname('positionRabattDivClass');
    let positionRabattInput = createInputWithTypeAndId("number", "positionRabattInput" + newPosNumber, null, null, "positionRabattInputClass");
    positionRabattInput.min = 0;
    positionRabattInput.max = 100;
    positionRabattInput.step = "1";
    positionRabattInput.value = "0";
    positionRabattInput.addEventListener('change', () => calcGesamtPreis(newPosNumber));
    positionRabattDiv.appendChild(positionRabattInput);
    singlePositionContainerDiv.appendChild(positionRabattDiv);

    // Gesamtpreis  = Preis * Menge
    let positionGesamtpreisDiv = createDivWithClassname('positionGesamtpreisDivClass');
    let positionGesamtpreisInput = createInputWithTypeAndId("number", "positionGesamtpreisInput" + newPosNumber, null, null, "positionGesamtpreisInputClass");
    positionGesamtpreisDiv.appendChild(positionGesamtpreisInput);
    singlePositionContainerDiv.appendChild(positionGesamtpreisDiv);

    let positionExpandAndCollapseLangTextButtonDiv = createDivWithClassname('positionExpandAndCollapseLangTextButtonDivClass');
    singlePositionContainerDiv.appendChild(positionExpandAndCollapseLangTextButtonDiv);

    // LangText
    let posLangTextDiv = createDivWithClassname('posLangTextDivClass');
    posLangTextDiv.id = "posLangTextDiv" + newPosNumber;
    let posLangTextTextArea = document.createElement('textarea');
    posLangTextTextArea.classList.add("hiddenClass");
    posLangTextTextArea.id = "posLangTextTextArea" + newPosNumber;
    posLangTextTextArea.classList.add("posLangTextTextAreaClass");
    posLangTextTextArea.placeholder = "Langtext";
    posLangTextDiv.appendChild(posLangTextTextArea);
    posContainer.appendChild(posLangTextDiv);

    // ADDING autocompletion
    if (allArticleData) {
        initAutoComplete(artikelNrInputElementId, artikelBezeichnungInputElementId, positionPreisInputElementId, positionEinheitSelectElementId, positionBausteinSelectElementId);
    }
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

function processLangtextHtml(planeLangtext) {
    //planeLangtext = planeLangtext.replaceAll("\n", "&#13;");
    //planeLangtext = planeLangtext.replace(/(?:\r\n|\r|\n)/g, "&#13;");

    const einzelneZeilen = planeLangtext.split('\n');

    let retZeilen = "";
    for (let i = 0; i < einzelneZeilen.length; i++) {
        retZeilen += "<p>" + einzelneZeilen[i] + "</p>";
    }

    return retZeilen;
}

function determineFilename() {
    let mitarbeiter = document.getElementById("MitarbeiterNr").value.trim();
    let currentDate = new Date();
    let dateTime = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate() + " " + currentDate.getHours() + "." + currentDate.getMinutes() + "." + currentDate.getSeconds();
    let businessNummer = document.getElementById("BusinessNummer").value;
    // TODO BusinessTypes into Filename...
    return  ((mitarbeiter === "") ? "" : (mitarbeiter + " ")) + dateTime  + " " + businessNummer + ".xml";
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
            alert("do hot greber wos!!");
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

function doPrepareOffer() {
    document.getElementById("ButtonsDownloadOrShowDiv").style.display = "none";
    document.getElementById("ButtonsOfferOrOrderDiv").style.display = "none";
    determineBusinessnummerFromServer("OfferServiceRemoteCall.php?action=generateNewOfferNumber", BusinessTypes.OFFER);
}

function doPrepareOrder() {
    document.getElementById("ButtonsDownloadOrShowDiv").style.display = "none";
    document.getElementById("ButtonsOfferOrOrderDiv").style.display = "none";
    determineBusinessnummerFromServer("OrderServiceRemoteCall.php?action=generateNewOrderNumber", BusinessTypes.ORDER);
}

function doDownloadFile() {
    let businessType = businessTypeFromString(document.getElementById("BusinessType").value);
    download(doCreateBusinessObjectWithExistingBusinessNummer(businessType));
}

function doShowFile() {
    let businessType = businessTypeFromString(document.getElementById("BusinessType").value);
    document.getElementById("preViewDiv").style.display = "flex";
    document.getElementById("offerXmlPreView").innerHTML = formatXml(doCreateBusinessObjectWithExistingBusinessNummer(businessType));
}

function doReset() {
    Array.from(document.getElementsByClassName("singlePositionContainerDivClass")).forEach(element => {
        element.remove();
    })

    Array.from(document.getElementsByClassName("posLangTextDivClass")).forEach(element => {
        element.remove();
    })

    Array.from(document.getElementsByTagName("input")).forEach(element => {
        element.value = "";
    })

    Array.from(document.getElementsByTagName("select")).forEach(element => {
        element.selectedIndex = 0;
    })


    document.getElementById("animationWaitStribeBusinessNummer").style.display = "none";

    document.getElementById("BusinessNummer").style.display = "inline-flex";
    document.getElementById("BusinessNummer").value = "";

    document.getElementById("BusinessType").style.display = "none";
    document.getElementById("BusinessType").value = "";

    document.getElementById("preViewDiv").style.display = "none";

    document.getElementById("GpartnerNr").value = "20";

    document.getElementById("ButtonsDownloadOrShowDiv").style.display = "none";
    document.getElementById("ButtonsOfferOrOrderDiv").style.display = "";
    document.getElementById("lieferTerminFormElementDiv").style.display = "";
    document.getElementById("lieferZeitFormElementDiv").style.display = "";
    document.getElementById("ihreZeichenFormElementDiv").style.display = "";

    onClickAdresseReiter();
}

function determineBusinessnummerFromServer(url, businessType) {
    document.getElementById("animationWaitStribeBusinessNummer").style.display = "block";
    document.getElementById("BusinessNummer").style.display = "none";

    fetch(url) // Call the fetch function passing the url of the API as a parameter
        .then(res => res.json())
        .then(function (res) {
            let ok = res.ok;
            let value = res.value;
            let msg = res.msg;

            if (!ok) {
                alert(msg);
                document.getElementById("ButtonsOfferOrOrderDiv").style.display = "";
                return;
            }

            document.getElementById("ButtonsDownloadOrShowDiv").style.display = "";
            document.getElementById("BusinessNummer").value = value;
            document.getElementById("BusinessType").style.display = "block";
            document.getElementById("BusinessType").value = Object(businessType).description;
            switch (businessType) {
                case BusinessTypes.OFFER:
                    console.log("OFFER");
                    document.getElementById("lieferTerminFormElementDiv").style.display = "none";
                    break;
                case BusinessTypes.ORDER:
                    console.log("ORDER");
                    document.getElementById("lieferZeitFormElementDiv").style.display = "none";
                    document.getElementById("ihreZeichenFormElementDiv").style.display = "none";
                    break;
                default:
                    alert("UI .. do hots greber wos...");
                    return;
            }
        })
        .catch(function(e) {
            alert("Sorry, something went wrong.\n" + e);
        }).finally(function () {
        document.getElementById("BusinessNummer").style.display = "block";
        document.getElementById("animationWaitStribeBusinessNummer").style.display = "none";
    });

}

/**
 * thx to arcturus on Stackoverflow
 * https://stackoverflow.com/questions/376373/pretty-printing-xml-with-javascript
 * @param xml the XML String
 * @param tab intent optional indent value, default is tab (\t)
 * @returns formated XML
 */
function formatXml(xml, tab) {
    let formatted = '', indent= '';
    tab = tab || '\t';
    let regexIntent = new RegExp("^" + "<" + "?" + "\\" + "w[^>]*[^" + "\\" + "/]$");
    xml.split(/>\s*</).forEach(function(node) {
        if (node.match( /^\/\w/ )) indent = indent.substring(tab.length); // decrease indent by one 'tab'
        formatted += indent + '<' + node + '>\r\n';

        console.log(regexIntent);
        if (node.match(regexIntent)) {
            indent += tab;
        }
    });
    return formatted.substring(1, formatted.length-3);
}

function switchReiterAdresse(idOfEnabledButtons, idOfEnabledContent) {
    document.getElementById("reiterAdresse").classList.remove("reiterSelectedElementDiv");
    document.getElementById("reiterLieferanschrift").classList.remove("reiterSelectedElementDiv");
    document.getElementById("reiterRechnungsanschrift").classList.remove("reiterSelectedElementDiv");
    document.getElementById(idOfEnabledButtons).classList.add("reiterSelectedElementDiv");

    document.getElementById("reiterContentAdresse").style.display = "none";
    document.getElementById("reiterContentLieferanschrift").style.display = "none";
    document.getElementById("reiterContentRechnungsanschrift").style.display = "none";
    document.getElementById(idOfEnabledContent).style.display = "";
}

function onClickAdresseReiter() {
    switchReiterAdresse("reiterAdresse", "reiterContentAdresse");
}

function onClickLieferanschriftReiter() {
    switchReiterAdresse("reiterLieferanschrift", "reiterContentLieferanschrift");
}

function onClickRechnungsanschriftReiter() {
    switchReiterAdresse("reiterRechnungsanschrift", "reiterContentRechnungsanschrift");
}

function createStatusElement(status, text) {
    let okElement = document.createElement('span');
    switch (status) {
        case "ok":
            okElement.style.color = "#AFC80A";
            break;
        case "nok":
            okElement.style.color = "#FF0000";
            break;
        default:
            okElement.style.color = "#000000";
            break;
    }
    okElement.title = text;
    okElement.innerHTML = "&#xFFED;"
    return okElement;
}

document.addEventListener("DOMContentLoaded", function() {
    //document.getElementById("headerLowerDiv").innerHTML =
    //    "window.screen.=" + window.screen.width + "x" + window.screen.height + " - " +
    //    "window.inner=" + window.innerWidth + "x" + window.innerHeight + " - " +
    //    "document.documentElement.client=" + document.documentElement.clientWidth + "x" + document.documentElement.clientHeight + " - " +
    //    "document.body.client" + document.body.clientWidth + "x" + document.body.clientHeight + " - " +
    //    document.getElementById("headerLowerDiv").innerHTML;

    fetch("ArticleServiceRemoteCall.php?action=findAllProducts") // Call the fetch function passing the url of the API as a parameter
        .then(res => res.json())
        .then(function (res) {
            let ok = res.ok;
            let value = res.value;
            let msg = res.msg;

            if (!ok) {
                document.getElementById("statusSpan").appendChild(createStatusElement("nok", msg));
                return;
            }

            allArticleData = value;

            document.getElementById("statusSpan").appendChild(createStatusElement("ok", "Article Data loaded Successfully!"));
        })
        .catch(function(e) {
            document.getElementById("statusSpan").appendChild(createStatusElement("nok", "Sorry, something went wrong.\n" + e));
        }).finally(function () {
    });
})

function initAutoComplete(artikelNrInputElementId, artikelBezeichnungInputElementId, positionPreisInputElementId, positionEinheitSelectElementId, positionBausteinSelectElementId) {
    const autoCompleteJS = new autoComplete({
        selector: "#" + artikelNrInputElementId,
        data: { src: allArticleData, keys: ["Nr", "Bezeichnung"] },
        resultItem: {
            highlight: true,
            //selected: "autoComplete_selected"
        },
        resultsList: {
            tabSelect : true,
        }
    });

    document.querySelector("#" + artikelNrInputElementId).addEventListener("selection", function (event) {
        if (event && event.detail && event.detail.selection && event.detail.selection.value) {
            fillArticleWithAutocompletion(
                positionBausteinSelectElementId,
                artikelNrInputElementId,
                artikelBezeichnungInputElementId,
                positionPreisInputElementId,
                positionEinheitSelectElementId,
                event.detail.selection.value.Nr,
                event.detail.selection.value.Bezeichnung,
                event.detail.selection.value.KalkPreis,
                event.detail.selection.value.Einheit);
        }
    });

    document.getElementById(artikelNrInputElementId).addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === "Tab") {
            const val = e.target.value.trim();
            // 1. In den aktuell geladenen Daten suchen
            let artikel = allArticleData.find(a => a.Nr.toLowerCase() === val.toLowerCase());
            if (artikel) {
                if (e.key === "Enter") {
                    e.preventDefault(); // verhindert, dass das Formular direkt abgeschickt wird
                }

                fillArticleWithAutocompletion(
                    positionBausteinSelectElementId,
                    artikelNrInputElementId,
                    artikelBezeichnungInputElementId,
                    positionPreisInputElementId,
                    positionEinheitSelectElementId,
                    artikel.Nr,
                    artikel.Bezeichnung,
                    artikel.KalkPreis,
                    artikel.Einheit);
                autoCompleteJS.close();
            }
        }
    });
}

function fillArticleWithAutocompletion(
    positionBausteinSelectElementId,
    artikelNrInputElementId,
    artikelBezeichnungInputElementId,
    positionPreisInputElementId,
    positionEinheitSelectElementId,
    artikelNrValue,
    artikelBezeichnungValue,
    artikelKalkpreisValue,
    artikelEinheitValue) {

    let positionBausteinElement = document.getElementById(positionBausteinSelectElementId);
    if (positionBausteinElement) {
        positionBausteinElement.value = "D";
    }

    let artikelNummerElement = document.getElementById(artikelNrInputElementId);
    if (artikelNummerElement) {
        artikelNummerElement.value = artikelNrValue;
    }

    let artikelBezeichnungElement = document.getElementById(artikelBezeichnungInputElementId);
    if (artikelBezeichnungElement) {
        artikelBezeichnungElement.value = artikelBezeichnungValue;
    }

    let preisElement = document.getElementById(positionPreisInputElementId);
    if (preisElement) {

        let preis = parseFloat(artikelKalkpreisValue);
        if (preis !== Number.NaN) {
            preisElement.value = preis.toFixed(2);
        }
    }

    let einheitElement = document.getElementById(positionEinheitSelectElementId);
    if (einheitElement) {
        let oldEinheitValue = einheitElement.value;
        let newEinheitValue = artikelEinheitValue;
        einheitElement.value = artikelEinheitValue;
        if (oldEinheitValue !== newEinheitValue) {
            einheitElement.dispatchEvent(new Event('change'));
        }
    }
}

var allArticleData = null;