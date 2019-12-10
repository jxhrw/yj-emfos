<template>
<div class="ej-main">
    <EJ-Menu></EJ-Menu>
    <div class="ej-content">
        <div class="ej-content-title">
            <h2>{{title}}</h2>
            <div class="ej-content-goto" @click="gotoEqpm"><p>设备报修</p></div>
        </div>
        <div class="ej-content-main">
            <el-scrollbar class="ej-content-scrollbar">
                <EJ-BaseInfo></EJ-BaseInfo>
                <EJ-Depiction></EJ-Depiction>
            </el-scrollbar>
        </div>
    </div>
</div>
</template>
<script>
import Menu from "components/common/menu";
import BaseInfo from "components/repm/baseInfo";
import Depiction from "components/repm/depiction";
import Common from "@/assets/js/common.js";
export default {
  components: {
    "EJ-Menu": Menu,
    "EJ-BaseInfo": BaseInfo,
    "EJ-Depiction": Depiction
  },
  data() {
    return {
      title: "报修管理",
      token: ''
    };
  },
  mounted() {
    this.token = Common.getQueryString("token");
  },
  methods: {
    gotoEqpm() {
      window.location.href = this.$config.ProjectName + "/eqpm.html?token=" + this.token;
    }
  }
};
</script>
<style scoped>
@import "../../assets/css/main.css";
/* .ej-main{display: flex;flex:1;background-color: #f9fafc;}
.ej-main .ej-menu{width: 150px;}
.ej-main .ej-content{flex:1;}
.ej-main .ej-content .ej-content-title{height: 40px; background: #E1E7EB;display: flex;flex-flow: row nowrap;justify-content: space-between;}
.ej-main .ej-content .ej-content-title h2{font-size: 14px;color: #1F2129;line-height: 18px;padding-top: 11px;padding-left: 29px;}
.ej-main .ej-content .ej-content-title .ej-content-eqpm{background: #0CC1B9;border: 1px solid #0CC1B9;border-radius: 2px;width: 80px;height: 20px;text-align: center;margin-top: 10px;margin-right: 14px;line-height: 18px;cursor: pointer;}
.ej-main .ej-content .ej-content-title .ej-content-eqpm p{font-size: 12px;color: #FFFFFF;}
.ej-main .ej-content .ej-content-main{background-color: #f9fafc;height: 754px;}
.ej-main .ej-content .ej-content-operation{background-color: #f9fafc;height:63px;text-align: center;padding-top: 30px;}
.ej-main .ej-content .ej-content-operation div{display: inline-block;margin-right: 14px;width: 80px;height: 28px;background: #F9FAFC;border: 1px solid #E1E7ED;border-radius: 1px;cursor: pointer;}
.ej-main .ej-content .ej-content-operation div p{line-height: 28px;font-size: 14px; color: #6C7883;}
.ej-main .ej-content .ej-content-operation .submit{background-color: #00C187;}
.ej-main .ej-content .ej-content-operation .submit p{color: #FFFFFF;}
.ej-main .ej-content .ej-content-operation .reset{background-color: #8A94A2;}
.ej-main .ej-content .ej-content-operation .reset p{color: #FFFFFF;}
@media screen and (max-width:1366px){.ej-main .ej-content .ej-content-main{background-color: #f9fafc;height:450px;}} */
</style>
<style>
.ej-content-scrollbar {height: 100%;}
.ej-content-scrollbar .el-scrollbar__wrap {overflow-x: hidden;}
</style>
