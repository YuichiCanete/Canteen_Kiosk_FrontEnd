<script setup>

    import {apiFunc} from "../pages/data.js"
    import {ref} from 'vue'
    import { orderList,getOrders,foodList,getFood } from "./orders.js";

    import { useToast } from "primevue/usetoast";
    import { actionError,actionSuccess } from '../components/orders';
    const toast = useToast();

    const findOrder = ref(null)
    const foundOrder = ref([])
    const isOrderFound = ref(false)

    function orderFinding(){        
        foundOrder.value = orderList.value.find((order) => order.orderNum === parseInt(findOrder.value))
        isOrderFound.value = true
        if (foundOrder.value) {
            toast.add(actionSuccess("Order Found"))
        }else{
            toast.add(actionError("Cant Find Order"))

        }
    }

    async function changeEditedFood(editFood,amount){
        const searchFood = foodList.value.find((food) => food.name === editFood.name) 
        if (amount < 0 && editFood.quantity <= 0 ) { amount = 0}
        if (amount > 0 && editFood.quantity >= searchFood.available_stock) { amount = 0}
        const foodPrice = searchFood.price
        foundOrder.value.total += amount * foodPrice
        editFood.quantity += amount
        editFood.changeAmount += amount
        
    }

    async function saveModifiedFood(){
        
        for (let food of foundOrder.value.foodList) {
            const searchFood = foodList.value.find((f) => f.name === food.name) 
            await apiFunc.value.update(`/api/food/${food.food_id}`,{
                quantity: food.quantity,
                order_id: food.order_id,
                food_detail_id: food.food_details_id
            });

            await apiFunc.value.update(`/api/food_details/${searchFood.food_detail_id}`,{
                name: searchFood.name,
                price: searchFood.price,
                available_stock: searchFood.available_stock - food.changeAmount,
                image: searchFood.image
            })
            food.changeAmount = 0
        }
        getOrders()
        getFood()
        toast.add(actionSuccess("Successfully Edited Food"))
    }

    getOrders()
    getFood()

</script>

<template>

    <InputText v-model="findOrder" placeholder="Order ID" class="m-2"></InputText>
        <Button icon="pi pi-search" label="Search Order" class="m-2" @click="orderFinding()"></Button>
        <Button icon="pi pi-file-plus" label="Save Order" class="m-2" @click="saveModifiedFood();"></Button>
        <div>
            <h3 class="text-pink">Order Number: {{ foundOrder.orderNum }}</h3>
            <h4 class="text-pink">Total: {{ foundOrder.total }}</h4>
            
            <div style="width: 500px;">
                <DataTable :value="foundOrder.foodList" tableStyle="width: 100%" scrollable scrollHeight="400px">
                    <Column field="name" header="Food"></Column> 
                    <Column field="quantity" header="Qty."></Column> 
                    <Column header="Actions">
                        <template #body="rowData" class="d-flex">
                            <Button icon="pi pi-minus" class="m-1" @click="changeEditedFood(rowData.data,-1)"></Button>
                            <Button icon="pi pi-plus" class="m-1" @click="changeEditedFood(rowData.data,1)"></Button>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

</template>
