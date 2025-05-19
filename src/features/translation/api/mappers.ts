import { translationModalities } from "../consts";
import { ModalityIdentifier } from "../enums";
import { Translation, Edit } from "./models";
import { interpretationMapper } from "@/features/common/api/mappers";

export class PriorEditMapper {
  static map(data: any): Edit {
    return {
      id: data.id,
      createdAt: data.createdAt,
      text: data.text,
    };
  }
}

export class TranslationMapper {
  static map(data: any): Translation {
    if (translationModalities[data.modality as ModalityIdentifier] == null) {
      console.error(`Modality ${data.modality} not found`);
    }
    return {
      ...interpretationMapper(data),
      modality:
        translationModalities[data.modality as ModalityIdentifier] ||
        translationModalities[ModalityIdentifier.NonviolentCommunication],
      priorEdits: (data.priorEdits || []).map(PriorEditMapper.map),
    };
  }
}
