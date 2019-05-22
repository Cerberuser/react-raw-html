"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_test_renderer_1 = __importDefault(require("react-test-renderer"));
const src_1 = require("../src");
test("Raw HTML renders correctly", () => {
    const component = react_test_renderer_1.default.create(React.createElement(src_1.HTMLComponent, { rawHTML: "<span>Text</span>" }));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
//# sourceMappingURL=HTMLComponent.test.js.map