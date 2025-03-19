use leptos::prelude::*;

#[component]
pub fn NotFoundPage() -> impl IntoView {
    view! {
        <main class="grid min-h-full place-items-center bg-white dark:bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
            <div class="text-center">
                <p class="text-base font-semibold text-indigo-600 dark:text-indigo-400">404</p>
                <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                    Page not found
                </h1>
                <p class="mt-6 text-base leading-7 text-gray-600 dark:text-gray-300">
                    "Sorry, we couldn’t find the page you’re looking for."
                </p>
                <div class="mt-10 flex items-center justify-center gap-x-6">
                    <a
                        href="/"
                        class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                        Go back home
                    </a>
                    <a
                        href="https://github.com/INQTR/poker-planning"
                        class="text-sm font-semibold text-gray-900 dark:text-gray-300"
                    >
                        Report an issue
                    </a>
                </div>
            </div>
        </main>
    }
}
