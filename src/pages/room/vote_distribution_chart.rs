use leptos::prelude::*;
use std::collections::HashMap;

use crate::domain::room::Room;

#[component]
pub fn VoteDistributionChart(room: Room) -> impl IntoView {
    let vote_count = {
        let mut count: HashMap<String, usize> = HashMap::new();
        for user_card in &room.game.table {
            if let Some(ref card) = user_card.card {
                if !card.is_empty() {
                    *count.entry(card.clone()).or_insert(0) += 1;
                }
            }
        }
        count
    };

    let total_votes = room.game.table.len() as f64;
    let max_votes = vote_count.values().max().cloned().unwrap_or(0);
    let agreement = if total_votes > 0.0 {
        (max_votes as f64 / total_votes) * 100.0
    } else {
        0.0
    };

    let average_vote = {
        let numeric_votes: Vec<f64> = room
            .game
            .table
            .iter()
            .filter_map(|user_card| {
                user_card
                    .card
                    .as_ref()
                    .and_then(|card| card.parse::<f64>().ok())
            })
            .collect();

        if numeric_votes.is_empty() {
            0.0
        } else {
            numeric_votes.iter().sum::<f64>() / numeric_votes.len() as f64
        }
    };

    let mut chart_data: Vec<(String, usize)> = vote_count.into_iter().collect();
    chart_data.sort_by(|a, b| a.0.cmp(&b.0));

    let max_bar_width = 200;

    view! {
        <div class="flex flex-col items-center justify-center p-4 bg-card rounded-lg shadow-md" data-testid="vote-distribution-chart">
            <h3 class="text-lg font-semibold mb-4">Vote Distribution</h3>

            <div class="w-full max-w-md mb-4">
                {chart_data.into_iter().map(|(card, votes)| {
                    let bar_width = if max_votes > 0 {
                        (votes as f64 / max_votes as f64 * max_bar_width as f64) as u32
                    } else {
                        0
                    };

                    view! {
                        <div class="mb-2">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-sm font-medium">{card}</span>
                                <span class="text-sm text-muted-foreground">{votes} {if votes == 1 { "vote" } else { "votes" }}</span>
                            </div>
                            <div class="w-full bg-muted rounded-md h-6 relative">
                                <div
                                    class="bg-primary h-full rounded-md transition-all duration-300"
                                    style=move || format!("width: {}px", bar_width)
                                />
                            </div>
                        </div>
                    }
                }).collect_view()}
            </div>

            <div class="flex flex-col items-center gap-2">
                <div class="text-center">
                    <div class="text-3xl font-bold">{format!("{:.1}", average_vote)}</div>
                    <div class="text-sm text-muted-foreground">average</div>
                </div>

                <div class="text-center">
                    <div class="text-2xl font-semibold">
                        {format!("{:.0}%", agreement)}
                        {if agreement > 95.0 { " 🎉" } else { "" }}
                    </div>
                    <div class="text-sm text-muted-foreground">agreement</div>
                </div>
            </div>
        </div>
    }
}
