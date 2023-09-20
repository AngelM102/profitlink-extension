chrome.storage.sync.get(['iplocal'], function(result) {
    setIP(result.iplocal)
});


function setIP(ip){
    // hidden input field createelement and append to body
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("id", "iplocal");
    hiddenField.setAttribute("value", ip);
    document.body.appendChild(hiddenField);
}
