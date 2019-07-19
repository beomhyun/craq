<template>
  <div>
    <Header/>
      <h1>This is an Landing page{{isLogin}}</h1>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
export default {
  name: "Landing",
  components: {
    Header
  },
  computed: {
    isLogin() {
      if (this.$store.state.isLogin) {
        this.$router.replace({name: "home"});
      }
      return this.$store.state.isLogin;
    }
  }
}

</script>
