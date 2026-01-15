import axios from "axios";


export const api = axios.create({
  baseURL: "http://localhost:8000/api/v1", 
});

export interface Video {
  id: string;
  title: string,
  created_at: Date,
  description?: string,
  status: string,
  transcript?: string,
  analysis?:Array<object>
}