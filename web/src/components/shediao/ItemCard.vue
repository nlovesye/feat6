<template>
    <div
        class="list_item_card"
        :class="cardClass"
    >
        <div class="con">
            <div
                class="collapse_btn"
                @click.stop="onCollapse"
            >
                {{ collapseText }}
            </div>

            <div class="info">
                <!-- <img src="~@/assets/img/jueyuan.jpg" alt="" class="avator"> -->
                <div class="avator" :style="avatorStyle"></div>
                <div class="grade">{{ item.grade }}</div>
                <div class="func">{{ item.func }}</div>
                <div class="name">{{ item.name }} </div>
                <ul>
                    <li class="clear">
                        <div>
                            <span class="label_k">战力：</span>
                            <span class="text_val" :title="item.power">{{ item.power | wanText }}</span>
                        </div>
                        <div>
                            <span class="label_k">阵营：</span>
                            <span class="text_val" style="color: #ffc20d;">{{ item.camp }}</span>
                        </div>
                    </li>
                    <li>
                        <div>
                            <span class="label_k">筋骨：</span>
                            <span class="text_val">{{ item.eSkill }}</span>
                        </div>
                        <div>
                            <span class="label_k">内力：</span>
                            <span class="text_val">{{ item.iSkill }}</span>
                        </div>
                        <div>
                            <span class="label_k">体质：</span>
                            <span class="text_val">{{ item.dSkill }}</span>
                        </div>
                    </li>
                    <li>
                        <div>
                            <span class="label_k">攻击：</span>
                            <span class="text_val" :title="item.gongji">{{ item.gongji | wanText }}</span>
                        </div>
                        <div>
                            <span class="label_k">护甲：</span>
                            <span class="text_val" :title="item.hujia">{{ item.hujia }}</span>
                        </div>
                        <div>
                            <span class="label_k">血量：</span>
                            <span class="text_val" :title="item.xueliang">{{ item.xueliang | wanText }}</span>
                        </div>
                    </li>
                    <li>
                        <p><span class="label_k">定位：</span><span class="desc">{{ item.locDesc }}</span></p>
                    </li>
                </ul>
            </div>

            <div class="attr" v-show="!collapsed">
                <ul class="clear">
                    <li>
                        <span class="label_k">命中：</span>
                        <span class="text_val">{{ item.mingzhong }}%</span>
                    </li>
                    <li>
                        <span class="label_k">闪避：</span>
                        <span class="text_val">{{ item.shanbi }}%</span>
                    </li>
                    <li>
                        <span class="label_k">破格：</span>
                        <span class="text_val">{{ item.poge }}%</span>
                    </li>
                    <li>
                        <span class="label_k">格挡：</span>
                        <span class="text_val">{{ item.gedang }}%</span>
                    </li>
                    <li>
                        <span class="label_k">暴击：</span>
                        <span class="text_val">{{ item.baoji }}%</span>
                    </li>
                    <li>
                        <span class="label_k">抗暴：</span>
                        <span class="text_val">{{ item.kangbao }}%</span>
                    </li>
                    <li>
                        <span class="label_k">暴伤：</span>
                        <span class="text_val">{{ item.baoshang }}%</span>
                    </li>
                    <li>
                        <span class="label_k">暴免：</span>
                        <span class="text_val">{{ item.baomian }}%</span>
                    </li>
                    <li>
                        <span class="label_k">控制：</span>
                        <span class="text_val">{{ item.kongzhi }}%</span>
                    </li>
                    <li>
                        <span class="label_k">免控：</span>
                        <span class="text_val">{{ item.miankong }}%</span>
                    </li>
                    <li>
                        <span class="label_k">增伤：</span>
                        <span class="text_val">{{ item.zengshang }}%</span>
                    </li>
                    <li>
                        <span class="label_k">减伤：</span>
                        <span class="text_val">{{ item.jianshang }}%</span>
                    </li>
                    <li>
                        <span class="label_k">技攻增伤：</span>
                        <span class="text_val">{{ item.jigongzengshang }}%</span>
                    </li>
                    <li>
                        <span class="label_k">技攻减伤：</span>
                        <span class="text_val">{{ item.jigongjianshang }}%</span>
                    </li>
                    <li>
                        <span class="label_k">治疗：</span>
                        <span class="text_val">{{ item.zhiliao }}%</span>
                    </li>
                    <li>
                        <span class="label_k">受疗：</span>
                        <span class="text_val">{{ item.shouliao }}%</span>
                    </li>
                    <li>
                        <span class="label_k">内功增伤：</span>
                        <span class="text_val">{{ item.neigongzengshang }}%</span>
                    </li>
                    <li>
                        <span class="label_k">内功减伤：</span>
                        <span class="text_val">{{ item.neigongjianshang }}%</span>
                    </li>
                    <li>
                        <span class="label_k">外功增伤：</span>
                        <span class="text_val">{{ item.waigongzengshang }}%</span>
                    </li>
                    <li>
                        <span class="label_k">外功减伤：</span>
                        <span class="text_val">{{ item.waigongjianshang }}%</span>
                    </li>
                    <li>
                        <span class="label_k">技能效果：</span>
                        <span class="text_val">{{ item.jinengxiaoguo }}%</span>
                    </li>
                    <li>
                        <span class="label_k">回合回怒：</span>
                        <span class="text_val">{{ item.huihehuinu }}%</span>
                    </li>
                    <li>
                        <span class="label_k">中毒减伤：</span>
                        <span class="text_val">{{ item.zhongdujianshang }}%</span>
                    </li>
                    <li>
                        <span class="label_k">中毒增伤：</span>
                        <span class="text_val">{{ item.zhongduzengshang }}%</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="tools">
            <Button type="primary" @click="onEdit">修改</Button>
        </div>
    </div>
</template>

<script>
import noPic from '@/assets/img/nopic.png'

export default {
    props: ['item'],
    filters: {
        wanText (val) {
            return val > 99999 ? parseInt(val / 10000, 10) + '万' : val
        }
    },
    data () {
        return {
            collapsed: true
        }
    },
    computed: {
        cardClass () {
            const { grade } = this.item
            return grade === '神话' ? 'red' : grade === '传奇' ? 'orange' : grade === '史诗' ? 'purple' : grade === '豪侠' ? 'blue' : ''
        },
        collapseText () {
            return this.collapsed ? '>' : '<'
        },
        avatorStyle () {
            const { pic } = this.item
            const prevUrl = 'http://localhost:7700/img/shediao/'
            const style = pic ? `background-image: url(${prevUrl + pic});` : `background-image: url(${noPic});`
            return style
        }
    },
    methods: {
        onCollapse () {
            this.collapsed = !this.collapsed
        },
        onEdit () {
            this.$emit('onEdit', this.item)
        }
    }
}
</script>

<style lang="less" scoped>
@red: red;
@orange: orange;
@purple: purple;
@blue: #2d8cf0;

.list_item_card {
    border: 1px solid #dcdee2;
    border-radius: 3px;
    float: left;
    margin-right: 10px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 1px 6px rgba(255,0,0,.2);

    &.red {
        border-color: @red;
        .grade {
            background-color: @red;
        }
        .name {
            color: @red;
        }
    }
    &.orange {
        border-color: @orange;
        .grade {
            background-color: @orange;
        }
        .name {
            color: @orange;
        }
    }
    &.purple {
        border-color: @purple;
        .grade {
            background-color: @purple;
        }
        .name {
            color: @purple;
        }
    }
    &.blue {
        border-color: @blue;
        .grade {
            background-color: @blue;
        }
        .name {
            color: @blue;
        }
    }

    .con {
        display: flex;
        position: relative;
    }

    .collapse_btn {
        position: absolute;
        width: 13px;
        height: 26px;
        border-left: 1px solid #ccc;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        background-color: #fff;
        text-align: center;
        line-height: 26px;
        right: 0;
        top: 180px;
        cursor: pointer;
        color: #ffc20d;
        font-size: 12px;
        text-indent: 1px;
        user-select: none;
        transition: all 0.1s ease-in-out;

        &:hover {
            background-color: #ffc20d;
            color: #fff;
        }
    }

    .info {
        width: 240px;
        flex-shrink: 0;
        font-size: 12px;
        position: relative;
        margin: 6px;

        .avator {
            width: 100%;
            height: 166px;
            margin: 0 auto;
            display: block;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: contain;
            // background-image: url('~@/assets/img/jueyuan.jpg');
            margin-bottom: 4px;
        }

        .grade {
            position: absolute;
            font-size: 14px;
            top: 0px;
            left: 0px;
            height: 22px;
            line-height: 22px;
            border-radius: 3px;
            color: #fff;
            text-align: center;
            padding: 0 6px;
            font-weight: bold;
        }
        .func {
            position: absolute;
            right: -5px;
            top: 0;
            width: 25px;
            height: 25px;
            text-align: center;
            line-height: 25px;
            border-radius: 50%;
            border: 1px solid #fff;
            color: #fff;
            font-size: 14px;
            background-color: #ffc20d;
            font-weight: bold;
        }
        .name {
            font-size: 14px;
            text-align: center;
            font-weight: bold;
            margin-bottom: 6px;
        }

        span.desc {
            color: #ffc20d;
        }

        ul {
            padding-left: 4px;
        }
        li {
            margin-bottom: 2px;
        }
        li>div{
            float: left;
            width: 33%;
        }
        li>div:nth-child(3) {
            width: 34%;
        }
    }

    .attr {
        background-color: #efefef;
        border-radius: 3px;
        flex-grow: 1;
        width: 230px;
        flex-shrink: 0;
        margin: 6px;

        ul {
            padding: 6px;
        }
        li {
            float: left;
            width: 100px;
            display: flex;
            margin-bottom: 2px;
        }
        li:nth-child(odd){
            margin-right: 10px;
        }
        span.label_k{
            font-size: 12px;
            color: #333;
            flex-shrink: 0;
            width: 60px;
            text-align: right;
        }
        span.text_val{
            font-size: 12px;
        }
    }

    .tools {
        margin: 0 6px 10px;
    }

}
</style>
