import {
  ModalityLabel,
  ModalityIdentifier,
} from "@common/models/translation/translation-modality";
import { Modality } from "@common/models/translation/translation-modality";

export const translationModalities: Record<ModalityIdentifier, Modality> = {
  [ModalityIdentifier.Circling]: {
    id: ModalityIdentifier.Circling,
    label: ModalityLabel.Circling,
  },

  [ModalityIdentifier.EmotionallyFocusedCommunication]: {
    id: ModalityIdentifier.EmotionallyFocusedCommunication,
    label: ModalityLabel.EmotionallyFocusedCommunication,
  },

  [ModalityIdentifier.AuthenticRelating]: {
    id: ModalityIdentifier.AuthenticRelating,
    label: ModalityLabel.AuthenticRelating,
  },

  [ModalityIdentifier.RelationalMindfulness]: {
    id: ModalityIdentifier.RelationalMindfulness,
    label: ModalityLabel.RelationalMindfulness,
  },

  [ModalityIdentifier.EmpathicDialogue]: {
    id: ModalityIdentifier.EmpathicDialogue,
    label: ModalityLabel.EmpathicDialogue,
  },

  // [ModalityIdentifier.NonviolentCommunication]: {
  //   id: ModalityIdentifier.NonviolentCommunication,
  //   label: ModalityLabel.NonviolentCommunication,
  // },

  // [ModalityIdentifier.RadicalHonesty]: {
  //   id: ModalityIdentifier.RadicalHonesty,
  //   label: ModalityLabel.RadicalHonesty,
  // },
  // [ModalityIdentifier.ImagoRelationshipTherapy]: {
  //   id: ModalityIdentifier.ImagoRelationshipTherapy,
  //   label: ModalityLabel.ImagoRelationshipTherapy,
  // },

  // [ModalityIdentifier.CompassionateInquiry]: {
  //   id: ModalityIdentifier.CompassionateInquiry,
  //   label: ModalityLabel.CompassionateInquiry,
  // },
};

export const translationToneOptions = [
  {
    value: "romantic",
    label: "Romantic",
  },
  {
    value: "gentle",
    label: "Gentle",
  },
  {
    value: "direct",
    label: "Direct",
  },
  {
    value: "playful",
    label: "Playful",
  },
  {
    value: "professional",
    label: "Professional",
  },
];
