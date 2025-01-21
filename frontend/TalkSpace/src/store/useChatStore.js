import {create} from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"

export const useChatStore = create((set,get)=>({
    messages:[],
    users:[],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,
    getUsers: async()=>{
        set({ isUserLoading:true})
        try {
            const response= await axiosInstance.get("/message/users")
            set({users:response.data})
        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isUserLoading:false})
        }
    },
    getMessages: async(userId)=>{
        set({isMessageLoading:true})
        try {
            const response = await axiosInstance.get(`/message/${userId}`)
            console.log(response.data)
            set({messages:response.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isMessageLoading:false})
        }
    },
    setSelectedUser: (selectedUser)=>set({selectedUser}),
    sendMessage: async (data) => {
        const {selectedUser,messages} = get()
        try {
            const response = await axiosInstance.post(`/message/send/${selectedUser._id}`,data)
            set({messages:[...messages,response.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}))