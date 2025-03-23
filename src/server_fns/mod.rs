use std::collections::HashMap;

use leptos::prelude::*;
use uuid::Uuid;

use crate::domain::room::Room;

#[server]
pub async fn create_room() -> Result<Room, ServerFnError> {
    use crate::state::AppState;

    let AppState { storage, .. } = use_context::<AppState>().unwrap();

    let room = Room::new(None);
    storage.lock().await.insert(room.id, room.clone());

    Ok(room)
}

#[server]
pub async fn get_storage() -> Result<HashMap<Uuid, Room>, ServerFnError> {
    use crate::state::AppState;

    let AppState { storage, .. } = use_context::<AppState>().unwrap();

    Ok(storage.lock().await.clone())
}