import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({ baseURL: "http://localhost:3001/" });

api.interceptors.request.use(async (config: any) => {
  const session = await getSession();

  config.headers.Authorization = `Bear ${session?.accessToken}`;

  return config;
});

export default api;
