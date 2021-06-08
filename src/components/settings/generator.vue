<template>
    <div class="m-4 p-4">
        <div><h3>Generate website</h3></div>
        <div class="grid grid-cols-3 border-b w-full text-sm" v-if="project">
            <div class="col-span-3 grid grid-cols-1 md:grid-cols-3">

                <div class="p-1 border-t border-r border-l capitalize">
                    <label>Name</label>
                </div>
                <div class="p-1 border-t border-r col-span-2">{{ project.name }}</div>

                <div class="p-1 border-t border-r border-l capitalize">
                    <label>Destination folder</label>
                </div>

                <div class="p-1 border-t border-r col-span-2">{{ project.dist }}</div>

                <div class="p-1 border-t border-r border-l capitalize">
                    <label>Target</label>
                </div>
                <div class="p-1 border-t border-r col-span-2">{{ project.mode }}</div>

                <div class="p-1 border-t border-r border-l capitalize">
                    <label>Source</label>
                </div>

                <div class="p-1 border-t border-r col-span-2">
                    <span v-if="project.mode==='single'">{{ project.component.name }}</span><span v-else>NA</span>
                    <img :src="$imageURL(project.component.image)" v-if="project.mode==='single'" class="w-24 h-32 object-cover object-top"/>
                </div>

                <div class="p-1 border-t border-r border-l capitalize">
                    <label>Fonts</label>
                </div>
                <div class="p-1 border-t border-r col-span-2">{{ project.fonts }}</div>

                <div class="p-1 border-t border-r border-l capitalize">
                    <label>Local assets</label>
                </div>

                <div class="flex flex-row justify-start col-span-2 p-1 border-t border-r ">

                    <template v-for="img in project.uploads" v-if="project.mode==='single'">
                        <img :src="$imageURL(img)" class="w-16 h-20 object-cover object-top mr-2 mb-2"/>
                    </template>

                    <div v-if="project.mode != 'single'">
                        {{ uploads.length }}
                    </div>

                </div>
            </div>


            <!-- <template v-for="setting in Object.keys(project)">
                <div class="p-1 border-t border-r border-l capitalize"> {{ setting.replaceAll('/','\/') }} </div>
                <div class="p-1 border-t border-r col-span-2"> 
                    <span v-if="setting != 'fonts' && setting!='mode'">{{ project[setting] }}</span>
                    <span v-if="setting === 'fonts' && fonts" v-html="fonts.join(', ')"></span>
                    <select v-if="setting==='mode'" v-model="project[setting]">
                        <option value="fullsite">Full site</option>
                        <option value="landing">Landing page</option>
                    </select>
                    <select class="ml-2" v-model="project.component" v-if="setting==='mode' && project.mode==='landing'">
                        <option></option>
                        <option v-for="component in landingPages" :value="component">{{ component.name }}</option>
                    </select>
                    <img :src="$imageURL(project.component.image)" v-if="project.component.image" class="h-24 object-cover"/>
                </div>
                
            </template> -->
            <div class="p-1 border-t border-r border-l">Images used as local asset</div>
            <div class="p-1 border-t border-r col-span-2">
                <whoobe-used-images @images="setImages" :project="project" v-if="project.uploads"/><span v-if="uploads">{{uploads.length}}</span></div>
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
        fonts: null,
        generation: null,
        landingPages: null
    }),
    computed:{
        cmsurl(){
            return window.localStorage.getItem('whoobe-cms')
        },
        project(){
            return this.generation
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
        this.$api.service('projects').find( { query: { name: 'default' }}).then ( res => {
            this.generation = res.data[0]
            !this.generation.hasOwnProperty ('mode') ? this.generation.mode = '' : null
            !this.generation.hasOwnProperty ( 'landing' ) ? this.generation.landing = '' : null
        })
        this.$api.service('components').find ( { query: { $limit: 100 , category: 'landing page'}}).then ( res => {
            this.landingPages = res.data
        })

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
            this.output = 'Starting generation ...'
            this.errors = ''
            this.$api.service ( 'projects' ).patch ( project._id , project ).then ( res => {
                this.$api.service('whoobe/build').create({project:project.name,uploads:this.uploads,fonts:this.fonts}).then ( res =>{
                    this.output += res.data
                })
            })
        }
    }
}
</script>