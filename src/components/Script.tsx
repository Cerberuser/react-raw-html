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
        const script = document.createElement("script");
        script.textContent = this.props.rawTag.textContent;
        for (const prop in this.props.rawTag.attributes) {
            if (this.props.rawTag.getAttribute(prop)) {
                script.setAttribute(prop, this.props.rawTag.getAttribute(prop)!);
            }
        }
        node.innerHTML = "";
        node.appendChild(script);
    }

}
