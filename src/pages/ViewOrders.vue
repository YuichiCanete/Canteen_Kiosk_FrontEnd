<script setup>
    import { onBeforeMount, ref } from 'vue';
    import {apiFunc} from './data.js'
    import TabMenu from 'primevue/tabmenu';
    import Dropdown from 'primevue/dropdown';

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
                        status: od.order_status,
                        date: od.order_date,
                        user: od.user_id
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

    const tabOptions = ref([
        { label: 'View Orders', icon: 'pi pi-shopping-cart'},
        { label: 'View Tally', icon: 'pi pi-eye'},
        { label: 'Edit Food', icon: 'pi pi-file-edit'}, 
        { label: 'Add Food', icon: 'pi pi-plus-circle'}, 
    ]);

    const orderStats = ref([
        {name: 'Preparing', code:'preparing',},
        {name: 'Ready', code:'ready',},
        {name: 'Cancelled', code:'cancelled',},
        {name: 'Done', code:'done',},
    ])

    const selectedTab = ref(0)
    const editing = ref({})
    const selectedStatus = ref()

    function editOrder(orderData){
        editing.value = orderData
    }

    async function updateStatus(orderData){
        const updatedData = {
            payment_type: orderData.paytype,
            order_date: orderData.date,
            user_id: orderData.user,
            order_status: selectedStatus.value.code
        }
        orderData.status = selectedStatus.value.code
        await apiFunc.value.update(`http://127.0.0.1:8000/api/user_order/${orderData.orderNum}`, updatedData);
    }

    onBeforeMount(getOrders);

</script>

<template>
    <Header title="View Orders" icon="pi-eye"></Header>
    <TabMenu :model="tabOptions" v-model:activeIndex="selectedTab"/>
    

    <h2 class="text-pink m-2">{{ tabOptions[selectedTab].label }}</h2>

    <div class="m-2">

        <div v-if="selectedTab===0">
            <DataTable :value="orderList" tableStyle="width: 100%" scrollable scrollHeight="400px">
                <Column field="orderNum" header="ID"></Column>
                <Column field="paytype" header="Payment Type"></Column>
                <Column field="total" header="Total"></Column>
                <Column field="date" header="Date"></Column>
                <Column field="status" header="Status"></Column>
                <Column header="Food Items">
                    <template #body="rowData">
                        <p v-for="food in rowData.data.foodList">
                            {{ food.name }} x{{ food.quantity }}
                        </p>
                    </template>
                </Column>
                <Column header="Actions">
                    <template #body="rowData">
                        <Dropdown v-model="selectedStatus" :options="orderStats" optionLabel="name" placeholder="Select New Status" checkmark :highlightOnSelect="false" class="m-2" v-if="editing===rowData.data" />
                        <Button label="Edit" class="m-1" severity="success" @click="editOrder(rowData.data)" v-else></Button>
                        <Button label="Save" class="m-1" @click="updateStatus(rowData.data)"></Button>
                    </template>
                </Column>
            </DataTable>
            
        </div>

        <div v-else-if="selectedTab===1">
            <DataTable>

            </DataTable>
            <Button label="Generate Tally" icon="pi pi-file-export" class="m-2"></Button>
        </div>

        <div v-else-if="selectedTab===2">

        </div>

        <div v-else-if="selectedTab===3">

        </div>

    </div>

    





    

    
    

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

    :deep(.p-datatable), :deep(.p-datatable-tbody) > tr > td {
        vertical-align: top;
    }

</style>