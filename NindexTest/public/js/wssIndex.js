/**
 * wssIndex
 */
(function ($) {
    let contentContainer0 = $(".socket-content:eq(0)");
    let contentContainer1 = $(".socket-content:eq(1)");
    const MESSAGE = "chatMessage",SERVER="服务器",CLIENT="客户端";
    const USER_NAME ="LFH";
    const EMPTY="";
    //创建socket连接
   const socket0 = io("http://127.0.0.1:8901/chat"),socket1=io("http://127.0.0.1:8901/talk"),
    socket = [{$$:socket0,name:`${USER_NAME}:socket0`},{$$:socket1,name:`${USER_NAME}:socket1`}];
   let connectFn=function(){
       console.info("Socket opened.");
       this.$$.emit(MESSAGE,{text:this.name});
       this.$$.emit("login",{username:this.name});
   };
    socket0.on("connect",connectFn.bind(socket[0]));
    socket1.on("connect",connectFn.bind(socket[1]));
    socket0.on("disconnected",function () {
       console.info("Socket closed.");
   });
    socket0.on("news",function (data) {
       contentContainer0.append(`<p><p class="pull-left"><b class="chat-label">${SERVER}</b> ${JSON.stringify(data)}</p></p>`);
   });
    socket0.on("chatSend",function (data) {
        contentContainer0.append(`<p><p class="pull-left"><b  class="chat-label">${SERVER}</b> ${JSON.stringify(data)}</p></p>`);
    });
    socket1.on("news",function (data) {
        contentContainer1.append(`<p><p class="pull-left"><b class="chat-label">${SERVER}</b> ${JSON.stringify(data)}</p></p>`);
    });
    socket1.on("chatSend",function (data) {
        contentContainer1.append(`<p><p class="pull-left"><b  class="chat-label">${SERVER}</b> ${JSON.stringify(data)}</p></p>`);
    });
    $(".socketLink:eq(0)").click(function () {
        var $input=$(this).parent().find("input.form-control"),$inputVal = $input.val();
        if($inputVal&&$inputVal.length){
            let data={targetName:socket[1].name,text:$inputVal};
            contentContainer0.append(`<p><p class="pull-right"><b class="chat-label">${CLIENT}</b>${JSON.stringify(data)}</p></p>`);
            socket0.emit(MESSAGE,data);
            $input.val(EMPTY);
        }
    });
    $(".socketLink:eq(1)").click(function () {
        var $input=$(this).parent().find("input.form-control"),$inputVal = $input.val();
        if($inputVal&&$inputVal.length){
            let data={targetName:socket[0].name,text:$inputVal};
            contentContainer1.append(`<p><p class="pull-right"><b class="chat-label">${CLIENT}</b>${JSON.stringify(data)}</p></p>`);
            socket1.emit(MESSAGE,data);
            $input.val(EMPTY);
        }
    });

}(jQuery));