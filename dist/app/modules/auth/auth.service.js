"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createBycryptPassword_1 = __importDefault(require("../../../helpers/createBycryptPassword"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
const EmailTemplates_1 = __importDefault(require("../../../shared/EmailTemplates"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const generatateOpt_1 = __importStar(require("../../../utils/generatateOpt"));
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // checking is user buyer
    const { password: givenPassword } = user, rest = __rest(user, ["password"]);
    if (!givenPassword) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Password is required');
    }
    const otp = (0, generatateOpt_1.default)();
    const genarateBycryptPass = yield (0, createBycryptPassword_1.default)(givenPassword);
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: user.email },
    });
    // create data
    const dataToCreate = Object.assign(Object.assign({ password: genarateBycryptPass }, rest), { 
        // only for super admin
        role: rest.email === config_1.default.mainAdminEmail
            ? client_1.EUserRole.SUPER_ADMIN // super admin
            : client_1.EUserRole.USER, isVerified: false, isBlocked: false });
    // if user and account exits
    if ((isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.id) && isUserExist.isVerified) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'User already exits');
    }
    const newUser = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // delete if all opt
        // if  user already exits but not verified
        if ((isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.id) && !isUserExist.isVerified) {
            // start new  transection  for new user
            yield tx.verificationOtp.deleteMany({
                where: { ownById: isUserExist.id },
            });
            yield tx.user.delete({ where: { id: isUserExist.id } });
        }
        const newUserInfo = yield tx.user.create({
            data: dataToCreate,
        });
        // create new otp
        yield tx.verificationOtp.create({
            data: {
                ownById: newUserInfo.id,
                otp: otp,
                type: client_1.EVerificationOtp.createUser,
            },
        });
        return newUserInfo;
    }));
    if (!(newUser === null || newUser === void 0 ? void 0 : newUser.id)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'failed to create user');
    }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, id, email, name } = newUser, others = __rest(newUser, ["password", "id", "email", "name"]);
    //create access token & refresh token
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role: newUser.role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role: newUser.role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        user: Object.assign({ email, id, name }, others),
        accessToken,
        refreshToken,
        otp,
    };
    // eslint-disable-next-line no-unused-vars
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email: givenEmail, password } = payload;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: givenEmail },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (isUserExist.password &&
        !(yield bcryptjs_1.default.compare(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    //create access token & refresh token
    const { email, id, role, name } = isUserExist, others = __rest(isUserExist, ["email", "id", "role", "name"]);
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        user: Object.assign({ email, id, name, role }, others),
        accessToken,
        refreshToken,
    };
});
const googleLoginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email: givenEmail, photoUrl, gId, name: givenName } = payload;
    let user;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: givenEmail },
    });
    if (!isUserExist) {
        // throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
        // create one
        const generateBycryptGid = yield (0, createBycryptPassword_1.default)(gId);
        const newUser = yield prisma_1.default.user.create({
            data: {
                email: givenEmail,
                name: givenName || 'unknown',
                photoUrl,
                gId: generateBycryptGid,
                role: client_1.EUserRole.USER,
                isVerified: true,
                isBlocked: false,
                loginProvider: 'google',
            },
        });
        user = newUser;
    }
    else {
        const generateBycryptGid = yield (0, createBycryptPassword_1.default)(gId);
        // check user was login with normalEmail
        if (!isUserExist.gId) {
            // linking
            const updateUserGId = yield prisma_1.default.user.update({
                where: { email: givenEmail },
                data: { gId: generateBycryptGid },
            });
            user = updateUserGId;
        }
        else {
            // check is user was login with google
            if (generateBycryptGid !== isUserExist.gId) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'User Gid does not match!');
            }
            user = isUserExist;
        }
    }
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    //create access token & refresh token
    const { email, id, role, name } = user, others = __rest(user, ["email", "id", "role", "name"]);
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        user: Object.assign({ email, id, name, role }, others),
        accessToken,
        refreshToken,
    };
});
const loginAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email: givenEmail, password } = payload;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: givenEmail },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (isUserExist.password &&
        !(yield bcryptjs_1.default.compare(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    //create access token & refresh token
    const { email, role } = isUserExist;
    if (role === client_1.EUserRole.USER) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Your are not a admin');
    }
    const otp = (0, generatateOpt_1.default)();
    const verificationOtp = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.verificationOtp.deleteMany({
            where: { ownById: isUserExist.id },
        });
        return yield tx.verificationOtp.create({
            data: {
                ownById: isUserExist.id,
                otp: otp,
                type: client_1.EVerificationOtp.adminLogin,
            },
        });
    }));
    if (!verificationOtp.otp) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to generate otp');
    }
    yield (0, sendEmail_1.default)({ to: email }, {
        subject: EmailTemplates_1.default.adminLogin.subject,
        html: EmailTemplates_1.default.adminLogin.html({ token: otp }),
    });
    return {
        otp: 'otp send',
    };
});
const verifyOtpForAdminLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email: givenEmail, password } = payload;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: givenEmail },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (isUserExist.password &&
        !(yield bcryptjs_1.default.compare(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    const isTokenExit = yield prisma_1.default.verificationOtp.findFirst({
        where: {
            ownById: isUserExist.id,
            otp: payload.opt,
            type: client_1.EVerificationOtp.adminLogin,
        },
    });
    if (!isTokenExit) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'OTP is not match');
    }
    // check time validation
    if ((0, generatateOpt_1.checkTimeOfOTP)(isTokenExit.createdAt)) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'OPT is expired!');
    }
    //create access token & refresh
    const { email, id, role, name } = isUserExist, others = __rest(isUserExist, ["email", "id", "role", "name"]);
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        user: Object.assign({ email, id, name, role }, others),
        accessToken,
        refreshToken,
    };
});
const resendEmail = (givenEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: givenEmail },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isVerified) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User already verified');
    }
    const otp = (0, generatateOpt_1.default)();
    //create access token & refresh token
    const { email, id, role, name } = isUserExist, others = __rest(isUserExist, ["email", "id", "role", "name"]);
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const verificationOtp = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.verificationOtp.deleteMany({
            where: { ownById: isUserExist.id },
        });
        return yield tx.verificationOtp.create({
            data: {
                ownById: isUserExist.id,
                otp: otp,
                type: client_1.EVerificationOtp.createUser,
            },
        });
    }));
    if (!verificationOtp.id) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Cannot create verification Otp');
    }
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        user: Object.assign({ email, id, name, role }, others),
        accessToken,
        refreshToken: refreshToken,
        otp,
    };
});
const sendForgotEmail = (givenEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: givenEmail },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const otp = (0, generatateOpt_1.default)();
    //create access token & refresh token
    const { email } = isUserExist;
    const verificationOtp = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.verificationOtp.deleteMany({
            where: { ownById: isUserExist.id },
        });
        return yield tx.verificationOtp.create({
            data: {
                ownById: isUserExist.id,
                otp: otp,
                type: client_1.EVerificationOtp.forgotPassword,
            },
        });
    }));
    if (!verificationOtp.id) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Cannot create verification Otp');
    }
    yield (0, sendEmail_1.default)({ to: email }, {
        subject: EmailTemplates_1.default.verifyForgot.subject,
        html: EmailTemplates_1.default.verifyForgot.html({ token: otp }),
    });
    return {
        otp,
    };
});
const sendDeleteUserEmail = (givenEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: givenEmail },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const otp = (0, generatateOpt_1.default)();
    //create access token & refresh token
    const { email } = isUserExist;
    console.log(email);
    const verificationOtp = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.verificationOtp.deleteMany({
            where: { ownById: isUserExist.id },
        });
        return yield tx.verificationOtp.create({
            data: {
                ownById: isUserExist.id,
                otp: otp,
                type: client_1.EVerificationOtp.deleteUser,
            },
        });
    }));
    if (!verificationOtp.id) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Cannot create verification Otp');
    }
    yield (0, sendEmail_1.default)({ to: email }, {
        subject: EmailTemplates_1.default.deleteUser.subject,
        html: EmailTemplates_1.default.deleteUser.html({ token: otp }),
    });
    return {
        otp,
    };
});
const verifySignupToken = (token, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // check is token match and valid
    const isTokenExit = yield prisma_1.default.verificationOtp.findFirst({
        where: {
            ownById: userId,
            otp: token,
            type: client_1.EVerificationOtp.createUser,
        },
    });
    if (!isTokenExit) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'OTP is not match');
    }
    // check time validation
    if ((0, generatateOpt_1.checkTimeOfOTP)(isTokenExit.createdAt)) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'OPT is expired!');
    }
    //generate new Access token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        userId: isUserExist.id,
        role: isUserExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    // delete all otp
    yield prisma_1.default.verificationOtp.deleteMany({
        where: { ownById: isUserExist.id },
    });
    const result = yield prisma_1.default.user.update({
        where: { id: isUserExist.id },
        data: { isVerified: true },
    });
    if (!result) {
        new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'user not found');
    }
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId: isUserExist.id, role: isUserExist.role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const _a = result, { password } = _a, rest = __rest(_a, ["password"]);
    return {
        accessToken: newAccessToken,
        refreshToken,
        user: rest,
    };
});
const verifyDeleteUserToken = (token, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: userEmail },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    console.log(token, userEmail);
    // check is token match and valid
    const isTokenExit = yield prisma_1.default.verificationOtp.findFirst({
        where: {
            ownById: isUserExist.id,
            otp: token,
            type: client_1.EVerificationOtp.deleteUser,
        },
    });
    if (!isTokenExit) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'OTP is not match');
    }
    // check time validation
    if ((0, generatateOpt_1.checkTimeOfOTP)(isTokenExit.createdAt)) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'OPT is expired!');
    }
    // delete all otp user
    const result = yield prisma_1.default.user.delete({
        where: {
            id: isUserExist.id,
        },
    });
    if (!result.id) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    return {
        token,
        isValidate: true,
        deletedUserId: result.id,
    };
});
const verifyForgotToken = (token, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: userEmail },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // check is token match and valid
    const isTokenExit = yield prisma_1.default.verificationOtp.findFirst({
        where: {
            ownById: isUserExist.id,
            otp: token,
            type: client_1.EVerificationOtp.forgotPassword,
        },
    });
    if (!isTokenExit) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'OTP is not match');
    }
    // check time validation
    if ((0, generatateOpt_1.checkTimeOfOTP)(isTokenExit.createdAt)) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'OPT is expired!');
    }
    // delete all otp
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    return {
        token,
        isValidate: true,
    };
});
const changePassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ password, email, otp, }) {
    // checking is user buyer
    // check is token match and valid
    const genarateBycryptPass = yield (0, createBycryptPassword_1.default)(password);
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: email },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    const isTokenExit = yield prisma_1.default.verificationOtp.findFirst({
        where: {
            ownById: isUserExist.id,
            otp,
            type: client_1.EVerificationOtp.forgotPassword,
        },
    });
    if (!isTokenExit) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'OTP is not match');
    }
    if ((0, generatateOpt_1.checkTimeOfOTP)(isTokenExit.createdAt)) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'OPT is expired!');
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.verificationOtp.deleteMany({
            where: {
                ownById: isUserExist.id,
            },
        });
        return yield tx.user.update({
            where: { id: isUserExist.id },
            data: { password: genarateBycryptPass },
        });
    }));
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Something went wrong');
    }
    //create access token & refresh token
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: isUserExist.id, role: isUserExist.role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId: isUserExist.id, role: isUserExist.role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        user: result,
        accessToken,
        refreshToken,
        otp,
    };
    // eslint-disable-next-line no-unused-vars
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    //verify token
    // invalid token - synchronous
    let verifiedToken = null;
    console.log({ token });
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    const { id: idToken } = verifiedToken;
    // checking deleted user's refresh token
    const isUserExist = yield prisma_1.default.user.findFirst({ where: { id: idToken } });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    //generate new Access token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        userId: isUserExist.id,
        role: isUserExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const { email, id, role, name, password } = isUserExist, others = __rest(isUserExist, ["email", "id", "role", "name", "password"]);
    return {
        accessToken: newAccessToken,
        refreshToken: token,
        user: Object.assign({ email, id, role, name }, others),
    };
});
exports.AuthService = {
    createUser,
    loginUser,
    refreshToken,
    verifySignupToken,
    resendEmail,
    sendForgotEmail,
    verifyForgotToken,
    changePassword,
    sendDeleteUserEmail,
    verifyDeleteUserToken,
    loginAdmin,
    verifyOtpForAdminLogin,
    googleLoginUser,
};
