<template>
    <div class="m-4 p-4" v-if="project">
        
        <div class="absolute right-0 top-0 mt-12 w-full flex items-end w-full justify-end mr-8">
            <button class="lg success" @click="buildWebsite()">Generate</button>
            <button class="ml-2 lg info" @click="saveProject()">Save</button>
            <button class="ml-2 lg" @click="$emit('close')">Close</button>
            
        </div>
        <h4>Whoobe Generator</h4>
        <div class="grid grid-cols-5 gap-5">

            <div class="flex flex-col cursor-pointer items-center" title="Select a template for the homepage" v-if="project">
                <label class="font-bold">Homepage</label>
                <img v-if="project.blocks.image" :src="$imageURL(project.blocks.image)" class="w-40 h-56 object-cover object-top" @click="reusable=!reusable"/>

                <div class="flex flex-col items-center" title="Store" v-if="store && project.resources.store"> 
                    <div class="text-xs truncate">Store</div>
                    <img v-if="store.template_preview" :src="$imageURL(store.template_preview)" class=" h-56 w-40 object-cover object-top"/>
                    <img v-if="!store.template_preview" src="no-image.png"/>
                    <button class="danger lg m-auto mt-4" @click="disableStore()">Disable Store</button>
                </div>
                <div v-else class="flex flex-col">
                    <button class="success lg m-auto mt-4" @click="enableStore()">Publish Store</button>
                </div>
            </div>

            
            <div class="w-full col-span-4 flex flex-col">
                <div class="grid grid-cols-2 gap-5 mb-10">
                    <div class="flex flex-col">
                        <div class="flex flex-col">
                                <label>SEO Title</label>
                                <input class="dark w-full" type="text" v-model="project.seo_title"/>
                                <label>SEO Description</label>
                                <textarea class="dark w-full h-32" type="text" v-model="project.seo_description"/>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <label>Target folder</label>
                        <input class="dark w-full" type="text" v-model="project.target"/>
                        <label>Google Analytics</label>
                        <input class="dark w-full" type="text" v-model="project.analytics"/>
                        <!-- <div class="flex items-center mt-2">
                            <input class="mr-2" type="checkbox" v-model="project.pwa"/> PWA 
                            <button v-if="project.pwa" class="ml-2 bg-purple-500 lg" @click="setPWA=!setPWA">Configure PWA</button>
                        </div> -->
                    </div>
                </div>

                <label>Sitemap : articles {{project.resources.pages.length}}</label>

                <div class="flex flex-row flex-wrap justify-start" v-if="project.resources.pages.length">
                    
                    <template v-for="page in project.resources.pages"> 
                        
                            <div class="flex flex-col m-2 h-48 w-40 items-center justify-start shadow" :title="page.title">
                                <div class="text-xs truncate">{{page.title}}</div>
                                <img v-if="page.template_preview" :src="$imageURL(page.template_preview)" class="w-32 h-40 object-cover object-top"/>
                                <img v-if="!page.template_preview" src="no-image.png"/>
                            </div>
                    </template>
                    
                </div>
                
            </div>
        </div>
        
        <modal
            v-if="build"
            size="lg"
            position="modal"
            buttons="none"
            @close="build=!build">
            <div slot="title">Generate {{ project.title }}</div>
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
    </div> 
</template>

<script>
export default {
    name: 'WhoobeGeneratorNuxt',
    data:()=>({
        project: null,
        build: false,
        buildNuxt: null,
        output:'',
        errors: '',
        preview: false,
        store : null
    }),
    methods:{
        buildWebsite(){
            this.output = ''
            this.errors = ''
            this.build = true
            this.$api.service ( 'build-nuxt' ).patch ( this.buildNuxt._id , this.project  ).then ( res => {
                console.log ( res )
            })
        },
        saveProject(){
            this.$api.service ( 'projects' ).patch ( this.project._id , this.project ).then ( res => {
                this.$message ( 'Project saved')
            })
        },
        disableStore(){
            this.project.resources.store = false
            this.store = null
        },
        enableStore(){
            this.$api.service ( 'articles' ).find ( { query : { store: true } } ).then ( response => {
                if ( response.data.length ){
                    this.project.resources.store = true
                    this.store = response.data[0]   
                } else {
                    this.$message ( 'No Store found. Check you articles and set the store template to true')
                }
            })
        }

    },
    // computed:{
    //     store(){
    //         return this.project.resources.store ?
    //             this.project.resources.pages.filter ( store => store.store )[0] : null
    //     }
    // },
    mounted(){
        
        
        this.$api.service ( 'build-nuxt' ).find ().then ( res => {
            this.project = this.$attrs.project
            if ( !this.project.hasOwnProperty('seo_title') ){
                this.project.seo_title = this.project.blocks.name
                this.project.seo_description = this.project.blocks.name
            }
            if ( !this.project.analytics ){
                this.project.analytics = ''
            }
            if ( !this.project.pwa ){
                this.project.pwa = null
            }
            this.buildNuxt = res.data[0]
            
            this.$api.service ( 'articles' ).find ( { query : { store: true } } ).then ( response => {
                if ( response.data.length ){
                    this.store = response.data[0]   
                }
            })
        })

        this.$api.service('generate').on ( 'created' , (data) => {
            if ( data.data ){
               
                if ( data.data.includes ( 'Whoobe Site Generation done!' ) ){
                    this.$message ( 'Published on remote Whoobe. Ready to deploy')
                    
                }
                if ( data.data.includes('done') ){
                    
                }
                !data.data.includes('undefined') ? this.output += data.data : null//.normalize().replace('undefined','') : null
            } 
            if ( data.error ){
                this.errors += data.error.normalize()
            }
            
            // document.getElementById("generated").scrollTop = document.getElementById("generated").scrollHeight 
            // document.getElementById("generated_errors").scrollTop = document.getElementById("generated_errors").scrollHeight 
        })
    }
}
</script>