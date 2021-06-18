<template>
    <div class="p-2 theme-dark rounded text-xs" v-if="component">
        <div class="border mt-2 border-gray-700 rounded-lg">
            <chip content="Page Settings" class="rounded-tr-lg rounded-tl-lg bg-gray-900"/>
            <div class="flex flex-col p-2 bg-gray-600">
                <label>Name</label>
                <input class="dark w-full" type="text" v-model="component.name"/> 
                <label>Description</label>
                <textarea class="dark w-full" v-model="component.description"></textarea>

                <label class="">Category</label>
                <select class="dark w-full" v-model="component.category">
                    <option :key="category" v-for="category in $mapState().datastore.dataset.setup[0].categories.components">{{ category }}</option>
                </select>
                
                <label class="">Type <i class="material-icons" @click="addType=!addType">add</i></label>
                <input class="dark w-full" v-if="addType" v-model="newType" @change="saveNewType"/>
                
                <select class="dark w-full" v-model="component.tags">
                    <option value=""></option>
                    <option :key="tipo" v-for="tipo in datastore.dataset.setup[0].types.components" :value="tipo">{{ tipo }}</option>
                </select>

                <label class="">Font</label>
                <select class="dark w-full" v-model="editor.component.json.fontFamily">
                    <option value="">default</option>
                    <option value="Arial">sans</option>
                    <option value="serif">serif</option>
                    <option v-for="font in editor.fonts" :value="font.replace('+',' ')">{{font.replace('+',' ')}}</option>
                    
                </select>
            </div>
        </div>
        
        <div class="bg-gray-300 w-full cursor-pointer my-1 p-1 font-bold" @click="templateSettings=!templateSettings" v-if="component.category === 'loop'">Loop settings <i class="material-icons">expand_more</i></div>
        <div class="flex flex-col text-sm bg-white p-1" v-if="templateSettings">

            <label class="font-bold">Default template</label>
            <div class="text-xs text-gray-600"><input type="checkbox" v-model="component.default"/> (apply to articles with no template)</div>
        
            <div class="my-1">
                <input type="checkbox" v-model="component.loop"/>
                <span class="font-bold">Loop </span>
            </div>
            <div class="flex flex-col" v-if="component.loop">
                <select class="w-full" v-model="component.loop_type">
                    <option value="">all</option>
                    <option value="articles">articles</option>
                    <option :key="opt.slug" v-for="opt in moka.categories" :value="opt.slug">articles/category/{{opt.name}}</option>
                </select>
                <div class="my-1">
                    <input type="checkbox" v-model="component.loop_pagination"/>
                    <label class="font-bold">Pagination</label> 
                </div>
                <div>Articles per page</div>
                <input class="w-full" type="number" min="1" max="100" v-model="component.loop_limit"/>
            </div>
        </div>


        <div class="border mt-2 border-gray-700 rounded-lg">
            <chip content="SEO" css="rounded-tl-lg rounded-tr-lg bg-gray-900 text-gray-300"/>
            <plugin-seo class="bg-gray-600"/>
        </div>
        
        
        <div class="border mt-2 border-gray-700 rounded-lg">
            <chip content="Analytics" css="rounded-tl-lg rounded-tr-lg bg-gray-900 text-gray-300"/>
            <div class="flex flex-col p-2 bg-gray-600">
                <input type="text" class="dark w-full" placeholder="Google Analytics" v-model="project.analytics"/>
            </div>
        </div>
        
        <div class="flex flex-row items-center justify-around pt-4">
            <button class="lg rounded bg-purple-600" @click="savePage()">Publish</button>
            <button v-if="preview" class="lg rounded bg-indigo-600" @click="previewProject()">Preview</button>
        </div>
        <!--<div class="grid grid-cols-2 gap-2 p-1">
            <label class="font-bold">Mobile breakpoint </label>
            <div class="flex flex-row cursor-pointer items-center" title="Set mobile responsive breakpoint">
                <i :class="'material-icons moka-icons text-sm p-1 mr-2 ' + mobile('md')" @click="breakpoint='md'">phone_iphone</i>
                <i :class="'material-icons moka-icons text-sm p-1 mr-2 ' + mobile('lg')" @click="breakpoint='lg'">tablet</i>
                <i :class="'material-icons moka-icons text-sm p-1 mr-2 ' + mobile('xl')" @click="breakpoint='xl'">laptop_mac</i>
            </div>
            
        </div>
        -->
        <div class="z-highest fixed top-0 right-0  h-screen w-screen bottom-0 left-0 bg-black bg-opacity-50" v-if="output">
            <div class="absolute bottom-0 left-0 w-full p-2 pl-10 bg-black text-lime-500 font-mono">
                <i class="iconify text-gray-300" data-icon="grommet-icons:console"></i> <span class="text-gray-300">whoobe-generator $ </span> {{ output }}
           </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WhoobeComponentSettings',
    components: {
        'block-color'   : () => import ( '../editor/tailwind/controls/tailwind.color.vue' ),
        'block-bgcolor' : () => import ( '../editor/tailwind/controls/tailwind.bgcolor.vue' ),
        'plugin-seo'    : () => import ( '@/components/plugins/seo/index.settings.vue')
    },
    data:()=>({
        bodySettings: false,
        templateSettings: false,
        addType: false,
        disableBodyCss: false,
        fontFamily:'',
        component: null,
        project:{},
        output:'',
        errors:'',
        preview: false,
        hasStore: false
    }),
    computed:{
        editor(){
            return this.$mapState().editor
        },
        // component(){
        //     return this.$mapState().editor.component
        // },
        datastore(){
            return this.$mapState().datastore
        }
    },
    methods:{
        loadProject(){
            //this.$loading(true)
            
            this.project = this.$projectResources ( this.project )
            let vm = this
            this.$api.service ( 'resources' ).create ( { project : this.project } ).then ( res => {
                vm.project.purge = res
                
                vm.$api.service('whoobe/build').create({project:vm.project,store:this.hasStore?this.project.store:false,commit:false}).then ( res =>{
                    console.log ( res.data )
                })
                //this.$loading(false)
            })
            // this.$api.service ( 'projects' ).find({query: { single: this.$mapState().editor.component._id }} ).then ( res => {
            //     console.log ( res )
            //     if ( !res.data.length ){
            //         this.project.component = this.$mapState().editor.component
            //         this.project.name = this.$mapState().editor.component.name
            //         this.project = this.$projectResources ( this.project )
            //         this.project.single = this.$mapState().editor.component._id
            //         this.$api.service ( 'projects' ).create ( this.project ).then ( res => {
            //             console.log ( 'created project=>' , res )
            //             this.$store.dispatch('project',this.project)
            //             this.$action('project_edit')
            //         })
            //     } else {
            //         this.project.component = this.$mapState().editor.component
            //         this.project.name = this.$mapState().editor.component.name
            //         this.project = this.$projectResources ( this.project )
            //         this.$store.dispatch('project',this.project)
            //         this.$action('project_edit')
            //     }
            // }) 
        },
        previewProject(){
             this.$api.service('whoobe/build').find ( { query: { preview: true} } ).then ( res => {
                window.open('http://localhost:5000','whoobe')
            })
        },
        savePage(){
            //this.$loading ( true )
            let component = this.editor.component
            if ( !component.hasOwnProperty('seo') ){
                this.$message ( 'SEO data are required in order to publish the page' )
                return
            }
            this.output = 'Saving data ...'

            window.localStorage.setItem('whoobe-component',JSON.stringify(component) )
            delete component.autosave
            component.blocks_id ?
                component.blocks_id === component.json.id ?
                    null :
                        component.blocks_id = component.json.id 
                            : component.blocks_id = component.json.id
                            
            this.$saveComponent ( component ).then ( res => {
                this.$loading(false)
                this.output = component.name + ' => Saved !'
                this.loadProject()
                console.log ( res )
            }).catch ( err => {
                this.$loading(false)
                this.$message('An error occured. Check you console log.')
                this.$action()
                console.log ( err )
            })
        },
    },
    mounted(){
        this.component = this.$mapState().editor.component
        this.project.component = this.$mapState().editor.component
        this.project.name = this.$mapState().editor.component.name
        this.project.uploads = []
        this.project.fonts = []
        this.project.purge = ''
        this.project.analytics = ''
        this.$api.service('generate').on ( 'created' , (data) => {
            
            if ( data.data ){
                if ( data.data.includes('done') ){
                    this.output = ''
                    this.$message ( 'Yahiiii project published!' )
                    this.preview = true
                    return
                } 
                //!data.data.includes('undefined') ? this.output += data.data.normalize().replace('undefined','') : null
                !data.data.includes('undefined') ? this.output = data.data.normalize().replace('undefined','') : null
                //term.write ( data.data + '\n')
            } 
            if ( data.error ){
                //this.errors += data.error.normalize()
                this.output = 'ERROR! ' + data.error.normalize() 
            }
            // document.getElementById("generated").scrollTop = document.getElementById("generated").scrollHeight 
            // document.getElementById("generated_errors").scrollTop = document.getElementById("generated_errors").scrollHeight 
        })
    }
}
</script>