<template>
    <div class="section">
        <div class="margin-bottom-xxxl">
        <HeaderHeading title="Developers" sub="we make world better"></HeaderHeading>
        </div>
        <div class="grid">
            <div class="col12">
                <HeaderProfileCard></HeaderProfileCard>
            </div>
            <div class="col12">
                <HeaderProfileCard></HeaderProfileCard>
            </div>
            <div class="col12">
                <HeaderProfileCard></HeaderProfileCard>
            </div>
        </div>
        
    </div>
</template>

<script>
import HeaderProfileCard from '@/components/HeaderProfileCard.vue';
import HeaderHeading from '@/components/HeaderHeading.vue';
export default {
    name: "HeaderProfile",
    components: {
        HeaderProfileCard,
        HeaderHeading
    }
}

</script>

<style lang="scss" scoped>
.section {
    position: relative;
}

.col12 {
    position: relative;
    margin-bottom: 2rem;
}

</style>
