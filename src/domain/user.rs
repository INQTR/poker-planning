use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
}

impl User {
    pub fn new(username: String) -> Self {
        User {
            id: Uuid::new_v4(),
            username,
        }
    }
}
