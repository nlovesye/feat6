<template>
    <div class="p_user">
        <div class="tb">
            <Table
                :columns="columns"
                :data="users"
                :loading="loading"
                border
            >
                <div slot="action" slot-scope="{ row }">
                    <Button type="default" style="margin-right: 10px;" @click="onEdit(row)">修改</Button>
                    <Button type="default" @click="onAuthEdit(row)">权限配置</Button>
                    <!-- <Poptip
                        confirm
                        title="是否确定删除？"
                        @on-ok="onDelete(row)"
                        placement="top-end"
                        :disabled="deleteLoading"
                    >
                        <Button type="error" :disabled="deleteLoading">删除</Button>
                    </Poptip> -->
                </div>
            </Table>
        </div>

        <Modal
            v-model="modalVisible"
            title="修改用户"
            :closable="false"
            :mask-closable="false"
            @on-visible-change="onVisibleChange"
        >
            <Form
                ref="userForm"
                :model="user"
                :rules="userRules"
                :label-width="70"
            >
                <FormItem label="用户名" prop="userName">
                    <Input v-model="user.userName" disabled></Input>
                </FormItem>
                <FormItem label="密码" prop="pwd">
                    <Input v-model="user.pwd"></Input>
                </FormItem>
                <FormItem label="昵称" prop="nickName">
                    <Input v-model="user.nickName"></Input>
                </FormItem>
                <FormItem label="描述" prop="desc">
                    <Input v-model="user.desc"></Input>
                </FormItem>
            </Form>

            <div slot="footer">
                <Button @click="modalVisible = false">取消</Button>
                <Button
                    type="primary"
                    :loading="modalLoading"
                    @click="onSaveUser"
                >
                    确定
                </Button>
            </div>
        </Modal>

        <Modal
            v-model="authModalVisible"
            title="配置权限"
            :closable="false"
            :mask-closable="false"
            @on-visible-change="onAuthModalVisibleChange"
        >
            <Spin v-if="authModalLoading"></Spin>
            <template v-else>
                <Tree
                    ref="authTree"
                    :data="viewsTree"
                    show-checkbox
                    check-directly
                ></Tree>
            </template>

            <div slot="footer">
                <Button @click="authModalVisible = false">取消</Button>
                <Button
                    type="primary"
                    :loading="modalLoading"
                    @click="onSaveAuth"
                >
                    确定
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
function setTreeChecked (views, auth) {
    const checkedList = auth.filter(item => item.checked)
    function core (arr) {
        return arr.map(item => {
            item.checked = checkedList.some(c => c.name === item.name)
            if (item.children && item.children.length) {
                item.children = core(item.children)
            }
            return item
        })
    }
    return core(views)
}

export default {
    mounted () {
        this.getUsers()
    },
    data () {
        const columns = [
            {
                title: '用户头像',
                key: 'userAvator',
                width: 110,
                align: 'center'
            },
            {
                title: '用户名',
                key: 'userName',
                width: 150,
                align: 'center'
            },
            {
                title: '密码',
                key: 'pwd',
                width: 150,
                align: 'center'
            },
            {
                title: '昵称',
                key: 'nickName',
                width: 160,
                align: 'center'
            },
            {
                title: '角色描述',
                key: 'desc'
            },
            {
                title: '操作',
                slot: 'action',
                align: 'center',
                fixed: 'right',
                width: 200
            }
        ]
        const required = {
            type: 'string',
            trigger: 'change',
            required: true,
            message: '不能为空'
        }
        const userRules = {
            pwd: [required],
            nickName: [required]
        }
        const user = {
            userName: '',
            pwd: '',
            nickName: '',
            desc: ''
        }
        return {
            users: [],
            loading: false,
            columns,
            deleteLoading: false,
            modalVisible: false,
            modalLoading: false,
            userRules,
            user,
            authModalVisible: false,
            viewsTree: [],
            curUser: null,
            authModalLoading: false,
            authChangeLoading: false
        }
    },
    computed: {
        ...mapState(['userName']),
        isCurLoginUser () {
            return (this.curUser && this.curUser.userName === this.userName)
        }
    },
    methods: {
        ...mapMutations(['setAuth']),
        async getUsers () {
            this.loading = true
            this.tryCatch(async () => {
                const data = await this.$apiGet('/user/list')
                this.users = data
                this.loading = false
            })(this, 'loading')
        },
        onEdit ({ userName, pwd, nickName, desc }) {
            this.user = { userName, pwd, nickName, desc }
            this.modalVisible = true
        },
        async onSaveUser () {
            const valid = await this.$refs.userForm.validate()
            if (!valid) {
                return
            }
            this.modalLoading = true
            await this.$apiPut('/user/change', { data: this.user })
            this.modalLoading = false
            this.getUsers()
            this.modalVisible = false
        },
        onVisibleChange (visible) {
            if (!visible) {
                this.$refs.userForm.resetFields()
            }
        },
        onAuthEdit (row) {
            this.curUser = { ...row }
            this.authModalVisible = true
        },
        onAuthModalVisibleChange (visible) {
            if (visible) {
                this.getAllViews()
            } else {
                this.viewsTree = []
                this.curUser = null
            }
        },
        async getAllViews () {
            this.tryCatch(async () => {
                this.authModalLoading = true
                const views = await this.$apiGet('/views/auth')
                // console.log('views', views)
                this.viewsTree = [{
                    title: '管理平台',
                    expand: true,
                    children: setTreeChecked(views, this.curUser.auth)
                }]
                this.authModalLoading = false
            })(this, 'authModalLoading')
        },
        async onSaveAuth () {
            this.tryCatch(async () => {
                const authTree = this.$refs.authTree
                const selected = authTree.getCheckedAndIndeterminateNodes()
                const auth = selected.filter(item => !!item.name).map(({ name, parentName, checked, indeterminate }) => ({ name, parentName, checked, indeterminate }))
                this.authChangeLoading = true
                const data = { userName: this.curUser.userName, auth }
                await this.$apiPut('/user/auth', { data })
                if (this.isCurLoginUser) {
                    this.setAuth(auth)
                }
                this.$Message.success('配置成功')
                this.getUsers()
                this.authModalVisible = false
                this.authChangeLoading = false
            })(this, 'authChangeLoading')
        }
    }
}
</script>

<style lang="less" scoped>
.p_user {
    background-color: #fff;
    padding-top: 10px;
}
.tb{
    padding: 0px 10px;
}
</style>
