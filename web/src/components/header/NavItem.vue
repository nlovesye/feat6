<template>
    <component
        :is="tagName"
        :name="item.name"
        :to="item"
    >
        <template v-if="!hasChild">
            <Icon v-show="!!item.menu.icon" :type="item.menu.icon" />
            {{ item.menu.title }}
        </template>
        <template v-else>
            <template slot="title">
                <Icon v-show="!!item.menu.icon" :type="item.menu.icon" />
                {{ item.menu.title }}
            </template>
            <nav-item
                v-for="(c, i) in item.children"
                :item="c"
                :key="c.path + i"
            />
        </template>
    </component>
</template>

<script>
export default {
    name: 'NavItem',
    props: ['item'],
    computed: {
        hasChild () {
            return !!this.item.children && this.item.children.length > 0
        },
        tagName () {
            return !this.hasChild ? 'MenuItem' : 'Submenu'
        }
    }
}
</script>
