<template>
<div class="ej-main">
    <EJ-Menu></EJ-Menu>
    <div class="ej-content">
        <div class="ej-content-title">
            <h2>{{title}}</h2>
           <!--  <div class="ej-content-black"><p>返回</p></div> -->
        </div>
        <div class="ej-content-main">
            <el-scrollbar class="ej-content-scrollbar">
                <EJ-BaseInfo></EJ-BaseInfo>
                <EJ-Depiction></EJ-Depiction>
                <EJ-Fackback></EJ-Fackback>
                <EJ-Operation></EJ-Operation>
            </el-scrollbar>
        </div>
        <div class="ej-content-operation">
            <div class="submit" @click="submitForm"><p>提交</p></div>
            <div class="reset" @click="reset"><p>重置</p></div>
        </div>
    </div>
</div>
</template>
<script>
import Menu from "components/common/menu";
import BaseInfo from "components/fixapply/baseInfo";
import Depiction from "components/fixapply/depiction";
import Fackback from "components/fixapply/fackback";
import Operation from "components/fixapply/operation";
import Bus from "@/assets/js/bus.js";
import Common from "@/assets/js/common.js";
export default {
  components: {
    "EJ-Menu": Menu,
    "EJ-BaseInfo": BaseInfo,
    "EJ-Depiction": Depiction,
    "EJ-Fackback": Fackback,
    "EJ-Operation": Operation
  },
  data() {
    return {
      title: "设备报修",
      token: "",
      operExplain: '',
      dataInfo: {}, // 选中的数据详情
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
        repPersonId: "",
        repPersonName: "",
        repPersonTel: "",
        workordersRecordMap: {
          dispatchList: [
            {
              opDeptId: "",
              opDeptName: "",
              opPersonId: "",
              opPersonName: "",
              contactTel: "",
              deadlineDate: "",
              operExplain: ""
            }
          ],
          fackbackList: [
            {
              failureTypeCode: "",
              failureTypeName: "",
              failureReason: "",
              operExplain: ""
            }
          ]
        }
      }
    };
  },
  mounted() {
    this.token = Common.getQueryString("token");
    Bus.$on("operExplain", value => {
      this.operExplain = value;
    });
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
    // 报修联系人ID
    Bus.$on("repPersonId", value => {
      this.data.repPersonId = value;
    });
    // 报修联系人名称
    Bus.$on("repPersonName", value => {
      this.data.repPersonName = value;
    });
    // 报修联系人电话
    Bus.$on("repPersonTel", value => {
      this.data.repPersonTel = value;
    });
    // 报修部门ID
    Bus.$on("repDeptId", value => {
      this.data.repDeptId = value;
    });
    // 报修部门名称
    Bus.$on("repDeptName", value => {
      this.data.repDeptName = value;
    });
    // 附件集合
    Bus.$on("fileInfoList", value => {
      this.data.fileList = value;
    });
    /* *************反馈操作**************/
    Bus.$on("fackback_failureType", value => {
      this.data.workordersRecordMap.fackbackList[0].failureTypeCode = value.dicCode;
      this.data.workordersRecordMap.fackbackList[0].failureTypeName = value.dicName;
    });
    Bus.$on("fackback_operExplain", value => {
      this.data.workordersRecordMap.fackbackList[0].operExplain = value;
    });
    /* *************派发操作**************/
    // 运维单位部门ID
    Bus.$on("deptId", value => {
      this.data.workordersRecordMap.dispatchList[0].opDeptId = value;
    });
    // 运维单位部门名称
    Bus.$on("deptName", value => {
      this.data.workordersRecordMap.dispatchList[0].opDeptName = value;
    });
    // 运维组长ID
    Bus.$on("personId", value => {
      this.data.workordersRecordMap.dispatchList[0].opPersonId = value;
    });
    // 运维组长名称
    Bus.$on("personName", value => {
      this.data.workordersRecordMap.dispatchList[0].opPersonName = value;
    });
    // 联系电话
    Bus.$on("contactTel", value => {
      this.data.workordersRecordMap.dispatchList[0].contactTel = value;
    });
  },
  methods: {
    submitForm() {
      var url =
        this.$config.efoms_HOST +
        this.$config.applyWorkordersInfo_GET;
      var header = {
        // "Content-Type": "application/x-www-form-urlencoded"
        token: this.token
      };
      this.$api
        .post(url, this.data, header)
        .then(res => {
          if (res.appCode == 0) {
            Common.ejMessage("success");
          } else {
            Common.ejMessage("warning");
            Common.printErrorLog(this.$config.efoms_HOST, this.$config.applyWorkordersInfo_GET);
          }
        })
        .catch(err => {
          Common.ejMessage("warning");
          Common.printErrorLog(this.$config.efoms_HOST, this.$config.applyWorkordersInfo_GET);
          console.log(err);
        });
    },
    reset() {
      Bus.$emit("reset", ''); // 传输重置信息
    }
  }
};
</script>
<style scoped>
.ej-main{display: flex;flex:1;background-color: #f9fafc;}
.ej-main .ej-menu{width: 150px;}
.ej-main .ej-content{flex:1;}
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
@media screen and (max-width:1366px){.ej-main .ej-content .ej-content-main{background-color: #f9fafc;height:450px;}}
</style>
<style>
.ej-content-scrollbar {height: 100%;}
.ej-content-scrollbar .el-scrollbar__wrap {overflow-x: hidden;}
</style>
