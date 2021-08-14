<template>
    <div :class="$attrs.settings.filter.container">
        <template v-for="item in $attrs.settings.filter.items">
            <shopify-search :css="item.css" v-if="item.name==='Search'"/>
            <shopify-sort :css="item.css" v-if="item.name==='Sort'"/>
            <shopify-price_range :css="item.css" v-if="item.name==='Price range'"/>
            <shopify-total :css="item.css" v-if="item.name==='Products found'"/>
            <!-- <component :is="component(item.name)" :component="component(item.name)" :css="item.css"/> -->
            <!-- <div :class="item.css">
                {{ item.name }}
            </div> -->
        </template>
    </div>
</template>

<script>
export default {
    name: 'WhoobeShopifyFilter',
    components: {
        'shopify-sort' : () => import ( './shopify.filter.sort.vue' ),
        'shopify-price_range' : () => import ( './shopify.filter.price_range.vue' ),
        'shopify-total' : () => import ( './shopify.filter.total.vue' ),
        'shopify-search' : () => import ( './shopify.filter.search.vue')
    },
    methods:{
        component(name){
            return 'shopify-' + name
        }
    }
}
</script>