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
    question: "How much does PokerPlanning.org cost?",
    answer:
      "PokerPlanning.org is completely free forever. There are no hidden costs, premium tiers, or limitations on team size or number of sessions. As an open-source project, we believe in making quality tools accessible to everyone.",
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
    question: "Can I customize the voting cards?",
    answer:
      "Yes! You can choose from popular card sets like Fibonacci (1, 2, 3, 5, 8...), T-shirt sizes (XS, S, M, L, XL), or create custom values that match your team's estimation scale.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We don't store any of your planning data on our servers. Session data exists only in your browser's memory and is cleared when you close the room. We also don't track or collect any personal information.",
  },
  {
    question: "Can I use this tool offline or self-host it?",
    answer:
      "While the online version requires an internet connection, the entire codebase is open-source on GitHub. You can download and host your own instance for offline use or to meet specific security requirements.",
  },
  {
    question: "What browsers and devices are supported?",
    answer:
      "PokerPlanning.org works on all modern browsers (Chrome, Firefox, Safari, Edge) and is fully responsive on desktop, tablet, and mobile devices. No app installation required - it works directly in your browser.",
  },
  {
    question: "How does it compare to other planning poker tools?",
    answer:
      "Unlike other tools that charge monthly fees or limit features, we offer everything for free with no restrictions. Our tool is open-source, requires no registration, and includes all features like real-time voting, multiple card sets, and team collaboration.",
  },
  {
    question: "Can I contribute to the project?",
    answer:
      "Yes! We welcome contributions. Visit our GitHub repository to report bugs, suggest features, or submit pull requests. You can also star the project to show your support.",
  },
];

export function FAQ() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
              FAQs
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Everything you need to know about planning poker and our tool
            </p>
          </div>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="border-gray-200 dark:border-gray-700"
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
              Check out our{" "}
              <a
                href="https://github.com/INQTR/poker-planning"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary-700 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
              >
                GitHub repository
              </a>{" "}
              or open an issue for support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
