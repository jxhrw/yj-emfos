<template>
    <el-row class="content-img-upload">
        <el-col :span="24" class="content-row-img">
            <label>图片上传</label>
            <template v-for="(item,index) in zjImgFiles">
                <div class="img-preview" @mouseenter="enter(index)" @mouseleave="leave()" :key="index">
                    <img :src="item.mappingAddress || item.FileURL" width="100%" height="auto" alt="">
                    <div class="img-del" v-show="seen&&index==current" @click="delImg(index)">
                        <p>删除</p>
                    </div>
                </div>
            </template>
            <div class="img-add" @click="$refs.imgFile.click()">
                <img src="../../assets/images/icon-upload.png" width="24" height="24" alt="">
                <input type="file" name="" id="imgFile" style="display:none" ref="imgFile" @change="upload('imgFile')" multiple="multiple">
            </div>
        </el-col>
    </el-row>
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
            imgFiles: {
                type: Array,
                default: function() {
                    return [];
                }
            }
        },
        data() {
            return {
                token: '',
                seen: false,
                current: 0,
                zjImgFiles: [], // 图片显示数据，经过接口处理,由父组件控制
                imgFileList: [] // 图片本地数据，用于接口提交
            };
        },
        watch: {
            imgFileList(newVal, oldVal) {
                let name = "upload-" + this.id;
                Bus.$emit(name, newVal);
            },
            imgFiles(newVal, oldVal) {
                this.zjImgFiles = newVal;
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
        },
        methods: {
            enter(index) {
                this.seen = true;
                this.current = index;
            },
            leave() {
                this.seen = false;
                this.current = null;
            },
            delImg(index) {
                var files = [];
                this.zjImgFiles.forEach((e, i) => {
                    if (i != index) {
                        files.push(e);
                    } else {
                        this.delFiles(e);
                        this.imgFileList.splice(index, 1);
                    }
                });
                this.zjImgFiles = files;
            },
            upload(fileId) {
                var formData = new FormData();
                var file = document.getElementById(fileId).files[0];
                var url = (file && file.name) ? file.name : '';
                var extStart = url.lastIndexOf(".");
                var ext = url.substring(extStart, url.length).toUpperCase();
                if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
                    Common.ejMessage("warning", "图片限于png,gif,jpeg,jpg格式");
                    return false;
                }

                formData.append("file", file);
                this.$api.postMethod(this.$config.efoms_HOST, '/file/uploadFile', formData, this.token)
                    .then(res => {
                        if (res.appCode == 0) {
                            this.zjImgFiles.push(res.resultList);
                            this.imgFileList.push({
                                fileName: file.name,
                                fileURL: res.resultList.downloadPath,
                                fileMode: file.name
                                    .slice(file.name.lastIndexOf(".") + 1)
                                    .toLowerCase()
                            });
                        } else {
                            Common.printErrorLog(this.$config.efoms_HOST, '/file/uploadFile');
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(this.$config.efoms_HOST, '/file/uploadFile');
                        console.log(err);
                    });
            },
            delFiles(e) {
                var obj = {
                    token: this.token,
                    secondDir: e.secondDir,
                    fileName: e.fileName
                };
                this.$api.deleteMethod(this.$config.efoms_HOST, '/file/deleteFile', obj)
                    .then(res => {
                        if (res.appCode == 0) {} else {
                            Common.printErrorLog(this.$config.efoms_HOST, '/file/deleteFile');
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(this.$config.efoms_HOST, '/file/deleteFile');
                        console.log(err);
                    });
            }
        }
    };
</script>
<style scoped>
    .content-img-upload {
        font-size: 12px;
        line-height: 12px;
    }

    .content-img-upload .img-preview {
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

    .content-img-upload .img-preview .img-del {
        opacity: 0.62;
        background: #7A7A7A;
        width: 50px;
        height: 15px;
        position: absolute;
        bottom: 1px;
    }

    .content-img-upload .img-preview .img-del p {
        font-size: 10px;
        color: #FFFFFF;
        text-align: center;
        cursor: pointer;
        ;
    }

    .content-img-upload .img-add {
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

    .content-img-upload .content-row-img {
        font-size: 12px;
        line-height: 12px;
        display: flex;
    }

    .content-img-upload .content-row-img label {
        line-height: 30px;
    }
</style>