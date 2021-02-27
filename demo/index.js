const onUploadFile = event => {
    const files = event.target.files;

    for (let i = 0; i < files.length; ++i) {
        parseFileWasm(files[i]);
    }
};

const parseFileWasm = blob => {
    console.info("Starting processing now...");
    const t0 = performance.now();
    
    import("tx-parser-rs").then(txParser => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = () => {
            const bytes = new Uint8Array(reader.result);
            console.info(txParser.process(bytes));
    
            const t1 = performance.now();
            console.info(`WebAssembly (Rust) processing time: ${t1 - t0} milliseconds`);
        };
    });
}

document.getElementById("file-upload").addEventListener("change", onUploadFile);
