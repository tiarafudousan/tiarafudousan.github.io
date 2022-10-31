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
            <div class="flex flex-col px-2 bg-gray-100">
                <button onclick={link.callback(|_| Msg::AddOne)}>{ "+1" }</button>
                <p>{ self.value }</p>
                <form>
                    <div class="flex flex-col">
                        <div class="text-lg">{"物件情報"}</div>

                        <div class="bg-red-100 space-y-2 py-2 px-3">
                            <div class="flex flex-row items-center">
                                <label class="w-[130px]">{"物件価格"}</label>
                                <input class="w-[70px] px-2 py-0.5 text-right border border-gray-100 rounded-sm" />
                                <div class="ml-1">{"万円"}</div>
                            </div>

                            <div class="flex flex-row">
                                <label class="w-[130px]">{"満室時想定年収"}</label>
                                <input />
                                <div>{"万円"}</div>
                            </div>
                            
                            <div class="flex flex-row">
                                <label class="w-[130px]">{"想定空室率"}</label>
                                <input />
                                <div>{"%"}</div>
                            </div>

                            <div class="flex flex-row">
                                <label class="w-[130px]">{"諸経費率"}</label>
                                <input />
                                <div>{"%"}</div>
                            </div>
                        </div>
                    </div>

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