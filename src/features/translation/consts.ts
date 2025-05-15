import { ModalityLabel, ModalityIdentifier } from "./enums";
import { Modality } from "./api/models";

export const translationModalities: Record<ModalityIdentifier, Modality> = {
  [ModalityIdentifier.NonviolentCommunication]: {
    id: ModalityIdentifier.NonviolentCommunication,
    label: ModalityLabel.NonviolentCommunication,
    originator: "Marshall Rosenberg",
  },
  [ModalityIdentifier.ImagoRelationshipTherapy]: {
    id: ModalityIdentifier.ImagoRelationshipTherapy,
    label: ModalityLabel.ImagoRelationshipTherapy,
    originator: "Harville Hendrix & Helen LaKelly Hunt",
  },
  [ModalityIdentifier.Circling]: {
    id: ModalityIdentifier.Circling,
    label: ModalityLabel.Circling,
    originator: "Guy Sengstock and others",
  },
  [ModalityIdentifier.AuthenticRelating]: {
    id: ModalityIdentifier.AuthenticRelating,
    label: ModalityLabel.AuthenticRelating,
    originator: "AR community practices",
  },
  [ModalityIdentifier.CompassionateInquiry]: {
    id: ModalityIdentifier.CompassionateInquiry,
    label: ModalityLabel.CompassionateInquiry,
    originator: "Dr. Gabor Maté",
  },
  [ModalityIdentifier.RadicalHonesty]: {
    id: ModalityIdentifier.RadicalHonesty,
    label: ModalityLabel.RadicalHonesty,
    originator: "Brad Blanton",
  },
};
