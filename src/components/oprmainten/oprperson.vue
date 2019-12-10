<template>
  <div class="ej-main">
    <div class="ej-content">
      <div class="ej-content-title">
        <h2>{{title}}</h2>
      </div>
      <div class="ej-content-main">
        <el-scrollbar class="ej-content-scrollbar">
          <div class="base-info">
            <div class="content">
              <el-row class="content-row-select">
                <el-col :span="5">
                  <label>人员名称</label>
                  <el-input v-model="personName" placeholder="可部分名称" size='mini' class="content-select" clearable></el-input>
                </el-col>
                <el-col :span="5">
                  <label>人员类型</label>
                  <el-select v-model="personType" filterable placeholder="可部分名称" size='mini' clearable>
                    <el-option
                      v-for="item in personTypeList"
                      :key="item.dicCode"
                      :label="item.dicName"
                      :value="item.dicCode">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <label>人员状态</label>
                  <el-select v-model="personStatu" filterable placeholder="可部分名称" size='mini' clearable>
                    <el-option
                      v-for="item in personStatuList"
                      :key="item.dicCode"
                      :label="item.dicName"
                      :value="item.dicCode">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <label>所属部门</label>
                  <el-select v-model="topDept" filterable placeholder="可部分名称" size='mini' clearable>
                    <el-option
                      v-for="item in topDeptList"
                      :key="item.opsDeptId"
                      :label="item.opsDeptName"
                      :value="item.opsDeptId">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="2">
                  <div class="relative">
                    <div class="content-search" @click="searchTable">
                      <p>查询</p>
                    </div>
                  </div>
                </el-col>
                <el-col :span="2">
                  <div class="relative">
                    <div class="content-search content-reset" @click="resetTable">
                      <p>重置</p>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="depiction-info">
            <div class="title">
              <h3>{{title2}}</h3>
              <div class="btn-title btn-operation" @click="operateFuc('view')">查看</div>
              <div class="btn-title btn-operation" @click="operateFuc('add')">添加</div>
              <div class="btn-title btn-operation" @click="operateFuc('modify')">修改</div>
              <div class="btn-title btn-operation" @click="operateFuc('delete')">删除</div>
            </div>
            <div class="content">
              <el-table highlight-current-row :data="tableData" stripe border class="content-table" @row-click='currentSelect' v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                <el-table-column fixed type="index" label="序号"></el-table-column>
                <el-table-column fixed label="姓名" prop="opsPersonName" show-overflow-tooltip></el-table-column>
                <el-table-column fixed label="性别" prop="genderName" show-overflow-tooltip></el-table-column>
                <el-table-column label="人员类型" prop="personTypeName" show-overflow-tooltip></el-table-column>
                <el-table-column label="岗位" prop="post" show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" prop="statusName" show-overflow-tooltip></el-table-column>
                <el-table-column label="所属单位" prop="opsDeptName" show-overflow-tooltip></el-table-column>
                <el-table-column label="责任警员" prop="dutyPolice" show-overflow-tooltip></el-table-column>
                <el-table-column label="联系电话" prop="phone" show-overflow-tooltip></el-table-column>
                <el-table-column label="邮箱地址" prop="email" show-overflow-tooltip></el-table-column>
                <el-table-column label="地址" prop="addr" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" prop="buildTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="录入人" prop="inputer" show-overflow-tooltip></el-table-column>
              </el-table>
              <EJ-Paging ref="tableList" :id="id" :totalCount="totalCount" :totalPage="totalPage" :queryConditions="queryConditions" :hostName="pageHost" :methodsName="pageMethods"></EJ-Paging>
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
import Paging from "components/common/paging";
import qs from 'qs';
// import oprdialog from "./oprdialog.vue"
export default {
  components: {
    "EJ-Paging": Paging,
    // "oprdialog": oprdialog
  },
  data() {
    return {
      title: "运维人员",
      title2: '运维人员信息',
      token: '',
      departName: '',
      topDept: '',
      topDeptList: [],
      tableData: [],
      isTableLoading: false,
      totalCount: 0,
      totalPage: 1,
      queryConditions: {
        pageSize: 10,
        currentPage: 1,
        opsPersonName: '',
        personTypeCode: '',
        statusCode: '',
        opsDeptId: ''
      },
      pageHost: '',
      pageMethods: '',
      baseInfo: {},
      oprTitle: '',
      currentIndex: 0,
      personTypeList: [],
      personStatuList: [],
      personType: '',
      personStatu: '',
      personName: '',
      topDept: '',
      id: 'tfequ'
    };
  },
  watch: {
    tableData(val) {
        this.tableData = val
    },
    isTableLoading(val) {
        this.isTableLoading = val
    }
  },
  mounted() {
    let that = this
    this.token = this.$token
    this.pageHost = this.$config.ubms_HOST
    this.pageMethods = '/ubms-server/OpsPerson/getPageOpsPersonInfo.htm'
    this.getPreSelect()
    this.searchTable()
    Bus.$on('page-tfequ', function(val) {
        this.tableData = val
        that.tableData = val
    })
    Bus.$on('page-loading-tfequ', function(val) {
        this.isTableLoading = val
        that.isTableLoading = val
    })
  },
  methods: {
    getQueryString(name) {
      let token = window.location.href.split('=')[1]
      return token ? token : null
    },
    searchTable() {
      this.isTableLoading = true;
      let apiName = this.pageHost + this.pageMethods
      this.queryConditions = {
        pageSize: this.queryConditions.pageSize,
        currentPage: this.queryConditions.currentPage,
        opsPersonName: this.personName,
        personTypeCode: this.personType,
        statusCode: this.personStatu,
        opsDeptId: this.topDept
      }
      let data = {
        token: this.token,
        data: JSON.stringify(this.queryConditions)
      };
      this.$api
        .get(apiName, data)
        .then(res => {
          setTimeout((load) => {
            this.isTableLoading = false;
          }, 500);
          if (res.appCode === '0') {
            res.resultList.rows.forEach(ele => {
              ele.buildTime = this.standard2NormalTime(ele.buildDate)
              ele.updateTime = this.standard2NormalTime(ele.updateDate)
            })
            this.tableData = res.resultList.rows
            this.totalPage = res.resultList.totalPage;
            this.totalCount = res.resultList.total;
          } else {
            Common.printErrorLog(this.pageHost, this.pageMethods);
          }
        })
        .catch(err => {
          setTimeout((load) => {
            this.isTableLoading = false;
          }, 500);
          Common.printErrorLog(this.pageHost, this.pageMethods);
          console.log(err);
        });
    },
    resetTable() {
      this.personName = ''
      this.personType = ''
      this.personStatu = ''
      this.topDept = ''
    },
    operateFuc(type) {
      let url;
      if (JSON.stringify(this.baseInfo) == "{}" && type != "add") {
        return this.$message.warning('请先选择一条数据');
      }
      switch (type) {
        case 'view':
          sessionStorage.setItem('_row', JSON.stringify(this.baseInfo))
          this.$router.push({ path: '/personview' })
          break;
        case 'add':
          this.$router.push({ path: '/personadd' })
          break;
        case 'modify':
          sessionStorage.setItem('_row', JSON.stringify(this.baseInfo))
          this.$router.push({ path: '/personmodify' })
          break;
        case 'delete':
          this.deleteCurrent()
          break;
        default:
          return;
      }
    },
    deleteCurrent() {
      let that = this
      this.$msgbox({
        title: '提示',
        message: '删除后不可撤销！',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '删除中...';
            let apiName = this.$config.ubms_HOST + '/ubms-server/OpsPerson/removeOpsPersonInfo.htm?token=' + this.token
            let data = {
              data: JSON.stringify(this.baseInfo)
            };
            this.$api
              .post(apiName, qs.stringify(data), { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" })
              .then(res => {
                done()
                instance.confirmButtonLoading = false;
                if (res.appCode === '0' && res.resultList === 1) {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  this.searchTable()
                } else {
                  this.$message({
                    type: 'error',
                    message: '删除失败'
                  });
                  console.log('/ubms-server/OpsPerson/removeOpsPersonInfo.htm出错');
                }
              })
              .catch(err => {
                done()
                instance.confirmButtonLoading = false;
                this.$message.error('删除失败!')
                console.log(err);
              });
          } else {
            done();
          }
        }
      }).then().catch()
    },
    currentSelect(e) {
      this.currentIndex = 0;
      if (e) {
        this.baseInfo = e;
      } else {
        this.baseInfo = {};
      }
    },
    standard2NormalTime(dd, separator) {
      /**
       * 标准日期对象格式转普通字符串格式日期
       * @param dt{Object}:         标准日期对象格式
       * @param separator{String}:  分隔符
       */
      let dt = new Date(dd)
      separator = separator || '-';
      if (!dt) return;
      var y = dt.getFullYear(); //年
      var m = dt.getMonth() + 1; //月
      var d = dt.getDate(); //日
      // var h = dt.getHours(); //时
      // var f = dt.getMinutes(); //分
      // var s = dt.getSeconds(); //秒
      // var r = y + separator + (m < 10 ? '0' + m : m) + separator + (d < 10 ? '0' + d : d) + ' ' + (h < 10 ? '0' + h : h) + ':' + (f < 10 ? '0' + f : f) + ':' + (s < 10 ? '0' + s : s);
      var r = y + separator + (m < 10 ? '0' + m : m) + separator + (d < 10 ? '0' + d : d)
      return r;
    },
    getPreSelect() {
      {
        let apiName = this.$config.ubms_HOST + '/ubms-server/PublicDic/getDicInfo.htm'
        let param = {"parentCode":"OPSPERSONSTATUS"}
        let data = {
          token: this.token,
          data: JSON.stringify(param)
        };
        this.$api
          .get(apiName, data)
          .then(res => {
            if (res.appCode === '0') {
              this.personStatuList = res.resultList
            } else {
              console.log('/ubms-server/PublicDic/getDicInfo.htm出错');
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      {
        let apiName = this.$config.ubms_HOST + '/ubms-server/PublicDic/getDicInfo.htm'
        let param = {"parentCode":"OPSPERSONTYPE"}
        let data = {
          token: this.token,
          data: JSON.stringify(param)
        };
        this.$api
          .get(apiName, data)
          .then(res => {
            if (res.appCode === '0') {
              this.personTypeList = res.resultList
            } else {
              console.log('/ubms-server/OpsDeptInfo/getOpsDeptInfo.htm出错');
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      {
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
              this.topDeptList = res.resultList
            } else {
              console.log('/ubms-server/OpsDeptInfo/getOpsDeptInfo.htm出错');
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
  }
}

</script>
<style lang="less" scoped>
@import "../../assets/css/main.css";
@import "../../assets/css/baseInfo.css";
@import "../../assets/css/table.css";
@import "../../assets/css/depiction.css";

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
/deep/ .content-select {
  width: 150px!important;
}
/deep/ .content-row-select .el-select {
  width: 150px;
}

</style>
