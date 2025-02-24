const excludePaths = (paths, middleware) => (req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    const isExcluded = paths.some(path => {
        const regex = new RegExp(path.url);
        const match = regex.test(req.url);
        const methodMatch = path.methods.includes(req.method);
        console.log(`Checking path: ${path.url}, Match: ${match}, Method Match: ${methodMatch}`);
        return match && methodMatch;
    });

    if (isExcluded) {
        console.log('Path is excluded');
        next();
    } else {
        console.log('Path is not excluded, applying middleware');
        middleware(req, res, next);
    }
};

module.exports = excludePaths;


