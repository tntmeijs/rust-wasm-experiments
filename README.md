# Rust WASM Experiments
This repository contains a simple real-life example of how Rust and WebAssembly can be used to speed up an application.

# Project structure
- demo: Main NodeJS project that glues everything together.
- tx-parser-rs: Rust crate that can be compiled into WebAssembly.
- tx-parser-js: JavaScript implementation of the Rust crate so we can compare performance differences.
