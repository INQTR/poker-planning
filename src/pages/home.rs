use leptos::prelude::*;

use crate::components::{Button, ButtonSize, ButtonVariant};

/// Renders the home page of your application.
#[component]
pub fn HomePage() -> impl IntoView {
    view! {
    <div class="bg-white dark:bg-gray-900">
        //   <Banner />
          <header class="relative z-50">
            <nav
              aria-label="Global"
              class="flex items-center justify-between p-6 lg:px-8"
            >
              <div class="flex lg:flex-1">
                <a href="/" class="-m-1.5 p-1.5 flex items-center">
                  <img
                    src="/logo.svg"
                    alt="PokerPlanning.org Logo"
                    class="h-8 w-8 mr-2"
                  />
                  <span class="sr-only">Planning poker / Scrum Poker</span>
                  <span class="text-2xl font-bold">Planning poker</span>
                </a>
              </div>
              <div class="flex lg:flex-1 justify-end">
                // <ModeToggle />
              </div>
            </nav>
          </header>

          <div class="relative isolate px-6 pt-14 lg:px-8">
            <div
              aria-hidden="true"
              class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
              <div
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%);"
                class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              />
            </div>
            <div class="mx-auto max-w-4xl py-32 sm:py-38 lg:py-46">
              <div class="text-center">
                <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                  Collaborate and Estimate Faster with Planning Poker
                </h1>
                <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  PokerPlanning.org offers an open-source, intuitive platform for
                  Agile development teams to collaboratively estimate story points
                  online. Perfect for Agile workflows, our tool makes
                  consensus-based estimation simple, fun, and effective.
                </p>
                <div class="mt-10 flex items-center justify-center gap-x-10">
                  <Button
                    size=ButtonSize::Lg
                    class="h-12"
                    variant=ButtonVariant::Secondary
                    // TODO: Implement loading state
                    // disabled={loading}
                    on_click=move |_| {
                        // TODO: Implement onCreateRoom
                        // *onCreateRoom()
                    }
                  >
                    Start New Game
                  </Button>
                  <a
                    href="https://github.com/INQTR/poker-planning"
                    class="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300"
                  >
                    Code on GitHub <span aria-hidden="true">"→"</span>
                  </a>
                </div>
              </div>
            </div>
            <div
              aria-hidden="true"
              class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            >
              <div
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%);"
                class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              />
            </div>
          </div>
        //   <FeatureSections />
        //   <Footer />
        </div>
        }
}
