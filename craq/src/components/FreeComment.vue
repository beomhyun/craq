<template>
  <div>
    <strong>{{comment.user_name}}</strong>|&nbsp;
    <i>{{comment.content}}</i>&nbsp;-&nbsp;<strong>{{comment.createAt}}</strong>
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
</style>
