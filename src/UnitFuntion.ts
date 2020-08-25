
/**
 * 通用函数
 */

/**
 * 创建一个龙骨
 */

function createDB(dbname: string, target: any = null, fun: Function = null, obj: any = null): dragonBones.EgretArmatureDisplay {
    let egretFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;

    if (egretFactory.getDragonBonesData(dbname)) {
        let armatureDisplay: dragonBones.EgretArmatureDisplay = egretFactory.buildArmatureDisplay(dbname);

        if (fun) {
            fun.apply(obj, [armatureDisplay]);
        }

        return armatureDisplay;
    } else {
        let dragonbonesData;
        let textureData;
        let texture;

        let arr = ["_ske_json", "_tex_json", "_tex_png"];
        let typearr = [RES.ResourceItem.TYPE_JSON, RES.ResourceItem.TYPE_JSON, RES.ResourceItem.TYPE_IMAGE];

        dragonbonesData = RES.getRes(dbname + arr[0]);
        textureData = RES.getRes(dbname + arr[1]);
        texture = RES.getRes(dbname + arr[2]);
        let egretFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
        egretFactory.parseDragonBonesData(dragonbonesData);
        egretFactory.parseTextureAtlasData(textureData, texture);

        let armatureDisplay: dragonBones.EgretArmatureDisplay = egretFactory.buildArmatureDisplay(dbname);
        if (fun) {
            fun.apply(obj, [armatureDisplay]);
        }
        return armatureDisplay;

        /*
        let name = data.BaseData.ResourceUrl + "versionAssets/dragonbones/" + (dbname + arr[0]);
        let name1 = data.BaseData.ResourceUrl + "versionAssets/dragonbones/" + (dbname + arr[1]);
        let name2 = data.BaseData.ResourceUrl + "versionAssets/dragonbones/" + (dbname + arr[2]);

        RES.getResByUrl(name, (rdata) => {

            dragonbonesData = rdata;

            RES.getResByUrl(name1, (rdata) => {

                textureData = rdata;

                RES.getResByUrl(name2, (rdata) => {

                    let egretFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
                    texture = rdata;
                    egretFactory.parseDragonBonesData(dragonbonesData);
                    egretFactory.parseTextureAtlasData(textureData, texture);

                    let armatureDisplay: dragonBones.EgretArmatureDisplay = egretFactory.buildArmatureDisplay(dbname);
                    if (fun) {
                        fun.apply(obj, [armatureDisplay]);
                    }


                    return armatureDisplay;

                }, this, typearr[2]);

            }, this, typearr[1]);

        }, this, typearr[0]);*/
    }
}



function FstringToByte(str) {
    var bytes = new Array();
    var len, c;
    len = str.length;
    for (var i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    return bytes;


}

function Base64decode(input) {
    // private property
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    }
    output = _utf8_decode(output);
    return output;
}

// private method for UTF-8 encoding
var _utf8_encode = function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }
    return utftext;
}

// private method for UTF-8 decoding
var _utf8_decode = function (utftext) {
    var string = "";
    var i = 0;
    var c1, c2, c3;
    var c = c1 = c2 = 0;
    while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if ((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = utftext.charCodeAt(i + 1);
            c3 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }
    return string;
}


/**
 * 打印到控制台
 */
function Log(...optionalParams: any[]): void {

    if (RELEASE) {
        return;
    }
    console.log.apply(console, optionalParams);
}
/**
 * 网页全屏
 */
function fullScreen() {
    var docElm: any = document.documentElement;
    //W3C   
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    }
    //FireFox   
    else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    }
    //Chrome等   
    else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    }
    //IE11   
    else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
    }
}

/**
 * 数值不足，改变字体颜色
 */
function changeTextColor(text: eui.Label, Jnumber: number, sourceColor: number) {
    text.textColor = sourceColor;
    if (Number(text.text) > Jnumber) {
        text.textColor = 0xe33131;
    }
}

/**
 * 数字转万，亿
 */
function numberToText(num: any): string {
    num = Number(num);
    let reNum = num + "";
    let tail = "";
    if (num > 100000000) {
        num /= 100000000;
        tail = "亿";
    } else if (num > 10000) {
        num /= 10000;
        tail = "万";
    }

    reNum = num + "";
    let floatNum = "0";
    if (reNum.split(".").length > 1) {
        floatNum = reNum.split(".")[1].substr(0, 1);
    }
    if (floatNum == "0") {
        reNum = reNum.split(".")[0] + tail;
    } else {
        reNum = reNum.split(".")[0] + "." + floatNum + tail;
    }

    return reNum;
}

/**
 * 数字单位换算
 */
function numberToStr(num: number) {
    let unit = ['', 'k', 'm', 'b', 't', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah',
        'ai',
        'aj',
        'ak',
        'al',
        'am',
        'an',
        'ao',
        'ap',
        'aq',
        'ar',
        'as',
        'at',
        'au',
        'av',
        'aw',
        'ax',
        'ay',
        'az',
        'ba',
        'bb',
        'bc',
        'bd',
        'be',
        'bf',
        'bg',
        'bh',
        'bi',
        'bj',
        'bk',
        'bl',
        'bm',
        'bn',
        'bo',
        'bp',
        'bq',
        'br',
        'bd',
        'bt',
        'bu',
        'bv',
        'bw',
        'bx',
        'by',
        'bz',
        'ca',
        'cb',
        'cc',
        'cd',
        'ce',
        'cf',
        'cg',
        'ch',
        'ci',
        'cj',
        'ck',
        'cl',
        'cm',
        'cn'];


    let count = 1;
    let Tnum = num / 1000;
    while (Tnum >= 1) {
        count++;
        Tnum /= 1000;
    }


    let newstr = (Tnum * 100000) / 100 + "";
    let str0 = newstr.split(".")[0];
    let str1 = newstr.split(".")[1];

    if (str1) {
        let str2 = str1.substring(0, 3 - str0.length);
        if (str2 != "" && str2 != "0") {
            str0 += ("." + str2);
        }
    }

    let numStr = str0 + unit[count - 1];
    if (count == 1) {
        numStr = Math.ceil(num) + "";
    }

    return numStr;
}

function strToNumber(numStr) {
    let unit = ['', 'k', 'm', 'b', 't', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah',
        'ai',
        'aj',
        'ak',
        'al',
        'am',
        'an',
        'ao',
        'ap',
        'aq',
        'ar',
        'as',
        'at',
        'au',
        'av',
        'aw',
        'ax',
        'ay',
        'az',
        'ba',
        'bb',
        'bc',
        'bd',
        'be',
        'bf',
        'bg',
        'bh',
        'bi',
        'bj',
        'bk',
        'bl',
        'bm',
        'bn',
        'bo',
        'bp',
        'bq',
        'br',
        'bd',
        'bt',
        'bu',
        'bv',
        'bw',
        'bx',
        'by',
        'bz',
        'ca',
        'cb',
        'cc',
        'cd',
        'ce',
        'cf',
        'cg',
        'ch',
        'ci',
        'cj',
        'ck',
        'cl',
        'cm',
        'cn'];
    let n = 0;
    for (n; n < numStr.length; n++) {
        var q = numStr[n];
        if (q >= 'a' && q <= 'z') {
            break;
        }
    }
    let num = Number(numStr.substring(0, n));

    let count = 0;
    if (n <= numStr.length) {
        count = unit.indexOf(numStr.substring(n, numStr.length));
    }
    for (let i = 0; i < count; i++) {
        num *= 1000;
    }

    return num;
}

var soundc;
function playSound(name) {
    var sound: egret.Sound = RES.getRes(name + "_mp3");
    if (sound) {
        if (soundc) {
            soundc.stop();
        }
        soundc = sound.play(0, 1);
    }
}

/**
 * 转换字符串到图片
 */
function changeStrToImg(textFileName: string, text: string, showGroup: eui.Group, scaleNum: number = 1, isRemvove = true) {
    if (isRemvove)
        showGroup.removeChildren();

    for (var n = 0; n < text.length; n++) {
        var q = text.substring(n, n + 1);
        var poke = new eui.Image();

        switch (q) {
            case ".":
            case ":":
                poke.source = RES.getRes("numberG_dian_png");
                break;
            case "万":
                poke.source = RES.getRes(textFileName + "_wan_png");
                break;
            case "亿":
                poke.source = RES.getRes(textFileName + "_yi_png");
                break;
            default:
                if (q < 'A' || q > 'Z') {
                    poke.source = RES.getRes(textFileName + "_" + q + "_png");
                } else {
                    poke.source = RES.getRes(textFileName + "_" + q + "2_png");
                }

                break;
        }
        if (poke.source == null) {
            poke.width = 10;
        }

        poke.scaleX = poke.scaleY = scaleNum;
        showGroup.addChild(poke);
    }
}

/**
* 本地文件操作
* @param key {string} 文件的关键字
* @param data {string} 文件内容
* @param invalidTime {number} 失效时间，-1：永不失效
*/
function saveLocalData(key: string, rdata: string, invalidTime: number = -1) {

    let saveKey = GameData.GAMENAME + key;
    rdata = rdata + "@TIME:" + Date.now() + "@TIME:" + invalidTime;
    egret.localStorage.setItem(saveKey, rdata);
}
function readLocalData(key: string): string {

    let saveKey = GameData.GAMENAME + key;
    let rdata = egret.localStorage.getItem(saveKey);
    if (!rdata || rdata == null) {
        return null;
    }
    if (Number(rdata.split("@TIME:")[2]) != -1) {
        if (Date.now() - Number(rdata.split("@TIME:")[1]) >= Number(rdata.split("@TIME:")[2])) {
            egret.localStorage.removeItem(saveKey);
            return null;
        } else {
            return rdata.split("@TIME:")[0];
        }
    } else {
        return rdata.split("@TIME:")[0];
    }
}
function clearLocalData(key: string) {

    let saveKey = GameData.GAMENAME + key;
    if (saveKey != null) {
        egret.localStorage.removeItem(saveKey);
    }
    else {
        egret.localStorage.clear();
    }
}
/**
 * 
 */
function getrect(obj: any, off: egret.Point): egret.Rectangle {
    var rect: egret.Rectangle = obj.getBounds();
    rect.x = obj.x - off.x;
    rect.y = obj.y - off.y;

    return rect;
}
/**
     * 创建矩形实心框
     * @param x {number} x轴坐标
     * @param y {number} y轴坐标
     * @param width {number} 长度
     * @param height {number} 高度
     * @param alpha {number} 透明度
     * @param color {number} 颜色
     * @returns {egret.Shape}
*/
function createRect(x: number, y: number, width: number, height: number, alpha: number = 1, color: number = 0x000000, ellipseWidth: number = 0, ellipseHeight?: number): egret.Shape {
    var shp: egret.Shape = new egret.Shape();
    shp.x = x;
    shp.y = y;
    shp.graphics.beginFill(color, alpha);
    shp.graphics.drawRoundRect(0, 0, width, height, ellipseWidth, ellipseHeight);
    //shp.graphics.drawRect(0, 0, width, height);
    shp.graphics.endFill();
    return shp;
}
/**
     * 创建实心圆
     * @param x {number} x轴坐标
     * @param y {number} y轴坐标
     * @param width {number} 长度
     * @param height {number} 高度
     * @param alpha {number} 透明度
     * @param color {number} 颜色
     * @returns {egret.Shape}
*/
function createCircle(x: number, y: number, radius: number, alpha: number = 1, color: number = 0x000000): egret.Shape {
    var circle: egret.Shape = new egret.Shape();
    circle.graphics.beginFill(color, alpha);
    circle.graphics.drawCircle(x, y, radius);
    circle.graphics.endFill();
    return circle;
}
/**
 * 创建一个MC动画
 *  @param datares 动画资源名
 *  @param bitmapres 资源texture
 *  @param resName 具体动画名
 */
function createMC(datares: string, bitmapres: string, resName: string): egret.MovieClip {
    let mc_data: any = RES.getRes(datares);
    let mc_bitmap: egret.Texture = RES.getRes(bitmapres);
    let mc_factory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mc_data, mc_bitmap);
    let mcFaceData: egret.MovieClipData = mc_factory.generateMovieClipData(resName);
    let mc: egret.MovieClip = new egret.MovieClip(mcFaceData);

    return mc;
}
/**
 *  创建一个bitmap
 */
function createBitmap(resname: string, anx: number = 0.5, any: number = 0.5): egret.Bitmap {
    let bitamp: egret.Bitmap = new egret.Bitmap();
    bitamp.texture = RES.getRes(resname);
    bitamp.anchorOffsetX = bitamp.width * anx;
    bitamp.anchorOffsetY = bitamp.height * any;
    return bitamp;
}
/**
 * @param shlider: 横向滑动条
 * @param minnum: 最小值
 * @param maxnum：最大值
 */
function initSHlider(shlider: eui.HSlider, minnum, maxnum) {
    shlider.minimum = minnum;
    shlider.maximum = maxnum;
    shlider.value = 1;
}
/**
 *  数组排序(倒序)
 * dir: true(从小到大)；false(从大到小)
 */
function compare(prop, dir = false) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (dir) {
            if (val1 > val2) {
                return 1;
            } else if (val1 < val2) {
                return -1;
            } else {
                return 0;
            }
        } else {
            if (val1 < val2) {
                return 1;
            } else if (val1 > val2) {
                return -1;
            } else {
                return 0;
            }
        }
    }
}

/**
 * 设置string长度
 */
function setStrLength(str: string, len: number, replacestr?: string) {
    let strT = str;
    let maxlen = replacestr ? len + replacestr.length : len;
    if (strT.length > maxlen) {
        strT = strT.substr(0, len);
        if (replacestr) {
            strT += replacestr;
        }
    }

    return strT;
}

function setStrLengthByLable(str: eui.Label, len: number, replacestr?: string) {
    let strT = str.text;
    if (str.textWidth > len) {
        strT = strT.substr(0, strT.length - Math.floor((str.width - len) / (str.width / strT.length)));
        if (replacestr) {
            strT += replacestr;
        }
    }

    return strT;
}

/**
 * 点击复制
 * @param value: 要被复制的值
 */
function copyCode(value) {
    var cloneActiveElement = value;
    var copyText: any = document.getElementById("copy_text");
    copyText.innerHTML = cloneActiveElement;
    copyText.readOnly = false;
    copyText.select();
    copyText.setSelectionRange(0, copyText.value.length);
    document.execCommand("copy");
    copyText.readOnly = true;
}

/**
 * 导出json为class
 */
function exportclass() {
    let listNmae = "configcookexpend";
    let Name = "烹饪台升级消耗系数";
    let par = {
        "beizhu": "",
        "id": 1,
        "isRepeat": 1,
        "maxRandomTime": 12,
        "shopId": "1001,1002,1003,1004,1005,1006",
        "weight": 100
    }
    let str = '/**\n* ' + Name + '配置表\n*/\n' + "export class " + listNmae + " {\n";
    for (let key in par) {
        str += "public " + key + ": " + typeof (par[key]) + ";" + "\n";
    }
    str += "}\n\n";
    str += "//" + Name + "配置表\n"
    str += "public static " + listNmae + "List:" + "Array<jsondata.config." + listNmae + "> = [];\n\n";
    str += "//" + Name + "配置表\n" + "this.writeConfig(receiveJson." + listNmae + ", this." + listNmae + "List);\n" + 'Log("' + Name + '配置表", this.' + listNmae + 'List);'
    Log(str);
    return str;
}

/**
* js数组实现权重概率分配，支持数字比模式(支持2位小数)和百分比模式(不支持小数，最后一个元素多退少补)
* @param  Array  arr  js数组，参数类型[Object,Object,Object……]
* @return  Array      返回一个随机元素，概率为其weight/所有weight之和，参数类型Object
* @author  shuiguang
*/
//自定义Math求最小公约数方法
function gcd(a, b) {
    var min = Math.min(a, b);
    var max = Math.max(a, b);
    var result = 1;
    if (a === 0 || b === 0) {
        return max;
    }
    for (var i = min; i >= 1; i--) {
        if (min % i === 0 && max % i === 0) {
            result = i;
            break;
        }
    }
    return result;
}
function weight_rand(arr) {
    //参数arr元素必须含有weight属性，参考如下所示
    //var arr=[{name:'1',weight:1.5},{name:'2',weight:2.5},{name:'3',weight:3.5}];
    //var arr=[{name:'1',weight:'15%'},{name:'2',weight:'25%'},{name:'3',weight:'35%'}];
    //求出最大公约数以计算缩小倍数，perMode为百分比模式
    var per;
    var maxNum = 0;
    var perMode = false;

    //使用clone元素对象拷贝仍然会造成浪费，但是使用权重数组对应关系更省内存
    var weight_arr = new Array();
    for (var i = 0; i < arr.length; i++) {
        if ('undefined' != typeof (arr[i].weight)) {
            if (arr[i].weight.toString().indexOf('%') !== -1) {
                per = Math.floor(arr[i].weight.toString().replace('%', ''));
                perMode = true;
            } else {
                per = Math.floor(arr[i].weight * 100);
            }
        } else {
            per = 0;
        }
        weight_arr[i] = per;
        maxNum = gcd(maxNum, per);
    }
    //数字比模式，3:5:7，其组成[0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2]
    //百分比模式，元素所占百分比为15%，25%，35%
    var index = new Array();
    var total = 0;
    var len = 0;
    if (perMode) {
        for (var i = 0; i < arr.length; i++) {
            //len表示存储arr下标的数据块长度，已优化至最小整数形式减小索引数组的长度
            len = weight_arr[i];
            for (var j = 0; j < len; j++) {
                //超过100%跳出，后面的舍弃
                if (total >= 100) {
                    break;
                }
                index.push(i);
                total++;
            }
        }
        //使用最后一个元素补齐100%
        while (total < 100) {
            index.push(arr.length - 1);
            total++;
        }
    } else {
        for (i = 0; i < arr.length; i++) {
            //len表示存储arr下标的数据块长度，已优化至最小整数形式减小索引数组的长度
            len = weight_arr[i] / maxNum;
            for (j = 0; j < len; j++) {
                index.push(i);
            }
            total += len;
        }
    }
    //随机数值，其值为0-11的整数，数据块根据权重分块
    var rand = Math.floor(Math.random() * total);
    //console.log(index);
    return arr[index[rand]];
}
/**
 *
 * 随机数工具类
 *
 */
class RandomUtils {
    /**
     * 获取一个区间的随机数
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    public static limit($from: number, $end: number): number {
        $from = Math.min($from, $end);
        $end = Math.max($from, $end);
        var range: number = $end - $from;
        return $from + Math.random() * range;
    }

    /**
     * 获取一个区间的随机数(整数)
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    public static limitInteger($from: number, $end: number): number {
        return Math.floor(this.limit($from, $end + 1));
    }

    /**
     * 在一个数组中随机获取一个元素
     * @param arr 数组
     * @returns {any} 随机出来的结果
     */
    public static getElementInArray(arr: Array<any>): any {
        var index: number = Math.floor(Math.random() * arr.length);
        return arr[index];
    }

    /**
     * 对一个数组乱序
     */
    public static randomArray(arr: Array<any>): any {
        for (let i = 0; i < arr.length; i++) {
            const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i;
            [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]
        }
        return arr;
    }
}

/**
 * 解析富文本类
 */
class HtmlToJson {

    private stackArray;
    private resutlArr;
    private replaceArr;

    public constructor() {
        this.initReplaceArr();
    }

    private initReplaceArr() {
        this.replaceArr = [];
        this.replaceArr.push([/&lt;/g, "<"]);
        this.replaceArr.push([/&gt;/g, ">"]);
        this.replaceArr.push([/&amp;/g, "&"]);
        this.replaceArr.push([/&quot;/g, "\""]);
        this.replaceArr.push([/&apos;/g, "\'"]);
        this.replaceArr.push([/br;/g, "\n"]);
    }

    private replaceSpecial(value) {
        for (var i = 0; i < this.replaceArr.length; i++) {
            var k = this.replaceArr[i][0];
            var v = this.replaceArr[i][1];
            value = value.replace(k, v);
        }
        return value;
    }

    public parse(htmltext: string) {

        this.stackArray = [];
        this.resutlArr = [];
        var firstIdx = 0; //文本段开始位置
        var length = htmltext.length;
        while (firstIdx < length) {
            var starIdx = htmltext.indexOf("<", firstIdx);
            if (starIdx < 0) {
                this.addToResultArr(htmltext.substring(firstIdx));
                firstIdx = length;
            }
            else {
                this.addToResultArr(htmltext.substring(firstIdx, starIdx));
                var fontEnd = htmltext.indexOf(">", starIdx);
                if (fontEnd == -1) {
                    egret.$error(1038);
                    fontEnd = starIdx;
                }
                else if (htmltext.charAt(starIdx + 1) == "\/") {
                    if (htmltext.substring(starIdx + 1, fontEnd) == "/p") {
                        if (this.resutlArr.length > 0)
                            this.resutlArr[this.resutlArr.length - 1].text += "\n";
                        else {
                            this.resutlArr.push({ text: "\n" });
                        }
                    }
                    this.stackArray.pop();
                }
                else {
                    this.addToArray(htmltext.substring(starIdx + 1, fontEnd));
                }

                firstIdx = fontEnd + 1;
            }
        }
        return this.resutlArr;
    }

    private addToResultArr(value) {
        if (value == "") {
            return;
        }
        value = this.replaceSpecial(value);
        if (this.stackArray.length > 0) {
            this.resutlArr.push({ text: value, style: this.stackArray[this.stackArray.length - 1] });
        }
        else {
            this.resutlArr.push({ text: value });
        }
    }

    private addToArray(infoStr) {

        var info = this.changeStringToObject(infoStr);
        if (this.stackArray.length == 0) {
            this.stackArray.push(info);
        }
        else {
            var lastInfo = this.stackArray[this.stackArray.length - 1];
            for (var key in lastInfo) {
                if (info[key] == null) {
                    info[key] = lastInfo[key];
                }
            }
            this.stackArray.push(info);
        }
    }

    private changeStringToObject(str) {
        str = str.trim();
        var info = {};
        var header = [];

        if (header = str.match(/^(span|a|br)\s/)) {
            let isbr = header[1];

            if (isbr == "br") {
                if (this.resutlArr.length > 0)
                    this.resutlArr[this.resutlArr.length - 1].text += "\n";
                else {
                    this.resutlArr.push({ text: "\n" });
                }
            }

            str = str.substring(header[0].length).trim();
            let newstr: string[] = str.split(";");
            newstr[0] = newstr[0].replace('style=', "").substr(1);
            for (let i = 0; i < newstr.length; i++) {
                str = newstr[i].replace(":", "=");
                var next = 0;
                var titles = void 0;
                while (titles = str.match(this.getHeadReg())) {
                    var title = titles[0];
                    var value = "";
                    str = str.substring(title.length).trim();
                    if (str.charAt(0) == "\"") {
                        next = str.indexOf("\"", 1);
                        value = str.substring(1, next);
                        next += 1;
                    }
                    else if (str.charAt(0) == "\'") {
                        next = str.indexOf("\'", 1);
                        value = str.substring(1, next);
                        next += 1;
                    }
                    else {
                        value = str.match(/(\S)+/)[0];
                        next = value.length;
                    }
                    this.addProperty(info, title.substring(0, title.length - 1).trim(), value.trim());
                    str = str.substring(next).trim();
                }
            }
        }
        return info;
    }

    private getHeadReg() {
        return /^(font-size|color|textcolor|strokecolor|stroke|b|bold|i|italic|u|size|fontfamily|href|target)(\s)*=/;
    }

    private addProperty(info, head, value) {
        switch (head.toLowerCase()) {
            case "color":
            case "textcolor":
                value = value.replace(/#/, "0x");
                info.textColor = parseInt(value);
                break;
            case "strokecolor":
                value = value.replace(/#/, "0x");
                info.strokeColor = parseInt(value);
                break;
            case "stroke":
                info.stroke = parseInt(value);
                break;
            case "b":
            case "bold":
                info.bold = value == "true";
                break;
            case "u":
                info.underline = value == "true";
                break;
            case "i":
            case "italic":
                info.italic = value == "true";
                break;
            case "size":
            case "font-size":
                info.size = parseInt(value);
                break;
            case "fontfamily":
                info.fontFamily = value;
                break;
        }
    }


    private static _i: HtmlToJson = null;
    public static getInstence(): HtmlToJson {
        return this._i ? this._i : (this._i = new HtmlToJson())
    }
}

/**
 * 暂停音乐
 */
function pauseSound() {
    // if (data.gameData.gamesound[data.gameData.currentBGM]) {
    //     data.gameData.gamesound[data.gameData.currentBGM].stop();
    // }
}
/**
 * 恢复音乐
 */
function rusumeSound() {
    // if (data.gameData.gamesound[data.gameData.currentBGM] && !data.gameData.gamesound[data.gameData.currentBGM].playing && !data.BaseData.isShowAD) {
    //     data.gameData.gamesound[data.gameData.currentBGM].play(0, 0);
    // }
}

/**
 * @param resourceName: 资源名
 * @param fileName: 文件名
 * @param type: 文件类型
 */
function readZip(resourceName, fileName, type, callback) {
    // RES.getResAsync(resourceName, (data) => {
    //     // 解压，读取
    //     JSZip.loadAsync(data).then((zipdata) => {
    //         return zipdata.file(fileName).async(type)
    //     }).then(callback)
    // }, this);
}


class GUID {
    public constructor() {

    }

    private _list = {};

    private GUID() {
        do {
            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        } while (!this.register(guid));
        return guid;
    };

    public create() {
        return this.GUID();
    }

    private getlist() {
        var list = [];
        for (var k in this._list) {
            list.push(k);
        }
        return list;
    }

    private setlist(newList) {
        this._list = {};
        for (var i = 0; i < newList.length; i++) {
            this._list[newList[i]] = 1;
        }
    }

    private exists(guid) {
        return !!(this._list[guid]);
    }

    private register(guid) {
        if (this.exists(guid)) {
            return false;
        } else {
            this._list[guid] = 1;
            return true;
        }
    }

}

/**
 * 数字转换时间格式
 * @param value: 时间，毫秒
 */
function numberToTime(value, type = 0) {
    value = Math.floor(Number(value) / 1000);
    var d = Math.floor(value / (60 * 60 * 24));  //天数
    var h = (Math.floor(value / 3600)) % 24;  //小时
    var m = (Math.floor(value / 60)) % 60;  //分钟
    var s = Math.floor(value % 60);  //秒

    if (type == 0) {
        if (h == 0) {
            return fillzero(m) + ":" + fillzero(s);
        } else {
            return fillzero(h) + ":" + fillzero(m) + ":" + fillzero(s);
        }
    } else if (type == 1) {
        if (h == 0) {
            return "00:" + fillzero(m) + ":" + fillzero(s);
        } else {
            return fillzero(h) + ":" + fillzero(m) + ":" + fillzero(s);
        }
    } else if (type == 2) {
        h = (Math.floor(value / 3600));  //小时
        if (h == 0) {
            return "00:" + fillzero(m) + ":" + fillzero(s);
        } else {
            return fillzero(h) + ":" + fillzero(m) + ":" + fillzero(s);
        }
    }
}
function fillzero(value) {
    return value < 10 ? "0" + value : "" + value;
}
function changetime(value) {
    value = Number(value) * 1000;
    let _time = new Date(value);
    // console.log(_time, (24 * 60 * 60) - (_time.getHours() * 60 * 60 + _time.getMinutes() * 60 + _time.getSeconds()));
    return (24 * 60 * 60) - (_time.getHours() * 60 * 60 + _time.getMinutes() * 60 + _time.getSeconds())
}
function checkSameDay(d1, d2): boolean {
    let time1 = new Date(d1);
    let time2 = new Date(d2);
    if (time1.getFullYear() == time2.getFullYear() && time1.getMonth() == time2.getMonth() && time1.getDate() == time2.getDate()) {
        return true;
    }

    return false;
}

/**
 * 数字转换时间格式
 * @param value: 时间，毫秒
 */
function TimeTonumber(value): number {
    let timeArr = value.split(":");
    var h = Number(timeArr[0]) * 3600;
    var m = Number(timeArr[1]) * 60;
    var s = Number(timeArr[2]);

    return (h + m + s);
}


async function wait(time) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, time);
    })
}
//检测手机号码
function checkPhone(phone) {

    if (!(/^1[3456789]\d{9}$/.test(phone))) {
        // alert("手机号码有误，请重填");  
        return false;
    }

    return true;
}
//检测密码
function checkPassword(psw) {
    if (!(/^(\w){6,8}$/.exec(psw))) {
        return false;
    }

    return true;
}

/**
 * 绘制渐变shape
 */
function drawGradient(w, h) {
    let shape = new egret.Shape();
    shape.width = w;
    shape.height = h;
    let $max: egret.Matrix = shape.matrix;
    $max.a = $max.d = 1;
    $max.c = $max.b = 0;
    shape.graphics.beginGradientFill(egret.GradientType.RADIAL, [0xffffff, 0x5DACFD], [0, 1], [0, 30], $max);
    shape.graphics.drawRoundRect(0, 0, shape.width, shape.height, 0, 0);
    shape.graphics.endFill();

    return shape;
}

