<template>
    <div class="flex flex-col md:flex-row" v-if="categories">
        <template v-for="category in categories">
            <div :class="$attrs.css" @click="$emit('category',category.name,false)">
                {{ category.name }}
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'WhoobeStoreCategories',
    data:()=>({
        categories: null
    }),
    mounted(){
        this.$api.service('categories').find( { query: { $limit: 50 , type: 'product' , $sort : { name: 1} }}).then ( res => {
            this.categories = res.data
        })
    }
}
</script>