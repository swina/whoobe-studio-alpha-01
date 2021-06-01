<template>
    <div class="fixed bottom-0 left-0 pl-4 w-full theme-dark flex flex-row items-center h-10 text-gray-300 p-1 z-highest flex flex-row items-center justify-around border-t border-gray-700">
        <div class="lg:w-1/4 md:w-1/3 w-1/2 flex justify-around flex-row items-center">
        
        <icon name="more_vert" class="text-orange-400" title="Options" 
        @click="docOptions=!docOptions"/>
        
        <!-- <i class="material-icons text-orange-400" title="Document">description</i> -->


        <!-- CLEAR SELECTION -->
        <icon name="border_clear" class="text-gray-300 hover:text-indigo-500" @click="$store.dispatch('setCurrent',doc),$store.dispatch('selected',doc.id)" title="Select document"/>


        <!-- ADD EMPTY BLOCK (GRID) -->
        <!-- <icon name="grid_on" v-if="editor.current && editor.current.tag==='document'" class="text-gray-300 hover:text-indigo-500" @click="$action('grids')" title="Add Grid"/> -->

        <!-- ADD ELEMENT -->

        <icon name="add" v-if="editor.current && (editor.current.tag==='document' || editor.current.type === 'grid' || editor.current.type === 'flex')" class="text-gray-300 hover:text-indigo-500" @click="$action('block_add_element')" title="Add block"/>

        <!-- IMPORT A BLOCK -->
        <icon name="widgets" v-if="editor.current && (editor.current.tag==='document' || editor.current.type === 'grid' || editor.current.type === 'flex')" class="text-gray-300 hover:text-indigo-500" @click="$action('addreusable'),addBlock=true" title="Add reusable block"/>

        <!-- PREVIEW IN A NEW WINDOW -->
        <icon name="preview" class="text-gray-300 hover:text-indigo-500" @click="openPreview()" title="Preview in a new window"/>

        <!-- PREVIEW DOCUMENT -->
        <icon name="laptop" class="text-gray-300 hover:text-indigo-500" @click="previewTab('laptop')" title="Preview"/>

        <icon name="smartphone" class="text-gray-300 hover:text-indigo-500" @click="previewTab('mobile')" title="Preview"/>
        

        <!-- PREVIEW SLIDER
        <i class="material-icons nuxpresso-icon-circle ml-2 text-gray-300 bg-green-400 " v-if="component && component.category==='slider'" title="Preview" @click="slider=!slider,disable=false">remove_red_eye</i>
         -->
        <!-- SAVE DOCUMENT -->
        <icon name="save" class="hover:text-indigo-500 cursor-pointer" @click="$action('savecomponent')" title="Save document"/>
        <!-- <i class="material-icons moka-icons nuxpresso-icon-circle text-gray-300 ml-2 divide-x divide-gray-200" @click="$action('savecomponent')"
title="Save document">save</i> -->
        </div>
        <!-- MENU OPTIONS -->
        
        

        <!-- <i class="material-icons text-gray-500 hover:bg-black hover:text-blue-400 mx-2" @click="help=!help" title="Hotkeys">keyboard</i> -->
        
        <div v-if="editor.current" class="lg:w-2/3 w-1/2 border-l border-gray-700 pl-4 mr-10 w-full flex text-sm flex-row items-center" :title="editor.current.id">
            
            <i class="material-icons text-sm mx-1" v-if="editor.current.icon">{{editor.current.icon}}</i>

            <span v-else>CONTAINER <i class="material-icons text-sm mx-1">select_all</i></span>

            <span class="capitalize ml-2 cursor-pointer" title="Edit CSS/Style" @click="$action('edit_css')">CSS</span>
            
            <input v-if="editor.current && !editor.current.css.hasOwnProperty('css')" type="text" class="bg-gray-900 ml-2 w-4/5 border-0 text-white rounded-none" v-model="editor.current.css"/>
            
            <input v-else type="text" class="ml-2 w-4/5 text-white border-0 rounded-none bg-gray-900" v-model="editor.current.css.css"/>

            <i class="material-icons moka-icons ml-2" title="Edit CSS classes" @click="$action('edit_css')">edit</i>

            <!--
            <i class="material-icons moka-icons ml-2" title="Customize" @click="$action('customize')">brush</i>
            <i class="material-icons moka-icon-circle ml-2" title="Preview in new window" @click="openPreview()">preview</i>
            -->
        </div>

        <div class="flex flex-col fixed bottom-0 left-0 ml-10 mb-10 theme-dark w-1/3 lg:w-1/4 cursor-pointer z-2xtop opacity-100" v-if="docOptions" @mouseleave="docOptions=!docOptions">
                <!-- createPage=!createPage -->
            <div class="p-1 hover:bg-gray-900" @click="$action('component_createpage')">Create article</div>
            <div class="p-1 hover:bg-gray-900" @click="editor.export='single',$action('component_export')">Export</div>
            <div class="p-1 hover:bg-gray-900" @click="$action('component_settings')">Settings</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WhoobeEditorStatusBar',
    data:()=>({
        docOptions: false
    }),
    computed:{
        doc(){
            return this.$mapState().editor.component.json
        },
        component(){
            this.$mapState().editor.component = this.$attrs.component 
            return this.$attrs.component //this.$mapState().editor.component.json
        },
        editor(){
            return this.$mapState().editor
        }
    },
    methods:{
        saveComponent(){
            return
        },
        openPreview(){
            this.$mapState().editor.preview = this.component
            window.localStorage.setItem('whoobe-preview',JSON.stringify(this.doc))
            //)
            window.localStorage.setItem('whoobe-component',JSON.stringify(this.editor.component))
            let route = this.$router.resolve({path: '/preview'});
            let w = window.open(route.href, 'whoobe','width=' + window.screen.availWidth );
            w.focus()
        },
        previewTab(mode){
            this.$mapState().editor.component = this.component
            if ( mode === 'mobile' ){
                window.localStorage.setItem('whoobe-preview',JSON.stringify(this.doc))
                window.localStorage.setItem('whoobe-component',JSON.stringify(this.component))
                this.$mapState().editor.preview_mobile = true
            } else {
                this.$mapState().editor.preview_mobile = false
            }
            this.$action('in_editor_preview')
            /*
            this.$mapState().editor.preview = this.component
            this.$mapState().desktop.tabs.push ( {
                component: () => import ( '@/components/moka/editor/preview/whoobe.preview' ),
                name: this.component.name + ' Preview' ,
                icon: 'preview',
                filter: '',
                mode: 'preview',
                ref: this.$randomID(),
                resumeAction: null,
                blocks: this.component.json.blocks[0],
            })
            */
        }

    }
}
</script>
