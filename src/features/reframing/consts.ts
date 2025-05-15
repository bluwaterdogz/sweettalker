import { ReframingModality } from "./api/models";
import { ReframingModalityIdentifier, ReframingModalityLabel } from "./enums";

export const reframingModalities: Record<
  ReframingModalityIdentifier,
  ReframingModality
> = {
  [ReframingModalityIdentifier.COGNITIVE_REFRAMING]: {
    id: ReframingModalityIdentifier.COGNITIVE_REFRAMING,
    label: ReframingModalityLabel.COGNITIVE_REFRAMING,
    description:
      "Cognitive reframing is a technique that helps people change their negative thought patterns and beliefs. It involves identifying and challenging irrational or negative thoughts and replacing them with more positive and realistic ones.",
  },
  [ReframingModalityIdentifier.STOIC_REFRAMING]: {
    id: ReframingModalityIdentifier.STOIC_REFRAMING,
    label: ReframingModalityLabel.STOIC_REFRAMING,
    description:
      "Stoic reframing is a technique that helps people change their negative thought patterns and beliefs. It involves identifying and challenging irrational or negative thoughts and replacing them with more positive and realistic ones.",
  },
  [ReframingModalityIdentifier.EXISTENTIAL_REFRAMING]: {
    id: ReframingModalityIdentifier.EXISTENTIAL_REFRAMING,
    label: ReframingModalityLabel.EXISTENTIAL_REFRAMING,
    description:
      "Existential reframing is a technique that helps people change their negative thought patterns and beliefs. It involves identifying and challenging irrational or negative thoughts and replacing them with more positive and realistic ones.",
  },
  [ReframingModalityIdentifier.SPIRITUAL_REFRAMING]: {
    id: ReframingModalityIdentifier.SPIRITUAL_REFRAMING,
    label: ReframingModalityLabel.SPIRITUAL_REFRAMING,
    description:
      "Spiritual reframing is a technique that helps people change their negative thought patterns and beliefs. It involves identifying and challenging irrational or negative thoughts and replacing them with more positive and realistic ones.",
  },
  [ReframingModalityIdentifier.NARRATIVE_REFRAMING]: {
    id: ReframingModalityIdentifier.NARRATIVE_REFRAMING,
    label: ReframingModalityLabel.NARRATIVE_REFRAMING,
    description:
      "Narrative reframing is a technique that helps people change their negative thought patterns and beliefs. It involves identifying and challenging irrational or negative thoughts and replacing them with more positive and realistic ones.",
  },
  [ReframingModalityIdentifier.POSITIVE_PSYCHOLOGY]: {
    id: ReframingModalityIdentifier.POSITIVE_PSYCHOLOGY,
    label: ReframingModalityLabel.POSITIVE_PSYCHOLOGY,
    description:
      "Positive psychology is a technique that helps people change their negative thought patterns and beliefs. It involves identifying and challenging irrational or negative thoughts and replacing them with more positive and realistic ones.",
  },
};
