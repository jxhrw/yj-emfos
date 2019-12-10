import api from '@/assets/js/http.js';
import Common from "@/assets/js/common.js";
import Bus from "@/assets/js/bus.js";
import qs from 'qs';
// var Config = require('static/config/config.json');
var Config;
let token = Common.getQueryString("token");
let interfaceData;
var reFreshCheckResultFucDetail = (devTypeCode, callback, interfaceData) => {
    api.getMethod(interfaceData.efoms_HOST, interfaceData.getReFreshCheckResult, {
            devTypeCode: devTypeCode
        }, token)
        .then(res => {
            if (res.appCode == 0) {
                Common.ejMessage("success");
                if (callback) {
                    callback();
                }
            } else {
                Common.ejMessage("warning");
                Common.printErrorLog(interfaceData.efoms_HOST, interfaceData.getReFreshCheckResult);
            }
        })
        .catch(err => {
            Common.printErrorLog(interfaceData.efoms_HOST, interfaceData.getReFreshCheckResult);
            console.log(err);
        });
};
var isObjArr = (value) => {
    if (Object.prototype.toString.call(value) === "[object Array]") {
        //  console.log('value是数组');
        return 1;
    } else if (Object.prototype.toString.call(value) === '[object Object]') {
        //  console.log('value是对象');
        return 0;
    } else {
        //  console.log('value不是数组也不是对象');
        return -1;
    }
};
var insertCheckRecordInfoFucDetail = (type, data, remarks, callback, interfaceData) => {
    console.log(data);
    let num = isObjArr(data);
    if (num == 0) data = [data];
    let arr = [];
    console.log(data);
    data.map((val) => {
        console.log(val);
        let recodeInfo = {
            devCategoryCode: Common.getDevCategory().code,
            devCategoryName: Common.getDevCategory().name,
            devTypeCode: val.devTypeCode,
            devTypeName: val.devTypeName,
            devId: val.devId,
            devName: val.devName,
            devAreaCode: val.devAreaCode,
            devAreaName: val.devAreaName,
            checkResultCode: type,
            checkResultName: type === "DEVICERESULT02" ? "正常" : (type === "DEVICERESULT03" ? "异常" : ""),
            checkMemo: remarks
        };
        arr.push(recodeInfo);
    });
    api.getMethod(interfaceData.efoms_HOST, interfaceData.putInsertCheckRecordInfo, {
            list: JSON.stringify(arr)
        }, token, 'json')
        .then(res => {
            if (res.appCode == 0) {
                Common.ejMessage("success");
                Bus.$emit('insertCheckRecord', true);
                if (callback) {
                    callback();
                }
            } else {
                Common.ejMessage("warning");
                Common.printErrorLog(interfaceData.efoms_HOST, interfaceData.putInsertCheckRecordInfo);
            }
        })
        .catch(err => {
            Common.printErrorLog(interfaceData.efoms_HOST, interfaceData.putInsertCheckRecordInfo);
            console.log(err);
        });
};
var Request = {
    // devTypeCode:设备类型
    // callback:回调函数
    // 该方法为巡检结果重置
    reFreshCheckResultFuc(devTypeCode, callback) {
        api.get('./config.json').then((res) => {
            Config = res;
            interfaceData = {
                efoms_HOST: Config.efoms_HOST,
                getReFreshCheckResult: Config.reFreshCheckResult_GET,
                putInsertCheckRecordInfo: Config.insertCheckRecordInfo_PUT
            };
            reFreshCheckResultFucDetail(devTypeCode, callback, interfaceData);
        });
    },
    // type: 巡检类型，正常、异常
    // data: 该条记录的信息
    // remarks：正常的备注
    // callback：回调方法
    // 该方法为提交巡检结果
    insertCheckRecordInfoFuc(type, data, remarks, callback) {
        api.get('./config.json').then((res) => {
            Config = res;
            interfaceData = {
                efoms_HOST: Config.efoms_HOST,
                getReFreshCheckResult: Config.reFreshCheckResult_GET,
                putInsertCheckRecordInfo: Config.insertCheckRecordInfo_PUT
            };
            insertCheckRecordInfoFucDetail(type, data, remarks, callback, interfaceData);
        });
    },
    // file 文件参数
    // callback 回调函数
    uploadFile(file, callback) {
        api.get('./config.json').then((res) => {
            Config = res;
            let host = Config.efoms_HOST;
            let method = Config.uploadFile_POST;
            api.postMethod(host, method, file, token).then(res => {
                    if (res.appCode == 0) {
                        callback(res);
                    } else {
                        Common.printErrorLog(host, method);
                    }
                })
                .catch(err => {
                    Common.printErrorLog(host, method);
                    console.log(err);
                });
        });
    },
    // file 文件参数
    // callback 回调函数
    deleteFiles(file, callback) {
        let host = Config.efoms_HOST;
        let method = Config.deleteFile_GET;
        this.$api.deleteMethod(host, method, {
                token: this.token,
                secondDir: file.secondDir,
                fileName: file.fileName
            }).then(res => {
                if (res.appCode == 0) {
                    callback(res);
                } else {
                    Common.printErrorLog(host, method);
                }
            })
            .catch(err => {
                Common.printErrorLog(host, method);
                console.log(err);
            });
    }
};
export default Request;