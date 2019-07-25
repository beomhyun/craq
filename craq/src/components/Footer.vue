<template>
    <footer class="main-footer padding-y-lg">
        <div class="container max-width-lg">

            <div class="main-footer__colophon">

                <div class="main-footer__colophon-nav">
                    <span>&copy; myWebsite</span>
                    <button @click="showModal=true">&nbsp; Contact Us</button>
                    
                    <mailModal v-bind:show="showModal" @close="closeModal"></mailModal>
                </div>

                <!-- DropDown Test -->
                <div @click="toggle" class="dropdowns" :class="{'open' : config.open == true}">
                  {{this.config.placeholder}}
                  <ul class="dropdowns-menu" v-for="option in config.menus">
                    <a :href="option.urls" target="_blank"><li @mouseover="config.placeholder = option.title">{{option.title}}</li></a>
                  </ul>
                </div>

              </div>

            </div>
            
        </div>
    </footer>
</template>


<script>
import mailModal from '@/components/ContactUs.vue';

export default {
    name: "Footer",
    components: {
      mailModal,
    },
    data() {
    return {
      showModal: false,
      config: {
        menus: [
          {
            title : '에듀싸피',
            urls:'https://edu.ssafy.com/'
          },
          {
            title : '지라',
            urls:'https://jira.ssafy.com/'
          },
          {
            title : '깃랩',
            urls:'https://lab.ssafy.com/'
          },
          {
            title : '프로젝트',
            urls:'https://project.ssafy.com/'
          },
        ],
        open: false,
        placeholder: "SiteMap",
      }
    }
  },
  methods: {
    setNewSelectedOption(selectedOption) {
      this.config.placeholder = selectedOption.value;
    },
    toggle() {
      console.log(this.open)
      this.config.open = !this.config.open
    },
    closeModal() {
            console.log('clicked');
            this.showModal = false;
        },
  },
  computed: {

  }
}

</script>


<style lang="scss" scoped>
// dropdown test
.dropdowns {
  position: relative;
  width: 100px;
  height: 30px;
  background-color: var(--color-background-lighter);

}

.open .dropdowns-menu {
  display: block;
}
.dropdowns-menu {
  position: relative;
  text-align: center;
  width: 100px;
  top:-105px;
  display: none;
  background-color: var(--color-secondary);
}

.dropdowns-menu li:hover {
  background-color: var(--color-surface);
}



// colophon
.main-footer__colophon {
    border-top: 1px solid var(--color-contrast-low);
    padding-top: var(--space-xxxs);
    margin-top: var(--space-md);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
}

.main-footer__colophon-nav {
    font-size: var(--text-sm);
    color: var(--color-contrast-medium);
    margin-right: var(--space-sm);

    a {
        color: inherit;
        &:hover {
            color: var(--color-contrast-high);
        }
    }

}


</style>
