use leptos::prelude::*;

#[component]
pub fn FeatureSections() -> impl IntoView {
    view! {
        <div class="overflow-hidden bg-white dark:bg-gray-900 py-24 sm:py-32">
            <div class="mx-auto max-w-7xl px-6 lg:px-8">
                <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                    <div class="lg:pr-8 lg:pt-4">
                        <div class="lg:max-w-lg">
                            <h2 class="text-base font-semibold leading-7 text-primary dark:text-primary/90">
                                "Plan Smarter"
                            </h2>
                            <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                "Elevate Your Scrum Planning"
                            </p>
                            <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                "Experience a more efficient and accurate planning process with our Scrum Poker tool. Designed to enhance team collaboration and improve estimation accuracy."
                            </p>
                            <dl class="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 dark:text-gray-300 lg:max-w-none">
                                <div class="relative pl-9">
                                    <dt class="inline font-semibold text-gray-900 dark:text-white">
                                        <div class="absolute left-1 top-1 text-primary dark:text-primary/90">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="lucide lucide-users absolute left-1 top-1 h-5 w-5 text-primary dark:text-primary/90"
                                                aria-hidden="true"
                                            >
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="9" cy="7" r="4"></circle>
                                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                            </svg>
                                        </div>
                                        "Real-time Collaboration"
                                    </dt>
                                    " "
                                    <dd class="inline">
                                        "Collaborate with your team in real-time, no matter where they are. Our tool ensures seamless communication during planning sessions."
                                    </dd>
                                </div>
                                <div class="relative pl-9">
                                    <dt class="inline font-semibold text-gray-900 dark:text-white">
                                        <div class="absolute left-1 top-1 text-primary dark:text-primary/90">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="lucide lucide-clock absolute left-1 top-1 h-5 w-5 text-primary dark:text-primary/90"
                                                aria-hidden="true"
                                            >
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg>
                                        </div>
                                        "Time-saving Efficiency"
                                    </dt>
                                    " "
                                    <dd class="inline">
                                        "Streamline your planning process and save valuable time. Our intuitive interface allows for quick setup and easy estimation rounds."
                                    </dd>
                                </div>
                                <div class="relative pl-9">
                                    <dt class="inline font-semibold text-gray-900 dark:text-white">
                                        <div class="absolute left-1 top-1 text-primary dark:text-primary/90">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="lucide lucide-chart-bar absolute left-1 top-1 h-5 w-5 text-primary dark:text-primary/90"
                                                aria-hidden="true"
                                            >
                                                <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                                                <path d="M7 16h8"></path>
                                                <path d="M7 11h12"></path>
                                                <path d="M7 6h3"></path>
                                            </svg>
                                        </div>
                                        "Improved Accuracy"
                                    </dt>
                                    " "
                                    <dd class="inline">
                                        "Enhance the accuracy of your estimates with our structured approach. Visualize and analyze estimation data to refine your planning process."
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                    <img
                        alt="scrum poker screenshot"
                        src="/poker-planning-screenshot.png"
                        width="2432"
                        height="1442"
                        class="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
                    />
                </div>
            </div>
        </div>
    }
}
