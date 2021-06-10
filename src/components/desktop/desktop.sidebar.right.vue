<template>
    <div class="fixed theme-dark right-0 top-0 z-highest w-1/6 h-screen border-l border-gray-900" v-if="(desktop.mode==='editor'||desktop.mode==='block') && editor.action != 'in_editor_preview'">
        <div>
            <div class="flex flex-row items-center bg-gray-900">
                <template v-for="(tab,i) in sidebarToolbar">
                    <div class="h-10 w-12 border-r border-gray-900 flex flex-row items-center justify-center cursor-pointer" :class="currentTab.label===tab.label?'bg-gray-800':''"  @click="currentTab=tab">
                        <icon :name="tab.icon" class="text-gray-300 hover:text-indigo-500" :title="tab.tooltip"/>
                    </div>    
                </template>
                <!-- <div class="h-10 w-12 border-r border-gray-900 flex flex-row items-center justify-center cursor-pointer" @click="currentTab='more'">
                        <icon name="chevron_right" class="text-gray-300 hover:text-indigo-500" title="more"/>
                    </div> -->
            </div>
            <div v-if="currentTab.label!='settings' && currentTab.label!='generate'" class="text-white text-xs border-b border-gray-900 flex flex-row items-center p-1 shadow relative p-1">
                <div class="w-full flex flex-row items-center justify-around text-base" @dblclick="$emit('switch')">
                    
                    <div>
                        <span v-if="editor.current.tag!='menu'" class="capitalize">{{ editor.current.type || editor.current.tag }}</span>
                        <!-- <span v-else>Menu <span v-if="customizeDropdown">Dropdown</span></span> -->
                    </div>
                    <i class="material-icons text-sm ml-2">{{editor.current.icon}}</i> 
                    <div class="text-xs lg:text-sm text-gray-500">{{ size }}</div>
                    <div class="text-xs lg:text-sm text-gray-500">{{ position }}</div>
                </div>
                
            </div>
            <!--<block-customizer v-if="isBlockEditor && sidebar==='customize'"/>-->
            <component :is="component" :component="component"/>
        </div>
        <!--<component :is="component" :component="component"/>-->
        <span class="invisible">{{ this.desktop.tabs[this.desktop.currentTab].mode }}</span>
    </div>

</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'DesktopSidebarRight',
    data:()=>({
        sidebar : 'customize',
        currentTab: { 
            label: 'customize',
            icon: 'brush',
            component: 'blocks/editor/tailwind/tailwind.container.vue',
            tooltip: 'Customize element'
        },
        sidebarToolbar :[
            { 
                label: 'customize',
                icon: 'brush',
                component: 'blocks/editor/tailwind/tailwind.container.vue',
                tooltip: 'Customize element'
            },
            
            { 
                label: 'css',
                icon: 'code',
                component: 'blocks/actions/block.css.vue',
                tooltip: 'Edit CSS/Style'
            },
            { 
                label: 'animation',
                icon: 'motion_photos_on',
                component: 'blocks/actions/block.animation.vue',
                tooltip: 'Animations'
            },
            { 
                label: 'attributes',
                icon: 'list',
                component: 'blocks/actions/block.attributes.settings.vue',
                tooltip: 'Element attributes'
            },
            { 
                label: 'reusable',
                icon: 'widgets',
                component: 'blocks/actions/block.reusable.vue',
                tooltip: 'Library'
            },
            { 
                label: 'tree',
                icon: 'account_tree',
                component: 'blocks/actions/block.tree.draggable.vue',
                tooltip: 'Block tree'
            },
            { 
                label: 'settings',
                icon: 'settings',
                component: 'blocks/actions/block.document.settings.vue',
                tooltip: 'Page settings'
            },
            { 
                label: 'generate',
                icon: 'dynamic_form',
                component: 'settings/publish.vue',
                tooltip: 'Publish'
            },
        ],
        components: {
            customize: '@/components/blocks/editor/tailwind/tailwind.container.vue',
            settings: 'blocks/actions/block.document.settings.vue',
            animation: 'blocks/actions/block.animation.vue'
        }

    }),
    components: {
        'block-customizer'      : () => import ('@/components/blocks/editor/tailwind/tailwind.container.vue')
    },
    computed:{
        ...mapState ( ['desktop','editor'] ),
        isBlockEditor(){
            return this.desktop.mode === 'editor' ? true : false
        },
        component(){
            let comp = this.currentTab.component
            return () =>  import( '@/components/' + comp )
        },
        size(){
            return this.editor.current.coords ?
                this.editor.current.coords.width.toFixed(2) + ' x ' + this.editor.current.coords.height.toFixed(2) : ''

        },
        position(){
            return this.editor.current.coords ?
                'x:' + this.editor.current.coords.x.toFixed(2) + ' y:' + this.editor.current.coords.y.toFixed(2) : ''
        }
    }
}
</script>