<template>
  <div>
    <!-- style="column-count: 2;" -->
    <div class="my-ul">
      <div class="topicList">
        <div class="topicList__content" v-for="i in mytopics.length > limits ? limits : mytopics.length">
          <router-link :to="`/freeboard/${mytopics[i-1].PK}`">{{mytopics[i-1].TOPIC}}</router-link>
        </div>
      </div>
    </div>
    <a href="#" @click="loadMore" class="loadMore" v-if="mytopics.length > 10">{{more_txt}}</a>
  </div>
</template>
<!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script> -->
<script>

export default {
  name : "MyCommunities",
  data() {
    return {
      mytopics: [],
      limits: 10,
      more_txt: "더 보기"
    }
  },
  created() {
    this.$axios
    .get(`topics/users/${this.$session.get("userPk")}`)
    .then(res=> {
        this.mytopics = this.mytopics.concat(res.data);
        console.log(this.mytopics.length);
    });

    this.$axios
    .get(`subscribes/${this.$session.get("userPk")}`)
    .then(res=> {
        this.mytopics = this.mytopics.concat(res.data);
        console.log(this.mytopics.length);
    });
  },
  methods : {
    loadMore() {
      if(this.limits < this.mytopics.length) {
        this.limits += 4;
        if(this.limits < this.mytopics.length) {
          this.more_txt = "더 보기";
        }else {
          this.more_txt = "간략히";
        }

      }else if(this.limits >= this.mytopics.length){
        this.limits = 4;
        this.more_txt = "더 보기";
      }
    }
  }
}

// $(window).on('load', function () {
//     load('#js-load', '4');
//     $("#js-btn-wrap .button").on("click", function () {
//         load('#js-load', '4', '#js-btn-wrap');
//     })
// });
</script>

<style lang="scss" scoped>
.my-ul {
  padding: var(--space-md);
  background-color: var(--color-surface-light);
  .topicList {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    width: 100%;

    &__content {
      margin-bottom: var(--space-xs);
      width: 50%;
      text-align: center;
      // border: 1px solid var(--color-surface);
      font: 200 20px/1.5 Helvetica, Verdana, sans-serif;
      // border-bottom: 1px solid #ccc;
      text-decoration: none;
      // color: #000;

      -webkit-transition: font-size 0.3s ease, background-color 0.3s ease;
      -moz-transition: font-size 0.3s ease, background-color 0.3s ease;
      -o-transition: font-size 0.3s ease, background-color 0.3s ease;
      -ms-transition: font-size 0.3s ease, background-color 0.3s ease;
      transition: font-size 0.3s ease, background-color 0.3s ease;
    }

    &__content:last-child {
      border: none;
    }

    &__content:hover {
      // font-size: 30px;
      // background: var(--color-primary-dark);
      background: var(--color-tertiary);
      color : var(--color-surface);
      font-weight: bold;
    }
  }
}
.loadMore {
  width: 150px;
  color: var(--color-surface);
  display: block;
  text-align: center;
  margin: 20px auto;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid transparent;
  background-color: var(--color-tertiary-dark);
  transition: .3s;
}
.loadMore:hover {
  color: var(--color-tertiary-darker);
  background-color: var(--color-surface);
  border: 1px solid var(--color-tertiary);
  text-decoration: none;
}

</style>
