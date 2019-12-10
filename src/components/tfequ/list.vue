<template>
    <div class="ej-main">
        <EJ-Menu></EJ-Menu>
        <div class="ej-content">
            <div class="ej-content-title">
                <h2>交通设备</h2>
            </div>
            <div class="ej-content-main">
                <el-scrollbar class="ej-content-scrollbar">
                    <div class="base-info">
                        <div class="content">
                            <el-row class="content-row-select">
                                <el-col :span="21" style="margin-top:5px;">
                                    <label style="width:auto;">维度：</label>
                                    <el-radio v-model="headType" label="DEPT" @change="getLabel">管理部门</el-radio>
                                    <el-radio v-model="headType" label="AREA" @change="getLabel">行政区域</el-radio>
                                    <label style="margin-left:30px;">名称</label>
                                    <el-input v-model="name" placeholder="" size='mini' class="content-select" clearable></el-input>
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
                            <label for="" style="color:#8989ef;margin-right: 20px;" @click="allShow=true">全部展开</label>
                            <label for="" style="color:#8989ef;margin-right: 20px;" @click="allShow=false">全部折叠</label>
                        </div>
                        <div class="content">
                            <ul v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                                <li class="table-title">
                                    <span class="au-width">名称</span>
                                    <span class="fx-width">合计</span>
                                    <span class="fx-width">信号机</span>
                                    <span class="fx-width">视频监控</span>
                                    <span class="fx-width">卡口</span>
                                    <span class="fx-width">地磁</span>
                                    <span class="fx-width">线圈</span>
                                    <span class="fx-width">操作</span>
                                </li>
                                <tree-item :listArr="tableData" :allShow="allShow"></tree-item>
                            </ul>
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
    import treeItem from './treeItem';
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
            "EJ-Paging": Paging,
            treeItem
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

                name: '',
                allShow: false
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            // this.searchTableFirstPage();
            this.tableData = [{
                    name: 1,
                    id: '1',
                    child: [{
                            name: 11,
                            id: '11',
                            child: [{
                                    name: '九江市浔阳区交通指挥中心旁边的电视台的二楼的阳台',
                                    id: '11-1'
                                },
                                {
                                    name: 112,
                                    id: '11-2'
                                }, {
                                    name: 113,
                                    id: '11-3'
                                }
                            ]
                        },
                        {
                            name: 12,
                            id: '12'
                        }, {
                            name: 13,
                            id: '13'
                        }
                    ]
                },
                {
                    name: 2,
                    id: '2',
                    child: [{
                            name: 21,
                            id: '21'
                        },
                        {
                            name: 22,
                            id: '22'
                        }, {
                            name: 23,
                            id: '23'
                        }
                    ]
                }
            ]
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
                this.$api.get(`${this.$config.efoms_HOST}/CheckReport/getDeviceStatusTJ`, this.queryConditions, null).then((res) => {
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
                let method = '/export/exportDeviceStatusTJ';
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
                return this.$api.getMethod(this.$config.ubms_HOST, '/DeviceDic/getDeviceDic.htm', {
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

    .depiction-info {
        position: relative;

        &:not(:last-child) {
            margin-bottom: 0;
        }

        .table-title {
            display: flex;
            width: 100%;
            background: #F9FAFC;
            padding: 6px 0;

            .au-width {
                flex: 1;
                min-width: 150px;
                text-align: center;
            }

            .fx-width {
                width: 10%;
                min-width: 50px;
                text-align: center;
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