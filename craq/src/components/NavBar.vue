<template>
  <header class="main-header">
    <div class="container max-width-lg">
      <div class="main-header__layout">
        <div class="main-header__logo">
          <router-link to="/">
            <p class="main-header__logo__text"><span class="main-header__logo__text--accent">C</span>RAQ</p>
          </router-link>
        </div>


        <nav class="main-header__nav">
          <ul class="main-header__nav-list">
            <li class="main-header__nav-item" v-if="!onSearch">
              <!-- switch-->
              <div class="switch">
                <input id="switchCheckbox1" class="switch__input" type="checkbox" name="" @change="$store.commit('toggleTheme')">
              <label for="switchCheckbox1" aria-hidden=true class="switch__label">On</label>
              <div aria-hidden="true" class="switch__marker"></div>
              </div>
              <!-- end switch -->


            </li>
            <li class="main-header__nav-item" v-if="!onSearch"><router-link class="main-header__nav-link" to="/code" :class="{'main-header__nav-selected': currentRouteName == 'code'}">Code</router-link></li>
            <li class="main-header__nav-item" v-if="!onSearch"><router-link class="main-header__nav-link" to="/notice" :class="{'main-header__nav-selected': currentRouteName == 'notice'}">Notice</router-link></li>
            <li class="main-header__nav-item" v-if="!onSearch"><router-link class="main-header__nav-link" to="/tags" :class="{'main-header__nav-selected': currentRouteName == 'tags'}">Tags</router-link></li>
            <li class="main-header__nav-item" v-if="!onSearch"><router-link class="main-header__nav-link" to="/tree" :class="{'main-header__nav-selected': currentRouteName == 'tree'}">Tree</router-link></li>
            <li class="main-header__nav-item main-header__nav-divider" v-if="!onSearch"></li>
            <li class="main-header__nav-item">
                <NavBarSearch @onBlur="searchToggle" :show="onSearch"></NavBarSearch>
            </li>
            <li class="main-header__nav-item" v-show="!onSearch">
              <label for="header-search" class="form-label" @click="searchToggle"><font-awesome-icon icon="search"/></label></li>
            <li class="main-header__nav-item">
              <div style="position: relative;">
                <NavBarDropDown :noties="noties" @onClose="notyClose" @onGo="notyGo" @signOut="signOut"></NavBarDropDown>
                <span class="counter counter--primary counter--docked" v-if="notiesLength">
                  {{notiesLength}}
                </span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import NavBarDropDown from '@/components/NavBarDropDown';
import NavBarSearch from '@/components/NavBarSearch';
export default {
  name: "NavBar",
    components: {
        NavBarDropDown,
        NavBarSearch
    },
  data() {
    return {
      onSearch: false,
      searchInput: '',
            noties: [
                {
                    id: 1,
                    type: "Noty",
                    title:"TITLE111",
                    body: "bodies here",
                    author: "user11",
                    to: {name: 'home'},
                    active: true
                },
                {
                    id: 2,
                    type: "Code",
                    title:"titlenoty",
                    body: "bodies here",
                    author: "user22",
                    to: {name: 'code'},
                    active: true
                },
                {
                    id: 3,
                    type: "user",
                    title:"TITLE",
                    body: "bodies here",
                    author: "user33",
                    to: {name: 'freeboard'},
                    active: true
                },
                {
                    id: 4,
                    title:"defaultType",
                    body: "bodies here",
                    author: "user44",
                    to: {name: 'createtree'},
                    active: false
                },
            ]
    }
  },
  methods: {
    searchToggle() {
      this.onSearch = !this.onSearch;
    },
      signOut() {
          this.$session.destroy();
          this.$router.go({path: '/'});
      },
      notyClose(id) {
          this.noties = this.noties.filter(noty=>noty.id != id);
      },
      notyGo(id) {
          let to = "/"
          for (let i = 0; i < this.noties.length; i++) {
              if (this.noties[i].id == id) {
                  this.noties[i].active = false;
                  to = this.noties[i].to
                  break;
              }
          }
          this.$router.push(to);
          console.log('NavBar: notygo')
          this.noties.sort((a, b) => b.active-a.active);
      }
  },
  computed: {
    currentRouteName() {
      console.log(`NavBar.vue : current route name: ${this.$route.name})`);
      return this.$route.name;
    },
      notiesLength() {
          return this.noties.filter(noty=>noty.active).length;
      }
  }
}


</script>

<style lang="scss" scoped>
$--main-header-height: 70px;

.main-header {
  height: var(--main-header-height);
  position: relative;
  background-color: var(--color-surface);
  z-index: var(--zindex-header);
  box-shadow: var(--shadow-sm);
  //margin-bottom: var(--space-xxxs);

  &__layout {
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  //logo
  &__logo {
    &__text {
      color: var(--color-on-surface);
      font-size: calc(#{$--main-header-height} * 0.9);
      &--accent {
        color: var(--color-secondary);
      }
    }
  }

  //nav
  &__nav {
    float: right;
    margin-top: 0;
    font-size: 1.3em;

    &-list {
      display: flex;
      align-items: center;
      color: var(--color-on-surface);
    }

    &-item {
      display: inline-block;
      margin-bottom: 0;
      margin-left: var(--space-lg);
    }

    &-link {
      color: var(--color-on-surface);
    }

    &-selected {
      color: var(--color-primary); 
    }

    &-divider {
      background-color: var(--color-contrast-medium);
      height: 1em;
      width: 1px;
    }
  }
}

//badge
.counter {
  font-size: var(--text-sm);
  background-color: var(--color-contrast-low);
  padding: var(space-xxxs) var(space-xs);
  border-radius: 50em;

  &--primary {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    @include fontSmooth;
  }
  &--docked {
    padding: 1px;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
  }
}

//expandable search
$--expandable-search-size: 1em;

.form-label {
  cursor: pointer;

}

.expandable-search {
  position: relative;
  display: inline-block;
  font-size: $--expandable-search-size;


  .form-control {
    background-color: transparent;
    border-color: primary; //form bordercolor
    color: transparent;
    width: 0.1px;
    height: 2.2em;
    padding: 0;
    overflow: hidden;
    //border-radius: 50em; //optional rounded corners;
    transition: width .3s var(--ease-out);

    &:focus {
      width: 30em; //max width;
      padding: 0 2.2em 0 var(--space-xs);
      background-color: var(--color-surface-light);
      color: var(--color-on-surface-light);

    }
    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
      display: none;
    }
  }
}

// utilities
.hidden {
  display: none;
}
//switch
$--switch-width: 3rem;
$--switch-height: 1.5rem;
$--switch-padding: 3px;
// animation
$--switch-animation-duration: 0.2s;
/* -------------------------------- 

File#: _1_switch
Title: Switch
Descr: Custom ON/OFF checkbox toggle

-------------------------------- */

.switch {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  position: relative;
  width: $--switch-width;
  height: $--switch-height;
  border-radius: 50em;
  padding: $--switch-padding 0;
}

.switch__input, .switch__label {
  position: absolute;
  left: 0;
  top: 0;
}

.switch__input {
  margin: 0;
  padding: 0;
  opacity: 0;
  height: 0;
  width: 0;
  pointer-events: none;

  &:checked + .switch__label {
    background-color: var(--color-primary);
  }

  &:checked + .switch__label + .switch__marker {
    left: calc(100% - #{$--switch-height} + #{$--switch-padding});
  }

  &:focus + .switch__label,
  &:active + .switch__label {
    --color-shadow: hsla(var(--color-primary-h), var(--color-primary-s), var(--color-primary-l), 0.2); // fix iOS 12 bug
    box-shadow: 0 0 0 3px var(--color-shadow);
  }
}

.switch__label {
  width: 100%;
  height: 100%;
  color: transparent;
  user-select: none;
  background-color: var(--color-contrast-low);
  border-radius: inherit;
  z-index: 1;
  transition: background $--switch-animation-duration;
}

.switch__marker {
  position: relative;
  background-color: var(--color-white);
  width: calc(#{$--switch-height} - #{$--switch-padding} * 2);
  height: calc(#{$--switch-height} - #{$--switch-padding} * 2);
  border-radius: 50%;
  z-index: 2;
  pointer-events: none;
  box-shadow: 0 1px 1px hsla(0, 0%, 0%, 0.25);
  left: $--switch-padding;
  transition: left $--switch-animation-duration;
  will-change: left;
}

</style>
