use codee::string::JsonSerdeCodec;
use leptos::prelude::*;
use leptos_use::storage::{
    use_local_storage, use_storage_with_options, StorageType, UseStorageOptions,
};
use serde::{Deserialize, Serialize};

use crate::domain::user::User;

// Type alias for the optional User signal
type UserSignal = Signal<Option<User>>;

// Type alias for the login function callback
type LoginFn = Callback<User>;

// Type alias for the logout function callback
type LogoutFn = Callback<()>;

// AuthContext holds the signals and callbacks for authentication state
#[derive(Clone)]
pub struct AuthContext {
    pub user: UserSignal,
    pub login: LoginFn,
    pub logout: LogoutFn,
}

const STORAGE_KEY: &str = "user";

// Creates the auth context, setting up local storage synchronization
fn create_auth_context() -> AuthContext {
    // Use local storage to persist the user session
    let (user_signal, set_user_signal, _) =
        use_local_storage::<Option<User>, JsonSerdeCodec>(STORAGE_KEY.to_string());

    // Create login callback
    let login = Callback::new(move |user_to_login: User| {
        set_user_signal(Some(user_to_login.clone()));
    });

    // Create logout callback
    let logout = Callback::new(move |_| {
        set_user_signal(None);
    });

    AuthContext {
        user: user_signal,
        login,
        logout,
    }
}

// Provides the AuthContext to the component tree
pub fn provide_auth_context() {
    let auth_context = create_auth_context();
    provide_context(auth_context);
}

// Hook to access the AuthContext from components
pub fn use_auth() -> AuthContext {
    use_context::<AuthContext>().expect("use_auth must be used with provide_auth_context")
}
