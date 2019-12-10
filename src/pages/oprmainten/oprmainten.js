import Vue from 'vue';
import router from './router';
import Oprmainten from './oprmainten.vue';
import api from '@/assets/js/http.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import ECharts from 'vue-echarts';
// import 'echarts/lib/chart/line'
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/polar'
// import 'echarts/lib/component/legend'
// import 'echarts/lib/component/title.js'
// import Echarts from 'echarts';
import Factory from '@/assets/js/factory.js';
var factory = new Factory();
factory.init(process.env, () => {
    api.get('./config.json').then((res) => {
        Vue.prototype.$config = res;
        var vue = new Vue({
            el: '#app',
            router,
            components: {
                Oprmainten
            },
            template: '<Oprmainten/>'
        });
    });
});
Vue.prototype.$api = api;
Vue.prototype.$factory = factory;
let token = window.location.href.split('=')[1]
Vue.prototype.$token = token;
Vue.config.productionTip = false;
Vue.use(ElementUI);
// Vue.component('chart', ECharts);
// Vue.prototype.echarts = Echarts;
// Vue.use(Echarts);