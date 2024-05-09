import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000'
})

axiosInstance.interceptors.response.use(
    (response)=>{
        if(response.data && response.data.success){
            return response.data
        }else{
            throw new Error(response.data.message || '服务器错误')
        }
    },
    (error)=>{
        console.log("错误 ",error);
        throw error
    },
)

export default axiosInstance