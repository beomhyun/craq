<template>
  <div class="tree-board">
    <div class="container max-width-lg" style="display: flex">
      <h2 style="display: inline; width: 100%">CRAQ NODE</h2>
      <button @click="addTree" class="btn btn--primary btn--md" style="">Add Tree</button>
    </div>
    <!-- <h5>My Community</h5> -->
    <MyCommunities/>
    <AllCommunity/>
    <div class="" v-if="topicsList.length > 0">
      <ul v-for="topicOne in topicsList">
        <li><router-link :to="`/freeboard/${topicOne.pk}`">{{topicOne.topic}}</router-link></li>
      </ul>
    </div>
    <form id="_boardForm" name="boardForm" @submit.prevent="searchTopics" class="form-horizontal">
      <div class="form-control width-100%">
        <input type="search" name="searchA" v-model="searchtopic" placeholder="게시판 제목 입력" class="form-control width-70%">
        <button type="submit" class="btn btn-accept btn-sm" name="button" style="margin:5px;">Search</button>
      </div>
    </form>
  </div>

</template>

<script>
import MyCommunities from '@/components/freeboardDir/MyCommunities.vue'
import AllCommunity from '@/components/freeboardDir/AllCommunity.vue'

export default {
  name : "Community",
  components : {
    MyCommunities,
    AllCommunity,
  },
  data() {
    return {
      searchtopic : "",
      topicsList : [],
    }
  },
  methods : {
    addTree() {
      this.$router.push({name:'addtree'});
    },
    searchTopics() {
      this.$axios
      .get(`topics/search?title=${this.searchtopic}`)
      .then((res) => {
        this.topicsList = res.data
        console.log(this.topicsList)
      })
    }
  }
}

</script>

<style scoped lang="scss">
.tree-board {
  // transition: all 2s ease;
  // position: absolute;
  // top: 0;
  // left: 0;
  // width: 100%;
  // height: 100%;
  // transition: all 5s ease;
  // background-color: #fff;
  // border: 1px solid #ccc;
  // overflow: hidden;
  // padding-left: var(--space-xxxs);
  // padding-top: var(--space-xxxs);
  // cursor: text;
  // text-align: left;
  // -webkit-appearance: textfield;
  // display: flex;
  // flex-wrap: wrap;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  font: 200 20px/1.5 Helvetica, Verdana, sans-serif;
  border-bottom: 1px solid #ccc;
}

li:last-child {
  border: none;
}

li a {
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

li a:hover {
  font-size: 30px;
  // background: #f6f6f6;
}
</style>
