<template>
    <div class="container">
        <!-- Headline -->
        <div class="headline">
            Ask-Question
        </div> <!-- headline -->
       <!-- Body -->
       <div class="mainContent">
           
            <div class="inputQuestion">
                <div class="layout">
                <div class="inputQuestion__form">
                    <label for="title"><strong>Title</strong> - 제목을 입력시 유사한 질문을 표시해 줍니다.</label>
                    <input type="text" id="title" v-model="inputTitle" class="questionForm" placeholder="Enter a Title" :class="{'openSearchBox' : checkInputTitle}">
                    
                    <div class="searchtitle">

                        <div class="searchtitle__head">
                            <span>당신의 질문과 유사한 유형의 질문을 찾았습니다.</span>
                        </div>
                        
                        <div class="searchtitle__content">
                            <div v-for="list in cardLists" >
                                <router-link to='/'>
                                    <card :list="list"/>
                                </router-link>
                            </div>
                        </div>
                    </div>

                    <label for="content"><strong>content</strong> - 문제 해결을 위해 시도한 것들을 상세하게 작성해주십시오.</label>
                    <froala id="edit content" :tag="'textarea'" :config="config" v-model="inputContent"></froala>

                    <label for="hashtag"><strong>TagSearch</strong> - 태그를 검색합니다.</label>
                    <input type="text" id="hashtag" class="questionForm" v-model="inputHashtag" :class="{'openSearchHBox' : checkInputHashtag}"  @keydown.enter="createHashtags(inputHashtag)">

                    <div class="searchHashtag">
                        
                        <div class="searchHashtag__head">
                            <span>Similar HashTag Lists</span>
                        </div>
                        
                        <div class="searchHashtag__content">
                            
                            <div class="searchHashtag__form">
                                <div :key="idx" v-for="(tag, idx) in tags">
                                    <div @click="clickHashtags(tag)">
                                        <TagsCard class="tagsCard" :tag="tag" ></TagsCard>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                    <label for="mytag"><strong>Tags</strong> - 선택한 태그 목록입니다.</label>
                    <div id="mytag" class="tagsForm">
                        <div :key="idx" v-for="(tag, idx) in myTags">
                            <div class="btn btn--sm tagsForm__btn">
                                {{tag.Title}}&nbsp; <font-awesome-icon icon='times' @click="deleteTag(tag)"/>
                            </div>
                        </div>
                    </div>
                    <div class="submit">
                        <router-link to="/code"><div class="btn btn__submit btn--md" @click="createQuestions()">Submit</div></router-link>
                    </div>
                </div>
                
            </div>
</div>
            <div class="sub">
                <div class="sub-Box">
                    <h3 class="sub-Box__title">Hot HashTags</h3>
                    <div v-for="item in Hot" class="sub-Box__list">
                        <div class="btn">{{item}}</div>
                    </div>
                </div>
                <div class="sub-Box">
                    <h3 class="sub-Box__title">How To Use</h3>
                    <div v-for="item in FaQ" class="sub-Box__list">
                        <div>{{item}}</div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import Card from '@/components/CardforAsk.vue';
import TagsCard from '@/components/TagsCard.vue';
import VueFroala from 'vue-froala-wysiwyg';
import VueSimplemde from 'vue-simplemde';

export default {
    name: 'AskQuestion',
    components: {
        Card,
        TagsCard,
        VueSimplemde
    },
    data() {
        return{
            tagpk : '',
            tags: [],
            cardLists: [],
            tagLists: [],
            myTags: [],
            config: {
                events: {
                    initialized: function () {  
                        console.log('initialized')
                    },
                },
                width: '800'
            },
            inputContent: '',
            inputTitle : '',
            inputHashtag: '',
            inputTags: '',
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
        createQuestions() {
            const data = {
                "topic_id": 1,
                "article_id": 0,
                "beforeContent": 0,
                "title": this.inputTitle,
                "body": this.inputContent,
                "user_id": this.$session.get('userPk'),
                "tags": this.inputTags
                }
            this.$axios.post('contents', data).then(res=> {
                console.log(res.data)
            })
        },
    clickHashtags(clicktag) {
                if (!(this.inputTags.includes(clicktag.pk))) {
                    this.myTags.push({'pk':clicktag.pk, 'Title':clicktag.title})
                    this.inputTags = this.inputTags + "," + clicktag.pk
                } else {
                    alert("이미 포함된 태그입니다.")
                }
            this.inputHashtag = ''
            this.tags = [] 
    },
    createHashtags(item) {
        const data = {
            'title' : this.inputHashtag, 
            'user_id' : this.$session.get('userPk'), 
        }
        this.$axios.post('tags',data).then(res => {
            if (!(this.inputTags.includes(res.data.data))) {
                    this.myTags.push({'pk':res.data.data, 'Title':item})
                    this.inputTags = this.inputTags + "," + res.data.data
                } else {
                    alert("이미 포함된 태그입니다.")
                }
                this.inputHashtag = ''
                this.tags = []   
            })
                 
    },
    
    deleteTag(tag) {
        this.tagLists
        this.myTags.pop(tag)
        this.inputTags = this.inputTags.replace(tag.pk, '')
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
        checkContent() {
            return this.inputTitle + this.inputHashtag + this.inputCode + this.inputContent + this.Code
        },
        
    },
     mounted() {
        
        this.$axios.get('tags').then(res=> {
           this.tagLists = res.data;
        })
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
        this.inputContent = "1. 문제가 생긴 부분에 대한 요약 <br> 2. 문제 해결을 위해 당신이 시도한 것 들에 대한 설명 <br> 3. 시도한 코드를 작성하십시오. <br> 4. 오류 메시지를 포함하여 예상 결과 및 실제 결과 설명 <br> ```<br>이곳에 코드를 작성하십시오.<br>```"
     },
    watch: {
        inputHashtag (a, b) {
            let temp = [];
            this.tagLists.forEach((tag) => {
                if (tag.title.toLowerCase().includes(a.toLowerCase())) {
                    temp.push(tag);
                }
                
                // if (tag.title.toLowerCase().includes(a.toLowerCase())  && a != '') {
                //     if (!(this.tags.includes(tag))) {
                //         this.tags.push(tag)
                //     } 
                // } 
                // if (!(tag.title.toLowerCase().includes(a.toLowerCase()))) {
                //     let temp = []
                //     if (this.tags.includes(tag)) {
                //         this.tags.pop(tag)
                //     } 
                // };
                // if (a === '') {
                //     this.tags = []
                // }
            })
        this.tags = temp;
        },

    }
    
}
</script>

<style scoped lang="scss">
@import '~simplemde/dist/simplemde.min.css';
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
    padding-top: var(--space-xl);
    padding-bottom: var(--space-xl);
    background-color: var(--color-surface);
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
        flex-wrap: wrap;
        align-items: center;
        width: 800px;
    }
}
.layout {
    box-shadow: var(--shadow-sm);
    border-radius: var(--radius-sm);
    background-color: var(--color-surface-light);
    padding: var(--space-xl) var(--space-md);
}

label {
    margin: var(--space-md);
}

strong {
    font-size: var(--text-md);
}

.questionForm {
    width: 100%;
    padding: var(--space-xxs);
    border: 1px solid var(--color-contrast-low);
    border-radius: var(--radius-lg);
}

.tagsForm {
    display: flex;
    flex-wrap: wrap;
    align-content: center;

    width: 100%;
    height: 40px;
    padding: var(--space-xxs);

    background-color: var(--color-surface);
    border: 1px solid var(--color-contrast-low);
    border-radius: var(--radius-lg);

    &__btn {
        margin-right: var(--space-xxs); 
    }
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
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;

        padding: var(--space-md);
        display: flex;
        flex-wrap: wrap;
        width: 100%;
    }
}

.openSearchHBox ~ .searchHashtag {
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
    color: var(--color-black);
    box-shadow: none;
    
    &__submit{
        background-color: var(--color-primary-dark);
        color: var(--color-white);
    }
}

.btn:hover {
    background-color: var(--color-tertiary-light);
    color: var(--color-black);
}

.submit {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: var(--space-md);
}

.tagsCard {
    margin: var(--space-sm);
}
</style>

