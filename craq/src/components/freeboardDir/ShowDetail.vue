<template lang="html">
  <div class="board">

    <table class="freedetail" cellpadding="0 width-100%" cellspacing="0">
      <thead style="text-align:left">
        <tr>
          <th class="th" scope="col" colspan="4">{{info.user_name}}</th>
        </tr>
        <tr>
          <th scope="col" colspan="3">{{info.title}}</th>
          <th>
            <button type="button" class="btn btn--primary btn-lg">
              {{info.recommend}}
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="detail">
          <th scope="row">DATE</th>
          <td>{{info.createAt}}</td>
          <th scope="row">VIEW</th>
          <td>{{info.views}}</td>
        </tr>
        <!-- <tr>
          <th scope="col" colspan="4" class="hide"></th>
        </tr> -->
        <tr>
          <td class="body" colspan="4">{{info.body}}</td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td>
            <button class="btn btn--primary btn-lg" style="margin:3px" @click="goEditPage">Edit</button>
            <button class="btn btn--primary btn-lg" style="margin:3px" @click="freeDelete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name : 'ShowDetail',
  props : [
    'info'
  ],
  created() {
    // alert("aaaaa");
  },
  methods : {
    goEditPage() {
      this.$router.push({path : ''});
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
