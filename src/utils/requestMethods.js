import axios from "axios";
import { getCookies } from 'cookies-next';

let TOKEN = "";

if (typeof window !== "undefined") {


  TOKEN = decodeURI(getCookies("token").token)
}
export let BASE_URL = "";
if (typeof window !== "undefined") {
  BASE_URL = `${window.location.origin}/api/`;
}


export const publicRequest = () => {
  const { token } = getCookies('token')
  return axios.create({
    baseURL: BASE_URL,

    headers: {
      Authorization: decodeURI(token),
      'content-type': 'application/json'
    },
  }
  );

}

export const getRealId = async (id) => {
  let realId = id;

  if (!realId && !window) {
    return;
  }

  console.log(window.location)
  const hostAry = window.location.href.split("/");
  if (hostAry.length === 0) {
    return;
  }
  realId = hostAry[hostAry.length - 1];

  if (typeof Number(realId) !== 'number' && realId !== "new") {
    return;
  }
  return realId;
}
