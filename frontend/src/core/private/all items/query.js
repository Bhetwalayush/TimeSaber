import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"


export const useGetList = () => {
    return useQuery({
        queryKey: ["GET_ITEM_LIST"],
        queryFn: () => {
            return axios.get("https://localhost:3000/api/items/")
        }
    })
}

export const useSaveItem = () => {
    return useMutation({
        mutationKey: "SAVE_ITEM_DATA",
        mutationFn: (data) => {
            return axios.post("https://localhost:3000/api/items", data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
        }
    })
}


export const useDeleteItem = () => {
    return useMutation({
        mutationKey: "DELETE_ITEM_DATA",
        mutationFn: (id) => {
            return axios.delete(`https://localhost:3000/api/items/${id}`, {
                withCredentials: true,
            });
        }
    })

}

export const useUpdateItem = () => {
    return useMutation({
        mutationKey: "UPDATE_ITEM_DATA",
        mutationFn: ({ id, data }) => {
            return axios.put(`https://localhost:3000/api/items/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
        }
    })
}