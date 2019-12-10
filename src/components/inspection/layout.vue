<template>
    <div class="layout">
        <div class="ej-content-title">
            <slot name='pageTitle'></slot>
        </div>
        <div class="search-box">
            <div class="search-bg">
                <slot name='search'></slot>
            </div>
        </div>
        <div class="ej-content-main">
            <div class="ej-content-left">
                <div class="left-title">
                    <slot name='leftTitle'></slot>
                </div>
                <div class="left-content">
                    <slot name='resultScreen'></slot>
                    <el-scrollbar class="ej-content-scrollbar table-srcoll">
                        <slot name='leftTable'></slot>
                    </el-scrollbar>
                    <slot name='leftPage'></slot>
                </div>
            </div>
            <div class="ej-content-right">
                <div class="right-content">
                    <slot name="rightTabs"></slot>
                </div>
                <div class="right-base">
                    <h6>基础信息</h6>
                    <slot name="rightBase"></slot>
                </div>
                <div class="right-foot">
                    <!-- <slot name="footBtns"></slot> -->
                    <div class="foot-btn">
                        <el-button @click="repair" :class="{'noClick':isRepaired}">{{isRepaired?'已':''}}报修</el-button>
                    </div>
                    <div class="foot-btn">
                        <el-button @click="checkAnother('prev')">上一个</el-button>
                        <el-button @click="checkAnother('next')">下一个</el-button>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>
<script>
    export default {
        props: {
            isRepaired: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            repair() {
                this.$emit('repair');
            },
            checkAnother(type) {
                this.$emit('another', type);
            }
        }
    }
</script>
<style lang="less" scoped>
    .layout {
        display: flex;
        flex-flow: column;
        flex: 1;
        overflow: hidden;
    }

    .ej-content {
        .ej-content-title {
            height: 40px;
            min-height: 40px;
            background: #E1E7EB;
            display: flex;
            justify-content: space-between;
            align-items: center;

            h2 {
                font-size: 14px;
                color: #1F2129;
                line-height: 18px;
                padding-left: 29px;
            }

            .ej-content-goto {
                display: inline-block;
                background: #0cc1b9;
                border: 1px solid #0cc1b9;
                border-radius: 2px;
                width: 80px;
                height: 20px;
                text-align: center;
                margin-right: 14px;
                line-height: 18px;
                cursor: pointer;

                p {
                    font-size: 12px;
                    color: #fff;
                }
            }
        }

        .search-box {
            padding: 10px 14px;

            .search-bg {
                background: #ffffff;
                padding: 10px;
                border: 1px solid #E4EAEE;

                .as-search-box {
                    margin: 0;
                }
            }
        }

        .ej-content-main {
            flex: 1;
            overflow: hidden;
            display: flex;
            padding: 0 14px 15px 14px;

            .ej-content-left {
                flex: 1;
                height: 100%;
                margin-right: 15px;
                background: #ffffff;
                border: 1px solid #E4EAEE;
                box-sizing: border-box;
                display: flex;
                flex-flow: column;
                overflow: hidden;

                .left-title {
                    height: 36px;
                    border-bottom: 1px solid #ebeff1;
                    margin: 0 20px 0 40px;

                    &:before {
                        content: "";
                        position: relative;
                        left: -41px;
                        top: 2px;
                        border-left: 2px solid #00c187;
                    }

                    h3 {
                        font-size: 14px;
                        color: #22262e;
                        line-height: 36px;
                        display: inline-block;
                    }

                    label {
                        font-size: 12px;
                        color: rgb(137, 137, 239);
                        float: right;
                        line-height: 36px;
                        cursor: pointer;

                        span {
                            display: inline-block;
                            width: 12px;
                            height: 12px;
                            line-height: 12px;
                            border-radius: 50%;
                            border: 1px solid #6c7883;
                            text-align: center;
                        }
                    }

                }

                .left-content {
                    flex: 1;
                    overflow: hidden;
                    display: flex;
                    flex-flow: column;

                    .ej-content-scrollbar {}

                    .table-srcoll {
                        margin-top: 20px;
                        flex: 1;
                        overflow: hidden;
                    }

                }
            }

            .ej-content-right {
                width: 400px;
                height: 100%;
                display: flex;
                flex-flow: column;

                .right-tabs {
                    /deep/ .el-tabs__item {
                        height: auto;
                        line-height: 35px;
                        font-size: 12px;

                        &.is-active,
                        &:hover {
                            color: #8989ef;
                        }

                    }
                }

                .right-content {
                    background: #ffffff;
                    border: 1px solid #E4EAEE;
                    flex: 1;
                    overflow: hidden;
                    display: flex;
                    flex-flow: column;
                }

                .right-base {
                    background: #ffffff;
                    border: 1px solid #E4EAEE;
                    height: 120px;
                    margin-top: 10px;
                    display: flex;
                    flex-flow: column;

                    h6 {
                        padding: 10px 20px;
                        font-size: 14px;
                    }
                }

                .right-foot {
                    background: #ffffff;
                    border: 1px solid #E4EAEE;
                    height: 50px;
                    padding: 0 20px;
                    margin-top: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .foot-btn {
                        /deep/ .el-button {
                            height: 30px;
                            font-size: 12px;
                            color: #666;
                            padding: 5px 0;
                            border-radius: 0;
                            background: #00c187;
                            color: #fff;
                            width: 80px;
                            text-align: center;

                            &:hover {
                                opacity: 0.7;
                            }

                            &:active {
                                opacity: 1;
                            }

                            &.noClick {
                                background: #cecece !important;
                                pointer-events: none;
                            }
                        }
                    }
                }
            }
        }

    }

    @media screen and (min-width: 1601px) {
        .ej-content .ej-content-main .ej-content-right .right-base {
            height: 220px;
        }
    }
</style>
<style scoped>
</style>


<style>
    /* @import "../../assets/css/tableHeight.css"; */
</style>