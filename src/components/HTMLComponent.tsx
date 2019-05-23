import * as React from "react";
import { Script } from "./Script";

export interface HTMLComponentProps {
    rawHTML: string;
}

export class HTMLComponent extends React.Component<HTMLComponentProps> {

    render() {
        return <React.Fragment>{this.parseHTML()}</React.Fragment>;
    }

    parseHTML() {
        const div = document.createElement("div");
        div.innerHTML = this.props.rawHTML;
        return Array.from(div.childNodes).map((node, i) => {
            if (node instanceof Element) {
                if (node instanceof HTMLScriptElement) {
                    return <Script rawTag={node}/>;
                }
                return React.createElement(node.tagName.toLowerCase(), {
                    children: Array.from(node.childNodes).map((innerNode) => innerNode.textContent),
                    key: i,
                });
            } else if (node instanceof Text) {
                return node.textContent;
            } else {
                return "Unknown node";
            }
        });
    }

}
