let txParser = null;

/**
 * Bound to the file input field
 * Triggers the file processing logic once it receives files
 * @param {Event} event Event received from the file input element
 */
const onUploadFile = event => {
    processFiles(event.target.files);
};

/**
 * Bound to the element that acts as a drop area
 * Reads the file list and triggers the file processing logic afterwards
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

    processFiles(files);
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
 * Process a list of files using various techniques
 * Main function that kicks off the parsing logic
 * @param {Array} files Array with files that need to be processed
 */
const processFiles = files => {
    for (let i = 0; i < files.length; ++i) {
        parseFileWasm(files[i]);
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
        reader.readAsArrayBuffer(file);
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

// Retrieve references to DOM elements
const fileUploadInput = document.getElementById("file-upload");
const fileUploadContainer = document.getElementById("file-upload-container");
const dropArea = document.getElementById("file-drop-area");

// Bind functions to events
fileUploadInput.addEventListener("change", onUploadFile);
dropArea.addEventListener("drop", onDropFile);
dropArea.addEventListener("dragover", onDragOver);

/**
 * Load the WebAssembly module
 * Once the module has been loaded, the file upload box will be shown to the user
 */
import("tx-parser-rs")
    .then(parser => {
        txParser = parser;
        fileUploadContainer.hidden = false;
    })
    .catch(error => console.error(error));
