const user = {
    state: {
        login: false,
        user: {},
    },
    mutations: {
        login ( state , login ){
            state.login = login
        },
        user ( state , user ){
            state.user = user
        },
    },
    actions: {
        login( { commit } , login ){
            commit ( 'login' , login )
        },
        user( { commit } , user ){
            commit ( 'user' , user )
        },
    }

}
export default user