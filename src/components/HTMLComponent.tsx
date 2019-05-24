import * as React from "react";
import { Script } from "./Script";

export interface HTMLComponentProps {
    rawHTML: string;
}

export class HTMLComponent extends React.Component<HTMLComponentProps> {

    render() {
        return <React.Fragment>{this.parseHTML()}</React.Fragment>;
    }

    private parseHTML() {
        const div = document.createElement("div");
        div.innerHTML = this.props.rawHTML;
        return Array.from(div.childNodes).map(this.mapChild);
    }

    private mapChild = (child: ChildNode, index: number): React.ReactNode => {
        if (child instanceof Element) {
            if (child instanceof HTMLScriptElement) {
                return <Script key={"script-" + index} rawTag={child}/>;
            }
            return React.createElement(child.tagName.toLowerCase(), {
                children: Array.from(child.childNodes).map(this.mapChild),
                key: child.tagName + "-" + index,
                ...(Array.from(child.attributes).reduce((obj, prop) => ({
                    ...obj,
                    [prop.name]: prop.value,
                }), {})),
            });
        } else if (child instanceof Text) {
            const text = child.textContent;
            return !text || text.trim() === "" ? null : text;
        } else {
            return "Unknown node";
        }
    }

}
