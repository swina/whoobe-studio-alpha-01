<template>
    <div class="" v-if="products">
    <div class="relative" :class="settings.general.css">
        <div class="absolute right-0 top-0 text-xs flex flex-row items-center snipcart-checkout">
            <span class="snipcart-items-count"></span>
            <i class="material-icons">shopping_bag</i>
            <span class="snipcart-total-price"></span>  
        </div>


        <!-- <div v-if="!apikey" class="text-center w-full border-4 bg-gray-300 text-lg text-red-500">Invalid License Key</div> -->
        <h3 id="storeTop">Store</h3>
        
        <store-categories v-if="!current && settings.loop.categories.enabled" :css="settings.loop.categories.css" @category="qryByCategory"/>
        
        
        <p v-if="lang">{{ lang.products }} {{total}}</p>
        <div class="w-full text-center cursor-pointer">
            <i class="mr-4 bi-chevron-left" @click="start > 0 ? start=start-limit : null"></i>
            <small>{{start+1}}-{{start+limit}}</small>
            <i class="ml-4 bi-chevron-right" @click="(start+limit)<=total?start=start+limit:null"></i>
        </div>
       

        

        <div class="z-highest absolute right-0 -mt-8 flex flex-row justify-around items-center" v-if="editor && $mapState().editor.current.hasOwnProperty('plugin') &&  $mapState().editor.current && $mapState().editor.current.plugin._id === $attrs.plugin._id">
            <icon name="settings" title="Settings" @click="$action('block_plugin_setting')" class="text-3xl"/>
            <icon name="brush" title="Customize" @click="$action('block_plugin_setting')" class="text-3xl"/>
            <icon :name="!current?'web':'collections'" :title="!current?'View Single':'View Loop'" class="text-3xl mr-2" @click="!current?current=products[0]:current=null"/>
        </div> 


        <div v-if="!current" class="flex flex-row flex-wrap items-center justify-center">
            <template v-for="(product,index) in products">
                <div class="flex flex-col" :class="settings.loop.css" @click="current=product,currentPrice=product.price,currentOption=product.optionValues,variations(product.sku)">
                    <template v-for="field in settings.loop.fields">
                        
                        <div :class="field.css" v-if="schema[field.name].type!='image_uri' && field.name !='add_to_cart'">
                            <small class="mr-1" v-if="schema[field.name].type==='currency'">{{ settings.general.currency }}</small>
                            {{ schema[field.name].type==='currency' ? parseFloat(product[field.name]).toFixed(2) : product[field.name] }}
                        </div>
                        <div v-else>
                            <img :src="productImage(product[field.name])" :class="field.css" v-if="field.name != 'add_to_cart'">
                            <button v-if="field.name==='add_to_cart'" :class="field.css">Add to cart</button>
                        </div>
                    </template>
                </div>
            
            </template>
        </div>
        <div v-if="!current" class="w-full text-center cursor-pointer">
            <i class="mr-4 bi-chevron-left" @click="start=start-limit,scrollTop()" v-if="start > 0"></i>
            <small>{{start+1}}-{{start+limit}}</small>
            <i class="ml-4 bi-chevron-right" @click="start=start+limit,scrollTop()" v-if="(start+limit)<=total"></i>
        </div>
        <div v-if="current" class="fixed inset-0 overflow-y-auto h-screen md:relative md:h-auto">
            <div :class="settings.single.css + ' grid-cols-'  + settings.single.cols" class="flex flex-col md:grid relative">
                <icon name="close" class="absolute right-0 top-0 text-3xl" @click="current=null"/>
                <div v-for="n in parseInt(settings.single.cols)">    

                    <template v-for="field in settings.single.fields">
                        <span v-if="schema[field.name] && parseInt(field.col)===(n-1)">
                            <div :class="field.css" v-if="schema[field.name].type==='text' || schema[field.name].type === 'string'">
                                <span v-if="field.name!='sku'">{{ current[field.name] }}</span>
                                <span v-else>SKU {{ !currentVariation ? current[field.name] : currentVariation.sku }}</span>
                            </div>
                            <div :class="field.css" v-if="schema[field.name].type==='list' && field.name != 'optionValues'">
                                {{ current[field.name].split ( schema[field.name].separator ).join('-') }}
                            </div>
                            <div v-if="field.name === 'optionValues'" class="flex flex-col">
                                
                                <div class="relative flex flex-col md:flex-row" v-if="productVariations && productVariations.length">
                                    <div :class="variationSelected(current.optionValues,field.css)" @click="currentPrice=current.price,currentOption=current.optionValues,currentVariation=null">{{ current[field.name] }}</div>
                                    <div v-for="variation in productVariations" :class="variationSelected(variation.optionValues,field.css)" @click="currentPrice = variation.price,currentOption=variation.optionValues,currentVariation=variation">
                                        {{ variation.optionValues }}
                                    </div>
                                </div>

                                <!-- <div v-if="productVariations">{{ currentOption }}</div> -->
                                
                            </div>
                            <div :class="field.css" v-if="schema[field.name].type==='currency'">
                                <small class="mr-1">{{ settings.general.currency }}</small>
                                <span>{{ parseFloat(currentPrice).toFixed(2) }}</span>
                            </div>
                            <div :class="field.css" v-if="field.name==='category'">
                                {{ current[field.name] }}
                            </div>
                            <div :class="field.css" v-if="field.name==='facets'">
                                &raquo; {{ current[field.name].join(' - ') }}
                            </div>
                            <div v-if="schema[field.name].type==='image_uri'" class="flex flex-col"> 
                                <img :src="productImage(current[field.name])" :class="field.css">
                                <div class="flex flex-row flex-wrap">
                                    <template v-for="(asset,i) in current.assets" v-if="Array.isArray(current.assets)">
                                        <img :src="$imageURL(asset)" class="w-16 h-16 border object-cover mt-1 mb-1 mr-1" :title="asset" @click="currentImageIndex=i"/>
                                    </template>
                                </div>
                            </div>
                        </span>
                        <button v-if="parseInt(field.col)===(n-1) && field.name === 'add_to_cart'" 
                            :key="field.name"
                            :class="field.css"
                            :data-item-id="current._id"
                            :data-item-image="productImage(current.assets)"
                            :data-item-price="currentPrice"
                            :data-item-name="current.name + ' ' + currentOption"
                            :data-item-description="currentOption"
                            :data-item-url="'/store/product/' + current._id"> 
                        Add to cart</button>
                        <!-- <div :key="field.name" v-if="field.name != 'add_to_cart' && schema[field.name].type==='image_uri' && parseInt(field.col)===(n-1)"><img :src="$imageURL(current[field.name])" :class="field.css"></div> -->
                        
                        
                    </template>
                    <!--<img v-if="schema[field.name].type!='image'" :src="$imageURL(product.image)" :class="field.css"/> -->
                </div>
            </div>
        </div>
        
        <!-- <transition name="animate-slideout">
            <modal
                v-if="current && current.name"
                size="lg"
                position="modal"
                buttons="none"
                @close="current=!null">
                <div slot="title">{{ current.name }}</div>
                <div slot="content" class="p-2 transition-all duration-700 ease-in-out">
                    <div class="grid md:grid-cols-3 grid-cols-1">
                    <img :src="$imageURL(current.image)" class="md:col-span-2"/>
                    <div class="p-4">
                        <div class="text-2xl">{{current.name}}</div>
                        <div class="text-sm text-gray-400">{{current.code}}</div>
                        <div class="text-2xl my-4">
                            {{ $attrs.plugin.component.settings.currency }}
                            <span :class="current.sale?'line-through mr-2':'font-bold'">{{parseFloat(current.price).toFixed(2)}}</span>
                            <span v-if="current.sale" class="font-bold">{{parseFloat(current.sale).toFixed(2)}}</span>
                            <span v-if="current.sale" class="text-sm ml-2">{{ discount(current.price,current.sale) }}</span>
                        </div>
                        <button class="snipcart-add-item px-2 py-2 success text-2xl"
                            :data-item-id="current.id"
                            :data-item-price="current.sale?current.sale:current.price"
                            :data-item-url="'/store/product/' + current.id"
                            :data-item-description="current.name"
                            :data-item-image="$imageURL(current.image)"
                            :data-item-name="current.name" :title="lang.add_to_cart">{{lang.buy}}</button>
                    </div>
                    
                    </div>
                </div>
            </modal>
        </transition> -->
        
    </div>
        <modal 
            v-if="editor && customize"
            @close="customize=!customize"
            size="lg"
            class="fixed z-highest"
            position="modal"
            buttons="none">
            <div slot="title">Customize</div>
            <div slot="content">
                <store-customize :customize="current?'single':'loop'"/>
            </div>
        </modal>
    </div>
</template>

<script>
//import language from '@/components/plugins/store/whoobe/en.js'
//import MokaPreview from '@/components/editor/preview/moka.preview.container'
import model from './model.js'
export default {
    name: 'WhoobeStore',
    components: {
        'store-customize' : () => import ( './admin/settings.vue' ),
        'store-categories' : () => import ( './store.categories.vue' )
    },
    data:()=>({
        apikey: false,
        lang: null,
        language : {
            en : {
                products: 'Products',
                buy : 'Buy',
                add_to_cart: 'Add to cart',
                checkout: 'Checkout',
                detail: 'Detail'
            },
            it : {
                products: 'Prodotti',
                buy : 'Acquista',
                add_to_cart: 'Aggiungi al carrello',
                checkout: 'Vai alla cassa',
                detail: 'Dettaglio'
            }
        },
        start: 0,
        total: 0,
        current: null,
        products: null,
        productVariations: null,
        currentPrice:null,
        currentOption: null,
        currentVariation: null,
        currentImageIndex:0,
        settings: null,
        customize: false,
        schema: null,
        filter: null
    }),
    props:['editor'],
    computed:{
        limit(){
            return parseInt(this.$attrs.plugin.settings.loop.limit)
        },
    },
    watch:{
        start(){
            this.scrollTop()
            this.filter ?
                this.filter.field === 'category' ?
                    this.qryByCategory ( this.filter.value , true ) : 
                        this.qry() : this.qry()
        },
        
        current(v){
            if ( v ){
                window.sessionStorage.setItem('moka-product-view',JSON.stringify(v))
            }
        }
    },
    methods:{
        productImage ( asset ){
            return !Array.isArray(asset) ?
                this.$imageURL(asset) : this.$imageURL(asset[this.currentImageIndex]) 
        },
        variationSelected(variation,css){
            return variation === this.currentOption ?
                css + ' bg-black text-white' : css
        },
        variations(sku){
            console.log ( sku )
            this.$api.service ( 'products' ).find ( { query : { type: 'variation' , parent: sku , $sort : { price: 1 , optionValues: 1 } }}).then ( res => {
                console.log ( res )
                this.productVariations = res.data
            })
        },
        qry(){
            this.$api.service('products').find ( { query : { $limit: this.limit , $skip : this.start , type: 'product'  }}).then ( result => {
                this.products = result.data
                this.total = result.total
            })
        },
        qryByCategory ( category , skip ){
            !skip ? this.start = 0 : null
            this.filter = { field: 'category' , value: category }
            this.$api.service('products').find ( { query : { $limit: this.limit , $skip : this.start , type: 'product' , category : category }}).then ( result => {
                this.products = result.data
                this.total = result.total
            })
        },
        randomImage(name){
            return 'https://source.unsplash.com/600x400?fashion&' + name
        },
        scrollTop(){
            // element which needs to be scrolled to
            var element = document.querySelector("#storeTop");
            // scroll to element
            element.scrollIntoView();
        },
        discount(price,sale){
            let discount = (parseFloat(price)-parseFloat(sale))
            return parseFloat(discount).toFixed(2) + '%'
        }
    },
    mounted(){
        //this.lang = language[navigator.language||'en']
        //let whoobe = JSON.parse(window.localStorage.getItem('whoobe'))
        //console.log ( this.$attrs.plugin.editor.settings )
        //if ( this.$attrs.config.mode != 'static' ){
            //this.$http.get('products').then ( res => {
            this.lang = this.language[navigator.language||'en']
            !this.lang ? this.lang = this.language['en'] : null
            this.settings = this.$attrs.plugin.settings
            this.schema = model
            this.qry()
        //} else {
        //    this.products = products
        //    this.total = products.length
        //}
    }
}
</script>

<style>

.animateme {
    transition: all .5s linear;
}
</style>