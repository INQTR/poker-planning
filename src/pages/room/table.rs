use leptos::{prelude::*, task::spawn_local};

use crate::{
    components::{Button, ButtonSize},
    domain::room::Room,
    server_fns::show_cards,
};

#[component]
pub fn Table(room: Room) -> impl IntoView {
    view! {
        <div class="flex justify-center items-center w-[25vw] max-w-72 min-w-48 h-36 border border-primary-500 rounded-full">
            <Button
                on_click=move |_| {
                    spawn_local(async move {
                        show_cards(room.id).await;
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
