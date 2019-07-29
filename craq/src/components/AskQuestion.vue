<template>
    <div class="container">
    
        <!-- Headline -->
        <div class="headline">
            Ask-Question
        </div> <!-- headline -->

       <!-- Body -->
       <div class="mainContent">
        <div class="inputQuestion">
                <label for="title">title</label>
                <input type="text" id="title">
                <label for="content">content</label>
                <input type="text" id="content">
                <label for="code">code</label>
                <input type="text" id="code">
                <label for="hashtag">hashtag</label>
                <input type="text" id="hashtag">
            </div>

            <div class="sub">
                <div class="sub-Box">
                    <h3 class="sub-Box__title">Hot HashTags</h3>
                    <div v-for="item in Hot" class="sub-Box__list">
                        <div @click="createQuestion" class="btn">{{item}}</div>
                    </div>
                </div>
                <div class="sub-Box">
                    <h3 class="sub-Box__title">How To Use</h3>
                    <div v-for="item in FaQ" class="sub-Box__list">
                        <div @click="createQuestion" >{{item}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Card from '@/components/Card.vue';
import InputTag from '@/components/InputTags.vue';
let marked = require('marked');

import { realpathSync } from 'fs';
export default {
    name: 'AskQuestion',
    props: {
        askQuestion : {type: Boolean, default: false},
    },
    components: {
        Card,
        InputTag,
    },
    data() {
        return{
            md_text: '# Title',
            inputTitle : '',
            inputHashtag: '',
            inputContent: '',
            inputCode: '',
            Hot: [
                'DynamicRouter',
                'Vuetify',
                'ResfulAPI',
                'Firebase',
                'Node.js'
            ],
            FaQ: [
                '해시태그 작성 가이드',
                '질문 작성 방법',
                '팁과 정보'
            ]
        }
    },
    methods: {
        createQuestion : function() {
        this.askquestion = false;
        this.$emit('childs-event', this.askquestion)
        this.$router.push({name:'code'})
        }
       
    },
    computed: {
        checkInputTitle () {
           if (this.inputTitle === '') {
               console.log(false);
               return false
           } else {
               console.log(true)
               return true
           }
        },
        checkInputHashtag () {
            if (this.inputHashtag === '') {
               console.log(false);
               return false
           } else {
               console.log(true)
               return true
           }
        },
         currentRouteName() {
            console.log(this.$route.name);
            return this.$route.name;
        },
        previewText() {
            marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
            });
            return marked(this.md_text)
	}
    }
}
</script>

<style scoped lang="scss">

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}

.headline {
  background-color: var(--color-surface);
  padding: var(--space-xs);
  width: 100%;
  height: 75px;
  font-size: var(--text-xxl);
  text-transform: capitalize;
}

.mainContent {
    display: flex;
    justify-content: space-between;
}

.inputQuestion {
    display: flex;
    flex-direction: column;
}

.sub {
    display: flex;
    flex-direction: column;
}

.sub-Box {
    width: 200px;
    height: 100%;
    border: 1px dashed;
    border-radius: var(--radius-md);
    background-color: alpha(var(--color-surface-dark),0.2);
    text-align: center;
    padding: var(--space-xxs);
    margin-bottom: var(--space-sm);

    &__title {
        margin-bottom: var(--space-xxs);
    }
    &__list {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: var(--space-sm);
        width: 100%;
    }

    &__list:hover {
        cursor: pointer;
        user-select: none;
        background-color: var(--color-surface-dark);
    }
}
.btn {
    background-color: var(--color-tertiary);
    color: var(--color-on-tertiary);
}
.btn:hover {
    background-color: var(--color-tertiary-dark);
    color: var(--color-on-tertiary-dark);
}

</style>

