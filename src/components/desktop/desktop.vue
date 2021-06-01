<template>
    <div>
        <desktop-tabs @menu="sidebar=!sidebar"/>
        <desktop-sidebar v-if="sidebar"/>
        <desktop-container :boxed="sidebar"/>
        <desktop-home v-if="$mapState().desktop.tabs.length === 0"/>
            <!-- <h2>Whoobe Studio</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 text-purple-500 grid-cols-1 gap-10">
                <div class="h-64 bg-center bg-cover bg-no-repeat shadow-lg flex items-end" :style="'background-image: url(' + this.$imageURL('/uploads/architectu_bw.webp') + ');'">
                    <div class="bg-black w-full flex flex-row p-2 bg-opacity-75 cursor-pointer" @click="$action('component_create')">
                        <icon name="view_quilt" class="text-8xl"/>
                        <h4 class="p-2">Create a block</h4>
                    </div>
                </div>
                <div class="h-64 bg-center bg-cover bg-no-repeat shadow-lg flex items-end" :style="'background-image: url(' + this.$imageURL('/uploads/laptop_bw.webp') + ');'">
                    <div class="bg-black w-full flex flex-row p-2 bg-opacity-75">
                        <icon name="article" class="text-8xl"/>
                        <h4 class="p-2">Create an article</h4>
                    </div>
                </div>
                
                <div class="h-64 bg-center bg-cover bg-no-repeat shadow-lg flex items-end" :style="'background-image: url(' + this.$imageURL('/uploads/technology_bg_001.webp') + ');'">
                    <div class="bg-black w-full flex flex-row p-2 bg-opacity-75">
                        <icon name="collections" class="text-8xl"/>
                        <h4 class="p-2">Manage Media</h4>
                    </div>
                </div>
                <div class="h-64 bg-center bg-cover bg-no-repeat shadow-lg flex items-end" :style="'background-image: url(' + this.$imageURL('/uploads/laptop_1205256_1920_d809b836cf.jpg') + ');'">
                    <div class="bg-black w-full flex flex-row p-2 bg-opacity-75">
                        <icon name="help" class="text-8xl"/>
                        <h4 class="p-2">Documentation</h4>
                    </div>
                </div>
                <div class="text-gray-400">
                    <h3>Info</h3>
                    <p>Version: alpha-version <br>May 2021</p>
                    <p>Author: Antonio Nardone</p>
                    <small>MIT License - Open source - Free</small>
                </div>
                <div class="text-gray-400">
                    <h3>Last updates</h3>
                    <p>- Context menu in the block editor and preview window</p>
                    <p>- Multitabs support</p>
                    <p>- Import media from Pixabay, upload media to Cloudinary, upload images from URL</p>
                    <p>- Image editor</p>
                </div>
                <div class="text-gray-400">
                    <h3>Tips</h3>
                    <ul>
                        <li>Copy&Paste any block/element between documents with Alt+C (copy) and Alt+v (paste)</li>
                        <li>Copy CSS attributes between blocks/elements with Alt+g (copy) and Alt+h (paste)</li>
                        <li>In the Block Editor and the Block preview window click the mouse right button to access to a context menu</li>
                    </ul>
                </div>
                <div class="text-gray-400">
                    <h3>Issues</h3>
                    <p>Help to improve Whoobe. Any time you find a bug or an error please open an issue on <a href="https://github.com/swina/whoobe-studio-alpha" target="_blank">Github repository</a></p>
                </div>
               
            </div> 
        </div>-->
        <icon name="lock" class="fixed z-highest bottom-0 left-0 m-2 text-indigo-500" @click="logout()"/>
    </div>
</template>

<script>
import jp from 'jsonpath'
export default {
    name: 'Desktop',
    data:()=>({
        sidebar: true
    }),
    components: {
        'desktop-sidebar'   : () => import ( './desktop.sidebar.vue'),
        'desktop-tabs'      : () => import ( './desktop.tabs.vue'),
        'desktop-container' : () => import ( './desktop.container.vue'),
        'desktop-home'      : () => import ( './desktop.home.vue')
    },
    methods:{
        datastore(){
            this.$api.service ( 'projects' ).find().then ( res => {
                this.$store.dispatch ( 'dataset' , { table: 'projects' , data: res.data } )
                if ( res.data.length === 1 ){
                    this.$store.dispatch ( 'project' , res.data[0] )
                }
            })
            this.$loading(true)
            this.$find('plugins') 
            this.$find('settings')
            this.$find('setup')
            this.$find('elements')
            this.$find('workspace')
            this.$api.service('block-elements').find ( { query : { $limit: 200 } } ).then ( res => {
                this.$store.dispatch ( 'dataset' , { table: 'blocks' , data: res.data } )
                let categories = jp.query ( res.data , '$..category' )
                console.log ( this.$arrayGroup ( res.data , 'category') )
                console.log ( [ ...new Set(categories) ].sort() )
            })
            this.$api.service('articles').find ( 
                { 
                query : 
                {
                    $select : ['_id', 'title' , 'slug' , 'template_id' , 'homepage' , 'active' ] 
                }
                }
            ).then ( result => {
                this.$loading()
                this.$store.dispatch ( 'dataset' , { table: 'articles' , data: result.data })
                // let elements = this.$mapState().datastore.dataset.elements[0].moka 
                // Object.keys ( elements ).forEach ( group => {
                //   if ( group != 'keys' && group != 'categories' ){
                //     elements[group].forEach ( element => {
                //       let el = element
                //       el.category = group
                //       this.$api.service ( 'block-elements' ).create ( el )
                //     })
                //   }
                // })
            })
        },
        logout(){
            window.localStorage.removeItem ( 'feathers-jwt' )
            this.$store.dispatch ( 'login' , false )
            this.$router.push('/login')
        }
    } ,
    mounted(){
        this.$api.authenticate().then ( res => {
            this.datastore()
        }).catch ( error => {
            this.$router.push('')
        })
    }
}
</script>