/**
 * http://usejsdoc.org/
 pg数据库封装(用更多的 ES6 语法)
 */
let pg = require('pg');
let util = require("./commonUtils");
let sqlLog = function (client, str) {
    let _sql = "insert into t_sql_log ()";
};
// 查询函数  
//client 数据库连接对象.
//@param str 查询语句  
//@param value 相关值  ;
//@param cb 回调函数  
let clientHelper = (client, str, value, cb) => {
    client.query(str, value, (err, result) => {
        if (err) {
            cb({
                err: err
            });
        } else {
            if (result.rows !== undefined) {
                cb({
                    rows: result.rows,
                    count: result.rowCount
                });
            } else {
                cb(result);
            }
        }
    });
};
let CONFIG = {
        user: "lfh",
        password: "lfhlfh",
        proto: "127.0.0.1",
        name: "myNode-1"
    },
    _CFG = ["postgres://", ":", "@", "/"];
class CLIENT {
    constructor(config) {
        let _conString = (cfg) => {
            this.config = util.extend({}, CONFIG, cfg);
            console.log(`准备向 ${ this.config.proto }/${this.config.name } 数据库连接...`);
            return [_CFG[0], this.config.user, _CFG[1], this.config.password, _CFG[2], this.config.proto, _CFG[3], this.config.name].join("");
        };
        this.client = new pg.Client(_conString(config));
    }
};
class PG {
    constructor() {}
    getConnection(config) {
        let _client = new CLIENT(config);
        this.client = _client.client;
        this.client.connect((err) => {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            this.client.query("SELECT to_char(now(), 'yyyy-MM-dd HH24:MI:SS') AS the_time", (err, result) => {
                if (err) {
                    return console.error('error running query', err);
                }
                console.log(`${_client.config.proto}/${_client.config.name} 数据库连接成功... (${result.rows[0].the_time})`);
            });
        });
    }
    /*增  
     *@param tablename 数据表名称  
     *@param fields 更新的字段和值，json格式  
     *@param cb 回调函数 
     */
    save(tablename, fields, cb) {
        if (!tablename) {
            return;
        }
        let str = `insert into ${tablename} (`;
        let field = [];
        let value = [];
        let num = [];
        let count = 0;
        for (let i in fields) {
            count++;
            field.push(i);
            value.push(fields[i]);
            num.push("$" + count);
        }
        str += field.join(",") + `) values(${num.join(",")} )`;
        clientHelper(this.client, str, value, cb);
    }
    /*删除  
     *@param tablename 数据表名称  
     *@param fields 条件字段和值，json格式  
     *@param cb 回调函数  
     */
    remove(tablename, fields, cb) {
        if (!tablename) {
            return;
        }
        let str = `delete from ${tablename} where `;
        let field = [];
        let value = [];
        let count = 0;
        for (let i in fields) {
            count++;
            field.push(i + "=$" + count);
            value.push(fields[i]);
        }
        str += field.join(" and ");
        clientHelper(this.client, str, value, cb);
    }
    /*修改  
     *@param tablename 数据表名称  
     *@param fields 更新的字段和值，json格式  
     *@param mainfields 条件字段和值，json格式  
     */
    update(tablename, mainfields, fields, cb) {
        if (!tablename) return;
        let str = `update ${tablename} set `;
        let field = [];
        let value = [];
        let count = 0;
        for (let i in fields) {
            count++;
            field.push(i + "=$" + count);
            value.push(fields[i]);
        }
        str += field.join(",") + " where ";
        field = [];
        for (let j in mainfields) {
            count++;
            field.push(j + "=$" + count);
            value.push(mainfields[j]);
        }
        str += field.join(" and ");
        clientHelper(this.client, str, value, cb);
    }
    /**查询  
     *@param tablename 数据表名称  
     *@param fields 条件字段和值，json格式  
     *@param returnfields 返回字段  
     *@param cb 回调函数  */
    select(tablename, fields, returnfields, addSql, cb) {
        if (!tablename) {
            return;
        }
        let returnStr = "";
        if (returnfields.length == 0) {
            returnStr = '*';
        } else {
            returnStr = returnfields.join(",");
        }
        let str = `select ${returnStr} from ${tablename} where `;
        let field = [];
        let value = [];
        let count = 0;
        for (let i in fields) {
            count++;
            field.push(i + "=$" + count);
            value.push(fields[i]);
        }
        str += field.join(" and ");
        clientHelper(this.client, str + addSql, value, cb);
    }
};

module.exports = new PG();
