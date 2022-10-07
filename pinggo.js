var elementProductColor = '#config-item-fashion_fashion_color>.list-config-select>button.config-select-item';
var elementProductSize = '#config-item-fashion_fashion_size>.list-config-select>button.config-select-item';
var elementProductType = '#config-item-fashion_option>.list-config-select>button.config-select-item';


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
            $('input#phone').val('0932097576').change();
            $('input[name="password"]').val('@Pinggo1190#').change();
            $('#login-btn').click();
        }, timeout);
    }
}

// All Categories
func_categories = function () {
    var categories = cookie_get('_categories');
    if (!categories || categories == 'undefined' || categories == undefined) {
        if (location.pathname != '/home') {
            location.href = '/home';
        } else {
            categories = [];
            $('a.component-category-less-than-5').each(function (index, item) {
                categories[index] = $(item).attr('href')
            });
            cookie_set('_categories', categories);
        }
    } else {
        categories = categories.split(',');
    }
    return categories;
}

// Current Categories
func_current_category = function () {
    var current = cookie_get('_current_category');
    if (!current || current == 'undefined' || current == undefined) {
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
        'discount': func_get_number($('#max-rev-share').text()),
    };
}

// Get Product Color Attribute
func_product_color = function () {
    results = [];
    var index = 0;
    $(elementProductColor).each(function () {
        results[index] = $(this).text();
        index++;
    });
    return results;
}

// Get Product Size Attribute
func_product_size = function () {
    results = [];
    var index = 0;
    $(elementProductSize).each(function () {
        results[index] = $(this).text();
        index++;
    });
    return results;
}

// Get Product Type Attribute
func_product_type = function () {
    results = [];
    var index = 0;
    $(elementProductType).each(function () {
        results[index] = $(this).text();
        index++;
    });
    return results;
}

// Get Product Content
func_product_content = function () {
    content = '<h3>Thông tin sản phẩm</h3>' + func_remove_id_class($('#content-nav-specifications div.form-content').html());
    content += '<h3>Thông tin chi tiêt</h3>' + func_remove_id_class($('#content-nav-description-detail').html());
    content += '<h3>Hướng dẫn sử dụng' + func_remove_id_class($('#content-nav-user-guide div.form-content').html());
    content += 'Sharing: ' + func_product_content_share();
    return content;
}

// Get Product Content Share
func_product_content_share = function () {
    var results = [];
    var element = '#content-share-container';
    if ($(element).length) {
        $(element + ' .component-url-image').each(function (index, item) {
            results[index] = $(item).text();
        });
    }
    return results;
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

// Sync New Product
func_product_information = function () {

    // Save Product
    localStorage.setItem('products', JSON.stringify({
        'code': null,
        'name': $('#product-name').text(),
        'link': location.href,
        'prices': func_product_prices(),
        'images': func_product_images(),
        'description': '',
        'breadcrumb': breadcrumb,
        'shipping': {
            'label': $('#component-not-express .flex.flex-col .p-t-8').text()
        },
        'attribute': {
            'color': func_product_color(),
            'size': func_product_size(),
            'type': func_product_type(),
        },
        'content': func_product_content()
    }));
}

// Product Add To Cart
func_product_add_to_cart = function (timeout) {
    setTimeout(() => {
        $('#popup-add-cart').click();
        setTimeout(() => {
            $('#add-cart-btn').click();
            setTimeout(() => {
                location.href = '/cart'
            }, timeout);
        }, timeout);
    }, timeout);
}

// Product Cart Information
func_product_cart_information = function (timeout) {
    var products = JSON.parse(localStorage.getItem('products'));
    products.shipping.price = func_get_number($('#shipping-amount').text());
    localStorage.setItem('products', JSON.stringify(products));
}

// Product Sync New Product
func_sync_new_product = function (timeout, host, secret) {
    setTimeout(() => {
        func_send_ajax(host + '/new', { 'item': localStorage.getItem('products'), 'Secret': secret }, function (res) {
            // setTimeout(() => {
            //     nextPage = cookie_get('_page_href');
            //     if (!nextPage || nextPage == 'undefined' || nextPage == undefined) {
            //         location.href = func_current_category();
            //     } else {
            //         location.href = nextPage;
            //     }
            // }, timeout);
        });
    }, timeout);
}

// Init
func_init = function (timeout, host, secret) {
    setTimeout(() => {

        // Params
        var category = func_current_category();
        var breadcrumb = func_breadcrumb();
        url = location.origin + location.pathname;

        // Select Item
        var flagCart = false;
        if (url == category) {

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
                    pageHref = nextPage.attr('href');
                    cookie_set('_page_href', pageHref)
                    location.href = pageHref;
                } else {
                    location.href = func_next_category();
                }
            }
        } else {
            if (location.pathname == '/cart') {
                flagCart = true;
            } else if (breadcrumb.indexOf(category) < 0) {
                location.href = category;
            }
        }

        // Process
        setTimeout(() => {

            // Not Page Cart
            if (flagCart == false) {

                // Product Information
                func_product_information();

                // Product Add To Cart
                func_product_add_to_cart(timeout);

                setTimeout(() => {

                    // Product Cart Information
                    func_product_cart_information(timeout);

                    // Sync New Product
                    func_sync_new_product(timeout, host, secret);
                }, timeout * 3 + 1000);

            } else {

                // Product Cart Information
                func_product_cart_information(timeout);

                // Sync New Product
                func_sync_new_product(timeout, host, secret);
            }
        }, timeout);

    }, timeout);
}


// Sync Update product
func_sync_update_product = function (host, secret, timeout) {

}

// Sync Register Order
func_register_order = function (host, secret, timeout) {

}


// Variable
var timeout = 2000;
var host = 'https://dropshipping.shopix.vn/sync';
var secret = 'OqRwc6dFfo6nQQufCTzT3McwvCSiBT63';

// Running
func_login(timeout);
func_init(timeout, host, secret);

