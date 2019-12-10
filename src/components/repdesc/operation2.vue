<template>
    <div class="depiction-info">
        <div class="title">
            <h3>{{title}}</h3>
        </div>
        <div class="content">
            <el-row class="content-row-select">
                <el-col :span="9">
                    <i style="color:red;padding-top: 6px;float: left;position: relative;width: 0;left: -8px;">*</i>
                    <label>运维单位</label>
                    <!-- <el-select v-model="selectDept" placeholder="请选择" size='mini' class="content-select"  @change='changeDeptList'>
                    <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptId">
                    </el-option>
                </el-select> -->
                    <el-input v-model="selectDept" placeholder="请选择" size='mini' class="content-select" clearable readonly v-popover:popoverSelectDept></el-input>
                    <el-popover highlight-current popper-class="region-popper" ref="popoverSelectDept" placement="bottom-start" trigger="click" v-model="selectDeptVisible">
                        <el-scrollbar class="region-scroll">
                            <el-tree id="selectDept" :data="deptList" accordion :props="defaultProps" @node-click="handleNodeClickDept"></el-tree>
                        </el-scrollbar>
                    </el-popover>
                </el-col>
                <el-col :span="9">
                    <label>运维组长</label>
                    <el-select v-model="selectPerson" placeholder="请选择" size='mini' class="content-select" @change='changePersonList'>
                        <el-option v-for="item in personList" :key="item.personId" :label="item.personName" :value="item.personId">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="content-row-select">
                <el-col :span="9">
                    <label>联系电话</label>
                    <el-input v-model="contactTel" placeholder="请输入" size='mini' class="content-select"></el-input>
                </el-col>
                <el-col :span="9">
                    <label>维修期限</label>
                    <el-date-picker v-model="deadlineDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期" size='mini' class="content-select-date"></el-date-picker>
                </el-col>
            </el-row>
            <el-row class="content-row-select">
                <el-col :span="24">
                    <label class="content-label">派发备注</label>
                    <el-input type="textarea" :rows="3" placeholder="请输入内容" class="content-textarea" v-model="operExplain" resize="none"></el-input>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
    import Bus from "@/assets/js/bus.js";
    import Common from "@/assets/js/common.js";
    export default {
        data() {
            return {
                title: "派发操作",
                operExplain: "",
                token: '',
                deptList: [],
                selectDept: '',
                selectDeptCode: '',
                personList: [],
                selectPerson: '',
                contactTel: '',
                deadlineDate: '',
                selectDeptVisible: false,
                defaultProps: {
                    children: 'children',
                    label: 'text'
                }
            };
        },
        watch: {
            operExplain(newVal, oldVal) {
                Bus.$emit("operExplain", newVal); // 传输派发备注
            },
            deadlineDate(newVal, oldVal) {
                Bus.$emit("deadlineDate", newVal); // 传输维修期限
            },
            contactTel(newVal, oldVal) {
                Bus.$emit("contactTel", newVal); // 传输联系电话
            },
            selectDept(newVal, oldVal) {
                if (newVal === '') {
                    this.selectDeptCode = '';
                    setTimeout(() => {
                        this.selectDeptVisible = false;
                    });
                }
            },
            selectDeptCode(newVal, oldVal) {
                Bus.$emit("deptId", newVal); // 传输运维单位部门ID
                this.personList = [];
                this.selectPerson = '';
                this.getPersonInfo(newVal).then(res => {
                    if (res.appCode == 0) { this.personList = res.resultList; }
                });
            },
            selectPerson(newVal, oldVal) {
                Bus.$emit("personId", newVal); // 传输运维组长ID
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            let time = new Date();
            time = new Date(time.getTime() + 1 * 24 * 60 * 60 * 1000);
            this.deadlineDate = Common.dateFormat('yyyy-MM-dd', time) + " 00:00:00";
            Bus.$on("reset", value => {
                this.operExplain = '';
            });
            // this.getDeptInfo('610100000000').then(res => {
            //     if (res.appCode == 0) { this.deptList = res.resultList; }
            // });
            this.getDeptTree(null).then(res => {
                if (res.appCode == 0) { this.deptList = res.resultList; }
            });
        },
        methods: {
            handleNodeClickDept(data, node, e) {
                let thisId = e.$parent.$parent.$parent.$attrs.id || e.$parent.$parent.$attrs.id || e.$parent.$attrs.id;
                if (!data.children || data.children.length == 0) {
                    this.selectDept = data.text;
                    this.selectDeptCode = data.id;
                    this.selectDeptVisible = false;
                    Bus.$emit("deptName", data.text);
                }
            },
            changeDeptList(val) {
                this.deptList.forEach(e => {
                    if (e.deptId == val) {
                        Bus.$emit("deptName", e.deptName); // 传输运维部门
                    }
                });
            },
            changePersonList(val) {
                this.personList.forEach(e => {
                    if (e.personId == val) {
                        Bus.$emit("personName", e.personName); // 传输运维部门
                    }
                });
            },
            getDeptTree(parentCode) {
                return this.$api.getMethod(this.$config.ubms_HOST, "/ubms-server/OpsDeptInfo/getOpsDetpTree.htm", { token: this.token, data: JSON.stringify({ regionId: undefined }) });
            },
            getDeptInfo(parentCode) {
                var url =
                    this.$config.ubms_HOST + this.$config.getDeptInfo_GET;
                var header = {
                    "Content-Type": "application/x-www-form-urlencoded"
                };
                return this.$api.get(url, { token: this.token, data: JSON.stringify({ parentCode: parentCode }) }, header);
            },
            getPersonInfo(deptId) {
                var url =
                    this.$config.ubms_HOST + this.$config.getPersonInfo_GET;
                var header = {
                    "Content-Type": "application/x-www-form-urlencoded"
                };
                return this.$api.get(url, { token: this.token, data: JSON.stringify({ deptId: deptId }) }, header);
            }
        }
    };
</script>
<style scoped>
    .depiction-info {
        margin: 14px;
        background: #FFFFFF;
        border: 1px solid #E4EAEE;
        border-radius: 2px;
    }

    .depiction-info .title {
        height: 36px;
        border-bottom: 1px solid #EBEFF1;
        margin: 0 58px 0 40px;
    }

    .depiction-info .title::before {
        content: '';
        position: relative;
        left: -41px;
        top: 10px;
        border-left: 2px solid #00C187;
    }

    .depiction-info .title h3 {
        font-size: 14px;
        color: #22262E;
        line-height: 0px;
    }

    .depiction-info .content {
        padding-top: 5px;
        padding-left: 40px;
        padding-bottom: 14px;
    }

    .depiction-info .content .content-row-select {
        margin-top: 10px;
    }

    .depiction-info .content .content-row-explain {
        font-size: 12px;
        line-height: 12px;
        margin-bottom: 25px;
    }

    .depiction-info .content .content-row-explain.content-row-first {
        margin-top: 16px;
        margin-bottom: 15px;
    }

    .depiction-info .content .content-row-select.content-row-bottom {
        margin-bottom: 20px;
    }

    .depiction-info .content .content-row-select .linkman-explain {
        position: absolute;
        color: #A3B1B9;
        font-size: 12px;
        padding: 10px 0 0 64px;
    }

    .depiction-info .content label {
        color: #4F5A64;
        display: inline-block;
        width: 48px;
        font-size: 12px;
        margin-right: 12px;
        text-align: right;
    }

    .depiction-info .content span {
        font-size: 12px;
        color: #737E84;
    }

    .depiction-info .content .content-select {
        width: 300px;
    }

    .depiction-info .content .content-row-select .content-textarea {
        width: 300px;
        margin-left: 65px;
    }

    .depiction-info .content .content-row-select .content-label {
        position: absolute;
        top: 8px;
    }

    .depiction-info .content .content-row-img {
        font-size: 12px;
        line-height: 12px;
        display: flex;
    }

    .depiction-info .content .content-row-img label {
        line-height: 30px;
    }

    .depiction-info .content .content-row-explain .img-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        margin-left: 6px;
        margin-right: 10px;
        background: #FFFFFF;
        border: 1px solid #E1E7ED;
    }

    .depiction-info .content .content-row-explain .img-preview .img-del {
        opacity: 0.62;
        background: #7A7A7A;
        width: 50px;
        height: 15px;
        position: absolute;
        bottom: 1px;
    }

    .depiction-info .content .content-row-explain .img-preview .img-del p {
        font-size: 10px;
        color: #FFFFFF;
        text-align: center;
        cursor: pointer;
        ;
    }

    .depiction-info .content .content-row-explain .img-add {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        margin-left: 6px;
        margin-right: 10px;
        background: #FFFFFF;
        border: 1px solid #E1E7ED;
        cursor: pointer;
    }

    .depiction-info .content .file-add {
        color: #6BA1EB;
        cursor: pointer;
        margin-right: 5px;
    }

    .depiction-info .content .file-preview {
        display: inline-block;
    }

    .depiction-info .content .file-preview .file-name {
        float: left;
        margin-right: 5px;
        cursor: pointer;
    }

    .depiction-info .content .file-preview .file-del {
        color: #6BA1EB;
        cursor: pointer;
    }

    .depiction-info .content .file-explain {
        margin: 10px 0px 0px 63px;
        color: #A3B1B9;
    }
</style>
<style>
    .depiction-info .content .content-select .el-input__inner {
        border-radius: 0;
        background: #F9FAFC;
        border: 1px solid #E1E7ED;
    }

    .depiction-info .content .content-select .el-input__suffix {
        border-left: 1px solid #E1E7ED;
    }

    .depiction-info .content .content-row-select .content-textarea .el-textarea__inner {
        border-radius: 0;
        background: #F9FAFC;
        border: 1px solid #E1E7ED;
    }

    .depiction-info .content .content-row-select .content-select-date .el-input__inner {
        border-radius: 0;
        background: #F9FAFC;
        border: 1px solid #E1E7ED;
        width: 300px;
    }

    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
        width: 300px;
    }

    .region-popper {
        min-width: 300px;
        padding: 5px 0;
    }

    .region-scroll {
        height: 246px;
    }

    .region-scroll .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>