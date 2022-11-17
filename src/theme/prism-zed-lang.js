(function (Prism) {
    Prism.languages.zed = Prism.languages.extend('clike', {
        'class-name': [
            {
                pattern: /(\b(?:definition)\s+)(\w+\/)?\w*(?=\s*\{)/,
                lookbehind: true
            },
            {
                pattern: /(\b(?:caveat)\s+)(\w+\/)?\w*(?=\s*\()/,
                lookbehind: true
            },
            {
                pattern: /(\b(?:permission)\s+)\w+(?=\s*\=)/,
                lookbehind: true
            },
            {
                pattern: /(\b(?:relation)\s+)\w+(?=\s*\:)/,
                lookbehind: true
            },
        ],
        'keyword': /\b(?:definition|caveat|relation|permission|with)\b(?!\s*=\s*\d)/,
    });
}(Prism));