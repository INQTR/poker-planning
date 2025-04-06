use leptos::prelude::*;
use leptos::server_fn::{BoxedStream, ServerFnError, Websocket, codec::JsonEncoding};
use uuid::Uuid;

use crate::domain::game::{Game, UserCard};
use crate::domain::room::Room;
use crate::domain::user::User;
use crate::utils::simple_broker::SimpleBroker;

#[server]
pub async fn create_room(name: Option<String>) -> Result<Room, ServerFnError> {
    use crate::state::AppState;
    let app_state = use_context::<AppState>().unwrap();
    let storage = app_state.storage;

    let room = Room::new(name);
    storage.lock().await.insert(room.id, room.clone());

    SimpleBroker::publish(room.get_room());

    Ok(room.get_room())
}

#[server]
pub async fn join_room(room_id: Uuid, user: User) -> Result<Room, ServerFnError> {
    use crate::state::AppState;
    let app_state = use_context::<AppState>().unwrap();
    let storage = app_state.storage;
    let mut storage = storage.lock().await;

    match storage.get_mut(&room_id) {
        Some(room) => {
            let user_entity: User = user.into();
            if !room.users.iter().any(|u| u.id == user_entity.id) {
                room.users.push(user_entity);
                SimpleBroker::publish(room.get_room());
            }
            Ok(room.get_room())
        }
        None => Err(ServerFnError::ServerError("Room not found".to_string())),
    }
}

#[server]
pub async fn get_rooms() -> Result<Vec<Room>, ServerFnError> {
    use crate::state::AppState;
    let app_state = use_context::<AppState>().unwrap();
    let storage = app_state.storage;
    let storage = storage.lock().await;
    Ok(storage.clone().into_values().collect())
}

#[server]
pub async fn get_user_rooms(user_id: Uuid) -> Result<Vec<Room>, ServerFnError> {
    use crate::state::AppState;
    let app_state = use_context::<AppState>().unwrap();
    let storage = app_state.storage;
    let storage = storage.lock().await;

    let rooms = storage
        .clone()
        .into_values()
        .filter(|room| {
            room.users
                .iter()
                .any(|user_in_room| user_in_room.id == user_id)
        })
        .collect();

    Ok(rooms)
}

#[server]
pub async fn create_user(username: String) -> Result<User, ServerFnError> {
    Ok(User::new(username))
}

#[server]
pub async fn edit_user(user_id: Uuid, username: String) -> Result<User, ServerFnError> {
    use crate::state::AppState;
    let app_state = use_context::<AppState>().unwrap();
    let storage = app_state.storage;
    let mut storage = storage.lock().await;

    let updated_user = User {
        id: user_id,
        username: username.clone(),
    };

    let mut rooms_to_notify = Vec::new();
    for room in storage.values_mut() {
        if room.is_user_exist(user_id) {
            room.edit_user(user_id, username.clone());
            rooms_to_notify.push(room.get_room());
        }
    }

    for room_data in rooms_to_notify {
        SimpleBroker::publish(room_data);
    }

    Ok(updated_user)
}

#[server]
pub async fn logout(user_id: Uuid) -> Result<bool, ServerFnError> {
    use crate::state::AppState;
    let app_state = use_context::<AppState>().unwrap();
    let storage = app_state.storage;
    let mut storage = storage.lock().await;

    let mut rooms_to_notify = Vec::new();
    for room in storage.values_mut() {
        if room.is_user_exist(user_id) {
            room.remove_user(user_id);
            rooms_to_notify.push(room.get_room());
        }
    }

    for room_data in rooms_to_notify {
        SimpleBroker::publish(room_data);
    }

    Ok(true)
}

#[server]
pub async fn pick_card(user_id: Uuid, room_id: Uuid, card: String) -> Result<Room, ServerFnError> {
    use crate::state::AppState;
    let app_state = use_context::<AppState>().unwrap();
    let storage = app_state.storage;
    let mut storage = storage.lock().await;

    dbg!(user_id);
    dbg!(room_id);
    dbg!(card.clone());

    match storage.get_mut(&room_id) {
        Some(room) => {
            dbg!(&room);
            if room.is_game_over {
                return Err(ServerFnError::ServerError("Game is over".to_string()));
            }
            if !room.is_user_exist(user_id) {
                return Err(ServerFnError::ServerError("User not in room".to_string()));
            }

            room.game
                .table
                .retain(|user_card| user_card.user_id != user_id);
            room.game.table.push(UserCard::new(user_id, card));

            let room_data = room.get_room();
            SimpleBroker::publish(room_data.clone());
            Ok(room_data)
        }
        None => Err(ServerFnError::ServerError("Room not found".to_string())),
    }
}

#[server]
pub async fn show_cards(room_id: Uuid) -> Result<Room, ServerFnError> {
    use crate::state::AppState;
    let app_state = use_context::<AppState>().unwrap();
    let storage = app_state.storage;
    let mut storage = storage.lock().await;

    match storage.get_mut(&room_id) {
        Some(room) => {
            room.is_game_over = true;
            let room_data = room.get_room();
            SimpleBroker::publish(room_data.clone());
            Ok(room_data)
        }
        None => Err(ServerFnError::ServerError("Room not found".to_string())),
    }
}

#[server]
pub async fn reset_game(room_id: Uuid) -> Result<Room, ServerFnError> {
    use crate::state::AppState;
    let app_state = use_context::<AppState>().unwrap();
    let storage = app_state.storage;
    let mut storage = storage.lock().await;

    match storage.get_mut(&room_id) {
        Some(room) => {
            room.is_game_over = false;
            room.game = Game::new();
            let room_data = room.get_room();
            SimpleBroker::publish(room_data.clone());
            Ok(room_data)
        }
        None => Err(ServerFnError::ServerError("Room not found".to_string())),
    }
}

#[server(protocol = Websocket<JsonEncoding, JsonEncoding>)]
pub async fn subscribe_to_rooms(
    input: BoxedStream<String, ServerFnError>,
) -> Result<BoxedStream<Room, ServerFnError>, ServerFnError> {
    use futures::channel::mpsc;
    use futures::{SinkExt, StreamExt};
    let mut _input = input; // FIXME :-) server fn fields should pass mut through to destructure
    let (mut tx, rx) = mpsc::channel(1);

    // Create a stream that listens for Room updates from SimpleBroker
    let stream = SimpleBroker::<Room>::subscribe();

    // Spawn a task to forward Room updates to the channel
    tokio::spawn(async move {
        let mut stream = stream;
        while let Some(room) = stream.next().await {
            if tx.send(Ok(room)).await.is_err() {
                break;
            }
        }
    });

    Ok(rx.into())
}
