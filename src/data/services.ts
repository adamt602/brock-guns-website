import { business } from './business';
import { pending } from '@/types/content';
import type { ProcessStep, Service, UnconfirmedServices } from '@/types/service';

/** The two confirmed secondary services. Sales remain the main business. */
export const services: Service[] = [
  {
    id: 'gunsmithing',
    title: 'Gunsmithing',
    icon: 'compass',
    summary: 'Careful work with attention to detail. Describe what you would like done.',
    description:
      'Gunsmithing work handled with patience and attention to detail. Describe what you would like done and David will tell you how the shop can help.',
    points: [
      'Describe the work in your own words.',
      pending('CONFIRM WITH DAVID: the specific gunsmithing services offered'),
    ],
    inquiryLabel: 'Ask About Gunsmithing',
    imageBrief: 'Hands at the bench, fine tools, shallow focus',
  },
  {
    id: 'repairs',
    title: 'Repairs',
    icon: 'wrench',
    summary: 'Something not working the way it should? Explain what is happening.',
    description:
      'Something not working the way it should? Describe the problem and David will tell you what the next step looks like.',
    points: [
      'Have the make and model handy, and what it is doing.',
      pending('CONFIRM WITH DAVID: estimates, turnaround, and what can be repaired'),
    ],
    inquiryLabel: 'Ask About a Repair',
    imageBrief: 'Parts laid out in order on a bench mat',
  },
];

export const gettingStartedSteps: ProcessStep[] = [
  {
    title: 'Get in touch',
    description: `Call ${business.phone.display} or send a message from the contact page.`,
  },
  {
    title: 'Describe it',
    description: 'What you want done, or what is going wrong. Everyday language is fine.',
  },
  {
    title: 'Get a straight answer',
    description: 'David lets you know whether the shop can help and what happens next.',
  },
];

/** Rendered only while `site.showPendingContent` is true. */
export const unconfirmedServices: UnconfirmedServices = {
  heading: 'Other services, pending confirmation',
  description:
    'Mentioned in earlier brand concepts but not confirmed by David. Each stays off the live site until he approves it.',
  items: [
    pending('Firearm cleaning'),
    pending('Parts and accessories'),
    pending('Sight installation'),
    pending('FFL transfers'),
    pending('Restoration and maintenance'),
  ],
};
