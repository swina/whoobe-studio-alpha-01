<template>
    <div class="flex flex-col items-center justify-center cursor-pointer" @click="$emit('click')">
        <i class="material-icons" :class="$attrs.css||$attrs.class">{{$attrs.name}}</i>
        <label v-if="$attrs.label" :class="$attrs.css||$attrs.class" class="leading-3 cursor-pointer">{{$attrs.label}}</label>
    </div>
</template>
<script>
export default {
    name: 'Icon',
}
</script>
<style scoped>
label {
    font-size:.6rem;
}
</style>