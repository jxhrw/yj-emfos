<template>
  <div class="depiction-info">
    <div class="title">
      <h3>{{title}}</h3>
    </div>
    <div class="content">
      <el-row class="content-row-select" v-if='isShow_Repdevtype'>
        <el-col :span="9">
          <i style="color:red;padding-top: 6px;float: left;position: relative;width: 0;left: -8px;">*</i>
          <label>故障类型</label>
          <el-select v-model="select_Repdevtype" placeholder="请选择" size='mini' class="content-select"
            @change='changeFailureType'>
            <el-option v-for="item in options_Repdevtype" :key="item.dicCode" :label="item.dicName"
              :value="item.dicCode">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="content-row-select">
        <el-col :span="9">
          <i style="color:red;padding-top: 6px;float: left;position: relative;width: 0;left: -8px;">*</i>
          <label class="content-label">故障描述</label>
          <el-input type="textarea" :rows="3" placeholder="请输入内容" class="content-textarea" v-model="textarea"
            resize="none">
          </el-input>
        </el-col>
      </el-row>
      <el-row class="content-row-explain content-row-first">
        <el-col :span="24" class="content-row-img">
          <label>图片上传</label>
          <viewer :images="imgFiles" style="display:flex;" @click.native='showImg'>
            <template v-for="(item,index) in imgFiles">
              <div class="img-preview" @mouseenter="enter(index)" @mouseleave="leave()" :key="index">
                <img :src="item.mappingAddress" width="100%" height="auto" alt="">
                <div class="img-del" v-show="seen&&index==current" @click="delImg(index)">
                  <p>删除</p>
                </div>
              </div>
            </template>
          </viewer>
          <div class="img-add" @click="$refs.imgFile.click()">
            <img src="../../assets/images/icon-upload.png" width="24" height="24" alt="">
            <input type="file" name="" id="imgFile" style="display:none" ref="imgFile" @change="upload('imgFile')"
              multiple="multiple">
          </div>
        </el-col>
      </el-row>
      <el-row class="content-row-explain">
        <el-col :span="24">
          <label>附件上传</label>
          <span class="file-add" @click="$refs.otherFile.click()">添加附件</span>
          <input type="file" name="" id="otherFile" style="display:none" ref="otherFile" @change="upload('otherFile')"
            multiple="multiple">
          <div class="file-explain">
            <template v-for="(item,index) in otherFiles">
              <div class="file-preview" :key="index">
                <span class="file-name" @click="download(item)">{{item.fileOldName | stringLength}}</span>
                <span class="file-del" @click="delFile(index)">删除</span>
              </div>
            </template>
          </div>
          <div class="file-explain">每个附件不得超过8M。</div>
          <!-- 支持格式：jpg.bmp.png.rar.zip.doc.docx.pdf.xls.xlsx... -->
        </el-col>
      </el-row>
      <el-row class="content-row-select">
        <el-col :span="9">
          <label>报修来源</label>
          <el-select v-model="select_Repairsource" placeholder="请选择" size='mini' class="content-select"
            @change='changeRepSource'>
            <el-option v-for="item in options_Repairsource" :key="item.dicCode" :label="item.dicName"
              :value="item.dicCode">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="9">
          <label>报修人员</label>
          <el-select v-model="repPersonId" placeholder="请选择" size='mini' class="content-select"
            @change='changePersonList'>
            <el-option v-for="item in personList" :key="item.personId" :label="item.personName" :value="item.personId">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="content-row-select  content-row-bottom">
        <el-col :span="9">
          <label>报修单位</label>
          <el-select v-model="repDeptId" placeholder="请选择" size='mini' class="content-select" @change='changeDeptList'>
            <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="9">
          <label>联系电话</label>
          <el-input v-model="repPersonTel" placeholder="请输入" size='mini' class="content-select"></el-input>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import Bus from "@/assets/js/bus.js";
  import Common from "@/assets/js/common.js";
  export default {
    filters: {
      stringLength: value => {
        let str = value;
        if (value.length > 20) {
          str = str.substring(0, 19) + "...";
        }
        return str;
      }
    },
    data() {
      return {
        title: "故障描述",
        token: "",
        options_Repdevtype: [],
        select_Repdevtype: "",
        options_Repairsource: [],
        select_Repairsource: "",
        textarea: "",
        isShow_Repdevtype: true,
        imgFiles: [],
        otherFiles: [],
        deptList: [],
        repDeptId: "",
        personList: [],
        repPersonId: "",
        contactPerson: "",
        contactPersonDept: "",
        repPersonTel: "",
        seen: false,
        current: 0,
        imgFileList: [],
        otherFileList: [],
        fileInfoList: []
      };
    },
    mounted() {
      this.token = Common.getQueryString("token");
      this.getRepairsource();
      this.getDeptInfo('610100000000').then(res => {
        if (res.appCode == 0) {
          this.deptList = res.resultList;
        }
      });
      this.getPersonInfo('610100000000').then(res => {
        if (res.appCode == 0) {
          this.personList = res.resultList;
        }
      });
      Bus.$on("select_Devicecategory", value => {
        this.options_Repdevtype = [];
        this.select_Repdevtype = "";
        Bus.$emit("failureType", {
          failureTypeCode: "",
          failureTypeName: ""
        }); // 传输故障类型
        if (value == "REPDEVCATEGORY01") {
          this.isShow_Repdevtype = true;
        } else if (value == "REPDEVCATEGORY02") {
          this.isShow_Repdevtype = true;
        }
      });
      Bus.$on("select_Repdevcategory", value => {
        this.options_Repdevtype = [];
        this.select_Repdevtype = "";
        Bus.$emit("failureType", {
          failureTypeCode: "",
          failureTypeName: ""
        }); // 传输故障类型
        if (value != "") {
          this.getRepdevtype(value);
        }
      });
      // 重置操作
      Bus.$on("resetRepair", value => {
        this.textarea = "";
        this.select_Repairsource = "";
        this.imgFiles = [];
        this.otherFiles = [];
        this.contactPerson = "";
        this.repPersonTel = "";
        this.imgFileList = [];
        this.otherFileList = [];
        this.fileInfoList = [];
      });
    },
    watch: {
      repDeptId(newVal, oldVal) {
        Bus.$emit("repDeptId", newVal); // 传输报修联系人
      },
      repPersonId(newVal, oldVal) {
        Bus.$emit("repPersonId", newVal); // 传输报修联系人
      },
      textarea(newVal, oldVal) {
        Bus.$emit("failureDescrible", newVal); // 传输故障描述
      },
      repPersonTel(newVal, oldVal) {
        Bus.$emit("repPersonTel", newVal); // 传输报修联系人电话
      },
      contactPersonDept(newVal, oldVal) {
        Bus.$emit("contactPersonDept", newVal); // 传输报修联系人电话
      },
      imgFileList(newVal, oldVal) {
        this.fileInfoList = newVal.concat(this.otherFileList);
      },
      otherFileList(newVal, oldVal) {
        this.fileInfoList = newVal.concat(this.imgFileList);
      },
      fileInfoList(newVal, oldVal) {
        Bus.$emit("fileInfoList", newVal); // 传输文件合集
      }
    },
    methods: {
      showImg() {
        setTimeout(() => {
          var arr = document.getElementsByClassName("viewer-in");
          for (let i = 0; i < arr.length; i++) {
            arr[i].classList.remove("viewer-hide");
          }
        }, 500);
      },
      changeDeptList(val) {
        this.deptList.forEach(e => {
          if (e.deptId == val) {
            Bus.$emit("repDeptName", e.deptName); // 传输联系人名称
          }
        });
      },
      changePersonList(val) {
        this.personList.forEach(e => {
          if (e.personId == val) {
            Bus.$emit("repPersonName", e.personName); // 传输运维部门
          }
        });
      },
      changeFailureType(val) {
        this.options_Repdevtype.forEach(e => {
          if (e.dicCode == val) {
            Bus.$emit("failureType", e); // 传输故障类型
          }
        });
      },
      changeRepSource(val) {
        this.options_Repairsource.forEach(e => {
          if (e.dicCode == val) {
            Bus.$emit("repSource", e); // 传输故障类型
          }
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
      },
      delFile(index) {
        var files = [];
        this.otherFiles.forEach((e, i) => {
          if (i != index) {
            files.push(e);
          } else {
            this.delFiles(e);
            this.otherFileList.splice(index, 1);
          }
        });
        this.otherFiles = files;
      },
      download(e) {
        window.open(e.downloadPath);
      },
      getDeptInfo(parentCode) {
        var url =
          this.$config.ubms_HOST + this.$config.getDeptInfo_GET;
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
      getPersonInfo(deptId) {
        var url =
          this.$config.ubms_HOST + this.$config.getPersonInfo_GET;
        var header = {
          "Content-Type": "application/x-www-form-urlencoded"
        };
        return this.$api.get(url, {
          token: this.token,
          data: JSON.stringify({
            deptId: deptId
          })
        }, header);
      },
      getRepairsource() {
        var url =
          this.$config.ubms_HOST + this.$config.getDeviceDic_GET;
        var header = {
          "Content-Type": "application/x-www-form-urlencoded"
        };
        this.$api
          .get(
            url, {
              token: this.token,
              data: JSON.stringify({
                parentCode: "REPAIRSOURCE"
              })
            },
            header
          )
          .then(res => {
            if (res.appCode == 0) {
              this.options_Repairsource = res.resultList;
            } else {
              Common.printErrorLog(this.$config.ubms_HOST, this.$config.getDeviceDic_GET);
            }
          })
          .catch(err => {
            Common.printErrorLog(this.$config.ubms_HOST, this.$config.getDeviceDic_GET);
            console.log(err);
          });
      },
      getRepdevtype(selectRepdevcategory) {
        var url =
          this.$config.ubms_HOST + this.$config.getDeviceDic_GET;
        var header = {
          "Content-Type": "application/x-www-form-urlencoded"
        };
        this.$api
          .get(
            url, {
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
              Common.printErrorLog(this.$config.ubms_HOST, this.$config.getDeviceDic_GET);
            }
          })
          .catch(err => {
            Common.printErrorLog(this.$config.ubms_HOST, this.$config.getDeviceDic_GET);
            console.log(err);
          });
      },
      upload(fileId) {
        var formData = new FormData();
        var file = document.getElementById(fileId).files[0];
        formData.append("file", file);
        var url =
          this.$config.efoms_HOST + this.$config.uploadFile_POST;
        var flag = false;
        switch (fileId) {
          case "imgFile":
            if (/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(file.name)) {
              flag = true;
            } else {
              Common.ejMessage("warning", "图片限于png,gif,jpeg,jpg格式");
            }
            break;
          case "otherFile":
            flag = true;
            break;
          default:
            break;
        }
        if (!flag) return;
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
                  this.otherFiles.push(res.resultList);
                  this.otherFileList.push({
                    fileName: file.name,
                    fileURL: res.resultList.downloadPath,
                    fileMode: file.name
                      .slice(file.name.lastIndexOf(".") + 1)
                      .toLowerCase()
                  });
                  break;
                default:
                  break;
              }
            } else {
              Common.printErrorLog(this.$config.ubms_HOST, this.$config.getDeviceDic_GET);
            }
          })
          .catch(err => {
            Common.printErrorLog(this.$config.ubms_HOST, this.$config.getDeviceDic_GET);
            console.log(err);
          });
      },
      delFiles(e) {
        var url =
          this.$config.efoms_HOST + this.$config.deleteFile_GET;
        var header = {
          "Content-Type": "application/x-www-form-urlencoded"
        };
        this.$api
          .delete(
            url, {
              token: this.token,
              secondDir: e.secondDir,
              fileName: e.fileName
            },
            header
          )
          .then(res => {
            if (res.appCode == 0) {} else {
              Common.printErrorLog(this.$config.efoms_HOST, this.$config.deleteFile_GET);
            }
          })
          .catch(err => {
            Common.printErrorLog(this.$config.efoms_HOST, this.$config.deleteFile_GET);
            console.log(err);
          });
      }
    }
  };

</script>
<style scoped>
  .depiction-info {
    margin: 14px 14px 0px 14px;
    background: #FFFFFF;
    border: 1px solid #E4EAEE;
    border-radius: 2px;
  }

  .depiction-info .title {
    height: 36px;
    border-bottom: 1px solid #EBEFF1;
    margin: 0 58px 0 40px;
  }

  .depiction-info .title::before {
    content: '';
    position: relative;
    left: -41px;
    top: 10px;
    border-left: 2px solid #00C187;
  }

  .depiction-info .title h3 {
    font-size: 14px;
    color: #22262E;
    line-height: 0px;
  }

  .depiction-info .content {
    padding-top: 5px;
    padding-left: 40px;
  }

  .depiction-info .content .content-row-select {
    margin-top: 10px;
  }

  .depiction-info .content .content-row-explain {
    font-size: 12px;
    line-height: 12px;
    margin-bottom: 25px;
  }

  .depiction-info .content .content-row-explain.content-row-first {
    margin-top: 16px;
    margin-bottom: 15px;
  }

  .depiction-info .content .content-row-select.content-row-bottom {
    margin-bottom: 20px;
  }

  .depiction-info .content .content-row-select .linkman-explain {
    position: absolute;
    color: #A3B1B9;
    font-size: 12px;
    padding: 10px 0 0 64px;
  }

  .depiction-info .content label {
    color: #4F5A64;
    display: inline-block;
    width: 48px;
    font-size: 12px;
    margin-right: 12px;
    text-align: right;
  }

  .depiction-info .content span {
    font-size: 12px;
    color: #737E84;
  }

  .depiction-info .content .content-select {
    width: 300px;
  }

  .depiction-info .content .content-row-select .content-textarea {
    width: 300px;
    margin-left: 65px;
  }

  .depiction-info .content .content-row-select .content-label {
    position: absolute;
    top: 8px;
  }

  .depiction-info .content .content-row-img {
    font-size: 12px;
    line-height: 12px;
    display: flex;
  }

  .depiction-info .content .content-row-img label {
    line-height: 30px;
  }

  .depiction-info .content .content-row-explain .img-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    margin-left: 6px;
    margin-right: 10px;
    background: #FFFFFF;
    border: 1px solid #E1E7ED;
  }

  .depiction-info .content .content-row-explain .img-preview .img-del {
    opacity: 0.62;
    background: #7A7A7A;
    width: 50px;
    height: 15px;
    position: absolute;
    bottom: 1px;
  }

  .depiction-info .content .content-row-explain .img-preview .img-del p {
    font-size: 10px;
    color: #FFFFFF;
    text-align: center;
    cursor: pointer;
    ;
  }

  .depiction-info .content .content-row-explain .img-add {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    margin-left: 6px;
    margin-right: 10px;
    background: #FFFFFF;
    border: 1px solid #E1E7ED;
    cursor: pointer;
  }

  .depiction-info .content .file-add {
    color: #6BA1EB;
    cursor: pointer;
    margin-right: 5px;
  }

  .depiction-info .content .file-preview {
    display: inline-block;
    margin-right: 20px;
  }

  .depiction-info .content .file-preview .file-name {
    float: left;
    margin-right: 5px;
    cursor: pointer;
  }

  .depiction-info .content .file-preview .file-del {
    color: #6BA1EB;
    cursor: pointer;
  }

  .depiction-info .content .file-explain {
    margin: 10px 0px 0px 63px;
    color: #A3B1B9;
  }

</style>
<style>
  .depiction-info .content .content-select .el-input__inner {
    border-radius: 0;
    background: #F9FAFC;
    border: 1px solid #E1E7ED;
  }

  .depiction-info .content .content-select .el-input__suffix {
    border-left: 1px solid #E1E7ED;
  }

  .depiction-info .content .content-row-select .content-textarea .el-textarea__inner {
    border-radius: 0;
    background: #F9FAFC;
    border: 1px solid #E1E7ED;
  }

</style>
