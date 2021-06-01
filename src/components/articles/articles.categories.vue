<template>
     <div class="m-4 p-2 bg-gray-100 flex flex-col">
        <div class="grid grid-cols-2 grid-flow-row items-center" style="grid-template-columns:1fr .2fr .6fr .2fr;">
            <h3 class="">
                Categories
            </h3> 
        </div>
        <div class="flex flex-col text-sm">
            <div class="grid grid-cols-3 gap-4 w-1/2 bg-gray-200 p-2">
                <div class="font-bold mr-2">Category</div>
                <div class="font-bold">Slug</div>
                <div></div>
            </div>
            <div class="grid grid-cols-3 gap-4 w-1/2 border p-2 items-center">
            <template v-for="cat in datastore.dataset.setup[0].categories.articles">
                <div><input class="w-full" type="text" v-model="cat.name" @keyup="slugit(cat.name,cat)"/></div>
                <div><input class="w-full" type="text" v-model="cat.slug" readonly/></div>
                <div><i class="material-icons" title="Save" @click="save(cat)">save</i></div>
            </template>
                <div class="col-span-3">
                    Add category
                </div>
                <div>
                    <input class="w-full" type="text" v-model="category.name" placeholder="new category" @keyup="slugit(category.name,category)"/>
                </div>
                <div>
                    <input class="w-full" type="text" v-model="category.slug" readonly/>
                </div>
                <div>
                    <button title="Add" @click="add(category)">Add</button>
                </div>
           </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default { 
    name: 'MokaCategories',
    data:()=>({
        category: {
            name: '',
            slug: ''
        }
    }),
    computed:{
        ...mapState ( ['datastore'])
    },
    methods:{
        slugit(txt,cat){
            cat.slug = this.$slugify(txt)
        },
        save(category){
            this.$api.service('categories').patch ( category.id , category ).then ( result => {
                this.$store.dispatch ( 'message' , 'Category saved' )
                this.$find('setup')
            })
        },
        add(category){
            this.$api.service ( 'categories').create ( category ).then ( result => {
                this.$store.dispatch ( 'message' , 'Category added' )
                this.category = {
                    name: '',
                    slug: ''
                }
                this.datastore.dataset.setup[0].categories.articles.push ( result.data )
            })
        }
    }
}
</script>