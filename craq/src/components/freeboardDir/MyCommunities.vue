<template>
  <div>
<!--    <h5> 인기글 </h5>-->

    <div class="container" style="column-count: 2; column-rule: dotted 1px #222;">
      <ul class="my-ul text-component width-100%" v-for="mycomm in mytopics">
        <!-- <li class="text-component width-50%"><router-link :to="{ path: `/freeboard/${mycomm.topic}`, params: {topic : mycomm.topic} }">{{mycomm.topic}}</router-link></li> -->
        <!-- <span>{{mycomm}}</span> -->
        <li class="text-component width-50%"><router-link :to="`/freeboard/${mycomm.PK}`">{{mycomm.TOPIC}}</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name : "MyCommunities",
  data() {
    return {
      mytopics : [],
    }
  },
  created() {
    this.$axios
    .get(`topics/users/${this.$session.get("userPk")}`)
    .then(res=> {
        // console.log(res.data);
        this.mytopics = this.mytopics.concat(res.data);
        // console.log(this.mytopics);
    });

    this.$axios
    .get(`subscribes/${this.$session.get("userPk")}`)
    .then(res=> {
        // console.log(res.data);
        this.mytopics = this.mytopics.concat(res.data);
        // console.log(this.mytopics);
    });
  }
}

</script>

<style lang="scss">
.my-ul {
  // list-style: none;
  margin: 5px;
  padding: 5px;

  max-width: 250px;
  width: 100%;
}
</style>
