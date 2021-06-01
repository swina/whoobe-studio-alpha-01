<template>
    <div class="flex-row-center justify-center text-sm">
        <button @click="$emit('click','upload')">Upload</button>
        <button @click="$emit('click','pixabay')">Pixabay</button>
        <button @click="$emit('cloudinary')">Cloudinary</button>
        <button @click="$emit('click','url')">From URL</button>
        <button @click="$emit('carousel')">Carousel</button>
        <!-- <label>Import from url</label>
        <input type="text" class="ml-2 w-64" placeholder="url"/> -->
    </div>
</template>
