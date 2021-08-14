<template>
    <div class="flex flex-col w-full" :class="classe" v-if="categories">
        <div v-if="!facets">
            <template v-for="category in categories">
                <div :class="$attrs.css" @click="$emitBus('category',category.name,false),group=category.name,$store.dispatch('popup',false)">
                    {{ category.name }}
                </div>
            </template>    
        </div>
        <div v-else class="w-full">
            <template v-for="category in categories">
                <div :class="$attrs.plugin.settings.general.css" class="w-full">
                    <div class="flex flex-row relative items-center truncate" @click="group?group!=category.name?group=category.name:group=null:group=category.name">
                        {{ category.name }}
                        <icon-extra :icon="group===category.name?'akar-icons:minus':'mi:add'" class="absolute right-0 mr-2"/>
                    </div>
                    <transition name="fade">
                    <div v-if="facets && group === category.name" class="ml-4 my-2">
                        <template v-for="facet in facets">
                            <div v-if="facet.collection === category._id" @click="$emitBus('category',{ category: category.name , facet: facet.name}),$store.dispatch('popup',false),current=category.name + ':' + facet.name" :class="$attrs.facet === facet.name ? 'font-bold my-3':'my-3'">
                                {{ facet.name }}
                            </div>
                        </template>
                        <div :class="!$attrs.facet?'font-bold':''" @click="$emitBus('category',category.name,false)">All</div>
                    </div>
                    </transition>
                </div>
            </template>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'WhoobeStoreCategoriesPlugin',
    data:()=>({
        group:'',
        categories: null,
        facets: null,
        display: false,
        current: ''
    }),
    computed:{
        classe(){
            return this.$attrs.plugin.settings.general.container 
        }
    },
    watch: {
        group(grp){
            if ( grp ){
                this.$emitBus ( 'category' , grp )
            }
        }
    },
    mounted(){
        this.$api.service('categories').find( { query: { $limit: 50 , type: 'product' , $sort : { name: 1} }}).then ( res => {
            this.categories = res.data
        })
        this.$api.service('categories').find ( { query: { $limit: 200 , collection : { $gt : ''} , $sort : { name: 1 } }}).then ( res =>{
            this.facets = res.data.sort( (a,b) => a.name - b.name )
            console.log ( this.facets )
        })
        console.log ( 'Whoobe Store => ' , this.$mapState().datastore.whoobe_store )
    }
}
</script>