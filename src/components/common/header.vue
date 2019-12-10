<template>
<header class="ej-header">
    <h1>{{title}}</h1>
    <div class="ej-user">
        <div class="user-img">
            <img :src="userHearder" :onerror="defaultImg">

        </div>
        <div class="user-name">{{userName}}</div>
    </div>
</header>
</template>
<script>
import Common from "@/assets/js/common.js";
export default {
    data() {
        return {
            title: '设备设施运维平台',
            defaultImg: 'this.src="' + require('../../assets/images/icon-user-header.png') + '"',
            userHearder: '',
            userName: '',
            date: ''
        };
    },
    watch: {
        date(newVal, oldVal) {
            sessionStorage.setItem("serviceTime", newVal);
        }
    },
    mounted() {
        this.date = (new Date()).getTime(); // 默认本地时间
        // this.getUserInfo();
        // this.getDateInfo();
        // let timeCount = setInterval(() => {
        //     this.date += 1000;
        // }, 1000);
    },
    methods: {
        // 查询服务器时间信息
        getDateInfo() {
            let host = this.$config.efoms_HOST;
            let method = '/date/getServiceTimeReal';
            let token = Common.getQueryString("token");
            this.$api.getMethod(host, method, {}, token).then(res => {
                if (res.appCode == 0) {
                    this.date = (new Date(res.resultList.time)).getTime();
                }
            });
        },
        // 获取用户信息
        getUserInfo() {
            let host = this.$config.efoms_HOST;
            let method = '/userCheck/selectUser';
            let token = Common.getQueryString("token");
            this.$api.getMethod(host, method, {token: token}, token).then(res => {
                if (res.appCode == 0) {
                    this.userName = res.resultList.personName;
                }
            });
        }
    }
};
</script>
<style scoped>
.ej-header{display: flex;flex-flow:  row nowrap;justify-content: space-between;background: #272C38;min-height: 58px; bottom: 0;left: 0;top: 0;right: 0;display: none;}
.ej-header h1{margin-top: 19px;margin-left: 40px;font-size: 20px;line-height: 20px;color: #FFFFFF;}
.ej-header .ej-user{display: flex; margin-top: 18px;margin-right: 70px;cursor: pointer;}
.ej-header .ej-user::after{content: '';margin-left: 10px;margin-top: 11px;border-width: 4px 4px 0;border-style: solid;border-color: #BAF1FA transparent transparent;}
.ej-header .ej-user .user-img{width: 22px;height: 22px;}
.ej-header .ej-user .user-img img{width: 22px;height: 22px;}
.ej-header .ej-user .user-name{color: #FFFFFF;margin-left: 10px;}
</style>
