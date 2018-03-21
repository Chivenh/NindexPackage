/**操作数据库*/
var pg=require("../envUtil/pgDatabase-v1");
pg.getConnection({name:"myNode-1"});  
var SnowFlake=require("../envUtil/snowFlake");
var _init=(Nindex)=>{
    Nindex.get("/getUsers.do",(req,res)=>{
        pg.select("t_user",{status:"1"},["name","code","id","to_char(creation_time,'yyyy-MM-dd HH24:MI:SS') as creation_time","to_char(modification_time,'yyyy-MM-dd HH24:MI:SS') as modification_time"]," order by id asc limit 100 offset 0",(rows)=>{
            res.json(rows);
        });
    });
    Nindex.post("/addUser.do",(req,res)=>{
        let _body=req.body;
        let _user={
            id:SnowFlake.nextId(),
            name:_body.name,
            code:_body.code,
            password:_body.password,
            dept_id:1,
            company_id:1,
            status:1,
            creation_time:new Date(),
            created_by:10,
            ordinal:1
        };
        pg.save("t_user",_user,(data)=>{
            data.err&&console.info(data.err);
            if(data.rows!=null&&data.count>0){
                res.send(true);
            }else{
                res.send(false);
            }
        });
    });
    Nindex.post("/delUser.do",(req,res)=>{
         let _body=req.body;
        pg.remove("t_user",{id:_body.id},(data)=>{
            data.err&&console.info(data.err);
            if(data.rows!=null&&data.count>0){
                res.send(true);
            }else{
                res.send(false);
            }
        });
    });
};

module.exports=_init;