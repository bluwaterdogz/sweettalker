import { toDatestring } from "../firebase/utils";
import { BaseModel } from "./model";

export const baseModelMapper = (data: any): BaseModel => {
  return {
    id: data.id,
    createdAt: data.createdAt,
    createdBy: data.createdBy,
    updatedAt: data.updatedAt,
    updatedBy: data.updatedBy,
  };
};
