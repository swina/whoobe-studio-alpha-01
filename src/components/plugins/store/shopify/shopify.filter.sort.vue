<template>
    <div :class="css">
        <select v-model="sortBy" class="whoobe-store-sort outline-none border-0 bg-transparent">
            <option value="">No sort</option>
            <option value="priceASC">Price UP</option>
            <option value="priceDESC">Price DOWN</option>
            <option value="nameASC">Name A-Z</option>
            <option value="nameASC">Name Z-A</option>
        </select>
    </div>
</template>

<script>
export default {
    name: 'WhoobeShopifyFilterSort',
    props: ['css'],
    data:()=>({
        sortBy: ''
    })
}
</script>