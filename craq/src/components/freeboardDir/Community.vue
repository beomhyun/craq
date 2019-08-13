<template>
  <div class="tree-board">
    <div class="container max-width-lg" style="display: flex">
      <h2 style="display: inline; width: 100%">자유 게시판</h2>
      <button @click="addTree" class="btn btn--primary btn--md" style="margin:5px">게시판 신청</button>
    </div>
    <h3 style="text-align:center;">내가 구독한 게시판</h3>
    <MyCommunities/>
    <h3 style="text-align:center;">지금 잘나가는 게시판</h3>
    <AllCommunity/>
    <div class="my-ul" v-if="topicsList.length > 0">
      <ul v-for="topicOne in topicsList">
        <li><router-link :to="`/freeboard/${topicOne.pk}`">{{topicOne.topic}}</router-link></li>
      </ul>
    </div>
    <form id="_boardForm" name="boardForm" @submit.prevent="searchTopics" class="form-horizontal">
      <div class="width-100%">
        <input type="search" name="searchA" v-model="searchtopic" placeholder="게시판 제목 검색" class="form-control width-70%">
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
      if(this.searchtopic.length < 1) {
        alert("1 글자 이상 입력해 주세요~!");
        return;
      }else {
        this.$axios
        .get(`topics/search?title=${this.searchtopic}`)
        .then((res) => {
          this.topicsList = res.data
          console.log(this.topicsList)
          if(this.topicsList == 0) {
            alert("검색 결과 찾으시는 게시판이 존재하지 않습니다.");
          }
        })
      }
    }
  }
}

</script>

<style scoped lang="scss">
.tree-board {

}
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
      // font-size: 30px;
      background: var(--color-surface);
      color : var(--color-primary);
      font-weight: bold;
    }

  }
}


</style>
