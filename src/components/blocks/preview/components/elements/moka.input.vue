<template>
    <input 
        :key="$randomID()"
        v-if="display || event_display"
        :type="el.type" 
        :name="el.name" 
        :class="el.css" 
        :value="connector" 
        :placeholder="el.placeholder" 
        @change="emit($event)" 
        @focus="emit($event)" 
        @keydown="emit($event)" 
        @click="emit($event)"
        @blur="$emitBus(el.name,$event)"/>
</template>

<script>
import { eventBus } from '@/main'
export default {
    name: 'MokaInputElement',
    data:()=>({
        event_display: true
    }),
    props:['el'],
    computed:{
        display(){
            if  ( !this.el.hasOwnProperty ( 'event_display' ) || !this.el.event_display ) return true
            this.event_display = false
            return false
        },
        connector(){
            return this.el.content
        }
    },
    methods: {
        emit(event){
            if ( this.el.eventName === 'change' ){
                eventBus.$emit ( this.el.name , event  )
            } 
            if ( this.el.eventName === 'keydown' ){
                this.$emitBus ( this.el.name , event )
                //eventBus.$emit ( this.el.name , event )
            }
            if ( this.el.eventName === 'focus' ){
                eventBus.$emit ( this.el.name , event )
            }
            if ( this.el.eventName === 'click' ){
                this.$emitBus ( this.el.name , event )
                // console.log ( 'click' )
                // this.el.hasOwnProperty ( 'event_click' ) ?
                //     eventBus.$emit ( this.el.event_click , event ) : eventBus.$emit ( this.el.name , event )
            }
        }
    },
    mounted(){
        if ( this.el.hasOwnProperty ( 'event_display' ) ){
            console.log ( this.el.event_display )
            if ( this.el.event_display ){
                eventBus.$on ( this.el.event_display , (e) => {
                    console.log ( this.el , e )
                    this.event_display =! this.event_display
                })
            }
        }
        if ( this.el.hasOwnProperty ( 'event_data' ) ){
            eventBus.$on ( this.el.event_data , (data) => {
                this.el.content = data
            })
        }
    }
}
</script>