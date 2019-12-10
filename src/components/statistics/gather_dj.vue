<template>
    <div class="ej-main">
        <EJ-Menu></EJ-Menu>
        <div class="ej-content">
            <div class="ej-content-title">
                <h2>电警分析</h2>
            </div>
            <div class="ej-content-main">
                <el-scrollbar class="ej-content-scrollbar">
                    <div class="base-info">
                        <div class="content" style="padding-left: 30px;">
                            <Search slot="search" @searchAsk="searchTableFirstPage" devType=""></Search>
                        </div>
                    </div>
                    <!-- <EJ-Depiction></EJ-Depiction> -->
                    <div class="depiction-info">
                        <div class="title">
                            <h3>查询结果</h3>
                            <div class="btn-title btn-execl" @click="exportExcel">导出</div>
                        </div>
                        <div class="content">
                            <el-table :highlight-current-row="false" :data="tableData" stripe border class="content-table" @current-change='currentSelect' v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)" @sort-change="sortChange">
                                <!-- :span-method="objectSpanMethod" -->
                                <el-table-column type="index" label="序号"></el-table-column>
                                <el-table-column prop="devDeptName" label="管理部门" sortable="custom" show-overflow-tooltip min-width="120">
                                    <template slot-scope="scope">
                                        <p>{{scope.row.devDeptName}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="devName" label="设备名称" sortable="custom" show-overflow-tooltip min-width="95"></el-table-column>
                                <el-table-column prop="projectName" label="项目期数" sortable="custom" show-overflow-tooltip min-width="95"></el-table-column>
                                <el-table-column prop="snapLaneNum" label="车道数" sortable="custom" show-overflow-tooltip min-width="84"></el-table-column>
                                <el-table-column prop="isPingConnect" label="网络" sortable="custom" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <p v-if="String(scope.row.isPingConnect)=='true'" class="device-status icon-normal">在线</p>
                                        <p v-else-if="String(scope.row.isPingConnect)=='false'" class="device-status icon-abnormal">离线</p>
                                        <p v-else>-</p>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="isHaveData" label="数据" sortable="custom" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <p v-if="String(scope.row.isHaveData)=='true'" class="device-status icon-normal">有</p>
                                        <p v-else-if="String(scope.row.isHaveData)=='false'" class="device-status icon-abnormal">无</p>
                                        <p v-else>-</p>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="isDelayData" label="延时" sortable="custom" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <p v-if="String(scope.row.isDelayData)=='true'" class="device-status icon-abnormal">延迟</p>
                                        <p v-else-if="String(scope.row.isDelayData)=='false'" class="device-status icon-normal">正常</p>
                                        <p v-else>-</p>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="wranLevelName" label="报警" sortable="custom" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="duration" label="离线时长" sortable="custom" show-overflow-tooltip min-width="95">
                                    <template slot-scope="scope">
                                        {{scope.row.duration|timeShow}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="lastPassTime" label="数据时间" sortable="custom" show-overflow-tooltip min-width="95"></el-table-column>
                                <el-table-column prop="updateTime" label="检测时间" sortable="custom" show-overflow-tooltip min-width="95"></el-table-column>
                            </el-table>

                            <EJ-Paging ref="tableList" id="managePage" :totalCount="totalCount" :totalPage="totalPage" :queryConditions="queryConditions" @pageAsk="searchTable"></EJ-Paging>
                        </div>
                    </div>
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
    import Search from "../inspection/search";
    import {
        barDoubleChartOption
    } from "@/assets/js/echartsConfig.js";
    export default {
        filters: {
            percent(val, param) {
                let t = 0;
                t = ((val || 0) / param * 10).toFixed(0) / 10;
                return `(${t}%)`;
            },
            timeShow(val) {
                let str = '-';
                if (Number(val) == val) {
                    let day = parseInt(val / 24);
                    let hour = Number(val) - day * 24;
                    let minute = '';
                    str = (day ? `${day}天` : '') + (hour ? `${hour}小时` : '') + (minute ? `${minute}分钟` : '');
                    if (val == 0) {
                        str = 0;
                    }
                }
                return str;
            }
        },
        components: {
            "EJ-Menu": Menu,
            "EJ-Paging": Paging,
            Search
        },
        data() {
            return {
                title: "数据统计",
                token: '',
                isTableLoading: false,
                tableData: [],
                totalCount: 0,
                totalPage: 1,
                indexBlend: [],
                token: '',
                // 查询条件
                queryConditions: {
                    pageSize: 10,
                    currentPage: 1
                },
                headType: 'DEPT',
                headTypeName: '管理部门',
                headTypeNameNow: '',
                selectDevType: '',
                devTypeList: [], // 设备类型
                rows: 1
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.searchTableFirstPage();
            // 设备类型
            this.getDicInfo('REPDEVCATEGORY01').then(res => {
                if (res.appCode == 0) {
                    this.devTypeList = res.resultList;
                }
            });
        },
        methods: {
            sortChange(obj) {
                let key = "";
                let order = '';
                if (obj.order == "ascending") {
                    order = "asc";
                } else if (obj.order == "descending") {
                    order = "desc";
                }
                if (obj.prop) {
                    key = Common.toLine(obj.prop) + (order ? ` ${order}` : '');
                }
                this.queryConditions.orderBy = key;
                this.searchTable();
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 1) {
                    let index = this.indexBlend.indexOf(rowIndex);
                    let length = this.indexBlend.length;
                    if (index > -1) {
                        if (index + 1 >= length) {
                            return {
                                rowspan: this.tableData.length - this.indexBlend[index],
                                colspan: 1
                            };
                        } else {
                            return {
                                rowspan: this.indexBlend[index + 1] - this.indexBlend[index],
                                colspan: 1
                            };
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }

                }
            },
            searchTableFirstPage(obj) {
                obj = obj || {};
                this.queryConditions.currentPage = 1;
                this.$refs.tableList.zjCurrentPage = 1;
                this.queryConditions.devTypeCode = this.selectDevType;
                this.queryConditions.token = this.token;

                this.queryConditions.devTypeCode = "REPDEVTYPE04";
                this.queryConditions.key = obj.key || '';
                this.queryConditions.devScene = obj.devScene || '';
                this.queryConditions.manDeptId = obj.manDeptId || '';
                this.queryConditions.areaId = obj.areaId || '';
                this.queryConditions.roadId = obj.roadId || '';
                this.queryConditions.factory = obj.factory || '';
                this.queryConditions.company = obj.company || '';
                this.queryConditions.project = obj.project || '';
                this.queryConditions.oppmDept = obj.oppmDept || '';
                this.queryConditions.devStatus = obj.devStatus || '';

                this.searchTable();
            },
            searchTable() {
                var time = new Date().getTime() - 14 * 24 * 60 * 60 * 1000;
                this.queryConditions.startTime = Common.dateFormat('yyyy-MM-dd', new Date(time)) + ' 00:00:00';
                this.queryConditions.endTime = Common.dateFormat('yyyy-MM-dd', new Date()) + ' 23:59:59';
                this.queryConditions.wranTypeCode = 'DEVWRANTYPE02';
                this.isTableLoading = true;
                this.$api.get(`${this.$config.efoms_HOST}/efoms-rest/CheckReport/getCheckDeviceInfoForReport`, this.queryConditions, null).then((res) => {
                    this.isTableLoading = false;
                    if (res.appCode == '0' && res.resultList) {
                        this.tableData = res.resultList.result || [];
                        this.totalCount = res.resultList.totalCount || 0;
                        this.currentPage = res.resultList.currentPage || 1;

                        this.indexBlend = [];
                        this.tableData.forEach((item, index) => {
                            if (index == 0) {
                                this.indexBlend.push(index);
                            } else if (this.tableData[index].devDeptId != this.tableData[index - 1].devDeptId) {
                                this.indexBlend.push(index);
                            }
                        });
                        // console.log(this.indexBlend,'table合并用，已废弃');
                    }
                });
            },
            exportExcel() {
                let host = this.$config.efoms_HOST;
                let method = '/efoms-rest/export/exportCheckDeviceInfoForReport';
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
                    case 'DEPT':
                        this.headTypeName = '管理部门';
                        break;
                    case 'AREA':
                        this.headTypeName = '行政区域';
                        break;
                    case 'FACTORY':
                        this.headTypeName = '生产厂家';
                        break;
                    case 'COMPANY':
                        this.headTypeName = '建设单位';
                        break;
                    case 'PROJECT':
                        this.headTypeName = '建设项目';
                        break;
                    default:
                        break;
                };
            },
            currentSelect(e) {

            },
            // 数据字典
            getDicInfo(parentCode) {
                return this.$api.getMethod(this.$config.ubms_HOST, this.$config.getDeviceDic_GET, {
                    token: this.token,
                    data: JSON.stringify({
                        parentCode: parentCode
                    })
                });
            },
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

    .relative {
        position: relative;
    }

    .gesture {
        cursor: pointer;
    }

    .r-float {
        float: right;
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
<style>
    @import "../../assets/css/tableHeight.css";

    .ej-content-scrollbar {
        height: 100%;
    }

    .ej-content-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>