<template> 
    <div>
        <form @submit.prevent="submit2">
            <input type="text" class="form-control" v-model="body"><button class="reset btn btn--primary"><font-awesome-icon :icon="['fas', 'paper-plane']"></font-awesome-icon></button>
        </form>
    </div>
</template>

<script>
export default {
    name: "ArticleCommenter",
    props: [
        "article_pk", "content_id"
    ],
    data() {
        return {
            body: "hi"
        }
    },
    methods: {
        submit2: function()  {
            let data = {
                user_id: this.$session.get('userPk'),
                content_id: this.content_id,
                parent_id: 0,
                body: this.body
            }
            const hello = this;
            this.$axios.post('comments', data).then((res) => {
            });
                this.$emit('clicked');
        }
    }
}

</script>

<style lang="scss" scoped>


</style>
