import { useQuery } from "@tanstack/react-query"
import axios from "axios"


export const useGetUser = () => {
    return useQuery({
        queryKey: ["GET_USER_LIST"],
        queryFn: () => {
            return axios.get("https://localhost:3000/api/users/getuser", {
                withCredentials: true,
            })
        }
    })
}