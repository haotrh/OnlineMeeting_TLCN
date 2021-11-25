import axios from "../axios";

export const getCreatedRooms = async (id: string) => {
  await new Promise((res) => setTimeout(res, 200));
  return (await axios.get(`/users/${id}/rooms`)).data;
};
