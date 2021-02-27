const onUploadFile = event => {
    const files = event.target.files;

    for (let i = 0; i < files.length; ++i) {
        parseFileWasm(files[i]);
    }
};

const parseFileWasm = blob => {    
    let start = performance.now();

    import("tx-parser-rs").then(txParser => {
        console.info(`WebAssembly module loaded in (${performance.now() - start}ms)`)
        start = performance.now();

        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = () => {
            const bytes = new Uint8Array(reader.result);

            console.info(`JavaScript loaded the file into a byte array in (${performance.now() - start}ms)`)
            start = performance.now();

            console.info("Starting to parse binary blob now");
            const result = txParser.process(bytes);
            console.info(`Finished parsing binary blob (${performance.now() - start}ms)`);
        };
    });
}

document.getElementById("file-upload").addEventListener("change", onUploadFile);
