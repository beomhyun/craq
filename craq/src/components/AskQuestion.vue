<template>
    <div class="container">
    
        <!-- Headline -->
        <div class="headline">
            Ask-Question
        </div> <!-- headline -->
       <!-- Body -->
       <div class="mainContent">
           
            <div class="inputQuestion">
                <div class="inputQuestion__form">
                    <label for="title"><strong>Title</strong> - 제목을 입력시 유사한 질문을 표시해 줍니다.</label>
                    <input type="text" id="title" v-model="inputTitle" class="questionForm" placeholder="Enter a Title" :class="{'openSearchBox' : checkInputTitle}">
                    
                    <div class="searchtitle">

                        <div class="searchtitle__head">
                            <span>당신의 질문과 유사한 유형의 질문을 찾았습니다.</span>
                        </div>
                        
                        <div class="searchtitle__content">
                            <div v-for="list in cardLists" >
                                <router-link to='/code'>
                                    <card :list="list"/>
                                </router-link>
                            </div>
                        </div>
                    </div>

                    <label for="content"><strong>content</strong> - 문제 해결을 위해 시도한 것들을 상세하게 작성해주십시오.</label>
                    <froala id="edit content" :tag="'textarea'" :config="config" v-model="model"></froala>
                    

                    <label for="hashtag"><strong>hashtag</strong> - 사용된 기술들을 태그해두면 질문을 검색하기에 용이합니다.</label>
                    <input type="text" id="hashtag" class="questionForm" v-model="inputHashtag" :class="{'openSearchBox' : checkInputHashtag}">

                    <div class="searchHashtag">

                        <div class="searchHashtag__head">
                            <span>Similar HashTag Lists</span>
                        </div>
                        
                        <div class="searchHashtag__content">
                            
                            <div v-for="Hlist in hashtagLists" class="searchHashtag__form">
                                <div class="hashtagComponents">
                                    <div class="hashtagComponents__title">
                                        <div class="btn btn--sm">{{ Hlist.title }}</div>
                                    </div>
                                    <div class="hashtagComponents__description">
                                        {{ Hlist.description }}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="submit">
                        <div class="btn">Submit</div>
                    </div>
                </div>
                
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
import Card from '@/components/CardforAsk.vue';
import VueFroala from 'vue-froala-wysiwyg';

import { realpathSync } from 'fs';
export default {
    name: 'AskQuestion',
    props: {
        askQuestion : {type: Boolean, default: false},
    },
    components: {
        Card,
    },
    data() {
        return{
            cardLists: [],
            hashtagLists: [],
            config: {
                events: {
                initialized: function () {
                    console.log('initialized')
                }
                }
            },
            model: '',
            inputTitle : '',
            inputHashtag: '',
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
        },
       
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
        checkContent() {
            return this.inputTitle + this.inputHashtag + this.inputCode + this.model
        }
    },
     mounted() {
        this.askquestion = false;
        this.cardLists = [{
                    id: '1',
                    cardInfo:
                        {
                            Answer : '100',
                            View : '1000',
                            Helpful : '10000',
                        },

                    cardMain:
                        {
                            Title : 'Title Test - 1',
                            Content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry'
                        },
                }],
        this.model = "1. 문제가 생긴 부분에 대한 요약 <br> 2. 문제 해결을 위해 당신이 시도한 것 들에 대한 설명 <br> 3. 오류 메시지를 포함하여 예상 결과 및 실제 결과 설명",
        this.hashtagLists = [
            {
                title: 'C++',
                description: 'C++ 에 대한 설명이 들어갈 부분입니다.'
            },
            {
                title: 'Java',
                description: 'java에 대한 설명이 들어갈 부분입니다.'
            },
            {
                title: 'C++',
                description: 'C++ 에 대한 설명이 들어갈 부분입니다.'
            },
            {
                title: 'Java',
                description: 'java에 대한 설명이 들어갈 부분입니다.'
            },
            {
                title: 'C++',
                description: 'C++ 에 대한 설명이 들어갈 부분입니다.'
            },
            {
                title: 'Java',
                description: 'java에 대한 설명이 들어갈 부분입니다.'
            },
            {
                title: 'C++',
                description: 'C++ 에 대한 설명이 들어갈 부분입니다.'
            },
            {
                title: 'Java',
                description: 'java에 대한 설명이 들어갈 부분입니다.'
            },
        ]
    },
    
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
    margin-top: var(--space-sm);
    width: 100%;
    margin-bottom: var(--space-md);
}

.inputQuestion {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-right: var(--space-md);

    &__form {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 538px;
    }
}

label {
    margin: var(--space-md);
}

.questionForm {
    width: 100%;
    padding: var(--space-xxs);
    border: 1px solid var(--color-contrast-low);
    border-radius: var(--radius-lg);
}

.searchtitle {
    visibility: hidden;
    opacity: 0;
    height: 0;
    position: relative;
    width: 100%;
    transition: visibility 0s, opacity .5s linear;

    margin-top: var(--space-xs);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-contrast-low);
    background-color: var(--color-surface-lighter);
    padding-bottom: var(--space-xxs);
    
    &__head {
        width:100%;
        color: var(--color-on-surface-darker);
        padding: var(--space-xxs);
        border-top-left-radius: var(--radius-lg);
        border-top-right-radius: var(--radius-lg);
        background-color: var(--color-surface-darker);
    }

    &__content {
        width:100%;
        color: var(--color-on-surface);
        padding: var(--space-xxs);
    }
}

.openSearchBox ~ .searchtitle {
    height: auto;
    visibility: visible;
    opacity: 1;
}

.searchHashtag {
    visibility: hidden;
    opacity: 0;
    height: 0;
    position: relative;
    width: 100%;
    transition: visibility 0s, opacity .5s linear;

    margin-top: var(--space-xs);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-contrast-low);
    background-color: var(--color-surface-lighter);
    
    &__head {
        width:100%;
        color: var(--color-on-surface-darker);
        padding: var(--space-xxs);
        border-top-left-radius: var(--radius-lg);
        border-top-right-radius: var(--radius-lg);
        background-color: var(--color-surface-darker);
    }

    &__content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        color: var(--color-on-surface);
        padding: var(--space-xxs);
    }

    &__form {
        width: 30%;
    }

    &__form:hover {
        cursor: pointer;
        background-color: alpha(var(--color-secondary), 0.2);
    }
}

.openSearchBox ~ .searchHashtag {
    height: auto;
    visibility: visible;
    opacity: 1;
}

.hashtagComponents {
    height: 150px;
    padding: var(--space-xs);
}

.sub {
    display: flex;
    flex-direction: column;
}

.sub-Box {
    width: 200px;
    border: 1px dashed var(--color-contrast-high);
    border-radius: var(--radius-md);
    background-color: alpha(var(--color-surface-lighter), 1);
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

.submit {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: var(--space-md);
}

</style>

