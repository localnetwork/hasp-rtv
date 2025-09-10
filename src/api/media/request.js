import { getConfig } from "@/src/config/env";
import axios from "axios";
import BaseApi from "../_base.api";

export default class MEDIAAPI {
  static async createMedia(payload = {}) {
    console.log("payload", payload);
    try {
      const config = getConfig();

      // Convert plain object -> URLSearchParams
      const body = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => {
        // stringify objects (like "data")
        body.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : value
        );
      });

      const response = await BaseApi.post(
        `${config.HASP_TENANT_API}/api/v2/contents/media/entries/store`,
        body,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to create media:", error);
      throw error;
    }
  }
}
