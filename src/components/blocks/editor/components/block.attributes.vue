<template>
    <div class="flex flex-col m-2 p-2 bg-gray-200 text-black">
        <h4>Attributes</h4>
        <div class="grid grid-cols-3 gap-3 items-center" :key="hasKey()">
            <select v-model="currentAttribute">
                <option v-for="attribute in Object.keys(attributes)" :value="attribute">{{ attribute }}</option>
            </select>
            <input type="text" v-model="attributes[currentAttribute]" v-if="currentAttribute">
            <icon name="close" class="ml-4" v-if="currentAttribute"/>
        </div>
        <!-- <template v-for="attribute in Object.keys(attributes)">
            <label>{{ attribute }}</label>
            <input type="text" v-model="attributes[attribute]"/>
        </template> -->
        <label>New Attribute</label>
        <input type="text" v-model="newAttribute.name"/>
        <label>Value</label>
        <input type="text" v-model="newAttribute.value">
        <button @click="addAttribute()">Add</button>
        <button @click="saveAttributes()" class="success mt-8 m-auto">Save</button>
    </div>
</template>

<script>
export default {
    name: 'BlockAttributes',
    data:()=>({
        element: null,
        attributes: {},
        currentAttribute:{},
        newAttribute: {
            name: '',
            value:''
        }
    }),
    methods:{
        addAttribute(){
            this.attributes[this.newAttribute.name] = this.newAttribute.value
            this.element.attributes[this.newAttribute.name] = this.newAttribute.value
            this.currentAttribute = this.newAttribute.name
        },
        saveAttributes(){
            this.$store.dispatch ( 'setCurrent' , this.element )
            this.$message('Attributes saved')
        },
        hasKey(){
            return this.$randomID()
        }
    },
    mounted(){
        this.element = this.$mapState().editor.current
        this.element.hasOwnProperty('attributes') ?
            this.attributes = this.element.attributes : this.element.attributes = {}
    }

}
</script>