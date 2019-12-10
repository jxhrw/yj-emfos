import Vue from 'vue';
import router from './router';
import Statistics from './statistics.vue';
import api from '@/assets/js/http.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title.js'
// import Echarts from 'echarts';
import Factory from '@/assets/js/factory.js';
var factory = new Factory();
api.get('./config.json').then((res) => {
    factory.init(process.env, () => {
        Vue.prototype.$config = res;
        var vue = new Vue({
            el: '#app',
            router,
            components: {
                Statistics
            },
            template: '<Statistics/>'
        });
    }, res);
});
Vue.prototype.$api = api;
Vue.prototype.$factory = factory;
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.component('chart', ECharts);
// Vue.prototype.echarts = Echarts;
// Vue.use(Echarts);