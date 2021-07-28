<template>
    <div class="w-full p-2 text-gray-500 relative" v-if="projects">
        <div class="flex flex-row">
            <button class="lg" @click="addProject()">Add project</button>
        </div>
        <div class="flex flex-col w-full border border-gray-700 cursor-pointer">
            <div class="grid grid-cols-5 justify-between p-2 w-full text-base bg-gray-900">
                <div>Name</div>
                <div>Description</div>
                <div>Target folder</div>
                <div>Homepage</div>
                <div></div>
            </div>
            <template v-for="project in projects">
            <div class="grid grid-cols-5 justify-between border-t border-gray-700 p-2 w-full text-base hover:bg-gray-900">
                    <div>{{ project.name }}</div>
                    <div>{{ project.description }}</div>
                    <div class="text-sm px-1">{{ project.dist }}</div>
                    <div>
                        <img v-if="project.blocks" :src="$imageURL(project.blocks.image)" class="w-32 h-24 object-cover object-top"/>
                    </div>
                    <div class="flex justify-end">
                        <icon class="mx-2" name="edit"   @click="current=project,projectSet=!projectSet" title="Edit project"/>
                        <icon class="mx-2" name="web" title="Set Homepage" @click="current=project,reusable=!reusable"/>
                        <icon v-if="project.hasOwnProperty('blocks')" class="mx-2" name="dynamic_form" title="Generate" @click="generateProject(project)"/>
                    </div>
            </div>
            </template>
        </div>
        <transition name="slideright">
            <div class="absolute bg-gray-800 p-5 top-0 left-0 h-4/5 w-full z-10" v-if="generate">
                <whoobe-generator-nuxt :project="current" @close="generate=false" :target="current.dist"/>
            </div>
        </transition>
        <modal 
            v-if="projectSet"
            size="md"
            buttons="save"
            @close="projectSet=!projectSet"
            @click_0="projectSet=!projectSet"
            @click_1="saveProject">
            <div slot="title">Project</div>
            <div slot="content" class="p-2 flex flex-col w-full">
                <label>Name</label>
                <input class="dark" v-model="current.name"/>
                <!-- <label>Host</label>
                <input class="dark" v-model="current.host"/>
                <label>Port</label>
                <input class="dark" v-model="current.port"/> -->
                <label>Target folder</label>
                <input class="dark w-full" v-model="current.dist"/>
                <label>Description</label>
                <textarea class="dark w-full" v-model="current.description"/>
            </div>
        </modal>
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
    </div>
</template>

<script>
export default {
    name: 'WhoobeProjects',
    components: {
        'whoobe-generator' : () => import ( '@/components/settings/generator.vue' ),
        'whoobe-generator-nuxt' : () => import ( '@/components/settings/generator.nuxt.vue' ),
        'block-gallery' : () => import ( '@/components/blocks/actions/block.gallery.selection.vue' )
    },
    data:()=>({
        projectSet: false,
        projects: null,
        current: null,
        reusable: false,
        generate: false,
        homepage: null
    }),
    computed:{
    },
   
    methods:{
        setWebsiteTemplate(block){
            this.current.blocks = block
            delete this.current.block
            console.log ( 'website homepage => ' , block )
            if ( !block.purge ){
                this.current.block.purge = []
            }
            this.reusable = false
            this.saveProject()
        },
        addProject(){
            this.current = Object.assign ( {} , this.projects[0] )
            this.current.name = 'New project'
            this.current.blocks = null
            this.current.dist = null
            this.current.description = ''
            this.current._id = null
            this.projectSet = true
        },
        generateProject(project){
            this.$api.service ( 'components' ).get ( project.blocks._id ).then ( res => {
                this.current = project
                this.current.blocks = res
                this.projectResources()
                //this.generate = true
            })
        },
        
        
        saveProject(){
            if ( !this.current._id ) {
                delete this.current._id
                this.createProject()
            } else {
                this.$api.service ( 'projects' ).patch ( this.current._id , this.current ).then ( res => {
                    console.log ( res )
                    this.$message ( 'Project saved')
                })
            }
            
        },
        createProject(){
            this.$api.service ( 'projects' ).create ( this.current ).then ( result => {
                this.projects.push ( result )
                this.projectSet = false
                this.$message ( 'Project created')
            })
        },
        projectResources(){
            let links = this.current.blocks.links.map ( link => link.replace('/',''))
            delete this.current.blocks.autosave
            delete this.current.block
            
            this.$api.service ( 'articles' ).find ( {
                query : {
                    slug : { $in : links }
                }
            }).then ( res => {
                console.log ( res , links )
                let resources = {
                    purge : this.current.blocks.purge,
                    fonts : this.current.blocks.fonts,
                    plugins :this.current.blocks.plugins,
                    uploads: this.current.blocks.uploads,
                    links: this.current.blocks.links,
                    pages: [],
                    store: false
                }
                const collectData = () => new Promise ( (resolve,reject) =>{
                        res.data.forEach ( article => {
                            
                            if ( Array.isArray(article.blocks.purge) ){
                                resources.purge = [...resources.purge , ...article.blocks.purge ]
                            }
                            if ( Array.isArray(article.blocks.fonts) ){
                                resources.fonts = [...resources.fonts , ...article.blocks.fonts ]
                            }
                            if ( Array.isArray(article.blocks.plugins) ){
                                resources.plugins = [...resources.plugins , ...article.blocks.plugins ]
                            }
                            if ( Array.isArray(article.blocks.uploads) ){
                                resources.uploads = [...resources.uploads , ...article.blocks.uploads ]
                            }
                            if ( Array.isArray(article.blocks.links) ){
                                resources.links = [...resources.links , ...article.blocks.links ]
                            }
                        })
                        resolve ( resources )
                    })
                collectData().then ( res =>{
                    res.fonts  = [ ...new Set ( res.fonts ) ]
                    res.purge  = [ ...new Set ( res.purge ) ]
                    res.plugins  = [ ...new Set ( res.plugins ) ]
                    res.uploads  = [ ...new Set ( res.uploads ) ]
                    res.links = [ ...new Set ( res.links ) ].map ( link => link.replace('/','')).filter(slug=>slug.length)
                    if ( res.plugins.includes('store/') ){
                        this.$api.service ( 'articles' ).find ( { query: { store : true } }).then ( shop => {
                            res.fonts = [ ...res.fonts , ...shop.data[0].blocks.fonts ]
                            res.purge = [ ...res.purge , ...shop.data[0].blocks.purge ]
                            res.plugins = [ ...res.plugins , ...shop.data[0].blocks.plugins ]
                            res.uploads = [ ...res.uploads , ...shop.data[0].blocks.uploads ]
                            res.links = [ ...res.links , ...shop.data[0].blocks.links ]
                            res.fonts  = [ ...new Set ( res.fonts ) ]
                            res.purge  = [ ...new Set ( res.purge ) ]
                            res.plugins  = [ ...new Set ( res.plugins ) ]
                            res.uploads  = [ ...new Set ( res.uploads ) ]
                            res.links  = [ ...new Set ( res.links ) ]
                            this.$api.service ( 'articles' ).find ( {
                                query: {
                                    slug : { $in : res.links } ,
                                    $select: [ 'title' , 'slug' , 'template_preview' , 'store' ],
                                    $sort : { title : 1 }
                                }
                            }).then ( articles => {
                                
                                res.pages = articles.data
                                this.current.resources = res
                                this.current.target = this.current.dist
                                console.log ( res )
                                this.generate = true
                            })
                        })
                        
                    } else {
                        this.$api.service ( 'articles' ).find ( {
                        query: {
                            slug : { $in : res.links } ,
                            $select: [ 'title' , 'slug' , 'template_preview' ],
                            $sort : { title : 1 }
                        }
                        }).then ( articles => {
                            
                            res.pages = articles.data
                            this.current.resources = res
                            this.current.target = this.current.dist
                            this.generate = true
                        })
                    }
                    
                    
                })    
                //console.log ( purge )
            })
           
        }
    },
    mounted(){
        this.$loading()
        this.$api.service ( 'projects' ).find ( { query: { $sort: { name: 1}}})
            .then ( res => {
                this.projects = res.data
                this.$loading(false)
            })
        
        
    }
}
</script>