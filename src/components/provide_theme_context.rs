use codee::string::JsonSerdeCodec;
use leptos::prelude::*;
use leptos_use::storage::use_local_storage;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub enum Theme {
    Dark,
    Light,
    System,
}

impl Theme {
    #[allow(dead_code)]
    fn from_str(s: &str) -> Self {
        match s {
            "dark" => Theme::Dark,
            "light" => Theme::Light,
            _ => Theme::System,
        }
    }

    fn as_str(&self) -> &'static str {
        match self {
            Theme::Dark => "dark",
            Theme::Light => "light",
            Theme::System => "system",
        }
    }
}

impl Default for Theme {
    fn default() -> Self {
        Theme::System
    }
}

#[derive(Clone)]
pub struct ThemeContext(pub ReadSignal<Theme>, pub WriteSignal<Theme>);

fn create_theme_context(storage_key: &str) -> ThemeContext {
    let (stored_theme, set_stored_theme, _) =
        use_local_storage::<Theme, JsonSerdeCodec>(storage_key.to_string());
    let (theme, set_theme) = signal(stored_theme.get_untracked());

    // Create an effect to sync theme changes with localStorage
    Effect::new(move |_| {
        let current_theme = theme();
        set_stored_theme(current_theme);
    });

    Effect::new(move |_| {
        let window = window();
        let root = document()
            .document_element()
            .expect("document element should exist");

        // Remove existing theme classes
        root.class_list().remove_1("light").ok();
        root.class_list().remove_1("dark").ok();

        let theme_value = theme.get();
        let applied_theme = if theme_value == Theme::System {
            // Check system preference
            let is_dark = window
                .match_media("(prefers-color-scheme: dark)")
                .ok()
                .flatten()
                .map(|media_query| media_query.matches())
                .unwrap_or(false);

            if is_dark {
                Theme::Dark
            } else {
                Theme::Light
            }
        } else {
            theme_value
        };

        root.class_list()
            .add_1(applied_theme.as_str())
            .expect("failed to add theme class");
    });

    ThemeContext(theme, set_theme)
}

pub fn provide_theme_context(storage_key: &str) {
    let theme_context = create_theme_context(storage_key);
    provide_context(theme_context.clone());
}

pub fn use_theme() -> ThemeContext {
    use_context::<ThemeContext>().expect("use_theme must be used within a provide_theme_context")
}
