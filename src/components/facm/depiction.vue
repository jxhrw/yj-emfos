<template>
<div class="depiction-info">
    <div class="title">
        <h3>{{title}}</h3>
    </div>
    <div class="content">
        <el-row class="content-row-select">
            <el-col :span="9">
                <label>故障类型</label>
                <el-select v-model="value" placeholder="请选择" size='mini' class="content-select">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row class="content-row-select">
            <el-col :span="9">
                <label class="content-label">故障描述</label>
                <el-input type="textarea" :rows="3" placeholder="请输入内容" class="content-textarea" v-model="textarea">
                </el-input>
            </el-col>
        </el-row>
        <el-row class="content-row-explain content-row-first">
            <el-col :span="24" class="content-row-img">
                <label>图片上传</label>
                <div class="img-preview"  @mouseenter="enter(index)" @mouseleave="leave()">
                  <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547784327761&di=81170534ff304ab1bd4d5d081e2de381&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fc3fa27a76988089b1ddacec17114dc20f853b96e1a8bc-gmaoEw_fw658" width="100%" height="auto" alt="">
                  <div class="img-del" v-show="seen&&index==current"><p>删除</p></div>
                </div>
                <div class="img-add">
                  <img src="../../assets/images/icon-upload.png" width="24" height="24" alt="">
                </div>
            </el-col>
        </el-row>
        <el-row class="content-row-explain">
            <el-col :span="24">
                <label>附件上传</label>
                <span class="file-add">添加附件</span>
                <div class="file-preview">
                  <span class="file-name">示例123.doc</span>
                  <span class="file-del">删除</span>
                </div>
                <div class="file-explain">每个附件不得超过8M。</div>
            </el-col>
        </el-row>
        <el-row class="content-row-select">
            <el-col :span="9">
                <label>报修来源</label>
                <el-select v-model="value" placeholder="请选择" size='mini' class="content-select">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="9">
                <label>联系人</label>
                <el-select v-model="value" placeholder="请选择" size='mini' class="content-select">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <div class="linkman-explain">选填，默认报修人/联系人为用户</div>
            </el-col>
        </el-row>
        <el-row class="content-row-select content-row-bottom">
            <el-col :span="9">
                <label>电话</label>
                <el-select v-model="value" placeholder="请选择" size='mini' class="content-select">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
    </div>
</div>
</template>
<script>
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
      textarea: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      seen: false,
      current: 0
    };
  },
  methods: {
    enter(index) {
      this.seen = true;
      this.current = index;
    },
    leave() {
      this.seen = false;
      this.current = null;
    }
  }
};
</script>
<style scoped>
.depiction-info{margin: 14px 14px 0px 14px;background: #FFFFFF;border: 1px solid #E4EAEE;border-radius: 2px;}
.depiction-info .title{height: 36px;border-bottom: 1px solid #EBEFF1;margin: 0 58px 0 40px;}
.depiction-info .title::before{content: '';position: relative;left: -41px;top: 10px;border-left: 2px solid #00C187;}
.depiction-info .title h3{font-size: 14px;color: #22262E;line-height: 0px;}
.depiction-info .content{padding-top: 5px;padding-left: 40px;}
.depiction-info .content .content-row-select{margin-top: 10px;}
.depiction-info .content .content-row-explain{font-size: 12px;line-height: 12px;margin-bottom: 25px;}
.depiction-info .content .content-row-explain.content-row-first{margin-top: 16px;margin-bottom: 15px;}
.depiction-info .content .content-row-select.content-row-bottom{margin-bottom: 20px;}
.depiction-info .content .content-row-select .linkman-explain{position: absolute;color: #A3B1B9;font-size: 12px;padding: 10px 0 0 64px;}
.depiction-info .content label{color: #4F5A64;display: inline-block;width: 48px;font-size: 12px; margin-right: 12px;text-align: right;}
.depiction-info .content span{font-size: 12px;color: #737E84;}
.depiction-info .content .content-select{width: 300px;}
.depiction-info .content .content-row-select .content-textarea{width: 300px;}
.depiction-info .content .content-row-select .content-label{ position: relative;top: -50px;}
.depiction-info .content .content-row-img{font-size: 12px;line-height: 12px;display: flex;}
.depiction-info .content .content-row-img label{line-height: 30px;}
.depiction-info .content .content-row-explain .img-preview{display:flex;align-items:center; justify-content:center;width: 50px;height: 50px;margin-left: 6px; margin-right: 10px;background: #FFFFFF;border: 1px solid #E1E7ED;}
.depiction-info .content .content-row-explain .img-preview .img-del{opacity: 0.62;background: #7A7A7A;width: 50px;height: 15px;position: absolute;bottom: 1px;}
.depiction-info .content .content-row-explain .img-preview .img-del p{font-size: 10px;color: #FFFFFF;text-align: center;cursor: pointer;;}
.depiction-info .content .content-row-explain .img-add{display:flex;align-items:center; justify-content:center;width: 50px;height: 50px;margin-left: 6px; margin-right: 10px;background: #FFFFFF;border: 1px solid #E1E7ED;cursor: pointer;}
.depiction-info .content .file-add{color: #6BA1EB;cursor: pointer;margin-right: 5px;}
.depiction-info .content .file-preview{display: inline-block;margin-right: 20px;}
.depiction-info .content .file-preview .file-name{float: left;margin-right: 5px;}
.depiction-info .content .file-preview .file-del{color: #6BA1EB;cursor: pointer;}
.depiction-info .content .file-explain{margin: 10px 0px 0px 63px;color: #A3B1B9;}
</style>
<style>
.depiction-info .content .content-select .el-input__inner{border-radius: 0;background: #F9FAFC;border: 1px solid #E1E7ED;}
.depiction-info .content .content-select .el-input__suffix{border-left: 1px solid #E1E7ED;}
.depiction-info .content .content-row-select .content-textarea .el-textarea__inner{border-radius: 0;background: #F9FAFC;border: 1px solid #E1E7ED;}
</style>
