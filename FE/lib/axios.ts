import Axios from "axios";
import { getSession } from "next-auth/react";

const axios = Axios.create({ baseURL: "http://52.77.251.127:4000/api" });

axios.interceptors.request.use(async (config: any) => {
  const session = await getSession();

  config.headers.Authorization = `Bearer ${session?.accessToken}`;

  return config;
});

export default axios;
