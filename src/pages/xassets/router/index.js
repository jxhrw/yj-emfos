import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const mapSearch = resolve => require(['components/x-assets/mapSearch'], resolve);
const map = resolve => require(['components/x-assets/mapAll'], resolve);
const mapMain = resolve => require(['components/x-assets/mapMaintain'], resolve);
const room = resolve => require(['components/x-assets/room'], resolve);

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [{
    path: '/404',
    component: mapSearch,
    name: '404',
    meta: {
        title: '404未找到'
    }
}];
const mainRouter = [{
    path: '/room',
    name: 'room',
    component: room
}, {
    path: '/map',
    name: 'map',
    component: map
}, {
    path: '/mapMain',
    name: 'mapMain',
    component: mapMain
}, {
    path: '/mapSearch',
    name: 'mapSearch',
    component: mapSearch
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