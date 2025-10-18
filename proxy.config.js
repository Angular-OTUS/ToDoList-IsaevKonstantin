const PROXY_CONFIG_DEV = {
    "/api": {
        target: "http://localhost:3000",
        secure: false,
        pathRewrite: {"^/api": ""},
    },
};

module.exports = PROXY_CONFIG_DEV;
