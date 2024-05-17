<script setup>
    import { ref } from 'vue';
    import TabMenu from 'primevue/tabmenu';

    import AddFood from '../components/AddFood.vue';
    import EditFood from '../components/EditFood.vue';
    import EditOrders from '../components/EditOrders.vue';
    import ViewOrders from '../components/ViewOrders.vue';
    import ViewTally from '../components/ViewTally.vue';

    import { useToast } from "primevue/usetoast";
    import { actionError,actionSuccess } from '../components/orders';
    const toast = useToast();

    const selectedTab = ref(0);
    const tabOptions = ref([
        { label: 'View Orders', icon: 'pi pi-shopping-cart' },
        { label: 'Modify Orders', icon: 'pi pi-file-edit' },
        { label: 'View Tally', icon: 'pi pi-eye' },
        { label: 'Edit Food', icon: 'pi pi-file-edit' }, 
        { label: 'Add Food', icon: 'pi pi-plus-circle' }, 
    ]);

    const tabComponents = {
        0: ViewOrders,
        1: EditOrders,
        2: ViewTally,
        3: EditFood,
        4: AddFood,
    };

    

    

</script>

<template>
    <Toast />
    <Header title="Cashier Page" icon="pi-shopping-cart"></Header>
    <TabMenu :model="tabOptions" v-model:activeIndex="selectedTab"/>
    <h2 class="text-pink m-2">{{ tabOptions[selectedTab].label }}</h2>
    <div class="m-2">
        <component :is="tabComponents[selectedTab]"></component>
    </div>
</template>

<style scoped>
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
