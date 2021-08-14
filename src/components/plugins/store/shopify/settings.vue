<template>
    <div v-if="settings" class="p-2 dark-theme text-base h-3/4 relative overflow-y-auto overflow-x-hidden">
        <div class="flex flex-row">
            <template v-for="section in Object.keys(settings)">
                <button @click="mode=section,fieldIndex=null" class="lg capitalize text-base" :class="mode===section?'bg-indigo-500':''">{{ section }}</button>
            </template>
        </div>
        
        <div class="grid grid-cols-3 p-2 w-full dark-theme text-base">
            <template v-for="field in Object.keys(settings[mode])">
                
                <label class="capitalize" :class="isObject(settings[mode][field]) || isArray(settings[mode][field])?'col-span-3 p-1 text-white':'font-bold'">
                    {{ field }}
                </label>

                <div class="col-span-2 mb-1" v-if="!isObject(settings[mode][field]) && !isArray(settings[mode][field])">
                    
                    <input class="w-full dark"  :key="field" v-if="field !='css' && isType(settings[mode][field])" :type="isType(settings[mode][field])" v-model="settings[mode][field]" @focus="focusField=field"/>

                    <textarea class="w-full h-20 dark"  :key="field" v-if="field ==='css' && isType(settings[mode][field])" v-model="settings[mode][field]"/>
                </div>
                <div v-if="isObject(settings[mode][field]) && !isArray(settings[mode][field])" class="col-span-3 flex flex-row justify-start w-full bg-gray-700"> 
                    <template v-for="f in Object.keys(settings[mode][field]).sort()">
                        <div class="border-r border-gray-900 hover:bg-indigo-600 text-sm capitalize bg-gray-700 py-1 px-2 cursor-pointer" :class="group===f?'bg-indigo-600 text-white':''" @click="group=f">{{ f }}</div>
                    </template>
                     
                </div>
                <div v-if="group && isObject(settings[mode][field][group])" class="col-span-3 p-2 flex flex-col mb-1 bg-gray-900">
                    <template v-for="ff in Object.keys(settings[mode][field][group])">
                        <div class="grid grid-cols-4 mb-1">
                            <label class="capitalize">{{ ff }} </label>
                            <input class="col-span-3" :key="ff" :class="isType(settings[mode][field][group][ff]) != 'checkbox'?'w-full dark':'dark'" v-if="isType(settings[mode][field][group][ff])" :type="isType(settings[mode][field][group][ff])" v-model="settings[mode][field][group][ff]" @focus="focusField=ff"/>
                        </div>
                    </template>
                </div>
                <div v-else class="col-span-3">    
                    <input class="my-1" :key="group" :class="isType(settings[mode][field][group]) != 'checkbox'?'w-full dark':'dark'" v-if="isType(settings[mode][field][group])" :type="isType(settings[mode][field][group])" v-model="settings[mode][field][group]" @focus="focusField=group"/>
                </div>
                <div v-if="mode==='filter' && field === 'items'" class="col-span-2">
                    Click to add the option to the filter section
                    <div  class="flex flex-row">
                    <template v-for="filter in Object.keys(settings.general.display)">
                        <button v-if="settings.general.display[filter].filter" class="lg mr-2 rounded capitalize" @click="addFilterOption(settings.general.display[filter])">
                            {{ filter }}
                        </button>
                    </template>
                    </div>
                </div>
                
                

                <div v-if="isArray(settings[mode][field])" class="col-span-3">
                        
                        <div :key="fn + '_' + i" v-for="(fn,i) in settings[mode][field]" class="p-1 flex flex-col mb-2" :class="fieldIndex===i?'border rounded':''">
                            <div @click="fieldIndex=i" class="w-full flex flex-row items-center flex-wrap">
                                <input type="text" class="dark" v-model="settings[mode][field][i].name"/>
                                <input type="text" class="ml-2 w-8 dark" v-model="settings[mode][field][i].col" title="Set the layout slot position"/>
                                <icon name="expand_less" class="ml-4" @click="i > 0 ?moveUp(i):null"/>
                                <icon name="brush" class="ml-2" @click="fieldIndex=i"/>
                                <icon name="close" class="ml-2" @click="settings[mode][field].splice(i,1)"/>
                                <transition name="fade">
                                    <div v-if="fieldIndex===i" class="flex flex-col p-1 w-full">
                                        CSS <textarea v-model="settings[mode][field][i].css" class="w-full dark"/>
                                   </div>
                                </transition>
                            </div>
                        </div>
                    <button class="lg rounded info" v-if="field==='fields'" @click="fields=!fields">Add field</button>
                    <select v-model="addField" v-if="fields">
                        <option v-for="field in Object.keys(schema)" :value="field">{{ field }}</option>
                    </select>
                    <button v-if="mode==='loop' || mode==='single'" @click="add_to_cart_button" class="lg rounded ml-2 info">Add add to cart button</button>
                </div>

            </template>
            <button class="absolute top-0 right-0 mr-2 px-2 py-1" @click="copyTemplate()">Copy Template</button>
        </div>
        <modal 
            v-if="ids"
            size="sm"
            position="modal-top-left"
            @close="ids=!ids">
            <div slot="title">Select products</div>
            <div slot="content" class="relative overflow-y-auto h-3/4">
                <template v-for="product in products">
                    <div class="relative p-2 mb-1 border border-gray-900 text-gray-600 cursor-pointer flex flex-row items-center" @click="setIds(product)">
                        <img :src="Array.isArray(product.assets)?$imageURL(product.assets[0]):$imageURL(product.assets)" class="w-10 h-10 object-cover mr-1"/>
                        {{ product.name }}
                        <icon v-if="settings.loop.records.ids.includes(product.name)" name="check" css="absolute right-0 text-lime-500"/>
                    </div>
                </template>
            </div>
        </modal>
        
    </div>
</template>
<script>
export default {
    name: 'WhoobePluginSettings',
    data:()=>({
        settings:  null,
        mode: null,
        schema: null,
        fields: false,
        group: '',
        addField: null,
        fieldIndex: null,
        layout:1, 
        layoutSelect: false,
        focusField: null,
        ids: false,
        products: null,
        productsIds:[]

    }),
    watch:{
        addField(v){
            let obj = {
                name: v,
                col: 1, 
                css: ''
            }
            this.settings[this.mode].fields.push ( obj )
        },
        focusField(v){
            v === 'ids' ?
                this.ids =! this.ids : this.ids = false
        }
    },
    methods:{
        isType(field){
            let type = typeof field
            return type === 'string' ? 'text' :
                type === 'boolean' ? 'checkbox' : 
                    type === 'number' ? 'number' :
                        false
        },
        isArray ( field ){
            return Array.isArray ( field ) ? true : false
        },
        isObject ( field ){
            return typeof field === 'object' && !Array.isArray(field) ? true : false
        },
        add_to_cart_button(){
            let obj = {
                name: 'add_to_cart',
                col: 1, 
                css: 'snipcart-add-item'
            }
            this.settings[this.mode].fields.push ( obj )
        },
        moveUp(index){
            let option = this.settings[this.mode].fields[index] 
            //parent.splice(i,1)
            //parent.splice(i-up,0,this.el)
            this.settings[this.mode].fields.splice(index,1)
            this.settings[this.mode].fields.splice(index-1,0,option)
        },
        setLayout(layout){
            this.settings[this.mode].layout = layout
            this.layout = layout
        },
        copyTemplate(){
            window.localStorage.setItem ('whoobe-shop-template',JSON.stringify(this.settings[this.mode]))
            this.$message ( 'Template copied' )
        },
        setIds(product){
            let ids = []
            this.settings.loop.records.ids ?
                ids = this.settings.loop.records.ids.split(',') : null
            if ( ids && ids.includes ( product.name ) ){
                ids = ids.filter ( name => name != product.name )
            } else {
                ids.push ( product.name )
            }
            this.settings.loop.records.max = ids.length
            this.settings.loop.records.ids = ids.join(',')
        },
        addFilterOption(filter){
            this.settings.filter.items.push ( filter )
            this.settings.filter.items = [ ...new Set(this.settings.filter.items) ]
        }
    },
    mounted(){
        this.schema = this.$mapState().datastore.shopify.schema
        this.settings = this.$mapState().editor.current.plugin.settings
        this.layout = this.settings.single.layout
        this.mode = Object.keys(this.settings)[0]
        this.$attrs.customize ? this.mode = this.$attrs.customize : null
        this.$api.service ( 'products' ).find ( {
            query : {
                $limit: 200,
                $sort : { category: 1 , name : 1},
                type: 'product'
            }
        }).then ( res => {
            this.products = res.data
        })
    }
}
</script>