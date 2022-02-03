function fallbacksPlugin(
    context,
    opts,
) {
    return {
        name: 'webpack-fallbacks-plugin',
        configureWebpack(config, isServer, utils, content) {
            return {
                resolve: {
                    alias: {
                        // path: require.resolve('path-browserify'),
                    },
                    fallback: {
                        path: false
                    },
                },
            };
        },
    };
}

module.exports = fallbacksPlugin;
