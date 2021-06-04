<template>
    <div v-if="editor.current" class="bg-gray-100 text-black p-2 text-lg relative">
        <icon class="absolute right-0 top-0 text-3xl" name="close" @click="$emit('close')"/>
        <div class="flex flex-row items-center">
            <icon :name="active?'toggle_on':'toggle_off'" class="text-5xl" :class="active?'text-green-500':'text-red-500'" @click="active=!active"/> Active
        </div>
        <div class="grid grid-cols-2 gap-4 p-2 bg-gray-100 text-gray-700">
            <template v-for="field in Object.keys(schema)">
                <div v-if="schema[field].edit" class="flex flex-col text-gray-800">
                    <label class="capitalize">{{ field }}</label>
                    <input type="text" class="p-2 bg-white rounded border text-base w-full" v-if="schema[field].type==='string'" v-model="editor.current[field]"/>
                    <input type="checkbox" v-if="schema[field].type==='boolean'" v-model="editor.current[field]"/>
                    <textarea v-if="schema[field].type==='text'" class="p-2 bg-white rounded border text-base w-full h-32" v-model="editor.current[field]"/>
                    <input type="text" class="p-2 bg-white rounded border text-base" v-if="schema[field].type==='currency'" min="0" v-model="editor.current[field]"/>
                    <div  v-if="schema[field].type==='image_uri'">
                        <div class="flex flex-row">
                            <img v-if="editor.current.assets" :src="productImage" class="w-64 h-56 object-cover"/>
                            <div class="flex flex-row flex-wrap">
                                <template v-for="(asset,i) in editor.current.assets" v-if="editor.current.assets.length > 1">
                                    <img v-if="i>0" :src="$imageURL(asset)" class="w-16 h-16 border object-cover ml-1 mb-1 mr-1" :title="asset"/>
                                </template>
                            </div>
                        </div>
                        <button @click="assetMode='replace',$action('media')">Replace</button> <button @click="assetMode='add',$action('media')">Add</button>
                    </div>
                    <div v-if="schema[field].type==='list' && !field==='facets'" class="flex flex-row flex-wrap">
                        <template v-for="f in editor.current[field].split(schema[field].separator)">
                            <chip icon="close" :content="f" css="text-base bg-indigo-400 rounded text-white mr-2"/>
                            <!-- <div class="flex items-center p-1 text-base bg-indigo-400 rounded text-white mr-2">{{ f }} <icon name="close"/></div> -->
                        </template>    
                    </div>
                    <div v-if="field==='category'" class="flex flex-row flex-wrap">
                        <chip v-if="editor.current.category" icon="close" :content="editor.current.category" css="text-base bg-indigo-400 rounded text-white mr-2"/>

                        <!--<div v-if="editor.current.category" class="flex items-center p-1 text-base bg-indigo-400 rounded text-white mr-2">{{ editor.current.category }} <icon name="close"/></div>-->
                        <select v-model="collection" class="p-2 bg-white" @change="getFacets()">
                            <option v-for="category in categories" :value="category">{{ category.name }}</option>
                        </select>
                    </div>
                    <div v-if="field==='facets'" class="flex flex-row flex-wrap">
                        <select v-model="productFacet" class="p-2 bg-white" @change="addFacet()">
                            <option v-for="facet in collectionFacets" :value="facet">{{ facet.name }}</option>
                        </select>
                        <template v-if="Array.isArray(editor.current.facets)" v-for="(facet,i) in editor.current.facets">
                            <chip v-if="facet" css="text-base bg-teal-400 rounded text-white mr-2" :content="facet" icon="close" @click="editor.current.facets.splice(i,1)"/>
                            <!--<div v-if="facet" class="flex items-center p-1 text-base bg-teal-400 rounded text-white mr-2">{{ facet }} <icon name="close" @click="editor.current.facets.splice(i,1)"/></div>-->
                        </template>
                    </div>
                </div>
            </template>
            
           
        </div>
         <div class="flex flex-col w-full p-2 relative mb-8">
                <icon name="add" @click="addOption()" class="text-black text-3xl absolute top-0 right-0 m-2"/>
                <div class="grid grid-cols-3 gap-3 border p-2 items-center justify-center">
                    <div>Option<span v-if="variations && variations.length">/Variation</span></div>
                    <div>SKU</div>
                    <div>Price</div>
                    <div>
                        <input type="text" class="p-2 bg-white rounded border text-base" v-model="editor.current.optionValues||editor.current.name"/>
                    </div>
                    <div>
                        <input type="text" class="p-2 bg-white rounded border text-base" v-model="editor.current.sku"/>
                    </div>
                    <div>
                        <input type="text" class="p-2 bg-white rounded border text-base" v-model="editor.current.price"/>
                    </div>
                    <template v-for="(variation,i) in variations" v-if="variations">
                        <div>
                            <input type="text" class="p-2 bg-white rounded border text-base" v-model="variations[i].optionValues"/>
                        </div>
                        <div>
                            <input type="text" class="p-2 bg-white rounded border text-base" v-model="variations[i].sku"/>
                        </div>
                        <div>
                            <input type="text" class="p-2 bg-white rounded border text-base" v-model="variations[i].price"/>
                            <icon name="close" class="ml-4 text-3xl" @click="removeOption(variation._id,i)"/>
                        </div>
                    </template>
                </div>
        </div>
        <div class="w-full text-center">
            <button class="danger rounded lg m-auto mx-1" @click="$emit('close')">Close</button>
            <button class="success rounded lg m-auto mx-1" @click="saveProduct()">Save</button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import model from '../model.js'
export default {
    name: 'WhoobeProductEdit',
    data:()=>({
        active: true,
        current: null,
        assetMode: 'replace',
        images: false,
        variations: null,
        categories: null,
        collection:null,
        collectionFacets: null,
        productFacet: null,
        facets: null
    }),
    props: ['id'],
    computed:{
        ...mapState(['editor']),
        schema(){
            return model
            //return this.$mapState().datastore.schema.products
        },
        productImage(){
            if ( this.assetMode === 'replace' && this.editor.current.image ){
                !Array.isArray(this.editor.current.assets) ?
                    this.editor.current.assets = [ this.editor.current.image.url ] : this.editor.current.assets[0] = this.editor.current.image.url 
            } else {
                if ( !Array.isArray(this.editor.current.assets) ) { 
                    let assets = [ this.editor.current.assets ]
                    this.editor.current.image ? assets.push ( this.editor.current.image.url ) : null
                    console.log ( assets )
                    this.editor.current.assets = assets
                } else {
                    if ( this.editor.current.image )
                        this.editor.current.assets.push ( this.editor.current.image.url )
                        this.editor.current.image = null
                }
            }
            return ( this.$imageURL(this.editor.current.assets[0]) )
        }
    },
    watch:{
        active(v){
            this.editor.current.active = v
        }
    },
    methods:{
        saveProduct(){
            this.editor.current.optionValues = this.editor.current.optionValues.replaceAll('|',' ')
            this.editor.current.category = this.collection.name
            this.editor.current.category_id = this.collection._id
            this.$api.service ( 'products' ).patch ( this.editor.current._id , this.editor.current ).then ( res => {
                this.$message ( 'Product saved' )
                console.log ( res )
                if ( this.variations && this.variations.length ){
                    this.variations.forEach ( variation => {
                        this.$api.service ( 'products' ).patch ( variation._id , variation ).then ( res => {
                            console.log ( 'save variation' , res )
                        })
                    })
                }
            })
        },
        getFacets(){
            this.editor.current.category = this.collection.name 
            this.$api.service ( 'categories' ).find ( { query: { collection: this.collection._id }} ).then ( res => {
                 this.collectionFacets = res.data
            })
        },
        addFacet(){
            console.log ( this.productFacet )
            !Array.isArray(this.editor.current.facets) ? 
                this.editor.current.facets = [ this.productFacet.name ] : 
                    !this.editor.current.facets.includes ( this.productFacet.name ) ? this.editor.current.facets.push ( this.productFacet.name ) : null
        },
        removeFacet(i){
            this.editor.current.facets.splice(i,1)
        },
        addOption(){
            let obj = Object.assign ( {} , this.editor.current )
            obj.parent = obj.sku
            obj.sku = ''
            obj.type = 'variation'
            delete obj._id
            delete obj.createdAt
            delete obj.updatedAt
            this.$api.service ( 'products').create ( obj ).then ( res => {
                this.variations.push ( res )
            })
        },
        removeOption(id,index){
            this.$api.service ( 'products' ).remove ( id ).then ( res => {
                this.variations.splice(index,1)
            })
        }
    },
    mounted(){
        this.$api.service('products').find ( { query: { $limit:50 , parent: this.editor.current.sku , $sort : { optionValues:1 }} }).then ( res => {
            this.variations = res.data
        })
        this.$api.service('categories').find ( { query: { $limit:50 , type: 'product' , $sort: { name: 1 } } }).then ( res => {
            this.categories = res.data
            this.collection = this.editor.current.category ? res.data.filter(cat=>{ return cat.name === this.editor.current.category } )[0] : null
            if ( this.collection ) this.getFacets()
        })
        !this.editor.current.hasOwnProperty('active') ?
            this.editor.current.active = true : null
        this.facets = this.editor.current.facets ?  Array.isArray(this.editor.current.facets) ? null : this.editor.current.facets.split('|') : null
        // this.editor.current.facets = facets ? null : facets
    }
}
</script>