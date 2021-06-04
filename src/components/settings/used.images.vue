<template>
    <div>
        <!-- {{ images.length }} -->
    </div>
</template>

<script>
import jp from 'jsonpath'
export default {
    name: 'WhoobeUsedImages',
    data:()=>({
        images: []
    }),
    mounted(){
        this.$api.service('articles').find ( 
            {
                query : {
                    $limit: 100,
                    $skip:0
                }
            }
        ).then ( result => {
            console.log ( result )
            let usedFonts = []
            result.data.forEach ( page => {
                console.log ( page )
                let json = page.blocks.json
                let fonts = jp.query ( json , '$..blocks[?(@.style.includes("font-family"))]' )
                //usedFonts.push ( fonts.style )
                fonts.forEach ( font => {
                    font.style.includes ( 'font-family') ?
                        usedFonts.push ( font.style.replace('font-family:','').replaceAll('\"','') ) : null
                })
                //let fonts = jp.query ( json , '$..blocks..[?(@.style>"font-family"]' )
                let images = jp.query ( json , '$..blocks..image.url' )
                images.forEach(img=>
                    !img.includes('http') ?
                        this.images.push(img) : null
                )
            })
            this.$api.service('products').find ( { query: { $limit: 200 } }).then ( res => {
                let products_images = res.data.filter ( product => {
                    return product.assets 
                })
                console.log ( products_images )
            })

            this.$emit('images',[...new Set(this.images)],[...new Set(usedFonts) ] )
            
        })
    }
}
</script>