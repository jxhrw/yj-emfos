<template>
    <ul class="treeItem" v-if="isMount">
        <li v-for="(item, index) in listArr" :key="index" @click.stop="showChild(item)" name="list">
            <div class="table-list">
                <span class="au-width">{{item.name}}</span>
                <span class="fx-width">0</span>
                <span class="fx-width">0</span>
                <span class="fx-width">0</span>
                <span class="fx-width">0</span>
                <span class="fx-width">0</span>
                <span class="fx-width">0</span>
                <span class="fx-width" @click.stop="goList(item)">列表查看</span>
            </div>
            <div class="child-list">
                <tree-item :listArr="item.child" v-if="item.show"></tree-item>
            </div>

        </li>
    </ul>
</template>

<script>
    export default {
        name: "treeItem",
        props: {
            listArr: {
                default: function() {
                    return []
                }
            },
            allShow: {
                type: Boolean,
                default: false
            },
        },
        watch: {
            allShow(val) {
                this.showFuc(val ? '1' : '0');
            }
        },
        data() {
            return {
                isMount: true,
                scopeDefault: [],
                scopes: [],
                openList: [],
                activeId: '',
            }
        },
        created() {
            // this.scope()
            this.$nextTick(() => {
                this.showFuc('0');
                this.bgColor();
            });

        },
        methods: {
            bgColor() {
                this.$nextTick(() => {
                    let list = document.getElementsByName('list');
                    for (let i = 0; i < list.length; i++) {
                        if (i % 2 == 0) {
                            list[i].firstChild.style = "background-color:#ffffff;";
                        } else {
                            list[i].firstChild.style = "background-color:#f5f7fa;";
                        }
                    }
                });
            },
            showChild(item) {
                item.show = !item.show;
                this.bgColor();
            },
            showFuc(type) {
                let bl = type == '1';
                let _this = this;
                let forArr = function(arr) {
                    arr.map(val => {
                        _this.$set(val, 'show', bl);
                        if (val.child && val.child.length > 0) {
                            forArr(val.child);
                        }
                    });
                };
                forArr(this.listArr, bl);
            },
            goList(item) {
                console.log(item.id);
            }
            // forArr(arr, bl) {
            //     arr.map(val => {
            //         this.$set(val, 'show', bl);
            //         // val.show = bl;
            //         if (val.child && val.child.length > 0) {
            //             this.forArr(val.child, bl);
            //         }
            //     });
            // }
        }
    }
</script>

<style lang="less" scoped>
    .treeItem {

        // border: 1px solid #ebeef5;
        >li {
            >.child-list {}
        }

        .treeItem .au-width {
            padding-left: 40px;
        }

        .treeItem .treeItem .au-width {
            padding-left: 60px;
        }

        .treeItem .treeItem .treeItem .au-width {
            padding-left: 80px;
        }

        .treeItem .treeItem .treeItem .treeItem .au-width {
            padding-left: 100px;
        }
    }

    .table-list {
        display: flex;
        width: 100%;
        padding: 5px 0;
        cursor: pointer;
        color: #909399;
        font-size: 12px;

        &:hover {
            background: #f5f7fa;
        }

        .au-width {
            flex: 1;
            box-sizing: border-box;
            min-width: 150px;
            padding-left: 20px;
        }

        .fx-width {
            width: 10%;
            min-width: 50px;
            text-align: center;
        }
    }
</style>