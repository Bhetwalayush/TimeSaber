import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"


export const useGetList = () => {
    return useQuery({
        queryKey: ["GET_ITEM_LIST"],
        queryFn: () => {
            return axios.get("http://localhost:3000/api/items/")
        }
    })
}

export const useSaveItem = () => {
    return useMutation({
        mutationKey: "SAVE_ITEM_DATA",
        mutationFn: (data) => {
            return axios.post("http://localhost:3000/api/items", data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });
        }
    })
}


export const useDeleteItem = () => {
    return useMutation({
        mutationKey: "DELETE_ITEM_DATA",
        mutationFn: (id) => {
            return axios.delete(`http://localhost:3000/api/items/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }
            );
        }
    })

}

export const useUpdateItem = () => {
    return useMutation({
        mutationKey: "UPDATE_ITEM_DATA",
        mutationFn: ({ id, data }) => {
            return axios.put(`http://localhost:3000/api/items/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });
        }
    })
}