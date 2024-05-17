<script setup>
    import { apiFunc } from '../pages/data';
    import { ref } from 'vue';
    import Dropdown from 'primevue/dropdown';
    import Panel from 'primevue/panel';
    import Card from 'primevue/card';
    import Button from 'primevue/button';
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import InputText from 'primevue/inputtext';

    import { useToast } from "primevue/usetoast";
    import { actionError,actionSuccess } from '../components/orders';
    const toast = useToast();

    let tallyList = ref([]);
    const filteredTally = ref([]);
    const tallyFilter = ref(null);
    const tallyEditing = ref({});
    const selectedTally = ref({});
    const selectedDate = ref(null);
    const tallyForPersonnel = ref({
        search: null,
        total: 0,
        datesNamount: [],
    });

    const tallyPerDay = ref([]); // New variable to hold tally per day information

    const tallyStats = ref([
        { name: "paid", code: 'paid' },
        { name: "unpaid", code: 'unpaid' },
    ]);

    function editTally(tallyData) {
        tallyEditing.value = tallyData;
    }

    async function saveTally(tallyData) {
        const updatedTally = {
            tally_status: selectedTally.value.code,
            salary_period: selectedDate.value,
            user_order_id: tallyData.user_order_id,
            user_id: tallyData.user_id
        }

        tallyData.tally_status = tallyEditing.value;
        tallyData.salary_period = selectedDate.value;
        let response = await apiFunc.value.update(`/api/tally/${tallyData.tally_id}`, updatedTally);
        getTally();

        if (response.isSuccess){
            toast.add(actionSuccess("Tally Saved"))
        }else{
            toast.add(actionError("Tally Saving Error"))
        }
    }

    async function getTally() {
        let requestTally = await apiFunc.value.get('/api/get_tallies');
        if (requestTally.isSuccess) {
            tallyList.value = requestTally.data;
        }
    }

    function generatePersonnel() {
        const userId = parseInt(tallyForPersonnel.value.search);
        const filteredList = tallyList.value.filter(item => item.user_id === userId);

        tallyForPersonnel.value.total = filteredList
            .filter(item => item.tally_status === 'unpaid')
            .map(item => item.amount)
            .reduce((acc, curr) => acc + curr, 0); // Calculate sum

        tallyForPersonnel.value.datesNamount = filteredList
            .filter(item => item.tally_status === 'unpaid')
            .map(item => ({ amount: item.amount, salary_period: item.salary_period }));

        if (filteredList.length > 0){
            toast.add(actionSuccess("Tally Generated"))
        }else{
            toast.add(actionError("Tally Failed to Generate"))
        }
        
    }

    function generateTallyPerDay() {
        const tallyPerDayTemp = tallyList.value.reduce((acc, tally) => {
            const date = tally.salary_period;
            const amount = tally.amount;

            if (!acc[date]) {
                acc[date] = 0;
            }

            acc[date] += amount;
            return acc;
        }, {});

        // Assign the calculated tally per day to the tallyPerDay variable
        tallyPerDay.value = Object.entries(tallyPerDayTemp).map(([date, amount]) => ({ date, amount }));
        toast.add(actionSuccess("Tally Generated"))
    }

    getTally();

</script>


<template>
    <InputText placeholder="Search User" v-model="tallyFilter"/>
    <DataTable :value="(tallyFilter === '' || tallyFilter === null) ? tallyList : tallyList.filter(item => item.user_id === parseInt(tallyFilter))" tableStyle="width: 100%" scrollable scrollHeight="400px">
        <Column field="user_id" header="User Id"></Column>
        <Column field="salary_period" header="Salary Period"></Column>
        <Column field="tally_status" header="Status"></Column>
        <Column field="amount" header="Amount"></Column>
        <Column header="Actions">
            <template #body="rowData">
                <div v-if="tallyEditing===rowData.data">
                    <Dropdown v-model="selectedTally" :options="tallyStats" placeholder="Select Status" optionLabel="name" checkmark :highlightOnSelect="false" class="m-1"></Dropdown>
                    <InputText v-model="selectedDate" type="date"></InputText>
                </div>
                
                <Button icon="pi pi-pencil" @click="editTally(rowData.data)" class="m-1" v-if="tallyEditing !== rowData.data" severity="success"></Button>
                <Button icon="pi pi-save" @click="saveTally(rowData.data)" class="m-1"></Button>
            </template>
        </Column>
    </DataTable>

    <h2 class="m-2">Tally Reports</h2>

    <Panel header="Tally For Personnel">    
        <InputText v-model="tallyForPersonnel.search" placeholder="User ID" class="m-2"/>
        <Button label="Generate Tally" icon="pi pi-file-export" class="m-2" @click="generatePersonnel()"></Button>

        <Card class="m-2">
            <template #header>
                <p>User ID: {{ tallyForPersonnel.search }}</p>
            </template>
            <template #subtitle>
                <p>Total Unpaid Amount: {{ tallyForPersonnel.total }}</p>
                <p v-for="val in tallyForPersonnel.datesNamount">
                    <p>Date: {{val.salary_period}} | Amount: {{ val.amount }}</p>
                </p>
            </template>
        </Card>
    </Panel>

    <Panel header="Tally Per Day">
        <Button label="Generate Tally Per Day" icon="pi pi-file-export" class="m-2" @click="generateTallyPerDay()"></Button>
        <Card class="m-2">
            <template #header>
                <p>Tally Per Day</p>
            </template>
            <template #subtitle>
                <p v-for="val in tallyPerDay">
                    <p>Date: {{val.date}} | Amount: {{ val.amount }}</p>
                </p>
            </template>
        </Card>
    </Panel>
</template>
