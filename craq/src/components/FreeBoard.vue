<template>
    <div>
        <div v-if="freeState === 'freeboard'">
          <h4>{{topic}} 게시판</h4><button>Subscribe</button>
          <div class="container">
            <div v-for="allpost in all_tmp_data">
              <strong @click="showDetail(allpost)">{{allpost.title}}</strong>&emsp;<i>{{allpost.user_name}}</i>
            </div>
            <div> <button>최신순</button> <button>조회순</button> </div>
          </div>
          <FreeList @detail-event="detailMethod"/>
        </div>
        <div v-else-if="freeState === 'addboard'">
          <FreeBoardWrite @childs-event="parentsMethod"/>
        </div>
        <div v-else-if="freeState === 'freeDetail'">
          <!-- <h3>FreeDetail</h3> -->
          <FreeDetail :info="detailInfo"/>
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
          user_name : '정준희'
        },
        {
          id : '2',
          title : 'lorem ipsum2',
          user_name : '정준희'
        },
        {
          id : '3',
          title : 'lorem ipsum3',
          user_name : '정준희'
        },
        {
          id : '4',
          title : 'lorem ipsum4',
          user_name : '정준희'
        },
        {
          id : '5',
          title : 'lorem ipsum5',
          user_name : '정준희'
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
      this.freeState = freeState // 자식으로 부터받은 메시지를 사용
    },
    showDetail(info) {
       // this.$router.push({name:'freedetail', params: {id : tid} });
       this.freeState = 'freeDetail';
       this.detailInfo = info;
    },
    detailMethod: function(freeState, info) {
      this.freeState = freeState // 자식으로 부터받은 메시지를 사용
      this.detailInfo = info
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
