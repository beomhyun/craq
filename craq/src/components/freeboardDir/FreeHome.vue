<template>
    <div>
        <!-- <div v-if="freeState === 'freeboard'"> -->
          <div class="container max-width-lg" style="display: flex">
            <h3 style="display: inline; width:100%">{{topic}} 게시판</h3>
            <div v-if="!isManager">
              <button v-if="!isSubscribe" class="btn btn--primary" @click="subscribe">구독하기</button>
              <button v-else class="btn btn--accent" @click="subscribe">구독취소</button>
            </div>
          </div>
          <h4 style="text-align:center;">최신글</h4>
          <div class="my-ul container">
            <!-- <div> -->
              <ul class="width-100%" v-for="allpost in all_tmp_data">
                <li class="width-100%">
                  <p @click="boardShowDetail(allpost)" style="width:200px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; ">
                    ({{allpost.TOPIC}})
                    {{allpost.TITLE}}
                    [{{allpost.COMMENTS}}]
                    {{allpost.writer}}
                  </p>
                </li>
              </ul>
            <!-- </div> -->
          </div>
          <FreeList :topic="this.$route.params.topic" :page='1' />
    </div>

</template>

<script>
import Spinner from '@/components/Spinner.vue';

const FreeList = () => ({
    component: import("@/components/freeboardDir/FreeList.vue"),
    loading: Spinner,
    delay: 500
});

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
      isManager : false,
      loaded: false,
    }
  },
  created() {
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
    });

    this.$axios
    .get(`managers/${this.$route.params.topic}/${this.$session.get("userPk")}`)
    .then((res) => {
      console.log(res.data);

      if(res.data.status === "fail") {
        this.isManager = false;
      }else {
        this.isManager = true;
      }
    });
  },
  methods : {
    subscribe() {
      if(!this.isSubscribe) {
        this.$axios.post('subscribes', {
          topic : this.$route.params.topic,
          user_id : this.$session.get("userPk"),
        })
        .then((res) => {
          this.isSubscribe = true;
        });
      }else {
        this.$axios
        .delete(`subscribes/${this.$route.params.topic}/${this.$session.get("userPk")}`)
        .then((res) => {
          this.isSubscribe = false;
        });
      }
    },
    boardShowDetail(data) {
       this.$router.push({name: 'freedetail' , params: { id: data.PK, topic : this.$route.params.topic, page : 1}});
    },
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

    .my-ul {
      box-sizing: border-box;
      column-count: 2;
      // column-rule: dotted 1px var(--color-parimary);
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
          width: 90%;

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
          // background: var(--color-primary);
          color : var(--color-tertiary);
          font-weight: bold;
        }
      }
    }
</style>
