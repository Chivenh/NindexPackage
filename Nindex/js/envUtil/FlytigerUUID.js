/**生成32位唯一字符数字UUID*/

//Replaced from the original function to leverage the built in methods in
//JavaScript. Thanks to Robert Kieffer for pointing this one out
var returnBase = function (number, base) {
    return (number).toString(base).toUpperCase();
};

//Pull out only certain bits from a very large integer, used to get the time
//code information for the first part of a UUID. Will return zero's if there
//aren't enough bits to shift where it needs to.
var getIntegerBits = function (val, start, end) {
    var base16 = returnBase(val, 16);
    var quadArray = [];
    var quadString = '';
    var i = 0;
    for (i = 0; i < base16.length; i++) {
        quadArray.push(base16.substring(i, i + 1));
    }
    for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
        if (!quadArray[i] || quadArray[i] == '') {
            quadString += '0';
        } else {
            quadString += quadArray[i];
        }
    }
    return quadString;
};


//pick a random number within a range of numbers
//int b rand(int a); where 0 <= b <= a
var rand = function (max) {
    return Math.floor(Math.random() * (max + 1));
};

// On creation of a UUID object, set it's initial value
var UUID = function () {
    this.id = this.createUUID();
};

// When asked what this Object is, lie and return it's value
UUID.prototype.valueOf = function () {
    return this.id;
};
UUID.prototype.toString = function () {
    return this.id;
};

//
// INSTANCE SPECIFIC METHODS
//
UUID.prototype.createUUID = function () {
    //
    // Loose interpretation of the specification DCE 1.1: Remote Procedure Call
    // since JavaScript doesn't allow access to internal systems, the last 48 bits
    // of the node section is made up using a series of random numbers (6 octets long).
    // 
    var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
    var dc = new Date();
    var t = dc.getTime() - dg.getTime();
    var tl = getIntegerBits(t, 0, 31);
    var tm = getIntegerBits(t, 32, 47);
    var thv = getIntegerBits(t, 48, 59) + '1'; // version 1, security version is 2
    var csar = getIntegerBits(rand(4095), 0, 7);
    var csl = getIntegerBits(rand(4095), 0, 7);

    // since detection of anything about the machine/browser is far to buggy,
    // include some more random numbers here
    // if NIC or an IP can be obtained reliably, that should be put in
    // here instead.
    var n = getIntegerBits(rand(8191), 0, 7) +
        getIntegerBits(rand(8191), 8, 15) +
        getIntegerBits(rand(8191), 0, 7) +
        getIntegerBits(rand(8191), 8, 15) +
        getIntegerBits(rand(8191), 0, 15); // this last number is two octets long
    return tl + tm + thv + csar + csl + n;
};
let _uuid=new UUID();
module.exports = {
    getId() {
        return _uuid.createUUID();
    }
};
