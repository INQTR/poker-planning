use leptos::{logging::log, prelude::*};

use crate::{
    components::{
        Dialog, DialogAction, DialogContent, DialogDescription, DialogFooter, DialogHeader,
        DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, Input, Label, Layout,
    },
    domain::user::User,
};

#[component]
pub fn JoinRoomDialog() -> impl IntoView {
    let (open, set_open) = signal(false);
    let (username, set_username) = signal("".to_string());

    Effect::new(move || {
        log!("username: {:?}", username.get());
    });

    view! {
        <Dialog open=open.into()>
            <DialogTrigger class="text-blue-500 hover:text-blue-700 cursor-pointer z-10">
                "Room Info"
            </DialogTrigger>
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
                        <Label for_="username">"Username"</Label>
                        <Input
                            attr:id="username"
                            attr:value=username
                            on:input=move |ev| {
                                set_username(event_target_value(&ev));
                            }
                        />
                    </div>

                    <DialogFooter>
                        <DialogAction on:click=move |_| {
                            set_open(false);
                        }>"Join room"</DialogAction>
                    </DialogFooter>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    }
}
