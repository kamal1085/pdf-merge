const { override, addBabelPlugins } = require("customize-cra");

module.exports = override(
    ...addBabelPlugins(
        ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
        ["@babel/plugin-proposal-class-properties", { "loose": false }],
        ["@babel/plugin-proposal-private-methods", { "loose": false }],
        ["@babel/plugin-proposal-private-property-in-object", { "loose": false }],
        ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
        ["@babel/plugin-proposal-logical-assignment-operators", { "loose": false }]
    ),
    (config) => {
        const babelLoaderRule = {
            test: /\.js$/,
            include: [
                /node_modules\/pdfjs-dist/,
                /node_modules\/react-sortablejs/
            ],
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"],
                    plugins: [
                        ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
                        ["@babel/plugin-proposal-class-properties", { "loose": false }],
                        ["@babel/plugin-proposal-private-methods", { "loose": false }],
                        ["@babel/plugin-proposal-private-property-in-object", { "loose": false }],
                        ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
                        ["@babel/plugin-proposal-logical-assignment-operators", { "loose": false }]
                    ]
                }
            }
        };
        config.module.rules.push(babelLoaderRule);
        return config;
    }
);
