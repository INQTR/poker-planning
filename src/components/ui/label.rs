use leptos::prelude::*;

/// A label component styled for the UI, often used with inputs.
#[component]
pub fn Label(
    /// The content of the label.
    children: Children,
    /// The ID of the input element this label is associated with.
    #[prop(optional, into)]
    for_: Option<String>,
    /// Additional classes to merge with the base classes.
    #[prop(optional, into)]
    class: Option<String>,
    // Consider adding props for accessibility or specific states if needed.
) -> impl IntoView {
    let base_classes = "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50";

    // Combine base classes with optionally provided classes
    let merged_class = move || {
        class.as_ref().map_or_else(
            || base_classes.to_string(),
            |c| format!("{} {}", base_classes, c),
        )
    };

    view! {
        <label
            class=merged_class
            // Use prop:for because 'for' is a reserved keyword in Rust.
            prop:for_=for_
        >
            {children()}
        </label>
    }
}
