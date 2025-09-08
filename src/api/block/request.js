import { getConfig } from "../../config/env";
import BaseApi from "../_base.api";
const variables = getConfig();
const { HASP_TENANT_API, router } = variables;
export default class BLOCKAPI {
  static async getBlockSchemaById(blockId) {
    const response = await fetch(`${HASP_TENANT_API}/blocks/${blockId}/schema`);
    if (!response.ok) {
      throw new Error("Failed to fetch block schema");
    }
    return response.json();
  }

  static async updateBlockById(blockId, payload) {
    try {
      const res = await BaseApi.post(
        `/api/v2/blockcontent/${blockId}/update`,
        payload
      );

      return res.data;
    } catch (error) {
      console.error("Error. Unable to update.");
    }
  }
}
