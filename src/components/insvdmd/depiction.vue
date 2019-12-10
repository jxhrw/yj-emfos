<template>
<div class="depiction-info">

    <div class="content">
      <p class="content-video-name">{{videoInfo.videoName}}</p>
      <!-- :style="{'z-index':repairVisible?'-1':'0'}" -->
      <div class="content-video" >
        <EJ-VideoPlay ref="video"></EJ-VideoPlay>
      </div>
      <div class="content-btns">
        <div class="video-btns">
          <a class="icon-video-btn icon-video-btn1" title="截图" @click="catchPic"></a>
          <!-- <a class="icon-video-btn icon-video-btn2" title="录屏" @click="recordingVideo"></a> -->
          <a class="icon-video-btn icon-video-btn3" title="更改目录" @click="getPath"></a>
          <a class="icon-video-btn icon-video-btn4" title="一屏" @click="setScreenNum('1')"></a>
          <a class="icon-video-btn icon-video-btn5" title="四屏" @click="setScreenNum('4')"></a>
          <a class="icon-video-btn icon-video-btn6" title="九屏" @click="setScreenNum('9')"></a>
        </div>
        <div v-if="videoInfo.videoId" class="ej-btns"><!--v-if="videoInfo.videoId"-->
          <a @click="submitNormal('DEVICERESULT02')">正常</a>
          <a @click="submitNormal('DEVICERESULT03')">异常</a>
          <a @click="openDialog">报修</a>
          <!-- <a>报备</a> -->
          <span>|</span>
          <a @click="allSubmitNormal('DEVICERESULT02')">全部正常</a>
          <a @click="videoNextPage">下一页</a>
        </div>
      </div>
    </div>

    <el-dialog title="报修" :visible.sync="repairVisible" width='400px' class="dialog-urge" :modal="false">
        <EJ-DialogRepair id="insvdmdRp" :devInfo="videoInfo" type="videoMethod" ref="dialogRepair"></EJ-DialogRepair>
    </el-dialog>
    <!-- <iframe v-show="repairVisible" frameborder="0" class="iframe"></iframe> -->
</div>
</template>
<script>
import Common from "@/assets/js/common.js";
import Bus from "@/assets/js/bus.js";
import Request from "@/assets/js/request.js";
import DialogRepair from "components/common/dialog-repair";
import VideoPlay from 'components/common/videoPlay';
let interval;
let i = 0; // 当前轮巡组的index
export default {
  components: {
      "EJ-DialogRepair": DialogRepair,
      "EJ-VideoPlay": VideoPlay
  },
  data() {
    return {
      videoIndex: 0,
      contentList: ['', '', '', '', '', '', '', '', ''],
      repairVisible: false,
      recording: false, // 是否在录屏
      videoInfo: {'videoName': '', 'id': ''}, // 当前选中组
      videoListData: [], // 当前巡检组的数据
      videoPlaying: [], // 正在播放的列表
      videoPalyed: [], // 当前巡检组已经播放过的列表
      videoUnPaly: [], // 当前巡检组未播放过的列表
      token: '',
      iframeShow: true,
      presetList: [], // 预置位列表

      a: ''
    };
  },
  watch: {
    videoInfo(newVal, oldVal) {
      Bus.$emit("video-info-change", newVal);
      // 以下为预制位内容
      let playSel = this.$refs.video.GetSelPlayIndex();
      // let presetList = this.$refs.video.getPresetList(newVal.videoId, playSel);
      if (newVal.videoId) {
        this.getPresetListFuc(newVal.videoId);
      }
    },
    videoPlaying(newVal, oldVal) {
      Bus.$emit("video-playing-change", newVal);
    },
    presetList(newVal, oldVal) {
      Bus.$emit("video-presetList", newVal);
    }
  },
  mounted() {
    this.token = Common.getQueryString("token");
    this.initDt();
    window.video = this;
    // 巡检成功后修改当前未播放的列表
    Bus.$on('insertCheckRecord', val => {
      this.videoPalyed.push(this.videoInfo);
      let dofilter = (element, index, array) => {
        let isHas = 0;
        for (let i = 0; i < this.videoPalyed.length; i++) {
          if (element.videoId == this.videoPalyed[i].videoId) {
            isHas++;
            break;
          }
        }
        if (isHas == 0) {
          return element;
        }
      };
      this.videoUnPaly = this.videoPlaying.filter(dofilter);
    });
    // 点位控制
    Bus.$on("vedio-ptzCtrl", val => {
      this.$refs.video.PtzCtrl(val[0], val[1]);
    });
    // 组开始轮巡
    Bus.$on("video-group-list", list => {
      i = 0;
      let isLoad = true;
      let screenNum = this.$refs.video.GetScreenNum();
      this.videoListData = list;
      this.videoPlaying = [];
      if (!list || list.length < 1) {
        return false;
      }
      if (list[i].checkResultCode != 'DEVICERESULT03' && list[i].checkResultCode != 'DEVICERESULT02') {
        this.startPlay(list[i].videoId, i, list[i].videoName);
        this.videoPlaying.push(list[i]);
      }
      this.$refs.video.StopAllPlay();
      clearInterval(interval);
      interval = setInterval(() => {
        isLoad = sessionStorage.getItem("ocxIsLoading");
        isLoad = isLoad.toString() === "true";
        if (!isLoad) {
          i++;
          if (this.videoPlaying.length >= screenNum || this.videoPlaying.length >= list.length || i >= list.length) {
            clearInterval(interval);
          } else {
            for (i; i < list.length; i++) {
              if (list[i].checkResultCode != 'DEVICERESULT03' && list[i].checkResultCode != 'DEVICERESULT02') {
                let playSel = this.$refs.video.GetSelPlayIndex();
                this.startPlay(list[i].videoId, playSel + 1, list[i].videoName);
                this.videoPlaying.push(list[i]);
                this.videoInfo = list[i];
                break;
              }
            }
            this.videoUnPaly = this.videoPlaying; // 该组刚开始轮巡时所有都是未检查的
          }
        }
      }, 1000);
    });
    // 单个双击播放
    Bus.$on("video-paly-statr", data => {
      let playSel = this.$refs.video.GetSelPlayIndex();
      this.startPlay(data.videoId, playSel, data.videoName, 'test');
      this.videoInfo = data;
      if (this.videoPlaying[playSel]) {
        this.videoPlaying[playSel] = data;
      } else {
        this.videoPlaying.push(data);
      }
    });
    Bus.$on("repair-insvdmdRp", value => {
        this.repairVisible = false;
        Bus.$emit("video-group-reset", true);
    });
    Bus.$on("video-addPreset", value => {
      this.setPresetFuc(value);
    });
  },
  updated() {

  },
  methods: {
    // 视频下一页
    videoNextPage() {
      clearInterval(interval);
      let isLoad = true;
      let screenNum = this.$refs.video.GetScreenNum();
      let list = this.videoListData;
      // this.videoPlaying = [];
      let index = 0;
      interval = setInterval(() => {
        isLoad = sessionStorage.getItem("ocxIsLoading");
        isLoad = isLoad.toString() === "true";
        if (!isLoad) {
          if (i >= list.length || index >= screenNum) {
            clearInterval(interval);
          } else {
            for (i; i < list.length; i++) {
              if (list[i].checkResultCode != 'DEVICERESULT03' && list[i].checkResultCode != 'DEVICERESULT02') {
                this.$refs.video.StopPlay(index);
                this.startPlay(list[i].videoId, index, list[i].videoName);
                // this.videoPlaying.push(list[i]);
                this.$set(this.videoPlaying, index, list[i]);
                this.videoInfo = list[i];
                index++;
                i++;
                break;
              }
            }
          }
        }
      }, 1000);
    },
    // 增加预置位
    setPresetFuc(name) {
      let videoId = this.videoInfo.videoId;
      this.$refs.video.setPreset(videoId, null, this.presetList.length, name);
      this.getPresetListFuc(videoId);
    },
    /* *
      * 播放视频
      * videoid：视频编号
      * selnum： 播放窗口
      * name： 视频名称
      * callback： 回调函数
      */
    startPlay(videoid, selnum, name, callback) {
      this.$refs.video.StartPlayById(videoid, selnum, name, () => {});
      // this.$refs.video.StartPlayById("20000", selnum, name, () => {});
    },
    initDt() {
      let videoUrl = this.$config.webservice_url;
      let videoUsername = this.$config.webservice_user;
      let videoPassword = this.$config.webservice_pwd;
      let streamIp = this.$config.stream_ip;
      let streamPort = this.$config.stream_port;
      this.$refs.video.init('allViedo', videoUrl, videoUsername, videoPassword, streamIp, streamPort);
      if ((this.videoInfo.name || this.videoListData.length > 0) && this.$refs.video && !this.$refs.video.sControl) {
          // this.$refs.video.init('', videoUrl, videoUsername, videoPassword, streamIp, streamPort);
          // CRealPlayer.init(null, this.$refs.video, 'http://192.168.91.136:9998/services/ejvideo', 'admin', 'admin', '192.168.91.136', '8081');
          // this.getPresetListFuc(this.videoInfo.videoId);
      }
    },
    getPresetListFuc(id, index) {
      this.presetList = [];
      if (index) {
        this.$refs.video.getPresetList(id, index);
      } else {
        this.$refs.video.getPresetList(id);
      }
      setTimeout(() => {
          var videoId = this.$refs.video.getVideoId(id);
          var presetList = this.$refs.video.listPresetInfo[videoId];
          if (presetList && presetList.length > 0) {
              presetList.forEach(element => {
                  element.status = 'show';
                  this.presetList.push(element);
              });
          }
      }, 2000);
    },
    OnVideoSelChanged() {
      let playSel;
      try {
        playSel = this.$refs.video.GetSelPlayIndex();
        if (this.videoPlaying[playSel]) {
          this.videoInfo = this.videoPlaying[playSel];
        } else {
          // this.videoInfo = {};
        }
      } catch (e) {}
    },
    // changeIndex(i) {
    //   this.videoIndex = i;
    // },
    setScreenNum(i) {
      this.$refs.video.SetScreenNum(i);
    },
    openDialog() {
      this.repairVisible = true;
      this.$nextTick(() => {
        this.$refs.dialogRepair.selectFault = "";
        this.$refs.dialogRepair.faultDesc = "";
      });
    },
    // 提交巡检结果
    submitNormal(type) {
        let data = this.videoInfo;
        data.devTypeCode = 'REPDEVTYPE02';
        data.devTypeName = '视频监控';
        data.devId = data.videoId;
        Request.insertCheckRecordInfoFuc(type, data, this.remarks, () => {
          Bus.$emit("video-group-reset", true);
        });
    },
    allSubmitNormal(normal) {
      this.videoUnPaly.forEach((val) => {
        let data = val;
        data.devTypeCode = 'REPDEVTYPE02';
        data.devTypeName = '视频监控';
        data.devId = data.videoId;
        Request.insertCheckRecordInfoFuc(normal, data, this.remarks, () => {
          Bus.$emit("video-group-reset", true);
        });
      });
    },
    // 录像
    recordingVideo() {
        if (this.recording) {
            this.stopRecord();
        } else {
            this.startRecord();
        }
        this.recording = !this.recording;
    },
    // 抓图
    catchPic() {
        var path = this.$refs.video.GetSYSPath();
        var url = this.$refs.video.CapPicSel(path, 'pic');
        alert(url);
    },
    // 开始录像
    startRecord() {
        this.$refs.video.StartRecordSel(this.$refs.video.GetSYSPath(), this.$refs.video.getVideoId());
    },
    // 结束录像
    stopRecord() {
        this.$refs.video.StopRecordSel();
    },
    // 获取目录
    getPath() {
        this.$refs.video.catalogClick();
    }
  }
};
</script>

<style scoped lang="less">
.depiction-info{
  margin: 14px 14px 0px 14px;
  background: #FFFFFF;
  border: 1px solid #E4EAEE;
  border-radius: 2px;
  .content{
    padding: 5px 10px 15px 10px;
    .content-video-name{
      line-height: 30px;
      height: 30px;
      font-size: 14px;
    }
    .content-row-video{
      margin-top: 10px;
      .content-col-video{

        .col-video-box{
          border: 1px solid #fff;
          box-sizing: border-box;
          &.active{
            // border: 1px solid #00c187;
            border-color: red;
          }
        }

        .video-box{
          background: #EDF0F6;
          min-height: 175px;
          height: 175px;
          overflow: hidden;
          position: relative;

          &:hover{
            .video-shadow{
              display: flex;
            }
          }
        }
        .video-shadow{
            opacity: 0.5;
            background: #000000;
            height: 30px;
            width: 100%;
            font-size: 12px;
            color: #FFFFFF;
            display: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            // position: absolute;
            left: 0;
            &.video-shadow-top{
              top: 0;
              line-height: 30px;
              span{
                line-height: 30px;
                &:first-child{
                  flex: 1;
                  padding: 0 10px;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                }
                &:last-child{
                  width: 130px;
                  position: relative;
                  &:after{
                    content: '';
                    display: block;
                    height: 30px;
                    width: 30px;
                    position: absolute;
                    right: 0;
                    top: 0;
                    background: url('../../assets/images/icon_larger.png') no-repeat center/16px;
                  }
                }
              }
            }
            &.video-shadow-bottom{
              bottom: 0;
              span{
                display: block;
                &:first-child{
                  margin-left: 10px;
                  a{
                    border: 1px solid #FFFFFF;
                    line-height: 18px;
                  }
                }
                &:last-child{
                  margin-right: 10px;
                  a{
                    margin-left: 15px;
                    background: #8A94A2;
                  }
                }
                a{
                  cursor: pointer;
                  display: inline-block;
                  box-sizing: border-box;
                  width: 50px;
                  height: 20px;
                  border-radius: 1px;
                  text-align: center;
                  line-height: 20px;
                }
              }
            }
          }
      }
    }
    .content-video{
      width: 100%;
      height: auto;
      height: 600px;
      position: relative;
    }
    .content-btns{
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      .video-btns{
        .icon-video-btn{
          display: inline-block;
          width: 32px;
          height: 32px;
          margin-left: 0px;
          cursor: pointer;
          background: url('../../assets/images/icon-video-btn.png') no-repeat;
        }
        .icon-video-btn1{
          background-position: 0 0;
        }
        .icon-video-btn2{
          background-position: -36px 0;
        }
        .icon-video-btn3{
          background-position: -71px 0;
        }
        .icon-video-btn4{
          background-position: -115px 0;
        }
        .icon-video-btn5{
          background-position: -149px 0;
        }
        .icon-video-btn6{
          background-position: -184px 0;
        }
      }
      .ej-btns{
        margin-top: 5px;
        height: 26px;
        a{
          display: inline-block;
          background: #00C187;
          border-radius: 1px;
          width: 70px;
          height: 26px;
          text-align: center;
          line-height: 26px;
          cursor: pointer;
          font-size: 12px;
          color: #FFFFFF;
          &:hover{opacity: 0.5;}
          &:active{opacity: 0.9;}
        }
        span{
          margin: 0 15px;
        }
      }
    }
  }
}
</style>
<style>
@media screen and (max-width: 1366px) {
  .depiction-info .content .content-video{height: 390px!important;}
}
@media screen and (min-width: 1367px) and (max-width: 1600px){
  .depiction-info .content .content-video{height: 520px!important;}
}
@media screen and (min-width: 1601px){
  .depiction-info .content .content-video{height: 700px!important;}
}

.iframe{
  display: block;
  position: fixed;
  visibility: inherit;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: transparent;
  width: 100%;
  height: 100%;
  opacity: 0;
  /* index: -1; */
  filter: alpha(opacity=0);
}
.iframe-top{
  z-index: 2;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
.tagObject{
        position: absolute;
        /* z-index: -1; */
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
    }
</style>
