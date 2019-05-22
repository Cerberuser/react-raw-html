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
class HTMLComponent extends React.Component {
    render() {
        return React.createElement(React.Fragment, null, this.parseHTML());
    }
    parseHTML() {
        const div = document.createElement("div");
        div.innerHTML = this.props.rawHTML;
        return Array.from(div.childNodes).map((node) => {
            if (node instanceof Element) {
                return React.createElement(node.tagName);
            }
            else if (node instanceof Text) {
                return node.textContent;
            }
            else {
                return "Unknown node";
            }
        });
    }
}
exports.HTMLComponent = HTMLComponent;
//# sourceMappingURL=HTMLComponent.js.map