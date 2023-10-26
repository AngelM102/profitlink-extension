function createInput(id, value) {
    const hiddenField = document.createElement("input");
    hiddenField.type = "hidden";
    hiddenField.id = id;
    hiddenField.value = value;
    document.body.appendChild(hiddenField);
}

function createInputs() {
    createInput("iplocal", "ip");
    createInput("impresoraFiscal", "impresora");
    createInput("modeloImpresora", "modelo");
    createInput("puertoCom", "puerto");
}

function updateInput(id, key) {
    chrome.storage.sync.get(key, function (result) {
        document.getElementById(id).value = result[key];
    });
}

function updateInputs() {
    updateInput('iplocal', 'iplocal');
    updateInput('impresoraFiscal', 'impresoraFiscal');
    updateInput('modeloImpresora', 'modeloImpresora');
    updateInput('puertoCom', 'puertoCom');
}

createInputs();
updateInputs();