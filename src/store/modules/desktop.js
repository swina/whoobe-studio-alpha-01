const desktop =  {
    state: {
        message: '',
        filter: '',
        tabs: [],
        cloudinary_image: null,
        error: null,
        currentTab: 0,
        loading: false,
        project: null
    },
    mutations: {
        message ( state , payload ){
            state.message = payload
        },
        filter ( state , payload ){
            state.filter = payload
        },
        tabs( state , payload ){
            state.tabs = payload
        },
        add_tab ( state , payload ){
            state.tabs.push ( payload )
            state.currentTab = state.tabs.length-1
            //set desktop status to open when reload
            window.localStorage.setItem('whoobe-desktop',JSON.stringify(state.tabs))
        },
        cloudinary_image ( state , payload ){
            state.cloudinary_image = payload
        },
        error ( state , error ){
            state.error = error 
        },
        currentTab ( state , tab ){
            state.currentTab = tab
            //set desktop status to open when reload
            console.log ( 'update tabs' , state.tabs )
            window.localStorage.setItem('whoobe-desktop',JSON.stringify(state.tabs))
        },
        loading ( state , payload ){
            state.loading = payload
        },
        project ( state , payload ){
            state.project = payload
        }
    },
    actions : {
        message ( { commit } , payload ){
            commit ( 'message' , payload )
        },
        filter ( { commit } , payload ){
            commit ( 'filter' , payload )
        },
        tabs ( { commit } , payload ){
            commit ( 'tabs' , payload )
        },
        add_tab ( { commit } , payload  ){
            commit ( 'add_tab' , payload )
        },
        cloudinary_image ( { commit } , payload ){
            commit ( 'cloudinary_image' , payload )
        },
        error ( { commit } , payload ){
            commit ( 'error' , payload )
        },
        currentTab ( { commit } , payload ){
            payload < 0 ?
                payload = 0 : null
            commit ( 'currentTab' , payload )
        },
        loading ( { commit } , payload ){
            commit ( 'loading' , payload ? payload : false )
        },
        project ( { commit } , payload ){
            commit ( 'project' , payload )
        },

    }
}

export default desktop