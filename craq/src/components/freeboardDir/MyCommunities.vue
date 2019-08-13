<template>
  <div>
    <!-- style="column-count: 2;" -->
    <div class="my-ul container">
      <ul class="flex" v-for="i in mytopics.length > limits ? limits : mytopics.length">
        <li class="content"><router-link :to="`/freeboard/${mytopics[i-1].PK}`">{{mytopics[i-1].TOPIC}}</router-link></li>
      </ul>
    </div>
    <a href="#" @click="loadMore" class="loadMore" v-if="mytopics.length > 4">{{more_txt}}</a>
  </div>
</template>
<!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script> -->
<script>

export default {
  name : "MyCommunities",
  data() {
    return {
      mytopics: [],
      limits: 4,
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
      width: 75%;

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
      // font-size: 30px;
      // background: var(--color-primary-dark);
      background: var(--color-tertiary-darker);
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
.flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.content {
  // height: 100px;
  width: 45%;
  // color: #fff;
  font-size: 24px;
  line-height: 100px; /* centering text just for view */
  text-align: center;
  background-color: var(--color-surface);
  margin: 5px;
  border: 1px solid var(--color-primary-dark);
  display: none;
}

</style>
