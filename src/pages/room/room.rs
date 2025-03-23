use crate::domain::room::Room;
use crate::pages::room::table::Table;
use leptos::logging::log;
use leptos::prelude::*;

#[component]
pub fn Room(room: Room) -> impl IntoView {
    log!("Room: {:?}", room);
    view! {
        <div class="flex flex-col items-center justify-center w-full h-[calc(100vh-120px)]">
            <div class="relative">
                <Table />
            </div>
        </div>
    }
}
