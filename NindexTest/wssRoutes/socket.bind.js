/**
 * socketBind
 * @author LFH
 * @since
 * @description
 */
let users=[];
let socketsEntry = {};
let socketInit=function($io,$fn){
    $io.on('connection',(socket)=>{
        socket.emit('news', { hello: 'world' });

        // 失去连接
        socket.on('disconnect',function(){
            let userName = socket.username;
            if(users.indexOf(userName)>-1){
                users.splice(users.indexOf(userName),1);
                delete socketsEntry[userName];
                console.info(socket.username+'===>disconnected');
            }

            socket.broadcast.emit('users',{number:users.length});
        });

        //消息传递
        socket.on('message',function(data){
            let newData = {text: data.text, user: socket.username};
            socket.emit("news",newData);
            socket.emit('receive_message',newData);
            socket.broadcast.emit('receive_message',newData);
        });

        //登录
        socket.on('login',function(data){
            console.info('login');
            let userName = data.username;
            if(users.indexOf(userName)>-1){

            }else{
                socket.username = userName;
                users.push(userName);
                socketsEntry[userName]=socket;
                // 统计连接数
                socket.emit('users',{number:users.length});  // 发送给自己
                socket.broadcast.emit('users',{number:users.length}); // 发送给其他人
            }

        });
        $fn&&typeof $fn ==="function"&&$fn(socket);
    });
};
let sockets={
    "/chat":function ($io) {
        socketInit($io,function (socket) {
            console.info(121);
            socket.on("chatMessage",function (data) {
                let userName = data.targetName;
                if(users.indexOf(userName)>-1){
                    let $socket=socketsEntry[userName];
                    $socket.emit("chatSend",Object.assign({time:new Date()},data));
                }
            });
        });
    },
    "/talk":function ($io) {
        socketInit($io,function (socket) {
            console.info(121.121);
            socket.on("chatMessage",function (data) {
                let userName = data.targetName;
                if(users.indexOf(userName)>-1){
                    let $socket=socketsEntry[userName];
                    $socket.emit("chatSend",Object.assign({time:new Date()},data));
                }
            });
        });
    }
};

module.exports = sockets;