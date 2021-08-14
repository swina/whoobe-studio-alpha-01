<template>
<span :key="id" @click="event_manager($event)">
    <component class="iconify" :class="classe" v-if="component" :data-icon="icon" :is="component" :component="component" :data-container-tag="icon"/>
</span>
</template>

<script>
export default {
    name: 'SuperIcon',
    data:()=>({
        el: null,
        id : null,
        component: null
    }),
    watch:{
        icon(v){
            this.component = null
            this.id = this.$randomID()
            if ( this.$attrs.icon ){
                this.component = 'i'
                this.$mapState().editor.current.content = v
            }
           
        },
        classe(v){
            this.component = null
            this.id = this.$randomID()
            if ( this.$attrs.icon ){
                this.component = 'i'
                this.$mapState().editor.current.content = this.$attrs.icon
            }
            
        }
    },
    computed:{
        icon(){
            this.component = null
            this.id = this.$randomID()
            this.component = 'i'
            if ( this.$attrs.el ) {
                return this.$attrs.el.content
            } else {
                return this.$attrs.icon
            }
        },
        classe(){
            this.component = null
            this.id = this.$randomID()
            this.component = 'i'
            let css = this.$attrs.css
            if ( this.$attrs.el ) {
                css = this.$attrs.el.css
            } 
            
            
            // if ( this.$mapState().desktop.mode === 'editor' ) {
            //      return css.replace('hidden','')
            // }
            return css
        },
        reload(){
            this.id = this.$randomID()
        }
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
        }
    },
    mounted(){
        this.el = this.$attrs.el
    }
}
</script>