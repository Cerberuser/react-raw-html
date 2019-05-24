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
const Script_1 = require("./Script");
class HTMLComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.mapChild = (child, index) => {
            if (child instanceof Element) {
                if (child instanceof HTMLScriptElement) {
                    return React.createElement(Script_1.Script, { key: "script-" + index, rawTag: child });
                }
                return React.createElement(child.tagName.toLowerCase(), Object.assign({ children: Array.from(child.childNodes).map(this.mapChild), key: child.tagName + "-" + index }, (Array.from(child.attributes).reduce((obj, prop) => (Object.assign({}, obj, { [prop.name]: prop.value })), {}))));
            }
            else if (child instanceof Text) {
                const text = child.textContent;
                return !text || text.trim() === "" ? null : text;
            }
            else {
                return "Unknown node";
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
exports.HTMLComponent = HTMLComponent;
//# sourceMappingURL=HTMLComponent.js.map