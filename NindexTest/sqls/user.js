/**
 * UserSQL
 * @author LFH
 * @since
 * @description
 */
let sqls={
    all:"select name,id,code from t_user where status='1'",
    exists:"select user.id,user.name from t_user_extend"
};
module.exports = sqls;