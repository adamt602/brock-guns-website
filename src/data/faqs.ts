import { routes } from '@/config/routes';
import { business } from './business';
import type { FaqGroup } from '@/types/faq';

const text = (value: string) => ({ type: 'text', text: value }) as const;
const todo = (note: string) => ({ type: 'pending', note }) as const;

/**
 * FAQ content. Questions whose answer is entirely pending are hidden when
 * `site.showPendingContent` is false.
 */
export const faqGroups: FaqGroup[] = [
  {
    id: 'contacting',
    title: 'Contacting the business',
    items: [
      {
        question: 'How do I get in touch?',
        open: true,
        answer: [
          text(`Call ${business.owner.name} at `),
          { type: 'phone' },
          text(', or send a message through the '),
          { type: 'link', text: 'contact page', href: routes.contact },
          text('.'),
        ],
      },
      {
        question: 'Who will I be talking to?',
        answer: [text(`${business.owner.name}, the owner of ${business.legalName}.`)],
      },
      {
        question: 'Where are you located, and when are you open?',
        answer: [
          todo('PLACEHOLDER: street address, city, and business hours to be confirmed with David.'),
        ],
      },
    ],
  },
  {
    id: 'services',
    title: 'Service inquiries',
    items: [
      {
        question: 'What services do you offer?',
        answer: [
          text(
            'Brock Guns and Repair is first a firearm retailer. Gunsmithing and repair services are also offered. If you are not sure whether the shop can help, call and ask.',
          ),
        ],
      },
      {
        question: 'Do I need to know exactly what I need before I call?',
        answer: [
          text('No. Describe what you are looking for or what is happening in your own words.'),
        ],
      },
    ],
  },
  {
    id: 'repairs',
    title: 'Repairs',
    items: [
      {
        question: 'What information should I have ready?',
        answer: [
          text('The make and model if you know them, and a description of the problem. '),
          todo('CONFIRM WITH DAVID: anything else he wants customers to have ready.'),
        ],
      },
      {
        question: 'How long does a repair take, and what does it cost?',
        answer: [
          todo(
            'PLACEHOLDER: turnaround and estimate policy to be confirmed with David. No times or prices are published until then.',
          ),
        ],
      },
    ],
  },
  {
    id: 'appointments',
    title: 'Appointments',
    items: [
      {
        question: 'Do I need an appointment?',
        answer: [
          todo('PLACEHOLDER: walk-in or by-appointment policy to be confirmed with David.'),
          text(' In the meantime, calling ahead is the safest bet.'),
        ],
      },
    ],
  },
  {
    id: 'availability',
    title: 'Product availability',
    items: [
      {
        question: 'Can I buy through the website?',
        answer: [
          text('No. The website does not process purchases. Contact David to ask about an item.'),
        ],
      },
      {
        question: 'Is the online inventory live?',
        answer: [
          todo('PLACEHOLDER: to be written once the inventory is connected to verified inventory.'),
        ],
      },
    ],
  },
  {
    id: 'policies',
    title: 'Business policies',
    items: [
      {
        question: 'What forms of payment do you accept?',
        answer: [todo('PLACEHOLDER: payment methods to be confirmed with David.')],
      },
      {
        question: 'Do you handle transfers?',
        answer: [
          todo(
            'PLACEHOLDER: transfer services are unconfirmed. This question is hidden on the live site until David confirms the service and its requirements.',
          ),
        ],
      },
    ],
  },
];
