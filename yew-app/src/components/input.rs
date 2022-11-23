use yew::prelude::*;
use yew::{function_component, html, Properties};
use wasm_bindgen::JsCast; 
use web_sys::{HtmlInputElement};

#[derive(Properties, PartialEq)]
pub struct InputProps {
    pub label: String,
    pub unit: String,
    #[prop_or_default]
    pub width: Option<u32>,
    pub on_change: Callback<String>,
}

#[function_component(Input)]
pub fn input(props: &InputProps) -> Html {
    let on_change = props.on_change.clone();

    let _on_change = Callback::from(move |e: Event| {
        let value = e.target().unwrap().unchecked_into::<HtmlInputElement>().value();
        on_change.emit(value);
    });

    let width = &props.width.unwrap_or(300);

    html! {
        <div class="flex flex-row items-center">
            <label class="w-[130px]">{&props.label}</label>
            <input 
                class={format!("w-[{width}px] px-2 py-0.5 text-right border border-gray-100 focus:outline-none focus:ring focus:ring-blue-200 rounded-sm")} 
                onchange={_on_change}
            />
            <div class="ml-1">{&props.unit}</div>
        </div>
    }
}
