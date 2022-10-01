// Hàm thiết lập Cookie
cookie_set = function (name, value) {
    document.cookie = name + '=' + value + '; Path=/;';
}

// Hàm trả về giá trị Cookie
cookie_get = function (name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}


var timeout = 500;

if ($('a.nav-link.btn-login').length) {
    location.href = '/login';
}

if ($('form#login-form').length) {
    setTimeout(() => {
        $('input#phone').val('932097576').change();
        $('input[name="password"]').val('@Pinggo1190#').change();
        $('#login-btn').click();
    }, timeout);
}

var currentCategory = cookie_get('_currentCategory');
if (!currentCategory) {
    var categories = cookie_get('_categories');
    if (categories) {
        categories = categories.split(',');
    } else {
        $('a.component-category-less-than-5').each(function (index, item) {
            categories[index] = $(item).attr('href')
        });
        cookie_set('_categories', categories);
    }

    if (!currentCategory) {
        currentCategory = categories.shift();
        cookie_set('_currentCategory', currentCategory);
    }
}


// Images
$('#list-other-images .btn-other-image img').each(function () {
    console.log($(this).attr('src'));
})

console.log(currentCategory);

console.log(location)
