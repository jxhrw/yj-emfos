<template>
    <div class="ej-content">
        <Layout @repair="devRepair" @another="checkAnother" :isRepaired="isRepaired">
            <h2 slot="pageTitle">巡检-信号机</h2>
            <Search slot="search" @searchAsk="selectRepairsInfoPage" devType="REPDEVTYPE01"></Search>
            <template slot="leftTitle">
                <h3>查询结果</h3>
                <label @click="exportDev" style="color:#8989ef;margin-left:15px;">
                    导出
                </label>
                <label for @click="reFreshCheckResultFuc" style="color:#8989ef;">
                    巡检重置
                    <span v-popover:popover>?</span>
                </label>
                <el-popover ref="popover" placement="right" width="160" trigger="hover" content="重置后巡检状态将清空！"></el-popover>
            </template>
            <div class="result-stas" slot="resultScreen">
                <ul class="result-stas-look">
                    <li>结果总数：<span>{{countInfo.checkSum || 0}}</span></li>
                    <!-- <li>
                        人工巡检：
                        <span class="can-clk" :class="{'active': onSite=='isChecked'}" @click="siteFuc('isChecked')">已巡检{{countInfo.newIsCheckedCount}}</span>
                        <span class="can-clk" :class="{'active': onSite=='noChecked'}" @click="siteFuc('noChecked')">未巡检{{countInfo.newNoCheckedCount}}</span>
                    </li> -->
                    <li>
                        报修数量：
                        <span class="can-clk" :class="{'active': onSite=='isRepaired'}" style="padding: 0 10px;" @click="siteFuc('isRepaired')">{{countInfo.isRepaired||0}}</span>
                    </li>
                    <!-- <li class="au-width">
                        <el-checkbox v-model="checked" @change="checkFuc">只看未巡检</el-checkbox>
                    </li> -->
                </ul>
                <ul class="result-stas-btns">
                    <li>
                        网络状态：
                        <span :class="{'active':searchFlag.indexOf('netTrue')>-1}" @click="flagFuc('netTrue','net')">在线{{countInfo.netZC}}</span>
                        <span :class="{'active':searchFlag.indexOf('netFalse')>-1}" @click="flagFuc('netFalse','net')">离线{{countInfo.netYC}}</span>
                        <span :class="{'active':searchFlag.indexOf('netOther')>-1}" @click="flagFuc('netOther','net')">未知{{countInfo.netOther}}</span>
                    </li>
                    <li>
                        报警数量：
                        <span :class="{'active':searchFlag.indexOf('warnTrue')>-1}" @click="flagFuc('warnTrue','warn')">严重{{countInfo.warnYZ}}</span>
                        <span :class="{'active':searchFlag.indexOf('warnFalse')>-1}" @click="flagFuc('warnFalse','warn')">一般{{countInfo.warnYB}}</span>
                        <span :class="{'active':searchFlag.indexOf('warnOther')>-1}" @click="flagFuc('warnOther','warn')">其他{{countInfo.warnOther}}</span>
                    </li>
                </ul>
            </div>
            <div class="left-table" slot="leftTable">
                <el-table :highlight-current-row="false" :data="tableData" stripe border class="content-table" @current-change="currentSelect" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column fixed label="" width="50">
                        <template slot-scope="scope">
                            <i class="el-icon-success m-select-line" v-show="currentInfo && scope.row.devId == currentInfo.devId"></i>
                        </template>
                    </el-table-column>
                    <el-table-column label="名称" show-overflow-tooltip min-width="160">
                        <template slot-scope="scope">
                            <p class="gesture class-status" :class="scope.row.wranLevelCode || 'DEVWRANLEVEL03'">{{scope.row.devName}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="IP" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.devIp||'-'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="isPingConnect" label="网络状态">
                        <template slot-scope="scope">
                            <p v-if="String(scope.row.isPingConnect)=='true'" class="device-status icon-normal">在线</p>
                            <p v-else-if="String(scope.row.isPingConnect)=='false'" class="device-status icon-abnormal">离线</p>
                            <p v-else>-</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="自检时间" show-overflow-tooltip min-width="120">
                        <template slot-scope="scope">
                            <p>{{scope.row.updateTime|timeNoSecond}}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="leftPage" class="box-page-left">
                <Paging ref="tableList" id="managePage" :totalCount="totalCount" :totalPage="totalPage" :queryConditions="queryConditions" @pageAsk="searchTable"></Paging>
            </div>

            <template slot="rightTabs">
                <el-tabs v-model="activeTab" class="right-tabs" type="card" @tab-click="tabHandleClick">
                    <el-tab-pane label="实时灯态" name="second"></el-tab-pane>
                    <el-tab-pane label="实时视频" name="third"></el-tab-pane>
                    <el-tab-pane label="报警记录" name="fourth"></el-tab-pane>
                </el-tabs>
                <div v-show="activeTab=='second'" class="right-scroll">
                    <div class="box-datas">
                        <div class="show-img-box">
                            <iframe :src="xhVideoUrl" frameborder="0" class="img-static" :class="{'another': signVU}" id="abc"></iframe>
                        </div>
                        <el-scrollbar class="ej-content-scrollbar fx-height"></el-scrollbar>
                    </div>
                </div>
                <div v-show="activeTab=='third'" class="right-scroll right-video">
                    <div class="box-video">
                        <VideoPlay ref="video" class="m-video"></VideoPlay>
                        <el-scrollbar class="ej-content-scrollbar fx-height">
                            <ul>
                                <li v-for="(item,index) in videoList" :key="index" @dblclick="play(item,index)" :class="{'active':videoIndex==index}" :title="item.videoName">{{item.videoName}}</li>
                            </ul>
                        </el-scrollbar>
                    </div>
                </div>
                <el-scrollbar v-show="activeTab=='fourth'" class="right-scroll ej-content-scrollbar" v-loading="isWarnLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <div class="box-warn">
                        <el-table :highlight-current-row="false" :data="warnData" stripe border class="content-table">
                            <el-table-column type="index" label="序号"></el-table-column>
                            <el-table-column prop="wranContent" label="报警信息" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span :style="String(scope.row.isRecover) == 'false'?'color:#fb6849':''">{{scope.row.wranContent}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="wranLevelName" label="等级" show-overflow-tooltip width='60'></el-table-column>
                            <el-table-column prop="wranTime" label="报警时间" show-overflow-tooltip></el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
            </template>
            <template slot="rightBase">
                <el-scrollbar class="right-scroll ej-content-scrollbar base-scroll">
                    <ul class="box-base">
                        <li class="mx-width">
                            <label>名称</label>
                            <span :title="currentInfo.devName||''">{{currentInfo.devName||'--'}}</span>
                        </li>
                        <li>
                            <label>编号</label>
                            <span :title="currentInfo.devId||''">{{currentInfo.devId||'--'}}</span>
                        </li>
                        <li>
                            <label>设备类型</label>
                            <span>{{'行人请求式'}}</span>
                        </li>
                        <li>
                            <label>管理部门</label>
                            <span :title="currentInfo.devDeptName||''">{{currentInfo.devDeptName||'--'}}</span>
                        </li>
                        <li>
                            <label>IP</label>
                            <span :title="currentInfo.devIp||''">{{currentInfo.devIp||'--'}}</span>
                        </li>
                        <li>
                            <label>所属区域</label>
                            <span>{{currentInfo.devAreaName||'--'}}</span>
                        </li>
                        <li>
                            <label>所属道路</label>
                            <span>{{currentInfo.aaa||'----'}}</span>
                        </li>
                        <li>
                            <label>生产厂家</label>
                            <span :title="currentInfo.devFactory|sceneCtoN('factorysList')">{{currentInfo.devFactory|sceneCtoN('factorysList')}}</span>
                        </li>
                        <li>
                            <label>建设单位</label>
                            <span :title="currentInfo.company|sceneCtoN('buildssList')">{{currentInfo.company|sceneCtoN('buildssList')}}</span>
                        </li>
                        <li>
                            <label>建设项目</label>
                            <span :title="currentInfo.project|sceneCtoN('projectssList')">{{currentInfo.project|sceneCtoN('projectssList')}}</span>
                        </li>
                        <li>
                            <label>启用日期</label>
                            <span>{{currentInfo.aaa||'----'}}</span>
                        </li>
                        <li>
                            <label>运维单位</label>
                            <span :title="currentInfo.oppmDept|sceneCtoN('oppmDeptList')">{{currentInfo.oppmDept|sceneCtoN('oppmDeptList')}}</span>
                        </li>
                        <li>
                            <label>品牌</label>
                            <span>{{currentInfo.devBrand||'--'}}</span>
                        </li>
                        <li>
                            <label>型号</label>
                            <span>{{currentInfo.devModel||'--'}}</span>
                        </li>
                        <li>
                            <label>使用状态</label>
                            <span>{{currentInfo.repStatusName||'--'}}</span>
                        </li>
                        <!-- <li>
                            <label>人工巡检</label>
                            <span>{{currentInfo.checkResultName||'--'}}</span>
                        </li> -->
                        <li>
                            <label>最近巡检</label>
                            <span :title="currentInfo.lastCheckTime||''">{{currentInfo.lastCheckTime||'--'}}</span>
                        </li>
                    </ul>
                </el-scrollbar>
            </template>
        </Layout>

        <el-dialog title="报修" :visible.sync="repairVisible" width='400px' :modal="false">
            <DialogRepair id="insdjRp" :devInfo="currentInfo" ref="dialogRepair"></DialogRepair>
        </el-dialog>
    </div>

</template>
<script>
    import Layout from "./layout";
    import Search from "./search";
    import Paging from "components/common/paging_new";
    import VideoPlay from 'components/common/videoPlay';
    import DialogRepair from "components/common/dialog-repair";
    import Bus from "@/assets/js/bus.js";
    import Common from "@/assets/js/common.js";
    import Request from "@/assets/js/request.js";
    export default {
        components: {
            Layout,
            Search,
            Paging,
            VideoPlay,
            DialogRepair
        },
        filters: {
            timeNoSecond: function(value) {
                if (value) {
                    return Common.dateFormat('yyyy-MM-dd hh:mm', new Date(value));
                } else {
                    return '-';
                }
            },
            sceneCtoN(val, data) {
                let arr = window[data] || [];
                let str = '';
                let kv = arr.filter(item => (val != null && (item.dicCode == val || item.id == val))) || [];
                if (kv.length > 0) {
                    str = kv[0].dicName || kv[0].text;
                }
                return str || val || '--';
            }
        },
        data() {
            return {
                token: '',
                checked: false,
                countInfo: {},
                countInfoOld: {},
                onSite: '',
                searchFlag: '',
                isTableLoading: false,
                tableData: [],
                totalCount: 0,
                totalPage: 1,
                index: -1,
                isChangeCur: true, // index变化时是否请求当前设备信息
                isPrev: false, // 是否点上一个往前翻页
                currentInfo: {},
                queryConditions: {

                },
                imgLoading: false,
                activeTab: 'second',
                datasList: [],
                datasInfo: {},
                datasIndex: 0,
                videoList: [],
                videoIndex: 0,
                isWarnLoading: false,
                warnData: [],
                repairVisible: false,
                xhVideoUrl: '',
                signVU: false,
                isRepaired: false, //是否已报修
            };
        },
        created() {},
        mounted() {
            this.token = Common.getQueryString("token");
            this.selectRepairsInfoPage();
            this.initDt();
            Bus.$on("repair-insdjRp", value => {
                this.repairVisible = false;
                if (value) {
                    // 给个向前的标识index不会更改
                    this.isPrev = true;
                    this.searchTable();
                    this.getCheckCount();
                }
            });
        },
        watch: {
            index(val) {
                if (this.tableData.length > 0 && this.index >= 0 && this.isChangeCur) {
                    this.currentInfo = this.tableData[this.index] || {};
                }
            },
            tableData(val) {
                if (this.tableData.length > 0 && this.index >= 0) {
                    this.currentInfo = this.tableData[this.index] || {};
                }
            },
            currentInfo(val) {
                if (val) {
                    this.signVU = this.$config.signVideoUrl.indexOf('192.168.104.104') > -1;
                    this.xhVideoUrl = this.$config.signVideoUrl + val.videoPlayId;
                    // this.getPageVehSearFuc(val.devId);
                    this.getVideoList();
                    this.getWarnInfoFuc();
                    if (val.repStatusCode == 'DEVREPSTATUS01' || val.repStatusCode == 'DEVREPSTATUS02') {
                        this.isRepaired = true;
                    } else {
                        this.isRepaired = false;
                    }
                    // this.devRepeatCheck(val.devId, val.devTypeCode);
                }
            },
            activeTab(val) {
                if (val == 'third' && this.videoList.length > 0) {
                    let _this = this;
                    this.$nextTick(() => {
                        // setTimeout(() => {
                        this.play(this.videoList[this.videoIndex], this.videoIndex);
                        // }, 1000);
                    });
                }
            },
            datasInfo(val) {
                let newImg = new Image();
                newImg.src = val.pic_url1;
                this.imgLoading = true;
                newImg.onerror = () => { // 图片加载错误时的替换图片
                    this.imgLoading = false;
                }
                newImg.onload = () => { // 图片加载成功后把地址给原来的img
                    this.imgLoading = false;
                }
            }
        },
        methods: {
            exportDev() {
                let host = this.$config.efoms_HOST;
                let method = '/efoms-rest/export/exportNewChecckDeviceInfo';
                let obj = JSON.parse(JSON.stringify(this.queryConditions));
                this.$api.getMethod(host, method, obj, this.token).then(res => {
                        if (res.path) {
                            window.open(res.path + '&token=' + this.token);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            selectRepairsInfoPage(obj) {
                obj = obj || {};
                this.searchFlag = '';
                this.checked = false;
                this.onSite = '';
                let pageSize = this.queryConditions.pageSize || 10;
                this.queryConditions = {
                    devTypeCode: 'REPDEVTYPE01',
                    pageSize: pageSize,
                    currentPage: 1,
                    key: obj.key || '',
                    devScene: obj.devScene || '',
                    manDeptId: obj.manDeptId || '',
                    areaId: obj.areaId || '',
                    roadId: obj.roadId || '',
                    factory: obj.factory || '',
                    company: obj.company || '',
                    project: obj.project || '',
                    oppmDept: obj.oppmDept || '',
                    devStatus: obj.devStatus || ''
                };
                this.searchTable();
                this.getCheckCount();
            },
            checkAnother(type) {
                let pageSize = this.$refs.tableList.zjPageSize;
                let totalCount = this.$refs.tableList.zjTotalCount;
                let totalPage = Math.ceil(totalCount / pageSize);
                if (type == "prev") {
                    if (this.queryConditions.currentPage <= 1 && this.index <= 0) {
                        this.$message('前面没有了');
                    } else if (this.index > 0) {
                        this.index--;
                    } else {
                        this.isChangeCur = false;
                        // 当前index改变currentInfo不用变化，等表格数据返回
                        setTimeout(() => {
                            this.isChangeCur = true;
                        }, 500);
                        this.index = pageSize - 1;
                        this.isPrev = true;
                        this.queryConditions.currentPage--;
                        this.$refs.tableList.zjCurrentPage = this.queryConditions.currentPage;
                        this.searchTable();
                    }
                } else {
                    if (this.queryConditions.currentPage >= totalPage && this.index >= this.tableData.length - 1) {
                        this.$message('后面没有了');
                    } else if (this.index < pageSize - 1) {
                        this.index++;
                    } else {
                        this.isChangeCur = false;
                        // 当前index改变currentInfo不用变化，等表格数据返回
                        setTimeout(() => {
                            this.isChangeCur = true;
                        }, 500);
                        this.index = 0;
                        this.queryConditions.currentPage++;
                        this.$refs.tableList.zjCurrentPage = this.queryConditions.currentPage;
                        this.searchTable();
                    }
                }
            },
            checkFuc(val) {
                this.queryConditions.isChecked = val ? 'noChecked' : '';
                this.searchTable();
            },
            flagFuc(flag, kind) {
                let list = this.searchFlag != "" ? this.searchFlag.split(",") : [];
                let arr = list.filter(val => val == flag).length;
                let isTong = list.filter(val => val.indexOf(kind) > -1).length;
                if (arr > 0) {
                    list = list.filter(val => val != flag); // 存在相同项只过滤（必存在同类别）
                } else if (isTong > 0) {
                    list = list.filter(val => val.indexOf(kind) == -1); //只存在同类别项过滤并增加
                    list.push(flag);
                } else {
                    list.push(flag); //没有相同项且没有同类别项
                }
                this.searchFlag = list.join(",");
                this.queryConditions.searchFlag = this.searchFlag;
                this.queryConditions.currentPage = 1;
                this.$refs.tableList.zjCurrentPage = 1;
                this.searchTable();
            },
            siteFuc(site) {
                this.onSite = this.onSite == site ? '' : site;
                this.queryConditions.isChecked = this.onSite;
                this.queryConditions.currentPage = 1;
                this.$refs.tableList.zjCurrentPage = 1;
                this.searchTable();
            },
            getCheckCount() {
                let pageHost = this.$config.efoms_HOST;
                let pageMethods = '/efoms-rest/checkDevice/getNewCheckCount';
                let obj = JSON.parse(JSON.stringify(this.queryConditions));
                delete obj.pageSize;
                delete obj.currentPage;
                this.$api.getMethod(pageHost, pageMethods, obj, this.token).then(res => {
                        if (res.appCode == 0) {
                            this.countInfo = res.resultList || {};
                        } else {
                            Common.printErrorLog(pageHost, pageMethods);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            searchTable(isPrev) {
                let pageHost = this.$config.efoms_HOST;
                let pageMethods = '/efoms-rest/checkDevice/getNewCheckPage';
                this.isTableLoading = true;
                this.$api.getMethod(pageHost, pageMethods, this.queryConditions, this.token).then(res => {
                        setTimeout((load) => {
                            this.isTableLoading = false;
                        }, 500);
                        if (res.appCode == 0) {
                            this.tableData = res.resultList.result;
                            this.totalPage = res.resultList.totalPage;
                            this.totalCount = res.resultList.totalCount;

                            if (!this.isPrev) {
                                this.index = 0;
                                if (isPrev == "-1") {
                                    this.index = this.queryConditions.pageSize;
                                }
                            } else {
                                this.isPrev = false;
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
            // 巡检重置
            reFreshCheckResultFuc() {
                this.$confirm('此操作将重置巡检状态, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Request.reFreshCheckResultFuc(this.queryConditions.devTypeCode, () => {
                        this.queryConditions.currentPage = 1;
                        this.$refs.tableList.zjCurrentPage = 1;
                        this.selectRepairsInfoPage();
                    });
                }).catch(() => {});
            },
            // 过车数据
            getPageVehSearFuc(id) {
                let host = this.$config.efoms_HOST;
                let method = this.$config.getPageVehSear_GET;
                let queryConditions = {
                    bayonetId: id,
                    token: this.token,
                    pageSize: 20,
                    currentPage: 1
                };
                this.datasList = [];
                this.datasInfo = {};
                this.$api.getMethod(host, method, queryConditions, this.token)
                    .then(res => {
                        if (res.appCode == 0) {
                            this.datasList = res.resultList || [];
                            this.datasIndex = 0;
                            this.datasInfo = this.datasList && this.datasList.length > 0 ? this.datasList[0] : {};
                        } else {
                            Common.printErrorLog(host, method);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(host, method);
                        console.log(err);
                    });
            },
            // 视频数据
            getVideoList() {
                let host = this.$config.efoms_HOST;
                let method = this.$config.getVideoDeviceRltInfo_GET;
                let obj = {
                    devTypeCode: this.currentInfo.devTypeCode,
                    devId: this.currentInfo.devId
                };
                this.videoList = [];
                this.$api.getMethod(host, method, obj, this.token)
                    .then(res => {
                        if (res.appCode == 0) {
                            this.videoList = res.resultList || [];
                            if (this.videoList.length > 0) {
                                this.videoIndex = 0;
                                this.play(this.videoList[0], 0);
                            } else {
                                this.videoIndex = 0;
                                this.videoList = [];
                                this.play();
                                // this.videoList = [{
                                //     manageId: '20016',
                                //     videoName: '测试1'
                                // }];
                            }
                        } else {
                            Common.printErrorLog(host, method);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(host, method);
                        console.log(err);
                    });
            },
            // 报警信息列表
            getWarnInfoFuc() {
                let pageHost = this.$config.efoms_HOST;
                let pageMethods = this.$config.getDeviceWranInfoPage_GET;
                let day = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
                let today1 = Common.dateFormat('yyyy-MM-dd', new Date(day));
                let today2 = Common.dateFormat('yyyy-MM-dd', new Date());
                let queryWarn = {
                    pageSize: 100,
                    currentPage: 1,
                    // wranStartTime: today1 + ' 00:00:00',
                    // wranEndTime: today2 + ' 23:59:59',
                    devTypeCode: this.currentInfo.devTypeCode,
                    devId: this.currentInfo.devId,
                    devName: this.currentInfo.devName,
                };
                this.isWarnLoading = true;
                this.warnData = [];
                this.$api
                    .getMethod(pageHost, pageMethods, queryWarn, this.token)
                    .then(res => {
                        setTimeout((load) => {
                            this.isWarnLoading = false;
                        }, 500);
                        if (res.appCode == 0) {
                            this.warnData = res.resultList.result;
                        } else {
                            Common.printErrorLog(pageHost, pageMethods);
                        }
                    })
                    .catch(err => {
                        setTimeout((load) => {
                            this.isWarnLoading = false;
                        }, 500);
                        Common.printErrorLog(pageHost, pageMethods);
                        console.log(err);
                    });
            },
            chooseItem(index) {
                this.datasIndex = index;
                this.datasInfo = this.datasList[index];
            },
            // 报修
            devRepair() {
                if (!this.currentInfo.devId) {
                    this.$message('未选中设备');
                    return;
                }
                this.repairVisible = true;
                this.$nextTick(() => {
                    this.$refs.dialogRepair.selectFault = "";
                    this.$refs.dialogRepair.faultDesc = "";
                });
            },
            tabHandleClick() {},
            currentSelect(currentRow) {
                this.index = this.tableData.indexOf(currentRow || this.currentInfo);
            },
            initDt() {
                let videoUrl = this.$config.webservice_url;
                let videoUsername = this.$config.webservice_user;
                let videoPassword = this.$config.webservice_pwd;
                let streamIp = this.$config.stream_ip;
                let streamPort = this.$config.stream_port;
                this.$refs.video.init('allViedo', videoUrl, videoUsername, videoPassword, streamIp, streamPort);
                // if ((this.videoInfo.name || this.videoListData.length > 0) && this.$refs.video && !this.$refs.video.sControl) {
                // }
            },
            // 播放
            play(videoInfo, index) {
                if (videoInfo && videoInfo.manageId) {
                    this.videoIndex = index || 0;
                    let manageId = videoInfo.manageId;
                    // this.$refs.video.StartPlayById(20016, null, 'test');
                    this.$refs.video.StartPlayById(manageId, null, 'test');
                } else {
                    this.$refs.video.StartPlayById('100', null, 'test');
                }
            },
            devRepeatCheck(devId, devTypeCode) {
                this.$api.get(`${this.$config.efoms_HOST}/efoms-rest/repairs/devRepeatCheck`, { devId: devId, devTypeCode: devTypeCode }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 2103) {
                            this.isRepaired = true;
                        } else {
                            this.isRepaired = false;
                        }
                    })
                    .catch(err => {
                        this.isRepaired = false;
                        console.log(err);
                    });
            },
        }
    };
</script>
<style lang="less" scoped>
    @import "./ins.less";

    .show-img-box {
        overflow: hidden;

        .img-static {
            width: 830px;
            height: 400px;
            transform: scale(0.71, 0.71);
            position: absolute;
            left: -119px;
            top: -57px;

            &.another {
                height: 635px;
                transform: scale(0.45, 0.43);
                left: -238px;
                top: -209px;
            }
        }
    }
</style>
<style scoped>
    @import "../../assets/css/table.css";
    @import "../../assets/css/dialog.css";
</style>
<style>
    @import "../../assets/css/tableHeight.css";
</style>