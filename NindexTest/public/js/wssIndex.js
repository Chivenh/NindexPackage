/**
 * wssIndex
 */
(function ($) {
    let contentContainer = $(".socket-content");
    //创建socket连接
   let socket = io("http://127.0.0.1:8901/chat");
   socket.on("connect",function () {
       console.info("Socket opened.");
       socket.emit("Hi, Server!");
   });
   socket.on("disconnected",function () {
       console.info("Socket closed.");
       console.info(arguments);
   });
   socket.on("news",function (data) {
       console.info(data);
       contentContainer.html(JSON.stringify(data));
   });

    $(".socketLink").click(function () {
        var $input=$(this).parent().find("input.form-control");
        if($input&&$input.length){
            socket.send($input.val());
        }
    });
}(jQuery));