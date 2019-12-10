<template>
    <div class="depiction-info">
        <div class="title">
            <h3>{{title}}</h3>
            <!-- <div class="btn-title btn-operation" @click="operateFuc('add')">添加</div>
        <div class="btn-title btn-operation" @click="operateFuc('edit')">修改</div> -->
            <!-- <div class="btn-title btn-operation" @click="operateFuc('allocation')">调拨</div>
            <div class="btn-title btn-operation" @click="operateFuc('transfer')">转移</div> -->
            <div class="btn-title btn-operation" @click="operateFuc('scrap')">报废</div>
            <div class="btn-title btn-operation" @click="operateFuc('deact')">停用</div>
            <div class="btn-title btn-operation" @click="operateFuc('enable')">启用</div>
            <div class="btn-title btn-operation" @click="operateFuc('normal')">正常</div>
            <div class="column-select" v-popover:popoverMultiple></div>
            <el-popover ref="popoverMultiple" placement="left" title="选择可见内容" popper-class="table-list-popver" trigger="click" @after-enter="initMultiple">
                <el-table ref="multipleTable" :data="typeTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="name" label="类别">
                    </el-table-column>
                </el-table>
            </el-popover>
            <div class="btn-title btn-execl" @click="exportExcel">导出</div>
        </div>
        <div class="content">
            <el-table highlight-current-row :data="tableData" stripe border class="content-table" @current-change='currentSelect' v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                <el-table-column fixed type="index" label="序号"></el-table-column>
                <el-table-column fixed label="设备编号" prop="devId" show-overflow-tooltip></el-table-column>
                <el-table-column fixed label="设备名称" prop="devName" show-overflow-tooltip min-width="140"></el-table-column>
                <el-table-column label="所属辖区" prop="devAreaName" show-overflow-tooltip></el-table-column>
                <el-table-column label="生产厂家" prop="devFactory" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.devFactory|sceneCtoN}}
                    </template>
                </el-table-column>
                <el-table-column label="建设日期" prop="devBuildDate" show-overflow-tooltip></el-table-column>
                <el-table-column label="维护单位" prop="devDeptName" show-overflow-tooltip></el-table-column>
                <el-table-column label="IP地址" prop="devIp" show-overflow-tooltip></el-table-column>
                <el-table-column label="设备状态" prop="devStatusName" show-overflow-tooltip></el-table-column>
                <el-table-column label="维修状态" prop="repStatusName" show-overflow-tooltip v-if="JSON.stringify(multipleSelection).indexOf('维修状态')>-1"></el-table-column>
                <el-table-column label="使用状态" prop="deviceStatusName" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column label="最后更新时间" prop="lastCheckTime" show-overflow-tooltip min-width="140"></el-table-column> -->
                <el-table-column label="操作" min-width="110">
                    <template slot-scope="scope">
                        <div class="tab-operation boc-inline" @click="gotoDetail(scope.row)">查看</div>
                    </template>
                </el-table-column>
            </el-table>
            <EJ-Paging ref="tableList" id="tfequ" :totalCount="totalCount" :totalPage="totalPage" :queryConditions="queryConditions" :hostName="pageHost" :methodsName="pageMethods"></EJ-Paging>
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
                        <div class="dialog-tips">注：请确认设备不在报修、维修状态。</div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitStutusChange('DEVICESTATUS02')" size='mini' class="submit">确 认</el-button>
                    <el-button @click="deactVisible=false" size='mini' class="cancel">取 消</el-button>
                </div>
            </div>
        </el-dialog>
        <DialogTransfer title="资产调拨" type="allocation" :visible.sync="allocationVisible"></DialogTransfer>
        <DialogTransfer title="资产转移" type="transfer" :visible.sync="transferVisible"></DialogTransfer>
    </div>
</template>
<script>
    import Common from "@/assets/js/common.js";
    import Bus from "@/assets/js/bus.js";
    import Request from "@/assets/js/request.js";
    import Paging from "components/common/paging";
    import DialogRepair from "components/common/dialog-repair";
    import DialogPassing from "components/common/dialog-passing";
    import DialogTransfer from "components/common/dialog-transfer";
    import qs from 'qs';
    export default {
        components: {
            "EJ-Paging": Paging,
            DialogTransfer
        },
        filters: {
            sceneCtoN(val, data) {
                let arr = window['factorysList'] || [];
                let str = '';
                let kv = arr.filter(item => (val != null && (item.dicCode == val || item.id == val))) || [];
                if (kv.length > 0) {
                    str = kv[0].dicName || kv[0].text;
                }
                return str || val || '--';
            }
        },
        data() {
            return {
                title: "查询结果",
                isTableLoading: false,
                tableData: [],
                totalCount: 0,
                totalPage: 1,
                token: '',
                currentIndex: 0,
                // 查询条件
                queryConditions: {
                    pageSize: 10,
                    currentPage: 1
                },
                pageHost: '',
                pageMethods: '',
                baseInfo: {},
                reasonScrap: '',
                reasonDiscontinue: '',
                scrapNotes: '',
                scrapVisible: false,
                deactVisible: false,
                typeTableData: [{ "name": "维修状态" }],
                multipleSelection: [{ "name": "维修状态" }], // 选中需显示的内容

                transferVisible: false,
                allocationVisible: false
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.pageHost = this.$config.efoms_HOST;
            this.pageMethods = '/deviceDetail/selectAssetDevicePage';
            this.queryConditions.devTypeCode = sessionStorage.getItem('tfEquType') || 'REPDEVTYPE01';
            this.selectRepairsInfoPage();
            Bus.$on("queryConditions", value => {
                this.queryConditions = value;
                this.queryConditions.pageSize = this.$refs.tableList.zjPageSize;
                this.$refs.tableList.zjCurrentPage = 1;
                this.selectRepairsInfoPage();
            });
            Bus.$on("page-tfequ", value => {
                this.tableData = value;
            });
            Bus.$on("page-loading-tfequ", value => {
                this.isTableLoading = value;
            });


            // 生产厂家
            this.getDicInfo('DEVICEFACTORY').then(res => {
                if (res.appCode == 0) {
                    window.factorysList = res.resultList || [];
                }
            });
        },
        methods: {
            exportExcel() {
                let host = this.$config.efoms_HOST;
                let method = '/export/exportDeviceInfo';
                let obj = JSON.parse(JSON.stringify(this.queryConditions));
                this.$api.getMethod(host, method, obj, this.token).then(res => {
                        window.open(res.path);
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
                            this.selectRepairsInfoPage();
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
                            this.selectRepairsInfoPage();
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
                            this.selectRepairsInfoPage();
                        });
                        break;
                    default:
                        break;
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
            // 获取修改状态的接口
            getModifyInterface(status) {
                let method = "";
                let obj = {};
                switch (this.baseInfo.devTypeCode) {
                    case "REPDEVTYPE01": // 信号机
                        method = '/SignalSiteInfo/editSignalSiteInfo.htm';
                        obj.ssId = this.baseInfo.devId;
                        obj.deviceStatusCode = status;
                        break;
                    case "REPDEVTYPE02": // 视频监控
                        method = '/VideoSiteInfo/editVideoSiteInfo.htm';
                        obj.vdSiteId = this.baseInfo.devId;
                        obj.deviceStatusCode = status;
                        break;
                    case "REPDEVTYPE08": // 诱导屏
                        method = '/LedInfoController/editLedInfo.htm';
                        obj.ledId = this.baseInfo.devId;
                        obj.deviceStatusCode = status;
                        break;
                    case "REPDEVTYPE03": // 卡口
                    case "REPDEVTYPE04": // 电子警察
                        method = '/OffsiteInfo/editOffsiteInfo.htm';
                        obj.offsiteId = this.baseInfo.devId;
                        obj.osstatusCode = status;
                        break;
                    case "REPDEVTYPE05": // 地磁
                    case "REPDEVTYPE06": // 线圈
                    case "REPDEVTYPE07": // 微波
                        method = '/TrFlowInfoController/editTrFlowDevInfo.htm';
                        obj.trfDevId = this.baseInfo.devId;
                        obj.deviceStatusCode = status;
                        break;
                    default:
                        break;
                }
                return { 'method': method, 'object': obj };
            },
            operateFuc(type) {
                let url;
                if (JSON.stringify(this.baseInfo) == "{}") {
                    return this.$message.error('请先选择一条数据');
                }
                switch (type) {
                    case 'add':
                        url = this.$config.ProjectName + "/tfedit.html?token=" + this.token + "&devId=" + this.baseInfo.devId + "&devTypeCode=" + this.baseInfo.devTypeCode + "&type=onlyread";
                        // sessionStorage.setItem('indexIframe', url);
                        window.location.href = url;
                        break;
                    case 'edit':
                        url = this.$config.ProjectName + "/tfedit.html?token=" + this.token + "&devId=" + this.baseInfo.devId + "&devTypeCode=" + this.baseInfo.devTypeCode + "&type=onlyread";
                        // sessionStorage.setItem('indexIframe', url);
                        window.location.href = url;
                        break;
                    case 'scrap':
                        this.scrapVisible = true;
                        break;
                    case 'deact':
                        this.deactVisible = true;
                        break;
                    case 'allocation':
                        this.allocationVisible = true;
                        break;
                    case 'transfer':
                        this.transferVisible = true;
                        break;
                    case 'enable':
                        this.submitStutusChange('DEVICESTATUS01');
                        break;
                    case 'normal':
                        let host = this.$config.efoms_HOST;
                        let method = '/devStatus/updateDevStatusInfo';
                        let obj = {
                            devId: this.baseInfo.devId,
                            devTypeCode: this.baseInfo.devTypeCode,
                            devStatusCode: 'DEVICEALLSTATUS01',
                            devStatusName: '正常',
                            devCategoryCode: Common.getDevCategory().code
                        };
                        this.$api.putMethod(host, method, obj, this.token, "noContentType").then(res => {
                                if (res.appCode == 0) {
                                    this.selectRepairsInfoPage();
                                    // this.tableData[this.currentIndex].devStatusCode = 'DEVICEALLSTATUS01';
                                    // this.tableData[this.currentIndex].devStatusName = '正常';
                                    // this.baseInfo.devStatusCode = 'DEVICEALLSTATUS01';
                                    // this.baseInfo.devStatusName = '正常';
                                } else {
                                    Common.printErrorLog(host, method);
                                }
                            })
                            .catch(err => {
                                Common.printErrorLog(host, method);
                                console.log(err);
                            });
                        break;
                    default:
                        break;
                }
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
            gotoDetail(obj) {
                let url = this.$config.ProjectName + "/tfdet.html?token=" + this.token;
                // sessionStorage.setItem('indexIframe', url);
                sessionStorage.setItem('tfDetailInfo', JSON.stringify(obj));
                window.location.href = url;
            },
            currentSelect(e) {
                this.currentIndex = 0;
                if (e) {
                    this.baseInfo = e;
                } else {
                    this.baseInfo = {};
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
            },
            // 列表显示处理--end
            // 数据字典
            getDicInfo(parentCode) {
                return this.$api.getMethod(this.$config.ubms_HOST, '/DeviceDic/getDeviceDic.htm', { token: this.token, data: JSON.stringify({ parentCode: parentCode }) });
            },
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

    .dialog-urge .dialog-main {
        margin-top: -30px;
        padding: 10px 0 20px;
        border-top: 1px solid #ebeff1;
    }

    .dialog-urge .dialog-main .dialog-select {
        width: 300px;
        box-sizing: border-box;
    }

    .dialog-urge .dialog-main .dialog-content {
        width: 300px;
        box-sizing: border-box;
        border: none;
    }

    .dialog-urge .dialog-main .dialog-label i {
        position: absolute;
        color: #f90404;
        left: -7px;
    }

    .dialog-urge .dialog-main .dialog-tips {
        font-size: 12px;
        color: #999999;
        min-height: 100px;
    }

    .dialog-urge .dialog-main>>>.el-textarea__inner {
        height: 134px;
        background: #f9fafc;
    }
</style>
<style>
    @import "../../assets/css/tableHeight.css";
</style>