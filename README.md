# grunt-depsconcat
> Grunt plugin for concatenating files in order based on dependencies.

## Getting Started
This plugin requires Grunt `~0.4.1`.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-depsconcat --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-depsconcat');
```

## The "depsconcat" task
### Overview
In your project's Gruntfile, add a section named `depsconcat` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  depsconcat: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    }
  },
})
```

### Taget configuration

#### [target].options.ext
Type: `String`

The extension of the files to be concatenated.

#### [target].options.requireTemplate
Type: `String`

The regex used to express dependency.

#### [target].options.nameTemplate
Type: `String`

The regex used to name a file.

### Usage Examples
The following example shows how to use the task to concatenate a group of classes in hierarchy order using [YUIDoc](http://yui.github.io/yuidoc/) syntax.

```js
grunt.initConfig({
  src: {
    options: {
      requireTemplate: '\\n*@extends\\s+([^\\n\\r]+)[\\n\\r]*',
      nameTemplate: '\\n*@class\\s+([^\\n\\r]+)[\\n\\r]*'
    },
    files: {
      'name.js': [
        'src/*.js',
        'src/**/*.js'
      ]
    }
  }
})
```
## Feedback

Pull requests, feature ideas and bug reports are very welcome. We highly appreciate any feedback.

## License

MIT
