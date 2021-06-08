<template>
    <div class="m-2 p-2">
        <div class="flex flex-col">
            <label>Title</label>
            <input class="dark w-full" type="text" v-model="seo.title"/>
            <label>Description</label>
            <textarea class="dark w-full" v-model="seo.description"/>
            <button class="lg bg-transparent border rounded border-gray-400" @click="saveSEO()">Save</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WhoobeBlockSEO',
    data:()=>({
        seo :{
            title: '',
            description: ''
        }
    }),
    methods: {
        saveSEO(){
            let component = this.$mapState().editor.component
            component.seo = this.seo
            this.$api.service ('components' ).patch ( component._id , component ).then ( res => {
                this.$message ( 'SEO settings saved' )
            })
        }
    },
    mounted(){
        this.$mapState().editor.component.hasOwnProperty('seo') ? 
            this.seo = { title: this.$mapState().editor.component.seo.title , description: this.$mapState().editor.component.seo.description } : null
    }
}
</script>