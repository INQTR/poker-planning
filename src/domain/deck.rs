use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::types::Card;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Deck {
    pub id: Uuid,
    pub cards: Vec<Card>,
}

impl Deck {
    pub fn new() -> Self {
        Deck {
            id: Uuid::new_v4(),
            cards: vec![
                "0".to_string(),
                "1".to_string(),
                "2".to_string(),
                "3".to_string(),
                "5".to_string(),
                "8".to_string(),
                "13".to_string(),
                "21".to_string(),
                "34".to_string(),
                "55".to_string(),
                "89".to_string(),
                "∞".to_string(),
                "?".to_string(),
                "☕".to_string(),
            ],
        }
    }
}
