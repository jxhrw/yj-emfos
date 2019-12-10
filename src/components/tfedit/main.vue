<template>
    <div class="ej-main">
        <EJ-Menu></EJ-Menu>
        <div class="ej-content">
            <div class="ej-content-title">
                <h2>{{title}}</h2>
                <div class="ej-content-black" @click="goBack">
                    <p>返回</p>
                </div>
            </div>
            <div class="ej-content-main">
                <el-scrollbar class="ej-content-scrollbar">
                    <div class="base-info">
                        <div class="base-attribute">
                            <div class="title">
                                <h3>编码属性</h3>
                            </div>
                            <div class="content">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span><i>*</i>设备编号</span></label>
                                        <el-input v-model="devId" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span><i>*</i>设备类型</span></label>
                                        <el-select v-model="selectDevcategory" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in devcategoryList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span><i>*</i>设备名称</span></label>
                                        <el-input v-model="devName" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span><i>*</i>所属辖区</span></label>
                                        <el-input v-if="isReadonly" v-model="selectRegion" placeholder="" size='mini' class="content-select" clearable readonly :disabled="isReadonly"></el-input>
                                        <el-popover v-else highlight-current popper-class="region-popper" ref="popoverSelectRegion" placement="bottom-start" trigger="click" v-model="selectRegionVisible">
                                            <el-input v-model="selectRegion" placeholder="" size='mini' class="content-select" clearable readonly v-popover:popoverSelectRegion slot="reference"></el-input>
                                            <el-scrollbar class="region-scroll">
                                                <el-tree id="selectRegion" :data="regionList" accordion :props="defaultProps" @node-click="handleNodeRegionClick"></el-tree>
                                            </el-scrollbar>
                                        </el-popover>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="base-attribute">
                            <div class="title">
                                <h3>运维状态</h3>
                            </div>
                            <div class="content">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span><i>*</i>维护单位</span></label>
                                        <el-select v-model="selectSafeguardUnit" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in safeguardUnitList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span><i>*</i>质保期</span></label>
                                        <el-date-picker v-model="warranty" type="date" placeholder="" size='mini' class="content-date" :disabled="isReadonly">
                                        </el-date-picker>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span><i>*</i>使用年限</span></label>
                                        <el-input v-model="serviceLife" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>维护日期</span></label>
                                        <el-date-picker v-model="maintenanceDate" type="date" placeholder="" size='mini' class="content-date" :disabled="isReadonly">
                                        </el-date-picker>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>维护周期</span></label>
                                        <el-input v-model="maintenanceCycle" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span><i>*</i>下次维护日期</span></label>
                                        <el-date-picker v-model="nextMaintenanceDate" type="date" placeholder="" size='mini' class="content-date" :disabled="isReadonly">
                                        </el-date-picker>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="base-attribute">
                            <div class="title">
                                <h3>厂家信息</h3>
                            </div>
                            <div class="content">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>品牌</span></label>
                                        <el-select v-model="brand" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in brandList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                        <!-- <el-input v-model="brand" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input> -->
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span><i>*</i>生产厂家</span></label>
                                        <el-select v-model="factory" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in factoryList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>设备型号</span></label>
                                        <el-input v-model="devType" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>建设单位</span></label>
                                        <el-select v-model="projectUnit" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in projectUnitList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="base-attribute">
                            <div class="title" @click="showInfoVisible('buildInfoVisible')">
                                <h3>建设信息</h3>
                                <div class="content-icon" :class="{'active':buildInfoVisible}"></div>
                            </div>
                            <div class="content" v-show="buildInfoVisible">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>建设项目</span></label>
                                        <el-select v-model="buildingProjects" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in buildingProjectsList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>建设期数</span></label>
                                        <el-input v-model="buildingNum" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span><i>*</i>建设日期</span></label>
                                        <el-date-picker v-model="buildingDate" type="date" placeholder="" size='mini' class="content-date" :disabled="isReadonly">
                                        </el-date-picker>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>验收日期</span></label>
                                        <el-date-picker v-model="checkDate" type="date" placeholder="" size='mini' class="content-date" :disabled="isReadonly">
                                        </el-date-picker>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="base-attribute">
                            <div class="title" @click="showInfoVisible('locationInfoVisible')">
                                <h3>位置信息</h3>
                                <div class="content-icon" :class="{'active':locationInfoVisible}"></div>
                            </div>
                            <div class="content" v-show="locationInfoVisible">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>所属道路</span></label>
                                        <el-select v-model="selectRoad" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in roadList" :key="item.roadId" :label="item.roadName" :value="item.roadId">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>所属路段</span></label>
                                        <el-select v-model="selectRoadSection" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in roadSectionList" :key="item.blockId" :label="item.blockName" :value="item.blockId">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>所属路口</span></label>
                                        <el-select v-model="selectCross" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in crossList" :key="item.crossId" :label="item.crossName" :value="item.crossId">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>位置描述</span></label>
                                        <el-input v-model="locationDesc" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="base-attribute manageBox">
                            <div class="title" @click="showInfoVisible('manageInfoVisible')">
                                <h3>管理信息</h3>
                                <div class="content-icon" :class="{'active':manageInfoVisible}"></div>
                            </div>
                            <div class="content" v-show="manageInfoVisible">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span><i>*</i>管理部门</span></label>
                                        <el-input v-if="isReadonly" v-model="selectManagem" placeholder="" size='mini' class="content-select" clearable readonly :disabled="isReadonly"></el-input>
                                        <el-popover v-else highlight-current popper-class="region-popper managem-popper" ref="popoverSelectManagem" placement="bottom-start" trigger="click" v-model="selectManagemVisible">
                                            <el-input v-model="selectManagem" placeholder="" size='mini' class="content-select" clearable v-popover:popoverSelectManagem slot="reference"></el-input>
                                            <el-scrollbar class="region-scroll">
                                                <el-tree id="selectManagem" :data="managemList" accordion :props="defaultProps" node-key="id" ref="treeManagem" show-checkbox check-strictly @check-change="handleCheckManagemChange"></el-tree>
                                            </el-scrollbar>
                                        </el-popover>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>管理编码</span></label>
                                        <el-input v-model="managemCoding" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>责任人</span></label>
                                        <el-select v-model="person" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in personList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                        <!-- <el-input v-model="person" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input> -->
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="base-attribute">
                            <div class="title" @click="showInfoVisible('longInfoVisible')">
                                <h3>经纬度</h3>
                                <div class="content-icon" :class="{'active':longInfoVisible}"></div>
                            </div>
                            <div class="content" v-show="longInfoVisible">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span><i>*</i>经纬度</span></label>
                                        <div class="longitude-box">
                                            <el-select v-model="longAndLat" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            </el-select>
                                            <div v-if="!isReadonly" @click="showMapVisible" class="longitude-fixed"></div>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>高程</span></label>
                                        <el-input v-model="altitude" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="base-attribute">
                            <div class="title" @click="showInfoVisible('comInfoVisible')">
                                <h3>通讯</h3>
                                <div class="content-icon" :class="{'active':comInfoVisible}"></div>
                            </div>
                            <div class="content" v-show="comInfoVisible">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>通讯方式</span></label>
                                        <el-select v-model="selectComWay" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in comWayList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>通讯协议</span></label>
                                        <el-select v-model="selectComTreaty" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in comTreatyList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span><i>*</i>IP</span></label>
                                        <el-input v-model="comIp" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>端口</span></label>
                                        <el-input v-model="comPort" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>子网掩码</span></label>
                                        <el-input v-model="comSubnet" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>网关</span></label>
                                        <el-input v-model="comGateway" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span><i>*</i>网络类型</span></label>
                                        <el-select v-model="selectComNetType" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in comNetTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="base-attribute">
                            <div class="title" @click="showInfoVisible('supInfoVisible')">
                                <h3>安装信息</h3>
                                <div class="content-icon" :class="{'active':supInfoVisible}"></div>
                            </div>
                            <div class="content" v-show="supInfoVisible">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>支持方式</span></label>
                                        <el-select v-model="selectSupportMode" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in supportModeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>朝向</span></label>
                                        <el-select v-model="selectOrientation" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in orientationList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <div class="ej-content-operation">
                <div class="submit" v-if="!isReadonly">
                    <p>确定</p>
                </div>
                <!-- <div class="reset" @click="resetRepair"><p>返回</p></div> -->
            </div>
            <el-dialog title="地图定位" :visible.sync="mapVisible" width='460px' :modal="false">
                <div class="dialog-urge">
                    <div class="dialog-main">
                        <div class="revoke-reason map-input">
                            <label class="dialog-label" style="text-align:left;">经纬度</label>
                            <el-input v-model="dialogLongitude" placeholder="" size='mini' class="dialog-select" readonly clearable></el-input>
                            <el-button type="primary" size='mini' class="map-btn map-green" @click="test" style="background: #00C187;">设置点</el-button>
                            <el-button type="primary" size='mini' class="map-btn">还原</el-button>
                        </div>
                        <div class="revoke-reason" style="margin:0;height:240px;">
                            <div id="mapLocation"></div>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" size='mini' class="submit">保 存</el-button>
                        <el-button @click="mapVisible=false" size='mini' class="cancel">取 消</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import Menu from "components/common/menu";
    import Bus from "@/assets/js/bus.js";
    import Common from "@/assets/js/common.js";
    import qs from 'qs';
    let _map;
    export default {
        components: {
            "EJ-Menu": Menu
        },
        data() {
            return {
                title: "资产信息-详情",
                token: "",
                baseInfo: {},
                isReadonly: true,
                devId: '',
                selectDevcategory: '',
                devcategoryList: [],
                devName: '',
                selectRegion: '',
                selectRegionCode: '',
                regionList: [],
                selectRegionVisible: false,
                selectSafeguardUnit: '',
                safeguardUnitList: [],
                warranty: '',
                serviceLife: '',
                maintenanceDate: '',
                maintenanceCycle: '',
                nextMaintenanceDate: '',
                brand: '',
                brandList: '',
                factory: '',
                factoryList: [],
                devType: '',
                projectUnit: '',
                projectUnitList: [],
                buildingProjects: '',
                buildingProjectsList: [],
                buildingNum: '',
                buildingDate: '',
                checkDate: '',
                selectRoad: '',
                roadList: [],
                selectRoadSection: '',
                roadSectionList: [],
                selectCross: '',
                crossList: [],
                locationDesc: '',
                selectManagem: '',
                selectManagemList: [],
                selectManagemCodeList: [],
                managemList: [],
                selectManagemVisible: false,
                managemCoding: '',
                person: '',
                personList: [],
                longitude: '',
                latitude: '',
                longAndLat: '',
                altitude: '',
                selectComWay: '',
                comWayList: [],
                selectComTreaty: '',
                comTreatyList: [],
                comIp: '',
                comPort: '',
                comSubnet: '',
                comGateway: '',
                selectComNetType: '',
                comNetTypeList: [],
                selectSupportMode: '',
                supportModeList: [],
                selectOrientation: '',
                orientationList: [],
                buildInfoVisible: true,
                locationInfoVisible: true,
                manageInfoVisible: true,
                longInfoVisible: true,
                comInfoVisible: true,
                supInfoVisible: true,

                postData: {},
                mapVisible: false,
                isHaveMap: false,
                dialogLongitude: '',
                defaultProps: {
                    children: 'children',
                    label: 'text'
                }
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.isReadonly = Common.getQueryString("type") == "onlyread";

            this.getInfoFuc();

            // 生产厂家
            this.getDicInfo('/DeviceDic/getDeviceDic.htm', { 'parentCode': 'DEVICEFACTORY' }).then(res => {
                if (res.appCode == 0) { this.factoryList = res.resultList; }
            });
            // 建设项目
            this.getDicInfo('/DeviceDic/getDeviceDic.htm', { 'parentCode': 'DEVICEPROJECT' }).then(res => {
                if (res.appCode == 0) { this.buildingProjectsList = res.resultList; }
            });
            // 建设单位
            this.getDicInfo('/DeviceDic/getDeviceDic.htm', { 'parentCode': 'DEVICECOMPANY' }).then(res => {
                if (res.appCode == 0) { this.projectUnitList = res.resultList; }
            });
            // 运维单位
            this.getDicInfo('/OpsDeptInfo/getOpsDetpTree.htm', {}).then(res => {
                if (res.appCode == 0) { this.safeguardUnitList = res.resultList; }
            });

            if (!this.isReadonly) {
                // 设备类型
                // this.getDicInfo().then(res => {
                //     if (res.appCode == 0) { this.devcategoryList = res.resultList; }
                // });
                // 所属道路
                this.getDicInfo('/RoadInfo/getRoadInfo.htm', {}).then(res => {
                    if (res.appCode == 0) { this.roadList = res.resultList; }
                });
                // 所属路段
                this.getDicInfo('/BlockInfo/getBlockName.htm', {}).then(res => {
                    if (res.appCode == 0) { this.roadSectionList = res.resultList; }
                });
                // 所属路口
                this.getDicInfo('/CrossInfo/getCrossName.htm', {}).then(res => {
                    if (res.appCode == 0) { this.crossList = res.resultList; }
                });
                // 管理部门
                this.getDicInfo('/DeptInfo/getDeptTree.htm', {}).then(res => {
                    if (res.appCode == 0) { this.managemList = res.resultList; }
                });
                // 品牌
                this.getDicInfo('/DeviceDic/getDicInfo.htm', { 'parentCode': 'BRANDCODE' }).then(res => {
                    if (res.appCode == 0) { this.brandList = res.resultList; }
                });
                // 通讯方式
                this.getDicInfo('/DeviceDic/getDicInfo.htm', { 'parentCode': 'SIGNSCONNECT' }).then(res => {
                    if (res.appCode == 0) { this.comWayList = res.resultList; }
                });
                // 通讯协议
                this.getDicInfo('/DeviceDic/getDicInfo.htm', { 'parentCode': 'MODBUSRTU' }).then(res => {
                    if (res.appCode == 0) { this.comTreatyList = res.resultList; }
                });
                // 网络类型
                this.getDicInfo('/DeviceDic/getDicInfo.htm', { 'parentCode': 'NETMODE' }).then(res => {
                    if (res.appCode == 0) { this.comNetTypeList = res.resultList; }
                });
                // 支持方式
                this.getDicInfo('/DeviceDic/getDicInfo.htm', { 'parentCode': 'SIGNSSTRUCT' }).then(res => {
                    if (res.appCode == 0) { this.supportModeList = res.resultList; }
                });
                // 朝向
                this.getDicInfo('/TrafficDic/getDicInfo.htm', { 'parentCode': 'ROADDIRECT' }).then(res => {
                    if (res.appCode == 0) { this.orientationList = res.resultList; }
                });
                // 责任人
                this.getDicInfo('/Person/getPersonInfo.htm', {}).then(res => {
                    if (res.appCode == 0) { this.personList = res.resultList; }
                });

                // 区域
                this.getRegionTree(null).then(res => {
                    if (res.appCode == 0) { this.regionList = res.resultList; }
                });
                // 维护单位
                // this.getDeptTree(null).then(res => {
                //     // if (res.appCode == 0) { this.managemList = res.resultList; }
                // });
            }
        },
        watch: {
            selectRegion(newVal, oldVal) {
                if (newVal === '') {
                    this.selectRegionCode = '';
                    setTimeout(() => {
                        this.selectRegionVisible = false;
                    });
                }
            },
            selectManagem(newVal, oldVal) {
                if (newVal === '') {
                    this.selectManagemCodeList = [];
                    this.$refs.treeManagem.setCheckedKeys([]);
                    setTimeout(() => {
                        this.selectManagemVisible = false;
                    });
                }
            },
            selectManagemList(newVal, oldVal) {
                this.selectManagem = this.selectManagemList.join('，');
            }

        },
        methods: {
            // 必填项判断
            isMustFill() {
                if (this.devId == "") {
                    Common.ejMessage('warning', '设备编号为必填项');
                    return false;
                }
                if (this.selectDevcategory == "") {
                    Common.ejMessage('warning', '设备类型为必填项');
                    return false;
                }
                if (this.devName == "") {
                    Common.ejMessage('warning', '设备名称为必填项');
                    return false;
                }
                if (this.selectRegionCode == "") {
                    Common.ejMessage('warning', '所属辖区为必填项');
                    return false;
                }
                if (this.selectSafeguardUnit == "") {
                    Common.ejMessage('warning', '维护单位为必填项');
                    return false;
                }
                if (this.warranty == "") {
                    Common.ejMessage('warning', '质保期为必填项');
                    return false;
                }
                if (this.serviceLife == "") {
                    Common.ejMessage('warning', '使用年限为必填项');
                    return false;
                }
                if (this.nextMaintenanceDate == "") {
                    Common.ejMessage('warning', '下次维护日期为必填项');
                    return false;
                }
                if (this.factory == "") {
                    Common.ejMessage('warning', '生产厂家为必填项');
                    return false;
                }
                if (this.buildingDate == "") {
                    Common.ejMessage('warning', '建设日期为必填项');
                    return false;
                }
                if (this.selectManagemCodeList.length < 1) {
                    Common.ejMessage('warning', '管理部门为必填项');
                    return false;
                }
                if (this.longAndLat == "") {
                    Common.ejMessage('warning', '经纬度为必填项');
                    return false;
                }
                if (this.comIp == "") {
                    Common.ejMessage('warning', 'IP为必填项');
                    return false;
                }
                if (this.selectComNetType == "") {
                    Common.ejMessage('warning', '网络类型为必填项');
                    return false;
                }

                return true;
            },
            // 获取公用部分的修改数据
            getPostData() {
                this.postData.devTypeCode = this.selectDevcategory; // 设备类型
                this.postData.regionId = this.selectRegionCode; // 所属辖区
                this.postData.oppmDept = this.selectSafeguardUnit; // 维护单位
                this.postData.periodDate = this.warranty.getTime(); // 质保期(年),日期格式
                this.postData.useAge = this.serviceLife; // 使用年限(年)
                this.postData.oppmDate = this.maintenanceDate.getTime(); // 维护日期,日期格式
                this.postData.oppmCycle = this.maintenanceCycle; // 维护周期
                this.postData.nextOppmDate = this.nextMaintenanceDate.getTime(); // 下次维护日期,日期格式
                this.postData.brand = this.brand; // 品牌
                this.postData.manufact = this.factory; // 生产厂家
                this.postData.ctrlModeCode = this.devType; // 设备型号
                this.postData.company = this.projectUnit; // 建设单位
                this.postData.project = this.buildingProjects; // 建设项目
                // this.postData. = this.buildingNum;// 建设期数
                this.postData.buildDate = this.buildingDate.getTime(); // 建设日期,日期格式
                this.postData.checkDate = this.checkDate.getTime(); // 验收日期,日期格式
                this.postData.roadId = this.selectRoad; // 所属道路
                this.postData.blockId = this.selectRoadSection; // 所属路段
                this.postData.crossId = this.selectCross; // 所属路口
                this.postData.siteDescrible = this.locationDesc; // 位置描述
                this.postData.manageDept = this.selectManagemCodeList; // 管理部门
                this.postData.manageId = this.managemCoding; // 管理编码
                this.postData.managePerson = this.person; // 责任人
                this.postData.coordX = this.longAndLat.split("，")[0]; // 经纬度
                this.postData.coordY = this.longAndLat.split("，")[1];
                this.postData.devHight = this.altitude; // 高程
                this.postData.dispathMode = this.selectComWay; // 通讯方式
                this.postData.dispathTreaty = this.selectComTreaty; // 通讯协议
                this.postData.ip = this.comIp; // IP
                this.postData.port = this.comPort; // 端口
                this.postData.netMask = this.comSubnet; // 子网掩码
                this.postData.gateway = this.comGateway; // 网关
                this.postData.netMode = this.selectComNetType; // 网络类型
                this.postData.supportModeCode = this.selectSupportMode; // 支持方式
                this.postData.orientCode = this.selectOrientation; // 朝向
            },
            // 获取修改状态的接口,和部分差异数据
            getModifyInterface(status) {
                let method = "";
                let obj = {};
                if (!this.isMustFill) { return; }
                switch (this.selectDevcategory) {
                    case "REPDEVTYPE01": // 信号机
                        method = '/SignalSiteInfo/editSignalSiteInfo.htm';
                        obj.ssId = this.devId;
                        obj.ssName = this.devName;
                        // obj.deviceStatusCode = status;
                        break;
                    case "REPDEVTYPE02": // 视频监控
                        method = '/VideoSiteInfo/editVideoSiteInfo.htm';
                        obj.vdSiteId = this.devId;
                        obj.vdSiteName = this.devName;
                        // obj.deviceStatusCode = status;
                        break;
                    case "REPDEVTYPE08": // 诱导屏
                        method = '/LedInfoController/editLedInfo.htm';
                        obj.ledId = this.devId;
                        obj.ledName = this.devName;
                        // obj.deviceStatusCode = status;
                        break;
                    case "REPDEVTYPE03": // 卡口
                    case "REPDEVTYPE04": // 电子警察
                        method = '/OffsiteInfo/editOffsiteInfo.htm';
                        obj.offsiteId = this.devId;
                        obj.offsiteName = this.devName;
                        // obj.osstatusCode = status;
                        break;
                    case "REPDEVTYPE05": // 地磁
                    case "REPDEVTYPE06": // 线圈
                    case "REPDEVTYPE07": // 微波
                        method = '/TrFlowInfoController/editTrFlowDevInfo.htm';
                        obj.trfDevId = this.devId;
                        obj.trfDevName = this.devName;
                        // obj.deviceStatusCode = status;
                        break;
                    default:
                        break;
                }
                return { 'method': method, 'object': obj };
            },
            // 保存资产信息的修改
            saveBaseInfo() {
                let method = this.getModifyInterface().method;
                this.postData = this.getModifyInterface().object;
                this.getPostData();
                this.changeDevFuc(method, this.postData, (res) => {
                    window.history.back();
                });
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
            // 获取基础信息的接口
            getInfoInterface() {
                let method = "";
                let obj = {};
                let devId = Common.getQueryString("devId");
                let devTypeCode = Common.getQueryString("devTypeCode");
                switch (devTypeCode) {
                    case "REPDEVTYPE01": // 信号机
                        method = '/SignalSiteInfo/getSignalSiteInfo.htm';
                        obj.ssId = devId;
                        break;
                    case "REPDEVTYPE02": // 视频监控
                        method = '/VideoSiteInfo/getVideoSiteInfo.htm';
                        obj.vdSiteId = devId;
                        break;
                    case "REPDEVTYPE08": // 诱导屏
                        method = '/LedInfoController/getLedInfo.htm';
                        obj.ledId = devId;
                        break;
                    case "REPDEVTYPE03": // 卡口
                    case "REPDEVTYPE04": // 电子警察
                        method = '/OffsiteInfo/getOffsiteInfo.htm';
                        obj.offsiteId = devId;
                        break;
                    case "REPDEVTYPE05": // 地磁
                    case "REPDEVTYPE06": // 线圈
                    case "REPDEVTYPE07": // 微波
                        method = '/TrFlowInfoController/getTrFlowDevInfo.htm';
                        obj.trfDevId = devId;
                        break;
                    default:
                        break;
                }
                return { 'method': method, 'object': obj };
            },
            getInfoFuc() {
                let host = this.$config.ubms_HOST;
                let method = this.getInfoInterface().method;
                let obj = {
                    token: this.token,
                    data: JSON.stringify(this.getInfoInterface().object)
                };
                this.$api.getMethod(host, method, obj, this.token).then(res => {
                        if (res.appCode == 0) {
                            let resObj = res.resultList[0];
                            this.baseInfo = resObj;
                            switch (resObj.devTypeCode) {
                                case "REPDEVTYPE01": // 信号机
                                    this.devId = resObj.ssId; // 设备编号
                                    this.devName = resObj.ssName; // 设备名称
                                    break;
                                case "REPDEVTYPE02": // 视频监控
                                    this.devId = resObj.vdSiteId; // 设备编号
                                    this.devName = resObj.vdSiteName; // 设备名称
                                    break;
                                case "REPDEVTYPE08": // 诱导屏
                                    this.devId = resObj.ledId; // 设备编号
                                    this.devName = resObj.ledName; // 设备名称
                                    break;
                                case "REPDEVTYPE03": // 卡口
                                case "REPDEVTYPE04": // 电子警察
                                    this.devId = resObj.offsiteId; // 设备编号
                                    this.devName = resObj.offsiteName; // 设备名称
                                    break;
                                case "REPDEVTYPE05": // 地磁
                                case "REPDEVTYPE06": // 线圈
                                case "REPDEVTYPE07": // 微波
                                    this.devId = resObj.trfDevId; // 设备编号
                                    this.devName = resObj.trfDevName; // 设备名称
                                    break;
                                default:
                                    this.devId = resObj.trfDevId || resObj.offsiteId || resObj.ledId || resObj.vdSiteId || resObj.ssId; // 设备编号
                                    this.devName = resObj.trfDevName || resObj.offsiteName || resObj.ledName || resObj.vdSiteName || resObj.ssName; // 设备名称
                                    break;
                            }
                            // 设备类型
                            this.selectDevcategory = !this.isReadonly ? resObj.devTypeCode : resObj.devTypeName;
                            // 所属辖区
                            this.selectRegion = resObj.regionName;
                            this.selectRegionCode = resObj.regionId;
                            // 维护单位
                            this.selectSafeguardUnit = !this.isReadonly ? resObj.oppmDept : resObj.oppmDeptName;
                            // 质保期(年),日期格式
                            this.warranty = resObj.periodDate ? Common.dateFormat('yyyy-MM-dd', new Date(parseInt(resObj.periodDate))) : '';
                            // 使用年限(年)
                            this.serviceLife = resObj.useAge;
                            // 维护日期,日期格式
                            this.maintenanceDate = resObj.oppmDate ? Common.dateFormat('yyyy-MM-dd', new Date(parseInt(resObj.oppmDate))) : '';
                            // 维护周期
                            this.maintenanceCycle = resObj.oppmCycle;
                            // 下次维护日期,日期格式
                            this.nextMaintenanceDate = resObj.nextOppmDate ? Common.dateFormat('yyyy-MM-dd', new Date(parseInt(resObj.nextOppmDate))) : '';
                            // 品牌
                            this.brand = !this.isReadonly ? resObj.brand : resObj.brandName;
                            // 生产厂家
                            this.factory = resObj.manufact;
                            // 设备型号
                            this.devType = !this.isReadonly ? resObj.ctrlModeCode : resObj.ctrlModeName;
                            // 建设单位
                            this.projectUnit = resObj.company;
                            // 建设项目
                            this.buildingProjects = resObj.project;
                            // 建设期数
                            this.buildingNum = '';
                            // 建设日期,日期格式
                            this.buildingDate = resObj.buildDate ? Common.dateFormat('yyyy-MM-dd', new Date(parseInt(resObj.buildDate))) : '';
                            // 验收日期,日期格式
                            this.checkDate = resObj.checkDate ? Common.dateFormat('yyyy-MM-dd', new Date(parseInt(resObj.checkDate))) : '';
                            // 所属道路
                            this.selectRoad = !this.isReadonly ? resObj.roadId : resObj.roadName;
                            // 所属路段
                            this.selectRoadSection = !this.isReadonly ? resObj.blockId : resObj.blockName;
                            // 所属路口
                            this.selectCross = !this.isReadonly ? resObj.crossId : resObj.crossName;
                            // 位置描述
                            this.locationDesc = resObj.siteDescrible;
                            // 管理部门
                            this.selectManagemList = [resObj.manageDept];
                            this.selectManagemCodeList = [resObj.manageDept];
                            // this.getDicInfo('/DeptInfo/getDeptInfo.htm', {}).then(res => {
                            //   if (res.appCode == 0) {
                            //     this.selectManagemList = res.resultList.filter(item => item.deptId == resObj.manageDept);
                            //   }
                            // });
                            // console.log(this.selectManagemCodeList, this.selectManagemList);
                            // 管理编码
                            this.managemCoding = resObj.manageId;
                            // 责任人
                            this.person = resObj.managePerson;
                            // 经纬度
                            this.longAndLat = resObj.coordX + '，' + resObj.coordY;
                            // 高程
                            this.altitude = resObj.devHight;
                            // 通讯方式
                            this.selectComWay = !this.isReadonly ? resObj.dispathMode : resObj.dispathModeName;
                            // 通讯协议
                            this.selectComTreaty = !this.isReadonly ? resObj.dispathTreaty : resObj.dispathTreatyName;
                            // IP
                            this.comIp = resObj.ip;
                            // 端口
                            this.comPort = resObj.port;
                            // 子网掩码
                            this.comSubnet = resObj.netMask;
                            // 网关
                            this.comGateway = resObj.gateway;
                            // 网络类型
                            this.selectComNetType = !this.isReadonly ? resObj.netMode : resObj.netModeName;
                            // 支持方式
                            this.selectSupportMode = !this.isReadonly ? resObj.supportModeCode : resObj.supportModeName;
                            // 朝向
                            this.selectOrientation = !this.isReadonly ? resObj.orientCode : resObj.orientName;
                        } else {
                            Common.printErrorLog(host, method);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(host, method);
                        console.log(err);
                    });
            },
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
                            "spatialReference": { "wkid": 4326 }
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
                _map.addEventListener(EJMap.Event.onLayerAdded, function(e) {
                    _map.setLayerVisibleById(_layer, false);
                    // if (e.layer.id == _layer) {
                    //     _map.setLayerVisibleById(_layer, false);
                    // }
                    _this.getPoint(_this.baseInfo.coordX, _this.baseInfo.coordY, false, true, true);
                });
                this.isHaveMap = true;
            },
            // 地图定位相关--end
            showInfoVisible(key) {
                this[key] = !this[key];
            },
            handleNodeRegionClick(data, node, e) {
                let thisId = e.$parent.$parent.$parent.$attrs.id || e.$parent.$parent.$attrs.id || e.$parent.$attrs.id;
                if (!data.children || data.children.length == 0) {
                    this.selectRegion = data.text;
                    this.selectRegionCode = data.id;
                    this.selectRegionVisible = false;
                }
            },
            handleCheckManagemChange(data, node, e) {
                console.log(data);
                if (!data.children || data.children.length == 0) {
                    let index = this.selectManagemList.indexOf(data.text);
                    if (index > -1) {
                        this.selectManagemList.splice(index, 1);
                        this.selectManagemCodeList.splice(index, 1);
                    } else {
                        this.selectManagemList.push(data.text);
                        this.selectManagemCodeList.push(data.id);
                    }
                    // this.selectManagemVisible = false;
                }
            },
            getRegionTree(parentCode) {
                return this.$api.getMethod(this.$config.efoms_HOST, '/ubmsService/getRegionTree', { token: this.token, data: JSON.stringify({ regionId: parentCode }) });
            },
            getDeptTree(parentCode) {
                return this.$api.getMethod(this.$config.ubms_HOST, "/DeptInfo/getDeptTree.htm", { token: this.token, data: JSON.stringify({ regionId: parentCode }) });
            },
            getDicInfo(method, prarms) {
                let host = this.$config.ubms_HOST;
                // let method = '/RoadInfo/getRoadInfo.htm';
                let obj = {
                    token: this.token,
                    data: JSON.stringify(prarms)
                };
                return this.$api.getMethod(host, method, obj, this.token);
            },
            goBack() {
                window.history.back();
            }
        }
    };
</script>
<style scoped>
    @import "../../assets/css/main.css";
    @import "../../assets/css/baseInfo.css";
    @import "../../assets/css/select.css";
    @import "../../assets/css/dialog.css";

    .base-info {
        padding-bottom: 20px;
        margin-bottom: 0;
    }

    .base-info .el-col label {
        text-align: right;
    }

    .base-info .el-col:nth-child(2n) label {
        width: 80px;
        text-align: right;
    }

    .base-info .el-col label span {
        position: relative;
    }

    .base-info .el-col label span i {
        position: absolute;
        color: #f90404;
        left: -7px;
    }

    .base-info .content .content-date>>>.el-input__inner {
        border: none;
        background: #F9FAFC;
    }

    .base-info .title {
        cursor: pointer;
    }

    .base-info .content-icon {
        float: right;
        width: 28px;
        height: 28px;
        background: url('../../assets/images/icon-arrow-double.png') no-repeat center/100%;
        cursor: pointer;
        margin-top: -13px;
        transform: rotate(90deg);
    }

    .base-info .content-icon.active {
        transform: rotate(-90deg);
    }

    .base-attribute .longitude-box {
        position: relative;
        display: inline-block;
        cursor: pointer;
    }

    .base-attribute .longitude-box .longitude-fixed {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 2;
    }

    /* 弹窗样式 */
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

    .ej-content>>>.el-dialog__title {
        font-size: 14px;
    }

    .dialog-urge .dialog-main .map-input .dialog-select {
        width: 220px;
    }

    .dialog-urge .dialog-main .map-input .map-btn {
        background: #ffffff;
        border-color: #E1E7ED;
        width: 60px;
        text-align: center;
        padding: 7px 0;
        color: #6C7883;
    }

    .dialog-urge .dialog-main .map-input .map-green {
        background: #00C187;
        color: #ffffff;
    }
</style>

<style>
    .navigationbar {
        top: 10px;
    }

    .ej-content-scrollbar {
        height: 100%;
    }

    .ej-content-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .region-popper {
        width: 300px;
        padding: 5px 0;
    }

    .managem-popper .el-checkbox {
        display: none;
    }

    .managem-popper .el-tree-node__expand-icon.is-leaf.is-leaf+.el-checkbox {
        display: inline-block;
    }
</style>