<template>
    <div class="ej-main">
        <EJ-Menu></EJ-Menu>
        <div class="ej-content">
            <div class="ej-content-title">
                <!-- <h2>{{title}}</h2> -->
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="巡检日志" name="first"></el-tab-pane>
                    <el-tab-pane label="巡检报表" name="second"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="ej-content-main" v-show="activeName=='first'">
                <el-scrollbar class="ej-content-scrollbar">
                    <EJ-BaseInfo></EJ-BaseInfo>
                    <EJ-Depiction></EJ-Depiction>
                </el-scrollbar>
            </div>
            <EJ-Report v-show="activeName=='second'"></EJ-Report>

        </div>
    </div>
</template>
<script>
    import Menu from "components/common/menu";
    import BaseInfo from "components/journal/baseInfo";
    import Depiction from "components/journal/depiction";
    import Report from "components/journal/report";
    export default {
        components: {
            "EJ-Menu": Menu,
            "EJ-BaseInfo": BaseInfo,
            "EJ-Depiction": Depiction,
            "EJ-Report": Report
        },
        data() {
            return {
                title: "巡检日志",
                activeName: 'first'
            };
        },
        methods: {
            handleClick() {

            }
        }
    };
</script>
<style lang="less" scoped>
    @import "../../assets/css/main.css";

    .ej-content-title {
        padding: 0 30px;

        /deep/ .el-tabs__item {
            &.is-active,
            &:hover {
                color: #00875F;
            }
        }

        /deep/ .el-tabs__active-bar {
            background-color: #00875F;
        }
    }
</style>
<style>
    .ej-content-scrollbar {
        height: 100%;
    }

    .ej-content-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>