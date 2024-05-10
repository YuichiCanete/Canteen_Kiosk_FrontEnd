<script setup>
    import { onBeforeMount, ref } from 'vue';
    import {apiFunc} from './data.js'
    import TabMenu from 'primevue/tabmenu';
    import Dropdown from 'primevue/dropdown';

    let isLoaded = ref(false);
    let orderList = ref([]);
    let tallyList = ref([]);
    let foodList = ref([])
    const selectedTab = ref(0)
    const editing = ref({})
    const selectedStatus = ref()
    const tallyEditing = ref({})
    const selectedTally = ref()

    let foodAdding = ref({
        name: '',
        price: 0,
        available_stock: 0,
        image: ''
    })

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

    const tallyStats = ref([
        {name: "paid", code: 'paid'},
        {name: "unpaid", code: 'unpaid'},
    ])

    function editOrder(orderData){
        editing.value = orderData
    }

    function editTally(tallyData){
        tallyEditing.value = tallyData
    }

    const editFoodInfo = ref([
        {field: 'name', header:'Food Name'},
        {field: 'price', header:'Price'},
        {field: 'available_stock', header:'Inventory'},
        {field: 'image', header:'image link'}
    ])

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
            isLoaded.value = true;
        }
    }

    async function getTally(){
        let requestTally = await apiFunc.value.get('http://127.0.0.1:8000/api/get_tallies') 
        if (requestTally.isSuccess){
            tallyList.value = requestTally.data
        }   
    }

    async function getFood(){
        let requestFood = await apiFunc.value.get('http://127.0.0.1:8000/api/food_details')
        if (requestFood.isSuccess){
            foodList.value = requestFood.data
        }
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
        updateDetails()
    }

    async function saveTally(tallyData){
        const updatedTally = {
            tally_status: 'unpaid',
            salary_period: '2000-10-10',
            user_order_id: 1
        }
        tallyData.tally_status = tallyEditing.value.code
        await apiFunc.value.update(`http://127.0.0.1:8000/api/tally/1`,updatedTally)
        updateDetails()
    }

    async function saveFood(foodData){
        await apiFunc.value.update(`http://127.0.0.1:8000/api/food_details/${foodData.food_detail_id}`,{
            name: foodData.name,
            price: foodData.price,
            available_stock: foodData.available_stock,
            image: foodData.image
        })
        updateDetails()
    }


    async function deleteFood(foodData){
        await apiFunc.value.remove(`http://127.0.0.1:8000/api/food_details/${foodData.food_detail_id}`)
        updateDetails()
    }

    async function addFood(){
        await apiFunc.value.add('http://127.0.0.1:8000/api/food_details/',foodAdding.value)
        foodAdding.value = {
            name: '',
            price: 0,
            available_stock: 0,
            image: ''
        }
        updateDetails()
    }

    async function updateDetails(){
        await getOrders()
        await getTally()
        await getFood()
    }

    onBeforeMount(updateDetails);

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
                        <Dropdown v-model="selectedStatus" :options="orderStats" optionLabel="name" placeholder="Select Status" checkmark :highlightOnSelect="false" class="m-2" v-if="editing===rowData.data" />
                        <Button label="Edit" class="m-1" severity="success" @click="editOrder(rowData.data)" v-else></Button>
                        <Button label="Save" class="m-1" @click="updateStatus(rowData.data)"></Button>
                    </template>
                </Column>
            </DataTable>
            
        </div>

        <div v-else-if="selectedTab===1">
            <DataTable :value="tallyList" tableStyle="width: 100%" scrollable scrollHeight="400px">
                <Column field="user_id" header="User Id"></Column>
                <Column field="salary_period" header="Salary Period"></Column>
                <Column field="tally_status" header="Status"></Column>
                <Column field="amount" header="Amount"></Column>
                <!-- <Column header="Actions">
                    <template #body="rowData">
                        <Dropdown v-model="selectedTally" :options="tallyStats" placeholder="Select Status" optionLabel="name" checkmark :highlightOnSelect="false" v-if="tallyEditing===rowData.data" class="m-1"></Dropdown>
                        <Button label="edit" @click="editTally(rowData.data)" class="m-1" v-if="tallyEditing !== rowData.data" severity="success"></Button>
                        <Button label="save" @click="saveTally(rowData.data)" class="m-1"></Button>
                    </template>
                </Column> -->
            </DataTable>
            <Button label="Generate Tally" icon="pi pi-file-export" class="m-2"></Button>
        </div>

        <div v-else-if="selectedTab===2">
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
        </div>

        <div v-else-if="selectedTab===3">
            <InputText v-model="foodAdding.name" placeholder="Food Name" class="m-2"></InputText> <br>
            <InputText v-model="foodAdding.price" placeholder="Price" class="m-2"></InputText> <br>
            <InputText v-model="foodAdding.available_stock" placeholder="Inventory" class="m-2"></InputText> <br>
            <InputText v-model="foodAdding.image" placeholder="Image Link" class="m-2"></InputText> <br>
            <Button label="Add" icons="pi pi-plus" class="m-2" @click="addFood()"></Button>
            <img :src="foodAdding.image" v-if="foodAdding.image != ''" style="width: min(500px,100%); height: min(500px,100%);">
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