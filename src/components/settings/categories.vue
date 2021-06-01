<template>
  <div class="">
    <div class="w-full text-gray-200 text-2xl py-2 px-2 bg-gray-700">
      Categories
    </div>
    <div class="p-4 flex flex-col">
      <select v-model="current" size="10" class="w-64">
        <option
          :key="category"
          class="py-1"
          v-for="(category,index) in datastore.dataset.setup[0].categories.components"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
      <div>
        <input type="text" v-model="current" title="Input to set a new category"/> 
        <button @click="save" class="mx-2" v-if="current">Update</button>
        <button @click="add" class="" v-if="current && !categories.includes(current)">Add</button>
        <button @click="remove" class="danger mx-2" v-if="current && categories.includes(current)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'MokaCategoriesSettings',
    data:()=>({
        index: null,
        current: null,
        categories: null
    }),
    computed:{
      ...mapState ( ['datastore'] )
    },
    mounted(){
        this.categories = this.$datastore('setup').categories.components.sort()
    },
    watch:{
        current ( v ){
            if ( !v ) return
            if ( this.categories.includes(v) ){
                this.index =  this.categories.indexOf ( v ) 
            }
        }
    },
    methods:{
        indx(evt){
            console.log ( evt )
        },
        save(){
            if ( this.$datastore('setup').categories.components.includes(this.current)){
                let settings = this.$datastore('setup')
            }
        },
        add(){
          this.datastore.dataset.setup[0].categories.components.push ( this.current )
          this.$api.service ( 'setup' ).patch ( this.datastore.dataset.setup[0]._id , this.datastore.dataset.setup[0] ).then ( res => {
            console.log ( res )
            this.$store.dispatch('dataset', { table: 'setup' , data: [res] } )
          })
        },
        remove(){
            this.index = this.categories.indexOf( this.current )
            if ( this.index > -1 ){
                this.current = null
                this.datastore.dataset.setup[0].categories.components.splice(this.index,1)
                this.$api.service ( 'setup' ).patch ( this.datastore.dataset.setup[0]._id , this.datastore.dataset.setup[0] ).then ( res => {
                  this.$store.dispatch('dataset', { table: 'setup' , data: [res] } )
                })
            }
        }
    }
}
</script>