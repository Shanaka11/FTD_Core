import packageJSON from '../package.json' assert {type: 'json'};

export const getCurrentPackageVersion = () => {
    return packageJSON.version;
}
