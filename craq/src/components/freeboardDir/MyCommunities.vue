<template>
  <div>
<!--    <h5> 인기글 </h5>-->

    <!-- <div class="container my-ul" style="column-count: 2;"> -->
    <div class="container my-ul" style="column-count: 2;">
      <ul class="list-group text-component width-100%" v-for="mycomm in mytopics">
        <li class="text-component width-50%"><router-link :to="`/freeboard/${mycomm.PK}`"><h4>{{mycomm.TOPIC}}</h4></router-link></li>
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
  box-sizing: border-box;
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      // border: 1px solid var(--color-surface);
      margin-top: -1px;
      padding: 12px;
      font: 200 20px/1.5 Helvetica, Verdana, sans-serif;
      // border-bottom: 1px solid #ccc;
      text-decoration: none;
      // color: #000;
      display: block;
      width: 200px;

      -webkit-transition: font-size 0.3s ease, background-color 0.3s ease;
      -moz-transition: font-size 0.3s ease, background-color 0.3s ease;
      -o-transition: font-size 0.3s ease, background-color 0.3s ease;
      -ms-transition: font-size 0.3s ease, background-color 0.3s ease;
      transition: font-size 0.3s ease, background-color 0.3s ease;
    }

    li:last-child {
      border: none;
    }

    li:hover {
      font-size: 30px;
      // background: #f6f6f6;
    }
  }
}
</style>
