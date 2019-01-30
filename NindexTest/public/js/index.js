/**
 *
 */
var Index=function (QC) {

    var loginButton=$("#qqLoginBtn"),
        logoutButton=$("#qqLogoutBtn"),
        infoCon=$("#meInfo");

    // TODO
    return {
        simpleInit:function () {
            QC.Login({
                btnId:"qqLoginBtn",	//插入按钮的节点id
                showModal:true,
            },function (reqData, opts) {
                //登录成功
                //根据返回数据，更换按钮显示状态方法
                var dom = document.getElementById(opts['btnId']),
                    _logoutTemplate=[
                        //头像
                        '<span><img src="{figureurl}" class="{size_key}"/></span>',
                        //昵称
                        '<span>{nickname}</span>',
                        //退出
                        '<span><a href="javascript:QC.Login.signOut();">退出</a></span>'
                    ].join("");
                dom && (dom.innerHTML = QC.String.format(_logoutTemplate, {
                    nickname : QC.String.escHTML(reqData.nickname), //做xss过滤
                    figureurl : reqData.figureurl
                }));
            });
        },newTabInit:function () {
            if( QC.Login.check()){
                QC.Login.getMe(function (openId,token) {
                    infoCon.removeClass("hidden").html(`<b>openId:</b>${openId}`).append("<br/><span>"+`<b>token:</b>${token}`+"</span>");
                });
                logoutButton.removeClass("hidden").click(function () {
                    QC.Login.signOut();
                    window.location.assign("/");
                });
            }else{
                loginButton.removeClass("hidden").click(function () {
                   window.open("/oauth2/auth","_self");
                    /* QC.Login.showPopup({
                        appId:"101543040",
                        redirectURI:"https://buyer.hjs.56rely.com/view/callback.html"
                    });*/
                });
            }
        }
    }
}(QC);

Index.newTabInit();