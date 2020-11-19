module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    openui5_preload: {
      component: {
        options: {
          resources: {
            cwd: "",
            prefix: "mymedicalhelpline",
            src: [
              "controller/*.js",
              "model/*.js",
              "view/*.view.xml",
              "view/*.fragment.xml",
              "Component.js"
              //'**/*.view.xml'
              //'!**/Component-preload.js'
            ]
          },
          dest: "./",
          compress: true
        },
        components: true
      }
    }
  });

  grunt.loadNpmTasks("grunt-openui5");
  grunt.registerTask("default", ["openui5_preload"]);
};
