<template>
    <div class="base-info life-repair">
        <div class="content">
            <el-row class="content-row-select">
                <el-select v-model="months" placeholder="请选择" size='mini' class="content-select">
                    <el-option v-for="item in monthList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                    </el-option>
                </el-select>
            </el-row>
            <el-row class="content-row-select content-graph">
                <el-col :span="5">
                    <div class="box-pie">
                        <h6>故障类型分布</h6>
                        <div class="box-echart-pie">
                            <label>{{faultNum}}</label>
                            <div id="pieEchartRepair" class="pieEchart"></div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="17">
                    <div class="box-line" >
                        <div class="box-echart-line">
                            <label>故障时长</label>
                            <div id="lineEchartRepair" class="lineEchart"></div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="2">
                    <div class="box-statistics">
                        <div class="box-statistics-float">
                            <div>
                                <p class="num">{{grandTotal}}</p>
                                <p>累计故障天数</p>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row class="content-row-select">
                <el-date-picker v-model="searchTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size='mini' class="content-date">
                </el-date-picker>
                <el-input v-model="workId" placeholder="工单编号" size='mini' class="content-select" clearable></el-input>
                <el-select v-model="selectFaultType" placeholder="故障类型" size='mini' class="content-select" clearable>
                    <el-option v-for="item in faultTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                    </el-option>
                </el-select>
                <!-- <el-input v-model="faultDesc" placeholder="故障描述" size='mini' class="content-select" clearable></el-input> -->
                <div class="life-search" @click="searchTable">确定</div>
            </el-row>
        </div>
        <div class="content life-table">
        <el-table highlight-current-row :data="tableData" stripe border class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
          <el-table-column label="时间" prop="repDate" show-overflow-tooltip></el-table-column>
          <el-table-column label="工单编号" prop="workordersId" show-overflow-tooltip></el-table-column>
          <el-table-column label="故障类型" prop="failureTypeName" show-overflow-tooltip></el-table-column>
          <el-table-column label="故障描述" prop="failureDescrible" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作人" prop="repPersonName" show-overflow-tooltip></el-table-column>
        </el-table>
        <EJ-Paging ref="tableList" id="lifeRepair" :totalCount="totalCount" :totalPage="totalPage" :queryConditions="queryConditions" :hostName="pageHost" :methodsName="pageMethods"></EJ-Paging>
    </div>
    </div>
</template>
<script>
import Common from "@/assets/js/common.js";
import Bus from "@/assets/js/bus.js";
import Request from "@/assets/js/request.js";
import Paging from "components/common/paging";
// 引入 ECharts 主模块
let echarts = require('echarts/lib/echarts');
// 引入折线图
require('echarts/lib/chart/line');
// 引入饼图
require("echarts/lib/chart/pie");
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入组件
require('echarts/lib/component/tooltip');
require("echarts/lib/component/legendScroll");
let lineOption = {
    tooltip: {
        trigger: 'axis',
        enterable: true,
        formatter: "故障时长: {c}天",
        axisPointer: {
            type: 'line'
        },
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    grid: {
        top: 20,
        bottom: 20,
        left: 50,
        right: 30
    },
    xAxis: {
        name: '月',
        nameTextStyle: {
            color: '#C8CBD4',
            padding: [27, 0, 0, 0]
        },
        type: 'category',
        boundaryGap: false,
        data: [],
        axisLine: {show: false},
        axisTick: {show: false},
        axisLabel: {
            color: '#C8CBD4'
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        axisLine: {show: false},
        axisTick: {show: false},
        min: 0,
        max: 31,
        axisLabel: {
            formatter: function (value, index) {
                let txt = '';
                if (value == 0) {
                    txt = '0';
                }
                if (value == 31) {
                    txt = '31天';
                }
                return txt;
            },
            padding: [0, 30, 0, 0],
            color: '#C8CBD4',
            align: 'center'
        },
        splitNumber: 2,
        splitLine: {
            show: true,
            interval: function (value, index) {
                console.log(value, index);
                return value == 0;
            },
            lineStyle: {
                color: ['#f6f6f6']
            }
        }
    },
    series: [
        {
            name: '故障时长',
            type: 'line',
            smooth: false,
            symbol: 'emptyCircle',
            symbolSize: 5,
            showSymbol: false,
            itemStyle: {
                color: '#097bf5'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#6BA1EB'
                }, {
                    offset: 1,
                    color: '#fff'
                }])
            },
            data: []
        }
    ]
};
let pieOption = {
    tooltip: {
        trigger: 'item',
        formatter: function(params, ticket, callback) {
            let name = params.data.name;
            let value = params.data.value;
            if (name == "暂无故障") {
                return "<h6 style='color: #9492AC;'>" + name + "</h6>";
            } else {
                return "<h6 style='color: #9492AC;'>" + name + "</h6>" + value + " 次";
            }
        },
        backgroundColor: '#FCFDFE',
        padding: [8, 30, 8, 10],
        extraCssText: 'box-shadow: 0 3px 7px -1px rgba(123,123,144,0.29);border-radius: 2px;',
        textStyle: {
            fontSize: 12,
            color: '#5E646E'
        },
        position: function (point, params, dom, rect, size) {
            return [point[0] - size.viewSize[0], point[1] + 20];
        }
    },
    grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    series: [
        {
            name: '故障类型分布',
            type: 'pie',
            radius: ['70%', '90%'],
            avoidLabelOverlap: false,
            hoverOffset: 5,
            label: {
                normal: {
                    show: false
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: []
        }
    ]
};
export default {
    components: {
      "EJ-Paging": Paging
    },
    props: ["contentInfo"],
    data() {
        return {
            isTableLoading: false,
            tableData: [],
            totalCount: 0,
            totalPage: 1,
            token: '',
            faultNum: 0,
            grandTotal: 0,
            months: '12',
            monthList: [{dicCode: '12', dicName: '近一年'}],
            searchTime: '',
            workId: '',
            selectFaultType: '',
            faultTypeList: [],
            faultDesc: '',
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
        this.pageHost = this.$config.efoms_HOST;
        this.pageMethods = '/workorders/getWorkordersInfoPage';
        this.getLifeRepair();
        // 故障类型
        this.getDicInfo(this.contentInfo.facilityTypeCode).then(res => {
            if (res.appCode == 0) { this.faultTypeList = res.resultList; }
        });
        Bus.$on("page-lifeRepair", value => {
            this.tableData = value;
        });
        Bus.$on("page-loading-lifeRepair", value => {
      this.isTableLoading = value;
    });
        this.createPieChart();
        // this.createLineChart();// 测试用
    },
    watch: {
        months(newVal, oldVal) {
            this.createPieChart();
            this.createLineChart();
        }
    },
    methods: {
        // 生成折线图
        createLineChart() {
            var date = [];
            var data = [];
            let host = this.$config.efoms_HOST;
            let method = '/AssetInfo/getDevFaultLine';
            let time = sessionStorage.getItem("serviceTime");
            let monthOrDay = "";
            let beginTime = "";
            let endTime = "";
            if (this.months == "12") {
                monthOrDay = parseInt(Common.dateFormat('MM', new Date(parseInt(time))));
                let year = parseInt(Common.dateFormat('yyyy', new Date(parseInt(time))));
                let month = parseInt(Common.dateFormat('MM', new Date(parseInt(time))));
                if (month == 12) { year += 1; month = 0; }
                beginTime = (year - 1) + "-" + (month + 1) + "-01";
                endTime = (year) + "-" + (month + 1) + "-01";
                for (let i = 0; i < 12; i++) {
                    date.push((monthOrDay + i + 1) % 12 || 12);
                    data.push(0);
                }
            } else {
                // monthOrDay = Common.dateFormat('dd', new Date(parseInt(time)));
            }
            lineOption.xAxis.data = date;
            let obj = {
                beginTime: beginTime,
                endTime: endTime,
                assentId: this.contentInfo.facilityId,
                typeCode: this.contentInfo.facilityTypeCode
            };
            this.$api.getMethod(host, method, obj, this.token)
            .then(res => {
                if (res.appCode == 0) {
                    let num = 0;
                    res.resultList.map((i) => {
                        let arr = i.COLLECT_TIME.split("-");
                        let key = parseInt(arr[arr.length - 1]);
                        let index = date.indexOf(key);
                        data[index] = i.COUNT;
                        num += parseInt(data[index]);
                    });
                    this.grandTotal = num;
                    lineOption.series[0].data = data;
                    let myChart = echarts.init(document.getElementById('lineEchartRepair'));
                    myChart.setOption(lineOption);
                } else {
                Common.printErrorLog(host, method);
                }
            })
            .catch(err => {
                Common.printErrorLog(host, method);
                console.log(err);
            });
            // myChart.resize();
        },
        // 生成饼图
        createPieChart() {
            let host = this.$config.efoms_HOST;
            let method = '/AssetInfo/getDevFaultPie';
            let time = sessionStorage.getItem("serviceTime");
            let beginTime = "";
            let endTime = "";
            if (this.months == "12") {
                let year = parseInt(Common.dateFormat('yyyy', new Date(parseInt(time))));
                let month = parseInt(Common.dateFormat('MM', new Date(parseInt(time))));
                if (month == 12) { year += 1; month = 0; }
                beginTime = (year - 1) + "-" + (month + 1) + "-01";
                endTime = (year) + "-" + (month + 1) + "-01";
            } else {

            }
            let obj = {
                beginTime: beginTime,
                endTime: endTime,
                assentId: this.contentInfo.facilityId,
                typeCode: this.contentInfo.facilityTypeCode
            };
            this.$api.getMethod(host, method, obj, this.token)
            .then(res => {
                if (res.appCode == 0) {
                    let num = 0;
                    let data = [];
                    data = res.resultList.map((i) => {
                        num += parseInt(i.COUNT);
                        return {value: parseInt(i.COUNT), name: i.FAILURE_TYPE_NAME};
                    });
                    this.faultNum = num;
                    pieOption.series[0].data = data.length > 0 ? data : [{value: 1, name: "暂无故障"}];
                    let myChart = echarts.init(document.getElementById('pieEchartRepair'));
                    myChart.setOption(pieOption);
                } else {
                Common.printErrorLog(host, method);
                }
            })
            .catch(err => {
                Common.printErrorLog(host, method);
                console.log(err);
            });
        },
        searchTable() {
            this.queryConditions.pageSize = this.$refs.tableList.zjPageSize;
            this.$refs.tableList.zjCurrentPage = 1;
            this.getLifeRepair();
        },
        getLifeRepair() {
            let startTime = '';
            let endTime = '';
            if (this.searchTime) {
                startTime = Common.dateFormat('yyyy-MM-dd hh:mm:ss', this.searchTime[0]);
                endTime = Common.dateFormat('yyyy-MM-dd hh:mm:ss', this.searchTime[1]);
            }
            this.queryConditions.devId = this.contentInfo.facilityId;
            this.queryConditions.workordersId = this.workId;
            this.queryConditions.repStartDate = startTime;
            this.queryConditions.repEndDate = endTime;
            this.queryConditions.failureTypeCode = this.selectFaultType;
            this.queryConditions.failureDescrible = this.faultDesc;
            this.isTableLoading = true;
            this.$api.getMethod(this.pageHost, this.pageMethods, this.queryConditions, this.token)
            .then(res => {
                setTimeout((load) => {
            this.isTableLoading = false;
          }, 500);
            if (res.appCode == 0) {
                this.tableData = res.resultList.result;
                this.totalPage = res.resultList.totalPage;
                this.totalCount = res.resultList.totalCount;
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
            return this.$api.getMethod(this.$config.ubms_HOST, '/DeviceDic/getDeviceDic.htm', {token: this.token, data: JSON.stringify({parentCode: parentCode})});
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
