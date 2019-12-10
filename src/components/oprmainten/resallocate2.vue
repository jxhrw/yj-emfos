<template>
  <div class="ej-main">
    <div class="ej-content">
      <div class="ej-content-title">
        <h2>{{title}}</h2>
      </div>
      <div class="ej-content-main">
        <el-scrollbar class="ej-content-scrollbar">
          <div class="base-tabs">
            <div class="other-tabs" :class="{'active':devTypeCode=='REPDEVTYPE01'}" @click="changeType('REPDEVTYPE01')">信号机</div>
            <div class="other-tabs" :class="{'active':devTypeCode=='REPDEVTYPE02'}" @click="changeType('REPDEVTYPE02')">视频监控</div>
            <div class="other-tabs" :class="{'active':devTypeCode=='REPDEVTYPE03'}" @click="changeType('REPDEVTYPE03')">卡口</div>
            <div class="other-tabs" :class="{'active':devTypeCode=='REPDEVTYPE04'}" @click="changeType('REPDEVTYPE04')">电警</div>
            <div class="other-tabs" :class="{'active':devTypeCode=='REPDEVTYPE05'}" @click="changeType('REPDEVTYPE05')">地磁</div>
            <div class="other-tabs" :class="{'active':devTypeCode=='REPDEVTYPE06'}" @click="changeType('REPDEVTYPE06')">线圈</div>
            <div class="other-tabs" :class="{'active':devTypeCode=='REPDEVTYPE07'}" @click="changeType('REPDEVTYPE07')">微波</div>
            <div class="other-tabs" :class="{'active':devTypeCode=='REPDEVTYPE08'}" @click="changeType('REPDEVTYPE08')">诱导屏</div>
            <div class="other-tabs" :class="{'active':devTypeCode=='REPDEVTYPE12'}" @click="changeType('REPDEVTYPE12')">视频检测</div>
          </div>
          <div class="depiction-info">
            <div class="content">
              <div class="m-left">
                <el-scrollbar class="ej-content-scrollbar">
                  <div class="main-wrap">
                    <div class="u-opt">
                      <div class="slt-wrap">
                        <el-row class="content-row-select">
                          <div class="content-search search-btn">
                            <p @click="getTableData">查询</p>
                          </div>
                          <el-col :span="24" class="single-condi">
                            <label>所属区域</label>
                            <el-select v-model="regionId" placeholder="请选择区域" size='mini' class="content-select" clearable @change="selectRegion">
                              <el-option v-for="item in areaList" :key="item.regionId" :label="item.regionName" :value="item.regionId">
                              </el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="24" v-if="moreCondi" class="single-condi">
                            <label>建设单位</label>
                            <el-input v-model="company" placeholder="请输入" size='mini' class="content-select" clearable></el-input>
                          </el-col>
                          <el-col :span="24" v-if="moreCondi" class="single-condi">
                            <label>建设项目</label>
                            <el-input v-model="project" placeholder="请输入" size='mini' class="content-select" clearable></el-input>
                          </el-col>
                          <el-col :span="24" v-if="moreCondi" class="single-condi">
                            <label>生产厂家</label>
                            <el-input v-model="manufact" placeholder="请输入" size='mini' class="content-select" clearable></el-input>
                          </el-col>
                          <el-col :span="24" v-if="moreCondi" class="single-condi">
                            <label>使用状态</label>
                            <el-select v-model="deviceStatusCode" placeholder="请选择" size='mini' class="content-select" clearable @change="selectDevStatus">
                              <el-option v-for="item in useStatusList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                              </el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="24">
                            <p @click="showMoreCondi" v-if="moreCondi" class="choice-more"><i class="el-icon-arrow-up"></i>&nbsp;&nbsp;<span>精简过滤条件</span></p>
                            <p @click="showMoreCondi" v-else class="choice-more"><i class="el-icon-arrow-down"></i>&nbsp;&nbsp;<span>更多过滤条件</span></p>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                    <div class="ej-content-main">
                      <div class="u-slt">
                        <el-input placeholder="名称" v-model="searchVal" class="input-with-btn">
                          <el-button slot="append" icon="el-icon-search" @click="getTableData"></el-button>
                        </el-input>
                      </div>
                      <div class="u-table">
                        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" stripe border v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                          <el-table-column type="selection" width="55">
                          </el-table-column>
                          <el-table-column prop="columnId" label="资源编号" width="150">
                          </el-table-column>
                          <el-table-column prop="columnName" label="资源名称" show-overflow-tooltip>
                          </el-table-column>
                          <el-table-column prop="regionName" label="所属区域" width="100">
                          </el-table-column>
                        </el-table>
                      </div>
                      <EJ-Paging ref="tableList" :id="restable" :totalCount="totalCount" :totalPage="totalPage" :queryConditions="queryConditions1" :hostName="pageHost" :methodsName="pageMethods"></EJ-Paging>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
              <div class="m-center">
                <div class="btn-wrap">
                  <div class="content-search allo-btn" :class="{'gray-bg': grayBg1}">
                    <p @click="move2Right">划归<i class="el-icon-d-arrow-right"></i></p>
                  </div>
                  <div class="content-search" :class="{'gray-bg': grayBg2}">
                    <p @click="move2Left">取消<i class="el-icon-d-arrow-left"></i></p>
                  </div>
                </div>
              </div>
              <div class="m-right">
                <el-scrollbar class="ej-content-scrollbar">
                  <div class="main-wrap">
                    <div class="u-opt">
                      <div class="slt-wrap">
                        <el-row class="content-row-select">
                          <div class="content-search search-btn">
                            <p @click="getTableData2">查询</p>
                          </div>
                          <el-col :span="24" class="single-condi single-condi-sp">
                            <label>运维单位</label>
                            <el-select v-model="allo" placeholder="请选择运维单位" size='mini' class="content-select" clearable @change="selectOpsDept">
                              <el-option v-for="item in alloList" :key="item.opsDeptId" :label="item.opsDeptName" :value="item.opsDeptId">
                              </el-option>
                            </el-select>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                    <div class="ej-content-main">
                      <div class="u-slt">
                        <el-input placeholder="名称" v-model="searchVal2" class="input-with-btn">
                          <el-button slot="append" icon="el-icon-search" @click="getTableData2"></el-button>
                        </el-input>
                      </div>
                      <div class="u-table">
                        <el-table ref="multipleTable2" :data="tableData2" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange2" stripe border v-loading="isTableLoading2" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                          <el-table-column type="selection" width="55">
                          </el-table-column>
                          <el-table-column prop="columnId" label="资源编号" width="150">
                          </el-table-column>
                          <el-table-column prop="columnName" label="资源名称" show-overflow-tooltip>
                          </el-table-column>
                          <el-table-column prop="regionName" label="所属区域" width="100">
                          </el-table-column>
                        </el-table>
                      </div>
                      <EJ-Paging2 ref="tableList2" :id="restable2" :totalCount="totalCount2" :totalPage="totalPage2" :queryConditions="queryConditions2" :hostName="pageHost" :methodsName="pageMethods"></EJ-Paging2>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <!-- <oprdialog :showOprDialog="showOprDialog" :row="currentRow" :oprTitle="oprTitle"></oprdialog> -->
    </div>
  </div>
</template>
<script>
import Bus from "@/assets/js/bus.js";
import Common from "@/assets/js/common.js";
import Paging from "components/common/pagingSide";
import Paging2 from "components/common/pagingSide2";
import qs from 'qs';
// import oprdialog from "./oprdialog.vue"
export default {
  components: {
    "EJ-Paging": Paging,
    "EJ-Paging2": Paging2
    // "oprdialog": oprdialog
  },
  data() {
    return {
      title: "运维资源划归",
      token: '',
      devTypeCode: '',
      purposeCode: '',
      moreCondi: false,

      searchVal: '',
      restable: 'restable',
      tableData: [],
      multipleSelection: [],
      totalCount: 0,
      totalPage: 1,
      isTableLoading: false,

      searchVal2: '',
      restable2: 'restable2',
      tableData2: [],
      multipleSelection2: [],
      totalCount2: 0,
      totalPage2: 1,
      isTableLoading2: false,

      area: '',
      areaList: [],
      ajaxArea: '',
      useStatus: '',
      useStatusList: [],
      ajaxUseStatus: '',
      allo: '',
      alloList: [],
      ajaxAllo: '',

      pageSize: 10,
      currentPage: 1,
      pageHost: this.$config.ubms_HOST,
      pageMethods: '',
      queryConditions1: {},
      queryConditions2: {},

      project: '',
      company: '',
      manufact: '',
      deviceStatusCode: '',
      regionId: '',

      grayBg1: true,
      grayBg2: true,

      param: {}
    };
  },
  watch: {
    devTypeCode(newVal, oldVal) {
      sessionStorage.setItem('resalloType', newVal);
      setTimeout(() => {
        Bus.$emit('renewtable', this.queryConditions1)
        Bus.$emit('renewtable2', this.queryConditions2)
      }, 50);
    },
    multipleSelection(val) {
      console.log(val);
      if (val.length > 0) {
        this.$refs.multipleTable2.clearSelection();
        this.grayBg1 = false
      } else {
        this.grayBg1 = true
      }
    },
    multipleSelection2(val) {
      console.log(val);
      if (val.length > 0) {
        this.$refs.multipleTable.clearSelection();
        this.grayBg2 = false
      } else {
        this.grayBg2 = true
      }
    },
    ajaxAllo(val) {
      if (this.devTypeCode === 'REPDEVTYPE03' || this.devTypeCode === 'REPDEVTYPE04') {
        this.queryConditions2.supportCompany = val
      } else {
        this.queryConditions2.oppmDept = val
      }
    },
    ajaxUseStatus(val) {
      if (this.devTypeCode === 'REPDEVTYPE03' || this.devTypeCode === 'REPDEVTYPE04') {
        this.queryConditions1.osstatusCode = val
      } else {
        this.queryConditions1.deviceStatusCode = val
      }
    },
    ajaxArea(val) {
      this.queryConditions1.regionId = val
    },
    project(val) {
      this.queryConditions1.project = val
    },
    company(val) {
      this.queryConditions1.company = val
    },
    manufact(val) {
      if (this.devTypeCode === 'REPDEVTYPE03' || this.devTypeCode === 'REPDEVTYPE04') {
        this.queryConditions1.factory = val
      } else {
        this.queryConditions1.manufact = val
      }
    }
  },
  mounted() {
    this.token = this.$token
    this.devTypeCode = sessionStorage.getItem('resalloType') || 'REPDEVTYPE01';
    // this.getPreSelect()
    this.changeType()
    // this.getTableData()

    let that = this
    Bus.$on('page-restable', function(val) {
      let result = val
      result.forEach(ele => {
        ele.columnName = ele.ssName || ele.vdSiteName || ele.offsiteName || ele.trfDevName || ele.ledName
        ele.columnId = ele.ssId || ele.vdSiteId || ele.offsiteId || ele.trfDevId || ele.ledId
      })
      that.tableData = val
    })
    Bus.$on('page-loading-restable', function(val) {
      that.isTableLoading = val
    })
    Bus.$on('page-restable2', function(val) {
      let result = val
      result.forEach(ele => {
        ele.columnName = ele.ssName || ele.vdSiteName || ele.offsiteName || ele.trfDevName || ele.ledName
        ele.columnId = ele.ssId || ele.vdSiteId || ele.offsiteId || ele.trfDevId || ele.ledId
      })
      that.tableData2 = val
    })
    Bus.$on('page-loading-restable2', function(val) {
      that.isTableLoading2 = val
    })
  },
  methods: {
    selectRegion(opt) {
      this.ajaxArea = opt
    },
    selectDevStatus(opt) {
      this.ajaxUseStatus = opt
    },
    selectOpsDept(opt) {
      console.log(111);
      console.log(opt);
      this.ajaxAllo = opt
    },
    getTableData() {
      this.isTableLoading = true
      let apiName = this.pageHost + this.pageMethods
      let data = {
        token: this.token,
        data: JSON.stringify(this.queryConditions1)
      };
      this.$api
        .get(apiName, data)
        .then(res => {
          setTimeout((load) => {
            this.isTableLoading = false;
          }, 500);
          if (res.appCode === '0') {
            let result = res.resultList.rows
            result.forEach(ele => {
              ele.columnName = ele.ssName || ele.vdSiteName || ele.offsiteName || ele.trfDevName || ele.ledName
              ele.columnId = ele.ssId || ele.vdSiteId || ele.offsiteId || ele.trfDevId || ele.ledId
            })
            this.tableData = result
            this.totalPage = res.resultList.totalPage;
            this.totalCount = res.resultList.total;
          } else {
            console.log('接口出错');
          }
        })
        .catch(err => {
          setTimeout((load) => {
            this.isTableLoading = false;
          }, 500);
          console.log(err);
        });
    },
    getTableData2() {
      this.isTableLoading2 = true

      let apiName = this.pageHost + this.pageMethods
      let data = {
        token: this.token,
        data: JSON.stringify(this.queryConditions2)
      };
      this.$api
        .get(apiName, data)
        .then(res => {
          setTimeout((load) => {
            this.isTableLoading2 = false;
          }, 500);
          if (res.appCode === '0') {
            let result = res.resultList.rows
            result.forEach(ele => {
              ele.columnName = ele.ssName || ele.vdSiteName || ele.offsiteName || ele.trfDevName || ele.ledName
              ele.columnId = ele.ssId || ele.vdSiteId || ele.offsiteId || ele.trfDevId || ele.ledId
            })
            this.tableData2 = result
            this.totalPage2 = res.resultList.totalPage;
            this.totalCount2 = res.resultList.total;
          } else {
            console.log('接口出错');
          }
        })
        .catch(err => {
          setTimeout((load) => {
            this.isTableLoading2 = false;
          }, 500);
          console.log(err);
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(ele => ele.columnId)
      console.log(this.multipleSelection);
      // console.log(this.multipleSelection);
      // if (this.multipleSelection.length > 0) {
      //   this.multipleSelection2 = []
      //   this.grayBg1 = false
      // } else {
      //   this.grayBg1 = true
      // }
    },
    handleSelectionChange2(val) {
      this.multipleSelection2 = val.map(ele => ele.columnId)
      // console.log(this.multipleSelection2);
      // if (this.multipleSelection2.length > 0) {
      //   this.multipleSelection = []
      //   this.grayBg2 = false
      // } else {
      //   this.grayBg2 = true
      // }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    resetTable() {
      this.allo = ''
      this.ajaxArea = ''
      this.ajaxUseStatus = ''
      this.deviceStatusCode = ''
      this.regionId = ''
      this.queryConditions1 = {}
      this.queryConditions2 = {}
      this.project = ''
      this.manufact = ''
      this.company = ''
      this.searchVal = ''
      this.searchVal2 = ''
    },
    changeType(val) {
      this.resetTable()
      this.getPreSelect().then(resolve => {
        // 先让接口请求完成
        if (resolve) {
          this.devTypeCode = val || this.devTypeCode;
          switch (this.devTypeCode) {
            case 'REPDEVTYPE01':
              this.getSignal()
              this.getTableData()
              this.getTableData2()
              this.param = {
                ssId: this.multipleSelection,
                oppmDept: this.ajaxAllo
              }
              break;
            case 'REPDEVTYPE02':
              this.getVideoCtrl()
              this.getTableData()
              this.getTableData2()
              this.param = {
                vdSiteId: this.multipleSelection,
                oppmDept: this.ajaxAllo
              }
              break;
            case 'REPDEVTYPE03':
              this.purposeCode = "OFFSITEPURPOSE01"
              this.getOffsite()
              this.getTableData()
              this.getTableData2()
              this.param = {
                offsiteId: this.multipleSelection,
                purposeCode: this.purposeCode,
                supportCompany: this.ajaxAllo
              }
              break;
            case 'REPDEVTYPE04':
              this.purposeCode = "OFFSITEPURPOSE02"
              this.getOffsite()
              this.getTableData()
              this.getTableData2()
              this.param = {
                offsiteId: this.multipleSelection,
                purposeCode: this.purposeCode,
                supportCompany: this.ajaxAllo
              }
              break;
            case 'REPDEVTYPE05':
              this.getGeomag()
              this.getTableData()
              this.getTableData2()
              this.param = {
                devTypeCode: this.devTypeCode,
                trfDevId: this.multipleSelection,
                oppmDept: this.ajaxAllo
              }
              break;
            case 'REPDEVTYPE06':
              this.getGeomag()
              this.getTableData()
              this.getTableData2()
              this.param = {
                devTypeCode: this.devTypeCode,
                trfDevId: this.multipleSelection,
                oppmDept: this.ajaxAllo
              }
              break;
            case 'REPDEVTYPE07':
              this.getGeomag()
              this.getTableData()
              this.getTableData2()
              this.param = {
                devTypeCode: this.devTypeCode,
                trfDevId: this.multipleSelection,
                oppmDept: this.ajaxAllo
              }
              break;
            case 'REPDEVTYPE08':
              this.getInduction()
              this.getTableData()
              this.getTableData2()
              this.param = {
                devTypeCode: this.devTypeCode,
                trfDevId: this.multipleSelection,
                oppmDept: this.ajaxAllo
              }
              break;
            case 'REPDEVTYPE12':
              this.getGeomag()
              this.getTableData()
              this.getTableData2()
              this.param = {
                ledId: this.multipleSelection,
                oppmDept: this.ajaxAllo,
                purposeCode: 'LEDPURPOSE01'
              }
              break;
            default:
              return;
          }
        } else {
          console.log(resolve);
        }
      })
    },
    showMoreCondi() {
      this.moreCondi = !this.moreCondi
    },
    async getPreSelect() {
      let result1 = await this.getRegionInfo()
      let result2 = await this.getDeptInfo()
      let result3 = await this.getDeviceStatu()
      let re = ''
      if (result1 === 'success' && result2 === 'success' && result3 === 'success') {
        re = 'success'
      } else {
        re = '某些接口出错'
      }
      return re
    },
    getRegionInfo() {
      return new Promise((resolve, reject) => {
        let apiName = this.$config.ubms_HOST + '/ubms-server/RegionInfo/getRegionInfo.htm'
        let param = {
          parentId: this.$config.cityId
        }
        let data = {
          token: this.token,
          data: JSON.stringify(param)
        };
        this.$api
          .get(apiName, data)
          .then(res => {
            if (res.appCode === '0') {
              resolve('success')
              this.areaList = res.resultList
            } else {
              console.log('/ubms-server/RegionInfo/getRegionInfo.htm出错');
            }
          })
          .catch(err => {
            console.log(err);
          });
      })
    },
    getDeptInfo() {
      return new Promise((resolve, reject) => {
        let apiName = this.$config.ubms_HOST + '/ubms-server/OpsDeptInfo/getOpsDeptInfo.htm'
        let param = {}
        let data = {
          token: this.token,
          data: JSON.stringify(param)
        };
        this.$api
          .get(apiName, data)
          .then(res => {
            if (res.appCode === '0') {
              resolve('success')
              this.alloList = res.resultList
              this.allo = res.resultList[0].opsDeptName
              this.ajaxAllo = res.resultList[0].opsDeptId
            } else {
              console.log('/ubms-server/OpsDeptInfo/getOpsDeptInfo.htm出错');
            }
          })
          .catch(err => {
            console.log(err);
          });
      })
    },
    getDeviceStatu() {
      return new Promise((resolve, reject) => {
        let apiName = this.$config.ubms_HOST + '/ubms-server/DeviceDic/getDicInfo.htm'
        let param = {
          parentCode: 'DEVICESTATUS'
        }
        let data = {
          token: this.token,
          data: JSON.stringify(param)
        };
        this.$api
          .get(apiName, data)
          .then(res => {
            if (res.appCode === '0') {
              resolve('success')
              this.useStatusList = res.resultList
            } else {
              console.log('/ubms-server/DeviceDic/getDicInfo.htm出错');
            }
          })
          .catch(err => {
            console.log(err);
          });
      })
    },
    getSignal() {
      this.pageMethods = '/ubms-server/SignalSiteInfo/getPageSignalSiteInfo.htm'
      this.editMethods = '/ubms-server/SignalSiteInfo/editSignalSiteInfo.htm'
      this.removeMethods = '/ubms-server/SignalSiteInfo/removeSignalSiteInfo.htm'
      this.queryConditions1 = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        ssName: this.searchVal,
        deviceStatusCode: this.ajaxUseStatus,
        regionId: this.ajaxArea,
        manufact: this.manufact,
        project: this.project,
        company: this.company
      }
      this.queryConditions2 = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        ssName: this.searchVal2,
        oppmDept: this.ajaxAllo
      }
    },
    getVideoCtrl() {
      this.pageMethods = '/ubms-server/VideoSiteInfo/getPageVideoSiteInfo.htm'
      this.editMethods = '/ubms-server/VideoSiteInfo/editVideoSiteInfo.htm'
      this.removeMethods = '/ubms-server/VideoSiteInfo/removeVideoSiteInfo.htm'
      this.queryConditions1 = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        vdSiteName: this.searchVal,
        deviceStatusCode: this.ajaxUseStatus,
        regionId: this.ajaxArea,
        manufact: this.manufact,
        project: this.project,
        company: this.company
      }
      this.queryConditions2 = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        vdSiteName: this.searchVal2,
        oppmDept: this.ajaxAllo
      }
    },
    getOffsite() {
      this.pageMethods = '/ubms-server/OffsiteInfo/getPageOffsiteInfo.htm'
      this.editMethods = '/ubms-server/OffsiteInfo/editOffsiteInfo.htm'
      this.removeMethods = '/ubms-server/OffsiteInfo/removeOffsiteInfo.htm'
      this.queryConditions1 = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        offsiteName: this.searchVal,
        osstatusCode: this.ajaxUseStatus,
        regionId: this.ajaxArea,
        factory: this.manufact,
        project: this.project,
        company: this.company,
        purposeCode: this.purposeCode
      }
      this.queryConditions2 = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        offsiteName: this.searchVal2,
        supportCompany: this.ajaxAllo,
        purposeCode: this.purposeCode,
      }
    },
    getGeomag() {
      this.pageMethods = '/ubms-server/TrFlowInfoController/getPageTrFlowDevInfo.htm'
      this.editMethods = '/ubms-server/TrFlowInfoController/editTrFlowDevInfo.htm'
      this.removeMethods = '/ubms-server/TrFlowInfoController/removeTrFlowDevInfo.htm'
      this.queryConditions1 = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        trfDevName: this.searchVal,
        devTypeCode: this.devTypeCode,
        deviceStatusCode: this.ajaxUseStatus,
        regionId: this.ajaxArea,
        manufact: this.manufact,
        project: this.project,
        company: this.company
      }
      this.queryConditions2 = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        trfDevName: this.searchVal2,
        oppmDept: this.ajaxAllo,
        devTypeCode: this.devTypeCode
      }
    },
    getInduction() {
      this.pageMethods = '/ubms-server/LedInfoController/getPageLedInfo.htm'
      this.editMethods = '/ubms-server/LedInfoController/editLedInfo.htm'
      this.removeMethods = '/ubms-server/LedInfoController/removeLedInfo.htm'
      this.queryConditions1 = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        ledName: this.searchVal,
        deviceStatusCode: this.ajaxUseStatus,
        regionId: this.ajaxArea,
        manufact: this.manufact,
        project: this.project,
        company: this.company,
        purposeCode: 'LEDPURPOSE01'
      }
      this.queryConditions2 = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        ledName: this.searchVal2,
        oppmDept: this.ajaxAllo,
        purposeCode: 'LEDPURPOSE01',
      }
    },
    move2Right() {
      console.log(this.multipleSelection);
      if (this.multipleSelection.length > 0) {
        console.log(this.devTypeCode);
        switch (this.devTypeCode) {
          case 'REPDEVTYPE01':
            this.param = {
              ssId: this.multipleSelection,
              oppmDept: this.ajaxAllo
            }
            break;
          case 'REPDEVTYPE02':
            this.param = {
              vdSiteId: this.multipleSelection,
              oppmDept: this.ajaxAllo
            }
            break;
          case 'REPDEVTYPE03':
          case 'REPDEVTYPE04':
            this.param = {
              offsiteId: this.multipleSelection,
              purposeCode: this.purposeCode,
              supportCompany: this.ajaxAllo
            }
            break;
          case 'REPDEVTYPE05':
          case 'REPDEVTYPE06':
          case 'REPDEVTYPE07':
          case 'REPDEVTYPE08':
            this.param = {
              devTypeCode: this.devTypeCode,
              trfDevId: this.multipleSelection,
              oppmDept: this.ajaxAllo
            }
            console.log(this.param);
            break;
          case 'REPDEVTYPE12':
            this.param = {
              ledId: this.multipleSelection,
              oppmDept: this.ajaxAllo,
              purposeCode: 'LEDPURPOSE01'
            }
            break;
          default:
            return;
        }
        let apiName = this.$config.ubms_HOST + this.editMethods + '?token=' + this.token
        let data = {
          data: JSON.stringify(this.param)
        };
        this.$api
          .post(apiName, qs.stringify(data), { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" })
          .then(res => {
            if (res.appCode === '0' && res.resultList === 1) {
              this.getTableData2()
              this.$refs.multipleTable.clearSelection();
              this.grayBg1 = true
            } else {
              console.log(res.dataBuffer);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    move2Left() {
      if (this.multipleSelection2.length > 0) {
        switch (this.devTypeCode) {
          case 'REPDEVTYPE01':
            this.param = {
              ssId: this.multipleSelection,
              oppmDept: this.ajaxAllo
            }
            break;
          case 'REPDEVTYPE02':
            this.param = {
              vdSiteId: this.multipleSelection,
              oppmDept: this.ajaxAllo
            }
            break;
          case 'REPDEVTYPE03' || 'REPDEVTYPE04':
            this.param = {
              offsiteId: this.multipleSelection,
              purposeCode: this.purposeCode,
              supportCompany: this.ajaxAllo
            }
            break;
          case 'REPDEVTYPE05' || 'REPDEVTYPE06' || 'REPDEVTYPE07' || 'REPDEVTYPE08':
            this.param = {
              devTypeCode: this.devTypeCode,
              trfDevId: this.multipleSelection,
              oppmDept: this.ajaxAllo
            }
            break;
          case 'REPDEVTYPE12':
            this.param = {
              ledId: this.multipleSelection,
              oppmDept: this.ajaxAllo,
              purposeCode: 'LEDPURPOSE01'
            }
            break;
          default:
            return;
        }
        let apiName = this.$config.ubms_HOST + this.removeMethods + '?token=' + this.token
        let data = {
          data: JSON.stringify(this.param)
        };
        this.$api
          .post(apiName, qs.stringify(data), { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" })
          .then(res => {
            if (res.appCode === '0' && res.resultList === 1) {
              this.getTableData()
              this.$refs.multipleTable2.clearSelection();
              this.grayBg2 = true
            } else {
              console.log(res.dataBuffer);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
}

</script>
<style lang="less" scoped>
@import "../../assets/css/main.css";
@import "../../assets/css/baseInfo.css";
@import "../../assets/css/table.css";
@import "../../assets/css/select.css";

</style>
<style scoped>
.ej-content-scrollbar {
  height: 100%;
}

.ej-content-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}

.base-info .content {
  padding-bottom: 5px;
}

.base-info {
  margin-top: -1px;
}

.base-tabs {
  height: 34px;
  display: flex;
  margin: 14px 14px 0 14px;
  padding-left: 64px;
}

.base-tabs .other-tabs {
  width: 120px;
  height: 34px;
  line-height: 32px;
  background: #f9fafc;
  text-align: center;
  cursor: pointer;
  border: 1px solid #f9fafc;
  border-bottom-color: #e4eaee;
  box-sizing: border-box;
  color: #758087;
}

.base-tabs .other-tabs.active {
  border-color: #e4eaee;
  border-bottom-color: #ffffff;
  background: #fff;
  color: #22262E;
}

.base-info .content {
  padding-bottom: 24px;
}

.content {
  display: flex;
  justify-content: space-between;
}

.m-left {
  width: 45%;
  height: 85vh;
  border-right: 1px solid #ddd;
  padding: 0;
}

.m-center {
  height: 550px;
}

.m-right {
  width: 45%;
  height: 85vh;
  border-left: 1px solid #ddd;
  padding: 0;
}

.content-row-select .el-input,
.content-row-select .el-select {
  width: 300px;
}

.search-wrap {
  display: flex;
  justify-content: space-between;
}

.single-condi {
  margin-bottom: 10px;
}

.single-condi>label {
  margin-right: 10px;
  font-size: 12px;
}

.single-condi-sp {
  margin-bottom: 0;
}

.content-row-select {
  position: relative;
}

.content-search {
  display: inline-block;
  background: #00C187;
  border-radius: 1px;
  width: 80px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  cursor: pointer;
  color: #fff;
}

.choice-more {
  font-size: 12px;
  cursor: pointer;
}

.btn-wrap {
  padding-top: 300px;
  font-size: 14px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.search-btn {
  position: absolute;
  top: 0;
  right: 0;
}

.allo-btn {
  margin-bottom: 20px;
}

/deep/ .u-slt .el-input__inner {
  height: 28px;
  line-height: 28px;
}

/deep/ .u-slt .el-input-group__append button.el-button {
  height: 28px;
  line-height: 28px;
  background: #00C187;
  color: #fff;
  padding: 0 13px;
}

.u-opt {
  margin-bottom: 10px;
  background: #fff;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
}

.main-wrap {
  padding: 0 10px 10px;
  box-sizing: border-box;
}

.gray-bg {
  background: #ccc;
}

</style>
