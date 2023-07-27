"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const players_1 = __importDefault(require("./players"));
const getPlayerById = (id) => players_1.default.filter(player => player.id === id)[0];
exports.getPlayerById = getPlayerById;

const getPlayerId = (name) => {

    const p = players_1.default.filter(player => player.name.toUpperCase().includes(name.toUpperCase()));
    
    if (p.length > 1) {
        return p;
    } else {
        return p[0].id;
    }
};
exports.getPlayerId = getPlayerId;

const getPlayerMugshot = (options) => {

    if (!options.id && !options.name) {
        throw new Error("Must provide a player name or id.");
    }
    if (options.season && options.season.length !== 8) {
        throw new Error("Season must be formatted as both years, i.e. '20192020'.");
    }
    if (options.team.length !== 3) {
        throw new Error("Use team abbreviation.");
    }
    return `https://assets.nhle.com/mugs/nhl/${options.season ? options.season : "20192020"}/${options.team.toUpperCase()}/${options.id ? options.id : getPlayerId(options.name)}.png`;
};
exports.getPlayerMugshot = getPlayerMugshot;
exports.default = players_1.default;