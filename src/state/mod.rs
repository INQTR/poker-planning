use cfg_if::cfg_if;

cfg_if! {
    if #[cfg(feature = "ssr")] {
    use axum_macros::FromRef;
    use leptos::config::LeptosOptions;
    use crate::types::Storage;
    // use crate::utils::simple_broker::SimpleBroker;
    // use crate::domain::room::Room;

    #[derive(FromRef, Debug, Clone)]
    pub struct AppState {
        pub storage: Storage,
        pub leptos_options: LeptosOptions,
        // pub broker: SimpleBroker<Room>,
    }
}}
