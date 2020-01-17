<template>
    <div class="dialog-repair">
        <div class="dialog-main">
            <div class="revoke-reason">
                <label class="dialog-label"><i>*</i>故障类型</label>
                <el-select v-model="selectFault" placeholder="请选择" size='mini' class="content-select">
                    <el-option v-for="item in faultList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                    </el-option>
                </el-select>
            </div>
            <div class="revoke-reason">
                <label class="dialog-label"><i>*</i>故障描述</label>
                <textarea rows="8" cols="40" placeholder="请输入" class="dialog-content" v-model="faultDesc" style="resize:none"></textarea>
            </div>
            <EJ-ImgUpload :id="id" :imgFiles="zjImgFiles"></EJ-ImgUpload>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitRepair" size='mini' class="submit">提 交</el-button>
            <el-button @click="closeRepair('cancel')" size='mini' class="cancel">取 消</el-button>
        </div>
    </div>
</template>
<script>
    import Common from "@/assets/js/common.js";
    import Bus from "@/assets/js/bus.js";
    import ImgUpload from "components/common/imgUpload";
    export default {
        components: {
            "EJ-ImgUpload": ImgUpload
        },
        props: {
            id: {
                type: String,
                default: ""
            },
            imgFiles: {
                type: Array,
                default: function() {
                    return [];
                }
            },
            devInfo: {
                type: Object,
                default: function() {
                    return {};
                }
            },
            type: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                token: '',
                faultDesc: '',
                faultList: [], // 故障原因
                selectFault: '',
                zjImgFiles: [], // 用于显示，传入的值不让修改，不然会报错，所以重新定义组件用值
                imgFileList: [] // 用于提交
            };
        },
        watch: {
            imgFiles(newVal, oldVal) {
                this.zjImgFiles = this.imgFiles;
            }
        },
        mounted() {
            this.zjImgFiles = this.imgFiles;
            this.token = Common.getQueryString("token");
            this.getFaultsource();
            Bus.$on("upload-" + this.id, value => {
                this.imgFileList = value;
            });
        },
        methods: {
            closeRepair(type) {
                let bool = type != 'cancel';
                Bus.$emit("repair-" + this.id, bool);
            },
            // 重置报修原因
            resetRepair() {
                this.faultDesc = '';
                this.selectFault = '';
                this.zjImgFiles = [];
                this.imgFileList = [];
            },
            // 提交巡检异常结果
            submitNormal() {
                let recodeInfo = {
                    devCategoryCode: Common.getDevCategory().code,
                    devCategoryName: Common.getDevCategory().name,
                    devTypeCode: this.devInfo.devTypeCode,
                    devTypeName: this.devInfo.devTypeName,
                    devId: this.devInfo.devId,
                    devName: this.devInfo.devName,
                    checkResultCode: "DEVICERESULT03",
                    checkResultName: "异常",
                    checkMemo: this.remarks
                };
                let obj = {
                    list: JSON.stringify([recodeInfo])
                };
                this.$api.getMethod(this.$config.efoms_HOST, this.$config.insertCheckRecordInfo_PUT, obj, this.token, "json")
                    .then(res => {
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
                            this.closeRepair();
                        } else {
                            Common.ejMessage("warning");
                            Common.printErrorLog(this.$config.efoms_HOST, this.$config.insertCheckRecordInfo_PUT);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(this.$config.efoms_HOST, this.$config.insertCheckRecordInfo_PUT);
                        console.log(err);
                    });
            },
            // 提交报修
            submitRepair() {
                let failureTypeName;
                let repairsInfo;
                if (this.selectFault == "" || this.faultDesc == "") {
                    Common.ejMessage("warning", "请选择故障类型和填写故障描述");
                    return false;
                }
                this.faultList.forEach(v => {
                    if (v.dicCode === this.selectFault) {
                        failureTypeName = v.dicName;
                    }
                });
                repairsInfo = {
                    devId: this.devInfo.devId,
                    devCategoryCode: Common.getDevCategory().code,
                    devCategoryName: Common.getDevCategory().name,
                    devName: this.devInfo.devName,
                    devTypeCode: this.devInfo.devTypeCode,
                    devTypeName: this.devInfo.devTypeName,
                    repSourceCode: 'REPAIRSSOURCE03',
                    repSourceName: '线上巡检',
                    failureDescrible: this.faultDesc,
                    failureTypeCode: this.selectFault,
                    failureTypeName: failureTypeName,
                    fileInfoList: this.imgFileList
                };
                this.$api.postMethod(this.$config.efoms_HOST, '/efoms-rest/repairs/createRepairsInfo', repairsInfo, this.token,
                        'noContentType')
                    .then(res => {
                        if (res.appCode == 0) {
                            // Common.ejMessage("success");
                            // this.closeRepair();
                            this.resetRepair();
                            this.submitNormal();
                        } else {
                            Common.ejMessage("warning");
                            Common.printErrorLog(this.$config.efoms_HOST, '/efoms-rest/repairs/createRepairsInfo');
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(this.$config.efoms_HOST, '/efoms-rest/repairs/createRepairsInfo');
                        console.log(err);
                    });
            },
            // 获取故障原因
            getFaultsource() {
                var obj = {
                    token: this.token,
                    data: JSON.stringify({
                        parentCode: this.devInfo.devTypeCode
                    })
                };
                if (this.type === 'videoMethod') {
                    obj.data = JSON.stringify({
                        parentCode: 'REPDEVTYPE02'
                    });
                }
                this.$api.getMethod(this.$config.ubms_HOST, this.$config.getDeviceDic_GET, obj)
                    .then(res => {
                        if (res.appCode == 0) {
                            this.faultList = res.resultList;
                        } else {
                            Common.printErrorLog(this.$config.ubms_HOST, this.$config.getDeviceDic_GET);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(this.$config.ubms_HOST, this.$config.getDeviceDic_GET);
                        console.log(err);
                    });
            }
        }
    };
</script>

<style scoped>
    .dialog-repair .dialog-main {
        margin-top: -30px;
        padding: 10px 0 20px 0;
        border-top: 1px solid #EBEFF1;
    }

    .dialog-repair .dialog-main .dialog-label {
        float: left;
        font-size: 12px;
        margin-right: 8px;
        width: 48px;
        text-align: right;
        line-height: 28px;
        position: relative;
    }

    .dialog-repair .dialog-main .dialog-label i {
        position: absolute;
        color: #f90404;
        left: -7px;
    }

    .dialog-repair .dialog-main .revoke-reason {
        margin-bottom: 13px;
    }

    .dialog-repair .dialog-main .dialog-content {
        background: #F9FAFC;
        border: 1px solid #E1E7ED;
        width: 303px;
        display: block;
        padding: 10px 15px;
        box-sizing: border-box;
        font-size: 12px;
    }

    .dialog-repair .dialog-main .content-select {
        width: 303px;
    }

    .dialog-repair .dialog-footer {
        text-align: center;
    }

    .dialog-repair .dialog-footer .submit {
        margin-right: 20px;
        background: #00C187;
        border-color: #E1E7ED;
    }

    .dialog-repair .dialog-footer .submit:hover {
        background: #00C187;
        border-color: #E1E7ED;
    }

    .dialog-repair .dialog-footer .cancel {
        background: #F9FAFC;
        border-color: #E1E7ED;
        color: #6C7883;
    }

    .dialog-repair .dialog-footer .cancel:hover {
        background: #F9FAFC;
        border-color: #E1E7ED;
        color: #6C7883;
    }

    .dialog-repair>>>.dialog-main .el-input__inner {
        border-radius: 0;
        background: #F9FAFC;
        border: 1px solid #E1E7ED;
    }

    .dialog-repair>>>.dialog-main .el-input__suffix {
        border-left: 1px solid #E1E7ED;
    }
</style>