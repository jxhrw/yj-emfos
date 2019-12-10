<template>
    <div class="ej-content">
        <div class="ej-content-title">
            <h2>资产总览</h2>
        </div>
        <div class="ej-content-main">
            <div class="ej-content-right">
                <!-- <div >

        </div>-->
                <div class="m-real" id="mapReal">
                    <iframe :src="mapRealUrl" style="height:100%;width:100%"></iframe>
                    <div class="line">
                        <i v-show="typeLine!=0" class="el-icon-caret-top" @click="changeMap('-')"></i>
                        <i v-show="typeLine!=2" class="el-icon-caret-bottom" @click="changeMap('+')"></i>
                    </div>
                </div>

                <div class="m-map" id="mapBox">
                    <div id="mapLocation" style="width:100%;height:100%;"></div>
                    <div class="map-switch" @click="showScene=true"></div>
                    <ul class="map-bottom">
                        <li v-for="item in layerList" :key="item.layer.id" :class="{'active': item.layer.id == layerSelect}" @click="showLayer(item)">
                            <p class="imge" :style="`background-image:url(${item.bgImg})`"></p>
                            <p>{{item.layer.id}}</p>
                            <p>{{item.devNum}}</p>
                        </li>
                        <div class="bg">
                            <div class="left" :style="`background:url(${$config.mapImages_HOST}enjoyor/images/OperLayerBar/m1_bgl2.png)`"></div>
                            <div class="center" :style="`background:url(${$config.mapImages_HOST}enjoyor/images/OperLayerBar/m1_bg2.png)`"></div>
                            <div class="right" :style="`background:url(${$config.mapImages_HOST}enjoyor/images/OperLayerBar/m1_bgr2.png)`"></div>
                        </div>
                    </ul>
                    <div class="map-top">
                        <ul>
                            <!-- <li>
                            <div>{{layerSelect}} <span>{{devNum}}</span></div>
                            <div><span>正常100</span><span>异常100</span></div>
              </li></!-->
                            <li v-for="(item, index) in statData" :key="index" :class="{'active':curType==item.type}" @click="modifyLayerThree(item.type,item.successCode,item.errorCode,item.unKnownCode)">
                                <div class="t-tiltle">
                                    <i></i>
                                    {{item.name}}
                                </div>
                                <div class="t-num">
                                    <span :title="item.successName" :class="{'active':curType==item.type&&curCode==item.successCode}" @click.stop="modifyLayerOne(item.type,item.successCode,2)">{{item.successNum}}</span>
                                    <span :title="item.errorName" :class="{'active':curType==item.type&&curCode==item.errorCode}" @click.stop="modifyLayerOne(item.type,item.errorCode,1)">{{item.errorNum}}</span>
                                    <span :title="item.unKnownName" :class="{'active':curType==item.type&&curCode==item.unKnownCode}" @click.stop="modifyLayerOne(item.type,item.unKnownCode,null)">{{item.unKnownNum}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    let _map;
    let _open;
    import Bus from "@/assets/js/bus.js";
    import Common from "@/assets/js/common.js";
    import d_bzbp from "@/assets/images/dev-bzbp.png";
    import d_jjkk from "@/assets/images/dev-jjkk.png";
    import d_jtgz from "@/assets/images/dev-jtgz.png";
    import d_signal from "@/assets/images/dev-signal.png";
    import d_swgd from "@/assets/images/dev-swgd.png";
    import d_twkk from "@/assets/images/dev-twkk.png";
    import d_twsp from "@/assets/images/dev-twsp.png";
    export default {
        components: {},
        data() {
            return {
                token: "",
                layerList: [],
                layerSelect: "",
                devTypeCode: "",
                devNum: 0,
                isSearch: false,
                dropDownSearch: false,
                queryConditions: {},
                isTableLoading: false,
                tableData: [],
                totalCount: 0,
                currentPage: 1,
                imgLoading: false,
                imgShowUrl: "",
                imgFiles: [], // 用于显示
                imgFileList: [], // 用于提交
                infoVisible: false,
                currentInfo: {},
                typeList: [],
                typeCode: "",
                typeName: "",
                longitude: "",
                latitude: "",
                typeVisible: false,

                // data: [],
                defaultProps: {
                    children: "children",
                    label: "dicName",
                    isLeaf: "leaf"
                },

                statData: [],
                curType: "",
                curCode: "",
                isCheckNumLoading: false,
                showScene: false,
                mapRealUrl: "",
                typeLine: 1 // 0上方，1中间，2下方
            };
        },
        created() {},
        mounted() {
            this.typeLine = 0;
            document.getElementById("mapReal").style = "height: 0px";
            document.getElementById("mapBox").style = "height: 100%!important";

            this.token = Common.getQueryString("token");
            this.mapRealUrl = this.$config.mapSceneUrl;
            window.mapMouseOut = this.mapMouseOut;
            this.$api
                .getMethod(
                    this.$config.efoms_HOST,
                    "/CheckReport/getDevAndFailSum", {},
                    this.token
                )
                .then(res => {
                    if (res.appCode == 0) {
                        this.initMap(res.resultList);
                    } else {
                        this.initMap([]);
                    }
                })
                .catch(err => {
                    this.initMap([]);
                });
            Bus.$on("upload-imgUp", value => {
                this.imgFileList = value;
                console.log(this.imgFileList);
            });
            let _this = this;
            window.addEventListener(
                "message",
                function(e) {
                    var data = e.data;
                    console.log(data);
                    if (data.lon && data.lat) {
                        _this.addPoint(data);
                    }
                },
                false
            );
        },
        watch: {
            layerSelect(val) {
                this.isSearch = false;
                this.dropDownSearch = false;
                this.tableData = [];
                this.totalCount = 0;
                this.currentPage = 1;
                _map.clearLayerById("layer100");
                this.infoVisible = false;
                this.mapMouseOut();
                this.curType = "";
                this.curCode = "";
                this.statData = [];
            },
            showScene(val) {
                if (val) {
                    document.getElementById(
                        "mapLocation_layers"
                    ).style = `cursor: url('${this.$config.mapImages_HOST}enjoyor/images/OperLayerBar/locat/-1.png'),auto;`;
                } else {
                    document.getElementById("mapLocation_layers").style = `cursor: auto;`;
                }
            }
        },
        methods: {
            changeMap(upDown) {
                if (upDown == "-") {
                    if (this.typeLine != 0) {
                        this.typeLine--;
                    }
                }
                if (upDown == "+") {
                    if (this.typeLine != 2) {
                        this.typeLine++;
                    }
                }

                switch (this.typeLine) {
                    case 0:
                        document.getElementById("mapReal").style = "height: 0px";
                        document.getElementById("mapBox").style = "height: 100%!important";
                        break;
                    case 1:
                        document.getElementById("mapReal").style = "height: 50%";
                        document.getElementById("mapBox").style = "height: 50%!important";
                        break;
                    case 2:
                        document.getElementById("mapReal").style = "height: calc(100% - 6px)";
                        document.getElementById("mapBox").style = "height: 6px!important";
                        break;
                    default:
                        break;
                }
            },
            modifyLayerThree(type, code1, code2, code3) {
                let sql = function(code) {
                    let str = "";
                    if (code == "null") {
                        str = " is null";
                    } else {
                        if (code == parseInt(code)) {
                            str = "=" + code;
                        } else {
                            str = "='" + code + "'";
                        }
                    }
                    return str;
                };
                this.curType = type;
                this.curCode = "";
                this.mapMouseOut();
                var arr = [];
                let _this = this;
                console.log(this.curType + sql(code1));
                console.log(this.curType + sql(code2));
                console.log(this.curType + sql(code3));
                _map.query({ layerid: _this.layerSelect, where: _this.curType + sql(code1) },
                    function(a) {
                        _map.query({ layerid: _this.layerSelect, where: _this.curType + sql(code2) },
                            function(b) {
                                _map.query({
                                        layerid: _this.layerSelect,
                                        where: _this.curType + sql(code3)
                                    },
                                    function(c) {
                                        console.log(a);
                                        console.log(b);
                                        console.log(c);
                                        for (var i = 0; i < a.length; i++) {
                                            a[i].attributes.DEVICESTATUS = 2;
                                            arr.push({
                                                ID: a[i].attributes.ID,
                                                attributes: a[i].attributes
                                            });
                                        }
                                        for (var i = 0; i < b.length; i++) {
                                            b[i].attributes.DEVICESTATUS = 1;
                                            arr.push({
                                                ID: b[i].attributes.ID,
                                                attributes: b[i].attributes
                                            });
                                        }
                                        for (var i = 0; i < c.length; i++) {
                                            c[i].attributes.DEVICESTATUS = null;
                                            arr.push({
                                                ID: c[i].attributes.ID,
                                                attributes: c[i].attributes
                                            });
                                        }
                                        _map.modifyLayerProperty(_this.layerSelect, arr);
                                        _map.setLayerVisibleById(_this.layerSelect, true);
                                    }
                                );
                            }
                        );
                    }
                );
            },
            modifyLayerOne(type, code, color) {
                this.curType = type;
                this.curCode = code;
                this.mapMouseOut();
                let _this = this;
                let sql = function(code) {
                    let str = "";
                    if (code == "null") {
                        str = " is null";
                    } else {
                        if (code == parseInt(code)) {
                            str = "=" + code;
                        } else {
                            str = "='" + code + "'";
                        }
                    }
                    return str;
                };
                let sqlNot = function(code) {
                    let str = "";
                    if (code == "null") {
                        str = " is not null";
                    } else {
                        if (code == parseInt(code)) {
                            str = "!=" + code;
                        } else {
                            str = "!='" + code + "'";
                        }
                    }
                    return str;
                };
                let isNQ = function(code) {
                    let str = "";
                    if (code == "null") {
                        // str = " is not null";
                    } else {
                        str = ` or ${_this.curType} is null`;
                    }
                    return str;
                };
                var arr = [];

                console.log(_this.curType + sql(this.curCode));
                console.log(_this.curType + sqlNot(_this.curCode) + isNQ(_this.curCode));

                _map.query({
                        layerid: _this.layerSelect,
                        where: _this.curType + sql(this.curCode)
                    },
                    function(a) {
                        console.log(a);
                        _map.query({
                                layerid: _this.layerSelect,
                                where: _this.curType + sqlNot(_this.curCode) + isNQ(_this.curCode)
                            },
                            function(b) {
                                console.log(b);
                                for (var i = 0; i < a.length; i++) {
                                    a[i].attributes.DEVICESTATUS = color;
                                    arr.push({
                                        ID: a[i].attributes.ID,
                                        attributes: a[i].attributes
                                    });
                                }
                                // 3 为不显示再图层上
                                for (var i = 0; i < b.length; i++) {
                                    b[i].attributes.DEVICESTATUS = 3;
                                    arr.push({
                                        ID: b[i].attributes.ID,
                                        attributes: b[i].attributes
                                    });
                                }
                                _map.modifyLayerProperty(_this.layerSelect, arr);
                            }
                        );
                    }
                );
            },
            mapMouseOver(e) {
                console.log(e);
                // this.mapMouseOut();
                let attr = e.graphic.attributes;
                console.log(attr);
                let id = attr.ID || attr.FACILITY_ID;
                if (!id) {
                    return;
                }

                let fuc = function(val) {
                    let str = "";
                    if (
                        val == "1" ||
                        val == "DEVICEALLSTATUS01" ||
                        val == "DEVWRANLEVEL02"
                    ) {
                        str = "success";
                    } else if (
                        val == "0" ||
                        val == "DEVICEALLSTATUS02" ||
                        val == "DEVWRANLEVEL01"
                    ) {
                        str = "error";
                    } else {
                        str = "unknown";
                    }
                    return str;
                };
                let stas = function(val) {
                    let str = "";
                    if (val == "DEVICESTATUS01") {
                        str = "启用";
                    } else if (val == "DEVICESTATUS02") {
                        str = "停用";
                    } else if (val == "DEVICESTATUS03") {
                        str = "报废";
                    } else {
                        str = "未知";
                    }
                    return str;
                };

                let name = attr.NAME;
                // if (name.length > 20) name = name.substring(0, 19) + "...";
                let html = "";

                let a1 =
                    '<li>设备状态 <i class="' + fuc(attr.DEV_STATUS_CODE) + '"></i></li>';
                let b1 =
                    '<li>连接状态 <i class="' + fuc(attr.LINK_STATUS_CODE) + '"></i></li>';
                let c1 =
                    '<li>网络状态 <i class="' + fuc(attr.IS_PING_CONNECT) + '"></i></li>';
                let d1 =
                    '<li>数据状态 <i class="' + fuc(attr.IS_HAVE_DATA) + '"></i></li>';
                let e1 =
                    '<li>延时状态 <i class="' + fuc(attr.IS_DELAY_DATA) + '"></i></li>';
                let f1 =
                    '<li>报警状态 <i class="' + fuc(attr.WRAN_LEVEL_CODE) + '"></i></li>';

                let blist = this.statData.filter(val => val.type == "LINK_STATUS_CODE");
                if (blist.length == 0) {
                    b1 = "<li>连接状态 --</li>";
                }
                let clist = this.statData.filter(val => val.type == "IS_PING_CONNECT");
                if (clist.length == 0) {
                    c1 = "<li>网络状态 --</li>";
                }
                let dlist = this.statData.filter(val => val.type == "IS_HAVE_DATA");
                if (dlist.length == 0) {
                    d1 = "<li>数据状态 --</li>";
                }
                let elist = this.statData.filter(val => val.type == "IS_DELAY_DATA");
                if (elist.length == 0) {
                    e1 = "<li>延时状态 --</li>";
                }
                let flist = this.statData.filter(val => val.type == "WRAN_LEVEL_CODE");
                if (flist.length == 0) {
                    f1 = "<li>报警状态 --</li>";
                }
                html += a1;
                html += b1;
                html += c1;
                html += d1;
                html += e1;
                html += f1;

                let str =
                    '<div class="map-all-bayonet" style="height:140px; width:240px;">' +
                    '<div class="bay-top">' +
                    "<h6><span>" +
                    name +
                    '</span><i class="el-icon-close" onclick="mapMouseOut()"></i></h6>' +
                    "<p>" +
                    (attr.REGION_NAME || "") +
                    "<span>" +
                    (attr.IP || "") +
                    "</span></p>" +
                    "</div>" +
                    '<div class="bay-content">' +
                    "<p>使用状态&nbsp;&nbsp;" +
                    stas(attr.DEVICESTATUS) +
                    "</p>" +
                    "<ul>" +
                    html +
                    "</ul>" +
                    "</div>" +
                    "<div>";

                if (this.devTypeCode.indexOf("REPDEVTYPE2") > -1) {
                    str =
                        '<div class="map-all-bayonet" style="height:29px; width:240px;">' +
                        '<div class="bay-top">' +
                        "<h6><span>" +
                        name +
                        '</span><i class="el-icon-close" onclick="mapMouseOut()"></i></h6>' +
                        "</div>" +
                        "<div>";
                }
                console.log(e.graphic.geometry.x, e.graphic.geometry.y);
                //   _map.centerAt([e.graphic.geometry.x, e.graphic.geometry.y]);
                _map.creatInfoSymbol(
                    "bayonet_layer_set",
                    str, {
                        x: e.graphic.geometry.x,
                        y: e.graphic.geometry.y,
                        spatialReference: e.graphic.geometry.spatialReference
                    },
                    -120,
                    -30
                );
            },
            mapMouseOut() {
                try {
                    _map.destroyInfoSymbol("bayonet_layer_set");
                } catch (err) {
                    console.log("没有绘制的图层");
                }
            },
            showLayer(obj) {
                if (this.isCheckNumLoading) {
                    console.log("请慢一点，当前请求还没有结束");
                    return;
                }
                this.layerSelect = this.layerSelect != obj.layer.id ? obj.layer.id : "";
                this.devTypeCode =
                    this.devTypeCode != obj.devTypeCode ? obj.devTypeCode : "";
                this.devNum = this.devNum != obj.devNum ? obj.devNum : 0;
                this.layerList.map(val => {
                    _map.setLayerVisibleById(val.layer.id, false);
                });
                if (this.layerSelect) {
                    var arr = [];
                    let _this = this;
                    if (
                        this.devTypeCode != "REPDEVTYPE21" &&
                        this.devTypeCode != "REPDEVTYPE22"
                    ) {
                        _map.query({ layerid: this.layerSelect }, function(a) {
                            for (var i = 0; i < a.length; i++) {
                                a[i].attributes.DEVICESTATUS = null;
                                arr.push({
                                    ID: a[i].attributes.ID,
                                    attributes: a[i].attributes
                                });
                            }
                            _map.modifyLayerProperty(_this.layerSelect, arr);
                            // _map.setLayerVisibleById(_this.layerSelect, true);
                        });
                    } else {
                        // _map.setLayerVisibleById(_this.layerSelect, true);
                    }

                    if (this.layerSelect != this.$config.dev22) {
                        // _map.setLayerVisibleById(this.$config.dev21, true);
                    }

                    this.getCheckCount();
                }
            },
            getCheckCount() {
                let pageHost = this.$config.efoms_HOST;
                let pageMethods = "/checkDevice/getNewCheckCount";
                let obj = { devTypeCode: this.devTypeCode };
                this.statData = [];
                this.isCheckNumLoading = true;
                this.$api
                    .getMethod(pageHost, pageMethods, obj, this.token)
                    .then(res => {
                        this.isCheckNumLoading = false;
                        if (res.appCode == 0) {
                            let obj = res.resultList || {};
                            let a = {
                                name: "网络状态",
                                type: "IS_PING_CONNECT",
                                successNum: obj.netZC,
                                successCode: "1",
                                successName: "在线",
                                errorNum: obj.netYC,
                                errorCode: "0",
                                errorName: "离线",
                                unKnownNum: obj.netOther,
                                unKnownCode: "null",
                                unKnownName: "未知"
                            };
                            let b = {
                                name: "报警数量",
                                type: "WRAN_LEVEL_CODE",
                                successNum: obj.warnYB,
                                successCode: "DEVWRANLEVEL02",
                                successName: "一般",
                                errorNum: obj.warnYZ,
                                errorCode: "DEVWRANLEVEL01",
                                errorName: "严重",
                                unKnownNum: obj.warnOther,
                                unKnownCode: "null",
                                unKnownName: "其他"
                            };
                            let c = {
                                name: "有无图像",
                                type: "IS_PHOTO_SUCCESS",
                                successNum: obj.picZC,
                                successCode: "1",
                                successName: "有",
                                errorNum: obj.picYC,
                                errorCode: "0",
                                errorName: "无",
                                unKnownNum: obj.picOther,
                                unKnownCode: "null",
                                unKnownName: "未知"
                            };
                            let d = {
                                name: "图像质量",
                                type: "PIC_STATUS_FLAG",
                                successNum: obj.PicMassTrueCount,
                                successCode: "1",
                                successName: "好",
                                errorNum: obj.PicMassFalseCount,
                                errorCode: "0",
                                errorName: "坏",
                                unKnownNum: obj.PicMassOtherCount,
                                unKnownCode: "null",
                                unKnownName: "未知"
                            };
                            let e = {
                                name: "实时数据",
                                type: "IS_HAVE_DATA",
                                successNum: obj.dataHaveZC,
                                successCode: "1",
                                successName: "有",
                                errorNum: obj.dataHaveYC,
                                errorCode: "0",
                                errorName: "无",
                                unKnownNum: obj.dataHaveOther,
                                unKnownCode: "null",
                                unKnownName: "未知"
                            };
                            let f = {
                                name: "数据延迟",
                                type: "IS_DELAY_DATA",
                                successNum: obj.daleyZC,
                                successCode: "0",
                                successName: "正常",
                                errorNum: obj.daleyYC,
                                errorCode: "1",
                                errorName: "延迟",
                                unKnownNum: obj.daleyOther,
                                unKnownCode: "null",
                                unKnownName: "未知"
                            };
                            let g = {
                                name: "图片访问",
                                type: "IS_PHOTO_SUCCESS",
                                successNum: obj.picZC,
                                successCode: "1",
                                successName: "成功",
                                errorNum: obj.picYC,
                                errorCode: "0",
                                errorName: "失败",
                                unKnownNum: obj.picOther,
                                unKnownCode: "null",
                                unKnownName: "未知"
                            };
                            let h = {
                                name: "连接状态",
                                type: "LINK_STATUS_CODE",
                                successNum: obj.LinkStatusTrueCount,
                                successCode: "1",
                                successName: "联机",
                                errorNum: obj.LinkStatusFalseCount,
                                errorCode: "0",
                                errorName: "脱机",
                                unKnownNum: obj.LinkStatusOtherCount,
                                unKnownCode: "null",
                                unKnownName: "未知"
                            };

                            switch (this.devTypeCode) {
                                case "REPDEVTYPE01":
                                    this.statData = [a, b];
                                    break;
                                case "REPDEVTYPE02":
                                    this.statData = [a, c, d, b];
                                    break;
                                case "REPDEVTYPE03":
                                case "REPDEVTYPE04":
                                    this.statData = [a, e, f, g, b];
                                    break;
                                case "REPDEVTYPE05":
                                case "REPDEVTYPE06":
                                case "REPDEVTYPE07":
                                case "REPDEVTYPE12":
                                    this.statData = [a, e, f, b];
                                    break;
                                case "REPDEVTYPE08":
                                    this.statData = [a, h, b];
                                    break;
                                case "REPDEVTYPE21":
                                case "REPDEVTYPE22":
                                case "REPDEVTYPE23":
                                    // this.statData = [b];
                                    break;
                            }
                            // this.statData = [a, b, c, d, e, f, g, h];
                            if (this.statData.length > 0) {
                                let item = this.statData[0];
                                this.modifyLayerThree(
                                    item.type,
                                    item.successCode,
                                    item.errorCode,
                                    item.unKnownCode
                                );
                            } else {
                                _map.setLayerVisibleById(this.layerSelect, true);
                            }
                        } else {
                            Common.printErrorLog(pageHost, pageMethods);
                            _map.setLayerVisibleById(this.layerSelect, true);
                        }
                    })
                    .catch(err => {
                        this.isCheckNumLoading = false;
                        console.log(err);
                        _map.setLayerVisibleById(this.layerSelect, true);
                    });
            },
            initMap(arr) {
                var _this = this;
                let _layer = "自定义地图";
                _map = new EJMap("mapLocation", {
                    zoom: 12,
                    baselayerbar: true,
                    // toolbar: true, // 是否显示常用工具组件
                    // zoomSlider: true, // 缩放控件
                    // scalebar: true, // 比例尺控件
                    // navigationbar: true, // 是否显示鱼骨
                    config: this.$config.mapConfigAssets
                });
                // 地图加载完成
                _map.addEventListener(EJMap.Event.onLayerAdded, function(e) {
                    console.log(e.layer.id);
                    if (
                        e.layer.id == "layer100" ||
                        e.layer.id == "layer200" ||
                        e.layer.id == "person" ||
                        e.layer.id == _this.$config.devBX ||
                        e.layer.id == _this.$config.devHL || e.layer.id == "道路面背景"
                    ) {
                        e.layer.maxScale = true;
                    }
                    if (!e.layer.maxScale) {
                        console.log(e);
                        // console.log(e.layerCode);
                        if (e.layer.id == _this.$config.dev01) {
                            e.sort = 1;
                            e.bgImg =
                                _this.$config.mapImages_HOST +
                                "enjoyor/images/OperLayerBar/signal.png";
                            e.devTypeCode = "REPDEVTYPE01";
                        } else if (e.layer.id == _this.$config.dev02) {
                            e.sort = 2;
                            e.bgImg =
                                _this.$config.mapImages_HOST +
                                "enjoyor/images/OperLayerBar/twsp.png";
                            e.devTypeCode = "REPDEVTYPE02";
                        } else if (e.layer.id == _this.$config.dev03) {
                            e.sort = 3;
                            e.bgImg =
                                _this.$config.mapImages_HOST +
                                "enjoyor/images/OperLayerBar/jjkk.png";
                            e.devTypeCode = "REPDEVTYPE03";
                        } else if (e.layer.id == _this.$config.dev04) {
                            e.sort = 4;
                            e.bgImg =
                                _this.$config.mapImages_HOST +
                                "enjoyor/images/OperLayerBar/twkk.png";
                            e.devTypeCode = "REPDEVTYPE04";
                        } else if (e.layer.id == _this.$config.dev05) {
                            e.sort = 5;
                            e.bgImg =
                                _this.$config.mapImages_HOST +
                                "enjoyor/images/symbols/symbol/xqjx.png";
                            e.devTypeCode = "REPDEVTYPE05";
                        } else if (e.layer.id == _this.$config.dev06) {
                            e.sort = 6;
                            e.bgImg =
                                _this.$config.mapImages_HOST +
                                "enjoyor/images/symbols/symbol/sfz.png";
                            e.devTypeCode = "REPDEVTYPE06";
                        } else if (e.layer.id == _this.$config.dev07) {
                            e.sort = 7;
                            e.bgImg =
                                _this.$config.mapImages_HOST +
                                "enjoyor/images/symbols/symbol/wbjc.png";
                            e.devTypeCode = "REPDEVTYPE07";
                        } else if (e.layer.id == _this.$config.dev08) {
                            e.sort = 8;
                            e.bgImg =
                                _this.$config.mapImages_HOST +
                                "enjoyor/images/symbols/symbol/lwp.png";
                            e.devTypeCode = "REPDEVTYPE08";
                        } else if (e.layer.id == _this.$config.dev12) {
                            e.sort = 12;
                            e.bgImg =
                                _this.$config.mapImages_HOST +
                                "enjoyor/images/symbols/efoms/correct/视频检测.png";
                            e.devTypeCode = "REPDEVTYPE12";
                        } else if (e.layer.id == _this.$config.dev21) {
                            e.sort = 22;
                            e.bgImg =
                                _this.$config.mapImages_HOST +
                                "enjoyor/images/OperLayerBar/jtyd/jtgz.png";
                            e.devTypeCode = "REPDEVTYPE21";
                        } else if (e.layer.id == _this.$config.dev22) {
                            e.sort = 23;
                            e.bgImg =
                                _this.$config.mapImages_HOST +
                                "enjoyor/images/OperLayerBar/jtyd/dlsg.png";
                            e.devTypeCode = "REPDEVTYPE22";
                        } else if (e.layer.id == _this.$config.dev23) {
                            e.sort = 21;
                            e.bgImg =
                                _this.$config.mapImages_HOST +
                                "enjoyor/images/symbols/symbol/bzbp.png";
                            e.devTypeCode = "REPDEVTYPE23";
                        }
                        let target = arr.filter(val => {
                            return e.devTypeCode == val.DEV_TYPE_CODE;
                        });
                        e.devNum = target.length > 0 ? target[0].DEVSUM : "";
                        _this.layerList.push(e);

                        _this.layerList.sort(_this.compare("sort"));
                    }
                    _map.setLayerVisibleById(_layer, false);
                    _map.setLayerVisibleById('道路面背景', true);
                });
                // 地图点击
                _map.addEventListener(EJMap.Event.onMapClick, function(e) {
                    // _this.dropDownSearch = false;
                    console.log(e);
                    _this.openMapScene(e.mapPoint);
                });
                // 图层元素点击事件
                _map.addEventListener(EJMap.Event.onFeatureClick, function(e) {
                    _this.mapMouseOver(e);
                });
                this.isHaveMap = true;
            },
            compare(property) {
                return function(a, b) {
                    var value1 = a[property];
                    var value2 = b[property];
                    return value1 - value2;
                };
            },
            addPoint(val) {
                _map.clearLayerById("person");
                _map.addPoint2GraphicsLayer({
                        geom: {
                            x: val.x || val.lon,
                            y: val.y || val.lat,
                            spatialReference: { wkid: 4326 }
                        },
                        symbol: {
                            url: host_script_url + "enjoyor/images/OperLayerBar/locat/-1.png",
                            height: 18,
                            width: 15,
                            type: "esriPMS",
                            xoffset: 0,
                            yoffset: 15
                        }
                    },
                    "person",
                    false
                );
            },
            openMapScene(val) {
                if (this.showScene === true) {
                    // 地理坐标转成屏幕坐标
                    let screebXY = {};
                    _map.MapPoint2ScreenPoint({
                        x: val.x,
                        y: val.y,
                        spatialReference: { wkid: 4326 }
                    }, function(e) {
                        screebXY = { x: e.x, y: e.y };
                    });
                    // 屏幕坐标转成地理坐标
                    let geoXY = {};
                    _map.ScreenPoint2MapPoint(screebXY.x + 8, screebXY.y + 32, function(e) {
                        geoXY = { x: e.x, y: e.y };
                    });

                    this.addPoint(geoXY);
                    this.mapRealUrl = `${this.$config.mapSceneUrl}?x=${geoXY.x}&y=${geoXY.y}`;
                    // _open = window.open(
                    //     `${this.$config.mapSceneUrl}?x=${val.x}&y=${val.y}`,
                    //     "newwindow",
                    //     "top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no"
                    // );
                    // var loop = setInterval(function() {
                    //     if (_open.closed) {
                    //         clearInterval(loop);
                    //         console.log('colse');
                    //         _map.clearLayerById("person");
                    //     }
                    // }, 1000);
                }
                this.showScene = false;
            },
            // 数据字典
            getDicInfo(parentCode) {
                return this.$api.getMethod(
                    this.$config.ubms_HOST,
                    '/DeviceDic/getDeviceDic.htm', { token: this.token, data: JSON.stringify({ parentCode: parentCode }) }
                );
            },
            // 数据字典(2)
            getDicInfoOther() {
                return this.$api.getMethod(
                    this.$config.efoms_HOST,
                    "/CheckReport/getSelectValue", { devTypeCode: this.devType },
                    this.token
                );
            },
            // 数据字典（3）
            getDicInfoTaf(parentCode) {
                return this.$api.getMethod(
                    this.$config.ubms_HOST,
                    "/TrafficDic/getTrafficDic.htm", { token: this.token, data: JSON.stringify({ parentCode: parentCode }) }
                );
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "./assets.less";
</style>
<style lang="less">
    .m-real {
        position: absolute;
        width: 100%;
        height: 50%;
        top: 0;
        left: 0;
        background: #000;

        .line {
            position: absolute;
            width: 100%;
            height: 6px;
            bottom: -6px;
            left: 0;
            z-index: 5;
            background: #1873aa;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;

            i {
                background: #4b4b4b;
                width: 50px;
                text-align: center;
                font-size: 10px;
                cursor: pointer;

                &+i {
                    border-left: 1px solid #000;
                }
            }
        }
    }

    .m-map {
        position: absolute;
        height: 50% !important;
        bottom: 0;
        left: 0;
        overflow: hidden;
    }

    .map-top {
        top: 12px !important;
    }

    .type-popper {
        padding: 5px 0;
        width: 300px;

        .region-scroll {
            height: 270px;
        }

        .el-scrollbar__wrap {
            margin-bottom: 0 !important;
        }
    }

    .map-all-bayonet {
        color: #2f2f2f;
        font-size: 12px;
        background: #ffffff;
        box-shadow: 0 2px 14px -2px rgba(8, 133, 162, 0.5);
        border-radius: 2px 2px 2px 0 0 0 0 0 0 0 0 0 2px;

        .bay-top {
            background: #13b49a;
            color: #fff;
            padding: 5px 10px;

            h6 {
                font-size: 14px;
                white-space: nowrap;
                display: flex;
                justify-content: space-between;

                span {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                i {
                    margin-top: 3px;
                    cursor: pointer;
                    // display: none;
                }
            }

            p {
                span {
                    float: right;
                }
            }
        }

        .bay-content {
            padding: 5px 10px;

            p {
                color: #11ada2;
            }

            ul {
                display: flex;
                flex-flow: wrap;

                li {
                    width: 50%;
                    margin-top: 5px;

                    i {
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 8px;

                        &.success {
                            background: #16d28c;
                        }

                        &.error {
                            background: #f00b0b;
                        }

                        &.unknown {
                            // background: #e8941e;
                            background: #8d8d8d;
                        }
                    }
                }
            }
        }
    }
</style>