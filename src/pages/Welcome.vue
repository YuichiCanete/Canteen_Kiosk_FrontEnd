<script setup>
    import { useRouter } from 'vue-router';
    import { myOrder } from './data';
    

    const router = new useRouter()

    function navigateCreateOrder(){
        myOrder.loginDefault()
        router.push('/createOrder')
    }

    function navigateLogin(){
        myOrder.loginDefault()
        router.push('/')
    }

</script>

<template>
    <img src="..\assets\background.jpg" class="uicBg">
    <Header title="Welcome Page" icon="pi-shopping-cart"></Header>

    <div class="center">
        <Button label="Create Order" icon="pi pi-shopping-cart" class="p-5 m-3 text-shadow" @click="navigateCreateOrder()"></Button>
        <Button label="Login" icon="pi pi-sign-in" class="p-5 m-3 text-shadow" @click="navigateLogin()"></Button>
    </div>

</template>

<style scoped>

    .center {
        display: flex;   
        justify-content: center;
        align-items: center;
        height: 75vh;
    }

    .uicBg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background-size: cover;
        object-fit: cover;
    }

</style>