<script setup>
    import { apiFunc } from "../pages/data.js"
    import { ref } from 'vue'
    import { orderList, getOrders } from "./orders.js";
    import Dropdown from 'primevue/dropdown';
    import Panel from "primevue/panel";
    import Card from "primevue/card";
    import Button from "primevue/button";
    import DataTable from "primevue/datatable";
    import Column from "primevue/column";
    import InputText from "primevue/inputtext";

    import { useToast } from "primevue/usetoast";
    import { actionError,actionSuccess } from '../components/orders';
    const toast = useToast();

    function getDate() {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        return `${year}-${month}-${day}`;
    }

    const searchOrder = ref(null)
    const editing = ref({})
    const selectedStatus = ref()
    const dateInput = ref(getDate())
    const salesReport = ref([{ date: "Date", totalSales: "Amount" }])

    const orderStats = ref([
        { name: 'Preparing', code: 'preparing', },
        { name: 'Ready', code: 'ready', },
        { name: 'Cancelled', code: 'cancelled', },
        { name: 'Done', code: 'done', },
    ])

    function editOrder(orderData) {
        editing.value = orderData
    }

    async function updateStatus(orderData) {
        const updatedData = {
            payment_type: orderData.paytype,
            order_date: orderData.date,
            user_id: orderData.user,
            order_status: selectedStatus.value.code
        }
        orderData.status = selectedStatus.value.code
        await apiFunc.value.update(`/api/user_order/${orderData.orderNum}`, updatedData);
        getOrders()
        toast.add(actionSuccess("Successfully Updated Order"))
    }

    async function deleteOrder(orderData) {
        await apiFunc.value.remove(`/api/user_order/{user_order}?user_order_id=${orderData.orderNum}`)
        getOrders()
        toast.add(actionSuccess("Successfully Deleted Order"))
    }

    function generateDaily() {
        // Reduce the orderList to accumulate sales by date
        const salesByDate = orderList.value
            .filter(order => order.paytype !== 'tally')  // Exclude 'tally' payment type
            .reduce((acc, order) => {
                // Extract the date and total sales from each order
                const { date, total } = order;

                // If the date is already in the accumulator, add the sales to the existing total
                if (acc[date]) {
                    acc[date] += total;
                } else {
                    // If the date is not in the accumulator, create a new entry with the sales
                    acc[date] = total;
                }
                return acc;
            }, {});

        // Convert the accumulated sales by date object to an array of objects for easier manipulation
        const sr = Object.entries(salesByDate).map(([date, totalSales]) => ({
            date,
            totalSales,
        }));

        salesReport.value = sr
        toast.add(actionSuccess("Sales Generated"))
    }

    function getTotalSalesByDate() {
        const selectedDate = dateInput.value;
        const totalSales = orderList.value
            .filter(order => order.date === selectedDate && order.paytype !== 'tally')  // Exclude 'tally' payment type
            .reduce((acc, order) => acc + order.total, 0);

        salesReport.value = [{ date: selectedDate, totalSales }];
        toast.add(actionSuccess("Sales Generated"))
    }

    getOrders()
</script>

<template>

    <InputText v-model="searchOrder" type="number" placeholder="Order Number"></InputText>

    <DataTable :value="(searchOrder === null || searchOrder === '') ? orderList : orderList.filter((item)=>item.orderNum===parseInt(searchOrder))" tableStyle="width: 100%" scrollable scrollHeight="400px">
        <Column field="orderNum" header="ID"></Column>
        <Column field="paytype" header="Payment Type"></Column>
        <Column field="total" header="Total"></Column>
        <Column field="date" header="Date"></Column>
        <Column field="status" header="Status"></Column>
        <Column header="Food Items">
            <template #body="rowData">
                <p v-for="food in rowData.data.foodList" :key="food.name">
                    <div v-if="food.quantity > 0">
                        {{ food.name }} x{{ food.quantity }}
                    </div>
                </p>
            </template>
        </Column>
        <Column header="Actions">
            <template #body="rowData">
                <div class="d-flex">
                    <div v-if="editing === rowData.data" class="d-flex">
                        <Dropdown v-model="selectedStatus" :options="orderStats" optionLabel="name" placeholder="Select Status" checkmark :highlightOnSelect="false" class="m-2"/>
                        <Button icon="pi pi-trash" class="m-1" severity="danger" @click="deleteOrder(rowData.data)"></Button>
                    </div>
                    <Button icon="pi pi-pencil" class="m-1" severity="success" @click="editOrder(rowData.data)" v-else></Button>
                    <Button icon="pi pi-save" class="m-1" @click="updateStatus(rowData.data)"></Button>
                </div>
            </template>
        </Column>
    </DataTable>

    <h2 class="m-2">Sales Reports</h2>

    <Panel header="Daily Sales Report">
        <div class="m-2">
            <label for="dateInput">Select Date:</label>
            <InputText type="date" id="dateInput" v-model="dateInput" />
        </div>
        
        <Button label="Generate Sales" class="m-2" @click="generateDaily"></Button>
        <Button label="Get Total Sales by Date" class="m-2" @click="getTotalSalesByDate"></Button>

        <Card class="m-2">
            <template #header>
                <p>Report</p>
            </template>
            <template #subtitle>
                <p v-for="report in salesReport" :key="report.date">
                    {{ report.date }} | P{{ report.totalSales }}
                </p>
            </template>
        </Card>
    </Panel>
</template>
