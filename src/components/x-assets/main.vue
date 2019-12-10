<template>
    <div class="ej-main">
        <EJ-Menu></EJ-Menu>
        <router-view></router-view>
    </div>
</template>
<script>
    import Menu from "components/common/menu";
    export default {
        components: {
            "EJ-Menu": Menu,
        },
        data() {
            return {
                title: "资产维护"
            };
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
    }
</style>