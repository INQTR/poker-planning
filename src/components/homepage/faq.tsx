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
    <section id="faq" className="bg-gray-50/50 dark:bg-zinc-900/10 py-24 sm:py-32">
      <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-5">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">
              FAQ
            </h2>
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1] mb-6">
              Common<br />questions.
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light mb-8">
              Everything you need to know about AgileKit, how it works, and our commitment to keeping it free.
            </p>
            <div className="p-8 bg-white dark:bg-black rounded-3xl border border-gray-200/50 dark:border-zinc-800/50">
              <p className="text-base text-gray-900 dark:text-gray-100 font-medium mb-2">Still have questions?</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Reach out to us on GitHub or check our detailed documentation.</p>
              <a href="https://github.com/INQTR/poker-planning" target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 bg-gray-100 dark:bg-zinc-800 px-6 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors rounded-xl">
                View GitHub
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-black rounded-3xl p-4 sm:p-8 border border-gray-200/50 dark:border-zinc-800/50">
              <Accordion className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-b border-gray-100 dark:border-zinc-900 last:border-0 px-2 sm:px-4"
                  >
                    <AccordionTrigger className="text-left text-lg font-bold tracking-tight text-gray-900 dark:text-white hover:no-underline py-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-gray-600 dark:text-gray-400 font-light leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
