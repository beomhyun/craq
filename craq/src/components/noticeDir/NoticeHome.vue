<template>
    <div>
        <!-- <div v-if="freeState === 'freeboard'"> -->
          <div class="container max-width-lg" style="display: flex">
            <h3 style="display: inline; width:100%">공지사항 게시판</h3>
          </div>
          <NoticeList :page='1' />
    </div>

</template>

<script>
// import FreeList from '@/components/freeboardDir/FreeList.vue';
import Spinner from '@/components/Spinner.vue';

const NoticeList = () => ({
    component: import("@/components/noticeDir/NoticeList.vue"),
    loading: Spinner,
    delay: 500
});

export default {
  name : 'NoticeHome',
  components : {
    NoticeList
  },
  // loading: Spinner,
  // delay: 500,
  data() {
    return {
      isManager : ""
    }
  },
  created() {
    this.$axios
    .get(`managers/2/${this.$session.get("userPk")}`)
    .then((res) => {
      console.log(res.data);

      if(res.data.status === "fail") {
        this.isManager = false;
      }else {
        this.isManager = true;
      }
      // this.loaded = true;
    });
  },
  methods : {}
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
      column-rule: dotted 1px var(--color-parimary);
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
