<template>
    <div class="" v-if="products">
    <div class="relative">
        <div class="absolute right-0 top-0 text-xs flex flex-row items-center snipcart-checkout">
            <span class="snipcart-items-count"></span>
            <i class="material-icons">shopping_bag</i>
            <span class="snipcart-total-price"></span>  
        </div>
        <!-- <div v-if="!apikey" class="text-center w-full border-4 bg-gray-300 text-lg text-red-500">Invalid License Key</div> -->
        <h3 id="storeTop">Store</h3>
        <p v-if="lang">{{ lang.products }} {{total}}</p>
        <div class="w-full text-center cursor-pointer">
            <i class="mr-4 bi-chevron-left" @click="start > 0 ? start=start-limit : null"></i>
            <small>{{start+1}}-{{start+limit}}</small>
            <i class="ml-4 bi-chevron-right" @click="(start+limit)<=total?start=start+limit:null"></i>
        </div>
        <div class="flex flex-row flex-wrap items-center justify-center">
        <template v-for="(product,index) in products">
            <div class="flex flex-col w-64 h-64 m-8 shadow-md rounded-md relative border-4 border-gray-200" @click="current=product">
                <img :src="$imageURL(product.image)"/>
                <!-- <img :src="randomImage(product.name)" class="w-full rounded-tl rounded-tr"/> -->
                <div class="p-4">
                    <div class="text-base">{{product.name}}</div>
                    <div class="text-2xl">
                        {{ $attrs.plugin.component.settings.currency }}
                        <span :class="product.sale?'line-through mr-2':'font-bold'">{{parseFloat(product.price).toFixed(2)}}</span>
                        <span v-if="product.sale" class="font-bold">{{parseFloat(product.sale).toFixed(2)}}</span>
                        <span v-if="product.sale" class="text-sm ml-2">{{ discount(product.price,product.sale) }}</span>
                    </div>
                    
                </div>
                <div class="absolute items-center justify-center bg-gray-100 top-0 left-0 right-0 bottom-0 opacity-0 rounded-md bg-opacity-75 hover:opacity-100 animateme flex flex-row justify-between px-12">
                <i class="material-icons snipcart-add-item moka-icon-circle text-2xl"
                    :data-item-id="product.id"
                    :data-item-price="product.sale?product.sale:product.price"
                    :data-item-url="'/store/product/' + product.id"
                    :data-item-description="product.name"
                    :data-item-image="$imageURL(product.image)"
                    :data-item-name="product.name" :title="lang.add_to_cart">shopping_cart</i>
                <i class="material-icons moka-icon-circle text-2xl" :title="lang.detail" @click="current=product">search</i>
                <button v-if="!product.price" @click="setPrice(product.id,index)">Set price</button>
                </div>
            </div>

        </template>
        </div>
        <div class="w-full text-center cursor-pointer">
            <i class="mr-4 bi-chevron-left" @click="start=start-limit,scrollTop()" v-if="start > 0"></i>
            <small>{{start+1}}-{{start+limit}}</small>
            <i class="ml-4 bi-chevron-right" @click="start=start+limit,scrollTop()" v-if="(start+limit)<=total"></i>
        </div>
        <transition name="animate-slideout">
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
                    <!-- <img :src="randomImage(product.name)" class="w-full rounded-tl rounded-tr"/> -->
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
        </transition>
        
    </div>
    </div>
</template>

<script>
//import language from '@/components/plugins/store/whoobe/en.js'
//import MokaPreview from '@/components/editor/preview/moka.preview.container'
export default {
    name: 'WhoobeStore',
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
        products: null
    }),
    props:['editor'],
    computed:{
        limit(){
            return parseInt(this.$attrs.plugin.editor.settings.rows)
        },
    },
    watch:{
        start(){
            this.scrollTop()
            this.qry()
        },
        
        current(v){
            if ( v ){
                window.sessionStorage.setItem('moka-product-view',JSON.stringify(v))
            }
        }
    },
    methods:{
        qry(){
            this.$api.service('products').find ( { query : { $limit: this.limit , $skip : this.start }}).then ( result => {
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