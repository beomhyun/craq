<template>
    <div>
        <!-- <div v-if="freeState === 'freeboard'"> -->
          <div class="container max-width-lg" style="display: flex">
            <h3 style="display: inline; width:100%">{{topic}} 게시판</h3>

            <button v-if="!isSubscribe" class="btn--subtle" @click="subscribe">Subscribe</button>
            <button v-else class="btn--primary" @click="subscribe">Subscribe</button>
          </div>
          <div class="container">
            <div style="column-count: 2; column-rule: dotted 1px #222;">
              <ul v-for="allpost in all_tmp_data">
                <li>
                  ({{allpost.TOPIC}})
                  <strong class="strong" @click="showDetail(allpost)">{{allpost.TITLE}}</strong>
                  [{{allpost.COMMENTS}}]&emsp;
                  <span>{{allpost.writer}}</span>
                </li>
              </ul>
            </div>
            <div>
              <button class="btn btn--primary btn--md">최신순</button>
              <button class="btn btn--primary btn--md">조회순</button>
            </div>
          </div>
          <FreeList :topic="this.$route.params.topic" :page='1' />
        <!-- </div> -->
    </div>

</template>

<script>
import FreeList from '@/components/freeboardDir/FreeList.vue'

export default {
  name : 'FreeHome',
  components : {
    FreeList
  },

  data() {
    return {
      topic : "",
      isSubscribe : true,
      all_tmp_data : [],
    }
  },
  created() {
    // var id = this.$route.params.id
    //get All FreeBoard
    // axios.get('http://192.168.31.58:10123/api-docs/', {
    //
    // })
    this.$axios
    .get(`topics/pk/${this.$route.params.topic}`)
    .then((res) => {
      var title = res.data;
      // console.log(title.data[0]);
      this.topic = title.data[0].TOPIC;
      if(title.data[0].IS_SUBSCRIBE == 0) {
        this.isSubscribe = false;
      }else {
        this.isSubscribe = true;
      }
    });

    this.$axios
    .get('articles/new')
    .then((res) => {
      this.all_tmp_data = res.data
    })
  },
  methods : {
    subscribe() {
      if(!this.isSubscribe) {
        this.$axios.post('subscribes', {
          topic : this.$route.params.topic,
          user_id : this.$store.state.loginPK,
        })
        .then((res) => {
          this.isSubscribe = true;
        });
      }else {
        this.$axios.delete(`subscribes/${this.$route.params.topic}/${this.$store.state.loginPK}`)
        .then((res) => {
          this.isSubscribe = false;
        });
      }
    },
    showDetail(data) {
       this.$router.push({path: `${this.$route.params.topic}/detail/${data.id}`, params: { info : data}});
      // this.$router.push({name: 'freedetail' , params: { id: data.id, info : data}});
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
