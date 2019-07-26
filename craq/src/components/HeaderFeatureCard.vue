<template>
  <div class="feature-box">
    <div class="feature-box__icon">
      <font-awesome-icon :icon="iconName" class="hi"/>
    </div>
    <p class="feature-box__heading">{{title}}</p>
    <p class="feature-box__text">{{content}}</p>
  </div>
</template>


<script>
export default {
  name: "HeaderFeatureCard",
  props: [
    "title", "content", "iconName"
  ]
}

</script>


<style scoped lang="scss">
.feature-box {
  height: 30rem;
  background-color: alpha(var(--color-surface-light), 0.8);
  padding: var(--space-sm);
  text-align: center;
  border-radius: var(--radius-sm);
  box-shadow: 0 1.5rem 4rem alpha(var(--color-black), .15); //var(--shadow-sm);
  transition: transform .3s;
  word-break: break-all;

  &__icon {
    
    font-size: 6rem;
    margin-bottom: var(--space-xxs);
    margin-top: var(--space-xxs);
  }

  &__heading {
    font-size: 2rem;
    margin-bottom: var(--space-xxs);
    color: var(--color-on-surface);
  }

  &__text {
    line-height: 2rem;
    font-size: 1.3rem;
    font-weight: 300;
    color: var(--color-on-surface);
  }
  &:hover {
    transform: translateY(-1.5rem) scale(1.03);
  }
}
.hi {
  color: var(--color-primary-dark);
}

</style>
