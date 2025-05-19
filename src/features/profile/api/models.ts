import { Model } from "@/features/common/api/enums";
import { BaseModel } from "@/services/base/model";
import { ThemeLabel } from "@/common/theme/types";

export interface Settings extends BaseModel {
  notifications?: boolean;
  language?: string;
  model?: Model;
  theme?: ThemeLabel;
}
