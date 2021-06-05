<template>
    <div v-if="settings" class="p-2 bg-gray-100 text-black text-base h-3/4 relative overflow-y-auto">
        <div class="flex flex-row">
            <template v-for="section in Object.keys(settings)">
                <button @click="mode=section,fieldIndex=null" class="capitalize text-base" :class="mode===section?'bg-indigo-500':''">{{ section }}</button>
            </template>
        </div>
        <!-- <div class="w-full" v-if="mode==='single'" @click="layoutSelect=!layoutSelect">
            <label>Layout</label>
            <single-layouts class="w-full theme-dark" :layout="layout" @layout="setLayout"/>
        </div> -->
        <div class="grid grid-cols-3 gap-2 w-full bg-gray-100 text-black text-base">
            <template v-for="field in Object.keys(settings[mode])">
                
                <label class="capitalize" :class="isObject(settings[mode][field]) || isArray(settings[mode][field])?'col-span-3 bg-gray-700 text-white':'font-bold'">
                    {{ field }}
                </label>

                <div class="col-span-2" v-if="!isObject(settings[mode][field]) && !isArray(settings[mode][field])">
                    <input class="w-full"  :key="field" v-if="field !='css' && isType(settings[mode][field])" :type="isType(settings[mode][field])" v-model="settings[mode][field]"/>
                    <textarea class="w-full h-20"  :key="field" v-if="field ==='css' && isType(settings[mode][field])" v-model="settings[mode][field]"/>
                </div>
                
                <div v-if="isObject(settings[mode][field]) && !isArray(settings[mode][field])" class="col-span-3 grid grid-cols-3 justify-start"> 
                    <template v-for="f in Object.keys(settings[mode][field])">
                        
                        <label class="font-bold capitalize">
                            {{ f }}
                        </label>
                        <div v-if="isObject(settings[mode][field][f])" class="col-span-2 flex flex-col">

                            <template v-for="ff in Object.keys(settings[mode][field][f])">
                                <label>{{ ff }} </label>
                                <input :key="ff" :class="isType(settings[mode][field][f][ff]) != 'checkbox'?'w-full':''" v-if="isType(settings[mode][field][f][ff])" :type="isType(settings[mode][field][f][ff])" v-model="settings[mode][field][f][ff]"/>
                            </template>
                        </div>
                        <div v-else class="col-span-2">    
                            <input :key="f" :class="isType(settings[mode][field][f]) != 'checkbox'?'w-full':''" v-if="isType(settings[mode][field][f])" :type="isType(settings[mode][field][f])" v-model="settings[mode][field][f]"/>
                        </div>
                    </template>
                </div>
                
                

                <div v-if="isArray(settings[mode][field])" class="col-span-3">
                        <!-- gap-2 grid grid-cols-' + (Object.keys(settings[mode][field][0]).length  + 1) -->
                        <div :key="fn + '_' + i" v-for="(fn,i) in settings[mode][field]" class="border p-1 flex flex-col mb-2" :class="fieldIndex===i?'border-black':''">
                            <div @click="fieldIndex=i" class="w-full flex flex-row items-center flex-wrap">
                                <input type="text" v-model="settings[mode][field][i].name"/>
                                <input type="text" class="ml-2 w-8" v-model="settings[mode][field][i].col" title="Set the layout slot position"/>
                                <icon name="expand_less" class="ml-4" @click="i > 0 ?moveUp(i):null"/>
                                <icon name="brush" class="ml-2" @click="fieldIndex=i"/>
                                <icon name="close" class="ml-2" @click="settings[mode][field].splice(i,1)"/>
                                <transition name="fade">
                                    <div v-if="fieldIndex===i" class="flex flex-col p-1 w-full">
                                        CSS <textarea v-model="settings[mode][field][i].css" class="w-full"/>
                                   </div>
                                </transition>
                            </div>
                            <!--<input  v-for="fvalue in Object.keys(fn)" class="w-32 mr-2" v-if="fvalue != 'css' " :type="isType(settings[mode][field][i][fvalue])" v-model="settings[mode][field][i][fvalue]" :data-tag-container="fvalue"/>
                            <textarea v-for="fvalue in Object.keys(fn)"  v-if="fvalue==='css'" class="w-1/2" v-model="settings[mode][field][i][fvalue]"/>-->
                        </div>
                    <button v-if="field==='fields'" @click="fields=!fields">Add field</button>
                    <select v-model="addField" v-if="fields">
                        <option v-for="field in Object.keys(schema)" :value="field">{{ field }}</option>
                    </select>
                    <button @click="add_to_cart_button" class="ml-2">Add add to cart button</button>
                    <!-- <div class="grid" :class="'grid-cols-' + settings[mode].cols + ' ' + settings[mode].css">
                        Example
                    </div> -->
                    
                </div>

            </template>
            
        </div>
        <!-- <modal 
            v-if="fields"
            size="sm"
            position="modal"
            @close="fields=!fields"
            buttons="none">
            <div slot="title">Available fields</div>
            <div slot="content" class="p-2 bg-gray-100 text-black cursor-pointer" title="Click to add a field">
                <div v-for="field in Object.keys(schema)" class="p-1 mb-1 border">
                    {{ field }}
                </div>
            </div>
        </modal> -->
    </div>
</template>
<script>
import model from '../model.js'
export default {
    name: 'WhoobeStorePluginSettings',
    components: {
        'single-layouts' : () => import ( './single.layouts.vue' )
    },
    data:()=>({
        settings:  null,
        mode: null,
        schema: null,
        fields: false,
        addField: null,
        fieldIndex: null,
        layout:1, 
        layoutSelect: false
    }),
    watch:{
        addField(v){
            let obj = {
                name: v,
                col: 1, 
                css: ''
            }
            this.settings[this.mode].fields.push ( obj )
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
        }
    },
    mounted(){
        this.schema = model
        this.settings = this.$mapState().editor.current.plugin.settings
        this.layout = this.settings.single.layout
        this.mode = Object.keys(this.settings)[0]
        this.$attrs.customize ? this.mode = this.$attrs.customize : null
    }
}
</script>