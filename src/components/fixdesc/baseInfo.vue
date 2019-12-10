<template>
  <div class="base-info">
    <div class="content">
      <el-row class="content-row-detail">
        <el-col :span="24">
          <label>工单编号</label>
          <span>{{workordersInfo.workordersId}}</span>
          <div class="fix-state"><span>{{workordersInfo.workordersStatusName}}</span></div>
          <span class="date-state" v-if="workordersInfo.isOverdue">{{workordersInfo.isOverdue|filterOverdue}}</span>
        </el-col>
      </el-row>
      <el-row class="content-row-detail">
        <el-col :span="9">
          <label>设备名称</label>
          <span>{{workordersInfo.devName}}</span>
        </el-col>
        <el-col :span="9" class="detail-warning">
          <label>设备编号</label>
          <span>{{workordersInfo.devId}}</span>
        </el-col>
      </el-row>
      <el-row class="content-row-detail">
        <el-col :span="9">
          <label>故障类型</label>
          <span>{{workordersInfo.failureTypeName}}</span>
        </el-col>
        <el-col :span="9" class="detail-warning">
          <label>故障描述</label>
          <span>{{workordersInfo.failureDescrible}}</span>
        </el-col>
      </el-row>
      <el-row class="content-row-detail">
        <el-col :span="9">
          <label>报修人员</label>
          <span>{{workordersInfo.repPerson}}</span>
        </el-col>
        <el-col :span="9">
          <label>报修时间</label>
          <span>{{workordersInfo.createDate}}</span>
        </el-col>
      </el-row>
      <transition name="fade">
        <div v-show="isShow">
          <el-row class="content-row-detail">
            <el-col :span="9">
              <label>设备厂家</label>
              <span>{{workordersInfo.devFactory}}</span>
            </el-col>
            <el-col :span="9">
              <label>设备品牌</label>
              <span>{{workordersInfo.devBrand}}</span>
            </el-col>
          </el-row>
          <el-row class="content-row-detail">
            <el-col :span="9">
              <label>设备型号</label>
              <span>{{workordersInfo.devModel}}</span>
            </el-col>
            <el-col :span="9">
              <label>建设时间</label>
              <span>{{workordersInfo.devBuildDate}}</span>
            </el-col>
          </el-row>
          <el-row class="content-row-detail">
            <el-col :span="9">
              <label>所属辖区</label>
              <span>{{workordersInfo.devAreaName}}</span>
            </el-col>
            <el-col :span="9">
              <label>管理部门</label>
              <span>{{workordersInfo.devDeptName}}</span>
            </el-col>
          </el-row>
          <el-row class="content-row-detail">
            <el-col :span="9">
              <label>IP地址</label>
              <span>{{workordersInfo.devIp}}</span>
            </el-col>
            <el-col :span="9">
              <label>设备定位</label>
              <span>{{workordersInfo.devBuildPosition}}</span>
            </el-col>
          </el-row>
          <el-row class="content-row-detail">
            <el-col :span="9">
              <label>安装位置</label>
              <span>{{workordersInfo.devBuildPosition}}</span>
            </el-col>
            <el-col :span="9">
              <label>工单创建时间</label>
              <span>{{workordersInfo.createDate}}</span>
            </el-col>
          </el-row>
          <el-row class="content-row-detail">
            <el-col :span="9">
              <label>报修来源</label>
              <span>{{workordersInfo.repSourceName}}</span>
            </el-col>
            <el-col :span="9">
              <label>联系电话</label>
              <span>{{workordersInfo.repPersonTel}}</span>
            </el-col>
          </el-row>
          <el-row class="content-row-detail">
            <el-col :span="24">
              <label>报修单位</label>
              <span>{{workordersInfo.repPersonTel}}</span>
            </el-col>
          </el-row>
          <el-row class="content-row-detail">
            <el-col :span="24" class="content-row-img">
              <label>附件</label>
              <template v-for="(item,index) in imgFileList">
                <div class="img-preview" :key="index">
                  <img :src="item.mappingAddress" width="100%" height="auto" alt="">
                </div>
              </template>
              <template v-for="(item,index) in otherFileList">
                <div class="file-preview" :key="index">
                  <span class="file-name" @click="download(item)">{{item.fileName}}</span>
                </div>
              </template>
            </el-col>
          </el-row>
        </div>
      </transition>
      <div @click="isShow=!isShow" class="content-shrink">
        <span><i class="shrink-arrow-up"
            :style="{'transform':'rotate('+(isShow?0:180)+'deg)'}"></i>{{isShow?'收起':'展开'}}</span>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from "vue";
  Vue.filter("filterOverdue", function (value) {
    return value ? "已逾期" : (this.workordersInfo.repStatusName || '维修中');
  });
  export default {
    data() {
      return {
        title: "基本信息",
        isShow: false,
        workordersInfo: {
          workordersId: ""
        },
        imgFileList: [],
        otherFileList: [],
        value: "",
        input: "",
        value6: ""
      };
    },
    mounted() {
      this.workordersInfo = JSON.parse(sessionStorage.getItem("workordersInfo"));
      var fileInfoList = this.workordersInfo.fileInfoList;
      fileInfoList.forEach(item => {
        if (/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/.test(item.fileName)) {
          var fileUrl = item.fileUrl.replace('file/downloadFile?secondDir=', 'fileResource/');
          fileUrl = fileUrl.replace('&fileName=', '/');
          item.mappingAddress = fileUrl;
          this.imgFileList.push(item);
        } else {
          this.otherFileList.push(item);
        }
      });
    },
    methods: {
      download(e) {
        window.open(e.fileUrl);
      }
    }
  };

</script>
<style scoped>
  .base-info {
    margin: 14px 14px 0px 14px;
    background: #FFFFFF;
    border: 1px solid #E4EAEE;
    border-radius: 2px;
  }

  .base-info .title {
    height: 36px;
    border-bottom: 1px solid #EBEFF1;
    margin: 0 58px 0 40px;
  }

  .base-info .title::before {
    content: '';
    position: relative;
    left: -41px;
    top: 10px;
    border-left: 2px solid #00C187;
  }

  .base-info .title h3 {
    font-size: 14px;
    color: #22262E;
    line-height: 0px;
  }

  .base-info .content {
    padding-top: 5px;
    padding-left: 36px;
    padding-right: 36px;
    background: #F7FCFB;
    border: 1px solid #C3E6D9;
    border-radius: 2px;
  }

  .base-info .content .content-row-detail {
    margin-top: 14px;
  }

  .base-info .content .content-row-detail .detail-warning label {
    color: #DB0000;
  }

  .base-info .content .content-row-detail .detail-warning span {
    color: #DB0000;
  }

  .base-info .content .content-row-detail .quick-query {
    background: #FDF6EC;
    border: 1px solid #FBF0DF;
    border-radius: 11px;
    width: 105px;
    height: 22px;
    display: inline-block;
    margin-right: 20px;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
  }

  .base-info .content .content-row-detail .quick-query.active {
    background: #ECA848;
  }

  .base-info .content .content-row-detail .quick-query.active label {
    color: #FFFFFF;
  }

  .base-info .content .content-row-detail .quick-query.active span {
    color: #FFFFFF;
  }

  .base-info .content .content-row-detail .quick-query label {
    color: #E58600;
    display: inline-block;
    width: 48px;
    font-size: 12px;
    cursor: pointer;
  }

  .base-info .content .content-row-detail .quick-query span {
    color: #E58600;
    display: inline-block;
    font-size: 12px;
  }

  .base-info .content .content-row-detail .fix-state {
    display: inline-block;
    background: #E49B00;
    border-radius: 10px;
    width: 50px;
    height: 20px;
    text-align: center;
    line-height: 18px;
    margin-left: 12px;
    margin-right: 26px;
  }

  .base-info .content .content-row-detail .fix-state span {
    color: #FFFFFF;
  }

  .base-info .content .content-row-detail .date-state {
    color: #D89D00;
  }

  .base-info .content .content-row-detail .date-state::before {
    content: '';
    background: #D89D00;
    width: 3px;
    height: 3px;
    display: inline-block;
    border-radius: 50%;
    position: relative;
    top: -3px;
    left: -5px;
  }

  .base-info .content .content-row-img {
    font-size: 12px;
    line-height: 12px;
    display: flex;
  }

  .base-info .content .content-row-img label {
    line-height: 30px;
  }

  .base-info .content .img-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin-left: 4px;
    margin-right: 10px;
    background: #FFFFFF;
    border: 1px solid #E1E7ED;
  }

  .base-info .content .file-preview {
    display: inline-block;
    margin-right: 10px;
  }

  .base-info .content .file-preview .file-name {
    float: left;
    margin-right: 5px;
    line-height: 40px;
    color: #6BA1EB;
    cursor: pointer;
    text-decoration: underline;
  }

  .base-info .content label {
    color: #737E84;
    display: inline-block;
    width: 72px;
    font-size: 12px;
    margin-right: 12px;
    text-align: right;
  }

  .base-info .content span {
    font-size: 12px;
    color: #4F5A64;
  }

  .base-info .content .content-select {
    width: 300px;
  }

  .base-info .content .content-date {
    width: 300px;
    background: #F9FAFC;
    border-radius: 0;
    border: 1px solid #E1E7ED;
  }

  .base-info .content .content-search {
    background: #00C187;
    border-radius: 1px;
    width: 80px;
    height: 28px;
    text-align: center;
    line-height: 28px;
    cursor: pointer;
  }

  .base-info .content .content-search p {
    font-size: 12px;
    color: #FFFFFF;
  }

  .base-info .content .content-shrink {
    margin-top: 15px;
    border-top: 1px solid #EBEFF1;
    text-align: center;
    margin-bottom: 14px;
  }

  .base-info .content .content-shrink span {
    font-size: 12px;
    color: #737E84;
    cursor: pointer;
  }

  .base-info .content .content-shrink span .shrink-arrow-up {
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url(../../assets/images/icon-arrow-up.png) no-repeat;
    position: relative;
    top: 4px;
    margin-right: 6px;
  }

  .base-info .content .content-shrink span .shrink-arrow-down {
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url(../../assets/images/icon-arrow-up.png) no-repeat;
    position: relative;
    top: 4px;
    margin-right: 6px;
  }

</style>
<style>
  .base-info .content .content-date .el-range-input {
    background: #F9FAFC;
  }

  .base-info .content .content-select .el-input__inner {
    border-radius: 0;
    background: #F9FAFC;
    border: 1px solid #E1E7ED;
  }

  .base-info .content .content-select .el-input__suffix {
    border-left: 1px solid #E1E7ED;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .3s
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0
  }

</style>
