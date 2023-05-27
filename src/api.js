import axios from "axios";

export async function getFIXM(id) {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_ENDPOINT}/findFixm?UAMIdentification=${id}`
  );
  return data;
}

export async function getCourseInfo() {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_ENDPOINT}/findAllAdsb`
  );
  return data;
}

export async function getUAMStatus(id) {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_ENDPOINT}/status?uamIdentification=${id}`
  );
  return data;
}

export async function getVertportsInfo() {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_ENDPOINT}/vertiports`
  );
  return { data };
}
