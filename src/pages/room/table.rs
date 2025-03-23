use leptos::{logging::log, prelude::*, task::spawn_local};

use crate::{
    components::{Button, ButtonSize},
    server_fns::get_storage,
};

#[component]
pub fn Table() -> impl IntoView {
    view! {
        <div class="flex justify-center items-center w-[25vw] max-w-72 min-w-48 h-36 border border-primary-500 rounded-full">
            <Button
                on_click=move |_| {
                    spawn_local(async move {
                        let storage = get_storage().await;
                        log!("Storage: {:?}", storage);
                    });
                }
                class="w-36"
                size=ButtonSize::Lg
            >
                Start New Game
            </Button>
        </div>
    }
}
