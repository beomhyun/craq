<template>
    <div class="card" :class="{'badquestion' :  list.cardInfo.Helpful*1 < 0}">
        <div class="info">
            <div class="info__column-left">
                <p>Answer</p>
                <p>View</p>
                <p>Helpful</p>
            </div>
            <div class="info__column-right">
                <p>{{list.cardInfo.Answer}}</p>
                <p>{{list.cardInfo.View}}</p>
                <p>{{list.cardInfo.Helpful}}</p>
            </div>
        </div>

        <div class="main">
            <div class="main__title"><h4> {{list.cardMain.Title}} </h4></div>
            <div class="main__hashtag">
                <div class="btn btn--sm">{{list.cardMain.HashTags}}</div>
  
            </div>
            <div>{{list.cardMain.Created_at}}| {{list.cardMain.Updated_at}} | {{list.cardMain.Answered_at}}</div>
        </div>
        
        <div :class="{'none' : list.cardInfo.Answer === '0'}">
            <div class="user" >
                <div class="user__top">
                    <div class="user__image">
                        <img :src="list.answerUser.img" alt="img">
                    </div>
                    <div  class="user__name">
                        <h4>{{list.answerUser.Name}}</h4>
                        <p>{{list.answerUser.Mail}}</p>
                    </div>
                </div>
                

                <div class="user__bottom">
                    <div class="user__bottom-left">
                        <p>Score</p>
                        <p>Answers</p>
                    </div>
                    <div class="user__bottom__right">
                        <p>{{list.answerUser.Score}}</p>
                        <p>{{list.answerUser.Answers}}</p>
                    </div>
                </div>

                <div class="user__card">
                    <div class="user__card__title">
                        No Answer
                    </div>
                    <div class="user__card__content">
                        This question dosen`t have Answer.<br> please answer
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Card',
    props: [
        'list'
    ],
    data() {
        return {
   
        }
    },
   
}
</script>

<style  lang="scss" scoped>
$--card-main-height: 120px;
    .badquestion {
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
        
    }
    .none .user {
        width: 200px;
        height: 100%;
        padding: var(--space-xs);
        background-color: alpha(var(--color-accent), 0.3);

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
            width: 200px;
            height: 100%;
            padding: var(--space-xs);
            background-color: alpha(var(--color-primary-light), 0.2);
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
    }
</style>


