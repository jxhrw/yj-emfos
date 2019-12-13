<template>
    <el-scrollbar class="scrollview" :class="{'wdTp':!isCollapse}">
        <el-menu class="el-menu-vertical-demo" @select="handleOpen" background-color="#1F212E" text-color="#646F7D" :default-active="keyPath" active-text-color="#00C187" unique-opened :collapse="isCollapse">
            <i class="menu-collapse" @click="isCollapse=!isCollapse"></i>
            <template v-for="(item, idx) in menus">
                <template v-if="item.checked">
                    <el-submenu v-if="item.children.length>0" :key="idx" :disabled="isabled(item.checked)" :index="getIdx(idx)">
                        <template slot="title">
                            <i class="icon-menu-tools" :class="item.rightElCss"></i>
                            <span slot="title" :class="isabled(item.checked)?'disabled':''">{{item.rightName}}</span>
                        </template>
                        <template v-for="(cItem, cIdx) in item.children">
                            <el-menu-item v-if="cItem.checked" class="el-menu-vertical-demo" :key="cIdx" :index="getIdx(idx,cIdx)" @click="gotoUrl(cItem)">{{cItem.rightName}}</el-menu-item>
                        </template>
                    </el-submenu>
                    <el-menu-item v-else :key="idx" class="el-menu-vertical-demo no-child" :index="getIdx(idx,0)" @click="gotoUrl(item)">
                        <i class="icon-menu-tools" :class="item.rightElCss"></i>
                        <span slot="title" :class="isabled(item.checked)?'disabled':''">{{item.rightName}}</span>
                    </el-menu-item>
                </template>

            </template>



            <!-- <i class="menu-arrow el-icon-d-arrow-left" v-if="!isCollapse" @click="isCollapse=!isCollapse"></i>
        <i class="menu-arrow el-icon-d-arrow-right" v-if="isCollapse" @click="isCollapse=!isCollapse"></i> -->
        </el-menu>
    </el-scrollbar>
</template>
<script>
    import Common from "@/assets/js/common.js";
    import Bus from "@/assets/js/bus.js";
    import img1 from "@/assets/images/icon-menu-1.png";
    import img2 from "@/assets/images/icon-menu-2.png";
    import img3 from "@/assets/images/icon-menu-3.png";
    import img4 from "@/assets/images/icon-menu-4.png";
    import img5 from "@/assets/images/icon-menu-5.png";
    export default {
        props: ["menusList"],
        data() {
            return {
                keyPath: '0',
                isCollapse: false,
                menus: [],
                token: ''
            };
        },
        watch: {
            menusList(val) {
                if (val.length > 0) {
                    this.token = Common.getQueryString("token");
                    let arr = val[0].children || [];
                    arr = arr.filter(val => !!val.checked);
                    for (let i = 0; i < arr.length; i++) {
                        let child = arr[i].children || [];
                        arr[i].children = child.filter(val => !!val.checked);
                    }
                    this.menus = arr;

                    sessionStorage.setItem('menus', JSON.stringify(this.menus));

                    this.keyPath = sessionStorage.getItem("keyPath");
                    if (!this.keyPath) this.keyPath = "0";

                    let m_path = this.getPathByKey(this.keyPath);
                    let url = this.$config.ProjectName + m_path + (m_path.indexOf('?') > -1 ? '&' : '?') + 'token=' + this.token;
                    if (this.getRouteByKey(this.keyPath)) url += `#/${this.getRouteByKey(this.keyPath)}`;
                    let page = sessionStorage.getItem('indexIframe');
                    if (page && page != '') {
                        url = page;
                    }
                    Bus.$emit('index-iframe', url);
                }
            }
        },
        methods: {
            isabled(isabled) {
                return !isabled;
            },
            getIdx(idx, cIdx) {
                return cIdx ? idx + "-" + cIdx : idx + "";
            },
            handleOpen(key, keyPath) {
                sessionStorage.setItem("keyPath", key);
            },
            getPathByKey(key) {
                let arr = key.split("-");
                let one = arr[0];
                let two = arr.length > 1 ? arr[1] : "0";
                let url = '';
                if (this.menus[one].rightUrl) {
                    url = this.menus[one].rightUrl.split(',')[0];
                } else {
                    url = this.menus[one].children[two].rightUrl.split(',')[0];
                }
                return url;
            },
            getRouteByKey(key) {
                let arr = key.split("-");
                let one = arr[0];
                let two = arr.length > 1 ? arr[1] : "0";
                let route = '';
                if (this.menus[one].rightUrl) {
                    route = this.menus[one].rightUrl.split(',')[1] || '';
                } else {
                    route = this.menus[one].children[two].rightUrl.split(',')[1] || '';
                }
                return route;
            },
            gotoUrl(item) {
                if (!item.rightUrl) return;

                let htmlUrl = item.rightUrl.split(',');

                let url = this.$config.ProjectName + htmlUrl[0] + (htmlUrl[0].indexOf('?') > -1 ? '&' : '?') + 'token=' + this.token;
                if (htmlUrl.length > 1) {
                    url += `#/${htmlUrl[1]}`;
                }
                Bus.$emit('index-iframe', url);
                sessionStorage.setItem('indexIframe', '');
                sessionStorage.setItem('tfEquType', '');
                sessionStorage.setItem('tfFacType', '');
                sessionStorage.setItem('staticTab', '');
            }
        },
        mounted() {
            // this.token = Common.getQueryString("token");
            // this.$api.get(`${this.$config.efoms_HOST}/efoms-rest/uums/getRightInfo.htm`, { token: this.token }).then(res => {
            //     if (res.appCode == '0') {
            //         this.menus = res.resultList;
            //         sessionStorage.setItem('menus', JSON.stringify(this.menus));

            //         this.keyPath = sessionStorage.getItem("keyPath");
            //         if (!this.keyPath) this.keyPath = "0";

            //         let m_path = this.getPathByKey(this.keyPath);
            //         let url = this.$config.ProjectName + m_path + (m_path.indexOf('?') > -1 ? '&' : '?') + 'token=' + this.token;
            //         if (this.getRouteByKey(this.keyPath)) url += `#/${this.getRouteByKey(this.keyPath)}`;
            //         let page = sessionStorage.getItem('indexIframe');
            //         if (page && page != '') {
            //             url = page;
            //         }
            //         Bus.$emit('index-iframe', url);
            //     }
            // });
        }
    };
</script>
<style scoped>
    .scrollview.wdTp {
        width: 167px;
    }

    .el-menu-vertical-demo {
        max-width: 150px !important;
        font-size: 12px;
        border-right: none;
        position: relative;
    }

    .el-menu-vertical-demo.wdTp {
        width: 150px;
    }

    .el-menu-vertical-demo.no-child {
        font-size: 14px;
    }

    .menu-collapse {
        background: url('../../assets/images/icon-menu-collapsel.png') no-repeat center;
        width: 100%;
        height: 40px;
        /* overflow: hidden; */
        display: block;
        cursor: pointer;
        background-position-y: 11px;
    }

    .menu-arrow {
        position: absolute;
        width: 18px;
        height: 40px;
        line-height: 40px;
        right: -18px;
        top: 50%;
        transform: translateY(-50%);
        text-align: center;
        background: #1f212e;
        color: #fff;
        cursor: pointer;
    }

    .disabled {
        color: #868d98;
    }

    .icon-menu-tools {
        position: relative;
        width: 20px;
        height: 20px;
        display: inline-block;
        left: 0;
        background: url("") no-repeat;
        /* opacity: 0.5 */
    }

    .icon-menu-tools.menu-map {
        background-image: url('../../assets/images/icon-menu-0.png');
        opacity: 0.5;
    }

    .icon-menu-tools.menu-repair {
        background-image: url('../../assets/images/icon-menu-1.png');
    }

    .icon-menu-tools.menu-inspection {
        background-image: url('../../assets/images/icon-menu-3.png');
    }

    .icon-menu-tools.menu-assets {
        background-image: url('../../assets/images/icon-menu-4.png');
    }

    .icon-menu-tools.menu-statistics {
        background-image: url('../../assets/images/icon-menu-5.png');
    }

    .icon-menu-tools.menu-declare {
        background-image: url('../../assets/images/icon-menu-6.png');
    }

    .icon-menu-tools.menu-examine {
        background-image: url('../../assets/images/icon-menu-7.png');
    }

    .icon-menu-tools.menu-set {
        background-image: url('../../assets/images/icon-menu-2.png');
    }

    .icon-menu-tools.menu-work {
        background-image: url('../../assets/images/icon-menu-8.png');
    }

    .el-submenu .el-menu-item {
        height: 36px !important;
        line-height: 36px !important;
        min-width: auto;
    }

    .el-submenu__icon-arrow {
        position: relative;
    }

    .el-submenu__title span {
        padding-right: 30px;
    }

    .el-menu--popup .el-menu-item {
        height: 36px;
        line-height: 36px
    }

    .el-menu--popup .el-menu-item:focus,
    .el-menu--popup .el-menu-item:hover {
        color: #fff !important;
    }


    .scrollview {
        height: 100%;
        overflow: hidden;
        background-color: rgb(31, 33, 46);
    }

    .scrollview>>>.el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .scrollview>>>.el-scrollbar__bar.is-horizontal {
        display: none;
    }

    .scrollview>>>.el-menu-item,
    .scrollview>>>.el-submenu__title {
        height: 42px;
        line-height: 42px;
    }
</style>
<style>
    @import '../../assets/css/blue.css';
</style>