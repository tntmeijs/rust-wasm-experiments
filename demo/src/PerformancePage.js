import RenderIf from "./RenderIf";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";
import { Bar } from "react-chartjs-2";

const data = {
    labels: ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh"],
    datasets: [
        {
            stack: "stackId_0",
            label: "My First dataset",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: [1,2,3,4,5,6,7]
        },
        {
            stack: "stackId_0",
            label: "My Second dataset",
            backgroundColor: "rgba(99,255,132,0.2)",
            borderColor: "rgba(99,255,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(99,255,132,0.4)",
            hoverBorderColor: "rgba(99,255,132,1)",
            data: [7,6,5,4,3,2,1]
        }
    ]
};

export default function PerformancePage() {
    const [txFiles, setTxFiles] = useState([]);

    const onFilesSelected = event => {
        setTxFiles(event.target.files);
    };

    const onClearFiles = () => {
        setTxFiles([]);
    };

    return (
        <>
            <Typography variant="h2">Performance Test</Typography>
            <Bar
                data={data}
                width={100}
                height={50}
                options={{
                    maintainAspectRatio: false
                }}
            />

            <RenderIf value={txFiles.length === 0}>
                <input id="file-select" type="file" multiple={true} accept=".csv" onChange={onFilesSelected}/>
            </RenderIf>

            <RenderIf value={txFiles.length > 0}>
                <Button variant="contained" color="secondary" onClick={onClearFiles}>
                    clear file(s)
                </Button>
            </RenderIf>
        </>
    );
}
