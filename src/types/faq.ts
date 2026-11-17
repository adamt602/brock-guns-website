/** A fragment of an answer. Keeps FAQ copy as data instead of raw HTML. */
export type AnswerPart =
  | { type: 'text'; text: string }
  | { type: 'phone' }
  | { type: 'link'; text: string; href: string }
  | { type: 'pending'; note: string };

export interface FaqItem {
  question: string;
  answer: AnswerPart[];
  /** Open by default. */
  open?: boolean;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}
