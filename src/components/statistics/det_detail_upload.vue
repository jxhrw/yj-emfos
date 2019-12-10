<template>
    <div class="ej-main">
        <EJ-Menu></EJ-Menu>
        <div class="ej-content">
            <div class="ej-content-title">
                <h2>数据上传记录</h2>
                <div>
                    <div class="btn-title btn-back" @click="goBack">返回</div>
                </div>
            </div>
            <div class="ej-content-main">
                <el-scrollbar class="ej-content-scrollbar">
                    <div class="base-info">
                        <h4>{{queryObj.name}}</h4>
                        <ul>
                            <!-- <li>今日接收量 <span>{{queryObj.nums.split(',')[0] || 0}}</span></li> -->
                            <li>今日上传量 <span>{{queryObj.nums.split(',')[1] || 0}}</span></li>
                            <li>今日上传错误量 <span>{{queryObj.nums.split(',')[2] || 0}}</span></li>
                            <li>今日上传延时量 <span>{{queryObj.nums.split(',')[3] || 0}}</span></li>
                        </ul>
                        <div class="content">
                            <el-row class="content-row-select">
                                <el-col :span="7">
                                    <label>范围</label>
                                    <el-select v-model="rangeSelect" placeholder="请选择" size='mini' class="content-select" clearable>
                                        <el-option v-for="item in rangeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="7">
                                    <label>返回码 <span v-popover:popover>?</span></label>
                                    <el-input v-model="feedback" placeholder="请输入" size='mini' class="content-select" clearable></el-input>

                                    <el-popover ref="popover" placement="right" width="250" trigger="hover" popper-class="codeTips-popover">
                                        <el-scrollbar class="codeTips-box">
                                            <ul>
                                                <li>
                                                    <label>返回码</label>
                                                    <span>返回码的意义</span>
                                                </li>
                                                <li>
                                                    <label>1</label>
                                                    <span>正常</span>
                                                </li>
                                                <li v-for="item in codeTips" :key="item.dicCode">
                                                    <label>{{item.dicCode}}</label>
                                                    <span>{{item.dicName}}</span>
                                                </li>
                                            </ul>
                                        </el-scrollbar>
                                    </el-popover>
                                </el-col>
                                <el-col :span="7">&nbsp;</el-col>
                                <el-col :span="3">
                                    <div class="relative">
                                        <div class="content-search" @click="searchTableReset">
                                            <p>查询</p>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <!-- <EJ-Depiction></EJ-Depiction> -->
                    <div class="depiction-info">
                        <div class="title">
                            <!-- 范围：
                            <el-select v-model="rangeSelect" placeholder="请选择" size='mini' class="content-select" clearable>
                                <el-option v-for="item in rangeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                </el-option>
                            </el-select> -->
                        </div>
                        <!-- <ul class="result-stas-btns">
                            <li>
                                返回码：
                                <span :class="{'active':true}">在过段时间给i但是囧哥i估计该市的线</span>
                                <span :class="{'active':false}">间给i但是囧哥i估计该市的线</span>
                            </li>
                        </ul> -->
                        <div class="content">
                            <el-table :highlight-current-row='false' :data="tableData" stripe border class="content-table" @current-change="currentSelect" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                                <el-table-column label="共享范围" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        {{scope.row.SHARE_TYPE_NAME}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="数据编码" show-overflow-tooltip min-width="150">
                                    <template slot-scope="scope">
                                        {{scope.row.SHARE_ID}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="接收时间" show-overflow-tooltip min-width="110">
                                    <template slot-scope="scope">
                                        {{scope.row.ACCEPT_TIME}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="发送时间" show-overflow-tooltip min-width="110">
                                    <template slot-scope="scope">
                                        {{scope.row.SEND_TIME}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="结果返回时间" show-overflow-tooltip min-width="110">
                                    <template slot-scope="scope">
                                        {{scope.row.SUCCESS_TIME}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="FEEDBACK_VALUE" label="结果返回代码" show-overflow-tooltip min-width="90"></el-table-column>
                                <!-- <el-table-column prop="UPLOAD_TIME" label="返回信息" show-overflow-tooltip min-width="150"></el-table-column> -->
                            </el-table>
                            <EJ-Paging ref="tableList" id="managePage" :totalCount="totalCount" :totalPage="totalPage" :queryConditions="queryConditions" @pageAsk="searchTable"></EJ-Paging>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>
<script>
    import Menu from "components/common/menu";
    import Common from "@/assets/js/common.js";
    import Paging from "components/common/paging_new";
    export default {
        filters: {
            dateShow(val) {
                return Common.dateFormat('yyyy-MM-dd hh:mm:ss', new Date(parseInt(val)));
            }
        },
        components: {
            "EJ-Menu": Menu,
            "EJ-Paging": Paging
        },
        data() {
            return {
                title: "数据统计",
                token: "",
                isTableLoading: false,
                islineLoading: false,
                tableData: [],
                totalCount: 0,
                totalPage: 1,
                // 查询条件
                queryConditions: {},
                queryObj: { nums: '' },
                relation: true,
                rangeSelect: '',
                rangeList: [],
                feedback: '',
                codeTips: []
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.queryObj = this.$route.query;
            this.queryConditions = {
                pageSize: 10,
                currentPage: 1
            };
            this.searchTableReset();
            // 范围
            this.getDicInfo('VEHPASSSHARETYPE').then(res => {
                if (res.appCode == 0) { this.rangeList = res.resultList || []; }
            });

            let cwdm = '-1,-10,-20,-24,-100,-101,-102,-103,-104,-105,-106,-107,-108,-401,-402,-403,-404,-405,-406,-407,-408,-409,-410,-411,-412,-413,-414,-415,-416,-601,-602,-603,-604,-605,-606,-607,-608,-609,-610,-611,-612,-613,-614,-615,-616,-617,-618,-619,-701,-702,-703,-707,-708,-711,-712,-719,-721,-722,-729,-731,-732,-733,-734';
            let cwms = '通讯超时,接入服务程序启动失败，应用服务器地址未在系统中备案,java程序发生异常,未进行初始连接（通行信息上传）,调用初始化连接接口时传入的XML格式错误,初始化连接时未找对应卡口编号的卡口信息,初始化连接时未找对应卡口的车道信息,该卡口无权通过该接入点服务程序初始化连接,过车文本数据重复上传，已存在同一卡口编号、方向类型、车道号、过车时间的过车数据,特征图片上传接口未接收到二进制流文件,图片上传接口未接收到二进制流文件,未配置特征图片接入路径,未配置过车图片接入路径,传入的接口序列号为空,传入的接口ID为空,接口授权中不存在传入的接口序列号,验证接口序列号时出现异常,接口序列号不合法,验证接口校验位异常,接口校验位被非法修改,该接口序列号无权调用该接口ID,部局已对该序列号停用本接口,当前系统已对该序列号停用本接口,上传程序的IP地址不在该接口序列号授权范围内,接口尚未启用,接口已过有效期,接口不存在，或接口被非法修改,接口已过有效期,部局未启用该接口,传入的【卡口编号】参数长度不为12位,传入的【方向类型】参数长度不为1位,传入的【方向类型】参数值必须为1或2,传入的【车道号】参数值必须在1-99内,传入的【号牌种类】参数值长度不为2位,传入的【号牌种类】参数值不允许为99,传入的【号牌号牌】参数值不允许为空,传入的【号牌号牌】参数值长度大于9位,传入的【号牌号牌】参数值长度小于6位,传入的【号牌种类】为41时，【号牌号牌】不为-,传入的【号牌颜色】参数值长度不为1位,传入的【号牌种类】、【号牌颜色】逻辑错误,传入的【过车时间】参数值为空,传入的【过车时间】参数值格式不符合yyyy-mm-dd hh24:mi:ss,传入的【车辆速度】参数值大于999,传入的【车外廓长】参数值大于99999,传入的【图片路径】、【图片名称】参数值中均包含了JPG文件扩展名,传入的【车辆类型】参数值长度大于3,传入的【过车时间】格式不正确,URL地址为空,下载临时文件未找到,缉查布控图片服务中未找到图片,未配置特征图片访问路径,未配置过车图片访问路径,从ftp文件服务未找到图片,从ftp文件服务取流报异常,从ftp文件服务读取图片的其他异常,建立http连接失败,从http服务读取流失败,从http服务读取图片的其他异常,跨边界图片请求异常,跨边界图片交换失败,跨边界图片交换在公安网内访问路径未找到图片,驻地外方式图片交换在写入内网时报错';
            let arr = cwdm.split(',');
            let name = cwms.split(',');
            this.codeTips = [];
            arr.forEach((item, index) => {
                this.codeTips.push({ dicCode: arr[index], dicName: name[index] });
            });
        },
        methods: {
            searchTableReset() {
                this.queryConditions.offsiteId = this.queryObj.id;
                this.queryConditions.startTime = Common.dateFormat('yyyy-MM-dd', new Date()) + ' 00:00:00';
                this.queryConditions.endTime = Common.dateFormat('yyyy-MM-dd', new Date()) + ' 23:59:59';
                this.queryConditions.shareType = this.rangeSelect;
                this.queryConditions.feedback = this.feedback;
                this.queryConditions.currentPage = 1;
                this.$refs.tableList.zjCurrentPage = 1;
                this.searchTable();
            },
            searchTable() {
                this.isTableLoading = true;
                this.$api.get(
                        `${this.$config.idcs_HOST}/vehPass/pageBayonetUploadDetail4Efoms_s.htm`, { token: this.token, data: JSON.stringify(this.queryConditions) },
                        null
                    )
                    .then(res => {
                        this.isTableLoading = false;
                        if (!res.resultList) return;
                        this.tableData = res.resultList.result;
                        this.totalCount = res.resultList.totalCount || 0;
                        this.currentPage = res.resultList.currentPage || 1;

                        // }
                    });
            },
            // 数据字典
            getDicInfo(parentCode) {
                return this.$api.getMethod(this.$config.ubms_HOST, '/PublicDic/getPublicDic.htm', { token: this.token, data: JSON.stringify({ "parentCode": parentCode }) });
            },
            currentSelect(e) {},
            goBack() {
                window.history.back();
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "../../assets/css/main.css";
    @import "../../assets/css/select.css";
    @import "../../assets/css/baseInfo.css";

    @import "../../assets/css/table.css";
    @import "../../assets/css/dialog.css";
    @import "../../assets/css/depiction.css";


    .ej-content-title {
        .btn-title {
            width: 44px;
            height: 20px;
            border-radius: 1px;
            line-height: 20px;
            text-align: center;
            margin-top: 8px;
            font-size: 12px;
            cursor: pointer;
            display: inline-block;
            margin-right: 20px;

            &:hover {
                opacity: 0.5;
            }

            &:active {
                opacity: 0.9;
            }
        }

        .btn-back {
            background: rgba(255, 255, 255, 0.09);
            border: 1px solid #4F5A64;
            color: #4F5A64;
        }
    }

    .base-info {
        padding: 15px 40px;
        font-size: 12px;

        h4 {
            font-size: 14px;
        }

        ul {
            margin-top: 10px;
            display: flex;

            li {
                margin-right: 30px;
                color: #737e84;

                span {
                    color: #000;
                    margin-left: 5px;
                }
            }
        }

        .content {
            padding-left: 0;

            label {
                text-align: left;
                width: auto;
                min-width: 48px;

                span {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    line-height: 12px;
                    border-radius: 50%;
                    border: 1px solid #6c7883;
                    text-align: center;
                    cursor: pointer;
                }
            }
        }
    }

    .depiction-info {
        position: relative;
        font-size: 12px;

        .title {
            // height: auto;
            // padding: 6px 0;

            &::before {
                display: none;
            }

            .content-select {
                width: 220px;

                /deep/ .el-input__inner {
                    border-radius: 0;
                    background: #f9fafc;
                    border: 1px solid #e1e7ed;
                }
            }
        }

        .result-stas-btns {
            display: flex;
            flex-wrap: wrap;
            margin: 0 40px;
            margin-bottom: -5px;

            li {
                margin-right: 20px;
                margin-top: 10px;

                span {
                    margin-right: 5px;
                    margin-bottom: 5px;
                    color: #666;
                    background: #FDF6EC;
                    border: 1px solid #FBF0DF;
                    border-radius: 20px;
                    padding: 0 6px;
                    color: #E58600;
                    display: inline-block;
                    cursor: pointer;

                    &.active {
                        background: #ECA848;
                        border-color: #FBF0DF;
                        color: #fff;
                    }
                }
            }
        }
    }

    .page-box-info {
        font-size: medium;
    }
</style>
<style>
    @import "../../assets/css/tableHeight.css";

    .codeTips-popover {
        padding-left: 0;
        padding-right: 0;
    }

    .codeTips-box {
        height: 400px;
    }

    .codeTips-box .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .codeTips-box ul {
        padding: 0 15px;
        font-size: 12px;
    }

    .codeTips-box li {
        display: flex;
    }

    .codeTips-box li+li {
        margin-top: 8px;
    }

    .codeTips-box label {
        width: 45px;
    }

    .codeTips-box span {
        flex: 1;
        overflow: hidden;
    }
</style>