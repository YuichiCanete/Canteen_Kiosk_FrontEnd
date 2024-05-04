<script setup>
    import { onBeforeMount, ref } from 'vue';
    import { apiFunc } from './data';
    

    const readyOrder = ref([])
    const preparingOrder = ref([])

    async function updateOrders(){
        let requestReady = await apiFunc.value.get('http://127.0.0.1:8000/api/order_ready')
        let requestPreparing = await apiFunc.value.get('http://127.0.0.1:8000/api/order_preparing')

        if (requestPreparing.isSuccess && requestReady.isSuccess){
            readyOrder.value = requestReady.data
            preparingOrder.value = requestPreparing.data
            console.log(readyOrder.value)
            console.log(preparingOrder.value)
        }
    }

    onBeforeMount(updateOrders)


</script>

<template>
    <Header title="Counter" icon="pi-circle"></Header>

    <div class="center">
        <div class="orderContainer">
            <DataTable :value="preparingOrder" tableStyle="width: 100%" scrollable scrollHeight="75vh" style="font-size: 50px;" class="m-5">
                <Column field="user_order_id" header="Preparing..."></Column>
            </DataTable>

            <DataTable :value="readyOrder" tableStyle="width: 100%" scrollable scrollHeight="700vh" style="font-size: 50px;" class="m-5">
                <Column field="user_order_id" header="Ready..."></Column>
            </DataTable>
        </div>
    </div>

    

</template>

<style scoped>

    .center {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 75vh;
    }

    .orderContainer {
        display: flex;
    } 

</style>
