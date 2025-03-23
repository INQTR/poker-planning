use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::{
    deck::Deck,
    game::{Game, UserCard},
    user::User,
};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Room {
    pub id: Uuid,
    pub name: Option<String>,
    pub users: Vec<User>,
    pub deck: Deck,
    pub game: Game,
    pub is_game_over: bool,
}

impl Room {
    pub fn new(name: Option<String>) -> Self {
        Room {
            id: Uuid::new_v4(),
            name,
            users: vec![],
            deck: Deck::new(),
            game: Game::new(),
            is_game_over: false,
        }
    }

    pub fn get_room(&self) -> Room {
        if self.is_game_over {
            self.clone()
        } else {
            let table: Vec<UserCard> = self
                .clone()
                .game
                .table
                .iter()
                .map(|user_card| UserCard {
                    user_id: user_card.user_id,
                    card: None,
                })
                .collect();

            Room {
                game: Game {
                    table,
                    ..self.game.clone()
                },
                ..self.clone()
            }
        }
    }

    pub fn is_user_exist(&self, user_id: Uuid) -> bool {
        self.users.iter().any(|user| user.id == user_id)
    }

    pub fn edit_user(&mut self, user_id: Uuid, username: String) {
        let users: Vec<User> = self
            .users
            .clone()
            .into_iter()
            .map(|mut user| {
                if user.id == user_id {
                    user.username = username.clone();

                    user
                } else {
                    user
                }
            })
            .collect();

        self.users = users;
    }

    pub fn remove_user(&mut self, user_id: Uuid) {
        let users: Vec<User> = self
            .users
            .clone()
            .into_iter()
            .filter(|user| user.id != user_id)
            .collect();

        let table: Vec<UserCard> = self
            .game
            .table
            .clone()
            .into_iter()
            .filter(|user_card| user_card.user_id != user_id)
            .collect();

        self.users = users;
        self.game.table = table;
    }
}
