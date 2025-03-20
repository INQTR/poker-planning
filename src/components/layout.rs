use leptos::prelude::*;

use crate::components::Header;

#[component]
pub fn Layout(children: Children) -> impl IntoView {
    view! {
        <div>
            <Header />
            <main class="flex-grow h-[calc(100%-56px)]">{children()}</main>
        </div>
    }
}
