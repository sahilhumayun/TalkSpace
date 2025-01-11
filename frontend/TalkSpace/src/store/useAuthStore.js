import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isLogging: false,
    isUpdatingProfile: false,
    isSigningUp: false,
    isCheckingAuth: true,

    checkAuth: async ()=>{
        try {
            const response = await axiosInstance.get('/auth/check');
            set({authUser: response.data});
        } catch (error) {
            console.log("error", error)
            set({authUser: null});
        }finally{
            set({isCheckingAuth: false});
        }
    },

    //Signup
    signup: async(data)=>{
        set({isSigningUp: true});
        try {
            const response = await axiosInstance.post('/auth/signup',data);
            toast.success("Account created successfully");
            set({authUser: response.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp: false});
        }
    },

    login: async(data)=>{
        set({isLogging:true})
        try {
            const res = await axiosInstance.post('/auth/login', data)
            set ({ authUser: res.data})
            toast.success("Login Successfuly")
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isLogging: false})
        }

    },
    logout: async()=>{
        try {
            await axiosInstance.post('/auth/logout')
            set ({authUser: null})
            toast.success("Logout Sucsessfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    updateProfile: async(data)=>{
        try {
            set({isUpdatingProfile:true})
            const response = await axiosInstance.put('/auth/update-avatar',data)
            set({authUser: response.data})
            toast.success("Profile Updated Successfuly")
        } catch (error) {
            toast.error("Error in update profile",error)
        } finally{
            set({isUpdatingProfile:false})
        }

    }

}))