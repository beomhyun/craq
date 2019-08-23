<template>
  <div class="free-detail">
    <div class="header">
      <h1 style="text-align: center;">{{topicTitle}} 게시판</h1>
      <h2>{{info.TITLE}}</h2>
      <!-- <p>{{info.CREATED_AT}}</p> -->
      <p>Posted by {{info.USERNAME}}, <time itemprop=info.CREATED_AT datetime=info.CREATED_AT>{{info.CREATED_AT|formatDate}}</time></p>
    </div>
    <div class="row">
      <div class="column side">
          <div class="voting-container">
              <button class="reset btn-vote" @click="recommendBoard(1)" :class="{'color-primary': voteStatus == 1}">
                  <font-awesome-icon :icon="{prefix: 'fas', iconName: 'chevron-up'}"></font-awesome-icon>
              </button>
              <div v-if="info.VOTE != null" class="vote-count" itemprop="upvoteCount" data-value=info.VOTE>
                  {{info.VOTE}}
              </div>
              <div v-else class="vote-count" itemprop="upvoteCount" data-value=info.VOTE style="text-align:center;">
                  0
              </div>
              <button class="reset btn-vote" @click="recommendBoard(-1)" :class="{'color-primary': voteStatus == -1}">
                  <font-awesome-icon :icon="{prefix: 'fas', iconName: 'chevron-down'}"></font-awesome-icon>
              </button>
          </div>
        <!-- </div> -->
      </div>

      <div class="column middle">
        <p v-if="info.IMAGE !== 'http://15.164.153.221:9000/'" style="text-align : center;">
          <img class="preview" :src="info.IMAGE" style="max-height : 500px;" align="center">
        </p>
        <div class="post-text" item-prop="text">
            <div v-html="info.BODY"></div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p v-if="info.USERNAME === this.$session.get('username')">
        <button class="btn btn--primary btn-lg" style="margin:3px" @click="goEditPage">Edit</button>
        <button class="btn btn--primary btn-lg" style="margin:3px" @click="freeDelete">Delete</button>
      </p>
    </div>

    <div style="text-align : center">
      <h5 class="h5">Comments</h5>
      <div v-for="comment in comments">
        <FreeComment :comment="comment"/>
      </div>
      <form id="commentForm" @submit.prevent="sendComment" class="width-100%">
        <span>
          <input type="text" name="comment" v-model="answer" class="form-control">
          <button type="submit" class="btn btn--accent btn--md">Send</button>
        </span>
      </form>
      <FreeList :topic="this.topic" :page='this.page'/>
    </div>
  </div>
</template>
<!-- 대댓글 -->
<!-- <input type="text" name="answer" v-model="answer" class="form-control width-90%"/> -->
<!-- <button type="button" name="regist" class="btn btn--accent btn--md" @click="commentRegist">등록</button> -->

<script>
import FreeComment from '@/components/freeboardDir/FreeComment.vue'
import FreeList from '@/components/freeboardDir/FreeList.vue'
import FreeEdit from '@/components/freeboardDir/FreeEdit.vue'
// import ShowDetail from '@/components/freeboardDir/ShowDetail.vue'

export default {
  name : 'FreeDetail',
  props : [
    'id',
    'topic',
    'page'
  ],
  components : {
    FreeComment,
    FreeEdit,
    FreeList,
    // ShowDetail
  },
  data() {
    return {
      isEdit : false,
      imgData : '',
      info : {},
      comments : [],
      answer : "",
      articleID : this.id,
      voteStatus: 0,
      topicTitle: '',
    }
  },
  created() {
    this.$axios
    .get(`topics/pk/${this.topic}`)
    .then((res) => {
      var title = res.data;
      // console.log(title.data[0]);
      this.topicTitle = title.data[0].TOPIC;
      // this.loaded = true;
    });

    this.$axios
    .get(`contents/articles/${this.articleID}`)
    .then((res) => {
      this.info = res.data.data[0];
      console.log(this.info.IMAGE)
    });

    this.listComments();

    this.$axios.get(`votes/${this.articleID}/${this.$session.get('userPk')}`).then(res=>{
        this.voteStatus = res.data.data;
        console.log(this.voteStatus)
    })
  },
  methods : {
    goEditPage() {
      this.$router.push({name : 'freeedit', params : {id : `${this.articleID}`, freeInfo : this.info}});
    },
    freeDelete() {
      this.$axios
      .delete(`articles/${this.articleID}`)
      .then((res) => {
        this.$router.go(-1);
      })
    },
    recommendBoard(num) {
      console.log("recommendBoard");
      if (this.voteStatus) return alert('not allowed');
      let data = {
          article_id: this.articleID,
          user_id : this.$session.get('userPk'),
          good: num
      }
      this.$axios.post('votes', data).then((res) => {
          if (num ==1) {
              this.info.VOTE++;
              this.voteStatus = 1;
          } else {
              this.info.VOTE--;
              this.voteStatus = -1;
          }
      })
    },
    sendComment() {
      this.$axios
      .post(`comments`, {
        user_id: this.$session.get("userPk"),
        content_id: this.info.PK,
        parent_id: 0,
        body: this.answer
      })
      .then((res) => {
        this.listComments()
        this.answer = ""
      })
    },
    listComments() {
      this.$axios
      .get(`comments/articles/${this.articleID}`)
      .then((res) => {
        this.comments = res.data.data
        console.log(this.comments[0])
      });
    },
  },

}


</script>

<style lang="scss" scoped>
.free-detail {
  box-sizing: border-box;
  margin: 0;

  .header {
    // background-color: #f1f1f1;
    padding: 20px;
    // text-align: center;
  }

  .column {
    float: left;
    padding: 10px;

    .side {
      width: 10%;
      // float: left;

      .voting-container {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          text-align: center;
      }
      .btn-vote {
          font-size: 1.5rem;
          &--small {
              font-size: 1.2rem;
          }
      }
      .btn-check {
          &--small{
              font-size: 1.5rem;
              color: var(--color-primary-dark)
          }
      }
    }
  }

  .row:after {
    content: "";
    display: table;
    clear: both;
  }

  @media screen and (max-width: 600px) {
    .column.side, .column.middle {
      width: 100%;
    }
  }

  .footer {
    // background-color: #f1f1f1;
    padding: 10px;
    text-align: center;
  }

}
.post-text {
    margin-top: var(--space-sm);
    margin-bottom: var(--space-sm);
    word-wrap: break-word;
    font-size: 1rem; // TODO
    line-height: 1.3;
    font-family: Arial, "Helvetica Neue",Helvetica, sans-serif;
    width: 1100px;
}


</style>
