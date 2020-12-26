<template>
    <div class="p_views">
        <div class="view_tree">
            <Tree
                class="tree_render"
                :data="views"
                :render="nodeRender"
                :select-node="false"
            >
            </Tree>
        </div>

        <Modal
            v-model="modalVisible"
            :title="modalTitle"
            :closable="false"
            :mask-closable="false"
            @on-visible-change="onVisibleChange"
        >
            <Form
                ref="viewForm"
                :model="view"
                :rules="viewRules"
                :label-width="70"
            >
                <FormItem label="Name" prop="name">
                    <Input v-model="view.name" :disabled="modalType !== 1"></Input>
                </FormItem>
                <FormItem label="标题" prop="title">
                    <Input v-model="view.title"></Input>
                </FormItem>
                <FormItem label="路径" prop="path">
                    <Input v-model="view.path"></Input>
                </FormItem>
                <FormItem label="权限控制" prop="auth">
                    <i-switch v-model="view.auth">
                    </i-switch>
                </FormItem>
                <FormItem label="图标" prop="icon">
                    <Input v-model="view.icon"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="modalVisible = false">取消</Button>
                <Button
                    type="primary"
                    :loading="modalLoading"
                    @click="onModalOk"
                >
                    确定
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
const getView = (obj = {}) => ({
    parentName: '',
    name: '',
    title: '',
    path: '',
    icon: '',
    auth: false,
    ...obj
})

export default {
    inject: ['reload', 'refresh'],
    mounted () {
        this.getViews()
    },
    data () {
        const required = {
            type: 'string',
            trigger: 'change',
            required: true,
            message: '不能为空'
        }
        const viewRules = {
            name: [required],
            title: [required],
            path: [required]
        }
        return {
            views: [],
            modalVisible: false,
            modalType: -1,
            modalLoading: false,
            view: getView(),
            viewRules
        }
    },
    computed: {
        modalTitle () {
            const text = ['', '添加视图', '修改视图']
            return text[this.modalType] || ''
        }
    },
    methods: {
        ...mapMutations(['setViews']),
        ...mapActions(['addDynamicRoutes']),
        rootRender (h, { root, node, data }) {
            return h('span', {
                style: {
                    display: 'inline-block',
                    width: '100%',
                    paddingLeft: '4px'
                }
            }, [
                h('span', [
                    h('Icon', {
                        props: {
                            type: 'md-cloud'
                        },
                        style: {
                            marginRight: '8px'
                        }
                    }),
                    h('span', data.title)
                ]),
                h('span', {
                    style: {
                        display: 'inline-block',
                        float: 'right'
                    }
                }, [
                    h('Button', {
                        props: {
                            type: 'primary',
                            icon: 'md-add'
                        },
                        style: {
                            width: '64px'
                        },
                        on: {
                            click: () => {
                                this.view = getView()
                                this.modalVisible = true
                                this.modalType = 1
                            }
                        }
                    })
                ])
            ])
        },
        nodeRender (h, { root, node, data }) {
            return h('span', {
                style: {
                    display: 'inline-block',
                    width: '100%',
                    paddingLeft: '4px'
                }
            }, [
                h('span', [
                    h('Icon', {
                        props: {
                            type: 'md-document'
                        },
                        style: {
                            marginRight: '8px'
                        }
                    }),
                    h('span', data.title)
                ]),
                h('span', {
                    style: {
                        display: 'inline-block',
                        float: 'right'
                    }
                }, [
                    h('Button', {
                        props: {
                            icon: 'md-add'
                        },
                        style: {
                            marginRight: '8px'
                        },
                        on: {
                            click: () => {
                                this.view = getView({ parentName: data.name })
                                this.modalVisible = true
                                this.modalType = 1
                            }
                        }
                    }),
                    h('Button', {
                        props: {
                            icon: 'md-create'
                        },
                        style: {
                            marginRight: '8px'
                        },
                        on: {
                            click: () => {
                                this.view = getView(data)
                                this.modalVisible = true
                                this.modalType = 2
                            }
                        }
                    }),
                    h('Button', {
                        props: {
                            icon: 'md-remove'
                        },
                        on: {
                            click: () => {
                                this.$Modal.confirm({
                                    title: `确定删除视图${data.title}？`,
                                    onOk: () => {
                                        if (data.children && data.children.length) {
                                            this.$Message.info('该视图下存在子视图，请先删除子视图！')
                                            return
                                        }
                                        this.tryCatch(async () => {
                                            await this.$apiDelete('/views', { params: { name: data.name } })
                                            this.getViews(true)
                                        })()
                                    }
                                })
                            }
                        }
                    })
                ])
            ])
        },
        async getViews (isRefreshRouter = false) {
            this.tryCatch(async () => {
                const views = await this.$apiGet('/views/all')
                // console.log('views', views)
                this.views = [{
                    title: '管理平台',
                    expand: true,
                    render: this.rootRender,
                    children: views
                }]
                if (isRefreshRouter) {
                    this.setViews(views)
                    this.refresh()
                }
            })()
        },
        async onModalOk () {
            const valid = await this.$refs.viewForm.validate()
            if (!valid) {
                return
            }
            this.tryCatch(async () => {
                if (this.modalType === 1) {
                    await this.$apiPost('/views', { data: this.view })
                } else if (this.modalType === 2) {
                    await this.$apiPut('/views', { data: this.view })
                }
                this.modalVisible = false
                this.getViews(true)
            })()
        },
        onVisibleChange () {
            this.$refs.viewForm.resetFields()
        }
    }
}
</script>

<style lang="less" scoped>
.p_views {
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;

    .view_tree {
        width: 400px;
        padding: 0 10px;
        border: 1px solid #dfdfdf;

        .tree_render{
            width: 100%;
        }
    }
}
</style>
<style lang="less">
.p_views .ivu-tree-title {
    width: calc(100% - 16px);
}
</style>
