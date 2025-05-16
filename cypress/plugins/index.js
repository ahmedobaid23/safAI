import webpack from "@cypress/webpack-preprocessor";

module.exports = (on, config) => {
  const options = {
    webpackOptions: {
      resolve: {
        extensions: [".ts", ".tsx", ".js"],
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "ts-loader",
                options: {
                  transpileOnly: true, // speeds up compilation
                },
              },
            ],
          },
        ],
      },
    },
  };

  on("file:preprocessor", webpack(options));

  return config;
};
