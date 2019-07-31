<template>
  <div>
    <table class="freeEdit" cellpadding="0" cellspacing="0">
      <thead style="text-align:left">
        <tr>
          <th scope="col" colspan="4" v-html="freeInfo.user_name"></th>
        </tr>
        <tr>
          <th scope="col" colspan="3">
            <input type="text" name="title" v-model="title" class="form-control width-100%">
          </th>
          <th>
            <button type="button" class="btn btn-primary btn-lg">
              {{freeInfo.recommend}}
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="detail">
          <th scope="row">DATE</th>
          <td v-html="freeInfo.createAt"></td>
          <th scope="row">VIEW</th>
          <td v-html="freeInfo.views"></td>
        </tr>
        <!-- <tr>
          <th scope="col" colspan="4" class="hide"></th>
        </tr> -->
        <tr>
          <td class="body" colspan="4">
            <textarea name="body" rows="8" cols="80" v-model="body" class="form-control width-100%"></textarea>
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td>
            <button class="btn btn-primary btn-lg" style="margin:3px" @click="update">Modified</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  name : "FreeEdit",
  props : [
    'freeInfo'
  ],
  data() {
    return {
      title : this.freeInfo.title,
      body : this.freeInfo.body
    }
  },
  created() {
    // alert(this.freeInfo.title)
  },
  methods : {
    update() {
      // axios
// alert("update")
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="scss" scoped>
.freeEdit {
    border-collapse: collapse;
    text-align: left;
    line-height: 1.5;
    border-top: 1px solid #ccc;
    border-left: 3px solid #369;
    margin : 20px 10px;

    &__th {
        width: 147px;
        padding: 10px;
        font-weight: bold;
        vertical-align: top;
        color: #153d73;
        border-top: 1px solid #ccc;
        /* border-right: 1px solid #ccc; */
        /* border-bottom: 1px solid #ccc; */

    }
    &__td {
        width: 349px;
        padding: 10px;
        vertical-align: top;
        border-top: 1px solid #ccc;
        /* border-right: 1px solid #ccc; */
        border-bottom: 1px solid #ccc;
    }
}
</style>
