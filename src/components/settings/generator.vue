<template>
    <div class="m-4 p-4 bg-white">
        <div class="theme-dark p-1"><h3>Generate website</h3></div>
        <div class="grid grid-cols-3 border-b w-full text-sm">
            <template v-for="setting in Object.keys(project)">
                <div class="p-1 border-t border-r border-l capitalize"> {{ setting.replaceAll('/','\/') }} </div>
                <div class="p-1 border-t border-r col-span-2"> 
                    <span v-if="setting != 'fonts'">{{ project[setting] }}</span>
                    <span v-if="setting === 'fonts' && fonts" v-html="fonts.join(', ')"></span>
                </div>
            </template>
            <div class="p-1 border-t border-r border-l">Images used as local asset</div>
            <div class="p-1 border-t border-r col-span-2"><whoobe-used-images @images="setImages" v-if="project.uploads"/><span v-if="uploads">{{uploads.length}}</span></div>
            <div class="p-1 col-span-3 border-t border-r border-l">
                <blockquote>The system finds automatically which fonts and images (local) are used by your pages and will configure the relative generation process.</blockquote>
            </div>
        </div> 
        <div v-if="enabled" class="p-2 text-center">
            <button class="success rounded py-2 text-xl mx-auto" @click="generate">Generate</button>
        </div>
        <h3 v-if="!enabled">This option is available only in local development</h3>
        <div class="grid grid-cols-3 gap-10" v-if="output">
            <textarea id="generated" v-model="output" style="font-family:monospace" class="text-sm w-full h-64 bg-black text-green-500 font-light col-span-2">
            </textarea>
            <textarea id="generated_errors" v-model="errors" style="font-family:monospace" class="text-base w-full h-64 bg-black text-red-400"></textarea>
        </div>
    </div>
</template>

<script>
// import "xterm/css/xterm.css";
// import { Terminal } from "xterm";
import WhoobeUsedImages from './used.images'
// const term = new Terminal({
//   rows: 40,
// });
export default {
    name: 'WhoobeGenerator',
    components: { WhoobeUsedImages },
    data: () =>  ({
        output: '',
        errors: '',
        uploads: null ,
        fonts: null
    }),
    computed:{
        cmsurl(){
            return window.localStorage.getItem('whoobe-cms')
        },
        project(){
            return JSON.parse ( window.localStorage.getItem ( 'whoobe-workspace') )
        },
        enabled(){
            if ( typeof webpackHotUpdate === 'undefined') this.$store.dispatch('message','This option is available only in development mode')
            return typeof webpackHotUpdate != 'undefined' ? true : false 
        }
    },
    mounted(){
        // term.open(document.getElementById("terminal"));
        this.$api.service('generate').on ( 'created' , (data) => {
            
            if ( data.data ){
                this.output += data.data.normalize()
                //term.write ( data.data + '\n')
            } 
            if ( data.error ){
                this.errors += data.error.normalize()
            }
            document.getElementById("generated").scrollTop = document.getElementById("generated").scrollHeight 
            document.getElementById("generated_errors").scrollTop = document.getElementById("generated_errors").scrollHeight 
        })
    },
    methods: {
        setImages(images,fonts){
            this.uploads = images
            this.fonts = fonts
            this.fonts.push ( 'Barlow Condensed' )
        },
        generate(){
            let project = this.project
            project.fonts = this.fonts.join('|')
            this.output = 'Starting generation ...'
            this.errors = ''
            this.$api.service('whoobe/build').create({project:project.name,uploads:this.uploads,fonts:this.fonts}).then ( res =>{
                this.output += res.data
            })
        }
    }
}
</script>