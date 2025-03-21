use leptos::prelude::*;
use leptos_meta::{provide_meta_context, Link, MetaTags, Stylesheet, Title};
use leptos_router::{
    components::{Route, Router, Routes},
    path, StaticSegment,
};

use crate::{
    components::provide_theme_context,
    pages::{HomePage, NotFoundPage, RoomPage},
};

pub fn shell(options: LeptosOptions) -> impl IntoView {
    view! {
        <!DOCTYPE html>
        <html lang="en" class="dark h-full">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Link rel="icon" type_="image/svg+xml" href="/logo.svg" />
                <Link rel="canonical" href="https://pokerplanning.org" />
                <Link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
                />
                <AutoReload options=options.clone() />
                <HydrationScripts options />
                <MetaTags />
            </head>
            <body class="h-full">
                <App />
            </body>
        </html>
    }
}

#[component]
pub fn App() -> impl IntoView {
    // Provides context that manages stylesheets, titles, meta tags, etc.
    provide_meta_context();

    provide_theme_context("theme");

    view! {
        // injects a stylesheet into the document <head>
        // id=leptos means cargo-leptos will hot-reload this stylesheet
        <Stylesheet id="leptos" href="/pkg/poker-planning.css" />

        // sets the document title
        <Title text="Planning Poker | Free Online Scrum Estimation Tool" />

        // content for this welcome page
        <Router>
            <Routes fallback=NotFoundPage>
                <Route path=StaticSegment("") view=HomePage />
                <Route path=path!("room/:room_id") view=RoomPage />
            </Routes>
        </Router>
    }
}
