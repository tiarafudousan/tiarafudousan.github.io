use yew::prelude::*;
use yew::{function_component, html};
use gloo_console::log;

mod components;

use components::input::Input;

#[function_component(App)]
fn app() -> Html {
    html! {
        <div class="flex flex-col px-2 bg-gray-100">
            <form>
                <div class="flex flex-col">
                    <div class="text-lg">{"物件情報"}</div>
                    <div class="bg-red-100 space-y-2 py-2 px-3">
                        <Input
                            label="物件価格" 
                            unit="万円" 
                            width={Some(70)} 
                            on_change={Callback::from(|text| {log!(text);})}
                        />
                        <Input 
                            label="満室時想定年収" 
                            unit="万円" 
                            width={Some(70)} 
                            on_change={Callback::from(|text| {log!(text);})}
                        />
                        <Input 
                            label="想定空室率" 
                            unit="%" 
                            width={Some(70)} 
                            on_change={Callback::from(|text| {log!(text);})}
                        />
                        <Input 
                            label="諸経費率" 
                            unit="%" 
                            width={Some(70)} 
                            on_change={Callback::from(|text| {log!(text);})}
                        />
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

fn main() {
    yew::start_app::<App>();
}