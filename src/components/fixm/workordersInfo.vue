<template>
<div>
  <div class="base-info">
    <div class="tabs">
        <div class="tabs-before"></div>
        <div class="other-tabs" @click="changeNum(1)">
            <span class="tabs-name">报修审核</span>
<!--             <span class="tabs-count">待审核(0)</span> -->
        </div>
        <div class="other-tabs active" @click="changeNum(2)">
            <span>维修工单</span>
            <span>待确认（{{serverPUshData.ORD_MSG_SURE}}）</span>
        </div>
        <div class="other-tabs" @click="changeNum(3)">
            <span>无效工单</span>
        </div>
        <div class="tabs-after"></div>
    </div>
    <div class="content">
        <el-row class="content-row-select">
            <div class="quick-query" :class="{'active':lableClick==='press'}" @click="changeLableClick('press')">
                <label for="">催办提醒</label>
                <span>{{serverPUshData.ORD_MSG_PRESS}}</span>
            </div>
            <div class="quick-query" :class="{'active':lableClick==='overtime'}" @click="changeLableClick('overtime')">
                <label for="">逾期工单</label>
                <span>{{serverPUshData.ORD_MSG_OVERTIME}}</span>
            </div>
            <div class="quick-query" :class="{'active':lableClick==='postpone'}" @click="changeLableClick('postpone')">
                <label for="">延期申请</label>
                <span>{{serverPUshData.ORD_MSG_POSTPONE}}</span>
            </div>
<!--             <div class="quick-query" :class="{'active':lableClick==='isreject'}" @click="changeLableClick('isreject')">
                <label for="">退回重修</label>
                <span>1</span>
            </div> -->
        </el-row>
        <el-row class="content-row-select">
            <el-col :span="7">
                <label>关键字</label>
                <el-input v-model="queryConditions.key" placeholder="设备名称/设备编号" size='mini' class="content-select" clearable></el-input>
            </el-col>
            <el-col :span="7">
                <label>创建时间</label>
                <el-date-picker v-model="repairDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size='mini'
                    class="content-date">
                </el-date-picker>
            </el-col>
            <el-col :span="7">
                <label>工单状态</label>
                <el-select v-model="queryConditions.workordersStatusCode" placeholder="请选择" size='mini' class="content-select" clearable>
                    <el-option v-for="item in workordersStatusList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <div class="relative">
                    <div class="content-icon" :class="{'active':conditionVisible}" @click="conditionVisible = !conditionVisible"></div>
                    <div class="content-search" @click="searchTable">
                        <p>查询</p>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row v-show="conditionVisible" class="content-row-select">
            <el-col :span="7">
                <label>工单编号</label>
                <el-input v-model="queryConditions.workordersId" placeholder="请输入" size='mini' class="content-select" clearable></el-input>
            </el-col>
            <el-col :span="7">
                <label>设备类型</label>
                <el-select v-model="queryConditions.devTypeCode" placeholder="请选择" size='mini' class="content-select" clearable>
                    <el-option v-for="item in devTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="7">
                <label>所属辖区</label>
                <!-- <el-select v-model="queryConditions.devAreaCode" placeholder="请选择" size='mini' class="content-select">
                    <el-option v-for="item in regionList" :key="item.regionId" :label="item.regionName" :value="item.regionId">
                    </el-option>
                </el-select> -->
                <el-input v-model="devAreaName" placeholder="请选择" size='mini' class="content-select" clearable  readonly v-popover:popoverSelectRegion></el-input>
                <el-popover
                highlight-current
                popper-class="region-popper"
                ref="popoverSelectRegion"
                placement="bottom-start"
                trigger="click"
                v-model="selectRegionVisible">
                    <el-scrollbar class="region-scroll">
                    <el-tree id="selectRegion" :data="regionList" accordion :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClickRegion"></el-tree>
                    </el-scrollbar>
                </el-popover>
            </el-col>
        </el-row>
        <el-row v-show="conditionVisible" class="content-row-select">
            <el-col :span="7">
                <label>运维单位</label>
                <!-- <el-select v-model="queryConditions.devDeptId" placeholder="请选择" size='mini' class="content-select">
                    <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptId">
                    </el-option>
                </el-select> -->
                <el-input v-model="selectDept" placeholder="请选择" size='mini' class="content-select" clearable  readonly v-popover:popoverSelectDept></el-input>
                <el-popover
                highlight-current
                popper-class="region-popper"
                ref="popoverSelectDept"
                placement="bottom-start"
                trigger="click"
                v-model="selectDeptVisible">
                    <el-scrollbar class="region-scroll">
                    <el-tree id="selectDept" :data="deptList" accordion :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClickDept"></el-tree>
                    </el-scrollbar>
                </el-popover>
            </el-col>
        </el-row>
    </div>
</div>
<div class="depiction-info">
    <div class="title">
        <h3>{{title}}</h3>
        <div class="operation select" v-popover:popoverMultiple>
            <i></i>
        </div>
        <div class="operation export" @click="exportExcel">
            <p>导出</p>
        </div>
        <div class="operation revoke" @click="showRevoke">
            <p>撤销</p>
        </div>
        <div class="operation urge" @click="showUrge">
            <p>催办</p>
        </div>
        <el-popover
          ref="popoverMultiple"
          placement="left"
          title="选择可见内容"
          popper-class="table-list-popver"
          trigger="click"
          @after-enter="initMultiple">
            <el-table
            ref="multipleTable"
            :data="typeTableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="name"
                label="类别">
              </el-table-column>
            </el-table>
        </el-popover>
    </div>
    <div class="content">
        <el-table highlight-current-row :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="workordersId" label="工单编号" show-overflow-tooltip v-if="JSON.stringify(multipleSelection).indexOf('工单编号')>-1"></el-table-column>
          <el-table-column prop="devName" label="设备名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="devTypeName" label="设备类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="devAreaName" label="所属辖区" show-overflow-tooltip v-if="JSON.stringify(multipleSelection).indexOf('所属辖区')>-1"></el-table-column>
          <el-table-column prop="devDeptName" label="管理部门" show-overflow-tooltip v-if="JSON.stringify(multipleSelection).indexOf('管理部门')>-1"></el-table-column>
          <el-table-column prop="failureTypeName" label="故障类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createDate" label="工单创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deadlineTime" label="维修期限" show-overflow-tooltip v-if="JSON.stringify(multipleSelection).indexOf('维修期限')>-1"></el-table-column>
          <el-table-column prop="repDeptName" label="运维单位" show-overflow-tooltip></el-table-column>
          <el-table-column prop="workordersStatusName" label="工单状态" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="tab-operation"  @click="dataDetail(scope.row)">详情</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-page">
            <div class="total-count">
                <p>共{{totalCount}}条</p>
            </div>
            <div class="page-size">
                <label for="">每页</label>
                <el-select v-model="pageSize" placeholder="请选择" size='mini' class="page-select">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="page-frist" @click="endPage">
                <p>尾页</p>
            </div>
            <div class="my-el-page">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="queryConditions.currentPage"
                    layout="prev, pager, next" :total="totalCount" :page-size="queryConditions.pageSize" prev-text='上一页' next-text='下一页' :background=true :small=true>
                </el-pagination>
            </div>
            <div class="page-frist" @click="fristPage">
                <p>首页</p>
            </div>
        </div>
    </div>
    <el-dialog title="报修催办" :visible.sync="dialogUrgeVisible" width='400px' class="dialog-urge">
        <div class="dialog-main">
            <label class="dialog-label">催办原因</label>
            <textarea rows="8" cols="40" placeholder="请输入" class="dialog-content"  v-model="operExplain"></textarea>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="pressWorkorders" size='mini' class="submit">提 交</el-button>
            <el-button @click="dialogUrgeVisible = false" size='mini' class="cancel">取 消</el-button>
        </div>
    </el-dialog>
    <el-dialog title="撤销申请" :visible.sync="dialogRevokeVisible" width='400px' class="dialog-urge">
        <div class="dialog-main">
            <div class="revoke-reason">
                <label class="dialog-label">撤销原因</label>
            <el-select v-model="selectCancelReasonCode" placeholder="请选择" size='mini' class="content-select">
                <el-option v-for="item in cancelReasonList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                </el-option>
            </el-select>
            </div>
            <div>
                <label class="dialog-label">备注</label>
            <textarea rows="8" cols="40" placeholder="请输入" class="dialog-content"  v-model="operExplain4Cancel"></textarea>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="cancelWorkorders" size='mini' class="submit">提 交</el-button>
            <el-button @click="dialogRevokeVisible = false" size='mini' class="cancel">取 消</el-button>
        </div>
    </el-dialog>
</div>
</div>
</template>
<script>
import Common from "@/assets/js/common.js";
import Bus from "@/assets/js/bus.js";
export default {
  data() {
    return {
      title: "查询结果",
      workordersStatusList: [],
      regionList: [],
      deptList: [],
      repairDate: '',
      dialogUrgeVisible: false,
      dialogRevokeVisible: false,
      isTableLoading: false,
      tableData: [],
      totalCount: 10,
      totalPage: 1,
      pageSize: 10,
      options: [
        {
          value: 10,
          label: 10
        },
        {
          value: 20,
          label: 20
        },
        {
          value: 30,
          label: 30
        },
        {
          value: 40,
          label: 40
        },
        {
          value: 50,
          label: 50
        }
      ],
      value: "",
      lableClick: '',
      queryConditions: {
        workordersStatusCode: "",
        workordersId: "",
        key: "",
        devTypeCode: "",
        devAreaCode: "",
        devDeptId: "",
        repStartDate: "",
        repEndDate: "",
        lableClick: '',
        pageSize: 10,
        currentPage: 1
      },
      token: "",
      serverPUshData: {
        ORD_MSG_FACKBACK: 0,
        ORD_MSG_SURE: 0,
        ORD_MSG_POSTPONE: 0,
        ORD_MSG_OVERTIME: 0,
        ORD_MSG_PRESS: 0
      },
      selectWorkordersStatus: '',
      selectWorkordersStatusName: '',
      selectWorkordersId: '',
      operExplain: '',
      selectCancelReasonCode: '',
      selectCancelReasonName: '',
      operExplain4Cancel: '',
      cancelReasonList: [],
      devAreaName: '',
      selectDept: '',
      selectDeptVisible: false,
      selectRegionVisible: false,
      conditionVisible: false, // 更多条件
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      devTypeList: [],
      typeTableData: [{"name": "工单编号"}, {"name": "所属辖区"}, {"name": "管理部门"}, {"name": "维修期限"}],
      multipleSelection: [] // 选中需显示的内容
    };
  },
  watch: {
    pageSize(newVal, oldVal) {
      this.queryConditions.pageSize = newVal;
      this.getWorkordersInfoPage();
    },
    selectCancelReasonCode(newVal, oldVal) {
      if (newVal != "") {
        this.cancelReasonList.forEach(item => {
          if (newVal == item.dicCode) {
            this.selectCancelReasonName = item.dicName;
          }
        });
      } else {
        this.selectCancelReasonName = '';
      }
    },
    devAreaName(newVal, oldVal) {
        if (newVal === '') {
            this.queryConditions.devAreaCode = '';
            setTimeout(() => {
              this.selectRegionVisible = false;
            });
        }
    },
    selectDept(newVal, oldVal) {
        if (newVal === '') {
            this.queryConditions.devDeptId = '';
            setTimeout(() => {
              this.selectDeptVisible = false;
            });
        }
    }
  },
  mounted() {
    this.token = Common.getQueryString("token");
    this.getDicInfo('CANCELREASON').then(res => {
        if (res.appCode == 0) { this.cancelReasonList = res.resultList; }
    });
    this.getDicInfo('ORDERSSTATUS').then(res => {
        if (res.appCode == 0) { this.workordersStatusList = res.resultList; }
    });
    // this.getRegionInfo('610000').then(res => {
    //     if (res.appCode == 0) { this.regionList = res.resultList; }
    // });
    this.getRegionTree(null).then(res => {
        if (res.appCode == 0) { this.regionList = res.resultList; }
    });
    // this.getDeptInfo('610100000000').then(res => {
    //     if (res.appCode == 0) { this.deptList = res.resultList; }
    // });
    this.getDeptTree(null).then(res => {
        if (res.appCode == 0) { this.deptList = res.resultList; }
    });
    this.getDicInfo('REPDEVCATEGORY01').then(res => {
        if (res.appCode == 0) { this.devTypeList = res.resultList; }
    });
    this.getWorkordersInfoPage();
    this.workordersOperationCount();
    this.serverPUsh();
  },
  methods: {
    changeLableClick(value) {
        if (value === this.lableClick) {
            this.lableClick = "";
        } else {
            this.lableClick = value;
        }
        this.queryConditions.lableClick = this.lableClick;
        this.searchTable();
    },
    showRevoke() {
      if (!this.selectWorkordersId) {
        return this.$message.error('请先选择一条数据');
      }
      // if (this.selectWorkordersStatus == 'ORDERSSTATUS07' || this.selectWorkordersStatus == 'ORDERSSTATUS08') {
      //   return this.$message.error('该数据已撤销或已完结');
      // }
      if (this.selectWorkordersStatus != 'ORDERSSTATUS01') {
        let tips = '该数据' + (this.selectWorkordersStatusName || '不是待派发') + '不能撤销';
        return this.$message.error(tips);
      }
      this.dialogRevokeVisible = true;
    },
    showUrge() {
      if (!this.selectWorkordersId) {
        return this.$message.error('请先选择一条数据');
      }
      if (this.selectWorkordersStatus != 'ORDERSSTATUS02') {
        let tips = '该数据' + (this.selectWorkordersStatusName || '不是待维修') + '不能催办';
        return this.$message.error(tips);
      }
      this.dialogUrgeVisible = true;
    },
    handleNodeClickRegion(data, node, e) {
        let thisId = e.$parent.$parent.$parent.$attrs.id || e.$parent.$parent.$attrs.id || e.$parent.$attrs.id;
        // if (!data.children || data.children.length == 0) {
        if (data) {
            this.devAreaName = data.text;
            this.queryConditions.devAreaCode = data.id;
            this.selectRegionVisible = false;
        }
    },
    handleNodeClickDept(data, node, e) {
        let thisId = e.$parent.$parent.$parent.$attrs.id || e.$parent.$parent.$attrs.id || e.$parent.$attrs.id;
        // if (!data.children || data.children.length == 0) {
        if (data) {
            this.selectDept = data.text;
            this.queryConditions.devDeptId = data.id;
            this.selectDeptVisible = false;
        }
    },
    serverPUsh() {
      ServerPush.receive('REP_MSG_APPLY', 'message', (res) => {
              this.serverPUshData[res['OPRATION_NAME']] = res[res['OPRATION_NAME']];
      });
      ServerPush.receive('ORD_MSG_OVERTIME', 'message', (res) => {
          this.serverPUshData[res['OPRATION_NAME']] = res[res['OPRATION_NAME']];
      });
    },
    workordersOperationCount() {
      var url =
        this.$config.efoms_HOST + this.$config.workordersOperationCount_GET;
      var header = {
        "Content-Type": "application/x-www-form-urlencoded",
        token: this.token
      };
      this.$api
        .get(
          url,
          {
            startTime: Common.getCurrentDate() + ' 00:00:00',
            endTime: Common.getCurrentDate() + ' 23:59:59'
          },
          header
        )
        .then(res => {
          if (res.appCode == 0) {
            this.serverPUshData = res.resultList;
          } else {
            Common.printErrorLog(this.$config.efoms_HOST, this.$config.workordersOperationCount_GET);
          }
        })
        .catch(err => {
          Common.printErrorLog(this.$config.efoms_HOST, this.$config.workordersOperationCount_GET);
          console.log(err);
        });
    },
    exportExcel() {
      if (this.repairDate) {
          this.queryConditions.repStartDate = Common.dateFormat('yyyy-MM-dd hh:mm:ss', this.repairDate[0]);
          this.queryConditions.repEndDate = Common.dateFormat('yyyy-MM-dd hh:mm:ss', this.repairDate[1]);
      } else {
        this.queryConditions.repStartDate = '';
        this.queryConditions.repEndDate = '';
      }
      var url =
        this.$config.efoms_HOST +
        this.$config.exportWorkorders_GET;
      var header = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      this.$api
        .get(
          url,
          {
            token: this.token,
            workordersStatusCode: this.queryConditions.workordersStatusCode,
            workordersId: this.queryConditions.workordersId,
            key: this.queryConditions.key,
            devTypeCode: this.queryConditions.devTypeCode,
            devAreaCode: this.queryConditions.devAreaCode,
            devDeptId: this.queryConditions.devDeptId,
            repStartDate: this.queryConditions.repStartDate,
            repEndDate: this.queryConditions.repEndDate,
            pageSize: this.queryConditions.pageSize,
            currentPage: this.queryConditions.currentPage
          },
          header
        )
        .then(res => {
          window.open(res.path+'&token='+this.token);
        })
        .catch(err => {
          Common.printErrorLog(this.$config.efoms_HOST, this.$config.exportWorkorders_GET);
          console.log(err);
        });
    },
    changeNum(num) {
      Bus.$emit("showNum", num);
    },
     searchTable() {
        this.queryConditions.currentPage = 1;
        this.getWorkordersInfoPage();
    },
    getDicInfo(parentCode) {
        var url =
        this.$config.ubms_HOST + this.$config.getDeviceDic_GET;
        var header = {
        "Content-Type": "application/x-www-form-urlencoded"
        };
        return this.$api.get(url, {token: this.token, data: JSON.stringify({parentCode: parentCode})}, header);
    },
    getRegionInfo(parentCode) {
        var url =
        this.$config.ubms_HOST + this.$config.getRegionInfo_GET;
        var header = {
        "Content-Type": "application/x-www-form-urlencoded"
        };
        return this.$api.get(url, {token: this.token, data: JSON.stringify({parentCode: parentCode})}, header);
    },
    getRegionTree(parentCode) {
         return this.$api.getMethod(this.$config.efoms_HOST, this.$config.getRegionTree_GET, {token: this.token, data: JSON.stringify({regionId: parentCode})});
    },
    getDeptTree(parentCode) {
         return this.$api.getMethod(this.$config.ubms_HOST, "/ubms-server/DeptInfo/getDeptTree.htm", {token: this.token, data: JSON.stringify({regionId: parentCode})});
    },
    getDeptInfo(parentCode) {
        var url =
        this.$config.ubms_HOST + this.$config.getDeptInfo_GET;
        var header = {
        "Content-Type": "application/x-www-form-urlencoded"
        };
        return this.$api.get(url, {token: this.token, data: JSON.stringify({parentCode: parentCode})}, header);
    },
    fristPage() {
      this.queryConditions.currentPage = 1;
      this.getWorkordersInfoPage();
    },
    endPage() {
      this.queryConditions.currentPage = this.totalPage;
      this.getWorkordersInfoPage();
    },
    handleCurrentChange(e) {
      this.getWorkordersInfoPage();
    },
    dataDetail(item) {
      var url =
        this.$config.efoms_HOST +
        this.$config.getWorkordersInfoById_GET;
      var header = {
        "Content-Type": "application/x-www-form-urlencoded",
        token: this.token
      };
      this.$api
        .get(
          url,
          {
            workordersId: item.workordersId
          },
          header
        )
        .then(res => {
          if (res.appCode == 0) {
            sessionStorage.setItem(
              "workordersInfo",
              JSON.stringify(res.resultList)
            );
            var type = item.workordersStatusCode
              ? item.workordersStatusCode
              : "";
            switch (type) {
              case "ORDERSSTATUS01":
                sessionStorage.setItem("dataDetail", JSON.stringify(res.resultList));
                window.location.href = this.$config.ProjectName +
                  "/repdesc.html?type=dispatch&token=" + this.token;
                break;
              default:
                window.location.href = this.$config.ProjectName +
                  "/fixdesc.html?type=fixm&token=" + this.token;
                break;
            }
          } else {
            Common.printErrorLog(this.$config.efoms_HOST, this.$config.getRepairsInfoById_GET);
          }
        })
        .catch(err => {
          Common.printErrorLog(this.$config.efoms_HOST, this.$config.getRepairsInfoById_GET);
          console.log(err);
        });
    },
    getWorkordersInfoPage() {
      if (this.repairDate) {
          this.queryConditions.repStartDate = Common.dateFormat('yyyy-MM-dd hh:mm:ss', this.repairDate[0]);
          this.queryConditions.repEndDate = Common.dateFormat('yyyy-MM-dd hh:mm:ss', this.repairDate[1]);
      } else {
        this.queryConditions.repStartDate = '';
        this.queryConditions.repEndDate = '';
      }
      var url =
        this.$config.efoms_HOST +
        this.$config.getWorkordersInfoPage_GET;
      var header = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      this.isTableLoading = true;
      this.$api
        .get(
          url,
          {
            token: this.token,
            workordersStatusCode: this.queryConditions.workordersStatusCode,
            workordersId: this.queryConditions.workordersId,
            key: this.queryConditions.key,
            devTypeCode: this.queryConditions.devTypeCode,
            devAreaCode: this.queryConditions.devAreaCode,
            devDeptId: this.queryConditions.devDeptId,
            repStartDate: this.queryConditions.repStartDate,
            repEndDate: this.queryConditions.repEndDate,
            lableClick: this.queryConditions.lableClick,
            pageSize: this.queryConditions.pageSize,
            currentPage: this.queryConditions.currentPage
          },
          header
        )
        .then(res => {
          setTimeout((load) => {
            this.isTableLoading = false;
          }, 500);
          if (res.appCode == 0) {
            this.tableData = res.resultList.result;
            this.totalPage = res.resultList.totalPage;
            this.totalCount = res.resultList.totalCount;
            this.selectWorkordersId = '';
          } else {
            Common.printErrorLog(this.$config.efoms_HOST, this.$config.getWorkordersInfoPage_GET);
          }
        })
        .catch(err => {
          setTimeout((load) => {
            this.isTableLoading = false;
          }, 500);
          Common.printErrorLog(this.$config.efoms_HOST, this.$config.getWorkordersInfoPage_GET);
          console.log(err);
        });
    },
    enter(index) {
      this.seen = true;
      this.current = index;
    },
    leave() {
      this.seen = false;
      this.current = null;
    },
    currentSelect(e) {
      this.selectWorkordersStatus = e ? e.workordersStatusCode : '';
      this.selectWorkordersStatusName = e ? e.workordersStatusName : '';
      this.selectWorkordersId = e ? e.workordersId : '';
    },
    pressWorkorders() {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      var url =
        this.$config.efoms_HOST + this.$config.pressWorkorders_GET;
      var header = {
        "Content-Type": "application/x-www-form-urlencoded",
        token: this.token
      };
      this.$api
      .putByQs(
        url,
        {
          workordersId: this.selectWorkordersId,
          operExplain: this.operExplain
        },
        header
      )
      .then(res => {
        this.dialogUrgeVisible = false;
        loading.close();
        if (res.appCode == 0) {
          this.getWorkordersInfoPage();
        } else {
          this.$message.error('催办失败，请稍后重试！');
          Common.printErrorLog(this.$config.efoms_HOST, this.$config.pressWorkorders_GET);
        }
      })
      .catch(err => {
        this.dialogUrgeVisible = false;
        loading.close();
        Common.printErrorLog(this.$config.efoms_HOST, this.$config.pressWorkorders_GET);
        console.log(err);
      });
    },
    cancelWorkorders() {
      if (this.selectCancelReasonCode == '') {
        return this.$message.error('请选择撤销原因');
      }
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      var url =
        this.$config.efoms_HOST + this.$config.cancelWorkorders_GET;
      var header = {
        "Content-Type": "application/x-www-form-urlencoded",
        token: this.token
      };
      this.$api
      .putByQs(
        url,
        {
          workordersId: this.selectWorkordersId,
          operExplain: this.operExplain4Cancel,
          operReasonCode: this.selectCancelReasonCode,
          operReasonName: this.selectCancelReasonName
        },
        header
      )
      .then(res => {
        this.dialogRevokeVisible = false;
        loading.close();
        if (res.appCode == 0) {
          this.getWorkordersInfoPage();
        } else {
          this.$message.error('撤销失败，请稍后重试！');
          Common.printErrorLog(this.$config.efoms_HOST, this.$config.cancelWorkorders_GET);
        }
      })
      .catch(err => {
        this.dialogRevokeVisible = false;
        loading.close();
        Common.printErrorLog(this.$config.efoms_HOST, this.$config.cancelWorkorders_GET);
        console.log(err);
      });
    },
    // 列表显示处理--start
    initMultiple() {
      let rows = [];
      let mulStr = JSON.stringify(this.multipleSelection);
      this.typeTableData.forEach(res => {
        let resStr = JSON.stringify(res);
        if (mulStr.indexOf(resStr) > -1) {
          rows.push(res);
        }
      });
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row, true);
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
    // 列表显示处理--end
  }
};
</script>
<style scoped>
.base-info{margin: 14px 14px 10px 14px;background: #FFFFFF;}
.base-info .tabs{height: 34px;display: flex;}
.base-info .tabs div{width: 236px;height: 34px;background: #f9fafc;float: left;text-align: center;cursor: pointer;}
.base-info .tabs div span{display: inline-block;height: 34px;line-height: 34px;font-size: 14px;color: #758087;}
.base-info .tabs .tabs-before{width: 65px;border-bottom: 1px solid #E4EAEE;}
.base-info .tabs .other-tabs{border-bottom: 1px solid #E4EAEE;}
.base-info .tabs .other-tabs.active{border: 1px solid #E4EAEE;border-bottom:0px;background: #FFFFFF;}
.base-info .tabs .other-tabs.active .tabs-name{color: #22262E;margin-right: 16px;}
.base-info .tabs .other-tabs.active .tabs-count{color: #E58600;}
.base-info .tabs .tabs-after{flex:1;border-bottom: 1px solid #E4EAEE;}
.base-info .title{height: 36px;border-bottom: 1px solid #EBEFF1;margin: 0 58px 0 40px;}
.base-info .title::before{content: '';position: relative;left: -41px;top: 10px;border-left: 2px solid #00C187;}
.base-info .title h3{font-size: 14px;color: #22262E;line-height: 0px;border-top: 0px;}
.base-info .content{padding-top: 5px;padding-left: 40px;border: 1px solid #E4EAEE;border-radius: 2px;border-top: 0px;}
.base-info .content .content-row-select{margin-top: 10px;}
.base-info .content .content-row-select .quick-query{background: #FDF6EC;border: 1px solid #FBF0DF;border-radius: 11px;width: 105px;height: 22px;display: inline-block;margin-right: 20px;text-align: center;line-height: 20px;cursor: pointer;}
.base-info .content .content-row-select .quick-query.active{background: #ECA848;}
.base-info .content .content-row-select .quick-query.active label{color: #FFFFFF;}
.base-info .content .content-row-select .quick-query.active span{color: #FFFFFF;}
.base-info .content .content-row-select .quick-query label{color: #E58600;display: inline-block;width: 48px;font-size: 12px;cursor: pointer;}
.base-info .content .content-row-select .quick-query span{color: #E58600;display: inline-block;font-size: 12px;}
.base-info .content .content-row-select.content-row-foot{margin-bottom: 40px;}
.base-info .content .content-row-explain{font-size: 12px;line-height: 12px;margin-bottom: 25px;}
.base-info .content label{color: #4F5A64;display: inline-block;width: 48px;font-size: 12px; margin-right: 12px;text-align: right;}
.base-info .content span{font-size: 12px;color: #737E84;}
.base-info .content .content-select{width: 220px;}
.base-info .content .content-date{width: 220px;background: #F9FAFC;border-radius: 0;border: 1px solid #E1E7ED;}
.base-info .content .content-search{background: #00C187;border-radius: 1px;width: 80px;height: 28px;text-align: center;line-height: 28px;cursor: pointer;}
.base-info .content .content-search p{font-size: 12px;color: #FFFFFF;}
.depiction-info{margin: 14px 14px 25px 14px;background: #FFFFFF;border: 1px solid #E4EAEE;border-radius: 2px;}
.depiction-info .title{height: 36px;border-bottom: 1px solid #EBEFF1;margin: 0 40px 0 40px;}
.depiction-info .title::before{content: '';position: relative;left: -41px;top: 2px;border-left: 2px solid #00C187;}
.depiction-info .title h3{font-size: 14px;color: #22262E;line-height: 36px;display: inline-block;}
.depiction-info .title .operation{width: 50px;height: 20px;background: #F9FAFC;border: 1px solid #E1E7ED;border-radius: 1px;line-height: 20px;text-align: center;margin-top: 8px;margin-right: 20px;float: right;cursor: pointer;}
.depiction-info .title .operation p{font-size: 12px;color: #4F5A64;}
.depiction-info .title .operation.urge {background: #00C187;}
.depiction-info .title .operation.urge p{color: #FFFFFF;}
.depiction-info .title .operation.revoke {background: #D89D00;}
.depiction-info .title .operation.revoke p{color: #FFFFFF;}
.depiction-info .title .operation.select {width: 30px;margin-right: 0px;}
.depiction-info .title .operation.select i{display: inline-block;margin-bottom: 2px;background: url(../../assets/images/icon-select.png) no-repeat;width: 18px;height: 8px;}
.depiction-info .content{padding-top: 10px;padding-left: 40px;padding-right: 40px;padding-bottom: 55px;}
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
.depiction-info .content .file-preview{display: inline-block;margin-left: 20px;}
.depiction-info .content .file-preview .file-name{float: left;margin-right: 5px;}
.depiction-info .content .file-preview .file-del{color: #6BA1EB;cursor: pointer;}
.depiction-info .content .file-explain{margin: 10px 0px 0px 63px;color: #A3B1B9;}
.depiction-info .content .content-table{width: 100%}
.depiction-info .content .content-page{width: 100%;float: right;margin-top: 15px;}
.depiction-info .content .content-page .total-count{float: left;}
.depiction-info .content .content-page .total-count p{font-size: 12px;color: #929CA2;}
.depiction-info .content .content-page .page-frist{box-sizing: border-box;float: right;width: 38px;font-size: 12px;height: 22px;text-align: center;line-height: 22px;background: #F9FAFC;border: 1px solid #E1E7ED;cursor: pointer;}
.depiction-info .content .content-page .page-frist p{font-size: 12px;color: #929CA2;}
.depiction-info .content .content-page .page-size{float: right;}
.depiction-info .content .content-page .page-size label{font-size: 12px;color: #929CA2; width: 24px;margin-left: 13px;margin-right: 6px;}
.depiction-info .content .content-page .page-size .page-select{width: 50px;}
.depiction-info .content .content-page .my-el-page{float: right;}
.depiction-info .content .tab-operation{color: #00C187;cursor: pointer;}
.dialog-urge .dialog-main{margin-top: -30px;padding-top: 10px;border-top:1px solid #EBEFF1;}
.dialog-urge .dialog-main .dialog-label{float: left;font-size: 12px;margin-right: 8px;width: 48px;text-align: right;line-height: 28px;}
.dialog-urge .dialog-main .revoke-reason{margin-bottom: 13px;}
.dialog-urge .dialog-main .dialog-content{background: #F9FAFC;border: 1px solid #E1E7ED;resize: none;box-sizing: border-box;width: 303px;}
.dialog-urge .dialog-main  .content-select{width: 303px;}
.dialog-urge .dialog-footer{text-align: center;}
.dialog-urge .dialog-footer .submit{margin-right: 20px;background: #00C187;border-color: #E1E7ED;}
.dialog-urge .dialog-footer .submit:hover{background: #00C187;border-color: #E1E7ED;}
.dialog-urge .dialog-footer .cancel{background: #F9FAFC;border-color: #E1E7ED;color: #6C7883;}
.dialog-urge .dialog-footer .cancel:hover{background: #F9FAFC;border-color: #E1E7ED;color: #6C7883;}
.base-info .content{padding-bottom: 24px;}
.base-info .content-icon{position: absolute;width: 28px;height: 28px;background: url('../../assets/images/icon-arrow-double.png') no-repeat center/100%;cursor: pointer;;left: -38px;}
.base-info .content-icon.active{transform: rotate(90deg);}
.relative{position: relative;}
</style>
<style>
@import "../../assets/css/tableHeight.css";
.depiction-info .content .content-select .el-input__inner{border-radius: 0;background: #F9FAFC;border: 1px solid #E1E7ED;}
.depiction-info .content .content-select .el-input__suffix{border-left: 1px solid #E1E7ED;}
.depiction-info .content .content-row-select .content-textarea .el-textarea__inner{border-radius: 0;background: #F9FAFC;border: 1px solid #E1E7ED;}
.depiction-info .content .content-page .my-el-page .el-pagination{padding:0;}
.depiction-info .content .content-page .my-el-page .el-pagination.is-background .el-pager li{font-weight: lighter;border-right: 0;border-radius: 0;}
.depiction-info .content .content-page .my-el-page .el-pagination.is-background .el-pager li:not(.disabled).active{background-color: #00C187;}
.depiction-info .content .content-page .my-el-page .el-pagination.is-background .el-pager li:not(.disabled):hover {color: #000000;}
.depiction-info .content .content-page .my-el-page .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{background-color: #F9FAFC;color: #929CA2;border: 1px solid #E1E7ED;}
.depiction-info .content .content-page .my-el-page .el-pagination button, .el-pagination span:not([class*=suffix]){font-size: 12px;min-width: 50px;}
.depiction-info .content .content-page .my-el-page .el-pagination.is-background.el-pagination--small .btn-next, .el-pagination.is-background.el-pagination--small .btn-prev, .el-pagination.is-background.el-pagination--small .el-pager li{margin: 0px;}
.depiction-info .content .content-page .page-size .page-select .el-input--mini .el-input__inner{padding: 0 5px;color: #929CA2;border: 1px solid #E1E7ED;height: 22px;line-height: 22px;}
.depiction-info .content .content-table table thead tr th{background: #F9FAFC;text-align: center;}
.depiction-info .content .content-table table thead th>.cell{color: #737E84;font-size: 12px;}
.depiction-info .content .content-table table tbody tr>td{font-size: 12px;color: #4F5A64;text-align: center;}
.depiction-info .content .content-table table tbody tr:hover>td{background: rgba(0, 243, 170, 0.1);}
.depiction-info .content .content-table .el-table--striped .el-table__body tr.el-table__row--striped.current-row td, .depiction-info .content .content-table .el-table__body tr.current-row>td, .depiction-info .content .content-table .el-table__body tr.hover-row.current-row>td, .depiction-info .content .content-table .el-table__body tr.hover-row.el-table__row--striped.current-row>td, .depiction-info .content .content-table .el-table__body tr.hover-row.el-table__row--striped>td, .depiction-info .content .content-table .el-table__body tr.hover-row>td{background: #00C187;color: #FFFFFF;}
.depiction-info .content .content-table .el-table--striped .el-table__body tr.el-table__row--striped.current-row td .tab-operation, .depiction-info .content .content-table .el-table__body tr.current-row>td .tab-operation, .depiction-info .content .content-table .el-table__body tr.hover-row.current-row>td .tab-operation, .depiction-info .content .content-table .el-table__body tr.hover-row.el-table__row--striped.current-row>td .tab-operation, .depiction-info .content .content-table .el-table__body tr.hover-row.el-table__row--striped>td .tab-operation, .depiction-info .content .content-table .el-table__body tr.hover-row>td .tab-operation{color: #FFFFFF;}
.dialog-urge .dialog-main .el-input__inner{border-radius: 0;background: #F9FAFC;border: 1px solid #E1E7ED;}
.dialog-urge .dialog-main .el-input__suffix{border-left: 1px solid #E1E7ED;}
.dialog-urge .el-dialog__header span{font-size: 14px;color: #22262E;line-height: 19px;}
.dialog-urge .el-dialog__headerbtn{top: 24px;}
.base-info .content .content-date .el-range-input{background: #F9FAFC;}
.base-info .content .content-select .el-input__inner{border-radius: 0;background: #F9FAFC;border: 1px solid #E1E7ED;}
.base-info .content .content-select .el-input__suffix{border-left: 1px solid #E1E7ED;}
.depiction-info .content .content-page .my-el-page .el-pagination__total{position: absolute;left: 56px;bottom: 20px;}
</style>
