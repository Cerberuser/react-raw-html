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
        this.parseHTML();
        return React.createElement("div", { dangerouslySetInnerHTML: { __html: this.props.rawHTML } });
    }
    parseHTML() {
        const div = document.createElement("div");
        div.innerHTML = this.props.rawHTML;
        return div.childNodes;
    }
}
exports.HTMLComponent = HTMLComponent;
//# sourceMappingURL=HTMLComponent.js.map