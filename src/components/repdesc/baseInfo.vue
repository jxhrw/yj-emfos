<template>
<div class="base-info">
    <div class="title">
        <h3>{{title}}</h3>
    </div>
    <div class="content">
        <el-row class="content-row-select">
            <el-col :span="9">
                <label>设备类别</label>
                <span>{{dataInfo.devCategoryName}}</span>
            </el-col>
            <el-col :span="9">
                <label>设备类型</label>
                <span>{{dataInfo.devTypeName}}</span>
            </el-col>
        </el-row>
        <el-row class="content-row-select">
            <el-col :span="9">
                <label>设备名称</label>
                <span>{{dataInfo.devName}}</span>
            </el-col>
            <el-col :span="9">
                <label>设备编号</label>
                <span>{{dataInfo.devId}}</span>
            </el-col>
        </el-row>
        <el-row class="content-row-explain content-row-first">
            <el-col :span="9">
                <label>设备厂家</label>
                <span>{{dataInfo.devFactory}}</span>
            </el-col>
            <el-col :span="9">
                <label>设备品牌</label>
                <span>{{dataInfo.devBrand}}</span>
            </el-col>
        </el-row>
        <el-row class="content-row-explain">
            <el-col :span="9">
                <label>设备型号</label>
                <span>{{dataInfo.devModel}}</span>
            </el-col>
            <el-col :span="9">
                <label>建设时间</label>
                <span>{{dataInfo.devBuildDate}}</span>
            </el-col>
        </el-row>
        <el-row class="content-row-explain">
            <el-col :span="9">
                <label>所属辖区</label>
                <span>{{dataInfo.devAreaName}}</span>
            </el-col>
            <el-col :span="9">
                <label>管理部门</label>
                <span>{{dataInfo.devDeptName}}</span>
            </el-col>
        </el-row>
        <el-row class="content-row-explain">
            <el-col :span="9">
                <label>IP地址</label>
                <span>{{dataInfo.devIp}}</span>
            </el-col>
            <el-col :span="9">
                <label>设备定位</label>
                <span>{{dataInfo.longitude}},{{dataInfo.latitude}}</span>
            </el-col>
        </el-row>
        <el-row class="content-row-explain">
            <el-col :span="24">
                <label>安装位置</label>
                <span>{{dataInfo.devBuildPosition}}</span>
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
      token: "",
      dataInfo: {} // 选中的数据详情
    };
  },
  mounted() {
    this.token = Common.getQueryString("token");
    this.dataInfo = JSON.parse(sessionStorage.getItem('dataDetail'));
  }
};
</script>
<style scoped>
.base-info {
  margin: 14px 14px 10px 14px;
  background: #ffffff;
  border: 1px solid #e4eaee;
  border-radius: 2px;
}
.base-info .title {
  height: 36px;
  border-bottom: 1px solid #ebeff1;
  margin: 0 58px 0 40px;
}
.base-info .title::before {
  content: "";
  position: relative;
  left: -41px;
  top: 10px;
  border-left: 2px solid #00c187;
}
.base-info .title h3 {
  font-size: 14px;
  color: #22262e;
  line-height: 0px;
}
.base-info .content {
  padding-top: 5px;
  padding-left: 40px;
}
.base-info .content .content-row-select {
  margin-top: 10px;
}
.base-info .content .content-row-first {
  margin-top: 16px;
}
.base-info .content .content-row-explain {
  font-size: 12px;
  line-height: 12px;
  margin-bottom: 25px;
}
.base-info .content label {
  color: #4f5a64;
  display: inline-block;
  width: 48px;
  font-size: 12px;
  margin-right: 12px;
  text-align: right;
}
.base-info .content span {
  font-size: 12px;
  color: #737e84;
}
.base-info .content .content-select {
  width: 300px;
}
</style>
<style>
.base-info .content .content-select .el-input__inner {
  border-radius: 0;
  background: #f9fafc;
  border: 1px solid #e1e7ed;
}
.base-info .content .content-select .el-input__suffix {
  border-left: 1px solid #e1e7ed;
}
</style>
