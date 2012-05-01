var htmlUtils = {
    extractText: function (html) {
        return html.replace(/\<[^>]+\>/g, ' ').replace(/\s+/g, ' ').trim();
    }
}
