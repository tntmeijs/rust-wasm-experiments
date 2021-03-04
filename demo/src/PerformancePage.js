import RenderIf from "./RenderIf";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";
import { Bar } from "react-chartjs-2";

export default function PerformancePage() {
    const [txFiles, setTxFiles] = useState([]);
    const [labels, setLabels] = useState([]);
    const [moduleLoadTime, setModuleLoadTime] = useState(0);
    const [preprocessingTime, setPreprocessingTime] = useState(0);
    const [parsingTime, setParsingTime] = useState(0);

    const onFilesSelected = event => {
        setTxFiles(event.target.files);
    };

    const onClearFiles = () => {
        setTxFiles([]);
    };

    const onRunBenchmark = () => {
        // Add a new test run
        setLabels([...labels, txFiles[0].name]);

        const moduleLoadStartTime = performance.now();

        // First, load the Rust module
        import("tx-parser-rs")
            .then(parser => {
                const moduleLoadTime = performance.now() - moduleLoadStartTime;
                setModuleLoadTime([...moduleLoadTime, moduleLoadTime]);
            })
            .catch(error => console.error(error));
    };

    const chartData = {
        labels: labels,
        datasets: [
            {
                stack: "moduleLoadTime",
                label: "Module loading",
                backgroundColor: "rgba(149, 165, 166, 0.2)",
                borderColor: "rgba(149, 165, 166, 1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(149, 165, 166, 0.4)",
                hoverBorderColor: "rgba(149, 165, 166 ,1)",
                data: moduleLoadTime
            },
            {
                stack: "preprocessingTime",
                label: "Preprocessing",
                backgroundColor: "rgba(241, 196, 15, 0.2)",
                borderColor: "rgba(241, 196, 15, 1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(241, 196, 15, 0.4)",
                hoverBorderColor: "rgba(241, 196, 15, 1)",
                data: preprocessingTime
            },
            {
                stack: "parsingTime",
                label: "Parsing",
                backgroundColor: "rgba(52, 152, 219, 0.2)",
                borderColor: "rgba(52, 152, 219, 1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(52, 152, 219, 0.4)",
                hoverBorderColor: "rgba(52, 152, 219, 1)",
                data: parsingTime
            }
        ]
    };

    return (
        <>
            <Typography variant="h2">Performance Test</Typography>
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
