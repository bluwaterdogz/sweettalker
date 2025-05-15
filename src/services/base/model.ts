import { Timestamp } from "firebase/firestore";

export interface BaseModel {
  id: string;
  createdAt: Timestamp;
  createdAtDateString: string;
  updatedAt: Timestamp;
  updatedAtDateString: string;
  updatedBy: string | null;
  createdBy: string | null;
}
