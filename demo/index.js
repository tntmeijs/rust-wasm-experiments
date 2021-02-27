const onUploadFile = event => {
    const files = event.target.files;

    for (let i = 0; i < files.length; ++i) {
        parseFileWasm(files[i]);
    }
};

const parseFileWasm = blob => {
    import("tx-parser-rs").then(txParser => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = () => {
            const bytes = new Uint8Array(reader.result);
            console.info(JSON.parse(txParser.process(bytes)));
        };
    });
}

document.getElementById("file-upload").addEventListener("change", onUploadFile);
