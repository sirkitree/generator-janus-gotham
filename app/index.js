'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the kickass ' + chalk.red('Janus Gotham') + ' room generator!'
    ));

    // Ask for data source.
    var prompts = [{
      type: 'input',
      name: 'source',
      message: 'Where\'s your json?',
      default: './data.json'
    }];

    // Actual work done here.
    this.prompt(prompts, function (props) {
      this.source = props.source;

      var data = require(this.source);

      // Storehouse.data.story.title
      this.title = data.title;

      // Storehouse.data.story.subtitle
      this.subtitle = data.subtitle;

      // Storehouse.data.story.elements 
      //   foreach .content.type (text/image) 
      //     .content.text.plain_text 
      //     .content.image.url
      this.elements = [];
      var x, y, z;

      // Go through the data and pull out our variables and calculate positions
      for (var i = data.elements.length - 1; i >= 0; i--) {
        if (data.elements[i].content.type === 'text') {
          this.elements.push({
            'type' : 'text',
            'text' : data.elements[i].content.text.plain_text,
            'id': data.elements[i].id,
            'pos': {'x' : x, 'y' : y, 'z' : z}
          });
        }
        if (data.elements[i].content.type === 'image') {
          this.elements.push({
            'type' : 'image',
            'url' : data.elements[i].content.image.url,
            'id': data.elements[i].id,
            'pos': {'x' : x, 'y' : y, 'z' : z}
          });
        }
      }
      console.log(this.elements);

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_index.html'),
        this.destinationPath('public/index.html'),
        {
          title: this.title,
          subtitle: this.subtitle,
          elements: this.elements
        }
      );
    }
  }
});
