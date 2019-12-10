<template>
  <div class="base-info">
    <div class="content">
      <el-row class="content-row-select">
        <el-col :span="7">
          <label>设备名称</label>
          <el-input v-model="devName" placeholder="设备名称" size='mini' class="content-select" clearable></el-input>
        </el-col>
        <el-col :span="7">
          <label>设备类型</label>
          <el-select v-model="selectDevType" placeholder="请选择" size='mini' class="content-select" clearable>
            <el-option v-for="item in devTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <label>巡检结果</label>
          <el-select v-model="selectResult" placeholder="请选择" size='mini' class="content-select" clearable>
            <el-option v-for="item in resultList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
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
          <label>巡检时间</label>
          <el-date-picker v-model="patrolTime" type="daterange" range-separator="-" start-placeholder="开始日期"
            end-placeholder="结束日期" size='mini' class="content-date">
          </el-date-picker>
        </el-col>
        <el-col :span="7">
          <label>负责人员</label>
          <el-input v-model="liableName" placeholder="负责人员" size='mini' class="content-select" clearable></el-input>
          <!-- <el-select v-model="selectLiable" placeholder="请选择" size='mini' class="content-select" clearable>
                    <el-option v-for="item in liablelist" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                    </el-option>
                </el-select> -->
        </el-col>
        <el-col :span="7">
          <label>所属区域</label>
          <el-input v-model="selectRegion" placeholder="请选择" size='mini' class="content-select" clearable readonly
            v-popover:popoverSelectRegion></el-input>
          <el-popover highlight-current popper-class="region-popper" ref="popoverSelectRegion" placement="bottom-start"
            trigger="click" v-model="selectRegionVisible">
            <el-scrollbar class="region-scroll">
              <el-tree id="selectRegion" :data="regionList" accordion :props="defaultProps"
                :expand-on-click-node="false" @node-click="handleNodeClick"></el-tree>
            </el-scrollbar>
          </el-popover>
        </el-col>
      </el-row>
      <el-row v-show="conditionVisible" class="content-row-select">
        <el-col :span="7">
          <label>设备类别</label>
          <el-select v-model="selectDevCategory" placeholder="请选择" size='mini' class="content-select" clearable>
            <el-option v-for="item in devCategoryList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
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
        regionList: [], // 区域
        resultList: [], // 巡检结果
        liablelist: [], // 责任人
        devCategoryList: [], // 设备类别
        devTypeList: [], // 设备类型
        selectRegion: '',
        selectRegionCode: '',
        selectResult: '',
        selectLiable: '',
        selectDevCategory: '',
        selectDevType: '',
        liableName: '',
        patrolTime: '',
        devName: '',
        selectRegionVisible: false,
        conditionVisible: false,
        defaultProps: {
          children: 'children',
          label: 'text'
        }
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
      }
    },
    mounted() {
      this.token = Common.getQueryString("token");
      // 区域
      // this.getRegionInfo('610000').then(res => {
      //     if (res.appCode == 0) { this.regionList = res.resultList; }
      // });
      this.getRegionTree(null).then(res => {
        if (res.appCode == 0) {
          this.regionList = res.resultList;
        }
      });
      // 巡检结果
      this.getDicInfo('DEVICERESULT').then(res => {
        if (res.appCode == 0) {
          this.resultList = res.resultList;
        }
      });
      // 责任人
      this.liablelist = [];
      // 设备类别
      this.getDicInfo('DEVICECATEGORY').then(res => {
        if (res.appCode == 0) {
          this.devCategoryList = res.resultList;
        }
      });
      // 设备类型
      this.getDicInfo('REPDEVCATEGORY01').then(res => {
        if (res.appCode == 0) {
          this.devTypeList = res.resultList;
        }
      });
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
      getRegionInfo(parentCode) {
        return this.$api.getMethod(this.$config.ubms_HOST, '/RegionInfo/getRegionInfo.htm', {
          token: this.token,
          data: JSON.stringify({
            parentCode: parentCode
          })
        });
      },
      getRegionTree(parentCode) {
        return this.$api.getMethod(this.$config.efoms_HOST, '/ubmsService/getRegionTree', {
          token: this.token,
          data: JSON.stringify({
            regionId: parentCode
          })
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
      },
      searchTable() {
        let startTime = '';
        let endTime = '';
        if (this.patrolTime) {
          startTime = Common.dateFormat('yyyy-MM-dd hh:mm:ss', this.patrolTime[0]);
          endTime = Common.dateFormat('yyyy-MM-dd hh:mm:ss', this.patrolTime[1]);
        }
        let obj = {
          pageSize: 10,
          currentPage: 1,
          CheckRecordInfoId: '',
          devId: '',
          devName: this.devName,
          devAreaCode: this.selectRegionCode,
          devAreaName: '',
          checkPersonCode: '',
          checkPersonName: this.liableName,
          devCategoryCode: this.selectDevCategory,
          devTypeCode: this.selectDevType,
          checkResultCode: this.selectResult,
          startTime: startTime,
          endTime: endTime
        };
        Bus.$emit("queryConditions", obj); // 传输表格查询条件
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

</style>
<style>
  .region-popper {
    width: 220px;
    padding: 5px 0;
  }

</style>
