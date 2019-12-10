import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const insdj = resolve => require(['components/inspection/insdj'], resolve);
const inskk = resolve => require(['components/inspection/insdj.1'], resolve);
const insvdjc = resolve => require(['components/inspection/insvdjc'], resolve);
const insdc = resolve => require(['components/inspection/insvdjc.1'], resolve);
const insxq = resolve => require(['components/inspection/insvdjc.2'], resolve);
const inswb = resolve => require(['components/inspection/insvdjc.3'], resolve);
const insvd = resolve => require(['components/inspection/insvd'], resolve);
const insxh = resolve => require(['components/inspection/insxh'], resolve);
const insyd = resolve => require(['components/inspection/insyd'], resolve);

export default new Router({
    mode: 'hash',
    routes: [{
            path: '/inswb',
            name: 'inswb',
            component: inswb
        },
        {
            path: '/insxq',
            name: 'insxq',
            component: insxq
        },
        {
            path: '/insdc',
            name: 'insdc',
            component: insdc
        },
        {
            path: '/insxh',
            name: 'insxh',
            component: insxh
        }, {
            path: '/insyd',
            name: 'insyd',
            component: insyd
        }, {
            path: '/insvd',
            name: 'insvd',
            component: insvd
        }, {
            path: '/insvdjc',
            name: 'insvdjc',
            component: insvdjc
        }, {
            path: '/inskk',
            name: 'inskk',
            component: inskk
        }, {
            path: '/',
            name: 'insdj',
            component: insdj
        }, {
            path: '/insdj',
            name: 'insdj',
            component: insdj
        }
    ]
});