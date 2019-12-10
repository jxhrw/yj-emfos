<template>
  <div class="operation-info">
    <div class="operation-main" v-show="isShow">
      <div class="operation-title">
        <label for>反馈操作</label>
        <span class="complete" :class="{active:isActive==1}" @click="changeActive(1)">维修完成</span>
        <span class="progress" :class="{active:isActive==2}" @click="changeActive(2)">进度反馈</span>
        <span class="defer" :class="{active:isActive==3}" @click="changeActive(3)">延期申请</span>
        <i class="close" @click="close">X</i>
      </div>
      <div class="operation-content">
        <div class="complete-content" v-show="isActive!=3">
          <el-row class="content-row-select">
            <el-col :span="9">
              <label>故障类型</label>
              <el-select
                v-model="failureTypeCode"
                placeholder="请选择"
                size="mini"
                class="content-select"
                @change="changeFailureType"
              >
                <el-option
                  v-for="item in options_Repdevtype"
                  :key="item.dicCode"
                  :label="item.dicName"
                  :value="item.dicCode"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="9">
              <label>设备状态</label>
              <el-select
                v-model="select_DevStatus"
                placeholder="请选择"
                size="mini"
                class="content-select"
                @change="changeDevStatus"
              >
                <el-option
                  v-for="item in devStatusList"
                  :key="item.dicCode"
                  :label="item.dicName"
                  :value="item.dicCode"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="content-row-select">
            <el-col :span="9">
              <label class="content-label">故障描述</label>
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                class="content-textarea"
                v-model="failureReason"
              ></el-input>
            </el-col>
            <el-col :span="9">
              <label class="content-label">结果反馈</label>
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                class="content-textarea"
                v-model="operExplain"
              ></el-input>
            </el-col>
          </el-row>
          <el-row class="content-row-explain content-row-first">
            <el-col :span="24" class="content-row-img">
              <label>图片上传</label>
              <template v-for="(item,index) in imgFiles">
                <div
                  class="img-preview"
                  @mouseenter="enter(index)"
                  @mouseleave="leave()"
                  :key="index"
                >
                  <img :src="item.mappingAddress" width="100%" height="auto" alt>
                  <div class="img-del" v-show="seen&&index==current" @click="delImg(index)">
                    <p>删除</p>
                  </div>
                </div>
              </template>
              <div class="img-add" @click="$refs.imgFile.click()">
                <img src="../../assets/images/icon-upload.png" width="24" height="24" alt>
                <input
                  type="file"
                  name
                  id="imgFile"
                  style="display:none"
                  ref="imgFile"
                  @change="upload('imgFile')"
                  multiple="multiple"
                >
              </div>
            </el-col>
          </el-row>
          <div class="ej-content-operation">
            <div class="submit" @click="fackbackWorkorders">
              <p>提交</p>
            </div>
            <div class="cancel" @click="close">
              <p>取消</p>
            </div>
          </div>
        </div>
        <div class="complete-content" v-show="isActive==3">
          <el-row class="content-row-select">
            <el-col :span="24">
              <label class="content-label-fix">申请完成时间</label>
                <el-date-picker
                  style="margin-left: 84px;width: 300px;"
                  v-model="deadlineDate"
                  type="date"
                  size='mini'
                  placeholder="选择日期">
                </el-date-picker>
            </el-col>
          </el-row>
          <el-row class="content-row-select">
            <el-col :span="24">
              <label class="content-label-fix">延期原因</label>
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                class="content-textarea-fix"
                v-model="operReason"
              ></el-input>
            </el-col>
          </el-row>
          <div class="ej-content-operation operation-fix">
            <div class="submit" @click="postponeWorkorders">
              <p>提交</p>
            </div>
            <div class="cancel" @click="close">
              <p>取消</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="operation-btn" @click="open" v-show="!isShow">
      <span>反馈操作</span>
    </div>
  </div>
</template>
<script>
import Common from "@/assets/js/common.js";
export default {
  data() {
    return {
      token: "",
      workordersInfo: {},
      failureTypeCode: "",
      failureTypeName: "",
      options_Repdevtype: [],
      select_DevStatus: "",
      devStatusList: [],
      failureReason: "",
      operExplain: "",
      seen: false,
      isOver: 0,
      imgFiles: [],
      imgFileList: [],
      isActive: 1,
      isShow: false,
      deadlineDate: '',
      operReason: ''
    };
  },
  mounted() {
    this.token = Common.getQueryString("token");
    this.workordersInfo = JSON.parse(sessionStorage.getItem("workordersInfo"));
    this.getRepdevtype(this.workordersInfo.devTypeCode);
    this.getDicInfo("DEVICEALLSTATUS").then(res => {
      if (res.appCode == 0) {
        this.devStatusList = res.resultList;
      }
    });
  },
  methods: {
    changeActive(num) {
      this.isActive = num;
      switch (num) {
        case 1:
          this.isOver = 1;
          break;
        case 2:
          this.isOver = 0;
          break;
        case 3:
          this.isOver = 0;
          break;
        default:
          break;
      }
    },
    // 反馈接口
    fackbackWorkorders() {
      var url =
        this.$config.efoms_HOST +
        '/workordersRecord/fackbackWorkorders';
      var header = {
        token: this.token
      };
      this.$api
        .put(
          url,
          {
            token: this.token,
            workordersId: this.workordersInfo.workordersId,
            failureTypeCode: this.failureTypeCode,
            failureTypeName: this.failureTypeName,
            failureReason: this.failureReason,
            operExplain: this.operExplain,
            fileInfoList: this.imgFileList,
            isOver: this.isOver
          },
          header
        )
        .then(res => {
          if (res.appCode == 0) {
            this.options_Repairsource = res.resultList;
          } else {
            Common.printErrorLog(this.$config.ubms_HOST, '/DeviceDic/getDeviceDic.htm');
          }
        })
        .catch(err => {
          Common.printErrorLog(this.$config.ubms_HOST, '/DeviceDic/getDeviceDic.htm');
          console.log(err);
        });
    },
    // 延期接口
    postponeWorkorders() {
      var url =
        this.$config.efoms_HOST +
        '/workordersRecord/postponeWorkorders';
      var header = {
        token: this.token
      };
      this.$api
        .put(
          url,
          {
            token: this.token,
            workordersId: this.workordersInfo.workordersId,
            deadlineDate: this.deadlineDate,
            operExplain: this.operReason
          },
          header
        )
        .then(res => {
          if (res.appCode == 0) {
            this.options_Repairsource = res.resultList;
          } else {
            Common.printErrorLog(this.$config.ubms_HOST, '/DeviceDic/getDeviceDic.htm');
          }
        })
        .catch(err => {
          Common.printErrorLog(this.$config.ubms_HOST, '/DeviceDic/getDeviceDic.htm');
          console.log(err);
        });
    },
    getDicInfo(parentCode) {
      var url =
        this.$config.ubms_HOST + '/DeviceDic/getDeviceDic.htm';
      var header = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      return this.$api.get(
        url,
        { token: this.token, data: JSON.stringify({ parentCode: parentCode }) },
        header
      );
    },
    getRepdevtype(selectRepdevcategory) {
      var url =
        this.$config.ubms_HOST + '/DeviceDic/getDeviceDic.htm';
      var header = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      this.$api
        .get(
          url,
          {
            token: this.token,
            data: JSON.stringify({
              parentCode: selectRepdevcategory
            })
          },
          header
        )
        .then(res => {
          if (res.appCode == 0) {
            this.options_Repdevtype = res.resultList;
          } else {
            Common.printErrorLog(this.$config.ubms_HOST, '/DeviceDic/getDeviceDic.htm');
          }
        })
        .catch(err => {
          Common.printErrorLog(this.$config.ubms_HOST, '/DeviceDic/getDeviceDic.htm');
          console.log(err);
        });
    },
    changeFailureType(val) {
      this.options_Repdevtype.forEach(e => {
        if (e.dicCode == val) {
          this.failureTypeName = e.dicName; // 传输设备类型名称
        }
      });
    },
    changeDevStatus(val) {
      this.devStatusList.forEach(e => {
        if (e.dicCode == val) {
        }
      });
    },
    open() {
      this.isShow = true;
    },
    close() {
      this.isShow = false;
    },
    upload(fileId) {
      var formData = new FormData();
      var file = document.getElementById(fileId).files[0];
      formData.append("file", file);
      var url =
        this.$config.efoms_HOST + '/file/uploadFile';
      var header = {
        "Content-Type": "application/x-www-form-urlencoded",
        token: this.token
      };
      this.$api
        .post(url, formData, header)
        .then(res => {
          if (res.appCode == 0) {
            switch (fileId) {
              case "imgFile":
                this.imgFiles.push(res.resultList);
                this.imgFileList.push({
                  fileName: file.name,
                  fileURL: res.resultList.downloadPath,
                  fileMode: file.name
                    .slice(file.name.lastIndexOf(".") + 1)
                    .toLowerCase()
                });
                break;
              case "otherFile":
                break;
              default:
                break;
            }
          } else {
            Common.printErrorLog(this.$config.ubms_HOST, '/file/uploadFile');
          }
        })
        .catch(err => {
          Common.printErrorLog(this.$config.ubms_HOST, '/file/uploadFile');
          console.log(err);
        });
    },
    delFiles(e) {
      var url =
        this.$config.efoms_HOST + '/file/deleteFile';
      var header = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      this.$api
        .delete(
          url,
          {
            token: this.token,
            secondDir: e.secondDir,
            fileName: e.fileName
          },
          header
        )
        .then(res => {
          if (res.appCode == 0) {
          } else {
            Common.printErrorLog(this.$config.efoms_HOST, '/file/deleteFile');
          }
        })
        .catch(err => {
          Common.printErrorLog(this.$config.efoms_HOST, '/file/deleteFile');
          console.log(err);
        });
    },
    enter(index) {
      this.seen = true;
      this.current = index;
    },
    leave() {
      this.seen = false;
      this.current = null;
    },
    delImg(index) {
      var files = [];
      this.imgFiles.forEach((e, i) => {
        if (i != index) {
          files.push(e);
        } else {
          this.delFiles(e);
          this.imgFileList.splice(index, 1);
        }
      });
      this.imgFiles = files;
    }
  }
};
</script>
<style scoped>
.operation-info{position: absolute;bottom: 0px;background: #FFFFFF;box-shadow: 0 -2px 10px 0 rgba(99,132,131,0.30);border-radius: 2px;left: 166px;right: 14px;}
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
.operation-info .operation-main .operation-content{height: 254px;border-top: 1px solid #80D1B3;margin-left: 37px;margin-right: 62px;}
.operation-info .operation-main .operation-content .complete-content{margin-top: 20px;}
.operation-info .operation-main .operation-content .complete-content .content-row-select{margin-top: 10px;}
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
.operation-info .operation-main .operation-content .complete-content .content-textarea-fix {width: 300px;margin-left: 84px;}
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
.operation-info .operation-main .operation-content .complete-content .ej-content-operation .cancel{background: #F9FAFC;border: 1px solid #E1E7ED;border-radius: 1px;float: left;}
.operation-info .operation-main .operation-content .complete-content .ej-content-operation .cancel p{color: #6C7883;}
</style>
<style>
.operation-info .operation-main .operation-content .complete-content .content-select .el-input__inner {border-radius: 0;background: #f9fafc;border: 1px solid #e1e7ed;}
.operation-info .operation-main .operation-content .complete-content .content-select .el-input__suffix {border-left: 1px solid #e1e7ed;}
.operation-info .operation-main .operation-content .complete-content .content-select .content-textarea .el-textarea__inner{border-radius: 0;background: #F9FAFC;border: 1px solid #E1E7ED;}
</style>
