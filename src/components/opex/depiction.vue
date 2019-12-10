<template>
  <div class="depiction-info">
    <div class="title">
      <h3>{{title}}</h3>
      <div class="operation select" v-popover:popoverMultiple>
        <i></i>
      </div>
      <div class="operation export" @click="exportExcel">
        <p>导出</p>
      </div>
      <!--         <div class="operation revoke" @click="dialogRevokeVisible = true">
            <p>撤销</p>
        </div>
        <div class="operation urge" @click="dialogUrgeVisible = true">
            <p>催办</p>
        </div> -->
      <el-popover ref="popoverMultiple" placement="left" title="选择可见内容" popper-class="table-list-popver" trigger="click"
        @after-enter="initMultiple">
        <el-table ref="multipleTable" :data="typeTableData" tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="name" label="类别">
          </el-table-column>
        </el-table>
      </el-popover>
    </div>
    <div class="content">
      <el-table highlight-current-row :data="tableData" border @current-change='currentSelect' class="content-table"
        v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.7)">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="devName" label="设备名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="devTypeName" label="设备类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="devAreaName" label="所属辖区" show-overflow-tooltip
          v-if="JSON.stringify(multipleSelection).indexOf('所属辖区')>-1" key="1"></el-table-column>
        <el-table-column prop="devDeptName" label="管理部门" show-overflow-tooltip
          v-if="JSON.stringify(multipleSelection).indexOf('管理部门')>-1" key="2"></el-table-column>
        <el-table-column prop="failureTypeName" label="故障类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createDate" label="工单创建时间" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="deadlineTime" label="维修期限" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="repDeptName" label="运维单位" show-overflow-tooltip
          v-if="JSON.stringify(multipleSelection).indexOf('运维单位')>-1" key="3"></el-table-column>
        <el-table-column label="设备状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{scope.row.isOverdue?'已逾期':(scope.row.repStatusName||'维修中')}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="workordersStatusName" label="工单状态" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="repDeptName" label="报修单位" show-overflow-tooltip></el-table-column>
          <el-table-column prop="repPersonName" label="报修人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="repDate" label="报修时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="workordersStatusName" label="报修状态" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="pressTimes" label="催办次数" show-overflow-tooltip
          v-if="JSON.stringify(multipleSelection).indexOf('催办次数')>-1" key="4"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="tab-operation" @click="dataDetail(scope.row)">详情</div>
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
            layout="total,prev, pager, next" :total="totalCount" :page-size="queryConditions.pageSize" prev-text='上一页'
            next-text='下一页' :background=true :small=true>
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
        <textarea rows="8" cols="40" placeholder="请输入" class="dialog-content" v-model="operExplain"></textarea>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pressRepairsInfo" size='mini' class="submit">提 交</el-button>
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
          <textarea rows="8" cols="40" placeholder="请输入" class="dialog-content" v-model="operExplain4Cancel"></textarea>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancelRepairsInfo" size='mini' class="submit">提 交</el-button>
        <el-button @click="dialogRevokeVisible = false" size='mini' class="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Common from "@/assets/js/common.js";
  import Bus from "@/assets/js/bus.js";
  export default {
    data() {
      return {
        title: "查询结果",
        dialogUrgeVisible: false,
        dialogRevokeVisible: false,
        isTableLoading: false,
        tableData: [],
        totalCount: 10,
        totalPage: 1,
        pageSize: 10,
        options: [{
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
        token: '',
        value: '',
        selectRepairsId: '',
        operExplain: '',
        queryConditions: {
          repStatusCode: "",
          devTypeCode: "",
          devAreaCode: "",
          repairsId: "",
          key: "",
          repDeptIds: "",
          startTime: "",
          endTime: "",
          pageSize: 10,
          currentPage: 1
        },
        cancelReasonList: [],
        selectCancelReasonCode: '',
        selectCancelReasonName: '',
        operExplain4Cancel: '',
        typeTableData: [{
          "name": "所属辖区"
        }, {
          "name": "管理部门"
        }, {
          "name": "运维单位"
        }, {
          "name": "催办次数"
        }],
        multipleSelection: [] // 选中需显示的内容
      };
    },
    watch: {
      pageSize(newVal, oldVal) {
        this.queryConditions.pageSize = newVal;
        this.selectRepairsInfoPage();
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
      }
    },
    mounted() {
      this.token = Common.getQueryString("token");
      this.selectRepairsInfoPage();
      this.getDicInfo('CANCELREASON').then(res => {
        if (res.appCode == 0) {
          this.cancelReasonList = res.resultList;
        }
      });
      Bus.$on("queryConditions", value => {
        this.queryConditions = value;
        this.selectRepairsInfoPage();
      });
    },
    methods: {
      exportExcel() {
        let host = this.$config.efoms_HOST;
        let method = this.$config.exportWorkordersNoDispatch_GET;
        let obj = JSON.parse(JSON.stringify(this.queryConditions));
        this.$api.getMethod(host, method, obj, this.token).then(res => {
            window.open(res.path);
          })
          .catch(err => {
            Common.printErrorLog(host, method);
            console.log(err);
          });
      },
      fristPage() {
        this.queryConditions.currentPage = 1;
        this.selectRepairsInfoPage();
      },
      endPage() {
        this.queryConditions.currentPage = this.totalPage;
        this.selectRepairsInfoPage();
      },
      selectRepairsInfoPage() {
        var url =
          this.$config.efoms_HOST + this.$config.getWorkordersNoDispatchPage_GET;
        var header = {
          "Content-Type": "application/x-www-form-urlencoded",
          token: this.token
        };
        this.isTableLoading = true;
        this.$api
          .get(
            url,
            this.queryConditions,
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
            } else {
              Common.printErrorLog(this.$config.efoms_HOST, this.$config.selectRepairsInfoPage_GET);
            }
          })
          .catch(err => {
            setTimeout((load) => {
              this.isTableLoading = false;
            }, 500);
            Common.printErrorLog(this.$config.efoms_HOST, this.$config.selectRepairsInfoPage_GET);
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
        this.selectRepairsId = e.repairsId;
      },
      handleCurrentChange(e) {
        this.selectRepairsInfoPage();
      },
      pressRepairsInfo() {
        if (!this.selectRepairsId) {
          return this.$message.error('请先选择一条数据');
        }
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        var url =
          this.$config.efoms_HOST + this.$config.pressRepairsInfo_GET;
        var header = {
          "Content-Type": "application/x-www-form-urlencoded",
          token: this.token
        };
        this.$api
          .putByQs(
            url, {
              repairsId: this.selectRepairsId,
              operExplain: this.operExplain
            },
            header
          )
          .then(res => {
            this.dialogUrgeVisible = false;
            loading.close();
            if (res.appCode == 0) {
              this.selectRepairsInfoPage();
            } else {
              this.$message.error('催办失败，请稍后重试！');
              Common.printErrorLog(this.$config.efoms_HOST, this.$config.pressRepairsInfo_GET);
            }
          })
          .catch(err => {
            this.dialogUrgeVisible = false;
            loading.close();
            Common.printErrorLog(this.$config.efoms_HOST, this.$config.pressRepairsInfo_GET);
            console.log(err);
          });
      },
      cancelRepairsInfo() {
        if (!this.selectRepairsId) {
          return this.$message.error('请先选择一条数据');
        }
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
          this.$config.efoms_HOST + this.$config.cancelRepairsInfo_GET;
        var header = {
          "Content-Type": "application/x-www-form-urlencoded",
          token: this.token
        };
        this.$api
          .putByQs(
            url, {
              repairsId: this.selectRepairsId,
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
              this.selectRepairsInfoPage();
            } else {
              this.$message.error('撤销失败，请稍后重试！');
              Common.printErrorLog(this.$config.efoms_HOST, this.$config.cancelRepairsInfo_GET);
            }
          })
          .catch(err => {
            this.dialogRevokeVisible = false;
            loading.close();
            Common.printErrorLog(this.$config.efoms_HOST, this.$config.cancelRepairsInfo_GET);
            console.log(err);
          });
      },
      getDicInfo(parentCode) {
        var url =
          this.$config.ubms_HOST + this.$config.getDeviceDic_GET;
        var header = {
          "Content-Type": "application/x-www-form-urlencoded"
        };
        return this.$api.get(url, {
          token: this.token,
          data: JSON.stringify({
            parentCode: parentCode
          })
        }, header);
      },
      dataDetail(item) {
        var url =
          this.$config.efoms_HOST + this.$config.getWorkordersInfoById_GET;
        var header = {
          "Content-Type": "application/x-www-form-urlencoded",
          token: this.token
        };
        this.$api
          .get(
            url, {
              workordersId: item.workordersId
            },
            header
          )
          .then(res => {
            if (res.appCode == 0) {
              sessionStorage.setItem("workordersInfo", JSON.stringify(res.resultList));
              sessionStorage.setItem("dataDetail", JSON.stringify(res.resultList));
              window.location.href = this.$config.ProjectName + '/fixdesc.html?type=opex&token=' + this.token;
            } else {
              Common.printErrorLog(this.$config.efoms_HOST, this.$config.getRepairsInfoById_GET);
            }
          })
          .catch(err => {
            Common.printErrorLog(this.$config.efoms_HOST, this.$config.getRepairsInfoById_GET);
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
  .depiction-info {
    margin: 14px 14px 25px 14px;
    background: #FFFFFF;
    border: 1px solid #E4EAEE;
    border-radius: 2px;
  }

  .depiction-info .title {
    height: 36px;
    border-bottom: 1px solid #EBEFF1;
    margin: 0 40px 0 40px;
  }

  .depiction-info .title::before {
    content: '';
    position: relative;
    left: -41px;
    top: 2px;
    border-left: 2px solid #00C187;
  }

  .depiction-info .title h3 {
    font-size: 14px;
    color: #22262E;
    line-height: 36px;
    display: inline-block;
  }

  .depiction-info .title .operation {
    width: 50px;
    height: 20px;
    background: #F9FAFC;
    border: 1px solid #E1E7ED;
    border-radius: 1px;
    line-height: 20px;
    text-align: center;
    margin-top: 8px;
    margin-right: 20px;
    float: right;
    cursor: pointer;
  }

  .depiction-info .title .operation p {
    font-size: 12px;
    color: #4F5A64;
  }

  .depiction-info .title .operation.urge {
    background: #00C187;
  }

  .depiction-info .title .operation.urge p {
    color: #FFFFFF;
  }

  .depiction-info .title .operation.revoke {
    background: #D89D00;
  }

  .depiction-info .title .operation.revoke p {
    color: #FFFFFF;
  }

  .depiction-info .title .operation.select {
    width: 30px;
    margin-right: 0px;
  }

  .depiction-info .title .operation.select i {
    display: inline-block;
    margin-bottom: 2px;
    background: url(../../assets/images/icon-select.png) no-repeat;
    width: 18px;
    height: 8px;
  }

  .depiction-info .content {
    padding-top: 10px;
    padding-left: 40px;
    padding-right: 40px;
    padding-bottom: 55px;
  }

  .depiction-info .content .content-row-select {
    margin-top: 10px;
  }

  .depiction-info .content .content-row-explain {
    font-size: 12px;
    line-height: 12px;
    margin-bottom: 25px;
  }

  .depiction-info .content .content-row-explain.content-row-first {
    margin-top: 16px;
    margin-bottom: 15px;
  }

  .depiction-info .content .content-row-select.content-row-bottom {
    margin-bottom: 20px;
  }

  .depiction-info .content .content-row-select .linkman-explain {
    position: absolute;
    color: #A3B1B9;
    font-size: 12px;
    padding: 10px 0 0 64px;
  }

  .depiction-info .content label {
    color: #4F5A64;
    display: inline-block;
    width: 48px;
    font-size: 12px;
    margin-right: 12px;
    text-align: right;
  }

  .depiction-info .content span {
    font-size: 12px;
    color: #737E84;
  }

  .depiction-info .content .content-select {
    width: 300px;
  }

  .depiction-info .content .content-row-select .content-textarea {
    width: 300px;
  }

  .depiction-info .content .content-row-select .content-label {
    position: relative;
    top: -50px;
  }

  .depiction-info .content .content-row-img {
    font-size: 12px;
    line-height: 12px;
    display: flex;
  }

  .depiction-info .content .content-row-img label {
    line-height: 30px;
  }

  .depiction-info .content .content-row-explain .img-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    margin-left: 6px;
    margin-right: 10px;
    background: #FFFFFF;
    border: 1px solid #E1E7ED;
  }

  .depiction-info .content .content-row-explain .img-preview .img-del {
    opacity: 0.62;
    background: #7A7A7A;
    width: 50px;
    height: 15px;
    position: absolute;
    bottom: 1px;
  }

  .depiction-info .content .content-row-explain .img-preview .img-del p {
    font-size: 10px;
    color: #FFFFFF;
    text-align: center;
    cursor: pointer;
    ;
  }

  .depiction-info .content .content-row-explain .img-add {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    margin-left: 6px;
    margin-right: 10px;
    background: #FFFFFF;
    border: 1px solid #E1E7ED;
    cursor: pointer;
  }

  .depiction-info .content .file-add {
    color: #6BA1EB;
    cursor: pointer;
    margin-right: 5px;
  }

  .depiction-info .content .file-preview {
    display: inline-block;
    margin-left: 20px;
  }

  .depiction-info .content .file-preview .file-name {
    float: left;
    margin-right: 5px;
  }

  .depiction-info .content .file-preview .file-del {
    color: #6BA1EB;
    cursor: pointer;
  }

  .depiction-info .content .file-explain {
    margin: 10px 0px 0px 63px;
    color: #A3B1B9;
  }

  .depiction-info .content .content-table {
    width: 100%
  }

  .depiction-info .content .content-page {
    width: 100%;
    float: right;
    margin-top: 15px;
  }

  .depiction-info .content .content-page .total-count {
    float: left;
  }

  .depiction-info .content .content-page .total-count p {
    font-size: 12px;
    color: #929CA2;
  }

  .depiction-info .content .content-page .page-frist {
    box-sizing: border-box;
    float: right;
    width: 38px;
    font-size: 12px;
    height: 22px;
    text-align: center;
    line-height: 22px;
    background: #F9FAFC;
    border: 1px solid #E1E7ED;
    cursor: pointer;
  }

  .depiction-info .content .content-page .page-frist p {
    font-size: 12px;
    color: #929CA2;
  }

  .depiction-info .content .content-page .page-size {
    float: right;
  }

  .depiction-info .content .content-page .page-size label {
    font-size: 12px;
    color: #929CA2;
    width: 24px;
    margin-left: 13px;
    margin-right: 6px;
  }

  .depiction-info .content .content-page .page-size .page-select {
    width: 50px;
  }

  .depiction-info .content .content-page .my-el-page {
    float: right;
  }

  .depiction-info .content .tab-operation {
    color: #00C187;
    cursor: pointer;
  }

  .dialog-urge .dialog-main {
    margin-top: -30px;
    padding-top: 10px;
    border-top: 1px solid #EBEFF1;
  }

  .dialog-urge .dialog-main .dialog-label {
    float: left;
    font-size: 12px;
    margin-right: 8px;
    width: 48px;
    text-align: right;
    line-height: 28px;
  }

  .dialog-urge .dialog-main .revoke-reason {
    margin-bottom: 13px;
  }

  .dialog-urge .dialog-main .dialog-content {
    background: #F9FAFC;
    border: 1px solid #E1E7ED;
  }

  .dialog-urge .dialog-main .content-select {
    width: 303px;
  }

  .dialog-urge .dialog-footer {
    text-align: center;
  }

  .dialog-urge .dialog-footer .submit {
    margin-right: 20px;
    background: #00C187;
    border-color: #E1E7ED;
  }

  .dialog-urge .dialog-footer .submit:hover {
    background: #00C187;
    border-color: #E1E7ED;
  }

  .dialog-urge .dialog-footer .cancel {
    background: #F9FAFC;
    border-color: #E1E7ED;
    color: #6C7883;
  }

  .dialog-urge .dialog-footer .cancel:hover {
    background: #F9FAFC;
    border-color: #E1E7ED;
    color: #6C7883;
  }

</style>
<style>
  @import "../../assets/css/tableHeight.css";

  .depiction-info .content .content-select .el-input__inner {
    border-radius: 0;
    background: #F9FAFC;
    border: 1px solid #E1E7ED;
  }

  .depiction-info .content .content-select .el-input__suffix {
    border-left: 1px solid #E1E7ED;
  }

  .depiction-info .content .content-row-select .content-textarea .el-textarea__inner {
    border-radius: 0;
    background: #F9FAFC;
    border: 1px solid #E1E7ED;
  }

  .depiction-info .content .content-page .my-el-page .el-pagination {
    padding: 0;
  }

  .depiction-info .content .content-page .my-el-page .el-pagination.is-background .el-pager li {
    font-weight: lighter;
    border-right: 0;
    border-radius: 0;
  }

  .depiction-info .content .content-page .my-el-page .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #00C187;
  }

  .depiction-info .content .content-page .my-el-page .el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #000000;
  }

  .depiction-info .content .content-page .my-el-page .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    background-color: #F9FAFC;
    color: #929CA2;
    border: 1px solid #E1E7ED;
  }

  .depiction-info .content .content-page .my-el-page .el-pagination button,
  .el-pagination span:not([class*=suffix]) {
    font-size: 12px;
    min-width: 50px;
  }

  .depiction-info .content .content-page .my-el-page .el-pagination.is-background.el-pagination--small .btn-next,
  .el-pagination.is-background.el-pagination--small .btn-prev,
  .el-pagination.is-background.el-pagination--small .el-pager li {
    margin: 0px;
  }

  .depiction-info .content .content-page .page-size .page-select .el-input--mini .el-input__inner {
    padding: 0 5px;
    color: #929CA2;
    border: 1px solid #E1E7ED;
    height: 22px;
    line-height: 22px;
  }

  .depiction-info .content .content-table table thead tr th {
    background: #F9FAFC;
    text-align: center;
  }

  .depiction-info .content .content-table table thead th>.cell {
    color: #737E84;
    font-size: 12px;
  }

  .depiction-info .content .content-table table tbody tr>td {
    font-size: 12px;
    color: #4F5A64;
    text-align: center;
  }

  .depiction-info .content .content-table table tbody tr:hover>td {
    background: rgba(0, 243, 170, 0.1);
  }

  .depiction-info .content .content-table .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
  .depiction-info .content .content-table .el-table__body tr.current-row>td,
  .depiction-info .content .content-table .el-table__body tr.hover-row.current-row>td,
  .depiction-info .content .content-table .el-table__body tr.hover-row.el-table__row--striped.current-row>td,
  .depiction-info .content .content-table .el-table__body tr.hover-row.el-table__row--striped>td,
  .depiction-info .content .content-table .el-table__body tr.hover-row>td {
    background: #00C187;
    color: #FFFFFF;
  }

  .depiction-info .content .content-table .el-table--striped .el-table__body tr.el-table__row--striped.current-row td .tab-operation,
  .depiction-info .content .content-table .el-table__body tr.current-row>td .tab-operation,
  .depiction-info .content .content-table .el-table__body tr.hover-row.current-row>td .tab-operation,
  .depiction-info .content .content-table .el-table__body tr.hover-row.el-table__row--striped.current-row>td .tab-operation,
  .depiction-info .content .content-table .el-table__body tr.hover-row.el-table__row--striped>td .tab-operation,
  .depiction-info .content .content-table .el-table__body tr.hover-row>td .tab-operation {
    color: #FFFFFF;
  }

  .dialog-urge .dialog-main .el-input__inner {
    border-radius: 0;
    background: #F9FAFC;
    border: 1px solid #E1E7ED;
  }

  .dialog-urge .dialog-main .el-input__suffix {
    border-left: 1px solid #E1E7ED;
  }

  .dialog-urge .el-dialog__header span {
    font-size: 14px;
    color: #22262E;
    line-height: 19px;
  }

  .dialog-urge .el-dialog__headerbtn {
    top: 24px;
  }

  .depiction-info .content .content-page .my-el-page .el-pagination__total {
    position: absolute;
    left: 56px;
    bottom: 20px;
    display: none;
  }

  .region-popper {
    min-width: 220px;
    padding: 5px 0;
  }

  .region-scroll {
    height: 246px;
  }

  .region-scroll .el-scrollbar__wrap {
    overflow-x: hidden;
  }

</style>
