import { Timestamp } from "firebase/firestore";

export interface BaseModel {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  updatedBy: string | null;
  createdBy: string | null;
}
