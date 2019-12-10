<template>
    <div class="clear-float page-box-info">
        <label for="" class="float-left">共{{zjTotalCount}}条</label>
        <div class="content-page">
            <div class="page-frist" @click="fristPage">
                <p>首页</p>
            </div>
            <div class="my-el-page">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="zjCurrentPage" layout="prev, pager, next" :total="zjTotalCount" :page-size="zjPageSize" prev-text='上一页' next-text='下一页' :background='true' :small='true'>
                </el-pagination>
            </div>
            <div class="page-frist" @click="endPage">
                <p>尾页</p>
            </div>
            <div class="page-size">
                <label for="">每页</label>
                <el-select v-model="zjPageSize" placeholder="请选择" size='mini' class="page-select">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
    </div>

</template>
<script>
    // 组件说明：
    // id：需要关联分页的模块组件，用于接收数据变动的值
    // pageSize：每页条数   （默认为10可不传）
    // totalCount：数据总条数
    // currentPage：当前页码   （默认为1可不传）
    // totalPage：总页码
    // queryConditions：分页的查询条件
    // hostName:分页接口的域名
    // methodsName:分页接口的方法名
    // axiosType:数据传参方式
    import Common from "@/assets/js/common.js";
    import Bus from "@/assets/js/bus.js";
    export default {
        props: {
            id: {
                type: String,
                default: ""
            },
            pageSize: {
                type: Number,
                default: 10
            },
            totalCount: {
                type: Number,
                default: 0
            },
            currentPage: {
                type: Number,
                default: 1
            },
            totalPage: {
                type: Number,
                default: 1
            },
            queryConditions: {
                type: Object,
                default: function() {
                    return {};
                }
            },
            hostName: {
                type: String,
                default: ""
            },
            methodsName: {
                type: String,
                default: ""
            },
            axiosType: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                options: [{
                        value: 10,
                        label: 10
                    },
                    {
                        value: 20,
                        label: 20
                    },
                    {
                        value: 30,
                        label: 30
                    },
                    {
                        value: 40,
                        label: 40
                    },
                    {
                        value: 50,
                        label: 50
                    }
                ],
                token: "",
                zjPageSize: 10, // 传入的值不让修改，不然会报错，所以重新定义组件用值
                zjTotalPage: 1,
                zjTotalCount: 0,
                zjCurrentPage: 1
            };
        },
        watch: {
            zjPageSize(newVal, oldVal) {
                this.queryConditions.pageSize = newVal;
                this.selectRepairsInfoPage();
            },
            currentPage(newVal, oldVal) {
                this.zjCurrentPage = newVal;
            },
            pageSize(newVal, oldVal) {
                this.zjPageSize = newVal;
            },
            totalPage(newVal, oldVal) {
                this.zjTotalPage = newVal;
            },
            totalCount(newVal, oldVal) {
                this.zjTotalCount = newVal;
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.resetVal();
        },
        methods: {
            // 传入赋值
            resetVal() {
                this.zjCurrentPage = this.currentPage;
                this.zjPageSize = this.pageSize;
                this.zjTotalPage = this.totalPage;
                this.zjTotalCount = this.totalCount;
            },
            handleCurrentChange(e) {
                this.queryConditions.currentPage = e;
                this.selectRepairsInfoPage();
            },
            fristPage() {
                this.zjCurrentPage = 1;
                this.queryConditions.currentPage = 1;
                this.selectRepairsInfoPage();
            },
            endPage() {
                this.zjCurrentPage = this.zjTotalPage;
                this.queryConditions.currentPage = this.zjTotalPage;
                this.selectRepairsInfoPage();
            },
            selectRepairsInfoPage() {
                // queryConditions 为父组件传入,为引用变量,变动会使父组件的值一起变
                this.$emit('pageAsk');
            }
        }
    };
</script>
<style scoped>
    .clear-float {
        margin-top: 15px;
    }

    .clear-float::after {
        content: "";
        display: block;
        height: 0;
        clear: both;
    }

    label.float-left {
        font-size: 12px;
        color: #929CA2;
    }

    .page-box-info .content-page {
        float: right;
        white-space: nowrap;
        max-width: 80%;
        overflow-x: auto;
        overflow-y: hidden;
    }

    .page-box-info .content-page .page-frist {
        box-sizing: border-box;
        display: inline-block;
        width: 38px;
        font-size: 12px;
        height: 22px;
        text-align: center;
        line-height: 22px;
        background: #F9FAFC;
        border: 1px solid #E1E7ED;
        cursor: pointer;
    }

    .page-box-info .content-page .page-frist p {
        font-size: 12px;
        color: #929CA2;
    }

    .page-box-info .content-page .page-size {
        display: inline-block;
    }

    .page-box-info .content-page .page-size label {
        font-size: 12px;
        color: #929CA2;
        width: 24px;
        margin-left: 13px;
        margin-right: 6px;
    }

    .page-box-info .content-page .page-size .page-select {
        width: 50px;
    }

    .page-box-info .content-page .my-el-page {
        display: inline-block;
    }

    .page-box-info .content-page .my-el-page>>>.el-pagination {
        padding: 0;
    }

    .page-box-info .content-page .my-el-page>>>.el-pagination.is-background .el-pager li {
        font-weight: lighter;
        border-right: 0;
        border-radius: 0;
    }

    .page-box-info .content-page .my-el-page>>>.el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #00C187;
        color: #fff;
    }

    .page-box-info .content-page .my-el-page>>>.el-pagination.is-background .el-pager li:not(.disabled):hover {
        color: #000000;
    }

    .page-box-info .content-page .my-el-page>>>.el-pagination.is-background .btn-next,
    .page-box-info .content-page .my-el-page>>>.el-pagination.is-background .btn-prev,
    .page-box-info .content-page .my-el-page>>>.el-pagination.is-background .el-pager li {
        background-color: #F9FAFC;
        color: #929CA2;
        border: 1px solid #E1E7ED;
    }

    .page-box-info .content-page .my-el-page>>>.el-pagination button,
    .page-box-info .content-page .my-el-page>>>.el-pagination span:not([class*=suffix]) {
        font-size: 12px;
        min-width: 50px;
    }

    .page-box-info .content-page .my-el-page>>>.el-pagination.is-background.el-pagination--small .btn-next,
    .page-box-info .content-page .my-el-page>>>.el-pagination.is-background.el-pagination--small .btn-prev,
    .page-box-info .content-page .my-el-page>>>.el-pagination.is-background.el-pagination--small .el-pager li {
        margin: 0px;
    }

    .page-box-info .content-page .page-size .page-select>>>.el-input--mini .el-input__inner {
        padding: 0 5px;
        color: #929CA2;
        border: 1px solid #E1E7ED;
        height: 22px;
        line-height: 22px;
    }
</style>