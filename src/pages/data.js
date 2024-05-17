import {ref} from 'vue'
import axios from 'axios';

class Order{
    constructor(){
        this.currentUser = {}
    }

    async loginDefault(){
        let requestUser = await apiFunc.value.get('/api/users/220000000')
        if (requestUser.isSuccess){
            this.currentUser = requestUser.data
        }
    }

    async loginUser(userID){
        let requestUser = await apiFunc.value.get(`/api/users/${userID}`)
        if (requestUser.isSuccess){
            this.currentUser = requestUser.data
        }
    }

}

class apiFunctions {
    constructor(){
        this.link = "http://127.0.0.1:8000"
    }

    async get(linkRoute) {
        try {
            const response = await axios.get(this.link+linkRoute);
            console.log('Get Success');
            return {
                isSuccess: true,
                data: response.data
            }
        } catch (error) {
            console.error('Error Message:', error);
            return {
                isSuccess: false,
                data: []
            };
        }
    }

    async update(linkRoute,updatedObject){
        try {
          const response = await axios.put(this.link+linkRoute, updatedObject,{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        });
          console.log('Update Success');
          return {
            isSuccess: true,
            data: response.data
            }
        } catch (err) {
          console.error('Update Error:', err);
          return {
            isSuccess: false,
            data: []
        };
        }
    }

    async add(linkRoute,addObject){
        try {
            const response = await axios.post(this.link+linkRoute, addObject, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            });
            console.log('Adding Success')
            return {
                isSuccess: true,
                data: response.data
                }
        } catch (err) {
            console.error('Adding Error:', err);    
            return {
                isSuccess: false,
                data: []
            };
        }
    }

    async remove(linkRoute){
        try {
            await axios.delete(this.link+linkRoute);   
            console.log('Delete Success')
            return {isSuccess:true}
        } catch (err) {
            console.error('Deleting Error:', err);
            return {isSuccess:false}
        }
    }
}

const  orderNumber = ref(0)
const apiFunc = ref(new apiFunctions())
const myOrder = new Order()
export { apiFunc, myOrder, orderNumber};
