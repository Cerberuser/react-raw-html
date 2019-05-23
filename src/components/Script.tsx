import * as React from "react";
import * as ReactDOM from "react-dom";

interface IScriptProps {
    rawTag: HTMLScriptElement;
}

export class Script extends React.Component<IScriptProps> {

    render() {
        return <div/>;
    }

    componentDidMount() {
        const node = ReactDOM.findDOMNode(this) as Element;
        node.innerHTML = "";
        node.appendChild(this.props.rawTag);
    }

}
