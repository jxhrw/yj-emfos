<template>
<div class="base-info">
    <div class="content">
        <!-- <el-row class="content-row-select">
            <el-col :span="24">
                <label>所属区域</label>
                <el-input v-model="selectRegion" placeholder="请选择所属区域" size='mini' class="content-select" clearable  readonly v-popover:popoverSelectRegion></el-input>
                <el-popover
                highlight-current
                popper-class="region-popper"
                ref="popoverSelectRegion"
                placement="bottom-start"
                trigger="click"
                v-model="selectRegionVisible">
                    <el-scrollbar class="region-scroll">
                    <el-tree id="selectRegion" :data="regionList" accordion :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                    </el-scrollbar>
                </el-popover>
            </el-col>
        </el-row> -->
        <el-row class="content-row-select  content-row-foot">
            <el-col :span="24">
                <!-- <label>关键字</label> -->
                <el-input v-model="keyVal" placeholder="请输入编号/名称" size='mini' class="content-select" clearable></el-input>
                <div class="content-search" @click="searchTable"></div>
            </el-col>
        </el-row>
        <div class="grouping">
            <p class="group-total">组列表 <span @click="openAddGroupVisible"></span></p>
            <el-scrollbar class="ej-group-scrollbar">
                <template v-for="(item,index) in treeData">
                    <div :key="index">
                        <p class="tree-parent">
                            <span class="tree-group-name"  :class="{'is-leaf': item.videoRelationInfoList.length>0,'is-open':expandedKeys.indexOf(index)>-1}" @click="showThisUl(index)">
                            <span >{{item.videoGroupName}}</span>
                            </span>
                            <span class="tree-btns">
                                <span class="icon-btn icon-delete" @click="submitDeleteGroup(item)"></span>
                                <span class="icon-btn icon-tree-add" @click="openEditPointVisible(item)"></span>
                                <span class="icon-btn icon-edit" @click="openEditGroupVisible(item)"></span>
                                <span class="icon-btn icon-play" @click="playStart(item)"></span>
                            </span>
                        </p>
                        <ul v-if="item.videoRelationInfoList.length>0" :class="{'is-open':expandedKeys.indexOf(index)>-1}">
                        <template v-for="(child,index2) in item.videoRelationInfoList">
                                <li class="tree-child" @click="treeChildClick(child)" :key="index2" :class="{'is-select':videoInfo.videoId===child.videoId}">
                                    <span class="grouping-icon" :class="child.wranLevelCode || 'DEVWRANLEVEL03'"></span>
                                    <span class="grouping-ins-name" :class="{'is-playing':JSON.stringify(videoPlaying).indexOf(JSON.stringify(child.videoId))>-1}">{{child.devName}}</span>
                                    <span class="grouping-ins-division">|</span>
                                    <span class="grouping-ins-status" :class="child.checkResultCode">{{child.repStatusName}}</span>
                                </li>
                        </template>
                        </ul>
                    </div>
                </template>
            </el-scrollbar>
        </div>
        <div class="operation">
            <el-row>
                <el-col :span="12" class="operation-tab">
                    <p :class="{'active':pointControl==0}" @click="pointControlChange(0)">云控制台</p>
                </el-col>
                <el-col :span="12" class="operation-tab" >
                    <p :class="{'active':pointControl==1}" @click="pointControl=1">预置位</p>
                </el-col>
            </el-row>
            <div style="height:150px;">
                <el-row v-show="pointControl==0" type="flex" justify="center" align="middle">
                    <el-col :span="12" class="operation-btn">
                        <div class="m-cloud-box">
                            <a href="javascript:;" class="m-cloud m-cloud-1" title="左上" @mousedown="PtzCtrl(6, 1)" @mouseup="PtzCtrl(6, 0)"></a>
                            <a href="javascript:;" class="m-cloud m-cloud-2" title="上" @mousedown="PtzCtrl(2, 1)" @mouseup="PtzCtrl(2, 0)"></a>
                            <a href="javascript:;" class="m-cloud m-cloud-3" title="右上" @mousedown="PtzCtrl(8, 1)" @mouseup="PtzCtrl(8, 0)"></a>
                            <br>
                            <a href="javascript:;" class="m-cloud m-cloud-4" title="左" @mousedown="PtzCtrl(0, 1)" @mouseup="PtzCtrl(0, 0)"></a>
                            <a href="javascript:;" class="m-cloud m-cloud-0"></a>
                            <a href="javascript:;" class="m-cloud m-cloud-5" title="右" @mousedown="PtzCtrl(1, 1)" @mouseup="PtzCtrl(1, 0)"></a>
                            <br>
                            <a href="javascript:;" class="m-cloud m-cloud-6" title="左下" @mousedown="PtzCtrl(7, 1)" @mouseup="PtzCtrl(7, 0)"></a>
                            <a href="javascript:;" class="m-cloud m-cloud-7" title="下" @mousedown="PtzCtrl(3, 1)" @mouseup="PtzCtrl(3, 0)"></a>
                            <a href="javascript:;" class="m-cloud m-cloud-8" title="右下" @mousedown="PtzCtrl(9, 1)" @mouseup="PtzCtrl(9, 0)"></a>
                        </div>
                    </el-col>
                    <el-col :span="12" class="operation-btn">
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
                    </el-col>
                </el-row>
                <div v-show="pointControl==1">
                    <div class="m-video-preset">
                        <div class="m-preset-toolbar">
                            <a v-if="!isAllow" class="m-preset-btn-add" @click="isAllowChangeFuc">添加预置位</a>
                            <div v-if="isAllow" class="m-preset-form-add">
                                <input v-model="presetAddText" placeholder="请输入预置位名称" type="text" />
                                <a class="btn-pre btn-pre-cancel" title="取消" @click="cancelAddPresetFuc"></a>
                                <a class="btn-pre btn-pre-confirm" title="确定" @click="addPresetFuc"></a>
                            </div>
                        </div>
                        <ul class="m-preset-list">
                            <template v-for="(item,index) in presetList">
                            <li :key="index">
                                <a class="m-preset-name">{{item.preset_name}}</a>
                                <span class="m-preset-fnbtns">
                                    <a class="btn-pre btn-pre-play" title="播放" @click="playPreset(index)"></a>
                                    <a class="btn-pre btn-pre-edit" title="编辑"></a>
                                    <a class="btn-pre btn-pre-delete" title="删除" @click="delPreset(index)"></a>
                                </span>
                            </li>
                            </template>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <el-dialog :title="groupInfoTitle" :visible.sync="addGroupVisible" width='276px' class="dialog-urge" :modal="false">
        <div class="dialog-main">
            <div class="revoke-reason">
                <label class="dialog-label">分组名称</label>
                <el-input v-model="addGroupInfo.videoGroupName" placeholder="请输入" size='mini' class="content-select input-mini" clearable></el-input>
            </div>
            <div class="revoke-reason">
                <label class="dialog-label">备注说明</label>
                <!-- <el-input type="textarea" placeholder="请输入" class="input-mini" v-model="addGroupInfo.groupMemo" resize='none'></el-input> -->
                <textarea rows="6" cols="40" placeholder="请输入" class="dialog-content input-mini" v-model="addGroupInfo.groupMemo" style="resize:none"></textarea>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitAddGroup" size='mini' class="submit">提 交</el-button>
            <el-button @click="addGroupVisible = false" size='mini' class="cancel">取 消</el-button>
        </div>
    </el-dialog>

    <el-dialog title="编辑点位" :visible.sync="editPointVisible" width='520px' class="dialog-urge" :modal="false">
        <div class="dialog-main">
            <div class="revoke-reason">
                <div>
                    <label class="dialog-label">ID</label>
                    <el-input v-model="pointConditions.devId" placeholder="请输入" size='mini' class="content-select input-mini" clearable></el-input>
                </div>
                <div>
                    <label class="dialog-label">名称</label>
                    <el-input v-model="pointConditions.devName" placeholder="请输入" size='mini' class="content-select input-mini" clearable></el-input>
                </div>
            </div>
            <div class="revoke-reason">
                <div>
                    <label class="dialog-label">是否已选</label>
                   <el-select v-model="pointConditions.isSelect" placeholder="请选择" size='mini' class="content-select input-mini" clearable>
                        <el-option label="已选点位" value="1"></el-option>
                        <el-option label="未选点位" value="0"></el-option>
                </el-select>
                </div>
                <div>
                    <el-button type="primary" @click="getSelectVideoByPage" size='mini' class="submit">查 询</el-button>
                </div>
            </div>
            <div>
                <el-table highlight-current-row ref="multipleTable" :data="pointTableShow" stripe border height="300" class="content-table" @selection-change="handleSelectionChange">
                <el-table-column type="selection" label="全选"></el-table-column>
                <el-table-column prop="devId" label="ID" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="devName" label="设备名称" show-overflow-tooltip min-width="160"></el-table-column>
                <el-table-column prop="devAreaName" label="所属辖区"
                show-overflow-tooltip></el-table-column>
                </el-table>
                <EJ-Paging ref="tableList" id="insvdmdDp" :totalCount="totalCount" :totalPage="totalPage" :queryConditions="pointConditions" :hostName="pointHost" :methodsName="pointMethods"></EJ-Paging>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="editPointVisible = false" size='mini' class="submit">提 交</el-button>
            <el-button @click="editPointVisible = false" size='mini' class="cancel">取 消</el-button>
        </div>
    </el-dialog>
</div>
</template>
<script>
import Common from "@/assets/js/common.js";
import Bus from "@/assets/js/bus.js";
import Paging from "components/common/paging";
let clickCount = 0;
let clickTime;
let oldPointTable = [];// 存放点位编辑前的状态
export default {
  components: {
      "EJ-Paging": Paging
  },
  data() {
    return {
      title: '基本信息',
        token: '',
        regionList: [],
        selectRegion: '', // 区域编号
        selectRegionCode: '',
        keyVal: '', // 关键字，名称/编号
        treeData: [],
        expandedKeys: [], // 哪些树是展开的
        addGroupVisible: false,
        editPointVisible: false,
        groupInfoTitle: "",
        addGroupInfo: {},
        pointControl: 0, // 当前处于云控制台还是预制位，只有0/1
        isAddGroup: true, // true新增，false修改
        editPointCond: {},
        pointTable: [], // 当前组选中的数据
        pointTableShow: [],
        pointIniting: false, // 点位数据初始化中
        pointConditions: { // 点位查询条件
            pageSize: 10,
            currentPage: 1,
            videoGroupId: '',
            isSelect: '',
            devId: '',
            devName: '',
            key: '',
            devAreaCode: '',
            devDeptId: ''
        },
        totalCount: 0,
        totalPage: 1,
        pointHost: '',
        pointMethods: '',

        videoListData: [], // 当前正在巡检的视频组列表
        videoInfo: {}, // 当前选中组
        videoPlaying: [], // 正在播放的列表
        listPresetInfo: [], // 点位信息列表

        presetList: [], // 预置位列表
        presetIndex: '', // 选中预置位索引
        presetAddText: '', // 增加预置位文本
        isAllow: false, // 是否允许添加预置位

        selectRegionVisible: false,
        defaultProps: {
          children: 'children',
          label: 'text'
        }
    };
  },
  watch: {
      selectRegion(newVal, oldVal) {
          if (newVal === '') {
              this.selectRegionCode = '';
              setTimeout(() => {
                this.selectRegionVisible = false;
              });
          }
      }
  },
  mounted() {
    this.token = Common.getQueryString("token");
    this.pointHost = this.$config.efoms_HOST;
    this.pointMethods = '/deviceDetail/selectVideoByPage';
    this.getRegionTree(null).then(res => {
        if (res.appCode == 0) { this.regionList = res.resultList; }
    });
    this.getVideoGroupInfo();
    Bus.$on("page-insvdmdDp", value => {
      this.pointIniting = true;
      this.pointTableShow = value;
      this.$nextTick(() => {
          this.pointIniting = false;
      });
    });
    Bus.$on("page-loading-insvdmdDp", value => {
      this.isTableLoading = value;
    });
    Bus.$on("video-info-change", value => {
      this.videoInfo = value;
    });
    Bus.$on("video-playing-change", value => {
      this.videoPlaying = value;
    });
    Bus.$on("video-presetList", value => {
      this.presetList = value;
    });
    Bus.$on("video-group-reset", value => {
      this.getVideoGroupInfo();
    });
  },
  methods: {
    // 改变预置位允许状态
    isAllowChangeFuc() {
        this.isAllow = true;
        this.presetAddText = '';
    },
    // 增加预置位
    addPresetFuc() {
        if (this.presetAddText) {
            for (let i = 0; i < this.presetList.length; i++) {
                if (this.presetList[i].preset_name === this.presetAddText) {
                    alert('已存在的预置位名称');
                    return;
                }
            }
            this.presetList.unshift({
                preset_name: this.presetAddText,
                preset_id: this.presetList.length,
                status: 'show'
            });
            Bus.$emit('video-addPreset', this.presetAddText);
            this.cancelAddPresetFuc();
        }
    },
    // 取消增加预置位
    cancelAddPresetFuc() {
        this.isAllow = false;
    },
    // 选择云控制台/预置位
    pointControlChange(i) {
        this.pointControl = i;
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
    // 树节点展开
    showThisUl(i) {
        let index = this.expandedKeys.indexOf(i);
        if (index > -1) {
        this.expandedKeys.splice(index, 1);
        } else {
        this.expandedKeys.push(i);
        }
    },
    playStart(item) {
        Bus.$emit("video-group-list", item.videoRelationInfoList);
    },
    getSelectVideoByPage() {
        let host = this.pointHost;
        let method = this.pointMethods;
        this.pointIniting = true;
        this.$api.getMethod(host, method, this.pointConditions, this.token)
        .then(res => {
            if (res.appCode == 0) {
                this.pointTableShow = res.resultList.result;
                this.totalPage = res.resultList.totalPage;
                this.totalCount = res.resultList.totalCount;
                this.$refs.multipleTable.clearSelection();
                this.$nextTick(() => {
                    res.resultList.result.forEach(val => {
                        if (val.isSelect) {
                            this.$refs.multipleTable.toggleRowSelection(val, true);
                        }
                    });
                    this.pointIniting = false;
                });
                // rows.forEach(row => {
                //     this.$refs.multipleTable.toggleRowSelection(row,true);
                // });
            } else {
                this.pointIniting = false;
                Common.printErrorLog(host, method);
            }
        })
        .catch(err => {
            this.pointIniting = false;
            Common.printErrorLog(host, method);
            console.log(err);
        });
    },
    PtzCtrl(num1, num2) {
        let a = [num1, num2];
        Bus.$emit("vedio-ptzCtrl", a);
    },
    treeChildClick(data) {
        clickCount++;
        clearTimeout();
        clickTime = setTimeout(() => {
            if (clickCount == 1) {
                console.log("单击");
            }
            if (clickCount == 2) {
                console.log("双击");
                Bus.$emit("video-paly-statr", data);
            }
            clickCount = 0;
        }, 300);
    },
    openAddGroupVisible() {
        this.groupInfoTitle = "新增组";
        this.addGroupInfo = {};
        this.isAddGroup = true;
        this.addGroupVisible = true;
    },
    openEditGroupVisible(data) {
        this.groupInfoTitle = "编辑组";
        this.addGroupInfo = {};
        this.isAddGroup = false;
        this.addGroupInfo.videoGroupId = data.videoGroupId;
        this.treeData.forEach(val => {
            if (val.videoGroupId == data.videoGroupId) {
                this.addGroupInfo.videoGroupName = val.videoGroupName;
                this.addGroupInfo.groupMemo = val.groupMemo;
            }
        });
        this.addGroupVisible = true;
    },
    openEditPointVisible(data) {
        this.editPointVisible = true;
        this.pointConditions.videoGroupId = data.videoGroupId;
        this.pointConditions.devId = '';
        this.pointConditions.devName = '';
        this.pointConditions.isSelect = '';
        // this.expandedKeys[0] = data.videoGroupId;
        this.getSelectVideoByPage();
    },
    // 触发选中按钮
    handleSelectionChange(val) {
        console.log(this.pointIniting);
        if (!this.pointIniting) {
            let arr = this.contrastArr(val, oldPointTable);
            let videoGroupId = this.pointConditions.videoGroupId;
            let narr = [];
            arr.diff.forEach(val => {
                let obj = {
                    "videoGroupId": videoGroupId,
                    "videoId": val.devId,
                    "videoName": val.devName,
                    "devAreaCode": val.devAreaCode,
                    "devAreaName": val.devAreaName,
                    "manageid": val.videoPlayId,
                    "memo": ""
                };
                narr.push(obj);
            });
            if (arr.type === '增加') {
                this.insertVideoRelation(narr);
            } else {
                this.deleteVideoReletion(narr);
            }
        }
        oldPointTable = val;
    },
    // 视频添加关联
    insertVideoRelation(arr) {
        let host = this.$config.efoms_HOST;
        let method = '/videoRelation/insertVideoRelationInfo';
        this.$api.postMethod(host, method, arr, this.token, 'noContentType')
        .then(res => {
            if (res.appCode == 0) {
                this.getVideoGroupInfo();
            } else {
                Common.printErrorLog(host, method);
            }
        })
        .catch(err => {
            Common.printErrorLog(host, method);
            console.log(err);
        });
    },
    // 视频删除关联
    deleteVideoReletion(arr) {
        let host = this.$config.efoms_HOST;
        let method = '/videoRelation/deleteVideoReletionByGroupIdAndVideoId';
        this.$api.postMethod(host, method, arr, this.token, 'noContentType')
        .then(res => {
            if (res.appCode == 0) {
                this.getVideoGroupInfo();
            } else {
                Common.printErrorLog(host, method);
            }
        })
        .catch(err => {
            Common.printErrorLog(host, method);
            console.log(err);
        });
    },
    // 对比数组数据变化
    contrastArr(newArr, oldArr) {
        let type = "";
        let difference = [];
        let isAdd = newArr.length > oldArr.length;
        type = isAdd ? "增加" : "减少";
        if (isAdd) {
            difference = this.diffArr(newArr, oldArr);
        } else {
            difference = this.diffArr(oldArr, newArr);
        }
        return {type: type, diff: difference};
    },
    diffArr(obj1, obj2) {
        let diff = [];
        obj1.forEach(val => {
            let isExist = false;
            obj2.forEach(v => {
                if (v.devId == val.devId) {
                    isExist = true;
                    return false;
                }
            });
            if (!isExist) {
                diff.push(val);
            }
        });
        return diff;
    },
    submitAddGroup() {
        let host = this.$config.efoms_HOST;
        let method = '/videoGroup/insertVideoGroupInfo';
        method = this.isAddGroup ? method : '/videoGroup/updateVideoGroupInfo';
        this.$api.postMethod(host, method, this.addGroupInfo, this.token, 'noContentType')
        .then(res => {
            if (res.appCode == 0) {
                this.addGroupVisible = false;
                this.addGroupInfo = {};
                this.getVideoGroupInfo();
            } else {
                Common.printErrorLog(host, method);
            }
        })
        .catch(err => {
            Common.printErrorLog(host, method);
            console.log(err);
        });
    },
    submitDeleteGroup(data) {
        let host = this.$config.efoms_HOST;
        let method = '/videoGroup/deleteVideoGroupInfo';
        this.$confirm('此操作将删除分组：' + data.videoGroupName + ', 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.deleteMethod(host, method, {'VideoGroupId': data.videoGroupId}, this.token, 'noContentType')
            .then(res => {
                if (res.appCode == 0) {
                    Common.ejMessage("success");
                    this.getVideoGroupInfo();
                } else {
                    Common.ejMessage("warning");
                    Common.printErrorLog(host, method);
                }
            })
            .catch(err => {
                Common.ejMessage("warning");
                Common.printErrorLog(host, method);
                console.log(err);
            });
          }).catch(() => {});
    },
      // 获取视频树形分组
    getVideoGroupInfo(obj) {
        let data = obj || {};
        let host = this.$config.efoms_HOST;
        let method = '/videoGroup/getVideoGroupInfoList';
        this.$api.getMethod(host, method, data, this.token)
        .then(res => {
            if (res.appCode == 0) {
                this.treeData = res.resultList;
            } else {
                Common.printErrorLog(host, method);
            }
        })
        .catch(err => {
            Common.printErrorLog(host, method);
            console.log(err);
        });
    },
        // 区域
    handleNodeClick(data, node, e) {
        let thisId = e.$parent.$parent.$parent.$attrs.id || e.$parent.$parent.$attrs.id || e.$parent.$attrs.id;
        if (!data.children || data.children.length == 0) {
            this.selectRegion = data.text;
            this.selectRegionCode = data.id;
            this.selectRegionVisible = false;
        }
    },
    getRegionInfo(parentCode) {
        return this.$api.getMethod(this.$config.ubms_HOST, '/RegionInfo/getRegionInfo.htm', {token: this.token, data: JSON.stringify({parentCode: parentCode})});
    },
    getRegionTree(parentCode) {
         return this.$api.getMethod(this.$config.efoms_HOST, '/ubmsService/getRegionTree', {token: this.token, data: JSON.stringify({regionId: parentCode})});
    },
    searchTable() {
        this.getVideoGroupInfo({key: this.keyVal, devAreaCode: this.selectRegionCode});
    }
  }
};
</script>
<style scoped>
.base-info{margin: 14px 14px 10px 14px;background: #FFFFFF;border: 1px solid #E4EAEE;border-radius: 2px;}
.base-info .title{height: 36px;border-bottom: 1px solid #EBEFF1;margin: 0 58px 0 40px;}
.base-info .title::before{content: '';position: relative;left: -41px;top: 10px;border-left: 2px solid #00C187;}
.base-info .title h3{font-size: 14px;color: #22262E;line-height: 0px;}
.base-info .content{padding-top: 5px;padding-left: 0px;padding-bottom: 0px;}
.base-info .content .content-row-select{margin-top: 10px;padding-left: 15px;}
.base-info .content .content-row-select.content-row-foot{margin-bottom: 15px;}
.base-info .content label{color: #4F5A64;display: inline-block;width: 48px;font-size: 12px; margin-right: 12px;text-align: right;}
.base-info .content span{font-size: 12px;color: #737E84;}
.base-info .content .content-select{width: 80%;}
.base-info .content .content-search{background: url(../../assets/images/icon-search.png) no-repeat center/100% 100%;width: 20px;height: 20px;display: inline-block;margin-left: 5px;position: relative;top: 5px;cursor: pointer;}
.base-info .content .grouping{font-size: 12px;color: #4F5A64;line-height: 30px;}
.base-info .content .grouping .ej-group-scrollbar{height: 390px;}
.base-info .content .grouping .ej-group-scrollbar >>> .el-scrollbar__wrap{overflow-x: hidden;}
.base-info .content .grouping .group-total{display: flex;padding: 0 10px 0 15px;justify-content: space-between;align-items: center;}
.base-info .content .grouping .group-total span{display: block;width: 20px;height: 20px;background: url('../../assets/images/icon_add_group.png') no-repeat -1px -2px/50px;cursor: pointer;}
.base-info .content .operation{font-size: 12px;color: #4F5A64;}
.base-info .content .operation .operation-tab{background: #EDF0F6;text-align: center;line-height: 32px;cursor: pointer;}
.base-info .content .operation .operation-tab .active{background: #6BA1EB;color: #ffffff;}
.base-info .content .operation .operation-btn button{height: 10px;width: 20px;padding: 0;line-height: 8px;}

.dialog-urge .dialog-main{margin-top: -30px;padding: 10px 0 0 0;border-top: 1px solid #EBEFF1;}
.dialog-urge .dialog-main .dialog-label{/*float: left;*/display: inline-block;font-size: 12px;margin-right: 8px;width: 48px;text-align: right;line-height: 28px;}
.dialog-urge .dialog-main .revoke-reason{margin-bottom: 13px;display: flex;justify-content:space-between;}
.dialog-urge .dialog-main .revoke-reason:last-child{margin-bottom: 0;}
.dialog-urge .dialog-main .dialog-content{box-sizing: border-box;resize: none;background: #fff;border-radius: 4px;border: 1px solid rgb(220, 223, 230);padding: 5px 15px;color: #606266;font-size: 12px;}
.dialog-urge .dialog-main .dialog-content:hover{border-color: #c0c4cc;}
.dialog-urge .dialog-main .dialog-content:focus{border-color: #409EFF;outline: 0;}
.dialog-urge .dialog-main .content-select{width: 300px;}
.dialog-urge .dialog-main .input-mini{width: 170px;}
.dialog-urge .dialog-footer{text-align: center;}
.dialog-urge .dialog-main .submit,.dialog-urge .dialog-footer .submit{margin-right: 20px;background: #00C187;border-color: #E1E7ED;}
.dialog-urge .dialog-main .submit{margin: 0;}
.dialog-urge .dialog-main .submit,.dialog-urge .dialog-footer .submit:hover {background: #00C187;border-color: #E1E7ED;}
.dialog-urge .dialog-footer .cancel {background: #F9FAFC;border-color: #E1E7ED;color: #6C7883;}

.dialog-urge >>> .el-dialog__header span{font-size: 14px;color: #22262E;line-height: 19px;}
.dialog-urge >>> .el-dialog__headerbtn{top: 24px;}
</style>

<style>
.dialog-urge .dialog-main .page-frist{top: 1px;position: relative;}
.dialog-urge .dialog-main .page-size{top: -1px;position: relative;}
.dialog-urge .dialog-main .my-el-page{top: -1px;position: relative;}
.base-info .content .content-select .el-input__inner{border-radius: 0;background: #F9FAFC;border: 1px solid #E1E7ED;}
.base-info .content .content-select .el-input__suffix{border-left: 1px solid #E1E7ED;}

.base-info .content .grouping .tree-parent{
    display: flex;
    align-items: center;
    /* max-width: 88%; */
    /* width: 100%; */
    padding-right: 10px;
}
.base-info .content .grouping .tree-parent .tree-group-name{
    flex: 1;
    padding-left: 34px;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    cursor: pointer;
}
/* .base-info .content .grouping .tree-parent .tree-group-name.is-leaf{
    background: url('../../assets/images/icon_folders_new.png') no-repeat 10px -12px/23px;
}
.base-info .content .grouping .tree-parent .tree-group-name.is-leaf.is-open{
    background-position-y: 9px;
} */
.base-info .content .grouping .tree-parent .tree-group-name{
    background: url('../../assets/images/icon_folders_new.png') no-repeat 10px -12px/23px;
}
.base-info .content .grouping .tree-parent .tree-group-name.is-open{
    background-position-y: 9px;
}
.base-info .content .grouping .tree-parent .tree-btns{
    width: 84px;
    display: flex;
    justify-content: space-between;
}
.base-info .content .grouping .tree-parent .tree-btns .icon-btn{
    width: 16px;
    height: 16px;
    display: block;
    padding: 0;
    margin: 0;
    cursor: pointer;
}
.base-info .content .grouping .tree-parent .tree-btns .icon-delete{
    background: url('../../assets/images/icon_delete.png') no-repeat 0 0/100%;
}
.base-info .content .grouping .tree-parent .tree-btns .icon-tree-add{
    background: url('../../assets/images/icon_add_video.png') no-repeat 1px -1px/90%;
}
.base-info .content .grouping .tree-parent .tree-btns .icon-edit{
    background: url('../../assets/images/icon_edict.png') no-repeat 3px 0/76%;
}
.base-info .content .grouping .tree-parent .tree-btns .icon-play{
    background: url('../../assets/images/icon_play.png') no-repeat 1px 0/90%;
}
.base-info .content .grouping ul{
    overflow: hidden;
    transition: height 0.5s ease;
    height: 0;
}
.base-info .content .grouping ul.is-open{
    height: auto;
}
.base-info .content .grouping .tree-child{
    display: flex;
    width: 100%;
    height: 28px;
    line-height: 28px;
    padding: 0 10px 0 20px;
    box-sizing: border-box;
    cursor: pointer;
}
.base-info .content .grouping .tree-child.is-select{
    background-color: #D7D7D7;;
}
.base-info .content .grouping .tree-child .is-playing{
    color: #6BA1EB;
}
.base-info .content .grouping .tree-child .grouping-ins-name{
    display: block;
    flex: 1;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.base-info .content .grouping .tree-child .grouping-icon{
    display: inline-block;
    width: 16px;
    height: 28px;
    background: no-repeat center left/9px;
    position: relative;
}
.base-info .content .grouping .tree-child .grouping-icon.DEVWRANLEVEL01{background-image: url("../../assets/images/icon-abn-danger.png");}
.base-info .content .grouping .tree-child .grouping-icon.DEVWRANLEVEL02{background-image: url("../../assets/images/icon-abn-warning.png");}
.base-info .content .grouping .tree-child .grouping-icon.DEVWRANLEVEL03{background-image: url("../../assets/images/icon-play-green.png");background-position-x: 1px;background-size: 8px;}
.base-info .content .grouping .tree-child .grouping-ins-division{
    display: block;
    width: 20px;
    text-align: center;
    color: #979797;
    opacity: 0.3;
}
.base-info .content .grouping .tree-child .grouping-ins-status{
    display: block;
    width: 70px;
    position: relative;
}
.base-info .content .grouping .tree-child .grouping-ins-status::after{
    display: inline-block;
    content: "";
    width: 30px;
    height: 16px;
    background: no-repeat center right/contain;
    position: absolute;
    top: 6px;
    right: 0;
}
.base-info .content .grouping .tree-child .grouping-ins-status.DEVICERESULT02::after{background-image: url('../../assets/images/icon-normal.png');}
.base-info .content .grouping .tree-child .grouping-ins-status.DEVICERESULT03::after{background-image: url('../../assets/images/icon-error.png');}

.base-info .content .operation .m-cloud-box{background: url('../../assets/images/icon-cloud-bg.png') no-repeat 0 0/146px;align-items: center;height: 136px;background-position: -5px 4px}
.base-info .content .operation .m-cloud-box a{background: url('../../assets/images/icon-cloud.png') no-repeat;display: block;width: 20px;height: 20px;position: absolute;}
.base-info .content .operation .m-cloud-box a:hover{background-position-y: -20px;}
.base-info .content .operation .m-cloud-box .m-cloud-1{left: 31px;top: 31px;background-position: 0 0;}
.base-info .content .operation .m-cloud-box .m-cloud-2{left: 59px;top: 19px;background-position: -20px 0;}
.base-info .content .operation .m-cloud-box .m-cloud-3{left: 85px;top: 31px;background-position: -40px 0;}
.base-info .content .operation .m-cloud-box .m-cloud-4{left: 19px;top: 59px;background-position: -60px 0;}
.base-info .content .operation .m-cloud-box .m-cloud-5{left: 99px;top: 59px;background-position: -80px 0;}
.base-info .content .operation .m-cloud-box .m-cloud-6{left: 31px;top: 87px;background-position: -100px 0;}
.base-info .content .operation .m-cloud-box .m-cloud-7{left: 59px;top: 100px;background-position: -120px 0;}
.base-info .content .operation .m-cloud-box .m-cloud-8{left: 85px;top: 87px;background-position: -140px 0;}
.base-info .content .operation .m-cloud-box .m-cloud-0{left: 51px;top: 52px;width: 34px;height: 34px;background-position: 0 -40px;}
.base-info .content .operation .m-cloud-box .m-cloud-0:hover{background-position: 0 -74px;}

/* 云台 */
.m-cloud-btns {margin-top: 7px;}
.m-cloud-btns label{font-size: 12px;position: relative;top: -5px;}
.m-cloud-btns .minbtn {display: inline-block;zoom: 1;height: 32px;width: 32px;margin: -4px 0;padding: 0;border: none;overflow: hidden;cursor: pointer;background: url(../../assets/images/min-btn.png) no-repeat;}
.m-cloud-btns .minbtn.minbtn-minus {background-position: -72px 0;}
.m-cloud-btns .minbtn.minbtn-plus {background-position: -101px 0;}
.m-cloud-btns .minbtn:hover{background-position-y: -36px;}
.m-video-preset .m-preset-toolbar{font-size: 12px;height: 26px;border-bottom: 1px solid #c1daf2;}
.m-video-preset .m-preset-toolbar a{color: #3c8dbc;}
.m-video-preset .m-preset-toolbar .m-preset-btn-add{display: inline-block;width: 176px;height: 26px;line-height: 26px;padding: 0 8px;cursor: pointer;}
.m-video-preset .m-preset-toolbar .m-preset-btn-add::before{content: "";display: inline-block;width: 20px;height: 15px;background: url(../../assets/images/btns_preset.png) no-repeat;background-position: -51px -3px;position: relative;top: 3px;}
.m-video-preset .m-preset-toolbar .m-preset-form-add{padding: 5px;background: #dfefff;}
.m-video-preset .m-preset-toolbar .m-preset-form-add .btn-pre{display: block;float: right;width: 21px;height: 21px;cursor: pointer;margin-right: 3px;background: url(../../assets/images/btns_preset.png) no-repeat;}
.m-video-preset .m-preset-toolbar .m-preset-form-add .btn-pre.btn-pre-confirm{background-position: -71px 0;}
.m-video-preset .m-preset-toolbar .m-preset-form-add .btn-pre.btn-pre-cancel{background-position: -71px -18px;}
.m-video-preset .m-preset-toolbar:hover .m-preset-btn-add::before{background-position-y: -22px;}
.m-video-preset .m-preset-list{padding: 0;margin: 0;overflow: auto;font-size: 12px;height: 123px;}
.m-video-preset .m-preset-list li{padding: 0;background-image: none;position: relative;}
.m-video-preset .m-preset-list li a.m-preset-name{color: #1d7fdf;}
.m-video-preset .m-preset-list li a.m-preset-name::before{content: "";font-size: 12px;display: inline-block;width: 20px;height: 15px;background: url(../../assets/images/btns_preset.png) no-repeat;background-position: -27px -21px;position: relative;top: 2px;}
.m-video-preset .m-preset-list li .m-preset-fnbtns{display: none;position: absolute;right: 5px;top: 3px;height: 20px;}
.m-video-preset .m-preset-list li .m-preset-fnbtns .btn-pre{display: inline-block;width: 15px;height: 15px;background: url(../../assets/images/btns_preset.png) no-repeat;margin-right: 3px;cursor: pointer;}
.m-video-preset .m-preset-list li .m-preset-fnbtns .btn-pre.btn-pre-play{background-position: -96px -3px;}
.m-video-preset .m-preset-list li .m-preset-fnbtns .btn-pre.btn-pre-edit{background-position: -117px -3px;}
.m-video-preset .m-preset-list li .m-preset-fnbtns .btn-pre.btn-pre-delete{background-position: -139px -3px;}
.m-video-preset .m-preset-list li .m-preset-fnbtns .btn-pre:hover{background-position-y: -21px;}
.m-video-preset .m-preset-list li:hover {background: #c1daf2;}
.m-video-preset .m-preset-list li:hover .m-preset-fnbtns{display: block;}

.region-popper{width: 220px;padding: 5px 0;}
@media screen and (max-width: 1366px) {
  .base-info .content .grouping .ej-group-scrollbar{height: 219px!important;}
}
@media screen and (min-width: 1367px) and (max-width: 1600px){
  .base-info .content .grouping .ej-group-scrollbar{height: 349px!important;}
}
@media screen and (min-width: 1601px){
  .base-info .content .grouping .ej-group-scrollbar{height: 529px!important;}
}
</style>
