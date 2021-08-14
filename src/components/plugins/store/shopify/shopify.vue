<template>
    <div :class="$attrs.plugin.settings.general.css">
        
        <!--<shopify-filter :settings="settings"/>-->
        <shopify-loop :settings="settings" :plugin="$attrs.plugin"/>
    </div>
</template>

<script>
import model from './model.js'

export default {
    name: 'WhoobeShopify',
    data:()=>({
        client: null,
        products: null,
        schema: null,
        settings: null
    }),
    components: {
        'shopify-filter'    : () => import ( './shopify.filter.vue' ),
        'shopify-loop'      : () => import ( './shopify.loop.vue' ),
       
    },
    beforeMount(){
        this.client = this.$mapState().datastore.shopify
        this.client.collection.fetchAllWithProducts().then((collections) => {
            this.client.collections = collections
            // Do something with the collections
            this.client.product.fetchAll(200).then((products) => {
                this.products = products
                this.schema = model
                this.client.schema = model
                this.client.products = products
                this.$store.dispatch ( 'shopifyClient' , this.client )
            }).catch ( error => console.log(error));
        });
        
        this.settings = this.$attrs.plugin.settings
    }
    
}
</script>