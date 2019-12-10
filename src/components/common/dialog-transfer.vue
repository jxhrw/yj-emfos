<!-- // 调拨转移 -->
<template>
    <el-dialog :title="title" :visible.sync="mvisible" width='400px' :modal="false">
        <div class="dialog-urge">
            <div class="dialog-main">
                <div class="revoke-reason">
                    <div class="dialog-tips" v-if="type=='transfer'">转移后，原有管理部门<span>不再</span>继续享有该资产的控制权限！</div>
                    <div class="dialog-tips" v-if="type=='allocation'">调拨后，原有部门仍然享有该资产的控制权限！</div>
                </div>
                <div class="revoke-reason">
                    <label class="dialog-label"><i>*</i>{{type=='transfer'?'新管理部门':'选择部门'}}</label>
                    <el-input v-model="selectDept" placeholder="请选择" size='mini' class="content-select" clearable readonly v-popover:popoverSelectDept></el-input>
                    <el-popover highlight-current popper-class="region-popper" ref="popoverSelectDept" placement="bottom-start" trigger="click" v-model="selectDeptVisible">
                        <el-scrollbar class="region-scroll">
                            <el-tree id="selectDept" :data="deptList" accordion :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClickDept"></el-tree>
                        </el-scrollbar>
                    </el-popover>
                </div>
            </div>
            <div slot="footer" class="dialog-footer" style="margin-top:50px;">
                <el-button type="primary" @click="submitCode" size='mini' class="submit">提 交</el-button>
                <el-button @click="mvisible=false" size='mini' class="cancel">取 消</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
    import Common from "@/assets/js/common.js";
    export default {
        props: ['title', 'type', 'visible'],
        data() {
            return {
                token: '',
                deptList: [],
                selectDept: '',
                selectCode: '',
                selectDeptVisible: false,
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                mvisible: false
            }
        },
        watch: {
            visible(val) {
                this.mvisible = val;
            },
            mvisible(val) {
                // 从 2.3.0 起我们重新引入了 .sync 修饰符，但是这次它只是作为一个编译时的语法糖存在。它会被扩展为一个自动更新父组件属性的 v-on 监听器
                this.$emit('update:visible', val);
            },
            selectDept(newVal, oldVal) {
                if (newVal === '') {
                    this.selectCode = '';
                    setTimeout(() => {
                        this.selectDeptVisible = false;
                    });
                }
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.getDeptTree(null).then(res => {
                if (res.appCode == 0) { this.deptList = res.resultList; }
            });
        },
        methods: {
            handleNodeClickDept(data, node, e) {
                let thisId = e.$parent.$parent.$parent.$attrs.id || e.$parent.$parent.$attrs.id || e.$parent.$attrs.id;
                // if (!data.children || data.children.length == 0) {
                if (data) {
                    this.selectDept = data.text;
                    this.selectCode = data.id;
                    this.selectDeptVisible = false;
                }
            },
            getDeptTree(parentCode) {
                return this.$api.getMethod(this.$config.ubms_HOST, "/DeptInfo/getDeptTree.htm", { token: this.token, data: JSON.stringify({ regionId: parentCode }) });
            },
            submitCode() {
                console.log(this.selectCode);
                this.$emit("on-subimt", this.selectCode);
            }
        }
    }
</script>
<style scoped>
    @import "../../assets/css/dialog.css";

    .dialog-urge .dialog-main {
        margin-top: -30px;
        padding: 10px 0 20px;
        border-top: 1px solid #ebeff1;
    }

    .dialog-urge .dialog-main .dialog-select {
        width: 300px;
        box-sizing: border-box;
    }

    .dialog-urge .dialog-main .dialog-content {
        width: 300px;
        box-sizing: border-box;
        border: none;
    }

    .dialog-urge .dialog-main .dialog-label {
        width: 60px
    }

    .dialog-urge .dialog-main .dialog-label i {
        position: absolute;
        color: #f90404;
        left: -7px;
    }

    .dialog-urge .dialog-main .dialog-tips {
        font-size: 12px;
        color: #999999;
    }

    .dialog-urge .dialog-main .dialog-tips span {
        color: #333333;
    }

    .dialog-urge .dialog-main>>>.el-textarea__inner {
        height: 134px;
        background: #f9fafc;
    }

    .dialog-urge .dialog-main .content-select {
        width: 80%;
    }
</style>
<style>
    .region-popper {
        min-width: 220px;
        padding: 5px 0;
    }

    .region-scroll {
        height: 246px;
    }

    .region-scroll .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>