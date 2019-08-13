<template> 
    <div>
        <Spinner v-if="!loaded"></Spinner>
        <form @submit.prevent="submit2">
            <input v-focus type="text" class="form-control" v-model="body" autofocus><button class="reset btn btn--primary"><font-awesome-icon :icon="['fas', 'paper-plane']"></font-awesome-icon></button>
        </form>
    </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
export default {
    name: "ArticleCommenter",
    props: [
        "article_pk", "content_id"
    ],
    data() {
        return {
            body: "",
            loaded: true
        }
    },
    methods: {
        submit2: function()  {
            this.loaded = false;
            let data = {
                user_id: this.$session.get('userPk'),
                content_id: this.content_id,
                parent_id: 0,
                body: this.body
            }
            const hello = this;
            this.$axios.post('comments', data).then((res) => {
                this.loaded = true;
                this.$emit('clicked');
            });
        }
    }
}

</script>

<style lang="scss" scoped>
form {
    display: flex;
    justify-content: space-around;
}
.form-control {
    width: 95%;
}

</style>
