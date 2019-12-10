import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const data = resolve => require(['components/statistics/data'], resolve);
const detail_receive = resolve => require(['components/statistics/detail_receive'], resolve);
const detail_upload = resolve => require(['components/statistics/detail_upload'], resolve);
const detection = resolve => require(['components/statistics/detection'], resolve);
const ledger = resolve => require(['components/statistics/ledger'], resolve);
const years = resolve => require(['components/statistics/years'], resolve);
const state = resolve => require(['components/statistics/state'], resolve);
const gather = resolve => require(['components/statistics/gather'], resolve);
const gatherKK = resolve => require(['components/statistics/gather_kk'], resolve);
const gatherDJ = resolve => require(['components/statistics/gather_dj'], resolve);

const det_upload = resolve => require(['components/statistics/det_detail_upload'], resolve);
// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [{
    path: '/404',
    component: data,
    name: '404',
    meta: {
        title: '404未找到'
    }
}];
const mainRouter = [{
    path: '/gatherKK',
    name: 'gatherKK',
    component: gatherKK
}, {
    path: '/gatherDJ',
    name: 'gatherDJ',
    component: gatherDJ
}, {
    path: '/det_upload',
    name: 'det_upload',
    component: det_upload
}, {
    path: '/gather',
    name: 'gather',
    component: gather
}, {
    path: '/state',
    name: 'state',
    component: state
}, {
    path: '/years',
    name: 'years',
    component: years
}, {
    path: '/ledger',
    name: 'ledger',
    component: ledger
}, {
    path: '/detection',
    name: 'detection',
    component: detection
}, {
    path: '/detail_upload',
    name: 'detail_upload',
    component: detail_upload
}, {
    path: '/detail_receive',
    name: 'detail_receive',
    component: detail_receive
}, {
    path: '/',
    name: 'data',
    component: data
}];
const router = new Router({
    mode: 'hash',
    scrollBehavior: () => ({
        y: 0
    }),
    isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
    routes: globalRoutes.concat(mainRouter)
});
export default router;