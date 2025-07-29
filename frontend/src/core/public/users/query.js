import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: "LOGIN",
    mutationFn: (data) => {
      return axios.post("http://localhost:3000/api/users/login", data);
    },
  });
};

export const useSignup =()=>{
  return use
}