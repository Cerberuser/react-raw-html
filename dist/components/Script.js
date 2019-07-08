"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        return __awaiter(this, void 0, void 0, function* () {
            const node = ReactDOM.findDOMNode(this);
            const script = document.createElement("script");
            script.textContent = this.props.rawTag.textContent;
            for (const prop of this.props.rawTag.attributes) {
                script.setAttribute(prop.name, prop.value);
            }
            node.innerHTML = "";
            if (script.src) {
                script.addEventListener("load", this.props.defer.callback);
            }
            else {
                this.props.defer.callback();
            }
            yield Promise.all(this.props.loaders);
            node.appendChild(script);
        });
    }
}
exports.Script = Script;
//# sourceMappingURL=Script.js.map