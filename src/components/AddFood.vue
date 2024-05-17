<script setup>

    import { ref } from 'vue';
    import { apiFunc } from '../pages/data';
    import { getFood } from './orders';

    import { useToast } from "primevue/usetoast";
    import { actionError,actionSuccess } from '../components/orders';
    const toast = useToast();

    let foodAdding = ref({
        name: '',
        price: null,
        available_stock: null,
        image: ''
    })

    async function addFood(){
        let response = await apiFunc.value.add('/api/food_details/',foodAdding.value)
        foodAdding.value = {
            name: '',
            price: null,
            available_stock: null,
            image: ''
        }
        getFood()
        if (response.isSuccess){
            toast.add(actionSuccess("Food Successfully Added"))
        }else{
            toast.add(actionError("Food Failed to be Added"))
        }
    }
</script>

<template>
    <InputText v-model="foodAdding.name" placeholder="Food Name" class="m-2"></InputText> <br>
    <InputText v-model="foodAdding.price" placeholder="Price" class="m-2"></InputText> <br>
    <InputText v-model="foodAdding.available_stock" placeholder="Inventory" class="m-2"></InputText> <br>
    <InputText v-model="foodAdding.image" placeholder="Image Link" class="m-2"></InputText> <br>
    <Button label="Add" icons="pi pi-plus" class="m-2" @click="addFood()"></Button>
    <img :src="foodAdding.image" v-if="foodAdding.image != ''" style="width: min(500px,100%); height: min(500px,100%);">
</template>
