(function (Prism) {
    Prism.languages.relationship = Prism.languages.extend('clike', {
        'class-name': [
            {
                pattern: /(\w)+\/(\w)+/,
            },
        ],
        'function': {
            pattern: /\#(\w)+/,
        },
    });
}(Prism));
