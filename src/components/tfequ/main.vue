<template>
    <div class="ej-main">
        <EJ-Menu></EJ-Menu>
        <div class="ej-content">
            <div class="ej-content-title">
                <h2>{{title}}</h2>
                <div v-show="mapBtn=='assetsMap'">
                    <div class="ej-content-goto" @click="gotoMap">
                        <p>地图模式</p>
                    </div>
                </div>
            </div>
            <div class="ej-content-main">
                <el-scrollbar class="ej-content-scrollbar">
                    <EJ-BaseInfo></EJ-BaseInfo>
                    <EJ-Depiction></EJ-Depiction>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>
<script>
    import Menu from "components/common/menu";
    import BaseInfo from "components/tfequ/baseInfo";
    import Depiction from "components/tfequ/depiction";
    import Common from "@/assets/js/common.js";
    export default {
        components: {
            "EJ-Menu": Menu,
            "EJ-BaseInfo": BaseInfo,
            "EJ-Depiction": Depiction
        },
        data() {
            return {
                title: "交通设备",
                token: '',
                mapBtn: ''
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.mapBtn = Common.getPageUrlEl();
        },
        methods: {
            gotoMap() {
                window.location.href = `./assets.html?token=${this.token}#/mapMain`;
            }
        },
    };
</script>
<style scoped>
    @import "../../assets/css/main.css";
</style>
<style>
    .ej-content-scrollbar {
        height: 100%;
    }

    .ej-content-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>