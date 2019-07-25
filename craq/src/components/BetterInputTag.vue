<template>
  <div
    @click="focusNewTag()"
    :class="{'read-only': readOnly}"
    class="vue-input-tag-wrapper"
  >
    <span v-for="(tag, index) in tags" :key="index" class="input-tag">
      <span>{{ tag }}</span>
      <a
        v-if="!readOnly"
        @click.prevent.stop="remove(index)"
        class="remove"></a>
    </span>

    <input
      v-if="!readOnly"
      v-model="newTag"

      type="search"
      class="new-tag form-control"

      name="q"
      id="header-search"
      @blur="searchToggle"

      @keydown.delete.stop="removeLastTag()"
      @keydown.space.188.tab.prevent.stop="addNew(newTag)"
      @blur.stop="addNew(newTag)"

      :placeholder="placeholder"
    />
  </div>
</template>

<script>
  /* eslint-disable */
  const validators = {
    email: new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    url: new RegExp(/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i),
    text: new RegExp(/^[a-zA-Z]+$/),
    digits: new RegExp(/^[\d() \.\:\-\+#]+$/),
    isodate: new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/)
  }
  /* eslint-enable */

  export default {
    name: 'InputTag',

    props: {
      tags: {
        type: Array,
        default: () => []
      },
      placeholder: {
        type: String,
        default: ''
      },
      onChange: {
        type: Function
      },
      readOnly: {
        type: Boolean,
        default: false
      },
      validate: {
        type: String,
        default: ''
      },
      onPasteSeparator: {
        type: String,
        default: null
      },
      length: {
        type: Object,
        default: null
      },
      searchToggle: {
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        newTag: ''
      }
    },

    methods: {
      focusNewTag () {
        if (this.readOnly) { return }
        this.$el.querySelector('.new-tag').focus()
      },

      addNew (tag) {
        if (this.onPasteSeparator && tag.indexOf(this.onPasteSeparator) !== -1) {
          tag.split(this.onPasteSeparator)
            .map(t => t.trim())
            .map(this.addNew)

          return
        }

        if (tag && this.tags.indexOf(tag) === -1 && this.validateIfNeeded(tag) && this.validateLengthIfNeeded(tag)) {
          this.tags.push(tag)
          this.tagChange()
        }
        this.newTag = ''
      },

      validateIfNeeded (tagValue) {
        if (this.validate === '' || this.validate === undefined) {
          return true
        } else if (Object.keys(validators).indexOf(this.validate) > -1) {
          return validators[this.validate].test(tagValue)
        }
        return true
      },

      validateLengthIfNeeded (tagValue) {
        if (this.length === null || this.length === undefined) {
          return true
        } else if (this.length.min && this.length.max) {
          return tagValue.length >= this.length.min && tagValue.length <= this.length.max
        } else if (this.length.min) {
          return tagValue.length >= this.length.min
        } else if (this.length.max) {
          return tagValue.length <= this.length.max
        }
        return true
      },

      remove (index) {
        this.tags.splice(index, 1)
        this.tagChange()
      },

      removeLastTag () {
        if (this.newTag) { return }
        this.tags.pop()
        this.tagChange()
      },

      tagChange () {
        if (this.onChange) {
          // avoid passing the observer
          this.onChange(JSON.parse(JSON.stringify(this.tags)))
        }
      }
    }
  }
</script>

<style lang="scss">
  .vue-input-tag-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    background-color: #fff;
    border: 1px solid #ccc;
    overflow: hidden;
    padding-left: 4px;
    padding-top: 4px;
    cursor: text;
    text-align: left;
    -webkit-appearance: textfield;

    .input-tag {
      background-color: #cde69c;
      border-radius: 2px;
      border: 1px solid #a5d24a;
      color: #638421;
      display: inline-block;
      font-size: 13px;
      font-weight: 400;
      margin-bottom: 4px;
      margin-right: 4px;
      padding: 3px;

      .remove {
        cursor: pointer;
        font-weight: bold;
        color: #638421;

        &:hover {
          text-decoration: none;
        }

        &::before {
          content: " x";
        }
      }
    }

    .new-tag {
      flex: 1;
      background: transparent;
      border: 0;
      color: #777;
      font-size: 13px;
      font-weight: 400;
      margin-bottom: 6px;
      margin-top: 1px;
      outline: none;
      padding: 4px;
      padding-left: 0;
    }

    &.read-only {
      cursor: default;
    }
  }

  $--main-header-height: 70px;

  .main-header {
    height: var(--main-header-height);
    position: relative;
    background-color: var(--color-surface);
    z-index: var(--zindex-header);
    box-shadow: var(--shadow-sm);
    margin-bottom: var(--space-xxxs);

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
    font-size: var(--text-xs);
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
