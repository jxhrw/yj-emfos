<template>
    <div class="ej-content-main">
        <el-scrollbar class="ej-content-scrollbar">
            <div class="base-info">
                <div class="content">
                    <el-row class="content-row-select">
                        <el-col :span="21" style="margin-top:5px;">
                            <!-- <label style="width:auto;">上传全国缉查布控</label>
                            <label>所属区域</label>
                            <el-input v-model="selectRegion" placeholder="请选择" size='mini' class="content-select" clearable readonly v-popover:popoverSelectRegion></el-input>
                            <el-popover highlight-current popper-class="region-popper" ref="popoverSelectRegion" placement="bottom-start" trigger="click" v-model="selectRegionVisible">
                                <el-scrollbar class="region-scroll">
                                    <el-tree id="selectRegion" :data="regionList" accordion :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClick"></el-tree>
                                </el-scrollbar>
                            </el-popover> -->
                            <label style="width:auto;">表格类型：</label>
                            <el-radio v-model="headType" label="dept" @change="getLabel">管理部门</el-radio>
                            <el-radio v-model="headType" label="region" @change="getLabel">行政区域</el-radio>
                            <el-radio v-model="headType" label="factory" @change="getLabel">生产厂家</el-radio>
                            <el-radio v-model="headType" label="company" @change="getLabel">建设单位</el-radio>
                            <el-radio v-model="headType" label="project" @change="getLabel">建设项目</el-radio>
                        </el-col>
                        <el-col :span="3">
                            <div class="relative">
                                <div class="content-search" @click="searchTable">
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
                    <h3>卡口数据接收监测</h3>
                    <div class="r-float m-checkbox">
                        <el-checkbox v-model="showPerc">显示占比</el-checkbox>
                    </div>
                    <div class="btn-title btn-execl" @click="exportExcel">导出</div>
                </div>
                <div class="content">
                    <el-table :highlight-current-row="false" :data="tableData" stripe border class="content-table" @current-change='currentSelect' v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column :label="headTypeNameNow" show-overflow-tooltip min-width="120">
                            <template slot-scope="scope">
                                <p>{{scope.row.HEADNAME || scope.row.HEADCODE}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="COUNT_NUM" label="配置卡口数" show-overflow-tooltip min-width="120"></el-table-column>
                        <el-table-column label="无数据卡口数" show-overflow-tooltip min-width="120">
                            <template slot-scope="scope">
                                <p class="color-blue">
                                    <a @click="goGeta(scope.row,'INEFFECTIVE_NUM')">{{scope.row.INEFFECTIVE_NUM || 0}}</a>
                                    <span v-show="showPerc">{{scope.row.INEFFECTIVE_NUM|percent(scope.row.COUNT_NUM)}}</span>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column label="有数据卡口数" show-overflow-tooltip min-width="120">
                            <template slot-scope="scope">
                                <p class="color-blue">
                                    <a @click="goGeta(scope.row,'EFFECTIVE_NUM')">{{scope.row.EFFECTIVE_NUM || 0}}</a>
                                    <span v-show="showPerc">{{scope.row.EFFECTIVE_NUM|percent(scope.row.COUNT_NUM)}}</span>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column label="数据实时性" :class-name="barType=='real'?'':''">
                            <el-table-column label="3小时以内" :class-name="barType=='real'?'':''" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <p class="color-blue">
                                        <a @click="goGeta(scope.row,'REAL_LESS')">{{scope.row.REAL_LESS || 0}}</a>
                                        <span v-show="showPerc">{{scope.row.REAL_LESS|percent(scope.row.COUNT_NUM)}}</span>
                                    </p>
                                </template>
                            </el-table-column>
                            <el-table-column label="超过3小时" :class-name="barType=='real'?'':''" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <p class="color-blue">
                                        <a @click="goGeta(scope.row,'REAL_MIDDLE')">{{scope.row.REAL_MIDDLE || 0}}</a>
                                        <span v-show="showPerc">{{scope.row.REAL_MIDDLE|percent(scope.row.COUNT_NUM)}}</span>
                                    </p>
                                </template>
                            </el-table-column>
                            <el-table-column label="超过半天" :class-name="barType=='real'?'':''" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <p class="color-blue">
                                        <a @click="goGeta(scope.row,'REAL_MORE')">{{scope.row.REAL_MORE || 0}}</a>
                                        <span v-show="showPerc">{{scope.row.REAL_MORE|percent(scope.row.COUNT_NUM)}}</span>
                                    </p>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="今日接收数据量">
                            <el-table-column label="100以内" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <p class="color-blue">
                                        <a @click="goGeta(scope.row,'RECEIVE_LESS')">{{scope.row.RECEIVE_LESS || 0}}</a>
                                        <span v-show="showPerc">{{scope.row.RECEIVE_LESS|percent(scope.row.COUNT_NUM)}}</span>
                                    </p>
                                </template>
                            </el-table-column>
                            <el-table-column label="超过100" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <p class="color-blue">
                                        <a @click="goGeta(scope.row,'RECEIVE_MIDDLE')">{{scope.row.RECEIVE_MIDDLE || 0}}</a>
                                        <span v-show="showPerc">{{scope.row.RECEIVE_MIDDLE|percent(scope.row.COUNT_NUM)}}</span>
                                    </p>
                                </template>
                            </el-table-column>
                            <el-table-column label="超过5000" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <p class="color-blue">
                                        <a @click="goGeta(scope.row,'RECEIVE_MORE')">{{scope.row.RECEIVE_MORE || 0}}</a>
                                        <span v-show="showPerc">{{scope.row.RECEIVE_MORE|percent(scope.row.COUNT_NUM)}}</span>
                                    </p>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="今日延时情况">
                            <el-table-column label="30秒以内" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <p class="color-blue">
                                        <a @click="goGeta(scope.row,'LATE_LESS')">{{scope.row.LATE_LESS || 0}}</a>
                                        <span v-show="showPerc">{{scope.row.LATE_LESS|percent(scope.row.COUNT_NUM)}}</span>
                                    </p>
                                </template>
                            </el-table-column>
                            <el-table-column label="超过30秒" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <p class="color-blue">
                                        <a @click="goGeta(scope.row,'LATE_MIDDLE')">{{scope.row.LATE_MIDDLE || 0}}</a>
                                        <span v-show="showPerc">{{scope.row.LATE_MIDDLE|percent(scope.row.COUNT_NUM)}}</span>
                                    </p>
                                </template>
                            </el-table-column>
                            <el-table-column label="超过3分钟" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <p class="color-blue">
                                        <a @click="goGeta(scope.row,'LATE_MORE')">{{scope.row.LATE_MORE || 0}}</a>
                                        <span v-show="showPerc">{{scope.row.LATE_MORE|percent(scope.row.COUNT_NUM)}}</span>
                                    </p>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="今日超前情况">
                            <el-table-column label="30秒以内" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <p class="color-blue">
                                        <a @click="goGeta(scope.row,'FURURE_LESS')">{{scope.row.FURURE_LESS || 0}}</a>
                                        <span v-show="showPerc">{{scope.row.FURURE_LESS|percent(scope.row.COUNT_NUM)}}</span>
                                    </p>
                                </template>
                            </el-table-column>
                            <el-table-column label="超过30秒" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <p class="color-blue">
                                        <a @click="goGeta(scope.row,'FURURE_MIDDLE')">{{scope.row.FURURE_MIDDLE || 0}}</a>
                                        <span v-show="showPerc">{{scope.row.FURURE_MIDDLE|percent(scope.row.COUNT_NUM)}}</span>
                                    </p>
                                </template>
                            </el-table-column>
                            <el-table-column label="超过3分钟" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <p class="color-blue">

                                        <a @click="goGeta(scope.row,'FURURE_MORE')">{{scope.row.FURURE_MORE || 0}}</a>
                                        <span v-show="showPerc">{{scope.row.FURURE_MORE|percent(scope.row.COUNT_NUM)}}</span>
                                    </p>
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <div class="depiction-info" v-if="echatsVisable">
                <div class="title ns-title">
                    <h3>卡口数据接收统计</h3>
                </div>
                <el-select v-model="barType" placeholder="请选择" size='mini' class="content-select chart-select">
                    <el-option label="数据实时性" value="real"></el-option>
                    <el-option label="今日接收数据量" value="receive"></el-option>
                    <el-option label="今日延时情况" value="late"></el-option>
                    <el-option label="今日超前情况" value="furure"></el-option>
                </el-select>
                <div class="content no-pad">
                    <chart class="barCharts" :options="piedevice" :auto-resize="true"></chart>
                </div>
            </div>

        </el-scrollbar>
    </div>
</template>
<script>
    import Menu from "components/common/menu";
    import Common from "@/assets/js/common.js";
    import Bus from "@/assets/js/bus.js";
    import Request from "@/assets/js/request.js";
    import Paging from "components/common/paging";
    import {
        barDoubleChartOption
    } from "@/assets/js/echartsConfig.js";
    export default {
        filters: {
            percent(val, param) {
                let t = 0;
                t = ((val || 0) / param * 10).toFixed(0) / 10;
                return `(${t}%)`;
            }
        },
        components: {
            "EJ-Menu": Menu,
            "EJ-Paging": Paging
        },
        data() {
            return {
                title: "数据统计",
                token: '',
                regionList: [], // 区域
                selectRegion: '',
                selectRegionVisible: false,
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                isTableLoading: false,
                tableData: [],
                totalCount: 0,
                totalPage: 1,
                token: '',
                // 查询条件
                queryConditions: {},
                pageHost: '',
                pageMethods: '',
                showPerc: false,
                piedevice: Object.assign({}, JSON.parse(JSON.stringify(barDoubleChartOption))),
                barType: 'real',
                headType: 'dept',
                headTypeName: '管理部门',
                headTypeNameNow: '',
                echatsVisable: false
            };
        },
        watch: {
            selectRegion(newVal, oldVal) {
                if (newVal === '') {
                    this.selectRegionCode = '';
                    setTimeout(() => {
                        this.selectRegionVisible = false;
                    });
                }
            },
            barType(val) {
                this.canvesBar(val);
            }
        },
        beforeMount() {
            this.piedevice.legend.data = [];
            this.piedevice.xAxis[0].data = [];
            this.piedevice.series[0].data = [];
            this.piedevice.series[1].data = [];
            this.piedevice.series[2].data = [];
        },
        mounted() {
            this.token = Common.getQueryString("token");

            // this.getRegionTree(null).then(res => {
            //     if (res.appCode == 0) {
            //         this.regionList = res.resultList;
            //     }
            // });

            this.searchTable();
        },
        methods: {
            handleNodeClick(data, node, e) {
                let thisId = e.$parent.$parent.$parent.$attrs.id || e.$parent.$parent.$attrs.id || e.$parent.$attrs.id;
                // if (!data.children || data.children.length == 0) {
                if (data) {
                    this.selectRegion = data.text;
                    this.selectRegionCode = data.id;
                    this.selectRegionVisible = false;
                }
            },
            getRegionTree(parentCode) {
                return this.$api.getMethod(this.$config.efoms_HOST, this.$config.getRegionTree_GET, {
                    token: this.token,
                    data: JSON.stringify({
                        regionId: parentCode
                    })
                });
            },
            searchTable() {
                let obj = {
                    token: this.token,
                    data: JSON.stringify({ headType: this.headType })
                };
                this.headTypeNameNow = this.headTypeName;
                this.isTableLoading = true;
                this.$api.get(`${this.$config.idcs_HOST}/vehPass/statBayonetReceive4Efoms.htm`, obj, null).then((res) => {
                    if (res.appCode == '0') {
                        this.isTableLoading = false;
                        this.tableData = res.resultList;
                        this.canvesBar(this.barType);
                    }
                });
            },
            canvesBar(type) {
                let x = [];
                let leg = [];
                let y1 = [];
                let y2 = [];
                let y3 = [];
                this.tableData.map(val => {
                    let name = val.HEADNAME || val.HEADCODE || '未知';
                    if (name.length > 15) name = name.substring(0, 12) + '...';
                    x.push(name);
                    if (type == 'real') {
                        leg = [{ name: '3小时以内' }, { name: '超过3小时' }, { name: '超过半天' }]
                        y1.push(val.REAL_LESS);
                        y2.push(val.REAL_MIDDLE);
                        y3.push(val.REAL_MORE);
                    } else if (type == 'receive') {
                        leg = [{ name: '100以内' }, { name: '超过100' }, { name: '超过5000' }]
                        y1.push(val.RECEIVE_LESS);
                        y2.push(val.RECEIVE_MIDDLE);
                        y3.push(val.RECEIVE_MORE);
                    } else if (type == 'late') {
                        leg = [{ name: '30秒以内' }, { name: '超过30秒' }, { name: '超过3分钟' }]
                        y1.push(val.LATE_LESS);
                        y2.push(val.LATE_MIDDLE);
                        y3.push(val.LATE_MORE);
                    } else if (type == 'furure') {
                        leg = [{ name: '30秒以内' }, { name: '超过30秒' }, { name: '超过3分钟' }]
                        y1.push(val.FURURE_LESS);
                        y2.push(val.FURURE_MIDDLE);
                        y3.push(val.FURURE_MORE);
                    }
                });
                this.piedevice.xAxis[0].data = x;
                this.piedevice.legend.data = leg;
                this.piedevice.series[0].data = y1;
                this.piedevice.series[1].data = y2;
                this.piedevice.series[2].data = y3;
                this.piedevice.series[0].name = leg[0].name;
                this.piedevice.series[1].name = leg[1].name;
                this.piedevice.series[2].name = leg[2].name;

                if (x.length > 10) {
                    this.piedevice.xAxis[0].axisLabel.rotate = 8;
                } else {
                    this.piedevice.xAxis[0].axisLabel.rotate = 0;
                }

            },
            exportExcel() {
                let host = this.$config.efoms_HOST;
                let method = this.$config.exportCheckRecordInfo_GET;
                let obj = JSON.parse(JSON.stringify(this.queryConditions));
                this.$api.getMethod(host, method, obj, this.token).then(res => {
                        window.open(res.path);
                    })
                    .catch(err => {
                        Common.printErrorLog(host, method);
                        console.log(err);
                    });
            },
            getLabel(e) {
                switch (e) {
                    case 'dept':
                        this.headTypeName = '管理部门';
                        break;
                    case 'region':
                        this.headTypeName = '行政区域';
                        break;
                    case 'factory':
                        this.headTypeName = '生产厂家';
                        break;
                    case 'company':
                        this.headTypeName = '建设单位';
                        break;
                    case 'project':
                        this.headTypeName = '建设项目';
                        break;
                    default:
                        break;
                };
            },
            goGeta(item, type) {

                this.$router.push({
                    path: '/detail_receive',
                    query: {
                        headType: this.headType,
                        headTypeName: this.headTypeNameNow,
                        headTypeCode: item.HEADCODE,
                        headTypeCodeName: item.HEADNAME,
                        type: type
                    }
                })
            },
            currentSelect(e) {

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

    .ej-content-title {
        padding: 0 30px;

        /deep/ .el-tabs__item {
            &.is-active,
            &:hover {
                color: #00875F;
            }
        }

        /deep/ .el-tabs__active-bar {
            background-color: #00875F;
        }
    }

    .base-info .content {
        padding-bottom: 24px;
    }

    .base-info .content-icon {
        position: absolute;
        width: 28px;
        height: 28px;
        background: url('../../assets/images/icon-arrow-double.png') no-repeat center/100%;
        cursor: pointer;
        ;
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

    .depiction-info {
        position: relative;

        &:not(:last-child) {
            margin-bottom: 0;
        }

        .ns-title {
            border-bottom: 0;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 5;

            &::before {
                display: none;
            }
        }

        .no-pad {
            padding: 0;
            padding-top: 10px;
            // margin-top: -30px;

            .barCharts {
                width: 100%;
                height: 175px;
            }
        }

        .chart-select {
            position: absolute;
            z-index: 5;
            top: 12px;
            right: 320px;
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

        .color-blue {
            a {
                color: #409EFF;
                cursor: pointer;
            }
        }

    }
</style>