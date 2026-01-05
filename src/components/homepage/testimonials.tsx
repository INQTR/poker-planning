import { Star } from "lucide-react";
import Image from "next/image";

interface Author {
  name: string;
  handle: string;
  imageUrl: string;
  company?: string;
}

interface Testimonial {
  body: string;
  author: Author;
  rating?: number;
}

const featuredTestimonial: Testimonial = {
  body: "AgileKit has transformed our sprint planning sessions. The real-time collaboration and intuitive interface have made our estimations 50% faster and much more accurate. The fact that it's completely free is just incredible.",
  author: {
    name: "Sarah Chen",
    handle: "sarahchen",
    imageUrl:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80",
    company: "TechCorp",
  },
  rating: 5,
};

// TODO: we need to get real testimonials from real users
const testimonials: Testimonial[][][] = [
  [
    [
      {
        body: "Finally, a planning poker tool that doesn't require everyone to create accounts. We can start estimating in seconds, which is perfect for our fast-paced sprints.",
        author: {
          name: "Alex Rivera",
          handle: "alexrivera",
          imageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          company: "StartupHub",
        },
      },
      {
        body: "The new Canvas room feature is a game-changer. Being able to arrange team members visually on an infinite canvas makes our remote planning sessions feel more collaborative.",
        author: {
          name: "Michael Foster",
          handle: "michaelfoster",
          imageUrl:
            "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          company: "DesignStudio",
        },
      },
      {
        body: "As a Scrum Master, I love how easy it is to facilitate sessions. The reveal animation and voting patterns help identify when we need more discussion. Truly well thought out.",
        author: {
          name: "Priya Patel",
          handle: "priyapatel",
          imageUrl:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          company: "AgileCo",
        },
      },
    ],
    [
      {
        body: "We switched from a paid tool to AgileKit and haven't looked back. It has all the features we need without the monthly subscription fees.",
        author: {
          name: "Lindsay Wang",
          handle: "lindsaywang",
          imageUrl:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          company: "DevOps Inc",
        },
      },
      {
        body: "The mobile experience is fantastic. Team members can join from anywhere, making it perfect for our distributed team across different time zones.",
        author: {
          name: "James Wilson",
          handle: "jameswilson",
          imageUrl:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          company: "GlobalTech",
        },
      },
    ],
  ],
  [
    [
      {
        body: "Open source means we can trust it and even contribute improvements. We've deployed our own instance for sensitive projects. The community is amazing!",
        author: {
          name: "Tom Anderson",
          handle: "tomanderson",
          imageUrl:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          company: "SecureBank",
        },
      },
      {
        body: "The simplicity is its strength. No feature bloat, just pure planning poker functionality that works flawlessly every time.",
        author: {
          name: "Emma Thompson",
          handle: "emmathompson",
          imageUrl:
            "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          company: "CleanCode",
        },
      },
    ],
    [
      {
        body: "We use it for everything from sprint planning to quarterly roadmap estimation. The simplicity and ease of use make it our go-to estimation tool.",
        author: {
          name: "David Kim",
          handle: "davidkim",
          imageUrl:
            "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          company: "ProductCo",
        },
      },
      {
        body: "The real-time sync is incredibly smooth. Even with team members on different continents, we never experience lag or connection issues.",
        author: {
          name: "Maria Garcia",
          handle: "mariagarcia",
          imageUrl:
            "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          company: "WebFlow",
        },
      },
      {
        body: "Training new team members on agile estimation is so much easier with this tool. The interface is intuitive and the process is transparent for everyone.",
        author: {
          name: "Emily Zhang",
          handle: "emilyzhang",
          imageUrl:
            "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          company: "EduTech",
        },
      },
    ],
  ],
];

export function Testimonials() {
  return (
    <div className="relative isolate bg-white dark:bg-gray-900 py-24 sm:py-32 lg:py-40">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
      >
        <div
          className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-primary to-purple-600"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-32 opacity-25 blur-3xl sm:pt-40 xl:justify-end"
      >
        <div
          className="ml-[-22rem] aspect-[1313/771] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr from-primary to-purple-600 xl:ml-0 xl:mr-[calc(50%-12rem)]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Testimonials
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-balance text-gray-900 dark:text-white sm:text-5xl">
            Loved by agile teams worldwide
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 dark:text-gray-100 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
          <figure className="rounded-2xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-100/10 sm:col-span-2 xl:col-start-2 xl:row-end-1">
            <blockquote className="p-6 text-lg font-semibold tracking-tight text-gray-900 dark:text-white sm:p-12 sm:text-xl sm:leading-8">
              <p>{`"${featuredTestimonial.body}"`}</p>
            </blockquote>
            <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-4 border-t border-gray-900/10 dark:border-gray-100/10 px-6 py-4 sm:flex-nowrap">
              <Image
                alt={featuredTestimonial.author.name}
                src={featuredTestimonial.author.imageUrl}
                width={40}
                height={40}
                className="h-10 w-10 flex-none rounded-full bg-gray-50"
              />
              <div className="flex-auto">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {featuredTestimonial.author.name}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{`@${featuredTestimonial.author.handle}`}</div>
              </div>
              {featuredTestimonial.author.company && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              )}
            </figcaption>
          </figure>
          {testimonials.map((columnGroup, columnGroupIdx) => (
            <div
              key={columnGroupIdx}
              className="space-y-8 xl:contents xl:space-y-0"
            >
              {columnGroup.map((column, columnIdx) => (
                <div
                  key={columnIdx}
                  className={`${
                    (columnGroupIdx === 0 && columnIdx === 0) ||
                    (columnGroupIdx === testimonials.length - 1 &&
                      columnIdx === columnGroup.length - 1)
                      ? "xl:row-span-2"
                      : "xl:row-start-1"
                  } space-y-8`}
                >
                  {column.map((testimonial) => (
                    <figure
                      key={testimonial.author.handle}
                      className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-100/10"
                    >
                      <blockquote className="text-gray-900 dark:text-gray-100">
                        <p>{`"${testimonial.body}"`}</p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <Image
                          alt={testimonial.author.name}
                          src={testimonial.author.imageUrl}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full bg-gray-50"
                        />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {testimonial.author.name}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">{`@${testimonial.author.handle}`}</div>
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
