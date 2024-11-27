import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default {
    getItems() {
        return apiClient.get('/items');
    },
    // addItem(item) {
    //     return apiClient.post('/items', item);
    // },
    // updateItem(id, item) {
    //     return apiClient.put(`/items/${id}`, item);
    // },
    // deleteItem(id) {
    //     return apiClient.delete(`/items/${id}`);
    // },
};
