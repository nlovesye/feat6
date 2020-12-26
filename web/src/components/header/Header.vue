<template>
    <div class="c_header">
        <Menu
            mode="horizontal"
            theme="light"
            :active-name="activeName"
            class="header_menu"
        >
            <nav-item
                v-for="item in menus"
                :item="item"
                :key="item.path"
            />
        </Menu>
        <Poptip
            trigger="hover"
            width="150px"
            padding='0px'
            placement='bottom-end'
            :transfer='false'
            popper-class='user_popper'
        >
            <div slot='title' class="username">
                <Icon type='md-man' size='16' style='margin-right: 5px;' />
                {{ nickName }}
            </div>
            <template slot='content'>
                <div class="actionbtn" @click.stop="refreshViews(reload)">
                    <Icon :type="'md-refresh'" size='16' style="margin-right: 5px;" />
                    刷新视图
                </div>
                <div class="actionbtn" @click.stop="onAction">
                    <Icon :type="'md-exit'" size='16' style="margin-right: 5px;" />
                    注销登录
                </div>
            </template>
            <Avatar icon="md-person" style="background-color: #ffc20d;" />
        </Poptip>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import NavItem from './NavItem'
import { deepClone } from '@/utils'

const routerFilter = routes => {
    return routes.filter(r => r.path !== '*')
}

function authFilter (routes, auth) {
    function core (arr) {
        return arr.filter(item => {
            if (item.children && item.children.length) {
                item.children = core(item.children)
            }
            if (!!item.public || auth.some(a => a.name === item.name)) {
                return true
            }
            return false
        })
    }
    return core(routes)
}

export default {
    name: 'Header',
    inject: ['reload'],
    components: { NavItem },
    data () {
        const activeName = this.$route.name
        return {
            activeName
        }
    },
    computed: {
        ...mapState(['nickName', 'auth']),
        menus () {
            const m = authFilter(deepClone(routerFilter(this.$router.options.routes[1].children || [])), this.auth)
            // console.log('menus changed', this.auth, m)
            return m
        }
    },
    methods: {
        ...mapMutations(['mLogout']),
        ...mapActions(['refreshViews']),
        onAction () {
            this.mLogout()
            this.$router.push('/login')
        }
    }
}
</script>

<style lang="less" scoped>
@headerHeight: 42px;
@headerBgc: #242424;

.c_header {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: @headerHeight;
    box-shadow: 0 1px 1px rgba(0,0,0, 0.08);
    background-color: @headerBgc;
    // color: #fff;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header_menu{
        color: #fff;
        background-color: @headerBgc;
        height: 100%;
        line-height: @headerHeight;

        &::after{
            display: none;
        }

        .ivu-menu-item:not(.ivu-menu-item-selected), .ivu-menu-submenu:not(.ivu-menu-item-active){
            color: #fff;
        }
        .ivu-menu-submenu .ivu-select-dropdown .ivu-menu-item{
            color: #515a6e;
        }
    }

    .user_popper{
        .username{
            padding: 8px 16px;
        }
        .actionbtn{
            cursor: pointer;
            padding: 8px 16px;
            border-radius: 0px 0px 4px 4px;
            &:hover{
                background-color: rgba(0, 0, 0, 0.08);
            }
        }
    }
}
</style>
