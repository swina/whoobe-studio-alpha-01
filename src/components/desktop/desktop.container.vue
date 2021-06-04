<template>
    <div desktop-container v-if="desktop.tabs.length" class="pt-8 w-full relative from-gray-700 via-gray-800 to-gray-900 bg-gradient-to-br min-h-screen theme-dark" :class="$attrs.boxed?'pl-10':''" :style="topPadding">
        <component 
            v-if="component && editor.action != 'in_editor_preview'" 
            :key="desktop.tabs[currentTab].name" 
            :is="component"
            :develop="true" 
            :filter="desktop.tabs[currentTab].filter"
            :component="component"
            :blocks="desktop.tabs[currentTab].blocks"/>
        <block-preview :develop="true" :doc="editor.component.json" v-if="editor.action==='in_editor_preview' && !editor.preview_mobile"/>
        <iframe src="preview" class="mt-10 border-8 border-gray-900 z-highest shadow-xl rounded-2xl h-screen m-auto" style="width:360px;border-width:22px;height:640px;" v-if="editor.action === 'in_editor_preview' && editor.preview_mobile"/>
        <icon  v-if="editor.action==='in_editor_preview'" name="close" class="hover:bg-gray-300 hover:text-black mt-8 text-5xl text-gray-400 z-highest fixed top-0 right-0" @click="$action()"/>
    </div>
</template> 

<script>
import { mapState } from 'vuex'
export default {
    name: 'DesktopContainer',
    data:()=>({
        topPadding:'',
        topMargin:''
    }),
    components: {
        'block-preview' : () => import ( '@/components/blocks/preview/block.preview.vue')
    },
    computed: {
        ...mapState ( [ 'desktop' , 'editor' ] ),
        currentTab(){
            this.desktop.currentTab >= this.desktop.tabs.length ?
                this.$store.dispatch('currentTab',0) : null
            return this.desktop.currentTab
        },
        component(){
            this.topPadding = 'padding-top:' + document.querySelector('.desktop-tabs-container').getBoundingClientRect().height + 'px;'
            this.topMargin = 'margin-top:'  + document.querySelector('.desktop-tabs-container').getBoundingClientRect().height + 'px;'
            if ( this.desktop.tabs.length === 1 ){
                this.desktop.currentTab = 0
                let path = this.desktop.tabs[0].component 
                //this.$store.dispatch ( 'currentTab' , 0 )
                return () => import ( '@/components/' + path )
            } else {
                if ( this.desktop.currentTab > ( this.desktop.tabs.length -1 ) ){
                    this.desktop.currentTab = this.desktop.tabs.length - 1
                }
                let path = this.desktop.tabs[this.desktop.currentTab].component 
                return () => import ( '@/components/' + path )
            }
        },
        
    },
    

}
</script>