use deck::Deck;
use join_room_dialog::JoinRoomDialog;
use leptos::{ logging::log, prelude::*, task::spawn_local};
use room::Room;
use uuid::Uuid;

use crate::{
    components::{ Dialog, DialogAction, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, Input, Label, Layout},
    domain::user::User,
    server_fns::{join_room, subscribe_to_rooms},
};

mod card;
mod deck;
mod room;
mod table;
mod join_room_dialog;

#[component]
pub fn RoomPage() -> impl IntoView {
    let test_room_id = Uuid::default();
    let user = User {
        id: Uuid::new_v4(),
        username: "test".to_string(),
    };
    let user_id = user.id.clone();
    let room = Resource::new(move || test_room_id, move |id| join_room(id, user.clone()));

    use futures::StreamExt;
    use futures::channel::mpsc;
    let (_, rx) = mpsc::channel(1);
    let latest = RwSignal::new(None);

    // we'll only listen for websocket messages on the client
    if cfg!(feature = "hydrate") {
        spawn_local(async move {
            match subscribe_to_rooms(rx.into()).await {
                Ok(mut messages) => {
                    while let Some(msg) = messages.next().await {
                        latest.set(Some(msg));
                    }
                }
                Err(e) => leptos::logging::warn!("{e}"),
            }
        });
    }

    Effect::new(move || {
        if let Some(msg) = latest.get() {
            if let Ok(room) = msg {
                log!("subscribe_to_rooms: {:?}", room);
            }
        }
    });

    view! {
        <Layout>
            <Suspense fallback=move || {
                view! { <p>"Loading..."</p> }
            }>
                {move || match room.get() {
                    Some(Ok(data)) => {
                        view! {
                            <>
                                <Room room=data.clone() />
                                <div class="absolute left-0 right-0 bottom-4 mx-auto my-0 max-w-4xl overflow-auto">
                                    <JoinRoomDialog />
                                    <Deck room=data user_id=user_id />
                                </div>
                            </>
                        }
                            .into_any()
                    }
                    _ => view! { <p>"No data"</p> }.into_any(),
                }}
            </Suspense>
        </Layout>
    }
}

