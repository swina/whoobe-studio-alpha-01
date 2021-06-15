<template>
    <div class="mt-0 cursor-pointer h-screen text-xs theme-dark" :data="init">

        
        <!-- video -->
        <div v-if="editor.current.type==='video' || editor.current.type === 'audio'" class="customizer-item border-gray-900 pl-2" :class="group === 'video' ? 'bg-orange-400 text-white' : ''" @click="group='video'">
            <span class="">Audio/Video</span>
            <i class="material-icons absolute right-0 mr-2 text-gray-500">arrow_right</i>
        </div>
        <transition name="fade">
            <div  v-if="group==='video'" class="flex flex-col h-full text-gray-500 bg-gray-800 w-full absolute top-0 right-0 z-2xtop">
                <div class="bg-orange-400 text-black  flex flex-row p-1 items-center capitalize" @click="group=''"><i class="material-icons absolute right-0">chevron_right</i>Link/Anchor</div>
                <div class="w-full flex flex-row justify-around">
                    <div>
                        <input type="checkbox" v-model="editor.current.options.autoplay"/> autoplay
                    </div>
                    <div>   
                        <input type="checkbox" v-model="editor.current.options.loop"/> loop 
                    </div>
                    <div>
                        <input type="checkbox" v-model="editor.current.options.controls"/> controls
                    </div>
                </div>
            </div>
        </transition>

         <!-- link and anchor -->
        <div v-if="!$attrs.mode" key="itemLink" class="customizer-item border-gray-900 pl-2" :class="group === 'link' ? 'bg-orange-400 text-white' : ''" @click="toggle('link')">
                <span class="">Link/Anchor</span>
                <i class="material-icons absolute right-0 mr-2 text-gray-500">arrow_right</i>
        </div>
        <transition name="slideright">
            <div v-if="!$attrs.mode && group==='link'" class="flex flex-col h-full text-gray-500 bg-gray-800 w-full absolute top-0 right-0 z-2xtop">
                <div class="bg-orange-400 text-black border-gray-900 flex flex-row p-1 items-center capitalize" @click="group=''"><i class="material-icons absolute right-0">arrow_right</i>Link/Anchor</div>
                <div class="p-1 flex flex-col">
                    <label>Link</label>
                    <input class="dark w-full" type="text" v-model="editor.current.link"/>
                    <div class="flex flex-row items-center">
                        <label>Article/Page</label><icon name="refresh" @click="refreshArticles()"/>
                    </div>
                    <select class="dark w-full" v-model="editor.current.link">
                        <option v-for="(opt,o) in $mapState().datastore.dataset.articles" :value="'/' + opt.slug">{{ opt.title }}</option>
                    </select>
                    <label>Anchor</label>
                    <input class="dark w-full" type="text" v-model="editor.current.anchor"/>
                </div>
            </div>

             <!-- slider link next prev -->
            <div class="flex flex-col my-1 text-left text-gray-500" v-if="editor.current.category==='slider'">
                <label>Slide name</label>
                <input type="text" class="w-full dark" v-model="editor.current.name"/>
                <label>Slider Action</label>
                <select class="w-full dark" v-model="editor.current.action">
                    <option value=""></option>
                    <option value="slider_next">Next</option>
                    <option value="slider_prev">Prev</option>
                </select>
            </div>
        </transition> 

        <!-- Semantic -->
        <div v-if="!$attrs.mode && editor.current && editor.current.tag === 'container' && editor.current.tag != 'document'" key="semantic" class="customizer-item border-gray-900 pl-2" :class="group === 'semantic' ? 'bg-orange-400 text-white' : ''" @click="toggle('semantic')">
                 <span class="text-xs">Semantic</span>
                 <i class="material-icons absolute right-0 mr-2 text-gray-400">arrow_right</i>
        </div>
        <transition name="slideright">
        <div v-if="!$attrs.mode && group==='semantic'" class="flex flex-col h-full text-gray-500 bg-gray-800 w-full absolute top-0 right-0 z-2xtop cursor-pointer">
            <div class="bg-orange-400 text-black  flex flex-row p-1 items-center capitalize" @click="group=''"><i class="material-icons absolute right-0">chevron_right</i>Semantic</div>
            <div class="p-1 flex flex-col">
                <moka-options 
                    class="mb-0 p-2" 
                    v-if="group==='semantic'" 
                    attr="semantics"
                    v-model="editor.current.semantic" 
                    :css="editor.current.hasOwnProperty('semantic')?editor.current.semantic:''"/>
            </div>
        </div>
        </transition>


        <!-- Input -->
        <div v-if="!$attrs.mode && editor.current && editor.current.tag === 'input' && editor.current.tag != 'document'" key="semantic" class="customizer-item border-gray-900 pl-2" :class="group === 'input' ? 'bg-orange-400 text-white' : ''" @click="toggle('input')">
                 <span class="text-xs">Input field</span>
                 <i class="material-icons absolute right-0 mr-2 text-gray-400">arrow_right</i>
        </div>
        <transition name="slideright">
        <div v-if="!$attrs.mode && group==='input'" class="flex flex-col h-full text-gray-500 bg-gray-800 w-full absolute top-0 right-0 z-2xtop cursor-pointer">
            <div class="bg-orange-400 text-black  flex flex-row p-1 items-center capitalize" @click="group=''"><i class="material-icons absolute right-0">chevron_right</i>Input Field</div>
            <div class="p-1 flex flex-col">
                <label>Field name</label>
                <input class="dark w-full" type="text" v-model="editor.current.name"/>

                <label>Placeholder</label>
                <input class="dark w-full" type="text" v-model="editor.current.placeholder"/>
                <label>Field Value</label>
                <input class="dark w-full" type="text" v-model="editor.current.content"/>
                <div class="flex flex-row items-center">
                    <input class="dark" type="checkbox" v-model="editor.current.required"/> Required
                </div>
            </div>
            <div class="p-1 flex flex-col" v-if="editor.current.type === 'checkbox'">
                <div class="flex items-center text-base">
                    <input class="w-6 h-6 mr-2" type="radio" v-model="editor.current.display" value="checkbox"> Checkbox
                </div>
                <div class="flex items-center text-base my-2">
                    <input class="w-6 h-6 mr-2" type="radio" v-model="editor.current.display" value="toggle"> Toggle
                </div>
            </div>
            <div class="p-1 flex flex-col" v-if="editor.current.element === 'select'">
                Options
                <div class="flex flex-row flex-wrap">
                <template v-for="(option,i) in editor.current.options">
                    <chip :content="option" class="mb-1 bg-purple-500 text-white mr-2 rounded" icon="close" @click="editor.current.options.splice(i,1)"/>
                </template>
                </div>
                New option
                <input class="dark" type="text" value="" @keydown="addOption($event)"/>
                Display as 
                <div class="flex items-center text-base">
                    <input class="w-6 h-6 mr-2" type="radio" v-model="editor.current.display" value="chip"> Chip
                </div>
                <div class="flex items-center text-base my-2">
                    <input class="w-6 h-6 mr-2" type="radio" v-model="editor.current.display" value="select"> Select
                </div>
                <div class="flex items-center text-base">
                    <input class="w-6 h-6 mr-2" type="radio" v-model="editor.current.display" value="list"> List
                </div>
            </div>
        </div>
        </transition>


        <!-- Form -->
        <div v-if="!$attrs.mode && editor.current && editor.current.tag === 'form' && editor.current.tag != 'document'" key="form" class="customizer-item border-gray-900 pl-2" :class="group === 'form' ? 'bg-orange-400 text-white' : ''" @click="toggle('form')">
                 <span class="text-xs">Form Setting</span>
                 <i class="material-icons absolute right-0 mr-2 text-gray-400">arrow_right</i>
        </div>
        <transition name="slideright">
        <div v-if="!$attrs.mode && group==='form'" class="flex flex-col h-full text-gray-500 bg-gray-800 w-full absolute top-0 right-0 z-2xtop cursor-pointer">
            <div class="bg-orange-400 text-black  flex flex-row p-1 items-center capitalize" @click="group=''"><i class="material-icons absolute right-0">chevron_right</i>Form Settings</div>
            <div class="p-1 flex flex-col">
                <block-form-settings/>
                
            </div>
        </div>
        </transition>

        <template v-for="g in groups">
             <div :key="g.attr" class="customizer-item border-gray-900 pl-2" :class="g === group ? 'bg-orange-400 text-white' : ''" @click="toggle(g)">     
                 
                 <span class="text-xs">{{ g.label }}</span>
                 <i class="material-icons absolute right-0 mr-2 text-gray-500" v-if="g!= group">arrow_right</i>
                 <i class="material-icons absolute right-0 mr-2 text-gray-500" v-else>expand_less</i>
             </div>
             <transition name="slideright">
             <div v-if="g === group" class="whoobe-editor-tw-options bg-gray-800 text-gray-500 border-b border-gray-900 top-0 absolute w-full z-2xtop left-0 right-0 bottom-0">
                <div class="bg-orange-400 text-black  flex flex-row p-1 items-center capitalize" @click="group=''"><i class="material-icons absolute right-0">chevron_right</i> {{ g.label }}</div>
                <div :key="$randomID()" v-for="component in g.components" class="mb-1 p-1" :class="component.hasOwnProperty('group')? component.css :''">
                     <component 
                        :key="$randomID()"
                        :is="component.name" 
                        :component="component.name" 
                        :css="css" 
                        :stile="editor.current.style"
                        v-model="cssTw[component.attr]" 
                        :entity="editor.current"
                        :attr="component.attr" 
                        :icon="component.icon||null"
                        :classe="component.css||''"
                        :required="component.hasOwnProperty('required')? component.required :''"
                        :title="component.hasOwnProperty('title')?component.title:''"
                        :negative="component.hasOwnProperty('negative')?component.negative:false"
                        @stile="stile"
                        @clearstile="stile"
                        @blockcss="blockcss"
                        @css="update"/>
                        <!--:entity="$attrs.entity"-->
                 </div>
             </div>
             </transition>
        </template>
    </div>
</template>

<script>
import MokaBgcolor from './controls/tailwind.color'
import MokaBgGradient from './controls/tailwind.bg.gradient'
import MokaBgPosition from './controls/tailwind.bgposition'
import MokaBorderColor from './controls/tailwind.border.color'
import MokaBorderType from './controls/tailwind.border.type'
import MokaButton from './controls/tailwind.button'
import MokaCheckbox from './controls/tailwind.checkbox'
import MokaColor from './controls/tailwind.color'
import MokaGradient from './controls/tailwind.gradient'
import MokaGrid from './controls/tailwind.grid'
import MokaHeights from './controls/tailwind.height'
import MokaOptions from './controls/tailwind.options'
import MokaPosition from './controls/tailwind.position'
import MokaRange from './controls/tailwind.range'
//import MokaTextStyle from './controls/tailwind.text.style'
import MokaTextFont from './controls/tailwind.text.font'
import MokaWidths from './controls/tailwind.width'
import { mapState } from 'vuex'
import twgroups from '@/scripts/tw.groups'
export default {
    name: 'WhoobeTailwind',
    components: {
        'block-form-settings' : () => import ( '@/components/blocks/actions/block.form.settings.vue' ),
        MokaBgcolor,
        MokaBgGradient,
        MokaBgPosition,
        MokaBorderColor,
        MokaBorderType,
        MokaButton,
        MokaCheckbox,
        MokaColor,
        MokaGradient,
        MokaGrid,
        MokaPosition,
        MokaTextFont,
        //MokaTextStyle,
        MokaWidths,
        MokaHeights,
        MokaOptions,
        MokaRange,
    },
    data:()=>({
        cssTw:{},
        groups: null,
        group: '',
        allCss: '',
        allStyle: ''
    }),
    props: [ 'css' ],
    computed: {
        ...mapState ( ['editor'] ),
        init(){
            this.allCss = this.css
            return true
        }
    },
    watch:{
        cssTw:{
            handler(old,changed){
                let css = this.allCss + ' ' + this.$clean(Object.values(changed).join(' ')) 
                if ( !this.$attrs.mode ){
                    if ( this.$attrs.submenu ){
                        this.editor.current.css.submenu = this.allCss + ' ' + this.$clean(Object.values(changed).join(' '))
                        console.log ( 'submenu=>' , this.editor.current.css.submenu )
                    } else {
                        !this.editor.current.css.hasOwnProperty('css') ?
                            this.editor.current.css = this.allCss + ' ' + this.$clean(Object.values(changed).join(' ')) :
                                this.editor.current.css.css = this.allCss + ' ' + this.$clean(Object.values(changed).join(' ')) 
                    }
                } else {
                    if ( this.$attrs.cssKey && this.$attrs.mode === 'menu' ){
                        console.log ( this.editor.current.css[this.$attrs.cssKey] )
                        this.editor.current.css[this.$attrs.cssKey ] = this.allCss + ' ' + this.$clean(Object.values(changed).join(' '))
                    }
                }
            },
            deep:true
        },
    },
    mounted(){
        this.groups = twgroups
        this.allCss = this.css
        this.allStyle = this.editor.current.style
        
        //this.allStyle = this.editor.current.style
        let obj = []
        this.groups.forEach ( (g , i) => {
            if ( g.hasOwnProperty('filter') ){
                if ( g.filter.includes(this.editor.current.type)){
                    obj.push ( g )
                }
            } else {
                obj.push ( g )
            }
        })
        this.groups = obj
        
    },
    methods:{
        toggle(group){
            this.group === group ? this.group = '' : this.group = group
        },
        update(classe){
            //if ( !this.$attrs.mode ){
            this.allCss = this.$clean(this.allCss.replace(this.$clean(classe),' '))
            // } else {
            //     this.allCss = this.$clean(this.allCss.replace(this.$clean(classe),' '))
            //     console.log ( this.allCss )
            //     let css = this.allCss + ' ' + Object.values(this.cssTw).join(' ') 
            //     this.$emit ( 'css' , css  )
            // }
        },
        blockcss(classe){
            this.editor.current.css.css = classe
        },
        stile(stile){
            this.$emit('stile',stile)
        },
        clearstile(stile){
            this.allStyle = this.$clean(this.allStyle.replace(this.$clean(style),''))

        },
        refreshArticles(){
            this.$find('articles')
        },
        addOption (e){
            if ( e.keyCode === 13 && e.target.value.length ){
                this.editor.current.options.push ( e.target.value )
            }
        }
    }
}
</script>
