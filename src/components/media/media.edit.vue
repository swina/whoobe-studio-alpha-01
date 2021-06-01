<template>
    <div class="grid grid-cols-3 relative w-full items-center gap-3 h-80">
        <div class="col-span-2 justify-start items-center flex">
            <img v-if="isImage && !isFile" :src="imageURL(image)" class="h-3/4 object-cover m-auto shadow" @click="$emit('close')"/>
            <video v-if="isVideo" controls>
                <source :src="imageURL(image)">
            </video>
            <icon name="insert_drive_file" v-if="isFile" class="text-10xl m-auto"/>
        </div>
        <div class="right-0 p-2 flex flex-col items-start justify-start h-full">
            <div class="text-xl mb-2 bg-black p-1">{{ image.name }} </div>
            <div class="flex-row-center w-3/4 justify-between">
                {{ image.width }} x {{ image.height }}px
                <span class="bg-gray-300 text-black px-1 rounded uppercase">{{ image.ext }}</span>
                <span>{{ parseInt(image.size/1000) }}KB </span>
            </div>
            <label class="mt-2">Caption</label>
            <input type="text" class="w-full text-black" v-model="image.caption"/>
            <label class="mt-2">Alternative Text</label>
            <input type="text" class="w-full text-black" v-model="image.alternativeText"/>
            <label class="mt-2">URL</label>
            <input type="text" class="w-full text-black" v-model="image.url" readonly/>
            <div class="my-4">
                <button @click="$emit('delete',image._id)">Delete</button>
                <button>Edit</button>
                <button>Save</button>
            </div>
            <icon name="close" class="absolute top-0 right-0 -mt-8 text-4xl text-gray-600" @click="$emit('close')"/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MediaEdit',
    props: [ 'image' ],
    computed:{
        isImage(){
            return this.image.name.includes('.mp4') || this.image.name.includes('.webm') ?
                false : true
        },
        isVideo(){
            return this.image.name.includes('.mp4') || this.image.name.includes('.webm') ?
                true : false
        },
        isFile(){
            return this.image.mime.includes('application') ? true : false
        }
    },
    methods: {
        imageURL(image){
            let cms = window.localStorage.getItem('whoobe-cms')
            let img 
            image.url.includes('http') ? 
                img = image.url : 
                    img = ( cms + image.url.substring(1) )
            return img
        }
    }
}
</script>