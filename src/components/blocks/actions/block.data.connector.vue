<template>
    <div class="flex flex-col theme-dark" :key="editor.current.id">
        <div class="p-2">
            Data Connector {{ editor.current.id }}
            <select v-model="connector" class="dark w-full">
                <option v-for="data in Object.keys(datastore).sort()" :value="data">{{ data }}</option>
            </select>
            <div v-if="connector">
                Field
                <select v-model="field" v-if="Array.isArray(connectToData)" class="dark w-full">
                    <option></option>
                    <option v-for="key in connectToData.sort()" :value="key">{{ key }}</option>
                </select>
                <div  v-if="typeof datastore[connector][field] === 'object'">
                    Key
                    <select v-model="key" class="dark w-full">
                        <option></option>
                        <option v-for="k in Object.keys(datastore[connector][field])" :value="k">{{ k }}</option>
                    </select>
                </div>
                <button v-if="field" class="mt-2 mr-2" @click="dataConnect(true)">Connect</button>
                <button v-if="editor.current.hasOwnProperty('datastore')" class="mt-2" @click="dataConnect(false)">Disconnect</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'WhoobeDataConnector',
    data:()=>({
        connector: null,
        field: null,
        key: null,
        keys: null
    }),
    // watch: {
    //     field( value ){
    //         if ( !typeof value === 'object' ){
    //             return value
    //         } else {
    //             this.objectKeys ( value )
    //         }
    //     }
    // },    
    computed:{
        ...mapState ( [ 'editor' , 'datastore' ] ),
        connectToData(){
            
            let cData = this.datastore[this.connector]
            if ( typeof cData === 'object' ){
                return Object.keys ( cData )
            }
            return this.datastore[this.connector]
        }
    },
    methods: {
        objectKeys(key){
            this.keys =  Object.keys ( this.datastore [ this.connector ] [ key ] )
        },
        dataConnect(flag){

            if ( flag ){
                this.editor.current.datastore = {
                    connector : this.connector ,
                    field: this.field,
                    key: this.key
                }
            } else {
                delete this.editor.current.datastore 
            }
        },
        
    },
    mounted(){
        if ( this.editor.current.hasOwnProperty('datastore') ){
                this.connector = this.editor.current.datastore.connector
                this.field = this.editor.current.datastore.field
                this.key = this.editor.current.datastore.key
            }
    }
    
}
</script>