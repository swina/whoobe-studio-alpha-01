<template>
    <div class="m-4 p-4">
        <modal 
            v-if="reusable"
            size="lg"
            position="modal"
            @close="reusable=!reusable"
            buttons="none">
            <div slot="title">Select a block</div>
            <block-gallery slot="content" @component="lastProject=null,reusable=!reusable"/>
        </modal>
        <div>
            <h4>Generate website</h4>
            <div v-if="lastProject">
                Last generated project: {{lastProject.name}}<br>
                Click on the image to replace with another page/template
            </div>
            <div v-else>
                <button @click="reloadLast">Last project</button>
            </div>
        </div>
        <div class="grid grid-cols-3 gap-10 w-full text-sm items-start" v-if="project">
            <div class="flex flex-col items-start p-4 cursor-pointer" @click="reusable=!reusable">
                <img :src="$imageURL(project.image)" class="h-3/4 w-auto object-contain"/>
            </div> 
            
            <div class="col-span-2">
                <generator-build :project="lastProject"/>
                
                
            </div>
        </div> 
        <!-- <generator-articles/> -->
    </div>
</template>

<script>
// import "xterm/css/xterm.css";
// import { Terminal } from "xterm";
//import WhoobeUsedImages from './used.images'
// const term = new Terminal({
//   rows: 40,
// });
import { mapState } from 'vuex'
export default {
    name: 'WhoobeGenerator',
    components: { 
        //WhoobeUsedImages , WhoobeDocumentSettings ,
    'plugin-seo'        : () => import ( '@/components/plugins/seo/index.settings.vue'),
    'generator-build'   : () => import ( './generator.build.vue'),
    'block-gallery'     : () => import (  '@/components/blocks/actions/block.gallery.selection.vue'),
    // 'generator-articles' : () => import ( './generator.articles.vue' )
    },
    data: () =>  ({
        output: '',
        errors: '',
        uploads: null ,
        fonts: null,
        generation: null,
        landingPages: null,
        reusable:true,
        component: null,
        lastProject: null
    }),
    computed:{
        ...mapState ( ['editor'] ),
        cmsurl(){
            return window.localStorage.getItem('whoobe-cms')
        },
        project(){
            this.component = this.$mapState().editor.component
            return this.$mapState().editor.component
            // return this.generation
            // return JSON.parse ( window.localStorage.getItem ( 'whoobe-workspace') )
        },
        enabled(){
            if ( typeof webpackHotUpdate === 'undefined') this.$store.dispatch('message','This option is available only in development mode')
            return typeof webpackHotUpdate != 'undefined' ? true : false 
        }
    },
    mounted(){
        this.lastProject = JSON.parse(window.localStorage.getItem ( 'whoobe-last-build'))
        if ( this.lastProject ){
            this.$loading(true)
            this.$api.service ( 'components' ).get ( this.lastProject.component._id ).then ( res => {
                this.$store.dispatch ( 'setComponent' , res )
                this.lastProject.component = res
                this.lastProject.name = res.name
                this.$loading()
                this.reusable = false
            })
            
        }
        // term.open(document.getElementById("terminal"));
        // this.$api.service('generate').on ( 'created' , (data) => {
            
        //     if ( data.data ){
        //         this.output += data.data.normalize()
        //         //term.write ( data.data + '\n')
        //     } 
        //     if ( data.error ){
        //         this.errors += data.error.normalize()
        //     }
        //     document.getElementById("generated").scrollTop = document.getElementById("generated").scrollHeight 
        //     document.getElementById("generated_errors").scrollTop = document.getElementById("generated_errors").scrollHeight 
        // })
        // this.$api.service('projects').find( { query: { name: 'default' }}).then ( res => {
        //     this.generation = res.data[0]
        //     !this.generation.hasOwnProperty ('mode') ? this.generation.mode = '' : null
        //     !this.generation.hasOwnProperty ( 'landing' ) ? this.generation.landing = '' : null
        // })
        // this.$api.service('components').find ( { query: { $limit: 100 , category: 'landing page'}}).then ( res => {
        //     this.landingPages = res.data
        // })

    },
    methods: {
        setImages(images,fonts){
            this.uploads = images
            this.fonts = fonts
            this.fonts.includes('Barlow Condensed') ? null : this.fonts.push ( 'Barlow Condensed' )
        },
        generate(){
            let project = this.project
            project.fonts = this.fonts.join('|')
            project.landing = project.component._id 
            project.single = project.component._id
            this.output = 'Starting generation ...\n'
            this.errors = ''

            this.$api.service ( 'projects' ).patch ( project._id , project ).then ( res => {
                console.log ( res )
                this.$api.service('whoobe/build').create({project:res,uploads:this.uploads,fonts:this.fonts}).then ( res =>{
                    this.output += res.data
                })
            })
        },
        reloadLast(){
        this.lastProject = JSON.parse(window.localStorage.getItem ( 'whoobe-last-build'))
            if ( this.lastProject ){
                this.$loading(true)
                this.$api.service ( 'components' ).get ( this.lastProject.component._id ).then ( res => {
                    this.$store.dispatch ( 'setComponent' , res )
                    this.lastProject.component = res
                    this.lastProject.name = res.name
                    this.$loading()
                    this.reusable = false
                })
                
            } else {
                this.$message('No generated projects available')
            }
        }
    }
}
</script>