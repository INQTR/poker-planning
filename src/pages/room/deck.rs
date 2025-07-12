use leptos::{logging::log, prelude::*, task::spawn_local};
use uuid::Uuid;

use crate::{domain::room::Room, pages::room::card::Card, server_fns::pick_card};

#[component]
pub fn Deck(room: Room, user_id: Uuid) -> impl IntoView {
    // Find the user's current selected card from the table
    let current_selection = room.game.table.iter()
        .find(|user_card| user_card.user_id == user_id)
        .and_then(|user_card| user_card.card.clone());
    
    let (selected_card, set_selected_card) = signal::<Option<String>>(current_selection);
    let is_game_over = room.is_game_over;
    let cards = room.deck.cards.clone();
    let room_id = room.id;

    Effect::new(move || {
        log!("selected_card: {:?}", selected_card());
    });

    view! {
        <div class="flex justify-between items-end">
            {move || {
                cards
                    .iter()
                    .map(|card| {
                        let card = card.clone();
                        let card_for_click = card.clone();
                        let card_for_selected_card = card.clone();
                        let is_card_picked = move || {
                            selected_card() == Some(card_for_selected_card.clone())
                        };
                        log!("is_card_picked: {:?}", is_card_picked());
                        let class = move || {
                            format!(
                                "transition-margin-bottom duration-100 {}",
                                if is_card_picked() { "mb-8" } else { "mb-0" },
                            )
                        };
                        view! {
                            <div class=class()>
                                <Card
                                    {..}
                                    on:click=move |_| {
                                        let card_to_pick = card_for_click.clone();
                                        set_selected_card(Some(card_for_click.clone()));
                                        spawn_local(async move {
                                            let _ = pick_card(user_id, room_id, card_to_pick).await;
                                        });
                                    }
                                    disabled=is_game_over
                                >
                                    <>{card}</>
                                </Card>
                            </div>
                        }
                    })
                    .collect_view()
            }}
        </div>
    }
}
