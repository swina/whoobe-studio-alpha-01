const model = {
    "_id": {
        type: "string",
        edit: false,
        list: false 
    },
    "name": {
        type: "string",
        edit: true,
        list: true
    },
    "excerpt": {
        type: "text",
        edit: true,
        list: false
    },
    "code": {
        type: "string",
        edit: true,
        list: true
    },
    "categories": {
        type: "array",
        edit: true,
        list: true
    },
    "variations": {
        type: "boolean",
        edit: false,
        list: true,
    },
    "price": {
        type: "currency",
        precision: 2,
        edit: true,
        list: true
    },
    "sale": {
        type: "currency",
        precision: 2,
        edit: true,
        list: true
    },
    "active": {
        type: "boolean",
        edit: true,
        list: true
    },
    "new": {
        type: "boolean",
        edit: true,
        list: false
    },
    "image_uri": {
        type: "image",
        edit: true,
        list: true
    },
    image: {
        type: "image",
        edit: true,
        list: true
    }
    
}

export default model