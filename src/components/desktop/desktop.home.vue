<template>
    <div class="theme-dark min-h-screen px-20 pt-8">
        <h2>Whoobe Studio</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 text-purple-500 grid-cols-1 gap-10">
            <div class="h-64 bg-center bg-cover bg-no-repeat shadow-lg flex items-end" :style="'background-image: url(' + this.$imageURL('/uploads/architectu_bw.webp') + ');'">
                <div class="text-xl bg-black w-full flex flex-row p-2 bg-opacity-75 cursor-pointer items-center" @click="$action('component_create')">
                    <icon name="view_quilt" class="text-3xl"/>
                    <div class="p-2">Create a block</div>
                </div>
            </div>
            <div class="h-64 bg-center bg-cover bg-no-repeat shadow-lg flex items-end" :style="'background-image: url(' + this.$imageURL('/uploads/laptop_bw.webp') + ');'">
                <div class="text-xl bg-black w-full flex flex-row p-2 bg-opacity-75 cursor-pointer items-center"  @click="$action('articles_create')">
                    <icon name="article"/>
                    <div class="p-2">Create article</div>
                </div>
            </div>
            
            <div class="h-64 bg-center bg-cover bg-no-repeat shadow-lg flex items-end" :style="'background-image: url(' + this.$imageURL('/uploads/technology_bg_001.webp') + ');'">
                <div class="text-xl bg-black w-full flex flex-row p-2 bg-opacity-75 cursor-pointer items-center" @click="openMedia()" >
                    <icon name="collections" class="text-3xl"/>
                    <div class="p-2">Manage Media</div>
                </div>
            </div>
            <div class="h-64 bg-center bg-cover bg-no-repeat shadow-lg flex items-end" :style="'background-image: url(' + this.$imageURL('/uploads/laptop_1205256_1920_d809b836cf.jpg') + ');'">
                <div class="text-xl bg-black w-full flex flex-row p-2 bg-opacity-75 cursor-pointer items-center" >
                    <icon name="help" class="text-3xl"/>
                    <div class="p-2">Documentation</div>
                </div>
            </div>
            <div class="text-gray-400">
                <h3>Info</h3>
                <p>Version: alpha-version <br>May 2021</p>
                <p>Author: Antonio Nardone</p>
                <small>MIT License - Open source - Free</small>
            </div>
            <div class="text-gray-400">
                <h3>Last updates</h3>
                <p>- Context menu in the block editor and preview window</p>
                <p>- Multitabs support</p>
                <p>- Import media from Pixabay, upload media to Cloudinary, upload images from URL</p>
                <p>- Image editor</p>
            </div>
            <div class="text-gray-400">
                <h3>Tips</h3>
                <ul>
                    <li>Copy&Paste any block/element between documents with Alt+C (copy) and Alt+v (paste)</li>
                    <li>Copy CSS attributes between blocks/elements with Alt+g (copy) and Alt+h (paste)</li>
                    <li>In the Block Editor and the Block preview window click the mouse right button to access to a context menu</li>
                </ul>
            </div>
            <div class="text-gray-400">
                <h3>Issues</h3>
                <p>Help to improve Whoobe. Any time you find a bug or an error please open an issue on <a href="https://github.com/swina/whoobe-studio-alpha" target="_blank">Github repository</a></p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DesktopHome',
    methods: {
        openMedia(){
            this.$mapState().desktop.tabs.push ( 
                {
                    component: 'media/media.vue',
                    name: 'Media',
                    filter: '',
                    mode: 'media',
                    icon: 'photo',
                    blocks: null
                }
            )
        }
    }
}
</script>