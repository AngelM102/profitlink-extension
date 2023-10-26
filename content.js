function createInputs() {
    const div = document.createElement("div"); // create a new div element
    div.style.display = 'none'; // hide the div element
    document.body.appendChild(div); // append the div element to the document body

    createInput(div, "iplocal", "ip"); // create an input element with id "iplocal" and value "ip", and append it to the div
    createInput(div, "impresoraFiscal", "impresora"); // create an input element with id "impresoraFiscal" and value "impresora", and append it to the div
    createInput(div, "modeloImpresora", "modelo"); // create an input element with id "modeloImpresora" and value "modelo", and append it to the div
    createInput(div, "flag", "flag"); // create an input element with id "flag" and value "flag", and append it to the div
}

function createInput(parent, id, value) {
    const hiddenField = document.createElement("input"); // create a new input element
    hiddenField.type = "hidden"; // set its type to "hidden"
    hiddenField.id = id; // set its id to the given id
    hiddenField.value = value; // set its value to the given value
    parent.appendChild(hiddenField); // append the input element to the parent element
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
    updateInput('flag', 'flag');
}

createInputs();
updateInputs();