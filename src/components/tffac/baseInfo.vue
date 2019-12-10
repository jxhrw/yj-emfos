<template>
  <div>
    <div class="base-tabs">
      <!-- <div class="other-tabs" :class="{'active':facilityTypeCode=='REPDEVTYPE06'}" @click="changeType('REPDEVTYPE06')">信号灯</div> -->
      <div
        class="other-tabs"
        :class="{'active':facilityTypeCode=='REPDEVTYPE21'}"
        @click="changeType('REPDEVTYPE21')"
      >交通标线</div>
      <div
        class="other-tabs"
        :class="{'active':facilityTypeCode=='REPDEVTYPE22'}"
        @click="changeType('REPDEVTYPE22')"
      >交通护栏</div>
      <div
        class="other-tabs"
        :class="{'active':facilityTypeCode=='REPDEVTYPE23'}"
        @click="changeType('REPDEVTYPE23')"
      >交通标志</div>
    </div>
    <div class="base-info">
      <div class="content">
        <el-row class="content-row-select">
          <el-col :span="7">
            <label>设施编号</label>
            <el-input
              v-model="devId"
              placeholder="请输入"
              size="mini"
              class="content-select"
              clearable
            ></el-input>
          </el-col>
          <el-col :span="7">
            <label>设施名称</label>
            <el-input
              v-model="devName"
              placeholder="请输入"
              size="mini"
              class="content-select"
              clearable
            ></el-input>
          </el-col>
          <el-col :span="7">
            <label>所属辖区</label>
            <el-input
              v-model="selectRegion"
              placeholder="请选择"
              size="mini"
              class="content-select"
              clearable
              readonly
              v-popover:popoverSelectRegion
            ></el-input>
            <el-popover
              highlight-current
              popper-class="region-popper"
              ref="popoverSelectRegion"
              placement="bottom-start"
              trigger="click"
              v-model="selectRegionVisible"
            >
              <el-scrollbar class="region-scroll">
                <el-tree
                  id="selectRegion"
                  :data="regionList"
                  accordion
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  @node-click="handleNodeRegionClick"
                ></el-tree>
              </el-scrollbar>
            </el-popover>
          </el-col>
          <el-col :span="3">
            <div class="relative">
              <div
                class="content-icon"
                :class="{'active':conditionVisible}"
                @click="conditionVisible = !conditionVisible"
              ></div>
              <div class="content-search" @click="searchTable">
                <p>查询</p>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row v-show="conditionVisible" class="content-row-select">
          <el-col :span="7">
            <label>子类型</label>
            <el-select
              v-model="selectSignsType"
              placeholder="请选择"
              size="mini"
              class="content-select"
              clearable
            >
              <el-option
                v-for="item in signsTypeList"
                :key="item.dicCode"
                :label="item.dicName"
                :value="item.dicCode"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="7">
            <label>所属道路</label>
            <el-select
              v-model="selectLoad"
              placeholder="请选择"
              size="mini"
              class="content-select"
              clearable
            >
              <el-option
                v-for="item in loadList"
                :key="item.roadId"
                :label="item.roadName"
                :value="item.roadId"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="7">
            <label>建设日期</label>
            <el-date-picker
              v-model="constructionTime"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              class="content-date"
            ></el-date-picker>
          </el-col>
        </el-row>
        <el-row v-show="conditionVisible" class="content-row-select">
          <el-col :span="7">
            <label>设施状态</label>
            <el-select
              v-model="selectDevStatus"
              placeholder="请选择"
              size="mini"
              class="content-select"
              clearable
            >
              <el-option
                v-for="item in devStatusList"
                :key="item.dicCode"
                :label="item.dicName"
                :value="item.dicCode"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="7">
            <label>维修状态</label>
            <el-select
              v-model="selectRepStatus"
              placeholder="请选择"
              size="mini"
              class="content-select"
              clearable
            >
              <el-option
                v-for="item in repStatusList"
                :key="item.dicCode"
                :label="item.dicName"
                :value="item.dicCode"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="7">
            <label>使用状态</label>
            <el-select
              v-model="selectUseStatus"
              placeholder="请选择"
              size="mini"
              class="content-select"
              clearable
            >
              <el-option
                v-for="item in useStatusList"
                :key="item.dicCode"
                :label="item.dicName"
                :value="item.dicCode"
              ></el-option>
            </el-select>
          </el-col>
          <!-- <el-col :span="7">
                <label>更新时间</label>
                <el-date-picker v-model="updateTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size='mini' class="content-date">
                </el-date-picker>
          </el-col>-->
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import Common from "@/assets/js/common.js";
import Bus from "@/assets/js/bus.js";
export default {
  data() {
    return {
      title: "基本信息",
      token: "",
      facilityTypeCode: "",
      devId: "",
      devName: "",
      selectRegion: "",
      selectRegionCode: "",
      selectRegionVisible: false,
      regionList: [], // 区域
      // factory: '',
      selectSignsType: "",
      signsTypeList: [],
      selectLoad: "",
      loadList: [],
      constructionTime: "",
      selectDeptId: "",
      selectDeptIdCode: "",
      selectDeptIdVisible: false,
      devDeptIdList: [],
      selectDevStatus: "",
      devStatusList: [],
      selectRepStatus: "",
      repStatusList: [],
      selectUseStatus: "",
      useStatusList: [],
      updateTime: "",
      conditionVisible: false, // 更多条件
      defaultProps: {
        children: "children",
        label: "text"
      }
    };
  },
  watch: {
    facilityTypeCode(newVal, oldVal) {
      sessionStorage.setItem("tfFacType", newVal);
      // 维修状态
      this.selectSignsType = "";
      let type = "";
      switch (newVal) {
        case "REPDEVTYPE21":
          type = "SIGNSCLASS02";
          break;
        case "REPDEVTYPE22":
          type = "SIGNSCLASS03";
          break;
        case "REPDEVTYPE23":
          type = "SIGNSCLASS01";
          break;
        default:
          break;
      }
      this.getDicInfo(type).then(res => {
        if (res.appCode == 0) {
          this.signsTypeList = res.resultList;
        }
      });
    },
    selectRegion(newVal, oldVal) {
      if (newVal === "") {
        this.selectRegionCode = "";
        setTimeout(() => {
          this.selectRegionVisible = false;
        });
      }
    },
    selectDeptId(newVal, oldVal) {
      if (newVal === "") {
        this.selectDeptIdCode = "";
        setTimeout(() => {
          this.selectDeptIdVisible = false;
        });
      }
    }
  },
  mounted() {
    this.token = Common.getQueryString("token");
    this.facilityTypeCode =
      sessionStorage.getItem("tfFacType") || "REPDEVTYPE21";
    // this.changeType(this.facilityTypeCode);
    // 区域
    this.getRegionTree(null).then(res => {
      if (res.appCode == 0) {
        this.regionList = res.resultList;
      }
    });
    // 维护单位
    this.getDeptTree(null).then(res => {
      if (res.appCode == 0) {
        this.devDeptIdList = res.resultList;
      }
    });
    // 设施状态
    this.getDicInfo("DEVICEALLSTATUS").then(res => {
      if (res.appCode == 0) {
        this.devStatusList = res.resultList;
      }
    });
    // 维修状态
    this.getDicInfo("DEVREPSTATUS").then(res => {
      if (res.appCode == 0) {
        this.repStatusList = res.resultList;
      }
    });
    // 使用状态
    this.devGetDicInfo("DEVICESTATUS").then(res => {
      if (res.appCode == 0) {
        this.useStatusList = res.resultList;
      }
    });
    // 所属道路
    this.getRoad().then(res => {
      if (res.appCode == 0) {
        this.loadList = res.resultList;
      }
    });
  },
  methods: {
    changeType(val) {
      this.facilityTypeCode = val;
      // 清空搜索条件
      this.devId = "";
      this.devName = "";
      this.selectRegion = "";
      // this.factory = '';
      this.selectSignsType = "";
      this.selectLoad = "";
      this.constructionTime = "";
      this.selectDeptId = "";
      this.selectDevStatus = "";
      this.selectRepStatus = "";
      this.selectUseStatus = "";
      this.updateTime = "";
      this.searchTable();
    },
    handleNodeRegionClick(data, node, e) {
      let thisId =
        e.$parent.$parent.$parent.$attrs.id ||
        e.$parent.$parent.$attrs.id ||
        e.$parent.$attrs.id;
      // if (!data.children || data.children.length == 0) {
      if (data) {
        this.selectRegion = data.text;
        this.selectRegionCode = data.id;
        this.selectRegionVisible = false;
      }
    },
    handleNodeDevIpClick(data, node, e) {
      let thisId =
        e.$parent.$parent.$parent.$attrs.id ||
        e.$parent.$parent.$attrs.id ||
        e.$parent.$attrs.id;
      // if (!data.children || data.children.length == 0) {
      if (data) {
        this.selectDeptId = data.text;
        this.selectDeptIdCode = data.id;
        this.selectDeptIdVisible = false;
      }
    },
    getRegionTree(parentCode) {
      return this.$api.getMethod(
        this.$config.efoms_HOST,
        this.$config.getRegionTree_GET,
        { token: this.token, data: JSON.stringify({ regionId: parentCode }) }
      );
    },
    getDeptTree(parentCode) {
      return this.$api.getMethod(
        this.$config.ubms_HOST,
        "/ubms-server/DeptInfo/getDeptTree.htm",
        {
          token: this.token,
          data: JSON.stringify({ regionId: parentCode })
        }
      );
    },
    // 数据字典
    getDicInfo(parentCode) {
      return this.$api.getMethod(
        this.$config.ubms_HOST,
        this.$config.getDeviceDic_GET,
        { token: this.token, data: JSON.stringify({ parentCode: parentCode }) }
      );
    },
    // 数据字典 - 基础信息
    devGetDicInfo(parentCode) {
      return this.$api.getMethod(
        this.$config.ubms_HOST,
        this.$config.dev_getDicInfo_GET,
        { token: this.token, data: JSON.stringify({ parentCode: parentCode }) }
      );
    },
    // 道路
    getRoad() {
      let host = this.$config.ubms_HOST;
      let method = this.$config.getRoadInfo_GET;
      let obj = {
        token: this.token,
        data: JSON.stringify({})
      };
      return this.$api.getMethod(host, method, obj, this.token);
    },
    searchTable() {
      let startConstTime = "";
      let endConstTime = "";
      let startUpdateTime = "";
      let endUpdateTime = "";
      if (this.constructionTime) {
        startConstTime = Common.dateFormat(
          "yyyy-MM-dd",
          this.constructionTime[0]
        );
        endConstTime = Common.dateFormat(
          "yyyy-MM-dd",
          this.constructionTime[1]
        );
      }
      if (this.updateTime) {
        startUpdateTime = Common.dateFormat(
          "yyyy-MM-dd hh:mm:ss",
          this.updateTime[0]
        );
        endUpdateTime = Common.dateFormat(
          "yyyy-MM-dd hh:mm:ss",
          this.updateTime[1]
        );
      }
      Bus.$emit("queryConditions", {
        facilityTypeCode: this.facilityTypeCode,
        facilityId: this.devId,
        facilityName: this.devName,
        regionId: this.selectRegionCode,
        // devFactory: this.factory,
        signsType: this.selectSignsType,
        roadId: this.selectLoad,
        buildBeginDate: startConstTime,
        buildEndDate: endConstTime,
        // oppmDept: this.selectDeptIdCode,
        devStatusCode: this.selectDevStatus,
        repStatusCode: this.selectRepStatus,
        deviceStatus: this.selectUseStatus,
        pageSize: 10,
        currentPage: 1
      }); // 传输表格查询条件
    }
  }
};
</script>
<style scoped>
@import "../../assets/css/select.css";
@import "../../assets/css/baseInfo.css";
.base-info {
  margin-top: -1px;
}
.base-info .content {
  padding-bottom: 24px;
}
.base-tabs {
  height: 34px;
  display: flex;
  margin: 14px 14px 0 14px;
  padding-left: 64px;
}
.base-tabs .other-tabs {
  width: 120px;
  height: 34px;
  line-height: 32px;
  background: #f9fafc;
  text-align: center;
  cursor: pointer;
  border: 1px solid #f9fafc;
  border-bottom-color: #e4eaee;
  box-sizing: border-box;
  color: #758087;
}
.base-tabs .other-tabs.active {
  border-color: #e4eaee;
  border-bottom-color: #ffffff;
  background: #fff;
  color: #22262e;
}
.base-info .content-icon {
  position: absolute;
  width: 28px;
  height: 28px;
  background: url("../../assets/images/icon-arrow-double.png") no-repeat
    center/100%;
  cursor: pointer;
  left: -38px;
}
.base-info .content-icon.active {
  transform: rotate(90deg);
}
.relative {
  position: relative;
}
</style>
<style>
.region-popper {
  width: 220px;
  padding: 5px 0;
}
</style>
