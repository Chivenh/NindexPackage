/**
 * wssIndex
 */
(function () {

    var onClose = function() {
            console.log("Socket closed.");
        },
        onMessage = function(data) {
            console.log("We get signal:");
            console.log(data);
        },
        onError = function() {
            console.log("We got an error.");
        },
    socket = new WebSocket("ws://127.0.0.1:8091/");
    socket.onopen = function () {
        console.info("Socket opened.");
        socket.send("Hi, Server!");
    };
    socket.onclose = onClose;
    socket.onerror = onError;
    socket.onmessage = onMessage;

}());