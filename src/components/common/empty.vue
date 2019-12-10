<template>
    <div class="m-empty" :style="{color: color,'font-size':fontSize+'px'}" v-show="show">
        <div class="m-empty-body">
            <!-- <svg :class="getClassName" :width="width" :height="height" aria-hidden="true">
                <use :xlink:href="`#icon-${name}`"></use>
            </svg> -->
            <p>{{content}}</p>
        </div>
    </div>
</template>
<script>
    const svgFiles = require.context('@/assets/svg', true, /\.svg$/);
    console.log(svgFiles);
    const iconList = svgFiles.keys().map(item => svgFiles(item));
    console.log(iconList);
    export default {
        props: {
            content: {
                type: String,
                default: '暂无内容'
            },
            iconWidth: {
                type: Number,
                default: 64
            },
            iconHeight: {
                type: Number,
                default: 68
            },
            fontSize: {
                type: Number,
                default: 16
            },
            color: {
                type: String,
                default: '#4D716D'
            },
            className: {
                type: String
            },
            width: {
                type: Number,
                default: 70
            },
            height: {
                type: Number,
                default: 80
            },
            show: {
                type: Boolean,
                default: false
            },
            name: {
                type: String,
                default: 'empty'
            }
        },
        computed: {

            getClassName() {
                return [
                    'icon-svg',
                    `icon-svg__${this.name}`,
                    this.className && /\S/.test(this.className) ? `${this.className}` : ''
                ];
            }
            // getNameList() {
            //     return iconList.map(item => item.default.id.split('-')[1])
            // }
        }
    };
</script>
<style lang='less'>
    .m-empty {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        text-align: center;

        .m-empty-body {
            flex: 1;
            text-align: center;
            // transform: translateY(50%);
        }

        .icon-empty {
            // width: 64px;
            // height: 68px;
        }
    }
</style>