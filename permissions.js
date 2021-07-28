const ADMIN_PROFILE = '2';

function isAdmin(profile) {
    return profile === ADMIN_PROFILE;
};

module.exports = function (request) {
    const user = request.user;

    if (!user)
        return false;

    const profile = user.profile;
    const originalUrl = request.originalUrl;

    switch (originalUrl) {
        case '/': return true;
        case '/index': return true;
        case '/login': return true;
        case '/signup': return true;
        case '/logoff': return true;
        case '/reports': return isAdmin(profile);
        default: return false;
    }
}