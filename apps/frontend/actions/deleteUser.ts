import axiosInstance from "../util/axiosInstance";

export default async function deleteUser(id: string) {
  const result = await axiosInstance.delete(`/user/${id}`);
  console.log(result);
  return true;
}
