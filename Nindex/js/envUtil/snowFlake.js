var util = require("./commonUtils");
/**
 * Twitter_Snowflake<br>
 * SnowFlake的结构如下(每部分用-分开):<br>
 * 0 - 0000000000 0000000000 0000000000 0000000000 0 - 00000 - 00000 - 000000000000 <br>
 * 1位标识，由于long基本类型在Java中是带符号的，最高位是符号位，正数是0，负数是1，所以id一般是正数，最高位是0<br>
 * 41位时间戳(毫秒级)，注意，41位时间戳不是存储当前时间的时间戳，而是存储时间戳的差值（当前时间戳 - 开始时间戳)
 * 得到的值），这里的的开始时间戳，一般是我们的id生成器开始使用的时间，由我们程序来指定的（如下下面程序IdWorker类的startTime属性）。41位的时间戳，可以使用69年，年T = (1L << 41) / (1000L * 60 * 60 * 24 * 365) = 69<br>
 * 10位的数据机器位，可以部署在1024个节点，包括5位datacenterId和5位workerId<br>
 * 12位序列，毫秒内的计数，12位的计数顺序号支持每个节点每毫秒(同一机器，同一时间戳)产生4096个ID序号<br>
 * 加起来刚好64位，为一个Long型。<br>
 * SnowFlake的优点是，整体上按照时间自增排序，并且整个分布式系统内不会产生ID碰撞(由数据中心ID和机器ID作区分)，并且效率较高，经测试，SnowFlake每秒能够产生26万ID左右。
 */
const _Snow = {
    /** 开始时间戳 (2015-01-01) */
    twepoch: 1420041600000,
    /** 机器id所占的位数 */
    workerIdBits: 5,
    /** 数据标识id所占的位数 */
    datacenterIdBits: 5,
    /** 序列在id中占的位数 */
    sequenceBits: 12,
    /** 工作机器ID(0~31) */
    workerId: null,
    /** 数据中心ID(0~31) */
    datacenterId: null,
    /** 毫秒内序列(0~4095) */
    sequence: 0,
    /** 上次生成ID的时间戳 */
    lastTimestamp: -1
};
util.extend(_Snow, {
    /** 支持的最大机器id，结果是31 (这个移位算法可以很快的计算出几位二进制数所能表示的最大十进制数) */
    maxWorkerId: -1 ^ (-1 << _Snow.workerIdBits),
    /** 支持的最大数据标识id，结果是31 */
    maxDatacenterId: -1 ^ (-1 << _Snow.datacenterIdBits),
    /** 机器ID向左移12位 */
    workerIdShift: (_Snow.sequenceBits),
    /** 数据标识id向左移17位(12+5) */
    datacenterIdShift: (_Snow.sequenceBits + _Snow.workerIdBits),
    /** 时间戳向左移22位(5+5+12) */
    timestampLeftShift: (_Snow.sequenceBits + _Snow.workerIdBits + _Snow.datacenterIdBits),
    /** 生成序列的掩码，这里为4095 (0b111111111111=0xfff=4095) */
    sequenceMask: -1 ^ (-1 << _Snow.sequenceBits)
});
/**
 * 返回以毫秒为单位的当前时间
 * @return 当前时间(毫秒)
 */
let timeGen = () => {
    let _date = new Date();
    return _date.getTime();
};
/**
 * 阻塞到下一个毫秒，直到获得新的时间戳
 * @param lastTimestamp 上次生成ID的时间截
 * @return 当前时间戳
 */
let tilNextMillis = (lastTimestamp) => {
    let timestamp = timeGen();
    while (timestamp <= lastTimestamp) {
        timestamp = timeGen();
    }
    return timestamp;
};
/**组装最终ID*/
let _GetId = (timestamp, SNOW) => {
    let _id=((timestamp - SNOW.twepoch) << SNOW.timestampLeftShift) |
        (SNOW.datacenterId << SNOW.datacenterIdShift) |
        (SNOW.workerId << SNOW.workerIdShift) | SNOW.sequence;
    return _id>0?_id:-_id;
};
/**
 * 构造函数
 * @param workerId 工作ID (0~31)
 * @param datacenterId 数据中心ID (0~31)
 */
let SnowFlake = function (workerId, datacenterId) {
    util.extend(this, _Snow);
    if (workerId > this.maxWorkerId || workerId < 0) {
        //            throw new IllegalArgumentException(String.format("worker Id can't be greater than %d or less than 0", maxWorkerId));
        throw "1 " + this.maxWorkerId;
    }
    if (datacenterId > this.maxDatacenterId || datacenterId < 0) {
        //            throw new IllegalArgumentException(String.format("datacenter Id can't be greater than %d or less than 0", maxDatacenterId));
        throw "2";
    }
    this.workerId = workerId;
    this.datacenterId = datacenterId;
};
/**
 * 获得下一个ID 
 * @return SnowflakeId
 */
SnowFlake.prototype.nextId = function () {
    let timestamp = timeGen();

    //如果当前时间小于上一次ID生成的时间戳，说明系统时钟回退过这个时候应当抛出异常
    if (timestamp < this.lastTimestamp) {
        //            throw new RuntimeException(
        //                    String.format("Clock moved backwards.  Refusing to generate id for %d milliseconds", lastTimestamp - timestamp));
        throw "3";
    }

    //如果是同一时间生成的，则进行毫秒内序列
    if (this.lastTimestamp == timestamp) {
        this.sequence = (this.sequence + 1) & this.sequenceMask;
        //毫秒内序列溢出
        if (this.sequence == 0) {
            //阻塞到下一个毫秒,获得新的时间戳
            timestamp = tilNextMillis(this.lastTimestamp);
        }
    }
    //时间戳改变，毫秒内序列重置
    else {
        this.sequence = 0;
    }

    //上次生成ID的时间戳
    this.lastTimestamp = timestamp;

    //移位并通过或运算拼到一起组成64位的ID
    return _GetId(timestamp, this);
};
module.exports = new SnowFlake(0, 0);
