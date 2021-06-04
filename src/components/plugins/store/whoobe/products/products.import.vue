<template>
    <div class="flex flex-col p-4 bg-white text-black">
        <!-- <div class="grid" v-if="schema && importFields">
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

        </div> -->
        <div v-if="schema && importFields">
            <div class="flex flex-col p-2">
                <p>You are importing {{ json.length }} products 
                <br>
                </p>
                
                <button class="warning" @click="importProducts" v-if="!importing">Import Products</button>

                <div v-if="importOK">
                    Imported: {{ importOK.length }}
                    Errors: {{ importError.length }}
                    <div v-for="error in importError" class="flex flex-col">
                        <div>{{ error }}</div>
                    </div>
                </div>
                <!--<div v-if="loadedComponent">{{loadedComponent}}</div>-->
            </div>
        </div>
        <div class="flex text-white relative text-center p-2">
            <input type="file" class="absolute top-0 left-0 right-0 bottom-0 " @change="loadTextFromFile"/>
            <button class="w-full warning">Select File</button>
        </div>
    </div>
</template>

<script>
import model from '../model.js'
import jp from 'jsonpath'

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
        this.schema = model
    },
    methods:{ 
        setImport ( field , source ){
            this.mapping[field] = source
        },
        loadTextFromFile(ev) {
            this.importing = false
            const file = ev.target.files[0];
            const reader = new FileReader();
            let vm = this
            reader.onload = e => { 
                //this.json = Object.assign ( {} , JSON.parse(JSON.stringify(e.target.result)) ) //e.target.result //JSON.parse(Object.assign(JSON.parse(e.target.result)))
                this.json = vm.csv_to_json(e.target.result) //JSON.parse ( JSON.stringify(e.target.result) )
                //this.json = JSON.parse(JSON.stringify(this.json)) 
            }
            reader.readAsText(file)
            
        },
        importProducts(){
            this.importing = true
            this.importOK = []
            this.importError = []
            this.json.map ( product => {
                if ( product.name ){
                    product.type = "product"
                } else {
                    product.type = "variation"
                }
                if ( product.assets ){
                    product.assets = '/uploads/' + product.assets
                }
                this.$api.service( 'products' ).create ( product ).then ( res => {
                    this.importOK.push( product.sku )
                }).catch ( error => {
                    this.importError.push ( produc.sku )
                })
            })
        },
        csv_to_json(csvData) {
            var data = this.CSVToArray(csvData);
            var objData = [];
            for (var i = 1; i < data.length; i++) {
                objData[i - 1] = {};
                for (var k = 0; k < data[0].length && k < data[i].length; k++) {
                    var key = data[0][k].trimEnd()
                    objData[i - 1][key] = data[i][k].trimEnd().replaceAll('category:','')
                }
            }
            console.log ( objData )
            return objData
        },
        CSVToArray(csvData, delimiter) {
            delimiter = (delimiter || ",");
            var pattern = new RegExp((
            "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + delimiter + "\\r\\n]*))"), "gi");
            var data = [[]];
            var matches = null;
            while (matches = pattern.exec(csvData)) {
                var matchedDelimiter = matches[1];
                if (matchedDelimiter.length && (matchedDelimiter != delimiter)) {
                    data.push([]);
                }
                if (matches[2]) {
                    var matchedDelimiter = matches[2].replace(
                    new RegExp("\"\"", "g"), "\"");
                } else {
                    var matchedDelimiter = matches[3];
                }
                data[data.length - 1].push(matchedDelimiter);
            }
            return (data);
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