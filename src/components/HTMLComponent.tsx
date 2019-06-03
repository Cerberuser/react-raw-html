import * as React from "react";
import { unreachable } from "unreachable-ts";
import { Script } from "./Script";

export type ScriptBehaviour = "run" | "omit" | "asText" | "error";

export interface HTMLComponentProps {
    rawHTML: string;
    onScript: ScriptBehaviour;
}

export class HTMLComponent extends React.Component<HTMLComponentProps> {

    static defaultProps = {
        onScript: "asText",
    };

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
                return this.scriptRender(index, child);
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
    };

    private mapAttributes = (child: Element) => {
        const mapAttr = (attr: Attr) => {
            switch (attr.name) {
                case "style":
                    const style = (child as HTMLElement).style;
                    return Array.from(style)
                        .reduce((obj, key) => ({
                            ...obj,
                            [
                                key.replace((/-(.)/g), (match) => match[1].toUpperCase())
                                ]: style[key as keyof CSSStyleDeclaration],
                        }), {});
                default:
                    return attr.value;
            }
        };
        return Array.from(child.attributes).reduce((obj, prop) => ({
            ...obj,
            [prop.name]: mapAttr(prop),
        }), {});
    };

    private scriptRender = (index: number, script: HTMLScriptElement) => {
        switch (this.props.onScript) {
            case "run":
                return <Script key={"script-" + index} rawTag={script}/>;
            case "asText":
                return script.outerHTML;
            case "omit":
                return null;
            case "error":
                throw new Error("Script tags are not allowed here");
            default:
                return unreachable(this.props.onScript, "onScript prop value in unexpected");
        }
    };

}
