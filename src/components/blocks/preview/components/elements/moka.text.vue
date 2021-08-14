<template>
    <component :ref="el.id" :id="el.id" :is="component" :class="classe" v-html="content" 
        @change="event_manager($event)" 
        @focus="event_manager($event)" 
        @keydown="event_manager($event)" 
        @click="event_manager($event)"
        /> 
</template>

<script>
var gsap
import { eventBus } from '@/main'

export default {
    name: 'WhoobeRenderElementText',
    data:()=>({
        price: '',
        dataConnector: ''
    }),
    props: [ 'el' ],
    computed:{
        component(){
            let el = Object.assign({},this.el)

            if ( el.hasOwnProperty('precision') ){
                
                this.$attrs.hasOwnProperty('attrib') && this.$attrs.attrib.data ? 
                    this.price = this.$attrs.attrib.data[this.el.label] : this.price = el.content
                let price = this.price.toString().split('.')
                if ( parseInt(price[0]) > 1 && price.length > 1){
                    price[1] != '' ? 
                        this.price = price[0] + '<small class="text-sm">.' + price[1] + '</small>' :
                            this.price = price[0] + '<small class="text-sm">.00</small>' 
                } else {
                    this.price = this.price + '<small class="text-sm">.00</small>'
                }
                
                this.$attrs.attrib.currency ? 
                    this.price = '<small class="text-sm">' + this.$attrs.attrib.currency + '</small> ' + this.price : null
            }
            if ( el.hasOwnProperty ( 'semantic' ) && el.semantic ) return el.semantic
            if ( ( el.tag === 'element' || el.tag === 'article' || el.type === 'button' || el.type === 'file' ) && el.element != 'img' && el.type != 'video' && el.type != 'audio' ) {
                return el.hasOwnProperty('level') ? 'h' + el.level : el.element
            } 
        },
        content(){
            return !this.dataConnector ? this.el.content : this.dataConnector
            // return this.$attrs.hasOwnProperty('attrib') && this.$attrs.attrib.data ?
            //     this.price || this.$attrs.attrib.data[this.el.label] : this.el.content
        },
        classe(){
            return this.el.type === 'button' ? this.el.css : this.$cssResponsive(this.el.css)
        },
        
    },
    methods:{
        
        event_manager(event){
            if ( this.el.hasOwnProperty('event_click') && this.el.event_click ){
                this.el.event_click.split(',').forEach ( event_name => {
                     this.$emitBus ( event_name , event )
                })
            }
            if ( this.el.hasOwnProperty('event_focus') && this.el.event_focus ){
                this.el.event_focus.split(',').forEach ( event_name => {
                     this.$emitBus ( event_name , event )
                })
            }
            if ( this.el.hasOwnProperty('event_blur') && this.el.event_blur ){
                this.el.event_blur.split(',').forEach ( event_name => {
                     this.$emitBus ( event_name , event )
                })
            }
            if ( this.el.hasOwnProperty('event_change') && this.el.event_change ){
                this.el.event_change.split(',').forEach ( event_name => {
                     this.$emitBus ( event_name , event )
                })
            }
            if ( this.el.hasOwnProperty('event_data') && this.el.event_data ){
                eventBus.$on ( this.el.event_data , (data) =>{
                    typeof data === 'object' ?
                        this.dataConnector = Object.values(data).join(' - ') :
                            this.dataConnector = data 
                })
            }
        }
    },
    mounted(){
        gsap = this.$animation(this.el,this.el.id,this.$refs)
    },
    beforeDestroy(){
        if ( gsap ) gsap.timeline().kill()
    }
}
</script>
