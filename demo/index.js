// Rust WebAssembly parser
let txParserRs = null;

// JavaScript parser
import txParserJs from "tx-parser-js";

// List of files to parse
let txFiles = [];

// Start time for JavaScript processing
let jsStartTime = null;

// Start time for WebAssembly processing
let wasmStartTime = null;

/**
 * Bound to the file input field
 * @param {Event} event Event received from the file input element
 */
const onUploadFile = event => {
    txFiles = event.target.files;
};

/**
 * Bound to the element that acts as a drop area
 * @param {Event} event Event received from the element
 */
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

    txFiles = files;
};

/**
 * Used to prevent default browser behaviour when dragging files
 * Without this, the browser would automatically open the file when the user drops it
 * @param {Event} event Event received from the element while dragging
 */
const onDragOver = event => {
    event.preventDefault();
};

/**
 * Process the list of files using the JavaScript parser
 */
const startProcessingJs = () => {
    for (let i = 0; i < txFiles.length; ++i) {
        parseFileJs(txFiles[i]);
    }
};

/**
 * Process the list of files using the WebAssembly parser
 */
const startProcessingWasm = () => {
    for (let i = 0; i < txFiles.length; ++i) {
        parseFileWasm(txFiles[i]);
    }
};

/**
 * Parse a file using a custom Rust WebAssembly module
 * @param {File} file File to parse
 */
const parseFileWasm = file => {    
    let start = performance.now();

    import("tx-parser-rs").then(txParser => {
        console.info(`WebAssembly module loaded in (${performance.now() - start}ms)`)
        start = performance.now();

        const reader = new FileReader();
        reader.onload = () => {
            const bytes = new Uint8Array(reader.result);

            console.info(`JavaScript loaded the file into a byte array in (${performance.now() - start}ms)`)
            start = performance.now();

            console.info("Starting to parse binary blob now");
            const result = JSON.parse(txParser.process(bytes));
            console.info("=== WEBASSEMBLY ===");
            console.info(result);
            console.info(`Finished parsing binary blob (${performance.now() - start}ms)`);
        };

        reader.readAsArrayBuffer(file);
    });
}

/**
 * Parse a file using a custom JavaScript module
 * @param {File} file File to parse
 */
const parseFileJs = file => {
    console.info("Starting JavaScript parsing now");
    let start = performance.now();

    txParserJs.process(file, data => {
        console.info(`JavaScript finished parsing the file (${performance.now() - start}ms)`)
        console.info("=== JAVASCRIPT ===");
        console.info(data);
    });
};

// Retrieve references to DOM elements
const fileUploadInput = document.getElementById("file-upload");
const fileUploadContainer = document.getElementById("file-upload-container");
const dropArea = document.getElementById("file-drop-area");
const processJsButton = document.getElementById("process-js");
const processWasmButton = document.getElementById("process-wasm");

// Bind functions to events
fileUploadInput.addEventListener("change", onUploadFile);
dropArea.addEventListener("drop", onDropFile);
dropArea.addEventListener("dragover", onDragOver);
processJsButton.addEventListener("click", startProcessingJs);
processWasmButton.addEventListener("click", startProcessingWasm);

/**
 * Load the WebAssembly module
 * Once the module has been loaded, all controls will be shown to the user
 */
import("tx-parser-rs")
    .then(parser => {
        txParserRs = parser;
        fileUploadContainer.hidden = false;
        processJsButton.hidden = false;
        processWasmButton.hidden = false;
    })
    .catch(error => console.error(error));
