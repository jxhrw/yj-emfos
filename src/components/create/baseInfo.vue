<template>
    <div class="base-info">
        <div class="title">
            <h3>{{title}}</h3>
        </div>
        <div class="content">
            <el-row class="content-row-select">
                <el-col :span="9">
                    <i style="color:red;padding-top: 6px;float: left;position: relative;width: 0;left: -8px;">*</i>
                    <label>设备类别</label>
                    <el-select v-model="select_Devicecategory" placeholder="请选择" size='mini' class="content-select" @change='changeDevCategory'>
                        <el-option v-for="item in options_Devicecategory" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="9">
                    <i style="color:red;padding-top: 6px;float: left;position: relative;width: 0;left: -8px;">*</i>
                    <label>设备类型</label>
                    <el-select v-model="select_Repdevcategory" placeholder="请选择" size='mini' class="content-select" :disabled="isDisabled_Repdevcategory" @change='changeDevType'>
                        <el-option v-for="item in options_Repdevcategory" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="content-row-select">
                <el-col :span="9">
                    <i style="color:red;padding-top: 6px;float: left;position: relative;width: 0;left: -8px;">*</i>
                    <label>设备名称</label>
                    <!-- <el-select v-model="select_DeviceInfo" placeholder="请选择" size='mini' class="content-select" :disabled="isDisabled_DeviceInfo">
                    <el-option v-for="item in options_DeviceInfo" :key="item.devId" :label="item.devName" :value="item.devId">
                    </el-option>
                </el-select> -->
                    <el-autocomplete :disabled="isDisabled_DeviceInfo" class="content-select" v-model="select_DeviceInfo_name" :fetch-suggestions="querySearch" placeholder="请选择" @select="handleSelect"></el-autocomplete>
                    <div class="Warning" v-show="isWarning"><span>该设备处于维修中状态</span></div>
                </el-col>
                <el-col :span="9">
                    <i style="color:red;padding-top: 6px;float: left;position: relative;width: 0;left: -8px;">*</i>
                    <label>设备编号</label>
                    <el-input v-if="select_Devicecategory=='REPDEVCATEGORY02'" v-model="dataInfo.facilityId" placeholder="未选择" size='mini' class="content-select" :disabled="isDisabled_DeviceID"></el-input>
                    <el-input v-else v-model="dataInfo.devId" placeholder="未选择" size='mini' class="content-select" :disabled="isDisabled_DeviceID"></el-input>
                </el-col>
            </el-row>
            <template v-if="select_Devicecategory=='REPDEVCATEGORY01'&&dataInfo.devId&&dataInfo.devId!=''">
                <el-row class="content-row-explain content-row-first">
                    <el-col :span="9">
                        <label>设备厂家</label>
                        <span>{{dataInfo.factory}}</span>
                    </el-col>
                    <el-col :span="9">
                        <label>设备品牌</label>
                        <span>{{dataInfo.brand}}</span>
                    </el-col>
                </el-row>
                <el-row class="content-row-explain">
                    <el-col :span="9">
                        <label>设备型号</label>
                        <span>{{dataInfo.model}}</span>
                    </el-col>
                    <el-col :span="9">
                        <label>建设时间</label>
                        <span>{{dataInfo.devDate}}</span>
                    </el-col>
                </el-row>
                <el-row class="content-row-explain">
                    <el-col :span="9">
                        <label>所属辖区</label>
                        <span>{{dataInfo.region}}</span>
                    </el-col>
                    <el-col :span="9">
                        <label>管理部门</label>
                        <span>{{dataInfo.deptName}}</span>
                    </el-col>
                </el-row>
                <el-row class="content-row-explain">
                    <el-col :span="9">
                        <label>IP地址</label>
                        <span>{{dataInfo.ip}}</span>
                    </el-col>
                    <el-col :span="9">
                        <label>设备定位</label>
                        <span>{{dataInfo.position}}</span>
                    </el-col>
                </el-row>
                <el-row class="content-row-explain">
                    <el-col :span="24">
                        <label>安装位置</label>
                        <span>{{dataInfo.address}}</span>
                    </el-col>
                </el-row>
            </template>
            <template v-else-if="select_Devicecategory=='REPDEVCATEGORY02'&&dataInfo.facilityId&&dataInfo.facilityId!=''">
                <el-row class="content-row-explain content-row-first">
                    <el-col :span="9">
                        <label>设备厂家</label>
                        <span>{{dataInfo.manufact}}</span>
                    </el-col>
                    <el-col :span="9">
                        <label>设备品牌</label>
                        <span>{{dataInfo.brand}}</span>
                    </el-col>
                </el-row>
                <el-row class="content-row-explain">
                    <el-col :span="9">
                        <label>设备型号</label>
                        <span>{{dataInfo.model}}</span>
                    </el-col>
                    <el-col :span="9">
                        <label>建设时间</label>
                        <span>{{dataInfo.buildDate}}</span>
                    </el-col>
                </el-row>
                <el-row class="content-row-explain">
                    <el-col :span="9">
                        <label>所属辖区</label>
                        <span>{{dataInfo.regionName}}</span>
                    </el-col>
                    <el-col :span="9">
                        <label>管理部门</label>
                        <span>{{dataInfo.manageDeptName}}</span>
                    </el-col>
                </el-row>
                <el-row class="content-row-explain">
                    <el-col :span="9">
                        <label>设备定位</label>
                        <span>{{dataInfo.positionDesc}}</span>
                    </el-col>
                    <el-col :span="9">
                        <label>安装位置</label>
                        <span>{{dataInfo.address}}</span>
                    </el-col>
                </el-row>
            </template>
            <template v-else>
                <el-row class="content-row-explain">
                </el-row>
            </template>
        </div>
    </div>
</template>
<script>
    import Bus from "@/assets/js/bus.js";
    import Common from "@/assets/js/common.js";
    export default {
        data() {
            return {
                title: "基本信息",
                token: "",
                options_Devicecategory: [], // 设备类别
                select_Devicecategory: "", // 选中的设备类别
                isDisabled_Repdevcategory: true, // 设备类型是否可以选择
                options_Repdevcategory: [], // 设备类型
                select_Repdevcategory: "", // 选中的设备类型
                isDisabled_DeviceInfo: true, // 设备是否可以选择
                options_DeviceInfo: [], // 设备信息
                select_DeviceInfo_name: '',
                select_DeviceInfo: "", // 选中的设备信息ID
                isDisabled_DeviceID: true, // 设备ID是否可以选择
                dataInfo: {}, // 选中的设备具体信息
                isWarning: false
            };
        },
        watch: {
            isWarning(newVal, oldVal) {
                Bus.$emit("isWarning", newVal);
            },
            select_Devicecategory(newVal, oldVal) {
                this.select_Repdevcategory = ""; // 设备类别改变，清空之前选择的设备类型
                this.options_Repdevcategory = []; // 设备类别改变，清空之前设备类型选项
                this.isDisabled_Repdevcategory = true; // 设备类别改变，设备类型不可操作
                this.isWarning = false;
                if (newVal == "REPDEVCATEGORY01" || newVal == "REPDEVCATEGORY02") {
                    // 选设备调用UBMS接口查找设备类型
                    this.getRepdevcategory(); // 调用UBMS接口查询设备类型
                    this.isDisabled_Repdevcategory = false;
                    // } else if (newVal == "REPDEVCATEGORY02") {
                    // 选设施调用设施接口查找(暂时没有设施接口)
                } else if (newVal === "") {
                    // 未选择的情况，暂时不做处理
                }
                Bus.$emit("select_Devicecategory", newVal); // 传输设备类别，用来控制是否显示故障类型
            },
            select_Repdevcategory(newVal, oldVal) {
                this.select_DeviceInfo = ""; // 设备类型改变，清空之前选择的设备信息
                this.dataInfo = {}; // 设备类型改变，清空之前选择的设备信息
                this.select_DeviceInfo_name = "";
                this.isWarning = false;
                this.options_DeviceInfo = []; // 设备类型改变，清空之前设备信息选项
                this.isDisabled_DeviceInfo = true; // 设备类型改变，设备信息不可操作
                if (newVal != "") {
                    if (this.select_Devicecategory == "REPDEVCATEGORY01") {
                        // 选设备调用UBMS接口查找设备类型后再去查UBMS设备
                        this.getDeviceInfo();
                        this.isDisabled_DeviceInfo = false;
                    } else if (this.select_Devicecategory == "REPDEVCATEGORY02") {
                        // 选设施调用设施接口查找设备类型后再去查设备(暂时没有设施接口)
                        this.getSignsInfo();
                        this.isDisabled_DeviceInfo = false;
                    }
                } else {} // 未选择的情况，暂时不做处理
                Bus.$emit("select_Repdevcategory", newVal); // 传输设备类型，用来查询故障类型
            },
            select_DeviceInfo(newVal, oldVal) {
                this.isWarning = false;
                this.devRepeatCheck(newVal, this.select_Repdevcategory);
                // 改变了选中的设备后，根据设备ID获取到选中设备的具体信息
                if (newVal != "") {
                    this.options_DeviceInfo.forEach(item => {
                        if (newVal == item.devId || newVal == item.facilityId) {
                            this.dataInfo = item;
                            this.dataInfo.devId = item.devId || item.facilityId;
                            this.dataInfo.devName = item.devName || item.facilityName;
                        }
                    });
                    this.getDevStatusInfo();
                    Bus.$emit("devInfo", this.dataInfo); // 传输设备类型，用来查询故障类型
                }
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.getDevicecategory();
            this.type = Common.getQueryString("type");
            if (this.type == 'fixm') {
                var dataInfo = JSON.parse(sessionStorage.getItem('dataDetail'));
                this.select_Devicecategory = dataInfo.devCategoryCode;
            }
            // 重置操作
            Bus.$on("resetRepair", value => {
                this.select_Devicecategory = "";
                this.isWarning = false;
            });
            Bus.$on("isWarning", value => {
                this.isWarning = value;
            });
        },
        methods: {
            querySearch(queryString, cb) {
                if (queryString != window.searchName) {
                    if (this.select_Devicecategory == "REPDEVCATEGORY01") {
                        this.getDeviceInfo(queryString, () => {
                            this.createFilter(cb);
                        });
                    } else if (this.select_Devicecategory == "REPDEVCATEGORY02") {
                        this.getSignsInfo(queryString, () => {
                            this.createFilter(cb);
                        });
                    }
                } else {
                    this.options_DeviceInfo = window.devList;
                    this.createFilter(cb);
                }

                // var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;

            },
            createFilter(cb) {
                // return (restaurant) => {
                //     return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
                // };
                let restaurants = this.options_DeviceInfo.map((value, index) => {
                    value.value = value.devName || value.facilityName;
                    return value;
                });
                // 调用 callback 返回建议列表的数据
                cb(restaurants);
            },
            handleSelect(item) {
                this.select_DeviceInfo = item.devId || item.facilityId;
            },
            devRepeatCheck(devId, devTypeCode) {
                if (!devId || !devTypeCode) {
                    return;
                }
                var url =
                    this.$config.efoms_HOST + this.$config.devRepeatCheck_GET;
                var header = {
                    "Content-Type": "application/x-www-form-urlencoded",
                    token: this.token
                };
                this.$api
                    .get(
                        url, {
                            devId: devId,
                            devTypeCode: devTypeCode
                        },
                        header
                    )
                    .then(res => {
                        if (res.appCode == 2103) {
                            this.isWarning = true;
                            Bus.$emit("isWarning", true);
                        } else {
                            Common.printErrorLog(this.$config.efoms_HOST, this.$config.devRepeatCheck_GET);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(this.$config.efoms_HOST, this.$config.devRepeatCheck_GET);
                        console.log(err);
                    });
            },
            changeDevCategory(val) {
                this.options_Devicecategory.forEach(e => {
                    if (e.dicCode == val) {
                        Bus.$emit("devCategoryName", e.dicName); // 传输设备类别名称
                    }
                });
            },
            changeDevType(val) {
                this.options_Repdevcategory.forEach(e => {
                    if (e.dicCode == val) {
                        Bus.$emit("devTypeName", e.dicName); // 传输设备类型名称
                    }
                });
            },
            getDevicecategory() {
                var url =
                    this.$config.ubms_HOST + this.$config.getDeviceDic_GET;
                var header = {
                    "Content-Type": "application/x-www-form-urlencoded"
                };
                this.$api
                    .get(
                        url, {
                            token: this.token,
                            data: JSON.stringify({
                                parentCode: "DEVICECATEGORY"
                            })
                        },
                        header
                    )
                    .then(res => {
                        if (res.appCode == 0) {
                            this.options_Devicecategory = res.resultList;
                        } else {
                            Common.printErrorLog(this.$config.ubms_HOST, this.$config.getDeviceDic_GET);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(this.$config.ubms_HOST, this.$config.getDeviceDic_GET);
                        console.log(err);
                    });
            },
            getRepdevcategory() {
                var url =
                    this.$config.ubms_HOST + this.$config.getDeviceDic_GET;
                var header = {
                    "Content-Type": "application/x-www-form-urlencoded"
                };
                this.$api
                    .get(
                        url, {
                            token: this.token,
                            data: JSON.stringify({
                                parentCode: this.select_Devicecategory
                            })
                        },
                        header
                    )
                    .then(res => {
                        if (res.appCode == 0) {
                            this.options_Repdevcategory = res.resultList;
                        } else {
                            Common.printErrorLog(this.$config.ubms_HOST, this.$config.getDeviceDic_GET);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(this.$config.ubms_HOST, this.$config.getDeviceDic_GET);
                        console.log(err);
                    });
            },
            getDeviceInfo(value, func) {
                this.$api.getMethod(this.$config.efoms_HOST, '/efoms-rest/deviceDetail/selectAssetDevicePage', { pageSize: 20, currentPage: 1, devTypeCode: this.select_Repdevcategory, devName: value }, this.token)
                    .then(res => {
                        if (res.appCode == 0) {
                            this.options_DeviceInfo = res.resultList.result || [];
                            window.devList = this.options_DeviceInfo;
                            window.searchName = res.resultList.mapBean.devName || '';
                            if (func) {
                                func();
                            }
                        } else {
                            Common.printErrorLog(this.$config.ubms_HOST, this.$config.getDeviceInfo_GET);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(this.$config.ubms_HOST, this.$config.getDeviceInfo_GET);
                        console.log(err);
                    });
            },
            getSignsInfo(value, func) {
                this.$api.getMethod(this.$config.efoms_HOST, '/efoms-rest/deviceDetail/selectFacilitySimpleInfoPage', { pageSize: 20, currentPage: 1, facilityTypeCode: this.select_Repdevcategory, facilityName: value }, this.token)
                    .then(res => {
                        if (res.appCode == 0) {
                            this.options_DeviceInfo = res.resultList.result || [];
                            window.devList = this.options_DeviceInfo;
                            window.searchName = res.resultList.mapBean.facilityName || '';
                            if (func) {
                                func();
                            }
                        } else {
                            Common.printErrorLog(this.$config.efoms_HOST, this.$config.selectFacilitySimpleInfoList_GET);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(this.$config.efoms_HOST, this.$config.selectFacilitySimpleInfoList_GET);
                        console.log(err);
                    });
            },
            getDevStatusInfo() {
                var url =
                    this.$config.efoms_HOST +
                    this.$config.getDevStatusInfo_GET;
                var header = {
                    token: this.token,
                    "Content-Type": "application/x-www-form-urlencoded"
                };
                this.$api
                    .get(
                        url, {
                            deviceId: this.select_DeviceInfo,
                            devTypeCode: this.select_Repdevcategory
                        },
                        header
                    )
                    .then(res => {
                        if (res.appCode == 0) {
                            this.options_DeviceInfo = res.resultList;
                        } else {
                            Common.printErrorLog(this.$config.ubms_HOST, this.$config.getDeviceInfo_GET);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(this.$config.ubms_HOST, this.$config.getDeviceInfo_GET);
                        console.log(err);
                    });
            }
        }
    };
</script>
<style scoped>
    .base-info {
        margin: 14px 14px 10px 14px;
        background: #ffffff;
        border: 1px solid #e4eaee;
        border-radius: 2px;
    }

    .base-info .title {
        height: 36px;
        border-bottom: 1px solid #ebeff1;
        margin: 0 58px 0 40px;
    }

    .base-info .title::before {
        content: "";
        position: relative;
        left: -41px;
        top: 10px;
        border-left: 2px solid #00c187;
    }

    .base-info .title h3 {
        font-size: 14px;
        color: #22262e;
        line-height: 0px;
    }

    .base-info .content {
        padding-top: 5px;
        padding-left: 40px;
    }

    .base-info .content .content-row-select {
        margin-top: 10px;
    }

    .base-info .content .content-row-select .Warning {
        display: inline-block;
        background: #FFF3F1;
        border: 1px solid #FFE3DE;
        width: 205px;
        height: 24px;
        text-align: center;
        margin-left: 5px;
    }

    .base-info .content .content-row-select .Warning span {
        color: #737E84;
    }

    .base-info .content .content-row-select .Warning span::before {
        content: "";
        display: inline-block;
        position: relative;
        width: 16px;
        height: 16px;
        right: 14px;
        top: 3px;
        background: url("../../assets/images/icon_warning.png") no-repeat center/16px;
    }

    .base-info .content .content-row-first {
        margin-top: 16px;
    }

    .base-info .content .content-row-explain {
        font-size: 12px;
        line-height: 12px;
        margin-bottom: 25px;
    }

    .base-info .content label {
        color: #4f5a64;
        display: inline-block;
        width: 48px;
        font-size: 12px;
        margin-right: 12px;
        text-align: right;
    }

    .base-info .content span {
        font-size: 12px;
        color: #737e84;
    }

    .base-info .content .content-select {
        width: 300px;
    }
</style>
<style>
    .base-info .content .content-select .el-input__inner {
        border-radius: 0;
        background: #f9fafc;
        border: 1px solid #e1e7ed;
        height: 28px;
    }

    .base-info .content .content-select .el-input__suffix {
        border-left: 1px solid #e1e7ed;
    }
</style>