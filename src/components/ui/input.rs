use leptos::prelude::*;

/// A basic input component styled for the UI.
#[component]
pub fn Input(
    /// Additional classes to merge with the base classes.
    #[prop(optional, into)]
    class: Option<String>,
    /// The type of the input element (e.g., "text", "password", "email"). Defaults to "text".
    #[prop(optional, into)]
    type_: Option<String>,
) -> impl IntoView {
    let base_classes = "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";

    // Combine base classes with optionally provided classes
    let merged_class = move || {
        class.as_ref().map_or_else(
            || base_classes.to_string(),
            |c| format!("{} {}", base_classes, c),
        )
    };

    // Default input type to "text" if not specified
    let input_type = type_.unwrap_or_else(|| "text".to_string());

    view! { <input type=input_type class=merged_class /> }
}
