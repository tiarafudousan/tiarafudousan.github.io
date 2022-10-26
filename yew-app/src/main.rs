use yew::prelude::*;

// #[function_component(App)]
// fn app() -> Html {
//     html! {
//         <h1>{ "Hello World" }</h1>
//     }
// }

enum Msg {
    AddOne,
}

struct App {
    value: i64,
}

impl Component for App {
    type Message = Msg;
    type Properties = ();

    fn create(_ctx: &Context<Self>) -> Self {
        Self {
            value: 0,
        }
    }

    fn update(&mut self, _ctx: &Context<Self>, msg: Self::Message) -> bool {
        match msg {
            Msg::AddOne => {
                self.value += 1;
                // the value has changed so we need to
                // re-render for it to appear on the page
                true
            }
        }
    }

    fn view(&self, ctx: &Context<Self>) -> Html {
        // This gives us a component's "`Scope`" which allows us to send messages, etc to the component.
        let link = ctx.link();
        html! {
            <div>
                <button onclick={link.callback(|_| Msg::AddOne)}>{ "+1" }</button>
                <p>{ self.value }</p>
                <form>
                <div>{"物件情報"}</div>
                    <input />
                    <input />
                    <input />
                    <input />
                <div>{"資金計画"}</div>
                    <input />
                    <input />
                    <input />
                    <input />
                <button>{"計算"}</button>
                <button>{"リセット"}</button>
                </form>
            </div>
        }
    }
}

fn main() {
    yew::start_app::<App>();
}