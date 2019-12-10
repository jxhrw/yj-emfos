<template>
<div class="ej-mian">
  <EJ-Header></EJ-Header>
  <router-view></router-view>
</div>
</template>
<script>
import Header from "components/common/header";
import Main from "components/tfequ/main";
export default {
  name: "Tfequ",
  components: {
    "EJ-Header": Header,
    "EJ-Main": Main
  }
};
</script>
<style>
@import "../../assets/css/clean.css";
.ej-mian{display: flex;flex-flow: column;height:100%;}
</style>
