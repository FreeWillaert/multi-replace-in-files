#!/usr/bin/env node

const commander = require('commander');
const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const chalk = require('chalk');
const replaceInFile = require('replace-in-file');

try {

    commander
        .arguments('<replacementsFile> <filesToReplace>') // [<filesToIgnore>]
        .action(main)
        .parse(process.argv);

    if (commander.args.length === 0) throw new Error("No arguments specified.");

} catch (error) {
    console.error(chalk.red(error.message));
    exitWithHelp();
}

function main(replacementsFilePath, filesToReplacePath) {

    console.log(filesToReplacePath);

    const replacementsData = readReplacementsData(replacementsFilePath);

    const replacements = parseReplacements(replacementsData);

    replaceInFiles(replacements.from, replacements.to, filesToReplacePath);

}

function readReplacementsData(replacementsFilePath) {
    try {
        replacementsFilePath = path.join(process.cwd(), replacementsFilePath);
        return fs.readFileSync(replacementsFilePath, 'utf-8');
    } catch (error) {
        throw new Error("Error reading replacements file: " + error.message);
    }
}

function parseReplacements(replacementsData) {

    const from = [];
    const to = [];

    try {
        const replacements = JSON.parse(replacementsData);

        // Do some basic validation
        if (!_.isArray(replacements)) throw new Error("replacementsFile must contain an array");

        replacements.forEach(replacement => {
            if (!_.isArray(replacement)) throw new Error("each replacement must be an array");
            if (replacement.length !== 2) throw new Error("each replacement array must be of size 2");

            // Assume we always want to replace all occurrences!
            const fromValue = new RegExp(escapeRegExp(replacement[0]), "g");
            const toValue = escapeReplacementString(replacement[1]);
            
            from.push(fromValue);
            to.push(toValue);
        });

        return { from, to };

    } catch (error) {
        throw new Error("Error parsing replacements: " + error.message);
    }
}

// From https://stackoverflow.com/a/9310752/3924042
function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// Since dollar signs are interpreted as special pattersn by String.Replace, escape each dollar sign - KISS, and assuming the user is not aware that String.Replace is used and/or that it has these special patterns.
// More info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
function escapeReplacementString(text) {
    return text.replace(/\$/g, '$$$$'); // each dollar sign is replaced by *TWO* dollar signs
}

function replaceInFiles(from, to, filesString) {
    const files = filesString.split(',');

    console.log(JSON.stringify(files));

    const options = {
        from,
        to,
        files
    };

    const changes = replaceInFile.sync(options);
    console.log('Modified files:', changes.join(', '));
}


function exitWithHelp() {
    commander.help((helptext) => { return chalk.blue(helptext); });
}

