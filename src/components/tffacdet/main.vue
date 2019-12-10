<template>
<div class="ej-main">
    <EJ-Menu></EJ-Menu>
    <div class="ej-content">
        <div class="ej-content-title">
            <h2>{{title}}</h2>
            <div>
              <div class="btn-title btn-operation" @click="operateFuc('add')">添加</div>
              <div class="btn-title btn-operation" @click="operateFuc('edit')">修改</div>
              <div class="btn-title btn-operation" @click="operateFuc('scrap')">报废</div>
              <div class="btn-title btn-operation" @click="operateFuc('deact')">停用</div>
              <div class="btn-title btn-operation" @click="operateFuc('enable')">启用</div>
              <div class="btn-title btn-operation" @click="operateFuc('normal')">正常</div>
              <div class="btn-title btn-back" @click="goBack">返回</div>
            </div>
        </div>
        <div class="ej-content-main">
            <el-scrollbar class="ej-content-scrollbar">
                <el-row class="content-row-select">
                  <el-col :span="12">
                      <div class="content-base content-left">
                        <div class="title">
                          <h3>资产信息</h3>
                          <div class="icon-base-box">
                            <div class="icon-base icon-video" @click="openDialogVideo"></div>
                            <div class="icon-base icon-file" @click="annexVisible=true"></div>
                            <div class="icon-base icon-map" @click="showMapVisible"></div>
                            <div class="icon-base icon-more" @click="goEditOnlyRead"></div>
                          </div>
                        </div>
                        <ul class="base-info">
                          <li><span>编码</span><span>{{baseInfo.facilityId}}</span></li>
                          <li><span>名称</span><span>{{baseInfo.facilityName}}</span></li>
                          <li><span>类型</span><span>{{baseInfo.facilityTypeName}}</span></li>
                          <li><span>辖区</span><span>{{baseInfo.regionName}}</span></li>
                          <li><span>设施状态</span>
                          <span class="icon-status icon-abnormal" :class="{'icon-normal':baseInfo.devStatusCode=='DEVICEALLSTATUS01'}">{{baseInfo.devStatusName}}</span>
                          </li>
                          <li><span>维修状态</span>
                          <span class="icon-status icon-abnormal" :class="{'icon-normal':baseInfo.repStatusCode=='DEVREPSTATUS04'}">{{baseInfo.repStatusName}}</span>
                          </li>
                        </ul>
                      </div>
                  </el-col>
                  <el-col :span="12">
                      <div class="content-base content-right">
                        <div class="title">
                          <h3>资产画像</h3>
                        </div>
                        <div class="base-portrait" :class="'base-type-'+baseInfo.facilityTypeCode">
                          <label v-if="assetPortrait.dev_shelflife" class="position1" :class="'level'+assetPortrait.dev_shelflife.portaryNum">{{assetPortrait.dev_shelflife.portaryName}}</label>
                          <label v-if="assetPortrait.dev_age" class="position2" :class="'level'+classYear">{{assetPortrait.dev_age.portaryName}}{{assetPortrait.dev_age.portaryNum}}年</label>
                          <label v-if="assetPortrait.dev_repairnum" class="position3" :class="'level'+assetPortrait.dev_repairnum.portaryNum">{{assetPortrait.dev_repairnum.portaryName}}</label>
                          <label v-if="assetPortrait.dev_warntype" class="position4 level3">次数最多报警：{{assetPortrait.dev_warntype.portaryNum}}</label>
                          <label v-if="assetPortrait.dev_faulttype" class="position5 level3">次数最多故障：{{assetPortrait.dev_faulttype.portaryNum}}</label>
                          <label v-if="assetPortrait.dev_warnnum" class="position6" :class="'level'+assetPortrait.dev_warnnum.portaryNum">{{assetPortrait.dev_warnnum.portaryName}}</label>
                          <label v-if="assetPortrait.dev_patrolnum" class="position7" :class="'level'+assetPortrait.dev_patrolnum.portaryNum">{{assetPortrait.dev_patrolnum.portaryName}}</label>
                        </div>
                      </div>
                  </el-col>
                </el-row>
                <div class="content-bottom">
                  <div class="title">
                    <h3>生命期记录</h3>
                    <div class="base-life-tabs">
                      <div class="life-tab" :class="{'active':type=='Information'}" @click="type='Information'">修改记录</div>
                      <div class="life-tab" :class="{'active':type=='Repair'}" @click="type='Repair'">维修记录</div>
                      <!-- <div class="life-tab" :class="{'active':type=='Patrol'}" @click="type='Patrol'">巡检记录</div>
                      <div class="life-tab" :class="{'active':type=='Report'}" @click="type='Report'">报警记录</div> -->
                    </div>
                  </div>
                  <div class="content-life">
                    <EJ-Information v-show="type=='Information'" :contentInfo="baseInfo"></EJ-Information>
                    <EJ-Repair v-show="type=='Repair'" ref="lifeRepair" :contentInfo="baseInfo"></EJ-Repair>
                    <!-- <EJ-Patrol v-show="type=='Patrol'" ref="lifePatrol" :contentInfo="baseInfo"></EJ-Patrol>
                    <EJ-Report v-show="type=='Report'" ref="lifeReport" :contentInfo="baseInfo"></EJ-Report> -->
                  </div>
                </div>
            </el-scrollbar>
        </div>
        <el-dialog title="报废登记" :visible.sync="scrapVisible" width='400px' :modal="false">
          <div class="dialog-urge">
              <div class="dialog-main">
                  <div class="revoke-reason">
                      <label class="dialog-label"><i>*</i>报废原因</label>
                      <el-input v-model="reasonScrap" placeholder="请输入" size='mini' class="dialog-select" clearable></el-input>
                  </div>
                  <div class="revoke-reason">
                      <label class="dialog-label"><i style="left:16px">*</i>备注</label>
                      <el-input type="textarea" v-model="scrapNotes" placeholder="请输入" size='mini' class="dialog-content" clearable resize="none"></el-input>
                  </div>
              </div>
              <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="submitStutusChange('DEVICESTATUS03')" size='mini' class="submit">确 认</el-button>
                  <el-button @click="scrapVisible=false" size='mini' class="cancel">取 消</el-button>
              </div>
          </div>
        </el-dialog>
        <el-dialog title="停用" :visible.sync="deactVisible" width='400px' :modal="false">
          <div class="dialog-urge">
              <div class="dialog-main">
                  <div class="revoke-reason">
                      <label class="dialog-label"><i>*</i>停用原因</label>
                      <el-input v-model="reasonDiscontinue" placeholder="请输入" size='mini' class="dialog-select" clearable></el-input>
                  </div>
                  <div class="revoke-reason">
                      <div class="dialog-tips">注：请确认设施不在报修、维修状态。</div>
                  </div>
              </div>
              <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="submitStutusChange('DEVICESTATUS02')" size='mini' class="submit">确 认</el-button>
                  <el-button @click="deactVisible=false" size='mini' class="cancel">取 消</el-button>
              </div>
          </div>
        </el-dialog>
        <el-dialog title="关联视频" :visible.sync="relationVisible" width='730px' class="dialog-urge" :modal="false">
          <EJ-DialogVideo :devTypeCode="baseInfo.facilityTypeCode" :devId="baseInfo.facilityId" :myVideoList="videoList" ref="dialogVideo"></EJ-DialogVideo>
        </el-dialog>
        <EJ-DialogVideo :devTypeCode="baseInfo.facilityTypeCode" :devId="baseInfo.facilityId" ref="dialogVideoTest" style="display:none;"></EJ-DialogVideo>
        <el-dialog title="图文附件" :visible.sync="annexVisible" width='400px' :modal="false">
          <div class="dialog-urge">
              <div class="dialog-main">
                  <div class="revoke-reason">
                      <div class="rotation" style="height:165px">
                        <el-carousel trigger="click" height="165px" arrow="never">
                          <el-carousel-item v-for="(item,index) in imgFileList" :key="index">
                            <div class="carousel-image" :style="{'background-image':'url(\''+item.FileShow+'\')'}"></div>
                          </el-carousel-item>
                        </el-carousel>
                        <!-- <div v-else>暂无图片文件</div> -->
                      </div>
                  </div>
                  <div class="revoke-reason" style="margin:0;">
                    <el-scrollbar class="ej-load-scrollbar">
                      <ul class="file-download">
                        <li v-for="(item,index) in fileList" :key="index">
                          <a class="load-fileName">{{item.FileName}}</a>
                          <a class="load-hoverShow" :href="item.FileURL" :download="item.FileName">下载</a>
                          <a class="load-hoverShow" @click="delFiles(item)">删除</a>
                        </li>
                      </ul>
                    </el-scrollbar>
                  </div>
              </div>
              <div slot="footer" class="dialog-footer">
                  <input type="file" name="" id="otherFile" style="display:none" ref="otherFile" @change="upload('otherFile')" multiple="multiple">
                  <el-button type="primary" @click="$refs.otherFile.click()" size='mini' class="submit">添加附件</el-button>
                  <el-button @click="annexVisible=false" size='mini' class="cancel">取 消</el-button>
              </div>
          </div>
        </el-dialog>
        <el-dialog title="地图定位" :visible.sync="mapVisible" width='460px' :modal="false">
          <div class="dialog-urge">
              <div class="dialog-main">
                  <div class="revoke-reason map-input">
                      <label class="dialog-label" style="text-align:left;">经纬度</label>
                      <el-input v-model="longAndLat" placeholder="请输入" size='mini' class="dialog-select" readonly></el-input>
                      <el-button type="primary" size='mini' class="map-btn map-green" @click="test" style="background: #00C187;">设置点</el-button>
                      <el-button type="primary" size='mini' class="map-btn" @click="longAndLatReduction">还原</el-button>
                  </div>
                  <div class="revoke-reason" style="margin:0;height:240px;">
                    <div id="mapLocation"></div>
                  </div>
              </div>
              <div slot="footer" class="dialog-footer">
                  <el-button type="primary" size='mini' class="submit" @click="saveLongAndLat">保 存</el-button>
                  <el-button @click="mapVisible=false" size='mini' class="cancel">取 消</el-button>
              </div>
          </div>
        </el-dialog>
    </div>
</div>
</template>
<script>
import Menu from "components/common/menu";
import Information from "components/tffacdet/information";
import Repair from "components/tffacdet/repair";
// import Patrol from "components/tffacdet/patrol";
// import Report from "components/tffacdet/report";
import DialogVideo from "components/common/dialog-video";
import Common from "@/assets/js/common.js";
import Request from "@/assets/js/request.js";
import qs from 'qs';
let _map;
export default {
  components: {
    "EJ-Menu": Menu,
    "EJ-Information": Information,
    "EJ-Repair": Repair,
    // "EJ-Patrol": Patrol,
    // "EJ-Report": Report,
    "EJ-DialogVideo": DialogVideo
  },
  data() {
    return {
      title: "资产档案",
      token: '',
      type: 'Information',
      reasonScrap: '',
      reasonDiscontinue: '',
      scrapNotes: '',
      assetPortrait: {},
      baseInfo: {},
      systemInfo: {},
      longitude: '',
      latitude: '',
      longAndLat: '',
      classYear: '',
      imgFileList: [],
      fileList: [],
      videoList: [],
      scrapVisible: false,
      deactVisible: false,
      relationVisible: false,
      annexVisible: false,
      mapVisible: false,
      isHaveMap: false
    };
  },
  watch: {
    type(newVal, oldVal) {
      if (newVal == 'Repair') {
        this.$nextTick(() => {
          this.$refs.lifeRepair.createLineChart();
        });
      }
      if (newVal == 'Patrol') {
        this.$nextTick(() => {
          this.$refs.lifePatrol.createLineChart();
        });
      }
      if (newVal == 'Report') {
        this.$nextTick(() => {
          this.$refs.lifeReport.createLineChart();
        });
      }
    }
  },
  created() {
      this.baseInfo = JSON.parse(sessionStorage.getItem('tffacDetailInfo'));
  },
  mounted() {
    this.token = Common.getQueryString("token");
    this.getPortRaitFuc();
    this.getAssentFileFuc();
    // this.getSystemInfoInfo();
  },
  methods: {
    openDialogVideo() {
      this.$refs.dialogVideoTest.getVideoList().then(res => {
        if (res.appCode == 0) {
            this.videoList = res.resultList;
            if (res.resultList.length < 1) {
              Common.ejMessage('warning', '暂无关联视频');
              return;
            }
            this.relationVisible = true;
            this.$nextTick(() => {
              this.$refs.dialogVideo.initDt();
            });
          } else {
            console.log("关联视频列表接口错误");
          }
      })
      .catch(err => {
        console.log("关联视频列表接口错误");
        console.log(err);
      });
    },
    getAssentFileFuc() {
      let host = this.$config.efoms_HOST;
      let method = '/AssentFileInfo/getAssentFileInfoList';
      let obj = {
        devId: this.baseInfo.facilityId,
        devTypeCode: this.baseInfo.facilityTypeCode,
        devCategoryCode: Common.getDevCategory("ss").code
      };
      this.$api.getMethod(host, method, obj, this.token).then(res => {
          if (res.appCode == 0) {
            this.fileList = res.resultList;
            this.imgFileList = [];
            res.resultList.map(i => {
              if (/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(i.FileName)) {
                this.imgFileList.push(i);
              }
            });
          } else {
            Common.printErrorLog(host, method);
          }
        })
        .catch(err => {
          Common.printErrorLog(host, method);
          console.log(err);
        });
    },
    upload(fileId) {
      var formData = new FormData();
      var file = document.getElementById(fileId).files[0];
      formData.append("file", file);
      Request.uploadFile(formData, res => {
        let host = this.$config.efoms_HOST;
        let method = '/AssentFileInfo/insertAssentFileInfo';
        let obj = {
          devId: this.baseInfo.facilityId,
          devTypeCode: this.baseInfo.facilityTypeCode,
          devCategoryCode: Common.getDevCategory("ss").code,
          FileShow: res.resultList.mappingAddress,
          FileURL: res.resultList.downloadPath,
          FileMode: file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase(),
          FileName: res.resultList.fileName
        };
        this.$api.getMethod(host, method, {list: JSON.stringify([obj])}, this.token).then(res => {
          if (res.appCode == 0) {
            this.getAssentFileFuc();
          } else {
            Common.printErrorLog(host, method);
          }
        })
        .catch(err => {
          Common.printErrorLog(host, method);
          console.log(err);
        });
      });
    },
    delFiles(e) {
      let host = this.$config.efoms_HOST;
      let method = '/AssentFileInfo/deleteAssentFileInfo';
      let obj = {
        fileId: e.fileId
      };
      this.$api.getMethod(host, method, obj, this.token).then(res => {
        if (res.appCode == 0) {
          this.getAssentFileFuc();
        } else {
          Common.printErrorLog(host, method);
        }
      })
      .catch(err => {
        Common.printErrorLog(host, method);
        console.log(err);
      });
    },
    // 报废，停用，启用方法
    submitStutusChange(status) {
      let method = this.getModifyInterface(status).method;
      let info = this.getModifyInterface(status).object;
      switch (status) {
        case "DEVICESTATUS01": // 启用
          this.changeDevFuc(method, info, (res) => {
            Common.ejMessage("success", "启用成功");
          });
        break;
        case "DEVICESTATUS02": // 停用
          if (this.reasonDiscontinue == "") {
            Common.ejMessage("warning", "停用原因必填");
            return;
          }
          this.changeDevFuc(method, info, (res) => {
            this.deactVisible = false;
            Common.ejMessage("success", "停用成功");
          });
        break;
        case "DEVICESTATUS03": // 报废
          if (this.reasonScrap == "" || this.scrapNotes == "") {
            Common.ejMessage("warning", "报废原因和备注必填");
            return;
          }
          info.memo = this.scrapNotes;
          this.changeDevFuc(method, info, (res) => {
            this.scrapVisible = false;
            Common.ejMessage("success", "报废成功");
          });
        break;
        default: break;
      }
    },
    // 修改基础信息的方法
    changeDevFuc(method, dataInfo, callback) {
      let host = this.$config.ubms_HOST;
      let obj = {};
      obj = {
        token: this.token,
        data: JSON.stringify(dataInfo)
      };
      this.$api.postMethod(host, method, qs.stringify(obj), this.token).then(res => {
        if (res.appCode == 0) {
            callback(res);
        } else {
            Common.printErrorLog(host, method);
        }
        })
        .catch(err => {
        Common.printErrorLog(host, method);
        console.log(err);
        });
    },
    // 获取修改状态的接口
    getModifyInterface(status) {
      let method = "";
      let obj = {};
      switch (this.baseInfo.facilityTypeCode) {
        case "REPDEVTYPE01": // 信号机
        method = '/SignalSiteInfo/editSignalSiteInfo.htm';
        obj.ssId = this.baseInfo.facilityId;
        obj.deviceStatusCode = status;
        break;
        case "REPDEVTYPE02": // 视频监控
        method = '/VideoSiteInfo/editVideoSiteInfo.htm';
        obj.vdSiteId = this.baseInfo.facilityId;
        obj.deviceStatusCode = status;
        break;
        case "REPDEVTYPE08": // 诱导屏
        method = '/LedInfoController/editLedInfo.htm';
        obj.ledId = this.baseInfo.facilityId;
        obj.deviceStatusCode = status;
        break;
        case "REPDEVTYPE03": // 卡口
        case "REPDEVTYPE04": // 电子警察
        method = '/OffsiteInfo/editOffsiteInfo.htm';
        obj.offsiteId = this.baseInfo.facilityId;
        obj.osstatusCode = status;
        break;
        case "REPDEVTYPE05": // 地磁
        case "REPDEVTYPE06": // 线圈
        case "REPDEVTYPE07": // 微波
        method = '/TrFlowInfoController/editTrFlowDevInfo.htm';
        obj.trfDevId = this.baseInfo.facilityId;
        obj.deviceStatusCode = status;
        break;
        default: break;
      }
      return {'method': method, 'object': obj};
    },
    // 获取资产画像
    getPortRaitFuc() {
      let host = this.$config.efoms_HOST;
      let method = '/AssetInfo/getPortRait';
      let obj = {
        assentId: this.baseInfo.facilityId,
        typeCode: this.baseInfo.facilityTypeCode
      };
      this.$api.getMethod(host, method, obj, this.token)
      .then(res => {
        if (res.appCode == 0) {
          this.assetPortrait = res.resultList;
          if (!this.assetPortrait.dev_age) return;
          let year = parseInt(this.assetPortrait.dev_age.portaryNum);
          if (year < 3) {
            this.classYear = "1";
          } else if (year < 6) {
            this.classYear = "2";
          } else {
            this.classYear = "3";
          }
        } else {
          Common.printErrorLog(host, method);
        }
      })
      .catch(err => {
        Common.printErrorLog(host, method);
        console.log(err);
      });
    },
    submitRepair() {},
    // 地图定位相关--start
      // 保存经纬度修改
    saveLongAndLat() {
      if (this.longAndLat.indexOf("，") == -1) {
        Common.ejMessage("warning", "请设置经纬度坐标");
        return;
      }
      let method = this.getModifyInterface().method;
      let info = this.getModifyInterface().object;
      info.coordX = this.longAndLat.split("，")[0];
      info.coordY = this.longAndLat.split("，")[1];
      this.changeDevFuc(method, info, (res) => {
        this.changeNetLongAndLat(info.coordX, info.coordY);
        this.mapVisible = false;
      });
    },
    longAndLatReduction() {
      this.getPoint(this.longitude, this.latitude, true, true, false);
    },
    showMapVisible() {
      this.mapVisible = true;
      this.$nextTick(() => {
        if (!this.isHaveMap) this.initMap();
      });
    },
    test() {
        /**
        *地图取点，通过点击地图获取地图上某位置的坐标值
        * map.getPoint(callback, symbol);
        *callback：回调函数，取点结束返回坐标值
        *symbol：在取点位置绘制的图表样式，如symbol为空则不绘制图表
        **/
        let _this = this;
        _map.getPoint(function(e) {
          _this.getPoint(e.x, e.y, true, false, false);
        });
    },
    changeNetLongAndLat(x, y) {
      this.longitude = x;
      this.latitude = y;
    },
      // clearLayer是否清除之前的点，cententAt是否把点位居中，changeLongAndLat是否修改经纬度的记录
    getPoint(x, y, clearLayer, cententAt, changeLongAndLat) {
      if (clearLayer) _map.clearLayerById("layer0");
      // 定位到地图
      var autoLongitude = x;
      var autoLatitude = y;
      if (autoLongitude != null && autoLatitude != null && autoLongitude != 0 && autoLatitude != 0) {
        autoLongitude = parseFloat(autoLongitude).toFixed(6);
        autoLatitude = parseFloat(autoLatitude).toFixed(6);
        this.longAndLat = autoLongitude + "，" + autoLatitude;
        if (changeLongAndLat) {
          this.changeNetLongAndLat(autoLongitude, autoLatitude);
        }
        if (cententAt) _map.centerAt([autoLongitude, autoLatitude]);
        _map.addPoint2GraphicsLayer({
            geom: {
                "x": autoLongitude,
                "y": autoLatitude,
                "spatialReference": {"wkid": 4326}
            }
            // symbol: {
            //   "url": "./images/bg_tuding_02.png",
            //   "height": 7,
            //   "width": 5,
            //   "type": "esriPMS"
            //   // "xoffset":  0,
            //   // "yoffset":  10
            // }
        }, "layer0", false);
        // _map.zoomTo(6);
      }
    },
    initMap() {
      var _this = this;
      let _layer = "自定义地图";
      _map = new EJMap("mapLocation", {
          zoom: 4,
          toolbar: true, // 是否显示常用工具组件
          zoomSlider: true, // 缩放控件
          scalebar: true, // 比例尺控件
          navigationbar: true, // 是否显示鱼骨
          config: this.$config.mapConfig
      });
      _map.addEventListener(EJMap.Event.onLayerAdded, function (e) {
          _map.setLayerVisibleById(_layer, false);
          // if (e.layer.id == _layer) {
          //     _map.setLayerVisibleById(_layer, false);
          // }
      _this.getPoint(_this.baseInfo.coordX, _this.baseInfo.coordY, false, true, true);
      });
      this.isHaveMap = true;
    },
    // 地图定位相关--end
    operateFuc(type) {
      let url;
      switch (type) {
        case 'add':
          url = this.$config.ProjectName + "/tffacedit.html?token=" + this.token + "&facilityTypeCode=" + this.baseInfo.facilityTypeCode;
          // sessionStorage.setItem('indexIframe', url);
          window.location.href = url;
          break;
        case 'edit':
          url = this.$config.ProjectName + "/tffacedit.html?token=" + this.token + "&facilityId=" + this.baseInfo.facilityId + "&facilityTypeCode=" + this.baseInfo.facilityTypeCode + "&signsType=" + this.baseInfo.signsType;
          // sessionStorage.setItem('indexIframe', url);
          window.location.href = url;
          break;
        case 'scrap':
          this.scrapVisible = true;
          break;
        case 'deact':
          this.deactVisible = true;
          break;
        case 'enable':
          this.submitStutusChange('DEVICESTATUS01');
          break;
        case 'normal':
          let host = this.$config.efoms_HOST;
          let method = '/devStatus/updateDevStatusInfo';
          console.log(this.baseInfo);
          let obj = {
            devId: this.baseInfo.facilityId,
            devTypeCode: this.baseInfo.facilityTypeCode,
            devStatusCode: 'DEVICEALLSTATUS01',
            devStatusName: '正常',
            devCategoryCode: Common.getDevCategory("ss").code
          };
          this.$api.putMethod(host, method, obj, this.token, "noContentType").then(res => {
            if (res.appCode == 0) {
              this.baseInfo.devStatusCode = 'DEVICEALLSTATUS01';
              this.baseInfo.devStatusName = '正常';
            } else {
              Common.printErrorLog(this.$config.ubms_HOST, '/DeviceDic/getDeviceDic.htm');
            }
          })
          .catch(err => {
            Common.printErrorLog(this.$config.ubms_HOST, '/DeviceDic/getDeviceDic.htm');
            console.log(err);
          });
          break;
        default: break;
      }
    },
    goEditOnlyRead() {
      let url = this.$config.ProjectName + "/tffacedit.html?token=" + this.token + "&facilityId=" + this.baseInfo.facilityId + "&facilityTypeCode=" + this.baseInfo.facilityTypeCode + "&signsType=" + this.baseInfo.signsType + "&type=onlyread";
      // sessionStorage.setItem('indexIframe', url);
      window.location.href = url;
    },
    goBack() {
      window.history.back();
    }
  }
};
</script>
<style scoped>
@import "../../assets/css/main.css";
@import "../../assets/css/dialog.css";
@import "./tffacdet.css";
.ej-content-title .btn-title{width: 44px;height: 20px;border-radius: 1px;line-height: 20px;text-align: center;margin-top: 8px;font-size: 12px;cursor: pointer;display: inline-block;margin-right: 20px;}
.ej-content-title .btn-operation{background: #00c1ba;border: 1px solid #00c1ba;color: #ffffff;}
.ej-content-title .btn-back{background: rgba(255,255,255,0.09);border: 1px solid #4F5A64;color: #4F5A64;}
.ej-content-title .btn-title:hover{opacity: 0.5;}
.ej-content-title .btn-title:active{opacity: 0.9;}

.ej-main >>> .el-dialog__title{font-size: 14px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width: 300px;display: block;}
.ej-main >>> .dialog__headerbtn{top: 24px;}
/* 弹窗样式 */
.dialog-urge .dialog-main{margin-top: -30px;padding: 10px 0 20px;border-top: 1px solid #ebeff1;}
.dialog-urge .dialog-main .dialog-select{width: 300px;box-sizing: border-box;}
.dialog-urge .dialog-main .dialog-content{width: 300px;box-sizing: border-box;border: none;}
.dialog-urge .dialog-main .dialog-label i{position: absolute;color: #f90404;left: -7px;}
.dialog-urge .dialog-main .dialog-tips{font-size: 12px;color: #999999;min-height: 100px;}
.dialog-urge .dialog-main >>> .el-textarea__inner{height: 134px;background: #f9fafc;}

.dialog-urge .dialog-main .rotation{border: 1px solid #E1E7ED;box-sizing: border-box;padding: 6px 7.5px;display: flex;justify-content: center;align-items: center;}
.dialog-urge .dialog-main .rotation >>> .el-carousel__item{background-color: #99a9bf;}
.dialog-urge .dialog-main .rotation >>> .el-carousel__button{width: 8px;height: 8px;border-radius: 4px;}
.dialog-urge .dialog-main .carousel-image{height: 100%;background: no-repeat center/contain;}
.dialog-urge .dialog-main .ej-load-scrollbar{height: 100px;overflow-x: hidden;}
.dialog-urge .dialog-main .ej-load-scrollbar >>> .el-scrollbar__wrap{overflow-x: hidden;}
.dialog-urge .dialog-main .file-download li{display: flex;font-size:12px;margin-top: 12px;/*line-height: 12px;*/}
.dialog-urge .dialog-main .file-download li:first-child{margin: 0;}
.dialog-urge .dialog-main .file-download li a{font-size: 12px;color: #6BA1EB;text-decoration: underline;}
.dialog-urge .dialog-main .file-download li a.load-fileName{width: 250px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
.dialog-urge .dialog-main .file-download li a.load-hoverShow{margin-left: 20px;display: none;cursor: pointer;}
.dialog-urge .dialog-main .file-download li:hover a.load-hoverShow{display: block;}
.dialog-urge .dialog-main .map-input .dialog-select{width: 220px;}
.dialog-urge .dialog-main .map-input .map-btn{background: #ffffff;border-color: #E1E7ED;width: 60px;text-align: center;padding: 7px 0;color: #6C7883;}
.dialog-urge .dialog-main .map-input .map-green{background: #00C187;color: #ffffff;}
</style>
<style>
.navigationbar{top: 10px;}
.el-carousel{width: 100%;}
.ej-content-scrollbar {height: 100%;}
.ej-content-scrollbar .el-scrollbar__wrap {overflow-x: hidden;}
</style>
