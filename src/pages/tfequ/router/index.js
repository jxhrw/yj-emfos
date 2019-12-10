import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const list = resolve => require(['components/tfequ/list'], resolve);
const detail = resolve => require(['components/tfequ/main'], resolve);

export default new Router({
    mode: 'hash',
    routes: [{
        path: '/detail',
        name: 'detail',
        component: detail
    }, {
        path: '/list',
        name: 'list',
        component: list
    }, {
        path: '/',
        name: 'detail',
        component: detail
    }]
});