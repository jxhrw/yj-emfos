<template>
    <div class="ej-main">
        <EJ-Menu></EJ-Menu>
        <div class="ej-content">
            <div class="ej-content-title">
                <h2>使用年限</h2>
            </div>
            <div class="ej-content-main">
                <el-scrollbar class="ej-content-scrollbar">
                    <div class="base-info">
                        <div class="content">
                            <el-row class="content-row-select">
                                <el-col :span="21" style="margin-top:5px;">
                                    <label style="width:auto;">状态维度：</label>
                                    <el-radio v-model="headType" label="DEPT" @change="getLabel">管理部门</el-radio>
                                    <el-radio v-model="headType" label="AREA" @change="getLabel">行政区域</el-radio>
                                    <el-radio v-model="headType" label="FACTORY" @change="getLabel">生产厂家</el-radio>
                                    <el-radio v-model="headType" label="COMPANY" @change="getLabel">建设单位</el-radio>
                                    <el-radio v-model="headType" label="PROJECT" @change="getLabel">建设项目</el-radio>

                                    <label style="margin-left:30px;">设备类型</label>
                                    <el-select v-model="selectDevType" placeholder="请选择" size='mini' class="content-select" clearable>
                                        <el-option v-for="item in devTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="3" style="margin-top:5px;">
                                    <div class="relative">
                                        <div class="content-search" @click="searchTableFirstPage">
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
                            <h3>查询结果</h3>
                            <div class="btn-title btn-execl" @click="exportExcel">导出</div>
                        </div>
                        <div class="content">
                            <el-table :highlight-current-row="false" :data="tableData" stripe border class="content-table" @current-change='currentSelect' v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                                <el-table-column type="index" label="序号"></el-table-column>
                                <el-table-column prop="NAME" :label="headTypeNameNow" show-overflow-tooltip min-width="120">
                                    <template slot-scope="scope">
                                        <p>{{scope.row.DEV_DEPT_NAME||scope.row.DEV_AREA_NAME || scope.row.DEV_FACTORY || scope.row.COMPANY || scope.row.PROJECT}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="DEV_TYPE_NAME" label="设备类型" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="DEVSUM" label="设备总数" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="YEAR01" label="使用1年以下" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="YEAR13" label="使用1-3年" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="YEAR35" label="使用3-5年" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="YEAR5T" label="使用5年以上" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="BF" label="已报废" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="WBF" label="未报废" show-overflow-tooltip></el-table-column>
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
                isTableLoading: false,
                tableData: [],
                totalCount: 0,
                totalPage: 1,
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
            searchTableFirstPage() {
                this.queryConditions.currentPage = 1;
                this.$refs.tableList.zjCurrentPage = 1;
                this.queryConditions.devTypeCode = this.selectDevType;
                this.queryConditions.searchFlag = this.headType;
                this.queryConditions.token = this.token;
                this.headTypeNameNow = this.headTypeName;
                this.searchTable();
            },
            searchTable() {
                this.isTableLoading = true;
                this.$api.get(`${this.$config.efoms_HOST}/efoms-rest/CheckReport/getDevReportForZBNX`, this.queryConditions, null).then((res) => {
                    this.isTableLoading = false;
                    if (res.appCode == '0' && res.resultList) {
                        this.tableData = res.resultList.result;
                        this.totalCount = res.resultList.totalCount || 0;
                        this.currentPage = res.resultList.currentPage || 1;
                    }
                });
            },
            exportExcel() {
                let host = this.$config.efoms_HOST;
                let method = '/efoms-rest/NewExport/exportDeviceStatusZBNX';
                let obj = JSON.parse(JSON.stringify(this.queryConditions));
                this.$api.getMethod(host, method, obj, this.token).then(res => {
                        window.open(res.path+'&token='+this.token);
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