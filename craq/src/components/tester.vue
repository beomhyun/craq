<template>
    <div>
        <button @click.prevent="click" class="btn btn--primary">bqjlkwejlkqw</button>
    </div>

</template>


<script>
export default {
    name: "Tester",
    methods: {
        click() {
            this.$axios.get('/comments/articles/1').then((res) => console.log(res));
        }

    }
}

</script>


<style>

</style>
