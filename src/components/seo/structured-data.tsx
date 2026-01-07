const baseUrl = "https://agilekit.app";

export function WebApplicationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AgileKit Planning Poker",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
    },
    description:
      "Free online planning poker tool for agile teams. Real-time collaboration, no registration required.",
    url: baseUrl,
    author: {
      "@type": "Organization",
      name: "AgileKit",
      url: "https://github.com/INQTR/poker-planning",
    },
    screenshot: `${baseUrl}/og-image.png`,
    featureList: [
      "Real-time voting",
      "No registration required",
      "Unlimited team members",
      "Fibonacci scale for story point estimation",
      "Results analytics with average, median, and consensus",
      "Synchronized timer",
      "Whiteboard canvas interface",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AgileKit",
    url: baseUrl,
    logo: `${baseUrl}/logo.svg`,
    sameAs: ["https://github.com/INQTR/poker-planning"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

const faqData = [
  {
    question: "What is Planning Poker?",
    answer:
      "Planning Poker is an agile estimation technique where team members use cards to vote on the complexity of user stories. It helps teams reach consensus on effort estimates through discussion and collaboration, making sprint planning more accurate and engaging.",
  },
  {
    question: "How much does AgileKit cost?",
    answer:
      "AgileKit is completely free forever. There are no hidden costs, premium tiers, or limitations on team size or number of sessions. As an open-source project, we believe in making quality tools accessible to everyone.",
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
      "Unlike other tools that charge monthly fees or limit features, we offer everything for free with no restrictions. Our tool is open-source, requires no registration, and includes all features like real-time voting, multiple card sets, and team collaboration.",
  },
  {
    question: "Can I contribute to the project?",
    answer:
      "Yes! We welcome contributions. Visit our GitHub repository to report bugs, suggest features, or submit pull requests. You can also star the project to show your support.",
  },
];

export function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

const howToSteps = [
  {
    name: "Create a Room",
    text: "Start a new planning session with one click. No registration required.",
  },
  {
    name: "Invite Your Team",
    text: "Share the room URL. Team members join instantly from any device.",
  },
  {
    name: "Vote on Stories",
    text: "Everyone votes simultaneously. Cards stay hidden until revealed.",
  },
  {
    name: "Reach Consensus",
    text: "Reveal votes, discuss differences, and align on story points.",
  },
];

export function HowToSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Run a Planning Poker Session",
    description:
      "Start free online planning poker sessions with your Scrum team in 4 easy steps. No registration required.",
    totalTime: "PT5M",
    step: howToSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BlogPostingSchemaProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
  wordCount?: number;
}

export function BlogPostingSchema({
  title,
  description,
  datePublished,
  dateModified,
  slug,
  wordCount,
}: BlogPostingSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: "AgileKit",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "AgileKit",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${slug}`,
    },
    image: `${baseUrl}/blog/${slug}/opengraph-image`,
    ...(wordCount && { wordCount }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
