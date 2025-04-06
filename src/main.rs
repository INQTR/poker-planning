#[cfg(feature = "ssr")]
#[tokio::main]
async fn main() {
    use axum::Router;
    use leptos::config::get_configuration;
    use leptos::logging::log;
    use leptos::prelude::provide_context;
    use leptos_axum::{LeptosRoutes, generate_route_list};
    use poker_planning::{
        app::{App, shell},
        domain::room::Room,
        state::AppState,
        types::Storage,
    };
    use uuid::Uuid;

    let conf = get_configuration(None).unwrap();
    let addr = conf.leptos_options.site_addr;
    let leptos_options = conf.leptos_options;
    // Generate the list of routes in your Leptos App
    let routes = generate_route_list(App);
    let storage: Storage = Storage::default();

    let room = Room::new(None);
    let room = Room {
        id: Uuid::default(),
        ..room
    };
    storage.lock().await.insert(room.id, room.clone());

    let app_state = AppState {
        storage,
        leptos_options,
    };

    let app = Router::new()
        .leptos_routes_with_context(
            &app_state,
            routes,
            {
                let app_state = app_state.clone();
                move || provide_context(app_state.clone())
            },
            {
                let app_state = app_state.clone();
                move || {
                    let leptos_options = app_state.leptos_options.clone();
                    shell(leptos_options)
                }
            },
        )
        .fallback(leptos_axum::file_and_error_handler::<AppState, _>(shell))
        .with_state(app_state);

    // run our app with hyper
    // `axum::Server` is a re-export of `hyper::Server`
    log!("listening on http://{}", &addr);
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}

#[cfg(not(feature = "ssr"))]
pub fn main() {
    // no client-side main function
    // unless we want this to work with e.g., Trunk for pure client-side testing
    // see lib.rs for hydration function instead
}
