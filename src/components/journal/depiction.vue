<template>
  <div class="depiction-info">
    <div class="title">
      <h3>{{title}}</h3>
      <div class="column-select" v-popover:popoverMultiple></div>
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
      <div class="btn-title btn-execl" @click="exportExcel">导出</div>
    </div>
    <div class="content">
      <el-table highlight-current-row :data="tableData" stripe border class="content-table"
        @current-change='currentSelect' v-loading="isTableLoading" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="checkTime" label="巡检时间" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="devName" label="设备名称" show-overflow-tooltip min-width="160"></el-table-column>
        <el-table-column prop="devCategoryName" label="设备类别" show-overflow-tooltip
          v-if="JSON.stringify(multipleSelection).indexOf('设备类别')>-1">
          <template slot-scope="scope">
            <p>{{scope.row.devCategoryName || '-'}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="devTypeName" label="设备类型" show-overflow-tooltip
          v-if="JSON.stringify(multipleSelection).indexOf('设备类型')>-1">
          <template slot-scope="scope">
            <p>{{scope.row.devTypeName || '-'}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="devAreaName" label="所属辖区" v-if="JSON.stringify(multipleSelection).indexOf('所属辖区')>-1">
          <template slot-scope="scope">
            <p>{{scope.row.devAreaName || '-'}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="checkPersonName" label="负责人" show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{scope.row.checkPersonName || '-'}}</p>
          </template>
        </el-table-column>
        <el-table-column label="巡检结果">
          <template slot-scope="scope">
            <p v-if="scope.row.checkResultCode == 'DEVICERESULT02'" class="device-status icon-normal">
              {{scope.row.checkResultName}}</p>
            <p v-else-if="scope.row.checkResultCode == 'DEVICERESULT03'" class="device-status icon-abnormal">
              {{scope.row.checkResultName}}</p>
            <p v-else>{{scope.row.checkResultName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <div class="tab-operation boc-inline" @click="openDialog(scope.row)">查看记录</div>
          </template>
        </el-table-column>
      </el-table>
      <EJ-Paging ref="tableList" id="journal" :totalCount="totalCount" :totalPage="totalPage"
        :queryConditions="queryConditions" :hostName="pageHost" :methodsName="pageMethods"></EJ-Paging>
    </div>
    <el-dialog title="巡检记录" :visible.sync="recordVisible" width='545px' class="dialog-report" :modal="false">
      <div class="dialog-main" style="min-height:300px;">
        <ul>
          <li>巡检时间 <span>{{contentInfo.checkTime}}</span></li>
          <li>负责人员 <span>{{contentInfo.checkPersonName}}</span></li>
          <li>巡检结果 <span>{{contentInfo.checkResultName}}</span></li>
          <li>巡检备注 <span>{{contentInfo.checkMemo || '无'}}</span></li>
        </ul>
        <ul>
          <li>设备编号 <span>{{contentInfo.devId}}</span></li>
          <li>设备名称 <span>{{contentInfo.devName}}</span></li>
          <li>设备类型 <span>{{contentInfo.devTypeName}}</span></li>
          <li>所属辖区 <span>{{contentInfo.devAreaName}}</span></li>
        </ul>
        <ul v-if="recordList.length>0 && false">
          <template v-for="(item, index) in recordList">
            <li :key="index">{{item.name}} <span :class="item.class">{{item.value}}</span></li>
          </template>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Common from "@/assets/js/common.js";
  import Bus from "@/assets/js/bus.js";
  import Request from "@/assets/js/request.js";
  import Paging from "components/common/paging";
  export default {
    components: {
      "EJ-Paging": Paging
    },
    data() {
      return {
        title: "查询结果",
        isTableLoading: false,
        tableData: [],
        totalCount: 0,
        totalPage: 1,
        token: '',
        // 查询条件
        queryConditions: {
          pageSize: 10,
          currentPage: 1,
          CheckRecordInfoId: '',
          devId: '',
          devAreaCode: '',
          devAreaName: '',
          checkPersonCode: '',
          checkPersonName: '',
          devCategoryCode: '',
          devTypeCode: '',
          checkResultCode: '',
          startTime: '',
          endTime: ''
        },
        pageHost: '',
        pageMethods: '',
        contentInfo: {},
        recordVisible: false,
        recordList: [],
        typeTableData: [{
          "name": "设备类别"
        }, {
          "name": "设备类型"
        }, {
          "name": "所属辖区"
        }],
        multipleSelection: [{
          "name": "设备类别"
        }, {
          "name": "设备类型"
        }, {
          "name": "所属辖区"
        }] // 选中需显示的内容

      };
    },
    mounted() {
      this.token = Common.getQueryString("token");
      this.pageHost = this.$config.efoms_HOST;
      this.pageMethods = '/checkRecord/getCheckRecordInfoPage';
      this.selectRepairsInfoPage();
      Bus.$on("queryConditions", value => {
        this.queryConditions = value;
        this.queryConditions.pageSize = this.$refs.tableList.zjPageSize;
        this.$refs.tableList.zjCurrentPage = 1;
        this.selectRepairsInfoPage();
      });
      Bus.$on("page-journal", value => {
        this.tableData = value;
      });
      Bus.$on("page-loading-journal", value => {
        this.isTableLoading = value;
      });
    },
    methods: {
      exportExcel() {
        let host = this.$config.efoms_HOST;
        let method = '/export/exportCheckRecordInfo';
        let obj = JSON.parse(JSON.stringify(this.queryConditions));
        this.$api.getMethod(host, method, obj, this.token).then(res => {
            window.open(res.path);
          })
          .catch(err => {
            Common.printErrorLog(host, method);
            console.log(err);
          });
      },
      selectRepairsInfoPage() {
        this.isTableLoading = true;
        this.$api
          .getMethod(this.pageHost, this.pageMethods, this.queryConditions, this.token)
          .then(res => {
            setTimeout((load) => {
              this.isTableLoading = false;
            }, 500);
            if (res.appCode == 0) {
              this.tableData = res.resultList.result;
              this.totalPage = res.resultList.totalPage;
              this.totalCount = res.resultList.totalCount;
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
      judgeFuc(value, txt1, txt2) {
        let text = '-';
        switch (value) {
          case '1':
            text = txt1;
            break;
          case '2':
            text = txt2;
            break;
          default:
            break;
        }
        return text;
      },
      openDialog(data) {
        console.log(data);
        let arr = [];
        // 网络延迟
        let isDelayInternet = this.judgeFuc(data.isHighResponse, '正常', '高延迟');
        // 网络丢包
        let isHighPackage = this.judgeFuc(data.isHighPackage, '正常', '高丢包率');
        // 网络连接
        let isPingConnect = this.judgeFuc(data.isPingConnect, '在线', '离线');
        // 有无图像
        let isHaveImg = this.judgeFuc(data.isPhotoSuccess, '有', '无');
        // 图像质量
        let imgQuer = '';
        // 实时数据
        let isHaveData = this.judgeFuc(data.isHaveData, '有', '无');
        // 最近上传时间
        let lastTime = '';
        // 数据延迟
        let isDelayData = this.judgeFuc(data.isDelayData, '正常', '延迟');
        // 图片访问
        let imgFangwen = this.judgeFuc(data.isPhotoSuccess, '成功', '失败');
        // 异常车检器个数
        let abnormalNum = '';
        // 异常车检器编号
        let abnormalCode = '';
        // 当前节目
        let nowPrograme = '';

        switch (data.devTypeCode) {
          // 信号机
          case 'REPDEVTYPE01':
            arr = [{
                'name': '网络连接',
                'value': isPingConnect
              },
              {
                'name': '网络丢包',
                'value': isHighPackage
              },
              {
                'name': '网络延迟',
                'value': isDelayInternet
              }
            ];
            break;
            // 视频监控
          case 'REPDEVTYPE02':
            arr = [{
                'name': '网络连接',
                'value': isPingConnect
              },
              {
                'name': '网络丢包',
                'value': isHighPackage
              },
              {
                'name': '网络延迟',
                'value': isDelayInternet
              },
              {
                'name': '有无图像',
                'value': isHaveImg
              },
              {
                'name': '图像质量',
                'value': imgQuer
              }
            ];
            break;
            // 卡口
          case 'REPDEVTYPE03':
            arr = [{
                'name': '网络连接',
                'value': isPingConnect
              },
              {
                'name': '实时数据',
                'value': isHaveData
              },
              {
                'name': '最近上传时间',
                'value': lastTime,
                'class': 'shorter1'
              },
              {
                'name': '数据延迟',
                'value': isDelayData
              },
              {
                'name': '图片访问',
                'value': imgFangwen
              }
            ];
            break;
            // 电子警察
          case 'REPDEVTYPE04':
            arr = [{
                'name': '网络连接',
                'value': isPingConnect
              },
              {
                'name': '实时数据',
                'value': isHaveData
              },
              {
                'name': '最近上传时间',
                'value': lastTime,
                'class': 'shorter1'
              },
              {
                'name': '数据延迟',
                'value': isDelayData
              },
              {
                'name': '图片访问',
                'value': imgFangwen
              }
            ];
            break;
            // 地磁\线圈\微波
          case 'REPDEVTYPE05':
          case 'REPDEVTYPE06':
          case 'REPDEVTYPE07':
            arr = [{
                'name': '网络连接',
                'value': isPingConnect
              },
              {
                'name': '实时数据',
                'value': isHaveData
              },
              {
                'name': '最近上传时间',
                'value': lastTime,
                'class': 'shorter1'
              },
              {
                'name': '数据延迟',
                'value': isDelayData
              },
              {
                'name': '异常车检器个数',
                'value': abnormalNum,
                'class': 'shorter2'
              },
              {
                'name': '异常车检器编号',
                'value': abnormalCode,
                'class': 'shorter2'
              }
            ];
            break;
            // 诱导屏
          case 'REPDEVTYPE08':
            arr = [{
                'name': '网络连接',
                'value': isPingConnect
              },
              {
                'name': '当前节目',
                'value': nowPrograme
              }
            ];
            break;
          default:
            break;
        }
        this.recordList = arr;
        this.recordVisible = true;
      },
      currentSelect(e) {
        if (e) {
          this.contentInfo = e;
        }
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
  @import "../../assets/css/table.css";
  @import "../../assets/css/dialog.css";
  @import "../../assets/css/depiction.css";

  .gesture {
    cursor: pointer;
  }

  .dialog-report .dialog-main {
    margin-top: -30px;
    margin-bottom: -30px;
    padding: 0;
    border-top: 1px solid #EBEFF1;
  }

  .dialog-report .dialog-main {
    font-size: 12px;
    color: #737E84;
  }

  .dialog-report .dialog-main ul {
    display: flex;
    flex-wrap: wrap;
    padding: 15px 0 20px 0;
    border-bottom: 1px solid #EBEFF1;
  }

  .dialog-report .dialog-main ul:last-child {
    border-bottom: 0;
  }

  .dialog-report .dialog-main ul li {
    width: 50%;
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    box-sizing: border-box;
  }

  .dialog-report .dialog-main ul li:nth-child(2n+1) {
    padding-right: 30px;
  }

  .dialog-report .dialog-main ul li:nth-child(2n) {
    padding-left: 30px;
  }

  .dialog-report .dialog-main ul li span {
    display: inline-block;
    width: 156px;
    color: #4F5A64;
  }

  .dialog-report .dialog-main ul li span.shorter1 {
    width: 136px;
  }

  .dialog-report .dialog-main ul li span.shorter2 {
    width: 124px;
  }

</style>
<style>
  @import "../../assets/css/tableHeight.css";

</style>
