
/**
 * Editor main functions
 */
import Vue from 'vue'
import _ from 'lodash'
import store from '../store'
import jp from 'jsonpath'

//Vue.prototype.$db = db

/*var doc = { hello: 'world'
               , n: 5
               , today: new Date()
               , nedbIsAwesome: true
               , notthere: null
               , notToBeSaved: undefined  // Will not be saved
               , fruits: [ 'apple', 'orange', 'pear' ]
               , infos: { name: 'nedb' }
               };
db.insert(doc, function (err, newDocs) {
    if ( err ) { console.log ( err )}
    console.log ( newDocs )
    // Two documents were inserted in the database
    // newDocs is an array with these documents, augmented with their _id
});
*/
// import MokaModalDelete from '@/components/modals/modal.object.delete'
// Vue.component ( 'moka-modal-delete' , MokaModalDelete )

// import MokaModalSave from '@/components/modals/modal.save.before'
// Vue.component ( 'moka-modal-save' , MokaModalSave)

// import MokaEditorActions from '@/components/editor/render/moka.editor.actions'
// Vue.component ( 'moka-editor-actions' , MokaEditorActions )

// import MokaColor from '@/components/editor/tailwind/tailwind.color'
// Vue.component ( 'moka-color' , MokaColor )

// import MokaBgcolor from '@/components/editor/tailwind/tailwind.bgcolor'
// Vue.component ( 'moka-bgcolor' , MokaBgcolor )

//Vue.prototype.$db = db
/**
 * Constants
 * 
 */
const categories = [ 'page' ,  'template' , 'widget' , 'slider' , 'component' , 'element' , 'archive' , 'starred']
// pixels are the equivalent of tailwind values*4. The array is used to create the slider that converts values in // equivalent Tailwind values
const pixels = [ 1 , 4 , 8 , 12 , 16 , 20 , 24 , 32 , 40 , 48, 64 , 80 , 96 , 128 , 160 , 192 , 224 , 256 ]

//this are not used anymore 
//to check
const pixelsAttrs = {
    'p' : 'padding' ,
    'pt' : 'paddingTop' ,
    'pr' : 'paddingRight' ,
    'pb' : 'paddingBottom' ,
    'pl' : 'paddingLeft',
    m : 'margin',
    mt: 'marginTop',
    mr: 'marginRight',
    mb: 'marginBottom',
    ml: 'marginLeft' 
}
//this are not used anymore 
//to check

const textSizes = [ '','text-xs' , 'text-sm' , 'text-base' , 'text-lg' , 'text-xl' , 'text-2xl' , 'text-3xl' , 'text-4xl' , 'text-5xl' , 'text-6xl' , 'text-7xl' , 'text-8xl' , 'text-9xl' , 'text-10xl' , 'text-20xl']



//clone object and reassign any id to a new random id
var traverse = function(o) {
    for (var i in o) {
      //fn.apply(this,[i,o[i]]);  
      if (o[i] !== null && typeof(o[i])=="object") {
        traverse(o[i]);
      } else {
          if ( i === 'id' ){
              o[i] = randomID()
          }
      }
    }
    return o
  }

// Create a randomi ID
function randomID(){
    return 'moka-' + Math.random().toString(36).substr(2, 5)
}

// Find a node by ID (function not used anymore?)
// New implementation will use jsonpath
function findNode(id,currentNode ,remove){
    if (id == currentNode.id) {
        return currentNode;
    } else {
        var node = null
        for(var index in currentNode.blocks){
            
            node = currentNode.blocks[index];
            
            if(node.id === id){
                remove ? currentNode.blocks.splice(index,1) : null
                node.parent = currentNode
                store.dispatch ( 'setParent' , currentNode )
                return node;
            }
            findNode(id, node , remove );
        }
        return node

    }
}

// Find a node by key (function not used anymore?)
// New implementation will use jsonpath
function findKey(key,currentNode){
    if (currentNode.hasOwnProperty(key)) {
        return currentNode;
    } else {
        var node = null
        for(var index in currentNode.blocks){
            
            node = currentNode.blocks[index];
            
            if(node.hasOwnProperty(key)){
                return node;
            }
            findNode(key, node);
        }
        return node

    }
}

//clone object and reassign any id to a new random id
function clone(currentNode){
        var node = null
        for(var index in currentNode.blocks){
            
            node = currentNode.blocks[index];
            node.id = randomID()
            return clone(node);
        }
        return node
}

//not used
function getObj(obj,index){
    return obj[index]
}


export default {
    install: function (Vue) {
        //clone object
        Vue.prototype.$clone = ( obj )=>{
            if ( !obj ) return null
            return traverse ( obj )
        }
        
        //find object by key
        /**
         * @obj     Object  => Object to search
         * @key     String  => Key to find
         */
        Vue.prototype.$findObjectKey = ( obj , key )=>{
            if ( !obj ) return null
            return findKey ( key , obj  )
        }
        //return blocks categories (not used)
        Vue.prototype.$categories = ()=>{
            return categories
        }

        /**
         * find a node by ID and remove if
         @id            Int     => id to search
         @currentNode   Object  => object
         @remove        Boolean => true | false
        */
        Vue.prototype.$findNode= (id, currentNode , remove = false) => {
            return findNode(id, currentNode , remove );
        }
        /**
         * secure object copy (to avoid reactivity)
         @obj (object) => object to be copied
        */
        Vue.prototype.$copy = ( obj ) => {
            if ( !obj ) return
            let o = JSON.parse(JSON.stringify(obj))
            let newObj = clone(o)
            return newObj
        }
        /**
         * Copy block to clipboard
         * @returns null
         */
        Vue.prototype.$block_copy = () => {
            let current = store.state.editor.current
            window.localStorage.setItem('whoobe-clipboard',JSON.stringify(current) )
            store.dispatch('message','Block copied to clipboard')
            return
        }
        /**
         * Paste block from clipboard to current block (target has to have block property)
         */
        Vue.prototype.$block_paste = () => {
            let current = store.state.editor.current
            let obj = window.localStorage.getItem ( 'whoobe-clipboard' )
            obj = JSON.parse ( obj )
            obj = traverse ( obj )
            if ( current.hasOwnProperty ( 'blocks') ){
                current.blocks.push ( obj )
            }
        }
        /**
         * block duplicate
        */
        Vue.prototype.$block_duplicate = () => {
            let component = store.state.desktop.tabs[store.state.desktop.currentTab].blocks
            let current = store.state.editor.current
            if ( !component || !current ) return
            //let current = store.state.editor.current
            //console.log ( component )
            //let component = store.state.editor.component
            //console.log ( component )
            delete current.parent  
            console.log ( 'ID====>' , current.id )
            var parent = jp.parent ( component.json , '$..blocks[?(@.id=="' + current.id + '")]' )
            let i 
            if ( parent ){
                console.log ( 'parent ====> ' , parent )
                parent.forEach ( (p,index) => {
                    if ( p.id === current.id ){
                        i = index
                    }
                })
                let el = JSON.parse(JSON.stringify(current))
                let obj = traverse ( el )
                console.log ( 'duplicate => at :' , i , ' object => ', obj )
                //obj.id = randomID()
                parent.splice ( i+1 , 0 , obj )
                store.dispatch('message' , 'Element duplicated')
                return
            }
        }
        /**
         * 
         * @param {*} e 
         * @param {*} block 
         * @param {*} action 
         * @returns 
         */
        Vue.prototype.$block_moveup = () => {
            let component = store.state.editor.component
            let current = store.state.editor.current 
            var parent = jp.parent ( component.json , '$..blocks[?(@.id=="' + current.id + '")]' )
            if ( parent.length === 1 ) return
            let i
            parent.forEach ( (p,index) => {
                if ( p.id === id ){
                    i = index
                }
            })
            if ( i > 0 ){
                let obj = Object.assign({},current)
                parent.splice(i,1)
                parent.splice(i-1,0,obj)
            }
        }
        /**
         * Right click contextmenu
         * @e       Object  => $event
         * @block   Object  => element clicked
         * @action  String  => store action => 
         *                      'customize' = open customizer
         *                      'menu'      = open menu settings
         */ 
        Vue.prototype.$contextMenu = ( e , block , action='customize' ) => {
            if ( !block ) return 
            e.preventDefault()
            store.dispatch( 'selected' , block.id )
            store.dispatch ( 'setCurrent' , block )
            store.dispatch('setAction',action)
        }

        // not used
        Vue.prototype.$getDoc = ( obj , coord )=> {
            let o = obj
            let len = 0
            coord.forEach ( index => {
                if ( o.hasOwnProperty ( 'blocks' ) ){
                    o = o.blocks
                    if ( o.length ) len = o.length
                    o = getObj (o,index)
                }
            })
            return o
        }


        /**
         * Create a grid block
         @cols (int) => cols number (default 1)
        */
        Vue.prototype.$grid = (cols=1)=>{
                let grid = {
                    "css": {
                        "css": "",
                        "container" : "grid md:grid-rows-1 md:grid-cols-" + cols +  " grid-cols-1"
                    },
                    "cols" : cols,
                    "tag": "container",
                    "icon": "view_column",
                    "link": "",
                    "rows": [],
                    "type": "grid",
                    "image": null,
                    "label": "Columns",
                    "style": "",
                    "blocks": [],
                    "content": "",
                    "element": "grid",
                    "id": 'moka-' + Math.random().toString(36).substr(2, 5)
                }
                for ( var n = 0 ; n < cols ; n++ ){
                    let block = null
                    block = { 
                        "id": 'moka-' + Math.random().toString(36).substr(2, 5),
                        "blocks": [
                            {
                                "css": "",
                                "tag": "element",
                                "icon": "text_format",
                                "link": "",
                                "type": "element",
                                "label": "Text",
                                "style": "",
                                "content": "Some text",
                                "element": "div" ,
                                "id": 'moka-' + Math.random().toString(36).substr(2, 5)
                            }
                        ],
                        "image": null,
                        "css": {
                            css: "flex-col",
                            container: "flex"
                        },
                        "style": "",
                        "tag": "blocks",
                        "type": "flex",
                        "icon" : "select_all",
                        "link" : "",
                        "content" :"",
                        "element" : "div",
                        "gsap" : { "animation" : null , "ease" : null , "duration" : null , "delay" : null }
                    }
                    grid.blocks.push ( block )
                }
                return grid
            }

        /**
         * Create a flexbox element
        */   
        Vue.prototype.$flex = ()=>{
            let flex = { 
                "id": 'moka-' + Math.random().toString(36).substr(2, 5),
                "blocks": [
                    {
                        "css": "",
                        "tag": "element",
                        "icon": "text_format",
                        "link": "",
                        "type": "element",
                        "label": "Text",
                        "style": "",
                        "content": "Some text",
                        "element": "div" ,
                        "id": 'moka-' + Math.random().toString(36).substr(2, 5)
                    }
                ],
                "image": null,
                "css": {
                    css: "flex-col",
                    container: "flex"
                },
                "style": "",
                "tag": "blocks",
                "type": "flex",
                "link" : "",
                "content" :"",
                "elemend" : "div",
                "gsap" : { "animation" : null , "ease" : null , "duration" : null , "delay" : null }
            }
            return flex
        }

        /**
         * Beautify HTML code of the block preview
         @html      String      => html string
        */
        Vue.prototype.$beautify = ( html = '' )=>{
            if ( !html ) return ''
            var tab = '\t';
            var result = '';
            var indent= '';
        
            html.split(/>\s*</).forEach(function(element) {
                if (element.match( /^\/\w/ )) {
                    indent = indent.substring(tab.length);
                }
        
                result += indent + '<' + element + '>\r\n';
        
                if (element.match( /^<?\w[^>]*[^\/]$/ ) && !element.startsWith("input")  ) { 
                    indent += tab;              
                }
            });
            return result.substring(1, result.length-3);
        }
        
        /**
         * Create responsive classes
         @classe      String      => css classes
        */
        Vue.prototype.$cssResponsive = ( classe = '') => {
            if ( typeof classe === 'object' ) classe = classe.css
            if ( !classe || typeof classe === 'undefined' )  return ''
            let allCss = classe.split(' ')
            let responsiveCss = ''
            allCss.forEach ( css => {
                
                    css = css.replace(/\s\s+/g, ' ') 
                    let key = css.split('-')[0]
                    let val = css.split('-')[1]
                    if ( !css.includes('m-auto') ){
                        if (  pixelsAttrs[key] && textSizes.indexOf ( css ) < 0 ){
                            let value = pixels.indexOf ( parseInt(css.split('-')[1])*4 )
                            let rval = value > 4 ? pixels[value-4]/4 : 1
                            responsiveCss += ' ' + key + '-' + parseInt(rval) + ' md:' + css
                        } else {
                            if ( textSizes.indexOf ( css ) > -1 ){
                                let i = textSizes.indexOf ( css )
                                let rvalue = i > 2 ? textSizes[i-2] : textSizes[i]
                                responsiveCss += ' ' + rvalue + ' md:' + css 
                            } else {
                                if ( css.indexOf('translate') > -1 ){
                                    responsiveCss  += ' md:' + css
                                } else {
                                    responsiveCss += ' ' + css
                                }
                            }
                            if ( css.indexOf ( 'z-') ){
                                responsiveCss += ' '
                            }
                        }
                    } else {
                        responsiveCss += ' ' + css
                    }
                
            })
            return responsiveCss.replace(/\s\s+/g, ' ')
            
        }
        /**
         * 
         * Create unique id for any element in the object
         @component      Object      => Object to 
        */
        Vue.prototype.$unique = ( component = null ) => {
            if ( !component ) return false
            let obj = Object.assign( {} , component )
            obj.id = randomID()
            return traverse(obj)
        }
    }
}