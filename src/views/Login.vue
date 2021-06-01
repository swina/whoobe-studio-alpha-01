<template>
    <div class="modal z-2 bg-white w-full md:w-1/4 text-lg flex flex-col rounded">
        <div class="w-full p-1 bg-black text-white rounded-tl rounded-tr">Login</div>
        <div class="p-4 flex flex-col">
            <label>Email</label>
            <input type="email" v-model="userLogin.email"/>
            <label>Password</label>
            <input type="password" v-model="userLogin.password"/>
            <button class="my-4 mx-auto text-xl rounded" @click="doLogin()">Login</button>
        </div> 
    </div>
</template>

<script>
export default {
    name: 'LoginView',
    data:()=>({
        userLogin: {
            email: '',
            password: ''
        }
    }),
    methods:{
        doLogin(){
            this.$api.authenticate({
                email: this.userLogin.email,
                password: this.userLogin.password,
                strategy: 'local'
            }).then ( resp => {
                this.$message ( 'Welcome to Whoobe !')
                this.login = false 
                this.$store.dispatch('login',true)
                this.$router.push ( '/' )
            }).catch ( err => {
                console.log ( err )
                this.$store.dispatch('login',false)
                this.$message ( 'Login error! Check your credentials')
            })
        }
    }
}
</script>