<template>
        <nav navigation :class="menuContainerCSS" class="cursor-pointer" :ref="el.id" :id="el.id" :style="background(el) + ' ' + el.style">
            

            <!-- desktop -->
            <div class="hidden md:contents relative">
                <template v-for="(item,i) in el.blocks">

                        <a v-if="item.link && !item.blocks.length" :href="$mapState().editor.action!='in_editor_preview'?item.link:'#'" :class="item.css">
                                {{ item.content }}
                        </a>

                        <div v-if="!item.link && !item.blocks.length" menu-item class="relative flex flex-row items-center" :class="item.css">
                            {{ item.content }}
                        </div>

                        <div v-if="!item.link && item.blocks.length" @click="openSub(i,$event)" :class="item.css + ' menu_item item_' + item.id" class="relative flex flex-row items-center">
                            
                            {{ item.content }}
                            
                            <icon-extra v-if="el.hasOwnProperty('icons')" :icon="el.icons.submenu"/>
                            <icon-extra v-else icon="bi:chevron-down"/>
                        </div>


                        <div :ref="'submenu_'+i" submenu v-if="!item.link && item.blocks && item.blocks.length" :class="isOver(i) + ' submenu submenu_' + i + ' ' + el.css.submenu + ' top-0 fixed flex flex-col z-highest'" :style="overStyle(i,item.id)" @click="submenu=null">
                            
                            <div v-if="item.blocks[0].blocks && submenu===i" :style="getPos(i)">
                                
                                <template v-for="block in item.blocks">
                                    <block-preview-element
                                    v-if="block && !block.hasOwnProperty('blocks') && !block.hasOwnProperty('blocks')"
                                    :key="block.id"
                                    :el="block"
                                    :data="$attrs.data||null"
                                    :currency="$attrs.currency||null"
                                    :develop="false"/>

                                    <block-preview-single-container 
                                        v-if="block.hasOwnProperty('blocks')"
                                        :key="block.id" 
                                        :doc="block" 
                                        level="1" 
                                    />
                                </template>
                            </div>
                            <div v-else class="flex flex-col">
                                <template v-for="subitem in item.blocks">
                                    <a :href="'/preview' + subitem.link" :class="el.css.submenu_items">
                                        <span>{{ subitem.content }}</span>
                                    </a>
                                </template>
                            </div>
                        </div>
                    
                </template>
            </div>

            <!--responsive -->
            
            <template menu_responsive  v-for="(item,i) in el.blocks" >
                <div v-if="responsive" class="md:hidden z-modal" :class="opacity">
                    <a v-if="item.link" :href="$mapState().editor.action!='in_editor_preview'?item.link:'#'">
                        <div :class="el.css.responsive_items">{{ item.content }}</div>
                    </a>
                    <div v-if="!item.link && !item.blocks.length" :class="el.css.responsive_items">{{ item.content }}</div>
                    <div v-if="!item.link && item.hasOwnProperty('blocks') && item.blocks.length" @click="submenu && submenu===i?submenu=null:submenu=i" :class="el.css.responsive_items">
                            {{ item.content }}
                            <!-- <icon v-if="el.hasOwnProperty('icons')" :name="el.icons.submenu"/>
                            <icon v-else name="expand_more"/> -->
                    </div>
                </div>    
                    <transition name="fade">
                    <div :ref="'submenu_'+i" submenu-responsive v-if="submenu===i && item.blocks && item.blocks.length" :class="el.css.submenu + ' absolute fixed flex top-0 flex-col z-highest'" @click="el.css.submenu_behavior?submenu=null:submenu=null">
                        
                        <div v-if="item.blocks[0].blocks && submenu===i" @mouseleave="el.css.submenu_behavior?submenu=null:submenu=null" :style="getPos(i)">
                            
                            <template v-for="block in item.blocks">
                                <block-preview-element
                                v-if="block && !block.hasOwnProperty('blocks') && !block.hasOwnProperty('blocks')"
                                :key="block.id"
                                :el="block"
                                :data="$attrs.data||null"
                                :currency="$attrs.currency||null"
                                :develop="false"/>

                                <block-preview-single-container 
                                    v-if="block.hasOwnProperty('blocks')"
                                    :key="block.id" 
                                    :doc="block" 
                                    level="1" 
                                />
                            </template>
                        </div>
                        <div v-else class="flex flex-col">
                            <template v-for="subitem in item.blocks">
                                <a :href="subitem.link" :class="el.css.responsive_items">
                                    <span>{{ subitem.content }}</span>
                                </a>
                            </template>
                        </div>
                    </div>
                    </transition>
            </template>
            <!-- <div class="whoobe-menu-toolbar fixed md:hidden bottom-0 left-0 w-full p-1 bg-black h-10 text-white flex flex-row justify-around items-center">
                <icon name="menu" :css="el.css.responsive_items" @click="menu_responsive=!menu_responsive"/>    
            </div> -->
            <!-- <span @click="menu_responsive=!menu_responsive" class="fixed top-0 z-modal"><icon-extra v-if="responsive" class="md:hidden z-highest fixed top-0 m-1 text-3xl" :class="menu_responsive?el.css.items+' right-0':el.css.items" :icon="menu_responsive?el.icons.back:el.icons.burger" /></span> -->
        </nav>
</template>

<script>
import BlockPreviewElement from './moka.element'
import BlockPreviewSingleContainer from './moka.menu.container'
export default {
    name: 'BlockPreviewMenu',
    props: ['el'],
    components: {
        BlockPreviewElement,
        BlockPreviewSingleContainer
    },
    data:()=>({
        submenu: null,
        submenu_id: null,
        width:0,
        
        responsive: false,
        clientY: 0,
        clientX: 0
    }),
    computed:{
        menu_responsive(){
            return this.$mapState().desktop.menu_responsive
        },
        menuContainerCSS(){
            let responsive = this.menu_responsive ? this.el.css.responsive + ' w-full': ' ' + this.el.css.responsive.replaceAll('p-' , '')
            this.width > 640 ? this.responsive = false : this.responsive = true
            return this.width > 640 ? 
                this.el.css.css + ' ' + this.el.css.container + ' ' + this.el.css.align :
                   'fixed inset-0 z-highest ' + responsive 
        },
        opacity(){
            return this.menu_responsive ? 'opacity-100 w-full' : ''
        }
    },
   
    methods:{
        background(block){
            if ( !block || !this.menu_responsive) return ''
            if ( block.hasOwnProperty('gallery') && !block.gallery || !block.hasOwnProperty('gallery')){ 
                let bgImage = ''
                block.image && block.image.url?
                    block.image && block.image.url && block.image.url.indexOf('.mp4') < 0 ? 
                            bgImage = ' background-image:url(' + this.$imageURL(block.image) + ');' :
                                null  : null
                return bgImage
            }
        },
        openSub(i,e){
            this.clientY = e.clientY + window.pageYOffset
            this.clientX = e.clientX
            this.submenu === i ? this.submenu = null : this.submenu = i
        },
        isOver(i){
            if ( this.el.css.submenu.includes('relative') ){
                return i < 0 ? 'hidden' : this.submenu === i ? '' : 'hidden'
            }
            return i < 0 ? 'invisible' : this.submenu === i ? '' : 'invisible'
        },
        overStyle(i,item_id){
            if ( this.el.css.submenu.includes ( 'relative') ) return
            let item = document.querySelector('.item_' + item_id)
            let pos = {}
            if ( item ) {
                let coords = item.getBoundingClientRect()
                !this.el.css.submenu.includes('left-0') ?
                    pos = { left : coords.left + 'px;' , top: coords.bottom + 'px;' } :
                        pos = { top : coords.bottom + 'px;', left: '0px;' }
            }
            i < 0 ? 
                pos.height = '0px;' :
                    this.submenu === i ? 
                        pos.height = 'auto;' :
                            pos.height = 0 + 'px;'
            
            if ( i > -1 ){
                return 'height:' + pos.height + 'left:' + pos.left + 'top:' + pos.top
            }
            return ''
        },
        getPos(i){
            
            if ( this.submenu === i) {
                let posX = this.$refs['submenu_' + i][0].getBoundingClientRect().x
                let posY = this.$refs['submenu_' + i][0].getBoundingClientRect().y
                let width = this.$refs['submenu_' + i][0].clientWidth
                let height = this.$refs['submenu_' + i][0].clientHeight
                let availableX = window.innerWidth
                let availableY = window.innerHeight
                console.log ( document.querySelector('.submenu_' + i ).getBoundingClientRect() , posX , width , posX + width , availableX )
                if ( ( posX + width - availableX ) > 0 ){
                    this.$refs['submenu_' + i][0].style.left = (availableX - width) + 'px'
                }
                if ( ( posY + height - availableY ) > 0 ){
                    this.$refs['submenu_' + i][0].style.transform = 'translateY(-110%)'//(availableY - height - 50 ) + 'px'
                }
            }
        },
    },
    mounted(){
        this.width = window.innerWidth
        window.addEventListener('resize',()=>{
            this.width = window.innerWidth
        })
        window.addEventListener('scroll',()=>{
            this.clientY = this.clientY + window.pageYOffset
        })
        let menu_item = document.querySelector('.menu_item') 
        if ( menu_item ){
            this.clientY = menu_item.getBoundingClientRect().bottom
        }

    }
}
</script>
