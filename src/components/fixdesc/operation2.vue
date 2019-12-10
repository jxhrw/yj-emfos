<template>
  <div class="operation-info">
    <div class="operation-main" v-show="isShow">
      <div class="operation-title">
        <label for>延期审核操作</label>
        <i class="close" @click="close">X</i>
      </div>
      <div class="operation-content">
        <div class="complete-content">
          <el-row class="content-row-select">
            <el-col :span="20">
              <label style="width: 80px;">批准完成时间</label>
             <el-date-picker
                  style="margin-left: 0px;width: 400px;"
                  v-model="deadlineDate"
                  type="date"
                  size='mini'
                  value-format="yyyy-MM-dd hh:mm:ss"
                  placeholder="选择日期">
              </el-date-picker>
            </el-col>
          </el-row>
          <el-row class="content-row-select">
            <el-col :span="20">
              <label style="width: 80px;">审核意见</label>
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                class="content-textarea-fix"
                v-model="operExplain "
                resize="none"
              ></el-input>
            </el-col>
          </el-row>
          <div class="ej-content-operation">
            <div class="submit" @click="checkWorkorders(1)">
              <p>提交</p>
            </div>
            <div class="back" @click="checkWorkorders(0)">
              <p>退回</p>
            </div>
            <div class="cancel" @click="close">
              <p>取消</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="operation-btn" @click="open" v-show="!isShow">
      <span>延期审核操作</span>
    </div>
  </div>
</template>
<script>
import Common from "@/assets/js/common.js";
export default {
  data() {
    return {
      token: "",
      isShow: false,
      workordersInfo: {},
      deadlineDate: '',
      operExplain: ''
    };
  },
  mounted() {
    this.token = Common.getQueryString("token");
    this.workordersInfo = JSON.parse(sessionStorage.getItem("workordersInfo"));
    var postponeList = this.workordersInfo.workordersRecordMap.postponeList;
    if (postponeList.length > 0) {
      this.deadlineDate = postponeList[postponeList.length - 1].deadlineDate;
    }
  },
  methods: {
    // 确认接口
    checkWorkorders(isPass) {
      var url =
        this.$config.efoms_HOST +
        this.$config.checkWorkorders_GET;
      var header = {
        token: this.token
      };
      this.$api
        .putByQs(
          url,
          {
            token: this.token,
            workordersId: this.workordersInfo.workordersId,
            deadlineDate: this.deadlineDate,
            isPass: isPass,
            operExplain: this.operExplain
          },
          header
        )
        .then(res => {
          if (res.appCode == 0) {
            this.options_Repairsource = res.resultList;
            window.location.href = this.$config.ProjectName + "/fixm.html?type=dispatch&token=" + this.token;
          } else {
            Common.printErrorLog(this.$config.efoms_HOST, this.$config.checkWorkorders_GET);
          }
        })
        .catch(err => {
          Common.printErrorLog(this.$config.efoms_HOST, this.$config.checkWorkorders_GET);
          console.log(err);
        });
    },
    open() {
      this.isShow = true;
    },
    close() {
      this.isShow = false;
    }
  }
};
</script>
<style scoped>
.operation-info{position: absolute;bottom: 0px;background: #FFFFFF;box-shadow: 0 -2px 10px 0 rgba(99,132,131,0.30);border-radius: 2px;left: 14px;right: 14px;}
.operation-info .operation-main .operation-title{height: 43px;}
.operation-info .operation-main .operation-title label{font-size: 14px;color: #157745;margin-left: 36px;margin-right: 111px;line-height: 43px;}
.operation-info .operation-main .operation-title span{font-size: 12px;color: #6DB99C;margin-right: 70px;line-height: 43px;cursor: pointer;}
.operation-info .operation-main .operation-title span.active{color: #157745;}
.operation-info .operation-main .operation-title span.active::before{content: '';position: absolute; width: 0px;height: 0px;border: 10px solid #FFFFFF;border-top-color: #FFFFFF;border-bottom-color: transparent;border-right-color: transparent;border-left-color: transparent;top: 43px;left: 223px;z-index: 10;}
.operation-info .operation-main .operation-title span.active::after{content: '';position: absolute; width: 0px;height: 0px;border: 10px solid #80D1B3;border-top-color: #80D1B3;border-bottom-color: transparent;border-right-color: transparent;border-left-color: transparent;top: 44px;left: 223px;}
.operation-info .operation-main .operation-title .complete.active::before{top: 43px;left: 223px;}
.operation-info .operation-main .operation-title .complete.active::after{top: 44px;left: 223px;}
.operation-info .operation-main .operation-title .progress.active::before{top: 43px;left: 344px;}
.operation-info .operation-main .operation-title .progress.active::after{top: 44px;left: 344px;}
.operation-info .operation-main .operation-title .defer.active::before{top: 43px;left: 465px;}
.operation-info .operation-main .operation-title .defer.active::after{top: 44px;left: 465px;}
.operation-info .operation-main .operation-title .close{float: right;line-height: 43px;margin-right: 15px;color: #5B7970;cursor: pointer;}
.operation-info .operation-main .operation-content{height: 91px;margin-left: 37px;margin-right: 62px;}
.operation-info .operation-main .operation-content .complete-content{margin-top: 20px;}
.operation-info .operation-main .operation-content .complete-content .content-row-select{margin-top: 10px;margin-bottom: 15px;}
.operation-info .operation-main .operation-content .complete-content .content-row-explain.content-row-first{margin-top: 16px;margin-bottom: 15px;}
.operation-info .operation-main .operation-content .complete-content .content-row-img{font-size: 12px;line-height: 12px;display: flex;}
.operation-info .operation-main .operation-content .complete-content .content-row-img label{line-height: 30px;}
.operation-info .operation-main .operation-content .complete-content .content-row-explain .img-preview{display:flex;align-items:center; justify-content:center;width: 50px;height: 50px;margin-left: 6px; margin-right: 10px;background: #FFFFFF;border: 1px solid #E1E7ED;}
.operation-info .operation-main .operation-content .complete-content .content-row-explain .img-preview .img-del{opacity: 0.62;background: #7A7A7A;width: 50px;height: 15px;position: absolute;bottom: 1px;}
.operation-info .operation-main .operation-content .complete-content .content-row-explain .img-preview .img-del p{font-size: 10px;color: #FFFFFF;text-align: center;cursor: pointer;;}
.operation-info .operation-main .operation-content .complete-content .content-row-explain .img-add{display:flex;align-items:center; justify-content:center;width: 50px;height: 50px;margin-left: 6px; margin-right: 10px;background: #FFFFFF;border: 1px solid #E1E7ED;cursor: pointer;}
.operation-info .operation-main .operation-content .complete-content .file-add{color: #6BA1EB;cursor: pointer;margin-right: 5px;}
.operation-info .operation-main .operation-content .complete-content .file-preview{display: inline-block;margin-left: 20px;}
.operation-info .operation-main .operation-content .complete-content .file-preview .file-name{float: left;margin-right: 5px;cursor: pointer;}
.operation-info .operation-main .operation-content .complete-content .file-preview .file-del{color: #6BA1EB;cursor: pointer;}
.operation-info .operation-main .operation-content .complete-content .file-explain{margin: 10px 0px 0px 63px;color: #A3B1B9;}
.operation-info .operation-main .operation-content .complete-content label {color: #4f5a64;display: inline-block;width: 48px;font-size: 12px;margin-right: 12px;text-align: right;}
.operation-info .operation-main .operation-content .complete-content span {font-size: 12px;color: #737e84;}
.operation-info .operation-main .operation-content .complete-content .content-select {width: 300px;}
.operation-info .operation-main .operation-content .complete-content .content-textarea {width: 300px;margin-left: 65px;}
.operation-info .operation-main .operation-content .complete-content .content-textarea-fix {width: 400px;}
.operation-info .operation-main .operation-content .complete-content .content-label{ position: absolute;top: 8px;}
.operation-info .operation-main .operation-content .complete-content .content-label-fix{position: absolute;top: 8px; width: 72px;}
.operation-info .operation-btn{position: absolute;width: 120px;height: 42px;right: 100px;bottom: 60px;background: #00C187;box-shadow: 0 6px 26px -5px rgba(20,181,95,0.76);border-radius: 2px;text-align: center;cursor: pointer;}
.operation-info .operation-btn span{font-size: 14px;color: #FFFFFF;line-height: 42px;font-weight: bold;}
.operation-info .operation-btn span::before{content: '';}
.operation-info .operation-main .operation-content .complete-content .ej-content-operation{text-align: center;}
.operation-info .operation-main .operation-content .complete-content .ej-content-operation.operation-fix{margin-top: 83px;}
.operation-info .operation-main .operation-content .complete-content .ej-content-operation div{display: inline-block;margin-right: 14px;width: 80px;height: 28px;background: #F9FAFC;border: 1px solid #E1E7ED;border-radius: 1px;cursor: pointer;}
.operation-info .operation-main .operation-content .complete-content .ej-content-operation div p{line-height: 28px;font-size: 14px; color: #6C7883;}
.operation-info .operation-main .operation-content .complete-content .ej-content-operation .submit{background-color: #00C187;float: left; margin-left: 65px;}
.operation-info .operation-main .operation-content .complete-content .ej-content-operation .submit p{color: #FFFFFF;}
.operation-info .operation-main .operation-content .complete-content .ej-content-operation .back{background-color: #D89D00;float: left;}
.operation-info .operation-main .operation-content .complete-content .ej-content-operation .back p{color: #FFFFFF;}
.operation-info .operation-main .operation-content .complete-content .ej-content-operation .cancel{background: #F9FAFC;border: 1px solid #E1E7ED;border-radius: 1px;float: left;}
.operation-info .operation-main .operation-content .complete-content .ej-content-operation .cancel p{color: #6C7883;}
</style>
<style>
.operation-info .operation-main .operation-content .complete-content .content-select .el-input__inner {border-radius: 0;background: #f9fafc;border: 1px solid #e1e7ed;}
.operation-info .operation-main .operation-content .complete-content .content-select .el-input__suffix {border-left: 1px solid #e1e7ed;}
.operation-info .operation-main .operation-content .complete-content .content-select .content-textarea .el-textarea__inner{border-radius: 0;background: #F9FAFC;border: 1px solid #E1E7ED;}
</style>
