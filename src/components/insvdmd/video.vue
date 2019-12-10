<template>
<div class="m-video-container" >
    <div class="m-popup-wrapper m-part-left">
        <div class="m-wrapper-angle"></div>
        <div class="m-wrapper-title">
            <span>视频列表</span>
        </div>
        <div class="m-wrapper-content">
            <el-scrollbar class="m-list-container">
                <!-- <el-tree class="m-tree-video" :data="videoListData"></el-tree> -->
                <ul class="m-video-list">
                    <li :class="{'active':selectedVideo.deviceId===item.deviceId}" @click="selectVideo(item)" v-for="item in videoListData" :key="item.deviceId">
                        <a :title="item.deviceName">
                            <i class="icon icon-video-ball"></i>
                            <span>{{item.deviceName}}</span>
                        </a>
                    </li>
                    <li v-if="videoListData.length===0">
                        <a :title="videoData.name">
                            <i class="icon icon-video-ball"></i>
                            <span>{{videoData.name}}</span>
                        </a>
                    </li>
                </ul>
            </el-scrollbar>
            <div class="m-control">
                <el-tabs v-model="activeControlType" type="card" @tab-click="tabClick">
                    <el-tab-pane label="云控制台" name="cloudCtrl">
                        <div class="m-cloud-box">
                            <a href="javascript:;" class="m-cloud m-cloud-1" title="左上" @mousedown="PtzCtrl(6, 1)" @mouseup="PtzCtrl(6, 0)"></a>
                            <a href="javascript:;" class="m-cloud m-cloud-2" title="上" @mousedown="PtzCtrl(2, 1)" @mouseup="PtzCtrl(2, 0)"></a>
                            <a href="javascript:;" class="m-cloud m-cloud-3" title="右上" @mousedown="PtzCtrl(8, 1)" @mouseup="PtzCtrl(8, 0)"></a>
                            <a href="javascript:;" class="m-cloud m-cloud-4" title="左" @mousedown="PtzCtrl(0, 1)" @mouseup="PtzCtrl(0, 0)"></a>
                            <a href="javascript:;" class="m-cloud m-cloud-5" title="右" @mousedown="PtzCtrl(1, 1)" @mouseup="PtzCtrl(1, 0)"></a>
                            <a href="javascript:;" class="m-cloud m-cloud-6" title="左下" @mousedown="PtzCtrl(7, 1)" @mouseup="PtzCtrl(7, 0)"></a>
                            <a href="javascript:;" class="m-cloud m-cloud-7" title="下" @mousedown="PtzCtrl(3, 1)" @mouseup="PtzCtrl(3, 0)"></a>
                            <a href="javascript:;" class="m-cloud m-cloud-8" title="右下" @mousedown="PtzCtrl(9, 1)" @mouseup="PtzCtrl(9, 0)"></a>
                        </div>
                        <div class="m-btns-group">
                            <div class="m-cloud-btns">
                                <label>光圈</label>
                                <a href="javascript:;" title="-" class="minbtn minbtn-minus" @mousedown="PtzCtrl(13, 1)" @mouseup="PtzCtrl(13, 0)"></a>
                                <a href="javascript:;" title="+" class="minbtn minbtn-plus" @mousedown="PtzCtrl(12, 1)" @mouseup="PtzCtrl(12, 0)"></a>
                            </div>
                            <div class="m-cloud-btns">
                                <label>变焦</label>
                                <a href="javascript:;" title="-" class="minbtn minbtn-minus" @mousedown="PtzCtrl(4, 1)" @mouseup="PtzCtrl(4, 0)"></a>
                                <a href="javascript:;" title="+" class="minbtn minbtn-plus" @mousedown="PtzCtrl(5, 1)" @mouseup="PtzCtrl(5, 0)"></a>
                            </div>
                            <div class="m-cloud-btns">
                                <label>聚焦</label>
                                <a href="javascript:;" title="-" class="minbtn minbtn-minus" @mousedown="PtzCtrl(11, 1)" @mouseup="PtzCtrl(11, 0)"></a>
                                <a href="javascript:;" title="+" class="minbtn minbtn-plus" @mousedown="PtzCtrl(10, 1)" @mouseup="PtzCtrl(10, 0)"></a>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="预置位" name="preset">
                        <div class="m-preset-edit">
                            <el-input placeholder="请输入名称" v-model="addedPresetName"></el-input>
                            <a class="btn-add" @click="addPreset">
                                <i class="icon icon-add"></i>
                            </a>
                        </div>
                        <el-scrollbar class="m-preset-list-container">
                            <ul class="m-preset-list">
                                <li v-for="(item,index) in presetList" :key="item.preset_id">
                                    <span v-if="item.status!=='edit'" class="name">{{item.preset_name}}</span>
                                    <el-input v-if="item.status==='edit'" v-model="editPresetName"></el-input>
                                    <div class="m-preset-btns" v-if="item.status!=='edit'">
                                        <a class="btn-edit" @click="editPreset(item)">
                                            <i class="icon icon-edit"></i>
                                        </a>
                                        <a class="btn-view" @click="playPreset(item)">
                                            <i class="icon icon-view"></i>
                                        </a>
                                        <a class="btn-del" @click="delPreset(index)">
                                            <i class="icon icon-trush"></i>
                                        </a>
                                    </div>
                                    <div class="m-preset-btns edit" v-if="item.status==='edit'">
                                        <a class="btn-confirmEdit" @click="confirmEditPreset(item)">
                                            <i class="el-icon-circle-check"></i>
                                        </a>
                                        <a class="btn-cancelEdit" @click="cancelEditPreset(item)">
                                            <i class="el-icon-circle-close"></i>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </el-scrollbar>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
    <div class="m-popup-wrapper m-part-right">
        <div class="m-wrapper-angle"></div>
        <div class="m-wrapper-title">
            <span>{{videoData.name?videoData.name:''}}</span>
            <a class="btn-close" @click="hideVideo">
                <i class="el-icon-close"></i>
            </a>
        </div>
        <div class="m-wrapper-content">
            <div class="m-video-box">
                <!-- <div class="m-video" id="videoPlayBox" ref="video">
                </div> -->
                <video-play class="m-video" ref="video"></video-play>
            </div>
            <div class="m-video-btns">
                <a class="btn-play" title="播放" v-if="!videoInfo.play" @click="play">
                    <i class="icon-video icon-video-play"></i>
                </a>
                <a class="btn-pause" title="暂停" v-if="videoInfo.play" @click="stop">
                    <i class="icon-video icon-video-pause"></i>
                </a>
                <a class="btn-catalog" title="目录" @click="getPath">
                    <i class="icon-video icon-video-catalog"></i>
                </a>
                <a class="btn-record" title="记录" @click="recordingVideo">
                    <i class="icon-video" :class="{'icon-video-record':!recording, 'icon-video-recording':recording}"></i>
                </a>
                <a class="btn-capture" title="抓拍" @click="catchPic">
                    <i class="icon-video icon-video-capture"></i>
                </a>
            </div>
        </div>
    </div>
</div>
</template>

<script>
// import CRealPlayer from 'commonjs/CRealPlayer';
import videoPlay from 'components/common/videoPlay';
export default {
    name: 'Video',
    props: ['videoData', 'videoListData'],
    components: {
        videoPlay
    },
    data() {
        return {
            activeControlType: 'cloudCtrl',
            videoInfo: {
                play: false
            },
            presetList: [],
            // videoVisible: false,
            videoVisible: true,
            addedPresetName: '',
            editPresetName: '',
            selectedVideo: {
                deviceId: ''
            },
            videoId: 1,
            visible: false,
            recording: false
        };
    },
    created() {
        this.crealplayer = {};
        console.log(this, this.$refs, this.$refs['video'], 'created');
    },
    methods: {
        /* eslint-disable */
        tabClick(callback) {
            // console.log(callback.index);
        },
        hideVideo() {
            this.videoVisible = false;
            this.$refs.video.sControl = null;
            this.videoInfo.name = '';
            this.$refs.video.innerHTML = '';
            this.$emit('video', {
                videoVisible: this.videoVisible
            });
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
        playPreset(item) {
            this.$refs.video.presetPlay(this.videoData.id, null, item.preset_id);
        },
        delPreset(index) {
            this.$confirm('确认删除该预置位?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.presetList.splice(index, 1);
                this.$refs.video.delPreset(this.videoData.id, null, this.presetList[index].preset_id);
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
        // 录像
        recordingVideo() {
            if (this.recording) {
                this.stopRecord();
            } else {
                this.startRecord();
            }
            this.recording = !this.recording;
        },
        // 选择视频点位
        selectVideo(item) {
            // console.log(item);
            this.selectedVideo = item;
            if (item.manageId) {
                this.$refs.video.StartPlayById(item.deviceId, null, 'test');
            } else {
                this.$message({
                    type: 'warning',
                    message: '该视频暂时无法播放!'
                });
            }
        },
        PtzCtrl(nOprCmd, nStop, callbck) {
            this.$refs.video.PtzCtrl(nOprCmd, nStop, callbck);
        },
        // 播放
        play() {
            let videoId = this.videoData.id ? this.videoData.id : this.selectedVideo.deviceId;
            // this.$refs.video.StartPlayById(20016, null, 'test');
            this.$refs.video.StartPlayById(videoId, null, 'test');
            this.videoInfo.play = true;
        },
        // 暂停
        stop() {
            this.$refs.video.StopPlay();
            this.videoInfo.play = false;
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
    },
    computed: {
        visible() {
            return this.videoData.show;
        },
        videoId() {
            return this.videoData.id;
        }
    },
    watch: {
        videoId(val) {
            if (val) {
                this.videoInfo = this.videoData;
                // this.videoInfo.play = true;
            }
        },
        visible(val) {
            this.videoVisible = val;
        }
    },
    updated() {
        console.log(this.$refs.video, 'updated');
        // console.log(this.videoListData.length, this.$refs.video.sControl);
        if ((this.videoInfo.name || this.videoListData.length > 0) && this.$refs.video && !this.$refs.video.sControl) {
            this.presetList = [];
            this.$refs.video.init('', videoUrl, videoUsername, videoPassword, streamIp, streamPort);
            // CRealPlayer.init(null, this.$refs.video, 'http://192.168.91.136:9998/services/ejvideo', 'admin', 'admin', '192.168.91.136', '8081');
            this.$refs.video.getPresetList(this.videoData.id);
            setTimeout(() => {
                var videoId = this.$refs.video.getVideoId(this.videoData.id);
                var presetList = this.$refs.video.listPresetInfo[videoId];
                if (presetList && presetList.length > 0) {
                    presetList.forEach(element => {
                        element.status = 'show';
                        this.presetList.push(element);
                    });
                }
            }, 2000);
        }
    }
};
</script>

<style lang='less'>
// @import "../assets/less/components/video.less";
</style>
