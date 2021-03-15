<template>
    <div class="p_yyjh">
        <div class="topbar">
            <Button @click="onReset" :loading="resetLoading" type="primary" style="margin-right: 6px;">一键重置</Button>
            <Button @click="onBatch" :loading="batchLoading" type="primary">批量修改</Button>
        </div>

        <div class="map">
            <ul class="city">
                <li
                    v-for="(item) in list"
                    :key="item.id"
                    :class="`city_item${item.id}`"
                >
                    <Poptip
                        trigger="hover"
                        :title="item.name"
                    >
                        <template slot="content">
                            <p v-if="item.k">
                                <span><i class="iconfont icon-baojian"></i></span>
                                <span>{{ item.kDesc }}</span>
                            </p>
                            <p v-if="item.b">
                                <span><i class="iconfont icon-majia"></i></span>
                                <span>{{ item.bDesc }}</span>
                            </p>
                            <p v-if="item.y">
                                <span><i class="iconfont icon-caoyao"></i></span>
                                <span>{{ item.yDesc }}</span>
                            </p>
                            <p v-if="item.m">
                                <span><i class="iconfont icon-shu-1"></i></span>
                                <span>{{ item.mDesc }}</span>
                            </p>
                            <p v-if="item.n">
                                <span><i class="iconfont icon-niu"></i></span>
                                <span>{{ item.nDesc }}</span>
                            </p>
                            <p v-if="item.z">
                                <span><i class="iconfont icon-zhurou"></i></span>
                                <span>{{ item.zDesc }}</span>
                            </p>
                            <p v-if="item.j">
                                <span><i class="iconfont icon-ji"></i></span>
                                <span>{{ item.jDesc }}</span>
                            </p>
                            <p v-if="item.l">
                                <span><i class="iconfont icon-1"></i></span>
                                <span>{{ item.lDesc }}</span>
                            </p>
                            <p v-if="item.t">
                                <span><i class="iconfont icon-tu"></i></span>
                                <span>{{ item.tDesc }}</span>
                            </p>
                            <p v-if="!!item.specDesc">
                                <span>特：</span>
                                <span>{{ item.specDesc || '' }}</span>
                            </p>
                        </template>
                        <Button
                            v-if="!item.collected"
                            type="primary"
                            icon="md-cube"
                            @click="onCityItem(item)"
                        >
                        </Button>
                        <Button
                            v-else
                            shape="circle"
                            type="success"
                            icon="md-checkmark"
                            @click="onCityItem(item)"
                        ></Button>
                    </Poptip>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
import testData from './testData'

export default {
    mounted () {
        this.getList()
    },
    data () {
        return {
            list: [],
            resetLoading: false,
            batchLoading: false
        }
    },
    methods: {
        async getList () {
            this.tryCatch(async () => {
                this.list = await this.$apiGet('/yyjh/list')
            })()
        },
        onCityItem (item) {
            this.tryCatch(async () => {
                const data = { name: item.name, collected: !item.collected }
                await this.$apiPut('/yyjh', { data })
                this.getList()
            })()
        },
        onReset () {
            this.tryCatch(async () => {
                const data = { collected: false }
                this.resetLoading = true
                await this.$apiPut('/yyjh/batch', { data })
                this.resetLoading = false
                this.getList()
            })(this, 'resetLoading')
        },
        onBatch () {
            this.tryCatch(async () => {
                this.batchLoading = true
                await this.$apiPut('/yyjh/batch', { data: testData.batch })
                this.batchLoading = false
                this.getList()
            })(this, 'batchLoading')
        }
    }
}
</script>

<style lang="less" scoped src="./yyjh.less"></style>
