use leptos::{logging::log, prelude::*};

use crate::{domain::room::Room, pages::room::card::Card};

#[component]
pub fn Deck(room: Room) -> impl IntoView {
    let (selected_card, set_selected_card) = signal::<Option<String>>(None);
    let is_game_over = room.is_game_over;
    let cards = room.deck.cards.clone();

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
                                    on:click=move |_| set_selected_card(
                                        Some(card_for_click.clone()),
                                    )
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
