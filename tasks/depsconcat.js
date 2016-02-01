module.exports = function(grunt) {
  var path, util, deptree;

  path = require('path');
  util = require('util');
  deptree = require('serialize-deptree');

  grunt.registerMultiTask('depsconcat', 'Concatenate files, ordered by dependencies.', function() {
    var options;

    options = this.options({
      separator: grunt.util.linefeed,
      requireTemplate: null,
      nameTemplate: null,
      ext: null
    });

    this.files.forEach(function(f) {
      var ext, files, tree, requireRegex, nameRegex, serialized;
      var filePath, i;

      ext = options.ext || f.dest.match(/\.[a-z]+$/i)[0];
      files = {};
      tree = {};
      nameRegex = null;

      if (!options.requireTemplate) {
        if (ext === '.css')
          requireRegex = '@import\\s+url\\(["\']?([^"\'()]+)["\']?\\);?[\\n\\r]*';
        else {
          ext = '.js';
          requireRegex = '\\/\\/@require\\s+([^\\n\\r]+)[\\n\\r]*';
        }
      } else
        requireRegex = options.requireTemplate;

      requireRegex = new RegExp(requireRegex, 'gi');

      if (options.nameTemplate)
        nameRegex = new RegExp(options.nameTemplate, 'gi');

      f.src.filter(function(filePath) {
        if (!grunt.file.exists(filePath)) {
          grunt.log.warn('Source file ' + filePath + ' not found.');
          return false;
        }

        return !grunt.file.isDir(filePath);
      }).map(function(filePath) {
        var matches;

        if (nameRegex) {
          nameRegex.lastIndex = 0;
          matches = grunt.file.read(filePath).match(nameRegex) || [];

          if (matches.length)
            files[nameRegex.exec(matches[0])[1]] = filePath;
        } else
          files[path.basename(filePath, ext)] = filePath;

        tree[filePath] = [];
      });

      for (filePath in tree) {
        var matches, name;

        matches = grunt.file.read(filePath).match(requireRegex) || [];

        for (i = 0; i < matches.length; i++) {
          requireRegex.lastIndex = 0;
          name = requireRegex.exec(matches[i])[1];

          if (files[name])
            tree[filePath].push(files[name]);
          else
            grunt.log.warn('Dependency ' + name + ' of ' + filePath + ' not found.');
        }
      }

      serialized = deptree.serialize(tree).map(function(filePath) {
        return grunt.file.read(filePath);
      });

      grunt.file.write(f.dest, serialized.join(grunt.util.linefeed));
      grunt.log.writeln('File ' + f.dest + ' created.');
    });
  });
};
