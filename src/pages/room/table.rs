use leptos::{prelude::*, task::spawn_local};

use crate::{
    components::{Button, ButtonSize},
    domain::room::Room,
    server_fns::{reset_game, show_cards},
};

#[component]
pub fn Table(room: Room) -> impl IntoView {
    let is_cards_picked = !room.game.table.is_empty();
    let is_game_over = room.is_game_over;
    let room_id = room.id;

    // Loading states for buttons
    let show_cards_loading = RwSignal::new(false);
    let reset_game_loading = RwSignal::new(false);

    let handle_show_cards = move |_| {
        show_cards_loading.set(true);
        spawn_local(async move {
            match show_cards(room_id).await {
                Ok(_) => {}
                Err(e) => {
                    leptos::logging::error!("Error showing cards: {:?}", e);
                }
            }
            show_cards_loading.set(false);
        });
    };

    let handle_reset_game = move |_| {
        reset_game_loading.set(true);
        spawn_local(async move {
            match reset_game(room_id).await {
                Ok(_) => {}
                Err(e) => {
                    leptos::logging::error!("Error resetting game: {:?}", e);
                }
            }
            reset_game_loading.set(false);
        });
    };

    view! {
        <div class="flex justify-center items-center w-[25vw] max-w-72 min-w-48 h-36 border border-primary-500 rounded-full">
            {if is_cards_picked {
                if is_game_over {
                    view! {
                        <Button
                            on_click=handle_reset_game
                            disabled={reset_game_loading.get()}
                            class="w-36"
                            size=ButtonSize::Lg
                        >
                            {move || if reset_game_loading.get() {
                                view! {
                                    <svg
                                        class="mr-2 h-4 w-4 animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            class="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            stroke-width="4"
                                        ></circle>
                                        <path
                                            class="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    "Start New Game"
                                }.into_any()
                            } else {
                                view! { "Start New Game" }.into_any()
                            }}
                        </Button>
                    }.into_any()
                } else {
                    view! {
                        <Button
                            on_click=handle_show_cards
                            disabled={show_cards_loading.get()}
                            size=ButtonSize::Lg
                        >
                            {move || if show_cards_loading.get() {
                                view! {
                                    <svg
                                        class="mr-2 h-4 w-4 animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            class="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            stroke-width="4"
                                        ></circle>
                                        <path
                                            class="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    "Reveal cards"
                                }.into_any()
                            } else {
                                view! { "Reveal cards" }.into_any()
                            }}
                        </Button>
                    }.into_any()
                }
            } else {
                view! {
                    <span>"Just start picking cards!"</span>
                }.into_any()
            }}
        </div>
    }
}
