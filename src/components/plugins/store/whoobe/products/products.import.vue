<template>
    <div class="flex flex-col p-4">
        <div class="grid" v-if="schema && importFields">
            <template v-for="field in Object.keys(schema)">
                <div class="grid grid-cols-2">
                    <div>{{ field }}</div>
                    <div v-if="importFields">
                        <select @change="setImport(field,$event.target.value)">
                            <option value="">no import</option>
                            <option v-for="sfield in importFields" :value="sfield">{{sfield}}</option>
                        </select>

                    </div>
                </div>

            </template>

        </div>
        <div v-if="schema && importFields">
            <div class="flex flex-col p-2">
                <p>You are importing {{ json.length }} products 
                <br>
                </p>
                
                <button class="warning" @click="importProducts" v-if="!importing">Import Products</button>

                <div v-if="importOK">
                    Imported: {{ importOK.length }}
                    Errors: {{ importError.length }}
                </div>
                <!--<div v-if="loadedComponent">{{loadedComponent}}</div>-->
            </div>
        </div>
        <div class="flex text-white relative text-center p-2">
            <input type="file" class="absolute top-0 left-0 right-0 bottom-0 opacity-0" @change="loadTextFromFile"/>
            <button class="w-full warning">Select File</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MokaProductsImport',
    data:()=>({
        files: [],
        json: null,
        loaded: false,
        loadedComponent:'',
        blockIndex: null,
        schema: null,
        toImport: null,
        importFields: null,
        mapping: {},
        importOK: [],
        importError: []
    }),
    watch:{
        json(v){
            if ( v.length ){
                this.importFields = Object.keys ( v[0] ) 
            }
        }
    },
    mounted(){
        this.$http.get ( 'content-type-builder/content-types' ).then ( res => {
            const uid = res.data.data.filter ( ct => {
                return ct.schema.name === 'Product'
            })
            return uid[0].uid
        }).then ( uid => {
            this.$http.get ( 'content-type-builder/content-types/' + uid ).then ( res => {
                this.schema = res.data.data.schema.attributes
            })
        })
    },
    methods:{ 
        setImport ( field , source ){
            this.mapping[field] = source
        },
        loadTextFromFile(ev) {
            this.importing = false
            const file = ev.target.files[0];
            const reader = new FileReader();

            reader.onload = e => { 
                //this.json = Object.assign ( {} , JSON.parse(JSON.stringify(e.target.result)) ) //e.target.result //JSON.parse(Object.assign(JSON.parse(e.target.result)))
                this.json = e.target.result //JSON.parse ( JSON.stringify(e.target.result) )
                this.json = JSON.parse(this.json) 
            }
            reader.readAsText(file)
            
        },
        importProducts(){
            this.importing = true
            this.importOK = []
            this.importError = []
            this.json.map ( product => {
                let obj = {}
                Object.keys(this.mapping).map ( field => {
                    obj[field] = product[this.mapping[field]]
                })
                this.$http.post ( 'products' , obj ).then ( res => {
                    console.log ( res )
                    this.importOK.push ( obj )
                }).catch ( error => {
                    this.importError.push ( obj )
                })
            })
        }
        /*
        saveImported(){
            this.$http.post ( 'components' , this.json ).then ( result => {
                this.$store.dispatch ( 'loadComponents' )
                this.$message('Component uploaded successfully' )
                this.$emit('close')
            }).catch ( error => {
                console.log ( error )
                this.$message('An error occured. Check your console log' )
            })
            return null
        },
        importLibrary(){
            let n = 1
            this.json.forEach ( component => {
                this.$http.post ( 'components' , component ).then ( result => {
                    console.log ( result )
                    n++
                    this.loadedComponent = component.name
                    if ( n >= this.json.length ){
                        this.$store.dispatch ( 'loadComponents' )
                        this.$message('Blocks uploaded successfully' )
                        this.loadedComponent = 'Blocks loaded successfully !'
                    }
                }).catch ( error => {
                    console.log ( error )
                    this.$message('An error occured. Check your console log' )
                })
            })
            
        }
        */
        
    }
}
</script>