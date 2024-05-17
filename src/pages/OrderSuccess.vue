<script setup>
    // import {data} from './data.js'
    import {useRouter} from 'vue-router'
    import { orderNumber } from './data';
    
    const router = useRouter()
    function switchTo(path){
        router.push(path)
    }

</script>

<template>
    <Header title="Order Success" icon="pi-check-circle"></Header>
    <div class="container-fluid d-flex align-items-center justify-content-center text-center" style="height: 75vh;">
        <div class="order-container color-base p-3 round-border box-shadow text-white text-shadow">
            <h1>Order Successful</h1>
            <p>Your Order Number is...</p>
            <p style="font-size: 100px; font-weight: bold;">{{ orderNumber }}</p>
            <Button icon="pi pi-cart-plus" label="New Order" class="m-1 text-pink" @click="switchTo('/createOrder')" raised style="background-color: white;"></Button>
            <Button icon="pi pi-power-off" label="Logout" class="m-1 text-pink" @click="switchTo('/welcome')" raised style="background-color: white;"></Button>
        </div>
    </div>
</template>

<style scoped>

    .order-container {
        width: 50%;
        height: 75%;
    }

</style>
