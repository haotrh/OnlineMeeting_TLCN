import axios from "../lib/axios";

export const getCreatedRooms = async (id: string) => {
  await new Promise((res) => setTimeout(res, 200));
  return (await axios.get(`/users/${id}/rooms`)).data;
};

export const updateUser = async (id: string, data: any) => {
  await new Promise((res) => setTimeout(res, 200));
  return (await axios.put(`/users/${id}`, data)).data;
};

export const changePassword = async (id: string, data: any) => {
  await new Promise((res) => setTimeout(res, 200));
  return await axios.post(`/users/${id}/change-password`, data);
};

export const deleteAccount = async (id: string) => {
  await new Promise((res) => setTimeout(res, 200));
  return await axios.delete(`/users/${id}`);
};
