// JScript 文件

/*****************************************************************************
*功能说明:CRealPlayer类
* 实时浏览播放控件
*****************************************************************************/
export function CRealPlayer(sUrl) {
    this.strUrl = sUrl; // "document.getElementById('AVRealPlay')";
    this.strIP = null; // IP "192.168.9.43"
    this.nPort = null; // 端口 8000
    this.nChannel = null; // 通道号 0
    this.strUserID = null; // 用户名 "admin"
    this.strUserPwd = null; // 密码 "12345"
    this.strVideoServerIP = null; // 流媒体服务器IP "192.168.9.126"
    this.nVideoServerPort = null; // 流媒体服务器端口 554

    this.nScreenNum = null; // 画面数
    this.nSelectIndex = null; // 当前选择项
    this.nConType = null; // nConType: 0-TCP 1-UDP 2-多播 3-RTP 4-音视频分开
    this.nStreamType = null; // nStreamType: 0-主码流 1-子码流
    this.bLoopFlag = null; // 是否循环播放
    this.nDVRType = null; // DVR类型
    this.sFilePath = null; // 当前录像抓图保存路径
    this.sVideoName = null; // 点位名称
    this.ajaxPATH = null;// ajax地址

    // 设置鼠标箭头显示
    this.EnableShowArrows = function (bl) {
        try { eval(this.strUrl).EnableShowArrows(bl); } catch (e) {}
    };
    this.SetShowCurStatus = function(nsc) {
         try { eval(this.strUrl).SetShowCurStatus(nsc); } catch (e) {}
    };

    // ScreenNum -- 画面数
    this.GetScreenNum = function () {
                        try { this.nScreenNum = eval(this.strUrl).GetScreenNum(); } catch (e) {}
                        return this.nScreenNum;
                    };
    this.SetScreenNum = function(nScreenNum) {
                        var iScreenNum = parseInt(nScreenNum); if (isNaN(iScreenNum)) iScreenNum = 0;
                        this.nScreenNum = iScreenNum;
                        try { eval(this.strUrl).SetScreenNum(this.nScreenNum); } catch (e) {}
                    };

    // 当前选择项
    this.GetSelPlayIndex = function () {
                        try { this.nSelectIndex = eval(this.strUrl).GetSelPlayIndex(); } catch (e) {}
                        return this.nSelectIndex;
                    };
    this.SetSelected = function(nSel) {
                        var iSel = parseInt(nSel); if (isNaN(iSel)) iSel = 0;
                        this.nSelectIndex = iSel;
                        try { eval(this.strUrl).SetSelected(this.nSelectIndex); } catch (e) {}
                    };
    // 设置屏幕比例
    this.SetSelVideoShowType = function (type) {
        var nTort = parseInt(type); if (isNaN(type)) nTort = 0;
        try {
            eval(this.strUrl).SetSelVideoShowType(nTort);
        } catch (e) {}
    };
    // 播放
    this.StartPlaySel = function() {
                        var ret = false;
                        try { ret = eval(this.strUrl).StartPlaySel(); } catch (e) {}
                        return ret;
                    };

    this.StopPlaySel = function () {
                        var ret = false;
                        try { ret = eval(this.strUrl).StopPlaySel(); } catch (e) {}
                        return ret;
                    };
    this.StopAllPlay = function() {
                        var ret = false;
                        try { ret = eval(this.strUrl).StopAllPlay(); } catch (e) {}
                        return ret;
                    };

    // 录像
    this.StartRecordSel = function (SavePath, url, videoname) {
                        var path = SavePath + "\\";
                        var ret = false;
                        try { ret = eval(this.strUrl).StartRecordSel(path + "视频\\" + videoname + "_" + url); } catch (e) {}
                        return ret;
                    };
    this.StopRecordSel = function () {
                        var ret = false;
                        try { ret = eval(this.strUrl).StopRecordSel(); } catch (e) {}
                        return ret;
                    };

    // 抓图
    this.CapPicSel = function (SavePath, videoname) {
                        var date = new Date();
                        var current = "图片\\" + videoname + "_" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
                        var url = current + ".bmp";
                        var path = SavePath + "\\";
                        var ret = false;
                        try { ret = eval(this.strUrl).CapPicSel(path + url); } catch (e) {}
                        if (!ret) url = "";
                        return url;
                    };
    this.SetFullScreen = function() {
                            try { eval(this.strUrl).SetSelScreenState(2); } catch (e) {}
                    };
    // 设置路径
    this.SetSYSPath = function () {
                            try {
 if (eval(this.strUrl).SetSYSPath()) {
                                 return eval(this.strUrl).GetSYSPath();
                             }
                             return "";
                         } catch (e) {}
                   };
    this.GetSYSPath = function() {
                       try { return eval(this.strUrl).GetSYSPath(); } catch (e) {}
                   };
    // 控制命令接口
    this.MediaStreamPTZCtrlSpeed = function(nOprCmd, nSpeed, nStop) {
        try { eval(this.strUrl).MediaStreamPTZCtrlSpeed(nOprCmd, nSpeed, nStop); } catch (e) {}
    };
    // 设置优先级
    this.MediaStreamPTZCtrlSetPriority = function(nPriority) {
        try { eval(this.strUrl).MediaStreamPTZCtrlSetPriority(nPriority); } catch (e) {}
    };
    // SETPOS : 23, OPRPOS : 24, DELPOS : 25
    this.MediaStreamPTZPrePointOpr = function MediaStreamPTZPrePointOpr(nOprCmd, nIndex, name) {
        try { eval(this.strUrl).MediaStreamPTZCtrlSpeed(nOprCmd, nIndex, name); } catch (e) {}
    };
    // 设置超时
    this.SetSelectWndStreamHeartBeatTimeOut = function (timeout) {
    	try { eval(this.strUrl).SetSelectWndStreamHeartBeatTimeOut(timeout); } catch (e) {}
    };
    // 设置超时
    this.SetSelectWndStreamHeartBeatTimeOutEx = function (selNum, timeout) {
    	try { eval(this.strUrl).SetSelectWndStreamHeartBeatTimeOutEx(selNum, timeout); } catch (e) {}
    };
    // 设置设备信息
    this.SetSelectWndDeviceInfo = function (nManufactType, nDeviceType, nProtocolType) {
    	var ManufactType = parseInt(nManufactType); if (isNaN(ManufactType)) ManufactType = 0;
    	var DeviceType = parseInt(nDeviceType); if (isNaN(DeviceType)) DeviceType = 0;
    	var ProtocolType = parseInt(nProtocolType); if (isNaN(ProtocolType)) ProtocolType = 0;
    	try { eval(this.strUrl).SetSelectWndDeviceInfo(ManufactType, DeviceType, ProtocolType); } catch (e) {}
    };
    this.SetSelectWndDeviceInfoEx = function (selNum, nManufactType, nDeviceType, nProtocolType) {
    	var ManufactType = parseInt(nManufactType); if (isNaN(ManufactType)) ManufactType = 0;
    	var DeviceType = parseInt(nDeviceType); if (isNaN(DeviceType)) DeviceType = 0;
    	var ProtocolType = parseInt(nProtocolType); if (isNaN(ProtocolType)) ProtocolType = 0;
    	try { eval(this.strUrl).SetSelectWndDeviceInfoEx(selNum, ManufactType, DeviceType, ProtocolType); } catch (e) {}
    };
    // 初始化数据接收
    this.InitSelectWndReceiver = function (lpcIP, lPort) {
        var port = parseInt(lPort); if (isNaN(port)) port = 0;
   	 if (lpcIP == 'undefined' || lpcIP == undefined || lpcIP == null) lpcIP = "";
    	try { return eval(this.strUrl).InitSelectWndReceiver(lpcIP, port); } catch (e) {}
    };
    // 初始化数据接收
    this.InitSelectWndReceiverEx = function (selNum, lpcIP, lPort) {
        var port = parseInt(lPort); if (isNaN(port)) port = 0;
   	 if (lpcIP == 'undefined' || lpcIP == undefined || lpcIP == null) lpcIP = "";
    	try { return eval(this.strUrl).InitSelectWndReceiverEx(selNum, lpcIP, port); } catch (e) {}
    };
    // 获取本地接收IP地址端口
    this.GetSelectWndClientIP = function () {
    	try { return eval(this.strUrl).GetSelectWndClientIP(); } catch (e) {}
    };
    // 获取本地接收IP地址端口
    this.GetSelectWndClientIPEx = function (selNum) {
    	try { return eval(this.strUrl).GetSelectWndClientIPEx(selNum); } catch (e) {}
    };
    this.GetSelectWndClientPort = function () {
    	try { return eval(this.strUrl).GetSelectWndClientPort(); } catch (e) {}
    };
    this.GetSelectWndClientPortEx = function (selNum) {
    	try { return eval(this.strUrl).GetSelectWndClientPortEx(selNum); } catch (e) {}
    };
    // 设置发送者IP地址端口BOOL bStreamOpen, LPCTSTR lpcIP, long lPort
    this.SetSelectWndStreamState = function (iNum, bStreamOpen, lpcIP, lPort) {
    	 // var StreamOpen =  parseInt(bStreamOpen);if(isNaN(StreamOpen)) StreamOpen=0;
    	 var port = parseInt(lPort); if (isNaN(port)) port = 0;
    	 var num = parseInt(iNum); if (isNaN(iNum)) num = 0;
    	 if (lpcIP == 'undefined' || lpcIP == undefined || lpcIP == null) lpcIP = "";
    	try { return eval(this.strUrl).SetSelectWndStreamState(num, parseInt(bStreamOpen), lpcIP, port); } catch (e) {}
    };
    // 设置发送者IP地址端口BOOL bStreamOpen, LPCTSTR lpcIP, long lPort
    this.SetSelectWndStreamStateEx = function (iNum, bStreamOpen, error, lpcIP, lPort) {
    	 // var StreamOpen =  parseInt(bStreamOpen);if(isNaN(StreamOpen)) StreamOpen=0;
    	 var port = parseInt(lPort); if (isNaN(port)) port = 0;
    	 var num = parseInt(iNum); if (isNaN(iNum)) num = 0;
    	 if (error == 'undefined' || error == undefined || error == null || error == "") error = 0;
    	 if (lpcIP == 'undefined' || lpcIP == undefined || lpcIP == null) lpcIP = "";
    	try { return eval(this.strUrl).SetSelectWndStreamStateEx(num, parseInt(bStreamOpen), error, lpcIP, port); } catch (e) {}
    };

    this.UnInitSelectWndReceiver = function UnInitSelectWndReceiver() {
    	try { return eval(this.strUrl).UnInitSelectWndReceiver(); } catch (e) {}
    };
    this.UnInitSelectWndReceiverEx = function UnInitSelectWndReceiver(selNum) {
    	try { return eval(this.strUrl).UnInitSelectWndReceiverEx(selNum); } catch (e) {}
    };
    this.DebugViewPrint = function DebugViewPrint(info) {
    	try { return eval(this.strUrl).DebugViewPrint(info); } catch (e) {}
    };
    this.SetErrorCode = function SetErrorCode(num) {
    	try { return eval(this.strUrl).SetErrorCode(num); } catch (e) {}
    };
    this.CapPicSelAndUpload = function CapPicSelAndUpload(lpcPicPath, lpcServerIP, lpcUserName, lpcPassword, lpcUploadPath, lPort) {
    	try { return eval(this.strUrl).CapPicSelAndUpload(lpcPicPath, lpcServerIP, lpcUserName, lpcPassword, lpcUploadPath, lPort); } catch (e) {}
    };
    /**
     * 启动3D定位绘制（允许在视频内绘制定位框）
     * status:true,启动； false：取消
     */
    this.set3DCtrl = function(status) {
    	try {
    		eval(this.strUrl).EnableShowArrows(!status);
    		return eval(this.strUrl).Enable3DPosition(status)
; 
} catch (e) {}
    };
};
