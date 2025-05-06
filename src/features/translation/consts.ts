import { generatePromptGPT4, generatePromptGPT3_5 } from "./prompts";
import { ModalityLabel, ModalityIdentifier, Model } from "./enums";
import { Modality } from "./api/models";

export const MODALITIES: Modality[] = [
  {
    id: "nvc",
    label: ModalityLabel.NonviolentCommunication,
    originator: "Marshall Rosenberg",
    identifier: ModalityIdentifier.NonviolentCommunication,
  },
  {
    id: "imago",
    label: ModalityLabel.ImagoRelationshipTherapy,
    originator: "Harville Hendrix & Helen LaKelly Hunt",
    identifier: ModalityIdentifier.ImagoRelationshipTherapy,
  },
  {
    id: "circling",
    label: ModalityLabel.Circling,
    originator: "Guy Sengstock and others",
    identifier: ModalityIdentifier.Circling,
  },
  {
    id: "ar",
    label: ModalityLabel.AuthenticRelating,
    originator: "AR community practices",
    identifier: ModalityIdentifier.AuthenticRelating,
  },
  {
    id: "ci",
    label: ModalityLabel.CompassionateInquiry,
    originator: "Dr. Gabor Maté",
    identifier: ModalityIdentifier.CompassionateInquiry,
  },
  {
    id: "rh",
    label: ModalityLabel.RadicalHonesty,
    originator: "Brad Blanton",
    identifier: ModalityIdentifier.RadicalHonesty,
  },
];
