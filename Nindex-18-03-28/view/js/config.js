require.config({
    paths: {
        'jquery': '/lib/jquery-3.2.1.min',
        Tutil:"/view/js/Tutil"
    },shim:{
        Tutil:{deps:["jquery"],exports:"Tutil"}
    }
});
