import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: "LOGIN",
    mutationFn: (data) => {
      return axios.post("https://localhost:3000/api/users/login", data, { withCredentials: true });
    },
  });
};

export const useSignup =()=>{
  return use
}