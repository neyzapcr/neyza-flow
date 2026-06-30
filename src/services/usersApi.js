import axios from "axios"

const API_URL = "https://igikullndrkesyvttpdb.supabase.co/rest/v1/users"
const API_KEY = "sb_publishable_GASGcXbBHvKBFrD01HsB0g_dDeVrBnN"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

export const usersAPI = {

    // GET all users
    async fetchUsers() {
        const response = await axios.get(API_URL, { headers })
        return response.data
    },

    // GET user by id (UUID from Supabase Auth)
    async fetchUserById(id) {
        const response = await axios.get(
            `${API_URL}?id=eq.${id}`,
            { headers }
        )
        return response.data?.[0] ?? null
    },

    // CREATE user (register / admin create user)
    async createUser(data) {
        const response = await axios.post(API_URL, data, { headers })
        return response.data
    },

    // UPDATE user
    async updateUser(id, data) {
        const response = await axios.patch(
            `${API_URL}?id=eq.${id}`,
            data,
            { headers }
        )
        return response.data
    },

    // DELETE user
    async deleteUser(id) {
        const response = await axios.delete(
            `${API_URL}?id=eq.${id}`,
            { headers }
        )
        return response.data
    },

    // LOGIN (cek email + password)
    async login(email, password) {
        const response = await axios.get(
            `${API_URL}?email=eq.${email}&password=eq.${password}`,
            { headers }
        )
        return response.data
    }
}