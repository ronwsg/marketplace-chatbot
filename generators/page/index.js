var generators = require('yeoman-generator');
var changeCase = require('change-case');

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);
    },

    _readDomainName: function() {
        const input = [
            {
                type    : 'input',
                name    : 'domainName',
                message : 'Domain name (camel case)',
            }
        ];

        return this.prompt(input).then(answers => {
            const domainName = answers.domainName;
            if (!domainName || domainName != changeCase.camel(domainName)) {
                return this._readDomainName();
            }

            return this.domainName = domainName;
        });
    },

    _readComponentName: function() {
        const input = [
            {
                type    : 'input',
                name    : 'componentName',
                message : 'Page component name (pascal case)',
            },
        ];

        return this.prompt(input).then(answers => {
            const componentName = answers.componentName;
            if (!componentName || componentName != changeCase.pascal(componentName)) {
                return this._readComponentName();
            }

            return this.componentName = componentName;
        });
    },

    prompting: function () {
        return Promise.resolve()
                .then(()=>this._readDomainName())
                .then(()=>this._readComponentName());
    },

    _copyTSX: function() {
        return this.fs.copyTpl(
            this.templatePath('page.tsx'),
            this.destinationPath("app/" + this.domainName + "/pages/" + this.componentName + ".tsx"),
            {
                jsClassName: this.componentName,
                cssClassName: changeCase.paramCase(this.componentName),
            }
        );
    },

    _copySASS: function() {
        return this.fs.copyTpl(
            this.templatePath('page.scss'),
            this.destinationPath("app/" + this.domainName + "/pages/" + this.componentName + ".scss"),
            {
                cssClassName: changeCase.paramCase(this.componentName),
            }
        );
    },

    writing: function() {
        return Promise.resolve()
            .then(()=>this._copyTSX())
            .then(()=>this._copySASS());
    },
});