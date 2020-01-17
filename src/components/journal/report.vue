<template>
    <div class="ej-content-main">
        <el-scrollbar class="ej-content-scrollbar">
            <div class="base-info">
                <div class="content">
                    <el-row class="content-row-select">
                        <el-col :span="21" style="margin-top:5px;">
                            <label style="width:auto;">日志维度：</label>
                            <el-radio v-model="headType" label="DEVICE" @change="getLabel">按设备</el-radio>
                            <!-- <el-radio v-model="headType" label="company" @change="getLabel">按单位</el-radio> -->
                            <el-radio v-model="headType" label="PERSON" @change="getLabel">按人员</el-radio>

                            <label style="margin-left:30px;">设备类型</label>
                            <el-select v-model="selectDevType" placeholder="请选择" size='mini' class="content-select" clearable>
                                <el-option v-for="item in devTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="3">
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
                    <h3>日志结果</h3>
                    <div class="btn-title btn-execl" @click="exportExcel">导出</div>
                </div>
                <div class="content">
                    <el-table :highlight-current-row="false" :data="tableData" stripe border class="content-table" @current-change='currentSelect' v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column prop="DEV_TYPE_NAME" :label="headTypeNameNow" show-overflow-tooltip min-width="120"></el-table-column>
                        <el-table-column prop="DEVSUM" label="设备数量" show-overflow-tooltip min-width="120" v-if="queryConditions.searchFlag!='PERSON'"></el-table-column>
                        <el-table-column prop="XJZS" label="巡检次数" show-overflow-tooltip min-width="120"></el-table-column>
                        <el-table-column prop="ZC" label="巡检正常数" show-overflow-tooltip min-width="120"></el-table-column>
                        <el-table-column prop="ZCL" label="巡检正常率" show-overflow-tooltip min-width="120">
                            <template slot-scope="scope">
                                <p>{{scope.row.ZCL}}%</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="YC" label="巡检异常数" show-overflow-tooltip min-width="120"></el-table-column>
                        <el-table-column prop="YCL" label="巡检异常率" show-overflow-tooltip min-width="120">
                            <template slot-scope="scope">
                                <p>{{scope.row.YCL}}%</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="XJBX" label="巡检报修数" show-overflow-tooltip min-width="120"></el-table-column>
                        <el-table-column prop="XJBXL" label="巡检报修率" show-overflow-tooltip min-width="120">
                            <template slot-scope="scope">
                                <p>{{scope.row.XJBXL}}%</p>
                            </template>
                        </el-table-column>
                    </el-table>

                    <EJ-Paging ref="tableList" id="managePage" :totalCount="totalCount" :totalPage="totalPage" :queryConditions="queryConditions" @pageAsk="searchTable"></EJ-Paging>
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
                headType: 'DEVICE',
                headTypeName: '设备',
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
                this.$api.get(`${this.$config.efoms_HOST}/efoms-rest/CheckReport/selectDeviceDetailInfoPage`, this.queryConditions, null).then((res) => {
                    if (res.appCode == '0') {
                        this.isTableLoading = false;
                        this.tableData = res.resultList.result;
                        this.totalCount = res.resultList.totalCount || 0;
                        this.currentPage = res.resultList.currentPage || 1;
                    }
                });
            },
            exportExcel() {
                let host = this.$config.efoms_HOST;
                let method = '/efoms-rest/export/exportCheckReport';
                let obj = JSON.parse(JSON.stringify(this.queryConditions));
                this.$api.getMethod(host, method, obj, this.token).then(res => {
                        window.open(res.path + '&token=' + this.token);
                    })
                    .catch(err => {
                        Common.printErrorLog(host, method);
                        console.log(err);
                    });
            },
            getLabel(e) {
                switch (e) {
                    case 'DEVICE':
                        this.headTypeName = '设备';
                        break;
                    case 'PERSON':
                        this.headTypeName = '人员';
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