"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const unreachable_ts_1 = require("unreachable-ts");
const Script_1 = require("./Script");
class HTMLComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.mapChild = (child, index) => {
            if (child instanceof Element) {
                if (child instanceof HTMLScriptElement) {
                    return this.scriptRender(index, child);
                }
                let childComponent;
                switch (child.constructor) {
                    case HTMLHtmlElement:
                    case HTMLHeadElement:
                    case HTMLBodyElement:
                        childComponent = React.Fragment;
                        break;
                    case HTMLTitleElement:
                        return null; // don't use it at all
                    default:
                        childComponent = child.tagName.toLowerCase();
                }
                const props = Object.assign({ children: child.childNodes.length > 0 ? Array.from(child.childNodes).map(this.mapChild) : null, key: child.tagName + "-" + index }, this.mapAttributes(child));
                return React.createElement(childComponent, props);
            }
            else if (child instanceof Text) {
                const text = child.textContent;
                return !text || text.trim() === "" ? null : text;
            }
            else {
                return "Unknown node";
            }
        };
        this.mapAttributes = (child) => {
            const mapAttr = (attr) => {
                switch (attr.name) {
                    case "style":
                        const styleDeclaration = child.style;
                        const style = Array.from(styleDeclaration)
                            .reduce((obj, key) => (Object.assign({}, obj, { [key.replace((/-(.)/g), (match) => match[1].toUpperCase())]: styleDeclaration[key] })), {});
                        return {
                            style,
                        };
                    case "class":
                        return { className: attr.value };
                    default:
                        return { [attr.name]: attr.value };
                }
            };
            return Array.from(child.attributes).reduce((obj, prop) => (Object.assign({}, obj, mapAttr(prop))), {});
        };
        this.scriptRender = (index, script) => {
            switch (this.props.onScript) {
                case "run":
                    return React.createElement(Script_1.Script, { key: "script-" + index, rawTag: script });
                case "asText":
                    return script.outerHTML;
                case "omit":
                    return null;
                case "error":
                    throw new Error("Script tags are not allowed here");
                default:
                    return unreachable_ts_1.unreachable(this.props.onScript, "onScript prop value in unexpected");
            }
        };
    }
    render() {
        return React.createElement(React.Fragment, null, this.parseHTML());
    }
    parseHTML() {
        const div = document.createElement("div");
        div.innerHTML = this.props.rawHTML;
        return Array.from(div.childNodes).map(this.mapChild);
    }
}
HTMLComponent.defaultProps = {
    onScript: "asText",
};
exports.HTMLComponent = HTMLComponent;
//# sourceMappingURL=HTMLComponent.js.map