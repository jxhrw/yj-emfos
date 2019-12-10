import Vue from 'vue';
import router from './router';
import Insvdmd from './insvdmd.vue';
import api from '@/assets/js/http.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Factory from '@/assets/js/factory.js';
import filters from '@/assets/js/filters.js';
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
var factory = new Factory();
api.get('./config.json').then((res) => {
    factory.init(process.env, () => {
        Vue.prototype.$config = res;
        var vue = new Vue({
            el: '#app',
            router,
            components: {
                Insvdmd
            },
            template: '<Insvdmd/>'
        });
    }, res);
});
Vue.prototype.$api = api;
Vue.prototype.$factory = factory;
Vue.config.productionTip = false;
Vue.use(ElementUI);
