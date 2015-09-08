var path, util, deptree;

path = require('path');
util = require('util');
deptree = require('serialize-deptree');

module.exports = function(grunt) {
  grunt.registerMultiTask('depsconcat', 'Concatenate files, ordered by dependencies', function() {
    var options;

    options = this.options({
      separator: grunt.util.linefeed,
      requireTemplate: null,
      ext: null,
      except: [],
    });

    this.files.forEach(function(file) {
      var regex, ext, files, tree;

      ext = options.ext || file.dest.match(/\.[a-z]+$/i)[0];
      files = {};
      tree = {};

      if (!options.requireTemplate) {
        if (ext === '.css') {
          regex = '@import\\s+url\\(["\']?([^"\'()]+)["\']?\\);?[\\n\\r]*';
        } else {
          ext = '.js';
          regex = '\\/\\/@require\\s+([^\\n\\r]+)[\\n\\r]*';
        }
      } else {
        regex = options.requireTemplate;
      }

      regex = new RegExp(regex, 'gi');

      file.src.filter(function(filePath) {
        filePath = path.normalize(filePath);

        files[path.basename(filePath, ext)] = filePath;
        tree[filePath] = [];
      });

      file.src.filter(function(filePath) {
        var matches, depfilePath;

        matches = grunt.file.read(filePath).match(regex) || [];

        for (var i = 0; i < matches.length; i++) {
          regex.lastIndex = 0;
          depfilePath = regex.exec(matches[i])[1];

          if (!(/\.\w+$/).test(depfilePath)) {
            tree[path.normalize(filePath)].push(files[depfilePath]);
          }
        }
      });

      var serialized = deptree.serialize(tree).map(function(filePath) {
        return grunt.file.read(filePath);
      });

      grunt.file.write(file.dest, serialized.join(grunt.util.linefeed));
      grunt.log.writeln('Dest File "' + file.dest + '" created.');
    });
  });

};
