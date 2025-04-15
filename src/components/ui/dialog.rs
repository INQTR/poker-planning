use leptos::logging::log;
use leptos::portal::Portal;
use leptos::{ev, html, prelude::*};

use crate::components::Button;
use crate::components::ButtonVariant;
use crate::utils::BoxOneCallback;

/// Dialog component context to manage the dialog state
/// and share it between all dialog components
#[derive(Clone, Debug)]
pub struct DialogContext {
    /// Whether the dialog is open
    pub open: Signal<bool>,
    /// Callback to change the open state
    pub set_open: Callback<bool>,
    /// References to key elements
    pub trigger_ref: NodeRef<html::Button>,
    pub content_ref: NodeRef<html::Div>,
    /// Accessibility IDs
    pub content_id: String,
    pub title_id: String,
    pub description_id: String,
    /// Whether the dialog is modal (blocks interactions with the rest of the page)
    pub modal: bool,
}

impl DialogContext {
    /// Toggle the dialog open state
    pub fn toggle(&self) {
        self.set_open.run(!self.open.get());
    }
}

/// Main Dialog component that provides context to all child components
#[component]
pub fn Dialog(
    children: Children,
    /// Whether the dialog is open
    #[prop(optional)]
    open: Signal<bool>,
    /// Whether the dialog is modal (blocks interactions with the rest of the page)
    #[prop(optional, default = true)]
    modal: bool,
) -> impl IntoView {
    // log!("Dialog open {:?}", open());
    // Create local state if no controlled state is provided
    let (internal_open, set_internal_open) = signal(open.get_untracked());

    Effect::new(move || {
        set_internal_open(open());
    });

    Effect::new(move || {
        log!("internal_open {}", internal_open());
    });

    // // Use either provided signal or internal signal
    // let open_signal =
    //     Signal::derive(move || open.map(|o| o.get()).unwrap_or_else(|| internal_open.get()));

    // Create a callback to update the open state
    let set_open = Callback::new(move |value: bool| {
        // Update internal state if we're managing state internally
        // if open.is_none() {
        //     // set_internal_open.set(value);
        //     // internal_open.set(value);
        // }
        //
        set_internal_open.set(value);
    });

    // Create unique IDs for accessibility
    let content_id = format!("dialog-content-{}", generate_unique_id());
    let title_id = format!("dialog-title-{}", generate_unique_id());
    let description_id = format!("dialog-description-{}", generate_unique_id());

    let trigger_ref = NodeRef::<html::Button>::new();
    let content_ref = NodeRef::<html::Div>::new();

    // Provide context to all child components
    let context = DialogContext {
        open: internal_open.into(),
        set_open,
        trigger_ref,
        content_ref,
        content_id,
        title_id,
        description_id,
        modal,
    };

    provide_context(context);

    view! { <>{children()}</> }
}

/// Generate a unique ID for accessibility attributes
fn generate_unique_id() -> String {
    use std::sync::atomic::{AtomicUsize, Ordering};
    static COUNTER: AtomicUsize = AtomicUsize::new(0);
    format!("id-{}", COUNTER.fetch_add(1, Ordering::Relaxed))
}

/// Helper function to get dialog state as string
fn get_state(open: bool) -> &'static str {
    if open {
        "open"
    } else {
        "closed"
    }
}

/// Button that triggers the dialog
#[component]
pub fn DialogTrigger(
    children: Children,
    /// Additional class names
    #[prop(optional)]
    class: Option<&'static str>,
    /// Click handler
    #[prop(optional, into)]
    on_click: Option<BoxOneCallback<ev::MouseEvent>>,
) -> impl IntoView {
    let context = use_context::<DialogContext>().expect("DialogTrigger must be used within Dialog");

    let class_list = class.unwrap_or("");

    // Clone context to avoid move issues
    let context_clone = context.clone();

    let combined_on_click = move |e: ev::MouseEvent| {
        // Call the provided click handler if any
        if let Some(on_click) = &on_click {
            on_click(e.clone());
        }

        // Toggle the dialog
        context_clone.toggle();
    };

    view! {
        <Button
            variant=ButtonVariant::Default
            attr:aria-haspopup="dialog"
            attr:aria-expanded=move || context.open.get()
            attr:aria-controls=context.content_id
            attr:data-state=move || get_state(context.open.get())
            class=class_list
            on:click=combined_on_click
        >
            {children()}
        </Button>
    }
}

/// Portal component that renders dialog content in a portal
#[component]
pub fn DialogPortal<C>(children: TypedChildrenFn<C>) -> impl IntoView
where
    C: IntoView + 'static,
{
    let context = use_context::<DialogContext>().expect("DialogPortal must be used within Dialog");

    let context_clone = context.clone();
    Effect::new(move || {
        log!("DialogPortal open {:?}", context_clone.open.get());
    });
    let children = children.into_inner();

    view! {
        <Show when=context.open>
            <div>
                // <Portal mount=document().body().unwrap()>
                <div class="dialog-portal">{children()}</div>
            // </Portal>
            </div>
        </Show>
    }
}

/// Overlay component that covers the page behind the dialog
#[component]
pub fn DialogOverlay(
    /// Additional class names
    #[prop(optional)]
    class: Option<&'static str>,
) -> impl IntoView {
    let context = use_context::<DialogContext>().expect("DialogOverlay must be used within Dialog");

    // Only render overlay for modal dialogs
    if !context.modal {
        return view! { <></> }.into_any();
    }

    // When force_mount is false, only render when the dialog is open
    let show = move || context.open.get();
    let class_list = move || {
        let base = "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0";
        match class {
            Some(c) => format!("{} {}", base, c),
            None => base.to_string(),
        }
    };

    view! {
        <Show when=show>
            <div
                aria-hidden="true"
                class=class_list
                data-state=move || get_state(context.open.get())
            />
        </Show>
    }
    .into_any()
}

/// Main content of the dialog
#[component]
pub fn DialogContent<C>(
    children: TypedChildrenFn<C>,
    /// Additional class names
    #[prop(optional)]
    class: Option<&'static str>,
    /// Handler called when dialog is dismissed
    #[prop(optional, into)]
    _on_close_auto_focus: Option<BoxOneCallback<ev::Event>>,
    /// Handler called when there's a click outside
    #[prop(optional, into)]
    _on_pointer_down_outside: Option<BoxOneCallback<ev::PointerEvent>>,
) -> impl IntoView
where
    C: IntoView + 'static,
{
    let context = use_context::<DialogContext>().expect("DialogContent must be used within Dialog");

    // When force_mount is false, only render when the dialog is open
    let show = move || context.open.get();

    let class_list = move || {
        let base = "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg";
        match class {
            Some(c) => format!("{} {}", base, c),
            None => base.to_string(),
        }
    };

    let on_click_outside = move |e: ev::MouseEvent| {
        // Prevent event bubbling
        e.stop_propagation();

        // Close dialog
        context.set_open.run(false);
    };
    //
    //
    let children = children.into_inner();

    view! {
        <Show when=show>
            <div
                role="dialog"
                id=context.content_id.clone()
                aria-describedby=context.description_id.clone()
                aria-labelledby=context.title_id.clone()
                data-state=move || get_state(context.open.get())
                class=class_list
                node_ref=context.content_ref
            >
                {children()}
            </div>
            // Backdrop handler for closing when clicking outside
            <Show when=move || context.modal>
                <div class="fixed inset-0 z-49 cursor-pointer" on:click=on_click_outside />
            </Show>
        </Show>
    }
}

#[component]
pub fn DialogHeader(children: Children) -> impl IntoView {
    view! { <div class="flex flex-col space-y-2 text-center sm:text-left">{children()}</div> }
}

#[component]
pub fn DialogFooter(children: Children) -> impl IntoView {
    view! {
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            {children()}
        </div>
    }
}

/// Dialog title component
#[component]
pub fn DialogTitle(
    children: Children,
    /// Additional class names
    #[prop(optional)]
    class: Option<&'static str>,
) -> impl IntoView {
    let context = use_context::<DialogContext>().expect("DialogTitle must be used within Dialog");

    let class_list = move || {
        let base = "text-lg font-semibold";
        match class {
            Some(c) => format!("{} {}", base, c),
            None => base.to_string(),
        }
    };

    view! {
        <h2 id=context.title_id.clone() class=class_list>
            {children()}
        </h2>
    }
}

/// Dialog description component
#[component]
pub fn DialogDescription(
    children: Children,
    /// Additional class names
    #[prop(optional)]
    class: Option<&'static str>,
) -> impl IntoView {
    let context =
        use_context::<DialogContext>().expect("DialogDescription must be used within Dialog");

    let class_list = move || {
        let base = "text-sm text-muted-foreground";
        match class {
            Some(c) => format!("{} {}", base, c),
            None => base.to_string(),
        }
    };

    view! {
        <div id=context.description_id.clone() class=class_list>
            {children()}
        </div>
    }
}

/// Close button for the dialog
#[component]
pub fn DialogClose(
    children: Children,
    /// Additional class names
    #[prop(optional)]
    class: Option<&'static str>,
) -> impl IntoView {
    let context = use_context::<DialogContext>().expect("DialogClose must be used within Dialog");

    // Clone context to avoid move issues
    let context_clone = context.clone();
    Effect::new(move || {
        log!("context {:?}", context_clone);
    });

    // Create a separate clone for the click handler
    let context_click = context.clone();
    let on_click = move |_: ev::MouseEvent| {
        log!("DialogClose clicked");
        context_click.set_open.run(false);
    };

    view! {
        <Button variant=ButtonVariant::Secondary on:click=on_click>
            {children()}
        </Button>
    }
}

#[component]
pub fn DialogAction(children: Children) -> impl IntoView {
    view! { <Button variant=ButtonVariant::Default>{children()}</Button> }
}
