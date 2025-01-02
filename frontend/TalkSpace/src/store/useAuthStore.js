import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';

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
    }
}))