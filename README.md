# Installation
Global install through npm:

```
 npm install -g multi-replace-in-files
```


# Usage
Just type multi-replace-in-files to get up-to-date usage instructions.

For the initial version:

```
$ multi-replace-in-files

Usage: multi-replace-in-files [options] <replacementsFile> <filesToReplace>

  Options:

    -h, --help  output usage information
```

The replacements file must contain a JSON array, consisting itself of arrays of size 2, e.g.

[
    [ "from1", "to1" ],
    [ "from2", "to2" ]
]

Check the replace-in-file documentation to learn about regexes, glob patterns,...

Important: If filesToReplace contains glob patterns, make sure to enclose it in quotes!


# Roadmap

Allow replacements file to contain a JSON object, for simple scenarios.
Allow comments in replacments file somehow.
Recursive replacements (but beware of endless loops).
Support advanced replace-in-file options: ignore file, dsiable globs, specify encoding
Make escapeReplacementString optional.