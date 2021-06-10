<template>
    <div class="w-full" v-if="selected">
        <button @click="create=!create">Create new</button>
        <!-- <template v-for="project in $mapState().datastore.dataset.projects">
            <div :class="'cursor-pointer theme-dark border p-1 mt-1 ' + active(project)" @click="getProjectData(project)">{{ project.name }}</div>
        </template> -->
        <div v-if="selected" class="w-full bg-gray-800 p-2 grid grid-cols-2 gap-10">
            <div class="flex flex-col">
                <label>Name</label>
                <input type="text" class="dark w-full text-sm" v-model="selected.name"/>
            </div>
            <div class="flex flex-col">
                <label>CMS URL</label>
                <input type="text" class="dark w-full text-sm" v-model="selected.url"/>
            </div>
            <div class="flex flex-col">
                <label>Destination folder</label>
                <input type="text" class="dark w-full text-sm" v-model="selected.dist"/>
            </div>
            <div class="flex flex-col">
                <label>Repo </label>
                <input type="text" class="dark w-full text-sm" v-model="selected.repo"/>
            </div>
            <div class="flex flex-col">
                <label>Google Analytics</label>
                <input type="text" class="dark w-full text-sm" v-model="selected.analytics"/>
            </div>
            <div class="flex flex-col">
                <label>Fonts</label>
                <textarea class="dark w-full text-sm" v-model="selected.fonts"/>
            </div>
            <div class="flex flex-col">
                <label>Target</label>
                <select class="dark w-full" v-model="selected.mode">
                    <option value="website">Website</option>
                    <option value="single">Single Page/Block</option>
                </select>
                <button @click="selectComponent=!selectComponent" v-if="selected.mode==='single'">Select</button>
                <img :src="$imageURL(selected.component.image)" v-if="selected.component" class="m-auto h-40 w-32 object-cover object-top"/>
            </div>

            <!---
            <template v-for="field in Object.keys(schema)">
                <div class="flex flex-col">
                <label>{{schema[field].label}}</label>
                <input class="w-full" type="text" v-if="schema[field].type==='string'" v-model="selected[field]"/>
                <input type="checkbox" v-if="schema[field].type==='boolean'" v-model="selected[field]"/>
                <textarea class="w-full h-24" v-model="selected[field]" v-if="schema[field].type==='array'"/>
                <select v-if="schema[field].type==='select'" v-model="selected[field]">
                    <option v-for="option in schema[field].options" :value="option">{{ option }}</option>
                </select>
                <select v-if="field==='landing'" v-model="landing">
                    <option v-for="landing in landingPages" :value="landing._id">{{ landing.name }}</option>
                </select>
                </div>
            </template>
            -->
            <div class="col-span-2 text-center">
                <button class="success m-auto" @click="saveProject">Save</button>
                <button class="success m-auto" @click="openProject(project)">Connect to</button>
            </div>
            <whoobe-used-images @images="setImages" :project="selected" v-if="selected"/>
        </div>
        <modal 
            size="md"
            position="modal"
            v-if="create"
            @close="create=!create"
            @click_0="create=!create"
            @click_1="createProject"
            buttons="save">
            <div slot="title">New Project</div>
            <div slot="content" class="p-2 flex flex-col">
                <label>Project name</label>
                <input type="text" v-model="newProject"/>
            </div>
        </modal>
        <modal 
            v-if="selectComponent"
            size="lg"
            position="modal"
            buttons="none"
            @close="selectComponent=!selectComponent">
            <div slot="title">Block/Template</div>
            <div slot="content">
                <block-gallery-selection @component="setComponent"/>
            </div>
        </modal>
    </div>
</template>

<script>
export default {
    name: 'WhoobeProjects',
    components: {
        'whoobe-used-images' : () => import ( './used.images.vue' ),
        'block-gallery-selection' : () => import ( '@/components/blocks/actions/block.gallery.selection.vue' )
    },
    data:()=>({
        selected : null,
        create: false,
        newProject: 'new project', 
        landingPages: null,
        landing: null,
        target: null,
        selectComponent: false,
    }),
    computed:{
        schema(){
            return this.$mapState().datastore.schema.projects
        }
    },
   
    methods:{
        active(name){
            return
            return name === JSON.parse(window.localStorage.getItem ( 'whoobe-workspace' )).name ?
                'bg-blue-400 text-white' : ''
        },
        getProjectData(project){
            this.$projectUsage()
        },
        getProject(name){
            this.$api.service ( 'projects' ).find ( { query: { project: name } } ).then ( res => {
                console.log ( res )
                this.selected = res
                this.selected.name = name
                
            })

        },
        openProject(name){
            this.$api.service ( 'projects' ).find ( { query: { project: name , connect: true } } ).then ( res => {
                console.log ( res )
                this.selected = res
                this.selected.name = name
                window.localStorage.setItem ( 'whoobe-workspace' , name )
                location.reload()
            })
        },
        saveProject(){
            //this.selected.fonts = Array.isArray(this.selected.fonts) ? this.selected.fonts.join('|') : this.selected.fonts
            //this.selected.fonts = this.selected.fonts.replaceAll(' ','+')
            this.$api.service ( 'projects' ).patch ( this.selected._id , this.selected ).then ( res => {
                console.log ( res )
            })
            return null
        },
        createProject(){
            this.$api.service ( 'projects' ).create ( {
                name: this.newProject.toLowerCase()
            }).then ( result => {
                this.$message ( result )
                this.create = false
                console.log ( result )
            })
        },
        setImages(images,fonts,purgeCSS ){
            this.uploads = images
            this.fonts = fonts
            this.fonts.push ( 'Barlow Condensed' )
            this.selected.fonts = this.fonts
            this.selected.uploads = images
            this.selected.purge = purgeCSS
        },
        setComponent ( component ){
            this.selectComponent = false
            this.selected.component = component
            this.selected.single = component._id
            this.selected.landing = component._id
        }

    },
    mounted(){
        if ( this.$mapState().desktop.project ){
            this.selected = this.$mapState().desktop.project
            this.selected.hasOwnProperty('analytics') ? null : this.selected.analytics = ''
        }
        this.$api.service ( 'components' ).find ( {query:{category:'landing page'}} ).then ( res => {
            this.landingPages = res.data
        })
    }
}
</script>