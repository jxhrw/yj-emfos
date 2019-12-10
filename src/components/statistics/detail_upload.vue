<template>
    <div class="ej-main">
        <EJ-Menu></EJ-Menu>
        <div class="ej-content">
            <div class="ej-content-title">
                <h2>卡口数据上传监测详情</h2>
                <div>
                    <div class="btn-title btn-back" @click="goBack">返回</div>
                </div>
            </div>
            <div class="ej-content-main">
                <el-scrollbar class="ej-content-scrollbar">
                    <div class="base-info">
                        <div class="content">
                            <div class="content-row-select el-row">
                                <div class="quick-query c-warning" :class="{'active':relation}">
                                    <label>{{queryShow.regionShow}}</label>
                                </div>
                                <div class="quick-query c-warning" :class="{'active':relation}">
                                    <label>{{queryShow.typeShow}}</label>
                                </div>
                                <div class="quick-query btn" @click="relation=!relation">
                                    <label>{{relation?'忽略':'关联'}}前置条件</label>
                                </div>
                            </div>
                            <el-row class="content-row-select">
                                <el-col :span="7">
                                    <label>卡口名称</label>
                                    <el-input v-model="offsiteNames" placeholder="卡口名称" size='mini' class="content-select" @focus='visible=true'></el-input>
                                </el-col>
                                <el-col :span="14" class="radio-select">
                                    <label>接收时间</label>
                                    <el-radio v-model="typeTime" label="0">全部</el-radio>
                                    <el-radio v-model="typeTime" label="1">今日</el-radio>
                                    <el-radio v-model="typeTime" label="2">除今日</el-radio>
                                    <el-radio v-model="typeTime" label="3">自定义</el-radio>
                                    <el-date-picker v-model="patrolTime" :disabled="typeTime!=3" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size='mini' class="content-date">
                                    </el-date-picker>
                                </el-col>
                                <el-col :span="3">
                                    <div class="relative">
                                        <div class="content-search" @click="searchTableReset">
                                            <p>查询</p>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <!-- <EJ-Depiction></EJ-Depiction> -->
                    <div class="depiction-info">
                        <div class="title">
                            <h3> </h3>
                            <!-- <div class="r-float m-checkbox">
                                <el-checkbox v-model="showFurure">超前量显示</el-checkbox>
                            </div>
                            <div class="r-float m-checkbox">
                                <el-checkbox v-model="showPerc">同比环比显示</el-checkbox>
                            </div> -->
                            <div class="btn-title btn-execl" @click="exportExcel">导出</div>
                        </div>
                        <div class="content">
                            <el-table :highlight-current-row='false' :data="tableData" stripe border class="content-table" @current-change="currentSelect" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                                <el-table-column label="区域" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        {{scope.row.REGIONNAME || scope.row.REGION_ID}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="卡口名称" show-overflow-tooltip min-width="150">
                                    <template slot-scope="scope">
                                        <p class="color-blue">
                                            <a @click="goGeta(scope.row)">{{scope.row.BAYONETNAME || scope.row.BAYONET_ID}}</a>
                                        </p>
                                    </template>
                                </el-table-column>
                                <el-table-column label="最新过车时间" show-overflow-tooltip min-width="110">
                                    <template slot-scope="scope">
                                        {{scope.row.NEWEST_PASS_TIME|dateShow}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="最新接收时间" show-overflow-tooltip min-width="110">
                                    <template slot-scope="scope">
                                        {{scope.row.NEWEST_RECEIVE_TIME|dateShow}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="最新上传时间" show-overflow-tooltip min-width="110">
                                    <template slot-scope="scope">
                                        {{scope.row.NEWEST_UPLOAD_TIME|dateShow}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="RECEIVE_TIME" label="接收耗时(秒)" show-overflow-tooltip min-width="90"></el-table-column>
                                <el-table-column prop="UPLOAD_TIME" label="上传耗时" show-overflow-tooltip min-width="80"></el-table-column>
                                <el-table-column prop="UPLOAD_NUM" label="今日上传量" show-overflow-tooltip min-width="90"></el-table-column>
                                <el-table-column prop="UPLOAD_ERROR_NUM" label="今日上传错误量" show-overflow-tooltip min-width="110"></el-table-column>
                                <el-table-column prop="LATE_NUM" label="今日延时上传量" show-overflow-tooltip min-width="110"></el-table-column>
                                <el-table-column label="平均延时时间" show-overflow-tooltip min-width="100">
                                    <template slot-scope="scope">
                                        {{scope.row.AVG_TIME|fixedNum}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="NEWEST_ERROR_CONTENT" label="错误信息" show-overflow-tooltip min-width="150"></el-table-column>
                                <el-table-column label="错误时间" show-overflow-tooltip min-width="110">
                                    <template slot-scope="scope">
                                        {{scope.row.NEWEST_ERROR_TIME|dateShow}}
                                    </template>
                                </el-table-column>
                            </el-table>
                            <EJ-Paging ref="tableList" id="managePage" :totalCount="totalCount" :totalPage="totalPage" :queryConditions="queryConditions" @pageAsk="searchTable"></EJ-Paging>
                        </div>
                    </div>

                    <div class="depiction-info" v-if="false && selectInfo.BAYONET_ID" v-loading="islineLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                        <div class="title ns-title">
                            <h3 style="color: #23525A;">今日流量 &nbsp;&nbsp;&nbsp; {{selectInfo.BAYONETNAME || selectInfo.BAYONET_ID}}</h3>
                        </div>
                        <!-- <el-select v-model="lineTime" placeholder="请选择" size="mini" class="content-select chart-select">
                            <el-option label="时间选择" value=""></el-option>
                            <el-option label="当天" value="0"></el-option>
                            <el-option label="近30天" value="30"></el-option>
                        </el-select> -->
                        <div class="content no-pad">
                            <chart class="barCharts" :options="linedevice" :auto-resize="true" v-if="linedevice.series[0].data.length > 0"></chart>
                            <empty class="barCharts" v-show="linedevice.series[0].data.length===0"></empty>
                        </div>
                    </div>

                    <el-dialog title="请选择检测点位" :visible.sync="visible" width='520px' class="dialog-urge" :modal="false">
                        <mselectTree @close="closeOffsite"></mselectTree>
                    </el-dialog>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>
<script>
    import Menu from "components/common/menu";
    import Common from "@/assets/js/common.js";
    import Bus from "@/assets/js/bus.js";
    import Request from "@/assets/js/request.js";
    import Paging from "components/common/paging_new";
    import echarts from 'echarts';
    import mselectTree from 'components/common/selectTree.vue'
    import empty from "components/common/empty";
    import { lineChartOption } from "@/assets/js/echartsConfig.js";
    export default {
        filters: {
            percent(val, param) {
                let t = 0;
                t = (((val || 0) / param) * 10).toFixed(0) / 10;
                return `(${t}%)`;
            },
            timeDisparity(val, param) {
                let a = new Date(val).getTime();
                let b = new Date(param).getTime();
                return (a - b) / 1000
            },
            dateShow(val) {
                if (parseInt(val)) {
                    return Common.dateFormat('yyyy-MM-dd hh:mm:ss', new Date(parseInt(val)));
                } else {
                    return val;
                }
            },
            fixedNum(val) {
                let num = val || 0;
                if (num != parseInt(num)) {
                    num = num.toFixed(2);
                }
                return num;
            }
        },
        components: {
            "EJ-Menu": Menu,
            "EJ-Paging": Paging,
            empty,
            mselectTree
        },
        data() {
            return {
                title: "数据统计",
                token: "",
                devName: '',
                typeTime: '0',
                regionList: [], // 区域
                patrolTime: '',
                isTableLoading: false,
                islineLoading: false,
                tableData: [],
                totalCount: 0,
                totalPage: 1,
                // 查询条件
                queryConditions: {},
                showPerc: false,
                showFurure: false,
                linedevice: Object.assign({},
                    JSON.parse(JSON.stringify(lineChartOption))
                ),
                lineTime: "0",
                query: {},
                queryShow: {},
                selectInfo: {},
                relation: true,
                offsiteCodes: '',
                offsiteNames: '',
                visible: false
            };
        },
        watch: {
            relation() {
                this.searchTableReset();
            },
            selectInfo(val) {
                this.chartsLine(val);
            },
            lineTime(val) {
                this.chartsLine(this.selectInfo);
            }
        },
        beforeMount() {
            this.linedevice.xAxis.data = [];
            this.linedevice.series[0].data = [];
            this.linedevice.series[0].areaStyle = {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                    [{
                            offset: 0,
                            color: "#40ebc2"
                        },
                        {
                            offset: 1,
                            color: "#ffffff"
                        }
                    ],
                    false)
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.query = this.$route.query;
            this.queryShow = {
                regionShow: `${this.query.headTypeName}：${this.query.headTypeCodeName||''}`,
                typeShow: ''
            };
            switch (this.query.type) {
                case "NORMALDEV_NUM":
                    this.queryShow.typeShow = "正常上传卡口数";
                    break;
                case "LATEDEV_NUM":
                    this.queryShow.typeShow = "延时上传卡口数";
                    break;
                case "HOUR_NUM":
                    this.queryShow.typeShow = "3小时无数据上传卡口数";
                    break;
                case "UPLOAD_ERROR_NUM":
                    this.queryShow.typeShow = "上传错误卡口数";
                    break;
                case "RECEIVE_NUM":
                    this.queryShow.typeShow = "今日接收量";
                    break;
                case "UPLOAD_NUM":
                    this.queryShow.typeShow = "今日上传量";
                    break;
                case "LATE_NUM":
                    this.queryShow.typeShow = "延时上传量";
                    break;
                default:
                    break;
            };
            this.queryConditions = {
                pageSize: 10,
                currentPage: 1
            };
            this.searchTableReset();
        },
        methods: {
            closeOffsite(data) {
                this.visible = false;
                if (data.type == '1') {
                    this.offsiteCodes = data.code || '';
                    this.offsiteNames = data.name || '';
                }
            },
            searchTableReset() {
                this.queryConditions.headType = this.relation ? this.query.headType : this.query.headType;
                this.queryConditions.headTypeCode = this.relation ? this.query.headTypeCode : this.query.headTypeCode;
                this.queryConditions.type = this.relation ? this.query.type : '';
                this.queryConditions.offsiteIds = this.offsiteCodes;
                this.queryConditions.currentPage = 1;
                this.$refs.tableList.zjCurrentPage = 1;
                let startTime = '';
                let endTime = '';
                switch (this.typeTime) {
                    case '0':
                        startTime = '';
                        endTime = '';
                        break;
                    case '1':
                        startTime = Common.dateFormat('yyyy-MM-dd', new Date()) + ' 00:00:00';
                        endTime = Common.dateFormat('yyyy-MM-dd', new Date()) + ' 23:59:59';
                        break;
                    case '2':
                        let time = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
                        startTime = '';
                        endTime = Common.dateFormat('yyyy-MM-dd', new Date(time)) + ' 23:59:59';
                        break;
                    case '3':
                        if (this.patrolTime) {
                            startTime = Common.dateFormat('yyyy-MM-dd', this.patrolTime[0]) + ' 00:00:00';
                            endTime = Common.dateFormat('yyyy-MM-dd', this.patrolTime[1]) + ' 23:59:59';
                        }
                        break;
                    default:
                        break;
                };
                this.queryConditions.startTime = startTime;
                this.queryConditions.endTime = endTime;
                this.searchTable();
            },
            searchTable() {
                this.isTableLoading = true;
                this.$api.get(
                        `${this.$config.idcs_HOST}/vehPass/pageMonitorBayonetUpload4Efoms.htm`, { token: this.token, data: JSON.stringify(this.queryConditions) },
                        null
                    )
                    .then(res => {
                        this.isTableLoading = false;
                        if (!res.resultList) return;
                        this.tableData = res.resultList.result;
                        this.totalCount = res.resultList.totalCount || 0;
                        this.currentPage = res.resultList.currentPage || 1;

                        // }
                    });
            },
            chartsLine(val) {
                if (!val.BAYONET_ID) {
                    return;
                }
                let obj = {
                    token: this.token,
                    "devId": '36040030038003' || val.BAYONET_ID,
                };
                this.islineLoading = true;
                this.$api.get(
                        `${this.$config.efoms_HOST}/otherSystem/getDevWayRealFlow`, obj,
                        null
                    )
                    .then(res => {
                        this.islineLoading = false;
                        if (res.appCode == "0") {
                            let x = [];
                            let y = [];
                            if (!res.resultList) return;
                            res.resultList.result.map(val => {
                                x.push(val.PASS_TIME);
                                y.push(val.RECEIVE_NUM);
                            });
                            this.linedevice.xAxis.data = x;
                            this.linedevice.series[0].data = y;

                            this.linedevice.series[0].showSymbol = !(res.resultList.length > 1);
                            this.linedevice.series[0].symbolSize = !(res.resultList.length > 1) ? 4 : 2;
                        }
                    });
            },
            chartsLine_bak(val) {
                if (!val.BAYONET_ID) {
                    return;
                }
                let obj = {
                    "regionId": val.REGION_ID,
                    "type": "",
                    "offsiteIds": val.BAYONET_ID,
                    "pageSize": 2000,
                    "currentPage": 1
                };
                if (this.lineTime == '0') {
                    obj.startTime = Common.dateFormat('yyyy-MM-dd', new Date()) + ' 00:00:00';
                    obj.endTime = Common.dateFormat('yyyy-MM-dd', new Date()) + ' 23:59:59';
                } else if (this.lineTime == '30') {
                    let time = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
                    obj.startTime = Common.dateFormat('yyyy-MM-dd', new Date(time)) + ' 00:00:00';
                    obj.endTime = Common.dateFormat('yyyy-MM-dd', new Date()) + ' 23:59:59';
                } else {
                    obj.startTime = '';
                    obj.endTime = '';
                }
                this.islineLoading = true;
                this.$api.get(
                        `${this.$config.idcs_HOST}/vehPass/detailBayonetReceive4Efoms.htm`, { token: this.token, data: JSON.stringify(obj) },
                        null
                    )
                    .then(res => {
                        this.islineLoading = false;
                        if (res.appCode == "0") {
                            let x = [];
                            let y = [];
                            if (!res.resultList) return;
                            res.resultList.result.map(val => {
                                x.push(val.PASS_TIME);
                                y.push(val.RECEIVE_NUM);
                            });
                            this.linedevice.xAxis.data = x;
                            this.linedevice.series[0].data = y;

                            this.linedevice.series[0].showSymbol = !(res.resultList.length > 1);
                            this.linedevice.series[0].symbolSize = !(res.resultList.length > 1) ? 4 : 2;
                        }
                    });
            },
            exportExcel() {
                let host = this.$config.efoms_HOST;
                let method = '/export/exportCheckRecordInfo';
                let obj = JSON.parse(JSON.stringify(this.queryConditions));
                this.$api
                    .getMethod(host, method, obj, this.token)
                    .then(res => {
                        window.open(res.path);
                    })
                    .catch(err => {
                        Common.printErrorLog(host, method);
                        console.log(err);
                    });
            },
            currentSelect(e) {
                console.log(e)
                this.selectInfo = e || {};
            },
            goBack() {
                window.history.back();
            },
            goGeta(row) {
                this.$router.push({
                    path: '/det_upload',
                    query: {
                        id: row.BAYONETID,
                        name: row.BAYONETNAME,
                        nums: `0,${row.UPLOAD_NUM},${row.UPLOAD_ERROR_NUM},${row.LATE_NUM}`
                    }
                });
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "../../assets/css/main.css";
    @import "../../assets/css/select.css";
    @import "../../assets/css/baseInfo.css";

    @import "../../assets/css/table.css";
    @import "../../assets/css/dialog.css";
    @import "../../assets/css/depiction.css";

    .base-info .content {
        padding-bottom: 24px;
    }

    .base-info .content-icon {
        position: absolute;
        width: 28px;
        height: 28px;
        background: url("../../assets/images/icon-arrow-double.png") no-repeat center/100%;
        cursor: pointer;
        left: -38px;
    }

    .base-info .content-icon.active {
        transform: rotate(90deg);
    }

    .relative {
        position: relative;
    }

    .gesture {
        cursor: pointer;
    }

    .r-float {
        float: right;
    }

    .m-checkbox {
        margin-left: 20px;

        /deep/ .el-checkbox__label {
            .relative;
            top: 1px;
        }
    }

    .ej-content-title {
        .btn-title {
            width: 44px;
            height: 20px;
            border-radius: 1px;
            line-height: 20px;
            text-align: center;
            margin-top: 8px;
            font-size: 12px;
            cursor: pointer;
            display: inline-block;
            margin-right: 20px;

            &:hover {
                opacity: 0.5;
            }

            &:active {
                opacity: 0.9;
            }
        }

        .btn-back {
            background: rgba(255, 255, 255, 0.09);
            border: 1px solid #4F5A64;
            color: #4F5A64;
        }
    }

    .base-info {
        .quick-query {
            width: auto !important;
            padding-left: 10px;
            cursor: auto !important;

            &.btn {
                background-color: #fff !important;
                border: none !important;
                cursor: pointer !important;

                label {
                    color: #30886D !important;
                }
            }
        }

        .radio-select {
            label {
                width: auto;
                margin-left: 0;
                margin-right: 15px;
            }
        }
    }

    .depiction-info {
        position: relative;

        &:not(:last-child) {
            margin-bottom: 0;
        }

        .ns-title {
            // border-bottom: 0;

            &::before {
                display: none;
            }
        }

        .no-pad {
            padding: 0;
            margin-top: 30px;

            .barCharts {
                width: 100%;
                height: 175px;
            }
        }

        .chart-select {
            position: absolute;
            z-index: 5;
            top: 9px;
            right: 40px;
            width: 130px;

            /deep/ .el-input__inner {
                border-radius: 0;
                height: 20px;
                line-height: 20px;
                font-size: 12px;

                &:focus {
                    border-color: #dcdfe6;
                }
            }
        }

        .color-blue a {
            color: #409eff;
            cursor: pointer;
        }
    }
</style>