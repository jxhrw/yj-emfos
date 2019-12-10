import Vue from 'vue';
import router from './router';
import Repdesc from './repdesc.vue';
import api from '@/assets/js/http.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Factory from '@/assets/js/factory.js';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
var factory = new Factory();
api.get('./config.json').then((res) => {
  factory.init(process.env, () => {
    Vue.prototype.$config = res;
    var vue = new Vue({
      el: '#app',
      router,
      components: {
        Repdesc
      },
      template: '<Repdesc/>'
    });
  }, res);
});
Vue.prototype.$api = api;
Vue.prototype.$factory = factory;
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(Viewer);
