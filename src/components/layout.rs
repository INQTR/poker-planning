use leptos::prelude::*;

use crate::components::Header;

#[component]
pub fn Layout(children: Children) -> impl IntoView {
    view! {
        <>
            <Header />
            <main class="flex-grow h-[calc(100%-56px)]">{children()}</main>
        </>
    }
    .into_any()
}
