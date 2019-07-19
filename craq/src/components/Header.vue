<template>
  <main>
    <div class="header">
      <div class="header__sign-up">
        <SignForm/>
      </div>
    </div>
  <HeaderFeature/>
  </main>
</template>

<script>
import SignForm from '@/components/SignForm.vue'
import HeaderFeature from '@/components/HeaderFeature.vue'
export default {
  name: "Header",
  components: {
    SignForm,
    HeaderFeature
  }
}

</script>


<style lang="scss" scoped>
.header {
  height: 60vh;
  background-image: linear-gradient(to right bottom,
  alpha(var(--color-contrast-lower), 0.15),
  alpha(var(--color-contrast-higher), 0.15)),
  url(../assets/header.jpg);
  background-size: cover;
  background-position: top;
  position: relative;
  &__sign-up {
    position: absolute;
    height: 100%;
    top:50%;
    right:1em;
    transform: translateY(-50%);
  }
}

</style>
