<template>
  <div class="depiction-info">
    <div class="title">
      <h3>{{title}}</h3>
    </div>
    <div class="content">
      <el-row class="content-row-select">
        <el-col :span="9">
          <label>故障类型</label>
          <span>{{dataInfo.failureTypeName}}</span>
        </el-col>
      </el-row>
      <el-row class="content-row-select">
        <el-col :span="9">
          <label class="content-label">故障描述</label>
          <el-input type="textarea" :rows="3" placeholder="请输入内容" class="content-textarea"
            v-model="dataInfo.failureDescrible" :disabled="true" resize="none"></el-input>
        </el-col>
      </el-row>
      <el-row class="content-row-explain content-row-first">
        <el-col :span="24" class="content-row-img">
          <label>图片上传</label>
          <viewer :images="imgFileList" style="display:flex;" @click.native='showImg'>
            <template v-for="(item,index) in imgFileList">
              <div class="img-preview" :key="index">
                <img :src="item.mappingAddress" width="100%" height="auto" alt="">
              </div>
            </template>
          </viewer>
        </el-col>
      </el-row>
      <el-row class="content-row-explain">
        <el-col :span="24">
          <label>附件上传</label>
          <template v-for="(item,index) in otherFileList">
            <div class="file-preview" :key="index">
              <span class="file-name" @click="download(item)">{{item.fileName}}</span>
            </div>
          </template>
        </el-col>
      </el-row>
      <el-row class="content-row-select">
        <el-col :span="9">
          <label>报修来源</label>
          <span>{{dataInfo.repSource}}</span>
        </el-col>
        <el-col :span="9">
          <label>联系人</label>
          <span>{{dataInfo.contactPerson|personDefalut}}</span>
        </el-col>
      </el-row>
      <el-row class="content-row-select content-row-bottom">
        <el-col :span="9">
          <label>电话</label>
          <span>{{dataInfo.contactPersonTel}}</span>
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
      personDefalut: val => {
        let person = JSON.parse(sessionStorage.getItem("userInfo")) || {};
        return val || person.personName;
      }
    },
    data() {
      return {
        title: "故障描述",
        token: "",
        dataInfo: '',
        imgFileList: [],
        otherFileList: []
      };
    },
    mounted() {
      this.token = Common.getQueryString("token");
      this.dataInfo = JSON.parse(sessionStorage.getItem('dataDetail'));
      if (this.dataInfo.fileList && this.dataInfo.fileList.length > 0) {
        this.dataInfo.fileList.forEach(item => {
          if (/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/.test(item.fileName)) {
            var fileUrl = item.fileUrl.replace('file/downloadFile?secondDir=', 'fileResource/');
            fileUrl = fileUrl.replace('&fileName=', '/');
            item.mappingAddress = fileUrl;
            this.imgFileList.push(item);
          } else {
            this.otherFileList.push(item);
          }
        });
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
      download(e) {
        window.open(e.fileUrl);
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
