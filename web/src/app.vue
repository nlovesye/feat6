<template>
    <div class="app">
        <router-view v-if="isAlive" />
    </div>
</template>

<script>
export default {
    provide () {
        return {
            reload: this.reload,
            refresh: this.refresh
        }
    },
    data () {
        return { isAlive: true }
    },
    methods: {
        refresh () {
            location.reload()
        },
        reload () {
            this.isAlive = false
            this.$nextTick(() => {
                this.isAlive = true
            })
        }
    }
}
</script>

<style lang="css">
ul, ol, dl {
    list-style: none;
}
</style>
<style lang="css">
html, body, .app {
    width: 100%;
    height: 100%;
}
.clear{
    zoom: 1;
}
.clear:after {
    clear: both;
    content: '';
    display: block;
    width: 0;
    height: 0;
    visibility: hidden;
}
</style>
