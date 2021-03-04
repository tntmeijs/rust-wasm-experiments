export default function RenderIf(props) {
    if (props.value) {
        return props.children;
    }

    return null;
}
