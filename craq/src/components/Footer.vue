<template>
    <footer class="main-footer padding-y-lg" >
        <div class="container max-width-lg">

            <div class="main-footer__colophon">

                <div class="main-footer__colophon-nav" >
                    <span>CRAQ &copy; 2019~</span>
                    <br>
                    <span @click="openModal" class="contact" style="font-size: 12px;">Contact Us</span>

                    <mailModal v-bind:show="showModal" @close="closeModal"></mailModal>
                </div>

                <!-- DropDown Test -->
                <div @click="toggle" class="dropdowns" :class="{'open' : config.open == true}">
                  SSAFY.Site &nbsp;
                  <ul class="dropdowns-menu" v-for="option in config.menus"  @mouseover="config.placeholder = option.title">
                    <a :href="option.urls" target="_blank">
                      <li>
                        <img :src="option.imag" alt="ssafy" style="width:20px; display:inline;">&nbsp; {{option.title}}
                        </li>
                      </a>
                  </ul>
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
            title : 'Edu',
            imag:'https://edu.ssafy.com/asset/images/logo.png',
            urls:'https://edu.ssafy.com/'
          },
          {
            title : 'Project',
            imag:'https://edu.ssafy.com/asset/images/logo.png',
            urls:'https://project.ssafy.com/'
          },
          {
            title : 'Jira',
            imag:'https://luna1.co/5ad265.png',
            urls:'https://jira.ssafy.com/'
          },
          {
            title : 'Lab',
            imag:'https://assets.gitlab-static.net/uploads/-/system/group/avatar/9970/logo-extra-whitespace.png',
            urls:'https://lab.ssafy.com/'
          },

        ],
        open: false,
      }
    }
  },
  methods: {
    setNewSelectedOption(selectedOption) {
      this.config.placeholder = selectedOption.value;
    },
    toggle() {
      console.log(this.open)
      this.config.open = !this.config.open;
    },
    openModal() {
      this.config.open = false;
      this.showModal = true;
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
// dropdown
.dropdowns {
  width: 150px;
  height: 50px;
  background-color: var(--color-surface);
  border-radius: calc(var(--radius, 0.25em)/2);
  padding: var(--space-sm);
  border: 1px solid var(--color-surface-dark);

}

.dropdowns:hover {
  box-shadow: var(--shadow-sm);
}

.open .dropdowns-menu {
  visibility: visible;
  opacity: 1;
}
.dropdowns-menu {
  position: relative;
  display: flex;
  justify-content: flex-start;
  text-align: center;

  width: 150px;
  height: 50px;
  right: 12px;
  top: -233px;
  padding: var(--space-sm);
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity .2s linear;
  border: 1px solid var(--color-surface-dark);
  background-color: var(--color-surface);
}

.dropdowns-menu a li {
  color: var(--color-on-surface);
  font-weight: 500;
}


.dropdowns-menu:hover {
  cursor: pointer;
  background-color: var(--color-surface-darker);
}

//contact
.contact:hover {
  cursor: pointer;
  color: var(--color-contrast-high);
}

// colophon
.main-footer__colophon {
    border-top: 1px solid var(--color-contrast-low);
    margin-top: var(--space-md);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    background-color: var(--color-contrast-darker);
}

.main-footer__colophon-nav {
    font-size: var(--text-lg);
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
