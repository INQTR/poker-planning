use leptos::prelude::*;

use crate::components::{Button, ButtonVariant};

#[component]
pub fn Card(children: Children) -> impl IntoView {
    view! {
        <Button
            class="h-20 min-w-[52px] text-xl py-6 px-3 border-2 leading-normal"
            variant=ButtonVariant::Outline
        >
            {children()}
        </Button>
    }
}
