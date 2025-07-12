use crate::domain::room::Room;
use crate::domain::game::UserCard;
use crate::pages::room::table::Table;
use crate::pages::room::player::Player;
use leptos::logging::log;
use leptos::prelude::*;
use uuid::Uuid;

// Utility function to get picked user card
fn get_picked_user_card(user_id: Uuid, table: &[UserCard]) -> Option<UserCard> {
    table.iter().find(|card| card.user_id == user_id).cloned()
}

#[derive(Clone, Copy, Debug, PartialEq)]
struct Position {
    x: f64,
    y: f64,
}

#[component]
pub fn Room(room: Room) -> impl IntoView {
    log!("Room: {:?}", room);
    
    // Clone room data for use in closures
    let room_for_positions = room.clone();
    let room_for_render = room.clone();
    
    // Table dimensions tracking
    #[derive(Clone, Copy, Debug, PartialEq)]
    struct TableRect {
        width: f64,
        height: f64,
    }
    
    let table_rect = RwSignal::new(None::<TableRect>);
    
    // Create NodeRef for table element
    let table_ref = NodeRef::<leptos::html::Div>::new();
    
    // Update table rect on mount and window resize
    let update_table_rect = move || {
        if let Some(element) = table_ref.get() {
            let rect = element.get_bounding_client_rect();
            table_rect.set(Some(TableRect {
                width: rect.width(),
                height: rect.height(),
            }));
        }
    };
    
    // Set up resize listener
    use leptos::prelude::{window_event_listener, on_cleanup};
    use leptos::ev;
    
    // Initial measurement
    Effect::new(move |_| {
        update_table_rect();
    });
    
    // Listen for window resize with cleanup
    let handle = window_event_listener(ev::resize, move |_| {
        update_table_rect();
    });
    
    // The handle will be dropped when the component is disposed
    on_cleanup(move || {
        drop(handle);
    });
    
    // Compute player positions
    let player_positions = Memo::new(move |_| {
        let rect = table_rect.get();
        if rect.is_none() {
            return vec![];
        }
        
        let rect = rect.unwrap();
        let total_players = room_for_positions.users.len();
        let width = rect.width;
        let height = rect.height;
        let padding = 80.0;
        let card_width = 52.0;
        let card_height = 80.0;
        let card_margin = 20.0;
        
        let compute_side_positions = |side: &str, count: usize| -> Vec<Position> {
            let mut positions = vec![];
            let available_length = if side == "top" || side == "bottom" {
                width
            } else {
                height
            };
            let min_gap = if side == "top" || side == "bottom" {
                card_width + card_margin
            } else {
                card_height + card_margin
            };
            
            let mut coordinates = vec![];
            if count == 0 {
                return positions;
            }
            
            let default_spacing = available_length / (count as f64 + 1.0);
            if default_spacing < min_gap {
                let total_required = min_gap * (count as f64 - 1.0);
                let start = (available_length - total_required) / 2.0;
                for j in 0..count {
                    coordinates.push(start + j as f64 * min_gap);
                }
            } else {
                for j in 0..count {
                    coordinates.push((j as f64 + 1.0) * default_spacing);
                }
            }
            
            for coord in coordinates {
                let (x, y) = match side {
                    "top" => (coord, -padding),
                    "bottom" => (coord, height + padding),
                    "left" => (-padding, coord),
                    "right" => (width + padding, coord),
                    _ => (0.0, 0.0),
                };
                positions.push(Position { x, y });
            }
            positions
        };
        
        let mut positions = vec![];
        
        if total_players < 4 {
            let sides = ["top", "right", "bottom", "left"];
            for i in 0..total_players {
                let side = sides[i];
                let pos = match side {
                    "top" => Position { x: width / 2.0, y: -padding },
                    "right" => Position { x: width + padding, y: height / 2.0 },
                    "bottom" => Position { x: width / 2.0, y: height + padding },
                    "left" => Position { x: -padding, y: height / 2.0 },
                    _ => Position { x: 0.0, y: 0.0 },
                };
                positions.push(pos);
            }
            return positions;
        }
        
        // For 4 or more players, distribute evenly across sides
        let base = total_players / 4;
        let remainder = total_players % 4;
        let mut side_counts = [
            ("top", base),
            ("right", base),
            ("bottom", base),
            ("left", base),
        ];
        
        let extra_order = if width >= height {
            ["top", "bottom", "right", "left"]
        } else {
            ["right", "left", "top", "bottom"]
        };
        
        for i in 0..remainder {
            let side_name = extra_order[i];
            for j in 0..4 {
                if side_counts[j].0 == side_name {
                    side_counts[j].1 += 1;
                    break;
                }
            }
        }
        
        for (side, count) in side_counts {
            positions.extend(compute_side_positions(side, count));
        }
        
        positions
    });
    
    view! {
        <div class="flex flex-col items-center justify-center w-full h-[calc(100vh-120px)]">
            <div class="relative">
                <div node_ref=table_ref>
                    <Table room=room.clone() />
                </div>
                {move || {
                    let positions = player_positions.get();
                    room_for_render.users.iter().enumerate().map(|(index, user)| {
                        if let Some(position) = positions.get(index) {
                            let picked_card = get_picked_user_card(user.id, &room_for_render.game.table);
                            let is_card_picked = picked_card.is_some();
                            let card = picked_card.and_then(|c| c.card.map(|card| card.to_string()));
                            
                            view! {
                                <div
                                    class="absolute transform -translate-x-1/2 -translate-y-1/2"
                                    style=format!("left: {}px; top: {}px; z-index: 10;", position.x, position.y)
                                >
                                    <Player
                                        username=user.username.clone()
                                        is_card_picked=is_card_picked
                                        is_game_over=room_for_render.is_game_over
                                        card=card
                                    />
                                </div>
                            }.into_any()
                        } else {
                            view! { <div></div> }.into_any()
                        }
                    }).collect::<Vec<_>>()
                }}
            </div>
        </div>
    }
}
