<template>
    <div class="p-4 bg-gray-200">
        <div class="flex flex-row text-sm cursor-pointer">
            <template v-for="t in tabs">
                <div @click="tab=t.tag" :class="tab===t.tag?'bg-black':''" class="px-2 desktop-tab capitalize border-0">{{t.label}}</div>    
            </template>
            <!--
            <div @click="tab='website'" :class="tab==='website'?'py-1 px-2 bg-blue-400 text-white':'py-1 px-2 bg-white text-blue-400 focus:outline-none border'">Website</div>
            <div @click="tab='moka'" :class="tab==='moka'?'py-1 px-2 bg-blue-400 text-white':'py-1 px-2 bg-white text-blue-400 border'">MOKAStudio</div>-->
        </div>
        <div class="flex flex-col justify-around">
            <div v-if="tab==='projects'">
                <h5 class="bg-gray-700 text-gray-200 p-1">Projects</h5>
                <div class="flex flex-row p-2 w-full text-base">
                    <whoobe-projects/>
                </div>
            </div>
            <div v-if="tab==='website'" class="border border-t-0 relative pb-8">
                <h5 class="bg-gray-700 text-gray-200 p-1">Site generator settings</h5>
                <div class="flex flex-row p-2 w-full text-base">
                        
                    <div class="w-1/2 flex flex-col">
                        <label class="font-bold">SEO Title (default)</label>
                        <input type="text" v-model="$datastore('setup').general.seo_title"/>
                        <label class="font-bold">SEO Description (default)</label>
                        <textarea v-model="$datastore('setup').general.seo_description" class="w-3/4"/>
                        <!--<label class="font-bold">Google Analytics Code</label>
                        <input type="text" v-model="moka.settings.google_analytics"/>
                        <div class="text-xs">Leave blank to not apply</div>-->
                        
                        
                        <label class="font-bold">Read More text</label>
                        <input type="text" v-model="$datastore('setup').general.read_more"/>

                        <label class="font-bold">Responsive menu class</label>
                        <textarea v-model="$datastore('setup').general.responsive_menu_css" class="w-3/4"/>

                        <label class="font-bold">Responsive menu transition</label>
                        <input type="text" v-model="$datastore('setup').general.responsive_menu_transition"/>
                        <p class="text-xs">(default fade)</p>
                    </div>
                    <!-- <div class="w-1/2">
                        <label class="font-bold">Layout settings</label>
                        <div class="bg-gray-200 rounded p-2 text-center cursor-pointer">
                            Colors<br>
                            <div class="flex flex-row justify-around">
                                <div class="flex flex-col cursor-pointer">
                                    <label class="font-bold">Text</label>
                                    <moka-color attr="textcolor" v-model="$datastore('setup').general.body_color" :css="$datastore('setup').general.body_color"/>
                                </div>
                                <div class="flex flex-col">
                                    <label class="font-bold cursor-pointer">Background</label>
                                    <moka-bgcolor attr="bgcolor" v-model="$datastore('setup').general.body_bg" :css="$datastore('setup').general.body_bg"/>    
                                </div>
                            </div>
                        </div>                    
                        
                        <div class="bg-gray-200 my-2 rounded p-2 text-center cursor-pointer">
                            Darkmode colors<br>
                            <div class="flex flex-row justify-around">
                                <div class="flex flex-col">
                                    <label class="font-bold">Text</label>
                                    <moka-color attr="textcolor" v-model="$datastore('setup').general.darkmode_color" :css="$datastore('setup').general.darkmode_color"/>
                                </div>
                                <div class="flex flex-col">
                                    <label class="font-bold cursor-pointer">Background</label>
                                    <moka-bgcolor attr="bgcolor" v-model="$datastore('setup').general.darkmode_bg" :css="$datastore('setup').general.darkmode_bg"/>    
                                </div>
                            </div>
                        </div>
                        <br>
                        <div class="flex flex-col">
                            <label class="font-bold">Enable Darkmode</label>
                            <input type="checkbox" v-model="$datastore('setup').general.darkmode"/>
                            <label class="font-bold">Enable Breadcrumb</label>
                            <input type="checkbox" v-model="$datastore('setup').general.breadcrumb"/>
                            <label class="font-bold">Enable Scrolltop</label>
                            <input type="checkbox" v-model="$datastore('setup').general.scrolltop"/>
                        </div>
                    </div> -->
                </div>
                <button class="absolute bottom-0 right-0 m-2" @click="saveSettings">Save</button>
            </div>
            <div v-if="tab==='categories'" class="border border-t-0">
                <moka-categories></moka-categories>
            </div>
            
            <div v-if="tab==='moka'" class="border border-t-0">
                <h5 class="bg-gray-700 text-gray-200 p-1">Studio settings</h5>
                    <div class="flex flex-row">
                    <div class="flex flex-col p-2 w-full md:w-1/2">
                        <!-- <div class="p-2 bg-gray-200 mb-4">
                        <label>License Key</label>
                        <input type="text" class="w-full" v-model="license"/>
                        <div class="flex flex-row">
                            <button class="mr-2" @click="setLicense()">Save</button>
                            <button v-if="!license"><a href="https://moodgiver.netlify.app" target="_blank">Get a License Key</a></button>
                        </div>
                        <div>{{licenseMessage}}</div>
                        </div> -->
                        <label>Server URL</label>
                        <input type="text" class="text-base w-full" v-model="strapiurl"/>
                        <button @click="setStrapiURL()">Save</button>
                        <div v-if="$datastore('setup')">
                        <label class="mt-4 font-bold">Block Types</label>
                        <select v-if="$datastore('setup') && $datastore('setup').types.components" v-model="currentType" multiple class="h-32 w-full" readonly>
                            <option v-for="(tipo,index) in $datastore('setup').types.components" :value="index">{{tipo}}</option>
                        </select>
                        <div class="flex flex-row my-1">
                            <input type="text" v-model="new_type" placeholder="footer,header,content"/>
                            <button class="ml-2 sm"  @click="$datastore('setup').types.components.push(new_type)">Add</button>
                            <button v-if="currentType.length" class="ml-2 sm danger" @click="removeTypes()">Remove</button>
                        </div>
                        <div class="text-xs">
                            Input values that can help to find/define your components like footer, header, call to action , etc
                        </div>
                        <button @click="saveTypes">Save</button>
                        </div>
                        <label class="font-bold">Colors palette</label>
                        <div class="flex flex-col">
                        <template v-for="color in colors">
                            <div class="flex flex-row mb-1">
                            <template v-for="n in 9">
                                <div :title="color + ' ' + (n*100)":class="'border w-6 h-6 rounded-full mr-2 bg-' + color + '-' + (n*100)"></div>
                            </template>
                            </div>
                        </template>
                        </div>
                    </div>
                    <div class="flex flex-col p-2 w-full md:w-1/2">
                        <label class="font-bold">Fonts</label>
                        <select v-if="moka" v-model="currentFont" multiple class="h-32 w-full" readonly>
                            
                            <option v-for="(font,index) in editor.fonts" :value="index">{{font}}</option>
                        </select>
                        <div class="text-xs">
                            To add fonts you need to update the environment variable VUE_APP_FONT_FAMILIES listing the fonts by name separated by the | character.
                            
                        </div>
                        
                    </div>
                </div>
            </div>
            <div v-if="tab==='elements'" class="border border-t-0">
                <h5 class="bg-gray-700 text-gray-200 p-1">Blocks Elements</h5>
                <moka-settings-elements/>
            </div>
            <div v-if="tab==='objects'" class="border border-t-0">
                <block-object/>
            </div>
        </div>
        <!-- <moka-modal
            v-if="licenseUser.login"
            @close="licenseUser.login=false"
            @click_0="licenseUser.login =false"
            @click_1="licenseLogin">
            <div slot="title">Authentication</div>
            <div slot="content" class="p-2 flex flex-col">
                In order to set your license key you need to login to your whoobe account.
                <label>Email</label>
                <input type="email" v-model="licenseUser.email"/>
                <label>Password</label>
                <input type="password" v-model="licenseUser.password"/>
            </div>
            <div slot="footer">
                <div>{{ licenseUser.message }}</div>
            </div>
        </moka-modal> -->
    </div>
</template>

<script>
// import MokaUser from '@/components/settings/user'
// import MokaColor from '@/components/editor/tailwind/tailwind.color'
// import MokaBgcolor from '@/components/editor/tailwind/tailwind.bgcolor'
import MokaSettingsElements from './elements'
import WhoobeProjects from './projects'
import MokaCategories from './categories'
import { mapState } from 'vuex'
import classes from '@/scripts/tw.classes'
import axios from 'axios'
export default {
    name: 'WhoobeSettings',
    components: { 
        MokaSettingsElements , MokaCategories , WhoobeProjects ,
        'block-object' : () => import ( './block.object.vue' ) 
    },
    data:()=>({
        tabs: [
            { label: 'Workspace' , tag: 'projects' },
            { label: 'Studio' , tag: 'moka' },
            { label: 'Generator' , tag: 'website' },
            { label: 'Categories' , tag: 'categories'},
            { label: 'Blocks Elements' , tag: 'elements'},
            { label: 'Blocks Object' , tag: 'objects'}
        ],
        tab: 'projects',
        types: null,
        new_type:'',
        currentColor: '',
        currentType: [],
        currentFont: [],
        new_font:'',
        newUser: {
            username: '',
            email: '',
            pasword: '',
            confirm: ''
        },
        strapiurl: '',
        license: '',
        licenseMessage: '',
        licenseUser: {
            login: false,
            email:'',
            password:'',
            message: ''
        }
    }),
    computed: {
        ...mapState ( ['moka','user','datastore','editor'] ),
        
        colors(){
            return this.mokacolors()
        }
    },
    mounted(){
        
        if ( window.localStorage.getItem('moka-strapiurl') ){
            this.strapiurl = window.localStorage.getItem('moka-strapiurl')
        }
        
        // this.$apiwhoobe.authenticate().then ( res => {
        //     console.log ( 'user authenticated')
        //     if ( window.localStorage.getItem('whoobe') ){
        //         let license = JSON.parse(window.localStorage.getItem('whoobe'))
        //         console.log ( license )
        //         this.license = license.apikey
        //     } else {
        //         this.licenseUser.login = true
        //     }
        // }).catch ( error => {
        //     console.log ( error )
        //     this.licenseUser.login = true
        // })
    },
    methods:{
        setStrapiURL(){
            window.localStorage.setItem ( 'moka-strapiurl' , this.strapiurl )
            alert ( 'Changed Strapi Server')
            window.location.reload()
            this.$router.push ( '/' )
        },
        setLicense(){
            
            // this.$apiwhoobe.service('apikeys').find ( { query : { apikey: this.license , active: 1}}).then ( res =>{
            //     if ( res.total ){
            //         this.$message('License Key is valid!Enjoy your new options using whoobe')
            //         window.localStorage.setItem('whoobe' , JSON.stringify ( { apikey:this.license }))
            //         this.licenseMessage = 'License is valid!!!' 
            //     } else {
            //         this.$message('Invalid license key! Some options are disabled')
            //         window.localStorage.removeItem('whoobe')
            //         this.licenseMessage = 'Invalid license key! Some options are disabled' 
            //     }
            // }).catch ( err => {
            //     this.$message ( 'Invalid license key')
            // })
        },
        licenseLogin(){
            // this.$apiwhoobe.authenticate({
            //     email: this.licenseUser.email,
            //     password: this.licenseUser.password,
            //     strategy: "local"
            // }).then ( user => {
            //     this.licenseUser.message = 'Now you can set your license key'
            //     this.$message ( this.licenseUser.message )
            //     this.licenseUser.login = false
            // }).catch ( error =>{
            //     this.licenseUser.message = 'Login error. Please check your credentials'
            //     this.$message ( 'Login error. Please check your credentials' )
            //     console.log ( error )
            // })
        },
        mokacolors(){
            return classes.colors
        },
        removeTypes(){
            this.currentType.forEach ( index => {
                this.moka.elements.types.types.splice ( index ,1 )
            })
        },
        saveTypes(){
            /*
            this.datastore.dataset.elements.types.types.sort()
            this.$api.service ( 'elements' ).patch ( this.datastore.dataset.elements[0]._id )
            this.$http.put ( 'elements' , this.moka.elements ).then ( response=>{
                this.$store.dispatch('message','Settings saved')
            }).catch ( error => {
                console.log ( error )
            })
            */
            
        },
        saveSettings(){

            /*
            this.$http.put ( 'settings' , this.moka.settings ).then ( response => {
                this.$store.dispatch('message','Settings saved')
            })
            */
        }
    },
}
</script>