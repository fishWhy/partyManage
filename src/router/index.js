// import{createApp} from "vue";
import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";

import vuex from "../store/index.js"

const routes = [
    {
        path: '/',
        redirect: '/login'
        // redirect: '/home/table'
        // redirect: "/selfForm",
    }, {
        path: "/home",
        name: "Home",
        component: Home,
        children: [
            {
                path: "table",
                name: "basetable",
                meta: {
                    title: '表格',
                    requiresAuth:true
                },
                component: () => import (
                /* webpackChunkName: "table" */
                "../views/BaseTable.vue")
            },{
                path: "form",
                name: "baseform",
                meta: {
                    title: '表单',
                    requiresAuth:true 
                },
                component: () => import (
                /* webpackChunkName: "form" */
                "../views/BaseForm.vue")
            }, 
            {
                path: "branchs",
                name: "baseBranchs",
                meta: {
                    title: '支部信息',
                    requiresAuth:true
                },
                component: () => import (
                /* webpackChunkName: "charts" */
                "../views/BaseBranchs.vue")
            },
            // {
            //     path: "upload",
            //     name: "upload",
            //     meta: {
            //         title: '上传插件'
            //     },
            //     component: () => import (
            //     /* webpackChunkName: "upload" */
            //     "../views/Upload.vue")
            // },
            // {
            //     path: "dashboard",
            //     name: "dashboard",
            //     meta: {
            //         title: '系统首页'
            //     },
            //     component: () => import (
            //     /* webpackChunkName: "dashboard" */
            //     "../views/Dashboard.vue")
            // }


            // {
            //     path: "charts",
            //     name: "basecharts",
            //     meta: {
            //         title: '图表',
            //         requiresAuth:true
            //     },
            //     component: () => import (
            //     /* webpackChunkName: "charts" */
            //     "../views/BaseCharts.vue")
            // }, {
            //     path: "tabs",
            //     name: "tabs",
            //     meta: {
            //         title: 'tab标签'
            //     },
            //     component: () => import (
            //     /* webpackChunkName: "tabs" */
            //     "../views/Tabs.vue")
            // }, {
            //     path: "donate",
            //     name: "donate",
            //     meta: {
            //         title: '鼓励作者'
            //     },
            //     component: () => import (
            //     /* webpackChunkName: "donate" */
            //     "../views/Donate.vue")
            // }, {
            //     path: "permission",
            //     name: "permission",
            //     meta: {
            //         title: '权限管理',
            //         permission: true
            //     },
            //     component: () => import (
            //     /* webpackChunkName: "permission" */
            //     "../views/Permission.vue")
            // }, {
            //     path: "upload",
            //     name: "upload",
            //     meta: {
            //         title: '上传插件'
            //     },
            //     component: () => import (
            //     /* webpackChunkName: "upload" */
            //     "../views/Upload.vue")
            // }, {
            //     path: "icon",
            //     name: "icon",
            //     meta: {
            //         title: '自定义图标'
            //     },
            //     component: () => import (
            //     /* webpackChunkName: "icon" */
            //     "../views/Icon.vue")
            // }, {
            //     path: '404',
            //     name: '404',
            //     meta: {
            //         title: '找不到页面'
            //     },
            //     component: () => import (/* webpackChunkName: "404" */
            //     '../views/404.vue')
            // }, {
            //     path: '403',
            //     name: '403',
            //     meta: {
            //         title: '没有权限'
            //     },
            //     component: () => import (/* webpackChunkName: "403" */
            //     '../views/403.vue')
            // }
        ]
    }, {
        path: "/login",
        name: "login",
        meta: {
            title: '登录'
        },
        component: () => import (
        /* webpackChunkName: "login" */
        "../views/Login.vue")
    },{
        path: "/selfForm",
        name: "selfForm",
        meta: {
            title: '个人信息',
            requiresAuth:true
        },
        component: () => import (
        /* webpackChunkName: "charts" */
        "../views/BaseFormSelf.vue")
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    // if(to.meta.requiresAuth === true){
    //     //去首页 判断登录
    //     // token
    //     if(window.localStorage.getItem('token')!=undefined){
    //         //放行
    //         document.title = `${to.meta.title} | vue-manage-system`;
    //         next();
    //     }else{
    //         // 不存在 token 跳转到登录页面
    //     //    createApp().$message.error('token 验证不通过，请重新登录');
    //         router.push('/login');
    //     }
    // }else{
    //     next();
    // }
    // console.log('from:',from);
    // console.log('to:',to);
    // console.log(vuex.state);
    
    
    if(to.name == 'login'){
        vuex.commit('clearAll');
    }
    if(to.name!=='login' && !vuex.getters.token){
        console.log('no token push  vue-router to login');
        next('/login');
        return;
    }
    next();



    // document.title = `${to.meta.title} | vue-manage-system`;
    // const role = localStorage.getItem('ms_username');
    // if (!role && to.path !== '/login') {
    //     next('/login');
    //     console.log('不能进入')
    // } else if (to.meta.permission) {
    //     console.log('不能进入')
    //     // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    //     role === 'admin'
    //         ? next()
    //         : next('/403');
    // } else {
    //     next();
    // }
});

export default router;