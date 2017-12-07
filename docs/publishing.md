# How to publish, you ask?

## Prerequisite

Please make sure, you have everything you want in this release already committed.
After that, please continue with the following steps

## Versionbump

```bash
# The version bump can be major, minor, or a patch
# For more information go visit https://docs.npmjs.com/cli/version
$ npm version [major, minor, patch] -m "Bump to version %s"
```

## Publish to npm

```bash
# This publishes your npm package
# Note: when first publishing a scoped package you need to provide the flag '--access public'
# For more information go visit https://docs.npmjs.com/cli/publish
$ npm publish
```
