<template> 
    <div :key="refreshID" :ref="doc.id" :class="pageCss(doc.css) + ' m-auto relative overflow-y-auto pb-10  z-top overflow-x-hidden '" :style="stile(doc)" id="content">
        <!-- 1st level - BLOCKS LOOP -->
        <span v-if="!doc.hasOwnProperty('slider')">

            <template v-for="(block,b) in doc.blocks">
                <div videobg v-if="block.image && (block.image.ext==='.mp4' || block.image.ext==='webm')" :class="'absolute ' + block.css.css">  
                    <video playsinline :poster="block.image.previewUrl" class="object-cover h-full w-full" autoplay loop>
                        <source :src="block.image.url"/>
                    </video>
                </div>
                <!--v-if="!block.hasOwnProperty('slider') && !block.hasOwnProperty('collection') && !block.hasOwnProperty('popup') && block.type != 'slides'"-->
                <block-container 
                    :key="block.id" 
                    v-if="block && block.type === 'grid' || block.type === 'flex' || block.type === 'slides'"
                    :doc="block" 
                    :level="b+1" 
                    :coords="b" 
                    />
                
                <!-- <block-preview-slides 
                    v-if="block && block.type === 'slides'"
                    :doc="block"
                    :level="b+1"
                    :key="block.id"/> -->
                <!-- <moka-loop 
                     :key="block.id" 
                    v-if="block.hasOwnProperty('collection')"
                    :doc="block" 
                    :level="b+1" 
                    :coords="b" 
                    />
                -->
                
                <block-popup
                    :key="block.id" 
                    :ref="block.id" 
                    v-if="block && block.type === 'popup'" 
                    :develop="true" 
                    :embeded="true" 
                    :doc="block" 
                    :editor="true"/>
                   
                <!-- <moka-slider :key="block.id" v-if="block.hasOwnProperty('slider')" :develop="true" :embeded="true" :doc="block" :editor="true"/>   -->
            </template>
        </span>
        <!-- <span v-else>
            <moka-slider :key="doc.id" :develop="true" :embeded="true" :doc="doc" :editor="false"/>
        </span>               -->
        
        <div whoobe-global-plugins v-if="plugins">
            <template v-for="plugin in plugins">
                <plugin-wrapper :settings="plugin.editor.settings" :block="null"  :plugin="plugin" :component="plugin.component"/>
            </template>
        </div>
        <!-- <div v-if="menu_toolbar && menu_toolbar.length" class="whoobe-menu-toolbar fixed md:hidden bottom-0 left-0 w-full p-1 bg-black h-10 text-white flex flex-row z-highest justify-around items-center">
            <icon name="menu" :css="menu_toolbar[0].css.responsive_items" @click="$emitBus('menu','menu'),$store.dispatch('menu_responsive')"/>    
        </div> -->
            
    </div>
</template>

<script>
//import MokaElement from '@/components/editor/preview/moka.element'
//import MokaContainer from '@/components/editor/preview/moka.preview.container'
//import MokaFlex from '@/components/editor/preview/moka.editor.flex'
//import MokaGrid from '@/components/editor/preview/moka.editor.grid'
import MokaSlider from '@/components/blocks/preview/components/moka.slider'
//import MokaPluginWrapper from '@/components/Plugins.Wrapper'
//import MokaLoop from '@/components/editor/preview/moka.preview.loop'
//import MokaPopup from '@/components/editor/preview/moka.popup'
//import MokaArticlesLoop from '@/components/editor/moka.preview.articles.loop'
import BlockPreviewSlides from '@/components/plugins/slides/slides.vue'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsapEffects from '@/scripts/animations'
import { mapState } from 'vuex'

gsap.registerPlugin ( ScrollTrigger )
const plugins = [ScrollTrigger];
import jp from 'jsonpath'
export default {
    name: 'WhoobePreview',
    data:()=>({
        printScreen: null,
        refreshID: null,
        plugins: [],
        previewWidth: 'w-screen',
        menu_toolbar: null
    }),
    props: [ 'doc' ],
    components: {
        BlockPreviewSlides,
        'block-container'           : () => import ( './components/moka.preview.container.vue') ,
        'block-popup'               : () => import ( './components/moka.popup.vue' ),
        MokaSlider ,
        // MokaContainer,
        // MokaFlex,
        // MokaGrid,
        // MokaElement,
        // MokaPluginWrapper,
        // MokaLoop,
        // MokaPopup
    },
    computed:{
        ...mapState ( ['editor'] ),
        animations(){
            
            return gsapEffects
        },
        // doc(){
        //     return this.$mapState().editor.component.json
        // }
    },
    watch:{
        refreshID(){
            
        }
    },
    //props: [ 'doc' ],
    methods: {
        resizeTo(width,height=null){
            let left = (window.screen.availWidth/2)-(width/2);
            window.resizeTo (width ? width : window.screen.availWidth , height?height:window.screen.availHeight)
            window.moveTo ( left , 0 )
            let sW = width ? width : window.screen.availWidth 
            let sH = height ? height : window.screen.availHeight
            let title = 'whoobe Preview ' + sW + 'x' + sH
            document.title = title
        },
        responsive(css){
            return this.$clean ( this.$cssResponsive ( css ) )
        },
        pageCss(cs){
            let css = cs
            if ( this.doc.hasOwnProperty ( 'body_bg' ) ){
                css += ' ' + this.doc.body_bg
            }
            if ( this.doc.hasOwnProperty ( 'body_color' ) ){
                css += ' ' + this.doc.body_color
            }
            return css
        },
        stile(block){
            let stl = ''
            if ( block.hasOwnProperty('fontFamily') ){
                stl += 'font-family:"' + block.fontFamily + '";'
            }
            stl += block.hasOwnProperty('style') ? block.style : ''
            let bg = this.background(block)
            stl += bg
            return stl
        },
        background(block){
            return block.hasOwnProperty('image') ?
                block.image ?
                    ' background-image:url(' + this.$imageURL(block.image) + ');' : '' : ''
                /*
                block.image ? 
                    ' background-image:url(' + block.image.url + ');' : '' : ''
                */
        },
        printSave(){
            this.print().then (()=>{
                this.$emit('save',this.printScreen)
                this.$emit('close')
            })
        },
       
        async print() {
            let el , options
            el = document.querySelector('#content')
            options = { type: "dataURL" , useCORS: true , scale: 0.50 }
            let screenshot = await this.$html2canvas(el, options)
            this.printScreen = screenshot
            this.$emit('save',screenshot)
        },
       
        animate(element,id   ){
                let vm = this
                !element.hasOwnProperty ( 'gsap' ) ?
                    element.gsap  = {
                        animation: '',
                        duration: .7,
                        delay:0,
                        ease:'none'
                    } : null  
                if ( this.$refs[id] ){      
                    let ani = gsap.effects[element.gsap.animation]( this.$refs[id] ,{
                        trigger: this.$refs[id],
                        duration: parseFloat(element.gsap.duration),
                        delay: parseFloat(element.gsap.delay),
                        ease: element.gsap.ease
                    })

                    //let ani = gsap.effects[element.animation]( this.$refs[id] ) 
                    
                    ScrollTrigger.create({
                        id: id,
                        start: "top 99%",
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
                        onStart:()=> { console.log ( 'started' , new Date() )},
                        onComplete:()=> { console.log ( 'completed' , new Date() )}
                        
                    });
                }
                
        },
        start(){
        },
        animateSub(doc){
            doc.blocks.forEach ( block => {
                if ( block.hasOwnProperty('gsap') && block.gsap.animation  ){
                    this.animate(block, block.id)
                }
                if ( block.hasOwnProperty('blocks') ){

                    block.blocks.forEach ( el => {
                        if ( el.hasOwnProperty('gsap') && el.gsap.animation ){
                            this.animate ( el , el.id   )
                        }
                        if ( el.hasOwnProperty('blocks') ){
                            el.blocks.forEach ( element => {
                                 if ( element.hasOwnProperty('gsap') && element.gsap.animation ){
                                    this.animate ( element , element.id   )
                                }
                            })
                        }
                    })
                }
            })
        }
    },
    mounted(){
        console.log ( 'Preview mounted' , this.doc.id )
        window.resizeTo ( window.screen.availWidth , window.screen.availHeight )
        let lang = document.querySelector('html')
        lang.setAttribute ( 'lang' , navigator.language )
        window.scrollTo(0,0)
        this.refreshID = this.$randomID()
        this.menu_toolbar = jp.query ( this.doc.blocks , '$..blocks[?(@.tag=="menu")]').filter ( menu => menu.responsive )
        this.doc.blocks.forEach ( block => {
            if ( block.hasOwnProperty('gsap') && block.gsap.animation  ){
                this.animate(block, block.id)
            }
            if ( block.hasOwnProperty('blocks') ){
                block.blocks.forEach ( container => {
                    if ( container.hasOwnProperty('gsap') && container.gsap.animation ){
                        this.animate ( container , container.id )
                    }
                    if ( container.hasOwnProperty('blocks') ){
                    container.blocks.forEach ( el => {
                        if ( el && el.hasOwnProperty('gsap') && el.gsap.animation ){
                            this.animate ( el , el.id   )
                        }
                         if ( el && el.hasOwnProperty('blocks') ){
                            el.blocks.forEach ( element => {
                                 if ( element.hasOwnProperty('gsap') && element.gsap.animation ){
                                    this.animate ( element , element.id   )
                                }
                            })
                        }
                        
                    })
                    }
                })
            }
        })
        window.addEventListener("keydown", e => {
            if ( e.altKey && e.code === 'KeyX' ){
                this.$emit('close')
            }
            if ( e.altKey && e.code === 'KeyS' ){
                this.$emit('save')
            }
            if ( e.altKey && e.code === 'KeyK' ){
                let html = document.getElementById('content').outerHTML
                this.$emit('html',html)
            }
        });
        this.$api.service ( 'plugins' ).find().then ( res => {
            if  ( res.data ){
                res.data.forEach ( plugin => {
                    if ( plugin.general.global ){
                        this.plugins.push ( plugin )
                    }
                })
            }          
        })
    },

}
</script>
