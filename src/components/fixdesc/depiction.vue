<template>
  <div class="depiction-info">
    <ul class="asgn-info">
      <li v-for="(item,index) in this.workordersInfo.workordersRecordMap.dispatchList" :key="index">
        <div class="title">
          <label for="" class="title-name">工单派发</label>
          <span class="title-date">{{item.operDate}}</span>
          <span class="title-person">{{item.operPerson}}</span>
        </div>
        <div class="content">
          <label for="">运维单位</label>
          <span>{{item.opDeptName}}</span>
          <label for="">运维组长</label>
          <span>{{item.opPersonName}}</span>
          <label for="">联系电话</label>
          <span>{{item.contactTel}}</span>
          <label for="">维修期限</label>
          <span>{{item.deadlineDate}}</span>
          <label for="">派发备注</label>
          <span>{{item.operExplain}}</span>
        </div>
      </li>
    </ul>
    <ul class="urge-info">
      <li v-for="(item,index) in this.workordersInfo.workordersRecordMap.pressList" :key="index">
        <div class="title">
          <label for="" class="title-name">工单催办</label>
          <span class="title-date">{{item.operDate}}</span>
          <span class="title-person">{{item.operPerson}}</span>
        </div>
        <div class="content">
          <label for="">催办原因</label>
          <span class="urge-reason">{{item.operExplain}}</span>
        </div>
      </li>
    </ul>
    <ul class="feedback-info">
      <template v-for="(item,index) in this.workordersInfo.workordersRecordMap.fackbackList">
        <li class="feedback-progress" :key="index">
          <div class="title">
            <label for="" class="title-name">{{item.operResult}}</label>
            <span class="title-date">{{item.operDate}}</span>
            <span class="title-person">{{item.operPerson}}</span>
          </div>
          <div class="content">
            <label for="">维修状态</label>
            <span>{{item.operTypeName}}</span>
            <label for="">故障类型</label>
            <span>{{item.failureTypeName}}</span>
            <label for="">故障原因</label>
            <span>{{item.failureReason}}</span>
            <label for="">结果反馈</label>
            <span class="feedback-result">{{item.operExplain}}</span>
          </div>
          <div class="content file-info">
            <label for="">附件</label>
            <span class="file-name">
              <template v-for="(files,fileid) in item.fileInfoList">
                <a :key="fileid" :href="files.fileUrl" :download="files.fileName">{{files.fileName | stringLength}}</a>
              </template>
            </span>
          </div>
        </li>
      </template>
      <template v-for="(item,index) in this.workordersInfo.workordersRecordMap.postponeList">
        <li class="feedback-defer" :key="'-'+index">
          <div class="title">
            <label for="" class="title-name">{{item.operTypeName}}</label>
            <span class="title-date">{{item.operDate}}</span>
            <span class="title-person">{{item.operPerson}}</span>
          </div>
          <div class="content">
            <!-- <label for="">完成时间</label>
                    <span>{{item.deadlineDate}}</span> -->
            <label for="">延期原因</label>
            <span>{{item.operExplain}}</span>
            <label for="">维修期限</label>
            <span class="defer-date">{{item.deadlineDate}}</span>
          </div>
        </li>
      </template>
    </ul>
    <ul class="confirm-info">
      <li class="confirm-normal" v-for="(item,index) in this.workordersInfo.workordersRecordMap.sureList" :key="index">
        <div class="title">
          <label for="" class="title-name">{{index|NumberToChinese}}次确认</label>
          <span class="title-date">{{item.operDate}}</span>
          <span class="title-person">{{item.operPerson}}</span>
        </div>
        <div class="content">
          <label for="">确认结果</label>
          <span>{{item.operResult}}</span>
          <label for="">反馈时间</label>
          <span>{{item.operDate}}</span>
          <label for="">确认意见</label>
          <span class="normal-suggest">{{item.operExplain}}</span>
        </div>
      </li>
    </ul>
    <ul class="assess-info">
      <li v-for="(item,index) in this.workordersInfo.workordersRecordMap.evaluateList" :key="index">
        <div class="title">
          <label for="" class="title-name">评价记录</label>
          <span class="title-date">{{item.operDate}}</span>
          <span class="title-person">{{item.operPerson}}</span>
        </div>
        <div class="content">
          <template v-for="(res,rdx) in item.evalGradeList">
            <label for="" :key="'lb'+rdx">{{res.evalItemName}}</label>
            <span :key="'sp'+rdx">{{res.evalGrades}}星</span>
          </template>
          <label for="">意见</label>
          <span>{{item.operExplain}}</span>
        </div>
      </li>
    </ul>
    <ul class="revoke-info">
      <li v-for="(item,index) in this.workordersInfo.workordersRecordMap.cancelList" :key="index">
        <div class="title">
          <label for="" class="title-name">撤销记录</label>
          <span class="title-date">{{item.operDate}}</span>
          <span class="title-person">{{item.operPerson}}</span>
        </div>
        <div class="content">
          <label for="">撤销原因</label>
          <span class="revoke-record">{{item.operExplain}}</span>
        </div>
      </li>
    </ul>
    <ul class="examine-info">
      <li v-for="(item,index) in this.workordersInfo.workordersRecordMap.auditList" :key="index">
        <div class="title">
          <label for="" class="title-name">{{item.operTypeName}}</label>
          <span class="title-date">{{item.operDate}}</span>
          <span class="title-person">{{item.operPerson}}</span>
        </div>
        <div class="content">
          <label for="">审核结果</label>
          <span>{{item.operResult}}</span>
          <label for="">审核意见</label>
          <span>{{item.operExplain || '未填写'}}</span>
          <label for="">完成时间</label>
          <span class="examine-suggest">{{item.deadlineDate}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import Vue from "vue";
  import Bus from "@/assets/js/bus.js";
  Vue.filter("NumberToChinese", function (value) {
    var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
    var chnUnitChar = ["", "十", "百", "千"];

    function SectionToChinese(section) {
      var strIns = "";
      var chnStr = "";
      var unitPos = 0;
      var zero = true;
      while (section > 0) {
        var v = section % 10;
        if (v === 0) {
          if (!zero) {
            zero = true;
            chnStr = chnNumChar[v] + chnStr;
          }
        } else {
          zero = false;
          strIns = chnNumChar[v];
          strIns += chnUnitChar[unitPos];
          chnStr = strIns + chnStr;
        }
        unitPos++;
        section = Math.floor(section / 10);
      }
      return chnStr;
    }

    function NumberToChinese(num) {
      var unitPos = 0;
      var strIns = "";
      var chnStr = "";
      var needZero = false;

      if (num === 0) {
        return chnNumChar[0];
      }

      while (num > 0) {
        var section = num % 10000;
        if (needZero) {
          chnStr = chnNumChar[0] + chnStr;
        }
        strIns = SectionToChinese(section);
        strIns += section !== 0 ? chnUnitSection[unitPos] : chnUnitSection[0];
        chnStr = strIns + chnStr;
        needZero = section < 1000 && section > 0;
        num = Math.floor(num / 10000);
        unitPos++;
      }

      return chnStr;
    }
    return NumberToChinese(value + 1);
  });
  export default {
    filters: {
      fackbackTitle: (val) => {
        let name = '';
        switch (val) {
          case 0:
            name = '进度反馈';
            break;
          case 1:
            name = '进度反馈';
            break;
          case 2:
            name = '进度反馈';
            break;
          default:
            break;
        }
        return name;
      },
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
        workordersInfo: {
          workordersRecordMap: {
            dispatchList: [],
            pressList: [],
            fackbackList: [],
            postponeList: [],
            evaluateList: [],
            cancelList: [],
            auditList: [],
            sureList: []
          }
        }
      };
    },
    methods: {},
    mounted() {
      this.workordersInfo = JSON.parse(sessionStorage.getItem("workordersInfo"));
      Bus.$on('workordersInfoUpdate', val => {
        this.workordersInfo = JSON.parse(sessionStorage.getItem("workordersInfo"));
      });
      console.log(this.workordersInfo);
    }
  };

</script>
<style scoped>
  .depiction-info {
    border-left: 1px solid #00C187;
    margin: 0 14px 0 32px;
    padding-top: 10px;
  }

  .depiction-info ul {
    position: relative;
    margin-left: 29px;
    margin-bottom: 10px;
    background: #FFFFFF;
    border: 1px solid #E6ECEA;
    border-radius: 1px;
    padding-bottom: 20px;
  }

  .depiction-info ul::before {
    content: '';
    position: absolute;
    display: inline-block;
    width: 36px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: #00C187;
    border-radius: 5px;
    font-size: 12px;
    color: #FFFFFF;
    left: -48px;
    top: 50%;
    transform: translateY(-50%);
  }

  .depiction-info .asgn-info::before {
    content: '\6D3E\53D1';
  }

  .depiction-info .urge-info::before {
    content: '\50AC\529E';
  }

  .depiction-info .feedback-info::before {
    content: '\53CD\9988';
  }

  .depiction-info .confirm-info::before {
    content: '\786E\8BA4';
  }

  .depiction-info .assess-info::before {
    content: '\8BC4\4EF7';
  }

  .depiction-info .revoke-info::before {
    content: '\64A4\9500';
  }

  .depiction-info .examine-info::before {
    content: '\5BA1\6838';
  }

  .depiction-info .urge-info .content .urge-reason {
    width: 989px;
  }

  .depiction-info .revoke-info .content .revoke-record {
    width: 989px;
  }

  .depiction-info .feedback-info .content .feedback-result {
    width: 341px;
  }

  .depiction-info .feedback-info .content.file-info {
    border-top: 0
  }

  .depiction-info .feedback-info .content.file-info .file-name {
    width: 989px;
  }

  .depiction-info .feedback-info .content.file-info a {
    float: left;
    margin-right: 20px;
    color: #4F5A64;
  }

  .depiction-info .feedback-info .feedback-defer .defer-date {
    width: 557px;
  }

  .depiction-info .confirm-info .confirm-normal .normal-suggest {
    width: 557px;
  }

  .depiction-info .confirm-info .confirm-other .other-suggest {
    width: 773px;
  }

  .depiction-info .examine-info .content .examine-suggest {
    width: 558px;
  }

  .depiction-info ul li {
    display: inline-block;
  }

  .depiction-info ul li .title {
    margin: 10px 34px 11px 26px;
  }

  .depiction-info ul li .title::before {
    content: '';
    position: relative;
    left: -26px;
    top: 2px;
    border-left: 2px solid #00C187;
    display: inline-block;
    height: 15px;
  }

  .depiction-info ul li .title .title-name {
    font-size: 12px;
    color: #1A2023;
  }

  .depiction-info ul li .title span {
    font-size: 12px;
    color: #B9BFC2;
  }

  .depiction-info ul li .content {
    height: 25px;
    border: 1px solid #E4EBE9;
    margin-left: 26px;
  }

  .depiction-info ul li .content label {
    background: #F4F8F7;
    font-size: 12px;
    width: 80px;
    height: 25px;
    float: left;
    line-height: 25px;
    text-align: center;
    color: #737E84;
  }

  .depiction-info ul li .content span {
    background: #ffffff;
    border-left: 1px solid #E4EBE9;
    font-size: 12px;
    width: 125px;
    height: 25px;
    float: left;
    line-height: 25px;
    text-align: left;
    color: #4F5A64;
    padding-left: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

</style>
