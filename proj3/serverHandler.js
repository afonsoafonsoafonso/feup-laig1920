function getPrologRequest(requestString, onSuccess, onError, port) {
    var requestPort = port || 8081
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

function makeRequest(requestString, replyHandler) {
    getPrologRequest(requestString, replyHandler);
}

function valid_move(x1, y1, x2, y2, p, b, replyHandler) {
    var requestString = 'valid_move(' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + ',' + p + ',' +  JSON.stringify(b) + ')';
    makeRequest(requestString, replyHandler);
}
//parse_input(valid_chain_move(X1, Y1, X2, Y2, X3, Y3, P, B, Choice), 1):- valid_chain_move(X1, Y1, X2, Y2, X3, Y3, P, B, Choice).

function valid_chain_move(x1, y1, x2, y2, x3, y3, p, b, Choice, replyHandler) {
    var requestString = 'valid_chain_move(' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + ',' + x3 + ',' + y3 + ',' + p + ',' + JSON.stringify(b) + ',' + Choice  + ')';
    makeRequest(requestString, replyHandler);
}

function ping_server() {
    makeRequest('ping');
}