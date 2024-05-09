<script setup>
    import {apiFunc} from './data.js'
    import {useRouter} from 'vue-router'
    import { onBeforeMount, ref } from 'vue';
    import { myOrder } from './data.js';
    
    const router = useRouter()
    
    let loggedUser = myOrder.currentUser[0]

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

    function getDate(){
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        return `${year}-${month}-${day}`;
    }


    async function createOrder(payType){        
        const date = getDate()

        // Add to User Order
        const response = await apiFunc.value.add('http://127.0.0.1:8000/api/user_order/',{
            payment_type: payType,
            order_date: date,
            user_id: loggedUser.user_id,
            order_status: 'preparing'
        })

        // Add to Order
        let orderNum = response.data.user_order_id   
        if (response.isSuccess){
                     
            await apiFunc.value.add('http://127.0.0.1:8000/api/order/',{
                order_id: orderNum,
                user_order_id: orderNum
            })
        }

        // Add to Food
        for (const food of foodList.value) {
            if (food.quantity > 0){
                let newStock = food.available_stock - food.quantity;
                await apiFunc.value.add('http://127.0.0.1:8000/api/food/', {
                    quantity: food.quantity,
                    order_id: orderNum,
                    food_detail_id: food.food_detail_id
                });

                await apiFunc.value.update(`http://127.0.0.1:8000/api/food_details/change_stock/${food.food_detail_id}`, {
                    available_stock: newStock    
                });
            }
        }

        // if tally
        if (payType==='tally'){
            apiFunc.value.add('http://127.0.0.1:8000/api/tally/',{
                tally_status: "unpaid",
                salary_period: date,
                user_order_id: orderNum
            })
        }
        

        router.push('/orderSuccess')
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
                            <img src="../assets/food_placeholder.jpg" style="width: 100%; height: max(100px,100%);" v-if="food.image === ''">
                            <img :src="food.image" style="width: 100%; height: 200px;" v-else>
                        </template>
                        <template #title>{{ food.name }}</template>
                        <template #subtitle>
                            <p>
                                <span> P{{ food.price }} </span>
                                <span style="float: right;"> x{{ food.available_stock-food.quantity }} </span>
                            </p>
                        </template>
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

                        
                        <Card style="width: 90%; height:125px; overflow: hidden;" class="box-shadow m-3">
                            <template #title>{{ food.name }} x{{ food.quantity }}</template>
                            <template #subtitle> P{{ food.price * food.quantity}}
                            
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

                
                <div v-if="loggedUser.user_type === 'personnel'">
                    <p>Payment Type</p>
                    <Button label="Cash" icon="pi pi-money-bill" class="m-2" @click="createOrder('cash')"></Button>
                    <Button label="Tally" icon="pi pi-list" class="m-2" @click="createOrder('tally')"></Button>
                </div>

                <div v-else>
                    <Button label="Confirm Order" icon="pi pi-cart-plus" @click="createOrder('cash')"></Button>
                </div>
                

                <!-- <input type="button" value="Cash" class="m-2 btn-uic" @click="router.push('/orderSuccess')">
                <input type="button" value="Tally" class="btn-uic" @click=""> -->
            </div>
        </div>
    </div>
    
</template>

<style scoped>

    .my-order-list {
        height: 50vh;
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
        height: 75vh;
        overflow-y: auto;
        gap: 20px;
    }

</style>

