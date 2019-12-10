<template>
    <div class="dialog-passing">
        <div class="dialog-main">
            <div class="revoke-reason dialog-flex">
                <div class="dialog-car-desc">
                    <h6 class="dialog-car-color" :class="dataInfo.vehicle_plate_color">{{dataInfo.vehicle_plate}}</h6>
                    <p>时间：<span>{{dataInfo.pass_time}}</span></p>
                    <p>车道：<span>{{dataInfo.lane_id}}</span></p>
                    <p>车速：<span>{{dataInfo.speed||0}}km/h</span></p>
                    <p>车牌：<span>{{dataInfo.vehicle_plate_type_name}}</span></p>
                    <p>颜色：<span class="dialog-red">{{dataInfo.vehicle_color_name}}</span></p>
                </div>
                <div class="dialog-car-img" :style="{'background-image':'url('+ dataInfo.pic_url1 +')'}"></div>
            </div>
            <div>
                <div class="dialog-table-flex dialog-table-title">
                    <span class="dialog-col1">号牌号码</span>
                    <span class="dialog-col2">过车时间</span>
                    <span class="dialog-col3">车道号</span>
                </div>
                <el-scrollbar class="dialog-scrollbar">
                    <ul>
                        <template v-for="(item, index) in dataList">
                            <li :key="index" class="dialog-table-flex" @click="chooseItem(item)">
                                <span class="dialog-col1">
                                    <h6 class="dialog-car-color" :class="item.vehicle_plate_color">{{item.vehicle_plate}}</h6>
                                </span>
                                <span class="dialog-col2">{{item.pass_time}}</span>
                                <span class="dialog-col3">{{item.lane_id}}</span>
                            </li>
                        </template>
                    </ul>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>
<script>
import Common from "@/assets/js/common.js";
import Bus from "@/assets/js/bus.js";
export default {
    props: {
        id: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            default: ""
        },
        devInfo: {
            type: Object,
            default: function () {
                return {};
            }
        }
    },
    data() {
        return {
            token: '',
            dataInfo: {},
            dataList: []
        };
    },
    mounted() {
        this.token = Common.getQueryString("token");
        // this.getPageVehSearFuc(this.devInfo.devId);
        // this.getPageVehSearFuc("36042800000014");
    },
    methods: {
        closeRepair() {
            Bus.$emit("passing-" + this.id, false);
        },
        chooseItem(item) {
            this.dataInfo = item;
        },
        getPageVehSearFuc(id) {
            let host = this.$config.efoms_HOST;
            let method = '/otherSystem/getPageVehSear';
            let queryConditions = {
                bayonetId: id,
                token: this.token,
                pageSize: 20,
                currentPage: 1
            };
            this.$api.getMethod(host, method, queryConditions, this.token)
            .then(res => {
                if (res.appCode == 0) {
                    this.dataList = res.resultList;
                    this.dataInfo = this.dataList && this.dataList.length > 0 ? this.dataList[0] : {};
                } else {
                    Common.printErrorLog(host, method);
                }
            })
            .catch(err => {
            Common.printErrorLog(host, method);
            console.log(err);
            });
        }
    }
};
</script>

<style scoped>
.dialog-passing .dialog-main{margin-top: -30px;padding: 10px 0 20px 0;border-top:1px solid #EBEFF1;}
.dialog-passing .dialog-main .dialog-label{float: left;font-size: 12px;margin-right: 8px;width: 48px;text-align: right;line-height: 28px;}
.dialog-passing .dialog-main .revoke-reason{margin-bottom: 13px;}
.dialog-passing .dialog-main .dialog-content{background: #F9FAFC;border: 1px solid #E1E7ED;}
.dialog-passing .dialog-main .content-select{width: 303px;}
.dialog-passing .dialog-main .dialog-flex{display: flex;justify-content: space-between;}
.dialog-passing .dialog-main .dialog-car-desc{font-size: 12px;
color: #737E84;line-height: 20px;}
.dialog-passing .dialog-main .dialog-car-desc p{overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
.dialog-passing .dialog-main .dialog-car-img{width: 215px;height: 118px;background: #E1E7ED no-repeat center/contain;}
.dialog-passing .dialog-main h6.dialog-car-color{border-radius: 2px;width: 73px;height: 19px;line-height: 19px;text-align: center;}
.dialog-passing .dialog-main h6.PLATECOLOR01{background: #FFFFFF;color: #22262E;border: 1px solid #999;}
.dialog-passing .dialog-main h6.PLATECOLOR02{background: #6BA1EB;color: #FFFFFF;}
.dialog-passing .dialog-main h6.PLATECOLOR03{background: #FFD55C;color: #22262E;}
.dialog-passing .dialog-main h6.PLATECOLOR04{background: #22262E;color: #FFFFFF;}
.dialog-passing .dialog-main h6.PLATECOLOR05{background: #00c187;color: #FFFFFF;}
.dialog-passing .dialog-main h6.PLATECOLOR06{background: #6BA1EB;color: #FFFFFF;}
.dialog-passing .dialog-main h6.PLATECOLOR07{background: #FFFFFF;color: rgb(255, 105, 5);}
.dialog-passing .dialog-main h6.PLATECOLOR08{background: #00c187;color: #FFFFFF;}
.dialog-passing .dialog-main h6.PLATECOLOR09{background: #00c187;color: #FFFFFF;}
.dialog-passing .dialog-main .dialog-table-title{height: 24px;}
.dialog-passing .dialog-main .dialog-table-flex{display: flex;justify-content: space-around;align-items: center;font-size: 12px;
color: #737E84;}
.dialog-passing .dialog-main .dialog-table-flex .dialog-col1{width: 25%;}
.dialog-passing .dialog-main .dialog-table-flex .dialog-col2{width: 38%;text-align: center;}
.dialog-passing .dialog-main .dialog-table-flex .dialog-col3{width: 15%;text-align: center;}
.dialog-passing .dialog-main li{background: #F9FAFC;height: 28px;color: #252F5A;border: 1px solid #EEEEEE;box-shadow: 0 2px 5px 0 rgba(9,69,116,0.05);border-radius: 4px;margin-top: 8px;cursor: pointer;}
.dialog-passing .dialog-main li:first-child{margin: 0;}
/* .dialog-passing .dialog-main .dialog-red{color: rgb(255, 105, 5);} */
.dialog-passing >>> .dialog-main .el-input__inner{border-radius: 0;background: #F9FAFC;border: 1px solid #E1E7ED;}
.dialog-passing >>> .dialog-main .el-input__suffix{border-left: 1px solid #E1E7ED;}

.dialog-passing .dialog-footer{text-align: center;}
.dialog-passing .dialog-footer .submit{margin-right: 20px;background: #00C187;border-color: #E1E7ED;}
.dialog-passing .dialog-footer .submit:hover{background: #00C187;border-color: #E1E7ED;}
.dialog-passing .dialog-footer .cancel{background: #F9FAFC;border-color: #E1E7ED;color: #6C7883;}
.dialog-passing .dialog-footer .cancel:hover{background: #F9FAFC;border-color: #E1E7ED;color: #6C7883;}

.dialog-scrollbar{height: 150px;margin-top: 8px;}
.dialog-scrollbar >>> .el-scrollbar__wrap{margin-bottom: 0!important;}
</style>
