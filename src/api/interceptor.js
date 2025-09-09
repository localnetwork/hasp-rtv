// import { parseCookies } from "nookies";
// const RATE_LIMIT_KEY = process.env.RATE_LIMIT_KEY || "";

import { getConfig } from "@/src/config/env";

export default function setup(axios) {
  axios.interceptors.request.use((config) => {
    // const token = parseCookies("token");
    const variables = getConfig();
    config.headers["Authorization"] = `Bearer ` + variables?.query?.token;
    // config.headers["X-Rate-Key"] = RATE_LIMIT_KEY;
    config.headers["Strict-Transport-Security"] = "max-age=31536000";
    return config;
  });
  axios.interceptors.response.use(
    (response) => {
      return Promise.resolve(response);
    },
    (error) => {
      // const { data, status, statusText } = error.response;
      // Error callback here
      // global popup notification
      return Promise.reject(error?.response);
    }
  );
}
