let configuracion = {
    impresoraFiscales: [
        { value: 'factory', text: 'The Factory' },
        { value: 'pnp', text: 'Desarrolos PNP' },
    ],
    modelos: [
        'TM-T20II',
        'TM-T88V',
        'TM-T88VI',
        'TM-T88VI-iHUB',
        'TM-T88VI-DT2',
        'TM-T88VI-iHUB-DT2',
    ],
    flags: [
        { value: '00', text: '00 - (8 enteros y 2 decimales)' },
        { value: '01', text: '01 - (7 enteros y 3 decimales)' },
        { value: '02', text: '02 - (6 enteros y 4 decimales)' },
        { value: '11', text: '11 - (9 enteros y 1 decimal)' },
        { value: '12', text: '12 - (10 enteros y 0 decimales)' },
        { value: '30', text: '30 - (14 enteros y 2 decimales)' },
    ]
}


function createSelect(id, options, label) {
    const $div = document.createElement("div");
    const $label = document.createElement("label");
    const select = document.createElement("select");


    $div.classList.add("form-group");
    select.id = id;
    select.style.width = '100%';


    options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.text = option.text;
        select.appendChild(optionElement);
    });


    $label.appendChild(document.createTextNode(label));
    $div.appendChild($label);
    $div.appendChild(select);
    document.getElementById('data-selects').appendChild($div);
}


function createSelects() {
    createSelect('impresoraFiscal', configuracion.impresoraFiscales, 'Impresora Fiscal');
    createSelect('modeloImpresora', configuracion.modelos.map(modelo => ({ value: modelo, text: modelo })), 'Modelo Impresora');
    createSelect('flag', configuracion.flags, 'Flag 21');
}





function getUserIP() { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
    }),
        noop = function () { },
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

    function iterateIP(ip) {
        if (!localIPs[ip]) {
            chrome.storage.sync.set({ 'iplocal': ip });
        }
        localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function (sdp) {
        sdp.sdp.split('\n').forEach(function (line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function (reason) {
        // An error occurred, so handle the failure to connect
    });

    //listen for candidate events
    pc.onicecandidate = function (ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}


function setValueInput(id, value) {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: `document.getElementById("${id}").value = "${value}"` }
        );
    });

}




function saveConfig() {
    const impresoraFiscal = document.getElementById('impresoraFiscal').value;
    const modeloImpresora = document.getElementById('modeloImpresora').value;
    const flag = document.getElementById('flag').value;


    chrome.storage.sync.set({ impresoraFiscal, modeloImpresora, flag }, function () {
        setValueInput('impresoraFiscal', impresoraFiscal);
        setValueInput('modeloImpresora', modeloImpresora);
        setValueInput('flag', flag);
    });
}




async function loadConfig() {
    await getUserIP()

    chrome.storage.sync.get(['iplocal', 'impresoraFiscal', 'modeloImpresora', 'flag'], function (result) {
        document.getElementById('ip').value = result.iplocal;
        document.getElementById('impresoraFiscal').value = result.impresoraFiscal;
        document.getElementById('modeloImpresora').value = result.modeloImpresora;
        document.getElementById('flag').value = result.flag;
    });
}



if (document.getElementById('ip') !== null) {
    createSelects();
    loadConfig();

    document.getElementById('guardar').addEventListener('click', saveConfig);
}