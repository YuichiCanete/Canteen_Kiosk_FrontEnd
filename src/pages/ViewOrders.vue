<script setup>
    import { onBeforeMount, ref } from 'vue';
    import {apiFunc} from './data.js'
    import TabMenu from 'primevue/tabmenu';
    import Listbox from 'primevue/listbox'
    

    import {useRouter} from 'vue-router'
    const router = useRouter()
    function switchTo(path){
        router.push(path)
    }  

    let isLoaded = ref(false);
    let orderList = ref([]);

    async function getOrders() {
        let orderRequest = await apiFunc.value.get('http://127.0.0.1:8000/api/view_order');
        let userOrderRequest = await apiFunc.value.get('http://127.0.0.1:8000/api/user_order')

        if (orderRequest.isSuccess && userOrderRequest.isSuccess) {
            let orderDetail = userOrderRequest.data
            let orders = orderRequest.data;
            let groupOrder = {};
            orders.forEach(o => {
                if (!groupOrder[o.order_id]) {
                    let od = orderDetail.find((e) => e.user_order_id === o.order_id)
                    groupOrder[o.order_id] = {
                        orderNum: o.order_id,
                        foodList: [],
                        total: 0,
                        paytype: od.payment_type,
                        date: od.order_date
                    };
                    orderList.value.push(groupOrder[o.order_id]);
                }
                groupOrder[o.order_id].foodList.push({name: o.food_name, quantity:o.quantity});
                groupOrder[o.order_id].total += o.unit_price * o.quantity;
            });
            console.log(orderList.value);
            isLoaded.value = true;
        }
    }

    onBeforeMount(getOrders);

    const tabOptions = ref([
        { label: 'View Orders', icon: 'pi pi-shopping-cart'},
        { label: 'View Tally', icon: 'pi pi-eye'},
        { label: 'Edit Food', icon: 'pi pi-file-edit'}, 
        { label: 'Add Food', icon: 'pi pi-plus-circle'}, 
    ]);


</script>

<template>
    <Header title="View Orders" icon="pi-eye"></Header>
    <TabMenu :model="tabOptions" v-model:activeIndex="selectedTab"/>

    <h2 class="text-pink m-2">Orders List</h2>
    <div class="m-2">
        <DataTable :value="orderList" tableStyle="width: 100%" scrollable scrollHeight="400px">
            <Column field="orderNum" header="ID"></Column>
            <Column field="paytype" header="Payment Type"></Column>
            <Column field="total" header="Total"></Column>
            <Column field="date" header="Date"></Column>
            <Column header="Food Items">
                <template #body="rowData">
                    <Listbox v-if="rowData.foodList && rowData.foodList.length" :options="rowData.foodList" optionLabel="name" style="max-height: 150px; overflow-y: auto;">
                        <template #item="option">
                            {{ option.name }} x{{ option.quantity }}
                        </template>
                    </Listbox>
                    <span v-else>No food items</span>
                </template>
            </Column>
        </DataTable>
    </div>

    <Button label="Generate Tally" icon="pi pi-file-export" class="m-2"></Button>





    

    
    

</template>

<style scoped>

    .order-table{
        width: 90%;
        height: 60vh;
        overflow: auto;
    }

    td ,tr {
        vertical-align: baseline;
    }

    .under-line {
        border-bottom: 1px solid white;
    }

    :deep(.p-menuitem-text), :deep(.p-menuitem-icon){
        color: #D94496;
    }

    :deep(.p-menuitem-link){
        text-decoration: none;
    }

</style>