<template>
    <div class="app_view_main">
        <the-header />
        <router-view />
    </div>
</template>

<script>
import TheHeader from '@/components/header/Header'

export default {
    name: 'Main',
    components: {
        TheHeader
    }
}
</script>

<style lang="css" scoped>
.app_view_main {
    padding-top: 42px;
    height: 100%;
}
</style>
