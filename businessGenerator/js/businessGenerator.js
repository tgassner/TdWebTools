const BusinessTypes = Object.freeze({
    OFFER: Symbol("OFFER"),
    ORDER: Symbol("ORDER")
});


const isBlank = (str) => !str?.toString().trim();

const isEmptyOrZero = (val) => {
    const trimmed = String(val || "").trim();
    return trimmed === "" || trimmed === "0" || Number(trimmed) === 0;
};

function getBusinessObjectGermanName(businessObject) {
    switch (businessObject) {
        case BusinessTypes.OFFER:
            return "Angebot";
        case BusinessTypes.ORDER:
            return "Auftrag";
        default:
            return "undefiniertes Businessobject";
    }
}

function getBusinessObjectByGermanNameString(germanNameString) {
    switch (germanNameString) {
        case "Angebot":
            return BusinessTypes.OFFER;
        case "Auftrag":
            return BusinessTypes.ORDER;
        default:
            return null;
    }
}

function getBusinessObjectId(businessObject) {
    switch (businessObject) {
        case BusinessTypes.OFFER:
            return 32;
        case BusinessTypes.ORDER:
            return 33;
        default:
            return 0;
    }
}

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
    STUECK: Symbol("Stück"),
    QUADRATMETER: Symbol("m²"),
    METER: Symbol("m"),
    SET: Symbol("Set"),
    PAUSCHALE: Symbol("Pau"),
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

function isBusinessObjectStored() {
    return !isBlank(document.getElementById("BusinessNummer").value);
}

function isSketchAvailable() {
    return !signaturePad.isEmpty();
}

function sketchButtonsEnableDisable() {
    document.getElementById("saveSketchToErpButton").disabled = !(isBusinessObjectStored() && isSketchAvailable());
    document.getElementById("undoSketchButton").disabled = signaturePad.toData().length <= 0;
    document.getElementById("redoSketchButton").disabled = redoStack.length <= 0;
    document.getElementById("loadLocalSketchBackupButton").disabled = (!(localStorage.getItem(STORAGE_KEY_SKETCH)));
    document.getElementById("deleteSketchButton").disabled = (signaturePad.toData().length <= 0) && redoStack.length <= 0;
}

window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
    saveLocalBackup();
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
            let intValue = parseInt(pos.value, 10);
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
    let anzahl = (anzahlElement && anzahlElement.value && isNumeric(anzahlElement.value)) ? parseFloat(anzahlElement.value) : 0;
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

    if (!mengeElement || !preisElement || !anzahlElement) {
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

    document.getElementById("positionGesamtpreisInput" + posNumber).value =
        (mengeValueNumber * preisValueNumber * anzahlValueNumber) * rabattMultiplier;
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

function doCreateAngebotInERP() {
    if (doValidations()) {
        return;
    }
    const businessObjectJSON = doCreateBusinessObjectJson(BusinessTypes.OFFER);
    const jsonText = JSON.stringify(businessObjectJSON);
    sendJsonToAfpsHttpClient(jsonText, "createAngebot").then(response => {
        createBusinessObjectHandleRespopnse(response, BusinessTypes.OFFER, "erstellt");
    });
}

function doUpdateAngebotInERP() {
    if (doValidations()) {
        return;
    }
    const businessObjectJSON = doCreateBusinessObjectJson(BusinessTypes.OFFER);
    const jsonText = JSON.stringify(businessObjectJSON);
    sendJsonToAfpsHttpClient(jsonText, "updateAngebot").then(response => {
        createBusinessObjectHandleRespopnse(response, BusinessTypes.OFFER, "geupdated");
    });
}

function doCreateAuftragInERP() {
    if (doValidations()) {
        return;
    }
    const businessObjectJSON = doCreateBusinessObjectJson(BusinessTypes.ORDER);
    const jsonText = JSON.stringify(businessObjectJSON);
    sendJsonToAfpsHttpClient(jsonText, "createAuftrag").then(response => {
        createBusinessObjectHandleRespopnse(response, BusinessTypes.ORDER, "erstellt");
    });
}

function doUpdateAuftragInERP() {
    if (doValidations()) {
        return;
    }
    const businessObjectJSON = doCreateBusinessObjectJson(BusinessTypes.ORDER);
    const jsonText = JSON.stringify(businessObjectJSON);
    sendJsonToAfpsHttpClient(jsonText, "updateAuftrag").then(response => {
        createBusinessObjectHandleRespopnse(response, BusinessTypes.ORDER, "geupdated");
    });
}

function createBusinessObjectHandleRespopnse(response, businessObjectType, actionForUserMessage) {
    if (response) {
        if (response.ok) {
            if (response.value && response.value.attributes && response.value.attributes.result && response.value.attributes.result.value) {
                businessObjectCreatesInErpGuiAdaptions(response.value.attributes.result.value, businessObjectType);
                doLocalGuiFormValuesBackup();
                sketchButtonsEnableDisable();
            }
            addSuccessMessage("Hurra!!  " + getBusinessObjectGermanName(businessObjectType) + " erfolgreich in Sou.Matrixx " + actionForUserMessage);
        } else {
            if (response.pureMsg) {
                addErrorMessage("Sou.Matrixx meldet:\n" + response.pureMsg);
            } else if (response.msg) {
                addErrorMessage(response.msg);
            }
        }
    }
}

function businessObjectCreatesInErpGuiAdaptions(businessNummer, businessObjectType) {
    document.getElementById("sendOfferToERPButton").style.display = 'none';
    document.getElementById("sendOrderToERPButton").style.display = 'none';
    document.getElementById("BusinessNummer").value = businessNummer;
    document.getElementById("BusinessTypeGerman").style.display = "block";
    document.getElementById("BusinessTypeGerman").value = getBusinessObjectGermanName(businessObjectType);
    document.getElementById("BusinessType").value = Object(businessObjectType).description;
    document.getElementById("BusinessObjectId").value = getBusinessObjectId(businessObjectType);
    console.log(businessObjectType);
    switch (businessObjectType) {
        case BusinessTypes.OFFER:
            document.getElementById("updateOfferInERPButton").style.display = "inline-flex";
            break;
        case BusinessTypes.ORDER:
            document.getElementById("updateOrderInERPButton").style.display = "inline-flex";
            break;
    }
}

function doValidations() {
    document.getElementById("messageZoneDiv").replaceChildren();
    let valiationMessages = validateFormData();
    if (Array.isArray(valiationMessages) && valiationMessages.length > 0) {
        for (const valiationMessage of valiationMessages) {
            addWarningMessage(valiationMessage);
        }
        return true;
    }
    return false;
}

function validateFormData() {
    let valiationMessages = [];
    valiationMessages = valiationMessages.concat(validateArticle());
    console.log(valiationMessages);
    return valiationMessages;
}

function validateArticle() {
    let valiationMessages = [];
    let articles = parseArticlePositionsDomToJson();
    for (const article of articles) {
        if (isBlank(article["ArtikelNr"]) &&
            isBlank(article["Baustein"]) &&
            isBlank(article["Bezeichnung"]) &&
            isEmptyOrZero(article["Menge"]) &&
            isEmptyOrZero(article["Rabatt"]) &&
            isEmptyOrZero(article["Preis"]) &&
            isEmptyOrZero(article["Gesamtpreis"]) &&
            (isBlank(article["LangtextHtml"]) || article["LangtextHtml"] === "<p></p>")) {

            // wenn Artikel Position leer ist, einfach löschen und kein Theater machen...
            deletePosition(article["PosNr"]);
            continue;
        }

        if (isBlank(article["ArtikelNr"])) {
            valiationMessages.push("Artikel Position = " + article["PosNr"] + " hat keine Artikelnummer.");
        }
        if (isBlank(article["Baustein"])) {
            valiationMessages.push("Artikel Position = " + article["PosNr"] + " hat keinen Baustein.");
        }
    }
    return valiationMessages;
}

async function sendJsonToAfpsHttpClient(jsonText, action) {
    try {
        const response = await fetch('AfpsHttpClient.php?action=' + action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: jsonText
        });

        if (!response.ok) {
            return {ok: false, msg: "HTTP-Fehler! Status: " + response.status, value: []};
        }

        const jsonData = await response.json();
        console.log(jsonData);

        return jsonData;

    } catch (e) {
        return {ok: false, msg: "Verbindungsproblem:\n" + e.message, value: []};
    }
}

/*
function sendJsonToAfpsHttpClient(jsonText, action) {
    fetch('AfpsHttpClient.php?action=' + action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: jsonText
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP-Fehler! Status: ${res.status}`);
        }
        return res.json();
    })
    .then(function (res) {
        console.log(res);
    })
    .catch(function(e) {
        alert("Sorry, something went wrong.\n" + e);
        let ret = [];
        ret["ok"] = false;
        ret["msg"] = e;
        ret["value"] = [];
        return ret;
    })
    .finally(function () {
    //console.log();
    });
}
*/

function getInstanceFromAfpsHttpClient() {
    fetch('AfpsHttpClient.php?action=instanceInfo', {
        headers: {'Accept': 'application/json'}
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP-Fehler! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(function (res) {
            if (res && res.value && res.value.instance) {
                instanceAfpsHttpClient = res.value.instance;
            }
        })
        .catch(function (e) {
            console.log("Sorry, something went wrong. => AfpsHttpClient.php?action=instanceInfo");
            console.log(e);
        })
        .finally(function () {
            viewEnvironmentStatusAfpsHttpClient();
        });
}

function parseArticlePositionsDomToJson() {
    let posElementsDom = document.getElementsByName("positionHiddenPos");
    let posElementsJson = []
    if (posElementsDom) {
        posElementsDom.forEach(pos => {
            let posNumber = pos.value;

            // object position
            let posElement = {};

            posElement["PosNr"] = posNumber;
            posElement["Baustein"] = document.getElementById("positionBausteinSelect" + posNumber).value;
            posElement["ArtikelNr"] = document.getElementById("positionArtikelNrInput" + posNumber).value;
            posElement["Bezeichnung"] = document.getElementById("positionBezeichnungInput" + posNumber).value;
            posElement["FreieFelder"] = [];
            posElement["FreieFelder"].push({
                "Name": "PosLaenge",
                "Wert": document.getElementById("positionLengthInput" + posNumber).value
            });
            posElement["FreieFelder"].push({"Name": "PosLaengeEinheit", "Wert": "mm"});
            posElement["FreieFelder"].push({
                "Name": "PosBreite",
                "Wert": document.getElementById("positionWidthInput" + posNumber).value
            });
            posElement["FreieFelder"].push({"Name": "PosBreiteEinheit", "Wert": "mm"});
            posElement["FreieFelder"].push({
                "Name": "PosAnzahl",
                "Wert": document.getElementById("positionAnzahlInput" + posNumber).value
            });
            posElement["Menge"] = document.getElementById("positionMengeInput" + posNumber).value;
            posElement["Einheit"] = document.getElementById("positionEinheitSelect" + posNumber).value;
            posElement["Preis"] = document.getElementById("positionPreisInput" + posNumber).value;
            posElement["Rabatt"] = document.getElementById("positionRabattInput" + posNumber).value;
            posElement["Gesamtpreis"] = document.getElementById("positionGesamtpreisInput" + posNumber).value;
            posElement["LangtextHtml"] = processLangtextHtml(document.getElementById("posLangTextTextArea" + posNumber).value);
            posElement["MwStNr"] = "20"
            posElement["MwStSatz"] = "20";
            posElement["SachkontoNr"] = "4022";

            posElementsJson.push(posElement);
        })
    }
    return posElementsJson;
}

function doCreateBusinessObjectJson(businessType) {
    let businessObjectJSON = {};

    if (!businessType) {
        businessType = businessTypeFromString(document.getElementById("BusinessType")?.value);
    }

    switch (businessType) {
        case BusinessTypes.OFFER:
            businessObjectJSON["ObjectName"] = "Angebot";
            break;
        case BusinessTypes.ORDER:
            businessObjectJSON["ObjectName"] = "Auftrag";
            break;
        default:
            // alles Cool ist halt noch undefined...
            break; //return;
    }
    if (document.getElementById("BusinessNummer") && document.getElementById("BusinessNummer").value)
    {
        businessObjectJSON["Nr"] = document.getElementById("BusinessNummer").value;
    }
    if (document.getElementById("BusinessObjectId") && document.getElementById("BusinessObjectId").value)
    {
        businessObjectJSON["BusinessObjectId"] = document.getElementById("BusinessObjectId").value;
    }
    businessObjectJSON["Lieferzeit"] = document.getElementById("Lieferzeit").value;
    businessObjectJSON["Liefertermin"] = document.getElementById("Liefertermin").value;
    businessObjectJSON["IhreZeichen"] = document.getElementById("IhreZeichen").value;
    businessObjectJSON["GpartnerNr"] = document.getElementById("GpartnerNr").value;
    businessObjectJSON["MitarbeiterNr"] = document.getElementById("MitarbeiterNr").value;
    businessObjectJSON["ErstelltVon"] = document.getElementById("MitarbeiterNr").value;
    businessObjectJSON["LiefBedText"] = document.getElementById("LiefBedText").value;
    businessObjectJSON["Versandart"] = document.getElementById("Versandart").value;
    businessObjectJSON["Versandvermerk"] = document.getElementById("Versandvermerk").value;
    businessObjectJSON["ZahlBedText"] = document.getElementById("ZahlBedText").textContent;
    businessObjectJSON["ZahlBedText"] = document.getElementById('ZahlBedText').options[document.getElementById('ZahlBedText').selectedIndex].text;
    businessObjectJSON["ZahlTage"] = document.getElementById("ZahlBedText").value;

    // Artikel Positionen
    businessObjectJSON["pos"] = parseArticlePositionsDomToJson();

    // Adresse BEGIN
    let adresseJson = {};
    adresseJson["ApartnerName"] = document.getElementById("adresseApartnerName").value;
    adresseJson["Email"] = document.getElementById("adresseemail").value;
    adresseJson["Firma1"] = document.getElementById("adresseFirma1").value;
    adresseJson["Firma2"] = document.getElementById("adresseFirma2").value;
    adresseJson["Lkz"] = document.getElementById("adresseLkz").value;
    adresseJson["Ort"] = document.getElementById("adresseOrt").value;
    adresseJson["Plz"] = document.getElementById("adressePlz").value;
    adresseJson["Strasse"] = document.getElementById("adresseStrasse").value;
    adresseJson["Telefon"] = document.getElementById("adresseTel").value;
    businessObjectJSON["adresse"] = adresseJson;
    // Adresse END

    // Lieferanschrift BEGIN
    let lieferadresseJson = {};
    lieferadresseJson["ApartnerName"] = document.getElementById("lieferanschriftApartnerName").value;
    lieferadresseJson["Email"] = document.getElementById("lieferanschriftemail").value;
    lieferadresseJson["Firma1"] = document.getElementById("lieferanschriftFirma1").value;
    lieferadresseJson["Firma2"] = document.getElementById("lieferanschriftFirma2").value;
    lieferadresseJson["Lkz"] = document.getElementById("lieferanschriftLkz").value;
    lieferadresseJson["Ort"] = document.getElementById("lieferanschriftOrt").value;
    lieferadresseJson["Plz"] = document.getElementById("lieferanschriftPlz").value;
    lieferadresseJson["Strasse"] = document.getElementById("lieferanschriftStrasse").value;
    lieferadresseJson["Telefon"] = document.getElementById("lieferanschriftTel").value;
    businessObjectJSON["lieferadresse"] = lieferadresseJson;
    // Lieferanschrift END

    // Rechnungsanschrift BEGIN
    let rechnadresseJson = {};
    rechnadresseJson["ApartnerName"] = document.getElementById("rechnungsanschriftApartnerName").value;
    rechnadresseJson["Email"] = document.getElementById("rechnungsanschriftemail").value;
    rechnadresseJson["Firma1"] = document.getElementById("rechnungsanschriftFirma1").value;
    rechnadresseJson["Firma2"] = document.getElementById("rechnungsanschriftFirma2").value;
    rechnadresseJson["Lkz"] = document.getElementById("rechnungsanschriftLkz").value;
    rechnadresseJson["Ort"] = document.getElementById("rechnungsanschriftOrt").value;
    rechnadresseJson["Plz"] = document.getElementById("rechnungsanschriftPlz").value;
    rechnadresseJson["Strasse"] = document.getElementById("rechnungsanschriftStrasse").value;
    rechnadresseJson["Telefon"] = document.getElementById("rechnungsanschriftTel").value;
    businessObjectJSON["rechnadresse"] = rechnadresseJson;
    // Rechnungsanschrift END

    return businessObjectJSON;
}

function restoreFormDateFromJson(restoreJSON) {
    debugger;
    console.log("Recovery startet...");
    if (restoreJSON["ObjectName"]) {
        const businessObjectType = getBusinessObjectByGermanNameString(restoreJSON["ObjectName"] ?? "")
        if (businessObjectType) {
            businessObjectCreatesInErpGuiAdaptions(restoreJSON["Nr"] ?? "", businessObjectType);
        }
    }

    //document.getElementById("BusinessNummer").value = restoreJSON["Nr"] ?? "";
    document.getElementById("BusinessObjectId").value = restoreJSON["BusinessObjectId"] ?? "";
    document.getElementById("Lieferzeit").value = restoreJSON["Lieferzeit"] ?? "";
    document.getElementById("Liefertermin").value = restoreJSON["Liefertermin"] ?? "";
    document.getElementById("IhreZeichen").value = restoreJSON["IhreZeichen"] ?? "";
    document.getElementById("GpartnerNr").value = restoreJSON["GpartnerNr"] ?? "";
    document.getElementById("MitarbeiterNr").value = restoreJSON["MitarbeiterNr"] ?? "";
    document.getElementById("LiefBedText").value = restoreJSON["LiefBedText"] ?? "";
    document.getElementById("Versandart").value = restoreJSON["Versandart"] ?? "";
    document.getElementById("Versandvermerk").value = restoreJSON["Versandvermerk"] ?? "";
    setSelectByText("ZahlBedText", restoreJSON["ZahlBedText"] ?? "");

    // TODO article!!

    // Adresse BEGIN
    let adresseJson = restoreJSON["adresse"];
    document.getElementById("adresseApartnerName").value = adresseJson["ApartnerName"] ?? "";
    document.getElementById("adresseemail").value = adresseJson["Email"] ?? "";
    document.getElementById("adresseFirma1").value = adresseJson["Firma1"] ?? "";
    document.getElementById("adresseFirma2").value = adresseJson["Firma2"] ?? "";
    document.getElementById("adresseLkz").value = adresseJson["Lkz"] ?? "";
    document.getElementById("adresseOrt").value = adresseJson["Ort"] ?? "";
    document.getElementById("adressePlz").value = adresseJson["Plz"] ?? "";
    document.getElementById("adresseStrasse").value = adresseJson["Strasse"] ?? "";
    document.getElementById("adresseTel").value = adresseJson["Telefon"] ?? "";

    // Adresse END

    // Lieferanschrift BEGIN
    let lieferadresseJson = restoreJSON["lieferadresse"];
    document.getElementById("lieferanschriftApartnerName").value = lieferadresseJson["ApartnerName"] ?? "";
    document.getElementById("lieferanschriftemail").value = lieferadresseJson["Email"] ?? "";
    document.getElementById("lieferanschriftFirma1").value = lieferadresseJson["Firma1"] ?? "";
    document.getElementById("lieferanschriftFirma2").value = lieferadresseJson["Firma2"] ?? "";
    document.getElementById("lieferanschriftLkz").value = lieferadresseJson["Lkz"] ?? "";
    document.getElementById("lieferanschriftOrt").value = lieferadresseJson["Ort"] ?? "";
    document.getElementById("lieferanschriftPlz").value = lieferadresseJson["Plz"] ?? "";
    document.getElementById("lieferanschriftStrasse").value = lieferadresseJson["Strasse"] ?? "";
    document.getElementById("lieferanschriftTel").value = lieferadresseJson["Telefon"] ?? "";
    // Lieferanschrift END

    // Rechnungsanschrift BEGIN
    let rechnadresseJson = restoreJSON["rechnadresse"];
    document.getElementById("rechnungsanschriftApartnerName").value = rechnadresseJson["ApartnerName"] ?? "";
    document.getElementById("rechnungsanschriftemail").value = rechnadresseJson["Email"] ?? "";
    document.getElementById("rechnungsanschriftFirma1").value = rechnadresseJson["Firma1"] ?? "";
    document.getElementById("rechnungsanschriftFirma2").value = rechnadresseJson["Firma2"] ?? "";
    document.getElementById("rechnungsanschriftLkz").value = rechnadresseJson["Lkz"] ?? "";
    document.getElementById("rechnungsanschriftOrt").value = rechnadresseJson["Ort"] ?? "";
    document.getElementById("rechnungsanschriftPlz").value = rechnadresseJson["Plz"] ?? "";
    document.getElementById("rechnungsanschriftStrasse").value = rechnadresseJson["Strasse"] ?? "";
    document.getElementById("rechnungsanschriftTel").value = rechnadresseJson["Telefon"] ?? "";
    // Rechnungsanschrift END



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

    document.getElementById("BusinessTypeGerman").style.display = "none";
    document.getElementById("BusinessTypeGerman").value = "";
    document.getElementById("BusinessType").value = "";
    document.getElementById("BusinessObjectId").value =  "";

    document.getElementById("GpartnerNr").value = "20";

    document.getElementById("lieferTerminFormElementDiv").style.display = "";
    document.getElementById("lieferZeitFormElementDiv").style.display = "";
    document.getElementById("ihreZeichenFormElementDiv").style.display = "";

    document.getElementById("sendOfferToERPButton").style.display = "inline-flex";
    document.getElementById("sendOrderToERPButton").style.display = "inline-flex";
    document.getElementById("updateOfferInERPButton").style.display = "none";
    document.getElementById("updateOrderInERPButton").style.display = "none";

    onClickAdresseReiter();

    onClickMainTabBusinessDaten();

    addPosition();

    clearCanvas();

    localStorage.removeItem(STORAGE_KEY_FORM_DATA);

    document.getElementById("messageZoneDiv").replaceChildren();
    sketchButtonsEnableDisable();
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

function onClickMainTabBusinessDaten() {
    switchReiterMainTab("mainTabTabButtonBusinessWerteDiv", "tabContentBusinessWerteDiv");
}

function onClickMainTabAdressen() {
    switchReiterMainTab("mainTabTabButtonAdressenDiv", "tabContentAdressenDiv");
}

function onClickMainTabArtikel() {
    switchReiterMainTab("mainTabTabButtonArtikelDiv", "tabContentArtikelDiv");
}

function onClickMainTabZeichnung() {
    switchReiterMainTab("mainTabTabButtonZeichnungDiv", "tabContentZeichnungDiv");
    resizeCanvas();
}

function switchReiterMainTab(idOfEnabledButtons, idOfEnabledContent) {
    document.getElementById("mainTabTabButtonBusinessWerteDiv").classList.remove("reiterSelectedElementDiv");
    document.getElementById("mainTabTabButtonAdressenDiv").classList.remove("reiterSelectedElementDiv");
    document.getElementById("mainTabTabButtonArtikelDiv").classList.remove("reiterSelectedElementDiv");
    document.getElementById("mainTabTabButtonZeichnungDiv").classList.remove("reiterSelectedElementDiv");
    document.getElementById(idOfEnabledButtons).classList.add("reiterSelectedElementDiv");

    document.getElementById("tabContentBusinessWerteDiv").style.display = "none";
    document.getElementById("tabContentAdressenDiv").style.display = "none";
    document.getElementById("tabContentArtikelDiv").style.display = "none";
    document.getElementById("tabContentZeichnungDiv").style.display = "none";
    document.getElementById(idOfEnabledContent).style.display = "";
}

function createStatusElement(status, tooltip, text) {
    let okElementContainer = document.createElement('span');
    let okElementColor = document.createElement('span');
    let okElementInfoText = document.createElement('span');
    switch (status) {
        case "ok":
            okElementColor.style.color = "#AFC80A";
            break;
        case "nok":
            okElementColor.style.color = "#FF0000";
            break;
        default:
            okElementColor.style.color = "#000000";
            break;
    }
    okElementColor.title = tooltip;
    okElementColor.innerHTML = "&#xFFED;";
    okElementContainer.appendChild(okElementColor);
    if (text) {
        okElementInfoText.innerHTML = "&nbsp;" + text;
        okElementInfoText.style.fontWeight = "bold";
        okElementContainer.appendChild(okElementInfoText);
    }
    return okElementContainer;
}

function viewEnvironmentStatusSouDbService() {
    let environment = instanceSouDbService ? instanceSouDbService : "";
    if (environment === "PROD") {
        document.getElementById("statusSpanEnvironmentSouDbService").appendChild(createStatusElement("ok", "SouDbService Production Environment", ""));
    } else if (environment === "TEST") {
        document.getElementById("statusSpanEnvironmentSouDbService").appendChild(createStatusElement("ok", " *** SouDbService Test System *** ", " *** SouDbService Test System *** "));
    } else {
        document.getElementById("statusSpanEnvironmentSouDbService").appendChild(createStatusElement("nok", "Sorrry, No valid SouDbService Environent Data could be loaded - something went wrong: " + environment));
    }
}

function viewEnvironmentStatusAfpsHttpClient() {
    let environment = instanceAfpsHttpClient ? instanceAfpsHttpClient : "";
    if (environment === "PROD") {
        document.getElementById("statusSpanEnvironmentAfpsHttpClient").appendChild(createStatusElement("ok", "AfpsHttpClient Production Environment", ""));
    } else if (environment === "TEST") {
        document.getElementById("statusSpanEnvironmentAfpsHttpClient").appendChild(createStatusElement("ok", " *** AfpsHttpClient Test System *** ", " *** AfpsHttpClient Test System *** "));
    } else {
        document.getElementById("statusSpanEnvironmentAfpsHttpClient").appendChild(createStatusElement("nok", "Sorrry, No valid AfpsHttpClient Environent Data could be loaded - something went wrong: " + environment));
    }
}

function initAutoComplete(artikelNrInputElementId, artikelBezeichnungInputElementId, positionPreisInputElementId, positionEinheitSelectElementId, positionBausteinSelectElementId) {
    const autoCompleteJS = new autoComplete({
        selector: "#" + artikelNrInputElementId,
        data: {src: allArticleData, keys: ["Nr", "Bezeichnung"]},
        resultItem: {
            highlight: true,
            //selected: "autoComplete_selected"
        },
        resultsList: {
            tabSelect: true,
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

/* ================= Canvas Setup ================= */

var canvas;
var signaturePad;

function resizeCanvas() {
    console.log("resize");
    const data = signaturePad.toData();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
    signaturePad.clear();
    signaturePad.fromData(data);
}

/* ================= Undo / Redo ================= */

let redoStack = [];

function saveState() {
    redoStack = [];
    saveLocalBackup();
    sketchButtonsEnableDisable();
}


function undo() {
    const data = signaturePad.toData();
    if (data.length > 0) {
        redoStack.push(data.pop()); // Entfernt den letzten Strich aus dem Array
        signaturePad.fromData(data); // Zeichnet die verbleibenden Striche neu
    }
    saveLocalBackup();
    sketchButtonsEnableDisable();
}

function redo() {
    if (!redoStack.length) return;
    const data = signaturePad.toData();
    data.push(redoStack.pop());
    signaturePad.fromData(data);
    saveLocalBackup();
    sketchButtonsEnableDisable();
}

/* ================= Farben ================= */

function setColor(color) {
    signaturePad.penColor = color;
}

/* ================= Clear ================= */

function clearCanvas() {
    saveState();
    signaturePad.clear();
    redoStack = [];
    saveLocalBackup();
    sketchButtonsEnableDisable();
}

/* ================= LocalStorage Backup ================= */

const STORAGE_KEY_SKETCH = "kundenskizze_backup";
const STORAGE_KEY_FORM_DATA = "formdata_backup";

function saveLocalBackup() {
    const meinSkizzenData = signaturePad.toData();
    if (meinSkizzenData.length > 0 || redoStack.length > 0) {
        localStorage.setItem(STORAGE_KEY_SKETCH, JSON.stringify(meinSkizzenData));
    } else {
        localStorage.removeItem(STORAGE_KEY_SKETCH);
    }
}

function loadLocalBackup() {
    const gespeicherterString = localStorage.getItem(STORAGE_KEY_SKETCH);
    if (gespeicherterString && gespeicherterString !== "undefined" && gespeicherterString !== "null") {
        const datenObjekt = JSON.parse(gespeicherterString);
        signaturePad.fromData(datenObjekt);
    }
}

/* ================= Netzwerk-Upload ================= */

function sendSketch() {

    if (!isSketchAvailable()) {
        addWarningMessage("Keine Skizze vorhanden");
        return;
    }

    const businessNr = document.getElementById("BusinessNummer") ? document.getElementById("BusinessNummer").value : "";

    if (isBlank(businessNr)) {
        addWarningMessage("Skizze nicht gespeichert! - geht erst, wenn das BusinessObjekt gespeichert ist.");
        return;
    }

    const dataURL = canvas.toDataURL("image/jpeg", 0.9);

    const businessObjectJSON = {};
    businessObjectJSON["BusinessObjectNr"] = document.getElementById("BusinessNummer").value;
    businessObjectJSON["AnlageDateiName"] = "Skizze.jpg";
    businessObjectJSON["Binary"] = "Skizze.jpg";
    businessObjectJSON["DataURL"] = dataURL;
    businessObjectJSON["BusinessObjectId"] = document.getElementById("BusinessObjectId").value;

    const jsonText = JSON.stringify(businessObjectJSON);

    sendJsonToAfpsHttpClient(jsonText, "updateAnlage").then(response => {
        if (response) {
            if (response.ok) {
                addSuccessMessage("Hurra Skizze erfolgreich in Sou.Matrixx gespeichert.");
            } else {
                saveLocalBackup();
                if (response.pureMsg) {
                    addErrorMessage("Sou.Matrixx meldet:\n" + response.pureMsg);
                } else if (response.msg) {
                    addErrorMessage(response.msg);
                }
            }
        }
    });
}

var instanceSouDbService = "UNDEFINED";
var instanceAfpsHttpClient = "UNDEFINED";

function doLocalGuiFormValuesBackup() {
    localStorage.setItem(STORAGE_KEY_FORM_DATA, JSON.stringify(doCreateBusinessObjectJson(null)));
}

document.addEventListener("DOMContentLoaded", function () {
    console.log(
        "window.screen= " + window.screen.width + " x " + window.screen.height + "\n" +
        "window.inner= " + window.innerWidth + " x " + window.innerHeight + "\n" +
        "document.documentElement.client= " + document.documentElement.clientWidth + " x " + document.documentElement.clientHeight + "\n" +
        "document.body.client= " + document.body.clientWidth + " x " + document.body.clientHeight);

    getInstanceFromAfpsHttpClient();

    fetch("ArticleServiceRemoteCall.php?action=findAllProducts") // Call the fetch function passing the url of the API as a parameter
        .then(res => res.json())
        .then(function (res) {
            let ok = res.ok;
            let value = res.value;
            let msg = res.msg;
            instanceSouDbService = res.instance;

            if (!ok) {
                document.getElementById("statusSpan").appendChild(createStatusElement("nok", msg, ""));
                return;
            }

            viewEnvironmentStatusSouDbService();
            fillMitarbeiterSelect();

            allArticleData = value;

            document.getElementById("statusSpan").appendChild(createStatusElement("ok", "Article Data loaded Successfully!", ""));
            addPosition();
        })
        .catch(function (e) {
            document.getElementById("statusSpan").appendChild(createStatusElement("nok", "Sorry, Article prefetch not possible - something went wrong.\n" + e, ""));
        }).finally(function () {
    });

    document.getElementById("tabContentZeichnungDiv").style.display = "";
    canvas = document.getElementById("canvasSketch");

    signaturePad = new SignaturePad(canvas, {
        minWidth: 1,
        maxWidth: 2,
        penColor: "black",
        backgroundColor: 'rgba(255, 255, 255, 1)'
    });

    signaturePad.addEventListener("endStroke", saveState);

    resizeCanvas();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resizeCanvas(); // Deine Funktion von vorhin
        }, 200); // Wartet 200ms, bis der User fertig mit Ziehen ist
    });

    document.getElementById("tabContentZeichnungDiv").style.display = "none";
    document.getElementById("loadLocalSketchBackupButton").disabled = (!(localStorage.getItem(STORAGE_KEY_SKETCH)));


    const savedLocalFormDateValues = localStorage.getItem(STORAGE_KEY_FORM_DATA);
    if (savedLocalFormDateValues && savedLocalFormDateValues !== "undefined" && savedLocalFormDateValues !== "null") {
        restoreFormDateFromJson(JSON.parse(savedLocalFormDateValues));
    }

    // local storage Form Data backup if browser gets killed or something else...
    let saveLocalFormDataTimeout;
    document.addEventListener('input', () => {
        clearTimeout(saveLocalFormDataTimeout);
        // Erst wenn der User 500ms nicht mehr tippt, speichern wir
        saveLocalFormDataTimeout = setTimeout(() => {
            doLocalGuiFormValuesBackup();
        }, 500);
    });
})

function fillMitarbeiterSelect() {
    const mitarbeiter = {
        'Ludwig': {'prod': 'LST', 'test': '0045'},
        'Richard': {'prod': 'RRI', 'test': '0025'},
        'Silvia': {'prod': 'SSC', 'test': '0003'},
        'Martina': {'prod': 'MMU', 'test': '0018'},
        'Wolfgang': {'prod': 'WPU', 'test': '0044'}
    };

    let mitarbeiterNrSelect = document.getElementById("MitarbeiterNr");
    let environment = instanceSouDbService ? instanceSouDbService : "";

    for (let name in mitarbeiter) {
        let mitarbeiterSingle = mitarbeiter[name];
        let mrNr = "";

        if (environment === "PROD") {
            mrNr = mitarbeiterSingle.prod;
        } else if (environment === "TEST") {
            mrNr = mitarbeiterSingle.test;
        } else {
            mrNr = "0815";
        }

        let option = document.createElement('option')
        option.textContent = name;
        option.value = mrNr;
        mitarbeiterNrSelect.appendChild(option);
    }

    const savedLocalFormDateValues = localStorage.getItem(STORAGE_KEY_FORM_DATA);
    if (savedLocalFormDateValues && savedLocalFormDateValues !== "undefined" && savedLocalFormDateValues !== "null") {
            document.getElementById("MitarbeiterNr").value = JSON.parse(savedLocalFormDateValues)["MitarbeiterNr"] ?? "";
    }
 }

function addSuccessMessage(text) {
    addMessage(
        "<svg viewBox='0 0 24 24' width='18' height='18' stroke='currentColor' stroke-width='3' fill='none' style='margin-right: 8px; vertical-align: middle;'>\n" +
        "    <polyline points='20 6 9 17 4 12'></polyline>\n" +
        "</svg>" +
        text, "messageSuccessDivClass", 6000);
}

function addWarningMessage(text) {
    addMessage(text, "messageWarningDivClass")
}

function addErrorMessage(text) {
    addMessage(text, "messageErrorDivClass")
}

function addMessage(text, className, autoCloseDurationMS = 0) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(className);
    const messageSpan = document.createElement("span");
    messageDiv.prepend(messageSpan);
    messageSpan.innerHTML = text;
    const messageCloseButton = document.createElement("button");
    messageDiv.appendChild(messageCloseButton);
    messageCloseButton.classList.add("messageCloseButtonClass");
    messageCloseButton.innerHTML =
        "<svg viewBox='0 0 24 24' width='18' height='18' stroke='currentColor' stroke-width='2' fill='none'>\n" +
        "        <line x1='18' y1='6' x2='6' y2='18'></line>\n" +
        "        <line x1='6' y1='6' x2='18' y2='18'></line>\n" +
        "</svg>";
    document.getElementById("messageZoneDiv").prepend(messageDiv);

    // Autoclose Timer
    let autoCloseTimer;
    if (autoCloseDurationMS > 0) {
        autoCloseTimer = setTimeout(() => {
            fadeOutAndRemove(messageDiv);
        }, autoCloseDurationMS);
    }

    messageCloseButton.addEventListener('click', function() {
        if (autoCloseDurationMS > 0 && autoCloseTimer) {
            clearTimeout(autoCloseTimer); // Timer stoppen, falls manuell geschlossen wird
        }
        fadeOutAndRemove(messageDiv);
    });
}

function fadeOutAndRemove(element) {
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    element.style.opacity = '0';
    element.style.transform = 'translateY(-10px)';

    // Warten, bis die Animation fertig ist, dann aus dem DOM löschen
    setTimeout(() => element.remove(), 500);
}

function setSelectByText(selectId, textToFind) {
    const el = document.getElementById(selectId);
    if (!el || textToFind === undefined || textToFind === null) return;

    const textNormalisiert = textToFind.trim();

    // Wir suchen den Index (die Position) der Option
    let foundIndex = -1;
    for (let i = 0; i < el.options.length; i++) {
        if (el.options[i].text.trim() === textNormalisiert) {
            foundIndex = i;
            break;
        }
    }

    if (foundIndex !== -1) {
        el.selectedIndex = foundIndex;

        // Event feuern nicht vergessen
        //el.dispatchEvent(new Event('change'));
    } else {
        console.warn(`Text "${textToFind}" im Dropdown ${selectId} nicht gefunden.`);
    }
}