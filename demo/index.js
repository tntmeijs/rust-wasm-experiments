const onUploadFile = event => {
    const files = event.target.files;

    for (let i = 0; i < files.length; ++i) {
        parseFileWasm(files[i]);
    }
};

const parseFileWasm = file => {
    import("tx-parser-rs").then(txParser => {
        txParser.greet(file.name)
    });
}

document.getElementById("file-upload").addEventListener("change", onUploadFile);
