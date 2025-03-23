use crate::pages::room::table::Table;
use leptos::prelude::*;

#[component]
pub fn Room() -> impl IntoView {
    view! {
        <div class="flex flex-col items-center justify-center w-full h-[calc(100vh-120px)]">
            <div class="relative">
                <Table />
            </div>
        </div>
    }
}
