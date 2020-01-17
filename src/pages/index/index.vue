<template>
    <div class="ej-mian">
        <EJ-Header :userName="userInfo.personName" :title="title"></EJ-Header>
        <EJ-Main :menusDate="userInfo.rightListsEx"></EJ-Main>

        <div style="width:0;overflow:hidden;">
            <audio id="audio" :src="audio" />
        </div>
    </div>
</template>
<script>
    import Header from "components/common/index-header";
    import Main from "components/index/main";
    import Common from "@/assets/js/common.js";
    import Audio from "@/assets/audio/tips.mp3";
    export default {
        name: "Index",
        components: {
            "EJ-Header": Header,
            "EJ-Main": Main
        },
        data() {
            return {
                title: '',
                userInfo: {},
                audio: Audio,
                DOMS: {}, // 弹出的实例集合
                domIndex: 0, // 实例对象的key值
            }
        },
        created() {
            this.getUserInfo();
        },
        mounted() {
            this.tipsPush('EFOMS_OPERATION');
            this.tipsPush('efoms_heartbeat');
            window.myVue = this;
        },
        methods: {
            // 获取用户信息
            getUserInfo() {
                let host = this.$config.efoms_HOST;
                let method = this.$config.selectUser_GET;
                let token = Common.getQueryString("token");
                this.$api.getMethod(host, method, { token: token }, token).then(res => {
                    if (res.appCode == 0) {
                        sessionStorage.setItem("userInfo", JSON.stringify(res.resultList));
                        this.userInfo = res.resultList || {};
                    }

                    this.title = this.userInfo.systemName || '资产运维管理平台';
                    document.title = this.title;
                }).catch(err => {
                    this.title = this.userInfo.systemName || '资产运维管理平台';
                    document.title = this.title;
                });
            },

            // 从杭州运维通里参考
            tipsPush(code) {
                let _this = this;
                ServerPush.receive(code, 'message', (res) => {
                    console.log(res);
                    let arr = res.users || [];
                    let isPower = arr.some(item => { return item == this.userInfo.personId });
                    //NOTICETYPE01待办，NOTICETYPE02通知
                    res.type = res.type == 'NOTICETYPE01' ? '待办' : '通知';
                    if (isPower) {
                        this.domIndex += 1;
                        res.key = this.domIndex;
                        document.getElementById('audio').play();
                        this.DOMS[this.domIndex] = this.$notify({
                            title: `${res.type}消息`,
                            position: 'bottom-right',
                            dangerouslyUseHTMLString: true,
                            duration: 0,
                            message: `<a style="cursor: pointer;" onclick="myVue.onclickNotification('${encodeURIComponent(JSON.stringify(res))}')">${res.content}</a>`,
                            customClass: 'serverpushNotice'
                        });
                    }
                });
            },
            onclickNotification(res) {
                let obj = JSON.parse(decodeURIComponent(res));
                this.DOMS[obj.key].close();

                let entrance = this.getType(obj.class);
                if (entrance == '转单审核') {
                    this.$api.get(`${this.$config.efoms_HOST}/opr/search/page/transfer`, { pageSize: 10, currentPage: 1, type: 0, applyId: obj.wokrorderIds }, { token: Common.getQueryString("token") })
                        .then(res => {
                            if (res.appCode == 0) {
                                let tableData = res.resultList.result || [];
                                if (tableData.length > 0) {
                                    sessionStorage.setItem('transferInfo', JSON.stringify(tableData[0]));
                                    let url = `${this.$config.ProjectName}/hz/index.html?headMenu=hide&token=${this.token}#/detsheet?pre=${entrance}&id=${obj.wokrorderIds}&isread=${obj.type == '待办' ? 'edit' : undefined}`;
                                    Bus.$emit('index-iframe', url);
                                    // this.$router.push({
                                    //     path: '/detsheet',
                                    //     query: { pre: entrance, id: obj.wokrorderIds, isread: obj.type == '待办' ? 'edit' : undefined }
                                    // });
                                }

                            }
                        });
                } else {
                    let url = `${this.$config.ProjectName}/hz/index.html?headMenu=hide&token=${this.token}#/detsheet?pre=${entrance}&id=${obj.wokrorderIds}&isread=${obj.type == '待办' ? 'edit' : undefined}`;
                    Bus.$emit('index-iframe', url);
                    // this.$router.push({
                    //     path: '/detsheet',
                    //     query: { pre: entrance, id: obj.wokrorderIds, isread: obj.type == '待办' ? 'edit' : undefined }
                    // });
                }
            },
            getType(className) {
                //   //================待办子类==================//
                //     MESSAGE_WAIT_DISPATCH("NOTICECLASS02","待下发"),
                //     MESSAGE_WAIT_APPOINT("NOTICECLASS03","待指派"),
                //     MESSAGE_WAIT_ACCEPT("NOTICECLASS04","待接收"),
                //     MESSAGE_WAIT_SURE("NOTICECLASS05","待确认"),
                //     MESSAGE_WAIT_SURE_REJECT("NOTICECLASS06","驳回"), 申请完成的驳回
                //     MESSAGE_WAIT_APPO_REJECT("NOTICECLASS07","退回需下发"),
                //     MESSAGE_WAIT_DISP_REJECT("NOTICECLASS08","退回需指派"),
                //     MESSAGE_WAIT_POSTPONE("NOTICECLASS09","延期申请"),
                //     MESSAGE_WAIT_DEPART("NOTICECLASS10","科室审核"),
                //     MESSAGE_WAIT_SPACE("NOTICECLASS11","处所审核"),
                //     MESSAGE_WAIT_EVALUATE("NOTICECLASS27","待评价"),

                //     MESSAGE_NOTICE_MATERIAL_APPLY("NOTICECLASS28","材料申请"),
                //     MESSAGE_NOTICE_TRANSFER_APPLY("NOTICECLASS31","转单申请"),

                //   //================通知子类类==================//
                //     MESSAGE_NOTICE_AUTO("NOTICECLASS12","自动下发"),
                //     MESSAGE_NOTICE_DISPATCH("NOTICECLASS13","已下发"),
                //     MESSAGE_NOTICE_SURE("NOTICECLASS14","已确认"),
                //     MESSAGE_NOTICE_REACHED("NOTICECLASS15","已到达"),
                //     MESSAGE_NOTICE_TIME("NOTICECLASS16","超时"),
                //     MESSAGE_NOTICE_TIME_WARN("NOTICECLASS17","超时预警"),
                //     MESSAGE_NOTICE_OVER("NOTICECLASS18","已修复"),
                //     MESSAGE_NOTICE_RECOVER("NOTICECLASS19","恢复正常"),
                //     MESSAGE_NOTICE_CLOSE("NOTICECLASS20","关闭"),
                //     MESSAGE_NOTICE_APPLY("NOTICECLASS21","已申报"),
                //     MESSAGE_NOTICE_PRESS("NOTICECLASS22","催办"),
                //     MESSAGE_NOTICE_DELETE("NOTICECLASS23","撤回"),
                //     MESSAGE_NOTICE_SUPER_REJECT("NOTICECLASS24","监理驳回"),
                //     MESSAGE_NOTICE_POST_REJECT("NOTICECLASS25","延期驳回"),
                //     MESSAGE_NOTICE_POST_PASS("NOTICECLASS26","延期审核通过"),

                //     MESSAGE_NOTICE_MATERIAL_PASS("NOTICECLASS29","材料审核通过"),
                //     MESSAGE_NOTICE_MATERIAL_REJECT("NOTICECLASS30","材料审核不通过"),
                //     MESSAGE_NOTICE_TRANSFER_PASS("NOTICECLASS32","转单审核通过"),
                //     MESSAGE_NOTICE_TRANSFER_REJECT("NOTICECLASS33","转单审核不通过"),
                let entrance;
                switch (className) {
                    case 'NOTICECLASS02':
                    case 'NOTICECLASS07':
                        entrance = '工单下发';
                        break;
                    case 'NOTICECLASS03':
                    case 'NOTICECLASS08':
                        entrance = '工单指派';
                        break;
                    case 'NOTICECLASS06':
                    case 'NOTICECLASS04':
                        entrance = '维修处置';
                        break;
                    case 'NOTICECLASS05':
                        entrance = '工单确认';
                        break;
                    case 'NOTICECLASS27':
                        entrance = '工单评价';
                        break;
                    case 'NOTICECLASS09':
                        entrance = '延期审核';
                        break;
                    case 'NOTICECLASS10':
                        entrance = '科室审核';
                        break;
                    case 'NOTICECLASS11':
                        entrance = '处所审核';
                        break;
                    case 'NOTICECLASS28':
                        entrance = '材料审核';
                        break;
                    case 'NOTICECLASS31':
                        entrance = '转单审核';
                        break;
                    default:
                        break;
                }
                return entrance;
            }
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

    body {
        min-width: 1300px;
    }

    .el-menu--popup {
        min-width: 140px;
    }

    .serverpushNotice {
        bottom: 16px !important;
    }
</style>