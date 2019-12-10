<template>
    <div class="ej-main">
        <EJ-Menu></EJ-Menu>
        <div class="ej-content">
            <div class="ej-content-title">
                <h2>机房设备</h2>
            </div>
            <div class="ej-content-main">
                <el-scrollbar class="ej-content-scrollbar">
                    <div>
                        <div class="base-tabs">
                            <!-- case "SERVERTYPE01": //服务器 -->
                            <!-- case "SERVERTYPE02": //路由器 -->
                            <!-- case "SERVERTYPE03": //交换机 -->
                            <!-- case "SERVERTYPE04": //防火墙 -->
                            <!-- case "SERVERTYPE05": //存储 -->
                            <div class="other-tabs" :class="{'active':serverType=='SERVERTYPE01'}" @click="changeType('SERVERTYPE01')">服务器</div>
                            <div class="other-tabs" :class="{'active':serverType=='SERVERTYPE04'}" @click="changeType('SERVERTYPE04')">防火墙</div>
                            <div class="other-tabs" :class="{'active':serverType=='SERVERTYPE03'}" @click="changeType('SERVERTYPE03')">交换机</div>
                        </div>
                        <div class="base-info">
                            <div class="content">
                                <el-row class="content-row-select">
                                    <el-col :span="7">
                                        <label>设备编号</label>
                                        <el-input v-model="devId" placeholder="请输入" size='mini' class="content-select" clearable></el-input>
                                    </el-col>
                                    <el-col :span="7">
                                        <label>设备名称</label>
                                        <el-input v-model="devName" placeholder="请输入" size='mini' class="content-select" clearable></el-input>
                                    </el-col>
                                    <el-col :span="7">
                                        <label>使用状态</label>
                                        <el-select v-model="selectUseStatus" placeholder="请选择" size='mini' class="content-select" clearable>
                                            <el-option v-for="item in useStatusList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
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
                                        <label>生产厂家</label>
                                        <el-select v-model="factory" placeholder="请选择" size='mini' class="content-select" clearable>
                                            <el-option v-for="item in factorysList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="7">
                                        <label>IP地址</label>
                                        <el-input v-model="devIp" placeholder="请输入" size='mini' class="content-select" clearable></el-input>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                    <div class="depiction-info">
                        <div class="title">
                            <h3>基本信息</h3>
                            <div class="btn-title btn-operation" @click="operateFuc('scrap')">报废</div>
                            <div class="btn-title btn-operation" @click="operateFuc('deact')">停用</div>
                            <div class="btn-title btn-operation" @click="operateFuc('enable')">启用</div>
                            <div class="btn-title btn-operation" @click="operateFuc('detail')">增加</div>
                            <div class="btn-title btn-execl" @click="exportExcel">导出</div>
                        </div>
                        <div class="content">
                            <el-table highlight-current-row :data="tableData" stripe border class="content-table" @current-change='currentSelect' v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                                <el-table-column fixed type="index" label="序号"></el-table-column>
                                <el-table-column fixed label="设备编号" prop="server_id" show-overflow-tooltip></el-table-column>
                                <el-table-column fixed label="设备名称" prop="server_name" show-overflow-tooltip min-width="140"></el-table-column>
                                <el-table-column label="生产厂家" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        {{scope.row.device_manufact}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="IP地址" prop="server_ip" show-overflow-tooltip></el-table-column>
                                <el-table-column label="位置" prop="devIp" show-overflow-tooltip></el-table-column>
                                <el-table-column label="负责人" prop="responsible_person" show-overflow-tooltip></el-table-column>
                                <el-table-column label="最近修改时间" prop="update_time" show-overflow-tooltip min-width="120"></el-table-column>
                                <el-table-column label="使用状态" prop="enable_status_name" show-overflow-tooltip></el-table-column>
                                <el-table-column label="操作" min-width="110">
                                    <template slot-scope="scope">
                                        <!-- <div class="tab-operation boc-inline" @click="gotoDetail(scope.row)">查看</div> -->
                                        <div class="tab-operation boc-inline" @click="openDetail(scope.row)">修改</div>
                                        <div class="tab-operation boc-inline" @click="gotoDetail(scope.row)">删除</div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <EJ-Paging ref="tableList" id="asRoom" :totalCount="totalCount" :totalPage="totalPage" :queryConditions="queryConditions" @pageAsk="selectRepairsInfoPage"></EJ-Paging>
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

                        <el-dialog title="增加" :visible.sync="detailVisible" width="700px" :modal="false">
                            <div class="dialog-urge">
                                <div class="dialog-main">
                                    <div class="dialog-left">
                                        <ul>
                                            <li :class="{'active':activeId==0}" @click="scrollToIndex('0')">基础信息</li>
                                            <li :class="{'active':activeId==1}" @click="scrollToIndex('1')">厂家信息</li>
                                            <li :class="{'active':activeId==2}" @click="scrollToIndex('2')">建设信息</li>
                                            <li :class="{'active':activeId==3}" @click="scrollToIndex('3')">图文信息</li>
                                        </ul>
                                    </div>
                                    <el-scrollbar class="detail-scroll" ref="swrapper">
                                        <div class="d-right">
                                            <h5>基础信息</h5>
                                            <div class="revoke-reason">
                                                <label class="dialog-label"><i>*</i>服务器类型</label>
                                                <el-select v-model="detailInfo.serverSubtype" placeholder="请选择" size='mini' class="dialog-select" clearable @click.native="rightTip=0">
                                                    <el-option v-for="item in useStatusList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                                    </el-option>
                                                </el-select>
                                            </div>
                                            <div class="revoke-reason">
                                                <label class="dialog-label"><i>*</i>管理部门</label>
                                                <el-input v-model="detailInfo.deptName" placeholder="请输入" size='mini' class="dialog-select" clearable @click.native="rightTip=1"></el-input>
                                            </div>
                                            <div class="revoke-reason">
                                                <label class="dialog-label"><i>*</i>服务器名称</label>
                                                <el-input v-model="detailInfo.serverName" placeholder="请输入" size='mini' class="dialog-select" clearable @click.native="rightTip=0"></el-input>
                                            </div>
                                            <div class="revoke-reason">
                                                <label class="dialog-label"><i>*</i>服务器标识</label>
                                                <el-input v-model="detailInfo.ag" placeholder="请输入" size='mini' class="dialog-select" clearable @click.native="rightTip=2"></el-input>
                                            </div>
                                            <div class="revoke-reason">
                                                <label class="dialog-label">IP地址</label>
                                                <el-input v-model="detailInfo.serverIp" placeholder="请输入" size='mini' class="dialog-select" clearable @click.native="rightTip=0"></el-input>
                                            </div>
                                            <div class="revoke-reason">
                                                <label class="dialog-label">所在机房</label>
                                                <el-input v-model="detailInfo.serverRoomId" placeholder="请输入" size='mini' class="dialog-select" clearable @click.native="rightTip=0"></el-input>
                                            </div>
                                            <div class="revoke-reason">
                                                <label class="dialog-label">所在机柜</label>
                                                <el-input v-model="detailInfo.af" placeholder="请输入" size='mini' class="dialog-select" clearable @click.native="rightTip=0"></el-input>
                                            </div>
                                            <div class="revoke-reason">
                                                <label class="dialog-label">启用日期</label>
                                                <el-date-picker v-model="detailInfo.aa" type="date" placeholder="选择日期" class="dialog-date" value-format="yyyy-MM-dd" @click.native="rightTip=0">
                                                </el-date-picker>
                                            </div>
                                            <div class="revoke-reason">
                                                <label class="dialog-label">责任人</label>
                                                <el-input v-model="detailInfo.responsiblePerson" placeholder="请输入" size='mini' class="dialog-select" clearable @click.native="rightTip=0"></el-input>
                                            </div>


                                            <div class="right-tips">
                                                <div class="type1" v-if="rightTip==1">
                                                    <el-input placeholder="部门名称/编码" v-model="factory" size='mini' class="dialog-select" clearable>
                                                        <el-button slot="append" icon="el-icon-search"></el-button>
                                                    </el-input>
                                                    <!-- <div class="tree-btn">
                                                        <a>全部展开</a>
                                                        <a>全部折叠</a>
                                                    </div> -->
                                                    <el-scrollbar class="tree-cont">
                                                        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree>
                                                    </el-scrollbar>
                                                </div>
                                                <div class="type2" v-if="rightTip==2">
                                                    服务器添加时，需要在目标服务器上安装代理程序，此处填写的服务器标识必须与代理程序上面设置一致。每台服务器的标识均不相同，可使用IP地址作为标识！
                                                </div>
                                            </div>
                                        </div>
                                        <div class="d-right">
                                            <h5>厂家信息</h5>
                                            <div class="revoke-reason">
                                                <label class="dialog-label">生产厂家</label>
                                                <el-select v-model="detailInfo.deviceManufact" placeholder="请选择" size='mini' class="dialog-select" clearable @click.native="rightTip=0">
                                                    <el-option v-for="item in factorysList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                                    </el-option>
                                                </el-select>
                                            </div>
                                            <div class="revoke-reason">
                                                <label class="dialog-label">生产日期</label>
                                                <el-date-picker v-model="detailInfo.ab" type="date" placeholder="选择日期" class="dialog-date" value-format="yyyy-MM-dd" @click.native="rightTip=0">
                                                </el-date-picker>
                                            </div>
                                            <div class="revoke-reason">
                                                <label class="dialog-label">品牌</label>
                                                <el-input v-model="detailInfo.deviceBrand" placeholder="请输入" size='mini' class="dialog-select" clearable @click.native="rightTip=0"></el-input>
                                            </div>
                                            <div class="revoke-reason">
                                                <label class="dialog-label">型号</label>
                                                <el-input v-model="detailInfo.deviceModel" placeholder="请输入" size='mini' class="dialog-select" clearable @click.native="rightTip=0"></el-input>
                                            </div>
                                        </div>
                                        <div class="d-right">
                                            <h5>建设信息</h5>
                                            <div class="revoke-reason">
                                                <label class="dialog-label">建设单位</label>
                                                <el-select v-model="detailInfo.ac" placeholder="请选择" size='mini' class="dialog-select" clearable @click.native="rightTip=0">
                                                    <el-option v-for="item in buildssList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                                    </el-option>
                                                </el-select>
                                            </div>
                                            <div class="revoke-reason">
                                                <label class="dialog-label">建设项目</label>
                                                <el-select v-model="detailInfo.buildProject" placeholder="请选择" size='mini' class="dialog-select" clearable @click.native="rightTip=0">
                                                    <el-option v-for="item in projectssList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                                    </el-option>
                                                </el-select>
                                            </div>
                                            <div class="revoke-reason">
                                                <label class="dialog-label">承建单位</label>
                                                <el-input v-model="detailInfo.ad" placeholder="请输入" size='mini' class="dialog-select" clearable @click.native="rightTip=0"></el-input>
                                            </div>
                                            <div class="revoke-reason">
                                                <label class="dialog-label">建设时间</label>
                                                <el-date-picker v-model="detailInfo.ae" type="date" placeholder="选择日期" class="dialog-date" value-format="yyyy-MM-dd" @click.native="rightTip=0">
                                                </el-date-picker>
                                            </div>
                                        </div>
                                        <div class="d-right">
                                            <h5>图文信息</h5>
                                            <el-table :data="fileList" class="file-download">
                                                <el-table-column prop="time" label="上传时间" sortable width="100">
                                                </el-table-column>
                                                <el-table-column prop="name" label="文件名称" sortable width="140">
                                                </el-table-column>
                                                <el-table-column prop="person" label="上传人" sortable width="80">
                                                </el-table-column>
                                                <el-table-column label="操作" width="80">
                                                    <template slot-scope="scope">
                                                        <a class="load-hoverShow" :href="scope.row.FileURL" :download="scope.row.FileName">下载</a>
                                                        <a class="load-hoverShow" @click="delFiles(scope.row)">删除</a>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </div>
                                    </el-scrollbar>
                                </div>
                                <div slot="footer" class="dialog-footer">
                                    <el-button type="primary" @click="saveServerInfo" size='mini' class="submit">确 认</el-button>
                                    <el-button @click="detailVisible=false" size='mini' class="cancel">取 消</el-button>
                                </div>
                            </div>
                        </el-dialog>
                    </div>
                </el-scrollbar>
            </div>


        </div>
    </div>
</template>
<script>
    import Menu from "components/common/menu";
    import Common from "@/assets/js/common.js";
    import Bus from "@/assets/js/bus.js";

    import Paging from "components/common/paging_new";
    import qs from 'qs';
    export default {
        components: {
            "EJ-Menu": Menu,
            "EJ-Paging": Paging,
        },
        data() {
            return {
                token: '',
                serverType: '',
                serverType: 'SERVERTYPE01',
                devId: '',
                devName: '',
                devIp: '',
                factory: '',
                factorysList: [],
                selectUseStatus: '',
                useStatusList: [],
                projectssList: [],
                buildssList: [],
                conditionVisible: false, // 更多条件

                isTableLoading: false,
                tableData: [],
                totalCount: 0,
                totalPage: 1,
                // 查询条件
                queryConditions: {
                    pageSize: 10,
                    currentPage: 1
                },
                baseInfo: {}, // 选中的设备
                reasonScrap: '',
                reasonDiscontinue: '',
                scrapNotes: '',
                detailInfo: {}, // 增加，修改，详情 的数据
                scrapVisible: false, //报废开关
                deactVisible: false, //停用开关
                detailVisible: false, // 增加，修改，详情开关
                activeId: 0,
                scrollRange: [], // 增加，修改的滚动范围（对应滚动左侧激活）
                fileList: [{
                    time: '2019-12-01',
                    name: '你的名字',
                    person: 'admin',
                    FileURL: '',
                    FileName: ''
                }, {
                    time: '2019-12-21',
                    name: '我的名字',
                    person: 'bdmin',
                    FileURL: '',
                    FileName: ''
                }], // 当前设备的图文信息
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                rightTip: 0,
            };
        },
        watch: {},
        mounted() {
            this.token = Common.getQueryString("token");

            this.searchTable();

            // 生产厂家
            this.getDicInfo('DEVICEFACTORY').then(res => {
                if (res.appCode == 0) {
                    this.factorysList = res.resultList || [];
                    window.factorysList = this.factorysList;
                }
            });

            // 使用状态
            this.getDicInfo('DEVICESTATUS').then(res => {
                if (res.appCode == 0) { this.useStatusList = res.resultList || []; }
            });


            // 建设项目
            this.getDicInfo('DEVICEPROJECT').then(res => {
                if (res.appCode == 0) {
                    this.projectssList = res.resultList || [];
                    window.projectssList = this.projectssList;
                }
            });
            // 建设单位
            this.getDicInfo('DEVICECOMPANY').then(res => {
                if (res.appCode == 0) {
                    this.buildssList = res.resultList || [];
                    window.buildssList = this.buildssList;
                }
            });

            this.getDeptTree().then(res => {
                if (res.appCode == 0) {
                    this.treeData = res.resultList || [];
                }
            });
        },
        methods: {
            handleNodeClick(data) {
                if (!data.children || data.children.length == 0) {
                    // if (data) {
                    this.detailInfo.deptName = data.text;
                    this.detailInfo.deptId = data.id;
                }
            },
            changeType(val) {
                this.serverType = val;
                // 清空搜索条件
                this.devId = '';
                this.devName = '';
                this.devIp = '';
                this.selectUseStatus = '';
                this.factory = '';
                this.searchTable();
            },
            getRegionTree(parentCode) {
                return this.$api.getMethod(this.$config.efoms_HOST, '/ubmsService/getRegionTree', { token: this.token, data: JSON.stringify({ regionId: parentCode }) });
            },
            // 数据字典
            getDicInfo(parentCode) {
                return this.$api.getMethod(this.$config.ubms_HOST, '/DeviceDic/getDeviceDic.htm', { token: this.token, data: JSON.stringify({ parentCode: parentCode }) });
            },
            // 数据字典 - 基础信息
            devGetDicInfo(parentCode) {
                return this.$api.getMethod(
                    this.$config.ubms_HOST,
                    '/DeviceDic/getDicInfo.htm', { token: this.token, data: JSON.stringify({ parentCode: parentCode }) }
                );
            },
            // 运维单位
            getOpsDetpTreeInfo() {
                return this.$api.getMethod(this.$config.ubms_HOST, '/OpsDeptInfo/getOpsDetpTree.htm', { token: this.token, data: JSON.stringify({}) });
            },
            // 部门
            getDeptTree(parentCode) {
                return this.$api.getMethod(this.$config.ubms_HOST, "/DeptInfo/getDeptTree.htm", { token: this.token, data: JSON.stringify({ regionId: parentCode }) });
            },
            searchTable() {
                this.queryConditions = {
                    serverType: this.serverType,
                    serverId: this.devId,
                    serverName: this.devName,
                    serverIp: this.devIp,
                    serverStatus: this.selectUseStatus,

                    // devFactory: this.factory,

                    pageSize: 10,
                    currentPage: 1
                };
                this.selectRepairsInfoPage();
            },
            selectRepairsInfoPage() {
                this.isTableLoading = true;
                let host = this.$config.efoms_HOST;
                let method = '/rsms/getRealServerPage';
                this.$api
                    .getMethod(host, method, this.queryConditions, this.token)
                    .then(res => {
                        setTimeout((load) => {
                            this.isTableLoading = false;
                        }, 500);
                        if (res.appCode == 0) {
                            this.tableData = res.resultList.result;
                            this.totalPage = res.resultList.totalPage;
                            this.totalCount = res.resultList.totalCount;
                        } else {
                            Common.printErrorLog(host, method);
                        }
                    })
                    .catch(err => {
                        setTimeout((load) => {
                            this.isTableLoading = false;
                        }, 500);
                        Common.printErrorLog(host, method);
                        console.log(err);
                    });
            },


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
            // 获取修改状态的接口
            getModifyInterface(status) {
                let method = "";
                let obj = {};
                switch (this.baseInfo.serverType) {
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
            // 增加，修改的弹窗左右联动效果，对需要的数据进行处理
            handleScrollData() {
                this.$nextTick(() => {
                    this.scrollRange = [];
                    let list = document.querySelectorAll('.d-right');
                    for (let i = 0; i < list.length; i++) {
                        if (i == 0) {
                            this.scrollRange.push(0);
                        } else {
                            let hi = this.scrollRange[i - 1] + list[i - 1].offsetHeight;
                            this.scrollRange.push(hi);
                        }
                    }
                    console.log(this.scrollRange);

                    let _this = this;
                    let scrollbarEl = this.$refs.swrapper.wrap;
                    scrollbarEl.onscroll = function() {
                        // 注释为节流方法，后期考虑性能可增加，感觉效果不太明显，懒得加了
                        //         var timer = null;                
                        //         var context = this;               
                        //         var args = arguments; 
                        //         if (!timer) {                    
                        //         timer = setTimeout(function() {
                        //                 func.apply(context, args);
                        //                 timer = null;
                        //         }, 300);                
                        //         }            
                        let arr = _this.scrollRange;
                        for (let i = 0; i < arr.length - 1; i++) {
                            if (scrollbarEl.scrollTop >= arr[i] && scrollbarEl.scrollTop < arr[i + 1]) {
                                _this.activeId = i;
                            }
                        }
                    }
                });
            },
            operateFuc(type) {
                let url;
                if (type == 'detail') {
                    this.detailVisible = true;
                    this.handleScrollData();
                } else if (JSON.stringify(this.baseInfo) == "{}") {
                    return this.$message.error('请先选择一条数据');
                }
                switch (type) {
                    case 'scrap':
                        this.scrapVisible = true;
                        break;
                    case 'deact':
                        this.deactVisible = true;
                        break;
                    case 'enable':
                        this.submitStutusChange('DEVICESTATUS01');
                        break;
                    default:
                        break;
                }
            },
            gotoDetail(obj) {
                let url = this.$config.ProjectName + "/tfdet.html?token=" + this.token;
                // sessionStorage.setItem('indexIframe', url);
                sessionStorage.setItem('tfDetailInfo', JSON.stringify(obj));
                window.location.href = url;
            },
            currentSelect(e) {
                if (e) {
                    this.baseInfo = e;
                } else {
                    this.baseInfo = {};
                }
            },


            scrollToIndex(index) {
                this.activeId = index;
                this.$refs.swrapper.wrap.scrollTop = this.scrollRange[index];
            },
            delFiles(e) {
                let host = this.$config.efoms_HOST;
                let method = '/AssentFileInfo/deleteAssentFileInfo';
                let obj = {
                    fileId: e.fileId
                };
                this.$api.getMethod(host, method, obj, this.token).then(res => {
                        if (res.appCode == 0) {

                        } else {
                            Common.printErrorLog(host, method);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(host, method);
                        console.log(err);
                    });
            },
            openDetail(val) {
                let obj = val || {};
                this.detailInfo = {
                    serverId: obj.server_id,
                    serverName: obj.server_name,
                    serverIp: obj.server_ip,
                    serverType: obj.server_type || this.serverType,
                    serverTypeName: obj.server_type_name,
                    serverSubtype: obj.server_subtype,
                    serverRoomId: obj.server_room_id,
                    responsiblePerson: obj.responsible_person,
                    // enableStatus: obj.enable_status,
                    deviceBrand: obj.device_brand,
                    deviceManufact: obj.device_manufact,
                    deviceModel: obj.device_model,
                    deptId: obj.dept_id,
                    deptName: obj.dept_name,
                    buildProject: obj.build_project,
                };
                this.detailVisible = true;
                this.handleScrollData();
            },
            saveServerInfo() {
                let host = this.$config.efoms_HOST + '';
                let method = this.detailInfo.serverId ? '/rsms/server/updateServerInfo' : '/rsms/server/insertServerInfo';
                this.$api.getMethod(host, method, this.detailInfo, this.token).then(res => {
                        if (res.appCode == 0) {
                            this.selectRepairsInfoPage();
                        } else {
                            Common.printErrorLog(host, method);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(host, method);
                        console.log(err);
                    });
            }
        },
    };
</script>
<style scoped>
    @import "../../assets/css/main.css";
    @import "../../assets/css/select.css";
    @import "../../assets/css/baseInfo.css";
    @import "../../assets/css/table.css";
    @import "../../assets/css/dialog.css";
    @import "../../assets/css/depiction.css";

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

    .base-info .content-icon {
        position: absolute;
        width: 28px;
        height: 28px;
        background: url('../../assets/images/icon-arrow-double.png') no-repeat center/100%;
        cursor: pointer;
        ;
        left: -38px;
    }

    .base-info .content-icon.active {
        transform: rotate(90deg);
    }

    .relative {
        position: relative;
    }

    .gesture {
        cursor: pointer;
    }

    .dialog-urge .dialog-main {
        margin-top: -30px;
        padding: 10px 0 20px;
        border-top: 1px solid #ebeff1;
        position: relative;
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

    .dialog-urge .dialog-left {
        position: absolute;
        left: 0;
        top: 10px;
        width: 60px;
        height: 400px;
        border-right: 1px solid #ebeff1;
        font-size: 12px;
        z-index: 2;
    }

    .dialog-urge .dialog-left li {
        padding: 5px 0;
        cursor: pointer;
    }

    .dialog-urge .dialog-left li.active {
        color: #459C9C;
    }

    .dialog-urge .detail-scroll {
        padding-left: 80px;
        height: 400px;
    }

    .dialog-urge .detail-scroll .d-right {
        position: relative;
    }

    .dialog-urge .detail-scroll .d-right .right-tips {
        position: absolute;
        right: 0;
        top: 35px;
        width: 240px;
        /* background: #758087; */
        font-size: 12px;
    }

    .dialog-urge .detail-scroll .d-right .right-tips .dialog-select {
        width: 240px;
    }

    .dialog-urge .detail-scroll .d-right .right-tips .tree-btn {
        margin-top: 10px;
    }

    .dialog-urge .detail-scroll .d-right .right-tips .tree-btn a {}

    .dialog-urge .detail-scroll .d-right .right-tips .tree-cont {
        margin-top: 10px;
        height: 320px;
    }

    .dialog-urge .detail-scroll .d-right .right-tips .tree-cont>>>.el-tree-node__label {
        font-size: 12px;
    }

    .dialog-urge .detail-scroll .d-right .right-tips .tree-cont>>>.el-scrollbar__wrap {
        margin-bottom: 0;
    }

    .dialog-urge .detail-scroll .dialog-date>>>.el-input__inner,
    .dialog-urge .detail-scroll .dialog-date>>>.el-input__icon {
        height: 28px;
        line-height: 28px;
        font-size: 12px;
    }

    .dialog-urge .detail-scroll .dialog-date>>>.el-input__suffix {
        border-left: none;
    }

    .dialog-urge .detail-scroll h5 {
        color: #459C9C;
        border-bottom: 1px solid #ebeff1;
        padding-bottom: 5px;
        margin-bottom: 10px;
    }

    .dialog-urge .detail-scroll .dialog-label {
        width: 70px;
        margin-left: 10px;
    }

    .dialog-urge .detail-scroll .dialog-label i {
        position: relative;
        left: 0;
    }

    .dialog-urge .detail-scroll .dialog-select {
        width: 220px;
    }

    .dialog-urge .dialog-main .revoke-reason {
        margin-bottom: 0;
        padding-bottom: 13px;
    }

    .dialog-urge .dialog-main .file-download {
        width: 400px;
    }

    .dialog-urge .dialog-main .file-download a.load-hoverShow {
        /* margin-left: 20px; */
        /* display: none; */
        cursor: pointer;
        color: #333;
        text-decoration: none;
    }

    .dialog-urge .dialog-main .file-download a.load-hoverShow+a.load-hoverShow {
        margin-left: 7px;
    }

    .dialog-urge .dialog-main>>>.el-table .cell {
        font-size: 12px;
        color: #606266;
    }
</style>
<style>
    @import "../../assets/css/tableHeight.css";

    .ej-content-scrollbar {
        height: 100%;
    }

    .ej-content-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>