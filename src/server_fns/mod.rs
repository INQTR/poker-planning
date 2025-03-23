use std::collections::HashMap;

use leptos::prelude::*;
use uuid::Uuid;

use crate::domain::room::Room;
use crate::domain::user::User;

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

#[server]
pub async fn join_room(
    room_id: Uuid,
    user: User,
) -> Result<Room, ServerFnError> {
    use crate::state::AppState;
    let AppState { storage, .. } = use_context::<AppState>().unwrap();
    let mut storage = storage.lock().await;

    match storage.get_mut(&room_id) {
        Some(room) => {
            if !room.users.iter().any(|u| u.id == user.id) {
                room.users.push(user);

                Ok(room.get_room())
            } else {
                Ok(room.get_room())
            }
        }
        None => Err(ServerFnError::ServerError("Room not found".to_string())),
    }
}
