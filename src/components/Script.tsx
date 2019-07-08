import * as React from "react";
import * as ReactDOM from "react-dom";

interface IScriptProps {
    rawTag: HTMLScriptElement;
    loaders: Array<Promise<any>>;
    defer: { callback: () => void; };
}

export class Script extends React.Component<IScriptProps> {

    render() {
        return <div/>;
    }

    async componentDidMount() {
        const node = ReactDOM.findDOMNode(this) as Element;
        const script = document.createElement("script");
        script.textContent = this.props.rawTag.textContent;
        for (const prop of this.props.rawTag.attributes) {
            script.setAttribute(prop.name, prop.value);
        }
        node.innerHTML = "";
        if (script.src) {
            script.addEventListener("load", this.props.defer.callback);
        } else {
            this.props.defer.callback();
        }
        await Promise.all(this.props.loaders);
        node.appendChild(script);
    }

}
