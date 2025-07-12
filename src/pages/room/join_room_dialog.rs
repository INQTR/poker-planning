use leptos::{logging::log, prelude::*, task::spawn_local};
use uuid::Uuid;

use crate::{
    components::{
        use_auth, AuthContext, Dialog, DialogAction, DialogContent, DialogDescription,
        DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, Input, Label,
    },
    server_fns::create_user,
};

#[component]
pub fn JoinRoomDialog(_room_id: Uuid) -> impl IntoView {
    let AuthContext { user, login, .. } = use_auth();
    let (open, set_open) = signal(true);
    let (username, set_username) = signal("".to_string());
    let (is_loading, set_is_loading) = signal(false);
    let (error, set_error) = signal(None::<String>);

    log!("user: {:?}", user.get());

    Effect::new(move || {
        if user.get().is_some() {
            set_open(false);
        }
    });

    let handle_join_room = move |_| {
        let username_value = username.get();
        if username_value.trim().is_empty() {
            set_error(Some("Username cannot be empty".to_string()));
            return;
        }
        
        set_is_loading(true);
        set_error(None);
        
        spawn_local(async move {
            match create_user(username_value).await {
                Ok(created_user) => {
                    set_open(false);
                    login.run(created_user);
                }
                Err(e) => {
                    set_error(Some(format!("Failed to create user: {}", e)));
                    set_is_loading(false);
                }
            }
        });
    };

    view! {
        <Dialog open=open.into()>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent class="grid gap-8">
                    <DialogHeader>
                        <DialogTitle>"Enter your username"</DialogTitle>
                        <DialogDescription>
                            "Enter your username to join the room."
                        </DialogDescription>
                    </DialogHeader>

                    <div class="grid gap-3">
                        <Label attr:r#for="username">"Username"</Label>
                        <Input
                            attr:id="username"
                            attr:value=username
                            on:input=move |ev| {
                                set_username(event_target_value(&ev));
                                set_error(None); // Clear error on input
                            }
                            attr:disabled=move || is_loading.get()
                        />
                        {move || {
                            error.get().map(|err| {
                                view! {
                                    <p class="text-sm text-red-500 mt-1">{err}</p>
                                }
                            })
                        }}
                    </div>

                    <DialogFooter>
                        <DialogAction 
                            on:click=handle_join_room
                            attr:disabled=move || is_loading.get()
                        >
                            {move || if is_loading.get() {
                                view! {
                                    <>
                                        <svg
                                            class="mr-2 h-4 w-4 animate-spin inline"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                class="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                stroke-width="4"
                                            ></circle>
                                            <path
                                                class="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        "Creating user..."
                                    </>
                                }.into_any()
                            } else {
                                view! { "Join room" }.into_any()
                            }}
                        </DialogAction>
                    </DialogFooter>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    }
}
