<template>
    <div>
      <div class="filler">
      </div>
    </div>
</template>

<script>
export default {
    name: "User",
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

</style>
