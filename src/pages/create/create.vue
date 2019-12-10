<template>
<div class="ej-mian">
  <EJ-Header></EJ-Header>
  <EJ-Main></EJ-Main>
</div>
</template>
<script>
import Header from "components/common/header";
import Main from "components/create/main";
export default {
  name: "create",
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
