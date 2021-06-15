<template>
  <div class="w-full theme-dark">
    <div class="sticky top-0 p-2 w-full theme-dark flex flex-row items-center justify-start">
      <button class="lg" @click="$action('component_create')">New</button>
      <button class="lg mx-1" @click="$action('component_import')">Import</button>
      <button class="lg" @click="$mapState().editor.export='category',$action('component_export')">Export All</button>
      <input class="dark mt-1 ml-2" type="text" placeholder="search..." v-model="search" @keydown="searchComponent($event)"/>
      <button v-if="search" @click="search='',blocks=objects">Reset</button>
    </div>
    <div v-if="objects" class="px-2 py-4 m-auto whoobe-components-gallery flex flex-row flex-wrap justify-center ">
      <!-- GALLERY -->
      <div v-for="comp in blocks" class="mx-4 my-4 w-48" :title="comp.name + '-' + comp.description + ' ' + comp.updatedAt" :key="comp._id">
        <!-- <div v-if="comp && comp.hasOwnProperty('name')"> -->
          <div class="pl-1 h-7 text-xs text-gray-400">
            {{ comp.name.substring(0,20) }} 
          </div>

          <div class="w-48 h-56 flex flex-col items-center justify-center border border-gray-700" @click="selectComponent(comp.id, 'component', comp)">
              <img v-if="comp.image"
                :class="'image_' + comp._id"
                class="object-cover object-top object-left w-48 h-56"
                :src="$imageURL(comp.image)"
                title="Click to edit"
                />
              <icon v-if="!comp.image" name="view_quilt" class="text-8xl m-auto"/>
              <!-- <img v-else src="../../assets/no-image.png" class="object-contain object-top object-left w-48 h-32"/> -->
                <!-- @click="selectComponent(comp.id, 'preview', comp)" -->
          </div>

          <!-- <div
            v-else
            class="h-32"
            title="Click to preview"
            @click="$emit('preview', comp)"
          ></div> -->

          <!--ACTIONS-->
          <div class="text-xs text-gray-600 opacity-0 hover:opacity-100" @mouseleave="moreID = null">
            <div>
              <div v-if="moreID === comp._id" @mouseleave="moreID = null" class="menu absolute -translate-y-24 transform bg-gray-900 w-48">
                <div class="pl-1 hover:bg-white" @click="restoreAutosave(comp)" title="Restore from autosave">
                  Restore
                </div>
                <div class="pl-1 hover:bg-white" @click="addToLibrary(comp, 'library')" title="Export">
                  Add to export
                </div>
                <div class="pl-1 hover:bg-white" @click="duplicateComponent(comp)" title="Duplicate">
                  Duplicate
                </div>
                <div class="pl-1 hover:bg-white" @click="(current = comp),(confirmModal = !confirmModal)">
                  Delete
                </div>
              </div>
              <div class="w-full p-1 flex flex-row justify-around">
                <i class="material-icons xs mr-2 hover:text-blue-500" title="Edit" @click="selectComponent(comp.id, 'component', comp)">edit</i>
                
                <i class="material-icons xs ml-2 hover:text-blue-500" title="Preview" @click="openPreview(comp)">preview</i>

                <i class="material-icons" @click="moreID = comp._id">more_vert</i>
              </div>
            </div>
          </div>
        <!-- </div> -->
      </div>
    </div>
    <!-- DELETE OBJECT MODAL -->
    <transition name="fade">
        <modal
            :fixed="true"
            size="sm"
            position="modal" 
            :close="true"
            v-if="confirmModal"
            @close="confirm=false,confirmModal=false,$action()"
            @click_0="confirm=false,confirmModal=false,$action()"
            @click_1="confirm=true,confirmModal=!confirmModal,removeComponent()">
            <div slot="title">Delete object</div>
            <div slot="content" class="p-4">
                Remove <strong>{{current.name}}</strong> ?
            </div>
        </modal>
    </transition>
  </div>
</template>

<script>
export default {
    name: 'BlocksGallery',
    props: [ 'objects' ],
    data:()=>({
        allObjects: null,
        moreID: null,
        currImage: null,
        current: null,
        blocks: null,
        confirmModal: false,
        confirm: false,
        search:''
    }),
    methods:{
      searchComponent(e){
        if ( e.keyCode === 13 && this.search.length > 2){
          
          this.blocks = this.allObjects.filter ( obj => {
            console.log ( obj.name )
            return obj.name.toLowerCase().indexOf(this.search) > -1 // || obj.tags.toLowerCase().indexOf(this.search) > -1
          })
        }
      },
      duplicateComponent ( block ){
        let duplicateObject = JSON.parse( JSON.stringify(block) )
        duplicateObject.name = duplicateObject.name + ' COPY'
        delete duplicateObject._id
        this.$api.service ( 'components' ).create ( duplicateObject ).then ( res => {
          this.$emit('duplicated')
        })
      },
      selectComponent ( id , mode , block ){
          this.$mapState().desktop.tabs.push (
              {
                  component: 'blocks/editor/block.editor',
                  name: block.name,
                  filter: '',
                  mode: 'block',
                  icon: 'edit',
                  blocks: block,
              }
          )
          this.$store.dispatch ( 'mode' , 'editor' )
          this.$mapState().editor.current = block.json
          this.$mapState().editor.component = block
          this.$mapState().desktop.currentTab = this.$mapState().desktop.tabs.length - 1
          window.localStorage.setItem('whoobe-desktop',JSON.stringify(this.$mapState().desktop.tabs))
          return
      },
      openPreview(component){
            this.$mapState().editor.preview = component
            window.localStorage.setItem('whoobe-preview',JSON.stringify(component.json))
            //)
            window.localStorage.setItem('whoobe-component',JSON.stringify(component))
            let route = this.$router.resolve({path: '/preview'});
            let w = window.open(route.href, 'whoobe','width=' + window.screen.availWidth );
            w.focus()
      },
      restoreAutosave ( block ){
          return
      },
      saveToLibrary ( block ){
          return
      },
      removeComponent ( ){
        this.$loading(true)
        this.$api.service ( 'components' ).remove ( this.current._id ).then ( res => {
          console.log( 'removed => ' , res)
          this.$loading ( false )
        })
      }
    },
    mounted(){
        this.blocks = this.objects.filter ( obj => {
            return obj.hasOwnProperty ( 'name' )
        })
        this.allObjects = this.objects
    }

}
</script>