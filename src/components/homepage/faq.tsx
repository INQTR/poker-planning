import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Planning Poker?",
    answer:
      "Planning Poker is an agile estimation technique where team members use cards to vote on the complexity of user stories. It helps teams reach consensus on effort estimates through discussion and collaboration, making sprint planning more accurate and engaging.",
  },
  {
    question: "How much does AgileKit cost?",
    answer:
      "AgileKit's core features are free with no limitations on team size or number of sessions. As an open-source project, we believe in making quality tools accessible to everyone. We may introduce optional paid features in the future, but the core planning poker functionality will always remain free.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account is required! Simply click 'Start New Game' and share the room link with your team. We designed it this way to remove barriers and get your team estimating as quickly as possible.",
  },
  {
    question: "How many people can join a planning session?",
    answer:
      "There's no limit on the number of participants in a planning session. Whether you have 5 or 500 team members, everyone can join and participate seamlessly.",
  },
  {
    question: "What voting scale does AgileKit use?",
    answer:
      "AgileKit uses the Fibonacci sequence (0, 1, 2, 3, 5, 8, 13, 21, ?) which is the industry standard for story point estimation. We're working on adding T-shirt sizes and custom scales in a future update.",
  },
  {
    question: "Can I use this tool offline or self-host it?",
    answer:
      "While the online version requires an internet connection, the entire codebase is open-source on GitHub. You can download and host your own instance for offline use or to meet specific security requirements.",
  },
  {
    question: "What browsers and devices are supported?",
    answer:
      "AgileKit works on all modern browsers (Chrome, Firefox, Safari, Edge) and is fully responsive on desktop, tablet, and mobile devices. No app installation required - it works directly in your browser.",
  },
  {
    question: "How does it compare to other planning poker tools?",
    answer:
      "Unlike other tools that charge monthly fees or limit core features, our essential planning poker functionality is free with no restrictions. Our tool is open-source, requires no registration, and includes real-time voting, Fibonacci estimation, and team collaboration.",
  },
  {
    question: "Can I contribute to the project?",
    answer:
      "Yes! We welcome contributions. Visit our GitHub repository to report bugs, suggest features, or submit pull requests. You can also star the project to show your support.",
  },
];

export function FAQ() {
  return (
    <div id="faq" className="bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
              FAQs
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Planning Poker FAQ
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Everything you need to know about planning poker and our tool
            </p>
          </div>
          <Accordion className="mt-10">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="border-gray-200 dark:border-zinc-800"
              >
                <AccordionTrigger className="text-base font-semibold leading-7 text-gray-900 dark:text-white hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-7 text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-16 text-center">
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              Still have questions?
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Learn more about our{" "}
              <Link
                href="/features"
                className="font-medium text-primary hover:text-primary/80"
              >
                features
              </Link>
              , see{" "}
              <Link
                href="/#how-it-works"
                className="font-medium text-primary hover:text-primary/80"
              >
                how it works
              </Link>
              , or check out our{" "}
              <a
                href="https://github.com/INQTR/poker-planning"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:text-primary/80"
              >
                GitHub repository
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
