<template>
    <div class="h-24 text-center w-full hidden">Saving component ...</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: 'WhoobeSaveComponent',
    computed: {
        ...mapState ( ['editor','desktop'] )
    },
    methods:{
        saveComponent(){
            this.$loading ( true )
            let component = this.editor.component
            window.localStorage.setItem('whoobe-component',JSON.stringify(component) )
            delete component.autosave
            component.blocks_id ?
                component.blocks_id === component.json.id ?
                    null :
                        component.blocks_id = component.json.id 
                            : component.blocks_id = component.json.id
                            
            this.$saveComponent ( component ).then ( res => {
                this.$loading(false)
                this.$message('Block saved')
                this.$action()
                console.log ( res )
            }).catch ( err => {
                this.$loading(false)
                this.$message('An error occured. Check you console log.')
                this.$action()
                console.log ( err )
            })
        }
    },
    mounted(){
        this.saveComponent()
    }
}
</script>