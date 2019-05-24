import * as React from "react";
import {Script} from "./Script";

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
                children: child.childNodes.length > 0 ? Array.from(child.childNodes).map(this.mapChild) : null,
                key: child.tagName + "-" + index,
                ...this.mapAttributes(child),
            });
        } else if (child instanceof Text) {
            const text = child.textContent;
            return !text || text.trim() === "" ? null : text;
        } else {
            return "Unknown node";
        }
    }

    private mapAttributes = (child: Element) => {
        const mapAttr = (attr: Attr) => {
            switch (attr.name) {
                case "style":
                    const style = (child as HTMLElement).style;
                    return Array.from(style)
                        .reduce((obj, key) => ({...obj, [key]: style[key as keyof CSSStyleDeclaration]}), {});
                default:
                    return attr.value;
            }
        };
        return Array.from(child.attributes).reduce((obj, prop) => ({
            ...obj,
            [prop.name]: mapAttr(prop),
        }), {});
    }

}
