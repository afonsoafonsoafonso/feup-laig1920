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

function valid_chain_move(x1, y1, x2, y2, x3, y3, p, b, Choice, replyHandler) {
    var requestString = 'valid_chain_move(' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + ',' + x3 + ',' + y3 + ',' + p + ',' + JSON.stringify(b) + ',' + Choice  + ')';
    makeRequest(requestString, replyHandler);
}

function valid_moves(b, p, replyHandler) {
    var requestString = 'valid_moves(' + JSON.stringify(b) + ',' + p + ',' + 'MoveList' + ')';
    makeRequest(requestString, replyHandler);
}

function valid_rocket_boosts(x1, y1, x2, y2, p, b, replyHandler) {
    console.log("X1", x1);
    console.log("y1", y1);
    console.log("X2", x2);
    console.log("Y2", y2);
    console.log("P", p);
    console.log("B", b);
    var requestString = 'valid_chain_moves(' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + ',' + p + ',' + JSON.stringify(b) + ',' + 'MoveList' + ',' + 2 + ')';
    makeRequest(requestString, replyHandler);
}

function valid_reprogram_coordinates(x1, y1, x2, y2, p, b, replyHandler) {
    console.log("X1", x1);
    console.log("y1", y1);
    console.log("X2", x2);
    console.log("Y2", y2);
    console.log("P", p);
    console.log("B", b);
    var requestString = 'valid_chain_moves(' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + ',' + p + ',' + JSON.stringify(b) + ',' + 'MoveList' + ',' + 1 + ')';
    makeRequest(requestString, replyHandler);
}

function end_game_A(b, replyHandler) {
    var requestString = 'end_game_A(' + JSON.stringify(b) + ')';
    makeRequest(requestString, replyHandler);
}

function end_game_B(b, replyHandler) {
    var requestString = 'end_game_B(' + JSON.stringify(b) + ')';
    makeRequest(requestString, replyHandler); 
}

function ping_server() {
    makeRequest('ping');
}