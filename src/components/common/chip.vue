<template>
    <span class="flex flex-row items-center px-2 w-auto" :class="$attrs.css">
        <div>{{$attrs.content}}</div>
        <icon :name="$attrs.icon" v-if="$attrs.icon" class="ml-1" :class="$attrs.reverse?'order-first':''" @click="$emit('click')"/>
    </span>
</template>

<script>
export default {
    name: 'WhoobeChip',
}
</script>