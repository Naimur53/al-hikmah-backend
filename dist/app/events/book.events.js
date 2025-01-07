"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EbookEvents = exports.bookEvents = void 0;
const xoauth2_1 = require("nodemailer/lib/xoauth2");
const prisma_1 = __importDefault(require("../../shared/prisma"));
var EbookEvents;
(function (EbookEvents) {
    EbookEvents["INCREMENT_READ_COUNT"] = "incrementReadCount";
})(EbookEvents || (exports.EbookEvents = EbookEvents = {}));
// write events which call get id of book and update the read count
const bookEvents = new xoauth2_1.EventEmitter();
exports.bookEvents = bookEvents;
bookEvents.on(EbookEvents.INCREMENT_READ_COUNT, (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('event trigger', { bookId });
    const book = yield prisma_1.default.book.update({
        where: { id: bookId },
        data: { totalRead: { increment: 1 } },
    });
}));
