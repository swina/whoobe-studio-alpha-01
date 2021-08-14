<template>
    <div class="flex flex-col" :class="classe" v-if="categories">
        <h4 class="border-b">Categories</h4>
        <div v-if="!facets">
            <template v-for="category in categories">
                <div :class="$attrs.css" @click="$emit('category',category.name,false),group=category.name">
                    {{ category.name }}
                </div>
            </template>    
        </div>
        <div v-else>
            <template v-for="category in categories">
                <div :class="$attrs.block.css" @click="group=category.name">
                    <div class="flex flex-row relative items-center">
                        {{ category.name }}
                        <icon-extra :icon="group===category.name?'akar-icons:minus':'mi:add'" class="absolute right-0 mr-2"/>
                    </div>
                    <transition name="fade">
                    <div v-if="facets && group === category.name" class="ml-4">
                        <template v-for="facet in facets">
                            <div v-if="facet.collection === category._id" @click="$emit('facet',facet.name,false)" :class="$attrs.facet === facet.name ? 'font-bold':''">
                                {{ facet.name }}
                            </div>
                        </template>
                        <div :class="!$attrs.facet?'font-bold':''" @click="$emit('category',category.name,false)">All</div>
                    </div>
                    </transition>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WhoobeStoreCategories',
    data:()=>({
        group:'',
        categories: null,
        facets: null
    }),
    computed:{
        classe(){
            return this.$attrs.sidebar ?
                this.$attrs.css + ' w-full' : 'md:flex-row ' + this.$attrs.css
        }
    },
    mounted(){
        let service = this.$attrs.block.data.api
        if ( this.$attrs.block.data.parent_qry ){
            let qry_parent = JSON.parse(this.$attrs.block.data.parent_qry)
            this.$api.service( service ).find( { query: query_parent }).then ( res => {
                this.categories = res.data
            })
        }
        if ( this.$attrs.block.data.children_qry ){
            this.facets = true
            let qry_children = JSON.parse ( this.$attrs.block.data.children_qry )
            this.$api.service( service ).find ( { query:  qry_children }).then ( res =>{
                //this.facets = res.data.sort( (a,b) => a.name - b.name )
                //console.log ( this.facets )
            })
        }
    }
}
</script>