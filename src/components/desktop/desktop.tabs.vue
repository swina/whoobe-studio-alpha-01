<template>
    <div class="fixed z-highest top-0 left-0 theme-dark w-screen whitespace-no-wrap flex flex-row flex-wrap cursor-pointer border-b border-gray-700 ml-10 desktop-tabs-container">
        <div class="fixed top-0 left-0 h-8 w-10 text-center bg-purple-800 text-purple-300 flex items-center justify-center hover:text-white" @click="$emit('menu')" title="Menu">
            <icon name="menu"/>
        </div>
        <div v-for="(tab,index) in desktop.tabs" :key="tab.label" class="flex flex-row items-center pl-2 pr-1 border-r border-b h-8 border-gray-900 hover:text-white hover:bg-indigo-600" :class="active(index)" @click="desktop.currentTab=index,$action()">
            <div class="flex-row-center mr-2"><icon :name="tab.icon" class="mr-2"/><span class="capitalize">{{ tab.name }}</span></div>
            <icon name="close" class="text-xs ml-2 text-transparent hover:text-white" @click="removeTab(index),desktop.currentTab--"/>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'DesktopTabs',
    computed: {
        ...mapState( ['desktop'] )
    },
    methods: {
        active(index){
            return index === this.desktop.currentTab ? 'bg-indigo-700 text-white' : ''
        },
        removeTab ( index ){
            this.desktop.tabs.splice ( index , 1 )
            this.desktop.currentTab = this.desktop.tabs.length - 1
            window.localStorage.setItem('whoobe-desktop',JSON.stringify(this.desktop.tabs))
            this.$action()
        },
        
    },
    
    mounted(){
        //if ( window.localStorage.getItem('whoobe-desktop') ){
        //    this.$store.dispatch('tabs',JSON.parse(window.localStorage.getItem('whoobe-desktop')))
        //}
    }
}
</script>