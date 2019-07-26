<template>
    <div>
        <div v-if="freeState === 'freeboard'">
          <div class="container max-width-lg" style="display: flex">
            <h3 style="display: inline; width:100%">{{topic}} 게시판</h3>
            <button class="btn btn--subtle btn--md">Subscribe</button>
          </div>
          <div class="container">
            <div style="column-count: 2; column-rule: dotted 1px #222;">
              <ul v-for="allpost in all_tmp_data">
                <li><strong @click="showDetail(allpost)">{{allpost.title}}</strong>&emsp;<i>{{allpost.user_name}}</i></li>
              </ul>

            </div>
            <div><button class="btn btn--primary btn--md">최신순</button> <button class="btn btn--primary btn--md">조회순</button> </div>
          </div>
          <FreeList @detail-event="detailMethod" @write-event="addBoardMethod"/>
        </div>
        <div v-else-if="freeState === 'addboard'">
          <FreeBoardWrite @childs-event="parentsMethod"/>
        </div>
        <div v-else-if="freeState === 'freeDetail'">
          <!-- <h3>FreeDetail</h3> -->
          <FreeDetail :info="detailInfo" @childs-event="parentsMethod"/>
        </div>
    </div>

</template>

<script>
import FreeBoardWrite from '@/components/FreeBoardWrite.vue'
import FreeDetail from '@/components/FreeDetail.vue'
import FreeList from '@/components/FreeList.vue'

export default {
  name : 'FreeBoard',
  components : {
    FreeBoardWrite,
    FreeDetail,
    FreeList
  },
  data() {
    return {
      topic : this.$route.params.topic,
      freeState : 'freeboard',
      detailInfo : {},
      all_tmp_data : [
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
          views : '8000',
          recommend : '31'
        },
        {
          id : '3',
          title : 'lorem ipsum3',
          body : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',

          user_name : '정준희',
          createAt : '19.07.25',
          views : '1700',
          recommend : '31'
        },
        {
          id : '4',
          title : 'lorem ipsum4',
          body : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          user_name : '정준희',
          createAt : '19.07.25',
          views : '9000',
          recommend : '31',
        },
        {
          id : '5',
          title : 'lorem ipsum5',
          body : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          user_name : '정준희',
          createAt : '19.07.25',
          views : '1800',
          recommend : '31'
        },
      ],
    }
  },
  created() {
    // var id = this.$route.params.id
    //get All FreeBoard
    // axios.get('http://192.168.31.58:10123/api-docs/', {
    //
    // })
  },
  methods : {
    parentsMethod: function(freeState) {
        // alert(freeState);
      this.freeState = freeState; // 자식으로 부터받은 메시지를 사용
    },
    showDetail(info) {
       // this.$router.push({name:'freedetail', params: {id : tid} });
       this.freeState = 'freeDetail';
       this.detailInfo = info;
    },
    detailMethod: function(freeState, info) {
      this.freeState = freeState // 자식으로 부터받은 메시지를 사용
      this.detailInfo = info
    },
    addBoardMethod(freeState) {
        this.freeState = freeState;
    },
    newest: function(arr) {
      // Set slice() to avoid to generate an infinite loop!
      return arr.slice().sort(function(a, b) {
        return a.position - b.position;
      });
    },
    viewSort: function(arr) {
      // Set slice() to avoid to generate an infinite loop!
      return arr.slice().sort(function(a, b) {
        return a.position - b.position;
      });
    }
  }
}

</script>

<style  lang="scss" scoped>
$--card-main-height: 120px;
    .card {
        display: flex;
        justify-content: space-between;
        background-color: red;
        margin-top: var(--space-xxxs);
        width: 890px;
        height: 120px;
    }

    .info {
        background-color: var(--color-surface);
        display: flex;
        justify-content: space-between;
        width: 140px;
        padding: var(--space-md);
        padding-right: var(--space-xxs);;

            &__column {
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                }
        }

    .main {
        flex: 1;
        padding: var(--space-xxs);;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        background-color: var(--color-surface);

        &__title {
            font-size: calc(#{$--card-main-height} * 0.2);
        }

    }

    .user {
            background-color: var(--color-surface);
            width: 200px;
            padding: var(--space-xs);
                &__top {
                    display: flex;
                }

                &__bottom {
                    display: flex;
                    justify-content: space-between;
                }

                &__image {
                    border-radius: 50%;
                    background-color: var(--color-primary);
                    width: 50px;
                    height: 50px;
                }

                &__name {
                    background-color: var(--color-surface);
                    width: auto;
                    margin: auto;
                }
        }
    .btn {
        background-color: var(--color-tertiary);
        margin: var(--space-xxxs);
        color: var(--color-on-tertiary);
    }
</style>
