use leptos::{ev, prelude::*};
use std::fmt::{self, Display};

use crate::utils::BoxOneCallback;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ButtonVariant {
    Default,
    Destructive,
    Outline,
    Secondary,
    Ghost,
    Link,
}

impl Display for ButtonVariant {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ButtonVariant::Default => write!(f, "default"),
            ButtonVariant::Destructive => write!(f, "destructive"),
            ButtonVariant::Outline => write!(f, "outline"),
            ButtonVariant::Secondary => write!(f, "secondary"),
            ButtonVariant::Ghost => write!(f, "ghost"),
            ButtonVariant::Link => write!(f, "link"),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ButtonSize {
    Default,
    Sm,
    Lg,
    Icon,
}

impl Display for ButtonSize {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ButtonSize::Default => write!(f, "default"),
            ButtonSize::Sm => write!(f, "sm"),
            ButtonSize::Lg => write!(f, "lg"),
            ButtonSize::Icon => write!(f, "icon"),
        }
    }
}

pub fn button_variants(variant: ButtonVariant, size: ButtonSize, class: Option<&str>) -> String {
    let base_classes = "cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

    let variant_classes = match variant {
        ButtonVariant::Default => "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        ButtonVariant::Destructive => {
            "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
        }
        ButtonVariant::Outline => {
            "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
        }
        ButtonVariant::Secondary => {
            "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
        }
        ButtonVariant::Ghost => "hover:bg-accent hover:text-accent-foreground",
        ButtonVariant::Link => "text-primary underline-offset-4 hover:underline",
    };

    let size_classes = match size {
        ButtonSize::Default => "h-9 px-4 py-2",
        ButtonSize::Sm => "h-8 rounded-md px-3 text-xs",
        ButtonSize::Lg => "h-10 rounded-md px-8",
        ButtonSize::Icon => "h-9 w-9",
    };

    let additional_classes = class.unwrap_or("");

    format!(
        "{} {} {} {}",
        base_classes, variant_classes, size_classes, additional_classes
    )
}

#[component]
pub fn Button(
    children: Children,
    #[prop(optional)] class: Option<&'static str>,
    #[prop(optional, default = ButtonVariant::Default)] variant: ButtonVariant,
    #[prop(optional, default = ButtonSize::Default)] size: ButtonSize,
    #[prop(optional, default = false)] disabled: bool,
    #[prop(optional, into)] on_click: Option<BoxOneCallback<ev::MouseEvent>>,
) -> impl IntoView {
    let classes = move || button_variants(variant.clone(), size.clone(), class);

    let on_click = move |e| {
        let Some(on_click) = on_click.as_ref() else {
            return;
        };
        on_click(e);
    };

    view! {
        <button class=classes() disabled=disabled on:click=on_click>
            {children()}
        </button>
    }
}
