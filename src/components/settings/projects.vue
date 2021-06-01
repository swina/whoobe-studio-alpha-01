<template>
    <div class="w-full">
        <button @click="create=!create">Create new</button>
        <template v-for="project in $mapState().datastore.dataset.projects">
            <div :class="'cursor-pointer theme-dark border p-1 mt-1 ' + active(project)" @click="getProjectData(project)">{{ project.name }}</div>
        </template>
        <div v-if="selected" class="w-full bg-gray-400 p-2 grid grid-cols-2 gap-10">
            <template v-for="field in Object.keys(schema)">
                <div class="flex flex-col">
                <label>{{schema[field].label}}</label>
                <input class="w-full" type="text" v-if="schema[field].type==='string'" v-model="selected[field]"/>
                <input type="checkbox" v-if="schema[field].type==='boolean'" v-model="selected[field]"/>
                <textarea class="w-full h-24" v-model="selected[field].join('\n')" v-if="schema[field].type==='array'"/>
                </div>
            </template>
            <div class="col-span-2 text-center">
                <button class="success m-auto" @click="saveProject">Save</button>
                <button class="success m-auto" @click="openProject(project)">Connect to</button>
            </div>
        </div>
        <moka-modal 
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
        </moka-modal>
    </div>
</template>

<script>
export default {
    name: 'WhoobeProjects',
    data:()=>({
        selected : null,
        create: false,
        newProject: 'new project'
    }),
    computed:{
        schema(){
            
            return this.$mapState().datastore.schema.projects
        }
    },

    methods:{
        active(name){
            return name === JSON.parse(window.localStorage.getItem ( 'whoobe-workspace' )).name ?
                'bg-blue-400 text-white' : ''
        },
        getProjectData(project){
            this.$projectUsage()
        },
        getProject(name){
            this.$api.service ( 'workspace' ).find ( { query: { project: name } } ).then ( res => {
                console.log ( res )
                this.selected = res
                this.selected.name = name
                
            })

        },
        openProject(name){
            this.$api.service ( 'workspace' ).find ( { query: { project: name , connect: true } } ).then ( res => {
                console.log ( res )
                this.selected = res
                this.selected.name = name
                window.localStorage.setItem ( 'whoobe-workspace' , name )
                location.reload()
            })
        },
        saveProject(){
            console.log ( this.selected )
            this.$api.service ( 'projects' ).patch ( this.selected._id , this.selected ).then ( res => {
                console.log ( res )
            })
            return null
        },
        createProject(){
            this.$api.service ( 'workspace' ).create ( {
                name: this.newProject.toLowerCase()
            }).then ( result => {
                this.$message ( result )
                this.create = false
                console.log ( result )
            })
        }

    },
    mounted(){
        if ( this.$mapState().desktop.project ){
            this.selected = this.$mapState().desktop.project
        }
    }
}
</script>