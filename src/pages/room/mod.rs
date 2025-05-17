use deck::Deck;
use join_room_dialog::JoinRoomDialog;
use leptos::{ logging::log, prelude::*, task::spawn_local};
use leptos_router::hooks::{use_params};
use leptos_router::params::Params;
use room::Room;
use uuid::Uuid;

use crate::{
    components::{ use_auth, AuthContext, Dialog, DialogAction, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, Input, Label, Layout},
    domain::user::User,
    server_fns::{join_room, subscribe_to_rooms},
};

mod card;
mod deck;
mod room;
mod table;
mod join_room_dialog;

#[derive(Debug, Clone, PartialEq, Eq, Hash, Params)]
struct RoomParams {
    room_id: Uuid,
}


#[component]
pub fn RoomPage() -> impl IntoView {
    let params = use_params::<RoomParams>();
    let room_id = move || params.get().map(|params| params.room_id);
    let test_room_id = room_id().unwrap_or_default();
    log!("Room ID: {:?}", &test_room_id);
    let AuthContext { user, .. } = use_auth();
    
    // TODO: Find a better way to handle conditional resource creation
    // This source signal correctly produces Some((uuid, user)) only when logged in.
    let resource_source = move || user.get().map(|user_instance| (test_room_id, user_instance));
    let room_first = Resource::new(
        resource_source,
        move |input| async move {
            match input {
                Some((id, user)) => join_room(id, user).await,
                None => {
                    log!("Resource fetcher called unexpectedly with None input.");
                    Err(leptos::server_fn::ServerFnError::ServerError(
                        "Resource fetcher called unexpectedly with None input.".to_string(),
                    ))
                }
            }
        },
    );

    use futures::StreamExt;
    use futures::channel::mpsc;
    let (_, rx) = mpsc::channel(1);
    let room_latest = RwSignal::new(None);

    let room = Signal::derive(move || {
        room_latest.get().or_else(|| room_first.get())
    });

    // we'll only listen for websocket messages on the client
    if cfg!(feature = "hydrate") {
        spawn_local(async move {
            match subscribe_to_rooms(rx.into()).await {
                Ok(mut messages) => {
                    while let Some(msg) = messages.next().await {
                        room_latest.set(Some(msg));
                    }
                }
                Err(e) => leptos::logging::warn!("{e}"),
            }
        });
    }

    Effect::new(move || {
        if let Some(msg) = room_latest.get() {
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
                {move || {
                    match user() {
                        None => view! { <JoinRoomDialog /> }.into_any(),
                        Some(user) => {
                            view! {
                                <>
                                    {move || match room.get() {
                                        Some(Ok(data)) => {
                                            view! {
                                                <>
                                                    <Room room=data.clone() />
                                                    <div class="absolute left-0 right-0 bottom-4 mx-auto my-0 max-w-4xl overflow-auto">
                                                        <Deck room=data user_id=user.id />
                                                    </div>
                                                </>
                                            }
                                                .into_any()
                                        }
                                        _ => view! { <p>"No data"</p> }.into_any(),
                                    }}
                                </>
                            }
                                .into_any()
                        }
                    }
                }}
            </Suspense>
        </Layout>
    }
}

