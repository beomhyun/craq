<template>
  <div class="container">
    <table class='table table-striped'>
      <col width="10%"><col width="30%"><col width="15%"><col width="20%"><col width="15%"><col width="10%">
      <thead style="text-align:left;">
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
          <th>조회수</th>
          <th>추천수</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="(board, index) in topic_articles" class = "nicecolor" style="text-align:left;">
        <td v-html="index"></td>
        <td v-html="board.title" @click="showDetail(board)"></td>
        <td v-html="board.user_name"></td>
        <td v-html="board.createAt"></td>
        <td v-html="board.views"></td>
        <td v-html="board.recommend"></td>
      </tr>
      </tbody>
    </table>
    <div> <button>공지사항</button> <button>최신순</button> <button>조회순</button> <button @click="boardwrite">글쓰기</button></div>
  </div>
</template>

<script>
export default {
  name : "FreeList",
  components : {

  },
  data() {
    return {
      freeState : 'freelist',
      topic_articles : [
          {
            id : '1',
            title : 'lorem ipsum1',
            body : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',

            user_name : '정준희',
            createAt : '19.07.25',
            views : '1000',
            recommend : '31'
          },
          {
            id : '2',
            title : 'lorem ipsum2',
            body : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',

            user_name : '정준희',
            createAt : '19.07.25',
            views : '1000',
            recommend : '31'
          },
          {
            id : '3',
            title : 'lorem ipsum3',
            body : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',

            user_name : '정준희',
            createAt : '19.07.25',
            views : '1000',
            recommend : '31'
          },
          {
            id : '4',
            title : 'lorem ipsum4',
            body : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            user_name : '정준희',
            createAt : '19.07.25',
            views : '1000',
            recommend : '31',
          },
          {
            id : '5',
            title : 'lorem ipsum5',
            body : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            user_name : '정준희',
            createAt : '19.07.25',
            views : '1000',
            recommend : '31'
          },
        ]
      }
    },
    created() {

    },
    methods : {
      boardwrite() {
        this.freeState = 'addboard';
        this.$emit('childs-event', this.freeState);
      },
      showDetail(board) {
        this.freeState = 'freeDetail';
        this.$emit('detail-event', {freeState : this.freeState, info : board});
      }
    }

}
</script>

<style>
</style>
