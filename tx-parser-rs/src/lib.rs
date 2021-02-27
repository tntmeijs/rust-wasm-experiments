use wasm_bindgen::prelude::wasm_bindgen;

/// Process a CSV file with transaction data into usable information
/// For the sake of simplicity, all files are assumed to use standard ASCII encoding
#[wasm_bindgen]
pub fn process(data: &[u8]) -> String {
    let mut data_for_js = vec!();

    let mut byte_index = 0;
    let mut line_index = 0;
    while byte_index < data.len() {
        let mut buffer = vec!();

        // Read until the end of the line while collecting all characters
        while data[byte_index] as char != '\n' {
            let character = data[byte_index] as char;
            buffer.push(character as char);
            byte_index += 1;
        }

        // Ignore the header line (always line 0)
        if line_index > 0 {
            // Parse the line into usable data
            let line = buffer.into_iter().collect::<String>();
            let result = parse_line(&line);

            if result.is_ok() {
                data_for_js.push(result.unwrap());
            }
        }

        // Move on to the next byte
        byte_index += 1;
        line_index += 1;
    }

    return data_for_js.join("\n");
}

pub fn parse_line(line: &str) -> Result<String, &str> {
    // A line is formatted like so: <index>, <name>, <min_price>, <max_price>
    let parts = line.split(", ").collect::<Vec<&str>>();
    
    if parts.len() != 4 {
        return Err("Row does not contain the expected number of entries");
    }

    Ok(line.to_owned())
}
