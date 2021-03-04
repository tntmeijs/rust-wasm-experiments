import RenderIf from "./RenderIf";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useRef, useState } from "react";
import { Bar } from "react-chartjs-2";

export default function PerformancePage() {
    const uniqueIndex = useRef(0);

    const [txFiles, setTxFiles] = useState([]);
    const [chartLabels, setChartLabels] = useState([]);
    const [rustModuleLoadTime, setRustModuleLoadTime] = useState([]);
    const [rustPreprocessingTime, setRustPreprocessingTime] = useState([]);
    const [rustParsingTime, setRustParsingTime] = useState([]);
    const [jsModuleLoadTime, setJsModuleLoadTime] = useState([]);
    const [jsPreprocessingTime, setJsPreprocessingTime] = useState([]);
    const [jsParsingTime, setJsParsingTime] = useState([]);

    const onFilesSelected = event => {
        setTxFiles(event.target.files);
    };

    const onClearFiles = () => {
        setTxFiles([]);
    };

    const onClearChart = () => {
        setChartLabels([]);
        setRustModuleLoadTime([]);
        setRustPreprocessingTime([]);
        setRustParsingTime([]);
    };

    const onRunBenchmark = () => {
        // Add a new test run
        setChartLabels([...chartLabels, `${txFiles[0].name} [${uniqueIndex.current++}]`]);

        let startTime = performance.now();

        // First, load the Rust module
        import("tx-parser-rs")
            .then(parser => {
                const loadTime = performance.now() - startTime;
                setRustModuleLoadTime([...rustModuleLoadTime, loadTime]);

                // Use JavaScript to convert the file into a binary blob
                startTime = performance.now();

                const reader = new FileReader();
                reader.onload = () => {
                    const bytes = new Uint8Array(reader.result);

                    const preprocessTime = performance.now() - startTime;
                    setRustPreprocessingTime([...rustPreprocessingTime, preprocessTime]);

                    startTime = performance.now();
                    const result = JSON.parse(parser.process(bytes));
                    
                    const parseTime = performance.now() - startTime;
                    setRustParsingTime([...rustParsingTime, parseTime]);
                };

                reader.readAsArrayBuffer(txFiles[0]);
            })
            .catch(error => console.error(error));
    };

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                stack: "rustStack",
                label: "Rust module loading",
                backgroundColor: "rgba(149, 165, 166, 0.2)",
                borderColor: "rgba(149, 165, 166, 1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(149, 165, 166, 0.4)",
                hoverBorderColor: "rgba(149, 165, 166, 1)",
                data: rustModuleLoadTime
            },
            {
                stack: "rustStack",
                label: "Rust preprocessing",
                backgroundColor: "rgba(241, 196, 15, 0.2)",
                borderColor: "rgba(241, 196, 15, 1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(241, 196, 15, 0.4)",
                hoverBorderColor: "rgba(241, 196, 15, 1)",
                data: rustPreprocessingTime
            },
            {
                stack: "rustStack",
                label: "Rust parsing",
                backgroundColor: "rgba(52, 152, 219, 0.2)",
                borderColor: "rgba(52, 152, 219, 1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(52, 152, 219, 0.4)",
                hoverBorderColor: "rgba(52, 152, 219, 1)",
                data: rustParsingTime
            },
            {
                stack: "jsStack",
                label: "JS module loading",
                backgroundColor: "rgba(149, 165, 166, 0.2)",
                borderColor: "rgba(149, 165, 166, 1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(149, 165, 166, 0.4)",
                hoverBorderColor: "rgba(149, 165, 166 ,1)",
                data: jsModuleLoadTime
            },
            {
                stack: "jsStack",
                label: "JS preprocessing",
                backgroundColor: "rgba(241, 196, 15, 0.2)",
                borderColor: "rgba(241, 196, 15, 1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(241, 196, 15, 0.4)",
                hoverBorderColor: "rgba(241, 196, 15, 1)",
                data: jsPreprocessingTime
            },
            {
                stack: "jsStack",
                label: "JS parsing",
                backgroundColor: "rgba(52, 152, 219, 0.2)",
                borderColor: "rgba(52, 152, 219, 1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(52, 152, 219, 0.4)",
                hoverBorderColor: "rgba(52, 152, 219, 1)",
                data: jsParsingTime
            }
        ]
    };

    return (
        <>
            <Typography variant="h2">Performance Test</Typography>
            
            <RenderIf value={chartLabels.length > 0}>
                <Button variant="contained" color="secondary" onClick={onClearChart}>
                    clear chart
                </Button>
            </RenderIf>

            <Bar data={chartData} width={100} height={50} options={{ maintainAspectRatio: false }} />
            
            <RenderIf value={txFiles.length === 0}>
                <input id="file-select" type="file" multiple={false} accept=".csv" onChange={onFilesSelected} />
            </RenderIf>

            <RenderIf value={txFiles.length > 0}>
                <Button variant="contained" color="primary" onClick={onRunBenchmark}>
                    run benchmark
                </Button>
            
                <br />
                <br />
            
                <Button variant="contained" color="secondary" onClick={onClearFiles}>
                    clear file(s)
                </Button>
            </RenderIf>
        </>
    );
}
