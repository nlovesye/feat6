import Main from '@/views/Main.vue'

const routeView = {
    NotFound: {
        component: () => import('@/views/main/404.vue')
    },
    Test: {
        component: () => import('@/views/main/Test.vue')
    },
    game: { icon: 'md-cube', component: () => import('@/views/main/game/Game.vue') },
    sgz: {
        icon: 'md-cube',
        component: () => import('@/views/main/MyGeneral.vue')
    },
    shediao: {
        icon: 'md-cube',
        component: () => import('@/views/main/game/Shediao.vue')
    }
}

// 视图=>路由
export function viewsToRouter (viewsArr) {
    function core (arr) {
        return arr.map(item => {
            const { name } = item
            const cmp = routeView[name] || routeView.NotFound
            const rt = {
                path: item.path,
                name,
                menu: {
                    title: item.title,
                    icon: cmp.icon || item.icon
                },
                public: !item.auth,
                ...cmp
            }
            if (item.children && item.children.length) {
                rt.children = core(item.children)
            }
            return rt
        })
    }
    return core(viewsArr)
}

export function getRouter (localRoutes, dynamicRoutes) {
    const addRoutes = [
        {
            path: '/',
            component: Main,
            children: [
                {
                    path: '/',
                    name: 'Home',
                    public: true,
                    menu: {
                        title: '首页',
                        icon: 'md-planet'
                    },
                    component: () => import('@/views/main/Home.vue')
                },
                {
                    path: 'platform',
                    name: 'Platform',
                    public: true,
                    menu: {
                        title: '平台管理',
                        icon: 'md-settings'
                    },
                    component: () => import('@/views/main/platform/Layout.vue'),
                    children: [
                        {
                            path: 'user',
                            name: 'User',
                            public: true,
                            menu: {
                                title: '用户管理',
                                icon: 'md-person'
                            },
                            component: () => import('@/views/main/platform/User.vue')
                        },
                        {
                            path: 'views',
                            name: 'Views',
                            public: true,
                            menu: {
                                title: '视图管理',
                                icon: 'md-eye'
                            },
                            component: () => import('@/views/main/platform/Views.vue')
                        }
                    ]
                },
                {
                    path: '*',
                    component: () => import('@/views/main/404.vue')
                }
            ]
        }
    ]
    if (dynamicRoutes && dynamicRoutes instanceof Array) {
        addRoutes[0].children.splice(3, 0, ...dynamicRoutes)
    }
    return {
        allRoutes: localRoutes.concat(addRoutes),
        addRoutes
    }
}

export default routeView
