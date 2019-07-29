<template>
    <vue-tags-input
        v-model="tag"
        :tags="tags" :allow-edit-tags="true"
        :autocomplete-items="items"
        class="tags-input"
        @tags-changed="newTags => tags = newTags"
        @before-adding-tag="beforeAdd"
        >
        <div
        slot="autocomplete-item"
        slot-scope="props"
        class="my-item"
        >
        <i
        class="material-icons"
        >
        {{ props.item.text }}
        </i>{{ props.item.text }}
        </div>
            <div
        slot="tag-left"
        slot-scope="props"
        class="my-tag-left"
        >
        <i
        :style="{ color: props.tag.iconColor }"
        class="material-icons"
        >
        {{ props.tag.text }}
        </i>
            </div>
    </vue-tags-input>
</template>


<script>
import VueTagsInput from '@johmun/vue-tags-input';
export default {
    name:"HashtagSearch",
    components: {
        VueTagsInput,
    },
    data() {
        return {
            items: [],
            tag: 'Also valid8ed',
            tags: [{
                text: 'custom class',
                classes: 'custom-class',
            }, {
                text: 'valid tag',
            }, {
                text: 'toShort',
            }, {
                text: '8 is invalid',
            }, {
                text: 'duplicate',
            }, {
                text: 'duplicate',
            }, {
                text: 'Inline styled tag',
                style: 'color: #56c1da; background-color: transparent; border: 1px solid #56c1da',
            }],
            autocompleteItems: [{
                text: 'invalid',
            }, {
                text: 'Invalid cause of "1"',
            }, {
                text: 'valid item',
            }],
        };
    },
    methods: {
        beforeAdd(obj) {
            this.tags.push(obj.addTag);
        }
    }
}


</script>

<style lang="scss" scoped>

</style>
