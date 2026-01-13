import axios from "axios";


export const api = axios.create({
  baseURL: "http://localhost:8000/api/v1", 
});

export interface Video {
  id: string;
  title: string;
  filename: string;
  created_at: string;
}