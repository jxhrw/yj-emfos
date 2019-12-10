<template>
    <div class="base-info life-information">
        <div class="content">
            <el-row class="content-row-select">
                <el-date-picker v-model="searchTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size='mini' class="content-date">
                </el-date-picker>
                <!-- <el-select v-model="selectEventType" placeholder="事件类型" size='mini' class="content-select" clearable>
                    <el-option v-for="item in eventTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                    </el-option>
                </el-select>
                <el-input v-model="detKey" placeholder="详情关键词" size='mini' class="content-select" clearable></el-input> -->
                <el-input v-model="person" placeholder="操作人" size='mini' class="content-select" clearable></el-input>
                <div class="life-search" @click="searchTable">确定</div>
            </el-row>
        </div>
        <div class="content life-table">
            <el-table highlight-current-row :data="tableData" stripe border class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                <el-table-column label="时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.logTime|dateSpecific}}
                    </template>
                </el-table-column>
                <el-table-column label="事件" prop="transTypeName" show-overflow-tooltip></el-table-column>
                <el-table-column label="事件详情" prop="content" show-overflow-tooltip min-width="160px"></el-table-column>
                <el-table-column label="操作人" prop="logUser" show-overflow-tooltip></el-table-column>
            </el-table>
            <EJ-Paging ref="tableList" id="lifeInfo" axiosType="string" :totalCount="totalCount" :totalPage="totalPage" :queryConditions="queryConditions" :hostName="pageHost" :methodsName="pageMethods"></EJ-Paging>
        </div>
    </div>
</template>
<script>
    import Common from "@/assets/js/common.js";
    import Bus from "@/assets/js/bus.js";
    import Request from "@/assets/js/request.js";
    import Paging from "components/common/paging";
    export default {
        components: {
            "EJ-Paging": Paging
        },
        props: ["contentInfo"],
        filters: {
            dateSpecific: function(value) {
                return Common.dateFormat('yyyy-MM-dd hh:mm:ss', new Date(parseInt(value)));
            }
        },
        data() {
            return {
                isTableLoading: false,
                tableData: [],
                totalCount: 0,
                totalPage: 1,
                token: '',
                searchTime: '',
                selectEventType: '',
                eventTypeList: [],
                detKey: '',
                person: '',
                queryConditions: {
                    pageSize: 10,
                    currentPage: 1
                },
                pageHost: '',
                pageMethods: ''
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            console.log(this.contentInfo);

            this.pageHost = this.$config.efoms_HOST;
            this.pageMethods = '/ubmsService/getFilesPage';
            this.getLifeInformation();
            // 事件类型
            this.getDicInfo('DBTRANSTYPE').then(res => {
                if (res.appCode == 0) {
                    this.eventTypeList = res.resultList;
                }
            });
            Bus.$on("page-lifeInfo", value => {
                this.tableData = value;
            });
            Bus.$on("page-loading-lifeInfo", value => {
                this.isTableLoading = value;
            });
        },
        methods: {
            searchTable() {
                this.queryConditions.pageSize = this.$refs.tableList.zjPageSize;
                this.$refs.tableList.zjCurrentPage = 1;
                this.getLifeInformation();
            },
            getLifeInformation() {
                let startTime = '';
                let endTime = '';
                if (this.searchTime) {
                    startTime = Common.dateFormat('yyyy-MM-dd hh:mm:ss', this.searchTime[0]);
                    endTime = Common.dateFormat('yyyy-MM-dd hh:mm:ss', this.searchTime[1]);
                }
                this.queryConditions.objectId = this.contentInfo.facilityId;
                this.queryConditions.startTime = startTime;
                this.queryConditions.endTime = endTime;
                this.queryConditions.transType = this.selectEventType;
                this.queryConditions.content = this.detKey;
                this.queryConditions.logUser = this.person;
                let obj = {
                    token: this.token,
                    data: JSON.stringify(this.queryConditions)
                };
                this.isTableLoading = true;
                this.$api.getMethod(this.pageHost, this.pageMethods, this.queryConditions, this.token)
                    .then(res => {
                        setTimeout((load) => {
                            this.isTableLoading = false;
                        }, 500);
                        if (res.appCode == 0) {
                            this.tableData = res.resultList.rows || res.resultList.result || [];
                            this.totalPage = res.resultList.totalPage;
                            this.totalCount = res.resultList.totalCount || res.resultList.total;
                        } else {
                            Common.printErrorLog(this.pageHost, this.pageMethods);
                        }
                    })
                    .catch(err => {
                        setTimeout((load) => {
                            this.isTableLoading = false;
                        }, 500);
                        Common.printErrorLog(this.pageHost, this.pageMethods);
                        console.log(err);
                    });
            },
            // 数据字典
            getDicInfo(parentCode) {
                return this.$api.getMethod(this.$config.ubms_HOST, '/DeviceDic/getDeviceDic.htm', {
                    token: this.token,
                    data: JSON.stringify({
                        parentCode: parentCode
                    })
                });
            }
        }
    };
</script>
<style scoped>
    @import "../../assets/css/select.css";
    @import "../../assets/css/table.css";
    @import "./tffacdet.css";
</style>
<style>
    @import "../../assets/css/tableHeight.css";
</style>