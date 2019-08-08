<template>
  <div>
    <table class="table freecomment width-100%" cellpadding="0" cellspacing="0">
      <col width="20%"><col width="40%"><col width="40%">
      <thead style="text-align:left">
        <tr>
          <th scope="col" style="text-align : center;">{{comment.USERNAME}}</th>
          <th scope="col" >{{comment.BODY}}</th>
          <th scope="col" style="text-align : center;">{{comment.CREATED_AT}}</th>
        </tr>
      </thead>
    </table>
    <!-- <strong>{{comment.user_name}}</strong>|&nbsp;
    <i>{{comment.content}}</i>&nbsp;-&nbsp;<strong>{{comment.createAt}}</strong> -->
  </div>
</template>

<script>
export default {
  name : 'FreeComment',
  data() {
    return {}
  },
  props : {
    comment : {type : null}
  },
  methods : {
  },
  mounted() {
  },
}
</script>

<style>
table.freecomment {
    border-collapse: collapse;
    text-align: left;
    line-height: 1.5;
    border-top: 3px solid #369;;
    /* border-left: 3px solid #369; */
  margin : 20px 10px;
}
table.freecomment th {
    width: 30%;
    padding: 10px;
    font-weight: bold;
    vertical-align: top;
    /* color: #110; */
    /* border-right: 1px solid #ccc; */
    /* border-bottom: 1px solid #ccc; */

}
table.freecomment td {
    width: 349px;
    padding: 10px;
    vertical-align: top;
    /* border-right: 1px solid #ccc; */
    /* border-bottom: 1px solid #ccc; */
}
</style>
