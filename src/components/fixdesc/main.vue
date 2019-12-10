<template>
  <div class="ej-main">
    <EJ-Menu></EJ-Menu>
    <div class="ej-content">
      <div class="ej-content-title">
        <h2>{{title}}</h2>
        <div>
          <div v-if="workordersStatusCode=='ORDERSSTATUS02' && type!=null" class="ej-content-title-btn ej-content-green"
            @click="showUrge">
            <p>催办</p>
          </div>
          <div v-if="workordersStatusCode=='ORDERSSTATUS01' && type!=null"
            class="ej-content-title-btn ej-content-yellow" @click="showRevoke">
            <p>撤销</p>
          </div>
          <div class="ej-content-title-btn ej-content-black" @click="goBack">
            <p>返回</p>
          </div>
        </div>
      </div>
      <div class="ej-content-main">
        <el-scrollbar class="ej-content-scrollbar">
          <EJ-BaseInfo></EJ-BaseInfo>
          <EJ-Depiction></EJ-Depiction>
        </el-scrollbar>
      </div>
      <EJ-Operation
        v-show="(workordersStatusCode=='ORDERSSTATUS02'||workordersStatusCode=='ORDERSSTATUS05')&&type=='opex'">
      </EJ-Operation><!-- 反馈操作 -->
      <EJ-Operation1
        v-show="(workordersStatusCode=='ORDERSSTATUS03'||workordersStatusCode=='ORDERSSTATUS04')&&type=='fixm'">
      </EJ-Operation1><!-- 确认操作 -->
      <EJ-Operation2 v-show="workordersStatusCode=='ORDERSSTATUS02'&&isDefer&&type=='fixm'"></EJ-Operation2>
      <!-- 延期审核操作 -->
      <EJ-Operation3 v-show="workordersStatusCode=='ORDERSSTATUS06'&&type=='fixm'"></EJ-Operation3><!-- 评价操作 -->
      <el-dialog title="报修催办" :visible.sync="dialogUrgeVisible" width='400px' class="dialog-urge">
        <div class="dialog-main">
          <label class="dialog-label">催办原因</label>
          <textarea rows="8" cols="40" placeholder="请输入" class="dialog-content" v-model="operExplain"></textarea>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="pressWorkorders" size='mini' class="submit">提 交</el-button>
          <el-button @click="dialogUrgeVisible = false" size='mini' class="cancel">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="撤销申请" :visible.sync="dialogRevokeVisible" width='400px' class="dialog-urge">
        <div class="dialog-main">
          <div class="revoke-reason">
            <label class="dialog-label">撤销原因</label>
            <el-select v-model="selectCancelReasonCode" placeholder="请选择" size='mini' class="content-select">
              <el-option v-for="item in cancelReasonList" :key="item.dicCode" :label="item.dicName"
                :value="item.dicCode">
              </el-option>
            </el-select>
          </div>
          <div>
            <label class="dialog-label">备注</label>
            <textarea rows="8" cols="40" placeholder="请输入" class="dialog-content"
              v-model="operExplain4Cancel"></textarea>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="cancelWorkorders" size='mini' class="submit">提 交</el-button>
          <el-button @click="dialogRevokeVisible = false" size='mini' class="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import Menu from "components/common/menu";
  import Operation from "components/fixdesc/operation";
  import Operation1 from "components/fixdesc/operation1";
  import Operation2 from "components/fixdesc/operation2";
  import Operation3 from "components/fixdesc/operation3";
  import BaseInfo from "components/fixdesc/baseInfo";
  import Depiction from "components/fixdesc/depiction";
  import Common from "@/assets/js/common.js";
  import Bus from "@/assets/js/bus.js";
  export default {
    components: {
      "EJ-Menu": Menu,
      "EJ-BaseInfo": BaseInfo,
      "EJ-Depiction": Depiction,
      "EJ-Operation": Operation,
      "EJ-Operation1": Operation1,
      "EJ-Operation2": Operation2,
      "EJ-Operation3": Operation3
    },
    data() {
      return {
        title: "工单详情",
        token: '',
        type: '',
        dialogUrgeVisible: false,
        dialogRevokeVisible: false,
        operExplain: '',
        selectCancelReasonCode: '',
        selectCancelReasonName: '',
        operExplain4Cancel: '',
        cancelReasonList: [],
        workordersStatusCode: '',
        workordersId: '',
        isDefer: false
      };
    },
    mounted() {
      this.token = Common.getQueryString("token");
      this.type = Common.getQueryString("type");
      var workordersInfo = JSON.parse(sessionStorage.getItem("workordersInfo"));
      this.workordersStatusCode = workordersInfo.workordersStatusCode;
      this.workordersId = workordersInfo.workordersId;
      this.isDefer = workordersInfo.isDefer;
      this.getDicInfo('CANCELREASON').then(res => {
        if (res.appCode == 0) {
          this.cancelReasonList = res.resultList;
        }
      });
    },
    watch: {
      selectCancelReasonCode(newVal, oldVal) {
        if (newVal != "") {
          this.cancelReasonList.forEach(item => {
            if (newVal == item.dicCode) {
              this.selectCancelReasonName = item.dicName;
            }
          });
        } else {
          this.selectCancelReasonName = '';
        }
      }
    },
    methods: {
      pressWorkorders() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        var url =
          this.$config.efoms_HOST + this.$config.pressWorkorders_GET;
        var header = {
          "Content-Type": "application/x-www-form-urlencoded",
          token: this.token
        };
        this.$api
          .putByQs(
            url, {
              workordersId: this.workordersId,
              operExplain: this.operExplain
            },
            header
          )
          .then(res => {
            this.dialogUrgeVisible = false;
            loading.close();
            if (res.appCode == 0) {
              Common.ejMessage("success");
              this.dataDetail();
            } else {
              this.$message.error('催办失败，请稍后重试！');
              Common.printErrorLog(this.$config.efoms_HOST, this.$config.pressWorkorders_GET);
            }
          })
          .catch(err => {
            this.dialogUrgeVisible = false;
            loading.close();
            Common.printErrorLog(this.$config.efoms_HOST, this.$config.pressWorkorders_GET);
            console.log(err);
          });
      },
      cancelWorkorders() {
        if (this.selectCancelReasonCode == '') {
          return this.$message.error('请选择撤销原因');
        }
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        var url =
          this.$config.efoms_HOST + this.$config.cancelWorkorders_GET;
        var header = {
          "Content-Type": "application/x-www-form-urlencoded",
          token: this.token
        };
        this.$api
          .putByQs(
            url, {
              workordersId: this.workordersId,
              operExplain: this.operExplain4Cancel,
              operReasonCode: this.selectCancelReasonCode,
              operReasonName: this.selectCancelReasonName
            },
            header
          )
          .then(res => {
            this.dialogRevokeVisible = false;
            loading.close();
            if (res.appCode == 0) {
              Common.ejMessage("success");
            } else {
              this.$message.error('撤销失败，请稍后重试！');
              Common.printErrorLog(this.$config.efoms_HOST, this.$config.cancelWorkorders_GET);
            }
          })
          .catch(err => {
            this.dialogRevokeVisible = false;
            loading.close();
            Common.printErrorLog(this.$config.efoms_HOST, this.$config.cancelWorkorders_GET);
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
      showRevoke() {
        // if (this.workordersStatusCode == 'ORDERSSTATUS07' || this.workordersStatusCode == 'ORDERSSTATUS08') {
        //   return this.$message.error('该数据已撤销或已完结');
        // }
        if (this.workordersStatusCode != 'ORDERSSTATUS01') {
          return this.$message.error('该数据不是待派发数据');
        }
        this.dialogRevokeVisible = true;
      },
      showUrge() {
        if (this.workordersStatusCode != 'ORDERSSTATUS02') {
          return this.$message.error('该数据不是待维修数据');
        }
        this.dialogUrgeVisible = true;
      },
      goBack() {
        switch (Common.getQueryString("type")) {
          case 'opex':
            window.location.href = this.$config.ProjectName + "/opex.html?token=" + this.token;
            break;
          case 'dispatch':
            window.location.href = this.$config.ProjectName + "/fixm.html?type=dispatch&token=" + this.token;
            break;
          case 'fixm':
            window.location.href = this.$config.ProjectName + "/fixm.html?type=fixm&token=" + this.token;
            break;
          default:
            window.history.back();
            break;
        }
      },
      gotoEqpm() {
        window.location.href = this.$config.ProjectName + "/eqpm.html?token=" + this.token;
      },
      dataDetail() {
        var url =
          this.$config.efoms_HOST +
          this.$config.getWorkordersInfoById_GET;
        var header = {
          "Content-Type": "application/x-www-form-urlencoded",
          token: this.token
        };
        this.$api
          .get(url, {
            workordersId: this.workordersId
          }, header)
          .then(res => {
            if (res.appCode == 0) {
              this.operExplain = '';
              sessionStorage.setItem("workordersInfo", JSON.stringify(res.resultList));
              Bus.$emit('workordersInfoUpdate', true);
            } else {
              Common.printErrorLog(this.$config.efoms_HOST, this.$config.getRepairsInfoById_GET);
            }
          })
          .catch(err => {
            Common.printErrorLog(this.$config.efoms_HOST, this.$config.getRepairsInfoById_GET);
            console.log(err);
          });
      }
    }
  };

</script>
<style scoped>
  .ej-main {
    display: flex;
    flex: 1;
    background-color: #f9fafc;
  }

  .ej-main .ej-menu {
    width: 150px;
  }

  .ej-main .ej-content {
    flex: 1;
  }

  .ej-main .ej-content .ej-content-title {
    height: 40px;
    background: #E1E7EB;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }

  .ej-main .ej-content .ej-content-title h2 {
    font-size: 14px;
    color: #1F2129;
    line-height: 18px;
    padding-top: 11px;
    padding-left: 29px;
  }

  .ej-main .ej-content .ej-content-title .ej-content-eqpm {
    background: #0CC1B9;
    border: 1px solid #0CC1B9;
    border-radius: 2px;
    width: 80px;
    height: 20px;
    text-align: center;
    margin-top: 10px;
    margin-right: 14px;
    line-height: 18px;
    cursor: pointer;
  }

  .ej-main .ej-content .ej-content-title .ej-content-eqpm p {
    font-size: 12px;
    color: #FFFFFF;
  }

  .ej-main .ej-content .ej-content-main {
    background-color: #ecf2f1;
    position: absolute;
    top: 40px;
    bottom: 0;
    width: 100%;
  }

  .ej-content-title-btn {
    background: rgba(255, 255, 255, 0.09);
    border: 1px solid;
    border-radius: 2px;
    width: 44px;
    height: 20px;
    text-align: center;
    margin-top: 10px;
    margin-right: 14px;
    line-height: 18px;
    cursor: pointer;
    display: inline-block;
  }

  .ej-content-title-btn p {
    font-size: 12px;
    color: #ffffff;
  }

  .ej-content-green {
    background: #00C187;
    border-color: #00C187;
  }

  .ej-content-yellow {
    background: #D89D00;
    border-color: #D89D00;
  }

  .ej-content-black {
    background: rgba(255, 255, 255, 0.09);
    border-color: #4F5A64;
  }

  .ej-content-black p {
    font-size: 12px;
    color: #4F5A64;
  }

  .dialog-urge .dialog-main {
    margin-top: -30px;
    padding-top: 10px;
    border-top: 1px solid #EBEFF1;
  }

  .dialog-urge .dialog-main .dialog-label {
    float: left;
    font-size: 12px;
    margin-right: 8px;
    width: 48px;
    text-align: right;
    line-height: 28px;
  }

  .dialog-urge .dialog-main .revoke-reason {
    margin-bottom: 13px;
  }

  .dialog-urge .dialog-main .dialog-content {
    background: #F9FAFC;
    border: 1px solid #E1E7ED;
    resize: none;
    box-sizing: border-box;
    width: 303px;
  }

  .dialog-urge .dialog-main .content-select {
    width: 303px;
  }

  .dialog-urge .dialog-footer {
    text-align: center;
  }

  .dialog-urge .dialog-footer .submit {
    margin-right: 20px;
    background: #00C187;
    border-color: #E1E7ED;
  }

  .dialog-urge .dialog-footer .submit:hover {
    background: #00C187;
    border-color: #E1E7ED;
  }

  .dialog-urge .dialog-footer .cancel {
    background: #F9FAFC;
    border-color: #E1E7ED;
    color: #6C7883;
  }

  .dialog-urge .dialog-footer .cancel:hover {
    background: #F9FAFC;
    border-color: #E1E7ED;
    color: #6C7883;
  }

</style>
<style>
  .ej-content-scrollbar {
    height: 100%;
  }

  .ej-content-scrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .dialog-urge .dialog-main .el-input__inner {
    border-radius: 0;
    background: #F9FAFC;
    border: 1px solid #E1E7ED;
  }

  .dialog-urge .dialog-main .el-input__suffix {
    border-left: 1px solid #E1E7ED;
  }

  .dialog-urge .el-dialog__header span {
    font-size: 14px;
    color: #22262E;
    line-height: 19px;
  }

  .dialog-urge .el-dialog__headerbtn {
    top: 24px;
  }

</style>
