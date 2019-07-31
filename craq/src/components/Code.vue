<template>
    <div>
      <div class="filler">

          <!-- Headline -->
          <div class="headline">
            {{currentRouteName}}
          </div> <!-- headline -->

           <!-- Filter && Card -->
          <div class="subnav">
            <div class="subnav__filter">
              <div class="btn btn--sm" :class="{'subnav__filter-seleted': latested}">Latest</div>
              <div class="btn btn--sm">Reliable</div>
              <div class="btn btn--sm">Helpful</div>
              <div class="btn btn--sm">Answer</div>
              <div class="btn btn--sm">View</div>
            </div>
            <div class="filter__ask">
              <router-link to="/askquestion"><div class="btn btn--md btn--primary" @click="askQuestion">Ask Question</div></router-link>
            </div>
          </div> <!-- Filter /div -->


          <div v-for="list in cardLists" class="content">
            
            <card class="shadow" :list="list"/>
            
          </div>
          
           
          <!-- Pagenation -->
          <div class="pagenation">
            <ul v-for="(i, index) in (1,11)">
              <li>{{index}}</li>
            </ul>
          </div>  <!-- pagenation -->
        
        </div> <!-- Container /div -->
      </div>  <!-- Filler -->
</template>

<script>
import Card from '@/components/Card.vue';
import Ask from '@/components/AskQuestion.vue';

export default {
    name: "User",
    components: {
      Card,
      Ask,
    },
    data() {
      return {
        messages: '',
        latested: true,
        cardLists: [],
      }
    },
    
    mounted() {
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
                            HashTags :'asd',
                            Created_at : '2019.07.26',
                            Updated_at : '2019.07.26',
                            Answered_at : '2019.07.26',
                        },

                    answerUser: 
                        {
                            Img : '',
                            Name: 'Kim',
                            Mail: 'aaa@test.test',
                            Score: '2300',
                            Answers: '23',
                        }
                },
                {
                    id: '2',
                    cardInfo: 
                        {
                            Answer : '0',
                            View : '10',
                            Helpful : '200',
                        },

                    cardMain: 
                        {
                            Title : 'Title Test - 2',
                            HashTags : 'asd',
                            Created_at : '2019.07.26',
                            Updated_at : '2019.07.26',
                            Answered_at : '2019.07.26',
                        },

                    answerUser: 
                        {
                            Img : '',
                            Name: '',
                            Mail: '',
                            Score: '',
                            Answers: '',
                        }

                },
                {
                    id: '3',
                    cardInfo: 
                        {
                            Answer : '23',
                            View : '230',
                            Helpful : '-100',
                        },

                    cardMain: 
                        {
                            Title : 'Title Test - 3',
                            HashTags :'asd',
                            Created_at : '2019.07.26',
                            Updated_at : '2019.07.26',
                            Answered_at : '2019.07.26',
                        },

                    answerUser: 
                        {
                            Img : '',
                            Name: 'Lee',
                            Mail: 'bbbb@test.test',
                            Score: '135135',
                            Answers: '123123',
                        }

                },
                {
                    id: '4',
                    cardInfo: 
                        {
                            Answer : '0',
                            View : '230',
                            Helpful : '-100',
                        },

                    cardMain: 
                        {
                            Title : 'Title Test - 3',
                            HashTags :'asd',
                            Created_at : '2019.07.26',
                            Updated_at : '2019.07.26',
                            Answered_at : '2019.07.26',
                        },

                    answerUser: 
                        {
                            Img : '',
                            Name: 'Lee',
                            Mail: 'bbbb@test.test',
                            Score: '135135',
                            Answers: '123123',
                        }

                }
                ]
    },
    methods: {
      askQuestion : function() {
      this.$router.push({name:'askquestion'});
      this.askquestion = true;
      },
      parentsMethod: function(askquestion) {
      this.askquestion = askquestion // 자식으로 부터받은 메시지를 사용
      }
    },
    computed: {
      currentRouteName() {
        console.log(this.$route.name);
        return this.$route.name;
      },
    }
}

</script>

<style scoped lang="scss">
// Test End
.filler {
  height: 1000px;
  width: auto;
  background-color: var(--color-background);
}

.headline {
  background-color: var(--color-surface);
  padding: var(--space-xs);
  width: 100%;
  height: 75px;
  font-size: var(--text-xxl);
  text-transform: capitalize;
}

.pagenation {
  display: flex;
  justify-content: center;
  background-color: var(--color-surface);
  margin-top: var(--space-lg);
  width: 100%;
  height: 30px;
  font-size: var(--text-lg)
}

.pagenation ul li{
  display: inline;
}

.subnav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-surface);
  width: 100%;
  font-size: 20px;
  padding-left: 20px;
  padding-right: 20px;
  
    &__filter {
      background-color: var(--color-surface);
      color: var(--color-on-surface);
    }
    &__filter-seleted {
      background-color: var(--color-primary);
      color: var(--color-on-primary)
    }
}

.btn {
  color: #ffffff;
  background-color: var(--color-primary-dark);
  margin: var(--space-xxs); 
}

.btn:hover {
  background-color: var(--color-primary-darker);
  color: var(--color-on-primary-light);
}

.shadow {
  box-shadow: var(--shadow-sm);
  width: 95%;
  border: 1px solid var(--color-contrast-low);
  margin-bottom: var(--space-md);
}

.content {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
