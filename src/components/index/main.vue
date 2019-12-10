<template>
    <div class="ej-main" id="mainBox">
        <EJ-Menu :menusList="menusDate"></EJ-Menu>
        <iframe id="pageIframe" class="page-iframe"></iframe>
        <div style="width:0;overflow:hidden;">
            <audio id="audioDM" :src="audio" />
        </div>
    </div>
</template>
<script>
    import Menu from "components/common/index-menu";
    import Bus from "@/assets/js/bus.js";
    import Audio from "@/assets/audio/tips.mp3";
    export default {
        components: {
            "EJ-Menu": Menu
        },
        props: ['menusDate'],
        data() {
            return {
                path: '',
                audio: Audio
            };
        },
        created() {
            Bus.$on("index-iframe", res => {
                if (res == this.path) {
                    var idObject = document.getElementById('pageIframe');
                    if (idObject != null) idObject.parentNode.removeChild(idObject);
                    var myIframe = document.createElement('iframe');
                    myIframe.src = res;
                    myIframe.id = "pageIframe";
                    myIframe.className = "page-iframe";
                    myIframe.style.width = "100%";
                    myIframe.style.height = "100%";
                    document.getElementById("mainBox").appendChild(myIframe);
                } else {
                    this.path = res;
                    document.getElementById('pageIframe').src = res;
                }
            });
        },
        mounted() {
            this.tipsPush('RPE_SUBMIT_REMIND');
            this.tipsPush('RPE_PRESS_REMIND');
            this.tipsPush('ORDERS_SELL_REMIND');
            this.tipsPush('ORDERS_PRESS_REMIND');
            this.tipsPush('ORDERS_SCHE_TICK_REMIND');
            this.tipsPush('ORDERS_DELAY_REMIND');
            this.tipsPush('ORDERS_FINISHED_REMIND');
            this.tipsPush('ORDERS_DELAY_AUDIT_REMIND');
            this.tipsPush('ORDERS_FINISHED_AUDIT_REMIND');
        },
        methods: {
            tipsPush(code) {
                let _this = this;
                ServerPush.receive(code, 'message', (res) => {
                    document.getElementById('audioDM').play();
                    _this.$notify({
                        title: '消息提醒',
                        position: 'bottom-right',
                        dangerouslyUseHTMLString: true,
                        duration: 15000,
                        message: res[code],
                    });
                });
            }
        }
    };
</script>
<style scoped>
    .ej-main {
        display: flex;
        flex: 1;
        overflow: hidden;
        background-color: #f9fafc;
    }

    .ej-main .ej-menu {
        width: 150px;
    }

    .page-iframe {
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        /*position: absolute;*/
    }
</style>
<style>
    .ej-content-scrollbar {
        height: 100%;
    }

    .ej-content-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    body .el-menu--popup {
        min-width: 140px;
    }

    .serverpushNotice {
        bottom: 16px !important;
    }
</style>