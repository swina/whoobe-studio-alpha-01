<template>
<div class="m-1 p-2 theme-dark relative">
    <div class="flex w-full items-center flex-row justify-start">
    <button @click="edit=false,loopEditor=false">Products</button>    
    <button v-if="edit" @click="productSave()">Save</button>
    <button v-if="!edit" @click="importFile=!importFile">Import</button>
    <button v-if="!edit" @click="exportFile=!exportFile">Export</button>
    <button v-if="!edit" @click="categories=!categories">Categories</button>
    <button v-if="!edit" @click="loopEditor=!loopEditor" :class="loopEditor?'bg-white text-black':''">Loop Editor</button>
    <!-- <button v-if="!edit" @click="slugify">Slugify</button> -->
    </div>
    <icon v-if="edit" class="absolute right-0 top-0 text-3xl" name="close" @click="edit=!edit"/>
    <div class="flex flex-col bg-gray-100  text-sm" v-if="!edit && !loopEditor && products">
        
        <div :class="'w-full bg-gray-900 grid grid-cols-' + cols">
        <template v-for="field in Object.keys(schema)">
            <div class="capitalize font-bold p-2" v-if="schema[field].list">
                {{ field }}
            </div>
        </template>
        </div>
        <template v-for="product in products">
            <div :key="product._id" :class="'text-black w-full p-1 border-b border-l border-r cursor-pointer grid grid-cols-' + cols" v-if="product.name" @click="editor.current=product,edit=true">
                <template v-for="field in Object.keys(schema)">
                    <div :key="field" v-if="schema[field].list">
                        <span v-if="schema[field].type==='string'">{{ product[field] }}</span>
                        <div class="w-24" v-if="schema[field].type==='image'">
                            <!-- <img :src="product[field]" v-if="!product.hasOwnProperty('image')" class="w-24"/> -->
                            <span v-if="!product.hasOwnProperty('image')" class="w-24"></span>
                            <img :src="$imageURL(product.image)" class="w-24"/>
                        </div>
                        <span v-if="schema[field].type==='array'">
                            {{ product[field].length ? product.field.join(',') : '' }}
                        </span>
                        <span v-if="schema[field].type==='currency'">
                            {{ product[field] && parseInt(product[field]) ? Number(product[field]).toFixed(schema[field].precision) : '-' }}
                        </span>
                    </div>
                </template>
            </div>
        </template>
        <div class="grid grid-cols-3 p-2">
            <div>Total: {{ total }}</div>
            <navigation 
                size="4xl"
                @prev="skip>0?skip=skip-limit:null" 
                @next=" total - (skip+limit) > 0 ? skip=skip+limit:null"/>
            <div class="text-right">
                {{ skip+1 }} - {{ pageTotal }}
            </div>
        </div>
        
    </div>
    <product-edit v-if="edit" :id="editor.current._id"/>
    <products-loop-editor v-if="loopEditor" :plugin="plugin"/>
    <!-- <modal
        size="lg"
        position="modal"
        v-if="edit"
        @close="edit=!edit"
        buttons="save"
        @click_0="edit=!edit"
        @click_1="productSave">
        <div slot="title">{{ current.name }}</div>
        <div slot="content">
            <product-edit :id="current._id"/>
        </div>
    </modal> -->
    <modal
        size="lg"
        v-if="importFile"
        @close="importFile=!importFile"
        @click_0="importFile=!importFile"
        @click_1="importData">
        <div slot="title">Import Products</div>
        <moka-products-import slot="content"/>
    </modal>
    <modal
        size="lg"
        v-if="exportFile"
        @close="exportFile=!exportFile"
        @click_0="exportFile=!exportFile"
        @click_1="exportData">
        <div slot="title">Export Products</div>
        <moka-products-export slot="content"/>
    </modal>
    <modal
        v-if="categories"
        size="md"
        position="modal"
        @close="categories=!categories">
        <div slot="title">Categories</div>
        <products-categories slot="content"/>
    </modal>
</div>
</template>

<script>
import MokaProductsImport from './products.import'
import MokaProductsExport from './products.export'
import productsImportVue from './products.import.vue'
import { mapState } from 'vuex'
export default {
    name: 'MokaProducts',
    data:()=>({
        edit: false,
        loopEditor: false,
        categories: false,
        importFile: false,
        exportFile: false,
        products: null,
        current: null,
        limit: 10,
        skip:0,
        cols: 0,
        images: false,
        total:0,
        plugin: null
    }),
    components:{
        MokaProductsImport , MokaProductsExport,
        'product-edit'  : () => import ( './products.edit.vue' ),
        'products-categories' : () => import ( './products.categories.vue'),
        'products-loop-editor'   : () => import ( './products.loop.editor.vue')
    },
    computed:{
        ...mapState ( [ 'datastore' , 'editor'] ),
        schema(){
            let schema = this.datastore.schema.products
            this.plugin = this.$mapState().desktop.tabs [ this.$mapState().desktop.currentTab ].plugin
            Object.keys(schema).map ( field => {
                if ( schema[field].list ) this.cols++
            })
            return schema
        },
        pageTotal(){
            return ( this.skip + this.limit > this.total ) ? this.total : this.skip + this.limit
        }
    },
    watch:{
        skip(){
            this.qry()
        }
    },
    methods: {
        qry(){
            this.$api.service('products').find( { query: { $limit: this.limit , $skip: this.skip }}).then ( res => {
                this.products = res.data
                this.total = res.total
                this.products.map ( product => {
                    !product.hasOwnProperty('image') ?
                        product.image = null : null
                })
            })
        },
        importData(){
            return 
        },
        exportData(){
            return
        },
        productSave(){
            //this.editor.current.image_uri = this.editor.image
            
            this.$api.service ( 'products' ).patch ( this.editor.current._id , this.editor.current ).then ( res => {
                this.$message ( 'Product data saved' )
                this.editor.current = null
                this.edit = false
            })
        },
        slugify(){
            this.products.map ( prod => {
                prod['slug'] = this.$slugify(prod.name)
                this.$api.service('products').patch ( prod._id , prod ).then ( res => {
                    console.log ( res )
                })
            })
        }
    },
    mounted(){
        this.qry()

        /*this.$http.get ( 'content-type-builder/content-types' ).then ( res => {
            const uid = res.data.data.filter ( ct => {
                return ct.schema.name === 'Product'
            })
            return uid[0].uid
        }).then ( uid => {
            this.$http.get ( 'content-type-builder/content-types/' + uid ).then ( res => {
                this.schema = res.data.data.schema.attributes
            })
        })
        */
    }
}
</script>