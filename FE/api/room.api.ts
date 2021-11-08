import axios from "../lib/axios";
import { CreateRoom } from "../types/room.type";

export const createRoom = async (data: CreateRoom) => {
  return (await axios.post("/rooms", data)).data;
};

export const deleteRoom = async (id: string) => {
  return await axios.delete(`/rooms/${id}`);
};

export const getRoom = async (id: string) => {
  return (await axios.get(`/rooms/${id}`)).data;
};
