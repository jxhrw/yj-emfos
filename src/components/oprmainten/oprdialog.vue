<template>
    <div class="opr-dialog">
        <el-dialog :title='panelTitle' :visible.sync="childOprDialog" width="50%" :before-close="handleClose">
            <div class="panel-body"></div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: {
        showOprDialog: {
          type: Boolean,
          default: 0,
        },
        row: {
            type: Object,
            default: {}
        },
        oprTitle: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            panelTitle: '查看',
            childOprDialog: false,
        }
    },
    watch: {
        showOprDialog: {
          handler: function(newValue, oldValue) {
            this.childOprDialog = newValue
          }
        },
        row: {
            handler: function(newVal, oldVal) {
                console.log(newVal);
            }
        },
        oprTitle: {
            handler: function(newVal, oldVal) {
                this.panelTitle = newVal
            }
        }
    },
    methods: {
        handleClose() {
            this.childOprDialog = false
        },
    }
}
</script>