(function(global,factory){
    (typeof exports === "object" && typeof module !== "undefined") ? module.exports = factory() :
        (typeof define === "function" && define.amd ? define(factory) : (global.NumberTransferUtil = factory()));
})(this,function(){
    var enNum=[ // 基本数词表
			"zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
			"thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "", "", "", "",
			"", "", "", "", "", "thirty", "", "", "", "", "", "", "", "", "", "fourty", "", "", "", "", "", "", "", "",
			"", "fifty", "", "", "", "", "", "", "", "", "", "sixty", "", "", "", "", "", "", "", "", "", "seventy", "",
			"", "", "", "", "", "", "", "", "eighty", "", "", "", "", "", "", "", "", "", "ninety"];
    var enUnit = ["hundred", "thousand", "million","billion", "trillion", "quintillion"];//单位数词表
    var Int=parseInt;//为转换字符串,浮点数为整数简单,以Int 接受环境中的parseInt方法.
    var _transfer=function(num){
        var num=(num+"")||"";
        // 数字字符串参数
		// 判断字符串是否为数字
		if (!(/\d+/.test(num))) {
            return num+" is not number!";
		}
		num = num.replace(/^[0]*([1-9]*)/, "$1");
		// 把字符串前面的0去掉
		if (num.length == 0) {
			// 如果长度为0，则原串都是0
			return enNum[0];
		} else if (num.length > 9) {
			// 如果大于9，即大于999999999，限制条件
			return "too big!";
		}
		// 按3位分割分组
		var count = (num.length % 3 == 0) ?Int(num.length / 3) : Int(num.length / 3 )+ 1;
		if (count > enUnit.length) {
			return "too big!";
		} // 判断组单位是否超过，
			// 可以根据需求适当追加enUnit
		var group = Array(count);//创建一个长度为count的数组.
		for (var i = num.length, j = group.length - 1; i > 0; i -= 3) {
			group[j--] = num.substring(Math.max(i - 3, 0), i);
		}
		var buf = []; // 结果保存
        !function(){
            for (var i = 0; i < count; i++) { // 遍历分割的组
			var v = Int(group[i]);
			if (v >= 100) { // 因为按3位分割，所以这里不会有超过999的数
				buf.push(enNum[Int(v / 100)]);buf.push(" ");buf.push(enUnit[0]);buf.push(" ");
				v = v % 100; // 获取百位，并得到百位以后的数
				if (v != 0) {
					buf.push("and ");
				} // 如果百位后的数不为0，则追加and
			}
			if (v != 0) { // 前提是v不为0才作解析
				if (v < 20 || v % 10 == 0) {
					// 如果小于20或10的整数倍，直接取基本数词表的单词
					buf.push(enNum[v]);buf.push(" ");
				} else { // 否则取10位数词，再取个位数词
					buf.push(enNum[v - v % 10]);buf.push(" ");
					buf.push(enNum[v % 10]);buf.push(" ");
				}
				if (i != count - 1) { // 百位以上的组追加相应的单位
					buf.push(enUnit[count - 1 - i]);buf.push(" ");
				}
			}
		}
        }();
		return buf.join("").trim(); // 返回值
    }
    
    return {
        transfer:function(num){
            return _transfer(num);
        },transferCapital:function(num){
            return this.transfer(num).toUpperCase();
        }
    };
});

