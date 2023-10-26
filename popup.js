let configuracion = {}



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
            configuracion.iplocal = ip
            chrome.storage.sync.set({ 'iplocal': configuracion.iplocal });
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
    const puertoCom = document.getElementById('puertoCom').value;

    chrome.storage.sync.set({ impresoraFiscal, modeloImpresora, puertoCom }, function () {
        setValueInput('impresoraFiscal', impresoraFiscal);
        setValueInput('modeloImpresora', modeloImpresora);
        setValueInput('puertoCom', puertoCom);
    });
}

async function loadConfig() {
    await getUserIP()
    chrome.storage.sync.get(['iplocal', 'impresoraFiscal', 'modeloImpresora', 'puertoCom'], function (result) {
        document.getElementById('ip').value = result.iplocal;
        document.getElementById('impresoraFiscal').value = result.impresoraFiscal;
        document.getElementById('modeloImpresora').value = result.modeloImpresora;
        document.getElementById('puertoCom').value = result.puertoCom;
    });
}

if (document.getElementById('ip') !== null) {
    document.getElementById('guardar').addEventListener('click', saveConfig);
    loadConfig();
}