use leptos::prelude::*;
use super::card::Card;

#[component]
pub fn Player(
    username: String,
    is_card_picked: bool,
    is_game_over: bool,
    card: Option<String>,
) -> impl IntoView {
    // Determine the symbol to display based on the player's state.
    let card_symbol = if is_card_picked {
        if let Some(card_value) = card {
            card_value
        } else {
            "✅".to_string()
        }
    } else if is_game_over {
        "😴".to_string()
    } else {
        "🤔".to_string()
    };

    view! {
        <div class="flex flex-col items-center" data-testid="player">
            <Card>{card_symbol}</Card>
            <span class="text-sm mb-1">{username}</span>
        </div>
    }
}