<template>
<div class="ej-main">
    <EJ-Menu></EJ-Menu>
    <div class="ej-content">
        <div class="ej-content-title">
            <h2>{{title}}</h2>
            <div class="ej-content-black" @click="goBack"><p>返回</p></div>
        </div>
        <div class="ej-content-main">
            <el-scrollbar class="ej-content-scrollbar">
                <EJ-BaseInfo></EJ-BaseInfo>
                <EJ-Depiction></EJ-Depiction>
            </el-scrollbar>
        </div>
        <div class="ej-content-operation">
            <div class="submit" @click="submitForm"><p>提交</p></div>
            <div class="reset" @click="resetRepair"><p>重置</p></div>
        </div>
    </div>
</div>
</template>
<script>
import Menu from "components/common/menu";
import BaseInfo from "components/eqpm/baseInfo";
import Depiction from "components/eqpm/depiction";
import Bus from "@/assets/js/bus.js";
import Common from "@/assets/js/common.js";
export default {
  components: {
    "EJ-Menu": Menu,
    "EJ-BaseInfo": BaseInfo,
    "EJ-Depiction": Depiction
  },
  data() {
    return {
      title: "设备报修",
      data: {
        devCategoryCode: "",
        devCategoryName: "",
        devTypeCode: "",
        devTypeName: "",
        devId: "",
        devName: "",
        failureTypeCode: "",
        failureTypeName: "",
        failureDescrible: "",
        repSource: "",
        repSourceCode: "",
        fileInfoList: [],
        repDeptId: "",
        repDeptName: "",
        repPersonTel: ""
      },
      token: "",
      isWarning: false
    };
  },
  mounted() {
    this.token = Common.getQueryString("token");
    var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (userInfo) {
      this.data.repDeptId = userInfo.orgId;
      this.data.repDeptName = userInfo.orgName;
      this.data.repPersonTel = userInfo.mobile;
    } else {
      this.selectUser();
    }
    // 设备类别
    Bus.$on("select_Devicecategory", value => {
      this.data.devCategoryCode = value;
    });
    // 设备类别名称
    Bus.$on("devCategoryName", value => {
      this.data.devCategoryName = value;
    });
    // 设备类型
    Bus.$on("select_Repdevcategory", value => {
      this.data.devTypeCode = value;
    });
    // 设备类型名称
    Bus.$on("devTypeName", value => {
      this.data.devTypeName = value;
    });
    // 设备信息
    Bus.$on("devInfo", value => {
      this.data.devId = value.devId;
      this.data.devName = value.devName;
    });
    // 故障类型
    Bus.$on("failureType", value => {
      this.data.failureTypeCode = value.dicCode;
      this.data.failureTypeName = value.dicName;
    });
    // 故障描述
    Bus.$on("failureDescrible", value => {
      this.data.failureDescrible = value;
    });
    // 报修来源
    Bus.$on("repSource", value => {
      this.data.repSource = value.dicName;
      this.data.repSourceCode = value.dicCode;
    });
    // 报修联系人
    Bus.$on("contactPerson", value => {
      this.data.contactPerson = value;
    });
    // 报修联系人电话
    Bus.$on("contactPersonTel", value => {
      this.data.contactPersonTel = value;
    });
    // 附件集合
    Bus.$on("fileInfoList", value => {
      this.data.fileList = value;
    });
    // 是否已经报修过了
     Bus.$on("isWarning", value => {
      this.isWarning = value;
    });
  },
  methods: {
    selectUser() {
      var that = this;
      var url =
        this.$config.efoms_HOST + this.$config.selectUser_GET;
      var header = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      this.$api
        .get(
          url,
          {
            token: this.token
          },
          header
        )
        .then(res => {
          if (res.appCode == 0) {
            sessionStorage.setItem("userInfo", JSON.stringify(res.resultList));
            that.data.repDeptId = userInfo.orgId;
            that.data.repDeptName = userInfo.orgName;
            that.data.repPersonTel = userInfo.mobile;
          } else {
            Common.printErrorLog(this.$config.efoms_HOST, this.$config.selectUser_GET);
          }
        })
        .catch(err => {
          Common.printErrorLog(this.$config.efoms_HOST, this.$config.selectUser_GET);
          console.log(err);
        });
    },
    submitForm() {
      if (this.data.devCategoryCode == "" || this.data.devTypeCode == "" || this.data.devId == "") {
        this.$message({
          message: '请选择设备基本信息',
          type: 'warning'
        });
        return;
      }
      if (!this.data.failureTypeCode || this.data.failureTypeCode == "" || this.data.failureDescrible == "") {
        this.$message({
          message: '请选择故障类型和填写故障描述',
          type: 'warning'
        });
        return;
      }
      if (this.isWarning) {
        return this.$message({message: '该设备已经报修过了，请勿重复提交', type: 'warning'});
      }
      var contactPersonTel = this.data.contactPersonTel;
      var isMobilePhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
      var isFixMob = /^0?1[3|4|5|8][0-9]\d{8}$/;
      if (contactPersonTel && !isFixMob.test(contactPersonTel) && !isMobilePhone.test(contactPersonTel)) {
        this.$message({
          message: '请输入正确的电话号码',
          type: 'warning'
        });
        return;
      }
      var url =
        this.$config.efoms_HOST +
        this.$config.createRepairsInfo_POST;
      var header = {
        // "Content-Type": "application/x-www-form-urlencoded"
        token: this.token
      };
      this.$api
        .post(url, this.data, header)
        .then(res => {
          if (res.appCode == 0) {
            Common.ejMessage("success");
            this.resetRepair();
            window.history.back();
          } else {
            Common.ejMessage("warning");
            Common.printErrorLog(this.$config.efoms_HOST, this.$config.createRepairsInfo_POST);
          }
          Bus.$emit("isWarning", false);
        })
        .catch(err => {
          Common.ejMessage("warning");
          Common.printErrorLog(this.$config.efoms_HOST, this.$config.createRepairsInfo_POST);
          console.log(err);
          Bus.$emit("isWarning", false);
        });
    },
    resetRepair() {
      Bus.$emit("resetRepair", true); // 传输重置消息
    },
    goBack() {
      window.history.back();
    }
  }
};
</script>
<style scoped>
@import "../../assets/css/main.css";
/* .ej-main{display: flex;flex:1;background-color: #f9fafc;}
.ej-main .ej-menu{width: 150px;}
.ej-main .ej-content{flex:1;overflow-x: hidden;display: flex;flex-flow: column;height: 100%;overflow: hidden;}
.ej-main .ej-content .ej-content-title{height: 40px; background: #E1E7EB;display: flex;flex-flow: row nowrap;justify-content: space-between;}
.ej-main .ej-content .ej-content-title h2{font-size: 14px;color: #1F2129;line-height: 18px;padding-top: 11px;padding-left: 29px;}
.ej-main .ej-content .ej-content-title .ej-content-black{background: rgba(255,255,255,0.09);border: 1px solid #4F5A64;border-radius: 2px;width: 44px;height: 20px;text-align: center;margin-top: 10px;margin-right: 14px;line-height: 18px;cursor: pointer;}
.ej-main .ej-content .ej-content-title .ej-content-black p{font-size: 12px;color: #4F5A64;}
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
