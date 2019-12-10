<template>
    <div class="selectTree">
        <div class="dialog-main">
            <div class="revoke-reason">
                <div>
                    <!-- <label class="dialog-label">名称</label> -->
                    <el-input v-model="name" placeholder="" size='mini' class="content-select input-mini" clearable></el-input>
                </div>
                <div>
                    <el-button type="primary" @click="searchFuc" size='mini' class="submit">查 询</el-button>
                </div>
            </div>
            <div>
                <el-scrollbar class="content">
                    <template v-if="isSearch">
                        <div class="checkbox">
                            <el-checkbox-group v-model="pointSelect" @change="handleCheckedCitiesChange">
                                <el-checkbox v-for="city in pointList" :label="city" :key="city.offsiteId">{{city.name}}</el-checkbox>
                            </el-checkbox-group>
                        </div>

                    </template>
                    <el-tree v-if="!isSearch" :props="props1" :load="loadNode1" lazy show-checkbox accordion @check-change="mySelect">
                    </el-tree>
                </el-scrollbar>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="closeDialog('1')" size='mini' class="submit">提 交</el-button>
            <el-button @click="closeDialog('0')" size='mini' class="cancel">取 消</el-button>
        </div>
    </div>
</template>
<script>
    import Common from "@/assets/js/common.js";
    export default {
        data() {
            return {
                token: '',
                name: '',
                isSearch: false,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                props1: {
                    label: 'name',
                    children: 'zones',
                    isLeaf: 'leaf'
                },
                pointSelect: [],
                pointList: [],
                mPointsInfo: [],
            }
        },
        mounted() {
            // this.token = Common.getQueryString("token");
        },
        methods: {
            mySelect(data, checked, indeterminate) {
                if (data.offsiteId) {
                    if (checked) {
                        this.mPointsInfo.push(data);
                    } else {
                        this.mPointsInfo = this.mPointsInfo.filter(val => {
                            return val.offsiteId != data.offsiteId;
                        });
                    }
                }
            },
            handleCheckedCitiesChange(value) {
                this.mPointsInfo = value;
            },
            closeDialog(type) {
                let obj = { type: type };
                if (type == '1') {
                    let arr = [...this.mPointsInfo];
                    let code = [];
                    let name = [];
                    arr.map(val => {
                        code.push(val.offsiteId);
                        name.push(val.name);
                    });
                    obj.code = code.join(',');
                    obj.name = name.join(',');
                    this.$emit('close', obj);
                } else {
                    this.$emit('close', obj);
                }

            },
            searchFuc() {
                this.pointList = [];
                this.mPointsInfo = [];
                if (this.name) {
                    this.isSearch = true;
                    this.$api.get(`${this.$config.ubms_HOST}/ubms-server/OffsiteInfo/getOffsiteInfo.htm`, { token: this.token, data: JSON.stringify({ offsiteName: this.name, pageSize: 9999, regionId: "", sceneCode: "" }) }, '').then(res => {
                        if (res.appCode == '0') {
                            this.pointList = [];
                            res.resultList.map(val => {
                                this.pointList.push({ offsiteId: val.offsiteId, name: val.offsiteName, leaf: true });
                            });
                        }
                    });
                } else {
                    this.isSearch = false;
                }
            },
            loadNode1(node, resolve) {
                this.token = Common.getQueryString("token");
                if (node.level === 0) {
                    let a = [];
                    // this.$api.get(`${this.$config.ubms_HOST}/ubms-server/RegionInfo/getRegionInfo.htm`, { token: this.token, data: JSON.stringify({ "parentId": "360400" }) }, '').then(res => {
                    //     if (res.appCode == '0') {
                    //         res.resultList.map(val => {
                    //             a.push({ id: val.regionId, name: val.regionName });
                    //         });
                    //         a.push({ id: '360400', name: '九江市(本级)' });
                    //         return resolve(a);
                    //     } else {
                    //         return resolve([]);
                    //     }
                    // }).catch(err => {
                    //     return resolve([]);
                    // });

                    this.getRegionTree(null).then(res => {
                        if (res.appCode == '0') {
                            res.resultList[0].children.map(val => {
                                a.push({ id: val.id, name: val.text });
                            });
                            a.push({ id: res.resultList[0].id, name: `${res.resultList[0].text}(本级)` });
                            return resolve(a);
                        } else {
                            return resolve([]);
                        }
                    }).catch(err => {
                        return resolve([]);
                    });

                }
                if (node.level > 0) {
                    if (node.data.id) {
                        let b = [];
                        this.$api.get(`${this.$config.ubms_HOST}/ubms-server/OffsiteInfo/getOffsiteInfo.htm`, { token: this.token, data: JSON.stringify({ regionId: node.data.id, sceneCode: "" }) }, '').then(res => {
                            if (res.appCode == '0') {
                                res.resultList.map(val => {
                                    b.push({ offsiteId: val.offsiteId, name: val.offsiteName, leaf: true });
                                });
                                return resolve(b);
                            } else {
                                return resolve([]);
                            }
                        }).catch(err => {
                            return resolve([]);
                        });
                    } else {
                        return resolve([]);
                    }
                }
            },
            getRegionTree(parentCode) {
                return this.$api.getMethod(this.$config.efoms_HOST, this.$config.getRegionTree_GET, {
                    token: this.token,
                    data: JSON.stringify({
                        regionId: parentCode
                    })
                });
            },
        }
    }
</script>
<style lang="less" scoped>
    .dialog-main {
        margin-top: -30px;
        padding: 10px 0 0;
        border-top: 1px solid #ebeff1;

        .revoke-reason {
            margin-bottom: 13px;
            display: flex;
            justify-content: space-between;
        }

        .dialog-label {
            display: inline-block;
            font-size: 12px;
            margin-right: 8px;
            width: 48px;
            text-align: right;
            line-height: 28px;
        }

        .submit {
            margin: 0;
        }

        .input-mini {
            width: 370px;
        }

        .content {
            height: 300px;

            /deep/ .el-scrollbar__wrap {
                overflow-x: hidden;
            }
        }

        .checkbox {
            /deep/ .el-checkbox {
                display: block;
                margin-left: 0;

                &+.el-checkbox {
                    margin-top: 10px;
                }
            }
        }
    }



    .dialog-footer {
        text-align: center;

        .cancel {
            background: #f9fafc;
            border-color: #e1e7ed;
            color: #6c7883;
        }
    }

    .dialog-footer .submit:hover,
    .dialog-main .submit {
        background: #00c187;
        border-color: #e1e7ed;
    }

    .dialog-footer .submit,
    .dialog-main .submit {
        margin-right: 20px;
        background: #00c187;
        border-color: #e1e7ed;
    }

    .selectTree {
        /deep/ .el-dialog__footer {
            padding: 10px 20px 20px;
            text-align: right;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
        }
    }
</style>