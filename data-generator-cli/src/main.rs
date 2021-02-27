use rand::{thread_rng, Rng};
use std::fs::File;
use std::io::{BufWriter, Write};

const OUTPUT_FILE: &str = "./tx_data.csv";

/// Application entry point
fn main() -> std::io::Result<()> {
    let line_count = get_line_count_from_cmdline_args();
    let file = File::create(OUTPUT_FILE)?;
    let mut file_writer = BufWriter::new(file);

    for line in &generate_lines(line_count) {
        writeln!(file_writer, "{}", line)?;
    }

    Ok(())
}

/// Determine the number of lines to generate based on the "--size=<value>" command-line argument
fn get_line_count_from_cmdline_args() -> u32 {
    let args: Vec<String> = std::env::args().collect();

    // Expect one command-line argument: the number of lines in the file
    if args.len() != 2 {
        println!("Invalid number of command-line arguments, this application expects one argument: --size=<value>");
        std::process::exit(-1);
    }

    let size_arg = &args[1];

    // Ensure the correct option is used
    if !size_arg.starts_with("--size=") {
        println!(r#"Invalid argument, please ensure the argument starts with "--size=<value>"#);
        std::process::exit(-1);
    }

    // Attempt to extract the required number of lines from the argument
    size_arg
        .split('=')                                     // 1) Split on key separator
        .collect::<Vec<&str>>()[1]                      // 2) Ignore key and collect the value
        .parse::<u32>()                                 // 3) Parse to a u32
        .expect("Invalid argument, expected a number")  // 4) Return
}

/// Generate a CSV file with transaction data
fn generate_lines(count: u32) -> Vec<String> {
    let mut rng = thread_rng();
    let mut lines = vec!("index, name, min_price, max_price".to_owned());

    let item_names = vec!(
        "chair",
        "table",
        "sofa",
        "laptop",
        "toy"
    );

    for i in 0..count {
        let base_price = rng.gen::<f64>() * 1000.0f64;

        let index = i.to_string();
        let name = item_names[rng.gen_range(0..item_names.len())].to_owned();
        let min_price = format!("{:.2}", base_price);
        let max_price = format!("{:.2}", ((rng.gen::<f64>() * (base_price * 0.5f64)) + base_price));

        lines.push(vec!(index, name, min_price, max_price).join(", "));
    }

    lines
}
