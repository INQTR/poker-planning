use leptos::prelude::*;
use room::Room;
use uuid::Uuid;

use crate::components::Layout;

mod room;
mod table;

#[component]
pub fn RoomPage() -> impl IntoView {
    let test_room_id = Uuid::default();

    view! {
        <Layout>
            <Room />
        </Layout>
    }
}
