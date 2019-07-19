<template>
    <div>
      <div class="filler">
        <div class="container">
          <Card/>
          <Card/>
          <Card/>
          <Card/>
          <Card/>
          <Card/>
          <Card/>
        </div>
      </div>
    </div>
</template>

<script>
import Card from '@/components/Card.vue';

export default {
    name: "User",
    components: {
      Card,
    },
    props: [
        'id'
    ],
}

</script>

<style scoped lang="scss">
.filler {
  height: 1000px;
  width: auto;
  background-color: grey;
}
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
}

</style>
