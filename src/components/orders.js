import { ref } from "vue";
import { apiFunc } from "../pages/data";

export const orderList = ref([])
export const foodList = ref([])

export const getFood = async() => {
    let requestFood = await apiFunc.value.get('/api/food_details')
    if (requestFood.isSuccess){
        foodList.value = requestFood.data
    }
}

export const getOrders = async() => {
    orderList.value = []
    let orderRequest = await apiFunc.value.get('/api/view_order');
    let userOrderRequest = await apiFunc.value.get('/api/user_order')
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
            groupOrder[o.order_id].foodList.push({
                name: o.food_name,
                quantity:o.quantity,
                food_details_id: o.food_details_id,
                food_id: o.food_id,
                order_id: o.order_id,
                changeAmount: 0
            });
            groupOrder[o.order_id].total += o.unit_price * o.quantity;
        });
    }
}

export const actionError = (message) => {
    return {
        severity: 'error', 
        summary: 'Action Error',
        detail: message,
        life: 2000
    }
}

export const actionSuccess = (message) => {
    return {
        severity: 'success', 
        summary: 'Action Successful',
        detail: message,
        life: 2000
    }
}