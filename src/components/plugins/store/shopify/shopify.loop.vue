<template>
<div v-if="products" :class="settings.loop.container">
    <template v-for="product in products">
        <div :class="settings.loop.css">
            <template v-for="field in settings.loop.fields">
                <div v-if="schema[field.name].field_type!='image'" :class="field.css">
                    <span v-if="schema[field.name].field_type==='currency'" class="text-base">
                        {{ settings.general.display.currency.symbol }}
                    </span> 
                    {{ getProductField ( product , field )}}
                </div>
                <img v-if="schema[field.name].field_type==='image'" :src="getProductField ( product , field )" :class="field.css"/>
            </template>
        </div>
    </template>
</div>
</template>

<script>
import model from './model.js'
import { eventBus } from '@/main'

export default {
    name: 'WhoobeShopify',
    data:()=>({
        client: null,
        products: null,
        schema: null,
        settings: null
    }),
    methods:{
        getProductField ( product , field ){
            if ( !this.schema.hasOwnProperty(field.name)) return
            let p_field = this.schema[field.name]
            if ( p_field.type === 'string' || p_field.type === 'text' ){
                return product[field.name]
            }
            if ( p_field.type === 'array' ){
                if ( p_field.hasOwnProperty('parent') ){
                    return product[p_field.parent][p_field.position][p_field.field]
                } else {
                    return product[field][p_field.position][p_field.field]
                }
            }
        }
    },
    beforeMount(){
        this.client = this.$mapState().datastore.shopify
        this.client.collection.fetchAllWithProducts().then((collections) => {
            // Do something with the collections
        });
        this.client.product.fetchAll(200).then((products) => {
            this.products = products
            this.schema = model
            this.client.schema = model
            this.$store.dispatch ( 'shopifyClient' , this.client )
        }).catch ( error => console.log(error));
        this.settings = this.$attrs.plugin.settings
    },
    mounted(){
        eventBus.$on ( 'sort_by' , (data) => {
            console.log ( data )
        })
        eventBus.$on ( 'search' , (data) => {
            if ( data.keyCode === 13 ){
                console.log ( data.target.value )
            }
        })
        
        
    }
}
</script>