<template>
  <section class="section-features">
    <div class="grid grid-gap-sm">
      <div class="col-12 text-center section-features__header">
        <h1 class="section-features__header__text">Features</h1>
      </div>
      <div class="col-3">
        <HeaderFeatureCard title="share your codes" iconName="bell"
        content="testetsetsetsetsetsetstasdfsdfjksahdflkjshdjakflhsljdfkhsjadlkfjhskldfhjalksdfhjklsadfhjaklsdfhlksdf"/>
      </div>
      <div class="col-3">
        <HeaderFeatureCard title="Question" iconName="bell"
        content="lorem cwjeklqwjcelk cqwjeklcqwje cklqwjeck lqwjecklqw jceklqwe jclkqwjecklq wejckl qwcejklq wcjeklq wjcekl qwjkcle "/>
      </div>
      <div class="col-3">
        <HeaderFeatureCard title="Answer" iconName="bell"
        content="testetsetsetsetsetsetstasdfsdfjksahdflkjshdjakflhsljdfkhsjadlkfjhskldfhjalksdfhjklsadfhjaklsdfhlksdf"/>
      </div>
      <div class="col-3">
        <HeaderFeatureCard title="communicate" iconName="bell"
        content="testetsetsetsetsetsetstasdfsdfjksahdflkjshdjakflhsljdfkhsjadlkfjhskldfhjalksdfhjklsadfhjaklsdfhlksdf"/>
      </div>
    </div>
  </section>
</template>


<script>
import HeaderFeatureCard from '@/components/HeaderFeatureCard.vue';
export default {
  name: "HeaderFeature",
  components: {
    HeaderFeatureCard
  }
}

</script>

<style lang="scss" scoped>
.grid {
  padding: calc(var(--space-xxxl) * 2) var(--space-sm);
}
.section-features {
  background-color: var(--color-surface);
}
.section-features__header{
  margin-bottom: var(--space-xxxl);
  &__text {
    font-size: 5rem;
    color: var(--color-primary);
    letter-spacing: 1rem;
    text-transform: uppercase;
  }
}

</style>
