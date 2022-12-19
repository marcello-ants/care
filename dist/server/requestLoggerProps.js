"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const universal_cookie_1 = __importDefault(require("universal-cookie"));
const device_detector_js_1 = __importDefault(require("device-detector-js"));
const czenCookiesHelper_noConfig_1 = require("../utilities/czenCookiesHelper.noConfig");
const constants_1 = require("../constants");
const deviceDetector = new device_detector_js_1.default();
/**
 * Returns an object with properties that will be merged into all events logged via `req.log`.
 * @param req
 */
function requestLoggerProps(req) {
    const props = {};
    const cookies = new universal_cookie_1.default(req.headers.cookie);
    props.czenVisitorId = cookies.get(constants_1.CZEN_VISITOR_COOKIE_KEY);
    const testCookie = (0, czenCookiesHelper_noConfig_1.processTestCookie)(cookies.get(constants_1.TEST_COOKIE_KEY), true);
    if (testCookie) {
        const schwingyDesktopPreAccountCreationTestCookieId = process.env.SCHWINGY_DESKTOP_PRE_ACCOUNT_CREATION_TEST_COOKIE_ID;
        const regularTestCellDesktopSeekerCookieId = process.env.REGULAR_TEST_CELL_DESKTOP_SEEKER_COOKIE_ID;
        const personalizedTestCellSEODesktopSeekerCookieId = process.env.PERSONALIZED_TEST_CELL_SEO_DESKTOP_SEEKER_COOKIE_ID;
        const personalizedTestCellCCMobileSeekerCookieId = process.env.PERSONALIZED_TEST_CELL_CC_MOBILE_SEEKER_COOKIE_ID;
        const personalizedTestCellTUMobileSeekerCookieId = process.env.PERSONALIZED_TEST_CELL_TU_MOBILE_SEEKER_COOKIE_ID;
        const personalizedTestCellHKMobileSeekerCookieId = process.env.PERSONALIZED_TEST_CELL_HK_MOBILE_SEEKER_COOKIE_ID;
        const personalizedTestCellPCMobileSeekerCookieId = process.env.PERSONALIZED_TEST_CELL_PC_MOBILE_SEEKER_COOKIE_ID;
        const personalizedTestCellCCDesktopSeekerJoinCookieId = process.env.PERSONALIZED_TEST_CELL_CC_DESKTOP_SEEKER_JOIN_COOKIE_ID;
        const personalizedTestCellTUDesktopSeekerJoinCookieId = process.env.PERSONALIZED_TEST_CELL_TU_DESKTOP_SEEKER_JOIN_COOKIE_ID;
        const personalizedTestCellHKDesktopSeekerJoinCookieId = process.env.PERSONALIZED_TEST_CELL_HK_DESKTOP_SEEKER_JOIN_COOKIE_ID;
        const personalizedTestCellPCDesktopSeekerJoinCookieId = process.env.PERSONALIZED_TEST_CELL_PC_DESKTOP_SEEKER_JOIN_COOKIE_ID;
        const personalizedTestCellCCDesktopSeekerSchwingyCookieId = process.env.PERSONALIZED_TEST_CELL_CC_DESKTOP_SEEKER_SCHWINGY_COOKIE_ID;
        const personalizedTestCellCCMobileSeekerSemCookieId = process.env.PERSONALIZED_TEST_CELL_CC_MOBILE_SEEKER_SEM_COOKIE_ID;
        if (schwingyDesktopPreAccountCreationTestCookieId &&
            regularTestCellDesktopSeekerCookieId &&
            personalizedTestCellSEODesktopSeekerCookieId) {
            const activeSCTest = (0, czenCookiesHelper_noConfig_1.findActiveSCSeekerTestNoConfig)(testCookie, schwingyDesktopPreAccountCreationTestCookieId, regularTestCellDesktopSeekerCookieId, personalizedTestCellSEODesktopSeekerCookieId);
            if (activeSCTest) {
                props.testId = activeSCTest.testId;
                props.testCellId = activeSCTest.testCellId;
            }
        }
        if (personalizedTestCellCCMobileSeekerCookieId &&
            personalizedTestCellCCMobileSeekerSemCookieId &&
            personalizedTestCellCCDesktopSeekerJoinCookieId &&
            personalizedTestCellCCDesktopSeekerSchwingyCookieId) {
            const activeCCTest = (0, czenCookiesHelper_noConfig_1.findActiveCCSeekerTestNoConfig)(testCookie, personalizedTestCellCCMobileSeekerCookieId, personalizedTestCellCCMobileSeekerSemCookieId, personalizedTestCellCCDesktopSeekerJoinCookieId, personalizedTestCellCCDesktopSeekerSchwingyCookieId);
            if (activeCCTest) {
                props.testId = activeCCTest.testId;
                props.testCellId = activeCCTest.testCellId;
            }
        }
        if (personalizedTestCellHKMobileSeekerCookieId &&
            personalizedTestCellHKDesktopSeekerJoinCookieId) {
            const activeHKTest = (0, czenCookiesHelper_noConfig_1.findActiveHKSeekerTestNoConfig)(testCookie, personalizedTestCellHKMobileSeekerCookieId, personalizedTestCellHKDesktopSeekerJoinCookieId);
            if (activeHKTest) {
                props.testId = activeHKTest.testId;
                props.testCellId = activeHKTest.testCellId;
            }
        }
        if (personalizedTestCellPCMobileSeekerCookieId &&
            personalizedTestCellPCDesktopSeekerJoinCookieId) {
            const activePCTest = (0, czenCookiesHelper_noConfig_1.findActivePCSeekerTestNoConfig)(testCookie, personalizedTestCellPCMobileSeekerCookieId, personalizedTestCellPCDesktopSeekerJoinCookieId);
            if (activePCTest) {
                props.testId = activePCTest.testId;
                props.testCellId = activePCTest.testCellId;
            }
        }
        if (personalizedTestCellTUMobileSeekerCookieId &&
            personalizedTestCellTUDesktopSeekerJoinCookieId) {
            const activeTUTest = (0, czenCookiesHelper_noConfig_1.findActiveTUSeekerTestNoConfig)(testCookie, personalizedTestCellTUMobileSeekerCookieId, personalizedTestCellTUDesktopSeekerJoinCookieId);
            if (activeTUTest) {
                props.testId = activeTUTest.testId;
                props.testCellId = activeTUTest.testCellId;
            }
        }
        props.testCookies = testCookie;
    }
    else {
        props.testCookies = cookies.get(constants_1.TEST_COOKIE_KEY);
    }
    const deviceDetectorResult = deviceDetector.parse(req.headers['user-agent'] ?? '');
    props.deviceType = deviceDetectorResult.device?.type;
    return props;
}
exports.default = requestLoggerProps;
