"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.location = void 0;
const express_1 = __importDefault(require("express"));
const country_state_city_1 = require("country-state-city");
exports.location = express_1.default.Router();
//Get All Country
exports.location.get("/country", (req, res, next) => {
    let getCountry = country_state_city_1.Country.getAllCountries();
    res.status(200).json({ message: "Country get successfully", code: 200, value: getCountry });
});
//Get All State Selected Country
exports.location.get("/state/:countryCode", (req, res, next) => {
    let getCountryCode = `${req.params.countryCode}`;
    let getState = country_state_city_1.State.getStatesOfCountry(getCountryCode);
    res.status(200).json({ message: "State get successfully", code: 200, value: getState });
});
//Get All City Selected Country & State
exports.location.get("/city/:countryCode/:stateCode", (req, res, next) => {
    let getCountryCode = `${req.params.countryCode}`;
    let getStateCode = `${req.params.stateCode}`;
    let getCity = country_state_city_1.City.getCitiesOfState(getCountryCode, getStateCode);
    res.status(200).json({ message: "City get successfully", code: 200, value: getCity });
});
