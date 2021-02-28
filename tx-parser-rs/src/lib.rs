use wasm_bindgen::prelude::wasm_bindgen;
use std::collections::HashMap;

/// Represents a single transaction
struct Transaction {
    name: String,
    min_price: f32,
    max_price: f32
}

impl Transaction {
    /// Create a new transaction
    fn new(name: &str, min_price: f32, max_price: f32) -> Transaction {
        Transaction {
            name: name.to_owned(),
            min_price: min_price,
            max_price: max_price
        }
    }
}

/// Process a CSV file with transaction data into usable information
/// For the sake of simplicity, all files are assumed to use standard ASCII encoding
/// This function will parse the list of transactions and return information about the data set
#[wasm_bindgen]
pub fn process(data: &[u8]) -> String {
    let mut transactions = vec!();
    let mut error_count = 0;

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
                transactions.push(result.unwrap());
            } else {
                error_count += 1;
            }
        }

        // Move on to the next byte
        byte_index += 1;
        line_index += 1;
    }

    // Tracks how often items occur in the data set
    let mut name_occurance_map = HashMap::new();

    // Tracks the cheapest object
    let mut cheap_value = transactions[0].min_price;
    let mut cheap_name = &transactions[0].name;

    // Tracks the most expensive object
    let mut expensive_value = cheap_value;
    let mut expensive_name = cheap_name;

    // Parse all transactions
    for transaction in &transactions {
        *name_occurance_map.entry(&transaction.name).or_insert(0) += 1;

        if transaction.min_price < cheap_value {
            cheap_value = transaction.min_price;
            cheap_name = &transaction.name;
        } else if transaction.max_price > expensive_value {
            expensive_value = transaction.max_price;
            expensive_name = &transaction.name;
        }
    }

    // Find the most frequent and least frequent occurances
    let mut most_frequent_count = 0;
    let mut most_frequent_name = "";
    let mut least_frequent_count = std::u32::MAX;
    let mut least_frequent_name = "";

    for (name, occurances) in name_occurance_map {
        if least_frequent_count > occurances {
            least_frequent_count = occurances;
            least_frequent_name = name;
        } else if most_frequent_count < occurances {
            most_frequent_count = occurances;
            most_frequent_name = name;
        }
    }

    // Construct JSON fields
    let transaction_count_msg       = format!(r#""transactionCount":{},"#, transactions.len());
    let error_count_msg             = format!(r#""errorCount":{},"#, error_count);
    let failure_rate_msg            = format!(r#""failureRate":{:.2},"#, error_count as f32 / transactions.len() as f32 * 100.0f32);
    let most_frequent_name_msg      = format!(r#""mostFrequentName":"{}","#, most_frequent_name);
    let most_frequent_count_msg     = format!(r#""mostFrequentNameOccurances":{},"#, most_frequent_count);
    let least_frequent_name_msg     = format!(r#""leastFrequentName":"{}","#, least_frequent_name);
    let least_frequent_count_msg    = format!(r#""leastFrequentNameOccurances":{},"#, least_frequent_count);
    let cheap_name_msg              = format!(r#""cheapName":"{}","#, cheap_name);
    let cheap_price_msg             = format!(r#""cheapPrice":{},"#, cheap_value);
    let expensive_name_msg          = format!(r#""expensiveName":"{}","#, expensive_name);
    let expensive_price_msg         = format!(r#""expensivePrice":{}"#, expensive_value);

    // Construct JSON response using the fields above
    let mut response = vec!("{");
    response.push(&transaction_count_msg);
    response.push(&error_count_msg);
    response.push(&failure_rate_msg);
    response.push(&most_frequent_name_msg);
    response.push(&most_frequent_count_msg);
    response.push(&least_frequent_name_msg);
    response.push(&least_frequent_count_msg);
    response.push(&cheap_name_msg);
    response.push(&cheap_price_msg);
    response.push(&expensive_name_msg);
    response.push(&expensive_price_msg);
    response.push("}");
    response.join("")
}

fn parse_line(line: &str) -> Result<Transaction, &str> {
    // A line is formatted like so: <index>, <name>, <min_price>, <max_price>
    let parts = line.split(", ").collect::<Vec<&str>>();

    if parts.len() != 4 {
        return Err("Row does not contain the expected number of entries");
    }

    // Extract individual items from the parsed row (index is ignored as it is not used anywhere)
    let name        = parts[1];
    let min_price   = parts[2].parse::<f32>();
    let max_price   = parts[3].parse::<f32>();

    if min_price.is_err() {
        return Err("Unable to parse min_price");
    } else if max_price.is_err() {
        return Err("Unable to parse max_price");
    }
    
    Ok(Transaction::new(name, min_price.unwrap(), max_price.unwrap()))
}
