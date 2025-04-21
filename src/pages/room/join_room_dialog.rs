use leptos::{
    ev::{Event, MouseEvent},
    logging::log,
    prelude::*,
};
use uuid::Uuid;

use crate::{
    components::{
        use_auth, AuthContext, Dialog, DialogAction, DialogContent, DialogDescription,
        DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, Input,
        Label, Layout,
    },
    domain::user::User,
};

#[component]
pub fn JoinRoomDialog() -> impl IntoView {
    let AuthContext { user, login, .. } = use_auth();
    let (open, set_open) = signal(false);
    let (username, set_username) = signal("".to_string());

    Effect::new(move || {
        if cfg!(feature = "hydrate") {
            log!("username: {:?}", username.get());

            if username.get().is_empty() {
                set_open(true);
            }
        }
    });

    let handle_join_room = move |_| {
        set_open(false);
        login.run(User {
            id: Uuid::new_v4(),
            username: username.get(),
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
                            }
                        />
                    </div>

                    <DialogFooter>
                        <DialogAction on:click=handle_join_room>"Join room"</DialogAction>
                    </DialogFooter>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    }
}
