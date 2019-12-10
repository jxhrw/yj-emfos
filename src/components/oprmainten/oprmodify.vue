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
                  <el-col :span="12">
                    <label><span><i>*</i>单位名称</span></label>
                    <el-input v-model="deptName" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <label><span>单位简称</span></label>
                    <el-input v-model="shortName" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                  </el-col>
                </el-row>
                <el-row class="content-row-select">
                  <el-col :span="12">
                    <label><span><i>*</i>单位类型</span></label>
                    <el-select v-model="deptType" placeholder="" size='mini' class="content-select" :disabled="isReadonly" @change="selectDeptType">
                      <el-option v-for="item in deptTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="12">
                    <label><span>上级部门</span></label>
                    <el-select v-model="topDept" placeholder="" size='mini' class="content-select" :disabled="isReadonly" @change="selectTopDeptCode">
                      <el-option v-for="item in topDeptList" :key="item.opsDeptId" :label="item.opsDeptName" :value="item.opsDeptId">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row class="content-row-select">
                  <el-col :span="12">
                    <label><span>联系人</span></label>
                    <el-input v-model="concat" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <label><span>联系电话</span></label>
                    <el-input v-model="phone" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                  </el-col>
                </el-row>
                <el-row class="content-row-select">
                  <el-col :span="12">
                    <label><span>顺序号</span></label>
                    <el-input v-model="orderNum" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <label><span>备注</span></label>
                    <el-input v-model="other" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
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
      deptName: '',
      deptId: '',
      deptType: '',
      shortName: '',
      topDept: '',
      concat: '',
      phone: '',
      orderNum: '',
      other: '',
      deptTypeCode: '',
      topDeptCode: '',
      deptTypeList: [],
      topDeptList: [],
      isReadonly: true,
      loading: false,
      fileList: [],
      queryConditions: {},
      rowData: {}
    };
  },
  mounted() {
    this.token = Common.getQueryString("token");
    this.isReadonly = Common.getQueryString("type") == "onlyread";
    this.getPreSelect()
    this.rowData = JSON.parse(sessionStorage.getItem('_row'))
  },
  watch: {
    rowData(val, oldVal) {
      this.deptName = val.opsDeptName
      this.shortName = val.shortName
      this.deptType = val.deptTypeName
      this.topDept = val.parentName
      this.concat = val.contact
      this.phone = val.phone
      this.orderNum = val.sortNo
      this.other = val.memo
      this.deptId = val.opsDeptId
      this.topDeptCode = val.parentId
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
      let opt1 = !!this.deptName && !!this.deptType
      if (opt1) {
        this.loading = true
        let apiName = this.$config.ubms_HOST + '/ubms-server/OpsDeptInfo/editOpsDeptInfo.htm?token=' + this.token
        this.queryConditions = {
            "opsDeptId": this.deptId,
            "opsDeptName": this.deptName,
            "shortName": this.shortName,
            "deptTypeCode": this.deptTypeCode,
            "parentId": this.topDeptCode,
            "contact": this.concat,
            "phone": this.phone,
            "sortNo": this.orderNum,
            "memo": this.other
        }
        let data = {
          data: JSON.stringify(this.queryConditions)
        };
        this.$api
          .post(apiName, qs.stringify(data), {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"})
          .then(res => {
            if (res.appCode === '0' && res.resultList === 1) {
              this.loading = false
              this.$message.success('修改成功!')
            } else {
              this.loading = false
              this.$message.error('修改失败!')
              console.log('/ubms-server/OpsDeptInfo/editOpsDeptInfo.htm出错');
            }
          })
          .catch(err => {
            this.loading = false
            this.$message.error('修改失败!')
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
        let apiName = this.$config.ubms_HOST + '/ubms-server/PublicDic/getDicInfo.htm'
        this.queryConditions = {
          "parentCode": "OPSDEPTTYPE"
        }
        let data = {
          token: this.token,
          data: JSON.stringify(this.queryConditions)
        };
        this.$api
          .get(apiName, data)
          .then(res => {
            if (res.appCode === '0') {
              this.deptTypeList = res.resultList
            } else {
              console.log('/ubms-server/PublicDic/getDicInfo.htm出错');
            }
          })
          .catch(err => {
            console.log(err);
          });
      } {
        let apiName = this.$config.ubms_HOST + '/ubms-server/OpsDeptInfo/getOpsDeptInfo.htm'
        this.queryConditions = {}
        let data = {
          token: this.token,
          data: JSON.stringify(this.queryConditions)
        };
        this.$api
          .get(apiName, data)
          .then(res => {
            if (res.appCode === '0') {
              this.topDeptList = res.resultList
            } else {
              console.log('/ubms-server/OpsDeptInfo/getOpsDeptInfo.htm出错');
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    selectDeptType: function(opt) {
      this.deptTypeCode = opt
    },
    selectTopDeptCode: function(opt) {
      this.topDeptCode = opt
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

</style>
