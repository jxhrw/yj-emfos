<template>
    <div class="ej-content">
        <div class="ej-content-title">
            <h2>资产维护</h2>
        </div>
        <div class="ej-content-main">
            <div class="ej-content-left" :style="{'width':rightVisible?'300px':'0'}">
                <div class="left-content">
                    <h4>信号机 <i class="left-close el-icon-arrow-left" @click="rightVisible=false"></i></h4>
                    <div class="select-box">
                        <el-select v-model="screenSelect" placeholder="筛选">
                            <el-option v-for="item in screenList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="catalogSelect" placeholder="目录">
                            <el-option v-for="item in catalogList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-box">
                        <el-input v-model="keywd" placeholder="编码、名称、品牌"></el-input>
                        <i class="el-icon-search"></i>
                    </div>
                    <el-scrollbar class="left-scroll">
                        <div class="contt">
                            <el-tree :data="data" :props="defaultProps" accordion @node-click="handleNodeClick">
                            </el-tree>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
            <div class="ej-content-right">
                <div class="m-map" id="mapLocation"></div>
                <ul class="overview">
                    <li v-for="(item,index) in allList" :key="index">
                        <p @click="infoVisible=true;locationVisible=false;" class="all" :class="item.class"><span>{{item.name}}</span><span>{{item.num}}</span></p>
                        <p class="subdivide">
                            <i class="el-icon-arrow-right"></i>
                            <span class="zc">{{item.zc}}</span>
                            <span class="yb">{{item.yb}}</span>
                            <span class="wz">{{item.wz}}</span>
                            <i class="el-icon-d-arrow-right curpoint" @click="rightVisible=true"></i>
                        </p>
                    </li>
                </ul>
                <div class="map-right">
                    <ul class="select-type">
                        <li>
                            <span class="zc">1234</span>
                            <el-checkbox v-model="checkZC"></el-checkbox>
                        </li>
                        <li>
                            <span class="yb">1234</span>
                            <el-checkbox v-model="checkYB"></el-checkbox>
                        </li>
                        <li>
                            <span class="wz">1234</span>
                            <el-checkbox v-model="checkWZ"></el-checkbox>
                        </li>
                    </ul>
                    <div class="info-box" :style="{'width':infoVisible?'300px':'0'}">
                        <div class="info-header">
                            <i v-show="!locationVisible" class="hd-left el-icon-location" @click="locationVisible=true"></i>
                            <div style="width:0;height:0;"></div>
                            <i class="hb-right el-icon-close" @click="infoVisible=false;"></i>
                        </div>
                        <template v-if="!locationVisible">
                            <h6 class="info-title">井冈山大道-解放路路口</h6>
                            <el-scrollbar class="ej-scroll-content">
                                <div class="info-scroll">
                                    <div v-loading="imgLoading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)">
                                        <img :src="imgShowUrl" alt="图像信息" @click="imgLarge">
                                        <div style="width:0;height:0;overflow:hidden;">
                                            <viewer :images="imgFiles">
                                                <img id="imgId" :src="imgShowUrl">
                                            </viewer>
                                        </div>
                                    </div>

                                    <ul>
                                        <li>
                                            <label>建设时间</label>
                                            <span>2018年10月01日</span>
                                        </li>
                                        <li>
                                            <label>建设项目</label>
                                            <span>2018年10月01日</span>
                                        </li>
                                        <li>
                                            <label>管理部门</label>
                                            <span>2018年10月01日</span>
                                        </li>
                                        <li>
                                            <label>生产厂家</label>
                                            <span>2018年10月01日</span>
                                        </li>
                                        <li>
                                            <label>责任人</label>
                                            <span>2018年10月01日</span>
                                        </li>
                                        <li>
                                            <label>维护日期</label>
                                            <span>2018年10月01日</span>
                                        </li>
                                        <li>
                                            <label>运维单位</label>
                                            <span>2018年10月01日</span>
                                        </li>
                                        <li>
                                            <label>设备状态</label>
                                            <span>2018年10月01日</span>
                                        </li>
                                        <li>
                                            <label>辖区</label>
                                            <span>2018年10月01日</span>
                                        </li>
                                        <li>
                                            <label>质保期</label>
                                            <span>2018年10月01日</span>
                                        </li>
                                    </ul>
                                </div>
                            </el-scrollbar>
                        </template>
                        <template v-if="locationVisible">
                            <h6 class="info-title" style="margin-top:20px;">当前坐标<span>可通过拖拽图标或者输入坐标来重新定位</span></h6>
                            <el-scrollbar class="ej-scroll-content">
                                <div class="info-scroll">
                                    <ul style="margin-top:10px;">
                                        <li>
                                            <label class="balck">&nbsp;&nbsp;经度</label>
                                            <el-input v-model="longitude" placeholder=""></el-input>
                                        </li>
                                        <li>
                                            <label class="balck">&nbsp;&nbsp;纬度</label>
                                            <el-input v-model="latitude" placeholder=""></el-input>
                                        </li>
                                    </ul>
                                    <div class="info-btns">
                                        <el-button class="save">保存</el-button>
                                        <el-button class="back" @click="locationVisible=false">返回</el-button>
                                        <el-button class="back">还原</el-button>
                                    </div>
                                </div>
                            </el-scrollbar>
                        </template>
                    </div>
                </div>

            </div>
        </div>


    </div>
</template>
<script>
    let _map;
    export default {
        data() {
            return {
                allList: [],
                imgLoading: false,
                imgShowUrl: '',
                imgFiles: [],
                infoVisible: false,
                rightVisible: false,
                locationVisible: false,
                screenSelect: '',
                screenList: [],
                catalogSelect: '',
                catalogList: [],
                keywd: '',
                longitude: '',
                latitude: '',
                checkZC: '',
                checkYB: '',
                checkWZ: '',
                data: [{
                    label: '一级 1',
                    children: [{
                        label: '二级 1-1',
                        children: [{
                            label: '三级 1-1-1'
                        }]
                    }]
                }, {
                    label: '一级 2',
                    children: [{
                        label: '二级 2-1',
                        children: [{
                            label: '三级 2-1-1'
                        }]
                    }, {
                        label: '二级 2-2',
                        children: [{
                            label: '三级 2-2-1'
                        }]
                    }]
                }, {
                    label: '一级 3',
                    children: [{
                        label: '二级 3-1',
                        children: [{
                            label: '三级 3-1-1'
                        }]
                    }, {
                        label: '二级 3-2',
                        children: [{
                            label: '三级 3-2-1'
                        }]
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        created() {
            this.allList = [{
                    name: '信号机',
                    type: '',
                    num: 15544,
                    class: 'xh',
                    zc: '1111',
                    yb: '222',
                    wz: '1234'
                },
                {
                    name: '视频',
                    type: '',
                    num: 15544,
                    class: 'vd',
                    zc: '1111',
                    yb: '222',
                    wz: '1234'
                },
                {
                    name: '卡口',
                    type: '',
                    num: 31,
                    class: 'kk',
                    zc: '1111',
                    yb: '222',
                    wz: '1234'
                },
                {
                    name: '电警',
                    type: '',
                    num: 3111,
                    class: 'dj',
                    zc: '1111',
                    yb: '222',
                    wz: '1234'
                },
                {
                    name: '地磁',
                    type: '',
                    num: 312,
                    class: 'dc',
                    zc: '1111',
                    yb: '222',
                    wz: '1234'
                },
                {
                    name: '微波',
                    type: '',
                    num: 15544,
                    class: 'wb',
                    zc: '1111',
                    yb: '222',
                    wz: '1234'
                },
                {
                    name: '线圈',
                    type: '',
                    num: 15544,
                    class: 'xq',
                    zc: '1111',
                    yb: '222',
                    wz: '1234'
                },
                {
                    name: '诱导屏',
                    type: '',
                    num: 15544,
                    class: 'yd',
                    zc: '1111',
                    yb: '222',
                    wz: '1234'
                },
                {
                    name: '视频检测',
                    type: '',
                    num: 15544,
                    class: 'vdjc',
                    zc: '1111',
                    yb: '222',
                    wz: '1234'
                },
                {
                    name: '交通标志',
                    type: '',
                    num: 15544,
                    class: 'jtbz',
                    zc: '1111',
                    yb: '222',
                    wz: '1234'
                },
                {
                    name: '交通标线',
                    type: '',
                    num: 15544,
                    class: 'jtbx',
                    zc: '1111',
                    yb: '222',
                    wz: '1234'
                },
                {
                    name: '交通护栏',
                    type: '',
                    num: 15544,
                    class: 'jthl',
                    zc: '1111',
                    yb: '222',
                    wz: '1234'
                }
            ];
        },
        mounted() {
            this.$nextTick(() => {
                this.initMap();
            });

            this.imgShowUrl = 'http://172.100.102.39:8081/idcs-web/common/picView.jsp?path=http://172.100.100.53:6120/pic?=d99i653e*802i20b-79270a-61d64b687b07eeidb4*=0d0*59d8i*s1d=i4p2t=pe*m5i15=-160232-83z9b8s=3e2ad6&amp;token=260901f6-f75c-4086-b6ae-5714e4bdcfe9';
        },
        watch: {
            imgShowUrl(val) {
                let newImg = new Image();
                newImg.src = val;
                this.imgLoading = true;
                newImg.onerror = () => { // 图片加载错误时的替换图片
                    this.imgLoading = false;
                }
                newImg.onload = () => { // 图片加载成功后把地址给原来的img
                    this.imgLoading = false;
                }
            }
        },
        methods: {
            handleNodeClick(data) {
                console.log(data);
            },
            repair() {
                this.$emit('repair');
            },
            checkAnother(type) {
                this.$emit('another', type);
            },
            initMap() {
                var _this = this;
                let _layer = "自定义地图";
                _map = new EJMap("mapLocation", {
                    zoom: 4,
                    // toolbar: true, // 是否显示常用工具组件
                    // zoomSlider: true, // 缩放控件
                    // scalebar: true, // 比例尺控件
                    // navigationbar: true, // 是否显示鱼骨
                    config: this.$config.mapConfigAssets
                });
                _map.addEventListener(EJMap.Event.onLayerAdded, function(e) {
                    _map.setLayerVisibleById(_layer, false);
                    // if (e.layer.id == _layer) {
                    //     _map.setLayerVisibleById(_layer, false);
                    // }

                    // document.getElementById('mapLocation_layers').style = "cursor: url('http://192.168.56.92:1009/favicon.ico'), default;"
                });
                this.isHaveMap = true;
            },
            imgLarge() {
                this.imgFiles = [];
                if (this.imgShowUrl) {
                    this.imgFiles.push(this.imgShowUrl);
                    setTimeout(() => {
                        document.getElementById('imgId').click();
                    }, 300);
                }
            },
        }
    }
</script>
<style lang="less" scoped>
    @import './assets.less';
</style>