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
  body: "AgileKit has transformed our sprint planning sessions. The real-time collaboration and intuitive interface have made our estimations 50% faster and much more accurate. The fact that the core features being free is just incredible.",
  author: {
    name: "Sarah Chen",
    handle: "sarahchen",
    imageUrl: "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80",
    company: "TechCorp",
  },
  rating: 5,
};

const testimonials: Testimonial[][][] = [
  [
    [
      {
        body: "Finally, a planning poker tool that doesn't require everyone to create accounts. We can start estimating in seconds, which is perfect for our fast-paced sprints.",
        author: { name: "Alex Rivera", handle: "alexrivera", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", company: "StartupHub" },
      },
    ],
    [
      {
        body: "We switched from a paid tool to AgileKit and haven't looked back. It has all the features we need without the monthly subscription fees.",
        author: { name: "Lindsay Wang", handle: "lindsaywang", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", company: "DevOps Inc" },
      },
    ],
  ],
  [
    [
      {
        body: "Open source means we can trust it and even contribute improvements. We've deployed our own instance for sensitive projects. The community is amazing!",
        author: { name: "Tom Anderson", handle: "tomanderson", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", company: "SecureBank" },
      },
    ],
    [
      {
        body: "We use it for everything from sprint planning to quarterly roadmap estimation. The simplicity and ease of use make it our go-to estimation tool.",
        author: { name: "David Kim", handle: "davidkim", imageUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", company: "ProductCo" },
      },
    ],
  ],
];

export function Testimonials() {
  return (
    <section className="bg-gray-50/50 dark:bg-zinc-900/10 py-24 sm:py-32">
      <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">
            Testimonials
          </h2>
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1]">
            Loved by agile teams.
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="bg-white dark:bg-black border border-gray-200/50 dark:border-zinc-800/50 rounded-3xl p-8 sm:p-12">
            <div className="flex gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.2] mb-10">
              &ldquo;{featuredTestimonial.body}&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
              <Image alt={featuredTestimonial.author.name} src={featuredTestimonial.author.imageUrl} width={56} height={56} className="rounded-full" />
              <div>
                <p className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">{featuredTestimonial.author.name}</p>
                <p className="text-base text-gray-500">{featuredTestimonial.author.company}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {testimonials.map((column, colIdx) => (
              <div key={colIdx} className="space-y-6">
                {column.map((row, rowIdx) => (
                  <div key={rowIdx} className="space-y-6">
                    {row.map((testimonial) => (
                      <div key={testimonial.author.handle} className="bg-white dark:bg-black rounded-3xl p-8 border border-gray-200/50 dark:border-zinc-800/50">
                        <blockquote className="text-base text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-8">
                          &ldquo;{testimonial.body}&rdquo;
                        </blockquote>
                        <div className="flex items-center gap-4">
                          <Image alt={testimonial.author.name} src={testimonial.author.imageUrl} width={40} height={40} className="rounded-full" />
                          <div>
                            <p className="text-base font-bold tracking-tight text-gray-900 dark:text-white">{testimonial.author.name}</p>
                            <p className="text-sm text-gray-500">{testimonial.author.company}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
