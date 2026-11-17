import { business } from './business';
import { pending } from '@/types/content';

/** About page copy. */
export const aboutHero = {
  eyebrow: 'About',
  heading: 'Meet David Johnson',
  description:
    'Owner of Brock Guns and Repair LLC, a Texas firearm retailer that also offers gunsmithing and repairs, built around one idea: do things correctly.',
};

export const businessStory = {
  eyebrow: 'The business',
  heading: 'About Brock Guns and Repair',
  paragraphs: [
    'Brock Guns and Repair LLC is a Texas firearm retailer. Gunsmithing and repair services are offered as well. It is owned by David Johnson, and it is run the way a small shop should be: personally.',
    `There is no call center and no ticket queue. The number on the sign, ${business.phone.display}, reaches David.`,
  ],
  story: pending(
    'BUSINESS STORY: how and when the business started, where it is located, and who it serves. To be supplied by David. No history, dates, or credentials are shown until he confirms them.',
  ),
};

export const approach = {
  eyebrow: 'Our approach',
  heading: 'Listen first. Then do it right.',
  steps: [
    {
      title: 'Listen',
      description:
        'Every conversation starts with what you need, in your words. No jargon required.',
    },
    {
      title: 'Be straight',
      description: 'You get an honest answer about whether the shop can help and what to expect.',
    },
    {
      title: 'Do it correctly',
      description:
        'Careful work and attention to detail, with respect for you and for your property.',
    },
  ],
};

export const heritage = {
  eyebrow: 'Texas heritage',
  heading: 'Texas, plain and proud.',
  lede: 'The lettering on the original shop sign set the tone here: traditional, plainspoken, and made to last.',
  body: 'That lettering still marks the name and the big moments on this site. Everything else is set in clean modern type so it stays easy to read.',
  imageBrief: 'The original hand-lettered Brock Guns & Repair sign',
};

export const quality = {
  eyebrow: 'Commitment to quality',
  heading: 'If it is worth doing, it is worth doing right.',
  commitments: [
    { title: 'Reliability', description: 'Dependable service you can plan around.' },
    {
      title: 'Precision',
      description: 'Attention to the small details that make the difference.',
    },
    {
      title: 'Respect',
      description: 'For every customer, and for everything they bring through the door.',
    },
  ],
};
