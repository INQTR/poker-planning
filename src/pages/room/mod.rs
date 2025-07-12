use deck::Deck;
use join_room_dialog::JoinRoomDialog;
use leptos::{logging::log, prelude::*, task::spawn_local};
use leptos_router::hooks::use_params;
use leptos_router::params::Params;
use room::Room;
use uuid::Uuid;

use crate::{
    components::{AuthContext, Layout, use_auth},
    server_fns::{join_room, subscribe_to_rooms},
};

mod card;
mod deck;
mod join_room_dialog;
mod player;
mod room;
mod table;
mod vote_distribution_chart;

pub use card::Card;

#[derive(Debug, Clone, PartialEq, Eq, Hash, Params)]
struct RoomParams {
    room_id: Uuid,
}

#[component]
pub fn RoomPage() -> impl IntoView {
    // For SSR, just return a loading state
    #[cfg(not(feature = "hydrate"))]
    {
        return view! {
            <Layout room=None>
                <div class="flex items-center justify-center h-[calc(100vh-120px)]">
                    <div class="text-center">
                        <p class="text-gray-500">"Loading room..."</p>
                    </div>
                </div>
            </Layout>
        };
    }
    
    // Client-side only implementation
    #[cfg(feature = "hydrate")]
    {
        RoomPageClient()
    }
}

#[cfg(feature = "hydrate")]
#[component]
fn RoomPageClient() -> impl IntoView {
    let params = use_params::<RoomParams>();
    let room_id = move || {
        params
            .get()
            .map(|params| params.room_id)
            .unwrap_or_default()
    };
    // Get the initial room_id value for use in non-reactive contexts
    let room_id_value = params
        .get_untracked()
        .map(|params| params.room_id)
        .unwrap_or_default();
    let AuthContext { user, .. } = use_auth();

    // Track if join room has been called to prevent duplicate calls
    let is_join_room_called = RwSignal::new(false);

    // Room state from join_room call
    let room_from_join =
        RwSignal::new(None::<Result<crate::domain::room::Room, leptos::server_fn::ServerFnError>>);

    // Room state from subscription
    let room_from_subscription =
        RwSignal::new(None::<Result<crate::domain::room::Room, leptos::server_fn::ServerFnError>>);

    // Combined room state (subscription takes precedence over join)
    let room = Signal::derive(move || room_from_subscription.get().or(room_from_join.get()));

    // Join room when user is authenticated and hasn't joined yet
    Effect::new(move || {
        if let Some(user) = user.get() {
            if !is_join_room_called.get() {
                is_join_room_called.set(true);
                let room_id = room_id();
                spawn_local(async move {
                    match join_room(room_id, user).await {
                        Ok(room) => {
                            room_from_join.set(Some(Ok(room)));
                        }
                        Err(e) => {
                            log!("Error joining room: {:?}", e);
                            room_from_join.set(Some(Err(e)));
                        }
                    }
                });
            }
        }
    });

    // Set up websocket subscription for real-time updates
    use futures::StreamExt;
    use futures::channel::mpsc;
    let (_, rx) = mpsc::channel(1);

    spawn_local(async move {
        match subscribe_to_rooms(rx.into()).await {
            Ok(mut messages) => {
                while let Some(msg) = messages.next().await {
                    if let Ok(ref room_data) = msg {
                        // Only update if it's the room we're interested in
                        if room_data.id == room_id_value {
                            room_from_subscription.set(Some(msg));
                        }
                    }
                }
            }
            Err(e) => log!("WebSocket subscription error: {e}"),
        }
    });

    view! {
        <>
            <Layout room={room.get_untracked().and_then(|r| r.ok())}>
                {move || {
                    match room.get() {
                        Some(Ok(room_data)) => {
                            view! {
                                <>
                                    <Room room=room_data.clone() />
                                    <div class="absolute left-0 right-0 bottom-4 mx-auto my-0 max-w-4xl overflow-auto">
                                        {move || {
                                            if room_data.is_game_over {
                                                view! {
                                                    <div class="flex justify-center">
                                                        <vote_distribution_chart::VoteDistributionChart room=room_data.clone() />
                                                    </div>
                                                }.into_any()
                                            } else {
                                                view! {
                                                    <Deck
                                                        room=room_data.clone()
                                                        user_id=user.get().map(|u| u.id).unwrap_or_default()
                                                    />
                                                }.into_any()
                                            }
                                        }}
                                    </div>
                                </>
                            }.into_any()
                        }
                        Some(Err(e)) => {
                            view! {
                                <div class="flex items-center justify-center h-[calc(100vh-120px)]">
                                    <div class="text-center">
                                        <p class="text-red-500 mb-2">"Error loading room"</p>
                                        <p class="text-sm text-gray-500">{format!("{:?}", e)}</p>
                                    </div>
                                </div>
                            }.into_any()
                        }
                        None => {
                            view! {
                                <div class="flex items-center justify-center h-[calc(100vh-120px)]">
                                    <div class="text-center">
                                        <p class="text-gray-500">"Loading room..."</p>
                                    </div>
                                </div>
                            }.into_any()
                        }
                    }
                }}
            </Layout>
            {move || {
                if user.get().is_none() {
                    view! { <JoinRoomDialog _room_id=room_id() /> }.into_any()
                } else {
                    view! {}.into_any()
                }
            }}
        </>
    }
}
