<template>
    <component
        container
        :data="$attrs.data?$attrs.data:null"
        :is="semantic"
        :id="doc.hasOwnProperty('anchor')? doc.anchor : doc.id"
        :data-display="hasEventDisplay"
        v-if="doc"
        :key="randomID"
        :class="classe(doc.css)" :style="doc.style + ' ' +  background(doc)" :ref="doc.id" >
        <div videobg v-if="doc.image && (doc.image.ext==='.mp4' || doc.image.ext==='webm' || doc.image.url.indexOf('.mp4') > -1)" :class="'absolute inset-0 ' ">  
            <video playsinline :poster="doc.image.previewUrl" class="object-cover object-center h-full w-full" autoplay loop>
                <source :src="doc.image.url"/>
            </video>
        </div>
        <block-carousel v-if="doc.hasOwnProperty('gallery') && doc.gallery" :block="doc"/>
        <block-slides v-if="doc.type === 'slides'" :block="doc"/>
        <template v-for="(block,b) in doc.blocks">
            <moka-element
                @click="elementAction"
                v-if="block && !block.hasOwnProperty('blocks') && block.type!='slides' && !block.hasOwnProperty('items') && !block.hasOwnProperty('plugin')"
                :key="block.id"
                :data="$attrs.data||''"
                :dataset="doc.hasOwnProperty('data')?doc.data:null"
                :currency="$attrs.currency||null"
                :el="block"
                :coords="[b]"
                :develop="false"/> 
            <block-preview-container
                :key="block.id"
                v-if="block && !block.hasOwnProperty('slider') && block.hasOwnProperty('blocks') && !block.hasOwnProperty('items')  && !block.hasOwnProperty('popup') && block.type!='plugin' && !block.hasOwnProperty('collection') && block.tag != 'menu' && block.type !='slides' && block.tag !='form' && block.type != 'popup'" @action="elementAction" 
                :data="$attrs.data||null"
                :currency="$attrs.currency||null"
                :doc="block" :animation="$attrs.animation"/>
            <!-- <moka-menu
                class="hidden md:block"
                :key="block.id"
                :el="block"
                v-if="block.tag === 'menu' && !block.hasOwnProperty('blocks')"/> -->
            
            <block-preview-menu 
                v-if="block.tag === 'menu' && block.hasOwnProperty('blocks')"
                :key="block.id"
                :el="block"
                :status="$mapState().desktop.menu_responsive"/>
            
            
            <block-form
                v-if="block.tag === 'form'"
                :key="block.id"
                :form="block"
                :editor="false">
            </block-form>

            <!-- <moka-menu-responsive
                class="md:hidden"
                :key="block.id"
                :el="block"
                v-if="block.tag === 'menu'"/> -->
            

            <moka-slider 
                :key="block.id" 
                :ref="block.id" 
                v-if="block && (block.hasOwnProperty('slider') || block.type === 'slides')" 
                :develop="true" 
                :embeded="true" 
                :doc="block" 
                :editor="true"/>
            
            <moka-flipbox
                :key="block.id" 
                :ref="block.id" 
                v-if="block && block.hasOwnProperty('image_flip')" 
                :develop="true" 
                :embeded="true"
                :currency="$attrs.currency||null" 
                :doc="block" 
                :editor="true"/>
               
            <block-popup
                :key="block.id" 
                :ref="block.id" 
                v-if="block && block.type === 'popup'" 
                :develop="true" 
                :embeded="true" 
                :doc="block" 
                :editor="true"/>
            
            
            
            <moka-loop 
                     :key="block.id" 
                    v-if="block.hasOwnProperty('collection')"
                    :doc="block" 
                    :level="b+1" 
                    :coords="b"
                    :editor="true" 
                    />
            <plugin-wrapper v-if="block && block.hasOwnProperty('plugin')" :block="block"  :plugin="block.plugin" :component="block.plugin"/>
            <!-- <plugin-wrapper 
                :key="block.id"
                v-if="block && block.type==='plugin'" 
                :settings="block.plugin.editor.settings"  
                :doc="block"  
                :plugin="block" 
                :component="block.plugin.component"/> -->

        </template>
    </component>

</template>

<script>
import MokaElement from './moka.element.component'
import draggable from 'vuedraggable'
import MokaSlider from './moka.slider'
import MokaFlipbox from './moka.flipbox'
import MokaPluginsWrapper from '@/components/common/Plugins.Wrapper'
import MokaLoop from './moka.preview.loop'
import MokaMenu from './elements/moka.menu'
import MokaMenuResponsive from './elements/moka.menu.responsive'
import BlockCarousel from './block.preview.carousel'

import { mapState } from 'vuex'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin ( ScrollTrigger )
const plugins = [ScrollTrigger];
import js from 'jsonpath' 
import { eventBus } from '@/main'
export default {
    name: 'BlockPreviewContainer',
    components: { MokaElement , MokaSlider , draggable , MokaFlipbox , MokaPluginsWrapper , MokaLoop , MokaMenu , MokaMenuResponsive, BlockCarousel ,
    'block-preview-menu' : () => import ( './block.preview.menu.vue' ) ,
    'block-slides'       : () => import ( '@/components/plugins/slides/slides.vue'),
    'block-form'         : () => import ( './block.preview.form.vue' ),
    'block-popup'        : () => import ( './moka.popup.vue' )
    },
    props: { 
        doc : { type: Object }  
    },
    data:()=>({
        modal: true,
        animation: null,
        randomID: null,
        timer: null,
        index: 0,
        width:0,
        menu_responsive: false,
        display: true //for mobile, listen to eventBus => display to remove hidden class 
    }),
    computed:{
        ...mapState(['moka']),
        animations(){
            return gsapEffects
        },
        semantic(){
            return this.doc.semantic ? this.doc.semantic : this.doc.tag != 'form' ? 'div' : 'form'
        },
        responsive(){
            return this.doc.hasOwnProperty('responsive') && this.doc.responsive && this.width < 640 ? true : false
        },
        hasEventDisplay(){
            if ( !this.doc.hasOwnProperty('event_display') ) {
                this.display = true
                return
            }
            if ( this.doc.event_display.length ) {
                if ( !this.doc.event_display.includes ( 'xs:') ){
                    this.display = false
                } else {
                    if ( this.width < 400 ){
                        this.display = false
                    } else {
                        this.display = true
                    }
                }
                return 
            }
            return
           
        }
        /*
        popup(){
            if ( this.doc.hasOwnProperty('popup')  ){
                if ( this.doc.popup.trigger ){
                    if ( this.doc.popup.trigger === this.moka.popup ){
                        this.modal = true
                        
                    } else {
                        this.modal = false
                    }
                }
            }
        },
        popupCSS(){

            return this.doc.hasOwnProperty ( 'popup' ) ? 'moka-popup-' + this.randomID : ''
        }
        */
    },
    
    methods:{
        
        classe(css){
            if ( !css ) return
                let cls = css
                css.hasOwnProperty('css') ? cls = css.css + ' ' + css.container : cls = css 
                if ( !this.display ) cls += ' hidden '

                return cls.includes('absolute') || cls.includes('fixed') || cls.includes('modal') ? cls : cls + ' relative '
        },
        stile(block,doc){
            if ( !block || !doc ) return 
            let stile = ''
            if ( block.hasOwnProperty('fontFamily')){
                stile += 'font-family:\"' + block.fontFamily + '\"; '
            }
            return block.hasOwnProperty('style') ? block.style + stile : stile
        },
        background(block){
            if ( !block ) return ''
            if ( block.hasOwnProperty('gallery') && !block.gallery || !block.hasOwnProperty('gallery')){ 
                let bgImage = ''
                block.image && block.image.url?
                    block.image && block.image.url && block.image.url.indexOf('.mp4') < 0 ? 
                            bgImage = ' background-image:url(' + this.$imageURL(block.image) + ');' :
                                null  : null
                return bgImage
            }
        },
        nextCarousel(i,block){
            document.querySelector('#' + block.id ).style.backgroundImage = 'url(' + this.$imageURL(block.gallery.images[i])  + ');' 
        },
        elementAction(action){
            this.$emit('action',action)
        },
        animate(element,id){
            let vm = this
            //if ( this.$refs && element.hasOwnProperty('gsap') && element.gsap.animation && !this.doc.hasOwnProperty('popup') ){
                let ani = gsap.effects[element.gsap.animation]( this.$refs[id] ,{
                    trigger: this.$refs[id],
                    duration: parseFloat(element.gsap.duration),
                    delay: parseFloat(element.gsap.delay),
                    ease: element.gsap.ease
                })
                ScrollTrigger.create({
                    id: id,
                    start: "center 99%",
                    trigger: this.$refs[id],
                    toggleActions: "play pause restart none",
                    animation:ani,
                    onEnter: ()=>{ 
                        if ( element.gsap.delay ){
                            ani.play()
                        } else {
                            ani.play(0)
                        }
                    },
                    
                });
                
                    
            //}
        }
    },
    watch:{
        width(value){
            if ( this.doc && this.doc.hasOwnProperty('event_display') ) {
                if ( this.doc.event_display.length ) {
                    if ( !this.doc.event_display.includes ( 'xs:') ){
                        this.display = false
                    } else {
                        if ( value < 400 ){
                            this.display = false
                        } else {
                            this.display = true
                        }
                    }
                }
            }
        }
    },
    mounted(){
        //this.randomID = this.$randomID()
        window.scrollTo(0,0)
        this.width = window.innerWidth
        window.addEventListener('resize',()=>{
            this.width = window.innerWidth
            
        })
        this.doc.type === 'slides' ?
            console.log ( 'Slides detected' ) : null 
        //if ( !this.doc && !this.doc.hasOwnProperty('gsap') && !this.doc.gsap && !this.doc.gsap.animation ) return 
        if ( this.doc.hasOwnProperty('gsap') && this.doc.gsap.animation  ){
            if ( this.doc.hasOwnProperty ( 'popup') && this.doc.popup.trigger ) return
                this.$animation( this.doc , this.doc.id , this.$refs )
        }
        
        if ( this.doc.hasOwnProperty ('event_display') ){
            eventBus.$on( this.doc.event_display , (data) => {
                if ( !this.doc.event_display.includes('xs:') ){
                    this.display =! this.display
                } else {
                    if ( window.innerWidth < 400 ){
                        this.display =! this.display
                    }
                }
                if ( this.doc.hasOwnProperty('gsap') && this.doc.gsap.animation  ){
                    this.$animation( this.doc , this.doc.id , this.$refs )  
                }
            })
        }
        return
        
    }
}
</script>
<style>
.animateBg {
    animation : imageAnimation 12s linear infinite 0s;
}
@keyframes imageFade { 
    0% { opacity: 0; animation-timing-function: ease-in; }
    8% { opacity: 1; animation-timing-function: ease-out; }
    25% { opacity: 1 }
    50% { opacity: 0 }
    100% { opacity: 0 }
}

@keyframes imageSlider {
    0% {opacity:1;visibility: visible}
    99% {opacity:1;visibility: hidden}
}  
@keyframes imageSlide { 
    0% { opacity:0 ; background-position-x: 0%; animation-timing-function: linear; }
    2% { opacity:1 ; background-position-x: 0%;  animation-timing-function: linear; }
    25% { opacity: 1 }
    95% { opacity: 0 ; }
    100% { opacity: 0;background-position-x: 100%}
}
</style>