import { getConfig } from "@/src/config/env";
import BaseApi from "../_base.api";

export default class BLOCKAPI {
  static async getBlockSchemaById(blockId) {
    const config = getConfig();

    const response = await BaseApi.get(
      config.HASP_TENANT_API + `/api/v2/blockcontent/${blockId}/schema`
    );
    if (!response.ok) {
      console.error("Failed to fetch schema:", response.statusText);
    }

    return response.data.data;
  }

  static async createBlock(payload) {
    const config = getConfig();
    try {
      const res = await BaseApi.post(
        config.HASP_TENANT_API + `/api/v2/blockcontent/:page/store`,
        payload
      );
      return res.data;
    } catch (error) {
      console.error("Error. Unable to create block.");
    }
  }

  static async updateBlockById(blockId, payload) {
    const config = getConfig();
    try {
      const res = await BaseApi.post(
        config.HASP_TENANT_API + `/api/v2/blockcontent/${blockId}/update`,
        payload
      );

      return res.data;
    } catch (error) {
      console.error("Error. Unable to update.");
    }
  }
}
