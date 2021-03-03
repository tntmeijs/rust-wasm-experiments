import Typography from "@material-ui/core/Typography";
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
        </>
    );
}
