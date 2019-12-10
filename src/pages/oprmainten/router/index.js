import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const oprdepart = resolve => require(['components/oprmainten/oprdepart'], resolve);
const oprperson = resolve => require(['components/oprmainten/oprperson'], resolve);
const opradd = resolve => require(['components/oprmainten/opradd'], resolve);
const oprview = resolve => require(['components/oprmainten/oprview'], resolve);
const oprmodify = resolve => require(['components/oprmainten/oprmodify'], resolve);
const personview = resolve => require(['components/oprmainten/personview'], resolve);
const personadd = resolve => require(['components/oprmainten/personadd'], resolve);
const personmodify = resolve => require(['components/oprmainten/personmodify'], resolve);
const resallocate2 = resolve => require(['components/oprmainten/resallocate2'], resolve);
// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [{
    path: '/404',
    component: oprdepart,
    name: '404',
    meta: {
        title: '404未找到'
    }
}];
const mainRouter = [{
    path: '/',
    name: 'oprdepart',
    component: oprdepart
}, {
    path: '/oprdepart',
    name: 'oprdepart',
    component: oprdepart
}, {
    path: '/oprperson',
    name: 'oprperson',
    component: oprperson
}, {
    path: '/opradd',
    name: 'opradd',
    component: opradd
}, {
    path: '/oprview',
    name: 'oprview',
    component: oprview
}, {
    path: '/oprmodify',
    name: 'oprmodify',
    component: oprmodify
}, {
    path: '/personview',
    name: 'personview',
    component: personview
}, {
    path: '/personadd',
    name: 'personadd',
    component: personadd
}, {
    path: '/personmodify',
    name: 'personmodify',
    component: personmodify
}, {
    path: '/resallocate2',
    name: 'resallocate2',
    component: resallocate2
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