<template>
    <div class="ej-main">
        <EJ-Menu></EJ-Menu>
        <div class="ej-content">
            <div class="ej-content-title">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="卡口数据接收监测" name="first"></el-tab-pane>
                    <el-tab-pane label="卡口数据上传监测" name="second"></el-tab-pane>
                    <!-- <el-tab-pane label="视频联网监测统计" name="third"></el-tab-pane> -->
                </el-tabs>
            </div>
            <Receive v-show="activeName=='first'" ref="receive"></Receive>
            <Upload v-show="activeName=='second'" ref="upload"></Upload>
            <Networked v-show="activeName=='third'" ref="networked"></Networked>

        </div>
    </div>
</template>
<script>
    import Menu from "components/common/menu";
    import Receive from "./data_receive";
    import Upload from "./data_upload";
    import Networked from "./data_networked";
    export default {
        components: {
            "EJ-Menu": Menu,
            Receive,
            Upload,
            Networked
        },
        data() {
            return {
                activeName: ''
            };
        },
        watch: {
            activeName(val) {
                sessionStorage.setItem('staticTab', val);
                if (val == 'first') {
                    this.$refs.receive.echatsVisable = true;
                }
                if (val == 'second') {
                    this.$refs.upload.echatsVisable = true;
                }
            }
        },
        mounted() {
            this.activeName = sessionStorage.getItem('staticTab') || 'first';
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
    @import "../../assets/css/tableHeight.css";

    .ej-content-scrollbar {
        height: 100%;
    }

    .ej-content-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .region-popper {
        width: 220px;
        padding: 5px 0;
    }

    .content-table table thead th.active>.cell {
        color: #333 !important;
        font-weight: bold;
    }
</style>