<template>
    <div class="dialog-video">
        <div class="dialog-main">
            <div class="video-content">
                <div class="video-left">
                    <el-scrollbar class="video-scroll">
                        <ul>
                            <li v-for="(item,index) in myVideoList" :key="index" @dblclick="startPlayVideo(item)" :title="item.videoName">{{item.videoName}}</li>
                        </ul>
                    </el-scrollbar>
                    <div class="video-cloud">
                        <h6>
                            <a :class="{'active':cloudCtrl}" @click="cloudCtrl = true">云台控制</a>
                            <a :class="{'active':!cloudCtrl}" @click="cloudCtrl = false">预置位</a>
                            </h6>
                        <div v-if="cloudCtrl" class="cloud-ctrl">
                            <div class="cloud-ctrl-left">
                                <a class="m-cloud m-cloud-1" title="左上" @mousedown="PtzCtrl(6, 1)" @mouseup="PtzCtrl(6, 0)"></a>
                                <a class="m-cloud m-cloud-2" title="上" @mousedown="PtzCtrl(2, 1)" @mouseup="PtzCtrl(2, 0)"></a>
                                <a class="m-cloud m-cloud-3" title="右上" @mousedown="PtzCtrl(8, 1)" @mouseup="PtzCtrl(8, 0)"></a>
                                <a class="m-cloud m-cloud-4" title="左" @mousedown="PtzCtrl(0, 1)" @mouseup="PtzCtrl(0, 0)"></a>
                                <a class="m-cloud m-cloud-5"></a>
                                <a class="m-cloud m-cloud-6" title="右" @mousedown="PtzCtrl(1, 1)" @mouseup="PtzCtrl(1, 0)"></a>
                                <a class="m-cloud m-cloud-7" title="左下" @mousedown="PtzCtrl(7, 1)" @mouseup="PtzCtrl(7, 0)"></a>
                                <a class="m-cloud m-cloud-8" title="下" @mousedown="PtzCtrl(3, 1)" @mouseup="PtzCtrl(3, 0)"></a>
                                <a class="m-cloud m-cloud-9" title="右下" @mousedown="PtzCtrl(9, 1)" @mouseup="PtzCtrl(9, 0)"></a>
                            </div>
                            <div class="cloud-ctrl-right">
                                <div class="m-btns-group g-posr">
                                    <div class="m-cloud-btns">
                                        <label>光圈</label>
                                        <a title="-" class="minbtn minbtn-minus" @mousedown="PtzCtrl(13, 1)" @mouseup="PtzCtrl(13, 0)"></a>
                                        <a title="+" class="minbtn minbtn-plus" @mousedown="PtzCtrl(12, 1)" @mouseup="PtzCtrl(12, 0)"></a>
                                    </div>
                                    <div class="m-cloud-btns">
                                        <label>变焦</label>
                                        <a title="-" class="minbtn minbtn-minus" @mousedown="PtzCtrl(4, 1)" @mouseup="PtzCtrl(4, 0)"></a>
                                        <a title="+" class="minbtn minbtn-plus" @mousedown="PtzCtrl(5, 1)" @mouseup="PtzCtrl(5, 0)"></a>
                                    </div>
                                    <div class="m-cloud-btns">
                                        <label>聚焦</label>
                                        <a title="-" class="minbtn minbtn-minus" @mousedown="PtzCtrl(11, 1)" @mouseup="PtzCtrl(11, 0)"></a>
                                        <a title="+" class="minbtn minbtn-plus" @mousedown="PtzCtrl(10, 1)" @mouseup="PtzCtrl(10, 0)"></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="!cloudCtrl" class="tab-pane">
                            <div class="m-video-preset">
                                <div class="m-preset-toolbar">
                                    <a v-if="!isAddPreset" class="m-preset-btn-add" @click="isAddPreset=true">添加预置位</a>
                                    <div v-if="isAddPreset" class="m-preset-form-add">
                                        <input v-model="addedPresetName" placeholder="请输入预置位名称" type="text" />
                                        <a class="btn-pre btn-pre-cancel" title="取消" @click="isAddPreset=false"></a>
                                        <a class="btn-pre btn-pre-confirm" title="确定" @click="addPreset"></a>
                                    </div>
                                </div>
                                <ul class="m-preset-list">
                                    <li>
                                        <a class="m-preset-name">预置点1</a>
                                        <span class="m-preset-fnbtns">
                                            <a class="btn-pre btn-pre-play" title="播放" @click="playPreset(index)"></a>
                                            <a class="btn-pre btn-pre-edit" title="编辑"></a>
                                            <a class="btn-pre btn-pre-delete" title="删除" @click="delPreset(index)"></a>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="video-right">
                    <div class="m-video-show">
                        <EJ-VideoPlay ref="video"></EJ-VideoPlay>
                    </div>
                    <div class="m-video-bar">
                        <div class="m-video-playbtns">
                            <a v-if="playing" class="icon-video-box icon-video-stop" title="停止" @click="stop"></a>
                            <a v-if="!playing" class="icon-video-box icon-video-play" title="播放" @click="play"></a>
                        </div>
                        <div class="m-video-layoutmenu">
                            <a class="icon-video-box icon-video-screen-one active" title="选择屏幕"></a>
                            <span class="btn-angle-updown"></span>
                            <iframe id="iframebar" class="video-iframe" marginheight="0" marginwidth="0" style="" frameborder="0"></iframe>
                            <ul class="m-video-layoutbtns">
                                <li>
                                    <a class="icon-video-box icon-video-screen-one" title="一屏" @click="SetRealplayScreenNum(1)"></a>
                                </li>
                                <li>
                                    <a class="icon-video-box icon-video-screen-four" title="四屏" @click="SetRealplayScreenNum(4)"></a>
                                </li>
                                <li>
                                    <a class="icon-video-box icon-video-screen-six" title="六屏" @click="SetRealplayScreenNum(6)"></a>
                                </li>
                                <li>
                                    <a class="icon-video-box icon-video-screen-nine" title="九屏" @click="SetRealplayScreenNum(9)"></a>
                                </li>
                                <li>
                                    <a class="icon-video-box icon-video-screen-full" title="全屏" @click="setRealPlayFullScreen()"></a>
                                </li>
                            </ul>
                        </div>
                        <div class="m-video-fnbtns">
                            <a class="icon-video-box icon-video-capture" title="抓图" @click="catchPic"></a>
                            <a class="icon-video-box icon-video-record" title="录像" @click="recordingVideo"></a>
                            <a class="icon-video-box icon-video-catalog" title="目录" @click="getPath"></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Common from "@/assets/js/common.js";
import Bus from "@/assets/js/bus.js";
import Request from "@/assets/js/request.js";
import VideoPlay from 'components/common/videoPlay';
export default {
    components: {
        "EJ-VideoPlay": VideoPlay
    },
    props: ["devTypeCode", "devId", "myVideoList"],
    data() {
        return {
            token: '',
            isAddPreset: false, // 是否添加预置位
            cloudCtrl: true, // true云台控制，false预置位
            recording: false, // 录像中
            playing: true, // 播放中
            presetList: [], // 点位列表
            addedPresetName: '', // 添加的点位名称
            editPresetName: '', // 编辑的点位名称
            videoInfo: {} // 当前视频信息
            // videoList: []// 视频列表（判断是否有关联视频用），myVideoList视频列表（数据处理用）
        };
    },
    watch: {
        videoInfo() {
            var manageId = this.$refs.video.getVideoId(this.videoInfo.manageId);
            this.presetList = this.$refs.video.listPresetInfo[manageId];
        }
    },
    mounted() {
        this.token = Common.getQueryString("token");
        // this.initDt();
        // this.getVideoList();
    },
    methods: {
        initDt() {
            let videoUrl = this.$config.webservice_url;
            let videoUsername = this.$config.webservice_user;
            let videoPassword = this.$config.webservice_pwd;
            let streamIp = this.$config.stream_ip;
            let streamPort = this.$config.stream_port;
            this.$refs.video.init('allViedo', videoUrl, videoUsername, videoPassword, streamIp, streamPort);
            // if ((this.videoInfo.name || this.videoListData.length > 0) && this.$refs.video && !this.$refs.video.sControl) {
            // }
        },
        getVideoList() {
            let host = this.$config.efoms_HOST;
            let method = this.$config.getVideoDeviceRltInfo_GET;
            let obj = {
                devTypeCode: this.devTypeCode,
                devId: this.devId
            };
            return this.$api.getMethod(host, method, obj, this.token);
            // .then(res => {
            //     if (res.appCode == 0) {
            //         this.videoList = res.resultList;
            //     } else {
            //     Common.printErrorLog(host, method);
            //     }
            // })
            // .catch(err => {
            //     Common.printErrorLog(host, method);
            //     console.log(err);
            // });
        },
        startPlayVideo(data) {
            this.videoInfo = data;
            this.play();
        },
        PtzCtrl(v1, v2) {
            this.$refs.video.PtzCtrl(v1, v2);
        },
        addPreset() {
            if (this.addedPresetName) {
                for (let i = 0; i < this.presetList.length; i++) {
                    if (this.presetList[i].preset_name === this.addedPresetName) {
                        alert('已存在的预置位名称');
                        return;
                    }
                }
                this.presetList.unshift({
                    preset_name: this.addedPresetName,
                    preset_id: this.presetList.length,
                    status: 'show'
                });
                this.$refs.video.setPreset(this.videoData.id, null, this.presetList.length, this.addedPresetName);
                this.addedPresetName = '';
            }
        },
        editPreset(item) {
            item.status = 'edit';
            this.editPresetName = item.preset_name;
        },
        playPreset(index) {
            this.$refs.video.presetPlay(this.videoData.id, null, this.presetList[index].preset_id);
        },
        delPreset(index) {
            this.$confirm('确认删除该预置位?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$refs.video.delPreset(this.videoData.id, null, this.presetList[index].preset_id);
                this.presetList.splice(index, 1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        confirmEditPreset(item) {
            item.preset_name = this.editPresetName;
            item.status = 'show';
            this.$refs.video.setPreset(this.videoData.id, null, item.preset_id, item.preset_name);
        },
        cancelEditPreset(item) {
            item.status = 'show';
        },
        // 播放
        play() {
            console.log(this.videoInfo);
            if (this.videoInfo && this.videoInfo.manageId) {
                let manageId = this.videoInfo.manageId;
                // this.$refs.video.StartPlayById(20016, null, 'test');
                this.$refs.video.StartPlayById(manageId, null, 'test');
                this.playing = true;
            }
        },
        // 暂停
        stop() {
            this.$refs.video.StopPlay();
            this.playing = false;
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
        },
        // 抓图
        catchPic() {
            var path = this.$refs.video.GetSYSPath();
            var url = this.$refs.video.CapPicSel(path, 'pic');
            alert(url);
        },
        // 选择屏幕数
        SetRealplayScreenNum(i) {
            this.$refs.video.SetScreenNum(i);
        }
    }
};
</script>

<style lang="less" scoped>
.dialog-video{
    .dialog-main{
        margin-top: -30px;
        padding: 10px 0 0 0;
        border-top:1px solid #EBEFF1;
    }
    .video-content{
        display: flex;
        .video-left{
            .video-scroll{
                height: 265px;
            }
            ul{
                width: 258px;
                line-height: 29px;
                color: #666;
                li{
                    padding: 0 5px 0 20px;
                    background: url('../../assets/images/icon_folders_new.png') no-repeat 2px -41px/16px;
                    background-position: 2px -41px;
                    cursor: pointer;
                    box-sizing: border-box;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    &:hover{
                        background-color: #f1f1f1;
                    }
                }
            }
            .video-cloud{
                h6{
                    display: flex;
                    line-height: 29px;
                    font-size: 12px;
                    text-align: center;
                    a{
                        color: #67717a;
                        display: block;
                        width: 50%;
                        background-color: #e2eaf2;
                        cursor: pointer;
                        &.active,&:hover{
                            background-color: #3c96ee;
                            color: #fff;
                        }
                    }
                }
                .cloud-ctrl{
                    display: flex;
                    background: url('../../assets/images/icon-cloud-bg.png') no-repeat 0 0/146px;
                    align-items: center;
                    height: 136px;
                    margin-top: 20px;
                    .cloud-ctrl-left{
                        width: 102px;
                        height: 102px;
                        margin: -9px 0px 0 22px;
                        position: relative;
                        .m-cloud{
                            background: url('../../assets/images/icon-cloud.png') no-repeat;
                            display: block;
                            width: 20px;
                            height: 20px;
                            position: absolute;
                            &:hover{
                                background-position-y: -20px;
                            }
                        }
                        .m-cloud-1{
                            left: 14px;
                            top: 13px;
                            background-position: 0 0;
                        }
                        .m-cloud-2{
                            left: 42px;
                            top: 1px;
                            background-position: -20px 0;
                        }
                        .m-cloud-3{
                            left: 68px;
                            top: 13px;
                            background-position: -40px 0;
                        }
                        .m-cloud-4{
                            left: 2px;
                            top: 41px;
                            background-position: -60px 0;
                        }
                        .m-cloud-5{
                            left: 34px;
                            top: 34px;
                            width: 34px;
                            height: 34px;
                            background-position: 0 -40px;
                            &:hover{
                                background-position: 0 -74px;
                            }
                        }
                        .m-cloud-6{
                            left: 82px;
                            top: 41px;
                            background-position: -80px 0;
                        }
                        .m-cloud-7{
                            left: 14px;
                            top: 69px;
                            background-position: -100px 0;
                        }
                        .m-cloud-8{
                            left: 42px;
                            top: 82px;
                            background-position: -120px 0;
                        }
                        .m-cloud-9{
                            left: 68px;
                            top: 69px;
                            background-position: -140px 0;
                        }
                    }
                    .cloud-ctrl-right{
                        margin-left: 18px;
                        .m-cloud-btns {
                            margin-top: 7px;
                            label{
                                font-size: 12px;
                                position: relative;
                                top: -5px;
                            }
                        }
                        .minbtn {
                            display: inline-block;
                            zoom: 1;
                            height: 32px;
                            width: 32px;
                            margin: -4px 0;
                            padding: 0;
                            border: none;
                            overflow: hidden;
                            cursor: pointer;
                            background: url(../../assets/images/min-btn.png) no-repeat;
                            &.minbtn-minus {
                                background-position: -72px 0;
                            }
                            &.minbtn-plus {
                                background-position: -101px 0;
                            }
                            &:hover{
                                background-position-y: -36px;
                            }
                        }
                    }
                }
                .tab-pane{
                    .m-video-preset{
                        .m-preset-toolbar{
                            font-size: 12px;
                            height: 26px;
                            border-bottom: 1px solid #c1daf2;
                            a{
                                color: #3c8dbc;
                            }
                            .m-preset-btn-add{
                                display: inline-block;
                                width: 176px;
                                height: 26px;
                                line-height: 26px;
                                padding: 0 8px;
                                cursor: pointer;
                                &::before{
                                    content: "";
                                    display: inline-block;
                                    width: 20px;
                                    height: 15px;
                                    background: url(../../assets/images/btns_preset.png) no-repeat;
                                    background-position: -51px -3px;
                                    position: relative;
                                    top: 3px;
                                }
                            }
                            .m-preset-form-add{
                                padding: 5px;
                                background: #dfefff;
                                .btn-pre{
                                    display: block;
                                    float: right;
                                    width: 21px;
                                    height: 21px;
                                    cursor: pointer;
                                    margin-right: 3px;
                                    background: url(../../assets/images/btns_preset.png) no-repeat;
                                    &.btn-pre-confirm{
                                        background-position: -71px 0;
                                    }
                                    &.btn-pre-cancel{
                                        background-position: -71px -18px;
                                    }
                                }
                            }
                            &:hover{
                                .m-preset-btn-add{
                                    &::before{
                                        background-position-y: -22px;
                                    }
                                }
                            }
                        }
                        .m-preset-list{
                            padding: 0;
                            margin: 0;
                            overflow: auto;
                            font-size: 12px;
                            height: 154px;
                            li{
                                padding: 0;
                                background-image: none;
                                position: relative;
                                a.m-preset-name{
                                    color: #1d7fdf;
                                    &::before{
                                        content: "";
                                        font-size: 12px;
                                        display: inline-block;
                                        width: 20px;
                                        height: 15px;
                                        background: url(../../assets/images/btns_preset.png) no-repeat;
                                        background-position: -27px -21px;
                                        position: relative;
                                        top: 2px;
                                    }
                                }
                                .m-preset-fnbtns{
                                    display: none;
                                    position: absolute;
                                    right: 5px;
                                    top: 3px;
                                    height: 20px;
                                    .btn-pre {
                                        display: inline-block;
                                        width: 15px;
                                        height: 15px;
                                        background: url(../../assets/images/btns_preset.png) no-repeat;
                                        margin-right: 3px;
                                        cursor: pointer;
                                        &.btn-pre-play {
                                            background-position: -96px -3px;
                                        }
                                        &.btn-pre-edit {
                                            background-position: -117px -3px;
                                        }
                                        &.btn-pre-delete {
                                            background-position: -139px -3px;
                                        }
                                        &:hover{
                                            background-position-y: -21px;
                                        }
                                    }
                                }
                                &:hover {
                                    background: #c1daf2;
                                    .m-preset-fnbtns{
                                        display: block;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .video-right{
            width: 433px;
            background: #000;
            color: #fff;
            .m-video-show{
                height: 435px;
            }
            .m-video-bar{
                width: 100%;
                height: 39px;
                border-top: 1px solid #000;
                background: #1f1e1e;
                position: relative;
                .m-video-playbtns{
                    float: left;
                    padding-left: 10px;
                }
                .m-video-layoutmenu{
                    position: relative;
                    padding: 0 10px;
                    border-left: 1px solid #000;
                    cursor: pointer;
                    float: right;
                    box-sizing: border-box;
                    .btn-angle-updown {
                        display: inline-block;
                        border-bottom: 5px solid #e2e2e2;
                        border-left: 5px solid transparent;
                        border-right: 5px solid transparent;
                        border-top: none;
                        box-sizing: border-box;
                        position: relative;
                        top: -10px;
                    }
                    .video-iframe{
                        display: none;
                        position: absolute;
                        visibility: inherit;
                        top: -191px;
                        // bottom: -3px;
                        // left: 0px;
                        right: 0;
                        width: 62px;
                        height: 195px;
                        background-color: black;
                    }
                    .m-video-layoutbtns{
                        z-index: 9999;
                        display: none;
                        position: absolute;
                        bottom: 20px;
                        right: 0;
                        margin: 0;
                        padding: 0 24px 10px 10px;
                        height: 200px;
                    }
                    &:hover{
                        .btn-angle-updown{
                            border-top: 5px solid #2888f3;
                            border-left: 5px solid transparent;
                            border-right: 5px solid transparent;
                            border-bottom: none;
                        }
                        .video-iframe{
                            display: block;
                        }
                        .m-video-layoutbtns{
                            display: block;
                        }
                    }
                }
                .m-video-fnbtns{
                    float: right;
                    padding-right: 10px;
                }
                .icon-video-box{
                    width: 28px;
                    height: 28px;
                    overflow: hidden;
                    display: inline-block;
                    cursor: pointer;
                    border-radius: 50%;
                    background: #2b2b2b url(../../assets/images/icons_video.png) no-repeat;
                    width: 28px;
                    height: 28px;
                    position: relative;
                    z-index: 1;
                    margin-top: 4px;
                    &.icon-video-stop{
                        background-position: -81px -4px;
                    }
                    &.icon-video-play{
                        background-position: -3px -4px;
                    }
                    &.icon-video-capture {
                        background-position: -271px -4px;
                    }
                    &.icon-video-record {
                        background-position: -612px -3px;
                    }
                    &.icon-video-catalog {
                        background-position: -385px -4px;
                    }
                    &.icon-video-screen-one {
                        background-position: -423px -4px;
                    }
                    &.icon-video-screen-four {
                        background-position: -461px -4px;
                    }
                    &.icon-video-screen-six {
                        background-position: -499px -4px;
                    }
                    &.icon-video-screen-nine {
                        background-position: -537px -4px;
                    }
                    &.icon-video-screen-full {
                        background-position: -575px -4px;
                    }
                    &:hover,&.active{
                        background-position-y: -42px;
                    }
                }
            }
        }
    }
}
</style>
<style>
.dialog-video .el-scrollbar__view{min-height: auto;}
.dialog-video .el-scrollbar__wrap{overflow-x: hidden;}
</style>
