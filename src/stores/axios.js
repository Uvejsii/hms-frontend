import axios from 'axios'

const api = axios.create({
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

export default api
