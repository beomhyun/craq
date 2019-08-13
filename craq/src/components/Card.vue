<template>
    <div class="card" :class="{'badquestion' :  list.HELPFUL*1 < 0}">
        <div class="info">
            <div class="info__column-left">
                <p>Answer</p>
                <p>View</p>
                <p>Helpful</p>
            </div>
            <div class="info__column-right">
                <p>{{0 + list.ANSWERS}}</p>
                <p>{{0 + list.VIEWS}}</p>
                <p>{{0 + list.HELPFUL}}</p>
            </div>
        </div>

        <div class="main">
            <div class="main__title" @click="routerPush"><h4><VClamp autoresize :max-lines="1"> {{list.TITLE}} </VClamp> </h4></div>
            
            <div class="main__hashtag">
                
                
                <span :key="tag" v-for="(tag) in list.HASHTAG.split(',')">
                    <span  class="btn btn--sm btn--tag taglist" @click.left.exact="goSearch(tag)" @click.shift.left.exact="shiftClick(tag)">
                        <VClamp autoresize :max-lines="1">{{tag}} </VClamp>
                    </span>
                </span>
                
            </div>
            
            <div>{{list.ASKED_TIME | formatDate}}</div>
        </div>
        <div class="user">
            <div v-if="list.ANSWER_USERPK" v-show="list.ANSWER_USERPK">
                <UserCard v-bind="$props"/>
            </div>
            <div v-show="!list.ANSWER_USERPK">
                <div class="noneSelected">
                    <div class="noneSelected__title">
                        채택된 답변이 없습니다.
                    </div>
                    <div class="noneSelected__content">
                        답변을 작성해 질문자에게 도움이 되어 주세요!
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import UserCard from '@/components/UserCard.vue';
import VClamp from 'vue-clamp';

export default {
    name: 'Card',
    components: {
        UserCard,
        VClamp
    },
    props: [
        'list',
    ],
    data() {
        return {
        }
    }, 
    methods: {
        shiftClick: function(tag) {
            console.log(this.$route.query);
            console.log(tag);
            if (this.$route.query.search_text.includes(encodeURIComponent('['+tag.trim()+']'))) {
                    return;
            }
            this.$router.push({
                name: 'code',
                query: {
                    'order_by': this.$route.query.order_by,
                    'page': this.$route.query.page,
                    'search_text': this.$route.query.search_text + '[' + tag.trim()+ ']'
                }
            })
        },
        routerPush: function() {
            this.$router.push({
                "name": "Questions",
                "params": {
                    question_pk: this.list.PK
                }
            }) 
        },
        goSearch: function(tag) {
            this.$router.push({
                name:'code',
                query: {
                    'order_by': 'PK',
                    'page': 1,
                    'search_text': '['+ tag.trim() + ']'
                }
            })
        }
    }
}
</script>

<style  lang="scss" scoped>
$--card-main-height: 120px;
    .badquestion {
        user-select: none;
        width: 100%;
        height: 120px;
        color: alpha(var(--color-on-surface), 0.2) !important;
        
    }
    .badquestion p{
        color: alpha(var(--color-on-surface), 0.2) !important;
    }
    .badquestion h4{
        color: alpha(var(--color-on-surface), 0.2) !important;
    }
    .badquestion:hover {
        background-color: alpha(var(--color-accent-dark), 0.2) !important;
    }

    .badquestion .btn{
        background-color: alpha(var(--color-tertiary), 0.4);
    }
    .card {
        user-select: none;
        border-radius: calc(var(--radius, 0.25em));
        display: flex;
        justify-content: space-between;
        background-color:var(--color-surface-light);
        color:var(--color-on-surface);
        margin-top: var(--space-xxxs);
        width: 100%;
        height: 120px;
    }

    .card:hover {
        background-color: var(--color-surface-dark);
    }

    .info {
        display: flex;
        justify-content: space-between;
        width: 140px;
        padding: var(--space-md);
        padding-right: var(--space-xxs); 

            &__column-right {
                display: flex;
                justify-content: space-between;
                text-align: end;
                flex-direction: column;
                color: var(--color-on-surface-lighter);
                }

            &__column-left {
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                color: var(--color-on-surface-lighter);
                font-weight: bold;
                }
        }

    .main {
        flex: 1;
        padding: var(--space-xxs);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;

        &__title {
            font-size: calc(#{$--card-main-height} * 0.2);   
        }

        &__title:hover {
            cursor: pointer;
        }

        &__hashtag {
            height: 30px;
            overflow: hidden;
        }
        
    }
    .none .user {
        width: 300px;
        height: 100%;

            &__top {
                    display: none;
                }

            &__bottom {
                display: none;
            }

            &__image {
                display: none;
            }

            &__name {
                display: none;
            }

        &__card {
            display: flex;
            flex-direction: column;
            align-items: center;

            &__title{
                font-size: calc(#{$--card-main-height} * 0.2);   
            }
            &__content {
                text-align: center;
            }
        }
    }

    .user {
            width: 300px;
            height: 100%;
                &__top {
                    display: flex;
                    font-weight: bold;
                }

                &__bottom {
                    display: flex;
                    justify-content: space-between;
                    margin-top: var(--space-xs);

                    &__right {
                        text-align: end;
                    }
                }

                &__image {
                    border-radius: 50%;
                    background-color: alpha(var(--color-surface-dark), 0.4);
                    width: 50px;
                    height: 50px;
                }

                &__name {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: auto;
                    margin: auto;
                }

                 &__card {
                    display: none;
                    flex-direction: column;
                    align-items: center;

                    &__title{
                        font-size: var(--card-main-height)
                    }
                 }
        }
    .btn {
        background-color: var(--color-tertiary);
        margin: var(--space-xxxs);
        color: var(--color-on-tertiary);
        box-shadow: unset;
        overflow: visible;
    }

.noneSelected {
    width: 300px;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding: var(--space-sm);
    background-color: alpha(var(--color-accent), 0.4);
    border: 1px solid var(--color-contrast-low);

    &__title {
        font-size: var(--text-lg);
        font-weight: bold;
    }

    &__content {
        text-align: center;
        margin-top: var(--space-xxs);
        padding-left: var(--space-md);
        padding-right: var(--space-md);
    }
}

.btn--tag:hover {
    background-color: var(--color-tertiary-dark);
}
.taglist {
    text-overflow: ellipsis;
}
</style>


