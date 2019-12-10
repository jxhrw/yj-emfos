<template>
  <div class="base-info">
    <div class="tabs">
      <div class="tabs-before"></div>
      <div class="other-tabs" :class="{active:showNum==1}" @click="showNum=1">
        <span class="tabs-name">报修审核</span>
        <span class="tabs-count">待审核(99)</span>
      </div>
      <div class="other-tabs" :class="{active:showNum==2}" @click="showNum=2">
        <span>维修工单</span>
        <span>待确认（99）</span>
      </div>
      <div class="other-tabs" :class="{active:showNum==3}" @click="showNum=3">
        <span>无效工单</span>
      </div>
      <div class="tabs-after"></div>
    </div>
    <div class="content">
      <el-row class="content-row-select">
        <div class="quick-query">
          <label for="">催办提醒</label>
          <span>1</span>
        </div>
        <div class="quick-query">
          <label for="">逾期工单</label>
          <span>1</span>
        </div>
        <div class="quick-query active">
          <label for="">延期申请</label>
          <span>1</span>
        </div>
        <div class="quick-query">
          <label for="">退回重修</label>
          <span>1</span>
        </div>
      </el-row>
      <el-row class="content-row-select">
        <el-col :span="7">
          <label>名称</label>
          <el-input v-model="devName" placeholder="设备名称/设备编号" size='mini' class="content-select" clearable></el-input>
        </el-col>
        <el-col :span="7">
          <label>设备类型</label>
          <el-select v-model="selectDevType" placeholder="请选择" size='mini' class="content-select" clearable>
            <el-option v-for="item in devTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <label>所属辖区</label>
          <el-select v-model="selectRegion" placeholder="请选择" size='mini' class="content-select" clearable>
            <el-option v-for="item in regionList" :key="item.regionId" :label="item.regionName" :value="item.regionId">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="content-row-select  content-row-foot">
        <el-col :span="7">
          <label>报修单位</label>
          <el-select v-model="selectDept" placeholder="请选择" size='mini' class="content-select" clearable>
            <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <label>报修时间</label>
          <el-date-picker v-model="repairDate" type="daterange" range-separator="-" start-placeholder="开始日期"
            end-placeholder="结束日期" size='mini' class="content-date">
          </el-date-picker>
        </el-col>
        <el-col :span="7">
          <label>报修状态</label>
          <el-select v-model="selectRepairStatus" placeholder="请选择" size='mini' class="content-select" clearable>
            <el-option v-for="item in repairStatusList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <div class="content-search" @click="searchTable">
            <p>查询</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import Bus from "@/assets/js/bus.js";
  import Common from "@/assets/js/common.js";
  export default {
    data() {
      return {
        title: "基本信息",
        showNum: 1,
        token: '',
        repairStatusList: [],
        selectRepairStatus: '',
        devTypeList: [],
        selectDevType: '',
        regionList: [],
        selectRegion: '',
        repairDate: '',
        devName: '',
        deptList: [],
        selectDept: ''
      };
    },
    watch: {
      showNum(newVal, oldVal) {
        Bus.$emit("showNum", newVal); // 传输表格查询条件
      }
    },
    mounted() {
      this.token = Common.getQueryString("token");
      this.getDicInfo('REPAIRSTATUS').then(res => {
        if (res.appCode == 0) {
          this.repairStatusList = res.resultList;
        }
      });
      this.getDicInfo('REPDEVCATEGORY01').then(res => {
        if (res.appCode == 0) {
          this.devTypeList = res.resultList;
        }
      });
      this.getRegionInfo('610000').then(res => {
        if (res.appCode == 0) {
          this.regionList = res.resultList;
        }
      });
      this.getDeptInfo('610100000000').then(res => {
        if (res.appCode == 0) {
          this.deptList = res.resultList;
        }
      });
    },
    methods: {
      getDicInfo(parentCode) {
        var url =
          this.$config.ubms_HOST + this.$config.getDeviceDic_GET;
        var header = {
          "Content-Type": "application/x-www-form-urlencoded"
        };
        return this.$api.get(url, {
          token: this.token,
          data: JSON.stringify({
            parentCode: parentCode
          })
        }, header);
      },
      getRegionInfo(parentCode) {
        var url =
          this.$config.ubms_HOST + this.$config.getRegionInfo_GET;
        var header = {
          "Content-Type": "application/x-www-form-urlencoded"
        };
        return this.$api.get(url, {
          token: this.token,
          data: JSON.stringify({
            parentCode: parentCode
          })
        }, header);
      },
      getDeptInfo(parentCode) {
        var url =
          this.$config.ubms_HOST + this.$config.getDeptInfo_GET;
        var header = {
          "Content-Type": "application/x-www-form-urlencoded"
        };
        return this.$api.get(url, {
          token: this.token,
          data: JSON.stringify({
            parentCode: parentCode
          })
        }, header);
      },
      searchTable() {
        var startTime = '';
        var endTime = '';
        if (this.repairDate) {
          startTime = this.dateFormat('yyyy-MM-dd hh:mm:ss', this.repairDate[0]);
          endTime = this.dateFormat('yyyy-MM-dd hh:mm:ss', this.repairDate[1]);
        }
        Bus.$emit("queryConditions", {
          repStatusCode: this.selectRepairStatus,
          devTypeCode: this.selectDevType,
          devAreaCode: this.selectRegion,
          key: this.devName,
          repDeptIds: this.selectDept ? JSON.stringify([this.selectDept]) : JSON.stringify([]),
          startTime: startTime,
          endTime: endTime
        }); // 传输表格查询条件
      }
    }
  };

</script>
<style scoped>
  .base-info {
    margin: 14px 14px 10px 14px;
    background: #FFFFFF;
  }

  .base-info .tabs {
    height: 34px;
    display: flex;
  }

  .base-info .tabs div {
    width: 236px;
    height: 34px;
    background: #f9fafc;
    float: left;
    text-align: center;
    cursor: pointer;
  }

  .base-info .tabs div span {
    display: inline-block;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    color: #758087;
  }

  .base-info .tabs .tabs-before {
    width: 65px;
    border-bottom: 1px solid #E4EAEE;
  }

  .base-info .tabs .other-tabs {
    border-bottom: 1px solid #E4EAEE;
  }

  .base-info .tabs .other-tabs.active {
    border: 1px solid #E4EAEE;
    border-bottom: 0px;
    background: #FFFFFF;
  }

  .base-info .tabs .other-tabs.active .tabs-name {
    color: #22262E;
    margin-right: 16px;
  }

  .base-info .tabs .other-tabs.active .tabs-count {
    color: #E58600;
  }

  .base-info .tabs .tabs-after {
    flex: 1;
    border-bottom: 1px solid #E4EAEE;
  }

  .base-info .title {
    height: 36px;
    border-bottom: 1px solid #EBEFF1;
    margin: 0 58px 0 40px;
  }

  .base-info .title::before {
    content: '';
    position: relative;
    left: -41px;
    top: 10px;
    border-left: 2px solid #00C187;
  }

  .base-info .title h3 {
    font-size: 14px;
    color: #22262E;
    line-height: 0px;
    border-top: 0px;
  }

  .base-info .content {
    padding-top: 5px;
    padding-left: 40px;
    border: 1px solid #E4EAEE;
    border-radius: 2px;
    border-top: 0px;
  }

  .base-info .content .content-row-select {
    margin-top: 10px;
  }

  .base-info .content .content-row-select .quick-query {
    background: #FDF6EC;
    border: 1px solid #FBF0DF;
    border-radius: 11px;
    width: 105px;
    height: 22px;
    display: inline-block;
    margin-right: 20px;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
  }

  .base-info .content .content-row-select .quick-query.active {
    background: #ECA848;
  }

  .base-info .content .content-row-select .quick-query.active label {
    color: #FFFFFF;
  }

  .base-info .content .content-row-select .quick-query.active span {
    color: #FFFFFF;
  }

  .base-info .content .content-row-select .quick-query label {
    color: #E58600;
    display: inline-block;
    width: 48px;
    font-size: 12px;
    cursor: pointer;
  }

  .base-info .content .content-row-select .quick-query span {
    color: #E58600;
    display: inline-block;
    font-size: 12px;
  }

  .base-info .content .content-row-select.content-row-foot {
    margin-bottom: 40px;
  }

  .base-info .content .content-row-explain {
    font-size: 12px;
    line-height: 12px;
    margin-bottom: 25px;
  }

  .base-info .content label {
    color: #4F5A64;
    display: inline-block;
    width: 48px;
    font-size: 12px;
    margin-right: 12px;
    text-align: right;
  }

  .base-info .content span {
    font-size: 12px;
    color: #737E84;
  }

  .base-info .content .content-select {
    width: 300px;
  }

  .base-info .content .content-date {
    width: 300px;
    background: #F9FAFC;
    border-radius: 0;
    border: 1px solid #E1E7ED;
  }

  .base-info .content .content-search {
    background: #00C187;
    border-radius: 1px;
    width: 80px;
    height: 28px;
    text-align: center;
    line-height: 28px;
    cursor: pointer;
  }

  .base-info .content .content-search p {
    font-size: 12px;
    color: #FFFFFF;
  }

  @media screen and (max-width:1366px) {
    .base-info .content .content-select {
      width: 220px;
    }

    .base-info .content .content-date {
      width: 220px;
    }
  }

</style>
<style>
  .base-info .content .content-date .el-range-input {
    background: #F9FAFC;
  }

  .base-info .content .content-select .el-input__inner {
    border-radius: 0;
    background: #F9FAFC;
    border: 1px solid #E1E7ED;
  }

  .base-info .content .content-select .el-input__suffix {
    border-left: 1px solid #E1E7ED;
  }

</style>
