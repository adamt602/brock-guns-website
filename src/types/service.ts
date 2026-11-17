import type { IconName } from '@/components/ui/icons';
import type { PendingContent, Verifiable } from './content';

export interface Service {
  id: string;
  title: string;
  icon: IconName;
  /** One or two sentences for cards. */
  summary: string;
  /** Longer copy for the services page. */
  description: string;
  points: Verifiable<string>[];
  inquiryLabel: string;
  /** Describes the photograph that should replace the placeholder. */
  imageBrief: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

/** Services mentioned in early concepts that the owner has not confirmed. */
export interface UnconfirmedServices {
  heading: string;
  description: string;
  items: PendingContent[];
}
