import Axios from "axios";
import { getSession } from "next-auth/react";

const axios = Axios.create({ baseURL: "http://localhost:3001/api" });

axios.interceptors.request.use(async (config: any) => {
  const session = await getSession();

  config.headers.Authorization = `Bearer ${session?.accessToken}`;

  return config;
});

export default axios;
