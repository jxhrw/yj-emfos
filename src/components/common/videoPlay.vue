<template>
    <div id="videoPlayBox" ref="videoPlay" class="tagObject" style="height:100%;">
        <!-- <object id="AVRealPlay" wmode="transparent" style="width: 100%; height:100%;" :classid="classid">
            <param name="_Version" value="65536">
            <param name="_ExtentX" value="22357">
            <param name="_ExtentY" value="16589">
            <param name="_StockProps" value="0">
            <h4 style="text-align:center;padding-top:10px;">视频控件加载失败，确认是否已安装控件！</h4>
        </object> -->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                classid: '',
                nVideoServerPort: null, // 流媒体服务器端口 554
                nScreenNum: null, // 画面数
                nSelectIndex: null, // 当前选择项
                sFilePath: null, // 当前录像抓图保存路径
                sVideoName: null, // 点位名称
                sVideoUrl: null, // web请求路径
                sVideoUser: null, // web请求用户名
                sVideoPwd: null, // web请求密码
                listVideoInfo: [], // 点位信息列表
                listPresetInfo: {} // 点位信息列表
            };
        },
        mounted() {
            /* eslint-disable */
            // this.init("allViedo", 'http://192.168.91.136:9998/services/ejvideo', 'admin', 'admin', '192.168.91.136', '8081');
        },
        methods: {
            init(sid, videoUrl, videoUser, videoPwd, streamIp, streamPort) {
                // var that = this;
                this.sid = sid;
                this.sVideoUrl = videoUrl; // web请求路径
                this.sVideoUser = videoUser; // web请求用户名
                this.sVideoPwd = videoPwd; // web请求密码
                this.listVideoInfo = []; // 点位信息列表
                this.sStreamIp = streamIp; // web请求密码
                this.sStreamPort = streamPort; // web请求密码
                // divId = divId.indexOf('#') >= 0 ? divId : ('#' + divId);
                this.loadPlayOxc();
            },
            // 设置鼠标箭头显示
            EnableShowArrows(bl) {
                try {
                    this.sControl.EnableShowArrows(bl);
                } catch (e) {}
            },
            SetShowCurStatus(nsc) {
                try {
                    this.sControl.SetShowCurStatus(nsc);
                } catch (e) {}
            },
            // ScreenNum -- 画面数
            GetScreenNum() {
                try {
                    this.nScreenNum = this.sControl.GetScreenNum();
                } catch (e) {}
                return this.nScreenNum;
            },
            SetScreenNum(nScreenNum) {
                var iScreenNum = parseInt(nScreenNum);
                if (isNaN(iScreenNum)) iScreenNum = 0;
                this.nScreenNum = iScreenNum;
                try {
                    this.sControl.SetScreenNum(this.nScreenNum);
                } catch (e) {}
            },
            // 当前选择项
            GetSelPlayIndex() {
                try {
                    this.nSelectIndex = this.sControl.GetSelPlayIndex();
                } catch (e) {}
                return this.nSelectIndex;
            },
            SetSelected(nSel) {
                var iSel = parseInt(nSel);
                if (isNaN(iSel)) iSel = 0;
                this.nSelectIndex = iSel;
                try {
                    this.sControl.SetSelected(this.nSelectIndex);
                } catch (e) {}
            },
            // 设置屏幕比例
            SetSelVideoShowType(type) {
                var nTort = parseInt(type);
                if (isNaN(type)) nTort = 0;
                try {
                    this.sControl.SetSelVideoShowType(nTort);
                } catch (e) {}
            },
            // 录像
            StartRecordSel(SavePath, videoname) {
                var path = SavePath + '\\';
                if (videoname === 'undefined' || videoname === undefined || videoname === null) {
                    videoname = this.listVideoInfo[this.GetSelPlayIndex()].name;
                }
                var ret = false;
                try {
                    var date = new Date();
                    ret = this.sControl.StartRecordSel(path + '视频\\' + videoname + '_' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds() + '.mp4');
                } catch (e) {}
                return ret;
            },
            // 停止录像
            StopRecordSel() {
                var ret = false;
                try {
                    ret = this.sControl.StopRecordSel();
                } catch (e) {}
                return ret;
            },
            // 抓图
            CapPicSel(SavePath, videoname) {
                var date = new Date();
                var current = '图片\\' + videoname + '_' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
                var url = current + '.bmp';
                var path = SavePath + '\\';
                var ret = false;
                try {
                    ret = this.sControl.CapPicSel(path + url);
                } catch (e) {}
                if (!ret) url = '未生成';
                return url;
            },
            SetFullScreen() {
                try {
                    this.sControl.SetSelScreenState(2);
                } catch (e) {}
            },
            catalogClick() {
                if (confirm('文件路径当前是：' + this.sControl.GetSYSPath() + '，是否重新设置？')) {
                    this.SetSYSPath();
                } else {
                    this.GetSYSPath();
                }
            },
            // 设置路径
            SetSYSPath() {
                // try {
                if (this.sControl.SetSYSPath()) {
                    return this.sControl.GetSYSPath();
                }
                return '';
                // } catch (e) {}
            },
            GetSYSPath() {
                // try {
                return this.sControl.GetSYSPath();
                // } catch (e) {}
            },
            // 设置设备信息
            SetSelectWndDeviceInfo(nManufactType, nDeviceType, nProtocolType) {
                var ManufactType = parseInt(nManufactType);
                if (isNaN(ManufactType)) ManufactType = 0;
                var DeviceType = parseInt(nDeviceType);
                if (isNaN(DeviceType)) DeviceType = 0;
                var ProtocolType = parseInt(nProtocolType);
                if (isNaN(ProtocolType)) ProtocolType = 0;
                try {
                    this.sControl.SetSelectWndDeviceInfo(ManufactType, DeviceType, ProtocolType);
                } catch (e) {}
            },
            SetSelectWndDeviceInfoEx(selNum, nManufactType, nDeviceType, nProtocolType) {
                var ManufactType = parseInt(nManufactType);
                if (isNaN(ManufactType)) ManufactType = 0;
                var DeviceType = parseInt(nDeviceType);
                if (isNaN(DeviceType)) DeviceType = 0;
                var ProtocolType = parseInt(nProtocolType);
                if (isNaN(ProtocolType)) ProtocolType = 0;
                try {
                    this.sControl.SetSelectWndDeviceInfoEx(selNum, ManufactType, DeviceType, ProtocolType);
                } catch (e) {}
            },
            // 初始化数据接收
            InitSelectWndReceiver(lpcIP, lPort) {
                var port = parseInt(lPort);
                if (isNaN(port)) port = 0;
                if (lpcIP === 'undefined' || lpcIP === undefined || lpcIP === null) lpcIP = '';
                try {
                    return this.sControl.InitSelectWndReceiver(lpcIP, port);
                } catch (e) {}
            },
            // 初始化数据接收
            InitSelectWndReceiverEx(selNum, lpcIP, lPort) {
                var port = parseInt(lPort);
                if (isNaN(port)) port = 0;
                if (lpcIP === 'undefined' || lpcIP === undefined || lpcIP === null) lpcIP = '';
                try {
                    return this.sControl.InitSelectWndReceiverEx(selNum, lpcIP, port);
                } catch (e) {}
            },
            // 获取本地接收IP地址端口
            GetSelectWndClientIP() {
                try {
                    return this.sControl.GetSelectWndClientIP();
                } catch (e) {}
            },
            // 获取本地接收IP地址端口
            GetSelectWndClientIPEx(selNum) {
                try {
                    return this.sControl.GetSelectWndClientIPEx(selNum);
                } catch (e) {}
            },
            GetSelectWndClientPort() {
                try {
                    return this.sControl.GetSelectWndClientPort();
                } catch (e) {}
            },
            GetSelectWndClientPortEx(selNum) {
                try {
                    return this.sControl.GetSelectWndClientPortEx(selNum);
                } catch (e) {}
            },
            // 设置发送者IP地址端口BOOL bStreamOpen, LPCTSTR lpcIP, long lPort
            SetSelectWndStreamState(iNum, bStreamOpen, lpcIP, lPort) {
                // var StreamOpen =  parseInt(bStreamOpen);if(isNaN(StreamOpen)) StreamOpen=0;
                var port = parseInt(lPort);
                if (isNaN(port)) port = 0;
                var num = parseInt(iNum);
                if (isNaN(iNum)) num = 0;
                if (lpcIP === 'undefined' || lpcIP === undefined || lpcIP === null) lpcIP = '';
                try {
                    return this.sControl.SetSelectWndStreamState(num, parseInt(bStreamOpen), lpcIP, port);
                } catch (e) {}
            },
            // 设置发送者IP地址端口BOOL bStreamOpen, LPCTSTR lpcIP, long lPort
            SetSelectWndStreamStateEx(iNum, bStreamOpen, error, lpcIP, lPort) {
                var port = parseInt(lPort);
                if (isNaN(port)) port = 0;
                var num = parseInt(iNum);
                if (isNaN(iNum)) num = 0;
                if (error === 'undefined' || error === undefined || error === null || error === '') error = 0;
                if (lpcIP === 'undefined' || lpcIP === undefined || lpcIP === null) lpcIP = '';
                try {
                    return this.sControl.SetSelectWndStreamStateEx(num, parseInt(bStreamOpen), error, lpcIP, port);
                } catch (e) {}
            },

            // 设置超时
            SetSelectWndStreamHeartBeatTimeOutEx(selNum, timeout) {
                try {
                    this.sControl.SetSelectWndStreamHeartBeatTimeOutEx(selNum, timeout);
                } catch (e) {}
            },
            UnInitSelectWndReceiver() {
                try {
                    return this.sControl.UnInitSelectWndReceiver();
                } catch (e) {}
            },
            UnInitSelectWndReceiverEx(selNum) {
                try {
                    return this.sControl.UnInitSelectWndReceiverEx(selNum);
                } catch (e) {}
            },
            DebugViewPrint(info) {
                try {
                    return this.sControl.DebugViewPrint(info);
                } catch (e) {}
            },
            // 设置错误信息
            SetErrorCode(num) {
                try {
                    return this.sControl.SetErrorCode(num);
                } catch (e) {}
            },
            CapPicSelAndUpload(lpcPicPath, lpcServerIP, lpcUserName, lpcPassword, lpcUploadPath, lPort) {
                try {
                    return this.sControl.CapPicSelAndUpload(lpcPicPath, lpcServerIP, lpcUserName, lpcPassword, lpcUploadPath, lPort);
                } catch (e) {}
            },
            /* *
             * 播放视频
             * videoid：视频编号
             * selnum： 播放窗口
             * name： 视频名称
             * callback： 回调函数
             */
            StartPlayById(videoid, selnum, name, callback) {
                console.log(videoid);
                var that = this;
                if (selnum === undefined || selnum === null || selnum < 0) {
                    selnum = this.GetSelPlayIndex();
                }
                if (this.listVideoInfo.length > selnum && this.listVideoInfo[selnum] !== null) {
                    this.StopPlay(selnum);
                }
                this.SetSelected(selnum);
                // var header = {
                //     async: false,
                //     dataType: 'jsonp',
                //     contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                //     jsonpCallback: 'callback_getvideoinfofromredisbyid',
                //     token: this.token
                // };
                // this.$api.get(this.sVideoUrl + '/getvideoinfofromredisbyid/' + videoid + '/' + this.sVideoUser + '/' + this.sVideoPwd, {}, header, (res) => {
                //     console.log(res);
                // });
                console.log(that.sVideoUrl + '/getvideoinfofromredisbyid/' + videoid + '/' + that.sVideoUser + '/' + that.sVideoPwd);
                sessionStorage.setItem("ocxIsLoading",true);
                $.ajax({
                    async: false,
                    url: that.sVideoUrl + '/getvideoinfofromredisbyid/' + videoid + '/' + that.sVideoUser + '/' + that.sVideoPwd,
                    type: 'GET',
                    dataType: 'jsonp',
                    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                    jsonpCallback: 'callback_getvideoinfofromredisbyid',
                    success: function (info) {
                        console.log("v1",info);
                        if (info.dev_id) {
                            info.videoId = videoid;
                            info.name = name;
                            that.listVideoInfo[selnum] = info;
                            if (info.trans_protocol === 0) {
                                that.SetSelectWndDeviceInfoEx(selnum, info.dev_manufact, info.dev_type, 1);
                            } else {
                                that.SetSelectWndDeviceInfoEx(selnum, info.dev_manufact, info.dev_type, info.protocol_type);
                            }
                            // 设置超时
                            that.SetSelectWndStreamHeartBeatTimeOutEx(selnum, parseInt(info.timeout));
                            // that.SetSelectWndStreamHeartBeatTimeOutEx(selnum, 20);
                            // 设置流媒体信息
                            that.InitSelectWndReceiverEx(selnum, that.sStreamIp, parseInt(that.sStreamPort));
                            // that.InitSelectWndReceiverEx(selnum, that.sStreamIp, 8081);
                            // 获取客户端ip
                            var ip = that.GetSelectWndClientIPEx(selnum);
                            // 获取客户端端口
                            var port = that.GetSelectWndClientPortEx(selnum);
                            var transporttype = info.trans_protocol;
                            console.log(that.sVideoUrl + '/realtPlaybyid/' + videoid + '/' + ip + '/' + port + '/' + transporttype + '/' + that.sVideoUser + '/' + that.sVideoPwd);
                            $.ajax({
                                async: false,
                                url: that.sVideoUrl + '/realtPlaybyid/' + videoid + '/' + ip + '/' + port + '/' + transporttype + '/' + that.sVideoUser + '/' + that.sVideoPwd,
                                type: 'GET',
                                dataType: 'jsonp',
                                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                                jsonpCallback: 'callback_realtPlaybyid',
                                success: function (result) {
                                    console.log("v2");
                                    var sendIP = '';
                                    var sendPort = 0;
                                    try {
                                        that.listVideoInfo[selnum].taskId = result.taskid;
                                        sendIP = result.realtplay.send_ip;
                                        sendPort = result.realtplay.send_port;
                                        if (result.status === '3') {
                                            that.listVideoInfo[selnum].isplay = true;
                                        } else {
                                            that.listVideoInfo[selnum].isplay = false;
                                        }
                                    } catch (e) {}
                                    that.SetSelectWndStreamStateEx(selnum, result.status, result.error, sendIP, sendPort);
                                    that.EnableShowArrows(true);
                                    if (callback) {
                                        /* eslint-disable no-callback-literal */
                                        // eslint-disable-next-line
                                        callback({
                                            'appCode': '1',
                                            'dataBuffer': '成功',
                                            'resultList': result,
                                            'sounrce': 'realtPlaybyid'
                                        });
                                    }
                                },
                                error: function (xhr, status, errMsg) {
                                    if (callback) {
                                        // eslint-disable-next-line
                                        callback({
                                            'appCode': '10',
                                            'dataBuffer': '操作失败',
                                            'resultList': errMsg,
                                            'sounrce': 'realtPlaybyid'
                                        });
                                    }
                                    // debugger;
                                },
                                complete: function(){
                                    sessionStorage.setItem("ocxIsLoading",false);
                                }
                            });
                        }
                    },
                    complete: function () {

                    },
                    error: function (xhr, status, errMsg) {
                        sessionStorage.setItem("ocxIsLoading",false);
                        if (callback) {
                            // eslint-disable-next-line
                            callback({
                                'appCode': '10',
                                'dataBuffer': '操作失败',
                                'resultList': errMsg,
                                'source': 'getvideoinfofromredisbyid'
                            });
                        }
                        // debugger;
                    }
                });
            },
            /* *
             * 停止播放
             * num 播放窗口，从0开始
             * callback 回调函数，回调参数，demo：{"appCode":"1", "dataBuffer": "成功", "resultList": result}；
             * appCode和dataBuffer详见EnumAppCode
             */
            StopPlay(num, callback) {
                var that = this;
                if (!num) num = this.GetSelPlayIndex();
                if (that.listVideoInfo.length <= num || that.listVideoInfo[num] === null || that.listVideoInfo[num] === '' ||
                    that.listVideoInfo[num].taskId === null || that.listVideoInfo[num].taskId === '') {
                    console.log('未保存相关任务列表');
                    if (callback) {
                        // eslint-disable-next-line
                        callback({
                            'appCode': '3',
                            'dataBuffer': '参数为空'
                        });
                    }
                    return;
                }
                var taskid = that.listVideoInfo[num].taskId;
                this.SetSelected(num);
                this.UnInitSelectWndReceiverEx(num);
                $.ajax({
                    async: false,
                    url: that.sVideoUrl + '/stoprealtplaybyid/' + taskid + '/' + that.sVideoUser + '/' + that.sVideoPwd,
                    type: 'GET',
                    dataType: 'jsonp',
                    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                    jsonpCallback: 'callback_stoprealtplaybyid',
                    success: function (result) {
                        var sendIP = '';
                        var sendPort = '';
                        try {
                            that.listVideoInfo[num] = null;
                            sendIP = result.send_ip;
                            sendPort = result.send_port;
                        } catch (e) {}
                        that.SetSelectWndStreamStateEx(num, result.status, result.error, sendIP, sendPort);
                        that.EnableShowArrows(true);
                        if (callback) {
                            // eslint-disable-next-line
                            callback({
                                'appCode': '1',
                                'dataBuffer': '成功',
                                'resultList': result
                            });
                        }
                    },
                    error: function (xhr, status, errMsg) {
                        if (callback) {
                            // eslint-disable-next-line
                            callback({
                                'appCode': '10',
                                'dataBuffer': '操作失败',
                                'resultList': errMsg,
                                'source': 'stoprealtplaybyid'
                            });
                        }
                        // debugger;
                    }
                });
            },
            /* *
             * 停止全部出口播放
             */
            StopAllPlay() {
                var that = this;
                for (var num in that.listVideoInfo) {
                    if (that.listVideoInfo[num] && that.listVideoInfo[num] != null) {
                        that.StopPlay(num);
                    }
                }
            },
            /* *
             * 云台控制
             */
            PtzCtrl(nOprCmd, nStop, callback) {
                var that = this;
                var num = this.GetSelPlayIndex();
                if (that.listVideoInfo.length <= num || that.listVideoInfo[num] === null || that.listVideoInfo[num] === '' ||
                    that.listVideoInfo[num].taskId === null || that.listVideoInfo[num].taskId === '') {
                    console.log('未保存相关任务列表');
                    if (callback) {
                        // eslint-disable-next-line
                        callback({
                            'appCode': '3',
                            'dataBuffer': '参数为空'
                        });
                    }
                }
                var videoinfo = that.listVideoInfo[num];
                var speed = videoinfo.speed | 170;
                $.ajax({
                    async: false,
                    url: that.sVideoUrl + '/ptzPlay/' + videoinfo.videoId + '/' + nOprCmd + '/' + nStop + '/' +
                        speed + '/' + speed + '/' + speed + '/' + speed + '/' + speed + '/' + that.sVideoUser + '/' +
                        that.sVideoPwd,
                    type: 'GET',
                    dataType: 'jsonp',
                    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                    jsonpCallback: 'callback_ptzPlay',
                    success: function (result) {
                        if (callback) {
                            callback(result);
                        }
                    }
                });
            },
            /* *
             * 启动3D定位绘制（允许在视频内绘制定位框）
             * status:true,启动； false：取消
             */
            set3DCtrl(status) {
                try {
                    return this.sControl.Enable3DPosition(status);
                } catch (e) {}
            },
            /* *
             * 3D控制
             * @param cmdType
             * @param dragLength
             * @param dragWidth
             * @param dragMidpointX
             * @param dragMidpointY
             * @param dragLengthX
             * @param dragLengthY
             */
            execute3DCtrl(num, cmdType, dragLength, dragWidth, dragMidpointX, dragMidpointY, dragLengthX, dragLengthY) {
                if (num === undefined || num === null) num = this.GetSelPlayIndex();
                var videoinfo = this.listVideoInfo[num];
                if (videoinfo !== null) {
                    $.ajax({
                        async: false,
                        url: this.sVideoUrl + '/ptzPlay3D/' + videoinfo.videoId + '/' + cmdType + '/' + dragLength + '/' +
                            dragWidth + '/' + dragMidpointX + '/' +
                            dragMidpointY + '/' + dragLengthX + '/' +
                            dragLengthY + '/' + this.sVideoUser + '/' + this.sVideoPwd,
                        type: 'GET',
                        dataType: 'jsonp',
                        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                        jsonpCallback: 'callback_ptzPlay3D',
                        success: function (result) {
                            console.log(result);
                        },
                        error: function (xhr, status, errMsg) {
                            console.log(errMsg);
                            // debugger;
                        }
                    });
                }
            },
            /* *
             * 获取编号
             */
            getVideoId(videoId, num) {
                var that = this;
                if (typeof videoId === 'undefined' || videoId === null) {
                    var videoinfo;
                    if (typeof num === 'undefined' || num === null) {
                        videoinfo = that.listVideoInfo[this.GetSelPlayIndex()];
                    } else {
                        videoinfo = that.listVideoInfo[num];
                    }
                    if (typeof videoinfo === 'undefined' || videoinfo === null) {
                        console.log('视频信息不足，无法获取点位编号');
                        videoId = null;
                    }
                    videoId = videoinfo.videoId;
                }
                return videoId;
            },
            /* **************预置位START****************************************************************************************************** */
            /* *
             * 获取预置位列表
             * videoId 视频编号
             * num窗口号
             */
            getPresetList(videoId, num) {
                var that = this;
                videoId = this.getVideoId(videoId, num);
                if (videoId == null) return null;
                $.ajax({
                    async: false,
                    url: this.sVideoUrl + '/getpresetlist/' + videoId + '/' + this.sVideoUser + '/' + this.sVideoPwd,
                    type: 'GET',
                    dataType: 'jsonp',
                    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                    jsonpCallback: 'callback_getpresetlist',
                    success: function (result) {
                        // console.log(result);
                        that.listPresetInfo[videoId] = result;
                        return result;
                    },
                    error: function (xhr, status, errMsg) {
                        console.log(errMsg);
                        return null;
                    }
                });
            },
            /* *
             * 设置预置位
             */
            setPreset(videoId, screenNum, presetNum, presetName) {
                videoId = this.getVideoId(videoId, screenNum);
                if (videoId === null) return null;
                $.ajax({
                    async: false,
                    url: this.sVideoUrl + '/editpreset/' + videoId + '/' + presetNum + '/' + presetName + '/' + this.sVideoUser + '/' + this.sVideoPwd,
                    type: 'GET',
                    dataType: 'jsonp',
                    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                    jsonpCallback: 'callback_editpreset',
                    success: function (result) {
                        if (result > 0) {
                            /* eslint-disable no-unmodified-loop-condition */
                            var list = this.listPresetInfo[videoId];
                            var has = false;
                            for (var num = 0; typeof list === 'object' && list.length > 0; num++) {
                                if (list[num].preset_id === presetNum) {
                                    has = true;
                                    list[num].preset_id = presetNum;
                                    list[num].preset_name = presetName;
                                }
                            }
                            if (!has) {
                                list.push({
                                    'preset_id': presetNum,
                                    'preset_name': presetName
                                });
                            }
                            this.listPresetInfo[videoId] = list;
                            return {
                                'appCode': '1',
                                'dataBuffer': '成功',
                                'resultList': result,
                                'newList': this.listPresetInfo[videoId]
                            };
                        } else {
                            return {
                                'appCode': '10',
                                'dataBuffer': '操作失败',
                                'resultList': result,
                                'source': 'editpreset'
                            };
                        }
                        // return result;
                    },
                    error: function (xhr, status, errMsg) {
                        return {
                            'appCode': '10',
                            'dataBuffer': '操作失败',
                            'resultList': errMsg,
                            'source': 'editpreset'
                        };
                        // debugger;
                    }

                });
            },
            /* *
             * 删除预置位
             */
            delPreset(videoId, screenNum, presetNum) {
                videoId = this.getVideoId(videoId, screenNum);
                if (videoId === null) return null;
                $.ajax({
                    async: false,
                    url: this.sVideoUrl + '/deletepreset/' + videoId + '/' + screenNum + '/' + this.sVideoUser + '/' + this.sVideoPwd,
                    type: 'GET',
                    dataType: 'jsonp',
                    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                    jsonpCallback: 'callback_deletepreset',
                    success: function (result) {
                        if (result > 0) {
                            var list = this.listPresetInfo[videoId];
                            for (var num = 0; typeof list === 'object' && list.length > 0; num++) {
                                if (list[num].preset_id === presetNum) {
                                    list.splice(num, 1);
                                    this.listPresetInfo[videoId] = list;
                                }
                            }
                            return {
                                'appCode': '1',
                                'dataBuffer': '成功',
                                'resultList': result,
                                'newList': this.listPresetInfo[videoId]
                            };
                        } else {
                            return {
                                'appCode': '10',
                                'dataBuffer': '操作失败',
                                'resultList': result,
                                'source': 'deletepreset'
                            };
                        }
                        // return result;
                    },
                    error: function (xhr, status, errMsg) {
                        return {
                            'appCode': '10',
                            'dataBuffer': '操作失败',
                            'resultList': errMsg,
                            'source': 'deletepreset'
                        };
                        // debugger;
                    }
                });
            },
            /* *
             * 执行预置位
             */
            presetPlay(videoId, screenNum, presetNum) {
                // @Path('presetPlay/{videoid}/{preset_id}/{username}/{pwd}')
                videoId = this.getVideoId(videoId, screenNum);
                if (videoId == null) return null;
                $.ajax({
                    async: false,
                    url: this.sVideoUrl + '/presetPlay/' + videoId + '/' + presetNum + '/' + this.sVideoUser + '/' + this.sVideoPwd,
                    type: 'GET',
                    dataType: 'jsonp',
                    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                    jsonpCallback: 'callback_presetPlay',
                    success: function (result) {
                        if (result.status > 4) {
                            return {
                                'appCode': '1',
                                'dataBuffer': '成功',
                                'resultList': result
                            };
                        } else {
                            return {
                                'appCode': '10',
                                'dataBuffer': '操作失败',
                                'resultList': result,
                                'source': 'presetPlay'
                            };
                        }
                        // return result;
                    },
                    error: function (xhr, status, errMsg) {
                        return {
                            'appCode': '10',
                            'dataBuffer': '操作失败',
                            'resultList': errMsg,
                            'source': 'presetPlay'
                        };
                        // debugger;
                    }
                });
            },
            /* **************预置位END****************************************************************************************************** */
            /* **************初始化加载Start****************************************************************************************************** */
            /* *
             * 加载控件
             * div 容器 默认 #divVideo
             * id 控件编号 默认AVRealPlay
             * height 高度 默认100%
             * width 宽度 默认100%
             * functionList 回调函数列表, 可传空集{}，不能为undefined或null
             */
            loadPlayOxc(height, width) {
                let that = this;
                let id = this.sid || 'AVRealPlay';
                let div = this.$refs.videoPlay;
                // console.log(div);
                if (!height) {
                    height = '100%';
                }
                if (!width) {
                    width = '100%';
                }
                console.log()
                let oxc = '<object id="' + this.sid + '" style="width:' + width + ';height:' + height + '" ';
                // ie
                if (!!window.ActiveXObject || 'ActiveXObject' in window) {
                    oxc += ' classid="clsid:7219606E-5147-4BCF-BC89-4F77B3144A54" ';
                } else {
                    oxc += ' clsid="{7219606E-5147-4BCF-BC89-4F77B3144A54}" event_OnStopRealPlay="OnStopRealPlay"' +
                        ' event_OnAllStopRealPlay="OnAllStopRealPlay" event_OnKeyUp="OnKeyUp" ' +
                        ' event_OnKeyDown="OnKeyDown" event_OnVideoSelChanged="OnVideoSelChanged"' +
                        ' event_OnDropOver="OnDropOver" event_OnVideoPTZCtrolDone="OnVideoPTZCtrolDone"' +
                        ' event_OnVideoPtzMouseUp="OnVideoPtzMouseUp" event_OnVideoPtzMouseLeave="OnVideoPtzMouseLeave" ' +
                        ' event_OnVideoWndEvent="OnVideoWndEvent" event_OnStopLoopPlay="OnStopLoopPlay" ' +
                        ' event_OnVideoPTZ3DControlDone="OnVideoPTZ3DControlDone"';
                    // that.createCallback();
                }
                // if (!!window.ActiveXObject || 'ActiveXObject' in window){
                //     that.createCallback();
                // }
                div.innerHTML = oxc + ' TYPE="application/x-itst-activex">' +
                    '<param value="transparent" name="wmode" />' +
                    '<param name="_Version" value="65536" />' +
                    '<param name="_ExtentX" value="22357" />' +
                    '<param name="_ExtentY" value="16589" />' +
                    '<param name="_StockProps" value="0" />' +
                    '<param name="wmode" value="opaque">' +
                    '<h4 style="text-align:center;padding-top:10px;font-size:12px;padding:50px 10px;">视频控件加载失败，确认是否已安装控件！</h4>' +
                    '</object>';
                // console.log(document.getElementById(id), this.$refs.videoPlay.childNodes[0], 'initDiv');
                this.sControl = this.$refs.videoPlay.childNodes[0];

                
            },
            createCallback() {
                this.createFunction(this.sid, 'OnVideoPTZCtrolDone(nPlayIndex, nCtrolType)', 'CRealPlayer.PtzCtrl(nCtrolType, 1)');

                this.createFunction(this.sid, 'OnVideoPtzMouseUp(nPlayIndex, nCtrolType)', 'CRealPlayer.PtzCtrl(nCtrolType, 0)');
                this.createFunction(this.sid, 'OnVideoPtzMouseLeave(nPlayIndex, nCtrolType)', 'CRealPlayer.PtzCtrl(nCtrolType, 0)');
                this.createFunction(this.sid, 'OnStopRealPlay()', 'CRealPlayer.stopPlay()');
                this.createFunction(this.sid, 'OnAllStopRealPlay()', 'CRealPlayer.stopAllPlay()');
                this.createFunction(this.sid, 'OnVideoPTZ3DControlDone(lPlayIndex, lPTZCtrolType, lVideoLength, lVideoWidth, lDragMidpointX, lDragMidpointY, lDragLength, lDragWidth)',
                    'CRealPlayer.execute3DCtrl(lPlayIndex, lPTZCtrolType, lDragLength, lDragWidth, lDragMidpointX, lDragMidpointY, lVideoLength, lVideoWidth)');
                // this.createFunction(this.sid, 'OnVideoSelChanged()',
                // 'CRealPlayer.OnVideoSelChanged()');
                this.createFunction(this.sid, 'OnVideoSelChanged()',
                'alert(1)');
            },
            /* **************初始化加载End****************************************************************************************************** */
            createFunction(infoFor, infoEvent, content) {
                // content = 'debugger';
                var myScript = document.createElement('script');
                myScript.language = 'javascript';
                myScript.for = infoFor;
                myScript.event = infoEvent;
                myScript.appendChild(document.createTextNode(content));
                document.body.appendChild(myScript);
            }
        }
    };

</script>

<style scoped>
    *{margin: 0;padding: 0;border: 0;}
</style>
