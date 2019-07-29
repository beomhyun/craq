<template>
    <div id="app" :data-theme="theme" :class="{transition: themeTransition}">
        <nav-bar></nav-bar>
        <component :is="layout"></component>
        <Landing v-if="!isLogin"/>
        <div class="transparent">{{isLogin}}</div>
        <Footer/>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
// layouts
// if no layout is defined in `router.js` automatically use 'Default'
import Default from '@/layouts/Default.vue';
//end layouts
import Landing from '@/views/Landing.vue';
import Footer from '@/components/Footer.vue';


export default {
    components: {
        NavBar,
        Footer,
        Default,
        Landing,
    },
    data() {
        return {
            themeTransition: false,
        }
    },
    methods: {
    },
    computed: {
        layout() {
            return this.$route.meta.layout || "Default";
        },
        theme() {
            this.themeTransition = true;
            setTimeout(()=> {
                this.themeTransition = false;
            }, 2050);
            return this.$store.state.theme;
        },
        isLogin() {
            return (this.$session.exists());
        }
    }
}


</script>


<style lang="scss">
#app { //width
    max-width: 1200px; // desktop size
    margin: auto; // align center
    background-color: var(--color-bg); //TODO
}
body { //TODO
//    background-color: var(--color-bg); //TODO
}
.transparent {
    opacity: 0;
}
// dark mode smooth transition
#app.transition {
    & *,
    & *:before,
    & *:after {
        transition: none !important;
        transition: ease-out 2000ms !important;
        transition-delay: 0 !important;
    }
}

// end dark mode smooth transition
</style>
