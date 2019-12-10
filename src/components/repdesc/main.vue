<template>
  <div class="ej-main">
    <EJ-Menu></EJ-Menu>
    <div class="ej-content">
      <div class="ej-content-title">
        <h2>{{title}}</h2>
        <div class="ej-content-black" @click="gotoRepm">
          <p>返回</p>
        </div>
      </div>
      <div class="ej-content-main">
        <el-scrollbar class="ej-content-scrollbar">
          <EJ-BaseInfo></EJ-BaseInfo>
          <EJ-Depiction></EJ-Depiction>
          <EJ-Operation1 v-show="showNum==1&&dataInfo.repStatusCode=='REPAIRSTATUS01'"></EJ-Operation1>
          <EJ-Operation2 v-show="showNum==2"></EJ-Operation2>
        </el-scrollbar>
      </div>
      <div class="ej-content-operation"
        v-show="(dataInfo.repStatusCode&&dataInfo.repStatusCode!='REPAIRSTATUS02'&&dataInfo.repStatusCode!='REPAIRSTATUS03'&&dataInfo.repStatusCode!='REPAIRSTATUS04')||showNum==2">
        <div class="submit" @click="submitForm(1)" v-if="btnName">
          <p>{{btnName}}</p>
        </div>
        <div class="refuse" @click="submitForm(0)" v-show="showNum==1">
          <p>拒绝</p>
        </div>
        <!-- <div class="reset" @click="reset"><p>重置</p></div> -->
        <!-- <div class="cancel" @click="gotoRepm"><p>取消</p></div> -->
      </div>
    </div>
  </div>
</template>
<script>
  import Menu from "components/common/menu";
  import BaseInfo from "components/repdesc/baseInfo";
  import Depiction from "components/repdesc/depiction";
  import Operation1 from "components/repdesc/operation1";
  import Operation2 from "components/repdesc/operation2";
  import Bus from "@/assets/js/bus.js";
  import Common from "@/assets/js/common.js";
  export default {
    components: {
      "EJ-Menu": Menu,
      "EJ-BaseInfo": BaseInfo,
      "EJ-Depiction": Depiction,
      "EJ-Operation1": Operation1,
      "EJ-Operation2": Operation2
    },
    data() {
      return {
        title: "设备报修",
        btnName: '',
        token: "",
        type: "",
        showNum: 0,
        operExplain: "",
        dataInfo: {}, // 选中的数据详情
        workorderId: "",
        workordersRecordMap: {
          dispatchList: [{
            opDeptId: "",
            opDeptName: "",
            opPersonId: "",
            opPersonName: "",
            contactTel: "",
            deadlineDate: "",
            operExplain: ""
          }]
        }
      };
    },
    watch: {
      showNum(newVal, oldVal) {
        this.title = newVal == '2' ? '创建工单' : '设备报修';
        this.btnName = newVal == '2' ? '派发' : '通过';
      }
    },
    mounted() {
      this.token = Common.getQueryString("token");
      this.type = Common.getQueryString("type");
      switch (this.type) {
        case "fixm":
          this.showNum = 1;
          break;
        case "dispatch":
          this.showNum = 2;
          var dataInfo = JSON.parse(sessionStorage.getItem("dataDetail"));
          this.workorderId = dataInfo.workordersId;
          break;
        default:
          this.showNum = 0;
          break;
      }
      this.dataInfo = JSON.parse(sessionStorage.getItem("dataDetail"));
      Bus.$on("operExplain", value => {
        this.operExplain = value;
      });
      /* *************派发操作**************/
      // 运维单位部门ID
      Bus.$on("deptId", value => {
        this.workordersRecordMap.dispatchList[0].opDeptId = value;
      });
      // 运维单位部门名称
      Bus.$on("deptName", value => {
        this.workordersRecordMap.dispatchList[0].opDeptName = value;
      });
      // 运维组长ID
      Bus.$on("personId", value => {
        this.workordersRecordMap.dispatchList[0].opPersonId = value;
      });
      // 运维组长名称
      Bus.$on("personName", value => {
        this.workordersRecordMap.dispatchList[0].opPersonName = value;
      });
      // 联系电话
      Bus.$on("contactTel", value => {
        this.workordersRecordMap.dispatchList[0].contactTel = value;
      });
      // 维修期限
      Bus.$on("deadlineDate", value => {
        this.workordersRecordMap.dispatchList[0].deadlineDate = value;
      });
      // 派发备注
      Bus.$on("operExplain", value => {
        this.workordersRecordMap.dispatchList[0].operExplain = value;
      });
    },
    methods: {
      gotoRepm() {
        switch (this.type) {
          case "fixm":
            window.location.href = this.$config.ProjectName + "/fixm.html?token=" + this.token;
            break;
          case "dispatch":
            window.location.href = this.$config.ProjectName + "/fixm.html?type=fixm&token=" + this.token;
            break;
          default:
            window.location.href = this.$config.ProjectName + "/repm.html?token=" + this.token;
            break;
        }
      },
      submitForm(isPass) {
        var url = "";
        var data = "";
        var header = {
          token: this.token
        };
        switch (this.showNum) {
          case 1:
            url =
              this.$config.efoms_HOST +
              this.$config.auditRepairsInfo_GET;
            this.$api
              .putByQs(
                url, {
                  repairsId: this.dataInfo.repairsId,
                  isPass: isPass, // 1:通过，0：不通过
                  operExplain: this.operExplain
                },
                header
              )
              .then(res => {
                if (res.appCode == 0) {
                  Common.ejMessage("success");
                  switch (this.type) {
                    case "fixm":
                      if (isPass == 1) {
                        this.showNum = 2;
                        this.workorderId = res.resultList;
                        break;
                      } else {
                        window.location.href = this.$config.ProjectName + "/fixm.html?token=" + this.token;
                      }
                      break;
                    default:
                      break;
                  }
                } else {
                  Common.ejMessage("warning");
                  Common.printErrorLog(this.$config.efoms_HOST, this.$config.auditRepairsInfo_GET);
                }
              })
              .catch(err => {
                Common.ejMessage("warning");
                Common.printErrorLog(this.$config.efoms_HOST, this.$config.auditRepairsInfo_GET);
                console.log(err);
              });
            break;
          case 2:
            if (this.workorderId == "") {
              url =
                this.$config.efoms_HOST +
                this.$config.createWorkordersInfo_POST;
              data = {
                devCategoryCode: this.dataInfo.devCategoryCode,
                devCategoryName: this.dataInfo.devCategoryName,
                devTypeCode: this.dataInfo.devTypeCode,
                devTypeName: this.dataInfo.devTypeName,
                devId: this.dataInfo.devId,
                devName: this.dataInfo.devName,
                failureTypeCode: this.dataInfo.failureTypeCode,
                failureTypeName: this.dataInfo.failureTypeName,
                failureDescrible: this.dataInfo.failureDescrible,
                repSource: this.dataInfo.repSource,
                repSourceCode: this.dataInfo.repSourceCode,
                fileInfoList: this.dataInfo.fileInfoList,
                // repDeptId: this.dataInfo.repDeptId,
                // repDeptName: this.dataInfo.repDeptName,
                repPersonId: this.dataInfo.repPersonId,
                repPersonName: this.dataInfo.repPersonName,
                repPersonTel: this.dataInfo.repPersonTel,
                workordersRecordMap: this.workordersRecordMap
              };
              this.$api
                .post(url, data, header)
                .then(res => {
                  if (res.appCode == 0) {
                    Common.ejMessage("success");
                    window.location.href = this.$config.ProjectName + "/fixm.html?type=fixm&token=" + this.token;
                  } else {
                    Common.ejMessage("warning");
                    Common.printErrorLog(this.$config.efoms_HOST, this.$config.createWorkordersInfo_POST);
                  }
                })
                .catch(err => {
                  Common.ejMessage("warning");
                  Common.printErrorLog(this.$config.efoms_HOST, this.$config.createWorkordersInfo_POST);
                  console.log(err);
                });
            } else {
              if (this.workordersRecordMap.dispatchList[0].opDeptId == "") {
                this.$message({
                  message: '请选择运维单位',
                  type: 'warning'
                });
                return;
              }
              url =
                this.$config.efoms_HOST +
                this.$config.dispatchWorkorders_GET;
              data = {
                workordersId: this.workorderId,
                opDeptId: this.workordersRecordMap.dispatchList[0].opDeptId,
                opDeptName: this.workordersRecordMap.dispatchList[0].opDeptName,
                opPersonId: this.workordersRecordMap.dispatchList[0].opPersonId,
                opPersonName: this.workordersRecordMap.dispatchList[0]
                  .opPersonName,
                contactTel: this.workordersRecordMap.dispatchList[0].contactTel,
                deadlineDate: this.workordersRecordMap.dispatchList[0]
                  .deadlineDate,
                operExplain: this.workordersRecordMap.dispatchList[0].operExplain
              };
              this.$api
                .putByQs(url, data, header)
                .then(res => {
                  if (res.appCode == 0) {
                    Common.ejMessage("success");
                    window.location.href = this.$config.ProjectName + "/fixm.html?type=fixm&token=" + this.token;
                  } else {
                    Common.ejMessage("warning");
                    Common.printErrorLog(this.$config.efoms_HOST, this.$config.dispatchWorkorders_GET);
                  }
                })
                .catch(err => {
                  Common.ejMessage("warning");
                  Common.printErrorLog(this.$config.efoms_HOST, this.$config.dispatchWorkorders_GET);
                  console.log(err);
                });
            }

            break;
          default:
            break;
        }
      },
      reset() {
        Bus.$emit("reset", ""); // 传输重置信息
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
.ej-main .ej-content .ej-content-title .ej-content-black{background: rgba(255,255,255,0.09);border: 1px solid #4F5A64;border-radius: 2px;width: 44px;height: 20px;text-align: center;margin-top: 10px;margin-right: 14px;line-height: 18px;cursor: pointer;}
.ej-main .ej-content .ej-content-title .ej-content-black p{font-size: 12px;color: #4F5A64;}
.ej-main .ej-content .ej-content-main{background-color: #f9fafc;height: 754px;}
.ej-main .ej-content .ej-content-operation{background-color: #f9fafc;height:63px;text-align: center;padding-top: 30px;}
.ej-main .ej-content .ej-content-operation div{display: inline-block;margin-right: 14px;width: 80px;height: 28px;background: #F9FAFC;border: 1px solid #E1E7ED;border-radius: 1px;cursor: pointer;}
.ej-main .ej-content .ej-content-operation div p{line-height: 28px;font-size: 14px; color: #6C7883;}
.ej-main .ej-content .ej-content-operation .submit{background-color: #00C187;}
.ej-main .ej-content .ej-content-operation .submit p{color: #FFFFFF;}
.ej-main .ej-content .ej-content-operation .refuse{background-color: #D89D00;}
.ej-main .ej-content .ej-content-operation .refuse p{color: #FFFFFF;}
.ej-main .ej-content .ej-content-operation .reset{background-color: #8A94A2;}
.ej-main .ej-content .ej-content-operation .reset p{color: #FFFFFF;}
.ej-main .ej-content .ej-content-operation .cancel{background: #F9FAFC;border: 1px solid #E1E7ED;}
.ej-main .ej-content .ej-content-operation .cancel p{color: #6C7883;}
@media screen and (max-width:1366px){.ej-main .ej-content .ej-content-main{background-color: #f9fafc;height:450px;}} */

</style>
<style>
  .ej-content-scrollbar {
    height: 100%;
  }

  .ej-content-scrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }

</style>
