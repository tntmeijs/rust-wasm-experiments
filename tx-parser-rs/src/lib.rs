use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn process(data: &[u8]) -> usize {
    return data.len();
}
