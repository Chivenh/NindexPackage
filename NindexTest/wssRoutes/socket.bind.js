/**
 * socketBind
 * @author LFH
 * @since
 * @description
 */
let users=[];
let socketInit=function($io,$fn){
    $io.on('connection',(socket)=>{
        console.info('connection');
        socket.emit('news', { hello: 'world' });

        // 失去连接
        socket.on('disconnect',function(){
            if(users.indexOf(socket.username)>-1){
                users.splice(users.indexOf(socket.username),1);
                console.info(socket.username+'===>disconnected');
            }

            socket.broadcast.emit('users',{number:users.length});
        });

        //消息传递
        socket.on('message',function(data){
            console.info('message');
            let newData = {text: data.text, user: socket.username};
            socket.emit("news",newData);
            socket.emit('receive_message',newData);
            socket.broadcast.emit('receive_message',newData);
        });

        //登录
        socket.on('login',function(data){
            console.info('login');
            if(users.indexOf(data.username)>-1){

            }else{
                socket.username = data.username;
                users.push(data.username);
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
        });
    }
};

module.exports = sockets;