<template>
    <div>
      <div class="filler">

          <!-- Headline -->
          <div class="headline">
            <div class="headline__title">{{currentRouteName}}</div>
            <router-link to="/askquestion"><div class="btn btn--primary" @click="askQuestion">Ask Question</div></router-link>
          </div> <!-- headline -->

          <!-- Filter && Card -->
          <div class="Code">
            <div class="Code__filter">
              <div class="Code__filter-btn" @click="toggleLatest" :class="{'selected' : setLatest}">Latest</div>
              <div class="Code__filter-btn" @click="toggleReliable" :class="{'selected' : setReliable}">Reliable</div>
              <div class="Code__filter-btn" @click="toggleHelpful" :class="{'selected' : setHelpful}">Helpful</div>
              <div class="Code__filter-btn" @click="toggleAnswer" :class="{'selected' : setAnswer}">Answer</div>
              <div class="Code__filter-btn" @click="toggleView" :class="{'selected' : setView}">View</div>
            </div>  <!-- Filter /div -->

            <div class="Code__list" v-show="setLatest">
              <div :key="idx" v-for="(list, idx) in askData" class="content">
                <router-link :to="{ name: 'Questions', params: { question_pk : list.PK}}">
                  <card class="shadow" :list="list"/>
                </router-link>
              </div>
            </div>
            <div class="Code__list" v-show="setReliable">
              <div :key="idx" v-for="(list, idx) in askData" class="content">
                <router-link to="/code/1" >
                  <card class="shadow" :list="list"/>
                </router-link>
              </div>
            </div>
            <div class="Code__list" v-show="setHelpful">
              <div :key="idx" v-for="(list, idx) in askData" class="content">
                <router-link to="/code/1" >
                  <card class="shadow" :list="list"/>
                </router-link>
              </div>
            </div>
            <div class="Code__list" v-show="setAnswer">
              <div :key="idx" v-for="(list, idx) in askData" class="content">
                <router-link to="/code/1" >
                  <card class="shadow" :list="list"/>
                </router-link>
              </div>
            </div>
            <div class="Code__list" v-show="setView">
              <div :key="idx" v-for="(list, idx) in askData" class="content">
                <router-link :to="{ name: 'Questions', params: { pk : list.pk}}" >
                  <card class="shadow" :list="list"/>
                </router-link>
              </div>
            </div>

          </div>
          
          
           
          <!-- Pagenation -->
          <div class="pagenation">
            <router-link to="/code">
              <font-awesome-icon icon="chevron-left"/>
              <font-awesome-icon icon="chevron-left"/>
            </router-link>

            &nbsp; &nbsp;

            <router-link to="/code"><font-awesome-icon icon="chevron-left"/></router-link>
            &nbsp;
            <ul :key="idx" v-for="(i, idx) in max_page">
              &nbsp;<li><router-link to="/code">{{i}}</router-link></li>&nbsp;
            </ul>
            
            &nbsp;
            <router-link to="/code"><font-awesome-icon icon="chevron-right"/></router-link>

            &nbsp; &nbsp;

            <router-link to="/code">
              <font-awesome-icon icon="chevron-right"/>
              <font-awesome-icon icon="chevron-right"/>
            </router-link>
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
        carddata : '',
        messages: '',
        latested: true,
        setLatest : true,
        setReliable : false,
        setHelpful : false,
        setAnswer : false,
        setView : false,

        askData:  [],
        max_page : 0,
        nowpage: 0,
      }
    },
  
    mounted() {
      
      this.$axios.get('questions/all/1?order_by=PK').then(res=> {
            this.max_page = res.data.max_page
            this.nowpage = res.data.nowpage
            this.askData = res.data.data
            
        })
    },
    methods: {
      askQuestion : function() {
      this.$router.push({name:'askquestion'});
      this.askquestion = true;
      },
      parentsMethod: function(askquestion) {
      this.askquestion = askquestion // 자식으로 부터받은 메시지를 사용
      },
      toggleLatest() {
            if ( this.setLatest == false ) {
                this.setLatest = true;
                this.setReliable = false;
                this.setHelpful = false;
                this.setAnswer = false;
                this.setView = false;
            }
        },
      toggleReliable() {
            if ( this.setReliable == false ) {
                this.setLatest = false;
                this.setReliable = true;
                this.setHelpful = false;
                this.setAnswer = false;
                this.setView = false;
            }
        },
      toggleHelpful() {
            if ( this.setHelpful == false ) {
                this.setLatest = false;
                this.setReliable = false;
                this.setHelpful = true;
                this.setAnswer = false;
                this.setView = false;
            }
        },
      toggleAnswer() {
            if ( this.setAnswer == false ) {
                this.setLatest = false;
                this.setReliable = false;
                this.setHelpful = false;
                this.setAnswer = true;
                this.setView = false;
            }
        },
      toggleView() {
            if ( this.setView == false ) {
                this.setLatest = false;
                this.setReliable = false;
                this.setHelpful = false;
                this.setAnswer = false;
                this.setView = true;
            }
        },
        
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
  width: auto;
  background-color: var(--color-background);
}

.headline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 75px;

  padding: var(--space-md);
    &__title {
      background-color: var(--color-surface);
      font-size: var(--text-xxl);
      text-transform: capitalize;
    }
}

.pagenation {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-surface);
  margin-top: var(--space-sm);
  width: 100%;
  height: 30px;
  font-size: var(--text-lg)
}

.pagenation ul li{
  display: inline;
}


.btn {
   cursor: pointer;
    width: 130px;
    height: 45px;

    display: flex;
    justify-content: center;
    align-items: center;

}

.btn:hover {
  background-color: var(--color-primary-darker);
  color: var(--color-on-primary-light);
}

.shadow {
  box-shadow: var(--shadow-sm);
  width: 100%;
  border: 1px solid var(--color-contrast-low);
  margin-bottom: var(--space-sm);
}

.content {
  width: 100%;
}

.Code {
    user-select: none;
    display: flex;
    flex-direction: column;
    
    width: 100%;
    height: auto;
    background-color: var(--color-surface-light);
    padding: var(--space-md);

    &__filter {
        display: flex;

        &-btn {
            cursor: pointer;
            width: 130px;
            height: 45px;

            display: flex;
            justify-content: center;
            align-items: center;
            font-size: var(--text-md);
            color: var(--color-contrast-high);            

            border-radius: var(--radius-sm);

            background-color: var(--color-surface-dark);
            margin-right: var(--space-sm);
        }
    }

    &__list {
        display: flex;
        flex-direction: column;
        align-items: center;

        position: relative;
        top: -3px;

        width: 100%;
        height: 100%;
        background-color: var(--color-surface);

        border-bottom-left-radius:  var(--radius-sm);
        border-bottom-right-radius:  var(--radius-sm);
        border-top: 3px solid var(--color-tertiary);

        padding: var(--space-md);
    }
}

.Code__filter .selected {
    
    cursor: pointer;

    border-top: 3px solid var(--color-tertiary);
    border-left: 3px solid var(--color-tertiary);
    border-right: 3px solid var(--color-tertiary);
    color: var(--color-on-surface);
    font-weight: bold;
    background-color: var(--color-surface);

    z-index: 1;
}
</style>
