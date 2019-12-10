<template>
    <div class="ej-main">
        <EJ-Menu></EJ-Menu>
        <div class="ej-content">
            <div class="ej-content-title">
                <h2>{{title}}</h2>
                <div>
                    <div class="ej-content-goto" @click="gotoVdls">
                        <p>列表模式</p>
                    </div>
                </div>
            </div>
            <div class="ej-content-main">
                <el-scrollbar class="ej-content-scrollbar">
                    <el-row class="ej-content-row">
                        <el-col :span="6">
                            <!-- <el-scrollbar class="ej-content-scrollbar"> -->
                            <EJ-BaseInfo></EJ-BaseInfo>
                            <!-- </el-scrollbar> -->
                        </el-col>
                        <el-col :span="18">
                            <EJ-Depiction></EJ-Depiction>
                        </el-col>
                    </el-row>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>
<script>
    import Menu from "components/common/menu";
    import BaseInfo from "components/insvdmd/baseInfo";
    import Depiction from "components/insvdmd/depiction";
    import Common from "@/assets/js/common.js";
    import Bus from "@/assets/js/bus.js";
    export default {
        components: {
            "EJ-Menu": Menu,
            "EJ-BaseInfo": BaseInfo,
            "EJ-Depiction": Depiction
        },
        data() {
            return {
                title: "巡检-视频"
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
        },
        methods: {
            gotoVdls() {
                let url = this.$config.ProjectName + "/inspection.html?token=" + this.token + "#/insvd";
                sessionStorage.setItem('indexIframe', url);
                window.location.href = url;
            }
        }
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
        margin-bottom: 0 !important;
    }
</style>