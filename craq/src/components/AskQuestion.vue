<template>
    <div class="container">
        <!-- Headline -->
        <div class="headline" v-if="this.$route.params.askQuestion">
            Ask-Question
        </div> <!-- headline -->
        <div class="headline" v-if="this.$route.params.editQuestion">
            Edit Question
        </div> <!-- headline -->


       <!-- Body -->
       <div class="mainContent">
           
            <div class="inputQuestion">
                <div class="layout">
                <div class="inputQuestion__form">
                    <label for="title"><strong>Title</strong> - 제목을 입력시 유사한 질문을 표시해 줍니다.</label>
                    <input type="text" id="title" v-model="inputTitle" class="questionForm" placeholder="Enter a Title" :class="{'openSearchBox' : inputTitle}">
                    
                    <div class="searchtitle" v-if="!questionData">

                        <div class="searchtitle__head">
                            <span>Similar Questions List</span>
                        </div>
                        
                        <div class="searchtitle__content">
                            <div :key="idx" v-for="(list, idx) in cardLists" >
                                <router-link to='/'>
                                    <CardAsk :list="list" />
                                </router-link>
                            </div>
                        </div>
                    </div>

                    <label for="content"><strong>content</strong> - 문제 해결을 위해 시도한 것들을 상세하게 작성해주십시오.</label>
                    <froala id="edit content" :tag="'textarea'" :config="config" v-model="inputContent"></froala>

                    <label for="hashtag"><strong>TagSearch</strong> - 태그를 검색합니다.</label>
                    <input type="text" id="hashtag" class="questionForm" v-model="inputHashtag" :class="{'openSearchHBox' : inputHashtag}"  @keydown.enter="createHashtags(inputHashtag)">

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
                        <div class="submit-create">
                            <div class="btn btn__submit btn--md" v-if="this.$route.params.askQuestion" @click="createQuestions()">Submit</div>
                        </div>
                        <div class="submit-edit" v-if="this.$route.params.editQuestion">
                            <router-link to="/code"><div class="btn btn__edit btn--md" @click="editQuestions()">{{inputTags}}Edit</div></router-link>
                        </div>
                    </div>
                    
                </div>
                
            </div>
</div>
            <div class="sub">
                <div class="sub-Box">
                    <h3 class="sub-Box__title">Hot HashTags</h3>
                    <div :key="idx" v-for="(item, idx) in Hot" class="sub-Box__list">
                        <div class="btn">{{item.TITLE}}</div>
                    </div>
                </div>
                <div class="sub-Box">
                    <h3 class="sub-Box__title">How To Use</h3>
                    <div :key="idx" v-for="(item, idx) in FaQ" class="sub-Box__list">
                        <div>{{item}}</div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import CardAsk from '@/components/CardAsk.vue';
import TagsCard from '@/components/TagsCard.vue';
import VueFroala from 'vue-froala-wysiwyg';
import VueSimplemde from 'vue-simplemde';
import Paginator from '@/components/Paginator.vue';

export default {
    name: 'AskQuestion',
    components: {
        CardAsk,
        TagsCard,
        VueSimplemde
    },
    props : [
        'editQuestion',
        'questionData'
    ],
    data() {
        return{
            cardLists: [],

            // 모든 tag의 정보를 불러옵니다.
            tagLists: [],
            // 검색된 tag의 정보를 저장해두는 곳입니다.
            tags: [],
            // 유저가 선택한 tag를 저장하는 곳입니다. 질문 작성 or 수정 페이지에서 보여줄 해시태그 정보를 저장하고 있습니다.
            myTags: [],
            // 글이 생성되거나 수정될 때 넘겨줄 tag PK를 저장하는 곳입니다.
            inputTags: '',
            // 현재 작성중인 tag 입니다.
            inputHashtag: '',

            
            // 현재 작성중이며, 생성 및 수정시 넘겨줄 데이터를 저장하는 곳입니다.
            inputContent: '',
            inputTitle : '',
            
            // SideBar Data
            Hot: [],
            FaQ: [
                '해시태그 작성 가이드',
                '질문 작성 방법',
                '팁과 정보'
            ],

            // Text Editor Config
            config: {
                events: {
                    initialized: function () {  
                    },
                },
                width: '800'
            },
        }
    },
    methods: {
        createQuestions() {
            if (this.inputTitle.length == 0) {
                alert("제목은 반드시 작성하셔야 합니다.")
            }
            if (this.inputContent.length == 0) {
                alert("내용은 반드시 작성하셔야 합니다.")
            }
            if (this.inputTags.length == 0) {
                alert("태그는 1개 이상 작성하여야 합니다.")
            }
            if (this.inputTags.length > 0 ){
                if(this.inputTags.length > 0) { 
                    if(this.inputContent.length > 0) {
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
                            this.$router.push({
                            "name": "code"
                            })
                        })
            
                    }
                }
            } 
        },
        editQuestions() {
            if (this.inputTitle.length == 0) {
                alert("제목은 반드시 작성하셔야 합니다.")
            }
            if (this.inputContent.length == 0) {
                alert("내용은 반드시 작성하셔야 합니다.")
            }
            if (this.inputTags.length == 0) {
                alert("태그는 1개 이상 작성하여야 합니다.")
            }
            if (this.inputTags.length > 0) {
                if (this.inputTags.length > 0) {
                    if (this.inputContent.length > 0) {
                        const editdata = {
                            "topic_id": 1,
                            "article_id": this.questionData.QUESTION[0].PK,
                            "beforeContent": this.questionData.VERSION[this.questionData.current].VERSION,
                            "title": this.inputTitle,
                            "body": this.inputContent,
                            "user_id": this.$session.get('userPk'),
                            "tags": this.inputTags
                            }
                            console.log(editdata.tags)
                            console.log("뭐가문제냐고옴ㄴ어ㅗㅁ뉴라ㅈ듓ㅁ닉ㅇ루ㅂㄷ미ㅓㅠㄹ마ㅓ뉴")
                        this.$axios.post('contents', editdata).then(res=> {
                            console.log(editdata)
                            console.log(res.data)
                            this.$router.push({
                                "name": "Questions",
                                params : {
                                    question_pk : this.questionData.QUESTION[0].PK
                                }
                            })
                        })
                    }    
                }
            }
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
        if ( this.inputHashtag.length == 0) {
            alert("최소 1글자 이상 입력하여야 합니다.")
        } 
        if ( this.inputHashtag.length > 0) {
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
        }
    },
    
    deleteTag(tag) {
        this.myTags.pop(tag)
        this.inputTags = this.inputTags.replace(tag.pk, '')
        this.inputTags = this.inputTags.replace(",", '')
        console.log(this.inputTags)
        }
    },
    computed: {

         currentRouteName() {
            return this.$route.name;
        },
        checkContent() {
            return this.inputTitle + this.inputHashtag + this.inputCode + this.inputContent + this.Code
        },
        
    },
     mounted() {
        if (this.questionData) {
            console.log(this.questionData)
            const getData = this.questionData.VERSION[this.questionData.current]
            this.inputTitle = getData.TITLE
            this.inputContent = getData.BODY
            this.$axios.get(`hashtags/contents/${getData.PK}`).then(res=> {
                for (let el in res.data) {
                    this.inputTags = this.inputTags + "," + res.data[el].PK
                    console.log(this.inputTags)
                    this.myTags.push({'pk':res.data[el].PK, 'Title':res.data[el].TITLE})
                }
                })
        }
        this.$axios.get('tags/weekly/topten').then(res => {
            this.Hot = res.data.data
        })
        this.$axios.get('tags').then(res=> {
           this.tagLists = res.data;
        })
        if (!this.questionData) {
            this.inputContent = "1. 문제가 생긴 부분에 대한 요약 <br> 2. 문제 해결을 위해 당신이 시도한 것 들에 대한 설명 <br> 3. 시도한 코드를 작성하십시오. <br> 4. 오류 메시지를 포함하여 예상 결과 및 실제 결과 설명 <br> ```<br>이곳에 코드를 작성하십시오.<br>```"
        }
     },
    watch: {
        
        inputHashtag (a, b) {
            let temp = [];
            this.tagLists.forEach((tag) => {
                if (tag.title.toLowerCase().includes(a.toLowerCase())) {
                    temp.push(tag);
                }
            })
        this.tags = temp;
        },

        inputTitle (newVal, oldVal) {
            let temp = [];
            this.$axios.get('questions/search?search_text=' + newVal).then(res => {
                this.cardLists = res.data.data.slice(0,10)
            })
        }
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

    &__edit {
        background-color: var(--color-white);
        border: 1px solid var(--color-tertiary);
        color: var(--color-tertiary); 
    }

    
}

.btn:hover {
    background-color: var(--color-tertiary-light);
    color: var(--color-black);
}

.btn__submit:hover {
        background-color: var(--color-white);
        color: var(--color-primary-dark);
        border: 1px solid var(--color-primary-dark)
    }

.btn__edit:hover {
    background-color: var(--color-tertiary-light);
    border: 1px solid var(--color-tertiary-light);
    color: var(--color-white);
}

.submit {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: var(--space-md);

    &-create {
            margin-right: var(--space-md);
        }

    &-edit {
        margin-right: var(--space-md);
    }
    
}

.tagsCard {
    margin: var(--space-sm);
}
</style>

