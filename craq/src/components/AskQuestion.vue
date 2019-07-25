<template>
    <div class="container">
    
        <!-- Headline -->
        <div class="headline">
            Ask-Question
        </div> <!-- headline -->

        <div class="askQuestion">
        <!-- Form -->
        <form class="askForm" @submit.prevent="createQuestion"> 
            <h3>Title</h3>
            
                <input class="askForm__title" placeholder="Edit"  id="title" v-model="inputTitle">
                
                <!-- titleSearch -->
                <div :class="{'openInputTitle' : checkInputTitle}">
                    <div class="inputTitle" v-for="a in 5">
                        <router-link to="/code"><Card class="shadow"/></router-link>
                    </div>
                </div>
                <!-- titleSearch -->
            
            <h3>Content</h3>
            <textarea  name="" class="askForm__content" id="content" v-modle="inputContent"></textarea>
            <h3>My Code</h3>
            <textarea  name="" class="askForm__code" id="code"></textarea>
            
            <h3>Hashtag</h3>
            <input-tag v-model="inputHashtag" class="askForm__hashtag" ></input-tag>
            <!-- HashtagSearch -->
            <div :class="{'openInputHashtag' : checkInputHashtag}">
                <div class="inputHashtag">
                    <h1>{{ inputHashtag }}</h1>
                </div>
            </div>
            <!-- HashtagSearch -->

            <div class="askForm__submit">
                <div>
                    <input type="checkbox" name="" id="visible">
                    <label for="visible">Visible / Invisible</label>
                </div>
                <input type="submit" value="제출">
            </div>
        </form>

        <div class="sub">
            <div class="sub-Box">
                <h3>Hot Question</h3>
                <div v-for="item in Hot" class="sub-Box__list">
                    <div @click="createQuestion">{{item}}</div>
                </div>
            </div>
            <div class="sub-Box">
                <h3>How To Use</h3>
                <div v-for="item in FaQ" class="sub-Box__list">
                    <div @click="createQuestion">{{item}}</div>
                </div>
            </div>
        </div>

        </div>
        <!-- Form -->

       

    </div>
</template>

<script>
import Card from '@/components/Card.vue';
import InputTag from '@/components/InputTags.vue'

import { realpathSync } from 'fs';
export default {
    name: 'AskQuestion',
    props: {
        askQuestion : {type: Boolean, default: false}
    },
    components: {
        Card,
        InputTag,
    },
    data() {
        return{
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
    }
}
</script>

<style scoped lang="scss">
h3 {
    font-weight: bold;
}
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
}

.headline {
  background-color: var(--color-surface);
  padding: var(--space-xs);
  width: 890px;
  height: 75px;
  font-size: var(--text-xxl);
  text-transform: capitalize;
}

.askQuestion {
    display: flex;
    justify-content: space-between;
    background-color: var(--color-surface);
    width: 890px;    
}

.askForm {
        display: flex;
        width: 100%;
        padding: var(--space-sm);
        flex-direction: column;
        align-content: center;
        
        &__content {
            height: 150px;
            resize: none;
        }

        &__code {
            height: 150px;
            resize: none;
        }

        &__submit {
        display: flex;
        justify-content: space-between;
        margin-top: var(--space-xxxs);
    }
}

.sub {
    display: flex;
    flex-direction: column;
}

.sub-Box {
    width: 200px;
    height: 150px;
    border: 1px solid;
    border-radius: calc(var(--radius, 0.25em));
    background-color: var(--color-surface-lighter);
    text-align: center;
    padding: var(--space-xxs);
    margin-bottom: var(--space-sm);

    &__list {
        display: flex;
        flex-direction: column;
        align-items: start;
        width: 100%;
    }

    &__list:hover {
        background-color: var(--color-secondary);
    }
}

.inputTitle {
    display: none;
}

.openInputTitle .inputTitle{
    display: block;
    padding: var(--space-xxxs);
    background-color: var(--color-background-dark);
}

.inputHashtag {
    display: none;
}

.openInputHashtag .inputHashtag{
    display: block;
    height: 120px;
    background-color: var(--color-background-dark);
}
.shadow {
  box-shadow: var(--shadow-md);
}

</style>

