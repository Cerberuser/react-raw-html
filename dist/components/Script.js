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
const ReactDOM = __importStar(require("react-dom"));
class Script extends React.Component {
    render() {
        return React.createElement("div", null);
    }
    componentDidMount() {
        const node = ReactDOM.findDOMNode(this);
        const script = document.createElement("script");
        script.textContent = this.props.rawTag.textContent;
        for (const prop in this.props.rawTag.attributes) {
            if (this.props.rawTag.getAttribute(prop)) {
                script.setAttribute(prop, this.props.rawTag.getAttribute(prop));
            }
        }
        node.innerHTML = "";
        node.appendChild(script);
    }
}
exports.Script = Script;
//# sourceMappingURL=Script.js.map