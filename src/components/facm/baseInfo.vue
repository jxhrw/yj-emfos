<template>
<div class="base-info">
    <div class="title">
        <h3>{{title}}</h3>
    </div>
    <div class="content">
        <el-row class="content-row-select">
            <el-col :span="9">
                <label>设备类型</label>
                <el-select v-model="value" placeholder="请选择" size='mini' class="content-select">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="9">
                <label>设备类型</label>
                <el-select v-model="value" placeholder="请选择" size='mini' class="content-select">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row class="content-row-select">
            <el-col :span="9">
                <label>设备名称</label>
                <el-select v-model="value" placeholder="请选择" size='mini' class="content-select">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="9">
                <label>设备编号</label>
                <el-select v-model="value" placeholder="请选择" size='mini' class="content-select">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row class="content-row-select content-row-foot">
            <el-col :span="9">
                <label>设备名称</label>
                <el-select v-model="value" placeholder="请选择" size='mini' class="content-select">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="9">
                <label>设备编号</label>
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
  data() {
    return {
      title: '基本信息',
      options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
    };
  }
};
</script>
<style scoped>
.base-info{margin: 14px 14px 10px 14px;background: #FFFFFF;border: 1px solid #E4EAEE;border-radius: 2px;}
.base-info .title{height: 36px;border-bottom: 1px solid #EBEFF1;margin: 0 58px 0 40px;}
.base-info .title::before{content: '';position: relative;left: -41px;top: 10px;border-left: 2px solid #00C187;}
.base-info .title h3{font-size: 14px;color: #22262E;line-height: 0px;}
.base-info .content{padding-top: 5px;padding-left: 40px;}
.base-info .content .content-row-select{margin-top: 10px;}
.base-info .content .content-row-select.content-row-foot{margin-bottom: 23px;}
.base-info .content .content-row-explain{font-size: 12px;line-height: 12px;margin-bottom: 25px;}
.base-info .content label{color: #4F5A64;display: inline-block;width: 48px;font-size: 12px; margin-right: 12px;text-align: right;}
.base-info .content span{font-size: 12px;color: #737E84;}
.base-info .content .content-select{width: 300px;}
</style>
<style>
.base-info .content .content-select .el-input__inner{border-radius: 0;background: #F9FAFC;border: 1px solid #E1E7ED;}
.base-info .content .content-select .el-input__suffix{border-left: 1px solid #E1E7ED;}
</style>
