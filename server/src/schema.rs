use std::collections::HashMap;

use crate::{
    domain::{
        game::{Game, UserCard},
        room::Room,
        user::{User, UserInput},
    },
    simple_broker::SimpleBroker,
    types::{EntityId, Storage},
};
use async_graphql::*;
use futures_util::{Stream, StreamExt, lock::MutexGuard};
use uuid::Uuid;

async fn get_storage<'a>(ctx: &'a Context<'_>) -> MutexGuard<'a, HashMap<Uuid, Room>> {
    ctx.data_unchecked::<Storage>().lock().await
}

pub type PokerPlanningSchema = Schema<QueryRoot, MutationRoot, SubscriptionRoot>;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn rooms(&self, ctx: &Context<'_>) -> Result<Vec<Room>> {
        let storage = get_storage(ctx).await;

        Ok(storage.clone().into_values().collect())
    }

    async fn user_rooms(&self, ctx: &Context<'_>, user_id: EntityId) -> Result<Vec<Room>> {
        let storage = get_storage(ctx).await;

        let rooms = storage
            .clone()
            .into_iter()
            .fold(vec![], |mut acc, (_, room)| {
                if room
                    .users
                    .iter()
                    .any(|user_in_room| user_in_room.id == user_id)
                {
                    acc.push(room);
                }

                acc
            });

        Ok(rooms)
    }
}

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn create_room(&self, ctx: &Context<'_>, name: Option<String>) -> Result<Room> {
        let mut storage = get_storage(ctx).await;
        let room = Room::new(name);

        storage.insert(room.id, room.clone());

        SimpleBroker::publish(room.get_room());

        Ok(room.get_room())
    }

    async fn create_user(&self, username: String) -> User {
        User::new(username)
    }

    async fn join_room(
        &self,
        ctx: &Context<'_>,
        room_id: EntityId,
        user: UserInput,
    ) -> Result<Room> {
        let mut storage = get_storage(ctx).await;

        match storage.get_mut(&room_id) {
            Some(room) => {
                if !room.users.iter().any(|u| u.id == user.id) {
                    room.users.push(user.into());

                    SimpleBroker::publish(room.get_room());

                    Ok(room.get_room())
                } else {
                    SimpleBroker::publish(room.get_room());

                    Ok(room.get_room())
                }
            }
            None => Err(Error::new("Room not found")),
        }
    }

    async fn edit_user(
        &self,
        ctx: &Context<'_>,
        user_id: EntityId,
        username: String,
    ) -> Result<User> {
        let mut storage = get_storage(ctx).await;

        *storage = storage
            .clone()
            .into_iter()
            .map(|(key, mut room)| {
                if room.is_user_exist(user_id) {
                    room.edit_user(user_id, username.clone());

                    SimpleBroker::publish(room.get_room());
                }

                (key, room)
            })
            .collect();

        Ok(User {
            id: user_id,
            username,
        })
    }

    async fn logout(&self, ctx: &Context<'_>, user_id: EntityId) -> Result<bool> {
        let mut storage = get_storage(ctx).await;

        *storage = storage
            .clone()
            .into_iter()
            .map(|(key, mut room)| {
                if room.is_user_exist(user_id) {
                    room.remove_user(user_id);

                    SimpleBroker::publish(room.get_room());
                }

                (key, room)
            })
            .collect();

        Ok(true)
    }

    async fn pick_card(
        &self,
        ctx: &Context<'_>,
        user_id: EntityId,
        room_id: EntityId,
        card: String,
    ) -> Result<Room> {
        let mut storage = get_storage(ctx).await;

        match storage.get_mut(&room_id) {
            Some(room) => {
                let mut table: Vec<UserCard> = room
                    .game
                    .table
                    .clone()
                    .into_iter()
                    .filter(|u| u.user_id != user_id)
                    .collect();

                if room.is_game_over {
                    return Err(Error::new("Game over"));
                }

                table.push(UserCard::new(user_id, card));

                room.game.table = table.clone();

                SimpleBroker::publish(room.get_room());

                Ok(room.get_room())
            }
            None => Err(Error::new("Room not found")),
        }
    }

    async fn show_cards(&self, ctx: &Context<'_>, room_id: EntityId) -> Result<Room> {
        let mut storage = get_storage(ctx).await;

        match storage.get_mut(&room_id) {
            Some(room) => {
                room.is_game_over = true;

                SimpleBroker::publish(room.get_room());

                Ok(room.get_room())
            }
            None => Err(Error::new("Room not found")),
        }
    }

    async fn reset_game(&self, ctx: &Context<'_>, room_id: EntityId) -> Result<Room> {
        let mut storage = get_storage(ctx).await;

        match storage.get_mut(&room_id) {
            Some(room) => {
                room.is_game_over = false;
                room.game = Game::new();

                SimpleBroker::publish(room.get_room());

                Ok(room.get_room())
            }
            None => Err(Error::new("Room not found")),
        }
    }
}

pub struct SubscriptionRoot;

#[Subscription]
impl SubscriptionRoot {
    async fn room(&self, room_id: EntityId) -> impl Stream<Item = Room> {
        SimpleBroker::<Room>::subscribe().filter(move |event| {
            let is_current_room = room_id == event.id;

            async move { is_current_room }
        })
    }
}
