"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionnaireRoutes_1 = __importDefault(require("./routes/questionnaireRoutes"));
const movieRoutes_1 = __importDefault(require("./routes/movieRoutes"));
const app = (0, express_1.default)();
const port = 3000;
// Routes:
// Questions endpoint
// Movie endpoint
app.use("/questionnaire", questionnaireRoutes_1.default);
app.use("/movie", movieRoutes_1.default);
app.listen(port, () => {
    console.log(`Example app listening on ports ${port}`);
});
//# sourceMappingURL=app.js.map