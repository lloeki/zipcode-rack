(function () {
    function parse(text) {
        var parsed = {};
        var re = /^\s*(\d+)?\s*(\D.*)?$/;
        var m = re.exec(text);
        if (m !== null) {
            parsed.zip = m[1];
            parsed.name = m[2];
        }
        return parsed;
    }

    function queryString(obj) {
        var kv = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                kv.push([key, obj[key]].join('='));
            }
        }
        return kv.join('&');
    }

    function request(method, url, params, done) {
        var http = new XMLHttpRequest();
        http.open(method, url + '?' + queryString(params), true);
        http.onreadystatechange = function() {
            if (http.readyState === 4) {
                if (http.status === 200) {
                    var data = JSON.parse(http.responseText);
                    done(data);
                }
            }
        };
        http.send(null);
    }

    var settings = {
        endpoint: null,
        dropdownClass: 'zip-city-dropdown',
    };

    function endpoint(url) {
        if (url) { settings.endpoint = url; }
        return settings.endpoint;
    }

    function dropdownClass(name) {
        if (name) { settings.dropdownClass = name; }
        return settings.dropdownClass;
    }

    function search(text, limit, done) {
        var parsed = parse(text);
        if (parsed.zip) {
            request('GET', endpoint(), { zip: parsed.zip, limit: limit }, done);
        } else if (parsed.name) {
            request('GET', endpoint(), { name: parsed.name, limit: limit }, done);
        }
    }

    function handleSearch(e) {
        var input = e.target.value;
        if (input === '' && e.target.dropdown) {
            e.target.dropdown.remove();
            e.target.dropdown = null;
        }

        search(input, 10, function (data) {
            updatePicker(e.target, data);
        });
    }

    function dropdownFor(input) {
        if (input.dropdown) {
            return input.dropdown;
        }

        var dropdown = createDropdown(input);
        assignDropdown(input, dropdown);
        return dropdown;
    }

    function createDropdown(input) {
        var dropdown = document.createElement('div');

        // TODO: auto-align right if needed
        // TODO: max-width + hide overflow
        var style = '';
        style += 'position: absolute;';
        style += 'top: '   + (input.offsetTop   + input.offsetHeight) + 'px;';
        style += 'left: '  +  input.offsetLeft  + 'px;';
        style += 'min-width: ' +  input.offsetWidth + 'px;';
        dropdown.setAttribute('style', style);
        dropdown.classList.add(dropdownClass());

        return dropdown;
    }

    function isHovered(dropdown) {
        var items = document.querySelectorAll(':hover');
        for (var i = 0; i < items.length; i++) {
            if (items[i] === dropdown) {
                return true;
            }
        }
        return false;
    }

    function isFocused(input) {
        var items = document.querySelectorAll('input:focus');
        for (var i = 0; i < items.length; i++) {
            if (items[i] === input) {
                return true;
            }
        }
        return false;
    }

    function assignDropdown(input, dropdown) {
        input.parentNode.insertBefore(dropdown, input.nextSibling);
        input.dropdown = dropdown;
        input.addEventListener('blur', function() {
            if (!isHovered(input.dropdown)) { removeDropdown(input); }
        });
        dropdown.addEventListener('mouseleave', function() {
            if (!isFocused(input)) { removeDropdown(input); }
        });
    }

    function removeDropdown(input) {
        if (input.dropdown) {
            var dropdown = input.dropdown;
            input.dropdown = null;
            dropdown.remove();
        }
    }

    function renderResults(data) {
        var list = '';
        list += '<ul>';
        for (var i = 0; i < data.length; i++) {
            list += '<li>' + data[i].zip + ' ' + data[i].name + '</li>';
        }
        list += '</ul>';

        return list;
    }

    function renderNoResult() {
        return '<span>No results</span>';
    }

    function renderResultValue(item) {
        return '' + item.zip + ' ' + item.name;
    }

    function setSelection(dropdown, item) {
        var items = dropdown.querySelectorAll('li');
        for (var i = 0; i < items.length; i++) {
            if (items[i] === item) { dropdown.selection = i; }
        }
    }

    function redrawSelection(dropdown) {
        var items = dropdown.querySelectorAll('li');
        for (var i = 0; i < items.length; i++) {
            items[i].classList.remove('selected');
        }
        items[dropdown.selection].classList.add('selected');
    }

    function selectedValue(dropdown) {
        var items = dropdown.querySelectorAll('li');
        return items[dropdown.selection].data;
    }

    function applySelection(input) {
        input.value = selectedValue(input.dropdown);
        removeDropdown(input);
    }

    function handleResultMouseEnter(item, input) {
        setSelection(input.dropdown, item);
        redrawSelection(input.dropdown);
    }

    function handleResultClick(item, input) {
        setSelection(input.dropdown, item);
        redrawSelection(input.dropdown);
        applySelection(input);
    }

    function resultMouseEnterHandler(input) {
        return (function (e) { handleResultMouseEnter(e.target, input); });
    }

    function resultClickHandler(input) {
        return (function (e) { handleResultClick(e.target, input); });
    }

    function setResultValues(dropdown, data) {
        var items = dropdown.querySelectorAll('li');
        for (var i = 0; i < items.length; i++) {
            items[i].data = renderResultValue(data[i]);
        }
    }

    function setResultEvents(input) {
        var dropdown = input.dropdown;
        var items = dropdown.querySelectorAll('li');
        for (var i = 0; i < items.length; i++) {
            items[i].addEventListener('click', resultClickHandler(input));
            items[i].addEventListener('mouseenter', resultMouseEnterHandler(input));
        }
    }

    function initializeSelection(dropdown) {
        dropdown.selection = -1;
    }

    function updatePicker(input, data) {
        var dropdown = dropdownFor(input);
        initializeSelection(dropdown);
        if (data.length > 0) {
            dropdown.innerHTML = renderResults(data);
            setResultValues(dropdown, data);
            setResultEvents(input);
        } else {
            dropdown.innerHTML = renderNoResult();
        }
    }

    function hasDropdown(input) {
        return !!input.dropdown;
    }

    function wrapSelection(dropdown, length) {
        if (dropdown.selection == length) {
            dropdown.selection = 0;
        }
        if (dropdown.selection < 0) {
            dropdown.selection = length - 1;
        }
    }

    function moveSelection(dropdown, direction) {
        var items = dropdown.querySelectorAll('li');
        if (items.length > 0) {
            dropdown.selection += direction;
            wrapSelection(dropdown, items.length);
            redrawSelection(dropdown);
        }
    }

    var UP = -1;
    var DOWN = 1;

    function handleDown(e) {
        e.preventDefault();
        if (hasDropdown(e.target)) {
            moveSelection(e.target.dropdown, DOWN);
        } else {
            handleSearch(e);
        }
    }

    function handleUp(e) {
        e.preventDefault();
        if (hasDropdown(e.target)) {
            moveSelection(e.target.dropdown, UP);
        } else {
            handleSearch(e);
        }
    }

    function handleEnter(e) {
        e.preventDefault();
        applySelection(e.target);
        removeDropdown(e.target);
    }

    function handleEscape(e) {
        e.preventDefault();
        removeDropdown(e.target);
    }

    function handleKeydown(e) {
        switch (e.keyCode) {
        case 40: // ArrowDown
            handleDown(e);
            break;
        case 38: // ArrowUp
            handleUp(e);
            break;
        case 13: // Enter
            handleEnter(e);
            break;
        case 27: // Escape
            handleEscape(e);
            break;
        default:
            return;
        }
    }

    function polyfill(input) {
        if (!input.dropdown_listener) {
            input.dropdown_listener = true;
            input.addEventListener('keydown', handleKeydown);
            input.addEventListener('input', handleSearch);
        }
    }

    function polyfillDocument() {
        var elements = document.querySelectorAll('input[type=zip-city]');
        for (var i = 0; i < elements.length; i++) {
            polyfill(elements[i]);
        }
    }

    function polyfillInsertedNodes() {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var node = mutation.addedNodes[i];
                    if (node.nodeName === 'INPUT' && node.getAttribute('type') === 'zip-city') {
                        polyfill(node);
                    }
                }
            });
        });
        observer.observe(document.body, { childList: true });
    }

    var loaded = false;
    function handleLoaded() {
        if (loaded) { return; }
        loaded = true;

        polyfillDocument();
        polyfillInsertedNodes();

    }

    // export
    this.ZipCode = {
        endpoint: endpoint,
        dropdownClass: dropdownClass,
    };

    // handle async
    if (document.readyState == 'complete' || document.readyState == 'interactive') {
        setTimeout(handleLoaded, 1);
    } else {
        document.addEventListener('DOMContentLoaded', handleLoaded);
    }
}).call(this);
