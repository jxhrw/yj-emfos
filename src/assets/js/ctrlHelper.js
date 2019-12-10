
var PTZCTRLOPR = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	DOWN: 3,
	FARR: 5,
	NEARR: 4,
	WIDE: 10,
	TINY: 11,
	BRIGHTER: 13,
	DARK: 12,
	AUXOPEN: 21,
	AUXCLOSE: 22,
	SETPOS: 21,
	OPRPOS: 22,
	DELPOS: 23,
	UPLEFT: 6,
	UPRIGHT: 8,
	DOWNLEFT: 7,
	DOWNRIGHT: 9
};
var realtplayList = [];
var Player = null;
var video_url = "";
var video_user = "";
var video_pwd = "";

// 云台控制
var ptzPriority;// = "${ptzPriority}";
// @Path("ptzPlay/{videoid}/{cmd_type}/{cmd_status}/{h_speed}/{v_speed}/{z_speed}/{f_speed}/{i_speed}/{username}/{pwd}")
function PtzCtrl(nOprCmd, nStop) {
	var videoinfo = realtplayList[Player.GetSelPlayIndex()];
	if (realtplayList.length > 0) {
		$.ajax({
			async: false,
			url: video_url + "/ptzPlay/" + videoinfo.videoId + "/" + nOprCmd + "/" + nStop + "/" +
			videoinfo.last_ptz_h_speed + "/" + videoinfo.last_ptz_v_speed + "/" +
			videoinfo.last_ptz_z_speed + "/" + videoinfo.last_ptz_f_speed + "/" +
			videoinfo.last_ptz_i_speed + "/" + video_user + "/" + video_pwd,
			type: "GET",
			dataType: 'jsonp',
	        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			jsonpCallback: 'callback_ptzPlay',
			success: function (result) {
				/* var sendIP = "";
				var sendPort = "";
				try
				{
					taskidList[selnum] = result.taskid;
					sendIP = result.send_ip;
					sendPort = result.send_port;
				}catch(e){}
				Player.SetSelectWndStreamStateEx(selnum, result.status, result.error, sendIP, sendPort);
				Player.EnableShowArrows(true); */
			}
		});
	}
}

/**
 * 云台控制，左上
 */
function aLeftUp_ms_down() {
	PtzCtrl(PTZCTRLOPR.UPLEFT, 1);
}

/**
 * 云台控制，上
 */
function aUp_ms_down() {
	PtzCtrl(PTZCTRLOPR.UP, 1);
}

/**
 * 云台控制，右上
 */
function aRightUp_ms_down() {
	PtzCtrl(PTZCTRLOPR.UPRIGHT, 1);
}

/**
 * 云台控制，左
 */
function aLeft_ms_down() {
	PtzCtrl(PTZCTRLOPR.LEFT, 1);
}

/**
 * ？
 */
function aCenter_ms_down() {
	// ;// PtzCtrl(PTZCTRLOPR.UPLEFT, 1);
}

/**
 * 云台控制，右
 */
function aRight_ms_down() {
	PtzCtrl(PTZCTRLOPR.RIGHT, 1);
}

/**
 * 云台控制，左下
 */
function aLeftDown_ms_down() {
	PtzCtrl(PTZCTRLOPR.DOWNLEFT, 1);
}

/**
 * 云台控制，下
 */
function aDown_ms_down() {
	PtzCtrl(PTZCTRLOPR.DOWN, 1);
}

/**
 * 云台控制，右下
 */
function aRightDown_ms_down() {
	PtzCtrl(PTZCTRLOPR.DOWNRIGHT, 1);
}

/**
 * 云台控制，光圈缩小
 */
function ApertureSmall_ms_down() {
	PtzCtrl(PTZCTRLOPR.DARK, 1);
}
/**
 * 云台控制，光圈增大
 */
function ApertureLarge_ms_down() {
	PtzCtrl(PTZCTRLOPR.BRIGHTER, 1);
}

/**
 * 云台控制，变焦拉进
 */
function ZoomIn_ms_down() {
	PtzCtrl(PTZCTRLOPR.NEARR, 1);
}
/**
 * 云台控制，变焦拉远
 */
function ZoomOut_ms_down() {
	PtzCtrl(PTZCTRLOPR.FARR, 1);
}

/**
 * 云台控制，聚焦小
 */
function IrisSmall_ms_down() {
	PtzCtrl(PTZCTRLOPR.TINY, 1);
}
/**
 * 云台控制，聚焦大
 */
function IrisLarge_ms_down() {
	PtzCtrl(PTZCTRLOPR.WIDE, 1);
}

/**
 * 云台控制，左上
 */
function aLeftUp_ms_up() {
	PtzCtrl(PTZCTRLOPR.UPLEFT, 0);
}

/**
 * 云台控制，上
 */
function aUp_ms_up() {
	PtzCtrl(PTZCTRLOPR.UP, 0);
}

/**
 * 云台控制，右上
 */
function aRightUp_ms_up() {
	PtzCtrl(PTZCTRLOPR.UPRIGHT, 0);
}

/**
 * 云台控制，左
 */
function aLeft_ms_up() {
	PtzCtrl(PTZCTRLOPR.LEFT, 0);
}

/**
 * 3D功能
 */
function aCenter_ms_up(ctrl) {
	if ($(ctrl).hasClass("m-cloud-5")) {
		set3DCtrl(true);// PtzCtrl(PTZCTRLOPR.UPLEFT, 1);
		$(ctrl).removeClass("m-cloud-5").addClass("m-cloud-3d");
	} else {
		set3DCtrl(false);// PtzCtrl(PTZCTRLOPR.UPLEFT, 1);
		$(ctrl).addClass("m-cloud-5").removeClass("m-cloud-3d");
	}
}

/**
 * 云台控制，右
 */
function aRight_ms_up() {
	PtzCtrl(PTZCTRLOPR.RIGHT, 0);
}

/**
 * 云台控制，左下
 */
function aLeftDown_ms_up() {
	PtzCtrl(PTZCTRLOPR.DOWNLEFT, 0);
}

/**
 * 云台控制，下
 */
function aDown_ms_up() {
	PtzCtrl(PTZCTRLOPR.DOWN, 0);
}

/**
 * 云台控制，左上右下
 */
function aRightDown_ms_up() {
	PtzCtrl(PTZCTRLOPR.DOWNRIGHT, 0);
}

/**
 * 云台控制，光圈缩小
 */
function ApertureSmall_ms_up() {
	PtzCtrl(PTZCTRLOPR.BRIGHTER, 0);
}
/**
 * 云台控制，光圈增大
 */
function ApertureLarge_ms_up() {
	PtzCtrl(PTZCTRLOPR.DARK, 0);
}

/**
 * 云台控制，变焦拉进
 */
function ZoomIn_ms_up() {
	PtzCtrl(PTZCTRLOPR.NEARR, 0);
}
/**
 * 云台控制，变焦拉远
 */
function ZoomOut_ms_up() {
	PtzCtrl(PTZCTRLOPR.FARR, 0);
}

/**
 * 云台控制，聚焦小
 */
function IrisSmall_ms_up() {
	PtzCtrl(PTZCTRLOPR.TINY, 0);
}
/**
 * 云台控制，聚焦大
 */
function IrisLarge_ms_up() {
	PtzCtrl(PTZCTRLOPR.WIDE, 0);
}

var preset = {
		username: null,
		password: null,
		urlhead: null,
		setParam: function(name, pwd, url) {
			username = name;
			password = pwd;
			urlhead = url;
		},
		// 查询列表
		list: function(videoid, callback) {
			$.ajax({
				async: false,
				url: urlhead + "/getpresetlist/" + videoid + "/" + username + "/" + password,
				type: "GET",
				dataType: 'jsonp',
		        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
				jsonpCallback: 'callback_getpresetlist',
				success: function (result) {
					if (callback) callback(result);
				}
			});
		},
		// 编辑
		edit: function(videoid, num, name, callback) {
			$.ajax({
				async: false,
				url: urlhead + "/editpreset/" + videoid + "/" + num + "/" + name + "/" + username + "/" + password,
				type: "GET",
				dataType: 'jsonp',
		        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
				jsonpCallback: 'callback_editpreset',

				success: function (result) {
					if (callback) callback(result);
				}
			});
		},
		// 添加
		add: function(videoid, num, name, callback) {
			$.ajax({
				async: false,
				url: urlhead + "/addpreset/" + videoid + "/" + num + "/" + name + "/" + username + "/" + password,
				type: "GET",
				dataType: 'jsonp',
		        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
				jsonpCallback: 'callback_addpreset',

				success: function (result) {
					if (callback) callback(result);
				}
			});
		},
		// 移除
		remove: function(videoid, num, callback) {
			$.ajax({
				async: false,
				url: urlhead + "/deletepreset/" + videoid + "/" + num + "/" + username + "/" + password,
				type: "GET",
				dataType: 'jsonp',
		        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
				jsonpCallback: 'callback_deletepreset',

				success: function (result) {
					if (callback) callback(result);
				}
			});
		},
		// 执行
		execute: function(videoid, num, callback) {
			$.ajax({
				async: false,
				url: urlhead + "/presetPlay/" + videoid + "/" + num + "/" + username + "/" + password,
				type: "GET",
				dataType: 'jsonp',
		        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
				jsonpCallback: 'callback_presetPlay',

				success: function (result) {
					if (callback) callback(result);
				}
			});
		}
};

export function test() {
	console.log(12);
}
