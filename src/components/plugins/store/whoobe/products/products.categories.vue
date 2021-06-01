<template>
    <div>
        <ul>
        <template v-for="category in Object.keys(categories)">
            <li class="list-none" ><input type="checkbox" v-model="selected[category]"/>{{ category }}</li>
            <ul v-if="categories[category].hasOwnProperty('names')">
            <template v-for="sub in Object.keys(categories[category].names)">
                <li class="list-none" ><input type="checkbox" v-model="selected[category +'|' + sub]"/>{{ sub }} </li>
                <nested-category :name="category +'|' + sub" :category="categories[category].names[sub]"></nested-category>
            </template>
            </ul>
        </template>
        </ul>
        <button @click="setCategory">SET</button>
    </div>
</template>

<script>
import NestedCategory from './products.nested.categories'
export default {
    name: 'WhoobeProductsCategories',
    components: { NestedCategory },
    computed:{
        selected(){
            return this.$mapState().datastore.selectedCategories
        },
        categories(){
            return this.$mapState().datastore.dataset.setup[0].categories.products
        }
    },
    methods:{
        setCategory(){
            let categories = Object.keys ( this.selected ).filter ( cat => {
                return this.selected[cat] 
            })
            console.log ( categories )
            categories = categories.map ( cat => {
                return cat = cat.split('|')
            }).join(',').split(',')
            let cats =  [ ...new Set(categories) ] 
            console.log ( cats )
        }
    }
}
</script>