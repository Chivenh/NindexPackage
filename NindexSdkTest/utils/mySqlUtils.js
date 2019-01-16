/**
 * MySqlUtils
 * @author LFH
 * @since 2019/1/16 16:26
 * @description
 */
let mysql  = require('mysql');  //调用MySQL模块
let createConnection=(config)=>{
    return mysql.createConnection(config);
};
let pool;
const defaultConfig={
    port:3306,
    host:"127.0.0.1",
    charset:'UTF8_GENERAL_CI',
    timezone:'GMT%2B8',
    usePool:true
};
class Mysql {
    constructor(config){
        let _config=Object.assign({},defaultConfig);
        this.config=Object.assign(_config,config);
        let usePool=this.config.usePool;//使用连接池
        if(usePool){
            this.link=pool=mysql.createPool(this.config);
            this.link.on("connection",()=>{
                this.connected();
            });
        }else{
            this.link=createConnection(this.config);
            this.link.connect( (err)=> {
                if(!err){
                    this.connected();
                }
            });
        }
    }
    connected(){
        console.info(`connected to ${this.config.host}/${this.config.database} successful!`);
    }
    execute(sql,params=[],res){
        if(params&&typeof params==="function"){
            res=params;
            params=[];
        }
        if(this.config.usePool){
            this.link.query(sql,params,(err,rows,fields)=>{
                if(err){
                    console.error(err);
                }else{
                    res(rows,fields);
                }
            });
        }else{
            this.link.connect((err)=>{
                if(!err){
                    this.link.query(sql,params,(err,rows,fields)=>{
                        if(err){
                            console.error(err);
                        }else{
                            res(rows,fields);
                        }
                    });
                }
            });
        }
        this.close();
    }
    close(){
        this.config.usePool||this.link.end();
    }
}

module.exports = function (config) {
    return new Mysql(config);
};