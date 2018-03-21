var BITS = ["ONE", "TWO", "THREE", "FOUR", "FIVE",
        "SIX", "SEVEN", "EIGHT,", "NINE", "TEN"],
    TEENS = ["ELEVEN", "TWELF", "THIRTEEN",
        "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVETEEN", "EIGHTEEN", "NIGHTEEN"],
    TIES = ["TWENTY", "THRITY", "FORTY", "FIFTY",
        "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];
 module.exports= {
    toEnglish:function toEnglish( str) {
    	var num = +(str);
        if(num == 0) {
			return "ZERO";
        }
        var buffer = [];
		if (num >= 1000) {
			buffer.push(this.pickThousand(num));
			if (num % 1000 != 0) {
				buffer.push(" ");
			}
			num -= Math.floor((num / 1000)) * 1000;
			if (num>0&& num % 100 == 0) {
				buffer.push(" AND ");
			}
		}
        if(num >= 100) {
            buffer.push(this.pickHunder(num));
            if(num % 100 != 0) {
                buffer.push(" AND ");
            }
            num -= Math.floor((num / 100)) * 100;
        }
        var largerThan20 = false;
        if(num >= 20) {
            largerThan20 = true;
            buffer.push(this.pickTies(num));
            num -= Math.floor((num / 10)) * 10;
        }
        if(!largerThan20 && num > 10) {
            buffer.push(this.pickTeens(num));
            num = 0;
        }
        if(num > 0) {
            var bit = this.pickBits(num);
            if(largerThan20) {
                buffer.push(" ");
            }
            buffer.push(bit);
        }
        return buffer.join("");
    },
    pickHunder :function pickHunder( num) {
        var hunder = Math.floor(num / 100);
        var pickBits="";
        if(hunder >10) {
        	pickBits = this.pickTies(hunder);
          hunder =   hunder % 10;
        }
        return pickBits+  BITS[hunder - 1] + " HUNDER";
    },

	/**
	 * 处理大于1000的数字
	 * 
	 * @author LFH
	 * @date 2018年3月6日 下午4:32:34
	 * @param num
	 * @return
	 */
	pickThousand:function pickThousand( num) {
		var thous = Math.floor(num / 1000);
        console.info(thous);
		var pickBits = "";
		if (thous > 10) {
			pickBits = this.pickTies(thous);
			thous = thous % 10;
		}
        console.info(pickBits,BITS[thous - 1]);
		return pickBits + BITS[thous - 1] + " THOUSAND";
	},
     
    pickTies:function pickTies( num) {
        var ties = Math.floor(num / 10);
        return TIES[ties - 2];
    },
     
    pickTeens:function pickTeens( num) {
        return TEENS[num - 11];
    },
     
    pickBits:function pickBits( num) {
        return BITS[num - 1];
    }
}

