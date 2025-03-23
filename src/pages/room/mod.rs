use deck::Deck;
use leptos::prelude::*;
use room::Room;
use uuid::Uuid;

use crate::{components::Layout, domain::user::User, server_fns::join_room};

mod card;
mod deck;
mod room;
mod table;

#[component]
pub fn RoomPage() -> impl IntoView {
    let test_room_id = Uuid::default();
    let user = User {
        id: Uuid::new_v4(),
        username: "test".to_string(),
    };
    let room = Resource::new(move || test_room_id, move |id| join_room(id, user.clone()));

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
                                    <Deck room=data />
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
