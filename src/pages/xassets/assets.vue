<template>
    <div class="ej-mian">
        <EJ-Header></EJ-Header>
        <EJ-Main></EJ-Main>
    </div>
</template>
<script>
    import Header from "components/common/header";
    import Main from "components/x-assets/main";
    export default {
        name: "Assets",
        components: {
            "EJ-Header": Header,
            "EJ-Main": Main
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

    .ej-content-scrollbar {
        height: 100%;
    }

    .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .el-scrollbar__wrap.el-select-dropdown__wrap {
        overflow-x: scroll;
    }
</style>