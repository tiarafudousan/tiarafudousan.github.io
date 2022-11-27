use yew::prelude::*;
use yew::{function_component, html, use_state};
use gloo_console::log;

mod components;

use components::input::Input;

#[derive(Debug)]
struct Inputs {
    property_price: String,
    yearly_income: String,
    vacancy_rate: String,
    running_cost_rate: String,
    cash: String,
    loan: String,
    n: String,
    interest_rate: String,
}

#[function_component(App)]
fn app() -> Html {
    // TODO: state
    let inputs = use_state(|| Inputs {
        property_price: String::new(),
        yearly_income: String::new(),
        vacancy_rate: String::new(),
        running_cost_rate: String::new(),
        cash: String::new(),
        loan: String::new(),
        n: String::new(),
        interest_rate: String::new(),
    });

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
                            on_change={Callback::from(move |text| {
                                inputs.set(Inputs { 
                                    property_price: text,
                                    yearly_income: inputs.yearly_income.to_string(),
                                    vacancy_rate: inputs.vacancy_rate.to_string(),
                                    running_cost_rate: inputs.running_cost_rate.to_string(),
                                    cash: inputs.cash.to_string(),
                                    loan: inputs.loan.to_string(),
                                    n: inputs.n.to_string(),
                                    interest_rate: inputs.interest_rate.to_string(),
                                 });
                            })}
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