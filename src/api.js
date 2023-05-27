import axios from "axios";

export function initAxiosHeader() {
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.headers.common["Access-Control-Allow-Credentials"] = true;
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
}

export async function getFIXM(id) {
  const res = await axios.get(
    `${process.env.REACT_APP_API_ENDPOINT}/findFixm?UAMIdentification=${id}`
  );
  return res;
}

export async function getADSB() {
  const res = await axios.get(
    `${process.env.REACT_APP_API_ENDPOINT}/findAllAdsb`
  );
  return res;
}

export async function getUAMStatus(id) {
  const res = await axios.get(
    `${process.env.REACT_APP_API_ENDPOINT}/status?uamIdentification=${id}`
  );
  return res;
}

export async function getVertports() {
  try {
    const res = axios.get(`${process.env.REACT_APP_API_ENDPOINT}/vertiports`);
    return res;
  } catch (err) {}
}
