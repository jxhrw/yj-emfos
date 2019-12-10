<template>
<div class="ej-mian">
  <EJ-Header></EJ-Header>
  <EJ-Main></EJ-Main>
</div>
</template>
<script>
import Header from "components/common/header";
import Main from "components/tfdet/main";
export default {
  name: "Tfdet",
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
