<script setup>
    import { foodList,getFood } from './orders.js';
    import { ref } from 'vue';
    import { apiFunc } from '../pages/data.js';

    import { useToast } from "primevue/usetoast";
    import { actionError,actionSuccess } from '../components/orders';
    const toast = useToast();

    const editFoodInfo = ref([
        {field: 'name', header:'Food Name'},
        {field: 'price', header:'Price'},
        {field: 'available_stock', header:'Inventory'},
        {field: 'image', header:'image link'}
    ])

    async function saveFood(foodData){
        let response = await apiFunc.value.update(`/api/food_details/${foodData.food_detail_id}`,{
            name: foodData.name,
            price: foodData.price,
            available_stock: foodData.available_stock,
            image: foodData.image
        })
        getFood()
        if (response.isSuccess){
            toast.add(actionSuccess("Food Successfully Saved"))
        }else{
            toast.add(actionError("Food Failed to Saved"))
        }
    }

    async function deleteFood(foodData){
        await apiFunc.value.remove(`/api/food_details/${foodData.food_detail_id}`)
        getFood()
        toast.add(actionSuccess("Food Successfully Deleted"))
    }

    getFood()
</script>

<template>
    <DataTable :value="foodList" tableStyle="width: 100%" scrollable scrollHeight="400px">
        <Column field="food_detail_id" header="ID"></Column>
        <div v-for="editFood in editFoodInfo">
            <Column :field="editFood.field" :header="editFood.header">
                <template #body="rowData">
                    <InputText v-model="rowData.data[editFood.field]"/>
                </template>
            </Column>
        </div>
        <Column header="Actions">
            <template #body="rowData">
                <Button label="Save" @click="saveFood(rowData.data)" class="m-1"></Button>
                <Button label="Delete" severity="danger" @click="deleteFood(rowData.data)" class="m-1"></Button>
            </template>
        </Column>
    </DataTable>
</template>