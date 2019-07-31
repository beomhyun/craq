<template>
  <div>
<!--    <h5> 인기글 </h5>-->

    <div class="container" style="column-count: 2; column-rule: dotted 1px #222;">
      <ul class="text-component width-100%" v-for="mycomm in tmpData">
        <!-- <li class="text-component width-50%"><router-link :to="{ name: 'freeboard', params: {topic : mycomm.topic} }">{{mycomm.body}}</router-link></li> -->
        <li class="text-component width-50%"><router-link :to="`/freeboard/${mycomm.topic}`">{{mycomm.body}}</router-link></li>
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
}

</script>

<style lang="scss">
</style>
