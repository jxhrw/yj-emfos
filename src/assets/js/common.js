import Vue from 'vue';
var Common = {
    groupByKey(data, key, keyArray) {
        /**
         * 【数组按key分组】
         * @data(Array) :     需要分组的目标数组
         * @key(String) :     根据该key值分组
         * @keyArray(Array) : 最外面的分组是否还需要其他字段（这些字段只能为现有的字段中取）
         * => return(Array):  返回值：分组后的数组
         **/
        keyArray = keyArray || [];
        var map = {};
        var list = [];
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (!map[item[key]]) {
                var obj = {};
                obj[key] = item[key]; // 主键1
                for (var x in keyArray) { // 其他键
                    obj[keyArray[x]] = item[keyArray[x]];
                }
                obj.list = [];
                obj.list.push(item);
                list.push(obj);
                map[item[key]] = item;
            } else {
                for (var j in list) {
                    if (list[j][key] === item[key]) {
                        list[j].list.push(item);
                        break;
                    }
                }
            }
        }
        return list;
    },
    getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    getNowDate() {
        var now = new Date();
        var year = now.getFullYear();
        var month = this.formatNum(now.getMonth() + 1);
        var day = this.formatNum(now.getDate());
        return year + '/' + month + '/' + day;
    },
    formatNum(num) {
        num < 10 ? num = '0' + num : '';
        return num;
    },
    GetLunarDay(solarYear, solarMonth, solarDay) {
        /* 农历部分 */
        var CalendarData = new Array(100);
        var madd = new Array(12);
        // var tgString = "甲乙丙丁戊己庚辛壬癸";
        // var dzString = "子丑寅卯辰巳午未申酉戌亥";
        var numString = "一二三四五六七八九十";
        var monString = "正二三四五六七八九十冬腊";
        // var weekString = "日一二三四五六";
        // var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
        var cYear, cMonth, cDay, TheDate;
        CalendarData = [0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95];
        madd[0] = 0;
        madd[1] = 31;
        madd[2] = 59;
        madd[3] = 90;
        madd[4] = 120;
        madd[5] = 151;
        madd[6] = 181;
        madd[7] = 212;
        madd[8] = 243;
        madd[9] = 273;
        madd[10] = 304;
        madd[11] = 334;

        function GetBit(m, n) {
            return (m >> n) & 1;
        }

        function e2c() {
            TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
            var total, m, n, k;
            var isEnd = false;
            var tmp = TheDate.getYear();
            if (tmp < 1900) {
                tmp += 1900;
            }
            total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;

            if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
                total++;
            }
            for (m = 0;; m++) {
                k = (CalendarData[m] < 0xfff) ? 11 : 12;
                for (n = k; n >= 0; n--) {
                    if (total <= 29 + GetBit(CalendarData[m], n)) {
                        isEnd = true;
                        break;
                    }
                    total = total - 29 - GetBit(CalendarData[m], n);
                }
                if (isEnd) break;
            }
            cYear = 1921 + m;
            cMonth = k - n + 1;
            cDay = total;
            if (k == 12) {
                if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
                    cMonth = 1 - cMonth;
                }
                if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
                    cMonth--;
                }
            }
        }

        function GetcDateString() {
            var tmp = "";
            /* tmp += tgString.charAt((cYear - 4) % 10);
            tmp += dzString.charAt((cYear - 4) % 12);
            tmp += "(";
            tmp += sx.charAt((cYear - 4) % 12);
            tmp += ")年 "; */
            if (cMonth < 1) {
                tmp += "(闰)";
                tmp += monString.charAt(-cMonth - 1);
            } else {
                tmp += monString.charAt(cMonth - 1);
            }
            tmp += "月";
            tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十"));
            if (cDay % 10 != 0 || cDay == 10) {
                tmp += numString.charAt((cDay - 1) % 10);
            }
            return tmp;
        }

        if (solarYear < 1921 || solarYear > 2020) {
            return "";
        } else {
            solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
            e2c(solarYear, solarMonth, solarDay);
            return GetcDateString();
        }
    },
    showCal() {
        var D = new Date();
        var yy = D.getFullYear();
        var mm = D.getMonth() + 1;
        var dd = D.getDate();
        return this.GetLunarDay(yy, mm, dd);
    },
    showWeek() {
        var a = ["日", "一", "二", "三", "四", "五", "六"];
        var week = new Date().getDay();
        var str = "星期" + a[week];
        return str;
    },
    showCurrentDate() {
        var now = new Date();
        var year = now.getFullYear();
        var month = this.formatNum(now.getMonth() + 1);
        var day = this.formatNum(now.getDate());
        return year + '年' + month + '月' + day + '日';
    },
    showTime() {
        var now = new Date();
        var h = this.formatNum(now.getHours());
        var m = this.formatNum(now.getMinutes());
        var s = this.formatNum(now.getSeconds());
        return h + ":" + m + ':' + s;
    },
    getCurrentDate() {
        var now = new Date();
        var year = now.getFullYear();
        var month = this.formatNum(now.getMonth() + 1);
        var day = this.formatNum(now.getDate());
        return year + '-' + month + '-' + day;
    },
    getCurrentDate4ScheLevel() {
        var now = new Date();
        var year = now.getFullYear();
        var month = this.formatNum(now.getMonth() + 1);
        var day = this.formatNum(now.getDate());
        return year + '/' + month + '/' + day;
    },
    printErrorLog(host, method) {
        console.log(
            "接口报错，接口为：" + host + method
        );
    },
    ejMessage(type, message) {
        let messageText = '';
        switch (type) {
            case "success":
                messageText = '数据提交成功！';
                break;
            case "warning":
                messageText = '数据提交失败！';
                break;
            default:
                break;
        }
        messageText = message || messageText;
        Vue.prototype.$message({
            message: messageText,
            type: type
        });
    },
    getDevCategory(type) {
        let obj = { 'code': '', 'name': '' };
        if (!type) {
            obj.code = 'REPDEVCATEGORY01';
            obj.name = '外场智能设备';
        } else if (type == "ss") {
            obj.code = 'REPDEVCATEGORY02';
            obj.name = '外场智能设施';
        }
        return obj;
    },
    dateFormat(fmt, date) {
        var o = {
            "M+": date.getMonth() + 1, // 月份
            "d+": date.getDate(), // 日
            "h+": date.getHours(), // 小时
            "m+": date.getMinutes(), // 分
            "s+": date.getSeconds(), // 秒
            "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
            "S": date.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length)); }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); }
        }
        return fmt;
    },
    getMyDic(type) {
        let arr = [];
        let address = '';
        if (window.location.host.indexOf('172.100.102.50') > -1) {
            address = '九江';
        } else if (window.location.host.indexOf('192.168.106.121') > -1) {
            address = '南昌';
        } else {
            address = '南昌';
        }
        if (type == 'devFactory') {
            if (address == '九江') {
                arr = [{ dicCode: '1', dicName: '1' }, { dicCode: '2', dicName: '2' }, { dicCode: '3', dicName: '3' }];
            }
            if (address == '南昌') {
                arr = [{ dicCode: '1', dicName: '1' }, { dicCode: '2', dicName: '2' }, { dicCode: '3', dicName: '3' }];
            }
        }
        if (type == 'project') {
            if (address == '九江') {

            }
            if (address == '南昌') {

            }
        }
        if (type == 'company') {
            if (address == '九江') {

            }
            if (address == '南昌') {

            }
        }
        if (type == 'unit') {
            if (address == '九江') {

            }
            if (address == '南昌') {

            }
        }
        return arr;
    },
    baseImg(imgs, _this, url) {
        var obj = {};
        obj.path = imgs;
        obj.token = _this.token;
        return _this.$api.get(url, obj, '').then(res => {
            return res;
        });
    },
    getPageUrlEl() {
        var str = window.location.href;
        var search = window.location.search;
        var list = str.split(search);
        var f = list[0].split('/');
        var s = list[1].split('#/');
        var rourt = '';
        if (s.length > 1) {
            if (s[1].indexOf('?') > -1) {
                rourt = s[1].split('?')[0]
            } else {
                rourt = s[1];
            }
        }
        var url = '/' + f[f.length - 1] + (rourt ? (',' + rourt) : '');
        var menus = JSON.parse(sessionStorage.getItem('menus')) || [];
        var rightEl = '';
        menus.map(val => {
            if (val.rightUrl && val.rightUrl.indexOf(url) > -1) {
                rightEl = (val.rightEl);
            } else {
                val.children.map(vas => {
                    if (vas.rightUrl && vas.rightUrl.indexOf(url) > -1) {
                        rightEl = (vas.rightEl);
                    }
                });
            }
        });
        return rightEl;
    },
    // 驼峰转换下划线
    toLine(name) {
    return name.replace(/([A-Z])/g,"_$1").toLowerCase();
    }
};

export default Common;