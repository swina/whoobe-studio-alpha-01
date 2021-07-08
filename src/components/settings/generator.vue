<template>
    <div class="m-4 p-4">
        <!-- <div v-if="start" class="flex flex-row items-center justify-center mx-auto">
            <button class="lg mx-4 bg-purple-500" @click="start=false,context='website'">Generate Website</button>
            <button class="lg mx-4 bg-teal-500" @click="start=false,context='landing'">Generate Landing Page</button>
        </div> -->

        <div v-if="context==='website' && website">
            <div class="flex flex-col">
                <h4>Generate Website</h4>
                <div class="grid grid-cols-4 gap-10">
                    <div class="cursor-pointer" @click="reusable=!reusable" title="Select a template, page or block">
                        <div>Homepage</div>
                        <img v-if="website && website.template_preview" :src="$imageURL(website.template_preview)" class="h-64 w-48 object-cover object-top"/>
                    </div>
                    <div class="flex flex-col">
                        <label>SEO Title</label>
                        <input class="dark w-full" type="text" v-model="website.blocks.seo.title"/>
                        <label>SEO Description</label>
                        <textarea class="dark w-full h-32" type="text" v-model="website.blocks.seo.description"/>
                        <label>Target folder</label>
                        <input class="dark w-full" type="text" v-model="website.target"/>
                        <label>Google Analytics</label>
                        <input class="dark w-full" type="text" v-model="website.analytics"/>
                        <div class="flex items-center mt-2">
                            <input class="mr-2" type="checkbox" v-model="website.pwa"/> PWA 
                            <button v-if="website.pwa" class="ml-2 bg-purple-500 lg" @click="setPWA=!setPWA">Configure PWA</button>
                        </div>
                    </div>
                    <div class="flex flex-col col-span-2">
                        <label>Pages to publish</label>
                        
                        <treeselect v-if="options" v-model="pagesToPublish" :multiple="true" :options="options" @select="pageSelect" @unselect="pageUnselect"/>


                        <!-- <div class="flex flex-col relative h-1/3 overflow-y-auto cursor-pointer">
                            <template v-for="(article,index) in articles">
                                <div class="flex flex-row p-1 hover:bg-black relative" v-if="!article.homepage">
                                    {{article.categories}} - {{ article.title }}
                                    <icon name="close" class="absolute right-0 mr-2" @click="unpublish(article._id,index)"/>
                                </div>
                            </template>   
                            
                        </div> -->
                    </div>
                </div>
               
                <!-- <pre>{{ output  }}</pre> -->
            </div>
             <div class="flex items-center w-full justify-around mt-6">
                    <button class="lg success" @click="buildWebsite()">Generate</button>
                    <button v-if="preview" class="ml-2 lg" @click="buildPreview()">Preview</button>
                </div>
            <modal
                v-if="setPWA"
                @close="setPWA=!setPWA"
                buttons="none"
                size="lg"
                position="modal"
                >
                <div slot="title">PWA Settings</div>
                <generator-pwa slot="content" :website="website"/>
            </modal>
        </div>
        
        <div v-if="!start && context==='landing'">
            <div >
                <h4>Generate Landing Page</h4>
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
        </div>

        <!-- landing page selector -->
        <modal 
            v-if="reusable"
            size="lg"
            position="modal"
            @close="reusable=!reusable"
            buttons="none">
            <div slot="title">Select a block</div>
            <block-gallery slot="content" @component="setWebsiteBlocks"/>
        </modal>
        <modal
            v-if="publish"
            size="lg"
            position="modal"
            buttons="none"
            @close="publish=!publish">
            <div slot="title">Publish {{ project.name }}</div>
            <div slot="content" class="p-4">
                <div class="grid grid-cols-3 gap-10 h-1/2">
                    <textarea id="generated" v-model="output" style="font-family:monospace" class="text-xs w-full h-full bg-gray-100 text-gray-700 font-light col-span-3">
                    </textarea>
                    <!-- <textarea id="generated_errors" v-model="errors" style="font-family:monospace" class="text-xs w-full h-full bg-black text-red-400"></textarea> -->
                </div>
            </div>
        </modal>
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
// import the component
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    name: 'WhoobeGenerator',
    components: { 
        Treeselect,
        //WhoobeUsedImages , WhoobeDocumentSettings ,
    'plugin-seo'        : () => import ( '@/components/plugins/seo/index.settings.vue'),
    'generator-build'   : () => import ( './generator.build.vue'),
    'block-gallery'     : () => import (  '@/components/blocks/actions/block.gallery.selection.vue'),
    'generator-pwa'     : () => import ( './generator.pwa.vue' )
    },
    data: () =>  ({
        start: true,
        context: null,
        website: null,
        articles: null,
        website_build_id: null,
        setPWA: false,
        publish:false,
        preview: false,
        output: '',
        errors: '',
        uploads: null ,
        fonts: null,
        generation: null,
        landingPages: null,
        reusable:false,
        component: null,
        lastProject: null,
        pagesToPublish: [],
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
        },
        options(){

            return this.articles ? 
                this.articles.map ( article => {
                    
                    return {      
                        id: article._id,
                        label: article.title
                    }
                }) : null
        }
    },
    watch:{
        pagesToPublish:{
            handler(val, oldVal) {
                oldVal.forEach ( v => {
                    if ( !val.includes(v) )
                        this.pagePublish ( v , false )
                })
            },
        },
        context(v){
            console.log ( v )
            if ( v === 'website' ){
                this.$api.service ( 'build-nuxt' ).find().then ( res => {
                    if ( res.total )
                        this.website_build_id = res.data[0]._id
                        this.website = res.data[0]
               })
                this.$api.service ( 'articles' )
                    .find ( {
                        query: {
                            //publish: true,
                            $sort: { title: 1 }
                        }
                    }).then ( res => {
                        this.articles = res.data
                        let homepage = this.articles.filter ( page => {
                            return page.homepage
                        })[0]
                        this.website.blocks = homepage.blocks
                        this.articles.forEach ( page => {
                            if ( page.publish && !page.homepage ){
                                this.pagesToPublish.push ( page._id )
                            }
                        })
                        this.website.meta = {}
                    })
                
            }
        },
        
    },
    mounted(){
        this.context = 'website'
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
        let vm = this
        this.$api.service('generate').on ( 'created' , (data) => {
            
            if ( data.data ){
               
                if ( !this.project.local && data.data.includes ( 'Whoobe Site Generation done!' ) ){
                    this.$message ( 'Published on remote Whoobe. Ready to deploy')
                    vm.preview = true 

                }
                if ( this.project.local && data.data.includes('done') ){
                    vm.preview = true
                }
                //!data.data.includes('undefined') ? this.output += data.data.normalize().replace('undefined','') : null
                !data.data.includes('undefined') ? this.output += data.data.normalize().replace('undefined','') : null
                //term.write ( data.data + '\n')
            } 
            if ( data.error ){
                this.errors += data.error.normalize()
            }
            // document.getElementById("generated").scrollTop = document.getElementById("generated").scrollHeight 
            // document.getElementById("generated_errors").scrollTop = document.getElementById("generated_errors").scrollHeight 
        })
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
        pageSelect ( node, instanceId ){
            this.pagePublish ( node.id , true )
        },
        pageUnselect ( node, instanceId ){
            this.pagePublish ( node.id , false )
        },
        pagePublish( id , flag ){
            this.$api.service ( 'articles' ).patch ( id , {
                publish: flag
            })
        },
        setWebsiteBlocks(block){
            this.website.blocks = block
            this.website.template_preview = block.image
            this.$api.service ( 'articles' ).patch ( this.website._id , this.website )
            this.reusable = false
        },
        buildWebsite(){
            if ( this.website_build_id ){
                this.publish = true
                this.output = ''
                this.errors = ''
                this.preview = false
                this.$api.service ( 'build-nuxt' ).patch ( this.website_build_id ,  this.website  ).then ( res => {
                    console.log ( res )
                })
            } else {
                this.$api.service ( 'build-nuxt' ).create ( { website: this.website } ).then ( res => {
                    console.log ( res )
                })
            }
        },
        buildPreview(){
            window.open ( 'http://localhost:3000' , 'whoobe')
        },
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

<style>
.vue-treeselect div  {
    font-size:.9rem;
    background: #2d3748;
    color:#eaeaea;
}
.vue-treeselect__multi-value-item {
    background:#4a5568!important;
}
.vue-treeselect__control {
    border:0;
}
</style>