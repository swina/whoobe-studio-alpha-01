<template>
    <select :name="el.name" :class="el.css" :placeholder="el.placeholder" @change="emit($event)" @keydown="emit($event)" @focus="emit($event)" @click="emit($event)">
        <option v-for="option in el.options" :value="option">{{ option }}</option>
    </select>
</template>

<script>
import { eventBus } from '@/main'
export default {
    name: 'MokaSelectElement',
    props:['el'],
    methods: {
        emit(event){
            if ( this.el.eventName === 'change' ){
                eventBus.$emit ( this.el.name , event  )
            } 
            if ( this.el.eventName === 'keydown' ){
                eventBus.$emit ( this.el.name , event )
            }
            if ( this.el.eventName === 'focus' ){
                eventBus.$emit ( this.el.name , event )
            }
            if ( this.el.eventName === 'click' ){
                eventBus.$emit ( this.el.name , event )
            }
        }
    }
}
</script>