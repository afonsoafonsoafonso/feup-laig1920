function getPrologRequest(requestString, onSuccess, onError, port) {
    var requestPort = port || 8081
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

function makeRequest(requestString) {
    getPrologRequest(requestString, handleReply);
}

//Handle the Reply
function handleReply(data) {
    //console.log(data.target.response);
    console.log(data.target.response);
}

function valid_move(x1, y1, x2, y2, p, b) {
    var requestString = 'valid_move(' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + ',' + p + ',' +  JSON.stringify(b) + ')';
    //console.log(requestString);
    makeRequest(requestString);
}