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
            const response = await axiosInstance.get('/auth/check-auth');
            set({authUser: response.data});
        } catch (error) {
            console.log("error", error)
            set({authUser: null});
        }finally{
            set({isCheckingAuth: false});
        }
    },

    //Signup
    signup: async(FullName,email,password)=>{
        set({isSigningUp: true});
        try {
            const response = await axiosInstance.post('/auth/signup', {FullName,email,password});
            toast.success("Account created successfully");
            set({authUser: response.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp: false});
        }
    },

}))