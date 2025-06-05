import { InterpretationType } from "@common/models/interpretation/interpretation";
import {
  ModalityIdentifier,
  ModalityLabel,
} from "@common/models/translation/translation-modality";
import { Translation } from "@common/models/translation/translation";
import { Timestamp } from "firebase/firestore";

export const mockUserMessages = [
  //(F) – Feeling unheard, desperate to be understood
  "No, it's fine — really, don't worry about it. I just talk to hear myself anyway, right? God forbid you actually look up when I say something that matters.",
  //(M) – Wants connection, feels emotionally exiled
  "I don't even know why I try anymore. You're just gonna brush me off like always — like I'm the needy one just because I want a moment with you.",
  //(F) – Jealous, insecure, covering it with sarcasm
  "Wow, you have so much energy for everyone else. Must be exhausting, making all those other people feel special.",
  //(M) – Feeling unappreciated, spiraling into resentment
  "Do you even notice the stuff I do around here? Or does it just magically get done by the invisible house goblin you forgot you live with?",
  //(F) – Deeply lonely, but masking it in anger
  "I honestly don't even know who I'm dating anymore. You're just this... shell that floats in and out of the room. When did I become so easy to ignore?",
  //(M) – Sexually rejected, but avoids saying it outright
  "I guess I'll just keep pretending I don't notice how you flinch away every time I touch you. That's totally normal and fine.",
  //(F) – Tired of shouldering emotional labor
  "It's cute how I'm basically your emotional manager and housekeeper and therapist and backup plan, but somehow I'm the one who's 'too emotional' when I lose it.",
  //(M) – Lost, overwhelmed, borderline hopeless
  "I don't even know how to talk to you anymore without it turning into something. Maybe we're just better at pretending than actually being okay.",
  //(F) – Trying to get a response, any response
  "You could at least pretend to care. Like throw me a half-hearted 'that sucks' or something so I don't feel like I'm screaming into a void.",
  //(M) – Abandoned in small daily ways
  "You leave the room when I walk in. You pick up your phone the second I try to talk. It's not dramatic — it's just the slow bleed of being slowly erased.",
  //(F) – Sarcastic bid for quality time
  "Wow, you're free for 20 minutes this week? Should I book an appointment or do I just get whatever scraps fall off your calendar?",
  //(M) – Emotionally abandoned but trying to stay calm
  "I used to feel like we were a team. Now I just feel like a weird extra in a life you're barely letting me visit.",
  //(F) – Angry about being shut out emotionally
  "You say you're 'just tired' or 'don't want to talk about it' but somehow have deep conversations with literally everyone else. Just not me, I guess.",
  //(M) – Passive-aggressive bid for validation
  "Nah, it's cool. I'll just keep guessing what you actually want and then still be wrong and get glared at.",
  //(F) – Frustrated about being dismissed or talked over
  "It's wild how fast you interrupt me. Like, it's honestly impressive. I must just be talking for sport at this point.",
  //(M) – Wants to feel desired, but feels invisible
  "I miss when you used to actually look at me. Now you look through me like I'm just... part of the furniture.",
  //(F) – Resentful about one-sided emotional care
  "You're allowed to have breakdowns. I'm not even allowed to be slightly off without it being a problem. How is that fair?",
  //(M) – Jealous, insecure, and afraid to say it plainly
  "It's just funny how lit up you get when you're talking to him. Like, I forgot what that version of you even looked like with me.",
  //(F) – Sarcastic complaint masking need for help
  "Sure, I'll do the laundry, dishes, groceries, texts, planning, and emotional tracking — because clearly it's just easier if I handle everything, right?",
  //(M) – Frustrated, bitter, shut down
  "I'm tired of trying to talk about things that matter. You either change the subject or act like I'm overreacting. So yeah, maybe silence is easier.",
];

export const mockTranslations: Translation[] = [
  {
    id: Math.random().toString(36).substring(2, 15),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: "assistant",
    updatedBy: null,
    text: "I really value your presence, and I feel hurt when I don't feel heard.",
    description: "A gentle reframing expressing the need to feel heard.",
    type: InterpretationType.TRANSLATION,
    originalMessageId: "msg_0",
    model: "gpt-4" as any,
    promptOptions: {
      modalities: [
        {
          id: ModalityIdentifier.EmpathicDialogue,
          label: ModalityLabel.EmpathicDialogue,
        },
      ],
      tone: "gentle",
      emotions: ["hurt", "frustration"],
      needs: ["presence", "understanding"],
      userMessage: "You never pay attention when I’m talking.",
      userInstructions: "Make it kind and constructive",
      extraContext: "Romantic relationship context",
    },
    rating: 4,
    favorite: false,
    notes: "",
    isEdit: false,
  },
  {
    id: Math.random().toString(36).substring(2, 15),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: "assistant",
    updatedBy: null,
    text: "I reach out because I care deeply, but I’d love for you to initiate sometimes too.",
    description: "Communicates desire for reciprocity without blame.",
    type: InterpretationType.TRANSLATION,
    originalMessageId: "msg_1",
    model: "gpt-4" as any,
    promptOptions: {
      modalities: [
        {
          id: ModalityIdentifier.EmpathicDialogue,
          label: ModalityLabel.EmpathicDialogue,
        },
      ],
      tone: "warm",
      emotions: ["loneliness", "hope"],
      needs: ["mutual effort", "closeness"],
      userMessage: "I feel like I’m always the one reaching out.",
      userInstructions: "Make it inviting and clear",
      extraContext: "Romantic relationship context",
    },
    rating: 5,
    favorite: false,
    notes: "",
    isEdit: false,
  },
  {
    id: Math.random().toString(36).substring(2, 15),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: "assistant",
    updatedBy: null,
    text: "I was really hoping you’d ask about my day. It means a lot when you do.",
    description: "Softens hurt into a need for care and curiosity.",
    type: InterpretationType.TRANSLATION,
    originalMessageId: "msg_2",
    model: "gpt-4" as any,
    promptOptions: {
      modalities: [
        {
          id: ModalityIdentifier.AuthenticRelating,
          label: ModalityLabel.AuthenticRelating,
        },
      ],
      tone: "honest",
      emotions: ["disappointment", "longing"],
      needs: ["attention", "empathy"],
      userMessage: "You didn’t even ask how my day was.",
      userInstructions: "Make it warm and reflective",
      extraContext: "Romantic relationship context",
    },
    rating: 4,
    favorite: false,
    notes: "",
    isEdit: false,
  },
  {
    id: Math.random().toString(36).substring(2, 15),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: "assistant",
    updatedBy: null,
    text: "When we argue, I feel scared and disconnected. I wish we could stay open to each other.",
    description: "Invites emotional openness during conflict.",
    type: InterpretationType.TRANSLATION,
    originalMessageId: "msg_3",
    model: "gpt-4" as any,
    promptOptions: {
      modalities: [
        {
          id: ModalityIdentifier.EmotionallyFocusedCommunication,
          label: ModalityLabel.EmotionallyFocusedCommunication,
        },
      ],
      tone: "vulnerable",
      emotions: ["fear", "disconnect"],
      needs: ["emotional safety", "connection"],
      userMessage: "Why do you always shut down when we argue?",
      userInstructions: "Make it soft and vulnerable",
      extraContext: "Romantic relationship context",
    },
    rating: 5,
    favorite: true,
    notes: "This one really worked well in session.",
    isEdit: false,
  },
  {
    id: Math.random().toString(36).substring(2, 15),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: "assistant",
    updatedBy: null,
    text: "Sometimes I feel uncared for, and I really need reassurance that I matter to you.",
    description: "Expresses longing for emotional reassurance.",
    type: InterpretationType.TRANSLATION,
    originalMessageId: "msg_4",
    model: "gpt-4" as any,
    promptOptions: {
      modalities: [
        {
          id: ModalityIdentifier.RelationalMindfulness,
          label: ModalityLabel.RelationalMindfulness,
        },
      ],
      tone: "tender",
      emotions: ["insecurity", "sadness"],
      needs: ["reassurance", "importance"],
      userMessage: "It’s like you don’t even care sometimes.",
      userInstructions: "Make it tender and validating",
      extraContext: "Romantic relationship context",
    },
    rating: 5,
    favorite: false,
    notes: "",
    isEdit: false,
  },
];

export function getRandomTranslation(
  overrides: Partial<Translation> = {}
): Translation {
  const base =
    mockTranslations[Math.floor(Math.random() * mockTranslations.length)];
  return {
    ...base,
    ...overrides,
    promptOptions: {
      ...base.promptOptions,
      ...(overrides.promptOptions ?? {}),
    },
  };
}
