<template>
    <div class="m-4 p-4" :key="newKey" v-if="website">
        <div class="absolute right-0 top-0 mt-12 w-full flex items-end w-full justify-end mr-8">
            <button class="lg success" @click="buildWebsite()">Generate</button>
            <button v-if="$attrs.block" class="ml-2 lg" @click="$emit('close')">Close</button>
            <!-- <button v-if="preview" class="ml-2 lg" @click="buildPreview()">Preview</button> -->
        </div>
        <h4>Whoobe Generator</h4>
        <div class="grid grid-cols-5 gap-5">

            <div class="flex flex-col cursor-pointer" title="Select a template for the homepage" v-if="website">
                <label class="font-bold">Homepage</label>
                <img v-if="website.template_preview" :src="$imageURL(website.template_preview)" class="w-40 h-56 object-cover object-top" @click="reusable=!reusable"/>

                <div class="flex flex-col " :title="isStore.title + ' [' + isStore.categories + ']'" v-if="website.blocks.store && isStore.publish && isStore.store"> 
                    <div class="text-xs truncate">{{isStore.title}}</div>
                    <img v-if="isStore.template_preview" :src="$imageURL(isStore.template_preview)" class=" h-56 w-40 object-cover object-top"/>
                    <img v-if="!isStore.template_preview" src="no-image.png"/>
                </div>
            </div>

            
            <div class="w-full col-span-4 flex flex-col">
                <div class="grid grid-cols-2 gap-5 mb-10">
                    <div class="flex flex-col">
                        <div class="flex flex-col">
                                <label>SEO Title</label>
                                <input class="dark w-full" type="text" v-model="website.seo_title"/>
                                <label>SEO Description</label>
                                <textarea class="dark w-full h-32" type="text" v-model="website.seo_description"/>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <label>Target folder</label>
                        <input class="dark w-full" type="text" v-model="website.target"/>
                        <label>Google Analytics</label>
                        <input class="dark w-full" type="text" v-model="website.analytics"/>
                        <div class="flex items-center mt-2">
                            <input class="mr-2" type="checkbox" v-model="website.pwa"/> PWA 
                            <button v-if="website.pwa" class="ml-2 bg-purple-500 lg" @click="setPWA=!setPWA">Configure PWA</button>
                        </div>
                    </div>
                </div>

                <label>Sitemap : articles {{website.pagesToPublish.filter(url=>url.length >2).length}}</label>
                <div class="flex flex-row flex-wrap justify-start" v-if="website.pagesToPublish.length && articles">
                    <!-- website.pagesToPublish"> -->
                    <template v-for="page in website.pagesToPublish"> 
                        
                        <template v-for="article in articles">
                            <div class="flex flex-col m-2 h-48 w-40 items-center justify-start shadow" :title="article.title + ' [' + article.categories + ']'" v-if="page === article.slug">
                                <div class="text-xs truncate">{{article.title}}</div>
                                <img v-if="article.template_preview" :src="$imageURL(article.template_preview)" class="w-32 h-40 object-cover object-top"/>
                                <img v-if="!article.template_preview" src="no-image.png"/>
                            </div>
                        </template>
                    </template>
                    
                </div>
                
            </div>
        </div>
        <!--- template selector --->
        <modal 
            v-if="reusable"
            size="lg"
            position="modal"
            @close="reusable=!reusable"
            buttons="none">
            <div slot="title">Select a block</div>
            <block-gallery slot="content" @component="setWebsiteTemplate"/>
        </modal>
        <modal
            v-if="publish"
            size="lg"
            position="modal"
            buttons="none"
            @close="publish=!publish">
            <div slot="title">Publish {{ website.title }}</div>
            <div slot="content" class="p-4">
                <div class="grid grid-cols-3 gap-10 h-1/2">
                    <div class="flex flex-col col-span-2">
                        Info
                        <textarea id="generated" ref="generate_output" v-model="output" style="font-family:monospace" class="text-xs w-full h-full bg-gray-100 text-gray-700 font-light">
                        </textarea>
                    </div>
                    <div class="flex flex-col">
                        Warnings/Errors
                        <textarea id="errors" ref="generate_output" v-model="errors" style="font-family:monospace" class="text-xs w-full h-full bg-gray-100 text-gray-700 font-light">
                        </textarea>
                    </div>
                    
                </div>
            </div>
        </modal>
        <!-- <pre>{{website}}</pre> -->

        <!-- <div v-if="context==='website' && website">
            <div class="absolute right-0 top-0 mt-12 w-full flex items-end w-full justify-end mr-8">
                <button class="lg success" @click="buildWebsite()">Generate</button>
                <button v-if="preview" class="ml-2 lg" @click="buildPreview()">Preview</button>
            </div>
            <div class="flex flex-col">
                <h4>Generate Website</h4>
                <div class="grid grid-cols-5 gap-10">
                    <div class="cursor-pointer" @click="reusable=!reusable" title="Select a template, page or block">
                        <div>Homepage</div>
                        <img v-if="website && website.template_preview" :src="$imageURL(website.template_preview)" class="h-64 w-48 object-cover object-top"/>
                        
                    </div>
                    
                    <div class="flex flex-col col-span-3">
                        <label>Pages to publish</label>
                        <div class="w-full">
                            <whoobe-website :slugs="website.pagesToPublish"/>
                        </div>
                        
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
                </div>
               
                
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
                <generator-pwa slot="content" :website="ws"/>
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
                    <textarea id="generated" ref="generate_output" v-model="output" style="font-family:monospace" class="text-xs w-full h-full bg-gray-100 text-gray-700 font-light col-span-3">
                    </textarea>
                    
                </div>
            </div>
        </modal>
        -->
    </div> 
</template>

<script>
import { mapState  } from 'vuex'
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
    //'generator-build'   : () => import ( './generator.build.vue'),
    'block-gallery'     : () => import (  '@/components/blocks/actions/block.gallery.selection.vue'),
    'generator-pwa'     : () => import ( './generator.pwa.vue' ),
    //'whoobe-website'    : () => import ( './website.vue')
    },
    data: () =>  ({
        home:null,
        articles:null,
        newKey: 'generator',
        website: null,
        reusable: false,
        isStore: false,
        pages:{},
        // start: true,
        // articles: null,
        website_build_id: null,
        setPWA: false,
        publish:false,
        preview: false,
        output: '',
        errors: '',
        // uploads: null ,
        // fonts: null,
        generation: null,
        // landingPages: null,
        // reusable:false,
        // component: null,
        // lastProject: null,
        
        allPagesLinks: []
    }),
    computed:{
        ...mapState ( ['datastore','editor','generator'] ),
        toPublish(){
            return [ ...this.isStore , ...this.website.pagesToPublish ]
        }
        
    },
    watch:{
        
        
        
    },
    
    methods: {
        setWebsiteTemplate(block){
            this.$loading(true)
            this.website.blocks = block
            this.website.template_preview = block.image
            this.website.pagesToPublish = block.links
            this.pagesToPublish = block.links
            if ( block.hasOwnProperty('seo') ){
                block.seo.title = block.name
                block.seo.description = block.description
                this.website.blocks.seo.title = block.name
                this.website.blocks.seo.description = block.description
            }    
            this.$api.service ( 'articles' ).patch ( this.website._id , this.website ).then ( res => {
                this.reusable = false
                this.searchLinks()
                this.$loading()
            })

        },
        async searchLinks(){
            this.$store.dispatch ( 'pages' , [])
            let links = this.website.blocks.links.filter ( url => url.length > 2 ).map ( link => link.replace('/',''))
            let hasStore = this.website.blocks.plugins.filter ( plugin => plugin.includes('store') )
            hasStore.length ?
                this.website.blocks.store = true : 
                    this.website.blocks.store = false 
            console.log ( 'Has store ?' , hasStore )
            console.table ( links )
            if ( !links.length ) return 

            // this.$api.service( 'articles' ).find ( { query : { store: true , publish: true } } )
            //     .then ( res => {
            //         if ( res.data.length ){
            //             this.website.pagesToPublish.push ( res.data[0].slug.replace('/','') )
            //             this.isStore = res.data[0]
            //         }
            //         return 
            // }).then ( () => {
                    const start = async () => {
                    this.allPagesLinks = []
                    this.website.pagesToPublish = []
                    asyncForEach ( this.website.blocks.links , async(url) => {
                        if ( !url.includes('store/category') && url != 'store' && url != '/' && url != '/shop-demo' ){
                            this.$pageLinks(url.replace('/','')).then ( res => {
                                let dataLinks
                                if ( res.data.length ){
                                    let pg = res.data[0]
                                    console.log ( pg.title , pg.blocks.links )
                                    dataLinks = [ ...new Set(res.data[0].blocks.links) ] 
                                } else {
                                    console.log ( url , ' page not found!')
                                }
                                return dataLinks
                            }).then ( data => {
                                if ( data ){
                                    this.allPagesLinks = [ ...new Set(this.allPagesLinks) , ...data ]
                                    this.website.pagesToPublish = [ ...new Set(this.allPagesLinks.filter(url=>url.length>2).map( slug => slug.replace('/','')).sort() ) ]
                                }
                            })
                        }
                    })
                    delete this.website.blocks.autosave
                    
                    if ( !this.website.blocks.plugins.length ){
                        this.website.blocks.store = false
                    } else {
                        
                    }
                }
                start()
            
            let vm = this
            async function asyncForEach(array, callback) {
                for (let index = 0; index < array.length; index++) {
                    await callback(array[index], index, array);
                    
                }
                
            }
            
            return
        },
        async previewPages(){
            this.website.pagesToPublish ?
                this.$api.service('articles').find({query:{
                    slug: {
                        $in:this.website.pagesToPublish
                    },
                    $select : ['_id','title','template_preview','categories'],
                    $sort : { categories: 1 , title: 1 }
                    }})
                    .then ( res => {
                        console.log ( res )
                        this.$store.dispatch ( 'pages' ,  res.data )
                })
                : ''
        },
        // websitePages(){
        //     let allPagesLinks = [ ...new Set(this.website.pagesToPublish) ].filter( url => url.length > 2 ).map ( slug => slug.replace('/','') ).sort()
        //     console.table ( allPagesLinks )
        //     allPagesLinks.forEach ( slug => {
        //         this.pages = []
        //         this.$api.service ( 'articles' ).find ( { query : { slug : slug } } )
        //             .then ( res => {
        //                 let article = res.data[0]
        //                 this.pages.push ( {
        //                     id: article._id,
        //                     title: article.title,
        //                     image: article.hasOwnProperty('template_preview') ? article.template_preview : null
        //                 })
        //             }).catch ( error => {
        //                 console.log ( error )
        //             })
        //     })
        //     this.pages = allPagesLinks
        // },
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
        
        buildWebsite(){
            if ( this.website._id ){
                this.publish = true
                this.output = ''
                this.errors = ''
                this.preview = false
                console.log ( this.website )
                let seo_homepage = {
                    seo_title : this.website.seo_title,
                    seo_description : this.website.seo_description
                }
                this.$api.service ( 'articles' ).patch ( this.website._id , seo_homepage ).then ( res => {
                    let project = this.$attrs.project
                    project.seo_title = this.website.seo_title
                    project.seo_description = this.website.seo_description
                    project.blocks = this.websites.blocks
                    this.$api.service ( 'projects' ).patch ( this.$attrs.project._id , project )

                    this.$api.service ( 'build-nuxt' ).patch ( this.website._id ,  this.website  ).then ( res => {
                        console.log ( res )
                    })
                })
            } else {
                this.$api.service ( 'build-nuxt' ).create ( this.website  ).then ( res => {
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
            project.seo_title = this.website.seo_title
            project.seo_description = this.website.seo_description
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
    },
    mounted(){
        
        console.clear()
        let vm = this
        this.context = 'website'
        this.$api.service ( 'articles' ).find ( {
            query: {
                $limit:200
            }
        }).then ( articles => {
            this.articles = articles.data 
            let hasStore = articles.data.filter ( article => { return article.store && article.publish } )
            if ( !hasStore ){
                this.isStore = false
            }
            this.home = articles.data.filter ( article => { return article.homepage } )[0]
        })
        
        this.website = this.$attrs.project
        this.website.template_preview = this.$attrs.project.block.image
        this.website.target = this.$attrs.target
        //this.website.blocks = res
        // this.allPagesLinks = []
        // this.pagesToPublish = []
        // this.website.pagesToPublish = []  
        // this.searchLinks()      

        // console.log ( this.$attrs.project )
        // this.$api.service ( 'components' ).get ( this.$attrs.project.block._id ).then ( res => {
        //     console.log ( 'Blocks => ' , res )
        //     delete res.autosave    
        //     this.website = this.$attrs.project
        //     this.website.template_preview = res.image
        //     this.website.blocks = res
        //     this.allPagesLinks = []
        //     this.pagesToPublish = []
        //     this.website.target = this.$attrs.target
        //     this.website.pagesToPublish = []  
        //     this.searchLinks()      
            
        // })


        // this.$api.service ( 'build-nuxt' ).find().then ( res => {
        //      res.total ?
        //          this.website = res.data[0] : null
        //      this.website.pagesToPublish = []
        //      if ( this.$attrs.block ){
        //         this.allPagesLinks = []
        //         this.pagesToPublish = []
        //         this.website.target = this.$attrs.target
        //         this.website.pagesToPublish = []
        //         if ( !this.website.blocks.hasOwnProperty('seo') ){
        //             this.website.blocks.seo = {
        //                 title: this.website.blocks.name,
        //                 description: this.website.blocks.description
        //             }
        //         }
        //         this.setWebsiteTemplate ( this.$attrs.block )
        //         this.searchLinks()
        //      } else {
        //          this.searchLinks()
        //      }
        // })


        // this.$api.service ( 'articles' ).find ( {
        //     query: {
        //         $limit: 200,
        //         homepage: false,
        //         $sort: { title: 1 }
        //     }
        // }).then ( res => {
        //     this.articles = res.data 
        //     console.log ( res )
            
        // })

        //build process realtime console from feathersjs
        //let vm = this
        this.$api.service('generate').on ( 'created' , (data) => {
            console.log  ( data )
            if ( data.data ){
               
                if ( data.data.includes ( 'Whoobe Site Generation done!' ) ){
                    this.$message ( 'Published on remote Whoobe. Ready to deploy')
                    vm.preview = true 

                }
                if ( data.data.includes('done') ){
                    vm.preview = true
                }
                !data.data.includes('undefined') ? this.output += data.data : null//.normalize().replace('undefined','') : null
            } 
            if ( data.error ){
                this.errors += data.error.normalize()
            }
            
            // document.getElementById("generated").scrollTop = document.getElementById("generated").scrollHeight 
            // document.getElementById("generated_errors").scrollTop = document.getElementById("generated_errors").scrollHeight 
        })
       

    },
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