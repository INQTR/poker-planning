use leptos::prelude::*;

use crate::components::Header;

#[component]
pub fn Layout(children: Children) -> impl IntoView {
    view! {
        <ErrorBoundary fallback=|errors| {
            view! {
                <div class="error">
                    <p>"Not a number! Errors: "</p>
                    // we can render a list of errors
                    // as strings, if we'd like
                    <ul>
                        {move || {
                            errors
                                .get()
                                .into_iter()
                                .map(|(_, e)| view! { <li>{e.to_string()}</li> })
                                .collect::<Vec<_>>()
                        }}
                    </ul>
                </div>
            }
        }>
            <Suspense fallback=move || view! { <p>"Loading..."</p> }>
                <Header />
                <main class="flex-grow h-[calc(100%-56px)]">{children()}</main>
            </Suspense>
        </ErrorBoundary>
    }
    .into_any()
}
