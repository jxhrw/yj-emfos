<template>
  <div class="base-info">
    <div class="content">
      <el-row class="content-row-select">
        <div class="quick-query" :class="{'active':lableClick==='press'}" @click="changeLableClick('press')">
          <label for="">催办提醒</label>
          <span>{{serverPUshData.ORD_MSG_PRESS}}</span>
        </div>
        <div class="quick-query" :class="{'active':lableClick==='overtime'}" @click="changeLableClick('overtime')">
          <label for="">逾期工单</label>
          <span>{{serverPUshData.ORD_MSG_OVERTIME}}</span>
        </div>
        <div class="quick-query" :class="{'active':lableClick==='postpone'}" @click="changeLableClick('postpone')">
          <label for="">延期申请</label>
          <span>{{serverPUshData.ORD_MSG_POSTPONE}}</span>
        </div>
        <div class="quick-query" :class="{'active':lableClick==='isreject'}" @click="changeLableClick('isreject')">
          <label for="">退回重修</label>
          <span>{{serverPUshData.ORD_MSG_ISREJECT}}</span>
        </div>
      </el-row>
      <el-row class="content-row-select">
        <el-col :span="7">
          <label>关键字</label>
          <el-input v-model="key" placeholder="设备名称/设备编号" size='mini' class="content-select" clearable></el-input>
        </el-col>
        <el-col :span="7">
          <label>工单时间</label>
          <el-date-picker v-model="repairDate" type="daterange" range-separator="-" start-placeholder="开始日期"
            end-placeholder="结束日期" size='mini' class="content-date">
          </el-date-picker>
        </el-col>
        <el-col :span="7">
          <label>工单状态</label>
          <el-select v-model="selectWorkordersStatus" placeholder="请选择" size='mini' class="content-select" clearable>
            <el-option v-for="item in workordersStatusList" :key="item.dicCode" :label="item.dicName"
              :value="item.dicCode">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <div class="relative">
            <div class="content-icon" :class="{'active':conditionVisible}"
              @click="conditionVisible = !conditionVisible"></div>
            <div class="content-search" @click="searchTable">
              <p>查询</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-show="conditionVisible" class="content-row-select">
        <el-col :span="7">
          <label>工单编号</label>
          <el-input v-model="workordersId" placeholder="请输入" size='mini' class="content-select" clearable></el-input>
        </el-col>
        <el-col :span="7">
          <label>所属辖区</label>
          <el-input v-model="selectRegion" placeholder="请选择" size='mini' class="content-select" clearable readonly
            v-popover:popoverSelectRegion></el-input>
          <el-popover highlight-current popper-class="region-popper" ref="popoverSelectRegion" placement="bottom-start"
            trigger="click" v-model="selectRegionVisible">
            <el-scrollbar class="region-scroll">
              <el-tree id="selectRegion" :data="regionList" accordion :props="defaultProps"
                :expand-on-click-node="false" @node-click="handleNodeClickRegion"></el-tree>
            </el-scrollbar>
          </el-popover>
        </el-col>
        <el-col :span="7">
          <label>管理部门</label>
          <el-input v-model="selectDept" placeholder="请选择" size='mini' class="content-select" clearable readonly
            v-popover:popoverSelectDept></el-input>
          <el-popover highlight-current popper-class="region-popper" ref="popoverSelectDept" placement="bottom-start"
            trigger="click" v-model="selectDeptVisible">
            <el-scrollbar class="region-scroll">
              <el-tree id="selectDept" :data="deptList" accordion :props="defaultProps" :expand-on-click-node="false"
                @node-click="handleNodeClickDept"></el-tree>
            </el-scrollbar>
          </el-popover>
        </el-col>
      </el-row>
      <el-row v-show="conditionVisible" class="content-row-select">
        <el-col :span="7">
          <label>设备类型</label>
          <el-select v-model="selectDevType" placeholder="请选择" size='mini' class="content-select" clearable>
            <el-option v-for="item in devTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import Common from "@/assets/js/common.js";
  import Bus from "@/assets/js/bus.js";
  export default {
    data() {
      return {
        title: '基本信息',
        token: '',
        repairStatusList: [],
        devTypeList: [],
        regionList: [],
        deptList: [],
        workordersStatusList: [],
        selectRepairStatus: '',
        selectDevType: '',
        selectRegion: '',
        selectWorkordersStatus: '',
        workordersId: '',
        lableClick: '',
        key: '',
        repairDate: '',
        devName: '',
        selectDept: '',
        serverPUshData: {
          ORD_OPER_FACKBACK: 0,
          ORD_OPER_SURE: 0,
          ORD_OPER_POSTPONE: 0,
          ORD_OVERTIME: 0,
          ORD_OPER_PRESS: 0
        },
        selectRegionCode: '',
        selectDeptCode: '',
        selectDeptVisible: false,
        selectRegionVisible: false,
        conditionVisible: false, // 更多条件
        defaultProps: {
          children: 'children',
          label: 'text'
        }
      };
    },
    mounted() {
      this.token = Common.getQueryString("token");
      this.getDicInfo('REPAIRSTATUS').then(res => {
        if (res.appCode == 0) {
          this.repairStatusList = res.resultList;
        }
      });
      this.getDicInfo('ORDERSSTATUS').then(res => {
        if (res.appCode == 0) {
          this.workordersStatusList = res.resultList;
        }
      });
      this.getDicInfo('REPDEVCATEGORY01').then(res => {
        if (res.appCode == 0) {
          this.devTypeList = res.resultList;
        }
      });
      // this.getRegionInfo('610000').then(res => {
      //     if (res.appCode == 0) { this.regionList = res.resultList; }
      // });
      this.getRegionTree(null).then(res => {
        if (res.appCode == 0) {
          this.regionList = res.resultList;
        }
      });
      // this.getDeptInfo('610100000000').then(res => {
      //     if (res.appCode == 0) { this.deptList = res.resultList; }
      // });
      this.getDeptTree(null).then(res => {
        if (res.appCode == 0) {
          this.deptList = res.resultList;
        }
      });
      this.workordersOperationCount();
      this.serverPUsh();
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
      selectDept(newVal, oldVal) {
        if (newVal === '') {
          this.selectDeptCode = '';
          setTimeout(() => {
            this.selectDeptVisible = false;
          });
        }
      }
    },
    methods: {
      changeLableClick(value) {
        if (value === this.lableClick) {
          this.lableClick = "";
        } else {
          this.lableClick = value;
        }
        this.searchTable();
      },
      handleNodeClickRegion(data, node, e) {
        let thisId = e.$parent.$parent.$parent.$attrs.id || e.$parent.$parent.$attrs.id || e.$parent.$attrs.id;
        // if (!data.children || data.children.length == 0) {
        if (data) {
          this.selectRegion = data.text;
          this.selectRegionCode = data.id;
          this.selectRegionVisible = false;
        }
      },
      handleNodeClickDept(data, node, e) {
        let thisId = e.$parent.$parent.$parent.$attrs.id || e.$parent.$parent.$attrs.id || e.$parent.$attrs.id;
        // if (!data.children || data.children.length == 0) {
        if (data) {
          this.selectDept = data.text;
          this.selectDeptCode = data.id;
          this.selectDeptVisible = false;
        }
      },
      serverPUsh() {
        ServerPush.receive('REP_MSG_APPLY', 'message', (res) => {
          this.serverPUshData[res['OPRATION_NAME']] = res[res['OPRATION_NAME']];
        });
        ServerPush.receive('REP_MSG_APPLY', 'message', (res) => {
          this.serverPUshData[res['OPRATION_NAME']] = res[res['OPRATION_NAME']];
        });
      },
      workordersOperationCount() {
        var url =
          this.$config.efoms_HOST + this.$config.workordersOperationCount_GET;
        var header = {
          "Content-Type": "application/x-www-form-urlencoded",
          token: this.token
        };
        this.$api
          .get(
            url, {
              startTime: Common.getCurrentDate() + ' 00:00:00',
              endTime: Common.getCurrentDate() + ' 23:59:59'
            },
            header
          )
          .then(res => {
            if (res.appCode == 0) {
              this.serverPUshData = res.resultList;
            } else {
              Common.printErrorLog(this.$config.efoms_HOST, this.$config.workordersOperationCount_GET);
            }
          })
          .catch(err => {
            Common.printErrorLog(this.$config.efoms_HOST, this.$config.workordersOperationCount_GET);
            console.log(err);
          });
      },
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
      getRegionTree(parentCode) {
        return this.$api.getMethod(this.$config.efoms_HOST, this.$config.getRegionTree_GET, {
          token: this.token,
          data: JSON.stringify({
            regionId: parentCode
          })
        });
      },
      getDeptTree(parentCode) {
        return this.$api.getMethod(this.$config.ubms_HOST, "/ubms-server/DeptInfo/getDeptTree.htm", {
          token: this.token,
          data: JSON.stringify({
            regionId: parentCode
          })
        });
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
          startTime = Common.dateFormat('yyyy-MM-dd', this.repairDate[0]) + ' 00:00:00';
          endTime = Common.dateFormat('yyyy-MM-dd', this.repairDate[1]) + ' 23:59:59';
        }
        Bus.$emit("queryConditions", {
          workordersStatusCode: this.selectWorkordersStatus,
          workordersId: this.workordersId,
          repStatusCode: this.selectRepairStatus,
          devTypeCode: this.selectDevType,
          devAreaCode: this.selectRegionCode,
          // devDeptId: this.selectDeptCode,
          lableClick: this.lableClick,
          key: this.key,
          repDeptIds: this.selectDeptCode ? JSON.stringify([this.selectDeptCode]) : JSON.stringify([]),
          repStartDate: startTime,
          repEndDate: endTime
        }); // 传输表格查询条件
      }
    }
  };

</script>
<style scoped>
  @import "../../assets/css/select.css";
  @import "../../assets/css/baseInfo.css";

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

  /* .base-info{margin: 14px 14px 10px 14px;background: #FFFFFF;border: 1px solid #E4EAEE;border-radius: 2px;}
.base-info .title{height: 36px;border-bottom: 1px solid #EBEFF1;margin: 0 58px 0 40px;}
.base-info .title::before{content: '';position: relative;left: -41px;top: 10px;border-left: 2px solid #00C187;}
.base-info .title h3{font-size: 14px;color: #22262E;line-height: 0px;}
.base-info .content{padding-top: 5px;padding-left: 40px;}
.base-info .content .content-row-select{margin-top: 10px;}
.base-info .content .content-row-select .quick-query{background: #FDF6EC;border: 1px solid #FBF0DF;border-radius: 11px;width: 105px;height: 22px;display: inline-block;margin-right: 20px;text-align: center;line-height: 20px;cursor: pointer;}
.base-info .content .content-row-select .quick-query.active{background: #ECA848;}
.base-info .content .content-row-select .quick-query.active label{color: #FFFFFF;}
.base-info .content .content-row-select .quick-query.active span{color: #FFFFFF;}
.base-info .content .content-row-select .quick-query label{color: #E58600;display: inline-block;width: 48px;font-size: 12px;cursor: pointer;}
.base-info .content .content-row-select .quick-query span{color: #E58600;display: inline-block;font-size: 12px;}
.base-info .content .content-row-select.content-row-foot{margin-bottom: 40px;}
.base-info .content .content-row-explain{font-size: 12px;line-height: 12px;margin-bottom: 25px;}
.base-info .content label{color: #4F5A64;display: inline-block;width: 48px;font-size: 12px; margin-right: 12px;text-align: right;}
.base-info .content span{font-size: 12px;color: #737E84;}
.base-info .content .content-select{width: 220px;}
.base-info .content .content-date{width: 220px;background: #F9FAFC;border-radius: 0;border: 1px solid #E1E7ED;}
.base-info .content .content-search{background: #00C187;border-radius: 1px;width: 80px;height: 28px;text-align: center;line-height: 28px;cursor: pointer;}
.base-info .content .content-search p{font-size: 12px;color: #FFFFFF;} */

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
