import { interpretationMapper } from "@/features/common/api/mappers";
import { reframingModalities } from "../consts";
import { ReframingModalityIdentifier } from "../enums";
import { Reframing } from "./models";

export class ReframingMapper {
  static map(data: any): Reframing {
    return {
      ...interpretationMapper(data),
      modality:
        reframingModalities[data.modality as ReframingModalityIdentifier],
    };
  }
}
