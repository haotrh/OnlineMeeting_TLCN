import _ from "lodash";
import axios from "../axios";

export const getRooms = async (id: string) => {
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

export const searchUsers = async (
  email: string,
  excludeUserId: string,
  isVerified: boolean,
  limit: number,
  offset: number
) => {
  let params: any = {};

  if (_.isEmpty(email)) {
    return [];
  }

  _.isString(email) && (params.email = email);
  isVerified && (params.isVerified = isVerified);
  _.isNumber(limit) && (params.limit = limit);
  _.isNumber(offset) && (params.offset = offset);
  excludeUserId && (params.excludeUserId = excludeUserId);

  await new Promise((res) => setTimeout(res, 200));
  const response = await axios.get(`/users`, {
    params,
  });

  return response.data;
};
