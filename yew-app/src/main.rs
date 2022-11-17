use yew::prelude::*;
use wasm_bindgen::JsCast; 
use web_sys::{HtmlInputElement};
use gloo_console::log;

// #[function_component(App)]
// fn app() -> Html {
//     html! {
//         <h1>{ "Hello World" }</h1>
//     }
// }

#[derive(Properties, PartialEq)]
struct InputProps {
    label: String,
    unit: String,
    #[prop_or_default]
    width: Option<u32>
}

#[function_component(Input)]
fn input(props: &InputProps) -> Html {
    // TODO: on change
    let on_change = Callback::from(|e: Event| {
        let value = e.target().unwrap().unchecked_into::<HtmlInputElement>().value();
        log!(value);
    });

    let width = &props.width.unwrap_or(300);

    html! {
        <div class="flex flex-row items-center">
            <label class="w-[130px]">{&props.label}</label>
            <input 
                class={format!("w-[{width}px] px-2 py-0.5 text-right border border-gray-100 focus:outline-none focus:ring focus:ring-blue-200 rounded-sm")} 
                onchange={on_change}
            />
            <div class="ml-1">{&props.unit}</div>
        </div>
    }
}

use yew::{function_component, Component, Context, html, Html, Properties, Children};


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
                            <Input label="物件価格" unit="万円" width={Some(70)}/>
                            <Input label="満室時想定年収" unit="万円" width={Some(70)}/>
                            <Input label="想定空室率" unit="%" width={Some(70)}/>
                            <Input label="諸経費率" unit="%" width={Some(70)}/>
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