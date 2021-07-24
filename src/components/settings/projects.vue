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
                <!--<div class="flex flex-row justify-between p-2 border-b w-full text-base">-->
                    <div>{{ project.name }}</div>
                    <div>{{ project.description }}</div>
                    <div class="text-sm px-1">{{ project.dist }}</div>
                    <div>
                        <img v-if="project.block" :src="$imageURL(project.block.image)" class="w-32 h-24 object-cover object-top"/>
                    </div>
                    <div class="flex justify-end">
                        <icon class="mx-2" name="edit"   @click="current=project,projectSet=!projectSet" title="Edit project"/>
                        <icon class="mx-2" name="web" title="Set Homepage" @click="current=project,reusable=!reusable"/>
                        <icon v-if="project.hasOwnProperty('block')" class="mx-2" name="dynamic_form" title="Generate" @click="generateProject(project)"/>
                    </div>
                <!--</div>-->
            </div>
            </template>
        </div>
        <transition name="slideright">
            <div class="absolute bg-gray-800 p-5 top-0 left-0 h-4/5 w-full z-10" v-if="generate">
                <whoobe-generator :block="current.block" @close="generate=false" :target="current.dist"/>
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
        'block-gallery' : () => import ( '@/components/blocks/actions/block.gallery.selection.vue' )
    },
    data:()=>({
        projectSet: false,
        projects: null,
        current: null,
        reusable: false,
        generate: false,
        homepage: null
        // tab: 'project',
        // selected : null,
        // create: false,
        // newProject: 'new project', 
        // landingPages: null,
        // landing: null,
        // target: null,
        // selectComponent: false,
        // output:'Ready to start ...\n',
        // errors:'',
        // commit: false,
        // imagePreview: false,
        // imageZoom: null,
        // resources: false,
        // done: ''
    }),
    computed:{
        // schema(){
        //     return this.$mapState().datastore.schema.projects
        // },
        // hasStore(){
        //     return this.selected.hasOwnProperty('store')
        // }
    },
   
    methods:{
        setWebsiteTemplate(block){
            this.current.block = block
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
            this.current.block = null
            this.current.dist = null
            this.current.description = ''
            this.current._id = null
            this.projectSet = true
        },
        generateProject(project){
            this.current = project
            this.generate = true
            this.$api.service ( 'components' ).get ( this.current.block._id )
            // this.homepage.blocks = project.block
            // this.$api.service ( 'articles' ).patch ( this.homepage._id , this.homepage ).then ( res => {
            //     this.generate = true
            // })
        },
        // active(name){
        //     return
        //     return name === JSON.parse(window.localStorage.getItem ( 'whoobe-workspace' )).name ?
        //         'bg-blue-400 text-white' : ''
        // },
        // getProjectData(project){
        //     this.$projectUsage()
        // },
        // getProject(name){
        //     this.$loading(true)
        //     this.$api.service ( 'projects' ).find ( { query: { project: name } } ).then ( res => {
        //         this.selected = res
        //         this.selected.name = name
        //         this.selected.component.hasOwnProperty('seo') ? 
        //             null : 
        //                 this.selected.component.seo = {
        //                     title: name,
        //                     description: ''
        //                 }
        //         this.$api.service ( 'resources' ).create ( { project : this.selected } ).then ( res => {
        //             console.log ( res )
        //             this.selected.purge = res
        //             this.$loading(false)
        //         })
        //     })

        // },
        // async publish (){
        //     //this.$message('Collecting resources to publish ... please wait')
        //     this.selected = this.$projectResources ( this.selected )
        //     this.$message('Resources collected')
        //     this.output = ''
        //     this.errors = ''
        //     this.done = ''
        //     this.$api.service('whoobe/build').create({project:this.selected,uploads:this.selected.uploads,fonts:this.selected.fonts,commit:this.commit,store:this.hasStore?this.selected.store:false}).then ( res =>{
        //             this.output += res.data
        //     })
        // },
        // preview(){
        //     this.$api.service('whoobe/build').find ( { query: { preview: true} } ).then ( res => {
        //         window.open('http://localhost:5000','whoobe')
        //     })
        // },
        openProject(name){
            this.$api.service ( 'projects' ).find ( { query: { project: name , connect: true } } ).then ( res => {
                console.log ( res )
                this.selected = res
                this.selected.name = name
                this.selected.component.hasOwnProperty('seo') ? 
                    null : 
                        this.selected.component.seo = {
                            title: name,
                            description: ''
                        }
                window.localStorage.setItem ( 'whoobe-workspace' , name )
                location.reload()
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
        // setImages(images,fonts,purgeCSS ){
        //     this.uploads = images
        //     this.fonts = fonts
        //     this.fonts.push ( 'Barlow Condensed' )
        //     this.selected.fonts = this.fonts
        //     this.selected.uploads = images
        //     this.selected.purge = purgeCSS
        // },
        // setComponent ( component ){
        //     this.$loading ( true )
        //     this.selectComponent = false
        //     this.selected.name = component.name
        //     this.selected.component = component
        //     this.selected.single = component._id
        //     this.selected.landing = component._id
        //     this.selected.component.hasOwnProperty('seo') ? 
        //             null : 
        //                 this.selected.component.seo = {
        //                     title: component.name,
        //                     description: ''
        //                 }
        //     this.$api.service ( 'resources' ).create ( { project : this.selected } ).then ( res => {
        //             console.log ( res )
        //             this.selected.purge = res
        //             this.selected = this.$projectResources ( this.selected )
        //             this.$loading(false)
        //     })
        //     //this.selected = this.$projectResources(this.selected)
        // },
        // async loadResources(project){
        //     this.$loading(true)
        //     this.output = 'Collecting resources ...'
        //     this.resources = true
        //     project = await this.$projectResources ( project )
        //     this.resources = false
        //     this.output += 'Starting building process ...'
        //     return project
        // }
    },
    mounted(){
        this.$loading()
        this.$api.service ( 'projects' ).find ( { query: { $sort: { name: 1}}})
            .then ( res => {
                this.projects = res.data
                this.$loading(false)
            })
        this.$api.service ( 'articles' ).find ( { query: { homepage: true }}).then ( res => {
            this.homepage = res.data[0]
        })
        // if ( this.$mapState().desktop.project ){
        //     this.$loading(true)
        //     this.selected = this.$mapState().desktop.project
        //     this.$api.service ( 'components' ).get ( this.$mapState().desktop.project.component._id ).then ( res => {
        //         delete res.autosave
        //         this.selected.component = res
                
        //         this.selected.hasOwnProperty('analytics') ? null : this.selected.analytics = ''
        //         this.selected.component.hasOwnProperty('seo') ? 
        //                 null : 
        //                     this.selected.component.seo = {
        //                         title: this.selected.component.name,
        //                         description: ''
        //                     }
        //         this.$api.service ( 'resources' ).create ( { project : this.selected } ).then ( res => {
        //             console.log ( res )
        //             this.selected.purge = res
        //             this.$loading(false)
        //         })
        //         this.selected = this.$projectResources ( this.selected )
        //         //console.log ( 'calcolo interno ... ' , this.$projectResources ( this.selected ))
        //     })
        // }
        // this.$api.service ( 'components' ).find ( {query:{category:'landing page'}} ).then ( res => {
        //     this.landingPages = res.data
        // })

        // this.$api.service('generate').on ( 'created' , (data) => {
            
        //     if ( data.data ){
        //         if ( data.data.includes('done') ){
        //             this.done = 'Yahiiii project published!'
        //         }
        //         !data.data.includes('undefined') ? this.output += data.data.normalize().replace('undefined','') : null
        //         //term.write ( data.data + '\n')
        //     } 
        //     if ( data.error ){
        //         this.errors += data.error.normalize()
        //     }
        //     document.getElementById("generated").scrollTop = document.getElementById("generated").scrollHeight 
        //     document.getElementById("generated_errors").scrollTop = document.getElementById("generated_errors").scrollHeight 
        // })
    }
}
</script>