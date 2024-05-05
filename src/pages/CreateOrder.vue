<script setup>
    import {apiFunc} from './data.js'
    import {useRouter} from 'vue-router'
    import { onBeforeMount, ref } from 'vue';
    
    const router = useRouter()

    let isloaded = ref(false)
    let foodList = ref([])
    let totalPrice = ref(0)
    async function getFood() {
        let requestFood = await apiFunc.value.get('http://127.0.0.1:8000/api/food_details')
        if (requestFood.isSuccess){
            foodList.value = requestFood.data
            isloaded.value = true
            foodList.value.forEach(function(food){
                food.quantity = 0
            })
        }
    }
    onBeforeMount(getFood)

    function addFood(food){
        food.quantity += 1
        getTotal()
    }

    function removeFood(food){
        food.quantity = 0
        getTotal()
    }

    function incrementFood(food){
        food.quantity = Math.min(food.quantity+1,food.available_stock)
        getTotal()
    }

    function decrementFood(food){
        food.quantity = Math.max(food.quantity-1,0)
        getTotal()
    }

    function getTotal(){
        totalPrice.value = 0
        foodList.value.forEach(function(food){
            totalPrice.value += food.quantity * food.price
        })
    }
</script>

<template>

    <Header title="Create Order" icon="pi-shopping-cart"></Header>
    <div class="parent">
        <div class="food-list p-2">
            <h2 class="text-white text-shadow">Menu Items</h2>
            <div class="food-grid" v-if="isloaded">
                <div v-for="food in foodList">
                    
                    <Card style="width: 300px; overflow: hidden;" class="box-shadow">
                        <template #header>
                            <img src="../assets/food_placeholder.jpg" style="width: 100%;">
                        </template>
                        <template #title>{{ food.name }}</template>
                        <template #subtitle> P{{ food.price }}</template>
                        <template #footer >
                            <div style="float: right;">
                                <Button icon="pi pi-cart-plus" label="Add" class="m-1" @click="addFood(food)"></Button>
                                <Button icon="pi pi-cart-minus" label="Remove" class="m-1" @click="removeFood(food)"></Button>
                            </div>
                        </template>
                    </Card>

                </div>    
            </div>
        </div>
        <div class="my-order p-2">
            <h2 class="text-shadow text-white">My Order</h2>
            <div class="my-order-list" style="overflow-y: auto; overflow-x: hidden;">

                <div v-for="food in foodList">
                    <div v-if="food.quantity > 0">

                        
                        <Card style="width: 300px; height:200px; overflow: hidden;" class="box-shadow m-3">
                            <!-- <template #header>
                                <img src="../assets/food_placeholder.jpg" style="width: 100%;">
                            </template> -->
                            <template #title>{{ food.name }} x{{ food.quantity }}</template>
                            <template #subtitle> P{{ food.price * food.quantity}}</template>
                            <template #footer >
                                <div style="float: right;">
                                    <Button icon="pi pi-minus" class="m-1" @click="decrementFood(food)"></Button>
                                    <Button icon="pi pi-plus" class="m-1" @click="incrementFood(food)"></Button>
                                </div>
                            </template>
                        </Card>
                    
                    </div>
                </div>

            </div>
            <div class="my-payment text-center">
                <h4>Payment</h4>
                <p>Total Payment: P{{ totalPrice }} </p>

                <Button label="Cash" icon="pi pi-money-bill" class="m-2" @click="router.push('/orderSuccess')"></Button>
                <Button label="Tally" icon="pi pi-list" class="m-2" @click=""></Button>

                <!-- <input type="button" value="Cash" class="m-2 btn-uic" @click="router.push('/orderSuccess')">
                <input type="button" value="Tally" class="btn-uic" @click=""> -->
            </div>
        </div>
    </div>
    
</template>

<style scoped>

    .my-order-list {
        height: 40vh;
    }

    .my-payment {
        height: 25vh;
    }

    .parent {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(5, 1fr);
        grid-column-gap: 0px;
        grid-row-gap: 0px;
    }

    .food-list { grid-area: 1 / 1 / 6 / 4; }
    .my-order { grid-area: 1 / 4 / 6 / 6; }

    .food-grid {
        display: flex;
        flex-wrap: wrap; 
        height: 67.3vh;
        overflow-y: auto;
        gap: 20px;
    }

</style>

