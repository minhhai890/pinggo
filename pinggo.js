
// Get Cookie
cookie_set = function (name, value) {
    document.cookie = name + '=' + value + '; Path=/;';
}

// Set Cookie
cookie_get = function (name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

// Login
func_login = function (timeout = 500) {
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
}

// All Categories
func_categories = function () {
    var categories = cookie_get('_categories');
    if (!categories || categories == undefined) {
        categories = [];
        $('a.component-category-less-than-5').each(function (index, item) {
            categories[index] = $(item).attr('href')
        });
        cookie_set('_categories', categories);
    } else {
        categories = categories.split(',');
    }
    return categories;
}

// Current Categories
func_current_category = function () {
    var current = cookie_get('_current_category');
    if (!current || current == undefined) {
        categories = func_categories();
        current = categories.shift();
        cookie_set('_current_category', current);
    }
    return current;
}

// Next Categories
func_next_category = function () {
    categories = func_categories();
    next = categories.shift();
    cookie_set('_current_category', next);
    return next;
}

// Breadcrumb
func_breadcrumb = function () {
    var breadcrumb = [];
    if ($('#breadcrumb').length) {
        $('#breadcrumb a').each(function (index, item) {
            breadcrumb[index] = $(item).attr('href').trim();
        });
    }
    return breadcrumb;
}

// Get Number In String
func_get_number = function (str) {
    return str.replace(/\D+/g, '');
}

// Remove ID and Class In String
func_remove_id_class = function (str) {
    return str.replace(/(id|class)\=\"[^\"]+\"/g, '');
}

// Get Product Image
func_product_images = function () {
    var images = [];
    $('#list-other-images .btn-image-ref img').each(function (index, item) {
        images[index] = $(item).attr('src');
    });
    return images;
}

// Get Product Price
func_product_prices = function () {
    return {
        'market': func_get_number($('#origin-price').text()),
        'price': func_get_number($('#product-new-price').text()),
        'min': func_get_number($('#consumer-min-price').text()),
        'max': func_get_number($('#consumer-max-price').text()),
        'discount': func_get_number($('#max-rev-share').text()),
    };
}

// Get Product Instroduct
func_product_introduct = function () {
    return JSON.stringify({
        'name': $('#product-name').text(),
        'url': location.href,
        'prices': func_product_prices(),
        'images': func_product_images(),
        'content': {
            'info': func_remove_id_class($('#content-nav-specifications div.form-content').html()),
            'detail': func_remove_id_class($('#content-nav-description-detail').html()),
            'support': func_remove_id_class($('#content-nav-user-guide div.form-content').html()),
        }
    });
}

// Send Ajax
func_send_ajax = function (url, params = {}, callback = null) {

    // Data params
    data = new FormData();
    if (typeof (params) == 'object') {
        $.each(params, function (name, value) {
            if (typeof (value) == 'object') {
                $.each(value, function () {
                    data.append(name + '[]', this);
                });
            } else {
                data.append(name, value);
            }
        });
    }

    // Config
    configs = {
        'url': url,
        'method': 'POST',
        'timeout': 0,
        'processData': false,
        'mimeType': 'json',
        'cache': false,
        'contentType': false,
        'async': true,
        'data': data,
        'enctype': 'multipart/form-data'
    }

    $.ajax(configs).done((res) => {
        // Ajax complete
        if (typeof callback == 'function') {
            return callback(res);
        }

        if (window[callback]) {
            return window[callback](res);
        }
    });
}

// Item Index
func_index = function (index = null) {
    if (index !== null) {
        cookie_set('_index', index);
    } else {
        var index = cookie_get('_index');
        if (!index || index == undefined) {
            index = 0;
            cookie_set('_index', index);
        }
    }
    return index;
}


var timeout = 1000;

// Login
func_login(timeout);

// Init
setTimeout(() => {

    // Params
    var category = func_current_category();
    var breadcrumb = func_breadcrumb();
    url = location.origin + location.pathname;

    // Select Item
    if (url == category) {

        // Process
        var index = func_index();
        var elementItem = '#list-product .product-item:eq(' + index + ')';
        if ($(elementItem).length) {
            // Next index
            func_index(parseInt(index) + 1);
            // Redirect to item        
            location.href = $(elementItem).attr('href');
        } else {
            // Reset index
            func_index(0);
            // Next Page
            var nextPage = $('#list-page-container .page-item.active').next();
            if (nextPage.text()) {
                location.href = nextPage.attr('href');
            } else {
                location.href = func_next_category();
            }
        }
    } else {
        if (breadcrumb.indexOf(category) < 0) {
            location.href = category;
        }
    }

    // Send Item
    setTimeout(() => {
        func_send_ajax('https://linahouse.com.vn/', {
            'item': func_product_introduct(),
            'breadcrumb': breadcrumb
        }, 'send_ajax_complete');
    }, timeout);
}, timeout);

// Send Ajax Complete
send_ajax_complete = function (res) {
    console.log('asdfasd');
    location.href = func_current_category();
}