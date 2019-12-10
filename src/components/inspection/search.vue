<template>
    <div class="as-search-box">
        <div class="as-search-content">
            <el-input :placeholder="placeholder" v-model="input" class="input-with-search" @keyup.enter.native="searchFuc" clearable>
                <el-button slot="append" icon="el-icon-search" @click.native="searchFuc"></el-button>
            </el-input>
            <el-button class="ass-more-con" :class="{'active':searchPoperVisible}" @click="searchPoperVisible=!searchPoperVisible">
                更多条件
                <i class="el-icon-d-arrow-right"></i>
            </el-button>
            <!-- <div class="search-history-or-chosen">
                <div class="as-bottom-border">
                    <span>历史搜索：</span>
                    <el-tag closable @close="handleClose(tag)">标签二</el-tag>
                    <el-tag closable @close="handleClose(tag)">标签三</el-tag>
                    <el-tag>标签四</el-tag>
                    <el-tag>标签五</el-tag>
                </div>
            </div> -->
        </div>
        <div class="search-poper" v-show="searchPoperVisible">
            <div class="scroll-search height-auto">
                <ul>
                    <li class="tags-li" id="chosen" :class="{'rows-li':liRows.indexOf('chosen')>-1}">
                        <span>已选条件:</span>
                        <div class="tags-box">
                            <template v-for="(item,index) in chosenList">
                                <el-tag v-if="index < 10 && item != '-1'" :key="index" :class="{'active':chosenList.indexOf(item)>-1}" closable @close="closeOneCond(item)">{{item.dicName|stringEllipsis}}</el-tag>
                            </template>
                            <el-tag v-if="chosenList.length>10" class="active">......</el-tag>
                        </div>
                        <!-- <div class="tag-more" v-show="sceneList.length > maxLength" @click="showFuc('sceneAll')">{{sceneAll?'收起':'更多'}}</div> -->
                    </li>
                </ul>
            </div>
            <el-scrollbar class="scroll-search">
                <ul>
                    <li v-if="cond.indexOf('scene')>-1" class="tags-li" id="type" :class="{'rows-li':liRows.indexOf('type')>-1}">
                        <span>使用场景:</span>
                        <div class="tags-box">
                            <template v-for="(item,index) in sceneList">
                                <el-tag v-if="index < maxLength || sceneAll" :key="item.dicCode" :class="{'active':chosenList.indexOf(item)>-1}" @click.native="changeArr(item,'scene')">{{item.dicName}}</el-tag>
                            </template>
                        </div>
                        <div class="tag-more" v-show="sceneList.length > maxLength" @click="showFuc('sceneAll')">{{sceneAll?'收起':'更多'}}</div>
                    </li>
                    <li>
                        <span>管理部门:</span>
                        <div class="tags-box">
                            <el-input v-model="selectDept" placeholder size="mini" class="search-input" readonly clearable v-popover:popoverSelectDept></el-input>
                            <el-popover highlight-current popper-class="select-popper" ref="popoverSelectDept" placement="bottom-start" trigger="click" v-model="selectDeptVisible">
                                <el-scrollbar class="select-tree-scroll">
                                    <el-tree id="selectDept" :data="deptList" accordion :props="defaultProps" :expand-on-click-node="true" show-checkbox node-key="id" ref="treeDept" @check="checkChangeDept"></el-tree>
                                </el-scrollbar>
                            </el-popover>
                        </div>
                    </li>
                    <li>
                        <span>运维单位:</span>
                        <div class="tags-box">
                            <el-input v-model="selectOppmDept" placeholder size="mini" class="search-input" readonly clearable v-popover:popoverSelectOppm></el-input>
                            <el-popover highlight-current popper-class="select-popper" ref="popoverSelectOppm" placement="bottom-start" trigger="click" v-model="selectOppmDeptVisible">
                                <el-scrollbar class="select-tree-scroll">
                                    <el-tree id="selectOppmDept" :data="oppmDeptList" accordion :props="defaultProps" :expand-on-click-node="true" show-checkbox node-key="id" ref="treeOppm" @check="checkChangeOppm"></el-tree>
                                </el-scrollbar>
                            </el-popover>
                        </div>
                    </li>
                    <li>
                        <span>行政区域:</span>
                        <div class="tags-box">
                            <el-input v-model="selectRegion" placeholder size="mini" class="search-input" readonly clearable v-popover:popoverSelectRegion></el-input>
                            <el-popover highlight-current popper-class="select-popper" ref="popoverSelectRegion" placement="bottom-start" trigger="click" v-model="selectRegionVisible">
                                <el-scrollbar class="select-tree-scroll">
                                    <el-tree id="selectRegion" :data="regionList" accordion :props="defaultProps" :expand-on-click-node="true" show-checkbox node-key="id" ref="treeRegion" @check="checkChangeRegion"></el-tree>
                                </el-scrollbar>
                            </el-popover>
                        </div>
                    </li>
                    <li>
                        <span>所属道路:</span>
                        <div class="tags-box">
                            <el-select v-model="selectLoad" placeholder size="mini" class="search-input" popper-class="select-popper" clearable @focus="closePopover">
                                <el-option v-for="item in loadList" :key="item.roadId" :label="item.roadName" :value="item.roadId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="tags-li" id="factory" :class="{'rows-li':liRows.indexOf('factory')>-1}">
                        <span>设备厂商:</span>
                        <div class="tags-box">
                            <template v-for="(item,index) in factorysList">
                                <el-tag v-if="index < maxLength || factorysAll" :key="item.dicCode" :class="{'active':chosenList.indexOf(item)>-1}" @click.native="changeArr(item,'factorys')">{{item.dicName}}</el-tag>
                            </template>
                        </div>
                        <div class="tag-more" v-show="factorysList.length > maxLength" @click="showFuc('factorysAll')">{{factorysAll?'收起':'更多'}}</div>
                    </li>
                    <li class="tags-li" id="builds" :class="{'rows-li':liRows.indexOf('builds')>-1}">
                        <span>建设单位:</span>
                        <div class="tags-box">
                            <template v-for="(item,index) in buildssList">
                                <el-tag v-if="index < maxLength || buildssAll" :key="item.dicCode" :class="{'active':chosenList.indexOf(item)>-1}" @click.native="changeArr(item,'buildss')">{{item.dicName}}</el-tag>
                            </template>
                        </div>
                        <div class="tag-more" v-show="buildssList.length > maxLength" @click="showFuc('buildssAll')">{{buildssAll?'收起':'更多'}}</div>
                    </li>
                    <li class="tags-li" id="projects" :class="{'rows-li':liRows.indexOf('projects')>-1}">
                        <span>建设项目:</span>
                        <div class="tags-box">
                            <template v-for="(item,index) in projectssList">
                                <el-tag v-if="index < maxLength || projectssAll" :key="item.dicCode" :class="{'active':chosenList.indexOf(item)>-1}" @click.native="changeArr(item,'projectss')">{{item.dicName}}</el-tag>
                            </template>
                        </div>
                        <div class="tag-more" v-show="projectssList.length > maxLength" @click="showFuc('projectssAll')">{{projectssAll?'收起':'更多'}}</div>
                    </li>
                    <li v-if="cond.indexOf('drainage')>-1" class="tags-li" id="drainage" :class="{'rows-li':liRows.indexOf('projects')>-1}">
                        <span>视频类型:</span>
                        <div class="tags-box">
                            <template v-for="(item,index) in drainageList">
                                <el-tag v-if="index < maxLength || drainageAll" :key="item.dicCode" :class="{'active':chosenList.indexOf(item)>-1}" @click.native="changeArr(item,'drainage')">{{item.dicName}}</el-tag>
                            </template>
                        </div>
                        <div class="tag-more" v-show="drainageList.length > maxLength" @click="showFuc('drainageAll')">{{drainageAll?'收起':'更多'}}</div>
                    </li>
                    <!-- <li class="tags-li" id="projects" :class="{'rows-li':liRows.indexOf('projects')>-1}">
                        <span>运维单位:</span>
                        <div class="tags-box">
                            <template v-for="(item,index) in oppmDeptList">
                                <el-tag v-if="index < maxLength || oppmDeptAll" :key="item.dicCode" :class="{'active':chosenList.indexOf(item)>-1}" @click.native="changeArr(item,'oppmDept')">{{item.dicName}}</el-tag>
                            </template>
                        </div>
                        <div class="tag-more" v-show="oppmDeptList.length > maxLength" @click="showFuc('oppmDeptAll')">{{oppmDeptAll?'收起':'更多'}}</div>
                    </li> -->
                    <li class="tags-li" id="projects" :class="{'rows-li':liRows.indexOf('projects')>-1}">
                        <span>使用状态:</span>
                        <div class="tags-box">
                            <template v-for="(item,index) in useStatusList">
                                <el-tag v-if="index < maxLength || useStatusAll" :key="item.dicCode" :class="{'active':chosenList.indexOf(item)>-1}" @click.native="changeArr(item,'useStatus')">{{item.dicName}}</el-tag>
                            </template>
                        </div>
                        <div class="tag-more" v-show="useStatusList.length > maxLength" @click="showFuc('useStatusAll')">{{useStatusAll?'收起':'更多'}}</div>
                    </li>
                    <li v-if="cond.indexOf('geographic')>-1" class="tags-li" id="geographic" :class="{'rows-li':liRows.indexOf('projects')>-1}">
                        <span>地理信息:</span>
                        <div class="tags-box">
                            <template v-for="(item,index) in geographicList">
                                <el-tag v-if="index < maxLength || geographicAll" :key="item.dicCode" :class="{'active':chosenList.indexOf(item)>-1}" @click.native="changeArr(item,'geographic','one')">{{item.dicName}}</el-tag>
                            </template>
                        </div>
                        <div class="tag-more" v-show="geographicList.length > maxLength" @click="showFuc('geographicAll')">{{geographicAll?'收起':'更多'}}</div>
                    </li>
                    <li v-if="cond.indexOf('years')>-1" class="tags-li" id="years" :class="{'rows-li':liRows.indexOf('projects')>-1}">
                        <span>使用年限:</span>
                        <div class="tags-box">
                            <template v-for="(item,index) in yearsList">
                                <el-tag v-if="index < maxLength || yearsAll" :key="item.dicCode" :class="{'active':chosenList.indexOf(item)>-1}" @click.native="changeArr(item,'years','one')">{{item.dicName}}</el-tag>
                            </template>
                        </div>
                        <div class="tag-more" v-show="yearsList.length > maxLength" @click="showFuc('yearsAll')">{{yearsAll?'收起':'更多'}}</div>
                    </li>
                    <!-- <li>
                        <span>启用日期:</span>
                        <div class="tags-box">
                            <el-tag v-for="item in datesList" :key="item.dicCode" :class="{'active':chosenList.indexOf(item)>-1}" @click.native="changeArr(item,'dates')">{{item.dicName}}</el-tag>

                            <el-tag :class="{'active':chosenList.indexOf('-1')>-1}" @click.native="changeArr('-1','dates')">自定义</el-tag>
                            <el-date-picker class="ej-date" v-model="timeSection" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                            <el-date-picker class="ej-date" v-model="oneDay" type="date" placeholder :disabled="!(chosenList.indexOf('-1')>-1)"></el-date-picker>
                        </div>
                    </li> -->
                </ul>
            </el-scrollbar>
            <div class="as-foot">
                <el-button class="as-foot-search" @click="searchFuc">查询</el-button>
                <el-button class="as-foot-cancel" @click="searchPoperVisible=false">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import Common from "@/assets/js/common.js";
    export default {
        props: {
            placeholder: {
                type: String,
                default: "设备编号、ip、名称"
            },
            cond: {
                type: String,
                default: ""
            },
            devType: {
                type: String,
                default: ""
            },
        },
        filters: {
            stringEllipsis(val) {
                let str = String(val) || '';
                return val.length > 20 ? (str.substring(0, 20) + '...') : val;
            }
        },
        data() {
            return {
                token: '',
                searchPoperVisible: false,
                liRows: [], // poper里哪些行是一行的
                moreBtn: [], // moreBtn: ['chosen', 'type', 'factory', 'builds', 'projects'], // 那些行有更多按钮
                maxLength: 7, //默认最多7+1个
                input: "",

                chosenList: [],

                types: [],
                typesList: [],
                typesAll: false,
                scene: [],
                sceneList: [],
                sceneAll: false,
                roads: [],
                roadsList: [],
                roadsAll: false,
                factorys: [],
                factorysList: [],
                factorysAll: false,
                buildss: [],
                buildssList: [],
                buildssAll: false,
                projectss: [],
                projectssList: [],
                projectssAll: false,
                drainage: [],
                drainageList: [],
                drainageAll: false,
                useStatus: [],
                useStatusList: [],
                useStatusAll: false,
                // oppmDept: [],
                // oppmDeptList: [],
                // oppmDeptAll: false,
                dates: [],
                datesList: [],
                datesAll: false,
                geographic: [],
                geographicList: [],
                geographicAll: false,
                years: [],
                yearsList: [],
                yearsAll: false,

                timeSection: "",
                oneDay: "",

                selectLoad: "",
                loadList: "",

                selectDept: "",
                selectDeptCode: "",
                selectDeptVisible: false,
                deptList: [],
                depts: [],
                selectRegion: "",
                selectRegionCode: "",
                selectRegionVisible: false,
                regionList: [],
                regions: [],
                selectOppmDept: "",
                selectOppmDeptCode: "",
                selectOppmDeptVisible: false,
                oppmDeptList: [],
                oppmDept: [],


                defaultProps: {
                    children: "children",
                    label: "text"
                }
            };
        },
        watch: {
            selectRegion(newVal, oldVal) {
                if (newVal === "") {
                    this.selectRegionCode = "";
                    this.$refs.treeRegion.setCheckedKeys([]);
                    this.regions = [];
                    this.resetChosen();
                    setTimeout(() => {
                        this.selectRegionVisible = false;
                    });
                }
            },
            selectDept(newVal, oldVal) {
                if (newVal === "") {
                    this.selectDeptCode = "";
                    this.$refs.treeDept.setCheckedKeys([]);
                    this.depts = [];
                    this.resetChosen();
                    setTimeout(() => {
                        this.selectDeptVisible = false;
                    });
                }
            },
            selectOppmDept(newVal, oldVal) {
                if (newVal === "") {
                    this.selectOppmDeptCode = "";
                    this.$refs.treeOppm.setCheckedKeys([]);
                    this.oppmDept = [];
                    this.resetChosen();
                    setTimeout(() => {
                        this.selectOppmDeptVisible = false;
                    });
                }
            },
            oneDay(val) {
                this.chosenList = this.chosenList.filter(val => {
                    return val.type != "select";
                });
                if (val) {
                    this.chosenList.push({
                        key: "time",
                        dicCode: this.formatDate(val),
                        dicName: this.formatDate(val),
                        type: "select"
                    });
                }
            }
        },
        beforeMount() {},
        mounted() {
            this.token = Common.getQueryString("token");

            // this.getDicInfoOther().then(res => {
            //     let resultList = res.resultList || {};
            //     // // 生产厂家
            //     // this.factorysList = resultList.factory || [];
            //     // // 建设项目
            //     // this.projectssList = resultList.project || [];
            //     // // 建设单位
            //     // this.buildssList = resultList.company || [];
            //     // 运维单位
            //     // this.oppmDeptList = resultList.oppmDept || [];
            // });
            // 生产厂家
            this.getDicInfo('DEVICEFACTORY').then(res => {
                if (res.appCode == 0) {
                    this.factorysList = res.resultList || [];
                    window.factorysList = this.factorysList;
                }
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
            // 运维单位
            this.getOpsDetpTreeInfo().then(res => {
                if (res.appCode == 0) {
                    this.oppmDeptList = res.resultList || [];
                    window.oppmDeptList = this.oppmDeptList;
                }
            });


            // 视频类型
            this.getDicInfo('TYPEVIDEO').then(res => {
                if (res.appCode == 0) { this.drainageList = res.resultList || []; }
            });
            // 使用状态
            this.getDicInfo('DEVICESTATUS').then(res => {
                if (res.appCode == 0) { this.useStatusList = res.resultList || []; }
            });
            // 使用场景
            this.getDicInfoTaf('OFFSITESCENE').then(res => {
                if (res.appCode == 0) {
                    this.sceneList = res.resultList || [];
                    window.sceneList = this.sceneList;
                }
            });
            // 部门
            this.getDeptTree(null).then(res => {
                if (res.appCode == 0) { this.deptList = res.resultList; }
            });
            // 区域
            this.getRegionTree(null).then(res => {
                if (res.appCode == 0) { this.regionList = res.resultList; }
            });
            //道路
            // this.getRoad().then(res => {
            // if (res.appCode == 0) {this.loadList = res.resultList;}
            //数据未维护，逻辑暂时没有写
            // });
            // 地理信息
            this.geographicList = [{
                dicCode: 'isHaveGeomTrue',
                dicName: '有'
            }, {
                dicCode: 'isHaveGeomFalse',
                dicName: '无'
            }];
            // 使用年限
            this.yearsList = [{
                dicCode: '01',
                dicName: '一年以内'
            }, {
                dicCode: '13',
                dicName: '一到三年'
            }, {
                dicCode: '35',
                dicName: '三到五年'
            }, {
                dicCode: '5T',
                dicName: '五年以上'
            }, {
                dicCode: 'other',
                dicName: '建设时间缺失'
            }];
        },
        methods: {
            showFuc(type) {
                this[type] = !this[type];
            },
            closeOneCond(item) {
                this.filterObjInArr(this.scene, item);
                this.filterObjInArr(this.depts, item);
                this.filterObjInArr(this.regions, item);
                this.filterObjInArr(this.factorys, item);
                this.filterObjInArr(this.buildss, item);
                this.filterObjInArr(this.projectss, item);
                this.filterObjInArr(this.drainage, item);
                this.filterObjInArr(this.oppmDept, item);
                this.filterObjInArr(this.useStatus, item);
                this.filterObjInArr(this.dates, item);
                this.filterObjInArr(this.geographic, item);
                this.filterObjInArr(this.years, item);
                this.resetChosen();
                if (this.depts.length == 0) {
                    this.selectDept = '';
                    this.selectDeptCode = '';
                    this.$refs.treeDept.setCheckedKeys([]);
                }
                if (this.oppmDept.length == 0) {
                    this.selectOppmDept = '';
                    this.selectOppmDeptCode = '';
                    this.$refs.treeOppm.setCheckedKeys([]);
                }
                if (this.regions.length == 0) {
                    this.selectRegion = '';
                    this.selectRegionCode = '';
                    this.$refs.treeRegion.setCheckedKeys([]);
                }
            },
            resetChosen() {
                this.chosenList = [...this.scene, ...this.depts, ...this.oppmDept, ...this.regions, ...this.factorys, ...this.buildss, ...this.projectss, ...this.drainage, ...this.useStatus, ...this.dates, ...this.geographic, ...this.years];
            },
            filterObjInArr(arr, obj) {
                let index = arr.indexOf(obj);
                if (index > -1) {
                    arr.splice(index, 1);
                }
            },
            // 改变数组，source中存在data就删除，反之增加
            // type 默认复选，one代表单选
            changeArr(data, source, type) {
                let isHave = this[source].some(val => {
                    return val == data;
                });
                if (isHave) {
                    this[source] = this[source].filter(val => {
                        return val != data;
                    });
                } else {
                    if (type == "one") {
                        this[source] = [data];
                    } else {
                        this[source].push(data);
                    }
                }
                this.resetChosen();
            },
            // 改变数组，source中存在key为data的就删除，反之增加
            changeObj(data, source, key) {
                let isHave = this[source].some(val => {
                    return val == type;
                });
                if (isHave) {
                    this.liRows = this.liRows.filter(val => {
                        return val != type;
                    });
                } else {
                    this.liRows.push(data);
                }
            },
            checkChangeDept(data, node, e) {
                let arr = this.$refs.treeDept.getCheckedNodes() || [];
                let id = [];
                let name = [];
                arr.map(val => {
                    id.push(val.id);
                    name.push(val.text);
                });
                this.selectDept = name.join(',');
                this.selectDeptCode = id.join(',');
                if (this.selectDeptCode) {
                    this.depts = [{ dicCode: this.selectDeptCode, dicName: this.selectDept }];
                } else {
                    this.depts = [];
                }
                this.resetChosen();
            },
            checkChangeOppm(data, node, e) {
                let arr = this.$refs.treeOppm.getCheckedNodes() || [];
                let id = [];
                let name = [];
                arr.map(val => {
                    id.push(val.id);
                    name.push(val.text);
                });
                this.selectOppmDept = name.join(',');
                this.selectOppmDeptCode = id.join(',');
                if (this.selectOppmDeptCode) {
                    this.oppmDept = [{ dicCode: this.selectOppmDeptCode, dicName: this.selectOppmDept }];
                } else {
                    this.oppmDept = [];
                }
                this.resetChosen();
            },
            checkChangeRegion(data, node, e) {
                let arr = this.$refs.treeRegion.getCheckedNodes() || [];
                let id = [];
                let name = [];
                arr.map(val => {
                    id.push(val.id);
                    name.push(val.text);
                });
                this.selectRegion = name.join(',');
                this.selectRegionCode = id.join(',');
                if (this.selectRegionCode) {
                    this.regions = [{ dicCode: this.selectRegionCode, dicName: this.selectRegion }];
                } else {
                    this.regions = [];
                }
                this.resetChosen();
            },
            closePopover() {
                this.selectDeptVisible = false;
                this.selectRegionVisible = false;
                this.selectOppmDeptVisible = false;
            },
            searchFuc() {
                let obj = {};
                obj.key = this.input;
                obj.devScene = this.getArrKeyValue(this.scene);
                obj.manDeptId = this.getArrKeyValue(this.depts);
                obj.areaId = this.getArrKeyValue(this.regions);
                obj.roadId = this.getArrKeyValue(this.roads);
                obj.factory = this.getArrKeyValue(this.factorys);
                obj.company = this.getArrKeyValue(this.buildss);
                obj.project = this.getArrKeyValue(this.projectss);
                obj.videoDevType = this.getArrKeyValue(this.drainage);
                obj.oppmDept = this.getArrKeyValue(this.oppmDept);
                obj.devStatus = this.getArrKeyValue(this.useStatus);
                obj.isHaveGeom = this.getArrKeyValue(this.geographic);
                obj.devSYNX = this.getArrKeyValue(this.years);
                this.searchPoperVisible = false;
                this.$emit('searchAsk', obj);
            },
            getArrKeyValue(arr) {
                let strArr = [];
                arr.map(val => {
                    strArr.push(val.dicCode);
                });
                return strArr.join(',');
            },
            getRegionInfo(parentCode) {
                return this.$api.getMethod(this.$config.ubms_HOST, '/RegionInfo/getRegionInfo.htm', { token: this.token, data: JSON.stringify({ parentCode: parentCode }) });
            },
            getRegionTree(parentCode) {
                return this.$api.getMethod(this.$config.efoms_HOST, '/ubmsService/getRegionTree', { token: this.token, data: JSON.stringify({ regionId: parentCode }) });
            },

            // getDeptTree(parentCode) {
            //     return this.$api.get(`${this.$config.efoms_HOST}${'/ubmsService/getDeptTree'}`, { token: this.token, data: JSON.stringify({ regionId: parentCode }) }, "");
            // },
            getDeptTree(parentCode) {
                return this.$api.get(`${this.$config.ubms_HOST}/DeptInfo/getDeptTree.htm`, { token: this.token, data: JSON.stringify({}) }, "");
            },
            getRoad() {
                return this.$api.get(`${this.$config.ubms_HOST}/ubmsService/RoadInfo/getRoadInfo.htm`, { token: this.token, data: JSON.stringify({}) }, "");
            },
            // 数据字典
            getDicInfo(parentCode) {
                return this.$api.getMethod(this.$config.ubms_HOST, '/DeviceDic/getDeviceDic.htm', { token: this.token, data: JSON.stringify({ parentCode: parentCode }) });
            },
            // 数据字典(另一个)
            getDicInfoOther() {
                return this.$api.getMethod(this.$config.efoms_HOST, '/CheckReport/getSelectValue', { devTypeCode: this.devType }, this.token);
            },
            // 数据字典（3）
            getDicInfoTaf(parentCode) {
                return this.$api.getMethod(this.$config.ubms_HOST, '/TrafficDic/getTrafficDic.htm', { token: this.token, data: JSON.stringify({ parentCode: parentCode }) });
            },
            // 运维单位
            getOpsDetpTreeInfo() {
                return this.$api.getMethod(this.$config.ubms_HOST, '/OpsDeptInfo/getOpsDetpTree.htm', { token: this.token, data: JSON.stringify({}) });
            }

        }
    };
</script>
<style lang="less" scoped>
    // @import "../../assets/css/input.less";
    @borderColor: #E4EAEE;
    @btnBgColor: #63d8b5;
    @txtColor: #666;

    button {
        outline: none;

        &:active {
            border-color: transparent;
        }
    }

    .as-search-box {
        padding: 0 10px;
        margin-top: 13px;
        color: #82afb8;
        position: relative;

        .as-search-content {
            display: flex;

            .input-with-search {
                width: 360px;
                height: 30px;
                overflow: hidden;
                border: 1px solid @borderColor;
                // background: #032834;

                /deep/ .el-input__inner,
                /deep/ .el-input-group__append {
                    background: transparent;
                    border: 0;
                    color: @txtColor;
                    height: 30px;
                    line-height: 30px;
                    font-size: 12px;
                }

                /deep/ .el-input-group__append {
                    font-size: 16px;

                    &:hover {
                        color: #00c187;
                    }
                }
            }

            .ass-more-con {
                height: 32px;
                // border: 1px solid #1c6374;
                // background: #032834;
                border-color: @borderColor;
                font-size: 12px;
                color: @txtColor;
                padding: 5px 10px;
                border-radius: 0;
                position: relative;
                // top: 1px;
                margin-left: 10px;

                &:focus {
                    background: #fff;
                    color: @txtColor;
                }

                &.active,
                &:hover {
                    background: #00c187;
                    color: #fff;
                }

                .el-icon-d-arrow-right {
                    transform: rotate(90deg);
                }
            }

            .search-history-or-chosen {
                flex: 1;
                overflow: hidden;
                display: flex;

                .as-bottom-border {
                    // display: flex;
                    // border-bottom: 1px solid #045e7d;
                    margin-left: 20px;
                    height: 32px;

                    /deep/ .el-tag {
                        margin-left: 5px;
                        // color: #82afb8;
                        border-color: transparent;
                        background: transparent;

                        .el-icon-close {
                            // color: #82afb8;

                            &:hover {
                                // background-color: #443c3c;
                            }
                        }
                    }
                }
            }
        }

        .search-poper {
            position: absolute;
            left: 10px;
            top: 35px;
            width: 800px;
            height: 420px;
            background: #fafafa;
            box-shadow: 0 2px 24px 0 rgba(203, 209, 212, 0.63);
            z-index: 100000;
            display: flex;
            flex-flow: column;

            .scroll-search {
                width: 100%;
                flex: 1;
                padding: 10px 0 10px 0;
                box-sizing: border-box;

                &.height-auto {
                    flex: none;
                    padding-bottom: 0;
                    margin-bottom: -8px;
                }

                ul {
                    padding: 0 20px;

                    li {
                        display: flex;
                        color: #666;
                        margin-top: 5px;
                        position: relative;

                        &.tags-li {

                            // height: 29px;
                            .tags-box {
                                height: auto;
                            }
                        }

                        &.rows-li {

                            // height: auto;
                            .tags-box {
                                height: 29px;
                            }
                        }

                        &:first-child {
                            margin-top: 0;
                        }

                        &>span,
                        &>div.tag-more {
                            font-size: 12px;
                            color: #333;
                            width: 54px;
                            text-align: right;
                            line-height: 18px;
                            padding: 3px 0;
                            margin-top: 5px;
                        }

                        &>div.tags-box {
                            flex: 1;
                            overflow: hidden;
                            padding-left: 15px;
                            padding-right: 20px;

                            /deep/ .el-tag {
                                line-height: 18px;
                                padding: 3px 5px;
                                margin-left: 5px;
                                height: 24px;
                                font-size: 12px;
                                color: @txtColor;
                                background: transparent;
                                border-color: transparent;
                                border: 0;
                                margin-top: 5px;
                                cursor: pointer;

                                &.active {
                                    background: @btnBgColor;
                                    color: #fff;
                                    border-radius: 2px;
                                }
                            }
                        }

                        &>div.tag-more {
                            color: #333;
                            width: 30px;
                            text-align: center;
                            cursor: pointer;
                            height: 24px;
                        }
                    }
                }

                .search-input {
                    margin-top: 5px;
                    margin-left: 5px;
                    height: 26px;
                    width: 400px;

                    /deep/ .el-input__inner {
                        background: #fff;
                        border: 1px solid @borderColor;
                        height: 26px;
                        border-radius: 0;
                        color: @txtColor;
                    }
                }

                .ej-date {
                    margin-left: 10px;
                    padding-left: 10px;
                    padding-right: 0;
                    color: @txtColor;
                    border-radius: 0;
                    font-size: 12px;
                    background: #fff !important;
                    border: 1px solid @borderColor;
                    height: 28px;
                    width: 180px;

                    /deep/ .el-range-input {
                        color: @txtColor;
                        font-size: 12px;
                        background: transparent;
                        width: 63px;
                    }

                    /deep/ .el-range__icon {
                        line-height: 21px;
                    }

                    /deep/ .el-range__close-icon {
                        line-height: 21px;
                    }

                    /deep/ .el-range-separator {
                        color: #aaadb3;
                        line-height: 19px;
                        position: relative;
                        left: -3px;
                    }

                    /deep/ .el-input__inner {
                        background: transparent;
                        border: none;
                        height: 28px;
                        line-height: 28px;
                        color: #fff;
                    }

                    /deep/ .el-input__prefix,
                    /deep/ .el-input__suffix {
                        top: -6px;
                    }
                }
            }

            .as-foot {
                height: 30px;
                padding: 10px 10px 20px 10px;
                text-align: right;

                /deep/ .el-button {
                    height: 30px;
                    font-size: 12px;
                    color: #666;
                    padding: 5px 30px;
                    border-radius: 0;
                    margin-right: 10px;

                    &:hover {
                        opacity: 0.7;
                    }

                    &.as-foot-search {
                        background: #00c187;
                        color: #fff;
                    }

                    &.as-foot-cancel {
                        border-color: #dcdfe6;
                        background-color: #fff;
                    }



                }
            }
        }
    }
</style>
<style lang="less">
    @borderColor: #E4EAEE;
    @txtColor: #666;

    .select-popper {
        z-index: 100001 !important;
        margin-top: 3px !important;
        padding: 2px 0;
        background: #fff;
        border: 1px solid @borderColor  !important;
        border-radius: 0;
        width: 400px;

        .select-tree-scroll {
            .el-scrollbar__wrap {
                margin-bottom: 0 !important;
                max-height: 300px;
                overflow-x: hidden;

                .el-tree {
                    background: transparent;
                    color: @txtColor;

                    .el-tree__empty-block {
                        min-height: 30px;

                        .el-tree__empty-text {
                            // color: #a8e1ec;
                        }
                    }

                    .el-tree-node {
                        &.is-focusable {
                            &>.el-tree-node__content {
                                background: transparent;
                            }
                        }

                        &.is-current {
                            &>.el-tree-node__content {
                                // background: #005470;
                            }
                        }

                        .el-tree-node__content {
                            &:hover {
                                // background: #005470;
                            }
                        }
                    }
                }
            }
        }

        .el-select-dropdown__wrap {
            .el-select-dropdown__list {
                padding: 2px 0;
            }

            .el-select-dropdown__item {
                color: #a8e1ec;
                height: 26px;
                line-height: 26px;

                &:hover,
                &.hover {
                    background: #005470;
                }

                span {
                    line-height: 26px !important;
                }
            }
        }

        .popper__arrow {
            display: none;
        }
    }

    .el-date-range-picker,
    .el-date-picker {
        z-index: 100001 !important;
    }
</style>