const onUploadFile = event => {
    processFiles(event.target.files);
};

const onDropFile = event => {
    event.preventDefault();
    let files = [];

    if (event.dataTransfer.items) {
        // Use the DataTransferItemList interface to access files
        Array.from(event.dataTransfer.items).forEach(item => {
            if (item.kind === "file") {
                files.push(item.getAsFile());
            }
        });
    } else {
        // Fallback by using the DataTransfer interface to access files
        files = event.dataTransfer.files;
    }

    processFiles(files);
};

const onDragOver = event => {
    event.preventDefault();
};

const processFiles = files => {
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

const fileUploadInput = document.getElementById("file-upload");
const dropArea = document.getElementById("file-drop-area");

fileUploadInput.addEventListener("change", onUploadFile);
dropArea.addEventListener("drop", onDropFile);
dropArea.addEventListener("dragover", onDragOver);
