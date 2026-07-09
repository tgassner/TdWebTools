<?php // TODO: Check auf illegale Eingaben samt Warnungen?>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Fenstereinsatz Generator</title>

    <script src="lib/browser.maker.js"></script>
    <script src="lib/bezier.js"></script>
    <script src="lib/opentype.js"></script>

    <link rel="icon" href="img/favicon114.png" sizes="32x32" />
    <link rel="icon" href="img/favicon114.png" sizes="192x192" />
    <link rel="apple-touch-icon" href="img/favicon114.png" />
    <meta name="msapplication-TileImage" content="img/favicon114.png" />

    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />

    <script type="text/javascript">
        var makerjs = require('makerjs');
    </script>

    <style>
        body { font-family: sans-serif; }
        div#allContent { display: flex; flex-direction: row; }
        div#guiElements {display: flex; flex-direction: column;}
        div#settings {
            display: flex;
            flex-direction: column;
            gap: 15px;
            width: 350px;
            padding: 20px;
        }
        div.form-row {display:flex; flex-direction: row; align-items: center;}
        .form-row label,
        .form-row .input-unit-wrapper,
        .form-row .checkbox-wrapper {
            box-sizing: border-box;
            display: flex;
            justify-content: start;
        }

        .form-row .input-unit-wrapper,
        .form-row .checkbox-wrapper {
            flex-basis: 30%;
        }

        .form-row label {
            padding-right: 10px;
            flex-basis: 70%;
        }

        .input-unit-wrapper input {
            flex-grow: 1;
            width: 100%;
        }

        .input-unit-wrapper {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .form-checkbox {
            width: max-content;
            margin-right: auto;
            transform: scale(1.2);
            cursor: pointer;
            margin: 0;
        }

        .optionalSecondHole {
            display: none !important;
        }

        #settings.show-second-hole .optionalSecondHole {
            display: flex !important;
        }

        div#inleyPreviewDiv {
            display: flex;
            max-height: 600px;
            width: 100%;
            overflow: hidden;
        }

        #backgroundDiv {
            max-height: 100%;
            width: 100%;
        }

        #contentDiv {
            height: 600px;
            max-height: 600px;
            box-sizing: border-box;
            display: flex;
            justify-content: start;
            align-items: center;
            padding: 22px;
        }

        #preViewSvg {
            width: auto !important;
            height: auto !important;
            max-height: 100%;
            max-width: 100%;
            object-fit: contain;
            display: block;
        }

        svg#preViewSvg [id^="cuts"] path,
        svg#preViewSvg path[id^="cuts"] {
            stroke: #000000 !important;
            stroke-width: 0.5mm !important;
            stroke-dasharray: none !important;
        }

        svg#preViewSvg [id^="referenceLines"] path,
        svg#preViewSvg path[id^="referenceLines"] {
            stroke: #007bff !important;
            stroke-width: 0.25mm !important;
            stroke-dasharray: 4, 4 !important;
        }

        svg#preViewSvg [id^="dimensioning"] path,
        svg#preViewSvg path[id^="dimensioning"] {
            stroke: #007bff !important;
            stroke-width: 0.3mm !important;
            stroke-dasharray: none !important;
            fill: none !important;
        }

        #downloadRow button,
        #resetRow button{
            background-color: #ffffff;
            color: #333333;
            border: 1.5px solid #bdc3c7;
            border-radius: 6px;
            padding: 10px 15px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        #downloadRow button:hover {
            background-color: #2c3e50;
            color: #ffffff;
            border-color: #2c3e50;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transform: translateY(-1px); /* Bewegt den Button minimal nach oben */
        }

        #downloadRow button:active {
            transform: translateY(1px);
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
    </style>
</head>
<body style="margin: 0px; ">
<div style="display: flex; flex-flow: row; background-color: #ffdc14; background: linear-gradient(135deg, rgba(255,205,0,1) 0%, rgba(255,220,20,1) 35%, rgba(255,205,0,1) 100%);padding-left: 20px; justify-content: space-between;height:100px">
    <div style="display: flex; flex-flow: column;">
        <h1 style="display: flex;margin-top: 5px;margin-bottom: 2px;font-family: Khand, Helvetia, Arial, sans-serif; font-size: 34px; font-weight: 600; color:#000000;">Fenstereinsatz Generator</h1>
        <div style="display: flex; margin-top: 0px;margin-bottom: 15px;">Version 0.9&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;09.07.2026 by Gassi</div>
    </div>
    <img src="img/td_header.png" height="150px" style="display: flex; justify-content: right; align-self: center;filter: drop-shadow(8px 8px 40px #FFB214);">
</div>

<div id="allContent">
    <div id="guiElements" style="width: fit-content">
        <div id="settings">
            <div class="form-row">
                <label for="insetWidth"> Einsatz Breite: </label>
                <div class="input-unit-wrapper">
                    <input type="number" id="insetWidth" onchange="updateParam('insetWidth')" />
                    <span class="unit">mm</span>
                </div>
            </div>
            <div class="form-row">
                <label for="insetHeight"> Einsatz Höhe: </label>
                <div class="input-unit-wrapper">
                    <input type="number" id="insetHeight" onchange="updateParam('insetHeight')">
                    <span class="unit">mm</span>
                </div>
            </div>
            <div class="form-row">
                <label for="distanceX1">↦ Abstand X (von links) </label>
                <div class="input-unit-wrapper">
                    <input type="number" id="distanceX1" onchange="updateParam('distanceX1')">
                    <span class="unit">mm</span>
                </div>
            </div>
            <div class="form-row">
                <label for="distanceY1">↧ Abstand Y (von oben) </label>
                <div class="input-unit-wrapper">
                    <input type="number" id="distanceY1" onchange="updateParam('distanceY1')">
                    <span class="unit">mm</span>
                </div>
            </div>
            <div class="form-row">
                <label for="hole1Diameter">⌀ Durchmesser des Auslasses</label>
                <div class="input-unit-wrapper">
                    <input type="number" id="hole1Diameter" onchange="updateParam('hole1Diameter')">
                    <span class="unit">mm</span>
                </div>
            </div>
            <div class="form-row">
                <label for="secondHole">2️⃣ Zweites Loch:</label>
                <div class="checkbox-wrapper">
                    <input type='checkbox' id='secondHole' class="form-checkbox" onChange='secondHoleChanged()'>
                </div>
            </div>
            <div class="form-row optionalSecondHole">
                <label for="distanceX2">↦ Abstand X (von links) 2. Loch</label>
                <div class="input-unit-wrapper">
                    <input type="number" id="distanceX2" onchange="updateParam('distanceX2')">
                    <span class="unit">mm</span>
                </div>
            </div>
            <div class="form-row optionalSecondHole">
                <label for="distanceY2">↧ Abstand Y (von oben) 2. Loch</label>
                <div class="input-unit-wrapper">
                    <input type="number" id="distanceY2" onchange="updateParam('distanceY2')">
                    <span class="unit">mm</span>
                </div>
            </div>
            <div class="form-row optionalSecondHole">
                <label for="hole2Diameter">⌀ Durchmesser des 2. Auslasses</label>
                <div class="input-unit-wrapper">
                    <input type="number" id="hole2Diameter" onchange="updateParam('hole2Diameter')">
                    <span class="unit">mm</span>
                </div>
            </div>

            <div id="infoMessage" class="form-row"></div>

            <div class="form-row" style="flex-direction: column; align-items: flex-start; gap: 5px;">
                <span style="width: 100%; text-align: left;">📁 XML Datei importieren:</span>
                <div id="dropZone" style="width: 100%; height: 100px; border: 2px dashed #999; border-radius: 6px; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #fafdff; cursor: pointer; transition: all 0.2s ease; box-sizing: border-box; padding: 10px;" onclick="document.getElementById('xmlImport').click()">
                    <span style="font-size: 24px; margin-bottom: 5px;">📥</span>
                    <span style="font-size: 13px; color: #555; text-align: center;">Datei hierher ziehen oder anklicken</span>
                </div>
                <input type="file" id="xmlImport" accept=".xml" onchange="importXMLFile(this)" style="display: none;">
            </div>

            <div class="form-row" id="positionSelectRow" style="display: none; flex-direction: column; background-color: #f0f0f0; padding: 10px; border-radius: 4px; margin-bottom: 10px">
                <label for="positionSelect" style="margin-bottom: 10px; width: 100%">🎯 Ausgewählte Position:</label>
                <div class="input-unit-wrapper" style="width: 100%">
                    <select id="positionSelect" onchange="selectPosition(this.value)" style="width: 100%;"></select>
                </div>
            </div>

            <div class="form-row" id="resetRow" style="display: none; background-color: cornsilk; padding: 20px; border-radius: 4px; margin-bottom: 10px; gap: 10px;">
                <button id="resetButton" onclick="doReset()" style="width: 100%" title="reset"> RESET file input data, leave values</button>
            </div>

            <div class="form-row" id="downloadRow" style="background-color: cornsilk; padding: 20px; border-radius: 4px; margin-bottom: 10px; gap: 10px;">
                <button id="downloadDXF" onclick="downloadDXF()" style="flex-basis: 50%" title="Generiere und download eine DXF Datei."> DXF Download</button>
                <button id="downloadSVG" onclick="downloadSVG()" style="flex-basis: 50%" title="Generiere und download eine SVG Datei"> SVG Download</button>
            </div>
        </div>
    </div>
    <div id="inleyPreviewDiv">
        <div id='backgroundDiv'>
            <div id='contentDiv'></div>
        </div>
    </div>
</div>

<script type="text/javascript">
    var makerjs = require('makerjs');
    var font;
    var model;
    var parsedXmlPositions = [];

    var metadata = {
        insetWidth: 800,
        insetHeight: 1000,
        distanceX1: 200,
        distanceY1: 200,
        hole1Diameter: 200,
        secondHole: false,
        distanceX2: 600,
        distanceY2: 250,
        hole2Diameter: 200,
        customerName: "",
        orderNumber: "",
        posNr: "",
    }

    document.addEventListener("DOMContentLoaded", function () {
        fetch('fonts/osifont.woff')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Netzwerk-Antwort war nicht ok: " + response.statusText);
                }
                return response.arrayBuffer();
            })
            .then(buffer => {
                font = opentype.parse(buffer);
                model = createModel();
                drawPreview();

                const focusElement = document.getElementById('insetWidth');
                if (focusElement) focusElement.focus();
            })
            .catch(err => {
                console.error("Schriftart konnte nicht geladen werden:", err);
                alert("Fehler beim Laden der Schriftart: " + err.message);
            });

        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('xmlImport');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.style.backgroundColor = "#e1f5fe";
                dropZone.style.borderColor = "#007bff";
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.style.backgroundColor = "#fafdff";
                dropZone.style.borderColor = "#999";
            }, false);
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                fileInput.files = files;
                importXMLFile(fileInput);
            }
        }, false);

        metadataToGuiElements();
        model = createModel();
        drawPreview();
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function createModel() {
        var modelLocal = {
            paths: {},
            models: {
                cuts: {
                    layer: "cuts",
                    paths: {
                        hole1 : new makerjs.paths.Circle([metadata.distanceX1, metadata.insetHeight - metadata.distanceY1], (metadata.hole1Diameter / 2)),
                    },
                    models: {
                        inlay: new makerjs.models.Rectangle(metadata.insetWidth, metadata.insetHeight),
                    }
                },
                referenceLines: {
                    layer: "referenceLines",
                    paths: {},
                    models: {}
                },
                dimensioning: {
                    layer: "dimensioning",
                    paths: {},
                    models: {}
                }
            }
        };

        if (metadata.secondHole) {
            modelLocal.models.cuts.paths.hole2 = new makerjs.paths.Circle(
                [metadata.distanceX2, metadata.insetHeight - metadata.distanceY2],
                (metadata.hole2Diameter / 2)
            );
        }

        let yPosPrimaryHoleCenter1 = metadata.insetHeight - metadata.distanceY1; // Vertikale Mitte des Lochs
        modelLocal.models.referenceLines.paths.lineX1 = new makerjs.paths.Line(
            [0, yPosPrimaryHoleCenter1],
            [metadata.distanceX1, yPosPrimaryHoleCenter1]
        );

        if (font) {
            modelLocal.models.dimensioning.models.textX1 = new makerjs.models.Text(font, metadata.distanceX1 + " mm", 30, false, false, 0);
            makerjs.model.move(modelLocal.models.dimensioning.models.textX1, [metadata.distanceX1 - (metadata.hole1Diameter / 2) - 55, yPosPrimaryHoleCenter1 + 5]);
        }

        // hilfslinie zum primären Loch Y
        modelLocal.models.referenceLines.paths.lineY1 = new makerjs.paths.Line(
            [metadata.distanceX1, metadata.insetHeight],
            [metadata.distanceX1, yPosPrimaryHoleCenter1]
        );

        if (font) {
            modelLocal.models.dimensioning.models.textY1 = new makerjs.models.Text(font, metadata.distanceY1 + " mm", 30, false, false, 0);
            makerjs.model.rotate(modelLocal.models.dimensioning.models.textY1, 89);
            makerjs.model.move(modelLocal.models.dimensioning.models.textY1, [metadata.distanceX1 - 5, metadata.insetHeight - (metadata.distanceY1 / 2) - 55]);
        }


        let xCenter1 = metadata.distanceX1;
        let yCenter1 = metadata.insetHeight - metadata.distanceY1; // MakerJS Y-Achse beachten!
        let diameter1 = metadata.hole1Diameter / 2;

        // Da cos(45°) und sin(45°) identisch mit Math.sqrt(0.5) sind:
        let delta1 = diameter1 * Math.sqrt(0.5);

        // hilfslinie Durchmesser
        modelLocal.models.referenceLines.paths.diameterLine = new makerjs.paths.Line(
            [xCenter1 - delta1, yCenter1 - delta1],
            [xCenter1 + delta1, yCenter1 + delta1]
        );

        if (font) {
            modelLocal.models.dimensioning.models.textDiameter1 = new makerjs.models.Text(font, metadata.hole1Diameter + " mm", 30, false, false, 0);
            makerjs.model.rotate(modelLocal.models.dimensioning.models.textDiameter1, 45);
            makerjs.model.move(modelLocal.models.dimensioning.models.textDiameter1, [xCenter1 - 10, yCenter1 - 50]);
        }


        if (metadata.secondHole) {
            // hilfslinie zum secundären Loch X
            let yPosPrimaryHoleCenter2 = metadata.insetHeight - metadata.distanceY2; // Vertikale Mitte des Lochs
            modelLocal.models.referenceLines.paths.lineX2 = new makerjs.paths.Line(
                [0, yPosPrimaryHoleCenter2],
                [metadata.distanceX2, yPosPrimaryHoleCenter2]
            );

            if (font) {
                modelLocal.models.dimensioning.models.textX2 = new makerjs.models.Text(font, metadata.distanceX2 + " mm", 30, false, false, 0);
                makerjs.model.move(modelLocal.models.dimensioning.models.textX2, [metadata.distanceX2 - (metadata.hole2Diameter / 2) - 55, yPosPrimaryHoleCenter2 + 5]);
            }

            // hilfslinie zum primären Loch Y
            modelLocal.models.referenceLines.paths.lineY2 = new makerjs.paths.Line(
                [metadata.distanceX2, metadata.insetHeight],
                [metadata.distanceX2, yPosPrimaryHoleCenter2]
            );

            if (font) {
                modelLocal.models.dimensioning.models.textY2 = new makerjs.models.Text(font, metadata.distanceY2 + " mm", 30, false, false, 0);
                makerjs.model.rotate(modelLocal.models.dimensioning.models.textY2, 89);
                makerjs.model.move(modelLocal.models.dimensioning.models.textY2, [metadata.distanceX2 - 5, metadata.insetHeight - (metadata.distanceY2 / 2) - 55]);
            }


            let xCenter2 = metadata.distanceX2;
            let yCenter2 = metadata.insetHeight - metadata.distanceY2;
            let diameter2 = metadata.hole2Diameter / 2;

            // Da cos(45°) und sin(45°) identisch mit Math.sqrt(0.5) sind:
            let delta2 = diameter2 * Math.sqrt(0.5);

            // hilfslinie Durchmesser
            modelLocal.models.referenceLines.paths.diameterLine = new makerjs.paths.Line(
                [xCenter2 - delta2, yCenter2 - delta2],
                [xCenter2 + delta2, yCenter2 + delta2]
            );

            if (font) {
                modelLocal.models.dimensioning.models.textDiameter2 = new makerjs.models.Text(
                    font,
                    metadata.hole2Diameter + " mm",
                    30, // Schriftgröße in mm
                    false, false, 0
                );
                makerjs.model.rotate(modelLocal.models.dimensioning.models.textDiameter2, 45);
                makerjs.model.move(modelLocal.models.dimensioning.models.textDiameter2, [xCenter2 - 10, yCenter2 - 50]);
            }
        }

        modelLocal.models.referenceLines.paths.lineWidth = new makerjs.paths.Line(
            [0, 8],
            [metadata.insetWidth, 8]
        );

        if (font) {
            modelLocal.models.dimensioning.models.lineWidth = new makerjs.models.Text(font, metadata.insetWidth + " mm", 30, false, false, 0);
            makerjs.model.move(modelLocal.models.dimensioning.models.lineWidth, [metadata.insetWidth / 2 -50, 15]);
        }

        modelLocal.models.referenceLines.paths.lineHeight = new makerjs.paths.Line(
            [metadata.insetWidth - 8, 0],
            [metadata.insetWidth - 8, metadata.insetHeight]
        );

        if (font) {
            modelLocal.models.dimensioning.models.lineHeight = new makerjs.models.Text(font, metadata.insetHeight + " mm", 30, false, false, 0);
            makerjs.model.rotate(modelLocal.models.dimensioning.models.lineHeight, 89);
            makerjs.model.move(modelLocal.models.dimensioning.models.lineHeight, [metadata.insetWidth -15, metadata.insetHeight / 2]);
        }

        /******************** END Hilfslinien und Beschriftungen *****************/

        modelLocal.units = makerjs.unitType.Millimeter;

        return modelLocal;
    }

    function drawPreview() {
        console.log(model);
        var svg = makerjs.exporter.toSVG(model, {
            useHtmlLayers: true,
            /*
            layerOptions: {
                "cuts":           { stroke: "#000000", strokeWidth: "0.5mm"  },
                "referenceLines": { stroke: "#007bff", strokeWidth: "0.25mm" },
                "dimensioning":   { stroke: "#007bff", strokeWidth: "0.25mm" }
            }, */
            svgAttrs: {
                "width": "100%",
                "height": "100%",
                "id": "preViewSvg"
            }
        });

        document.getElementById('contentDiv').innerHTML = svg;

        let viewBoxAttrib = "-1 -1 " + (metadata.insetWidth + 2) + " " + (metadata.insetHeight + 2);
        document.getElementById('preViewSvg').setAttribute("viewBox", viewBoxAttrib);
        //document.getElementById('downloadDXF').style.visibility = "";
        //document.getElementById('downloadSVG').style.visibility = "";
        metadataToGuiElements();
    }

    function metadataToGuiElements() {
        document.getElementById('insetWidth').value = metadata.insetWidth;
        document.getElementById('insetHeight').value = metadata.insetHeight;
        document.getElementById('distanceX1').value = metadata.distanceX1;
        document.getElementById('distanceY1').value = metadata.distanceY1;
        document.getElementById('hole1Diameter').value = metadata.hole1Diameter;
        document.getElementById('secondHole').checked = metadata.secondHole;
        secondHoleCheckGuiUpdate();
        document.getElementById('distanceX2').value = metadata.distanceX2;
        document.getElementById('distanceY2').value = metadata.distanceY2;
        document.getElementById('hole2Diameter').value = metadata.hole2Diameter;
    }

    function download(data, filename, type) {
        var file = new Blob([data], {type: type});
        var a = document.createElement("a"), url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    function downloadDXF() {
        var exportModel = createModel();

        if (exportModel.models.referenceLines) {
            delete exportModel.models.referenceLines;
        }

        if (exportModel.models.dimensioning) {
            delete exportModel.models.dimensioning;
        }

        var dxfExp = makerjs.exporter.toDXF(exportModel, {
            fontSize: 4,
            usePOLYLINE: true,
            units: makerjs.unitType.Millimeter,
            pointMatchingDistance: 0.1,
        });
        download(dxfExp, determineFilename("dxf"), "application/dxf");
    }

    function determineFilename(extension) {
        let filename = "Fenstereinsatz";
        if (metadata.orderNumber) {
            filename += "_" + metadata.orderNumber;
        }
        if (metadata.customerName) {
            filename += "_" + metadata.customerName;
        }

        if (metadata.posNr) {
            filename += "_Pos" + metadata.posNr;
        }

        filename += "_" + metadata.insetWidth + "x" + metadata.insetHeight + "_" + metadata.distanceX1 + "x" + metadata.distanceY1 + "_" + metadata.hole1Diameter;
        if (metadata.secondHole) {
            filename += "_" + metadata.distanceX2 + "x" + metadata.distanceY2 + "_" + metadata.hole2Diameter;
        }
        filename += "." + extension;
        return filename;
    }

    function downloadSVG() {
        var exportModel = createModel();
        if (exportModel.models.referenceLines) {
            delete exportModel.models.referenceLines;
        }

        if (exportModel.models.dimensioning) {
            delete exportModel.models.dimensioning;
        }

        let svgExp = '<' + '?xml version="1.0" encoding="UTF-8"?>\n' +
            makerjs.exporter.toSVG(exportModel, {
                units: makerjs.unitType.Millimeter,
                svgAttrs: {
                    "width": (metadata.insetWidth + "mm"),
                    "height": (metadata.insetHeight + "mm"),
                    "xmlns": "http://www.w3.org/2000/svg",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "version": "1.1",
                    "baseProfile": "full"
                }
            });
        download(svgExp, determineFilename("svg"), "svg")
    }

    function updateParam(elementId) {
        document.getElementById("infoMessage").innerHTML = "";
        document.getElementById("infoMessage").style.backgroundColor = "";

        var valInt = parseInt(document.getElementById(elementId).value);
        if (!isNaN(valInt)) {
            document.getElementById(elementId).style.backgroundColor = "";
            metadata[elementId] = valInt;
            model = createModel();
            drawPreview();
        } else {
            document.getElementById(elementId).style.backgroundColor = "#d87979";
            document.getElementById('contentDiv').innerHTML = "<span style='font-size: 150px'>😵‍💫</span>";
        }
    }

    function secondHoleChanged() {
        secondHoleCheckGuiUpdate();
        document.getElementById("infoMessage").innerHTML = "";
        document.getElementById("infoMessage").style.backgroundColor = "";
        metadata.secondHole = document.getElementById("secondHole").checked;

        model = createModel();
        drawPreview();
    }

    function secondHoleCheckGuiUpdate() {
        const checkbox = document.getElementById('secondHole');
        const settingsContainer = document.getElementById('settings');
        settingsContainer.classList.toggle('show-second-hole', checkbox.checked);
    }

    function importXMLFile(input) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const xmlString = e.target.result;
            let positionNodes;
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlString, "text/xml");

                if (xmlDoc.querySelector("parsererror")) {
                    throw new Error("Die Datei ist kein gültiges XML-Dokument oder beschädigt.");
                }

                // Kundennamen exportieren.
                let extractedCustomer = "";
                const firma1Tag = xmlDoc.querySelector('object[name="Adresse"] field[name="Firma1"]');
                if (firma1Tag && firma1Tag.textContent.trim() !== "") {
                    extractedCustomer = firma1Tag.textContent.trim().replace(/[\/\\:\*\?"<>\| ]+/g, "_");
                }

                // Auftragsnummer exportieren.
                let extractedOrderNumber = "";
                const orderNumberTag = xmlDoc.querySelector('object[name="Auftrag"] field[name="Nr"]');
                if (orderNumberTag && orderNumberTag.textContent.trim() !== "") {
                    extractedOrderNumber = orderNumberTag.textContent.trim();
                }


                const positionNodes = xmlDoc.querySelectorAll('object[name="Position"]');
                parsedXmlPositions = [];

                positionNodes.forEach((posNode, index) => {
                    const artikelNrTag = posNode.querySelector('field[name="ArtikelNr"]');
                    if (artikelNrTag && artikelNrTag.textContent.trim() === "FENSTEREINSAETZE NACH MASS") {
                        const langtextTag = posNode.querySelector('field[name="LangtextHtml"]');
                        if (langtextTag) {
                            const parsedData = parseLangtext(langtextTag.textContent);
                            if (parsedData) {
                                parsedData.index = parsedXmlPositions.length;
                                parsedData.customerName = extractedCustomer;
                                parsedData.orderNumber = extractedOrderNumber;

                                const posNrTag = posNode.querySelector('field[name="PosNr"]');
                                let posNr = "";
                                if (posNrTag && posNrTag.textContent.trim() !== "") {
                                    posNr = posNrTag.textContent.trim();
                                    parsedData.posNr = posNr;
                                }

                                parsedData.textDisplay = `Pos ${(posNr ? posNr :index + 1)}: ${parsedData.insetWidth}x${parsedData.insetHeight}mm (Ø ${parsedData.hole1Diameter}mm)`;

                                parsedXmlPositions.push(parsedData);
                            }
                        }
                    }
                });

                if (parsedXmlPositions.length === 0) {
                    alert("Die XML-Datei wurde korrekt geladen, aber es wurde keine Position mit der ArtikelNr 'FENSTEREINSAETZE NACH MASS' gefunden.");
                    return;
                }
            } catch (xmlError) {
                console.error("Fehler beim XML-Struktur-Parsing:", xmlError);
                alert("⚠️ XML-Import fehlgeschlagen:\n\nDie Datei konnte nicht als valides XML gelesen werden.\nDetails: " + xmlError.message);
                return;
            }

            try {

                disableAllInputs(true);

                const selectRow = document.getElementById('positionSelectRow');
                const selectEl = document.getElementById('positionSelect');

                if (parsedXmlPositions.length === 1) {
                    selectRow.style.display = "none";
                    applyMetadata(parsedXmlPositions[0]);
                } else {
                    selectEl.innerHTML = "";
                    parsedXmlPositions.forEach(pos => {
                        let opt = document.createElement('option');
                        opt.value = pos.index;
                        opt.textContent = pos.textDisplay;
                        selectEl.appendChild(opt);
                    });
                    selectRow.style.display = "flex";
                    applyMetadata(parsedXmlPositions[0]);
                }

                const resetRow = document.getElementById('resetRow');
                if (resetRow) {
                    resetRow.style.display = "flex";
                }

            } catch (renderError) {
                console.error("Fehler beim GUI-Rendering nach XML-Import:", renderError);
                alert("✅ XML-Daten erfolgreich geladen!\n\n⚠️ Aber beim Generieren der 2D-Vorschau ist ein interner Fehler aufgetreten.\nDie Maße wurden trotzdem in die Eingabefelder übernommen.");
            }
        };
        reader.readAsText(file);
    }

    function parseLangtext(textContent) {
        const dimensionsMatch = textContent.match(/(\d+)\s*x\s*(\d+)mm/i);
        const diameterMatch   = textContent.match(/Ausschnitt\s*Ø\s*(\d+)mm/i);
        const positionMatch   = textContent.match(/Stand\s*(\d+)\s*\/\s*(\d+)mm/i);

        if (!dimensionsMatch) return null; // Ohne Maße bricht es ab

        return {
            insetWidth: parseInt(dimensionsMatch[1]),
            insetHeight: parseInt(dimensionsMatch[2]),
            hole1Diameter: diameterMatch ? parseInt(diameterMatch[1]) : 100,
            distanceX1: positionMatch ? parseInt(positionMatch[1]) : 100,
            distanceY1: positionMatch ? parseInt(positionMatch[2]) : 100,
            secondHole: false
        };
    }

    function applyMetadata(data) {
        metadata.insetWidth = data.insetWidth;
        metadata.insetHeight = data.insetHeight;
        metadata.hole1Diameter = data.hole1Diameter;
        metadata.distanceX1 = data.distanceX1;
        metadata.distanceY1 = data.distanceY1;
        metadata.secondHole = data.secondHole;
        metadata.customerName = data.customerName;
        metadata.posNr = data.posNr;
        metadata.orderNumber = data.orderNumber;

        metadataToGuiElements();
        resetInputStyles();
        model = createModel();
        drawPreview();
    }

    function selectPosition(index) {
        const selectedData = parsedXmlPositions[parseInt(index)];
        if (selectedData) {
            applyMetadata(selectedData);
        }
    }

    function resetInputStyles() {
        const ids = ['insetWidth', 'insetHeight', 'distanceX1', 'distanceY1', 'hole1Diameter', 'distanceX2', 'distanceY2', 'hole2Diameter'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.backgroundColor = "";
        });
        document.getElementById("infoMessage").innerHTML = "";
        document.getElementById("infoMessage").style.backgroundColor = "";
    }

    function disableAllInputs(disable) {
        disableoneInput("insetWidth", disable);
        disableoneInput("insetHeight", disable);
        disableoneInput("distanceX1", disable);
        disableoneInput("distanceY1", disable);
        disableoneInput("hole1Diameter", disable);
        disableoneInput("secondHole", disable);
        disableoneInput("distanceX2", disable);
        disableoneInput("distanceY2", disable);
        disableoneInput("hole2Diameter", disable);
        //disableoneInput("xmlImport", disable);
    }

    function disableoneInput(id, disable) {
        let element = document.getElementById(id);
        if(element) {
            element.disabled = disable;
        }
    }

    function doReset() {
        const selectRow = document.getElementById('positionSelectRow');
        const selectEl = document.getElementById('positionSelect');
        selectEl.innerHTML = "";
        selectRow.style.display = "none";
        parsedXmlPositions = [];
        disableAllInputs(false);
        metadata.customerName = "";
        metadata.posNr = "";
        metadata.orderNumber = "";

        const resetRow = document.getElementById('resetRow');
        if (resetRow) {
            resetRow.style.display = "none";
        }
    }

</script>
</body>
</html>