use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct UserInput {
    pub id: Uuid,
    pub username: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
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

impl From<UserInput> for User {
    fn from(input: UserInput) -> Self {
        User {
            id: input.id,
            username: input.username,
        }
    }
}
