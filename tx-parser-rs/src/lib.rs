use wasm_bindgen::prelude::wasm_bindgen;

/// Represents a single transaction
struct Transaction {
    index: u32,
    name: String,
    min_price: f32,
    max_price: f32
}

impl Transaction {
    /// Create a new transaction
    fn new(index: u32, name: &str, min_price: f32, max_price: f32) -> Transaction {
        Transaction {
            index: index,
            name: name.to_owned(),
            min_price: min_price,
            max_price: max_price
        }
    }
}

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

    // TODO: Parse transactions list

    "".to_owned()
}

fn parse_line(line: &str) -> Result<Transaction, &str> {
    // A line is formatted like so: <index>, <name>, <min_price>, <max_price>
    let parts = line.split(", ").collect::<Vec<&str>>();

    if parts.len() != 4 {
        return Err("Row does not contain the expected number of entries");
    }

    // Extract individual items from the parsed row
    let index       = parts[0].parse::<u32>();
    let name        = parts[1];
    let min_price   = parts[2].parse::<f32>();
    let max_price   = parts[3].parse::<f32>();

    if index.is_err() {
        return Err("Unable to parse index");
    } else if min_price.is_err() {
        return Err("Unable to parse min_price");
    } else if max_price.is_err() {
        return Err("Unable to parse max_price");
    }
    
    Ok(Transaction::new(index.unwrap(), name, min_price.unwrap(), max_price.unwrap()))
}
