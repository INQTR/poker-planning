use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::types::Card;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Game {
    pub id: Uuid,
    pub table: Vec<UserCard>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct UserCard {
    pub user_id: Uuid,
    pub card: Option<Card>,
}

impl Game {
    pub fn new() -> Self {
        Game {
            id: Uuid::new_v4(),
            table: vec![],
        }
    }
}

impl UserCard {
    pub fn new(user_id: Uuid, card: Card) -> Self {
        UserCard {
            user_id,
            card: Some(card),
        }
    }
}
