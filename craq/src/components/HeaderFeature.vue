<template>
  <section class="section-features">
    <div class="grid grid-gap-sm">
      <div class="col-12 margin-bottom-xxxl">
          <HeaderHeading title="FEATURES"/>
      </div>
      <div class="col-3">
        <HeaderFeatureCard title="Codes" iconName="code" 
        content="The programmer lives to have codes to share and to share them well"/>
      </div>
      <div class="col-3">
        <HeaderFeatureCard title="Review" iconName="book-reader" 
        content="Review is the breakfast of champions"/>
      </div>
      <div class="col-3">
        <HeaderFeatureCard title="Algorithm" iconName="code-branch" 
        content="Algorithms are not arbiters of objective truth and fairness simply because they're math."/>
      </div>
      <div class="col-3">
        <HeaderFeatureCard title="Question" iconName="question-circle" 
        content="A prudent question is one-half of wisdom"/>
      </div>
    </div>
  </section>
</template>


<script>
import HeaderFeatureCard from '@/components/HeaderFeatureCard.vue';
import HeaderHeading from '@/components/HeaderHeading.vue'
export default {
  name: "HeaderFeature",
  components: {
    HeaderFeatureCard,
      HeaderHeading
  }
}

</script>

<style lang="scss" scoped>
.grid {
  padding: calc(var(--space-xxxl) * 1.5) var(--space-sm);
}
.section-features {
 // background-color: var(--color-surface);
}
.section-features__header{
  margin-bottom: var(--space-xxxl);
  &__text {
    font-size: 5rem;
    color: var(--color-secondary);
    letter-spacing: 1rem;
    text-transform: uppercase;
  }
}

</style>
