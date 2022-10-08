// Config
var timeout = 2000;
var indexTimeOut = 1;
var username = '0932097576';
var password = '@Pinggo1190#';
var host = 'https://dropshipping.shopix.vn/sync';
var secret = 'OqRwc6dFfo6nQQufCTzT3McwvCSiBT63';

var elementProductColor = '#config-item-fashion_fashion_color>.list-config-select>button.config-select-item';
var elementProductSize = '#config-item-fashion_fashion_size>.list-config-select>button.config-select-item';
var elementProductType = '#config-item-fashion_option>.list-config-select>button.config-select-item';
var elementProductCart = '#section-info>.list-order-group>.order-item';

// Login
func_login = function () {
    // Check Login
    if ($('a.nav-link.btn-login').length) {
        location.href = '/login';
    }
    if ($('form#login-form').length) {
        setTimeout(() => {
            $('input#phone').val(username).change();
            $('#box-input input[type="password"]').val(password).change();
            $('#login-btn').click();
        }, timeout);
    }
}

// Set Time Out
func_set_time_out = function (callable = null) {
    setTimeout(() => {
        indexTimeOut++;
        if (typeof callable == 'function') {
            return callable();
        }

        if (window[callable]) {
            return window[callable]();
        }
    }, timeout * indexTimeOut);
}

// Get Cookie
cookie_set = function (name, value) {
    document.cookie = name + '=' + value + '; Path=/;';
}

// Set Cookie
cookie_get = function (name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
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
func_category_current = function () {
    var current = cookie_get('_current_category');
    if (!current || current == 'undefined' || current == undefined) {
        if (categories = func_categories()) {
            current = categories.shift();
            cookie_set('_current_category', current);
        }
    }
    return current;
}

// Next Categories
func_category_next = function () {
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

// Ajax Request
func_ajax_request = function (url, params = {}, callback = null, method = 'POST') {

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
        'method': method,
        'timeout': 0,
        'processData': false,
        'mimeType': 'json',
        'cache': false,
        'contentType': false,
        'async': true,
        'data': data,
        // 'enctype': 'multipart/form-data'
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

// Product Index
func_product_index = function (index = null) {
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

// Get Product ID
func_product_id = function () {
    return;
}

// Get Product Name
func_product_name = function () {
    return $('#product-name').text();
}

// Get Product Description
func_product_description = function () {
    return '';
}

// Get Product Image
func_product_image = function () {
    var images = [];
    $('#list-other-images .btn-image-ref img').each(function (index, item) {
        images[index] = $(item).attr('src');
    });
    return images;
}

// Get Product Price
func_product_price = function () {
    return {
        'market': func_get_number($('#origin-price').text()),
        'seller': func_get_number($('#product-new-price').text()),
        'discount': func_get_number($('#max-rev-share').text()),
    };
}

// Get Product Attribute
func_product_attribute = function () {

    // Default
    attributes = { color: [], size: [], type: [] };

    // Color
    var index = 0;
    $(elementProductColor).each(function () {
        attributes.color[index] = $(this).text();
        index++;
    });

    // Size
    var index = 0;
    $(elementProductSize).each(function () {
        attributes.size[index] = $(this).text();
        index++;
    });

    // Type
    var index = 0;
    $(elementProductType).each(function () {
        attributes.type[index] = $(this).text();
        index++;
    });

    return attributes;
}

// Get Product Stock
func_product_stock = function () {
    if ($('#view-out-of-stock').is(':visible')) {
        return 0;
    }
    return 1;
}

// Get Product Content
func_product_content = function () {
    content = '<h3>Thông tin sản phẩm</h3>' + $('#content-nav-specifications div.form-content').html();
    content += '<h3>Thông tin chi tiêt</h3>' + $('#content-nav-description-detail').html();
    content += '<h3>Hướng dẫn sử dụng' + $('#content-nav-user-guide div.form-content').html();

    // Image In content
    var element = '#content-share-container';
    if ($(element).length) {
        $(element + ' .component-url-image').each(function () {
            content += '<img src="' + $(this).text() + '" />';
        });
    }

    return content.replace(/(id|class)\=\"[^\"]+\"/g, '');
}

// Get Product Information
func_product_information = function () {

    // Save Product
    localStorage.setItem('products', JSON.stringify({
        'id': func_product_id(),
        'name': func_product_name(),
        'link': location.href,
        'stock': func_product_stock(),
        'prices': func_product_price(),
        'images': func_product_image(),
        'description': func_product_description(),
        'breadcrumb': func_breadcrumb(),
        'shipping': {
            'label': $('#component-not-express .flex.flex-col .p-t-8').text()
        },
        'attribute': func_product_attribute(),
        'content': func_product_content()
    }));
}

// Product Add To Cart
func_product_add_cart = function () {
    func_set_time_out(function () {
        $('#popup-add-cart').click();
        func_set_time_out(function () {
            $('#add-cart-btn').click();
            func_set_time_out(function () {
                location.href = '/cart';
            });
        });
    });
}

// Product Information Update
func_product_information_update = function () {
    var products = JSON.parse(localStorage.getItem('products'));
    products.id = $(elementProductCart).attr('data-id');
    products.shipping.price = func_get_number($('#shipping-amount').text());
    localStorage.setItem('products', JSON.stringify(products));
}

// Product Request
func_product_request = function () {
    func_set_time_out(function () {
        func_ajax_request(host + '/new', { 'item': localStorage.getItem('products'), 'Secret': secret }, function (res) {

            // Orders
            if (res.data && res.data.orders) {
                cookie_set('_sync_orders', res.data.orders);
            }

            // Remove Product In Cart
            location.href = $(elementProductCart).find('a.btn-delete-item').attr('href');
        });
    });
}

// Product Sync
func_drop_shipping_sync_product = function () {

    // Params
    var flagCart = false;
    var category = func_category_current();
    var currentUrl = location.origin + location.pathname;

    func_set_time_out(() => {

        // Select Item       
        if (currentUrl == category) {

            var productIndex = func_product_index();
            var elementItem = '#list-product .product-item:eq(' + productIndex + ')';
            if ($(elementItem).length) {
                // Next Product Index
                func_product_index(parseInt(productIndex) + 1);
                // Redirect To Product URL    
                location.href = $(elementItem).attr('href');
            } else {
                // Reset Product Index
                func_product_index(0);

                // Next Page
                var nextPage = $('#list-page-container .page-item.active').next();
                if (nextPage.text()) {
                    pageHref = nextPage.attr('href');
                    cookie_set('_page_href', pageHref)
                    location.href = pageHref;
                } else {
                    location.href = func_category_next();
                }
            }
        } else {
            var breadcrumb = func_breadcrumb();
            if (location.pathname == '/cart') {
                if ($(elementProductCart).length) {
                    flagCart = true;
                } else {
                    // Redirect Next URL
                    nextPage = cookie_get('_page_href');
                    if (!nextPage || nextPage == 'undefined' || nextPage == undefined) {
                        location.href = func_category_current();
                    } else {
                        location.href = nextPage;
                    }
                }
            } else if (breadcrumb.indexOf(category) < 0) {
                location.href = category;
            }
        }

        // Process
        func_set_time_out(() => {
            // Not Page Cart
            if (flagCart === true) {

                // Product Information Update
                func_product_information_update();

                // Product Request
                func_product_request();

            } else {
                // Product Information
                func_product_information();

                // Product Add To Cart
                func_product_add_cart(timeout);
            }
        });
    });
}

// Order Sync
func_drop_shipping_sync_order = function () {

}

// Running
if ($('a.nav-link.btn-login').length || $('form#login-form').length) {
    func_login();
} else {
    if (orders = cookie_get('_sync_orders')) {
        func_drop_shipping_sync_order();
    } else {
        func_drop_shipping_sync_product();
    }
}