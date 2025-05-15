import { translationModalities } from "../consts";
import { ModalityIdentifier } from "../enums";
import { Translation } from "./models";
import { interpretationMapper } from "@/features/common-interpretation/api/mappers";

export class TranslationMapper {
  static map(data: any): Translation {
    return {
      ...interpretationMapper(data),
      modality: translationModalities[data.modality as ModalityIdentifier],
      priorEdits: data.priorEdits || [],
    };
  }
}
