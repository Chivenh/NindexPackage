/**
 * http://usejsdoc.org/
 */
require.config(
        {
            baseUrl:"/lib",
        	paths: {
                'jquery': 'jquery-3.2.1.min'
            }
        }
    );
require(['jquery'],function ($) {
	var main=$("#_main_");
	var second=$("#_second_");
    
    /**-- 表单提交 --*/
    $("form._upload_file").submit(function(){
    var _bl=false;
        try{
            var _fileInput=this[$("input[type='file']",this).attr("name")];
            var _max=$(_fileInput).attr("size")||1;
            var _files=_fileInput.files;
            if(_files&&_files.length){
                if(_files.length>_max){
                    alert("上传数量不能大于:"+_max+" 个!");
                    $(_fileInput).val("");
                   }else{
                       _bl=true;
                   }
            }else{
                alert("请选择文件后上传!");
            }
        }catch(er){
            console.info(er);
        }
        return _bl;
    });
    
    /**--formData 提交--*/
    //校验form表单的文件个数.
    var _checkForm=function(_input){
        var _bl=false;
        try{
            var _max=$(_input).attr("size")||1;
            var _files=_input.files;
            if(_files&&_files.length){
                if(_files.length>_max){
                    alert("上传数量不能大于:"+_max+" 个!");
                    $(_input).val("").change();
                   }else{
                       _bl=true;
                   }
            }else{
                alert("请选择文件后上传!");
            }
        }catch(err){
           console.error(err); 
        }
        return _bl;
    };
    
    var _submit_data=function(_input,url,_res_con,data){
        if(_checkForm(_input)){
           var data=data||new FormData();
            var _files=_input.files;
            if(_files&&_files.length){
               var _file_data_=Array.prototype.slice.call(_files);
                _file_data_.forEach(function(i){
                    data.append(_input.name,i);
                });
            }
            $.ajax({
                type:"post",
                url:url,
                data: data,
                /***必须false才会自动加上正确的Content-Type*/
                contentType: false,
                /*** 必须false才会避开jQuery对 formdata 的默认处理* XMLHttpRequest会对 formdata 进行正确的处理*/
                processData: false,
            }).done(function(data){
                console.info(data);
                _res_con.html(data);
            });
        }
    };
    
    $("._upload_file_formdata button").click(function(){
        var url=$(this).parent().data("url");
        var input=$(this).prev("input");
        var res_con=$(this).next("div");
        _submit_data(input[0],url,res_con);
    });
    
    $("._upload_file_formdata_data button").click(function(){
         var url=$(this).parent().data("url");
        var input=$(this).prev("input");
        var res_con=$(this).next("div");
        var _data=new FormData();
        var _ext=$("._ext_data");
        _data.append(_ext[0].name,_ext.val());
        _submit_data(input[0],url,res_con,_data);
    });
    
    $("._upload_file_formdata_preview input[type='file']").change(function(){
        var _preview=$(this).siblings("._response").empty(); 
            $.each(this.files,function(i,fi){
                var read=new FileReader() // 创建FileReader对像;
                read.onload=function(){
                    _preview.append("<img src='"+read.result+"' class='_preview'></img>");
                }
                read.readAsDataURL(fi)  // 调用readAsDataURL方法读取文件;
            });
    });
    $("._upload_file_formdata_preview button").click(function(){
         var url=$(this).parent().data("url");
        var input=$(this).prev("input");
        var res_con=$(this).next("div");
        _submit_data(input[0],url,res_con);
    });
});