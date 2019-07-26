<template>
  <div>
    <table class="freecomment width 80%" cellpadding="0" cellspacing="0">
      <thead style="text-align:left">
        <tr>
          <th scope="col" style="text-align : center;">{{comment.user_name}}</th>
          <td scope="col" colspan="2">{{comment.content}}</td>
          <th scope="col" style="text-align : center;">{{comment.createAt}}</th>
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
  props : {
    comment : {type : null}
  }
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
    color: #110;
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
