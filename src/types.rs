use std::{collections::HashMap, sync::Arc};

use futures_util::lock::Mutex;
use uuid::Uuid;

use crate::domain::room::Room;

pub type Card = String;

pub type Storage = Arc<Mutex<HashMap<Uuid, Room>>>;
