<template>
  <main>
    <div class="header">
      <div class="header__sign-up">
        <SignUp/>
      </div>
    </div>
  <HeaderFeature/>
  </main>
</template>

<script>
import SignUp from '@/components/SignUp.vue'
import HeaderFeature from '@/components/HeaderFeature.vue'
export default {
  name: "Header",
  components: {
    SignUp,
    HeaderFeature
  }
}

</script>


<style lang="scss" scoped>
.header {
  height: 50vh;
  background-image: linear-gradient(to right bottom,
  alpha(var(--color-contrast-lower), 0.15),
  alpha(var(--color-contrast-higher), 0.15)),
  url(../assets/header.jpg);
  background-size: cover;
  background-position: top;
  position: relative;
  &__sign-up {
    position: absolute;
    top:50%;
    right:1em;
    transform: translateY(-50%);
  }
}

</style>
