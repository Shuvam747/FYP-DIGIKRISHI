import { toast } from "@/hooks/use-toast";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  timeout: 10000,
});

api.interceptors.response.use(
  response => response,
  error => {
    toast({
      title: "Error",
      description: error.response?.data?.message || "Something went wrong!",
      variant: "destructive",
    });

    return Promise.reject(error);
  }
);

export default api;
