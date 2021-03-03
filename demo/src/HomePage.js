import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

export default function HomePage() {
    return (
        <>
            <Typography variant="h2">Rust and WebAssembly</Typography>
            <br />
            <Typography paragraph={true}>
                This website aims to serve as a nice front-end to demonstrate the power of WebAssembly.
            </Typography>
            <Typography paragraph={true}>
                According to the project's website, <Link href="https://webassembly.org" target="_blank">WebAssembly</Link>
                (or "Wasm" for short) is a binary instruction
                <br />
                format for the web. Wasm is designed as a portable compilation target for programming languages.
            </Typography>
            <Typography paragraph={true}>
                Since Wasm can be used as a compilation target, we can use a wide variety of languages to write
                <br />
                our applications in. A C++ program is compiled into, for example, <Link href="https://en.wikipedia.org/wiki/Assembly_language" target="_blank">x64 Assembly.</Link> But instead of
                <br />
                targeting x64, we could target Wasm and bring our code to the web!
            </Typography>
            <Typography paragraph={true}>
                This application demonstrates the power of WebAssembly by running an imaginary workload in the
                <br />
                browser. This workload consists out of parsing CSV data with dummy "transaction" information.
                <br />
                At the end of the calculation, various results are gathered and displayed.
            </Typography>
        </>
    );
}
