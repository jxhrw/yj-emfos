<template>
  <div class="ej-main">
    <div class="ej-content">
      <div class="ej-content-title">
        <h2>{{title}}</h2>
        <div class="ej-content-black" @click="goBack">
          <p>返回</p>
        </div>
      </div>
      <div class="ej-content-main" style="height: 430px;">
        <el-scrollbar class="ej-content-scrollbar" v-loading="loading"
        element-loading-text="处理中，请稍后……"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
          <div class="base-info">
            <div class="base-attribute">
              <!-- <div class="title">
                <h3>编码属性</h3>
              </div> -->
              <div class="content">
                <el-row class="content-row-select">
                  <el-col :span="8">
                    <label><span><i>*</i>姓名</span></label>
                    <el-input v-model="opsPersonName" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <label><span>性别</span></label>
                    <el-select v-model="genderName" placeholder="" size='mini' class="content-select" :disabled="isReadonly" @change="selectGender">
                      <el-option v-for="item in genderNameList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <label><span>人员类型</span></label>
                    <el-select v-model="personTypeName" placeholder="" size='mini' class="content-select" :disabled="isReadonly" @change="selectPersonType">
                      <el-option v-for="item in personTypeNameList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row class="content-row-select">
                  <el-col :span="8">
                    <label><span>岗位</span></label>
                    <el-input v-model="post" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <label><span>状态</span></label>
                    <el-select v-model="statusName" placeholder="" size='mini' class="content-select" :disabled="isReadonly" @change="selectStatu">
                      <el-option v-for="item in statusNameList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <label><span><i>*</i>所属单位</span></label>
                    <el-select v-model="opsDeptName" placeholder="" size='mini' class="content-select" :disabled="isReadonly" @change="selectDept">
                      <el-option v-for="item in opsDeptNameList" :key="item.opsDeptId" :label="item.opsDeptName" :value="item.opsDeptId">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row class="content-row-select">
                  <el-col :span="8">
                    <label><span>责任警员</span></label>
                    <el-input v-model="dutyPolice" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <label><span>联系电话</span></label>
                    <el-input v-model="phone" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <label><span>邮箱地址</span></label>
                    <el-input v-model="email" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                  </el-col>
                </el-row>
                <el-row class="content-row-select">
                  <el-col :span="12">
                    <label><span>地址</span></label>
                    <el-input v-model="addr" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <label><span>备注</span></label>
                    <el-input v-model="memo" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                  </el-col>
                </el-row>
                <el-row class="content-row-select">
                  <el-col :span="12" class="file-wrap">
                    <label><span>文件信息</span></label>
                    <div class="file-upload-wrap">
                      <el-upload class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                      </el-upload>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>

          <div class="ej-content-operation">
            <div class="submit" v-if="!isReadonly" @click="saveBaseInfo">
              <p>保存</p>
            </div>
            <div class="submit" @click="cancelBaseInfo">
              <p>取消</p>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
import Bus from "@/assets/js/bus.js";
import Common from "@/assets/js/common.js";
import qs from 'qs';
export default {
  data() {
    return {
      title: "修改",
      dialogImageUrl: '',
      dialogVisible: false,
      opsPersonName: '',
      genderName: '',
      personTypeName: '',
      post: '',
      statusName: '',
      opsDeptName: '',
      dutyPolice: '',
      phone: '',
      email: '',
      addr: '',
      memo: '',
      genderNameList: [],
      personTypeNameList: [],
      statusNameList: [],
      opsDeptNameList: [],
      isReadonly: true,
      loading: false,
      fileList: [],
      queryConditions: {},
      genderCode: '',
      personTypeCode: '',
      statusCode: '',
      opsDeptId: '',
      opsPersonId: '',
      rowData: {}
    };
  },
  mounted() {
    this.token = this.$token
    this.isReadonly = Common.getQueryString("type") == "onlyread";
    this.getPreSelect()
    this.rowData = JSON.parse(sessionStorage.getItem('_row'))
  },
  watch: {
    rowData(val, oldVal) {
      this.opsPersonName = val.opsPersonName
      this.genderName = val.genderName
      this.personTypeName = val.personTypeName
      this.post = val.post
      this.statusName = val.statusName
      this.opsDeptName = val.opsDeptName
      this.dutyPolice = val.dutyPolice
      this.phone = val.phone
      this.email = val.email
      this.addr = val.addr
      this.memo = val.memo
      this.opsPersonId = val.opsPersonId
      this.genderCode = val.genderCode
      this.personTypeCode = val.personTypeCode
      this.statusCode = val.statusCode
      this.opsDeptId = val.opsDeptId
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
      sessionStorage.removeItem('_row')
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    saveBaseInfo() {
      let opt1 = !!this.opsPersonName && !!this.opsDeptName
      if (opt1) {
        this.loading = true
        let apiName = this.$config.ubms_HOST + '/OpsPerson/editOpsPersonInfo.htm?token=' + this.token
        this.queryConditions = {
            "opsPersonId": this.opsPersonId,
            "opsPersonName": this.opsPersonName,
            "genderCode": this.genderCode,
            "personTypeCode": this.personTypeCode,
            "post": this.post,
            "statusCode": this.statusCode,
            "opsDeptId": this.opsDeptId,
            "dutyPolice": this.dutyPolice,
            "phone": this.phone,
            "email": this.email,
            "addr": this.addr,
            "memo": this.memo
        }
        let data = {
          data: JSON.stringify(this.queryConditions)
        };
        this.$api
          .post(apiName, qs.stringify(data), {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"})
          .then(res => {
            if (res.appCode === '0' && res.resultList === 1) {
              this.loading = false
              this.$message.success('添加成功!')
              this.opsPersonId = ''
              this.opsPersonName = ''
              this.genderCode = ''
              this.personTypeCode = ''
              this.post = ''
              this.statusCode = ''
              this.opsDeptId = ''
              this.dutyPolice = ''
              this.phone = ''
              this.email = ''
              this.addr = ''
              this.memo = ''
            } else {
              this.loading = false
              this.$message.error('添加失败!')
              console.log('/OpsPerson/editOpsPersonInfo.htm出错');
            }
          })
          .catch(err => {
            this.loading = false
            this.$message.error('添加失败!')
            console.log(err);
          });
      } else {
        this.$message.warning('必填项不能为空!')
      }
    },
    cancelBaseInfo() {
      this.$router.go(-1)
      sessionStorage.removeItem('_row')
    },
    getPreSelect() {
      {
        let apiName = this.$config.ubms_HOST + '/PublicDic/getDicInfo.htm'
        let param = {"parentCode":"OPSPERSONSTATUS"}
        let data = {
          token: this.token,
          data: JSON.stringify(param)
        };
        this.$api
          .get(apiName, data)
          .then(res => {
            if (res.appCode === '0') {
              this.statusNameList = res.resultList
            } else {
              console.log('/PublicDic/getDicInfo.htm出错');
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      {
        let apiName = this.$config.ubms_HOST + '/PublicDic/getDicInfo.htm'
        let param = {"parentCode":"OPSPERSONTYPE"}
        let data = {
          token: this.token,
          data: JSON.stringify(param)
        };
        this.$api
          .get(apiName, data)
          .then(res => {
            if (res.appCode === '0') {
              this.personTypeNameList = res.resultList
            } else {
              console.log('/PublicDic/getDicInfo.htm出错');
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      {
        let apiName = this.$config.ubms_HOST + '/OpsDeptInfo/getOpsDeptInfo.htm'
        let param = {}
        let data = {
          token: this.token,
          data: JSON.stringify(param)
        };
        this.$api
          .get(apiName, data)
          .then(res => {
            if (res.appCode === '0') {
              this.opsDeptNameList = res.resultList
            } else {
              console.log('/OpsDeptInfo/getOpsDeptInfo.htm出错');
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      {
        let apiName = this.$config.ubms_HOST + '/PublicDic/getDicInfo.htm'
        let param = {"parentCode":"GENDER"}
        let data = {
          token: this.token,
          data: JSON.stringify(param)
        };
        this.$api
          .get(apiName, data)
          .then(res => {
            if (res.appCode === '0') {
              this.genderNameList = res.resultList
            } else {
              console.log('/PublicDic/getDicInfo.htm出错');
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    selectGender: function(opt) {
      this.genderCode = opt
    },
    selectPersonType: function(opt) {
      this.personTypeCode = opt
    },
    selectStatu: function(opt) {
      this.statusCode = opt
    },
    selectDept: function(opt) {
      this.opsDeptId = opt
    }
  }
};

</script>
<style scoped>
@import "../../assets/css/main.css";
@import "../../assets/css/baseInfo.css";
@import "../../assets/css/select.css";

.base-info {
  padding-bottom: 20px;
  margin-bottom: 0;
}

.base-info .el-col label {
  text-align: right;
}

.base-info .el-col:nth-child(2n+1) label {
  width: 68px;
}

.base-info .el-col:nth-child(2n) label {
  width: 80px;
  text-align: right;
}

.base-info .el-col label span {
  position: relative;
}

.base-info .el-col label span i {
  position: absolute;
  color: #f90404;
  left: -7px;
}

.base-info .content .content-date>>>.el-input__inner {
  border: none;
  background: #F9FAFC;
}

.base-info .title {
  cursor: pointer;
}

.base-info .content-icon {
  float: right;
  width: 28px;
  height: 28px;
  background: url('../../assets/images/icon-arrow-double.png') no-repeat center/100%;
  cursor: pointer;
  margin-top: -13px;
  transform: rotate(90deg);
}

.base-info .content-icon.active {
  transform: rotate(-90deg);
}

.base-attribute .longitude-box {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.base-attribute .longitude-box .longitude-fixed {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2;
}

/* 弹窗样式 */
.dialog-urge .dialog-main {
  margin-top: -30px;
  padding: 10px 0 20px;
  border-top: 1px solid #ebeff1;
}

.dialog-urge .dialog-main .dialog-select {
  width: 300px;
  box-sizing: border-box;
}

.dialog-urge .dialog-main .dialog-content {
  width: 300px;
  box-sizing: border-box;
  border: none;
}

.dialog-urge .dialog-main .dialog-label i {
  position: absolute;
  color: #f90404;
  left: -7px;
}

.dialog-urge .dialog-main .dialog-tips {
  font-size: 12px;
  color: #999999;
  min-height: 100px;
}

.dialog-urge .dialog-main>>>.el-textarea__inner {
  height: 134px;
  background: #f9fafc;
}

.ej-content>>>.el-dialog__title {
  font-size: 14px;
}

.dialog-urge .dialog-main .map-input .dialog-select {
  width: 220px;
}

.dialog-urge .dialog-main .map-input .map-btn {
  background: #ffffff;
  border-color: #E1E7ED;
  width: 60px;
  text-align: center;
  padding: 7px 0;
  color: #6C7883;
}

.dialog-urge .dialog-main .map-input .map-green {
  background: #00C187;
  color: #ffffff;
}

</style>
<style scoped>
.navigationbar {
  top: 10px;
}

.ej-content-scrollbar {
  height: 100%;
}

.ej-content-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}

.region-popper {
  width: 300px;
  padding: 5px 0;
}

.managem-popper .el-checkbox {
  display: none;
}

.managem-popper .el-tree-node__expand-icon.is-leaf.is-leaf+.el-checkbox {
  display: inline-block;
}

.ej-content-scrollbar .base-info .content .content-row-select {
  margin-top: 20px;
}

.file-wrap {
  display: flex;
  align-items: flex-start;
}

.file-upload-wrap {
  display: inline-flex;
  align-items: flex-end;
  margin-left: 5px;
}

.btn-upload {
  width: 80px;
  height: 30px;
  margin-left: 20px;
  border: none;
  background: #00C187;
  color: #fff;
}

/deep/ .ej-content-main {
  height: 430px !important;
}
/deep/ .content-select {
  width: 70%!important;
}
</style>
