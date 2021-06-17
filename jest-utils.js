function overrideTsConfig(config, tsConfigPath) {
    return {
        ...config,
        globals: {
            ...config.globals,
            "ts-jest": {
                ...config.globals['ts-jest'],
                tsconfig: tsConfigPath
            }
        },
    };
}

module.exports = {
    overrideTsConfig
};
