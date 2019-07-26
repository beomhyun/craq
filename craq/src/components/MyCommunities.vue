<template>
  <div>
<!--    <h5> 인기글 </h5>-->

    <div class="container" style="column-count: 2; column-rule: dotted 1px #222;">
      <ul class="text-component width-100%" v-for="mycomm in tmpData">
        <li class="text-component width-50%"><router-link :to="{ name: 'freeboard', params: {topic : mycomm.topic} }">{{mycomm.body}}</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name : "MyCommunities",
  data() {
    return {
      tmpData : [
        {
          topic : '1',
          body : 'Lorem ipsum dolor1'
        },
        {
          topic : '2',
          body : 'Lorem ipsum dolor2'
        },
        {
          topic : '3',
          body : 'Lorem ipsum dolor3'
        },
        {
          topic : '4',
          body : 'Lorem ipsum dolor4'
        },
        {
          topic : '5',
          body : 'Lorem ipsum dolor5'
        },
        {
          topic : '6',
          body : 'Lorem ipsum dolor6'
        },
        {
          topic : '7',
          body : 'Lorem ipsum dolor7'
        },
        {
          topic : '8',
          body : 'Lorem ipsum dolor8'
        }

      ]
    }
  },
  // created() {
  //   axios.get('http://192.168.31.58:10123/api-docs/', {
  //     user_id : this.$store.state.user_id
  //   }).
  //   then((response) => {
  //     tmpData = response.data
  //   })
  // }
}

</script>

<style lang="scss">
// $brand-primary:                 darken(#428bca, 6.5%);
// $border-radius-base:            4px;
// $component-active-color:        #fff;
// $component-active-bg:           $brand-primary;
// //** Background color on `.list-group-item`
// $list-group-bg:                 #fff;
// //** `.list-group-item` border color
// $list-group-border:             #ddd;
// //** List group border radius
// $list-group-border-radius:      $border-radius-base;
// //** Background color of single list items on hover
// $list-group-hover-bg:           #f5f5f5;
// //** Text color of active list items
// $list-group-active-color:       $component-active-color;
// //** Background color of active list items
// $list-group-active-bg:          $component-active-bg;
// //** Border color of active list elements
// $list-group-active-border:      $list-group-active-bg;
// //** Text color for content within active list items
// $list-group-active-text-color:  lighten($list-group-active-bg, 40%);
//
// .list-group {
//   // No need to set list-style: none; since .list-group-item is block level
//   padding-left: 0; // reset padding because ul and ol
//   margin-bottom: 20px;
// }
//
// .list-group-item {
//   position: relative;
//   display: block;
//   padding: 10px 15px;
//   // Place the border on the list items and negative margin up for better styling
//   margin-bottom: -1px;
//   background-color: $list-group-bg;
//   border: 1px solid $list-group-border;
//
//   // Round the first and last items
//   &:first-child {
//     @include border-top-radius($list-group-border-radius);
//   }
//   &:last-child {
//     margin-bottom: 0;
//     @include border-bottom-radius($list-group-border-radius);
//   }
//
//   // Disabled state
//   &.disabled,
//   &.disabled:hover,
//   &.disabled:focus {
//     color: $list-group-disabled-color;
//     cursor: $cursor-disabled;
//     background-color: $list-group-disabled-bg;
//
//     // Force color to inherit for custom content
//     .list-group-item-heading {
//       color: inherit;
//     }
//     .list-group-item-text {
//       color: $list-group-disabled-text-color;
//     }
//   }
//
//   // Active class on item itself, not parent
//   &.active,
//   &.active:hover,
//   &.active:focus {
//     z-index: 2; // Place active items above their siblings for proper border styling
//     color: $list-group-active-color;
//     background-color: $list-group-active-bg;
//     border-color: $list-group-active-border;
//
//     // Force color to inherit for custom content
//     .list-group-item-heading,
//     .list-group-item-heading > small,
//     .list-group-item-heading > .small {
//       color: inherit;
//     }
//     .list-group-item-text {
//       color: $list-group-active-text-color;
//     }
//   }
// }
//
//
// // Interactive list items
// //
// // Use anchor or button elements instead of `li`s or `div`s to create interactive items.
// // Includes an extra `.active` modifier class for showing selected items.
//
// a.list-group-item,
// button.list-group-item {
//   color: $list-group-link-color;
//
//   .list-group-item-heading {
//     color: $list-group-link-heading-color;
//   }
//
//   // Hover state
//   &:hover,
//   &:focus {
//     color: $list-group-link-hover-color;
//     text-decoration: none;
//     background-color: $list-group-hover-bg;
//   }
// }
//
// button.list-group-item {
//   width: 100%;
//   text-align: left;
// }
//
//
// // Contextual variants
// //
// // Add modifier classes to change text and background color on individual items.
// // Organizationally, this must come after the `:hover` states.
//
// @include list-group-item-variant(success, $state-success-bg, $state-success-text);
// @include list-group-item-variant(info, $state-info-bg, $state-info-text);
// @include list-group-item-variant(warning, $state-warning-bg, $state-warning-text);
// @include list-group-item-variant(danger, $state-danger-bg, $state-danger-text);
//
//
// // Custom content options
// //
// // Extra classes for creating well-formatted content within `.list-group-item`s.
//
// .list-group-item-heading {
//   margin-top: 0;
//   margin-bottom: 5px;
// }
// .list-group-item-text {
//   margin-bottom: 0;
//   line-height: 1.3;
// }
</style>
