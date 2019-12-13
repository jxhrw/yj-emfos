<template>
    <div class="ej-mian">
        <EJ-Header></EJ-Header>
        <router-view></router-view>
    </div>
</template>
<script>
    import Header from "components/common/header";
    export default {
        name: "Journal",
        components: {
            "EJ-Header": Header
        }
    };
</script>
<style>
    @import "../../assets/css/clean.css";

    .ej-mian {
        display: flex;
        flex-flow: column;
        height: 100%;
    }

    .base-info .content label.el-radio {
        width: 80px !important;
    }
</style>