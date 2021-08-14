const model = {
    "id": {
        type : "id",
        field_type: 'id',
        edit: false,
        list: false,
        import: true
    },
    "title": {
        type: "string",
        field_type: 'string',
        group: 'general',
        edit: true,
        list: true,
        import: true
    },
    "description":{
        type: "text" ,
        field_type: 'text',
        group: 'general',
        edit: true,
        list: false,
        import: true
    },
    "productType":{
        type: "text",
        field_type: 'text',
        group: "general",
        edit: true,
        list: true,
        import: true
    },
    "image":{
        parent: "images",
        type: "array",
        field: "src",
        attributes : "altText",
        field_type: 'image',
        position: 0,
        group: 'general',
        edit: true,
        list: true,
        import: true
    },
    "variantsPrice" : {
        parent: "variants",
        type: "array",
        field: "price",
        field_type: "currency",
        position: 0,
        group: 'category',
        edit: true,
        list: true,
        import: true
    },
    "variantsSku" : {
        parent: "variants",
        type: "array",
        field: "sku",
        field_type: "text",
        attributes: null,
        position: 0,
        group: 'category',
        edit: true,
        list: true,
        import: true
    }
}

export default model