<template>
    <div class="p-2 theme-dark rounded text-xs" v-if="component">
        <div>Page Settings</div>
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

        <!-- <div class="bg-gray-300 w-full my-1 p-1 font-bold cursor-pointer" @click="bodySettings=!bodySettings">Body settings <i class="material-icons">expand_more</i></div> -->
        <!-- <div class="flex flex-col mt-2 theme-dark p-2 w-full text-base cursor-pointer">
            <label class="font-bold">Body settings</label>
            <div class="flex flex-row w-full text-sm">
                <div class="mr-6">
                    <label class="font-bold">Text</label>
                    <block-color attr="textcolor" v-model="component.body_color" :css="component.body_color"/>
                </div>
                <div>
                    <label class="font-bold">Background</label>
                    <block-bgcolor attr="bgcolor" v-model="component.body_bg" :css="component.body_bg"/>
                </div>
            </div>
            <input type="checkbox" v-model="disableBodyCss"/> Disable in editor
        </div> -->
        <!-- <div v-if="bodySettings"> -->
            <label class="">Font</label>
            <select class="dark w-full" v-model="editor.component.json.fontFamily">
                <option value="">default</option>
                <option value="Arial">sans</option>
                <option value="serif">serif</option>
                <option v-for="font in editor.fonts" :value="font.replace('+',' ')">{{font.replace('+',' ')}}</option>
                
            </select>
        <!-- </div>     -->

        <div class="bg-gray-300 w-full cursor-pointer my-1 p-1 font-bold" @click="templateSettings=!templateSettings" v-if="component.category === 'template'">Template settings <i class="material-icons">expand_more</i></div>
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
        <chip content="SEO" css="bg-gray-900 text-gray-300 mt-4"/>
        <plugin-seo class="bg-gray-600"/>
        <!--<div class="grid grid-cols-2 gap-2 p-1">
            <label class="font-bold">Mobile breakpoint </label>
            <div class="flex flex-row cursor-pointer items-center" title="Set mobile responsive breakpoint">
                <i :class="'material-icons moka-icons text-sm p-1 mr-2 ' + mobile('md')" @click="breakpoint='md'">phone_iphone</i>
                <i :class="'material-icons moka-icons text-sm p-1 mr-2 ' + mobile('lg')" @click="breakpoint='lg'">tablet</i>
                <i :class="'material-icons moka-icons text-sm p-1 mr-2 ' + mobile('xl')" @click="breakpoint='xl'">laptop_mac</i>
            </div>
            
        </div>
        -->
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
        component: null
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
    mounted(){
        this.component = this.$mapState().editor.component
    }
}
</script>