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
                module: {
                    // See: https://github.com/eemeli/yaml/issues/208
                    rules: [
                        { test: /\.js$/, type: 'javascript/auto' }
                    ]
                },
            };
        },
    };
}

module.exports = fallbacksPlugin;
