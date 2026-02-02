import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://cloud-kitchen-gf6y.onrender.com/api' : 'http://localhost:5000/api');

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// --- Kitchen Status ---

export const getKitchenStatus = async () => {
    try {
        const response = await api.get('/kitchen/status');
        return response.data;
    } catch (error) {
        console.error("Error getting kitchen status", error);
        throw error;
    }
};

export const updateKitchenStatus = async (isOpen) => {
    try {
        const response = await api.put('/kitchen/status', { isOpen });
        return response.data;
    } catch (error) {
        console.error("Error updating kitchen status", error);
        throw error;
    }
};

// --- Food Item Functions ---

export const addFoodItem = async (foodData) => {
    try {
        const response = await api.post('/food', foodData);
        return response.data;
    } catch (error) {
        console.error("Error adding food:", error.response?.data || error.message);
        throw error;
    }
};

export const updateFoodItem = async (id, data) => {
    try {
        const response = await api.put(`/food/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating food:", error);
        throw error;
    }
};

export const deleteFoodItem = async (id) => {
    try {
        const response = await api.delete(`/food/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting food:", error);
        throw error;
    }
};

export const getFoodItems = async (category = "All Items") => {
    try {
        const params = category !== "All Items" ? { category } : {};
        const response = await api.get('/food', { params });
        return response.data || [];
    } catch (error) {
        console.error("Error getting food items:", error);
        return [];
    }
};

// --- Order Functions ---

export const createOrder = async (userId, items, total, address) => {
    try {
        const response = await api.post('/orders', {
            userId, // GUEST
            items,
            total,
            address,
            location: address.location // Passing location separately or within address if preferred, but schema has it at root. Let's assume we pass it at root in request body.
        });
        return response.data._id;
    } catch (error) {
        console.error("Error creating order:", error.response?.data || error);
        throw error;
    }
};

export const getOrders = async () => {
    try {
        const response = await api.get('/orders');
        return response.data || [];
    } catch (error) {
        console.error("Error getting orders:", error);
        return [];
    }
};

export const getUserOrders = async (userId) => {
    try {
        const response = await api.get(`/orders/user/${userId}`);
        return response.data || [];
    } catch (error) {
        console.error("Error getting user orders:", error);
        return [];
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await api.patch(`/orders/${orderId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
};

export const deleteOrder = async (orderId) => {
    try {
        const response = await api.delete(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error;
    }
};

// Real-time updates dashboard
export const subscribeToOrders = (callback) => {
    const fetchOrders = async () => {
        try {
            const orders = await getOrders();
            callback(orders);
        } catch (error) {
            console.error("Error in order subscription:", error);
        }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
};
