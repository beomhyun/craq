<template>
  <div class="filler">
    <div class="haedline">
      <div class="headline__title">
        {{currentRouteName}}
      </div>
    </div>
    <div class="createBoard">
      <form id="myForm" @submit.prevent="createTree" class="createForm">
        <label for="topic"><strong>TITLE</strong> - 신청하고자 하는 게시판의 이름을 작성해 주세요.</label>
        <input type="text" name="topic" id="topic" v-model="topic" class="createForm__title" placeholder="Title"><br>
        
        <label for="Description"><strong>Description</strong> - 해당 게시판에 대한 간략한 설명을 작성해 주세요.</label>
        <textarea name="body" id="Description" v-model="body" class="createForm__content">Description</textarea><br>
        <button class="btn btn--primary btn--md createForm__btn">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert';

export default {

  name: "CreateTree",

  data() {
    return {
      topic: '',
      body: '',
    }
  },
  methods: {
    createTree : function() {
      if(this.topic.length < 1) {
        swal({  
              title : "게시판 제목울 1글자 이상 입력해 주세요!",
              text:'이 창은 잠시 후 자동으로 사라집니다.',
              icon: "info", 
              button: false,
              timer: 2000,
          });
        return;
      }

      this.$axios.post('topics', {
        topic : this.topic,
      })
      .then((response) => {
        console.log("??",response);
        this.$router.push({name:'community'});
      })
    }
  },
  computed: {
    currentRouteName() {
            return this.$route.name;
        },
  }
}

</script>

<style lang="scss" scoped>
.filler {
    width: auto;
    background-color: var(--color-background);
    padding: var(--space-sm);
}
.headline {
    display: flex;
    width: 100%;
    height: 75px;

    padding: var(--space-md);
}
.headline__title {
        background-color: var(--color-surface);
        font-size: var(--text-xxl);
        text-transform: capitalize;
    }

.createBoard {
  width: 100%;
  background-color: var(--color-surface);
  padding: var(--space-xxl);
}

.createForm {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  box-shadow: var(--shadow-sm);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface-light);
  padding: var(--space-xl);

  &__title {
    margin-top: var(--space-sm);
    border: 1px solid var(--color-contrast-low);
    border-radius: var(--radius-lg);
    width: 100%;
  }

  &__content {
    margin-top: var(--space-sm);
    border: 1px solid var(--color-contrast-low);
    border-radius: var(--radius-lg);
    width: 100%;
    height: 200px;
    resize: none;
  }

  &__btn {
    width: 150px;
    display: flex;
    align-self: flex-end;
  }

}
</style>
