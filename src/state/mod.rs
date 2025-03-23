use cfg_if::cfg_if;

cfg_if! {
    if #[cfg(feature = "ssr")] {
    use axum_macros::FromRef;
    use leptos::config::LeptosOptions;
    use crate::types::Storage;

    #[derive(FromRef, Debug, Clone)]
    pub struct AppState {
        pub storage: Storage,
        pub leptos_options: LeptosOptions,
    }
}}
