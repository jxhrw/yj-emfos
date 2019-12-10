<template>
    <div class="ej-content">
        <div class="ej-content-title">
            <h2>资产维护</h2>
            <div>
                <div class="ej-content-goto" @click="gotoList">
                    <p>列表模式</p>
                </div>
            </div>
        </div>
        <div class="ej-content-main">
            <div class="ej-content-right">
                <div class="m-map" id="mapLocation"></div>
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
                <div class="map-left" v-show="layerSelect!=''">
                    <Search @searchAsk="selectRepairsInfoPage" :devType="devTypeCode" placeholder="编码、ip、名称" ref="search" :cond="searchCond"></Search>
                    <div class="as-search" v-show="isSearch">
                        <div v-show="dropDownSearch" class="more-search" @click="moreCond">
                            <span>更多条件</span>
                        </div>
                        <div class="result-tip" @mouseenter="dropDownSearch = true;">搜索结果：{{layerSelect}}（{{totalCount}}）</div>
                        <div v-show="dropDownSearch" id="domSearch" class="res-scroll-box" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                            <el-scrollbar class="res-scroll">
                                <div class="res-box" id="resBox">
                                    <ul>
                                        <li v-for="(item) in tableData" :key="item.devId" @click="mapCenter(item)">
                                            <i class="ic-index"></i>
                                            <!-- <i class="ic-icon">2</i> -->
                                            <div class="ic-txt">
                                                <h6 class="txt-title" :style="(currentInfo.name&&(currentInfo.name==item.devName||currentInfo.name==item.facilityName))?'color: #409eff;':''">{{item.devName||item.facilityName}}</h6>
                                                <div class="txt-desc">
                                                    <div class="desc-det">
                                                        <p>{{item.devDeptName||item.manageDeptName}}</p>
                                                        <p>{{item.roadName || ' '}}</p>
                                                    </div>
                                                    <template v-if="item.AssentFileInfoList&&item.AssentFileInfoList.length>0">
                                                        <img class="desc-img" :src="item.AssentFileInfoList[0].FileURL" alt="图片">
                                                    </template>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                    <div class="res-page-box" v-if="totalCount>10">
                                        <el-pagination small layout="prev, pager, next" :total="totalCount" :current-page="currentPage" @current-change="searchTable"></el-pagination>
                                    </div>
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>
                </div>
                <div class="map-right-top el-icon-circle-plus" v-show="devTypeCode!=''&&devTypeCode!='REPDEVTYPE21'&&devTypeCode!='REPDEVTYPE22'" @click="pointDetail({})"></div>
                <div class="map-right">
                    <div class="info-box box-one" :style="{'width':infoVisible?'300px':'0'}">
                        <div class="info-header">
                            <h6>{{layerSelect}}</h6>
                            <i class="hb-right el-icon-close" @click="infoVisible=false;"></i>
                        </div>
                        <el-scrollbar class="ej-scroll-content">
                            <div class="info-scroll">
                                <ul style="margin-top:10px;">
                                    <li>
                                        <label class="">编号</label>
                                        <el-input v-model="currentInfo.id" placeholder disabled></el-input>
                                    </li>
                                    <li v-show="devTypeCode.indexOf('REPDEVTYPE2')==-1">
                                        <label class=""><i>*</i>类型</label>
                                        <el-select v-model="currentInfo.type" placeholder size="mini" class="search-input" :disabled="devTypeCode.indexOf('REPDEVTYPE2')==-1&&!isAddInfo">
                                            <el-option v-for="item in typeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode"></el-option>
                                        </el-select>
                                    </li>
                                    <li v-if="infoVisible && devTypeCode.indexOf('REPDEVTYPE2')>-1">
                                        <label class=""><i>*</i>类型</label>
                                        <el-input v-model="currentInfo.typeName" placeholder size="mini" class="search-input" readonly v-popover:popoverType></el-input>
                                        <el-popover highlight-current popper-class="type-popper" ref="popoverType" placement="left" trigger="click" v-model="typeVisible">
                                            <el-scrollbar class="region-scroll">
                                                <el-tree :props="defaultProps" :load="loadNode" lazy accordion @node-click="handleNodeClick">
                                                </el-tree>
                                            </el-scrollbar>
                                        </el-popover>
                                    </li>
                                    <li>
                                        <label class=""><i>*</i>名称</label>
                                        <el-input v-model="currentInfo.name" placeholder :disabled="devTypeCode.indexOf('REPDEVTYPE2')==-1&&!isAddInfo"></el-input>
                                    </li>
                                    <li v-show="devTypeCode!='REPDEVTYPE21'&&devTypeCode!='REPDEVTYPE22'">
                                        <label class=""><i>*</i>经度</label>
                                        <el-input v-model="currentInfo.longitude" placeholder :disabled="devTypeCode.indexOf('REPDEVTYPE2')==-1&&!isAddInfo"></el-input>
                                        <i class="el-icon-location loct" @click="test" v-show="devTypeCode.indexOf('REPDEVTYPE2')>-1||(devTypeCode.indexOf('REPDEVTYPE2')==-1&&isAddInfo)"></i>
                                    </li>
                                    <li v-show="devTypeCode!='REPDEVTYPE21'&&devTypeCode!='REPDEVTYPE22'">
                                        <label class=""><i>*</i>纬度</label>
                                        <el-input v-model="currentInfo.latitude" placeholder :disabled="devTypeCode.indexOf('REPDEVTYPE2')==-1&&!isAddInfo"></el-input>
                                    </li>
                                    <li style="display: block;">
                                        <label class="">图片</label>
                                        <div class="my-upload" :class="{'noMoreAdd':(devTypeCode.indexOf('REPDEVTYPE2')==-1&&!isAddInfo)||imgFileList.length>=3,'noDel':(devTypeCode.indexOf('REPDEVTYPE2')==-1&&!isAddInfo)}">
                                            <EJ-ImgUpload id="imgUp" :imgFiles="imgFileList"></EJ-ImgUpload>
                                        </div>
                                    </li>
                                </ul>
                                <div class="info-btns">
                                    <el-button class="back" @click="goDetail">更多信息</el-button>
                                    <template v-if="devTypeCode.indexOf('REPDEVTYPE2')>-1||isAddInfo">
                                        <el-button class="save" @click="submitInfo">保存</el-button>
                                        <el-button class="back" @click="infoVisible=false">取消</el-button>
                                    </template>
                                </div>
                            </div>
                        </el-scrollbar>
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
    import qs from 'qs';
    import Search from "../inspection/search";
    import ImgUpload from "components/common/imgUpload";
    import d_bzbp from "@/assets/images/dev-bzbp.png";
    import d_jjkk from "@/assets/images/dev-jjkk.png";
    import d_jtgz from "@/assets/images/dev-jtgz.png";
    import d_signal from "@/assets/images/dev-signal.png";
    import d_swgd from "@/assets/images/dev-swgd.png";
    import d_twkk from "@/assets/images/dev-twkk.png";
    import d_twsp from "@/assets/images/dev-twsp.png";
    export default {
        components: {
            Search,
            "EJ-ImgUpload": ImgUpload
        },
        data() {
            return {
                token: '',
                allList: [],
                layerList: [],
                layerSelect: "",
                devTypeCode: "",
                searchCond: '',
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
                imgFileOther: [],
                infoVisible: false,
                currentInfo: {},
                typeList: [],
                typeCode: '',
                typeName: '',
                longitude: "",
                latitude: "",
                typeVisible: false,

                // data: [],
                defaultProps: {
                    children: "children",
                    label: "dicName",
                    isLeaf: 'leaf'
                },
                isAddInfo: false, //是否新增
                showScene: false,
            };
        },
        created() {},
        mounted() {
            this.token = Common.getQueryString("token");
            this.$api.getMethod(this.$config.efoms_HOST, '/efoms-rest/CheckReport/getDevAndFailSum', {}, this.token).then(res => {
                if (res.appCode == 0) {
                    this.initMap(res.resultList);
                } else {
                    this.initMap([]);
                }
            }).catch((err) => {
                this.initMap([]);
            });
            Bus.$on("upload-imgUp", value => {
                this.imgFileList = value;
                console.log(this.imgFileList);
            });
            let _this = this;
            window.addEventListener("message", function(e) {
                    var data = e.data;
                    console.log(data);
                    if (data.lon && data.lat) {
                        _this.addPoint(data, '-1');
                    }
                },
                false
            );
        },
        watch: {
            imgShowUrl(val) {
                let newImg = new Image();
                newImg.src = val;
                this.imgLoading = true;
                newImg.onerror = () => {
                    // 图片加载错误时的替换图片
                    this.imgLoading = false;
                };
                newImg.onload = () => {
                    // 图片加载成功后把地址给原来的img
                    this.imgLoading = false;
                };
            },
            infoVisible(val) {
                if (!val) {
                    this.currentInfo = {};
                }
                this.typeVisible = false;
            },
            layerSelect(val) {
                this.isSearch = false;
                this.dropDownSearch = false;
                this.$refs.search.searchPoperVisible = false;
                this.tableData = [];
                this.totalCount = 0;
                this.currentPage = 1;
                _map.clearLayerById("layer100");
                _map.clearLayerById("layer200");
                _map.clearLayerById("person");
                this.infoVisible = false;
            },
            showScene(val) {
                if (val) {
                    document.getElementById('mapLocation_layers').style = `cursor: url('${this.$config.mapImages_HOST}enjoyor/images/OperLayerBar/locat/-1.png'),auto;`;
                } else {
                    document.getElementById('mapLocation_layers').style = `cursor: auto;`;
                }
            }
        },
        methods: {
            loadNode(node, resolve) {
                // 标志
                if (this.devTypeCode == 'REPDEVTYPE23') {
                    if (node.level === 0) {
                        this.getDicInfo('SIGNSCLASS01').then(res => {
                            return resolve(res.resultList);
                        });
                    }
                    // if (node.level > 1) return resolve([]);
                }
                // 护栏
                if (this.devTypeCode == 'REPDEVTYPE22') {
                    if (node.level === 0) {
                        this.getDicInfo('SIGNSCLASS03').then(res => {
                            return resolve(res.resultList);
                        });
                    }
                }
                // 标线
                if (this.devTypeCode == 'REPDEVTYPE21') {
                    if (node.level === 0) {
                        this.getDicInfo('SIGNSCLASS02').then(res => {
                            return resolve(res.resultList);
                        });
                    }
                }

                if (node.level > 0) {
                    this.getDicInfo(node.data.dicCode).then(res => {
                        res.resultList.map(val => {
                            val.leaf = true;
                        });
                        return resolve(res.resultList);
                    });
                }
            },
            handleNodeClick(data, node, e) {
                if (node.isLeaf) {
                    console.log(node);
                    // this.selectRegion = data.text;
                    // this.selectRegionCode = data.id;
                    this.currentInfo.parentCode = node.parent.data.dicCode;
                    this.currentInfo.parentName = node.parent.data.dicName;;
                    this.currentInfo.type = data.dicCode;
                    this.currentInfo.typeName = data.dicName;
                    this.typeVisible = false;
                }
            },
            submitInfo() {
                let arr = [];
                let arrList = [...this.imgFileList, ...this.imgFileOther];
                arrList.map(val => {
                    let a = {
                        devId: this.currentInfo.id,
                        devTypeCode: this.devTypeCode,
                        devCategoryCode: Common.getDevCategory('ss').code,
                        FileURL: val.fileURL,
                        FileMode: val.fileMode,
                        FileName: val.fileName
                    };
                    arr.push(a);
                });

                console.log(arr);

                let obj = {
                    token: this.token,
                    mapBean: {
                        "devTypeCode": this.devTypeCode, //类型编号
                        devName: this.currentInfo.name, //设备名称；
                        signsType: this.currentInfo.parentCode,
                        signsTypeName: this.currentInfo.parentName,
                        signsCode: this.currentInfo.type,
                        signsCodeName: this.currentInfo.typeName,
                        x: this.currentInfo.longitude,
                        y: this.currentInfo.latitude,
                        "strArea": JSON.stringify({
                            x: this.currentInfo.longitude,
                            y: this.currentInfo.latitude,
                            spatialReference: { "wkid": 4326 }
                        })
                    },
                    // signsPicInfoDto: {
                    //     devId: "string",
                    //     signsCode: "string",
                    //     signsCodeName: "string",
                    //     url: "string"
                    // },
                    list: JSON.stringify(arr)
                };
                let host = this.$config.efoms_HOST;
                let methods = `/efoms-rest/UbmsAddInfo/addUbmsInfo`;

                if (this.currentInfo.id) {
                    obj.mapBean.devId = this.currentInfo.id;
                    methods = `/efoms-rest/UbmsAddInfo/editFailityInfo`;
                }

                this.$api.getMethod(host, methods, obj, this.token).then(res => {
                        if (res.appCode == 0) {
                            this.$message({
                                message: '操作成功，请等待图层刷新',
                                type: 'success'
                            });
                            _map.reorderLayer(this.layerSelect);
                        } else {
                            Common.printErrorLog(host, methods);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            selectRepairsInfoPage(obj) {
                console.log(obj);
                this.isSearch = true;
                this.dropDownSearch = true;

                this.$nextTick(() => {
                    let dom = document.getElementById('domSearch');
                    let hg = document.documentElement.clientHeight;
                    document.getElementById('domSearch').style = 'height:' + (hg - 300) + 'px';
                });

                obj = obj || {};
                this.searchFlag = '';
                this.checked = false;
                this.onSite = '';
                this.queryConditions = {
                    // devTypeCode: this.devTypeCode,
                    pageSize: 10,
                    key: obj.key || '',
                    // manDeptId: obj.manDeptId || '',
                    // areaId: obj.areaId || '',
                    roadId: obj.roadId || '',
                    factory: obj.factory || '',
                    company: obj.company || '',
                    project: obj.project || '',
                    oppmDept: obj.oppmDept || '',
                    // devStatus: obj.devStatus || '',

                    devScene: obj.devScene || '',
                    videoDevType: obj.videoDevType || '',
                    isHaveGeom: obj.isHaveGeom || '',
                    devSYNX: obj.devSYNX || ''
                };
                if (this.devTypeCode.indexOf('REPDEVTYPE2') > -1) {
                    this.queryConditions.facilityTypeCode = this.devTypeCode;
                    this.queryConditions.manageDept = obj.manDeptId || '';
                    this.queryConditions.regionId = obj.areaId || '';
                    this.queryConditions.deviceStatus = obj.devStatus || '';
                } else {
                    this.queryConditions.devTypeCode = this.devTypeCode;
                    this.queryConditions.manDeptId = obj.manDeptId || '';
                    this.queryConditions.areaId = obj.areaId || '';
                    this.queryConditions.devStatus = obj.devStatus || '';
                }
                this.searchTable(1);
            },
            searchTable(val) {
                _map.clearLayerById("layer100");
                _map.clearLayerById("layer200");
                document.getElementById("resBox").scrollIntoView();
                this.currentPage = val;
                this.queryConditions.currentPage = this.currentPage;
                let pageHost = this.$config.efoms_HOST;
                let pageMethods = '/efoms-rest/checkDevice/getNewCheckPage';
                if (this.devTypeCode.indexOf('REPDEVTYPE2') > -1) {
                    pageMethods = this.$config.selectFacilitySimpleInfoPage_GET;
                }
                this.isTableLoading = true;
                this.$api.getMethod(pageHost, pageMethods, this.queryConditions, this.token).then(res => {
                        setTimeout((load) => {
                            this.isTableLoading = false;
                        }, 500);
                        if (res.appCode == 0) {
                            this.tableData = res.resultList.result || [];
                            this.totalCount = res.resultList.totalCount;
                            this.currentPage = res.resultList.currentPage;

                            let i = 0;
                            this.tableData.map(val => {
                                i++;
                                if (!((val.longitude) && (val.latitude))) {
                                    return;
                                }
                                // console.log(val.longitude, val.latitude);
                                _map.addPoint2GraphicsLayer({
                                    geom: {
                                        "x": val.longitude,
                                        "y": val.latitude,
                                        "spatialReference": { "wkid": 4326 }
                                    },
                                    // attributes: val,
                                    symbol: {
                                        "url": host_script_url + "enjoyor/images/OperLayerBar/locat/" + i + ".png",
                                        "height": 18,
                                        "width": 15,
                                        "type": "esriPMS",
                                        "xoffset": 0,
                                        "yoffset": 15
                                    },
                                    // onclickeven: (e) => {
                                    //     this.pointDetail(e.graphic.attributes);
                                    // },
                                    // onmouseover: this.mapMouseOver,
                                    // onmouseout: this.mapMouseOut,
                                }, "layer100", false);
                            });

                            let leg = this.tableData.length;
                            let isHv = 0;
                            for (let k = 0; k < leg.length && isHv == 0; k++) {
                                let a = this.tableData[k].longitude;
                                let b = this.tableData[k].longitude;
                                if ((a) && (b)) {
                                    _map.centerAt([a, b]);
                                    isHv++;
                                }
                            }
                        } else {
                            Common.printErrorLog(pageHost, pageMethods);
                        }
                    })
                    .catch(err => {
                        setTimeout((load) => {
                            this.isTableLoading = false;
                        }, 500);
                        Common.printErrorLog(pageHost, pageMethods);
                        console.log(err);
                    });
            },
            mapCenter(val) {
                if ((val.longitude) && (val.latitude)) {
                    _map.centerAt([
                        val.longitude,
                        val.latitude
                    ]);
                }
                let sql = "ID='" + (val.devId || val.facilityId) + "'";
                let _this = this;

                if (this.devTypeCode == 'REPDEVTYPE21' || this.devTypeCode == 'REPDEVTYPE22') {
                    _this.pointDetail(val);
                    sql = "signsid='" + (val.devId || val.facilityId) + "'";
                    _map.clearLayerById("person");
                    _map.clearLayerById("layer200");
                    let layeridName = this.devTypeCode == 'REPDEVTYPE21' ? this.$config.devBX : this.$config.devHL;
                    _map.query({ layerid: layeridName, where: sql }, function(a) {
                        console.log('位置信息', a)
                        a.forEach((item, index) => {
                            _map.addLine2GraphicsLayer({
                                geom: {
                                    paths: item.geometry.paths,
                                    "spatialReference": item.geometry.spatialReference
                                },
                                symbol: {
                                    "type": "esriSLS",
                                    "style": "esriSLSSolid",
                                    "color": [58, 187, 10, 255],
                                    "width": 6
                                },
                            }, "layer200", false);

                            if (index == 0) {
                                _this.addPoint({
                                    x: item.geometry.paths[0][0][0],
                                    y: item.geometry.paths[0][0][1]
                                });
                                _map.centerAt([
                                    item.geometry.paths[0][0][0],
                                    item.geometry.paths[0][0][1]
                                ]);
                            }
                        })
                    });
                } else {
                    _map.query({ layerid: this.layerSelect, where: sql }, function(a) {
                        console.log(a);
                        if (a && a.length > 0) {
                            _this.pointDetail(a[0].attributes || {});
                        }
                    });
                }




                // this.pointDetail(val);
            },
            pointDetail(info) {
                console.log(info);
                this.currentInfo = {
                    id: info.ID || info.FACILITY_ID || info.facilityId,
                    name: info.NAME || info.devName || info.SIGNNAME || info.FACILITY_NAME || info.facilityName,
                    type: info.DEVTYPE || info.SIGNCODE || info.MARK_TYPE_CODE || (info.signPicInfoList ? "" : "") || info.signsCode || '',
                    typeName: info.DEVTYPE_NAME || info.SIGNCODE_NAME || info.MARK_TYPE_NAME || info.SIGNS_CODE_NAME || info.signsCodeName || '',
                    parentCode: info.SIGNTYPE || info.signsType || '',
                    parentName: info.SIGNTYPE_NAME || info.signsTypeName || '',
                    longitude: info.LONGITUDE || info.X || info.longitude || info.LOCALLON || info.COORDX,
                    latitude: info.LATITUDE || info.Y || info.latitude || info.LOCALLAT || info.COORDY
                };
                this.isAddInfo = !this.currentInfo.id;
                this.typeList = [];
                switch (this.devTypeCode) {
                    case "REPDEVTYPE01":
                        this.getDicInfoTaf('SIGMACHINETYPE').then(res => {
                            this.typeList = res.resultList;
                        });
                        break;
                    case "REPDEVTYPE02":
                        this.getDicInfo('TYPEVIDEO').then(res => {
                            this.typeList = res.resultList;
                        });
                        break;
                    case "REPDEVTYPE03":
                        // this.currentInfo.type = '';
                        this.typeList = [{ dicCode: '', dicName: '卡口' }];
                        break;
                    case "REPDEVTYPE04":
                        this.typeList = [{ dicCode: '', dicName: '卡式电警' }];
                        break;
                    case "REPDEVTYPE05":
                        // this.currentInfo.type = '';
                        this.typeList = [{ dicCode: '', dicName: '地磁' }];
                        break;
                    case "REPDEVTYPE06":
                        // this.currentInfo.type = '';
                        this.typeList = [{ dicCode: '', dicName: '线圈' }];
                        break;
                    case "REPDEVTYPE07":
                        // this.currentInfo.type = '';
                        this.typeList = [{ dicCode: '', dicName: '微波' }];
                        break;
                    case "REPDEVTYPE08":
                        this.getDicInfo('LEDTYPE').then(res => {
                            this.typeList = res.resultList;
                        });
                        break;
                    case "REPDEVTYPE12":
                        // this.currentInfo.type = '';
                        this.typeList = [{ dicCode: '', dicName: '视频检测' }];
                        break;
                    case "REPDEVTYPE23":

                        break;
                    case "REPDEVTYPE21":

                        break;
                    case "REPDEVTYPE22":

                        break;
                };
                // switch(this.devTypeCode){
                //     case ''
                // };
                this.infoVisible = true;
                this.getAssentFileFuc();
            },
            getAssentFileFuc() {
                let host = this.$config.efoms_HOST;
                let method = this.$config.getAssentFileInfoList_GET;
                let cate = this.devTypeCode.split('REPDEVTYPE')[1];
                cate = parseInt(cate) > 20 ? 'ss' : '';
                let obj = {
                    devId: this.currentInfo.id,
                    devTypeCode: this.devTypeCode,
                    devCategoryCode: Common.getDevCategory(cate).code
                };
                this.imgFileList = [];
                if (!this.currentInfo.id) {
                    return;
                }
                this.$api.getMethod(host, method, obj, this.token).then(res => {
                        if (res.appCode == 0) {
                            this.fileList = res.resultList;

                            let arr = [];
                            res.resultList.map(i => {
                                if (/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(i.FileName)) {
                                    arr.push(i);
                                }
                            });
                            if (arr.length > 3) {
                                this.imgFileList = arr.slice(0, 3);
                                this.imgFileOther = arr.slice(3);
                            } else {
                                this.imgFileList = arr;
                                this.imgFileOther = [];
                            }
                        } else {
                            Common.printErrorLog(host, method);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            mapMouseOver(e) {
                let potIf = e.graphic.attributes;
                let name = potIf.devName;
                if (name.length > 20) name = name.substring(0, 19) + "...";
                let str =
                    '<div style="color:#ff0000;background-color:#FFF0F5; height:20px; width:auto;border: 1px solid #000; filter:alpha(opacity=80); -moz-opacity:0.8; opacity:0.8;font-family: Microsoft YaHei;font-size:13px;">' +
                    name +
                    "<div>";
                console.log(e.graphic.geometry.x, e.graphic.geometry.y);
                _map.creatInfoSymbol(
                    "bayonet_layer_set",
                    str, {
                        x: e.graphic.geometry.x,
                        y: e.graphic.geometry.y,
                        spatialReference: e.graphic.geometry.spatialReference
                    },
                    15,
                    -7
                );
            },
            mapMouseOut() {
                _map.destroyInfoSymbol("bayonet_layer_set");
            },
            showLayer(obj) {
                this.layerSelect = this.layerSelect != obj.layer.id ? obj.layer.id : "";
                this.devTypeCode = this.devTypeCode != obj.devTypeCode ? obj.devTypeCode : "";
                this.searchCond = '';
                if (this.devTypeCode == 'REPDEVTYPE02') {
                    this.searchCond = 'drainage';
                } else if (this.devTypeCode == 'REPDEVTYPE03' || this.devTypeCode == 'REPDEVTYPE04') {
                    this.searchCond = 'scene';
                }
                this.searchCond += ',geographic,years';
                this.layerList.map(val => {
                    _map.setLayerVisibleById(val.layer.id, false);
                });
                if (this.layerSelect) {
                    _map.setLayerVisibleById(this.layerSelect, true);

                }
                if (this.layerSelect != this.$config.dev22) {
                    _map.setLayerVisibleById(this.$config.dev21, true);
                }
            },
            repair() {
                this.$emit("repair");
            },
            checkAnother(type) {
                this.$emit("another", type);
            },
            test() {
                /**
                 *地图取点，通过点击地图获取地图上某位置的坐标值
                 * map.getPoint(callback, symbol);
                 *callback：回调函数，取点结束返回坐标值
                 *symbol：在取点位置绘制的图表样式，如symbol为空则不绘制图表
                 **/
                let _this = this;
                _map.getPoint(function(e) {
                    console.log(e)
                    _this.currentInfo.longitude = e.x.toFixed(6);
                    _this.currentInfo.latitude = e.y.toFixed(6);
                    _this.addPoint({ x: e.x.toFixed(6), y: e.y.toFixed(6) });
                });
            },
            initMap(arr) {
                var _this = this;
                let _layer = "自定义地图";
                _map = new EJMap("mapLocation", {
                    zoom: 12,
                    // toolbar: true, // 是否显示常用工具组件
                    // zoomSlider: true, // 缩放控件
                    // scalebar: true, // 比例尺控件
                    // navigationbar: true, // 是否显示鱼骨
                    config: this.$config.mapConfigAssets
                });
                // 地图加载完成
                _map.addEventListener(EJMap.Event.onLayerAdded, function(e) {
                    if (e.layer.id == 'layer100' || e.layer.id == 'layer200' || e.layer.id == 'person' || e.layer.id == _this.$config.devBX || e.layer.id == _this.$config.devHL || e.layer.id == "道路面背景") {
                        e.layer.maxScale = true;
                    }
                    _map.setLayerVisibleById(_this.$config.dev21, true);
                    if (!e.layer.maxScale) {
                        console.log(e);
                        if (e.layer.id == _this.$config.dev01) {
                            e.sort = 1;
                            e.bgImg = _this.$config.mapImages_HOST + 'enjoyor/images/OperLayerBar/signal.png';
                            e.devTypeCode = "REPDEVTYPE01";
                        } else if (e.layer.id == _this.$config.dev02) {
                            e.sort = 2;
                            e.bgImg = _this.$config.mapImages_HOST + 'enjoyor/images/OperLayerBar/twsp.png';
                            e.devTypeCode = "REPDEVTYPE02";
                        } else if (e.layer.id == _this.$config.dev03) {
                            e.sort = 3;
                            e.bgImg = _this.$config.mapImages_HOST + 'enjoyor/images/OperLayerBar/jjkk.png';
                            e.devTypeCode = "REPDEVTYPE03";
                        } else if (e.layer.id == _this.$config.dev04) {
                            e.sort = 4;
                            e.bgImg = _this.$config.mapImages_HOST + 'enjoyor/images/OperLayerBar/twkk.png';
                            e.devTypeCode = "REPDEVTYPE04";
                        } else if (e.layer.id == _this.$config.dev05) {
                            e.sort = 5;
                            e.bgImg = _this.$config.mapImages_HOST + 'enjoyor/images/symbols/symbol/xqjx.png';
                            e.devTypeCode = "REPDEVTYPE05";
                        } else if (e.layer.id == _this.$config.dev06) {
                            e.sort = 6;
                            e.bgImg = _this.$config.mapImages_HOST + 'enjoyor/images/symbols/symbol/sfz.png';
                            e.devTypeCode = "REPDEVTYPE06";
                        } else if (e.layer.id == _this.$config.dev07) {
                            e.sort = 7;
                            e.bgImg = _this.$config.mapImages_HOST + 'enjoyor/images/symbols/symbol/wbjc.png';
                            e.devTypeCode = "REPDEVTYPE07";
                        } else if (e.layer.id == _this.$config.dev08) {
                            e.sort = 8;
                            e.bgImg = _this.$config.mapImages_HOST + 'enjoyor/images/symbols/symbol/lwp.png';
                            e.devTypeCode = "REPDEVTYPE08";
                        } else if (e.layer.id == _this.$config.dev12) {
                            e.sort = 12;
                            e.bgImg = _this.$config.mapImages_HOST + 'enjoyor/images/OperLayerBar/twkk.png';
                            e.devTypeCode = "REPDEVTYPE12";
                        } else if (e.layer.id == _this.$config.dev21) {
                            e.sort = 22;
                            e.bgImg = _this.$config.mapImages_HOST + 'enjoyor/images/OperLayerBar/jtyd/jtgz.png';
                            e.devTypeCode = "REPDEVTYPE21";
                        } else if (e.layer.id == _this.$config.dev22) {
                            e.sort = 23;
                            e.bgImg = _this.$config.mapImages_HOST + 'enjoyor/images/OperLayerBar/jtyd/dlsg.png';
                            e.devTypeCode = "REPDEVTYPE22";
                        } else if (e.layer.id == _this.$config.dev23) {
                            e.sort = 21;
                            e.bgImg = _this.$config.mapImages_HOST + 'enjoyor/images/symbols/symbol/bzbp.png';
                            e.devTypeCode = "REPDEVTYPE23";
                        }
                        let target = arr.filter(val => {
                            return e.devTypeCode == val.DEV_TYPE_CODE;
                        });
                        e.devNum = target.length > 0 ? target[0].DEVSUM : '';
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
                    // console.log(e);
                    if (e.graphic.attributes.ID || e.graphic.attributes.FACILITY_ID) {
                        _this.pointDetail(e.graphic.attributes);
                    }
                });
                this.isHaveMap = true;
            },
            compare(property) {
                return function(a, b) {
                    var value1 = a[property];
                    var value2 = b[property];
                    return value1 - value2;
                }
            },
            addPoint(val, type) {
                _map.clearLayerById("person");
                let imgUrl = type == '-1' ? '-1.png' : '0.png';
                _map.addPoint2GraphicsLayer({
                    geom: {
                        "x": val.x || val.lon,
                        "y": val.y || val.lat,
                        "spatialReference": { "wkid": 4326 }
                    },
                    symbol: {
                        "url": host_script_url + "enjoyor/images/OperLayerBar/locat/" + imgUrl,
                        "height": 18,
                        "width": 15,
                        "type": "esriPMS",
                        "xoffset": 0,
                        "yoffset": 15
                    },
                }, "person", false);
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

                    this.addPoint(geoXY, '-1');
                    _open = window.open(
                        `${this.$config.mapSceneUrl}?x=${geoXY.x}&y=${geoXY.y}`,
                        "newwindow",
                        "top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no"
                    );
                    var loop = setInterval(function() {
                        if (_open.closed) {
                            clearInterval(loop);
                            console.log('colse');
                            _map.clearLayerById("person");
                        }
                    }, 1000);
                }
                this.showScene = false;
            },
            imgLarge() {
                // this.imgFiles = [];
                // if (this.imgShowUrl) {
                //     this.imgFiles.push(this.imgShowUrl);
                //     setTimeout(() => {
                //         document.getElementById("imgId").click();
                //     }, 300);
                // }
            },
            moreCond() {
                this.$refs.search.searchPoperVisible = true;
            },
            // 数据字典
            getDicInfo(parentCode) {
                return this.$api.getMethod(this.$config.ubms_HOST, this.$config.getDeviceDic_GET, { token: this.token, data: JSON.stringify({ parentCode: parentCode }) });
            },
            // 数据字典(2)
            getDicInfoOther() {
                return this.$api.getMethod(this.$config.efoms_HOST, '/efoms-rest/CheckReport/getSelectValue', { devTypeCode: this.devType }, this.token);
            },
            // 数据字典（3）
            getDicInfoTaf(parentCode) {
                return this.$api.getMethod(this.$config.ubms_HOST, '/ubms-server/TrafficDic/getTrafficDic.htm', { token: this.token, data: JSON.stringify({ parentCode: parentCode }) });
            },
            gotoList() {
                window.history.back();
            },
            goDetail() {
                let pageHost = this.$config.efoms_HOST;
                let isDev = !(this.devTypeCode.indexOf('REPDEVTYPE2') > -1);
                let pageMethods = '';
                let obj = {};
                if (isDev) {
                    obj.DevId = this.currentInfo.id;
                    pageMethods = this.$config.selectAssetDevicePage_GET;
                } else {
                    obj.facilityId = this.currentInfo.id;
                    obj.facilityTypeCode = this.devTypeCode;
                    pageMethods = this.$config.selectFacilitySimpleInfoPage_GET;
                }
                this.$api
                    .getMethod(pageHost, pageMethods, obj, this.token)
                    .then(res => {
                        if (res.appCode == 0) {
                            let url = '';
                            if (isDev) {
                                url = this.$config.ProjectName + "/tfdet.html?token=" + this.token;
                                sessionStorage.setItem('tfDetailInfo', JSON.stringify(res.resultList.result[0]));
                            } else {
                                url = this.$config.ProjectName + "/tffacdet.html?token=" + this.token;
                                sessionStorage.setItem('tffacDetailInfo', JSON.stringify(res.resultList.result[0]));
                            }
                            sessionStorage.setItem('indexIframe', url);
                            window.open(this.$config.ProjectName + "/index.html?token=" + this.token);
                            // window.location.href = url;
                        }
                    });
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "./assets.less";

    .map-left {
        /deep/ .as-search-content .input-with-search {
            width: 300px !important;
            box-sizing: border-box;
        }
    }

    .ej-content .ej-content-main .ej-content-right .m-map {
        height: 100% !important;
    }
</style>
<style lang="less">
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
</style>