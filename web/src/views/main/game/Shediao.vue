<template>
    <div class="p_shediao">
        <div class="topbar">
            <Button type="primary" style="margin-right: 10px;" @click="createHero">登录侠客</Button>
            <Button type="primary" style="margin-right: 10px;" @click="onUpload">上传</Button>
            <div class="condition">
                <span class="condition_label">阵营：</span>
                <RadioGroup v-model="camp" type="button">
                    <Radio label="">全部</Radio>
                    <Radio label="射雕"></Radio>
                    <Radio label="神雕"></Radio>
                    <Radio label="倚天"></Radio>
                </RadioGroup>
            </div>
            <div class="condition">
                <span class="condition_label">品阶：</span>
                <RadioGroup v-model="grade" type="button">
                    <Radio label="">全部</Radio>
                    <Radio label="优秀"></Radio>
                    <Radio label="稀有"></Radio>
                    <Radio label="豪侠"></Radio>
                    <Radio label="史诗"></Radio>
                    <Radio label="传奇"></Radio>
                    <Radio label="神话"></Radio>
                </RadioGroup>
            </div>
            <div class="condition">
                <span class="condition_label">能力：</span>
                <RadioGroup v-model="func" type="button">
                    <Radio label="">全部</Radio>
                    <Radio label="力"></Radio>
                    <Radio label="掌"></Radio>
                    <Radio label="技"></Radio>
                    <Radio label="剑"></Radio>
                    <Radio label="气"></Radio>
                </RadioGroup>
            </div>
            <div class="condition">
                <Input search enter-button placeholder="名称" v-model="name" />
            </div>
        </div>
        <Spin v-if="listLoading" />
        <div class="card_list_con clear" v-else>
            <template v-if="filterHeros.length">
                <item-card
                    v-for="(item, index) in filterHeros"
                    :key="index"
                    :item="item"
                    @onEdit="editHero"
                />
            </template>
            <div v-else>暂无数据</div>
        </div>

        <Modal
            v-model="modalVisible"
            :title="modalTitle"
            :closable="false"
            :mask-closable="false"
            :width="620"
            @on-visible-change="onVisibleChange"
        >
            <Form
                ref="heroForm"
                inline
                :model="hero"
                :rules="heroRules"
                :label-width="70"
            >
                <FormItem label="姓名" prop="name">
                    <Input v-model="hero.name" :disabled="modalType !== 1"></Input>
                </FormItem>
                <FormItem label="阵营" prop="camp">
                    <RadioGroup v-model="hero.camp" type="button">
                        <Radio label="射雕"></Radio>
                        <Radio label="神雕"></Radio>
                        <Radio label="倚天"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="品阶" prop="grade">
                    <RadioGroup v-model="hero.grade" type="button">
                        <Radio label="优秀"></Radio>
                        <Radio label="稀有"></Radio>
                        <Radio label="豪侠"></Radio>
                        <Radio label="史诗"></Radio>
                        <Radio label="传奇"></Radio>
                        <Radio label="神话"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="能力" prop="func">
                    <RadioGroup v-model="hero.func" type="button">
                        <Radio label="力"></Radio>
                        <Radio label="掌"></Radio>
                        <Radio label="技"></Radio>
                        <Radio label="剑"></Radio>
                        <Radio label="气"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="描述" prop="locDesc">
                    <Input v-model="hero.locDesc"></Input>
                </FormItem>
                <br />
                <FormItem label="战力" prop="power">
                    <InputNumber :min="0" v-model="hero.power"></InputNumber>
                </FormItem>
                <FormItem label="攻击" prop="gongji">
                    <InputNumber :min="0" v-model="hero.gongji"></InputNumber>
                </FormItem>
                <FormItem label="护甲" prop="hujia">
                    <InputNumber :min="0" v-model="hero.hujia"></InputNumber>
                </FormItem>
                <FormItem label="筋骨" prop="eSkill">
                    <InputNumber :min="0" v-model="hero.eSkill"></InputNumber>
                </FormItem>
                <FormItem label="内力" prop="iSkill">
                    <InputNumber :min="0" v-model="hero.iSkill"></InputNumber>
                </FormItem>
                <FormItem label="体质" prop="dSkill">
                    <InputNumber :min="0" v-model="hero.dSkill"></InputNumber>
                </FormItem>
                <FormItem label="血量" prop="xueliang">
                    <InputNumber :min="0" v-model="hero.xueliang"></InputNumber>
                </FormItem>
                <FormItem label="头像" prop="pic">
                    <Input v-model="hero.pic"></Input>
                </FormItem>
            </Form>

            <div slot="footer">
                <Button @click="modalVisible = false">取消</Button>
                <Button
                    type="primary"
                    :loading="modalLoading"
                    @click="onSaveHero"
                >
                    确定
                </Button>
            </div>
        </Modal>

        <Modal
            v-model="uploadModalVisible"
            title="上传图片"
            :mask-closable="false"
            :width="620"
            footer-hide
            @on-visible-change="onUploadModalVisibleChange"
        >
            <div>
                <Form
                    :label-width="70"
                >
                    <FormItem label="文件名" prop="uploadName">
                        <Input v-model="uploadName"></Input>
                    </FormItem>
                </Form>
            </div>
            <Upload
                multiple
                type="drag"
                action="/api/shediao/upload"
                accept="image/*"
                name="pic"
                :data="{ uploadName }"
                :headers="{ auth: token }"
                :before-upload="onBeforeUpload"
                :on-success="onUploadSuccess"
                :on-error="onUploadError"
                :default-file-list="uploadedList"
            >
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或者拖拽到此处上传</p>
                </div>
            </Upload>
        </Modal>
    </div>
</template>

<script>
import { ItemCard } from '@/components'
import { mapState } from 'vuex'
import { chineseReg } from '@/utils'

function getHero (obj = {}) {
    return {
        pic: '',
        name: '',
        camp: '',
        grade: '',
        func: '',
        locDesc: '',
        power: 0,
        dSkill: 0,
        eSkill: 0,
        iSkill: 0,
        gongji: 0,
        xueliang: 0,
        hujia: 0,
        sudu: 0,
        chushinuqi: 0,
        nuqishangxian: 0,
        mingzhong: 0,
        shanbi: 0,
        poge: 0,
        gedang: 0,
        baoji: 0,
        kangbao: 0,
        baoshang: 0,
        baomian: 0,
        kongzhi: 0,
        miankong: 0,
        zengshang: 0,
        jianshang: 0,
        jigongzengshang: 0,
        jigongjianshang: 0,
        zhiliao: 0,
        shouliao: 0,
        neigongzengshang: 0,
        neigongjianshang: 0,
        waigongzengshang: 0,
        waigongjianshang: 0,
        jinengxiaoguo: 0,
        huihehuinu: 0,
        zhongdujianshang: 0,
        zhongduzengshang: 0,
        ...obj
    }
}

export default {
    components: { ItemCard },
    mounted () {
        this.getHeros()
    },
    data () {
        const required = {
            type: 'string',
            trigger: 'change',
            required: true,
            message: '不能为空'
        }
        const numRequired = {
            type: 'number',
            trigger: 'change',
            required: true,
            message: '不能为空'
        }
        const heroRules = {
            name: [required],
            camp: [required],
            grade: [required],
            func: [required],
            locDesc: [required],
            power: [numRequired],
            eSkill: [numRequired],
            iSkill: [numRequired],
            dSkill: [numRequired],
            gongji: [numRequired],
            hujia: [numRequired],
            xueliang: [numRequired]
        }
        return {
            heros: [],
            listLoading: false,
            modalVisible: false,
            modalLoading: false,
            modalType: 0,
            hero: getHero(),
            heroRules,
            camp: '',
            grade: '',
            func: '',
            name: '',
            uploadModalVisible: false,
            uploadName: '',
            uploadedList: []
        }
    },
    computed: {
        ...mapState(['token']),
        modalTitle () {
            return this.modalType === 1 ? '登录侠客' : this.modalType === 2 ? '编辑侠客' : ''
        },
        filterHeros () {
            const filterList = this.heros.filter(hero => {
                const conditions = (
                    (!this.camp || hero.camp === this.camp) && (!this.grade || hero.grade === this.grade) && (!this.func || hero.func === this.func) && (!this.name || hero.name.indexOf(this.name) > -1)
                )
                return conditions
            })
            // console.log('filterHeros', filterList)
            return filterList
        }
    },
    methods: {
        getHeros () {
            this.tryCatch(async () => {
                this.listLoading = true
                const ret = await this.$apiGet('/shediao/list')
                this.heros = ret
                this.listLoading = false
                // console.log('heros', this.heros)
            })(this, 'listLoading')
        },
        createHero () {
            this.modalVisible = true
            this.modalType = 1
        },
        onVisibleChange (visible) {
            if (!visible) {
                this.$refs.heroForm.resetFields()
                this.hero = getHero()
            }
        },
        async onSaveHero () {
            const valid = await this.$refs.heroForm.validate()
            if (!valid) {
                return
            }
            this.tryCatch(async () => {
                this.modalLoading = true
                if (this.modalType === 1) {
                    await this.$apiPost('/shediao', { data: this.hero })
                } else if (this.modalType === 2) {
                    await this.$apiPut('/shediao', { data: this.hero })
                }
                this.modalLoading = false
                this.$Message.success('录入成功')
                this.modalVisible = false
                this.getHeros()
            })(this, 'modalLoading')
        },
        editHero (hero) {
            this.modalVisible = true
            this.modalType = 2
            this.hero = getHero({ ...hero })
        },
        onUpload () {
            this.uploadModalVisible = true
        },
        onBeforeUpload (file) {
            console.log('onBeforeUpload', this.uploadName, this.uploadedList)
            if (!this.uploadName) {
                this.$Message.error('请输入图片文件名')
                return false
            }
            if (this.uploadedList.some(item => item.name === this.uploadName)) {
                this.$Message.error('已存在同名文件')
                return false
            }
            if (chineseReg.test(this.uploadName)) {
                this.$Message.error('文件名不能包含中文字符')
                return false
            }
            return true
        },
        onUploadSuccess (res, file, fileList) {
            file.name = this.uploadName
            this.uploadedList.push(file)
            // console.log('onUploadSuccess', res, file, fileList)
        },
        onUploadError (err, file, fileList) {
            console.log('onUploadError', err, file, fileList)
            this.$Message.error(file.name + '上传失败')
        },
        onUploadModalVisibleChange (visible) {
            if (!visible) {
                this.uploadName = ''
                this.uploadedList = []
            }
        }
    }
}
</script>

<style lang="less" scoped>
.p_shediao {
    height: 100%;
    background-color: #fff;

    .topbar {
        height: 42px;
        display: flex;
        align-items: center;
        padding: 0 12px;
        box-shadow: 0 -1px 3px 1px rgba(0, 0, 0, 0.2) inset;

        .condition {
            margin-right: 12px;
        }
    }
    .card_list_con {
        height: calc(100% - 43px);
        padding: 10px;
        overflow-y: auto;
        // width: 1600px;
        // padding-left: 5px;
        // padding-right: 5px;
    }
}
</style>
