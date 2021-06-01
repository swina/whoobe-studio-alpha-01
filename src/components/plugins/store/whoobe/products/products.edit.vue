<template>
    <div v-if="editor.current" class="theme-dark">
        <div class="grid grid-cols-2 gap-2 p-2 bg-gray-100 text-gray-700">
            <template v-for="field in Object.keys(schema)">
                <div v-if="schema[field].edit" class="flex flex-col text-gray-800">
                    <label class="capitalize">{{ field }}</label>
                    <input type="text" v-if="schema[field].type==='string'" v-model="editor.current[field]"/>
                    <input type="checkbox" v-if="schema[field].type==='boolean'" v-model="editor.current[field]"/>
                    <textarea v-if="schema[field].type==='text'" v-model="editor.current[field]"/>
                    <input type="number" v-if="schema[field].type==='currency'" min="0" v-model="editor.current[field]"/>
                    <div class="h-64" v-if="schema[field].type==='image'">
                        <!-- <img :src="$imageURL(current[field])" v-if="!current.hasOwnProperty('image')" class="h-48 object-cover object-top"/> -->
                        <img v-if="editor.current.image"  :src="$imageURL(editor.current.image)" class="h-48 object-cover object-top"/>
                        <button @click="$action('media')">Select</button>
                        
                    </div>
                
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'WhoobeProductEdit',
    data:()=>({
        current: null,
        images: false,
    }),
    props: ['id'],
    computed:{
        ...mapState(['editor']),
        schema(){
            
            return this.$mapState().datastore.schema.products
        },
        
    }
}
</script>