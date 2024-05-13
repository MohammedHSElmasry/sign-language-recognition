import { roles } from "../../../middleware/autntication.js";

export const endpoint = {
  add: [roles.admin],
  update: [roles.admin],
  delete: [roles.admin],
};
