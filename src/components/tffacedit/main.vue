<template>
    <div class="ej-main">
        <EJ-Menu></EJ-Menu>
        <div class="ej-content">
            <div class="ej-content-title">
                <h2>{{title}}</h2>
                <div class="ej-content-black" @click="goBack">
                    <p>返回</p>
                </div>
            </div>
            <div class="ej-content-main">
                <el-scrollbar class="ej-content-scrollbar">
                    <div class="base-info">
                        <div class="base-attribute">
                            <div class="title">
                                <h3>编码属性</h3>
                            </div>
                            <div class="content">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span><i>*</i>设施编号</span></label>
                                        <el-input v-model="facilityId" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span><i>*</i>设施类型</span></label>
                                        <el-select v-model="selectDevcategory" placeholder="" size='mini' class="content-select" :disabled="true">
                                            <el-option v-for="item in devcategoryList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span><i>*</i>设施名称</span></label>
                                        <el-input v-model="devName" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span><i>*</i>设施子类型</span></label>
                                        <el-select v-model="selectSignsType" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in signsTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span><i>*</i>所属辖区</span></label>
                                        <el-input v-if="isReadonly" v-model="selectRegion" placeholder="" size='mini' class="content-select" clearable readonly :disabled="isReadonly"></el-input>
                                        <el-popover v-else highlight-current popper-class="region-popper" ref="popoverSelectRegion" placement="bottom-start" trigger="click" v-model="selectRegionVisible">
                                            <el-input v-model="selectRegion" placeholder="" size='mini' class="content-select" clearable readonly v-popover:popoverSelectRegion slot="reference"></el-input>
                                            <el-scrollbar class="region-scroll">
                                                <el-tree id="selectRegion" :data="regionList" accordion :props="defaultProps" @node-click="handleNodeRegionClick"></el-tree>
                                            </el-scrollbar>
                                        </el-popover>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="base-attribute">
                            <div class="title">
                                <h3>运维状态</h3>
                            </div>
                            <div class="content">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span><i>*</i>维护单位</span></label>
                                        <el-select v-model="selectSafeguardUnit" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in safeguardUnitList" :key="item.opsDeptId" :label="item.opsDeptName" :value="item.opsDeptId">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span><i>*</i>质保期</span></label>
                                        <el-date-picker v-model="warranty" type="date" placeholder="" size='mini' class="content-date" :disabled="isReadonly">
                                        </el-date-picker>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span><i>*</i>使用年限(年)</span></label>
                                        <el-input v-model="serviceLife" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>维护日期</span></label>
                                        <el-date-picker v-model="maintenanceDate" type="date" placeholder="" size='mini' class="content-date" :disabled="isReadonly">
                                        </el-date-picker>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>维护周期(天)</span></label>
                                        <el-input v-model="maintenanceCycle" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span><i>*</i>下次维护日期</span></label>
                                        <el-date-picker v-model="nextMaintenanceDate" type="date" placeholder="" size='mini' class="content-date" :disabled="isReadonly">
                                        </el-date-picker>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="base-attribute">
                            <div class="title">
                                <h3>厂家信息</h3>
                            </div>
                            <div class="content">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>品牌</span></label>
                                        <el-select v-model="brand" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in brandList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                        <!-- <el-input v-model="brand" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input> -->
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span><i>*</i>生产厂家</span></label>
                                        <el-select v-model="factory" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in factoryList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>设施型号</span></label>
                                        <el-input v-model="devType" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>建设单位</span></label>
                                        <el-select v-model="projectUnit" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in projectUnitList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="base-attribute">
                            <div class="title" @click="showInfoVisible('buildInfoVisible')">
                                <h3>建设信息</h3>
                                <div class="content-icon" :class="{'active':buildInfoVisible}"></div>
                            </div>
                            <div class="content" v-show="buildInfoVisible">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>建设项目</span></label>
                                        <el-select v-model="buildingProjects" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in buildingProjectsList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>建设期数</span></label>
                                        <el-input v-model="buildingNum" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span><i>*</i>建设日期</span></label>
                                        <el-date-picker v-model="buildingDate" type="date" placeholder="" size='mini' class="content-date" :disabled="isReadonly">
                                        </el-date-picker>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>验收日期</span></label>
                                        <el-date-picker v-model="checkDate" type="date" placeholder="" size='mini' class="content-date" :disabled="isReadonly">
                                        </el-date-picker>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="base-attribute">
                            <div class="title" @click="showInfoVisible('locationInfoVisible')">
                                <h3>位置信息</h3>
                                <div class="content-icon" :class="{'active':locationInfoVisible}"></div>
                            </div>
                            <div class="content" v-show="locationInfoVisible">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>所属道路</span></label>
                                        <el-select v-model="selectRoad" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in roadList" :key="item.roadId" :label="item.roadName" :value="item.roadId">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>所属路段</span></label>
                                        <el-select v-model="selectRoadSection" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in roadSectionList" :key="item.blockId" :label="item.blockName" :value="item.blockId">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>所属路口</span></label>
                                        <el-select v-model="selectCross" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in crossList" :key="item.crossId" :label="item.crossName" :value="item.crossId">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>位置描述</span></label>
                                        <el-input v-model="locationDesc" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="base-attribute manageBox">
                            <div class="title" @click="showInfoVisible('manageInfoVisible')">
                                <h3>管理信息</h3>
                                <div class="content-icon" :class="{'active':manageInfoVisible}"></div>
                            </div>
                            <div class="content" v-show="manageInfoVisible">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span><i>*</i>管理部门</span></label>
                                        <el-input v-if="isReadonly" v-model="selectManagem" placeholder="" size='mini' class="content-select" clearable readonly :disabled="isReadonly"></el-input>
                                        <el-popover v-else highlight-current popper-class="region-popper managem-popper" ref="popoverSelectManagem" placement="bottom-start" trigger="click" v-model="selectManagemVisible">
                                            <el-input v-model="selectManagem" placeholder="" size='mini' class="content-select" clearable v-popover:popoverSelectManagem slot="reference"></el-input>
                                            <el-scrollbar class="region-scroll">
                                                <el-tree id="selectManagem" :data="managemList" accordion :props="defaultProps" node-key="id" ref="treeManagem" show-checkbox check-strictly @check-change="handleCheckManagemChange"></el-tree>
                                            </el-scrollbar>
                                        </el-popover>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>管理编码</span></label>
                                        <el-input v-model="managemCoding" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                </el-row>
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>责任人</span></label>
                                        <!-- <el-select v-model="person" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                  <el-option v-for="item in personList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                  </el-option>
                              </el-select> -->
                                        <el-input v-model="person" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="base-attribute">
                            <div class="title" @click="showInfoVisible('longInfoVisible')">
                                <h3>经纬度</h3>
                                <div class="content-icon" :class="{'active':longInfoVisible}"></div>
                            </div>
                            <div class="content" v-show="longInfoVisible">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>经纬度</span></label>
                                        <div class="longitude-box">
                                            <el-select v-model="longAndLat" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            </el-select>
                                            <div v-if="!isReadonly" @click="showMapVisible" class="longitude-fixed"></div>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>高程</span></label>
                                        <el-input v-model="altitude" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <!-- <div class="base-attribute">
                  <div class="title" @click="showInfoVisible('comInfoVisible')">
                    <h3>通讯</h3>
                    <div class="content-icon" :class="{'active':comInfoVisible}"></div>
                  </div>
                  <div class="content" v-show="comInfoVisible">
                      <el-row class="content-row-select">
                          <el-col :span="12">
                              <label><span>通讯方式</span></label>
                              <el-select v-model="selectComWay" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                  <el-option v-for="item in comWayList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                  </el-option>
                              </el-select>
                          </el-col>
                          <el-col :span="12">
                              <label><span>通讯协议</span></label>
                              <el-select v-model="selectComTreaty" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                  <el-option v-for="item in comTreatyList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                  </el-option>
                              </el-select>
                          </el-col>
                      </el-row>
                      <el-row class="content-row-select">
                          <el-col :span="12">
                              <label><span><i>*</i>IP</span></label>
                              <el-input v-model="comIp" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                          </el-col>
                          <el-col :span="12">
                              <label><span>端口</span></label>
                              <el-input v-model="comPort" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                          </el-col>
                      </el-row>
                      <el-row class="content-row-select">
                          <el-col :span="12">
                              <label><span>子网掩码</span></label>
                              <el-input v-model="comSubnet" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                          </el-col>
                          <el-col :span="12">
                              <label><span>网关</span></label>
                              <el-input v-model="comGateway" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                          </el-col>
                      </el-row>
                      <el-row class="content-row-select">
                          <el-col :span="12">
                              <label><span><i>*</i>网络类型</span></label>
                              <el-select v-model="selectComNetType" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                  <el-option v-for="item in comNetTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                  </el-option>
                              </el-select>
                          </el-col>
                      </el-row>
                  </div>
                </div> -->
                        <div class="base-attribute">
                            <div class="title" @click="showInfoVisible('supInfoVisible')">
                                <h3>安装信息</h3>
                                <div class="content-icon" :class="{'active':supInfoVisible}"></div>
                            </div>
                            <div class="content" v-show="supInfoVisible">
                                <el-row class="content-row-select">
                                    <el-col :span="12">
                                        <label><span>支持方式</span></label>
                                        <el-select v-model="selectSupportMode" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in supportModeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="12">
                                        <label><span>朝向</span></label>
                                        <el-select v-model="selectOrientation" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                            <el-option v-for="item in orientationList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="base-attribute">
                            <div class="title" @click="showInfoVisible('filesVisible')">
                                <h3>附件信息</h3>
                                <div class="content-icon" :class="{'active':filesVisible}"></div>
                            </div>
                            <div class="content" v-show="filesVisible">
                                <el-row class="content-row-select">
                                    <el-col :span="23" class="file-info">
                                        <label><span>图文附件</span></label>
                                        <span class="file-name">
                                            <div v-for="(item,index) in filesShowList" :key="index" class="file-single">
                                                <el-image v-if="/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(urlToName(item))" :src="item" :preview-src-list="[item]" fit="fill"></el-image>
                                                <a v-else-if="/\.(doc|docx|DOC|DOCX)$/.test(urlToName(item))" :title="urlToName(item)" class="icon-file file-doc" :href="item"></a>
                                                <a v-else-if="/\.(xls|xlsx|XLS|XLSX)$/.test(urlToName(item))" :title="urlToName(item)" class="icon-file file-xls" :href="item"></a>
                                                <a v-else :title="urlToName(item)" class="icon-file file-other" :href="item"></a>

                                                <span v-if="!isReadonly" class="ms-actions">
                                                    <span class="ms-delete" @click="handleDownload(item)">下载</span>
                                                    <span class="ms-delete" @click="handleRemove(item,index)">删除</span>
                                                </span>
                                            </div>
                                            <div v-if="!isReadonly" class="file-single">
                                                <el-upload class="icon-file" style="display:block;" :action="`${$config.ubms_HOST}/ubms-server/file/local/upload/annex`" list-type="picture-card" :headers="{token:token}" :on-success="handleSuccessList" :show-file-list="false">
                                                    <i slot="default" class="el-icon-plus"></i>
                                                </el-upload>
                                            </div>
                                        </span>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <template>
                            <!-- 交通标线 -->
                            <div class="base-attribute" v-if="pageTypeCode == 'REPDEVTYPE21'">
                                <div class="title" @click="showInfoVisible('bxInfoVisible')">
                                    <h3>专属信息</h3>
                                    <div class="content-icon" :class="{'active':bxInfoVisible}"></div>
                                </div>
                                <div class="content" v-show="bxInfoVisible">
                                    <el-row class="content-row-select">
                                        <el-col :span="12">
                                            <label><span>功能</span></label>
                                            <el-select v-model="selectPower" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                                <el-option v-for="item in powerList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="12">
                                            <label><span>设置方式</span></label>
                                            <el-select v-model="selectSetMode" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                                <el-option v-for="item in setModeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                    <el-row class="content-row-select">
                                        <el-col :span="12">
                                            <label><span>形态</span></label>
                                            <el-select v-model="selectForm" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                                <el-option v-for="item in formList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="12">
                                            <label><span>颜色</span></label>
                                            <el-select v-model="selectColor" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                                <el-option v-for="item in colorList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                    <el-row class="content-row-select">
                                        <el-col :span="12">
                                            <label><span>线长(米)</span></label>
                                            <el-input v-model="lineLong" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                        </el-col>
                                        <el-col :span="12">
                                            <label><span>线宽(米)</span></label>
                                            <el-input v-model="lineWide" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                        </el-col>
                                    </el-row>
                                    <el-row class="content-row-select">
                                        <el-col :span="12">
                                            <label><span>涂料</span></label>
                                            <el-select v-model="selectCoating" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                                <el-option v-for="item in coatingList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="12">
                                            <label><span>反光</span></label>
                                            <el-select v-model="selectLight" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                                <el-option v-for="item in lightList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                            <!-- 交通护栏 -->
                            <div class="base-attribute" v-if="pageTypeCode == 'REPDEVTYPE22'">
                                <div class="title" @click="showInfoVisible('hlInfoVisible')">
                                    <h3>专属信息</h3>
                                    <div class="content-icon" :class="{'active':hlInfoVisible}"></div>
                                </div>
                                <div class="content" v-show="hlInfoVisible">
                                    <el-row class="content-row-select">
                                        <el-col :span="12">
                                            <label><span>长度(米)</span></label>
                                            <el-input v-model="hllength" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                        </el-col>
                                        <el-col :span="12">
                                            <label><span>高度(米)</span></label>
                                            <el-input v-model="hlheight" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                        </el-col>
                                    </el-row>
                                    <el-row class="content-row-select">
                                        <el-col :span="12">
                                            <label><span>材质</span></label>
                                            <el-select v-model="selectMaterial" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                                <el-option v-for="item in materialList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                            <!-- 交通标志 -->
                            <div class="base-attribute" v-if="pageTypeCode == 'REPDEVTYPE23'">
                                <div class="title" @click="showInfoVisible('bzInfoVisible')">
                                    <h3>专属信息</h3>
                                    <div class="content-icon" :class="{'active':bzInfoVisible}"></div>
                                </div>
                                <div class="content" v-show="bzInfoVisible">
                                    <el-row class="content-row-select">
                                        <el-col :span="12">
                                            <label><span>显示位置</span></label>
                                            <el-select v-model="selectPosition" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                                <el-option v-for="item in positionList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="12">
                                            <label><span>光学特性</span></label>
                                            <el-select v-model="selectOptical" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                                <el-option v-for="item in opticalList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                    <el-row class="content-row-select">
                                        <el-col :span="12">
                                            <label><span>显示方式</span></label>
                                            <el-select v-model="selectDisplay" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                                <el-option v-for="item in displayList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="12">
                                            <label><span>时效</span></label>
                                            <el-select v-model="selectPrescription" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                                <el-option v-for="item in prescriptionList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                    <el-row class="content-row-select">
                                        <el-col :span="12">
                                            <label><span>强制性</span></label>
                                            <el-select v-model="selectMandatory" placeholder="" size='mini' class="content-select" :disabled="isReadonly">
                                                <el-option v-for="item in mandatoryList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="12">
                                            <label><span>尺寸(厘米)</span></label>
                                            <el-input v-model="bzsize" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                        </el-col>
                                    </el-row>
                                    <el-row class="content-row-select">
                                        <el-col :span="12">
                                            <label><span>安装高度(米)</span></label>
                                            <el-input v-model="bzheight" placeholder="" size='mini' class="content-select" clearable :disabled="isReadonly"></el-input>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </template>
                    </div>
                </el-scrollbar>
            </div>
            <div class="ej-content-operation">
                <div class="submit" v-if="!isReadonly" @click="saveBaseInfo">
                    <p>确定</p>
                </div>
                <!-- <div class="reset" @click="resetRepair"><p>返回</p></div> -->
            </div>
            <el-dialog title="地图定位" :visible.sync="mapVisible" width='460px' :modal="false">
                <div class="dialog-urge">
                    <div class="dialog-main">
                        <div class="revoke-reason map-input">
                            <label class="dialog-label" style="text-align:left;">经纬度</label>
                            <el-input v-model="dialogLongitude" placeholder="" size='mini' class="dialog-select" readonly clearable></el-input>
                            <el-button type="primary" size='mini' class="map-btn map-green" @click="test" style="background: #00C187;">设置点</el-button>
                            <el-button type="primary" size='mini' class="map-btn">还原</el-button>
                        </div>
                        <div class="revoke-reason" style="margin:0;height:240px;">
                            <div id="mapLocation"></div>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" size='mini' class="submit" @click="mapVisible=false">保 存</el-button>
                        <el-button @click="mapVisible=false" size='mini' class="cancel">取 消</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import Menu from "components/common/menu";
    import Bus from "@/assets/js/bus.js";
    import Common from "@/assets/js/common.js";
    import qs from 'qs';
    let _map;
    export default {
        components: {
            "EJ-Menu": Menu
        },
        filters: {
            urlToName(val) {
                var str = '';
                if (val.indexOf('/') > -1) {
                    let arr = val.split('/');
                    str = arr[arr.length - 1];
                }
                return str;
            }
        },
        data() {
            return {
                title: "资产信息",
                token: "",
                pageTypeCode: "",
                baseInfo: {},
                isReadonly: true,
                facilityId: '',
                selectDevcategory: '',
                devcategoryList: [],
                selectSignsType: '',
                signsTypeList: [],
                devName: '',
                selectRegion: '',
                selectRegionCode: '',
                regionList: [],
                selectRegionVisible: false,
                selectSafeguardUnit: '',
                safeguardUnitList: [],
                warranty: '',
                serviceLife: '',
                maintenanceDate: '',
                maintenanceCycle: '',
                nextMaintenanceDate: '',
                brand: '',
                brandList: '',
                factory: '',
                factoryList: [],
                devType: '',
                projectUnit: '',
                projectUnitList: [],
                buildingProjects: '',
                buildingProjectsList: [],
                buildingNum: '',
                buildingDate: '',
                checkDate: '',
                selectRoad: '',
                roadList: [],
                selectRoadSection: '',
                roadSectionList: [],
                selectCross: '',
                crossList: [],
                locationDesc: '',
                selectManagem: '',
                selectManagemList: [],
                selectManagemCodeList: [],
                managemList: [],
                selectManagemVisible: false,
                managemCoding: '',
                person: '',
                personList: [],
                longitude: '',
                latitude: '',
                longAndLat: '',
                altitude: '',
                selectComWay: '',
                comWayList: [],
                selectComTreaty: '',
                comTreatyList: [],
                comIp: '',
                comPort: '',
                comSubnet: '',
                comGateway: '',
                selectComNetType: '',
                comNetTypeList: [],
                selectSupportMode: '',
                supportModeList: [],
                selectOrientation: '',
                orientationList: [],
                filesList: [], // 原始路径
                filesShowList: [], // 代理后的图片路径用于展示
                // 专属信息
                selectPower: '',
                powerList: [],
                selectSetMode: '',
                setModeList: [],
                selectForm: '',
                formList: [],
                selectColor: '',
                colorList: [],
                lineLong: '',
                lineWide: '',
                selectCoating: '',
                coatingList: [],
                selectLight: '',
                lightList: '',
                hlheight: '',
                hllength: '',
                selectMaterial: '',
                materialList: [],
                selectPosition: '',
                positionList: [],
                selectOptical: '',
                opticalList: [],
                selectDisplay: '',
                displayList: '',
                selectPrescription: '',
                prescriptionList: [],
                selectMandatory: '',
                mandatoryList: [],
                bzsize: '',
                bzheight: '',
                buildInfoVisible: true,
                locationInfoVisible: true,
                manageInfoVisible: true,
                longInfoVisible: true,
                comInfoVisible: true,
                supInfoVisible: true,
                filesVisible: true,
                bzInfoVisible: true,
                bxInfoVisible: true,
                hlInfoVisible: true,

                postData: {},
                isAdd: true,
                mapVisible: false,
                isHaveMap: false,
                dialogLongitude: '',
                defaultProps: {
                    children: 'children',
                    label: 'text'
                }
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.isReadonly = Common.getQueryString("type") == "onlyread";
            this.pageTypeCode = Common.getQueryString("facilityTypeCode");
            this.isAdd = Common.getQueryString("facilityId") == null || Common.getQueryString("facilityId") == "";
            if (this.isAdd) {
                this.title = "资产信息-添加";
            } else if (!this.isReadonly) {
                this.title = "资产信息-修改";
            } else {
                this.title = "资产信息-详情";
            }
            if (!this.isAdd) {
                this.getInfoFuc();
            } else {
                switch (this.pageTypeCode) {
                    case "REPDEVTYPE21": // 交通标线
                        this.selectDevcategory = "SIGNSCLASS02"; // 设施类型
                        break;
                    case "REPDEVTYPE22": // 交通护栏
                        this.selectDevcategory = "SIGNSCLASS03"; // 设施类型
                        break;
                    case "REPDEVTYPE23": // 交通标志
                        this.selectDevcategory = "SIGNSCLASS01"; // 设施类型
                        break;
                    default:
                        break;
                }
                // 设施类型
                this.getDicInfo(this.$config.dev_getDicInfo_GET, { 'parentCode': 'SIGNSCLASS' }).then(res => {
                    if (res.appCode == 0) { this.devcategoryList = res.resultList; }
                });
            }

            // 生产厂家
            this.getDicInfo(this.$config.getDeviceDic_GET, { 'parentCode': 'DEVICEFACTORY' }).then(res => {
                if (res.appCode == 0) { this.factoryList = res.resultList; }
            });
            // 建设项目
            this.getDicInfo(this.$config.getDeviceDic_GET, { 'parentCode': 'DEVICEPROJECT' }).then(res => {
                if (res.appCode == 0) { this.buildingProjectsList = res.resultList; }
            });
            // 建设单位
            this.getDicInfo(this.$config.getDeviceDic_GET, { 'parentCode': 'DEVICECOMPANY' }).then(res => {
                if (res.appCode == 0) { this.projectUnitList = res.resultList; }
            });

            if (!this.isReadonly && true) {
                // 设施类型
                this.getDicInfo(this.$config.dev_getDicInfo_GET, { 'parentCode': 'SIGNSCLASS' }).then(res => {
                    if (res.appCode == 0) { this.devcategoryList = res.resultList; }
                });
                // 维护单位
                // this.getDicInfo(this.$config.getDeptInfo_GET, {}).then(res => {
                //     if (res.appCode == 0) { this.safeguardUnitList = res.resultList; }
                // });
                this.getDicInfo(`/ubms-server/OpsDeptInfo/getOpsDeptTreeRoot.htm`, { deptTypeCode: 'OPSDEPTTYPE01,OPSDEPTTYPE03' }).then(res => {
                    this.safeguardUnitList = res.resultList || [];
                });
                // 所属道路
                this.getDicInfo(this.$config.getRoadInfo_GET, {}).then(res => {
                    if (res.appCode == 0) { this.roadList = res.resultList; }
                });
                // 所属路段
                this.getDicInfo(this.$config.getBlockName_GET, {}).then(res => {
                    if (res.appCode == 0) { this.roadSectionList = res.resultList; }
                });
                // 所属路口
                this.getDicInfo(this.$config.getCrossName_GET, {}).then(res => {
                    if (res.appCode == 0) { this.crossList = res.resultList; }
                });
                // 管理部门
                this.getDicInfo(this.$config.ubms_getDeptTree_GET, {}).then(res => {
                    if (res.appCode == 0) { this.managemList = res.resultList; }
                });
                // 品牌
                this.getDicInfo(this.$config.dev_getDicInfo_GET, { 'parentCode': 'BRANDCODE' }).then(res => {
                    if (res.appCode == 0) { this.brandList = res.resultList; }
                });
                // // 通讯方式
                // this.getDicInfo(this.$config.dev_getDicInfo_GET, {'parentCode': 'SIGNSCONNECT'}).then(res => {
                //     if (res.appCode == 0) { this.comWayList = res.resultList; }
                // });
                // // 通讯协议
                // this.getDicInfo(this.$config.dev_getDicInfo_GET, {'parentCode': 'MODBUSRTU'}).then(res => {
                //     if (res.appCode == 0) { this.comTreatyList = res.resultList; }
                // });
                // // 网络类型
                // this.getDicInfo(this.$config.dev_getDicInfo_GET, {'parentCode': 'NETMODE'}).then(res => {
                //     if (res.appCode == 0) { this.comNetTypeList = res.resultList; }
                // });
                // 支持方式
                this.getDicInfo(this.$config.dev_getDicInfo_GET, { 'parentCode': 'SIGNSSTRUCT' }).then(res => {
                    if (res.appCode == 0) { this.supportModeList = res.resultList; }
                });
                // 朝向
                this.getDicInfo(this.$config.trf_getDicInfo_GET, { 'parentCode': 'ROADDIRECT' }).then(res => {
                    if (res.appCode == 0) { this.orientationList = res.resultList; }
                });
                // 责任人
                // this.getDicInfo(this.$config.getPersonInfo_GET, {}).then(res => {
                //     if (res.appCode == 0) { this.personList = res.resultList; }
                // });

                // 区域
                this.getRegionTree(null).then(res => {
                    if (res.appCode == 0) { this.regionList = res.resultList; }
                });
                // 维护单位
                this.getDeptTree(null).then(res => {
                    // if (res.appCode == 0) { this.managemList = res.resultList; }
                });
            }
        },
        watch: {
            selectRegion(newVal, oldVal) {
                if (newVal === '') {
                    this.selectRegionCode = '';
                    setTimeout(() => {
                        this.selectRegionVisible = false;
                    });
                }
            },
            selectManagem(newVal, oldVal) {
                if (newVal === '') {
                    this.selectManagemCodeList = [];
                    this.$refs.treeManagem.setCheckedKeys([]);
                    setTimeout(() => {
                        this.selectManagemVisible = false;
                    });
                }
            },
            selectManagemList(newVal, oldVal) {
                this.selectManagem = this.selectManagemList.join('，');
            },
            selectDevcategory(newVal, oldVal) {
                if (!this.isReadonly) {
                    // 设施子类型
                    this.getDicInfo(this.$config.dev_getDicInfo_GET, { 'parentCode': newVal }).then(res => {
                        if (res.appCode == 0) { this.signsTypeList = res.resultList; }
                    });
                    switch (newVal) {
                        case "SIGNSCLASS02": // 交通标线
                            // 功能
                            this.getDicInfo(this.$config.dev_getDicInfo_GET, { 'parentCode': 'SIGNSABILITY' }).then(res => {
                                if (res.appCode == 0) { this.powerList = res.resultList; }
                            });
                            // 设置方式
                            this.getDicInfo(this.$config.dev_getDicInfo_GET, { 'parentCode': 'SIGNSMODEL' }).then(res => {
                                if (res.appCode == 0) { this.setModeList = res.resultList; }
                            });
                            // 形态
                            this.getDicInfo(this.$config.dev_getDicInfo_GET, { 'parentCode': 'SIGNSFORM' }).then(res => {
                                if (res.appCode == 0) { this.formList = res.resultList; }
                            });
                            // 颜色
                            this.getDicInfo(this.$config.dev_getDicInfo_GET, { 'parentCode': 'SIGNSCOLOR' }).then(res => {
                                if (res.appCode == 0) { this.colorList = res.resultList; }
                            });
                            // 涂料
                            this.getDicInfo(this.$config.dev_getDicInfo_GET, { 'parentCode': 'SIGNSCOATING' }).then(res => {
                                if (res.appCode == 0) { this.coatingList = res.resultList; }
                            });
                            // 反光
                            this.lightList = [{ dicCode: '0', dicName: '不反光' }, { dicCode: '1', dicName: '反光' }];
                            break;
                        case "SIGNSCLASS03": // 交通护栏
                            // 材质
                            this.getDicInfo(this.$config.dev_getDicInfo_GET, { 'parentCode': 'SIGNSMATERIAL' }).then(res => {
                                if (res.appCode == 0) { this.materialList = res.resultList; }
                            });
                            break;
                        case "SIGNSCLASS01": // 交通标志
                            // 显示位置
                            this.getDicInfo(this.$config.dev_getDicInfo_GET, { 'parentCode': 'SIGNSLOCATION' }).then(res => {
                                if (res.appCode == 0) { this.positionList = res.resultList; }
                            });
                            // 光学特性
                            this.getDicInfo(this.$config.dev_getDicInfo_GET, { 'parentCode': 'SIGNSOPTICAL' }).then(res => {
                                if (res.appCode == 0) { this.opticalList = res.resultList; }
                            });
                            // 显示方式
                            this.getDicInfo(this.$config.dev_getDicInfo_GET, { 'parentCode': 'SIGNSDISPLAY' }).then(res => {
                                if (res.appCode == 0) { this.displayList = res.resultList; }
                            });
                            // 时效
                            this.getDicInfo(this.$config.dev_getDicInfo_GET, { 'parentCode': 'SIGNSVALIDITY' }).then(res => {
                                if (res.appCode == 0) { this.prescriptionList = res.resultList; }
                            });
                            // 强制性
                            this.getDicInfo(this.$config.dev_getDicInfo_GET, { 'parentCode': 'SIGNSFORCE' }).then(res => {
                                if (res.appCode == 0) { this.mandatoryList = res.resultList; }
                            });
                            break;
                        default:
                            break;
                    }
                }
            },
            filesList(val) {
                let arr = [];
                this.filesList.map(res => {
                    if (this.$config.baseimgs_file) {
                        arr.push(`${this.$config.baseimgs_file}?token=${this.token}&path=${res}`);
                    } else {
                        arr.push(res);
                    }
                });
                this.filesShowList = arr;
            }
        },
        methods: {
            // 必填项判断
            isMustFill() {
                if (this.facilityId == "") {
                    Common.ejMessage('warning', '设施编号为必填项');
                    return false;
                }
                if (this.selectDevcategory == "") {
                    Common.ejMessage('warning', '设施类型为必填项');
                    return false;
                }
                if (this.devName == "") {
                    Common.ejMessage('warning', '设施名称为必填项');
                    return false;
                }
                if (this.selectRegionCode == "") {
                    Common.ejMessage('warning', '所属辖区为必填项');
                    return false;
                }
                if (this.selectSafeguardUnit == "") {
                    Common.ejMessage('warning', '维护单位为必填项');
                    return false;
                }
                if (this.warranty == "") {
                    Common.ejMessage('warning', '质保期为必填项');
                    return false;
                }
                if (this.serviceLife == "") {
                    Common.ejMessage('warning', '使用年限为必填项');
                    return false;
                }
                if (this.nextMaintenanceDate == "") {
                    Common.ejMessage('warning', '下次维护日期为必填项');
                    return false;
                }
                if (this.factory == "") {
                    Common.ejMessage('warning', '生产厂家为必填项');
                    return false;
                }
                if (this.buildingDate == "") {
                    Common.ejMessage('warning', '建设日期为必填项');
                    return false;
                }
                if (this.selectManagemCodeList.length < 1) {
                    Common.ejMessage('warning', '管理部门为必填项');
                    return false;
                }
                // if (this.longAndLat == "") {
                //   Common.ejMessage('warning', '经纬度为必填项');
                //   return false;
                // }
                // if (this.comIp == "") {
                //   Common.ejMessage('warning', 'IP为必填项');
                //   return false;
                // }
                // if (this.selectComNetType == "") {
                //   Common.ejMessage('warning', '网络类型为必填项');
                //   return false;
                // }

                return true;
            },
            // 获取公用部分的修改数据
            getPostData() {
                this.postData.facilityTypeCode = this.selectDevcategory; // 设施类型
                this.postData.regionId = this.selectRegionCode; // 所属辖区
                this.postData.oppmDept = this.selectSafeguardUnit; // 维护单位
                if (this.warranty != '') {
                    this.postData.periodDate = new Date(this.warranty).getTime(); // 质保期(年),日期格式
                }
                this.postData.useAge = this.serviceLife; // 使用年限(年)
                if (this.maintenanceDate != '') {
                    this.postData.oppmDate = new Date(this.maintenanceDate).getTime(); // 维护日期,日期格式
                }
                this.postData.oppmCycle = this.maintenanceCycle; // 维护周期
                if (this.nextMaintenanceDate != '') {
                    this.postData.nextOppmDate = new Date(this.nextMaintenanceDate).getTime(); // 下次维护日期,日期格式
                }
                this.postData.brand = this.brand; // 品牌
                this.postData.manufact = this.factory; // 生产厂家
                this.postData.ctrlModeCode = this.devType; // 设施型号
                this.postData.company = this.projectUnit; // 建设单位
                this.postData.project = this.buildingProjects; // 建设项目
                // this.postData. = this.buildingNum;// 建设期数
                if (this.buildingDate != '') {
                    this.postData.buildDate = new Date(this.buildingDate).getTime(); // 建设日期,日期格式
                }
                if (this.checkDate != '') {
                    this.postData.checkDate = new Date(this.checkDate).getTime(); // 验收日期,日期格式
                }
                this.postData.roadId = this.selectRoad; // 所属道路
                this.postData.blockId = this.selectRoadSection; // 所属路段
                this.postData.crossId = this.selectCross; // 所属路口
                this.postData.siteDescrible = this.locationDesc; // 位置描述
                this.postData.manageDept = this.selectManagemCodeList[0]; // 管理部门
                this.postData.manageId = this.managemCoding; // 管理编码
                this.postData.managePerson = this.person; // 责任人
                if (this.longAndLat.split("，").length > 1) {
                    this.postData.coordX = this.longAndLat.split("，")[0]; // 经纬度
                    this.postData.coordY = this.longAndLat.split("，")[1];
                }
                this.postData.facilHight = this.altitude; // 高程
                // this.postData.dispathMode = this.selectComWay;// 通讯方式
                // this.postData.dispathTreaty = this.selectComTreaty;// 通讯协议
                // this.postData.ip = this.comIp;// IP
                // this.postData.port = this.comPort;// 端口
                // this.postData.netMask = this.comSubnet;// 子网掩码
                // this.postData.gateway = this.comGateway;// 网关
                // this.postData.netMode = this.selectComNetType;// 网络类型
                this.postData.supportModeCode = this.selectSupportMode; // 支持方式
                this.postData.orientCode = this.selectOrientation; // 朝向
                this.postData.filePath = this.filesList.join(','); //附件
            },
            // 获取修改状态的接口,和部分差异数据
            getModifyInterface() {
                let method = "";
                let obj = {};
                // if (!this.isMustFill()) { return false; }
                switch (this.pageTypeCode) {
                    case "REPDEVTYPE21": // 交通标线
                        method = this.isAdd ? this.$config.addMarkingInfo_POST : this.$config.editMarkingInfo_POST;
                        obj.markingId = this.facilityId;
                        obj.markingName = this.devName;
                        obj.usage = this.selectPower;
                        obj.settingModel = this.selectSetMode;
                        obj.shape = this.selectForm;
                        obj.color = this.selectColor;
                        obj.length = this.lineLong;
                        obj.width = this.lineWide;
                        obj.coating = this.selectCoating;
                        obj.isReflects = this.selectLight;
                        break;
                    case "REPDEVTYPE22": // 交通护栏
                        method = this.isAdd ? this.$config.addRailingInfo_POST : this.$config.editRailingInfo_POST;
                        obj.railingId = this.facilityId;
                        obj.railingName = this.devName;
                        obj.length = this.hllength;
                        obj.hight = this.hlheight;
                        obj.textire = this.selectMaterial;
                        break;
                    case "REPDEVTYPE23": // 交通标志
                        method = this.isAdd ? this.$config.addSignInfo_POST : this.$config.editSignInfo_POST;
                        obj.signId = this.facilityId;
                        obj.signName = this.devName;
                        obj.showLocation = this.selectPosition;
                        obj.optProperties = this.selectOptical;
                        obj.showWay = this.selectDisplay;
                        obj.effectmess = this.selectPrescription;
                        obj.compulsory = this.selectMandatory;
                        obj.bit = this.bzsize;
                        obj.fixHight = this.bzheight;
                        break;
                    default:
                        break;
                }
                return { 'method': method, 'object': obj };
            },
            // 保存资产信息的修改
            saveBaseInfo() {
                let method = this.getModifyInterface().method;
                this.postData = this.getModifyInterface().object;
                if (!method) { return; }
                this.getPostData();
                this.changeDevFuc(method, this.postData, (res) => {
                    window.history.back();
                });
            },
            // 修改基础信息的方法
            changeDevFuc(method, dataInfo, callback) {
                let host = this.$config.jtss_HOST;
                let obj = {};
                obj = {
                    token: this.token,
                    data: JSON.stringify(dataInfo)
                };
                // this.$api.postMethod(host, method, qs.stringify(obj), this.token).then(res => {
                this.$api.postMethod(host, method + "?data=" + encodeURIComponent(JSON.stringify(dataInfo)), null, this.token).then(res => {
                        if (res.appCode == 0) {
                            callback(res);
                        } else {
                            Common.printErrorLog(host, method);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(host, method);
                        console.log(err);
                    });
            },
            // 获取基础信息的接口
            getInfoInterface() {
                let method = "";
                let obj = {};
                let facilityId = Common.getQueryString("facilityId");
                let signsType = Common.getQueryString("signsType");
                obj.signsType = signsType;
                switch (this.pageTypeCode) {
                    case "REPDEVTYPE21": // 交通标线
                        method = this.$config.getMarkingInfo_GET;
                        obj.markingId = facilityId;
                        break;
                    case "REPDEVTYPE22": // 交通护栏
                        method = this.$config.getRailingInfo_GET;
                        obj.railingId = facilityId;
                        break;
                    case "REPDEVTYPE23": // 交通标志
                        method = this.$config.getSignInfo_GET;
                        obj.signId = facilityId;
                        break;
                    default:
                        break;
                }
                return { 'method': method, 'object': obj };
            },
            getInfoFuc() {
                let host = this.$config.jtss_HOST;
                let method = this.getInfoInterface().method;
                let obj = {
                    token: this.token,
                    data: JSON.stringify(this.getInfoInterface().object)
                };
                this.$api.getMethod(host, method, obj, this.token).then(res => {
                        if (res.appCode == 0) {
                            let resObj = res.resultList[0];
                            this.baseInfo = resObj;
                            this.getFilesInfo();
                            switch (this.pageTypeCode) {
                                case "REPDEVTYPE21": // 交通标线
                                    this.facilityId = resObj.markingId; // 设施编号
                                    this.devName = resObj.markingName; // 设施名称
                                    this.selectDevcategory = !this.isReadonly ? "SIGNSCLASS02" : "交通标线"; // 设施类型
                                    this.selectPower = !this.isReadonly ? resObj.usage : resObj.usageName; // 功能
                                    this.selectSetMode = !this.isReadonly ? resObj.settingModel : resObj.settingModelName; // 设置方式
                                    this.selectForm = !this.isReadonly ? resObj.shape : resObj.shapeName; // 形态
                                    this.selectColor = !this.isReadonly ? resObj.color : resObj.colorName; // 颜色
                                    this.lineLong = resObj.length; // 线长
                                    this.lineWide = resObj.width; // 线宽
                                    this.selectCoating = !this.isReadonly ? resObj.coating : resObj.coatingName; // 涂料
                                    this.selectLight = !this.isReadonly ? resObj.isReflects : resObj.isReflects; // 反光
                                    break;
                                case "REPDEVTYPE22": // 交通护栏
                                    this.facilityId = resObj.railingId; // 设施编号
                                    this.devName = resObj.railingName; // 设施名称
                                    this.selectDevcategory = !this.isReadonly ? "SIGNSCLASS03" : "交通护栏"; // 设施类型
                                    this.hllength = resObj.length; // 长度
                                    this.hlheight = resObj.hight; // 高度
                                    this.selectMaterial = !this.isReadonly ? resObj.textire : resObj.textireName; // 材质
                                    break;
                                case "REPDEVTYPE23": // 交通标志
                                    this.facilityId = resObj.signId; // 设施编号
                                    this.devName = resObj.signName; // 设施名称
                                    this.selectDevcategory = !this.isReadonly ? "SIGNSCLASS01" : "交通标志"; // 设施类型
                                    this.selectPosition = !this.isReadonly ? resObj.showLocation : resObj.showLocationName; // 显示位置
                                    this.selectOptical = !this.isReadonly ? resObj.optProperties : resObj.optPropertiesName; // 光学特性
                                    this.selectDisplay = !this.isReadonly ? resObj.showWay : resObj.showWayName; // 显示方式
                                    this.selectPrescription = !this.isReadonly ? resObj.effectmess : resObj.effectmessName; // 时效
                                    this.selectMandatory = !this.isReadonly ? resObj.compulsory : resObj.compulsoryName; // 强制性
                                    this.bzsize = resObj.bit; // 尺寸
                                    this.bzheight = resObj.fixHight; // 安装高度
                                    break;
                                default:
                                    break;
                            }
                            // 设施子类型
                            this.selectSignsType = !this.isReadonly ? resObj.signsType : resObj.signsTypeName;
                            // 所属辖区
                            this.selectRegion = resObj.regionName;
                            this.selectRegionCode = resObj.regionId;
                            // 维护单位
                            this.selectSafeguardUnit = !this.isReadonly ? resObj.oppmDept : resObj.oppmDeptName;
                            // 质保期(年),日期格式
                            this.warranty = resObj.periodDate ? Common.dateFormat('yyyy-MM-dd', new Date(parseInt(resObj.periodDate))) : '';
                            // 使用年限(年)
                            this.serviceLife = resObj.useAge;
                            // 维护日期,日期格式
                            this.maintenanceDate = resObj.oppmDate ? Common.dateFormat('yyyy-MM-dd', new Date(parseInt(resObj.oppmDate))) : '';
                            // 维护周期
                            this.maintenanceCycle = resObj.oppmCycle;
                            // 下次维护日期,日期格式
                            this.nextMaintenanceDate = resObj.nextOppmDate ? Common.dateFormat('yyyy-MM-dd', new Date(parseInt(resObj.nextOppmDate))) : '';
                            // 品牌
                            this.brand = !this.isReadonly ? resObj.brand : resObj.brandName;
                            // 生产厂家
                            this.factory = resObj.manufact;
                            // 设施型号
                            this.devType = !this.isReadonly ? resObj.ctrlModeCode : resObj.ctrlModeName;
                            // 建设单位
                            this.projectUnit = resObj.company;
                            // 建设项目
                            this.buildingProjects = resObj.project;
                            // 建设期数
                            this.buildingNum = '';
                            // 建设日期,日期格式
                            this.buildingDate = resObj.buildDate ? Common.dateFormat('yyyy-MM-dd', new Date(parseInt(resObj.buildDate))) : '';
                            // 验收日期,日期格式
                            this.checkDate = resObj.checkDate ? Common.dateFormat('yyyy-MM-dd', new Date(parseInt(resObj.checkDate))) : '';
                            // 所属道路
                            this.selectRoad = !this.isReadonly ? resObj.roadId : resObj.roadName;
                            // 所属路段
                            this.selectRoadSection = !this.isReadonly ? resObj.blockId : resObj.blockName;
                            // 所属路口
                            this.selectCross = !this.isReadonly ? resObj.crossId : resObj.crossName;
                            // 位置描述
                            this.locationDesc = resObj.siteDescrible;
                            // 管理部门
                            this.selectManagemCodeList = [resObj.manageDept];
                            this.selectManagemList = [resObj.oppmDeptName];
                            // this.getDicInfo(this.$config.getDeptInfo_GET, {}).then(res => {
                            //   if (res.appCode == 0) {
                            //     let arr = res.resultList.filter(item => item.deptId == resObj.manageDept);
                            //     this.selectManagemList = [arr[0].deptName];
                            //   }
                            // });
                            // console.log(this.selectManagemCodeList, this.selectManagemList);
                            // 管理编码
                            this.managemCoding = resObj.manageId;
                            // 责任人
                            this.person = resObj.managePerson;
                            // 经纬度
                            if (resObj.coordX && resObj.coordY) {
                                this.longAndLat = resObj.coordX + '，' + resObj.coordY;
                            }
                            // 高程
                            this.altitude = resObj.facilHight;
                            // // 通讯方式
                            // this.selectComWay = !this.isReadonly ? resObj.dispathMode : resObj.dispathModeName;
                            // // 通讯协议
                            // this.selectComTreaty = !this.isReadonly ? resObj.dispathTreaty : resObj.dispathTreatyName;
                            // // IP
                            // this.comIp = resObj.ip || '';
                            // // 端口
                            // this.comPort = resObj.port || '';
                            // // 子网掩码
                            // this.comSubnet = resObj.netMask || '';
                            // // 网关
                            // this.comGateway = resObj.gateway || '';
                            // // 网络类型
                            // this.selectComNetType = !this.isReadonly ? resObj.netMode : resObj.netModeName;
                            // 支持方式
                            this.selectSupportMode = !this.isReadonly ? resObj.supportModeCode : resObj.supportModeName;
                            // 朝向
                            this.selectOrientation = !this.isReadonly ? resObj.orientCode : resObj.orientName;
                        } else {
                            Common.printErrorLog(host, method);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(host, method);
                        console.log(err);
                    });
            },
            getFilesInfo() {
                this.filesList = (this.baseInfo.filePath || '').split(',');
            },
            // 地图定位相关--start
            // 保存经纬度修改
            saveLongAndLat() {
                if (this.longAndLat.indexOf("，") == -1) {
                    Common.ejMessage("warning", "请设置经纬度坐标");
                    return;
                }
                let method = this.getModifyInterface().method;
                let info = this.getModifyInterface().object;
                info.coordX = this.longAndLat.split("，")[0];
                info.coordY = this.longAndLat.split("，")[1];
                this.changeDevFuc(method, info, (res) => {
                    this.changeNetLongAndLat(info.coordX, info.coordY);
                    this.mapVisible = false;
                });
            },
            longAndLatReduction() {
                this.getPoint(this.longitude, this.latitude, true, true, false);
            },
            showMapVisible() {
                this.mapVisible = true;
                this.$nextTick(() => {
                    if (!this.isHaveMap) this.initMap();
                });
            },
            test() {
                /**
                 *地图取点，通过点击地图获取地图上某位置的坐标值
                 * map.getPoint(callback, symbol);
                 *callback：回调函数，取点结束返回坐标值
                 *symbol：在取点位置绘制的图表样式，如symbol为空则不绘制图表
                 **/
                let _this = this;
                _map.getPoint(function(e) {
                    _this.getPoint(e.x, e.y, true, false, false);
                });
            },
            changeNetLongAndLat(x, y) {
                this.longitude = x;
                this.latitude = y;
            },
            // clearLayer是否清除之前的点，cententAt是否把点位居中，changeLongAndLat是否修改经纬度的记录
            getPoint(x, y, clearLayer, cententAt, changeLongAndLat) {
                if (clearLayer) _map.clearLayerById("layer0");
                // 定位到地图
                var autoLongitude = x;
                var autoLatitude = y;
                if (autoLongitude != null && autoLatitude != null && autoLongitude != 0 && autoLatitude != 0) {
                    autoLongitude = parseFloat(autoLongitude).toFixed(6);
                    autoLatitude = parseFloat(autoLatitude).toFixed(6);
                    this.longAndLat = autoLongitude + "，" + autoLatitude;
                    if (changeLongAndLat) {
                        this.changeNetLongAndLat(autoLongitude, autoLatitude);
                    }
                    if (cententAt) _map.centerAt([autoLongitude, autoLatitude]);
                    _map.addPoint2GraphicsLayer({
                        geom: {
                            "x": autoLongitude,
                            "y": autoLatitude,
                            "spatialReference": { "wkid": 4326 }
                        }
                        // symbol: {
                        //   "url": "./images/bg_tuding_02.png",
                        //   "height": 7,
                        //   "width": 5,
                        //   "type": "esriPMS"
                        //   // "xoffset":  0,
                        //   // "yoffset":  10
                        // }
                    }, "layer0", false);
                    // _map.zoomTo(6);
                }
            },
            initMap() {
                var _this = this;
                let _layer = "自定义地图";
                _map = new EJMap("mapLocation", {
                    zoom: 4,
                    toolbar: true, // 是否显示常用工具组件
                    zoomSlider: true, // 缩放控件
                    scalebar: true, // 比例尺控件
                    navigationbar: true, // 是否显示鱼骨
                    config: this.$config.mapConfig
                });
                _map.addEventListener(EJMap.Event.onLayerAdded, function(e) {
                    _map.setLayerVisibleById(_layer, false);
                    // if (e.layer.id == _layer) {
                    //     _map.setLayerVisibleById(_layer, false);
                    // }
                    _this.getPoint(_this.baseInfo.coordX, _this.baseInfo.coordY, false, true, true);
                });
                this.isHaveMap = true;
            },
            // 地图定位相关--end
            showInfoVisible(key) {
                this[key] = !this[key];
            },
            handleNodeRegionClick(data, node, e) {
                let thisId = e.$parent.$parent.$parent.$attrs.id || e.$parent.$parent.$attrs.id || e.$parent.$attrs.id;
                if (!data.children || data.children.length == 0) {
                    this.selectRegion = data.text;
                    this.selectRegionCode = data.id;
                    this.selectRegionVisible = false;
                }
            },
            handleCheckManagemChange(data, node, e) {
                console.log(data);
                if (!data.children || data.children.length == 0) {
                    let index = this.selectManagemList.indexOf(data.text);
                    if (index > -1) {
                        this.selectManagemList.splice(index, 1);
                        this.selectManagemCodeList.splice(index, 1);
                    } else {
                        this.selectManagemList.push(data.text);
                        this.selectManagemCodeList.push(data.id);
                    }
                    // this.selectManagemVisible = false;
                }
            },
            handleSuccessList(response, file, fileList) {
                console.log(response);
                if (response.indexOf('/script>') > -1) {
                    let txt = response.split('/script>')[1];
                    let obj = JSON.parse(txt);
                    let url = (obj.resultList || '').replace(/[\;]/g, "");
                    if (url.indexOf('/upload') > -1) {
                        url = url.split('/upload')[0] + '/ubms-server/upload' + url.split('/upload')[1];
                    }
                    this.filesList.push(url);
                }
            },
            handleRemove(e, index) {
                this.filesList.splice(index, 1);
            },
            handleDownload(e) {
                var link = document.createElement('a');
                link.setAttribute("download", "");
                link.href = e;
                link.click();
            },
            urlToName(val) {
                var str = '';
                if (val.indexOf('/') > -1) {
                    let arr = val.split('/');
                    str = arr[arr.length - 1];
                }
                return str;
            },
            getRegionTree(parentCode) {
                return this.$api.getMethod(this.$config.efoms_HOST, this.$config.getRegionTree_GET, { token: this.token, data: JSON.stringify({ regionId: parentCode }) });
            },
            getDeptTree(parentCode) {
                return this.$api.getMethod(this.$config.ubms_HOST, "/ubms-server/DeptInfo/getDeptTree.htm", { token: this.token, data: JSON.stringify({ regionId: parentCode }) });
            },
            getDicInfo(method, prarms) {
                let host = this.$config.ubms_HOST;
                // let method = this.$config.getRoadInfo_GET;
                let obj = {
                    token: this.token,
                    data: JSON.stringify(prarms)
                };
                return this.$api.getMethod(host, method, obj, this.token);
            },
            goBack() {
                window.history.back();
            }
        }
    };
</script>
<style scoped>
    @import "../../assets/css/main.css";
    @import "../../assets/css/baseInfo.css";
    @import "../../assets/css/select.css";
    @import "../../assets/css/dialog.css";

    .base-info {
        padding-bottom: 20px;
        margin-bottom: 0;
    }

    .base-info .el-col label {
        text-align: right;
    }

    .base-info .el-col:nth-child(2n+1) label {
        width: 68px;
    }

    .base-info .el-col:nth-child(2n) label {
        width: 80px;
        text-align: right;
    }

    .base-info .el-col label span {
        position: relative;
    }

    .base-info .el-col label span i {
        position: absolute;
        color: #f90404;
        left: -7px;
    }

    .base-info .content .content-date>>>.el-input__inner {
        border: none;
        background: #F9FAFC;
    }

    .base-info .title {
        cursor: pointer;
    }

    .base-info .content-icon {
        float: right;
        width: 28px;
        height: 28px;
        background: url('../../assets/images/icon-arrow-double.png') no-repeat center/100%;
        cursor: pointer;
        margin-top: -13px;
        transform: rotate(90deg);
    }

    .base-info .content-icon.active {
        transform: rotate(-90deg);
    }

    .base-attribute .longitude-box {
        position: relative;
        display: inline-block;
        cursor: pointer;
    }

    .base-attribute .longitude-box .longitude-fixed {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 2;
    }

    /* 弹窗样式 */
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

    .dialog-urge .dialog-main .dialog-label i {
        position: absolute;
        color: #f90404;
        left: -7px;
    }

    .dialog-urge .dialog-main .dialog-tips {
        font-size: 12px;
        color: #999999;
        min-height: 100px;
    }

    .dialog-urge .dialog-main>>>.el-textarea__inner {
        height: 134px;
        background: #f9fafc;
    }

    .ej-content>>>.el-dialog__title {
        font-size: 14px;
    }

    .dialog-urge .dialog-main .map-input .dialog-select {
        width: 220px;
    }

    .dialog-urge .dialog-main .map-input .map-btn {
        background: #ffffff;
        border-color: #E1E7ED;
        width: 60px;
        text-align: center;
        padding: 7px 0;
        color: #6C7883;
    }

    .dialog-urge .dialog-main .map-input .map-green {
        background: #00C187;
        color: #ffffff;
    }
</style>

<style lang="less" scoped>
    .file-info {
        display: flex;
        align-items: center;

        .file-name {
            flex: 1;
            display: flex;
            align-items: center;

            .file-single {
                position: relative;
                margin-right: 10px;

                /deep/ .el-image {
                    width: 60px;
                    height: 60px;
                    display: block;
                }

                /deep/ .el-upload {
                    width: 60px;
                    height: 60px;
                    line-height: 64px;
                    border-style: solid;
                    background-color: #fff;
                    border-radius: 0;
                    border-color: #c0ccda;

                    .el-icon-plus {
                        font-size: 20px;
                    }
                }

                &:hover {
                    .ms-actions {
                        display: flex;
                        justify-content: space-between;
                    }
                }

                .ms-actions {
                    position: absolute;
                    width: 100%;
                    height: 16px;
                    bottom: 0;
                    box-sizing: border-box;
                    padding: 0 6px;
                    background: rgba(0, 0, 0, 0.3);
                    display: none;

                    .ms-delete {
                        color: #fff;
                        font-size: 12px;
                        line-height: 16px;
                        transform: scale(0.9);
                        white-space: nowrap;
                        cursor: pointer;
                    }
                }

                .icon-file {
                    display: block;
                    width: 60px;
                    height: 60px;

                    &.file-doc {
                        background: url('../../assets/images/file-word.png') no-repeat center/120%;
                    }

                    &.file-xls {
                        background: url('../../assets/images/file-execl.png') no-repeat center/120%;
                    }

                    &.file-other {
                        background: url('../../assets/images/file-file.png') no-repeat center/120%;
                    }
                }
            }
        }

        /deep/ .el-image-viewer__close {
            color: #fff;
        }
    }
</style>
<style>
    .navigationbar {
        top: 10px;
    }

    .ej-content-scrollbar {
        height: 100%;
    }

    .ej-content-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .region-popper {
        width: 300px;
        padding: 5px 0;
    }

    .managem-popper .el-checkbox {
        display: none;
    }

    .managem-popper .el-tree-node__expand-icon.is-leaf.is-leaf+.el-checkbox {
        display: inline-block;
    }
</style>