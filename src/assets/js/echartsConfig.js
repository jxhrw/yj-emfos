// 两个柱子配置
export var barDoubleChartOption = {
    backgroundColor: '#ffffff',
    tooltip: { // 提示框组件
        trigger: 'axis',
        // formatter: '{b}<br />{a0}: {c0}<br />{a1}: {c1}',
        // axisPointer: {
        //     type: 'shadow',
        //     label: {
        //         backgroundColor: '#6a7985'
        //     }
        // },
        textStyle: {
            color: '#fff',
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 12
        }
    },
    grid: {
        left: '40',
        right: '40',
        bottom: '15',
        top: 36,
        padding: '0 10 10 50',
        containLabel: true
    },
    legend: { // 图例组件，颜色和名字
        right: 40,
        top: 0,
        itemGap: 24,
        itemWidth: 4,
        itemHeight: 4,
        borderWidth: 0,
        icon: "square",
        data: [{
                name: '平均响应时间'
            },
            {
                name: '3丢包率'
            }
        ],
        textStyle: {
            color: '#6D747C',
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 12,
            padding: [2, 0, 0, 0]
        }
    },
    xAxis: [{
        type: 'category',
        boundaryGap: true, // 坐标轴两边留白
        data: ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
        axisLabel: { // 坐标轴刻度标签的相关设置。
            interval: 0, // 设置为 1，表示『隔一个标签显示一个标签』
            margin: 15,
            textStyle: {
                color: '#565961',
                fontStyle: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 12
            }
        },
        axisTick: { // 坐标轴刻度相关设置。
            show: false
        },
        axisLine: { // 坐标轴轴线相关设置
            lineStyle: {
                color: '#F7F8F9'
                // opacity: 0.2
            }
        },
        splitLine: { // 坐标轴在 grid 区域中的分隔线。
            show: false
        }
    }],
    yAxis: [{
        type: 'value',
        name: "",
        nameTextStyle: {
            color: "#011F2C",
            width: 0
        },
        splitNumber: 4,
        max: "dataMax",
        minInterval: 1,
        axisLabel: {
            textStyle: {
                color: '#878A92',
                fontStyle: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 12
            }
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: ['#F7F8F9'],
                opacity: 0.6
            }
        }

    }],
    series: [{
            name: '平均响应时间',
            type: 'bar',
            // yAxisIndex: 0, // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            data: [4.9, 7.3, 10, 5.6, 7.7, 5.6, 4.2, 3.6, 6, 6.4],
            barWidth: 8,
            barGap: 0, // 柱间距离
            // label: { // 图形上的文本标签
            //     normal: {
            //         show: true,
            //         position: 'top',
            //         textStyle: {
            //             color: '#a8aab0',
            //             fontStyle: 'normal',
            //             fontFamily: '微软雅黑',
            //             fontSize: 12
            //         }
            //     }
            // },
            itemStyle: { // 图形样式
                color: "#80A5FF"
            }
        },
        {
            name: '丢包率',
            type: 'bar',
            // yAxisIndex: 1, // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            data: [2.9, 5, 4.4, 2.7, 20, 4.6, 1.2, 2.7, 4.8, 6.0],
            barWidth: 8,
            barGap: 0.2, // 柱间距离
            // label: {// 图形上的文本标签
            //     normal: {
            //        show: true,
            //        position: 'top',
            //        textStyle: {
            //            color: '#a8aab0',
            //            fontStyle: 'normal',
            //            fontFamily: '微软雅黑',
            //            fontSize: 12
            //        }
            //     }
            // },
            itemStyle: { // 图形样式
                color: "#61C2FF"
            }
        },
        {
            name: '432423',
            type: 'bar',
            // yAxisIndex: 1, // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            data: [2.9, 5, 4.4, 2.7, 20, 4.6, 1.2, 2.7, 4.8, 6.0],
            barWidth: 8,
            barGap: 0.2, // 柱间距离
            // label: {// 图形上的文本标签
            //     normal: {
            //        show: true,
            //        position: 'top',
            //        textStyle: {
            //            color: '#a8aab0',
            //            fontStyle: 'normal',
            //            fontFamily: '微软雅黑',
            //            fontSize: 12
            //        }
            //     }
            // },
            itemStyle: { // 图形样式
                color: "#72E3BC"
            }
        }
    ]
};

// 折线配置
export var lineChartOption = {
    color: ['#11D79B', '#7AE6EE'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#BBBFCA'
            }
        },
        backgroundColor: '#fff',
        borderColor: 'rgba(1,29,147,0.05)',
        borderWidth: 0,
        extraCssText: 'box-shadow: 0 2px 6px 0 rgba(1,1,48,0.10);',
        textStyle: {
            color: '#3D434F',
            fontSize: 12
        },
        formatter: '<span style="color:#C3C2D4">{b}</span><br />流量&nbsp;&nbsp;&nbsp;{c0}'
    },
    legend: {
        top: 8,
        right: 10,
        icon: 'line',
        textStyle: {
            color: '#4D4A75'
        },
        data: []
    },
    grid: {
        left: 50,
        right: 35,
        bottom: 10,
        top: 10,
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#C8CBD4'
        },
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    yAxis: [{
        type: 'value',
        minInterval: 1,
        nameTextStyle: {
            fontFamily: 'PingFangSC-Regular',
            fontSize: 12,
            color: '#C8CBD4'
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#C8CBD4'
        },
        splitLine: {
            lineStyle: {
                color: '#F5F7FC'
            }
        }
    }],
    series: [{
        type: 'line',
        symbol: 'circle',
        symbolSize: 2,
        showSymbol: false,
        smooth: true,
        emphasis: {
            itemStyle: {
                borderColor: '#11D79B',
                borderWidth: 3,
                shadowColor: 'rgba(120,120,168,0.28)',
                shadowBlur: 10
            }
        },
        data: [1, 2, 32, 43, 5, 6, 7, 8, 9]
    }]
}