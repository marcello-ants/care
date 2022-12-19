"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findActivePCSeekerTestNoConfig = exports.findActiveHKSeekerTestNoConfig = exports.findActiveTUSeekerTestNoConfig = exports.findActiveCCSeekerTestNoConfig = exports.findActiveSCSeekerTestNoConfig = exports.processTestCookie = exports.personalizedTestCellHKDesktopSeeker = exports.personalizedTestCellPCDesktopSeeker = exports.personalizedTestCellTUDesktopSeeker = exports.personalizedTestCellHKMobileSeeker = exports.personalizedTestCellPCMobileSeeker = exports.personalizedTestCellTUMobileSeeker = exports.personalizedTestCellCCMobileSeekerSem = exports.personalizedTestCellCCDesktopSeekerJoin = exports.personalizedTestCellCCDesktopSeekerSchwingy = exports.personalizedTestCellCCMobileSeeker = exports.personalizedTestCellSEODesktopSeeker = exports.regularTestCellDesktopSeeker = exports.regularTestCellSchwingyDesktopSeeker = void 0;
exports.regularTestCellSchwingyDesktopSeeker = {
    testId: 'sc-desktop-seeker-enrollment',
    testCellId: 'sc-desktop-seeker-enrollment-mfe',
};
exports.regularTestCellDesktopSeeker = {
    testId: 'enrollment-flow-before-account-creation',
    testCellId: 'enrollment-flow-mid-intent',
};
exports.personalizedTestCellSEODesktopSeeker = {
    testId: 'enrollment-flow-before-account-creation',
    testCellId: 'enrollment-mfe-flow',
};
exports.personalizedTestCellCCMobileSeeker = {
    testId: 'mobile-basic-seeker-enrollment',
    testCellId: 'mobile-seeker-cc-mfe',
};
exports.personalizedTestCellCCDesktopSeekerSchwingy = {
    testId: 'cc-desktop-seeker-enrollment',
    testCellId: 'cc-desktop-seeker-enrollment-mfe',
};
exports.personalizedTestCellCCDesktopSeekerJoin = {
    testId: 'enrollment-flow-before-account-creation',
    testCellId: 'enrollment-flow-cc-mfe',
};
exports.personalizedTestCellCCMobileSeekerSem = {
    testId: 'mobile-basic-seeker-enrollment',
    testCellId: 'mobile-seeker-cc-mfe-sem',
};
exports.personalizedTestCellTUMobileSeeker = {
    testId: 'mobile-basic-seeker-enrollment',
    testCellId: 'tut-seeker-mobile-enrollment-mfe',
};
exports.personalizedTestCellPCMobileSeeker = {
    testId: 'mobile-basic-seeker-enrollment',
    testCellId: 'mobile-seeker-pc-mfe',
};
exports.personalizedTestCellHKMobileSeeker = {
    testId: 'mobile-basic-seeker-enrollment',
    testCellId: 'mobile-seeker-hk-mfe',
};
exports.personalizedTestCellTUDesktopSeeker = {
    testId: 'tut-desktop-seeker-enrollment',
    testCellId: 'tut-seeker-desktop-enrollment-mfe',
};
exports.personalizedTestCellPCDesktopSeeker = {
    testId: 'pc-desktop-seeker-enrollment',
    testCellId: 'pc-desktop-seeker-enrollment-mfe',
};
exports.personalizedTestCellHKDesktopSeeker = {
    testId: 'hk-desktop-seeker-enrollment',
    testCellId: 'hk-desktop-seeker-enrollment-mfe',
};
// preParsed=true means the testCookie value is in the format "test1|test2|test3
// preParsed=false means the testCookie value is in the format "test1%7Ctest2%7Ctest3
function processTestCookie(testCookie, preParsed) {
    if (testCookie) {
        if (preParsed) {
            return testCookie.split('|');
        }
        return testCookie.split('%7C');
    }
    return undefined;
}
exports.processTestCookie = processTestCookie;
function findActiveSCSeekerTestNoConfig(activeTests, schwingyDesktopPreAccountCreationTestCookieId, regularTestCellDesktopSeekerCookieId, personalizedTestCellSEODesktopSeekerCookieId) {
    if (activeTests.includes(schwingyDesktopPreAccountCreationTestCookieId)) {
        return exports.regularTestCellSchwingyDesktopSeeker;
    }
    if (activeTests.includes(regularTestCellDesktopSeekerCookieId)) {
        return exports.regularTestCellDesktopSeeker;
    }
    if (activeTests.includes(personalizedTestCellSEODesktopSeekerCookieId)) {
        return exports.personalizedTestCellSEODesktopSeeker;
    }
    return undefined;
}
exports.findActiveSCSeekerTestNoConfig = findActiveSCSeekerTestNoConfig;
function findActiveCCSeekerTestNoConfig(activeTests, personalizedTestCellCCMobileSeekerCookieId, personalizedTestCellCCDesktopSeekerSchwingyCookieId, personalizedTestCellCCDesktopSeekerJoinCookieId, personalizedTestCellCCMobileSeekerSemCookieId) {
    if (activeTests.includes(personalizedTestCellCCMobileSeekerCookieId)) {
        return exports.personalizedTestCellCCMobileSeeker;
    }
    if (activeTests.includes(personalizedTestCellCCDesktopSeekerSchwingyCookieId)) {
        return exports.personalizedTestCellCCDesktopSeekerSchwingy;
    }
    if (activeTests.includes(personalizedTestCellCCDesktopSeekerJoinCookieId)) {
        return exports.personalizedTestCellCCDesktopSeekerJoin;
    }
    if (activeTests.includes(personalizedTestCellCCMobileSeekerSemCookieId)) {
        return exports.personalizedTestCellCCMobileSeekerSem;
    }
    return undefined;
}
exports.findActiveCCSeekerTestNoConfig = findActiveCCSeekerTestNoConfig;
function findActiveTUSeekerTestNoConfig(activeTests, personalizedTestCellTUMobileSeekerCookieId, personalizedTestCellTUDesktopSeekerJoinCookieId) {
    if (activeTests.includes(personalizedTestCellTUMobileSeekerCookieId)) {
        return exports.personalizedTestCellTUMobileSeeker;
    }
    if (activeTests.includes(personalizedTestCellTUDesktopSeekerJoinCookieId)) {
        return exports.personalizedTestCellTUDesktopSeeker;
    }
    return undefined;
}
exports.findActiveTUSeekerTestNoConfig = findActiveTUSeekerTestNoConfig;
function findActiveHKSeekerTestNoConfig(activeTests, personalizedTestCellHKMobileSeekerCookieId, personalizedTestCellHKDesktopSeekerJoinCookieId) {
    if (activeTests.includes(personalizedTestCellHKMobileSeekerCookieId)) {
        return exports.personalizedTestCellHKMobileSeeker;
    }
    if (activeTests.includes(personalizedTestCellHKDesktopSeekerJoinCookieId)) {
        return exports.personalizedTestCellHKDesktopSeeker;
    }
    return undefined;
}
exports.findActiveHKSeekerTestNoConfig = findActiveHKSeekerTestNoConfig;
function findActivePCSeekerTestNoConfig(activeTests, personalizedTestCellPCMobileSeekerCookieId, personalizedTestCellPCDesktopSeekerJoinCookieId) {
    if (activeTests.includes(personalizedTestCellPCMobileSeekerCookieId)) {
        return exports.personalizedTestCellPCMobileSeeker;
    }
    if (activeTests.includes(personalizedTestCellPCDesktopSeekerJoinCookieId)) {
        return exports.personalizedTestCellPCDesktopSeeker;
    }
    return undefined;
}
exports.findActivePCSeekerTestNoConfig = findActivePCSeekerTestNoConfig;
