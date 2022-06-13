const langs = ['fa', 'zh-CN', 'fr', 'de', 'hi', 'it', 'ja', 'ru', 'es', 'tr', 'ar', 'ko', 'pa', 'ro', 'is', 'id', 'az', 'sr', 'bn', 'sk', 'kn', 'bg', 'ku', 'th', 'hy', 'tg', 'uk', 'bs', 'pt', 'kk', 'tk', 'ur', 'uz', 'ms', 'te', 'ta', 'sw', 'la', 'af', 'sq', 'nl', 'ka', 'ga', 'sl', 'sv', 'mr', 'gu', 'pl', 'or', 'sd', 'ne'];
const langsList = {};

async function translate(q, sl, tl) {
    const url = "https://cintia.ir/tr.php?sl=" + sl + "&tl=" + tl + "&q=" + q;
    let myPromise = new Promise(function (resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, true);
        xhttp.send();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(xhttp.responseText);
            }
        };
    })
    return myPromise;
};

function translateTitleModal(tableItems, index) {
    const modal = document.querySelector('tp-yt-paper-dialog#metadata-editor:not([aria-hidden=true])');
    const originalTitleElem = modal.querySelector('#original-title textarea');
    const translateTitleElem = modal.querySelector('#translated-title textarea');

    const originalDescriptionElem = modal.querySelector('#original-description textarea');
    const translateDescriptionElem = modal.querySelector('#translated-description textarea');

    const originalTitle = originalTitleElem.value;
    const originalDescription = originalDescriptionElem.value;

    const languageNameElem = modal.querySelector('#language-name-row .metadata-editor-translated .language-header');
    const languageName = languageNameElem.innerHTML;
    const lang = langsList[languageName];

    const publishBtn = modal.querySelector('#publish-button')

    translate(originalTitle, 'fa', lang).then(function (value) {
        translateTitleElem.value = value;
        translateTitleElem.dispatchEvent(new Event('input'));

        translate(originalDescription, 'en', lang).then(function (value) {
            translateDescriptionElem.value = value;

            //publishBtn.click();

            // setTimeout(function () {
            // translateTitle(tableItems, index);
            // }, 100);

            const myInterval = setInterval(function () {
                if (!document.querySelector('tp-yt-paper-dialog#metadata-editor:not([aria-hidden=true])')) {
                    clearInterval(myInterval);
                    setTimeout(function () {
                        translateTitle(tableItems, index);
                    }, 500);
                }
            }, 100)
        })
    })
}

function translateCaptionLine(lines, index, lang, publishBtn, tableItems, tableItemsIndex) {
    if (index == lines.length) {
        // publishBtn.click();
        const myInterval = setInterval(function () {
            // if (publishBtn.getAttribute('tabindex') == '0') {
            // clearInterval(myInterval);
            // setTimeout(function () {
            //     translateCaptions(tableItems, tableItemsIndex);
            // }, 1000)
            // }
            if (!document.querySelector('tp-yt-paper-dialog#dialog:not([aria-hidden=true])')) {
                clearInterval(myInterval);
                setTimeout(function () {
                    translateCaptions(tableItems, tableItemsIndex);
                }, 1500);
            }
        }, 100)
        return;
    }
    const line = lines[index];
    index = index + 1;

    const originalText = line.querySelector('.original-text ').innerHTML.trim();
    const textarea = line.querySelector('textarea');

    translate(originalText, 'en', lang).then(function (value) {
        textarea.value = value;

        translateCaptionLine(lines, index, lang, publishBtn, tableItems, tableItemsIndex);
    })
}

function translateCaptionsModal(tableItems, tableItemsIndex) {
    const modal = document.querySelector('tp-yt-paper-dialog#dialog:not([aria-hidden=true])');

    const myInterval = setInterval(function () {
        const typeManuallyBtn = modal.querySelector('#choose-type-manually');
        if (typeManuallyBtn) {
            clearInterval(myInterval);
            typeManuallyBtn.click();
            setTimeout(function () {
                const title = modal.querySelector('#dialog-title-text');
                const publishBtn = modal.querySelector('#publish-button');
                const lang = langsList[title.innerHTML];
                const lines = modal.querySelectorAll('ytve-captions-editor-caption-segment-line');
                translateCaptionLine(lines, 0, lang, publishBtn, tableItems, tableItemsIndex);
            }, 100);
        }
    }, 100)
}

function translateTitle(tableItems, index) {
    if (index == tableItems.length) {
        setTimeout(function () {
            tableItems = document.querySelectorAll('#table-list ytgn-video-translation-row');
            translateCaptions(tableItems, 0);
        }, 500);
        return;
    }
    const addBtn = tableItems[index].querySelector('#add-translation.ytgn-video-translation-cell-metadata');
    index = index + 1;
    if (addBtn) {
        addBtn.click();
        setTimeout(function () {
            translateTitleModal(tableItems, index);
        }, 500)
    } else {
        translateTitle(tableItems, index);
    }
}

function translateCaptions(tableItems, index) {
    if (index == tableItems.length) {
        setTimeout(function () {
            alert("I’m happy to help :)");
        }, 500);
        return;
    }
    const addBtn = tableItems[index].querySelector('#add-translation.ytgn-video-translation-cell-captions');
    index = index + 1;
    if (addBtn) {
        addBtn.click();
        setTimeout(function () {
            translateCaptionsModal(tableItems, index);
        }, 200)
    } else {
        translateCaptions(tableItems, index);
    }
}

function addLangs() {
    document.getElementById('add-translations-button').click();

    setTimeout(function () {
        const langTextMenuItems = document.querySelectorAll('tp-yt-paper-item.ytcp-text-menu');

        langTextMenuItems.forEach(item => {
            const lang = item.getAttribute('test-id');
            langsList[item.querySelector('yt-formatted-string').innerHTML] = lang;
            const ariaDisabled = item.getAttribute('aria-disabled');
            if (ariaDisabled === "false" && langs.includes(lang)) {
                item.click();
            }
        })

        setTimeout(function () {
            const tableItems = document.querySelectorAll('#table-list ytgn-video-translation-row');
            translateTitle(tableItems, 0);
        }, 100)
    }, 100)
}

function addNewButton() {
    var btn = document.createElement("button");
    btn.innerHTML = 'AUTO TRANSLATE';
    btn.id = 'mm_auto_translate'
    btn.style.cssText = 'width:155px; height:36px; border:none; border-radius:1px; background-color:#4CAF50; color: white; font-size: 14px; cursor: pointer;';
    btn.onclick = function () {
        addLangs();
    }
    document.querySelector('.footer.style-scope.ytgn-video-translations-section').appendChild(btn);
}


setInterval(function () {
    if (document.getElementById('add-translations-button') && !document.getElementById('mm_auto_translate')) {
        addNewButton();
    }
}, 1000)