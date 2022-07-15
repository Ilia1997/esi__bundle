
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function each(items, fn) {
        let str = '';
        for (let i = 0; i < items.length; i += 1) {
            str += fn(items[i], i);
        }
        return str;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const amountErrorMessageState = writable(false);

    let currentDate = new Date();
    let currentMonthIndex = currentDate.getMonth();
    let paymentMounthIndex = currentMonthIndex + 1;

    const contributionData = writable({
      period: {},
      country: {},
      amount: "",
      monthlyValue: 0,
      nextPaymentDay: 1,
      nextPaymentMonth: months[paymentMounthIndex],
    });

    const allocatedContributions = writable({
      safe: 0,
      safeName: "0 of Total Contribution",
      adventure: 0,
      adventureName: "0 of Total Contribution",
      founder: 0,
      founderName: "0 of Total Contribution",
    });

    /* src\components\contributions\NextPaymentDate.svelte generated by Svelte v3.48.0 */
    const file$18 = "src\\components\\contributions\\NextPaymentDate.svelte";

    function create_fragment$1c(ctx) {
    	let div;
    	let t0;
    	let span0;
    	let t1_value = /*$contributionData*/ ctx[1].nextPaymentMonth + "";
    	let t1;
    	let t2;
    	let span1;
    	let t3_value = /*$contributionData*/ ctx[1].nextPaymentDay + "";
    	let t3;
    	let t4;
    	let t5;
    	let span2;
    	let t6;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("*The next payment will be on the ");
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = text("st");
    			t5 = space();
    			span2 = element("span");
    			t6 = text(/*currentYear*/ ctx[0]);
    			attr_dev(span0, "class", "svelte-15m5ugh");
    			add_location(span0, file$18, 19, 35, 586);
    			attr_dev(span1, "class", "payment__day svelte-15m5ugh");
    			add_location(span1, file$18, 21, 4, 646);
    			attr_dev(span2, "class", "currentYear svelte-15m5ugh");
    			add_location(span2, file$18, 22, 2, 720);
    			attr_dev(div, "class", "next__payment svelte-15m5ugh");
    			add_location(div, file$18, 18, 0, 522);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, span0);
    			append_dev(span0, t1);
    			append_dev(div, t2);
    			append_dev(div, span1);
    			append_dev(span1, t3);
    			append_dev(span1, t4);
    			append_dev(div, t5);
    			append_dev(div, span2);
    			append_dev(span2, t6);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$contributionData*/ 2 && t1_value !== (t1_value = /*$contributionData*/ ctx[1].nextPaymentMonth + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$contributionData*/ 2 && t3_value !== (t3_value = /*$contributionData*/ ctx[1].nextPaymentDay + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*currentYear*/ 1) set_data_dev(t6, /*currentYear*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1c($$self, $$props, $$invalidate) {
    	let $contributionData;
    	validate_store(contributionData, 'contributionData');
    	component_subscribe($$self, contributionData, $$value => $$invalidate(1, $contributionData = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NextPaymentDate', slots, []);
    	let currentDate = new Date();
    	let currentYear = currentDate.getFullYear();
    	let currentDay = currentDate.getDate();

    	if ($contributionData.nextPaymentMonth === "January") {
    		if ($contributionData.period === "Monthly") {
    			currentYear = currentYear + 1;
    		} else if ($contributionData.period === "Bi-Monthly" && currentDay >= 15) {
    			currentYear = currentYear + 1;
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NextPaymentDate> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		contributionData,
    		currentDate,
    		currentYear,
    		currentDay,
    		$contributionData
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentDate' in $$props) currentDate = $$props.currentDate;
    		if ('currentYear' in $$props) $$invalidate(0, currentYear = $$props.currentYear);
    		if ('currentDay' in $$props) currentDay = $$props.currentDay;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*currentYear*/ 1) ;
    	};

    	return [currentYear, $contributionData];
    }

    class NextPaymentDate extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1c, create_fragment$1c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NextPaymentDate",
    			options,
    			id: create_fragment$1c.name
    		});
    	}
    }

    /* public\images\Dropdown_ico.svelte generated by Svelte v3.48.0 */
    const file$17 = "public\\images\\Dropdown_ico.svelte";

    function create_fragment$1b(ctx) {
    	let svg;
    	let path;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M4.29279 7.30529C4.48031 7.11782 4.73462 7.0125 4.99979 7.0125C5.26495 7.0125 5.51926 7.11782 5.70679 7.30529L11.9998 13.5983L18.2928 7.30529C18.385 7.20978 18.4954 7.1336 18.6174 7.08119C18.7394 7.02878 18.8706 7.00119 19.0034 7.00004C19.1362 6.99888 19.2678 7.02419 19.3907 7.07447C19.5136 7.12475 19.6253 7.199 19.7192 7.29289C19.8131 7.38679 19.8873 7.49844 19.9376 7.62133C19.9879 7.74423 20.0132 7.87591 20.012 8.00869C20.0109 8.14147 19.9833 8.27269 19.9309 8.39469C19.8785 8.5167 19.8023 8.62704 19.7068 8.71929L12.7068 15.7193C12.5193 15.9068 12.265 16.0121 11.9998 16.0121C11.7346 16.0121 11.4803 15.9068 11.2928 15.7193L4.29279 8.71929C4.10532 8.53176 4 8.27745 4 8.01229C4 7.74712 4.10532 7.49282 4.29279 7.30529Z");
    			attr_dev(path, "fill", "#032B01");
    			add_location(path, file$17, 12, 2, 219);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", svg_class_value = "" + (null_to_empty(/*$$props*/ ctx[0].class) + " svelte-xzhk1g"));
    			add_location(svg, file$17, 4, 0, 78);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && svg_class_value !== (svg_class_value = "" + (null_to_empty(/*$$props*/ ctx[0].class) + " svelte-xzhk1g"))) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dropdown_ico', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ compute_rest_props });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Dropdown_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1b, create_fragment$1b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown_ico",
    			options,
    			id: create_fragment$1b.name
    		});
    	}
    }

    /** Dispatch event on click outside of node */
    function clickOutside(node) {
      
        const handleClick = event => {
          if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(
              new CustomEvent('click_outside', node)
            );
          }
        };
      
          document.addEventListener('click', handleClick, true);
        
        return {
          destroy() {
            document.removeEventListener('click', handleClick, true);
          }
          }
      }

    // check only numbers (without "comma", "point" etc)
    // check max value in amount field

    function checkInputValue() {
      this.value = this.value.replace(/[^0-9]/g, "");
      if (this.value.length > this.maxLength) {
        this.value = this.value.slice(0, this.maxLength);
      }
    }

    async function getPeriodsFromDB() {
      const url = `https://be.esi.kdg.com.ua/esi_public/esi_public/backend/getPeriods`;
      try {
        const res = await fetch(url);
        const json = await res.json();
        if (res.ok) {
          return json;
        } else {
          throw new Error(json);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    async function getCountriesFromDB$1() {
      const url = `https://be.esi.kdg.com.ua/esi_public/esi_public/backend/getCountries`;
      try {
        const res = await fetch(url);
        const json = await res.json();
        if (res.ok) {
          return json;
        } else {
          throw new Error(json);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    /* src\components\Preloader.svelte generated by Svelte v3.48.0 */

    const file$16 = "src\\components\\Preloader.svelte";

    function create_fragment$1a(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "loader svelte-sqi965");
    			set_style(div0, "width", /*$$props*/ ctx[0].loaderWidth + "rem");
    			set_style(div0, "height", /*$$props*/ ctx[0].loaderHeight + "rem");
    			set_style(div0, "border-width", /*$$props*/ ctx[0].borderWidth + "rem");
    			add_location(div0, file$16, 1, 4, 35);
    			attr_dev(div1, "class", "loader__wrapper svelte-sqi965");
    			add_location(div1, file$16, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1) {
    				set_style(div0, "width", /*$$props*/ ctx[0].loaderWidth + "rem");
    			}

    			if (dirty & /*$$props*/ 1) {
    				set_style(div0, "height", /*$$props*/ ctx[0].loaderHeight + "rem");
    			}

    			if (dirty & /*$$props*/ 1) {
    				set_style(div0, "border-width", /*$$props*/ ctx[0].borderWidth + "rem");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Preloader', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Preloader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1a, create_fragment$1a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Preloader",
    			options,
    			id: create_fragment$1a.name
    		});
    	}
    }

    /* src\components\contributions\Form.svelte generated by Svelte v3.48.0 */
    const file$15 = "src\\components\\contributions\\Form.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	return child_ctx;
    }

    // (114:8) {:else}
    function create_else_block_1(ctx) {
    	let dropdown_ico;
    	let t0;
    	let div0;
    	let t1_value = (/*$contributionData*/ ctx[5].period.periodName || 'Monthly') + "";
    	let t1;
    	let t2;
    	let div1;
    	let current;

    	dropdown_ico = new Dropdown_ico({
    			props: { class: "contribution" },
    			$$inline: true
    		});

    	let each_value_1 = /*periods*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			create_component(dropdown_ico.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "dropdown__item--current svelte-13dz2en");
    			add_location(div0, file$15, 115, 10, 3386);
    			attr_dev(div1, "class", "dropdown__items svelte-13dz2en");
    			add_location(div1, file$15, 116, 10, 3491);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown_ico, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$contributionData*/ 32) && t1_value !== (t1_value = (/*$contributionData*/ ctx[5].period.periodName || 'Monthly') + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*setPeriod, periods*/ 129) {
    				each_value_1 = /*periods*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown_ico, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(114:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (112:8) {#if periods.length === 0}
    function create_if_block_1$c(ctx) {
    	let preloader;
    	let current;

    	preloader = new Preloader({
    			props: {
    				loaderWidth: 1.5,
    				loaderHeight: 1.5,
    				borderWidth: 0.3
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(preloader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(preloader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(preloader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(preloader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(preloader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$c.name,
    		type: "if",
    		source: "(112:8) {#if periods.length === 0}",
    		ctx
    	});

    	return block;
    }

    // (118:12) {#each periods as period}
    function create_each_block_1$1(ctx) {
    	let div;
    	let t0_value = /*period*/ ctx[28].periodName + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[13](/*period*/ ctx[28]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "dropdown__item svelte-13dz2en");
    			add_location(div, file$15, 118, 14, 3575);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*periods*/ 1 && t0_value !== (t0_value = /*period*/ ctx[28].periodName + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(118:12) {#each periods as period}",
    		ctx
    	});

    	return block;
    }

    // (142:8) {:else}
    function create_else_block$2(ctx) {
    	let dropdown_ico;
    	let t0;
    	let div0;
    	let t1_value = (/*$contributionData*/ ctx[5].country.countryName || 'Chouse country') + "";
    	let t1;
    	let t2;
    	let div1;
    	let current;

    	dropdown_ico = new Dropdown_ico({
    			props: { class: "contribution" },
    			$$inline: true
    		});

    	let each_value = /*countries*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			create_component(dropdown_ico.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "dropdown__item--current svelte-13dz2en");
    			add_location(div0, file$15, 143, 10, 4370);
    			attr_dev(div1, "class", "dropdown__items svelte-13dz2en");
    			add_location(div1, file$15, 146, 10, 4510);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown_ico, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$contributionData*/ 32) && t1_value !== (t1_value = (/*$contributionData*/ ctx[5].country.countryName || 'Chouse country') + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*showCountry, countries*/ 258) {
    				each_value = /*countries*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown_ico, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(142:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (140:8) {#if countries.length === 0}
    function create_if_block$i(ctx) {
    	let preloader;
    	let current;

    	preloader = new Preloader({
    			props: {
    				loaderWidth: 1.5,
    				loaderHeight: 1.5,
    				borderWidth: 0.3
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(preloader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(preloader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(preloader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(preloader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(preloader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(140:8) {#if countries.length === 0}",
    		ctx
    	});

    	return block;
    }

    // (148:12) {#each countries as country}
    function create_each_block$9(ctx) {
    	let div;
    	let t0_value = /*country*/ ctx[25].countryName + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[16](/*country*/ ctx[25]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "dropdown__item svelte-13dz2en");
    			add_location(div, file$15, 148, 14, 4597);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*countries*/ 2 && t0_value !== (t0_value = /*country*/ ctx[25].countryName + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(148:12) {#each countries as country}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$19(ctx) {
    	let div10;
    	let form;
    	let div3;
    	let div0;
    	let t1;
    	let div2;
    	let div1;
    	let current_block_type_index;
    	let if_block0;
    	let t2;
    	let div7;
    	let div4;
    	let t4;
    	let div6;
    	let div5;
    	let current_block_type_index_1;
    	let if_block1;
    	let t5;
    	let div8;
    	let label;
    	let t7;
    	let input_1;
    	let t8;
    	let nextpaymentday;
    	let t9;
    	let div9;
    	let t10;
    	let span0;
    	let t12;
    	let span1;
    	let t14;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$c, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*periods*/ ctx[0].length === 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const if_block_creators_1 = [create_if_block$i, create_else_block$2];
    	const if_blocks_1 = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*countries*/ ctx[1].length === 0) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_1(ctx);
    	if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    	nextpaymentday = new NextPaymentDate({ $$inline: true });

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			form = element("form");
    			div3 = element("div");
    			div0 = element("div");
    			div0.textContent = "Period*";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			if_block0.c();
    			t2 = space();
    			div7 = element("div");
    			div4 = element("div");
    			div4.textContent = "Country*";
    			t4 = space();
    			div6 = element("div");
    			div5 = element("div");
    			if_block1.c();
    			t5 = space();
    			div8 = element("div");
    			label = element("label");
    			label.textContent = "Amount*";
    			t7 = space();
    			input_1 = element("input");
    			t8 = space();
    			create_component(nextpaymentday.$$.fragment);
    			t9 = space();
    			div9 = element("div");
    			t10 = text("*Min. ");
    			span0 = element("span");
    			span0.textContent = "$20";
    			t12 = text(" and ");
    			span1 = element("span");
    			span1.textContent = "$9,999";
    			t14 = text(" Total contribution");
    			attr_dev(div0, "class", "label__text svelte-13dz2en");
    			add_location(div0, file$15, 102, 6, 2875);
    			attr_dev(div1, "class", "dropdown svelte-13dz2en");
    			toggle_class(div1, "activePeriod", /*activePeriod*/ ctx[2]);
    			add_location(div1, file$15, 104, 8, 2962);
    			attr_dev(div2, "class", "dropdown__wrapper svelte-13dz2en");
    			add_location(div2, file$15, 103, 6, 2921);
    			attr_dev(div3, "class", "period svelte-13dz2en");
    			add_location(div3, file$15, 101, 4, 2847);
    			attr_dev(div4, "class", "label__text svelte-13dz2en");
    			add_location(div4, file$15, 128, 6, 3831);
    			attr_dev(div5, "class", "dropdown svelte-13dz2en");
    			toggle_class(div5, "activeCountry", /*activeCountry*/ ctx[3]);
    			add_location(div5, file$15, 132, 8, 3940);
    			attr_dev(div6, "class", "dropdown__wrapper country svelte-13dz2en");
    			add_location(div6, file$15, 131, 6, 3891);
    			attr_dev(div7, "class", "currency svelte-13dz2en");
    			add_location(div7, file$15, 127, 4, 3801);
    			attr_dev(label, "class", "label__text svelte-13dz2en");
    			attr_dev(label, "for", "amount");
    			add_location(label, file$15, 164, 6, 4947);
    			attr_dev(input_1, "type", "number");
    			attr_dev(input_1, "class", "input-sv svelte-13dz2en");
    			attr_dev(input_1, "min", "20");
    			attr_dev(input_1, "max", "9999");
    			attr_dev(input_1, "maxlength", "4");
    			toggle_class(input_1, "error", /*$amountErrorMessageState*/ ctx[6]);
    			add_location(input_1, file$15, 165, 6, 5010);
    			attr_dev(div8, "class", "amount svelte-13dz2en");
    			add_location(div8, file$15, 163, 4, 4895);
    			attr_dev(form, "class", "svelte-13dz2en");
    			add_location(form, file$15, 100, 2, 2810);
    			attr_dev(span0, "class", "svelte-13dz2en");
    			add_location(span0, file$15, 186, 10, 5516);
    			attr_dev(span1, "class", "svelte-13dz2en");
    			add_location(span1, file$15, 186, 31, 5537);
    			attr_dev(div9, "class", "contribution__help--text svelte-13dz2en");
    			add_location(div9, file$15, 185, 2, 5466);
    			attr_dev(div10, "class", "contribution__form svelte-13dz2en");
    			add_location(div10, file$15, 99, 0, 2774);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, form);
    			append_dev(form, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(form, t2);
    			append_dev(form, div7);
    			append_dev(div7, div4);
    			append_dev(div7, t4);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			if_blocks_1[current_block_type_index_1].m(div5, null);
    			append_dev(form, t5);
    			append_dev(form, div8);
    			append_dev(div8, label);
    			append_dev(div8, t7);
    			append_dev(div8, input_1);
    			set_input_value(input_1, /*$contributionData*/ ctx[5].amount);
    			/*div8_binding*/ ctx[21](div8);
    			append_dev(form, t8);
    			mount_component(nextpaymentday, form, null);
    			append_dev(div10, t9);
    			append_dev(div10, div9);
    			append_dev(div9, t10);
    			append_dev(div9, span0);
    			append_dev(div9, t12);
    			append_dev(div9, span1);
    			append_dev(div9, t14);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*click_handler_1*/ ctx[14], false, false, false),
    					action_destroyer(clickOutside.call(null, div1)),
    					listen_dev(div1, "click_outside", /*click_outside_handler*/ ctx[15], false, false, false),
    					listen_dev(div5, "click", /*click_handler_3*/ ctx[17], false, false, false),
    					action_destroyer(clickOutside.call(null, div5)),
    					listen_dev(div5, "click_outside", /*click_outside_handler_1*/ ctx[18], false, false, false),
    					listen_dev(input_1, "mousewheel", mousewheel_handler, false, false, false),
    					listen_dev(input_1, "input", checkInputValue, false, false, false),
    					listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[19]),
    					listen_dev(input_1, "focus", /*focus_handler*/ ctx[20], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[12]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div1, null);
    			}

    			if (dirty & /*activePeriod*/ 4) {
    				toggle_class(div1, "activePeriod", /*activePeriod*/ ctx[2]);
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_1(ctx);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks_1[current_block_type_index_1];

    				if (!if_block1) {
    					if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div5, null);
    			}

    			if (dirty & /*activeCountry*/ 8) {
    				toggle_class(div5, "activeCountry", /*activeCountry*/ ctx[3]);
    			}

    			if (dirty & /*$contributionData*/ 32 && to_number(input_1.value) !== /*$contributionData*/ ctx[5].amount) {
    				set_input_value(input_1, /*$contributionData*/ ctx[5].amount);
    			}

    			if (dirty & /*$amountErrorMessageState*/ 64) {
    				toggle_class(input_1, "error", /*$amountErrorMessageState*/ ctx[6]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(nextpaymentday.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(nextpaymentday.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			if_blocks[current_block_type_index].d();
    			if_blocks_1[current_block_type_index_1].d();
    			/*div8_binding*/ ctx[21](null);
    			destroy_component(nextpaymentday);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$19.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const mousewheel_handler = e => {
    	e.target.blur();
    };

    function instance$19($$self, $$props, $$invalidate) {
    	let $contributionData;
    	let $amountErrorMessageState;
    	validate_store(contributionData, 'contributionData');
    	component_subscribe($$self, contributionData, $$value => $$invalidate(5, $contributionData = $$value));
    	validate_store(amountErrorMessageState, 'amountErrorMessageState');
    	component_subscribe($$self, amountErrorMessageState, $$value => $$invalidate(6, $amountErrorMessageState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Form', slots, []);
    	let activePeriod = false;
    	let activeCountry = false;
    	let periods = [];
    	let countries = [];

    	const months = [
    		"January",
    		"February",
    		"March",
    		"April",
    		"May",
    		"June",
    		"July",
    		"August",
    		"September",
    		"October",
    		"November",
    		"December"
    	];

    	let inputNumber;
    	let { input } = $$props;
    	let currentMonthIndex = new Date().getMonth();
    	let currentDay = new Date().getDate();
    	let paymentMounthIndex = currentMonthIndex + 1;

    	afterUpdate(() => {
    		// if period bi-monthly set next payment day and payment mounth
    		if ($contributionData.period === "Bi-Monthly") {
    			if (currentDay < 15) {
    				$$invalidate(11, paymentMounthIndex = currentMonthIndex);
    				set_store_value(contributionData, $contributionData.nextPaymentDay = 15, $contributionData);
    			} else if (currentDay >= 15) {
    				$$invalidate(11, paymentMounthIndex = currentMonthIndex + 1);
    				set_store_value(contributionData, $contributionData.nextPaymentDay = 1, $contributionData);
    			}
    		} else {
    			$$invalidate(11, paymentMounthIndex = currentMonthIndex + 1);
    			set_store_value(contributionData, $contributionData.nextPaymentDay = 1, $contributionData);
    		}
    	});

    	onMount(async () => {
    		if (inputNumber) {
    			$$invalidate(10, input = inputNumber);
    		}

    		let periodData = await getPeriodsFromDB();

    		periodData.data.forEach(item => {
    			$$invalidate(0, periods = [...periods, item]);
    		});

    		let countriesData = await getCountriesFromDB$1();

    		countriesData.data.forEach(item => {
    			$$invalidate(1, countries = [...countries, item]);
    		});

    		set_store_value(contributionData, $contributionData.period = periods[0], $contributionData);
    		let usaData;

    		countries.forEach(item => {
    			if (item.countryId === 5235134) {
    				usaData = item;
    			}
    		});

    		set_store_value(contributionData, $contributionData.country = usaData, $contributionData);
    	});

    	function setPeriod(value) {
    		// set data to our store
    		set_store_value(contributionData, $contributionData.period = value, $contributionData);
    	}

    	function showCountry(value) {
    		// set data to our store
    		set_store_value(contributionData, $contributionData.country = value, $contributionData);
    	}

    	// click outside dropdown
    	function handleClickOutside(item) {
    		if (item === "activePeriod") {
    			$$invalidate(2, activePeriod = false);
    		} else if (item === "activeCountry") {
    			$$invalidate(3, activeCountry = false);
    		}
    	}

    	const writable_props = ['input'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Form> was created with unknown prop '${key}'`);
    	});

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = period => setPeriod(period);
    	const click_handler_1 = () => $$invalidate(2, activePeriod = !activePeriod);
    	const click_outside_handler = () => handleClickOutside("activePeriod");
    	const click_handler_2 = country => showCountry(country);
    	const click_handler_3 = () => $$invalidate(3, activeCountry = !activeCountry);
    	const click_outside_handler_1 = () => handleClickOutside("activeCountry");

    	function input_1_input_handler() {
    		$contributionData.amount = to_number(this.value);
    		contributionData.set($contributionData);
    	}

    	const focus_handler = () => set_store_value(amountErrorMessageState, $amountErrorMessageState = false, $amountErrorMessageState);

    	function div8_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputNumber = $$value;
    			$$invalidate(4, inputNumber);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('input' in $$props) $$invalidate(10, input = $$props.input);
    	};

    	$$self.$capture_state = () => ({
    		contributionData,
    		amountErrorMessageState,
    		afterUpdate,
    		NextPaymentDay: NextPaymentDate,
    		Dropdown_ico,
    		clickOutside,
    		checkInputValue,
    		onMount,
    		text,
    		getPeriodsFromDB,
    		getCountriesFromDB: getCountriesFromDB$1,
    		Preloader,
    		activePeriod,
    		activeCountry,
    		periods,
    		countries,
    		months,
    		inputNumber,
    		input,
    		currentMonthIndex,
    		currentDay,
    		paymentMounthIndex,
    		setPeriod,
    		showCountry,
    		handleClickOutside,
    		$contributionData,
    		$amountErrorMessageState
    	});

    	$$self.$inject_state = $$props => {
    		if ('activePeriod' in $$props) $$invalidate(2, activePeriod = $$props.activePeriod);
    		if ('activeCountry' in $$props) $$invalidate(3, activeCountry = $$props.activeCountry);
    		if ('periods' in $$props) $$invalidate(0, periods = $$props.periods);
    		if ('countries' in $$props) $$invalidate(1, countries = $$props.countries);
    		if ('inputNumber' in $$props) $$invalidate(4, inputNumber = $$props.inputNumber);
    		if ('input' in $$props) $$invalidate(10, input = $$props.input);
    		if ('currentMonthIndex' in $$props) currentMonthIndex = $$props.currentMonthIndex;
    		if ('currentDay' in $$props) currentDay = $$props.currentDay;
    		if ('paymentMounthIndex' in $$props) $$invalidate(11, paymentMounthIndex = $$props.paymentMounthIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*countries, periods, paymentMounthIndex*/ 2051) {
    			{
    				set_store_value(contributionData, $contributionData.nextPaymentMonth = months[paymentMounthIndex], $contributionData);
    			}
    		}
    	};

    	return [
    		periods,
    		countries,
    		activePeriod,
    		activeCountry,
    		inputNumber,
    		$contributionData,
    		$amountErrorMessageState,
    		setPeriod,
    		showCountry,
    		handleClickOutside,
    		input,
    		paymentMounthIndex,
    		submit_handler,
    		click_handler,
    		click_handler_1,
    		click_outside_handler,
    		click_handler_2,
    		click_handler_3,
    		click_outside_handler_1,
    		input_1_input_handler,
    		focus_handler,
    		div8_binding
    	];
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$19, create_fragment$19, safe_not_equal, { input: 10 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$19.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*input*/ ctx[10] === undefined && !('input' in props)) {
    			console.warn("<Form> was created without expected prop 'input'");
    		}
    	}

    	get input() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const stepCounter = writable(1);
    const headSteps = writable({
        firstStep: true,
        secondStep: false,
        thirdStep: false,
        fourthStep: false,
        fifthStep: false
    });
    const popUpHeight = writable();
    function incrementStep() {
        stepCounter.update(n => n + 1);
    }
    function decrementStep() {
        if(get_store_value(stepCounter) > 1){
            stepCounter.update(n => n - 1 );
        }
    }
    const successMessageState = writable(false);
    const userAuthToken = writable();
    const clientSecretToken = writable();

    let subscribeAllState = writable(false);

    let scrollToTop$1 = (topOffset = 50) => {
        requestAnimationFrame(() => window.scrollTo(0,topOffset));
    };

    let priceConvertation = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    var _ = {
      $(selector) {
        if (typeof selector === "string") {
          return document.querySelector(selector);
        }
        return selector;
      },
      extend(...args) {
        return Object.assign(...args);
      },
      cumulativeOffset(element) {
        let top = 0;
        let left = 0;

        do {
          top += element.offsetTop || 0;
          left += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element);

        return {
          top: top,
          left: left
        };
      },
      directScroll(element) {
        return element && element !== document && element !== document.body;
      },
      scrollTop(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollTop = value) : element.scrollTop;
        } else {
          return inSetter
            ? (document.documentElement.scrollTop = document.body.scrollTop = value)
            : window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;
        }
      },
      scrollLeft(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollLeft = value) : element.scrollLeft;
        } else {
          return inSetter
            ? (document.documentElement.scrollLeft = document.body.scrollLeft = value)
            : window.pageXOffset ||
                document.documentElement.scrollLeft ||
                document.body.scrollLeft ||
                0;
        }
      }
    };

    const defaultOptions = {
      container: "body",
      duration: 500,
      delay: 0,
      offset: 0,
      easing: cubicInOut,
      onStart: noop,
      onDone: noop,
      onAborting: noop,
      scrollX: false,
      scrollY: true
    };

    const _scrollTo = options => {
      let {
        offset,
        duration,
        delay,
        easing,
        x=0,
        y=0,
        scrollX,
        scrollY,
        onStart,
        onDone,
        container,
        onAborting,
        element
      } = options;

      if (typeof offset === "function") {
        offset = offset();
      }

      var cumulativeOffsetContainer = _.cumulativeOffset(container);
      var cumulativeOffsetTarget = element
        ? _.cumulativeOffset(element)
        : { top: y, left: x };

      var initialX = _.scrollLeft(container);
      var initialY = _.scrollTop(container);

      var targetX =
        cumulativeOffsetTarget.left - cumulativeOffsetContainer.left + offset;
      var targetY =
        cumulativeOffsetTarget.top - cumulativeOffsetContainer.top + offset;

      var diffX = targetX - initialX;
    	var diffY = targetY - initialY;

      let scrolling = true;
      let started = false;
      let start_time = now() + delay;
      let end_time = start_time + duration;

      function scrollToTopLeft(element, top, left) {
        if (scrollX) _.scrollLeft(element, left);
        if (scrollY) _.scrollTop(element, top);
      }

      function start(delayStart) {
        if (!delayStart) {
          started = true;
          onStart(element, {x, y});
        }
      }

      function tick(progress) {
        scrollToTopLeft(
          container,
          initialY + diffY * progress,
          initialX + diffX * progress
        );
      }

      function stop() {
        scrolling = false;
      }

      loop(now => {
        if (!started && now >= start_time) {
          start(false);
        }

        if (started && now >= end_time) {
          tick(1);
          stop();
          onDone(element, {x, y});
        }

        if (!scrolling) {
          onAborting(element, {x, y});
          return false;
        }
        if (started) {
          const p = now - start_time;
          const t = 0 + 1 * easing(p / duration);
          tick(t);
        }

        return true;
      });

      start(delay);

      tick(0);

      return stop;
    };

    const proceedOptions = options => {
    	let opts = _.extend({}, defaultOptions, options);
      opts.container = _.$(opts.container);
      opts.element = _.$(opts.element);
      return opts;
    };

    const scrollContainerHeight = containerElement => {
      if (
        containerElement &&
        containerElement !== document &&
        containerElement !== document.body
      ) {
        return containerElement.scrollHeight - containerElement.offsetHeight;
      } else {
        let body = document.body;
        let html = document.documentElement;

        return Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
      }
    };

    const setGlobalOptions = options => {
    	_.extend(defaultOptions, options || {});
    };

    const scrollTo$1 = options => {
      return _scrollTo(proceedOptions(options));
    };

    const scrollToBottom = options => {
      options = proceedOptions(options);

      return _scrollTo(
        _.extend(options, {
          element: null,
          y: scrollContainerHeight(options.container)
        })
      );
    };

    const scrollToTop = options => {
      options = proceedOptions(options);

      return _scrollTo(
        _.extend(options, {
          element: null,
          y: 0
        })
      );
    };

    const makeScrollToAction = scrollToFunc => {
      return (node, options) => {
        let current = options;
        const handle = e => {
          e.preventDefault();
          scrollToFunc(
            typeof current === "string" ? { element: current } : current
          );
        };
        node.addEventListener("click", handle);
        node.addEventListener("touchstart", handle);
        return {
          update(options) {
            current = options;
          },
          destroy() {
            node.removeEventListener("click", handle);
            node.removeEventListener("touchstart", handle);
          }
        };
      };
    };

    const scrollto = makeScrollToAction(scrollTo$1);
    const scrolltotop = makeScrollToAction(scrollToTop);
    const scrolltobottom = makeScrollToAction(scrollToBottom);

    var animateScroll = /*#__PURE__*/Object.freeze({
        __proto__: null,
        setGlobalOptions: setGlobalOptions,
        scrollTo: scrollTo$1,
        scrollToBottom: scrollToBottom,
        scrollToTop: scrollToTop,
        makeScrollToAction: makeScrollToAction,
        scrollto: scrollto,
        scrolltotop: scrolltotop,
        scrolltobottom: scrolltobottom
    });

    /* src\components\contributions\Rules.svelte generated by Svelte v3.48.0 */

    const file$14 = "src\\components\\contributions\\Rules.svelte";

    function create_fragment$18(ctx) {
    	let div3;
    	let div0;
    	let h2;
    	let t1;
    	let p;
    	let t3;
    	let div2;
    	let div1;
    	let t5;
    	let ol;
    	let li0;
    	let t7;
    	let li1;
    	let t9;
    	let li2;
    	let t11;
    	let li3;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Our House. Our Goals.";
    			t1 = space();
    			p = element("p");
    			p.textContent = "We convert your money into green savings using a “long term” philosophy.\r\n      This allows us to actively produce investment value, whilst simultaneously\r\n      making a green impact. Although we put emphasis on creating value, we do\r\n      not do so at the expense of the environment. To reach our common\r\n      objectives there are few simple rules we need to apply.";
    			t3 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div1.textContent = "Our Rules:";
    			t5 = space();
    			ol = element("ol");
    			li0 = element("li");
    			li0.textContent = "We require your periodic contribution to be invested for 12 months.";
    			t7 = space();
    			li1 = element("li");
    			li1.textContent = "We always select investments that have a healthy balance between value and green impact.";
    			t9 = space();
    			li2 = element("li");
    			li2.textContent = "Withdrawals under 20% of the total value of your wallet will be processed immediately. Any amount over that 20% will vary to no more than 30 days.";
    			t11 = space();
    			li3 = element("li");
    			li3.textContent = "Community is an essential value. We encourage you to share the news of our ESi community so we can achieve our goal of becoming pioneers in our field";
    			attr_dev(h2, "class", "h2-sv svelte-1aqet45");
    			add_location(h2, file$14, 2, 4, 82);
    			attr_dev(p, "class", "svelte-1aqet45");
    			add_location(p, file$14, 3, 4, 132);
    			attr_dev(div0, "class", "contribution__right__head svelte-1aqet45");
    			add_location(div0, file$14, 1, 2, 37);
    			attr_dev(div1, "class", "rules__list__head svelte-1aqet45");
    			add_location(div1, file$14, 12, 4, 567);
    			attr_dev(li0, "class", "svelte-1aqet45");
    			add_location(li0, file$14, 14, 6, 632);
    			attr_dev(li1, "class", "svelte-1aqet45");
    			add_location(li1, file$14, 17, 6, 734);
    			attr_dev(li2, "class", "svelte-1aqet45");
    			add_location(li2, file$14, 20, 6, 857);
    			attr_dev(li3, "class", "svelte-1aqet45");
    			add_location(li3, file$14, 23, 6, 1039);
    			attr_dev(ol, "class", "svelte-1aqet45");
    			add_location(ol, file$14, 13, 4, 620);
    			attr_dev(div2, "class", "rules__list svelte-1aqet45");
    			add_location(div2, file$14, 11, 2, 536);
    			attr_dev(div3, "class", "contribution__right svelte-1aqet45");
    			add_location(div3, file$14, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div2, t5);
    			append_dev(div2, ol);
    			append_dev(ol, li0);
    			append_dev(ol, t7);
    			append_dev(ol, li1);
    			append_dev(ol, t9);
    			append_dev(ol, li2);
    			append_dev(ol, t11);
    			append_dev(ol, li3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$18.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$18($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Rules', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Rules> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Rules extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$18, create_fragment$18, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Rules",
    			options,
    			id: create_fragment$18.name
    		});
    	}
    }

    /* public\images\Button_right_ico.svelte generated by Svelte v3.48.0 */

    const file$13 = "public\\images\\Button_right_ico.svelte";

    function create_fragment$17(ctx) {
    	let svg;
    	let path;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M4.63119 1.43197C4.46715 1.59606 4.375 1.81858 4.375 2.05059C4.375 2.28261 4.46715 2.50513 4.63119 2.66922L8.96244 7.00047L4.63119 11.3317C4.4718 11.4967 4.3836 11.7178 4.3856 11.9472C4.38759 12.1766 4.47961 12.3961 4.64185 12.5583C4.80408 12.7205 5.02354 12.8126 5.25296 12.8146C5.48238 12.8166 5.70341 12.7284 5.86844 12.569L10.8183 7.61909C10.9823 7.45501 11.0745 7.23249 11.0745 7.00047C11.0745 6.76845 10.9823 6.54593 10.8183 6.38184L5.86844 1.43197C5.70435 1.26793 5.48183 1.17578 5.24981 1.17578C5.01779 1.17578 4.79527 1.26793 4.63119 1.43197Z");
    			attr_dev(path, "fill", "#0084FF");
    			attr_dev(path, "class", "svelte-rdifui");
    			add_location(path, file$13, 10, 4, 199);
    			attr_dev(svg, "class", svg_class_value = "ico " + /*className*/ ctx[0] + " svelte-rdifui");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "14");
    			attr_dev(svg, "height", "14");
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "fill", "none");
    			add_location(svg, file$13, 3, 0, 45);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*className*/ 1 && svg_class_value !== (svg_class_value = "ico " + /*className*/ ctx[0] + " svelte-rdifui")) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$17.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$17($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button_right_ico', slots, []);
    	let { className } = $$props;
    	const writable_props = ['className'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button_right_ico> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    	};

    	$$self.$capture_state = () => ({ className });

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [className];
    }

    class Button_right_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$17, create_fragment$17, safe_not_equal, { className: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button_right_ico",
    			options,
    			id: create_fragment$17.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*className*/ ctx[0] === undefined && !('className' in props)) {
    			console.warn("<Button_right_ico> was created without expected prop 'className'");
    		}
    	}

    	get className() {
    		throw new Error("<Button_right_ico>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<Button_right_ico>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\buttons\ButtonRight.svelte generated by Svelte v3.48.0 */
    const file$12 = "src\\components\\buttons\\ButtonRight.svelte";

    function create_fragment$16(ctx) {
    	let button;
    	let button_right_ico;
    	let button_disabled_value;
    	let current;
    	let mounted;
    	let dispose;

    	button_right_ico = new Button_right_ico({
    			props: {
    				className: !/*buttonState*/ ctx[0] ? 'disabled' : ''
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(button_right_ico.$$.fragment);
    			attr_dev(button, "class", "btn-sv svelte-1s56x9q");
    			button.disabled = button_disabled_value = !/*buttonState*/ ctx[0];
    			add_location(button, file$12, 5, 0, 139);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(button_right_ico, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const button_right_ico_changes = {};
    			if (dirty & /*buttonState*/ 1) button_right_ico_changes.className = !/*buttonState*/ ctx[0] ? 'disabled' : '';
    			button_right_ico.$set(button_right_ico_changes);

    			if (!current || dirty & /*buttonState*/ 1 && button_disabled_value !== (button_disabled_value = !/*buttonState*/ ctx[0])) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button_right_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button_right_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(button_right_ico);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$16.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$16($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ButtonRight', slots, []);
    	let { buttonState = true } = $$props;
    	const writable_props = ['buttonState'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ButtonRight> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('buttonState' in $$props) $$invalidate(0, buttonState = $$props.buttonState);
    	};

    	$$self.$capture_state = () => ({ buttonState, Button_right_ico });

    	$$self.$inject_state = $$props => {
    		if ('buttonState' in $$props) $$invalidate(0, buttonState = $$props.buttonState);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [buttonState, click_handler];
    }

    class ButtonRight extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$16, create_fragment$16, safe_not_equal, { buttonState: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonRight",
    			options,
    			id: create_fragment$16.name
    		});
    	}

    	get buttonState() {
    		throw new Error("<ButtonRight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonState(value) {
    		throw new Error("<ButtonRight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }
    function crossfade(_a) {
        var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
        const to_receive = new Map();
        const to_send = new Map();
        function crossfade(from, node, params) {
            const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
            const to = node.getBoundingClientRect();
            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const dw = from.width / to.width;
            const dh = from.height / to.height;
            const d = Math.sqrt(dx * dx + dy * dy);
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            const opacity = +style.opacity;
            return {
                delay,
                duration: is_function(duration) ? duration(d) : duration,
                easing,
                css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
            };
        }
        function transition(items, counterparts, intro) {
            return (node, params) => {
                items.set(params.key, {
                    rect: node.getBoundingClientRect()
                });
                return () => {
                    if (counterparts.has(params.key)) {
                        const { rect } = counterparts.get(params.key);
                        counterparts.delete(params.key);
                        return crossfade(rect, node, params);
                    }
                    // if the node is disappearing altogether
                    // (i.e. wasn't claimed by the other list)
                    // then we need to supply an outro
                    items.delete(params.key);
                    return fallback && fallback(node, params, intro);
                };
            };
        }
        return [
            transition(to_send, to_receive, false),
            transition(to_receive, to_send, true)
        ];
    }

    /* src\components\ErrorMessage.svelte generated by Svelte v3.48.0 */
    const file$11 = "src\\components\\ErrorMessage.svelte";

    function create_fragment$15(ctx) {
    	let div;
    	let t;
    	let div_intro;
    	let div_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*errorMessage*/ ctx[0]);
    			attr_dev(div, "class", "error__message svelte-1jn1igk");
    			add_location(div, file$11, 4, 0, 95);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*errorMessage*/ 1) set_data_dev(t, /*errorMessage*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fade, { duration: 300 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, { duration: 150 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$15.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$15($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ErrorMessage', slots, []);
    	let { errorMessage } = $$props;
    	const writable_props = ['errorMessage'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ErrorMessage> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('errorMessage' in $$props) $$invalidate(0, errorMessage = $$props.errorMessage);
    	};

    	$$self.$capture_state = () => ({ fade, errorMessage });

    	$$self.$inject_state = $$props => {
    		if ('errorMessage' in $$props) $$invalidate(0, errorMessage = $$props.errorMessage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [errorMessage];
    }

    class ErrorMessage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$15, create_fragment$15, safe_not_equal, { errorMessage: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ErrorMessage",
    			options,
    			id: create_fragment$15.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*errorMessage*/ ctx[0] === undefined && !('errorMessage' in props)) {
    			console.warn("<ErrorMessage> was created without expected prop 'errorMessage'");
    		}
    	}

    	get errorMessage() {
    		throw new Error("<ErrorMessage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set errorMessage(value) {
    		throw new Error("<ErrorMessage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\contributions\Contribution.svelte generated by Svelte v3.48.0 */
    const file$10 = "src\\components\\contributions\\Contribution.svelte";

    // (125:8) {#if $amountErrorMessageState}
    function create_if_block$h(ctx) {
    	let errormessage;
    	let current;

    	errormessage = new ErrorMessage({
    			props: {
    				errorMessage: /*amountErrorMessage*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(errormessage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(errormessage, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const errormessage_changes = {};
    			if (dirty & /*amountErrorMessage*/ 1) errormessage_changes.errorMessage = /*amountErrorMessage*/ ctx[0];
    			errormessage.$set(errormessage_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(errormessage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(errormessage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(errormessage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(125:8) {#if $amountErrorMessageState}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$14(ctx) {
    	let div21;
    	let div20;
    	let div19;
    	let div0;
    	let h2;
    	let t0;
    	let span0;
    	let t2;
    	let form;
    	let updating_input;
    	let t3;
    	let div16;
    	let div15;
    	let div1;
    	let t5;
    	let div14;
    	let div5;
    	let div2;
    	let t6;
    	let span1;
    	let t8;
    	let t9;
    	let div4;
    	let div3;
    	let t10_value = (/*data*/ ctx[1].country?.currency?.symbol || '$') + "";
    	let t10;

    	let t11_value = (/*moVal*/ ctx[3]
    	? priceConvertation(/*moVal*/ ctx[3])
    	: 0) + "";

    	let t11;
    	let span2;
    	let t13;
    	let div9;
    	let div6;
    	let t14;
    	let span3;
    	let t16;
    	let t17;
    	let div8;
    	let div7;
    	let t18_value = (/*data*/ ctx[1].country?.currency?.symbol || '$') + "";
    	let t18;
    	let t19_value = priceConvertation(/*yrVal*/ ctx[4]) + "";
    	let t19;
    	let span4;
    	let t21;
    	let div13;
    	let div10;
    	let span5;
    	let t23;
    	let t24;
    	let div12;
    	let div11;
    	let t25_value = (/*data*/ ctx[1].country?.currency?.symbol || '$') + "";
    	let t25;
    	let t26_value = priceConvertation(/*fiveYrVal*/ ctx[5]) + "";
    	let t26;
    	let span6;
    	let t28;
    	let rules;
    	let t29;
    	let div18;
    	let t30;
    	let div17;
    	let buttonright;
    	let current;

    	function form_input_binding(value) {
    		/*form_input_binding*/ ctx[8](value);
    	}

    	let form_props = {};

    	if (/*input*/ ctx[2] !== void 0) {
    		form_props.input = /*input*/ ctx[2];
    	}

    	form = new Form({ props: form_props, $$inline: true });
    	binding_callbacks.push(() => bind(form, 'input', form_input_binding));
    	rules = new Rules({ $$inline: true });
    	let if_block = /*$amountErrorMessageState*/ ctx[6] && create_if_block$h(ctx);
    	buttonright = new ButtonRight({ $$inline: true });
    	buttonright.$on("click", /*changeStep*/ ctx[7]);

    	const block = {
    		c: function create() {
    			div21 = element("div");
    			div20 = element("div");
    			div19 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			t0 = text("Choose your ");
    			span0 = element("span");
    			span0.textContent = "Contribution";
    			t2 = space();
    			create_component(form.$$.fragment);
    			t3 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div1 = element("div");
    			div1.textContent = "Projection & Rules";
    			t5 = space();
    			div14 = element("div");
    			div5 = element("div");
    			div2 = element("div");
    			t6 = text("Your ");
    			span1 = element("span");
    			span1.textContent = "Green";
    			t8 = text("\r\n                Contribution");
    			t9 = space();
    			div4 = element("div");
    			div3 = element("div");
    			t10 = text(t10_value);
    			t11 = text(t11_value);
    			span2 = element("span");
    			span2.textContent = "/mo";
    			t13 = space();
    			div9 = element("div");
    			div6 = element("div");
    			t14 = text("Annual ");
    			span3 = element("span");
    			span3.textContent = "Green";
    			t16 = text(" Conversion");
    			t17 = space();
    			div8 = element("div");
    			div7 = element("div");
    			t18 = text(t18_value);
    			t19 = text(t19_value);
    			span4 = element("span");
    			span4.textContent = "/yr";
    			t21 = space();
    			div13 = element("div");
    			div10 = element("div");
    			span5 = element("span");
    			span5.textContent = "Green";
    			t23 = text("\r\n                Saving Projection");
    			t24 = space();
    			div12 = element("div");
    			div11 = element("div");
    			t25 = text(t25_value);
    			t26 = text(t26_value);
    			span6 = element("span");
    			span6.textContent = "/5yrs";
    			t28 = space();
    			create_component(rules.$$.fragment);
    			t29 = space();
    			div18 = element("div");
    			if (if_block) if_block.c();
    			t30 = space();
    			div17 = element("div");
    			create_component(buttonright.$$.fragment);
    			attr_dev(span0, "class", "green svelte-1ggj1uf");
    			add_location(span0, file$10, 73, 22, 2137);
    			attr_dev(h2, "class", "h2-sv svelte-1ggj1uf");
    			add_location(h2, file$10, 72, 8, 2095);
    			attr_dev(div0, "class", "contribution__head svelte-1ggj1uf");
    			add_location(div0, file$10, 71, 6, 2053);
    			attr_dev(div1, "class", "rules__head svelte-1ggj1uf");
    			add_location(div1, file$10, 79, 10, 2307);
    			attr_dev(span1, "class", "svelte-1ggj1uf");
    			add_location(span1, file$10, 83, 21, 2502);
    			attr_dev(div2, "class", "rules_text contr svelte-1ggj1uf");
    			add_location(div2, file$10, 82, 14, 2449);
    			attr_dev(span2, "class", "svelte-1ggj1uf");
    			add_location(span2, file$10, 90, 24, 2802);
    			attr_dev(div3, "class", "rules__val svelte-1ggj1uf");
    			add_location(div3, file$10, 87, 16, 2639);
    			attr_dev(div4, "class", "rules__val__wrapper svelte-1ggj1uf");
    			add_location(div4, file$10, 86, 14, 2588);
    			attr_dev(div5, "class", "rules__item svelte-1ggj1uf");
    			add_location(div5, file$10, 81, 12, 2408);
    			attr_dev(span3, "class", "svelte-1ggj1uf");
    			add_location(span3, file$10, 96, 23, 3002);
    			attr_dev(div6, "class", "rules_text conver svelte-1ggj1uf");
    			add_location(div6, file$10, 95, 14, 2946);
    			attr_dev(span4, "class", "svelte-1ggj1uf");
    			add_location(span4, file$10, 100, 83, 3229);
    			attr_dev(div7, "class", "rules__val svelte-1ggj1uf");
    			add_location(div7, file$10, 99, 16, 3120);
    			attr_dev(div8, "class", "rules__val__wrapper svelte-1ggj1uf");
    			add_location(div8, file$10, 98, 14, 3069);
    			attr_dev(div9, "class", "rules__item center svelte-1ggj1uf");
    			add_location(div9, file$10, 94, 12, 2898);
    			attr_dev(span5, "class", "svelte-1ggj1uf");
    			add_location(span5, file$10, 107, 16, 3436);
    			attr_dev(div10, "class", "rules_text project svelte-1ggj1uf");
    			add_location(div10, file$10, 106, 14, 3386);
    			attr_dev(span6, "class", "svelte-1ggj1uf");
    			add_location(span6, file$10, 112, 87, 3691);
    			attr_dev(div11, "class", "rules__val svelte-1ggj1uf");
    			add_location(div11, file$10, 111, 16, 3578);
    			attr_dev(div12, "class", "rules__val__wrapper svelte-1ggj1uf");
    			add_location(div12, file$10, 110, 14, 3527);
    			attr_dev(div13, "class", "rules__item svelte-1ggj1uf");
    			add_location(div13, file$10, 105, 12, 3345);
    			attr_dev(div14, "class", "rules__items svelte-1ggj1uf");
    			add_location(div14, file$10, 80, 10, 2368);
    			attr_dev(div15, "class", "rules__top svelte-1ggj1uf");
    			add_location(div15, file$10, 78, 8, 2271);
    			attr_dev(div16, "class", "rules svelte-1ggj1uf");
    			add_location(div16, file$10, 77, 6, 2242);
    			attr_dev(div17, "class", "step__footer svelte-1ggj1uf");
    			add_location(div17, file$10, 127, 8, 4052);
    			attr_dev(div18, "class", "relative__wrapper svelte-1ggj1uf");
    			add_location(div18, file$10, 123, 6, 3894);
    			add_location(div19, file$10, 70, 4, 2040);
    			attr_dev(div20, "class", "column-left svelte-1ggj1uf");
    			add_location(div20, file$10, 69, 2, 2009);
    			attr_dev(div21, "class", "contribution__main svelte-1ggj1uf");
    			add_location(div21, file$10, 68, 0, 1973);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div21, anchor);
    			append_dev(div21, div20);
    			append_dev(div20, div19);
    			append_dev(div19, div0);
    			append_dev(div0, h2);
    			append_dev(h2, t0);
    			append_dev(h2, span0);
    			append_dev(div0, t2);
    			mount_component(form, div0, null);
    			append_dev(div19, t3);
    			append_dev(div19, div16);
    			append_dev(div16, div15);
    			append_dev(div15, div1);
    			append_dev(div15, t5);
    			append_dev(div15, div14);
    			append_dev(div14, div5);
    			append_dev(div5, div2);
    			append_dev(div2, t6);
    			append_dev(div2, span1);
    			append_dev(div2, t8);
    			append_dev(div5, t9);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, t10);
    			append_dev(div3, t11);
    			append_dev(div3, span2);
    			append_dev(div14, t13);
    			append_dev(div14, div9);
    			append_dev(div9, div6);
    			append_dev(div6, t14);
    			append_dev(div6, span3);
    			append_dev(div6, t16);
    			append_dev(div9, t17);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, t18);
    			append_dev(div7, t19);
    			append_dev(div7, span4);
    			append_dev(div14, t21);
    			append_dev(div14, div13);
    			append_dev(div13, div10);
    			append_dev(div10, span5);
    			append_dev(div10, t23);
    			append_dev(div13, t24);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, t25);
    			append_dev(div11, t26);
    			append_dev(div11, span6);
    			append_dev(div16, t28);
    			mount_component(rules, div16, null);
    			append_dev(div19, t29);
    			append_dev(div19, div18);
    			if (if_block) if_block.m(div18, null);
    			append_dev(div18, t30);
    			append_dev(div18, div17);
    			mount_component(buttonright, div17, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const form_changes = {};

    			if (!updating_input && dirty & /*input*/ 4) {
    				updating_input = true;
    				form_changes.input = /*input*/ ctx[2];
    				add_flush_callback(() => updating_input = false);
    			}

    			form.$set(form_changes);
    			if ((!current || dirty & /*data*/ 2) && t10_value !== (t10_value = (/*data*/ ctx[1].country?.currency?.symbol || '$') + "")) set_data_dev(t10, t10_value);

    			if ((!current || dirty & /*moVal*/ 8) && t11_value !== (t11_value = (/*moVal*/ ctx[3]
    			? priceConvertation(/*moVal*/ ctx[3])
    			: 0) + "")) set_data_dev(t11, t11_value);

    			if ((!current || dirty & /*data*/ 2) && t18_value !== (t18_value = (/*data*/ ctx[1].country?.currency?.symbol || '$') + "")) set_data_dev(t18, t18_value);
    			if ((!current || dirty & /*yrVal*/ 16) && t19_value !== (t19_value = priceConvertation(/*yrVal*/ ctx[4]) + "")) set_data_dev(t19, t19_value);
    			if ((!current || dirty & /*data*/ 2) && t25_value !== (t25_value = (/*data*/ ctx[1].country?.currency?.symbol || '$') + "")) set_data_dev(t25, t25_value);
    			if ((!current || dirty & /*fiveYrVal*/ 32) && t26_value !== (t26_value = priceConvertation(/*fiveYrVal*/ ctx[5]) + "")) set_data_dev(t26, t26_value);

    			if (/*$amountErrorMessageState*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$amountErrorMessageState*/ 64) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$h(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div18, t30);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			transition_in(rules.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(buttonright.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			transition_out(rules.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(buttonright.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div21);
    			destroy_component(form);
    			destroy_component(rules);
    			if (if_block) if_block.d();
    			destroy_component(buttonright);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$14.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$14($$self, $$props, $$invalidate) {
    	let $amountErrorMessageState;
    	let $contributionData;
    	let $headSteps;
    	validate_store(amountErrorMessageState, 'amountErrorMessageState');
    	component_subscribe($$self, amountErrorMessageState, $$value => $$invalidate(6, $amountErrorMessageState = $$value));
    	validate_store(contributionData, 'contributionData');
    	component_subscribe($$self, contributionData, $$value => $$invalidate(10, $contributionData = $$value));
    	validate_store(headSteps, 'headSteps');
    	component_subscribe($$self, headSteps, $$value => $$invalidate(11, $headSteps = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contribution', slots, []);
    	let changeCounter = 0;
    	let amountErrorMessage = "Error message";

    	function changeStep() {
    		if (validateAmount()) {
    			set_store_value(headSteps, $headSteps.secondStep = true, $headSteps);

    			if (changeCounter === 0) {
    				incrementStep();
    				changeCounter += 1;
    				scrollToTop$1();
    			}
    		}
    	}

    	let data;
    	let input;

    	const unsubscribe = contributionData.subscribe(value => {
    		$$invalidate(1, data = value);
    	});

    	function validateAmount() {
    		if (data.amount < 20) {
    			$$invalidate(0, amountErrorMessage = "Amount value shoud be more than 20");
    			set_store_value(amountErrorMessageState, $amountErrorMessageState = true, $amountErrorMessageState);
    			scrollToTop$1();
    		} else {
    			return true;
    		}
    	}

    	let moVal = data.monthlyValue, yrVal = 0, fiveYrVal = 0;

    	beforeUpdate(() => {
    		// if period monthly - set current value
    		if (data.period.periodName === "Monthly") {
    			$$invalidate(3, moVal = data.amount);
    			set_store_value(contributionData, $contributionData.monthlyValue = moVal, $contributionData);
    		} else if (data.period.periodName === "Bi-Monthly") {
    			$$invalidate(3, moVal = data.amount * 2); // if bi-monthly - divide value into two
    			set_store_value(contributionData, $contributionData.monthlyValue = moVal, $contributionData);
    		}

    		$$invalidate(4, yrVal = moVal * 12);
    		$$invalidate(5, fiveYrVal = yrVal * 5);
    	});

    	afterUpdate(() => {
    		if (data.amount > 20 && data.amount < 9999) {
    			set_store_value(amountErrorMessageState, $amountErrorMessageState = false, $amountErrorMessageState);
    		}
    	});

    	onDestroy(unsubscribe);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contribution> was created with unknown prop '${key}'`);
    	});

    	function form_input_binding(value) {
    		input = value;
    		$$invalidate(2, input);
    	}

    	$$self.$capture_state = () => ({
    		Form,
    		incrementStep,
    		headSteps,
    		contributionData,
    		amountErrorMessageState,
    		afterUpdate,
    		beforeUpdate,
    		onDestroy,
    		scrollToTop: scrollToTop$1,
    		priceConvertation,
    		animateScroll,
    		Rules,
    		ButtonRight,
    		ErrorMessage,
    		changeCounter,
    		amountErrorMessage,
    		changeStep,
    		data,
    		input,
    		unsubscribe,
    		validateAmount,
    		moVal,
    		yrVal,
    		fiveYrVal,
    		$amountErrorMessageState,
    		$contributionData,
    		$headSteps
    	});

    	$$self.$inject_state = $$props => {
    		if ('changeCounter' in $$props) changeCounter = $$props.changeCounter;
    		if ('amountErrorMessage' in $$props) $$invalidate(0, amountErrorMessage = $$props.amountErrorMessage);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('input' in $$props) $$invalidate(2, input = $$props.input);
    		if ('moVal' in $$props) $$invalidate(3, moVal = $$props.moVal);
    		if ('yrVal' in $$props) $$invalidate(4, yrVal = $$props.yrVal);
    		if ('fiveYrVal' in $$props) $$invalidate(5, fiveYrVal = $$props.fiveYrVal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		amountErrorMessage,
    		data,
    		input,
    		moVal,
    		yrVal,
    		fiveYrVal,
    		$amountErrorMessageState,
    		changeStep,
    		form_input_binding
    	];
    }

    class Contribution extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$14, create_fragment$14, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contribution",
    			options,
    			id: create_fragment$14.name
    		});
    	}
    }

    /* public\images\StepContribution_ico.svelte generated by Svelte v3.48.0 */

    const file$$ = "public\\images\\StepContribution_ico.svelte";

    function create_fragment$13(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z");
    			attr_dev(path, "fill", "#3E6B2C");
    			add_location(path, file$$, 8, 4, 155);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", "svg__icon");
    			add_location(svg, file$$, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$13.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$13($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StepContribution_ico', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StepContribution_ico> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class StepContribution_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$13, create_fragment$13, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StepContribution_ico",
    			options,
    			id: create_fragment$13.name
    		});
    	}
    }

    /* public\images\StepPlan_ico.svelte generated by Svelte v3.48.0 */

    const file$_ = "public\\images\\StepPlan_ico.svelte";

    function create_fragment$12(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z");
    			attr_dev(path, "fill", "#3E6B2C");
    			add_location(path, file$_, 8, 4, 151);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", "svg__icon");
    			add_location(svg, file$_, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$12.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$12($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StepPlan_ico', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StepPlan_ico> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class StepPlan_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$12, create_fragment$12, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StepPlan_ico",
    			options,
    			id: create_fragment$12.name
    		});
    	}
    }

    /* public\images\StepLegal_ico.svelte generated by Svelte v3.48.0 */

    const file$Z = "public\\images\\StepLegal_ico.svelte";

    function create_fragment$11(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z");
    			attr_dev(path, "fill", "#3E6B2C");
    			add_location(path, file$Z, 8, 4, 151);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", "svg__icon");
    			add_location(svg, file$Z, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$11.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$11($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StepLegal_ico', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StepLegal_ico> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class StepLegal_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$11, create_fragment$11, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StepLegal_ico",
    			options,
    			id: create_fragment$11.name
    		});
    	}
    }

    /* public\images\StepInformation_ico.svelte generated by Svelte v3.48.0 */

    const file$Y = "public\\images\\StepInformation_ico.svelte";

    function create_fragment$10(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z");
    			attr_dev(path, "fill", "#3E6B2C");
    			add_location(path, file$Y, 8, 4, 151);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", "svg__icon");
    			add_location(svg, file$Y, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$10.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$10($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StepInformation_ico', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StepInformation_ico> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class StepInformation_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$10, create_fragment$10, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StepInformation_ico",
    			options,
    			id: create_fragment$10.name
    		});
    	}
    }

    /* public\images\StepBilling_ico.svelte generated by Svelte v3.48.0 */

    const file$X = "public\\images\\StepBilling_ico.svelte";

    function create_fragment$$(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M19 3H5C3.9 3 3 3.9 3 5V12C3 13.1 3.9 14 5 14H19C20.1 14 21 13.1 21 12V5C21 3.9 20.1 3 19 3ZM19 9H15C15 10.62 13.62 12 12 12C10.38 12 9 10.62 9 9H5V5H19V9ZM15 16H21V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V16H9C9 17.66 10.34 19 12 19C13.66 19 15 17.66 15 16Z");
    			attr_dev(path, "fill", "white");
    			add_location(path, file$X, 8, 4, 151);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", "svg__icon");
    			add_location(svg, file$X, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$$.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$$($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StepBilling_ico', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StepBilling_ico> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class StepBilling_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$$, create_fragment$$, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StepBilling_ico",
    			options,
    			id: create_fragment$$.name
    		});
    	}
    }

    /* src\components\HeadSteps.svelte generated by Svelte v3.48.0 */

    const { console: console_1$4 } = globals;
    const file$W = "src\\components\\HeadSteps.svelte";

    function create_fragment$_(ctx) {
    	let div5;
    	let div0;
    	let stepcontribution_ico;
    	let span0;
    	let t1;
    	let div1;
    	let stepplan_ico;
    	let span1;
    	let t3;
    	let div2;
    	let steplegal_ico;
    	let span2;
    	let t5;
    	let div3;
    	let stepinformation_ico;
    	let span3;
    	let t7;
    	let div4;
    	let stepbilling_ico;
    	let span4;
    	let current;
    	stepcontribution_ico = new StepContribution_ico({ $$inline: true });
    	stepplan_ico = new StepPlan_ico({ $$inline: true });
    	steplegal_ico = new StepLegal_ico({ $$inline: true });
    	stepinformation_ico = new StepInformation_ico({ $$inline: true });
    	stepbilling_ico = new StepBilling_ico({ $$inline: true });

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			create_component(stepcontribution_ico.$$.fragment);
    			span0 = element("span");
    			span0.textContent = "Contribution";
    			t1 = space();
    			div1 = element("div");
    			create_component(stepplan_ico.$$.fragment);
    			span1 = element("span");
    			span1.textContent = "Plan";
    			t3 = space();
    			div2 = element("div");
    			create_component(steplegal_ico.$$.fragment);
    			span2 = element("span");
    			span2.textContent = "Legal";
    			t5 = space();
    			div3 = element("div");
    			create_component(stepinformation_ico.$$.fragment);
    			span3 = element("span");
    			span3.textContent = "Information";
    			t7 = space();
    			div4 = element("div");
    			create_component(stepbilling_ico.$$.fragment);
    			span4 = element("span");
    			span4.textContent = "Billing Information";
    			attr_dev(span0, "class", "svelte-s97h6u");
    			add_location(span0, file$W, 28, 28, 1010);
    			attr_dev(div0, "class", "head__step svelte-s97h6u");
    			attr_dev(div0, "data-step", "1");
    			toggle_class(div0, "visited", /*$headSteps*/ ctx[1].firstStep);
    			toggle_class(div0, "current", /*$stepCounter*/ ctx[0] === 1);
    			add_location(div0, file$W, 22, 2, 846);
    			attr_dev(span1, "class", "svelte-s97h6u");
    			add_location(span1, file$W, 36, 20, 1206);
    			attr_dev(div1, "class", "head__step svelte-s97h6u");
    			attr_dev(div1, "data-step", "2");
    			toggle_class(div1, "visited", /*$headSteps*/ ctx[1].secondStep);
    			toggle_class(div1, "current", /*$stepCounter*/ ctx[0] === 2);
    			add_location(div1, file$W, 30, 2, 1049);
    			attr_dev(span2, "class", "svelte-s97h6u");
    			add_location(span2, file$W, 44, 21, 1394);
    			attr_dev(div2, "class", "head__step svelte-s97h6u");
    			attr_dev(div2, "data-step", "3");
    			toggle_class(div2, "visited", /*$headSteps*/ ctx[1].thirdStep);
    			toggle_class(div2, "current", /*$stepCounter*/ ctx[0] === 3);
    			add_location(div2, file$W, 38, 2, 1237);
    			attr_dev(span3, "class", "svelte-s97h6u");
    			add_location(span3, file$W, 53, 27, 1632);
    			attr_dev(div3, "class", "head__step svelte-s97h6u");
    			attr_dev(div3, "data-step", "4");
    			toggle_class(div3, "visited", /*$headSteps*/ ctx[1].fourthStep);
    			toggle_class(div3, "current", /*$stepCounter*/ ctx[0] === 4);
    			toggle_class(div3, "mobactive", /*$stepCounter*/ ctx[0] === 5);
    			add_location(div3, file$W, 46, 2, 1426);
    			attr_dev(span4, "class", "svelte-s97h6u");
    			add_location(span4, file$W, 61, 23, 1829);
    			attr_dev(div4, "class", "head__step svelte-s97h6u");
    			attr_dev(div4, "data-step", "5");
    			toggle_class(div4, "visited", /*$headSteps*/ ctx[1].fifthStep);
    			toggle_class(div4, "current", /*$stepCounter*/ ctx[0] === 5);
    			add_location(div4, file$W, 55, 2, 1670);
    			attr_dev(div5, "class", "head__steps svelte-s97h6u");
    			add_location(div5, file$W, 21, 0, 817);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			mount_component(stepcontribution_ico, div0, null);
    			append_dev(div0, span0);
    			append_dev(div5, t1);
    			append_dev(div5, div1);
    			mount_component(stepplan_ico, div1, null);
    			append_dev(div1, span1);
    			append_dev(div5, t3);
    			append_dev(div5, div2);
    			mount_component(steplegal_ico, div2, null);
    			append_dev(div2, span2);
    			append_dev(div5, t5);
    			append_dev(div5, div3);
    			mount_component(stepinformation_ico, div3, null);
    			append_dev(div3, span3);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			mount_component(stepbilling_ico, div4, null);
    			append_dev(div4, span4);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$headSteps*/ 2) {
    				toggle_class(div0, "visited", /*$headSteps*/ ctx[1].firstStep);
    			}

    			if (dirty & /*$stepCounter*/ 1) {
    				toggle_class(div0, "current", /*$stepCounter*/ ctx[0] === 1);
    			}

    			if (dirty & /*$headSteps*/ 2) {
    				toggle_class(div1, "visited", /*$headSteps*/ ctx[1].secondStep);
    			}

    			if (dirty & /*$stepCounter*/ 1) {
    				toggle_class(div1, "current", /*$stepCounter*/ ctx[0] === 2);
    			}

    			if (dirty & /*$headSteps*/ 2) {
    				toggle_class(div2, "visited", /*$headSteps*/ ctx[1].thirdStep);
    			}

    			if (dirty & /*$stepCounter*/ 1) {
    				toggle_class(div2, "current", /*$stepCounter*/ ctx[0] === 3);
    			}

    			if (dirty & /*$headSteps*/ 2) {
    				toggle_class(div3, "visited", /*$headSteps*/ ctx[1].fourthStep);
    			}

    			if (dirty & /*$stepCounter*/ 1) {
    				toggle_class(div3, "current", /*$stepCounter*/ ctx[0] === 4);
    			}

    			if (dirty & /*$stepCounter*/ 1) {
    				toggle_class(div3, "mobactive", /*$stepCounter*/ ctx[0] === 5);
    			}

    			if (dirty & /*$headSteps*/ 2) {
    				toggle_class(div4, "visited", /*$headSteps*/ ctx[1].fifthStep);
    			}

    			if (dirty & /*$stepCounter*/ 1) {
    				toggle_class(div4, "current", /*$stepCounter*/ ctx[0] === 5);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stepcontribution_ico.$$.fragment, local);
    			transition_in(stepplan_ico.$$.fragment, local);
    			transition_in(steplegal_ico.$$.fragment, local);
    			transition_in(stepinformation_ico.$$.fragment, local);
    			transition_in(stepbilling_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stepcontribution_ico.$$.fragment, local);
    			transition_out(stepplan_ico.$$.fragment, local);
    			transition_out(steplegal_ico.$$.fragment, local);
    			transition_out(stepinformation_ico.$$.fragment, local);
    			transition_out(stepbilling_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(stepcontribution_ico);
    			destroy_component(stepplan_ico);
    			destroy_component(steplegal_ico);
    			destroy_component(stepinformation_ico);
    			destroy_component(stepbilling_ico);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$_.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$_($$self, $$props, $$invalidate) {
    	let $stepCounter;
    	let $headSteps;
    	validate_store(stepCounter, 'stepCounter');
    	component_subscribe($$self, stepCounter, $$value => $$invalidate(0, $stepCounter = $$value));
    	validate_store(headSteps, 'headSteps');
    	component_subscribe($$self, headSteps, $$value => $$invalidate(1, $headSteps = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HeadSteps', slots, []);
    	let stepCountValue;

    	const unsubscribe = stepCounter.subscribe(value => {
    		stepCountValue = value;
    	});

    	function setStep() {
    		let stepValue = this.getAttribute("data-step");
    		set_store_value(stepCounter, $stepCounter = parseInt(stepValue), $stepCounter);
    		console.log($stepCounter);
    	}

    	onDestroy(unsubscribe);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<HeadSteps> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		stepCounter,
    		headSteps,
    		onDestroy,
    		StepContribution_ico,
    		StepPlan_ico,
    		StepLegal_ico,
    		StepInformation_ico,
    		StepBilling_ico,
    		stepCountValue,
    		unsubscribe,
    		setStep,
    		$stepCounter,
    		$headSteps
    	});

    	$$self.$inject_state = $$props => {
    		if ('stepCountValue' in $$props) stepCountValue = $$props.stepCountValue;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$stepCounter, $headSteps];
    }

    class HeadSteps extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$_, create_fragment$_, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HeadSteps",
    			options,
    			id: create_fragment$_.name
    		});
    	}
    }

    const plansModalData = writable({
        class: 'safe',
        name: 'Green Safe',
        desc: 'Safe as a bank account. This fund invests exclusively in green bonds and is the perfect option for Green Savers who want to be sure their funds are secure. The Green Safe plan involves a commitment to institutional and governmental bonds and enables subscribers to have a global, national, and local impact.',
        lottie: "https://uploads-ssl.webflow.com/627ca4b5fcfd5674acf264e6/6281f1b9694dfd538fae0ee3_Safe.json"
    });

    const plansModalState = writable(false);

    const sortPersantageVariable = writable ("all");

    const disableAllDropdown = writable(false);


    let planData = [
        {
          sortName: "all",
          persentage: 0,
          visibility: true,
        },
        {
          sortName: "fourth",
          persentage: 25,
          visibility: true,
        },
        {
          sortName: "fourth",
          persentage: 50,
          visibility: true,
        },
        {
          sortName: "fourth",
          persentage: 75,
          visibility: true,
        },
        {
          sortName: "fourth",
          persentage: 100,
          visibility: true,
        }
        
      ];


      const planModalData = [{
        safe: {
          head: 'Green Safe',
          class: 'safe',
          desc: "Safe as a bank account. This fund invests exclusively in green bonds and is the perfect option for Green Savers who want to be sure their funds are secure. The Green Safe plan involves a commitment to institutional and governmental bonds and enables subscribers to have a global, national, and local impact.",
          lottie: "https://uploads-ssl.webflow.com/627ca4b5fcfd5674acf264e6/6281f1b9694dfd538fae0ee3_Safe.json"
        },
        adventure: {
          head: 'Green Adventure',
          class: 'adventure',
          desc: "A growth fund with more risks and more rewards. The Green Adventure plan is for Green Savers who want to put their funds toward ventures that have a significantly more direct impact on mitigating climate change and are devoted to creating and developing green businesses around the world. The plan also includes investments in green equities to reward companies that already make a difference and an activism investment fund for pressuring companies to become green.",
          lottie: "https://uploads-ssl.webflow.com/627ca4b5fcfd5674acf264e6/628203b9fca88d2dde5b697f_Adventure.json"
        },
        founder: {
          head: 'Green Change',
          class: 'founder',
          desc:  "The ESi future is green, and we want YOU to be part of it. Becoming a founder Green Saver involves owning part of ESi. This option is limited to a predetermined target, and you will own a portion of ESi based on your contribution up to a collective 35% of ESi capital. Our vision is to create a sustainable green finance ecosystem making ethical green investing accessible. Collectively, we plan to become the most prominent green investor and green financial product provider.",
          lottie:  "https://uploads-ssl.webflow.com/627ca4b5fcfd5674acf264e6/628203e11d51fd22eede66f3_Founder.json"
        }
      }];

      const portfolioItems = [{
        safe: {
          main: ['50% international green bonds', '25% national green bonds', '25% municipal or provincial green bonds*'],
          detail: '*depending on availability and contribution size',
        },
        adventure: {
          main: ['50% venture investment', '25% green stock', '25% green activism investment'],
          detail: false,
        },
        founder: {
          main: ['100% invest in ESi capital'],
          detail: '*Limited offer of 150K shares at 20$ per share for 35% equity stake',
        }
      }];

    /* src\components\plans\PlanHead.svelte generated by Svelte v3.48.0 */
    const file$V = "src\\components\\plans\\PlanHead.svelte";

    function create_fragment$Z(ctx) {
    	let div7;
    	let div4;
    	let div2;
    	let div0;
    	let t0;
    	let span0;
    	let t2;
    	let t3;
    	let div1;
    	let t4_value = /*data*/ ctx[0].country.currency.symbol + "";
    	let t4;
    	let t5_value = priceConvertation(/*moVal*/ ctx[1]) + "";
    	let t5;
    	let span1;
    	let t7;
    	let div3;
    	let t8;
    	let div6;
    	let div5;
    	let p;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text("Your ");
    			span0 = element("span");
    			span0.textContent = "Green";
    			t2 = text("\r\n        Contribution");
    			t3 = space();
    			div1 = element("div");
    			t4 = text(t4_value);
    			t5 = text(t5_value);
    			span1 = element("span");
    			span1.textContent = "/mo";
    			t7 = space();
    			div3 = element("div");
    			t8 = space();
    			div6 = element("div");
    			div5 = element("div");
    			p = element("p");
    			p.textContent = "You can choose between numerous plans, from the Green Safe to the Green\r\n        Adventure and/or Green Founder. Change your plan selection and choose\r\n        how to distribute your periodic contribution anytime. You can change,\r\n        and therefore we adapt!";
    			attr_dev(span0, "class", "green svelte-thmnfv");
    			add_location(span0, file$V, 16, 13, 497);
    			attr_dev(div0, "class", "text svelte-thmnfv");
    			add_location(div0, file$V, 15, 6, 464);
    			attr_dev(span1, "class", "svelte-thmnfv");
    			add_location(span1, file$V, 20, 64, 663);
    			attr_dev(div1, "class", "plans__val svelte-thmnfv");
    			add_location(div1, file$V, 19, 6, 573);
    			attr_dev(div2, "class", "column__item left svelte-thmnfv");
    			add_location(div2, file$V, 14, 4, 425);
    			attr_dev(div3, "class", "line svelte-thmnfv");
    			add_location(div3, file$V, 24, 4, 713);
    			attr_dev(div4, "class", "column svelte-thmnfv");
    			add_location(div4, file$V, 13, 2, 399);
    			attr_dev(p, "class", "svelte-thmnfv");
    			add_location(p, file$V, 28, 6, 819);
    			attr_dev(div5, "class", "column__item rigth svelte-thmnfv");
    			add_location(div5, file$V, 27, 4, 779);
    			attr_dev(div6, "class", "column right svelte-thmnfv");
    			add_location(div6, file$V, 26, 2, 747);
    			attr_dev(div7, "class", "plans__head svelte-thmnfv");
    			add_location(div7, file$V, 12, 0, 370);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div4);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, span0);
    			append_dev(div0, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, span1);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div7, t8);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, p);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1 && t4_value !== (t4_value = /*data*/ ctx[0].country.currency.symbol + "")) set_data_dev(t4, t4_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$Z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Z($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlanHead', slots, []);
    	let data;

    	const unsubscribe = contributionData.subscribe(value => {
    		$$invalidate(0, data = value);
    	});

    	let moVal = data.monthlyValue;
    	onDestroy(unsubscribe);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlanHead> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		contributionData,
    		onDestroy,
    		priceConvertation,
    		data,
    		unsubscribe,
    		moVal
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('moVal' in $$props) $$invalidate(1, moVal = $$props.moVal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, moVal];
    }

    class PlanHead extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$Z, create_fragment$Z, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlanHead",
    			options,
    			id: create_fragment$Z.name
    		});
    	}
    }

    /* public\images\Button_left_ico.svelte generated by Svelte v3.48.0 */

    const file$U = "public\\images\\Button_left_ico.svelte";

    function create_fragment$Y(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M9.36881 12.568C9.53285 12.4039 9.625 12.1814 9.625 11.9494C9.625 11.7174 9.53285 11.4949 9.36881 11.3308L5.03756 6.99953L9.36881 2.66828C9.5282 2.50325 9.61639 2.28223 9.6144 2.0528C9.61241 1.82338 9.52038 1.60392 9.35815 1.44169C9.19592 1.27946 8.97646 1.18743 8.74704 1.18544C8.51761 1.18345 8.29659 1.27164 8.13156 1.43103L3.18169 6.38091C3.01765 6.54499 2.9255 6.76751 2.9255 6.99953C2.9255 7.23155 3.01765 7.45407 3.18169 7.61816L8.13156 12.568C8.29565 12.7321 8.51817 12.8242 8.75019 12.8242C8.98221 12.8242 9.20473 12.7321 9.36881 12.568Z");
    			attr_dev(path, "fill", "#5E0BC9");
    			add_location(path, file$U, 8, 4, 148);
    			attr_dev(svg, "class", "ico svelte-1hinrse");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "14");
    			attr_dev(svg, "height", "14");
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "fill", "none");
    			add_location(svg, file$U, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$Y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Y($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button_left_ico', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button_left_ico> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Button_left_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$Y, create_fragment$Y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button_left_ico",
    			options,
    			id: create_fragment$Y.name
    		});
    	}
    }

    /* src\components\buttons\ButtonLeft.svelte generated by Svelte v3.48.0 */
    const file$T = "src\\components\\buttons\\ButtonLeft.svelte";

    function create_fragment$X(ctx) {
    	let button;
    	let button_left_ico;
    	let current;
    	let mounted;
    	let dispose;
    	button_left_ico = new Button_left_ico({ $$inline: true });

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(button_left_ico.$$.fragment);
    			attr_dev(button, "class", "btn-sv svelte-wq4e37");
    			add_location(button, file$T, 3, 0, 101);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(button_left_ico, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button_left_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button_left_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(button_left_ico);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$X.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$X($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ButtonLeft', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ButtonLeft> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$capture_state = () => ({ Button_left_ico });
    	return [click_handler];
    }

    class ButtonLeft extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$X, create_fragment$X, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonLeft",
    			options,
    			id: create_fragment$X.name
    		});
    	}
    }

    /* public\images\Info_ico.svelte generated by Svelte v3.48.0 */

    const file$S = "public\\images\\Info_ico.svelte";

    function create_fragment$W(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M12 1.5C6.20156 1.5 1.5 6.20156 1.5 12C1.5 17.7984 6.20156 22.5 12 22.5C17.7984 22.5 22.5 17.7984 22.5 12C22.5 6.20156 17.7984 1.5 12 1.5ZM12 20.7188C7.18594 20.7188 3.28125 16.8141 3.28125 12C3.28125 7.18594 7.18594 3.28125 12 3.28125C16.8141 3.28125 20.7188 7.18594 20.7188 12C20.7188 16.8141 16.8141 20.7188 12 20.7188Z");
    			attr_dev(path0, "fill", "white");
    			add_location(path0, file$S, 7, 4, 128);
    			attr_dev(path1, "d", "M10.875 7.875C10.875 8.17337 10.9935 8.45952 11.2045 8.6705C11.4155 8.88147 11.7016 9 12 9C12.2984 9 12.5845 8.88147 12.7955 8.6705C13.0065 8.45952 13.125 8.17337 13.125 7.875C13.125 7.57663 13.0065 7.29048 12.7955 7.0795C12.5845 6.86853 12.2984 6.75 12 6.75C11.7016 6.75 11.4155 6.86853 11.2045 7.0795C10.9935 7.29048 10.875 7.57663 10.875 7.875ZM12.5625 10.5H11.4375C11.3344 10.5 11.25 10.5844 11.25 10.6875V17.0625C11.25 17.1656 11.3344 17.25 11.4375 17.25H12.5625C12.6656 17.25 12.75 17.1656 12.75 17.0625V10.6875C12.75 10.5844 12.6656 10.5 12.5625 10.5Z");
    			attr_dev(path1, "fill", "white");
    			add_location(path1, file$S, 11, 4, 497);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", "svelte-1coh5bv");
    			add_location(svg, file$S, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$W.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$W($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Info_ico', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Info_ico> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Info_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$W, create_fragment$W, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info_ico",
    			options,
    			id: create_fragment$W.name
    		});
    	}
    }

    /* src\components\plans\PlanBtn.svelte generated by Svelte v3.48.0 */
    const file$R = "src\\components\\plans\\PlanBtn.svelte";

    function create_fragment$V(ctx) {
    	let div;
    	let button;
    	let t0;
    	let t1;
    	let info_ico;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	info_ico = new Info_ico({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t0 = text(/*content*/ ctx[0]);
    			t1 = space();
    			create_component(info_ico.$$.fragment);
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*className*/ ctx[1]) + " svelte-ng05z2"));
    			add_location(button, file$R, 7, 2, 162);
    			attr_dev(div, "class", "wrapper svelte-ng05z2");
    			add_location(div, file$R, 6, 0, 137);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			mount_component(info_ico, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*content*/ 1) set_data_dev(t0, /*content*/ ctx[0]);

    			if (!current || dirty & /*className*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*className*/ ctx[1]) + " svelte-ng05z2"))) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(info_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(info_ico);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$V.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$V($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlanBtn', slots, []);
    	let { content } = $$props;
    	let { className } = $$props;
    	const writable_props = ['content', 'className'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlanBtn> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('content' in $$props) $$invalidate(0, content = $$props.content);
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    	};

    	$$self.$capture_state = () => ({ Info_ico, content, className });

    	$$self.$inject_state = $$props => {
    		if ('content' in $$props) $$invalidate(0, content = $$props.content);
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [content, className, click_handler];
    }

    class PlanBtn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$V, create_fragment$V, safe_not_equal, { content: 0, className: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlanBtn",
    			options,
    			id: create_fragment$V.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*content*/ ctx[0] === undefined && !('content' in props)) {
    			console.warn("<PlanBtn> was created without expected prop 'content'");
    		}

    		if (/*className*/ ctx[1] === undefined && !('className' in props)) {
    			console.warn("<PlanBtn> was created without expected prop 'className'");
    		}
    	}

    	get content() {
    		throw new Error("<PlanBtn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<PlanBtn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get className() {
    		throw new Error("<PlanBtn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<PlanBtn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\plans\Portfolio.svelte generated by Svelte v3.48.0 */
    const file$Q = "src\\components\\plans\\Portfolio.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (11:4) {#each items[name].main as item}
    function create_each_block$8(ctx) {
    	let li;
    	let t_value = /*item*/ ctx[2] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "svelte-rb3f7l");
    			add_location(li, file$Q, 11, 6, 313);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 1 && t_value !== (t_value = /*item*/ ctx[2] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(11:4) {#each items[name].main as item}",
    		ctx
    	});

    	return block;
    }

    // (15:2) {#if items[name].detail}
    function create_if_block$g(ctx) {
    	let div;
    	let t_value = /*items*/ ctx[1][/*name*/ ctx[0]].detail + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "portfolio__heler svelte-rb3f7l");
    			add_location(div, file$Q, 15, 4, 384);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 1 && t_value !== (t_value = /*items*/ ctx[1][/*name*/ ctx[0]].detail + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(15:2) {#if items[name].detail}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$U(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let ul;
    	let t2;
    	let div1_class_value;
    	let each_value = /*items*/ ctx[1][/*name*/ ctx[0]].main;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	let if_block = /*items*/ ctx[1][/*name*/ ctx[0]].detail && create_if_block$g(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Portfolio";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "portfolio__head svelte-rb3f7l");
    			add_location(div0, file$Q, 8, 2, 215);
    			attr_dev(ul, "class", "svelte-rb3f7l");
    			add_location(ul, file$Q, 9, 2, 263);
    			attr_dev(div1, "class", div1_class_value = "portfolio " + /*name*/ ctx[0] + " svelte-rb3f7l");
    			add_location(div1, file$Q, 7, 0, 181);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div1, t2);
    			if (if_block) if_block.m(div1, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*items, name*/ 3) {
    				each_value = /*items*/ ctx[1][/*name*/ ctx[0]].main;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*items*/ ctx[1][/*name*/ ctx[0]].detail) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$g(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*name*/ 1 && div1_class_value !== (div1_class_value = "portfolio " + /*name*/ ctx[0] + " svelte-rb3f7l")) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$U.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$U($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Portfolio', slots, []);
    	let items = portfolioItems[0];
    	let { name } = $$props;
    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Portfolio> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ each, portfolioItems, items, name });

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, items];
    }

    class Portfolio extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$U, create_fragment$U, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Portfolio",
    			options,
    			id: create_fragment$U.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<Portfolio> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<Portfolio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Portfolio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* public\images\MobArrow_ico.svelte generated by Svelte v3.48.0 */

    const file$P = "public\\images\\MobArrow_ico.svelte";

    function create_fragment$T(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M4.29279 7.30529C4.48031 7.11782 4.73462 7.0125 4.99979 7.0125C5.26495 7.0125 5.51926 7.11782 5.70679 7.30529L11.9998 13.5983L18.2928 7.30529C18.385 7.20978 18.4954 7.1336 18.6174 7.08119C18.7394 7.02878 18.8706 7.00119 19.0034 7.00004C19.1362 6.99888 19.2678 7.02419 19.3907 7.07447C19.5136 7.12475 19.6253 7.199 19.7192 7.29289C19.8131 7.38679 19.8873 7.49844 19.9376 7.62133C19.9879 7.74423 20.0132 7.87591 20.012 8.00869C20.0109 8.14147 19.9833 8.27269 19.9309 8.39469C19.8785 8.5167 19.8023 8.62704 19.7068 8.71929L12.7068 15.7193C12.5193 15.9068 12.265 16.0121 11.9998 16.0121C11.7346 16.0121 11.4803 15.9068 11.2928 15.7193L4.29279 8.71929C4.10532 8.53176 4 8.27745 4 8.01229C4 7.74712 4.10532 7.49282 4.29279 7.30529Z");
    			attr_dev(path, "fill", "white");
    			add_location(path, file$P, 7, 5, 145);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "16");
    			attr_dev(svg, "height", "16");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", "arrow");
    			add_location(svg, file$P, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$T.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$T($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MobArrow_ico', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MobArrow_ico> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class MobArrow_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$T, create_fragment$T, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MobArrow_ico",
    			options,
    			id: create_fragment$T.name
    		});
    	}
    }

    /* public\images\Checkbox_ico.svelte generated by Svelte v3.48.0 */

    const file$O = "public\\images\\Checkbox_ico.svelte";

    function create_fragment$S(ctx) {
    	let svg;
    	let path;
    	let defs;
    	let linearGradient;
    	let stop0;
    	let stop1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			defs = svg_element("defs");
    			linearGradient = svg_element("linearGradient");
    			stop0 = svg_element("stop");
    			stop1 = svg_element("stop");
    			attr_dev(path, "d", "M7.08286 13.8212L3.92203 10.6604C3.76486 10.5086 3.55436 10.4246 3.33586 10.4265C3.11736 10.4284 2.90835 10.516 2.75384 10.6705C2.59934 10.825 2.5117 11.034 2.5098 11.2525C2.5079 11.471 2.59189 11.6815 2.74369 11.8387L6.49369 15.5887C6.64997 15.7449 6.86189 15.8327 7.08286 15.8327C7.30383 15.8327 7.51575 15.7449 7.67203 15.5887L16.8387 6.42203C16.9905 6.26486 17.0745 6.05436 17.0726 5.83586C17.0707 5.61736 16.983 5.40835 16.8285 5.25384C16.674 5.09934 16.465 5.0117 16.2465 5.0098C16.028 5.0079 15.8175 5.09189 15.6604 5.24369L7.08286 13.8212Z");
    			attr_dev(path, "fill", "url(#paint0_linear_2960_1067)");
    			add_location(path, file$O, 7, 4, 134);
    			attr_dev(stop0, "stop-color", "#FF2E00");
    			add_location(stop0, file$O, 20, 8, 962);
    			attr_dev(stop1, "offset", "1");
    			attr_dev(stop1, "stop-color", "#FF6B00");
    			add_location(stop1, file$O, 21, 8, 1001);
    			attr_dev(linearGradient, "id", "paint0_linear_2960_1067");
    			attr_dev(linearGradient, "x1", "17.0726");
    			attr_dev(linearGradient, "y1", "5.00977");
    			attr_dev(linearGradient, "x2", "1.10357");
    			attr_dev(linearGradient, "y2", "13.0343");
    			attr_dev(linearGradient, "gradientUnits", "userSpaceOnUse");
    			add_location(linearGradient, file$O, 12, 4, 764);
    			add_location(defs, file$O, 11, 4, 752);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "none");
    			add_location(svg, file$O, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    			append_dev(svg, defs);
    			append_dev(defs, linearGradient);
    			append_dev(linearGradient, stop0);
    			append_dev(linearGradient, stop1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$S.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$S($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Checkbox_ico', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Checkbox_ico> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Checkbox_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$S, create_fragment$S, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkbox_ico",
    			options,
    			id: create_fragment$S.name
    		});
    	}
    }

    /* src\components\plans\PlanItem.svelte generated by Svelte v3.48.0 */

    const { console: console_1$3 } = globals;
    const file$N = "src\\components\\plans\\PlanItem.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    // (126:14) {#each savePercentages as item}
    function create_each_block$7(ctx) {
    	let div;
    	let t0_value = /*item*/ ctx[27].persentage + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[19](/*item*/ ctx[27]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = text("%\r\n                ");
    			attr_dev(div, "class", "dropdown__item svelte-jr6lxb");
    			toggle_class(div, "disabled", !/*item*/ ctx[27].visibility || /*item*/ ctx[27].persentage > /*allowPercentageVal*/ ctx[4] && /*allowPercentageVal*/ ctx[4] + /*$allocatedContributions*/ ctx[10][/*className*/ ctx[3]] < /*item*/ ctx[27].persentage);
    			add_location(div, file$N, 126, 16, 4155);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*savePercentages*/ 32 && t0_value !== (t0_value = /*item*/ ctx[27].persentage + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*savePercentages, allowPercentageVal, $allocatedContributions, className*/ 1080) {
    				toggle_class(div, "disabled", !/*item*/ ctx[27].visibility || /*item*/ ctx[27].persentage > /*allowPercentageVal*/ ctx[4] && /*allowPercentageVal*/ ctx[4] + /*$allocatedContributions*/ ctx[10][/*className*/ ctx[3]] < /*item*/ ctx[27].persentage);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(126:14) {#each savePercentages as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$R(ctx) {
    	let div19;
    	let div5;
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t1;
    	let t2;
    	let t3;
    	let div4;
    	let div2;
    	let checkbox_ico;
    	let t4;
    	let div3;
    	let mobarrow_ico;
    	let t5;
    	let div18;
    	let div17;
    	let div13;
    	let div6;
    	let t7;
    	let div10;
    	let div9;
    	let dropdown_ico;
    	let t8;
    	let div7;
    	let t9_value = /*$allocatedContributions*/ ctx[10][/*className*/ ctx[3]] + "";
    	let t9;
    	let t10;
    	let t11;
    	let div8;
    	let div9_class_value;
    	let t12;
    	let div12;
    	let div11;
    	let t13_value = /*$contributionData*/ ctx[12].country.currency.symbol + priceConvertation(Math.round(/*currentPrice*/ ctx[6] * 100) / 100) + "";
    	let t13;
    	let div12_class_value;
    	let t14;
    	let div16;
    	let div14;
    	let t15_value = /*modalData*/ ctx[13][/*className*/ ctx[3]].head + "";
    	let t15;
    	let t16;
    	let div15;
    	let t17_value = /*modalData*/ ctx[13][/*className*/ ctx[3]].desc + "";
    	let t17;
    	let t18;
    	let portfolio;
    	let t19;
    	let planbtn;
    	let div19_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	checkbox_ico = new Checkbox_ico({ $$inline: true });
    	mobarrow_ico = new MobArrow_ico({ $$inline: true });
    	dropdown_ico = new Dropdown_ico({ $$inline: true });
    	let each_value = /*savePercentages*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	portfolio = new Portfolio({
    			props: { name: /*className*/ ctx[3] },
    			$$inline: true
    		});

    	planbtn = new PlanBtn({
    			props: {
    				content: /*btnText*/ ctx[8],
    				className: /*btnClass*/ ctx[9]
    			},
    			$$inline: true
    		});

    	planbtn.$on("click", /*click_handler_3*/ ctx[21]);

    	const block = {
    		c: function create() {
    			div19 = element("div");
    			div5 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = text("Select GREEN ");
    			t2 = text(/*className*/ ctx[3]);
    			t3 = space();
    			div4 = element("div");
    			div2 = element("div");
    			create_component(checkbox_ico.$$.fragment);
    			t4 = space();
    			div3 = element("div");
    			create_component(mobarrow_ico.$$.fragment);
    			t5 = space();
    			div18 = element("div");
    			div17 = element("div");
    			div13 = element("div");
    			div6 = element("div");
    			div6.textContent = "You contribute to Green Safe";
    			t7 = space();
    			div10 = element("div");
    			div9 = element("div");
    			create_component(dropdown_ico.$$.fragment);
    			t8 = space();
    			div7 = element("div");
    			t9 = text(t9_value);
    			t10 = text("% Total Contribution");
    			t11 = space();
    			div8 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t12 = space();
    			div12 = element("div");
    			div11 = element("div");
    			t13 = text(t13_value);
    			t14 = space();
    			div16 = element("div");
    			div14 = element("div");
    			t15 = text(t15_value);
    			t16 = space();
    			div15 = element("div");
    			t17 = text(t17_value);
    			t18 = space();
    			create_component(portfolio.$$.fragment);
    			t19 = space();
    			create_component(planbtn.$$.fragment);
    			attr_dev(img, "class", "plan__icon svelte-jr6lxb");
    			if (!src_url_equal(img.src, img_src_value = /*currentSvgIcon*/ ctx[15])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$N, 90, 6, 2944);
    			attr_dev(div0, "class", "item__head__name svelte-jr6lxb");
    			add_location(div0, file$N, 92, 6, 3008);
    			attr_dev(div1, "class", "column svelte-jr6lxb");
    			add_location(div1, file$N, 89, 4, 2916);
    			attr_dev(div2, "class", "item__head__checkbox svelte-jr6lxb");
    			toggle_class(div2, "visible", /*$allocatedContributions*/ ctx[10][/*className*/ ctx[3]] != 0);
    			add_location(div2, file$N, 95, 6, 3114);
    			attr_dev(div3, "class", "mob__arrow svelte-jr6lxb");
    			add_location(div3, file$N, 101, 6, 3278);
    			attr_dev(div4, "class", "column svelte-jr6lxb");
    			add_location(div4, file$N, 94, 4, 3086);
    			attr_dev(div5, "class", "item__head svelte-jr6lxb");
    			add_location(div5, file$N, 84, 2, 2781);
    			attr_dev(div6, "class", "item__top__head svelte-jr6lxb");
    			add_location(div6, file$N, 109, 8, 3444);
    			attr_dev(div7, "class", "dropdown__item--current svelte-jr6lxb");
    			add_location(div7, file$N, 121, 12, 3918);
    			attr_dev(div8, "class", "dropdown__items svelte-jr6lxb");
    			add_location(div8, file$N, 124, 12, 4061);
    			attr_dev(div9, "class", div9_class_value = "dropdown " + (/*activeState*/ ctx[1] ? /*activeClass*/ ctx[7] : '') + " plan__dropdown" + " svelte-jr6lxb");
    			add_location(div9, file$N, 114, 10, 3638);
    			attr_dev(div10, "class", "dropdown__wrapper svelte-jr6lxb");
    			toggle_class(div10, "disabled", /*$disableAllDropdown*/ ctx[11] === true);
    			add_location(div10, file$N, 110, 8, 3517);
    			attr_dev(div11, "class", "money svelte-jr6lxb");
    			add_location(div11, file$N, 141, 10, 4737);
    			attr_dev(div12, "class", div12_class_value = "item__current__money " + /*className*/ ctx[3] + " svelte-jr6lxb");
    			add_location(div12, file$N, 140, 8, 4679);
    			attr_dev(div13, "class", "item__top svelte-jr6lxb");
    			add_location(div13, file$N, 108, 6, 3411);
    			attr_dev(div14, "class", "plan__info__head svelte-jr6lxb");
    			add_location(div14, file$N, 149, 8, 4983);
    			attr_dev(div15, "class", "plan__info__text svelte-jr6lxb");
    			add_location(div15, file$N, 150, 8, 5056);
    			attr_dev(div16, "class", "mob__plan__info svelte-jr6lxb");
    			add_location(div16, file$N, 148, 6, 4944);
    			attr_dev(div17, "class", "svelte-jr6lxb");
    			add_location(div17, file$N, 107, 4, 3398);
    			attr_dev(div18, "class", "item__body svelte-jr6lxb");
    			add_location(div18, file$N, 106, 2, 3368);
    			attr_dev(div19, "class", div19_class_value = "plans__item " + /*className*/ ctx[3] + " svelte-jr6lxb");
    			toggle_class(div19, "active", /*current*/ ctx[0] === /*currentPlan*/ ctx[2]);
    			add_location(div19, file$N, 83, 0, 2701);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div19, anchor);
    			append_dev(div19, div5);
    			append_dev(div5, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			mount_component(checkbox_ico, div2, null);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			mount_component(mobarrow_ico, div3, null);
    			append_dev(div19, t5);
    			append_dev(div19, div18);
    			append_dev(div18, div17);
    			append_dev(div17, div13);
    			append_dev(div13, div6);
    			append_dev(div13, t7);
    			append_dev(div13, div10);
    			append_dev(div10, div9);
    			mount_component(dropdown_ico, div9, null);
    			append_dev(div9, t8);
    			append_dev(div9, div7);
    			append_dev(div7, t9);
    			append_dev(div7, t10);
    			append_dev(div9, t11);
    			append_dev(div9, div8);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div8, null);
    			}

    			append_dev(div13, t12);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, t13);
    			append_dev(div17, t14);
    			append_dev(div17, div16);
    			append_dev(div16, div14);
    			append_dev(div14, t15);
    			append_dev(div16, t16);
    			append_dev(div16, div15);
    			append_dev(div15, t17);
    			append_dev(div17, t18);
    			mount_component(portfolio, div17, null);
    			append_dev(div17, t19);
    			mount_component(planbtn, div17, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div5, "click", /*click_handler*/ ctx[18], false, false, false),
    					listen_dev(div9, "click", /*click_handler_2*/ ctx[20], false, false, false),
    					action_destroyer(clickOutside.call(null, div9)),
    					listen_dev(div9, "click_outside", /*handleClickOutside*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*className*/ 8) set_data_dev(t2, /*className*/ ctx[3]);

    			if (dirty & /*$allocatedContributions, className*/ 1032) {
    				toggle_class(div2, "visible", /*$allocatedContributions*/ ctx[10][/*className*/ ctx[3]] != 0);
    			}

    			if ((!current || dirty & /*$allocatedContributions, className*/ 1032) && t9_value !== (t9_value = /*$allocatedContributions*/ ctx[10][/*className*/ ctx[3]] + "")) set_data_dev(t9, t9_value);

    			if (dirty & /*savePercentages, allowPercentageVal, $allocatedContributions, className, setPercentage, currentPlan*/ 17468) {
    				each_value = /*savePercentages*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div8, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*activeState, activeClass*/ 130 && div9_class_value !== (div9_class_value = "dropdown " + (/*activeState*/ ctx[1] ? /*activeClass*/ ctx[7] : '') + " plan__dropdown" + " svelte-jr6lxb")) {
    				attr_dev(div9, "class", div9_class_value);
    			}

    			if (dirty & /*$disableAllDropdown*/ 2048) {
    				toggle_class(div10, "disabled", /*$disableAllDropdown*/ ctx[11] === true);
    			}

    			if ((!current || dirty & /*$contributionData, currentPrice*/ 4160) && t13_value !== (t13_value = /*$contributionData*/ ctx[12].country.currency.symbol + priceConvertation(Math.round(/*currentPrice*/ ctx[6] * 100) / 100) + "")) set_data_dev(t13, t13_value);

    			if (!current || dirty & /*className*/ 8 && div12_class_value !== (div12_class_value = "item__current__money " + /*className*/ ctx[3] + " svelte-jr6lxb")) {
    				attr_dev(div12, "class", div12_class_value);
    			}

    			if ((!current || dirty & /*className*/ 8) && t15_value !== (t15_value = /*modalData*/ ctx[13][/*className*/ ctx[3]].head + "")) set_data_dev(t15, t15_value);
    			if ((!current || dirty & /*className*/ 8) && t17_value !== (t17_value = /*modalData*/ ctx[13][/*className*/ ctx[3]].desc + "")) set_data_dev(t17, t17_value);
    			const portfolio_changes = {};
    			if (dirty & /*className*/ 8) portfolio_changes.name = /*className*/ ctx[3];
    			portfolio.$set(portfolio_changes);
    			const planbtn_changes = {};
    			if (dirty & /*btnText*/ 256) planbtn_changes.content = /*btnText*/ ctx[8];
    			if (dirty & /*btnClass*/ 512) planbtn_changes.className = /*btnClass*/ ctx[9];
    			planbtn.$set(planbtn_changes);

    			if (!current || dirty & /*className*/ 8 && div19_class_value !== (div19_class_value = "plans__item " + /*className*/ ctx[3] + " svelte-jr6lxb")) {
    				attr_dev(div19, "class", div19_class_value);
    			}

    			if (dirty & /*className, current, currentPlan*/ 13) {
    				toggle_class(div19, "active", /*current*/ ctx[0] === /*currentPlan*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox_ico.$$.fragment, local);
    			transition_in(mobarrow_ico.$$.fragment, local);
    			transition_in(dropdown_ico.$$.fragment, local);
    			transition_in(portfolio.$$.fragment, local);
    			transition_in(planbtn.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox_ico.$$.fragment, local);
    			transition_out(mobarrow_ico.$$.fragment, local);
    			transition_out(dropdown_ico.$$.fragment, local);
    			transition_out(portfolio.$$.fragment, local);
    			transition_out(planbtn.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div19);
    			destroy_component(checkbox_ico);
    			destroy_component(mobarrow_ico);
    			destroy_component(dropdown_ico);
    			destroy_each(each_blocks, detaching);
    			destroy_component(portfolio);
    			destroy_component(planbtn);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$R.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$R($$self, $$props, $$invalidate) {
    	let $plansModalState;
    	let $plansModalData;
    	let $allocatedContributions;
    	let $subscribeAllState;
    	let $sortPersantageVariable;
    	let $disableAllDropdown;
    	let $contributionData;
    	validate_store(plansModalState, 'plansModalState');
    	component_subscribe($$self, plansModalState, $$value => $$invalidate(22, $plansModalState = $$value));
    	validate_store(plansModalData, 'plansModalData');
    	component_subscribe($$self, plansModalData, $$value => $$invalidate(23, $plansModalData = $$value));
    	validate_store(allocatedContributions, 'allocatedContributions');
    	component_subscribe($$self, allocatedContributions, $$value => $$invalidate(10, $allocatedContributions = $$value));
    	validate_store(subscribeAllState, 'subscribeAllState');
    	component_subscribe($$self, subscribeAllState, $$value => $$invalidate(24, $subscribeAllState = $$value));
    	validate_store(sortPersantageVariable, 'sortPersantageVariable');
    	component_subscribe($$self, sortPersantageVariable, $$value => $$invalidate(25, $sortPersantageVariable = $$value));
    	validate_store(disableAllDropdown, 'disableAllDropdown');
    	component_subscribe($$self, disableAllDropdown, $$value => $$invalidate(11, $disableAllDropdown = $$value));
    	validate_store(contributionData, 'contributionData');
    	component_subscribe($$self, contributionData, $$value => $$invalidate(12, $contributionData = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlanItem', slots, []);
    	let { current, currentPlan, className = "", allowPercentageVal, savePercentages, currentPrice, activeClass, activeState = false, btnText, btnClass } = $$props;
    	let modalData = planModalData[0];

    	function setPercentage(item, plan) {
    		if ($disableAllDropdown === false) {
    			set_store_value(sortPersantageVariable, $sortPersantageVariable = item.sortName, $sortPersantageVariable);
    			set_store_value(subscribeAllState, $subscribeAllState = false, $subscribeAllState);

    			switch (plan) {
    				case "safe":
    					set_store_value(allocatedContributions, $allocatedContributions.safe = item.persentage, $allocatedContributions);
    					set_store_value(allocatedContributions, $allocatedContributions.safeName = item.value, $allocatedContributions);
    					break;
    				case "adventure":
    					set_store_value(allocatedContributions, $allocatedContributions.adventure = item.persentage, $allocatedContributions);
    					set_store_value(allocatedContributions, $allocatedContributions.adventureName = item.value, $allocatedContributions);
    					break;
    				case "founder":
    					set_store_value(allocatedContributions, $allocatedContributions.founder = item.persentage, $allocatedContributions);
    					set_store_value(allocatedContributions, $allocatedContributions.founderName = item.value, $allocatedContributions);
    					break;
    				default:
    					console.log("Error");
    			}
    		}
    	}

    	let svgIcons = {
    		safe: "https://uploads-ssl.webflow.com/627ca4b5fcfd5674acf264e6/627e4841370604453befc5d7_green.svg",
    		adventure: "https://uploads-ssl.webflow.com/627ca4b5fcfd5674acf264e6/627e4bde122aa36a24438411_tab-icon-02.svg",
    		founder: "https://uploads-ssl.webflow.com/627ca4b5fcfd5674acf264e6/627e4be882a78868831022d1_founder.svg"
    	};

    	let currentSvgIcon = svgIcons[className];

    	function showModal(plan) {
    		set_store_value(plansModalData, $plansModalData.class = modalData[plan].class, $plansModalData);
    		set_store_value(plansModalData, $plansModalData.name = modalData[plan].head, $plansModalData);
    		set_store_value(plansModalData, $plansModalData.desc = modalData[plan].desc, $plansModalData);
    		set_store_value(plansModalData, $plansModalData.lottie = modalData[plan].lottie, $plansModalData);
    		set_store_value(plansModalState, $plansModalState = true, $plansModalState);
    	}

    	// close dropdown by click ouside
    	function handleClickOutside(event) {
    		$$invalidate(1, activeState = false);
    	}

    	const writable_props = [
    		'current',
    		'currentPlan',
    		'className',
    		'allowPercentageVal',
    		'savePercentages',
    		'currentPrice',
    		'activeClass',
    		'activeState',
    		'btnText',
    		'btnClass'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<PlanItem> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => current === currentPlan
    	? $$invalidate(0, current = "")
    	: $$invalidate(0, current = currentPlan);

    	const click_handler_1 = item => setPercentage(item, currentPlan);
    	const click_handler_2 = () => $$invalidate(1, activeState = !activeState);
    	const click_handler_3 = () => showModal(currentPlan);

    	$$self.$$set = $$props => {
    		if ('current' in $$props) $$invalidate(0, current = $$props.current);
    		if ('currentPlan' in $$props) $$invalidate(2, currentPlan = $$props.currentPlan);
    		if ('className' in $$props) $$invalidate(3, className = $$props.className);
    		if ('allowPercentageVal' in $$props) $$invalidate(4, allowPercentageVal = $$props.allowPercentageVal);
    		if ('savePercentages' in $$props) $$invalidate(5, savePercentages = $$props.savePercentages);
    		if ('currentPrice' in $$props) $$invalidate(6, currentPrice = $$props.currentPrice);
    		if ('activeClass' in $$props) $$invalidate(7, activeClass = $$props.activeClass);
    		if ('activeState' in $$props) $$invalidate(1, activeState = $$props.activeState);
    		if ('btnText' in $$props) $$invalidate(8, btnText = $$props.btnText);
    		if ('btnClass' in $$props) $$invalidate(9, btnClass = $$props.btnClass);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		afterUpdate,
    		subscribeAllState,
    		clickOutside,
    		priceConvertation,
    		planData,
    		plansModalState,
    		plansModalData,
    		sortPersantageVariable,
    		disableAllDropdown,
    		planModalData,
    		portfolioItems,
    		contributionData,
    		allocatedContributions,
    		PlanBtn,
    		Portfolio,
    		MobArrow_ico,
    		Checkbox_ico,
    		Dropdown_ico,
    		current,
    		currentPlan,
    		className,
    		allowPercentageVal,
    		savePercentages,
    		currentPrice,
    		activeClass,
    		activeState,
    		btnText,
    		btnClass,
    		modalData,
    		setPercentage,
    		svgIcons,
    		currentSvgIcon,
    		showModal,
    		handleClickOutside,
    		$plansModalState,
    		$plansModalData,
    		$allocatedContributions,
    		$subscribeAllState,
    		$sortPersantageVariable,
    		$disableAllDropdown,
    		$contributionData
    	});

    	$$self.$inject_state = $$props => {
    		if ('current' in $$props) $$invalidate(0, current = $$props.current);
    		if ('currentPlan' in $$props) $$invalidate(2, currentPlan = $$props.currentPlan);
    		if ('className' in $$props) $$invalidate(3, className = $$props.className);
    		if ('allowPercentageVal' in $$props) $$invalidate(4, allowPercentageVal = $$props.allowPercentageVal);
    		if ('savePercentages' in $$props) $$invalidate(5, savePercentages = $$props.savePercentages);
    		if ('currentPrice' in $$props) $$invalidate(6, currentPrice = $$props.currentPrice);
    		if ('activeClass' in $$props) $$invalidate(7, activeClass = $$props.activeClass);
    		if ('activeState' in $$props) $$invalidate(1, activeState = $$props.activeState);
    		if ('btnText' in $$props) $$invalidate(8, btnText = $$props.btnText);
    		if ('btnClass' in $$props) $$invalidate(9, btnClass = $$props.btnClass);
    		if ('modalData' in $$props) $$invalidate(13, modalData = $$props.modalData);
    		if ('svgIcons' in $$props) svgIcons = $$props.svgIcons;
    		if ('currentSvgIcon' in $$props) $$invalidate(15, currentSvgIcon = $$props.currentSvgIcon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		current,
    		activeState,
    		currentPlan,
    		className,
    		allowPercentageVal,
    		savePercentages,
    		currentPrice,
    		activeClass,
    		btnText,
    		btnClass,
    		$allocatedContributions,
    		$disableAllDropdown,
    		$contributionData,
    		modalData,
    		setPercentage,
    		currentSvgIcon,
    		showModal,
    		handleClickOutside,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class PlanItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$R, create_fragment$R, safe_not_equal, {
    			current: 0,
    			currentPlan: 2,
    			className: 3,
    			allowPercentageVal: 4,
    			savePercentages: 5,
    			currentPrice: 6,
    			activeClass: 7,
    			activeState: 1,
    			btnText: 8,
    			btnClass: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlanItem",
    			options,
    			id: create_fragment$R.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*current*/ ctx[0] === undefined && !('current' in props)) {
    			console_1$3.warn("<PlanItem> was created without expected prop 'current'");
    		}

    		if (/*currentPlan*/ ctx[2] === undefined && !('currentPlan' in props)) {
    			console_1$3.warn("<PlanItem> was created without expected prop 'currentPlan'");
    		}

    		if (/*allowPercentageVal*/ ctx[4] === undefined && !('allowPercentageVal' in props)) {
    			console_1$3.warn("<PlanItem> was created without expected prop 'allowPercentageVal'");
    		}

    		if (/*savePercentages*/ ctx[5] === undefined && !('savePercentages' in props)) {
    			console_1$3.warn("<PlanItem> was created without expected prop 'savePercentages'");
    		}

    		if (/*currentPrice*/ ctx[6] === undefined && !('currentPrice' in props)) {
    			console_1$3.warn("<PlanItem> was created without expected prop 'currentPrice'");
    		}

    		if (/*activeClass*/ ctx[7] === undefined && !('activeClass' in props)) {
    			console_1$3.warn("<PlanItem> was created without expected prop 'activeClass'");
    		}

    		if (/*btnText*/ ctx[8] === undefined && !('btnText' in props)) {
    			console_1$3.warn("<PlanItem> was created without expected prop 'btnText'");
    		}

    		if (/*btnClass*/ ctx[9] === undefined && !('btnClass' in props)) {
    			console_1$3.warn("<PlanItem> was created without expected prop 'btnClass'");
    		}
    	}

    	get current() {
    		throw new Error("<PlanItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current(value) {
    		throw new Error("<PlanItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentPlan() {
    		throw new Error("<PlanItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPlan(value) {
    		throw new Error("<PlanItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get className() {
    		throw new Error("<PlanItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<PlanItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get allowPercentageVal() {
    		throw new Error("<PlanItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allowPercentageVal(value) {
    		throw new Error("<PlanItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get savePercentages() {
    		throw new Error("<PlanItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set savePercentages(value) {
    		throw new Error("<PlanItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentPrice() {
    		throw new Error("<PlanItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPrice(value) {
    		throw new Error("<PlanItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeClass() {
    		throw new Error("<PlanItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeClass(value) {
    		throw new Error("<PlanItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeState() {
    		throw new Error("<PlanItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeState(value) {
    		throw new Error("<PlanItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get btnText() {
    		throw new Error("<PlanItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set btnText(value) {
    		throw new Error("<PlanItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get btnClass() {
    		throw new Error("<PlanItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set btnClass(value) {
    		throw new Error("<PlanItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\plans\PlanItems.svelte generated by Svelte v3.48.0 */
    const file$M = "src\\components\\plans\\PlanItems.svelte";

    function create_fragment$Q(ctx) {
    	let div;
    	let planitem0;
    	let t0;
    	let planitem1;
    	let t1;
    	let planitem2;
    	let current;

    	planitem0 = new PlanItem({
    			props: {
    				current: /*current*/ ctx[11],
    				currentPlan: /*savePlan*/ ctx[8],
    				className: "safe",
    				allowPercentageVal: /*allowPercentageVal*/ ctx[7],
    				savePercentages: /*savePercentages*/ ctx[0],
    				currentPrice: /*safePrice*/ ctx[1],
    				activeClass: "activeDropdownSave",
    				activeState: /*activeDropdownSave*/ ctx[4],
    				btnText: "Green Safe info",
    				btnClass: "blue"
    			},
    			$$inline: true
    		});

    	planitem1 = new PlanItem({
    			props: {
    				current: /*current*/ ctx[11],
    				currentPlan: /*advPlan*/ ctx[9],
    				className: "adventure",
    				allowPercentageVal: /*allowPercentageVal*/ ctx[7],
    				savePercentages: /*savePercentages*/ ctx[0],
    				currentPrice: /*adventurePrice*/ ctx[2],
    				activeClass: "activeDropdownAdv",
    				activeState: /*activeDropdownAdv*/ ctx[5],
    				btnText: "Green Adventure info",
    				btnClass: "green"
    			},
    			$$inline: true
    		});

    	planitem2 = new PlanItem({
    			props: {
    				current: /*current*/ ctx[11],
    				currentPlan: /*foundPlan*/ ctx[10],
    				className: "founder",
    				allowPercentageVal: /*allowPercentageVal*/ ctx[7],
    				savePercentages: /*savePercentages*/ ctx[0],
    				currentPrice: /*founderPrice*/ ctx[3],
    				activeClass: "activeDropdownFound",
    				activeState: /*activeDropdownFound*/ ctx[6],
    				btnText: "Green Founder info",
    				btnClass: "violet"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(planitem0.$$.fragment);
    			t0 = space();
    			create_component(planitem1.$$.fragment);
    			t1 = space();
    			create_component(planitem2.$$.fragment);
    			attr_dev(div, "class", "plans__items svelte-111exe8");
    			add_location(div, file$M, 51, 0, 1361);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(planitem0, div, null);
    			append_dev(div, t0);
    			mount_component(planitem1, div, null);
    			append_dev(div, t1);
    			mount_component(planitem2, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const planitem0_changes = {};
    			if (dirty & /*allowPercentageVal*/ 128) planitem0_changes.allowPercentageVal = /*allowPercentageVal*/ ctx[7];
    			if (dirty & /*savePercentages*/ 1) planitem0_changes.savePercentages = /*savePercentages*/ ctx[0];
    			if (dirty & /*safePrice*/ 2) planitem0_changes.currentPrice = /*safePrice*/ ctx[1];
    			if (dirty & /*activeDropdownSave*/ 16) planitem0_changes.activeState = /*activeDropdownSave*/ ctx[4];
    			planitem0.$set(planitem0_changes);
    			const planitem1_changes = {};
    			if (dirty & /*allowPercentageVal*/ 128) planitem1_changes.allowPercentageVal = /*allowPercentageVal*/ ctx[7];
    			if (dirty & /*savePercentages*/ 1) planitem1_changes.savePercentages = /*savePercentages*/ ctx[0];
    			if (dirty & /*adventurePrice*/ 4) planitem1_changes.currentPrice = /*adventurePrice*/ ctx[2];
    			if (dirty & /*activeDropdownAdv*/ 32) planitem1_changes.activeState = /*activeDropdownAdv*/ ctx[5];
    			planitem1.$set(planitem1_changes);
    			const planitem2_changes = {};
    			if (dirty & /*allowPercentageVal*/ 128) planitem2_changes.allowPercentageVal = /*allowPercentageVal*/ ctx[7];
    			if (dirty & /*savePercentages*/ 1) planitem2_changes.savePercentages = /*savePercentages*/ ctx[0];
    			if (dirty & /*founderPrice*/ 8) planitem2_changes.currentPrice = /*founderPrice*/ ctx[3];
    			if (dirty & /*activeDropdownFound*/ 64) planitem2_changes.activeState = /*activeDropdownFound*/ ctx[6];
    			planitem2.$set(planitem2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(planitem0.$$.fragment, local);
    			transition_in(planitem1.$$.fragment, local);
    			transition_in(planitem2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(planitem0.$$.fragment, local);
    			transition_out(planitem1.$$.fragment, local);
    			transition_out(planitem2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(planitem0);
    			destroy_component(planitem1);
    			destroy_component(planitem2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$Q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Q($$self, $$props, $$invalidate) {
    	let allowPercentageVal;
    	let $disableAllDropdown;
    	let $contributionData;
    	let $allocatedContributions;
    	validate_store(disableAllDropdown, 'disableAllDropdown');
    	component_subscribe($$self, disableAllDropdown, $$value => $$invalidate(13, $disableAllDropdown = $$value));
    	validate_store(contributionData, 'contributionData');
    	component_subscribe($$self, contributionData, $$value => $$invalidate(14, $contributionData = $$value));
    	validate_store(allocatedContributions, 'allocatedContributions');
    	component_subscribe($$self, allocatedContributions, $$value => $$invalidate(12, $allocatedContributions = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlanItems', slots, []);
    	let savePercentages;
    	savePercentages = [...planData];
    	let safePrice = 0, adventurePrice = 0, founderPrice = 0;
    	let savePlan = "safe", advPlan = "adventure", foundPlan = "founder";
    	let activeDropdownSave = false;
    	let activeDropdownAdv = false;
    	let activeDropdownFound = false;
    	let current = savePlan;

    	beforeUpdate(() => {
    		$$invalidate(1, safePrice = $allocatedContributions.safe * $contributionData.monthlyValue / 100);
    		$$invalidate(2, adventurePrice = $allocatedContributions.adventure * $contributionData.monthlyValue / 100);
    		$$invalidate(3, founderPrice = $allocatedContributions.founder * $contributionData.monthlyValue / 100);

    		if ($disableAllDropdown === true) {
    			$$invalidate(4, activeDropdownSave = false);
    			$$invalidate(5, activeDropdownAdv = false);
    			$$invalidate(6, activeDropdownFound = false);
    		}
    	});

    	afterUpdate(() => {
    		
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlanItems> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		afterUpdate,
    		planData,
    		disableAllDropdown,
    		contributionData,
    		allocatedContributions,
    		PlanItem,
    		savePercentages,
    		safePrice,
    		adventurePrice,
    		founderPrice,
    		savePlan,
    		advPlan,
    		foundPlan,
    		activeDropdownSave,
    		activeDropdownAdv,
    		activeDropdownFound,
    		current,
    		allowPercentageVal,
    		$disableAllDropdown,
    		$contributionData,
    		$allocatedContributions
    	});

    	$$self.$inject_state = $$props => {
    		if ('savePercentages' in $$props) $$invalidate(0, savePercentages = $$props.savePercentages);
    		if ('safePrice' in $$props) $$invalidate(1, safePrice = $$props.safePrice);
    		if ('adventurePrice' in $$props) $$invalidate(2, adventurePrice = $$props.adventurePrice);
    		if ('founderPrice' in $$props) $$invalidate(3, founderPrice = $$props.founderPrice);
    		if ('savePlan' in $$props) $$invalidate(8, savePlan = $$props.savePlan);
    		if ('advPlan' in $$props) $$invalidate(9, advPlan = $$props.advPlan);
    		if ('foundPlan' in $$props) $$invalidate(10, foundPlan = $$props.foundPlan);
    		if ('activeDropdownSave' in $$props) $$invalidate(4, activeDropdownSave = $$props.activeDropdownSave);
    		if ('activeDropdownAdv' in $$props) $$invalidate(5, activeDropdownAdv = $$props.activeDropdownAdv);
    		if ('activeDropdownFound' in $$props) $$invalidate(6, activeDropdownFound = $$props.activeDropdownFound);
    		if ('current' in $$props) $$invalidate(11, current = $$props.current);
    		if ('allowPercentageVal' in $$props) $$invalidate(7, allowPercentageVal = $$props.allowPercentageVal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*savePercentages*/ 1) ;

    		if ($$self.$$.dirty & /*$allocatedContributions*/ 4096) {
    			$$invalidate(7, allowPercentageVal = 100 - $allocatedContributions.safe - $allocatedContributions.adventure - $allocatedContributions.founder);
    		}
    	};

    	return [
    		savePercentages,
    		safePrice,
    		adventurePrice,
    		founderPrice,
    		activeDropdownSave,
    		activeDropdownAdv,
    		activeDropdownFound,
    		allowPercentageVal,
    		savePlan,
    		advPlan,
    		foundPlan,
    		current,
    		$allocatedContributions
    	];
    }

    class PlanItems extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$Q, create_fragment$Q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlanItems",
    			options,
    			id: create_fragment$Q.name
    		});
    	}
    }

    /* public\images\Close_ico.svelte generated by Svelte v3.48.0 */

    const file$L = "public\\images\\Close_ico.svelte";

    function create_fragment$P(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "clip-rule", "evenodd");
    			attr_dev(path, "d", "M10.6739 11.9999L3.83691 18.8369L5.16291 20.1629L11.9999 13.3259L18.8369 20.1629L20.1629 18.8369L13.3259 11.9999L20.1629 5.16291L18.8369 3.83691L11.9999 10.6739L5.16291 3.83691L3.83691 5.16291L10.6739 11.9999Z");
    			attr_dev(path, "fill", "white");
    			add_location(path, file$L, 7, 4, 128);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			add_location(svg, file$L, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$P.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$P($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Close_ico', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Close_ico> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Close_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$P, create_fragment$P, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Close_ico",
    			options,
    			id: create_fragment$P.name
    		});
    	}
    }

    /* src\components\plans\PlanModal.svelte generated by Svelte v3.48.0 */
    const file$K = "src\\components\\plans\\PlanModal.svelte";

    function create_fragment$O(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let script;
    	let script_src_value;
    	let t0;
    	let div7;
    	let div3;
    	let div2;
    	let div0;
    	let t1_value = /*$plansModalData*/ ctx[2].name + "";
    	let t1;
    	let t2;
    	let div1;
    	let t3_value = /*$plansModalData*/ ctx[2].desc + "";
    	let t3;
    	let t4;
    	let div5;
    	let div4;
    	let lottie_player;
    	let lottie_player_src_value;
    	let t5;
    	let div6;
    	let close_ico;
    	let div7_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowscroll*/ ctx[5]);
    	close_ico = new Close_ico({ $$inline: true });

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			div7 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			div5 = element("div");
    			div4 = element("div");
    			lottie_player = element("lottie-player");
    			t5 = space();
    			div6 = element("div");
    			create_component(close_ico.$$.fragment);
    			if (!src_url_equal(script.src, script_src_value = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$K, 26, 2, 684);
    			attr_dev(div0, "class", "content__head svelte-i6571q");
    			add_location(div0, file$K, 38, 6, 1021);
    			attr_dev(div1, "class", "content__text svelte-i6571q");
    			add_location(div1, file$K, 39, 6, 1084);
    			attr_dev(div2, "class", "content svelte-i6571q");
    			add_location(div2, file$K, 37, 4, 992);
    			attr_dev(div3, "class", "column");
    			add_location(div3, file$K, 36, 2, 966);
    			if (!src_url_equal(lottie_player.src, lottie_player_src_value = /*$plansModalData*/ ctx[2].lottie)) set_custom_element_data(lottie_player, "src", lottie_player_src_value);
    			set_custom_element_data(lottie_player, "background", "transparent");
    			set_custom_element_data(lottie_player, "speed", "1");
    			set_style(lottie_player, "width", /*lottieWidth*/ ctx[1] + "px");
    			set_custom_element_data(lottie_player, "loop", "");
    			set_custom_element_data(lottie_player, "autoplay", "");
    			add_location(lottie_player, file$K, 44, 6, 1228);
    			attr_dev(div4, "class", "littie__wrapper svelte-i6571q");
    			add_location(div4, file$K, 43, 4, 1191);
    			attr_dev(div5, "class", "column");
    			add_location(div5, file$K, 42, 2, 1165);
    			attr_dev(div6, "class", "close__icon svelte-i6571q");
    			add_location(div6, file$K, 54, 2, 1441);
    			attr_dev(div7, "class", div7_class_value = "pop_up " + /*$plansModalData*/ ctx[2].class + " svelte-i6571q");
    			add_location(div7, file$K, 31, 0, 852);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);
    			append_dev(div7, t4);
    			append_dev(div7, div5);
    			append_dev(div5, div4);
    			append_dev(div4, lottie_player);
    			append_dev(div7, t5);
    			append_dev(div7, div6);
    			mount_component(close_ico, div6, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "scroll", () => {
    						scrolling = true;
    						clearTimeout(scrolling_timeout);
    						scrolling_timeout = setTimeout(clear_scrolling, 100);
    						/*onwindowscroll*/ ctx[5]();
    					}),
    					listen_dev(div6, "click", /*click_handler*/ ctx[6], false, false, false),
    					action_destroyer(clickOutside.call(null, div7)),
    					listen_dev(div7, "click_outside", /*handleClickOutside*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*windowWidth*/ 1 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo(window.pageXOffset, /*windowWidth*/ ctx[0]);
    				scrolling_timeout = setTimeout(clear_scrolling, 100);
    			}

    			if ((!current || dirty & /*$plansModalData*/ 4) && t1_value !== (t1_value = /*$plansModalData*/ ctx[2].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*$plansModalData*/ 4) && t3_value !== (t3_value = /*$plansModalData*/ ctx[2].desc + "")) set_data_dev(t3, t3_value);

    			if (!current || dirty & /*$plansModalData*/ 4 && !src_url_equal(lottie_player.src, lottie_player_src_value = /*$plansModalData*/ ctx[2].lottie)) {
    				set_custom_element_data(lottie_player, "src", lottie_player_src_value);
    			}

    			if (!current || dirty & /*lottieWidth*/ 2) {
    				set_style(lottie_player, "width", /*lottieWidth*/ ctx[1] + "px");
    			}

    			if (!current || dirty & /*$plansModalData*/ 4 && div7_class_value !== (div7_class_value = "pop_up " + /*$plansModalData*/ ctx[2].class + " svelte-i6571q")) {
    				attr_dev(div7, "class", div7_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div7);
    			destroy_component(close_ico);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$O.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$O($$self, $$props, $$invalidate) {
    	let $plansModalData;
    	let $plansModalState;
    	validate_store(plansModalData, 'plansModalData');
    	component_subscribe($$self, plansModalData, $$value => $$invalidate(2, $plansModalData = $$value));
    	validate_store(plansModalState, 'plansModalState');
    	component_subscribe($$self, plansModalState, $$value => $$invalidate(3, $plansModalState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlanModal', slots, []);
    	let lottieWidth = 450;
    	let windowWidth;

    	if ($plansModalData.class === "safe") {
    		lottieWidth = 370;
    	}

    	function handleClickOutside(event) {
    		set_store_value(plansModalState, $plansModalState = false, $plansModalState);
    	}

    	afterUpdate(() => {
    		if (windowWidth < 1100) {
    			$$invalidate(1, lottieWidth = 350);

    			if ($plansModalData.class === "safe") {
    				$$invalidate(1, lottieWidth = 300);
    			}
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlanModal> was created with unknown prop '${key}'`);
    	});

    	function onwindowscroll() {
    		$$invalidate(0, windowWidth = window.pageYOffset);
    	}

    	const click_handler = () => set_store_value(plansModalState, $plansModalState = false, $plansModalState);

    	$$self.$capture_state = () => ({
    		plansModalState,
    		plansModalData,
    		clickOutside,
    		Close_ico,
    		afterUpdate,
    		lottieWidth,
    		windowWidth,
    		handleClickOutside,
    		$plansModalData,
    		$plansModalState
    	});

    	$$self.$inject_state = $$props => {
    		if ('lottieWidth' in $$props) $$invalidate(1, lottieWidth = $$props.lottieWidth);
    		if ('windowWidth' in $$props) $$invalidate(0, windowWidth = $$props.windowWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*windowWidth*/ 1) ;
    	};

    	return [
    		windowWidth,
    		lottieWidth,
    		$plansModalData,
    		$plansModalState,
    		handleClickOutside,
    		onwindowscroll,
    		click_handler
    	];
    }

    class PlanModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$O, create_fragment$O, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlanModal",
    			options,
    			id: create_fragment$O.name
    		});
    	}
    }

    /* public\images\SubscribeAll_ico.svelte generated by Svelte v3.48.0 */

    const file$J = "public\\images\\SubscribeAll_ico.svelte";

    function create_fragment$N(ctx) {
    	let svg;
    	let path;
    	let defs;
    	let linearGradient;
    	let stop0;
    	let stop1;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			defs = svg_element("defs");
    			linearGradient = svg_element("linearGradient");
    			stop0 = svg_element("stop");
    			stop1 = svg_element("stop");
    			attr_dev(path, "d", "M7.08286 13.8212L3.92203 10.6604C3.76486 10.5086 3.55436 10.4246 3.33586 10.4265C3.11736 10.4284 2.90835 10.516 2.75384 10.6705C2.59934 10.825 2.5117 11.034 2.5098 11.2525C2.5079 11.471 2.59189 11.6815 2.74369 11.8387L6.49369 15.5887C6.64997 15.7449 6.86189 15.8327 7.08286 15.8327C7.30383 15.8327 7.51575 15.7449 7.67203 15.5887L16.8387 6.42203C16.9905 6.26486 17.0745 6.05436 17.0726 5.83586C17.0707 5.61736 16.983 5.40835 16.8285 5.25384C16.674 5.09934 16.465 5.0117 16.2465 5.0098C16.028 5.0079 15.8175 5.09189 15.6604 5.24369L7.08286 13.8212Z");
    			attr_dev(path, "fill", "url(#paint0_linear_2960_1067)");
    			add_location(path, file$J, 11, 2, 185);
    			attr_dev(stop0, "stop-color", "#FF2E00");
    			add_location(stop0, file$J, 24, 6, 995);
    			attr_dev(stop1, "offset", "1");
    			attr_dev(stop1, "stop-color", "#FF6B00");
    			add_location(stop1, file$J, 25, 6, 1032);
    			attr_dev(linearGradient, "id", "paint0_linear_2960_1067");
    			attr_dev(linearGradient, "x1", "17.0726");
    			attr_dev(linearGradient, "y1", "5.00977");
    			attr_dev(linearGradient, "x2", "1.10357");
    			attr_dev(linearGradient, "y2", "13.0343");
    			attr_dev(linearGradient, "gradientUnits", "userSpaceOnUse");
    			add_location(linearGradient, file$J, 16, 4, 811);
    			add_location(defs, file$J, 15, 2, 799);
    			attr_dev(svg, "class", svg_class_value = "" + (null_to_empty(/*className*/ ctx[0]) + " svelte-1pvi33w"));
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "none");
    			add_location(svg, file$J, 3, 0, 48);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    			append_dev(svg, defs);
    			append_dev(defs, linearGradient);
    			append_dev(linearGradient, stop0);
    			append_dev(linearGradient, stop1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*className*/ 1 && svg_class_value !== (svg_class_value = "" + (null_to_empty(/*className*/ ctx[0]) + " svelte-1pvi33w"))) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$N.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$N($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SubscribeAll_ico', slots, []);
    	let { className } = $$props;
    	const writable_props = ['className'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SubscribeAll_ico> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    	};

    	$$self.$capture_state = () => ({ className });

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [className];
    }

    class SubscribeAll_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$N, create_fragment$N, safe_not_equal, { className: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SubscribeAll_ico",
    			options,
    			id: create_fragment$N.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*className*/ ctx[0] === undefined && !('className' in props)) {
    			console.warn("<SubscribeAll_ico> was created without expected prop 'className'");
    		}
    	}

    	get className() {
    		throw new Error("<SubscribeAll_ico>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<SubscribeAll_ico>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\plans\Plan.svelte generated by Svelte v3.48.0 */
    const file$I = "src\\components\\plans\\Plan.svelte";

    // (126:2) {#if $plansModalState}
    function create_if_block_1$b(ctx) {
    	let div;
    	let planmodal;
    	let div_transition;
    	let current;
    	planmodal = new PlanModal({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(planmodal.$$.fragment);
    			add_location(div, file$I, 126, 4, 3648);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(planmodal, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(planmodal.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(planmodal.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(planmodal);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$b.name,
    		type: "if",
    		source: "(126:2) {#if $plansModalState}",
    		ctx
    	});

    	return block;
    }

    // (132:4) {#if errorMessageState}
    function create_if_block$f(ctx) {
    	let errormessage;
    	let current;

    	errormessage = new ErrorMessage({
    			props: { errorMessage: /*errorMessage*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(errormessage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(errormessage, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const errormessage_changes = {};
    			if (dirty & /*errorMessage*/ 2) errormessage_changes.errorMessage = /*errorMessage*/ ctx[1];
    			errormessage.$set(errormessage_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(errormessage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(errormessage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(errormessage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(132:4) {#if errorMessageState}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$M(ctx) {
    	let div11;
    	let div8;
    	let div1;
    	let h2;
    	let t0;
    	let span0;
    	let t2;
    	let span1;
    	let t4;
    	let div0;
    	let t5;
    	let span2;
    	let t7;
    	let span3;
    	let t9;
    	let planhead;
    	let t10;
    	let div7;
    	let div6;
    	let h3;
    	let t11;
    	let span4;
    	let t13;
    	let span5;
    	let t15;
    	let div2;
    	let t17;
    	let div5;
    	let div3;
    	let subscribeallico;
    	let t18;
    	let div4;
    	let t20;
    	let planitems;
    	let t21;
    	let t22;
    	let div10;
    	let t23;
    	let div9;
    	let buttonleft;
    	let t24;
    	let buttonright;
    	let current;
    	let mounted;
    	let dispose;
    	planhead = new PlanHead({ $$inline: true });

    	subscribeallico = new SubscribeAll_ico({
    			props: {
    				className: /*$subscribeAllState*/ ctx[2] ? "active__cb" : ""
    			},
    			$$inline: true
    		});

    	planitems = new PlanItems({ $$inline: true });
    	let if_block0 = /*$plansModalState*/ ctx[3] && create_if_block_1$b(ctx);
    	let if_block1 = /*errorMessageState*/ ctx[0] && create_if_block$f(ctx);
    	buttonleft = new ButtonLeft({ $$inline: true });
    	buttonleft.$on("click", /*prevStep*/ ctx[4]);
    	buttonright = new ButtonRight({ $$inline: true });
    	buttonright.$on("click", /*nextStep*/ ctx[5]);

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			div8 = element("div");
    			div1 = element("div");
    			h2 = element("h2");
    			t0 = text("Plans ");
    			span0 = element("span");
    			span0.textContent = "Selector";
    			t2 = text(" and\r\n        ");
    			span1 = element("span");
    			span1.textContent = "Distributor";
    			t4 = space();
    			div0 = element("div");
    			t5 = text("Choose any ");
    			span2 = element("span");
    			span2.textContent = "plan";
    			t7 = text(" and allocate you\r\n        ");
    			span3 = element("span");
    			span3.textContent = "contribution";
    			t9 = space();
    			create_component(planhead.$$.fragment);
    			t10 = space();
    			div7 = element("div");
    			div6 = element("div");
    			h3 = element("h3");
    			t11 = text("Please allocate you ");
    			span4 = element("span");
    			span4.textContent = "contribution";
    			t13 = text(" between\r\n          our\r\n          ");
    			span5 = element("span");
    			span5.textContent = "plans";
    			t15 = space();
    			div2 = element("div");
    			div2.textContent = "Select plans";
    			t17 = space();
    			div5 = element("div");
    			div3 = element("div");
    			create_component(subscribeallico.$$.fragment);
    			t18 = space();
    			div4 = element("div");
    			div4.textContent = "Subscribe to All Plan";
    			t20 = space();
    			create_component(planitems.$$.fragment);
    			t21 = space();
    			if (if_block0) if_block0.c();
    			t22 = space();
    			div10 = element("div");
    			if (if_block1) if_block1.c();
    			t23 = space();
    			div9 = element("div");
    			create_component(buttonleft.$$.fragment);
    			t24 = space();
    			create_component(buttonright.$$.fragment);
    			attr_dev(span0, "class", "green svelte-mlxd9c");
    			add_location(span0, file$I, 92, 14, 2615);
    			attr_dev(span1, "class", "green svelte-mlxd9c");
    			add_location(span1, file$I, 93, 8, 2664);
    			attr_dev(h2, "class", "h2-sv");
    			add_location(h2, file$I, 91, 6, 2581);
    			attr_dev(span2, "class", "green svelte-mlxd9c");
    			add_location(span2, file$I, 96, 19, 2770);
    			attr_dev(span3, "class", "green svelte-mlxd9c");
    			add_location(span3, file$I, 97, 8, 2828);
    			attr_dev(div0, "class", "main__mob_h2 svelte-mlxd9c");
    			add_location(div0, file$I, 95, 6, 2723);
    			attr_dev(div1, "class", "plans__top svelte-mlxd9c");
    			add_location(div1, file$I, 90, 4, 2549);
    			attr_dev(span4, "class", "green svelte-mlxd9c");
    			add_location(span4, file$I, 105, 30, 3051);
    			attr_dev(span5, "class", "green svelte-mlxd9c");
    			add_location(span5, file$I, 107, 10, 3125);
    			attr_dev(h3, "class", "h3-sv svelte-mlxd9c");
    			add_location(h3, file$I, 104, 8, 3001);
    			attr_dev(div2, "class", "mob__plan__h2 svelte-mlxd9c");
    			add_location(div2, file$I, 109, 8, 3182);
    			attr_dev(div3, "class", "subscribe__checkbox svelte-mlxd9c");
    			add_location(div3, file$I, 111, 10, 3306);
    			attr_dev(div4, "class", "subscribe__text svelte-mlxd9c");
    			add_location(div4, file$I, 117, 10, 3483);
    			attr_dev(div5, "class", "subscribe__all svelte-mlxd9c");
    			add_location(div5, file$I, 110, 8, 3237);
    			attr_dev(div6, "class", "plans__wrapper__head svelte-mlxd9c");
    			add_location(div6, file$I, 103, 6, 2957);
    			attr_dev(div7, "class", "plans__wrapper svelte-mlxd9c");
    			add_location(div7, file$I, 102, 4, 2921);
    			attr_dev(div8, "class", "plans__main__wrapper");
    			add_location(div8, file$I, 89, 2, 2509);
    			attr_dev(div9, "class", "bottom__btns svelte-mlxd9c");
    			add_location(div9, file$I, 134, 4, 3831);
    			attr_dev(div10, "class", "relative__wrapper svelte-mlxd9c");
    			add_location(div10, file$I, 130, 2, 3715);
    			attr_dev(div11, "class", "plans__main svelte-mlxd9c");
    			add_location(div11, file$I, 88, 0, 2480);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div8);
    			append_dev(div8, div1);
    			append_dev(div1, h2);
    			append_dev(h2, t0);
    			append_dev(h2, span0);
    			append_dev(h2, t2);
    			append_dev(h2, span1);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			append_dev(div0, t5);
    			append_dev(div0, span2);
    			append_dev(div0, t7);
    			append_dev(div0, span3);
    			append_dev(div1, t9);
    			mount_component(planhead, div1, null);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, h3);
    			append_dev(h3, t11);
    			append_dev(h3, span4);
    			append_dev(h3, t13);
    			append_dev(h3, span5);
    			append_dev(div6, t15);
    			append_dev(div6, div2);
    			append_dev(div6, t17);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			mount_component(subscribeallico, div3, null);
    			append_dev(div5, t18);
    			append_dev(div5, div4);
    			append_dev(div7, t20);
    			mount_component(planitems, div7, null);
    			append_dev(div11, t21);
    			if (if_block0) if_block0.m(div11, null);
    			append_dev(div11, t22);
    			append_dev(div11, div10);
    			if (if_block1) if_block1.m(div10, null);
    			append_dev(div10, t23);
    			append_dev(div10, div9);
    			mount_component(buttonleft, div9, null);
    			append_dev(div9, t24);
    			mount_component(buttonright, div9, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div5, "click", /*subscribeAllPlans*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const subscribeallico_changes = {};
    			if (dirty & /*$subscribeAllState*/ 4) subscribeallico_changes.className = /*$subscribeAllState*/ ctx[2] ? "active__cb" : "";
    			subscribeallico.$set(subscribeallico_changes);

    			if (/*$plansModalState*/ ctx[3]) {
    				if (if_block0) {
    					if (dirty & /*$plansModalState*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$b(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div11, t22);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*errorMessageState*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*errorMessageState*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$f(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div10, t23);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(planhead.$$.fragment, local);
    			transition_in(subscribeallico.$$.fragment, local);
    			transition_in(planitems.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(buttonleft.$$.fragment, local);
    			transition_in(buttonright.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(planhead.$$.fragment, local);
    			transition_out(subscribeallico.$$.fragment, local);
    			transition_out(planitems.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(buttonleft.$$.fragment, local);
    			transition_out(buttonright.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
    			destroy_component(planhead);
    			destroy_component(subscribeallico);
    			destroy_component(planitems);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(buttonleft);
    			destroy_component(buttonright);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$M.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$M($$self, $$props, $$invalidate) {
    	let $allocatedContributions;
    	let $subscribeAllState;
    	let $disableAllDropdown;
    	let $headSteps;
    	let $plansModalState;
    	validate_store(allocatedContributions, 'allocatedContributions');
    	component_subscribe($$self, allocatedContributions, $$value => $$invalidate(8, $allocatedContributions = $$value));
    	validate_store(subscribeAllState, 'subscribeAllState');
    	component_subscribe($$self, subscribeAllState, $$value => $$invalidate(2, $subscribeAllState = $$value));
    	validate_store(disableAllDropdown, 'disableAllDropdown');
    	component_subscribe($$self, disableAllDropdown, $$value => $$invalidate(9, $disableAllDropdown = $$value));
    	validate_store(headSteps, 'headSteps');
    	component_subscribe($$self, headSteps, $$value => $$invalidate(10, $headSteps = $$value));
    	validate_store(plansModalState, 'plansModalState');
    	component_subscribe($$self, plansModalState, $$value => $$invalidate(3, $plansModalState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Plan', slots, []);
    	let changeCounter = 0;
    	let errorMessageState = false;
    	let errorMessage;

    	let prevStep = () => {
    		decrementStep();
    		scrollToTop$1();
    	};

    	let nextStep = () => {
    		if (validate()) {
    			set_store_value(headSteps, $headSteps.thirdStep = true, $headSteps);

    			if (changeCounter === 0) {
    				incrementStep();
    				changeCounter += 1;
    				scrollToTop$1();
    			}

    			$$invalidate(0, errorMessageState = false);
    		} else {
    			$$invalidate(0, errorMessageState = true);
    			$$invalidate(1, errorMessage = "Please allocate all 100% of your money");
    		}
    	};

    	let validate = () => {
    		let sumOfPlans = $allocatedContributions.safe + $allocatedContributions.adventure + $allocatedContributions.founder;

    		if (sumOfPlans > 99 && sumOfPlans <= 100) {
    			return true;
    		} else {
    			return false;
    		}
    	};

    	function subscribeAllPlans() {
    		if (!$subscribeAllState) {
    			set_store_value(disableAllDropdown, $disableAllDropdown = true, $disableAllDropdown);
    			set_store_value(allocatedContributions, $allocatedContributions.safe = 33.33, $allocatedContributions);
    			set_store_value(allocatedContributions, $allocatedContributions.adventure = 33.33, $allocatedContributions);
    			set_store_value(allocatedContributions, $allocatedContributions.founder = 33.33, $allocatedContributions);
    			set_store_value(subscribeAllState, $subscribeAllState = true, $subscribeAllState);
    		} else {
    			set_store_value(disableAllDropdown, $disableAllDropdown = false, $disableAllDropdown);
    			set_store_value(allocatedContributions, $allocatedContributions.safe = 0, $allocatedContributions);
    			set_store_value(allocatedContributions, $allocatedContributions.adventure = 0, $allocatedContributions);
    			set_store_value(allocatedContributions, $allocatedContributions.founder = 0, $allocatedContributions);
    			set_store_value(subscribeAllState, $subscribeAllState = false, $subscribeAllState);
    		}
    	}

    	afterUpdate(() => {
    		let sumOfPlans = $allocatedContributions.safe + $allocatedContributions.adventure + $allocatedContributions.founder;

    		if (sumOfPlans > 99 && sumOfPlans <= 100) {
    			$$invalidate(0, errorMessageState = false);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Plan> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		headSteps,
    		incrementStep,
    		decrementStep,
    		subscribeAllState,
    		disableAllDropdown,
    		plansModalState,
    		allocatedContributions,
    		PlanHead,
    		ButtonLeft,
    		ButtonRight,
    		PlanItems,
    		PlanModal,
    		fade,
    		scrollToTop: scrollToTop$1,
    		ErrorMessage,
    		SubscribeAllIco: SubscribeAll_ico,
    		afterUpdate,
    		changeCounter,
    		errorMessageState,
    		errorMessage,
    		prevStep,
    		nextStep,
    		validate,
    		subscribeAllPlans,
    		$allocatedContributions,
    		$subscribeAllState,
    		$disableAllDropdown,
    		$headSteps,
    		$plansModalState
    	});

    	$$self.$inject_state = $$props => {
    		if ('changeCounter' in $$props) changeCounter = $$props.changeCounter;
    		if ('errorMessageState' in $$props) $$invalidate(0, errorMessageState = $$props.errorMessageState);
    		if ('errorMessage' in $$props) $$invalidate(1, errorMessage = $$props.errorMessage);
    		if ('prevStep' in $$props) $$invalidate(4, prevStep = $$props.prevStep);
    		if ('nextStep' in $$props) $$invalidate(5, nextStep = $$props.nextStep);
    		if ('validate' in $$props) validate = $$props.validate;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*errorMessage, errorMessageState*/ 3) ;
    	};

    	return [
    		errorMessageState,
    		errorMessage,
    		$subscribeAllState,
    		$plansModalState,
    		prevStep,
    		nextStep,
    		subscribeAllPlans
    	];
    }

    class Plan extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$M, create_fragment$M, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Plan",
    			options,
    			id: create_fragment$M.name
    		});
    	}
    }

    const allowItemIndex = writable(1);

    const confirmPopUpState = writable(false);
    const clickOnPrevBtn = writable(false);

    const savedPassword = writable(false);

    const infoFormErrorMessage = writable({
      userName: "",
      email: "",
      phone: "",
      password: "",
    });

    const infoFormErrorState = writable(false);
    const infoFormErrorStates = writable({
      userName: false,
      email: false,
      phone: false,
      password: false,
      confirmPassword: false,
    });

    const infoFormData = writable({
      userName: "",
      email: "",
      phone: "",
      phoneCode: "",
      password: "",
      confirm: "",
    });
    const calcInputPhonePadding = writable (105);

    const selectedCountry = writable();

    /* public\images\LegalCheckbox_ico.svelte generated by Svelte v3.48.0 */

    const file$H = "public\\images\\LegalCheckbox_ico.svelte";

    function create_fragment$L(ctx) {
    	let svg;
    	let g;
    	let path0;
    	let path1;
    	let path2;
    	let defs;
    	let linearGradient;
    	let stop0;
    	let stop1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			defs = svg_element("defs");
    			linearGradient = svg_element("linearGradient");
    			stop0 = svg_element("stop");
    			stop1 = svg_element("stop");
    			attr_dev(path0, "d", "M0 3C0 1.34315 1.34315 0 3 0H21C22.6569 0 24 1.34315 24 3V21C24 22.6569 22.6569 24 21 24H3C1.34315 24 0 22.6569 0 21V3Z");
    			attr_dev(path0, "fill", "white");
    			add_location(path0, file$H, 8, 8, 159);
    			attr_dev(path1, "d", "M9.08286 15.8212L5.92203 12.6604C5.76486 12.5086 5.55436 12.4246 5.33586 12.4265C5.11736 12.4284 4.90835 12.516 4.75384 12.6705C4.59934 12.825 4.5117 13.034 4.5098 13.2525C4.5079 13.471 4.59189 13.6815 4.74369 13.8387L8.49369 17.5887C8.64997 17.7449 8.86189 17.8327 9.08286 17.8327C9.30383 17.8327 9.51575 17.7449 9.67203 17.5887L18.8387 8.42203C18.9905 8.26486 19.0745 8.05436 19.0726 7.83586C19.0707 7.61736 18.983 7.40835 18.8285 7.25384C18.674 7.09934 18.465 7.0117 18.2465 7.0098C18.028 7.0079 17.8175 7.09189 17.6604 7.24369L9.08286 15.8212Z");
    			attr_dev(path1, "fill", "url(#paint0_linear_3580_15632)");
    			add_location(path1, file$H, 12, 8, 341);
    			attr_dev(path2, "d", "M3 1H21V-1H3V1ZM23 3V21H25V3H23ZM21 23H3V25H21V23ZM1 21V3H-1V21H1ZM3 23C1.89543 23 1 22.1046 1 21H-1C-1 23.2091 0.790861 25 3 25V23ZM23 21C23 22.1046 22.1046 23 21 23V25C23.2091 25 25 23.2091 25 21H23ZM21 1C22.1046 1 23 1.89543 23 3H25C25 0.790861 23.2091 -1 21 -1V1ZM3 -1C0.790861 -1 -1 0.790861 -1 3H1C1 1.89543 1.89543 1 3 1V-1Z");
    			attr_dev(path2, "fill", "#DDDDDD");
    			add_location(path2, file$H, 16, 8, 976);
    			attr_dev(g, "opacity", "0.5");
    			add_location(g, file$H, 7, 4, 132);
    			attr_dev(stop0, "stop-color", "#FF2E00");
    			add_location(stop0, file$H, 30, 8, 1597);
    			attr_dev(stop1, "offset", "1");
    			attr_dev(stop1, "stop-color", "#FF6B00");
    			add_location(stop1, file$H, 31, 8, 1636);
    			attr_dev(linearGradient, "id", "paint0_linear_3580_15632");
    			attr_dev(linearGradient, "x1", "19.0726");
    			attr_dev(linearGradient, "y1", "7.00977");
    			attr_dev(linearGradient, "x2", "3.10357");
    			attr_dev(linearGradient, "y2", "15.0343");
    			attr_dev(linearGradient, "gradientUnits", "userSpaceOnUse");
    			add_location(linearGradient, file$H, 22, 8, 1394);
    			add_location(defs, file$H, 21, 4, 1378);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			add_location(svg, file$H, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    			append_dev(g, path2);
    			append_dev(svg, defs);
    			append_dev(defs, linearGradient);
    			append_dev(linearGradient, stop0);
    			append_dev(linearGradient, stop1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$L.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$L($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LegalCheckbox_ico', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LegalCheckbox_ico> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class LegalCheckbox_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$L, create_fragment$L, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LegalCheckbox_ico",
    			options,
    			id: create_fragment$L.name
    		});
    	}
    }

    /* public\images\OpenAcount_ico.svelte generated by Svelte v3.48.0 */

    const file$G = "public\\images\\OpenAcount_ico.svelte";

    function create_fragment$K(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M5.13119 1.43197C4.96715 1.59606 4.875 1.81858 4.875 2.05059C4.875 2.28261 4.96715 2.50513 5.13119 2.66922L9.46244 7.00047L5.13119 11.3317C4.9718 11.4967 4.8836 11.7178 4.8856 11.9472C4.88759 12.1766 4.97961 12.3961 5.14185 12.5583C5.30408 12.7205 5.52354 12.8126 5.75296 12.8146C5.98238 12.8166 6.20341 12.7284 6.36844 12.569L11.3183 7.61909C11.4823 7.45501 11.5745 7.23249 11.5745 7.00047C11.5745 6.76845 11.4823 6.54593 11.3183 6.38184L6.36844 1.43197C6.20435 1.26793 5.98183 1.17578 5.74981 1.17578C5.51779 1.17578 5.29527 1.26793 5.13119 1.43197Z");
    			attr_dev(path, "fill", "white");
    			add_location(path, file$G, 7, 4, 128);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "14");
    			attr_dev(svg, "viewBox", "0 0 15 14");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", "svelte-qkmv8v");
    			add_location(svg, file$G, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$K.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$K($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OpenAcount_ico', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OpenAcount_ico> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class OpenAcount_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$K, create_fragment$K, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OpenAcount_ico",
    			options,
    			id: create_fragment$K.name
    		});
    	}
    }

    function setAuthToken(data){
        userAuthToken.set(data);
        console.log('updated');
    }

    // create user in db
    async function createUserInDB(userData) {
        let status = false;
      
        const mainEndpoint =
          "https://be.esi.kdg.com.ua/esi_public/esi_public/backend/createClient";
        try {
          const rawResponse = await fetch(mainEndpoint, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
          const content = await rawResponse.json();
          console.log(content);
          status = content.status;
          setAuthToken(content.data.token);
         
        } catch (e) {
          alert(e.message);
        }
        return status;
      }

    /* src\components\FinalReview.svelte generated by Svelte v3.48.0 */

    const { console: console_1$2 } = globals;
    const file$F = "src\\components\\FinalReview.svelte";

    // (237:8) {#if preloaderState}
    function create_if_block$e(ctx) {
    	let div;
    	let preloader;
    	let current;

    	preloader = new Preloader({
    			props: {
    				loaderWidth: 1.5,
    				loaderHeight: 1.5,
    				borderWidth: 0.3
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(preloader.$$.fragment);
    			attr_dev(div, "class", "preload_btn_wrapper svelte-bxhoqo");
    			add_location(div, file$F, 237, 8, 7975);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(preloader, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(preloader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(preloader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(preloader);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(237:8) {#if preloaderState}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$J(ctx) {
    	let div51;
    	let div50;
    	let div2;
    	let div0;
    	let t0_value = /*$infoFormData*/ ctx[7].userName + "";
    	let t0;
    	let t1;
    	let t2;
    	let div1;
    	let span0;
    	let t3;
    	let div49;
    	let h3;
    	let t5;
    	let div48;
    	let div10;
    	let div7;
    	let div5;
    	let div3;
    	let stepcontribution_ico;
    	let t6;
    	let div4;
    	let t8;
    	let div6;
    	let t10;
    	let div9;
    	let div8;
    	let t11_value = /*$contributionData*/ ctx[5].country.currency.symbol + "";
    	let t11;
    	let t12_value = priceConvertation(/*$contributionData*/ ctx[5].monthlyValue) + "";
    	let t12;
    	let t13;
    	let t14_value = /*$contributionData*/ ctx[5].country.currency.code + "";
    	let t14;
    	let t15;
    	let t16_value = /*$contributionData*/ ctx[5].nextPaymentDay + "";
    	let t16;
    	let t17;
    	let t18_value = /*$contributionData*/ ctx[5].nextPaymentMonth + "";
    	let t18;
    	let t19;
    	let t20;
    	let t21;
    	let div29;
    	let div15;
    	let div13;
    	let div11;
    	let stepplan_ico;
    	let t22;
    	let div12;
    	let t24;
    	let div14;
    	let t26;
    	let div28;
    	let div19;
    	let div16;
    	let t28;
    	let div17;
    	let t29_value = /*$allocatedContributions*/ ctx[6].safe + "";
    	let t29;
    	let t30;
    	let t31;
    	let div18;
    	let t32_value = /*$contributionData*/ ctx[5].country.currency.symbol + "";
    	let t32;
    	let t33_value = priceConvertation(Math.round(/*safePrice*/ ctx[2])) + "";
    	let t33;
    	let t34;
    	let div23;
    	let div20;
    	let t36;
    	let div21;
    	let t37_value = /*$allocatedContributions*/ ctx[6].adventure + "";
    	let t37;
    	let t38;
    	let t39;
    	let div22;
    	let t40_value = /*$contributionData*/ ctx[5].country.currency.symbol + "";
    	let t40;
    	let t41_value = priceConvertation(Math.round(/*adventurePrice*/ ctx[3])) + "";
    	let t41;
    	let t42;
    	let div27;
    	let div24;
    	let t44;
    	let div25;
    	let t45_value = /*$allocatedContributions*/ ctx[6].founder + "";
    	let t45;
    	let t46;
    	let t47;
    	let div26;
    	let t48_value = /*$contributionData*/ ctx[5].country.currency.symbol + "";
    	let t48;
    	let t49_value = priceConvertation(Math.round(/*founderPrice*/ ctx[4])) + "";
    	let t49;
    	let t50;
    	let div37;
    	let div33;
    	let div32;
    	let div30;
    	let steplegal_ico;
    	let t51;
    	let div31;
    	let t53;
    	let div36;
    	let div35;
    	let legalcheckbox_ico;
    	let t54;
    	let div34;
    	let t56;
    	let div47;
    	let div42;
    	let div40;
    	let div38;
    	let stepinformation_ico;
    	let t57;
    	let div39;
    	let t59;
    	let div41;
    	let t61;
    	let div46;
    	let div43;
    	let t62;
    	let t63_value = /*$infoFormData*/ ctx[7].userName + "";
    	let t63;
    	let t64;
    	let div44;
    	let t65;
    	let t66_value = /*$infoFormData*/ ctx[7].phone + "";
    	let t66;
    	let t67;
    	let div45;
    	let t68;
    	let t69_value = /*$infoFormData*/ ctx[7].email + "";
    	let t69;
    	let t70;
    	let button;
    	let t71;
    	let span1;
    	let openacount_ico;
    	let div51_resize_listener;
    	let div51_intro;
    	let current;
    	let mounted;
    	let dispose;
    	stepcontribution_ico = new StepContribution_ico({ $$inline: true });
    	stepplan_ico = new StepPlan_ico({ $$inline: true });
    	steplegal_ico = new StepLegal_ico({ $$inline: true });
    	legalcheckbox_ico = new LegalCheckbox_ico({ $$inline: true });
    	stepinformation_ico = new StepInformation_ico({ $$inline: true });
    	let if_block = /*preloaderState*/ ctx[1] && create_if_block$e(ctx);
    	openacount_ico = new OpenAcount_ico({ $$inline: true });

    	const block = {
    		c: function create() {
    			div51 = element("div");
    			div50 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = text(" LET'S MAKE SURE WE'VE GOT EVERYTHING RIGHT!");
    			t2 = space();
    			div1 = element("div");
    			span0 = element("span");
    			t3 = space();
    			div49 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Final Review";
    			t5 = space();
    			div48 = element("div");
    			div10 = element("div");
    			div7 = element("div");
    			div5 = element("div");
    			div3 = element("div");
    			create_component(stepcontribution_ico.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			div4.textContent = "Contribution";
    			t8 = space();
    			div6 = element("div");
    			div6.textContent = "Change";
    			t10 = space();
    			div9 = element("div");
    			div8 = element("div");
    			t11 = text(t11_value);
    			t12 = text(t12_value);
    			t13 = space();
    			t14 = text(t14_value);
    			t15 = text(" per Month Starting ");
    			t16 = text(t16_value);
    			t17 = text("th\r\n              ");
    			t18 = text(t18_value);
    			t19 = space();
    			t20 = text(/*currentYear*/ ctx[0]);
    			t21 = space();
    			div29 = element("div");
    			div15 = element("div");
    			div13 = element("div");
    			div11 = element("div");
    			create_component(stepplan_ico.$$.fragment);
    			t22 = space();
    			div12 = element("div");
    			div12.textContent = "Plan";
    			t24 = space();
    			div14 = element("div");
    			div14.textContent = "Change";
    			t26 = space();
    			div28 = element("div");
    			div19 = element("div");
    			div16 = element("div");
    			div16.textContent = "Safe";
    			t28 = space();
    			div17 = element("div");
    			t29 = text(t29_value);
    			t30 = text("%");
    			t31 = space();
    			div18 = element("div");
    			t32 = text(t32_value);
    			t33 = text(t33_value);
    			t34 = space();
    			div23 = element("div");
    			div20 = element("div");
    			div20.textContent = "Adventure";
    			t36 = space();
    			div21 = element("div");
    			t37 = text(t37_value);
    			t38 = text("%");
    			t39 = space();
    			div22 = element("div");
    			t40 = text(t40_value);
    			t41 = text(t41_value);
    			t42 = space();
    			div27 = element("div");
    			div24 = element("div");
    			div24.textContent = "Founder";
    			t44 = space();
    			div25 = element("div");
    			t45 = text(t45_value);
    			t46 = text("%");
    			t47 = space();
    			div26 = element("div");
    			t48 = text(t48_value);
    			t49 = text(t49_value);
    			t50 = space();
    			div37 = element("div");
    			div33 = element("div");
    			div32 = element("div");
    			div30 = element("div");
    			create_component(steplegal_ico.$$.fragment);
    			t51 = space();
    			div31 = element("div");
    			div31.textContent = "Legal";
    			t53 = space();
    			div36 = element("div");
    			div35 = element("div");
    			create_component(legalcheckbox_ico.$$.fragment);
    			t54 = space();
    			div34 = element("div");
    			div34.textContent = "You agreed to all Terms & Conditions, Contract Agreement,\r\n                Privacy & Cookie";
    			t56 = space();
    			div47 = element("div");
    			div42 = element("div");
    			div40 = element("div");
    			div38 = element("div");
    			create_component(stepinformation_ico.$$.fragment);
    			t57 = space();
    			div39 = element("div");
    			div39.textContent = "Information";
    			t59 = space();
    			div41 = element("div");
    			div41.textContent = "Change";
    			t61 = space();
    			div46 = element("div");
    			div43 = element("div");
    			t62 = text("N: ");
    			t63 = text(t63_value);
    			t64 = space();
    			div44 = element("div");
    			t65 = text("P: ");
    			t66 = text(t66_value);
    			t67 = space();
    			div45 = element("div");
    			t68 = text("E: ");
    			t69 = text(t69_value);
    			t70 = space();
    			button = element("button");
    			if (if_block) if_block.c();
    			t71 = space();
    			span1 = element("span");
    			span1.textContent = "Open Account";
    			create_component(openacount_ico.$$.fragment);
    			attr_dev(div0, "class", "pop__up_head__text svelte-bxhoqo");
    			add_location(div0, file$F, 108, 6, 3479);
    			attr_dev(span0, "class", "svelte-bxhoqo");
    			add_location(span0, file$F, 111, 56, 3661);
    			attr_dev(div1, "class", "pop__up__close svelte-bxhoqo");
    			add_location(div1, file$F, 111, 6, 3611);
    			attr_dev(div2, "class", "pop__up__head svelte-bxhoqo");
    			add_location(div2, file$F, 107, 4, 3444);
    			attr_dev(h3, "class", "svelte-bxhoqo");
    			add_location(h3, file$F, 114, 6, 3728);
    			attr_dev(div3, "class", "step__icon svelte-bxhoqo");
    			add_location(div3, file$F, 119, 14, 3906);
    			attr_dev(div4, "class", "step__name svelte-bxhoqo");
    			add_location(div4, file$F, 122, 14, 4010);
    			attr_dev(div5, "class", "step svelte-bxhoqo");
    			add_location(div5, file$F, 118, 12, 3872);
    			attr_dev(div6, "class", "change__btn svelte-bxhoqo");
    			add_location(div6, file$F, 124, 12, 4086);
    			attr_dev(div7, "class", "item__head svelte-bxhoqo");
    			add_location(div7, file$F, 117, 10, 3834);
    			attr_dev(div8, "class", "text svelte-bxhoqo");
    			add_location(div8, file$F, 134, 12, 4333);
    			attr_dev(div9, "class", "item__body svelte-bxhoqo");
    			add_location(div9, file$F, 133, 10, 4295);
    			attr_dev(div10, "class", "pop__up__item svelte-bxhoqo");
    			add_location(div10, file$F, 116, 8, 3795);
    			attr_dev(div11, "class", "step__icon svelte-bxhoqo");
    			add_location(div11, file$F, 147, 14, 4864);
    			attr_dev(div12, "class", "step__name svelte-bxhoqo");
    			add_location(div12, file$F, 150, 14, 4960);
    			attr_dev(div13, "class", "step svelte-bxhoqo");
    			add_location(div13, file$F, 146, 12, 4830);
    			attr_dev(div14, "class", "change__btn svelte-bxhoqo");
    			add_location(div14, file$F, 152, 12, 5028);
    			attr_dev(div15, "class", "item__head svelte-bxhoqo");
    			add_location(div15, file$F, 145, 10, 4792);
    			attr_dev(div16, "class", "name");
    			add_location(div16, file$F, 163, 14, 5320);
    			attr_dev(div17, "class", "persentage svelte-bxhoqo");
    			add_location(div17, file$F, 164, 14, 5364);
    			attr_dev(div18, "class", "money svelte-bxhoqo");
    			add_location(div18, file$F, 165, 14, 5441);
    			attr_dev(div19, "class", "item__plan save svelte-bxhoqo");
    			add_location(div19, file$F, 162, 12, 5275);
    			attr_dev(div20, "class", "name");
    			add_location(div20, file$F, 172, 14, 5707);
    			attr_dev(div21, "class", "persentage svelte-bxhoqo");
    			add_location(div21, file$F, 173, 14, 5756);
    			attr_dev(div22, "class", "money svelte-bxhoqo");
    			add_location(div22, file$F, 174, 14, 5838);
    			attr_dev(div23, "class", "item__plan adventure svelte-bxhoqo");
    			add_location(div23, file$F, 171, 12, 5657);
    			attr_dev(div24, "class", "name");
    			add_location(div24, file$F, 181, 14, 6107);
    			attr_dev(div25, "class", "persentage svelte-bxhoqo");
    			add_location(div25, file$F, 182, 14, 6154);
    			attr_dev(div26, "class", "money svelte-bxhoqo");
    			add_location(div26, file$F, 183, 14, 6234);
    			attr_dev(div27, "class", "item__plan founder svelte-bxhoqo");
    			add_location(div27, file$F, 180, 12, 6059);
    			attr_dev(div28, "class", "item__body svelte-bxhoqo");
    			add_location(div28, file$F, 161, 10, 5237);
    			attr_dev(div29, "class", "pop__up__item svelte-bxhoqo");
    			add_location(div29, file$F, 144, 8, 4753);
    			attr_dev(div30, "class", "step__icon svelte-bxhoqo");
    			add_location(div30, file$F, 194, 14, 6594);
    			attr_dev(div31, "class", "step__name svelte-bxhoqo");
    			add_location(div31, file$F, 197, 14, 6691);
    			attr_dev(div32, "class", "step svelte-bxhoqo");
    			add_location(div32, file$F, 193, 12, 6560);
    			attr_dev(div33, "class", "item__head svelte-bxhoqo");
    			add_location(div33, file$F, 192, 10, 6522);
    			attr_dev(div34, "class", "text svelte-bxhoqo");
    			add_location(div34, file$F, 203, 14, 6892);
    			attr_dev(div35, "class", "legal__item svelte-bxhoqo");
    			add_location(div35, file$F, 201, 12, 6814);
    			attr_dev(div36, "class", "item__body svelte-bxhoqo");
    			add_location(div36, file$F, 200, 10, 6776);
    			attr_dev(div37, "class", "pop__up__item svelte-bxhoqo");
    			add_location(div37, file$F, 191, 8, 6483);
    			attr_dev(div38, "class", "step__icon svelte-bxhoqo");
    			add_location(div38, file$F, 213, 14, 7216);
    			attr_dev(div39, "class", "step__name svelte-bxhoqo");
    			add_location(div39, file$F, 216, 14, 7319);
    			attr_dev(div40, "class", "step svelte-bxhoqo");
    			add_location(div40, file$F, 212, 12, 7182);
    			attr_dev(div41, "class", "change__btn svelte-bxhoqo");
    			add_location(div41, file$F, 218, 12, 7394);
    			attr_dev(div42, "class", "item__head svelte-bxhoqo");
    			add_location(div42, file$F, 211, 10, 7144);
    			attr_dev(div43, "class", "text svelte-bxhoqo");
    			add_location(div43, file$F, 228, 12, 7641);
    			attr_dev(div44, "class", "text svelte-bxhoqo");
    			add_location(div44, file$F, 229, 12, 7706);
    			attr_dev(div45, "class", "text svelte-bxhoqo");
    			add_location(div45, file$F, 230, 12, 7768);
    			attr_dev(div46, "class", "item__body svelte-bxhoqo");
    			add_location(div46, file$F, 227, 10, 7603);
    			attr_dev(div47, "class", "pop__up__item svelte-bxhoqo");
    			add_location(div47, file$F, 210, 8, 7105);
    			attr_dev(div48, "class", "pop__up__items");
    			add_location(div48, file$F, 115, 6, 3757);
    			add_location(span1, file$F, 239, 8, 8108);
    			attr_dev(button, "class", "submt__btn svelte-bxhoqo");
    			add_location(button, file$F, 234, 6, 7872);
    			attr_dev(div49, "class", "pop__up__body svelte-bxhoqo");
    			add_location(div49, file$F, 113, 4, 3693);
    			attr_dev(div50, "class", "pop__up__wrapper svelte-bxhoqo");
    			add_location(div50, file$F, 106, 2, 3408);
    			attr_dev(div51, "class", "pop__up svelte-bxhoqo");
    			add_render_callback(() => /*div51_elementresize_handler*/ ctx[15].call(div51));
    			add_location(div51, file$F, 104, 0, 3340);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div51, anchor);
    			append_dev(div51, div50);
    			append_dev(div50, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, span0);
    			append_dev(div50, t3);
    			append_dev(div50, div49);
    			append_dev(div49, h3);
    			append_dev(div49, t5);
    			append_dev(div49, div48);
    			append_dev(div48, div10);
    			append_dev(div10, div7);
    			append_dev(div7, div5);
    			append_dev(div5, div3);
    			mount_component(stepcontribution_ico, div3, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div7, t8);
    			append_dev(div7, div6);
    			append_dev(div10, t10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, t11);
    			append_dev(div8, t12);
    			append_dev(div8, t13);
    			append_dev(div8, t14);
    			append_dev(div8, t15);
    			append_dev(div8, t16);
    			append_dev(div8, t17);
    			append_dev(div8, t18);
    			append_dev(div8, t19);
    			append_dev(div8, t20);
    			append_dev(div48, t21);
    			append_dev(div48, div29);
    			append_dev(div29, div15);
    			append_dev(div15, div13);
    			append_dev(div13, div11);
    			mount_component(stepplan_ico, div11, null);
    			append_dev(div13, t22);
    			append_dev(div13, div12);
    			append_dev(div15, t24);
    			append_dev(div15, div14);
    			append_dev(div29, t26);
    			append_dev(div29, div28);
    			append_dev(div28, div19);
    			append_dev(div19, div16);
    			append_dev(div19, t28);
    			append_dev(div19, div17);
    			append_dev(div17, t29);
    			append_dev(div17, t30);
    			append_dev(div19, t31);
    			append_dev(div19, div18);
    			append_dev(div18, t32);
    			append_dev(div18, t33);
    			append_dev(div28, t34);
    			append_dev(div28, div23);
    			append_dev(div23, div20);
    			append_dev(div23, t36);
    			append_dev(div23, div21);
    			append_dev(div21, t37);
    			append_dev(div21, t38);
    			append_dev(div23, t39);
    			append_dev(div23, div22);
    			append_dev(div22, t40);
    			append_dev(div22, t41);
    			append_dev(div28, t42);
    			append_dev(div28, div27);
    			append_dev(div27, div24);
    			append_dev(div27, t44);
    			append_dev(div27, div25);
    			append_dev(div25, t45);
    			append_dev(div25, t46);
    			append_dev(div27, t47);
    			append_dev(div27, div26);
    			append_dev(div26, t48);
    			append_dev(div26, t49);
    			append_dev(div48, t50);
    			append_dev(div48, div37);
    			append_dev(div37, div33);
    			append_dev(div33, div32);
    			append_dev(div32, div30);
    			mount_component(steplegal_ico, div30, null);
    			append_dev(div32, t51);
    			append_dev(div32, div31);
    			append_dev(div37, t53);
    			append_dev(div37, div36);
    			append_dev(div36, div35);
    			mount_component(legalcheckbox_ico, div35, null);
    			append_dev(div35, t54);
    			append_dev(div35, div34);
    			append_dev(div48, t56);
    			append_dev(div48, div47);
    			append_dev(div47, div42);
    			append_dev(div42, div40);
    			append_dev(div40, div38);
    			mount_component(stepinformation_ico, div38, null);
    			append_dev(div40, t57);
    			append_dev(div40, div39);
    			append_dev(div42, t59);
    			append_dev(div42, div41);
    			append_dev(div47, t61);
    			append_dev(div47, div46);
    			append_dev(div46, div43);
    			append_dev(div43, t62);
    			append_dev(div43, t63);
    			append_dev(div46, t64);
    			append_dev(div46, div44);
    			append_dev(div44, t65);
    			append_dev(div44, t66);
    			append_dev(div46, t67);
    			append_dev(div46, div45);
    			append_dev(div45, t68);
    			append_dev(div45, t69);
    			append_dev(div49, t70);
    			append_dev(div49, button);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t71);
    			append_dev(button, span1);
    			mount_component(openacount_ico, button, null);
    			div51_resize_listener = add_resize_listener(div51, /*div51_elementresize_handler*/ ctx[15].bind(div51));
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*closePopUp*/ ctx[10], false, false, false),
    					listen_dev(div6, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(div14, "click", /*click_handler_1*/ ctx[13], false, false, false),
    					listen_dev(div41, "click", /*click_handler_2*/ ctx[14], false, false, false),
    					listen_dev(button, "click", /*confirmAllData*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$infoFormData*/ 128) && t0_value !== (t0_value = /*$infoFormData*/ ctx[7].userName + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*$contributionData*/ 32) && t11_value !== (t11_value = /*$contributionData*/ ctx[5].country.currency.symbol + "")) set_data_dev(t11, t11_value);
    			if ((!current || dirty & /*$contributionData*/ 32) && t12_value !== (t12_value = priceConvertation(/*$contributionData*/ ctx[5].monthlyValue) + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*$contributionData*/ 32) && t14_value !== (t14_value = /*$contributionData*/ ctx[5].country.currency.code + "")) set_data_dev(t14, t14_value);
    			if ((!current || dirty & /*$contributionData*/ 32) && t16_value !== (t16_value = /*$contributionData*/ ctx[5].nextPaymentDay + "")) set_data_dev(t16, t16_value);
    			if ((!current || dirty & /*$contributionData*/ 32) && t18_value !== (t18_value = /*$contributionData*/ ctx[5].nextPaymentMonth + "")) set_data_dev(t18, t18_value);
    			if (!current || dirty & /*currentYear*/ 1) set_data_dev(t20, /*currentYear*/ ctx[0]);
    			if ((!current || dirty & /*$allocatedContributions*/ 64) && t29_value !== (t29_value = /*$allocatedContributions*/ ctx[6].safe + "")) set_data_dev(t29, t29_value);
    			if ((!current || dirty & /*$contributionData*/ 32) && t32_value !== (t32_value = /*$contributionData*/ ctx[5].country.currency.symbol + "")) set_data_dev(t32, t32_value);
    			if ((!current || dirty & /*safePrice*/ 4) && t33_value !== (t33_value = priceConvertation(Math.round(/*safePrice*/ ctx[2])) + "")) set_data_dev(t33, t33_value);
    			if ((!current || dirty & /*$allocatedContributions*/ 64) && t37_value !== (t37_value = /*$allocatedContributions*/ ctx[6].adventure + "")) set_data_dev(t37, t37_value);
    			if ((!current || dirty & /*$contributionData*/ 32) && t40_value !== (t40_value = /*$contributionData*/ ctx[5].country.currency.symbol + "")) set_data_dev(t40, t40_value);
    			if ((!current || dirty & /*adventurePrice*/ 8) && t41_value !== (t41_value = priceConvertation(Math.round(/*adventurePrice*/ ctx[3])) + "")) set_data_dev(t41, t41_value);
    			if ((!current || dirty & /*$allocatedContributions*/ 64) && t45_value !== (t45_value = /*$allocatedContributions*/ ctx[6].founder + "")) set_data_dev(t45, t45_value);
    			if ((!current || dirty & /*$contributionData*/ 32) && t48_value !== (t48_value = /*$contributionData*/ ctx[5].country.currency.symbol + "")) set_data_dev(t48, t48_value);
    			if ((!current || dirty & /*founderPrice*/ 16) && t49_value !== (t49_value = priceConvertation(Math.round(/*founderPrice*/ ctx[4])) + "")) set_data_dev(t49, t49_value);
    			if ((!current || dirty & /*$infoFormData*/ 128) && t63_value !== (t63_value = /*$infoFormData*/ ctx[7].userName + "")) set_data_dev(t63, t63_value);
    			if ((!current || dirty & /*$infoFormData*/ 128) && t66_value !== (t66_value = /*$infoFormData*/ ctx[7].phone + "")) set_data_dev(t66, t66_value);
    			if ((!current || dirty & /*$infoFormData*/ 128) && t69_value !== (t69_value = /*$infoFormData*/ ctx[7].email + "")) set_data_dev(t69, t69_value);

    			if (/*preloaderState*/ ctx[1]) {
    				if (if_block) {
    					if (dirty & /*preloaderState*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$e(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(button, t71);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stepcontribution_ico.$$.fragment, local);
    			transition_in(stepplan_ico.$$.fragment, local);
    			transition_in(steplegal_ico.$$.fragment, local);
    			transition_in(legalcheckbox_ico.$$.fragment, local);
    			transition_in(stepinformation_ico.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(openacount_ico.$$.fragment, local);

    			if (!div51_intro) {
    				add_render_callback(() => {
    					div51_intro = create_in_transition(div51, fade, {});
    					div51_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stepcontribution_ico.$$.fragment, local);
    			transition_out(stepplan_ico.$$.fragment, local);
    			transition_out(steplegal_ico.$$.fragment, local);
    			transition_out(legalcheckbox_ico.$$.fragment, local);
    			transition_out(stepinformation_ico.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(openacount_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div51);
    			destroy_component(stepcontribution_ico);
    			destroy_component(stepplan_ico);
    			destroy_component(steplegal_ico);
    			destroy_component(legalcheckbox_ico);
    			destroy_component(stepinformation_ico);
    			if (if_block) if_block.d();
    			destroy_component(openacount_ico);
    			div51_resize_listener();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$J.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$J($$self, $$props, $$invalidate) {
    	let $contributionData;
    	let $allocatedContributions;
    	let $clickOnPrevBtn;
    	let $stepCounter;
    	let $confirmPopUpState;
    	let $headSteps;
    	let $infoFormData;
    	let $popUpHeight;
    	validate_store(contributionData, 'contributionData');
    	component_subscribe($$self, contributionData, $$value => $$invalidate(5, $contributionData = $$value));
    	validate_store(allocatedContributions, 'allocatedContributions');
    	component_subscribe($$self, allocatedContributions, $$value => $$invalidate(6, $allocatedContributions = $$value));
    	validate_store(clickOnPrevBtn, 'clickOnPrevBtn');
    	component_subscribe($$self, clickOnPrevBtn, $$value => $$invalidate(17, $clickOnPrevBtn = $$value));
    	validate_store(stepCounter, 'stepCounter');
    	component_subscribe($$self, stepCounter, $$value => $$invalidate(18, $stepCounter = $$value));
    	validate_store(confirmPopUpState, 'confirmPopUpState');
    	component_subscribe($$self, confirmPopUpState, $$value => $$invalidate(19, $confirmPopUpState = $$value));
    	validate_store(headSteps, 'headSteps');
    	component_subscribe($$self, headSteps, $$value => $$invalidate(20, $headSteps = $$value));
    	validate_store(infoFormData, 'infoFormData');
    	component_subscribe($$self, infoFormData, $$value => $$invalidate(7, $infoFormData = $$value));
    	validate_store(popUpHeight, 'popUpHeight');
    	component_subscribe($$self, popUpHeight, $$value => $$invalidate(8, $popUpHeight = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FinalReview', slots, []);
    	let changeCounter = 0;
    	let currentDate = new Date();
    	let currentYear = currentDate.getFullYear();
    	let currentDay = currentDate.getDate();
    	let preloaderState = false;

    	if ($contributionData.nextPaymentMonth === "January") {
    		if ($contributionData.country.period === "Monthly") {
    			currentYear = currentYear + 1;
    		} else if ($contributionData.country.period === "Bi-Monthly" && currentDay >= 15) {
    			currentYear = currentYear + 1;
    		}
    	}

    	let confirmAllData = async () => {
    		$$invalidate(1, preloaderState = true);

    		const userData = {
    			username: $infoFormData.userName,
    			phoneCode: $contributionData.country.phoneCode,
    			phoneNumber: $infoFormData.phone,
    			email: $infoFormData.email,
    			password: $infoFormData.password,
    			countryId: $contributionData.country.countryId,
    			periodId: $contributionData.period.periodId,
    			amount: $contributionData.amount,
    			greenSafe: $allocatedContributions.safe,
    			greenAdventure: $allocatedContributions.adventure,
    			greenFounder: $allocatedContributions.founder
    		};

    		const status = await createUserInDB(userData);
    		console.log(status);

    		if (status) {
    			set_store_value(confirmPopUpState, $confirmPopUpState = false, $confirmPopUpState);
    			set_store_value(headSteps, $headSteps.fifthStep = true, $headSteps);

    			if (changeCounter === 0) {
    				incrementStep();
    				changeCounter += 1;
    			}

    			scrollToTop$1();
    		}

    		$$invalidate(1, preloaderState = false);
    	};

    	let closePopUp = () => {
    		set_store_value(confirmPopUpState, $confirmPopUpState = false, $confirmPopUpState);
    	};

    	let changeStep = stepNum => {
    		set_store_value(confirmPopUpState, $confirmPopUpState = false, $confirmPopUpState);
    		set_store_value(stepCounter, $stepCounter = stepNum, $stepCounter);

    		if (stepNum === 4) {
    			set_store_value(clickOnPrevBtn, $clickOnPrevBtn = true, $clickOnPrevBtn);
    		}

    		scrollToTop$1();
    	};

    	let safePrice = 0, adventurePrice = 0, founderPrice = 0;

    	beforeUpdate(() => {
    		$$invalidate(2, safePrice = $allocatedContributions.safe * $contributionData.monthlyValue / 100);
    		$$invalidate(3, adventurePrice = $allocatedContributions.adventure * $contributionData.monthlyValue / 100);
    		$$invalidate(4, founderPrice = $allocatedContributions.founder * $contributionData.monthlyValue / 100);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<FinalReview> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		changeStep(1);
    	};

    	const click_handler_1 = () => {
    		changeStep(2);
    	};

    	const click_handler_2 = () => {
    		changeStep(4);
    	};

    	function div51_elementresize_handler() {
    		$popUpHeight = this.clientHeight;
    		popUpHeight.set($popUpHeight);
    	}

    	$$self.$capture_state = () => ({
    		contributionData,
    		allocatedContributions,
    		infoFormData,
    		confirmPopUpState,
    		clickOnPrevBtn,
    		headSteps,
    		incrementStep,
    		stepCounter,
    		popUpHeight,
    		userAuthToken,
    		beforeUpdate,
    		fade,
    		StepContribution_ico,
    		StepPlan_ico,
    		StepLegal_ico,
    		LegalCheckbox_ico,
    		StepInformation_ico,
    		OpenAcount_ico,
    		priceConvertation,
    		scrollToTop: scrollToTop$1,
    		Preloader,
    		createUserInDB,
    		changeCounter,
    		currentDate,
    		currentYear,
    		currentDay,
    		preloaderState,
    		confirmAllData,
    		closePopUp,
    		changeStep,
    		safePrice,
    		adventurePrice,
    		founderPrice,
    		$contributionData,
    		$allocatedContributions,
    		$clickOnPrevBtn,
    		$stepCounter,
    		$confirmPopUpState,
    		$headSteps,
    		$infoFormData,
    		$popUpHeight
    	});

    	$$self.$inject_state = $$props => {
    		if ('changeCounter' in $$props) changeCounter = $$props.changeCounter;
    		if ('currentDate' in $$props) currentDate = $$props.currentDate;
    		if ('currentYear' in $$props) $$invalidate(0, currentYear = $$props.currentYear);
    		if ('currentDay' in $$props) currentDay = $$props.currentDay;
    		if ('preloaderState' in $$props) $$invalidate(1, preloaderState = $$props.preloaderState);
    		if ('confirmAllData' in $$props) $$invalidate(9, confirmAllData = $$props.confirmAllData);
    		if ('closePopUp' in $$props) $$invalidate(10, closePopUp = $$props.closePopUp);
    		if ('changeStep' in $$props) $$invalidate(11, changeStep = $$props.changeStep);
    		if ('safePrice' in $$props) $$invalidate(2, safePrice = $$props.safePrice);
    		if ('adventurePrice' in $$props) $$invalidate(3, adventurePrice = $$props.adventurePrice);
    		if ('founderPrice' in $$props) $$invalidate(4, founderPrice = $$props.founderPrice);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*currentYear*/ 1) ;
    	};

    	return [
    		currentYear,
    		preloaderState,
    		safePrice,
    		adventurePrice,
    		founderPrice,
    		$contributionData,
    		$allocatedContributions,
    		$infoFormData,
    		$popUpHeight,
    		confirmAllData,
    		closePopUp,
    		changeStep,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		div51_elementresize_handler
    	];
    }

    class FinalReview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$J, create_fragment$J, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FinalReview",
    			options,
    			id: create_fragment$J.name
    		});
    	}
    }

    function collapse (node, params) {

        const defaultParams = {
            open: true,
            duration: 0.2,
            easing: 'ease'
        };

        params = Object.assign(defaultParams, params);

        const noop = () => {};
        let transitionEndResolve = noop;
        let transitionEndReject = noop;

        const listener = node.addEventListener('transitionend', () => {
            transitionEndResolve();
            transitionEndResolve = noop;
            transitionEndReject = noop;
        });

        // convenience functions
        async function asyncTransitionEnd () {
            return new Promise((resolve, reject) => {
                transitionEndResolve = resolve;
                transitionEndReject = reject;
            })
        }

        async function nextFrame () {
            return new Promise(requestAnimationFrame)
        }

        function transition () {
            return `height ${params.duration}s ${params.easing}`
        }

        // set initial styles
        node.style.overflow = 'hidden';
        node.style.transition = transition();
        node.style.height = params.open ? 'auto' : '0px';

        async function enter () {

            // height is already in pixels
            // start the transition
            node.style.height = node.scrollHeight + 'px';

            // wait for transition to end,
            // then switch back to height auto
            try {
                await asyncTransitionEnd();
                node.style.height = 'auto';
            } catch(err) {
                // interrupted by a leave transition
            }

        }

        async function leave () {

            if (node.style.height === 'auto') {

                // temporarily turn transitions off
                node.style.transition = 'none';
                await nextFrame();

                // set height to pixels, and turn transition back on
                node.style.height = node.scrollHeight + 'px';
                node.style.transition = transition();
                await nextFrame();

                // start the transition
                node.style.height = '0px';

            }
            else {

                // we are interrupting an enter transition
                transitionEndReject();
                node.style.height = '0px';

            }

        }

        function update (newParams) {
            params = Object.assign(params, newParams);
            params.open ? enter() : leave();
        }

        function destroy () {
            node.removeEventListener('transitionend', listener);
        }

        return { update, destroy }

    }

    /* node_modules\svelte-collapsible\src\components\Accordion.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1$3 } = globals;
    const file$E = "node_modules\\svelte-collapsible\\src\\components\\Accordion.svelte";

    function create_fragment$I(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			attr_dev(ul, "class", "accordion svelte-da9j5z");
    			add_location(ul, file$E, 34, 0, 829);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$I.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$I($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Accordion', slots, ['default']);
    	let { duration = 0.2 } = $$props;
    	let { easing = 'ease' } = $$props;
    	let { key = null } = $$props;
    	const dispatch = createEventDispatcher();

    	// create a store for the children to access
    	const store = writable({ key, duration, easing });

    	// when the store changes, update the key prop
    	const unsubscribe = store.subscribe(s => {
    		$$invalidate(0, key = s.key);
    		dispatch('change', { key });
    	});

    	// make the store available to children
    	setContext('svelte-collapsible-accordion', store);

    	onDestroy(unsubscribe);
    	const writable_props = ['duration', 'easing', 'key'];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Accordion> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('duration' in $$props) $$invalidate(1, duration = $$props.duration);
    		if ('easing' in $$props) $$invalidate(2, easing = $$props.easing);
    		if ('key' in $$props) $$invalidate(0, key = $$props.key);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		setContext,
    		createEventDispatcher,
    		writable,
    		duration,
    		easing,
    		key,
    		dispatch,
    		store,
    		unsubscribe
    	});

    	$$self.$inject_state = $$props => {
    		if ('duration' in $$props) $$invalidate(1, duration = $$props.duration);
    		if ('easing' in $$props) $$invalidate(2, easing = $$props.easing);
    		if ('key' in $$props) $$invalidate(0, key = $$props.key);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*key*/ 1) {
    			// when the key prop changes, update the store
    			store.update(s => Object.assign(s, { key }));
    		}
    	};

    	return [key, duration, easing, $$scope, slots];
    }

    class Accordion extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$I, create_fragment$I, safe_not_equal, { duration: 1, easing: 2, key: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Accordion",
    			options,
    			id: create_fragment$I.name
    		});
    	}

    	get duration() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get easing() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set easing(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-collapsible\src\components\AccordionItem.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1$2 } = globals;
    const file$D = "node_modules\\svelte-collapsible\\src\\components\\AccordionItem.svelte";
    const get_body_slot_changes = dirty => ({});
    const get_body_slot_context = ctx => ({});
    const get_header_slot_changes = dirty => ({});
    const get_header_slot_context = ctx => ({});

    function create_fragment$H(ctx) {
    	let li;
    	let div0;
    	let t0;
    	let div1;
    	let collapse_action;
    	let t1;
    	let li_aria_expanded_value;
    	let current;
    	let mounted;
    	let dispose;
    	const header_slot_template = /*#slots*/ ctx[6].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[5], get_header_slot_context);
    	const body_slot_template = /*#slots*/ ctx[6].body;
    	const body_slot = create_slot(body_slot_template, ctx, /*$$scope*/ ctx[5], get_body_slot_context);
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			li = element("li");
    			div0 = element("div");
    			if (header_slot) header_slot.c();
    			t0 = space();
    			div1 = element("div");
    			if (body_slot) body_slot.c();
    			t1 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "accordion-item-header svelte-13br4ya");
    			add_location(div0, file$D, 32, 4, 598);
    			attr_dev(div1, "class", "accordion-item-body");
    			add_location(div1, file$D, 36, 4, 705);
    			attr_dev(li, "class", "accordion-item");
    			attr_dev(li, "aria-expanded", li_aria_expanded_value = /*params*/ ctx[0].open);
    			add_location(li, file$D, 30, 0, 537);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div0);

    			if (header_slot) {
    				header_slot.m(div0, null);
    			}

    			append_dev(li, t0);
    			append_dev(li, div1);

    			if (body_slot) {
    				body_slot.m(div1, null);
    			}

    			append_dev(li, t1);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*handleToggle*/ ctx[2], false, false, false),
    					action_destroyer(collapse_action = collapse.call(null, div1, /*params*/ ctx[0]))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (header_slot) {
    				if (header_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						header_slot,
    						header_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(header_slot_template, /*$$scope*/ ctx[5], dirty, get_header_slot_changes),
    						get_header_slot_context
    					);
    				}
    			}

    			if (body_slot) {
    				if (body_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						body_slot,
    						body_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(body_slot_template, /*$$scope*/ ctx[5], dirty, get_body_slot_changes),
    						get_body_slot_context
    					);
    				}
    			}

    			if (collapse_action && is_function(collapse_action.update) && dirty & /*params*/ 1) collapse_action.update.call(null, /*params*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*params*/ 1 && li_aria_expanded_value !== (li_aria_expanded_value = /*params*/ ctx[0].open)) {
    				attr_dev(li, "aria-expanded", li_aria_expanded_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_slot, local);
    			transition_in(body_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_slot, local);
    			transition_out(body_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (header_slot) header_slot.d(detaching);
    			if (body_slot) body_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$H.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$H($$self, $$props, $$invalidate) {
    	let params;
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AccordionItem', slots, ['header','body','default']);
    	let { key } = $$props;
    	const store = getContext('svelte-collapsible-accordion');
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(4, $store = value));

    	function handleToggle() {
    		if (params.open) {
    			store.update(s => Object.assign(s, { key: null }));
    		} else {
    			store.update(s => Object.assign(s, { key }));
    		}
    	}

    	const writable_props = ['key'];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AccordionItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('key' in $$props) $$invalidate(3, key = $$props.key);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		collapse,
    		key,
    		store,
    		handleToggle,
    		params,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('key' in $$props) $$invalidate(3, key = $$props.key);
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$store, key*/ 24) {
    			$$invalidate(0, params = {
    				open: $store.key === key,
    				duration: $store.duration,
    				easing: $store.easing
    			});
    		}
    	};

    	return [params, store, handleToggle, key, $store, $$scope, slots];
    }

    class AccordionItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$H, create_fragment$H, safe_not_equal, { key: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AccordionItem",
    			options,
    			id: create_fragment$H.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*key*/ ctx[3] === undefined && !('key' in props)) {
    			console.warn("<AccordionItem> was created without expected prop 'key'");
    		}
    	}

    	get key() {
    		throw new Error("<AccordionItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<AccordionItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const legalItems = [
      {
        key: "a",
        checked: false,
        name: "Terms & Condition",
        title: "Terms and Conditions",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultricies gravida enim, ac congue diam. Cras faucibus lorem et velit tempus viverra. Nulla facilisi. Nulla neque neque, bibendum sit amet consequat id, dapibus at purus. Etiam cursus varius turpis, vitae efficitur erat facilisis ut. Quisque fringilla in purus non posuere. Mauris lobortis et orci at scelerisque. Curabitur elementum consectetur eros eget congue. Morbi aliquet eleifend elementum. Ut et tempor quam, id sodales mi. Nullam eget placerat orci. Suspendisse rhoncus, sem eu interdum facilisis, ipsum mi egestas purus, in vulputate erat neque eget nibh. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer sit amet eros nec arcu vestibulum mattis. Pellentesque vitae mauris nunc. Mauris sed tortor ac nibh tempor gravida. Donec cursus, nulla et auctor sollicitudin, nibh orci accumsan nunc, ultricies malesuada risus lectus vitae mauris. Ut eu tortor porttitor ligula venenatis sodales. Morbi sollicitudin nulla vel neque hendrerit euismod non eget purus. Donec non nisi quis urna sagittis sagittis. Fusce ut varius velit. Fusce ac sollicitudin tellus. Integer finibus, purus quis volutpat dignissim, velit leo interdum est, vel auctor neque odio vel lectus. Vivamus ac tortor nulla. Suspendisse tempor imperdiet eros, placerat maximus augue elementum vel. Aliquam varius leo magna, ut finibus ipsum ullamcorper at. Mauris sed tortor ac nibh tempor gravida. Donec cursus, nulla et auctor sollicitudin, nibh orci accumsan nunc, ultricies malesuada risus lectus vitae mauris. Ut eu tortor porttitor ligula venenatis sodales. Morbi sollicitudin nulla vel neque hendrerit euismod non eget purus. Donec non nisi quis urna sagittis sagittis. Fusce ut varius velit. Fusce ac sollicitudin tellus. Integer finibus, purus quis volutpat dignissim, velit leo interdum est, vel auctor neque odio vel lectus. Vivamus ac tortor nulla. Suspendisse tempor imperdiet eros, placerat maximus augue elementum vel. Aliquam varius leo magna, ut finibus ipsum ullamcorper at.",
      },
      {
        key: "b",
        checked: false,
        name: "Contract Agreement",
        title: "Terms and Conditions",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultricies gravida enim, ac congue diam. Cras faucibus lorem et velit tempus viverra. Nulla facilisi. Nulla neque neque, bibendum sit amet consequat id, dapibus at purus. Etiam cursus varius turpis, vitae efficitur erat facilisis ut. Quisque fringilla in purus non posuere. Mauris lobortis et orci at scelerisque. Curabitur elementum consectetur eros eget congue. Morbi aliquet eleifend elementum. Ut et tempor quam, id sodales mi. Nullam eget placerat orci. Suspendisse rhoncus, sem eu interdum facilisis, ipsum mi egestas purus, in vulputate erat neque eget nibh. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer sit amet eros nec arcu vestibulum mattis. Pellentesque vitae mauris nunc. Mauris sed tortor ac nibh tempor gravida. Donec cursus, nulla et auctor sollicitudin, nibh orci accumsan nunc, ultricies malesuada risus lectus vitae mauris. Ut eu tortor porttitor ligula venenatis sodales. Morbi sollicitudin nulla vel neque hendrerit euismod non eget purus. Donec non nisi quis urna sagittis sagittis. Fusce ut varius velit. Fusce ac sollicitudin tellus. Integer finibus, purus quis volutpat dignissim, velit leo interdum est, vel auctor neque odio vel lectus. Vivamus ac tortor nulla. Suspendisse tempor imperdiet eros, placerat maximus augue elementum vel. Aliquam varius leo magna, ut finibus ipsum ullamcorper at. Mauris sed tortor ac nibh tempor gravida. Donec cursus, nulla et auctor sollicitudin, nibh orci accumsan nunc, ultricies malesuada risus lectus vitae mauris. Ut eu tortor porttitor ligula venenatis sodales. Morbi sollicitudin nulla vel neque hendrerit euismod non eget purus. Donec non nisi quis urna sagittis sagittis. Fusce ut varius velit. Fusce ac sollicitudin tellus. Integer finibus, purus quis volutpat dignissim, velit leo interdum est, vel auctor neque odio vel lectus. Vivamus ac tortor nulla. Suspendisse tempor imperdiet eros, placerat maximus augue elementum vel. Aliquam varius leo magna, ut finibus ipsum ullamcorper at.",
      },
      {
        key: "c",
        checked: false,
        name: "Privacy & Cookie",
        title: "Terms and Conditions",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultricies gravida enim, ac congue diam. Cras faucibus lorem et velit tempus viverra. Nulla facilisi. Nulla neque neque, bibendum sit amet consequat id, dapibus at purus. Etiam cursus varius turpis, vitae efficitur erat facilisis ut. Quisque fringilla in purus non posuere. Mauris lobortis et orci at scelerisque. Curabitur elementum consectetur eros eget congue. Morbi aliquet eleifend elementum. Ut et tempor quam, id sodales mi. Nullam eget placerat orci. Suspendisse rhoncus, sem eu interdum facilisis, ipsum mi egestas purus, in vulputate erat neque eget nibh. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer sit amet eros nec arcu vestibulum mattis. Pellentesque vitae mauris nunc. Mauris sed tortor ac nibh tempor gravida. Donec cursus, nulla et auctor sollicitudin, nibh orci accumsan nunc, ultricies malesuada risus lectus vitae mauris. Ut eu tortor porttitor ligula venenatis sodales. Morbi sollicitudin nulla vel neque hendrerit euismod non eget purus. Donec non nisi quis urna sagittis sagittis. Fusce ut varius velit. Fusce ac sollicitudin tellus. Integer finibus, purus quis volutpat dignissim, velit leo interdum est, vel auctor neque odio vel lectus. Vivamus ac tortor nulla. Suspendisse tempor imperdiet eros, placerat maximus augue elementum vel. Aliquam varius leo magna, ut finibus ipsum ullamcorper at. Mauris sed tortor ac nibh tempor gravida. Donec cursus, nulla et auctor sollicitudin, nibh orci accumsan nunc, ultricies malesuada risus lectus vitae mauris. Ut eu tortor porttitor ligula venenatis sodales. Morbi sollicitudin nulla vel neque hendrerit euismod non eget purus. Donec non nisi quis urna sagittis sagittis. Fusce ut varius velit. Fusce ac sollicitudin tellus. Integer finibus, purus quis volutpat dignissim, velit leo interdum est, vel auctor neque odio vel lectus. Vivamus ac tortor nulla. Suspendisse tempor imperdiet eros, placerat maximus augue elementum vel. Aliquam varius leo magna, ut finibus ipsum ullamcorper at.",
      },
    ];
    const checkboxStates = writable({
      a:false,
      b:false,
      c:false
    });

    const allSelected = writable (false);

    /* public\images\Toggle_ico.svelte generated by Svelte v3.48.0 */

    const file$C = "public\\images\\Toggle_ico.svelte";

    function create_fragment$G(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M4.29279 7.30529C4.48031 7.11782 4.73462 7.0125 4.99979 7.0125C5.26495 7.0125 5.51926 7.11782 5.70679 7.30529L11.9998 13.5983L18.2928 7.30529C18.385 7.20978 18.4954 7.1336 18.6174 7.08119C18.7394 7.02878 18.8706 7.00119 19.0034 7.00004C19.1362 6.99888 19.2678 7.02419 19.3907 7.07447C19.5136 7.12475 19.6253 7.199 19.7192 7.29289C19.8131 7.38679 19.8873 7.49844 19.9376 7.62133C19.9879 7.74423 20.0132 7.87591 20.012 8.00869C20.0109 8.14147 19.9833 8.27269 19.9309 8.39469C19.8785 8.5167 19.8023 8.62704 19.7068 8.71929L12.7068 15.7193C12.5193 15.9068 12.265 16.0121 11.9998 16.0121C11.7346 16.0121 11.4803 15.9068 11.2928 15.7193L4.29279 8.71929C4.10532 8.53176 4 8.27745 4 8.01229C4 7.74712 4.10532 7.49282 4.29279 7.30529Z");
    			attr_dev(path, "fill", "white");
    			add_location(path, file$C, 8, 4, 147);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", "arrow");
    			add_location(svg, file$C, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$G.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$G($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toggle_ico', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Toggle_ico> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Toggle_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$G, create_fragment$G, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toggle_ico",
    			options,
    			id: create_fragment$G.name
    		});
    	}
    }

    /* src\components\legal\content\TermsAndCond.svelte generated by Svelte v3.48.0 */

    const file$B = "src\\components\\legal\\content\\TermsAndCond.svelte";

    function create_fragment$F(ctx) {
    	let div34;
    	let p0;
    	let t0;
    	let a;
    	let t2;
    	let t3;
    	let div1;
    	let div0;
    	let t5;
    	let ul0;
    	let li0;
    	let t6;
    	let br0;
    	let span0;
    	let t7;
    	let br1;
    	let span1;
    	let t8;
    	let br2;
    	let span2;
    	let t10;
    	let li1;
    	let t12;
    	let li2;
    	let t14;
    	let li3;
    	let t16;
    	let li4;
    	let t18;
    	let div3;
    	let div2;
    	let t20;
    	let ul1;
    	let li5;
    	let t22;
    	let li6;
    	let t24;
    	let li7;
    	let t26;
    	let li8;
    	let t28;
    	let div5;
    	let div4;
    	let t30;
    	let ul2;
    	let li9;
    	let t32;
    	let li10;
    	let t34;
    	let div7;
    	let div6;
    	let t36;
    	let ul3;
    	let li11;
    	let t38;
    	let li12;
    	let t39;
    	let br3;
    	let span3;
    	let t40;
    	let br4;
    	let t41;
    	let br5;
    	let t42;
    	let br6;
    	let t43;
    	let br7;
    	let t44;
    	let br8;
    	let t45;
    	let t46;
    	let li13;
    	let t48;
    	let div9;
    	let div8;
    	let t50;
    	let ul4;
    	let li14;
    	let t52;
    	let li15;
    	let t54;
    	let div11;
    	let div10;
    	let t56;
    	let ul5;
    	let li16;
    	let t58;
    	let li17;
    	let t60;
    	let li18;
    	let t62;
    	let div13;
    	let div12;
    	let t64;
    	let ul6;
    	let li19;
    	let t66;
    	let li20;
    	let t67;
    	let br9;
    	let span4;
    	let t68;
    	let br10;
    	let t69;
    	let br11;
    	let t70;
    	let br12;
    	let t71;
    	let br13;
    	let t72;
    	let br14;
    	let t73;
    	let br15;
    	let t74;
    	let br16;
    	let t75;
    	let t76;
    	let div15;
    	let div14;
    	let t78;
    	let ul7;
    	let li21;
    	let t79;
    	let br17;
    	let span5;
    	let t80;
    	let br18;
    	let t81;
    	let t82;
    	let div17;
    	let div16;
    	let t84;
    	let p1;
    	let t86;
    	let div19;
    	let div18;
    	let t88;
    	let p2;
    	let t90;
    	let div21;
    	let div20;
    	let t92;
    	let ul8;
    	let li22;
    	let t94;
    	let li23;
    	let t96;
    	let li24;
    	let t98;
    	let li25;
    	let t100;
    	let div23;
    	let div22;
    	let t102;
    	let p3;
    	let t104;
    	let div25;
    	let div24;
    	let t106;
    	let p4;
    	let t108;
    	let div27;
    	let div26;
    	let t110;
    	let p5;
    	let t112;
    	let div29;
    	let div28;
    	let t114;
    	let p6;
    	let t116;
    	let div31;
    	let div30;
    	let t118;
    	let p7;
    	let t120;
    	let div33;
    	let div32;
    	let t122;
    	let ul9;
    	let li26;
    	let t124;
    	let li27;
    	let t126;
    	let li28;
    	let t128;
    	let li29;
    	let t130;
    	let li30;
    	let t132;
    	let li31;
    	let t134;
    	let li32;
    	let t136;
    	let li33;

    	const block = {
    		c: function create() {
    			div34 = element("div");
    			p0 = element("p");
    			t0 = text("This agreement applies as between you, the User of this website and ESi\r\n    holding Ltd trading as esi.one of Tallinn Estonia, ");
    			a = element("a");
    			a.textContent = "www.esi.one";
    			t2 = text(" (hereinafter \"ESi.one\" or \"we\"), the operator(s) of this website. Your agreement\r\n    to comply with and be bound by these terms and conditions is deemed to occur\r\n    upon your first use of the website. If you do not agree to be bound by these\r\n    terms and conditions, you should stop using the website immediately.");
    			t3 = space();
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Acceptance";
    			t5 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			t6 = text("Please read these Terms and Conditions, our privacy policy, and all\r\n        applicable supplemental terms (collectively, the \"terms\") carefully, as\r\n        they contain terms and conditions that impact your rights, obligations\r\n        and remedies in connection with your use of the website and content. For\r\n        example, the terms include:");
    			br0 = element("br");
    			span0 = element("span");
    			t7 = text("- your obligation to comply with all applicable laws and regulations.");
    			br1 = element("br");
    			span1 = element("span");
    			t8 = text("- limitations of our liability to you; a");
    			br2 = element("br");
    			span2 = element("span");
    			span2.textContent = "- a requirement that you pursue claims or seek relief against us on\r\n          an individual basis, rather than as a participant in any class or\r\n          representative action or proceeding.";
    			t10 = space();
    			li1 = element("li");
    			li1.textContent = "Your access to and use of the website is conditioned on your acceptance\r\n        of and compliance with all applicable terms.";
    			t12 = space();
    			li2 = element("li");
    			li2.textContent = "We reserve the right to change these terms at any time.";
    			t14 = space();
    			li3 = element("li");
    			li3.textContent = "By accessing, browsing and/or using the website after updates to these\r\n        terms have been posted, you agree to be bound by the updated terms.";
    			t16 = space();
    			li4 = element("li");
    			li4.textContent = "Your failure to comply with the Terms may result in the suspension or\r\n        termination of your access to the Services and may subject you to civil\r\n        and criminal penalties.";
    			t18 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div2.textContent = "General Conditions";
    			t20 = space();
    			ul1 = element("ul");
    			li5 = element("li");
    			li5.textContent = "We do not guarantee the accuracy, completeness, validity, or timeliness\r\n        of information listed by us.";
    			t22 = space();
    			li6 = element("li");
    			li6.textContent = "Your access to and use of the website is conditioned on your acceptance\r\n        of and compliance with all applicable terms.";
    			t24 = space();
    			li7 = element("li");
    			li7.textContent = "We make material changes to these terms and conditions from time to\r\n        time, we may notify you either by prominently posting a notice of such\r\n        changes or via email communication.";
    			t26 = space();
    			li8 = element("li");
    			li8.textContent = "The website is licensed to you on a limited, non-exclusive,\r\n        non-transferable, non-sublicensable basis, solely to be used in\r\n        connection with the Service for your private, personal, non-commercial\r\n        use, subject to all the terms and conditions of this Agreement as they\r\n        apply to the Service.";
    			t28 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div4.textContent = "License to use website";
    			t30 = space();
    			ul2 = element("ul");
    			li9 = element("li");
    			li9.textContent = "We may provide you with certain information because of your use of the\r\n        website. Such information may include but is not limited to,\r\n        documentation, data, or information developed by us, and other materials\r\n        which may assist in your use of the website (\"Our Materials\").";
    			t32 = space();
    			li10 = element("li");
    			li10.textContent = "Subject to this Agreement, we grant you a non-exclusive, limited,\r\n        non-transferable, and revocable license to use Our Materials solely in\r\n        connection with your use of the website. Our Materials may not be used\r\n        for any other purpose, and this license terminates upon your cessation\r\n        of use of the website or at the termination of this Agreement.";
    			t34 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div6.textContent = "User Content";
    			t36 = space();
    			ul3 = element("ul");
    			li11 = element("li");
    			li11.textContent = "The website permits you to share and submit content etc. but you are\r\n        solely responsible for the content provided by you.";
    			t38 = space();
    			li12 = element("li");
    			t39 = text("When sharing and submitting content to the website, please do not share\r\n        and submit content that:");
    			br3 = element("br");
    			span3 = element("span");
    			t40 = text("- contains ill-mannered, profane, abusive, racist, or hateful\r\n          language or expressions, text, photographs, or illustrations that are\r\n          pornographic or in poor taste, inflammatory attacks of a personal,\r\n          racial, or religious nature.");
    			br4 = element("br");
    			t41 = text("- is defamatory, threatening,\r\n          disparaging, grossly inflammatory, false, misleading, fraudulent,\r\n          inaccurate, unfair, contains exaggeration or unsubstantiated claims.");
    			br5 = element("br");
    			t42 = text("- violates the privacy rights of any third party, is unreasonably\r\n          harmful or offensive to any individual or community.");
    			br6 = element("br");
    			t43 = text("-\r\n          discriminates on the grounds of race, religion, national origin,\r\n          gender, age, marital status, sexual orientation, or disability, or\r\n          refers to such matters in any manner prohibited by law.");
    			br7 = element("br");
    			t44 = text("-\r\n          violates or inappropriately encourages the violation of any municipal,\r\n          state, federal, or international law, rule, regulation, or ordinance.");
    			br8 = element("br");
    			t45 = text("- sends repeated messages and/or makes derogatory or offensive\r\n          comments about another individual or repeats the same message under\r\n          multiple emails or subjects.");
    			t46 = space();
    			li13 = element("li");
    			li13.textContent = "Any submitted content that includes, but is not limited to the\r\n        following, will be refused. If repeated violations occur, we reserve the\r\n        right to cancel user access to the website without advanced notice.";
    			t48 = space();
    			div9 = element("div");
    			div8 = element("div");
    			div8.textContent = "Intellectual Property";
    			t50 = space();
    			ul4 = element("ul");
    			li14 = element("li");
    			li14.textContent = "You agree that the website and all Services provided by us are the\r\n        property of ESi.one, including all copyrights, trademarks, trade\r\n        secrets, patents, and other intellectual property (\"Our IP\"). You agree\r\n        that we own all rights, title, and interest in and to the Our IP and\r\n        that you will not use Our IP for any unlawful or infringing purpose. You\r\n        agree not to reproduce or distribute Our IP in any way, including\r\n        electronically or via registration of any new trademarks, trade names,\r\n        service marks, or Uniform Resource Locators (URLs), without express\r\n        written permission from us.";
    			t52 = space();
    			li15 = element("li");
    			li15.textContent = "To make the website and services available to you, you hereby grant us a\r\n        royalty-free, non-exclusive, worldwide license to copy, display, use,\r\n        broadcast, transmit and make derivative works of any content you\r\n        publish, upload, or otherwise make available to the website. We claim no\r\n        further proprietary rights in your Content.";
    			t54 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div10.textContent = "User Obligations";
    			t56 = space();
    			ul5 = element("ul");
    			li16 = element("li");
    			li16.textContent = "As a user of the website or Services, you may be asked to supply\r\n        identifying information to us.";
    			t58 = space();
    			li17 = element("li");
    			li17.textContent = "You may also provide personal information, including, but not limited\r\n        to, your name.";
    			t60 = space();
    			li18 = element("li");
    			li18.textContent = "You are responsible for ensuring the accuracy of this information. You\r\n        must not share such identifying information with any third party, and if\r\n        you discover that your identifying information has been compromised, you\r\n        agree to notify us immediately in writing. An email notification will\r\n        suffice. You are responsible for maintaining the safety and security of\r\n        your identifying information as well as keeping us apprised of any\r\n        changes to your identifying information. Providing false or inaccurate\r\n        information or using the website or Services to further fraud or\r\n        unlawful activity is grounds for immediate termination of this\r\n        Agreement.";
    			t62 = space();
    			div13 = element("div");
    			div12 = element("div");
    			div12.textContent = "Acceptable Use";
    			t64 = space();
    			ul6 = element("ul");
    			li19 = element("li");
    			li19.textContent = "You agree not to use the website or Services for any unlawful purpose,\r\n        or any purpose prohibited under this clause. You agree not to use the\r\n        website or Services in any way that could damage the website, Services,\r\n        or general business of ESi.one.";
    			t66 = space();
    			li20 = element("li");
    			t67 = text("You further agree not to use the website or Services:");
    			br9 = element("br");
    			span4 = element("span");
    			t68 = text("- To harass, abuse, or threaten others or otherwise violate any\r\n          person's legal rights.");
    			br10 = element("br");
    			t69 = text("- To violate any of our intellectual\r\n          property rights or any third party.");
    			br11 = element("br");
    			t70 = text("-To upload or otherwise\r\n          disseminate any computer viruses or other software that may damage the\r\n          property of another.");
    			br12 = element("br");
    			t71 = text("-To perpetrate any fraud.");
    			br13 = element("br");
    			t72 = text("-To publish\r\n          or distribute any obscene or defamatory material.");
    			br14 = element("br");
    			t73 = text("-To publish or\r\n          distribute any material that incites violence, hate, or discrimination\r\n          towards any group.");
    			br15 = element("br");
    			t74 = text("-To unlawfully gather information about\r\n          others.");
    			br16 = element("br");
    			t75 = text("-You are strictly prohibited from using the website or\r\n          any of our Services for illegal spam activities, including gathering\r\n          email addresses and personal information from others or sending any\r\n          mass commercial emails.");
    			t76 = space();
    			div15 = element("div");
    			div14 = element("div");
    			div14.textContent = "Reverse engineering and security";
    			t78 = space();
    			ul7 = element("ul");
    			li21 = element("li");
    			t79 = text("You agree not to undertake any of the following actions:");
    			br17 = element("br");
    			span5 = element("span");
    			t80 = text("- Reverse engineer or attempt to reverse engineer or disassemble any\r\n          code or software from or on the website or Services.");
    			br18 = element("br");
    			t81 = text("-Violate the\r\n          security of the website or Services through any unauthorized access,\r\n          circumvention of encryption or other security tools, data mining, or\r\n          interference to any host, user, or network.");
    			t82 = space();
    			div17 = element("div");
    			div16 = element("div");
    			div16.textContent = "Indemnification";
    			t84 = space();
    			p1 = element("p");
    			p1.textContent = "The website is provided for communication purposes only. You acknowledge\r\n      and agree that any information posted on our website is not intended to be\r\n      legal advice, financial advice, and no fiduciary relationship has been\r\n      created between you and us. You further agree that your purchase of any of\r\n      the website on the website is at your own risk. We do not assume\r\n      responsibility or liability for any advice or other information given on\r\n      the website.";
    			t86 = space();
    			div19 = element("div");
    			div18 = element("div");
    			div18.textContent = "Assumption of Risk";
    			t88 = space();
    			p2 = element("p");
    			p2.textContent = "You agree to defend and indemnify us and any of our affiliates (if\r\n      applicable) and hold us harmless against any legal claims and demands,\r\n      including reasonable legal fees, which may arise from or relate to your\r\n      use or misuse of the website or Services, your breach of this Agreement,\r\n      or your conduct or actions. You agree that we shall be able to select its\r\n      legal counsel and may participate in its defence if we wish.";
    			t90 = space();
    			div21 = element("div");
    			div20 = element("div");
    			div20.textContent = "Exclusion of liability";
    			t92 = space();
    			ul8 = element("ul");
    			li22 = element("li");
    			li22.textContent = "You understand and agree that we (A) do not guarantee the accuracy,\r\n        completeness, validity, or timeliness of information listed by us or any\r\n        third parties; and (B) shall not be responsible for any materials posted\r\n        by us or any third party. You shall use your judgment, caution, and\r\n        common sense in evaluating any prospective methods or offers and any\r\n        information provided by us or any third party.";
    			t94 = space();
    			li23 = element("li");
    			li23.textContent = "Further, we shall not be liable for direct, indirect consequential, or\r\n        any other form of loss or damage that may be suffered by a user using\r\n        the ESi.one website including loss of data or information or any kind of\r\n        financial or physical loss or damage.";
    			t96 = space();
    			li24 = element("li");
    			li24.textContent = "In no event shall ESi.one, nor its Owner, directors, employees,\r\n        partners, agents, suppliers, or affiliates, be accountable for any\r\n        indirect, incidental, special, eventful, or exemplary costs, including\r\n        without limitation, loss of proceeds, figures, usage, goodwill, or other\r\n        intangible losses, consequential from (i) your use or access of or\r\n        failure to access or use the Service; (ii) any conduct or content of any\r\n        third party on the Service; (iii) any content attained from the Service;\r\n        and (iv) unlawful access, use or alteration of your transmissions or\r\n        content, whether or not based on guarantee, agreement, domestic wrong\r\n        (including carelessness) or any other lawful concept, whether or not\r\n        we've been aware of the possibility of such damage, and even if a cure\r\n        set forth herein is originated to have futile of its important purpose.";
    			t98 = space();
    			li25 = element("li");
    			li25.textContent = "We are not liable for any damages that may occur to you because of your\r\n        use of the website or Services, to the fullest extent permitted by law.\r\n        This section applies to any claims by you, including, but not limited\r\n        to, lost profits or revenues, consequential or punitive damages,\r\n        negligence, strict liability, fraud, or torts of any kind.";
    			t100 = space();
    			div23 = element("div");
    			div22 = element("div");
    			div22.textContent = "Third-party links and content";
    			t102 = space();
    			p3 = element("p");
    			p3.textContent = "We may occasionally post links to third-party websites or other websites.\r\n      You agree that we are not responsible for any loss or damage caused\r\n      because of your use of any third-party website linked to or from Our\r\n      website.";
    			t104 = space();
    			div25 = element("div");
    			div24 = element("div");
    			div24.textContent = "Modification and variation";
    			t106 = space();
    			p4 = element("p");
    			p4.textContent = "We may, from time to time and at any time without notice to you, modify\r\n      this Agreement. You agree that we have the right to modify this Agreement\r\n      or revise anything contained herein. You further agree that all\r\n      modifications to this Agreement are in full force and effect immediately\r\n      upon posting on the website and that modifications or variations will\r\n      replace any prior version of this Agreement unless prior versions are\r\n      specifically referred to or incorporated into the latest modification or\r\n      variation of this Agreement.";
    			t108 = space();
    			div27 = element("div");
    			div26 = element("div");
    			div26.textContent = "Service interruptions";
    			t110 = space();
    			p5 = element("p");
    			p5.textContent = "We may need to interrupt your access to the website to perform maintenance\r\n      or emergency website on a scheduled or unscheduled basis. You agree that\r\n      your access to the website may be affected by unanticipated or unscheduled\r\n      downtime, for any reason, but that we shall have no liability for any\r\n      damage or loss caused because of such downtime.";
    			t112 = space();
    			div29 = element("div");
    			div28 = element("div");
    			div28.textContent = "Term, Termination and Suspension";
    			t114 = space();
    			p6 = element("p");
    			p6.textContent = "We may terminate this Agreement with you at any time for any reason, with\r\n      or without cause. We specifically reserve the right to terminate this\r\n      Agreement if you violate any of the terms outlined herein, including, but\r\n      not limited to, violating the intellectual property rights of us or a\r\n      third party, failing to comply with applicable laws or other legal\r\n      obligations, and/or publishing or distributing illegal material. At the\r\n      termination of this Agreement, any provisions that would be expected to\r\n      survive termination by their nature shall remain in full force and effect.";
    			t116 = space();
    			div31 = element("div");
    			div30 = element("div");
    			div30.textContent = "No Warranties";
    			t118 = space();
    			p7 = element("p");
    			p7.textContent = "You agree that your use of the website and Services is at your sole and\r\n      exclusive risk and that any Services provided by us are on an \"As Is\"\r\n      basis. We hereby expressly disclaim any express or implied warranties of\r\n      any kind, including, but not limited to the implied warranty of fitness\r\n      for a particular purpose and the implied warranty of merchantability. We\r\n      make no warranties that the website or Services will meet your needs or\r\n      that the website or Services will be uninterrupted, error-free, or secure.\r\n      We also make no warranties as to the reliability or accuracy of any\r\n      information on the website or obtained through the Services. You agree\r\n      that any damage that may occur to you, through your computer system, or\r\n      because of the loss of your data from your use of the website or Services\r\n      is your sole responsibility and that we are not liable for any such damage\r\n      or loss.";
    			t120 = space();
    			div33 = element("div");
    			div32 = element("div");
    			div32.textContent = "General Provisions";
    			t122 = space();
    			ul9 = element("ul");
    			li26 = element("li");
    			li26.textContent = "You understand and agree that we (A) do not guarantee the accuracy,\r\n        completeness, validity, or timeliness of information listed by us or any\r\n        third parties; and (B) shall not be responsible for any materials posted\r\n        by us or any third party. You shall use your judgment, caution, and\r\n        common sense in evaluating any prospective methods or offers and any\r\n        information provided by us or any third party.";
    			t124 = space();
    			li27 = element("li");
    			li27.textContent = "Further, we shall not be liable for direct, indirect consequential, or\r\n        any other form of loss or damage that may be suffered by a user using\r\n        the ESi.one website including loss of data or information or any kind of\r\n        financial or physical loss or damage.";
    			t126 = space();
    			li28 = element("li");
    			li28.textContent = "If any part or sub-part of this Agreement is held invalid or\r\n        unenforceable by a court of law or competent arbitrator, the remaining\r\n        parts and sub-parts will be enforced to the maximum extent possible. In\r\n        such a condition, the remainder of this Agreement shall continue in full\r\n        force.";
    			t128 = space();
    			li29 = element("li");
    			li29.textContent = "If we fail to enforce any provision of this Agreement, this shall not\r\n        constitute a waiver of any future enforcement of that provision or any\r\n        other provision. Waiver of any part or sub-part of this Agreement will\r\n        not constitute a waiver of any other part or sub-part.";
    			t130 = space();
    			li30 = element("li");
    			li30.textContent = "Headings of parts and sub-parts under this Agreement are for convenience\r\n        and organization, only. Headings shall not affect the meaning of any\r\n        provisions of this Agreement.";
    			t132 = space();
    			li31 = element("li");
    			li31.textContent = "No agency, partnership, or joint venture has been created between the\r\n        Parties because of this Agreement. No Party has any authority to bind\r\n        the other to third parties.";
    			t134 = space();
    			li32 = element("li");
    			li32.textContent = "We are not liable for any failure to perform due to causes beyond its\r\n        reasonable control including, but not limited to, acts of God, acts of\r\n        civil authorities, acts of military authorities, riots, embargoes, acts\r\n        of nature, and natural disasters, and other acts which may be due to\r\n        unforeseen circumstances.";
    			t136 = space();
    			li33 = element("li");
    			li33.textContent = "The terms herein will be governed by and construed by the laws of\r\n        Estonia without giving effect to any principles of conflicts of law. The\r\n        Courts of Estonia shall have exclusive jurisdiction over any dispute\r\n        arising from the use of the website.";
    			attr_dev(a, "href", "/home");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$B, 3, 55, 171);
    			attr_dev(p0, "class", "svelte-1m3e1qp");
    			add_location(p0, file$B, 1, 2, 34);
    			attr_dev(div0, "class", "legal__row__head");
    			add_location(div0, file$B, 12, 4, 599);
    			add_location(br0, file$B, 19, 35, 1036);
    			add_location(br1, file$B, 20, 80, 1149);
    			attr_dev(span0, "class", "legal__span");
    			add_location(span0, file$B, 19, 41, 1042);
    			add_location(br2, file$B, 23, 51, 1261);
    			attr_dev(span1, "class", "legal__span");
    			add_location(span1, file$B, 22, 9, 1183);
    			attr_dev(span2, "class", "legal__span");
    			add_location(span2, file$B, 24, 9, 1284);
    			add_location(li0, file$B, 14, 6, 675);
    			add_location(li1, file$B, 30, 6, 1552);
    			add_location(li2, file$B, 34, 6, 1712);
    			add_location(li3, file$B, 35, 6, 1784);
    			add_location(li4, file$B, 39, 6, 1966);
    			attr_dev(ul0, "role", "list");
    			add_location(ul0, file$B, 13, 4, 651);
    			attr_dev(div1, "class", "legal__row");
    			add_location(div1, file$B, 11, 2, 569);
    			attr_dev(div2, "class", "legal__row__head");
    			add_location(div2, file$B, 47, 4, 2231);
    			add_location(li5, file$B, 49, 6, 2315);
    			add_location(li6, file$B, 53, 6, 2459);
    			add_location(li7, file$B, 57, 6, 2619);
    			add_location(li8, file$B, 62, 6, 2846);
    			attr_dev(ul1, "role", "list");
    			add_location(ul1, file$B, 48, 4, 2291);
    			attr_dev(div3, "class", "legal__row");
    			add_location(div3, file$B, 46, 2, 2201);
    			attr_dev(div4, "class", "legal__row__head");
    			add_location(div4, file$B, 72, 4, 3251);
    			add_location(li9, file$B, 74, 6, 3339);
    			add_location(li10, file$B, 80, 6, 3668);
    			attr_dev(ul2, "role", "list");
    			add_location(ul2, file$B, 73, 4, 3315);
    			attr_dev(div5, "class", "legal__row");
    			add_location(div5, file$B, 71, 2, 3221);
    			attr_dev(div6, "class", "legal__row__head");
    			add_location(div6, file$B, 90, 4, 4127);
    			add_location(li11, file$B, 92, 6, 4205);
    			add_location(br3, file$B, 98, 32, 4488);
    			add_location(br4, file$B, 102, 38, 4792);
    			add_location(br5, file$B, 104, 78, 4984);
    			add_location(br6, file$B, 106, 62, 5130);
    			add_location(br7, file$B, 109, 65, 5358);
    			add_location(br8, file$B, 111, 79, 5528);
    			attr_dev(span3, "class", "legal__span");
    			add_location(span3, file$B, 98, 38, 4494);
    			add_location(li12, file$B, 96, 6, 4369);
    			add_location(li13, file$B, 117, 6, 5764);
    			attr_dev(ul3, "role", "list");
    			add_location(ul3, file$B, 91, 4, 4181);
    			attr_dev(div7, "class", "legal__row");
    			add_location(div7, file$B, 89, 2, 4097);
    			attr_dev(div8, "class", "legal__row__head");
    			add_location(div8, file$B, 125, 4, 6067);
    			add_location(li14, file$B, 127, 6, 6154);
    			add_location(li15, file$B, 138, 6, 6839);
    			attr_dev(ul4, "role", "list");
    			add_location(ul4, file$B, 126, 4, 6130);
    			attr_dev(div9, "class", "legal__row");
    			add_location(div9, file$B, 124, 2, 6037);
    			attr_dev(div10, "class", "legal__row__head");
    			add_location(div10, file$B, 148, 4, 7281);
    			add_location(li16, file$B, 150, 6, 7363);
    			add_location(li17, file$B, 154, 6, 7502);
    			add_location(li18, file$B, 158, 6, 7630);
    			attr_dev(ul5, "role", "list");
    			add_location(ul5, file$B, 149, 4, 7339);
    			attr_dev(div11, "class", "legal__row");
    			add_location(div11, file$B, 147, 2, 7251);
    			attr_dev(div12, "class", "legal__row__head");
    			add_location(div12, file$B, 173, 4, 8428);
    			add_location(li19, file$B, 175, 6, 8508);
    			add_location(br9, file$B, 182, 61, 8881);
    			add_location(br10, file$B, 185, 32, 9033);
    			add_location(br11, file$B, 186, 45, 9122);
    			add_location(br12, file$B, 188, 30, 9265);
    			add_location(br13, file$B, 188, 61, 9296);
    			add_location(br14, file$B, 189, 59, 9374);
    			add_location(br15, file$B, 191, 28, 9506);
    			add_location(br16, file$B, 192, 17, 9570);
    			attr_dev(span4, "class", "legal__span");
    			add_location(span4, file$B, 182, 67, 8887);
    			add_location(li20, file$B, 181, 6, 8814);
    			attr_dev(ul6, "role", "list");
    			add_location(ul6, file$B, 174, 4, 8484);
    			attr_dev(div13, "class", "legal__row");
    			add_location(div13, file$B, 172, 2, 8398);
    			attr_dev(div14, "class", "legal__row__head");
    			add_location(div14, file$B, 201, 4, 9909);
    			add_location(br17, file$B, 204, 64, 10077);
    			add_location(br18, file$B, 207, 62, 10264);
    			attr_dev(span5, "class", "legal__span");
    			add_location(span5, file$B, 204, 70, 10083);
    			add_location(li21, file$B, 203, 6, 10007);
    			attr_dev(ul7, "role", "list");
    			add_location(ul7, file$B, 202, 4, 9983);
    			attr_dev(div15, "class", "legal__row");
    			add_location(div15, file$B, 200, 2, 9879);
    			attr_dev(div16, "class", "legal__row__head");
    			add_location(div16, file$B, 216, 4, 10582);
    			attr_dev(p1, "class", "svelte-1m3e1qp");
    			add_location(p1, file$B, 217, 4, 10639);
    			attr_dev(div17, "class", "legal__row");
    			add_location(div17, file$B, 215, 2, 10552);
    			attr_dev(div18, "class", "legal__row__head");
    			add_location(div18, file$B, 228, 4, 11190);
    			attr_dev(p2, "class", "svelte-1m3e1qp");
    			add_location(p2, file$B, 229, 4, 11250);
    			attr_dev(div19, "class", "legal__row");
    			add_location(div19, file$B, 227, 2, 11160);
    			attr_dev(div20, "class", "legal__row__head");
    			add_location(div20, file$B, 239, 4, 11767);
    			add_location(li22, file$B, 241, 6, 11855);
    			add_location(li23, file$B, 249, 6, 12332);
    			add_location(li24, file$B, 255, 6, 12645);
    			add_location(li25, file$B, 269, 6, 13617);
    			attr_dev(ul8, "role", "list");
    			add_location(ul8, file$B, 240, 4, 11831);
    			attr_dev(div21, "class", "legal__row");
    			add_location(div21, file$B, 238, 2, 11737);
    			attr_dev(div22, "class", "legal__row__head");
    			add_location(div22, file$B, 279, 4, 14072);
    			attr_dev(p3, "class", "svelte-1m3e1qp");
    			add_location(p3, file$B, 280, 4, 14143);
    			attr_dev(div23, "class", "legal__row");
    			add_location(div23, file$B, 278, 2, 14042);
    			attr_dev(div24, "class", "legal__row__head");
    			add_location(div24, file$B, 288, 4, 14448);
    			attr_dev(p4, "class", "svelte-1m3e1qp");
    			add_location(p4, file$B, 289, 4, 14516);
    			attr_dev(div25, "class", "legal__row");
    			add_location(div25, file$B, 287, 2, 14418);
    			attr_dev(div26, "class", "legal__row__head");
    			add_location(div26, file$B, 301, 4, 15154);
    			attr_dev(p5, "class", "svelte-1m3e1qp");
    			add_location(p5, file$B, 302, 4, 15217);
    			attr_dev(div27, "class", "legal__row");
    			add_location(div27, file$B, 300, 2, 15124);
    			attr_dev(div28, "class", "legal__row__head");
    			add_location(div28, file$B, 311, 4, 15650);
    			attr_dev(p6, "class", "svelte-1m3e1qp");
    			add_location(p6, file$B, 312, 4, 15724);
    			attr_dev(div29, "class", "legal__row");
    			add_location(div29, file$B, 310, 2, 15620);
    			attr_dev(div30, "class", "legal__row__head");
    			add_location(div30, file$B, 324, 4, 16411);
    			attr_dev(p7, "class", "svelte-1m3e1qp");
    			add_location(p7, file$B, 325, 4, 16466);
    			attr_dev(div31, "class", "legal__row");
    			add_location(div31, file$B, 323, 2, 16381);
    			attr_dev(div32, "class", "legal__row__head");
    			add_location(div32, file$B, 342, 4, 17490);
    			add_location(li26, file$B, 344, 6, 17574);
    			add_location(li27, file$B, 352, 6, 18051);
    			add_location(li28, file$B, 358, 6, 18364);
    			add_location(li29, file$B, 365, 6, 18718);
    			add_location(li30, file$B, 371, 6, 19046);
    			add_location(li31, file$B, 376, 6, 19270);
    			add_location(li32, file$B, 381, 6, 19490);
    			add_location(li33, file$B, 388, 6, 19868);
    			attr_dev(ul9, "role", "list");
    			add_location(ul9, file$B, 343, 4, 17550);
    			attr_dev(div33, "class", "legal__row");
    			add_location(div33, file$B, 341, 2, 17460);
    			attr_dev(div34, "class", "info__item__text");
    			add_location(div34, file$B, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div34, anchor);
    			append_dev(div34, p0);
    			append_dev(p0, t0);
    			append_dev(p0, a);
    			append_dev(p0, t2);
    			append_dev(div34, t3);
    			append_dev(div34, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t5);
    			append_dev(div1, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, t6);
    			append_dev(li0, br0);
    			append_dev(li0, span0);
    			append_dev(span0, t7);
    			append_dev(span0, br1);
    			append_dev(li0, span1);
    			append_dev(span1, t8);
    			append_dev(span1, br2);
    			append_dev(li0, span2);
    			append_dev(ul0, t10);
    			append_dev(ul0, li1);
    			append_dev(ul0, t12);
    			append_dev(ul0, li2);
    			append_dev(ul0, t14);
    			append_dev(ul0, li3);
    			append_dev(ul0, t16);
    			append_dev(ul0, li4);
    			append_dev(div34, t18);
    			append_dev(div34, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t20);
    			append_dev(div3, ul1);
    			append_dev(ul1, li5);
    			append_dev(ul1, t22);
    			append_dev(ul1, li6);
    			append_dev(ul1, t24);
    			append_dev(ul1, li7);
    			append_dev(ul1, t26);
    			append_dev(ul1, li8);
    			append_dev(div34, t28);
    			append_dev(div34, div5);
    			append_dev(div5, div4);
    			append_dev(div5, t30);
    			append_dev(div5, ul2);
    			append_dev(ul2, li9);
    			append_dev(ul2, t32);
    			append_dev(ul2, li10);
    			append_dev(div34, t34);
    			append_dev(div34, div7);
    			append_dev(div7, div6);
    			append_dev(div7, t36);
    			append_dev(div7, ul3);
    			append_dev(ul3, li11);
    			append_dev(ul3, t38);
    			append_dev(ul3, li12);
    			append_dev(li12, t39);
    			append_dev(li12, br3);
    			append_dev(li12, span3);
    			append_dev(span3, t40);
    			append_dev(span3, br4);
    			append_dev(span3, t41);
    			append_dev(span3, br5);
    			append_dev(span3, t42);
    			append_dev(span3, br6);
    			append_dev(span3, t43);
    			append_dev(span3, br7);
    			append_dev(span3, t44);
    			append_dev(span3, br8);
    			append_dev(span3, t45);
    			append_dev(ul3, t46);
    			append_dev(ul3, li13);
    			append_dev(div34, t48);
    			append_dev(div34, div9);
    			append_dev(div9, div8);
    			append_dev(div9, t50);
    			append_dev(div9, ul4);
    			append_dev(ul4, li14);
    			append_dev(ul4, t52);
    			append_dev(ul4, li15);
    			append_dev(div34, t54);
    			append_dev(div34, div11);
    			append_dev(div11, div10);
    			append_dev(div11, t56);
    			append_dev(div11, ul5);
    			append_dev(ul5, li16);
    			append_dev(ul5, t58);
    			append_dev(ul5, li17);
    			append_dev(ul5, t60);
    			append_dev(ul5, li18);
    			append_dev(div34, t62);
    			append_dev(div34, div13);
    			append_dev(div13, div12);
    			append_dev(div13, t64);
    			append_dev(div13, ul6);
    			append_dev(ul6, li19);
    			append_dev(ul6, t66);
    			append_dev(ul6, li20);
    			append_dev(li20, t67);
    			append_dev(li20, br9);
    			append_dev(li20, span4);
    			append_dev(span4, t68);
    			append_dev(span4, br10);
    			append_dev(span4, t69);
    			append_dev(span4, br11);
    			append_dev(span4, t70);
    			append_dev(span4, br12);
    			append_dev(span4, t71);
    			append_dev(span4, br13);
    			append_dev(span4, t72);
    			append_dev(span4, br14);
    			append_dev(span4, t73);
    			append_dev(span4, br15);
    			append_dev(span4, t74);
    			append_dev(span4, br16);
    			append_dev(span4, t75);
    			append_dev(div34, t76);
    			append_dev(div34, div15);
    			append_dev(div15, div14);
    			append_dev(div15, t78);
    			append_dev(div15, ul7);
    			append_dev(ul7, li21);
    			append_dev(li21, t79);
    			append_dev(li21, br17);
    			append_dev(li21, span5);
    			append_dev(span5, t80);
    			append_dev(span5, br18);
    			append_dev(span5, t81);
    			append_dev(div34, t82);
    			append_dev(div34, div17);
    			append_dev(div17, div16);
    			append_dev(div17, t84);
    			append_dev(div17, p1);
    			append_dev(div34, t86);
    			append_dev(div34, div19);
    			append_dev(div19, div18);
    			append_dev(div19, t88);
    			append_dev(div19, p2);
    			append_dev(div34, t90);
    			append_dev(div34, div21);
    			append_dev(div21, div20);
    			append_dev(div21, t92);
    			append_dev(div21, ul8);
    			append_dev(ul8, li22);
    			append_dev(ul8, t94);
    			append_dev(ul8, li23);
    			append_dev(ul8, t96);
    			append_dev(ul8, li24);
    			append_dev(ul8, t98);
    			append_dev(ul8, li25);
    			append_dev(div34, t100);
    			append_dev(div34, div23);
    			append_dev(div23, div22);
    			append_dev(div23, t102);
    			append_dev(div23, p3);
    			append_dev(div34, t104);
    			append_dev(div34, div25);
    			append_dev(div25, div24);
    			append_dev(div25, t106);
    			append_dev(div25, p4);
    			append_dev(div34, t108);
    			append_dev(div34, div27);
    			append_dev(div27, div26);
    			append_dev(div27, t110);
    			append_dev(div27, p5);
    			append_dev(div34, t112);
    			append_dev(div34, div29);
    			append_dev(div29, div28);
    			append_dev(div29, t114);
    			append_dev(div29, p6);
    			append_dev(div34, t116);
    			append_dev(div34, div31);
    			append_dev(div31, div30);
    			append_dev(div31, t118);
    			append_dev(div31, p7);
    			append_dev(div34, t120);
    			append_dev(div34, div33);
    			append_dev(div33, div32);
    			append_dev(div33, t122);
    			append_dev(div33, ul9);
    			append_dev(ul9, li26);
    			append_dev(ul9, t124);
    			append_dev(ul9, li27);
    			append_dev(ul9, t126);
    			append_dev(ul9, li28);
    			append_dev(ul9, t128);
    			append_dev(ul9, li29);
    			append_dev(ul9, t130);
    			append_dev(ul9, li30);
    			append_dev(ul9, t132);
    			append_dev(ul9, li31);
    			append_dev(ul9, t134);
    			append_dev(ul9, li32);
    			append_dev(ul9, t136);
    			append_dev(ul9, li33);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div34);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$F.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$F($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TermsAndCond', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TermsAndCond> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class TermsAndCond extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$F, create_fragment$F, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TermsAndCond",
    			options,
    			id: create_fragment$F.name
    		});
    	}
    }

    /* src\components\legal\content\Privacy.svelte generated by Svelte v3.48.0 */

    const file$A = "src\\components\\legal\\content\\Privacy.svelte";

    function create_fragment$E(ctx) {
    	let div34;
    	let p0;
    	let t0;
    	let a0;
    	let t2;
    	let t3;
    	let p1;
    	let t5;
    	let p2;
    	let t7;
    	let div1;
    	let div0;
    	let t9;
    	let p3;
    	let t11;
    	let ul0;
    	let li0;
    	let t13;
    	let li1;
    	let t15;
    	let li2;
    	let t17;
    	let li3;
    	let t19;
    	let li4;
    	let t21;
    	let div3;
    	let div2;
    	let t23;
    	let p4;
    	let t25;
    	let ul1;
    	let li5;
    	let t27;
    	let li6;
    	let t29;
    	let li7;
    	let t31;
    	let li8;
    	let t33;
    	let li9;
    	let t35;
    	let li10;
    	let t37;
    	let li11;
    	let t39;
    	let p5;
    	let t41;
    	let div5;
    	let div4;
    	let t43;
    	let p6;
    	let t45;
    	let div7;
    	let div6;
    	let t47;
    	let p7;
    	let t49;
    	let div9;
    	let div8;
    	let t51;
    	let p8;
    	let t53;
    	let p9;
    	let t55;
    	let p10;
    	let t57;
    	let div11;
    	let div10;
    	let t59;
    	let p11;
    	let t61;
    	let ul2;
    	let li12;
    	let t63;
    	let li13;
    	let t65;
    	let li14;
    	let t67;
    	let li15;
    	let t69;
    	let li16;
    	let t71;
    	let li17;
    	let t73;
    	let li18;
    	let t75;
    	let li19;
    	let t77;
    	let li20;
    	let t79;
    	let div13;
    	let div12;
    	let t81;
    	let p12;
    	let t83;
    	let ul3;
    	let li21;
    	let t85;
    	let li22;
    	let t87;
    	let li23;
    	let t89;
    	let li24;
    	let t91;
    	let p13;
    	let t93;
    	let div15;
    	let div14;
    	let t95;
    	let p14;
    	let t97;
    	let p15;
    	let t99;
    	let p16;
    	let t101;
    	let p17;
    	let t103;
    	let div17;
    	let div16;
    	let t105;
    	let p18;
    	let em0;
    	let br0;
    	let t107;
    	let t108;
    	let p19;
    	let em1;
    	let br1;
    	let t110;
    	let t111;
    	let p20;
    	let em2;
    	let br2;
    	let t113;
    	let t114;
    	let p21;
    	let em3;
    	let br3;
    	let t116;
    	let t117;
    	let p22;
    	let em4;
    	let br4;
    	let t119;
    	let t120;
    	let div19;
    	let div18;
    	let t122;
    	let p23;
    	let t124;
    	let div21;
    	let div20;
    	let t126;
    	let p24;
    	let t128;
    	let div23;
    	let div22;
    	let t130;
    	let p25;
    	let t132;
    	let div25;
    	let div24;
    	let t134;
    	let p26;
    	let t136;
    	let div27;
    	let div26;
    	let t138;
    	let p27;
    	let t140;
    	let div29;
    	let div28;
    	let t142;
    	let p28;
    	let t144;
    	let div31;
    	let div30;
    	let t146;
    	let p29;
    	let t148;
    	let div33;
    	let div32;
    	let t150;
    	let p30;
    	let t152;
    	let div59;
    	let p31;
    	let t153;
    	let a1;
    	let t155;
    	let t156;
    	let p32;
    	let t158;
    	let div36;
    	let div35;
    	let t160;
    	let p33;
    	let t162;
    	let div38;
    	let div37;
    	let t164;
    	let p34;
    	let t166;
    	let ul4;
    	let li25;
    	let t168;
    	let li26;
    	let t170;
    	let li27;
    	let t172;
    	let li28;
    	let t174;
    	let li29;
    	let t176;
    	let li30;
    	let t178;
    	let li31;
    	let t180;
    	let li32;
    	let t182;
    	let li33;
    	let t184;
    	let div40;
    	let div39;
    	let t186;
    	let p35;
    	let t188;
    	let p36;
    	let em5;
    	let t190;
    	let t191;
    	let p37;
    	let em6;
    	let t193;
    	let t194;
    	let div42;
    	let div41;
    	let t196;
    	let p38;
    	let t198;
    	let div44;
    	let div43;
    	let t200;
    	let p39;
    	let t201;
    	let a2;
    	let t203;
    	let t204;
    	let div46;
    	let div45;
    	let t206;
    	let p40;
    	let t208;
    	let p41;
    	let t210;
    	let p42;
    	let t212;
    	let div48;
    	let div47;
    	let t214;
    	let p43;
    	let t216;
    	let div50;
    	let div49;
    	let em7;
    	let t218;
    	let p44;
    	let t220;
    	let ul5;
    	let li34;
    	let t222;
    	let li35;
    	let t224;
    	let li36;
    	let t226;
    	let div52;
    	let div51;
    	let em8;
    	let t228;
    	let p45;
    	let t230;
    	let ul6;
    	let li37;
    	let t232;
    	let li38;
    	let t234;
    	let li39;
    	let t236;
    	let li40;
    	let t238;
    	let li41;
    	let t240;
    	let li42;
    	let t242;
    	let li43;
    	let t244;
    	let li44;
    	let t246;
    	let li45;
    	let t248;
    	let p46;
    	let t250;
    	let div54;
    	let div53;
    	let t252;
    	let p47;
    	let t254;
    	let div56;
    	let div55;
    	let t256;
    	let p48;
    	let t258;
    	let ul7;
    	let li46;
    	let t259;
    	let a3;
    	let t261;
    	let li47;
    	let t262;
    	let a4;
    	let t264;
    	let li48;
    	let t265;
    	let a5;
    	let t267;
    	let li49;
    	let t268;
    	let a6;
    	let t270;
    	let li50;
    	let t271;
    	let a7;
    	let t273;
    	let li51;
    	let t274;
    	let a8;
    	let t276;
    	let p49;
    	let t278;
    	let div58;
    	let div57;
    	let t280;
    	let p50;

    	const block = {
    		c: function create() {
    			div34 = element("div");
    			p0 = element("p");
    			t0 = text("ESi Holding LTD trading as Esi.one of Tallinn, Estonia, ");
    			a0 = element("a");
    			a0.textContent = "www.esi.one";
    			t2 = text(" (hereinafter \"ESI\" or \"we\") is committed to protecting and respecting your\r\n    privacy.");
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "This policy (together with our main Cookie Policy and any other documents\r\n    referred to in it) sets out the basis on which any personal data (as defined\r\n    in the General Data Protection Regulation (“GDPR”)) (the “Personal Data”) we\r\n    collect from account holders or individual users or visitors to our website,\r\n    or that is uploaded to our website, will be processed by us. Account\r\n    holders, users and visitors of our website or owners of Personal Data\r\n    collected by us (each, “you”) should read the following carefully to\r\n    understand our views and practices regarding your Personal Data and how we\r\n    will treat it.";
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "By providing any Personal Data to us, you consent to the collection, use,\r\n    disclosure and transfer of such Personal Data in the manner and for the\r\n    purposes set out below.";
    			t7 = space();
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Information We May Collect";
    			t9 = space();
    			p3 = element("p");
    			p3.textContent = "We may collect and process the following data which may contain Personal\r\n      Data:";
    			t11 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "information that you provide by filling in forms, including information\r\n        provided at the time of registering to use our website, subscribing to\r\n        any services provided by us, posting material, reporting a problem with\r\n        our website, or requesting further services;";
    			t13 = space();
    			li1 = element("li");
    			li1.textContent = "information, data, documents or images that you upload onto our website;";
    			t15 = space();
    			li2 = element("li");
    			li2.textContent = "details of transactions you carry out through our website;";
    			t17 = space();
    			li3 = element("li");
    			li3.textContent = "details of your visits to our website, resources that you access and\r\n        actions you are working on through the website;";
    			t19 = space();
    			li4 = element("li");
    			li4.textContent = "and if you contact us, a record of that correspondence.";
    			t21 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div2.textContent = "Log file during website visit";
    			t23 = space();
    			p4 = element("p");
    			p4.textContent = "Our website logs your website visit. In doing so, we process:";
    			t25 = space();
    			ul1 = element("ul");
    			li5 = element("li");
    			li5.textContent = "date and time of the access,";
    			t27 = space();
    			li6 = element("li");
    			li6.textContent = "the amount of data transferred,";
    			t29 = space();
    			li7 = element("li");
    			li7.textContent = "the browser type and version,";
    			t31 = space();
    			li8 = element("li");
    			li8.textContent = "the operating system you use,";
    			t33 = space();
    			li9 = element("li");
    			li9.textContent = "the referrer URL (the previously visited web site),";
    			t35 = space();
    			li10 = element("li");
    			li10.textContent = "your IP address,";
    			t37 = space();
    			li11 = element("li");
    			li11.textContent = "the requesting provider.";
    			t39 = space();
    			p5 = element("p");
    			p5.textContent = "The legal basis for data processing is my legitimate interest in the\r\n      ongoing provision and security of our website. The log file is deleted\r\n      after seven days, unless it is needed to prove or clarify specific legal\r\n      violations that have become known within the retention period.";
    			t41 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div4.textContent = "IP Addresses";
    			t43 = space();
    			p6 = element("p");
    			p6.textContent = "We may also collect and process information about your computer, including\r\n      where available your IP address, operating system and browser type, for\r\n      system administration and to report aggregate information to our business\r\n      partners. This is statistical data about our users’ browsing actions and\r\n      patterns and does not identify any individual.";
    			t45 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div6.textContent = "Cookies";
    			t47 = space();
    			p7 = element("p");
    			p7.textContent = "Please refer to our Cookie Policy for more information on how we use\r\n      cookies.";
    			t49 = space();
    			div9 = element("div");
    			div8 = element("div");
    			div8.textContent = "Where We Store Your Data";
    			t51 = space();
    			p8 = element("p");
    			p8.textContent = "The Personal Data that we collect may be transferred to, and stored at, a\r\n      destination outside Germany and the EEA. It may also be processed by staff\r\n      operating outside Germany and the EEA who work for us or for one of our\r\n      suppliers. Such staff maybe engaged in, among other things, the fulfilment\r\n      of your services ordered by you, the processing of your payment details\r\n      and the provision of support services. We will take all steps reasonably\r\n      necessary to ensure that your Personal Data is treated securely and in\r\n      accordance with this privacy policy.";
    			t53 = space();
    			p9 = element("p");
    			p9.textContent = "All information you provide to us is stored on our secure servers. Where\r\n      we have given you (or where you have chosen) a password which enables you\r\n      to access certain parts of our website, you are responsible for keeping\r\n      this password confidential. We ask you not to share the password with\r\n      anyone.";
    			t55 = space();
    			p10 = element("p");
    			p10.textContent = "Unfortunately, the transmission of information via the internet is not\r\n      completely secure. Although we will do our best to protect your Personal\r\n      Data, we cannot guarantee the security of your Personal Data transmitted\r\n      to our website; any transmission is at your own risk. Once we have\r\n      received your information, we will use strict procedures and security\r\n      features to try to prevent unauthorised access.";
    			t57 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div10.textContent = "Uses made of the information";
    			t59 = space();
    			p11 = element("p");
    			p11.textContent = "We use information held, including Personal Data, in the following manner:";
    			t61 = space();
    			ul2 = element("ul");
    			li12 = element("li");
    			li12.textContent = "to ensure that content from our website is presented in the most\r\n        effective manner for you and for your computer;";
    			t63 = space();
    			li13 = element("li");
    			li13.textContent = "to provide you with information or services that you request from us,\r\n        and to otherwise carry out our obligations arising from any contracts\r\n        entered into between you and us;";
    			t65 = space();
    			li14 = element("li");
    			li14.textContent = "to provide you with information, products or services which we feel may\r\n        interest you, where you have consented to be contacted for such\r\n        purposes;";
    			t67 = space();
    			li15 = element("li");
    			li15.textContent = "to allow you to participate in interactive features of our service, when\r\n        you choose to do so;";
    			t69 = space();
    			li16 = element("li");
    			li16.textContent = "to notify you about changes to our services;";
    			t71 = space();
    			li17 = element("li");
    			li17.textContent = "to investigate any complaints relating to the use of our website or any\r\n        suspected unlawful activities;";
    			t73 = space();
    			li18 = element("li");
    			li18.textContent = "complying with any applicable laws, regulations, codes of practice,\r\n        guidelines, or rules, or to assist in law enforcement and investigations\r\n        conducted by any governmental and/or regulatory authority;";
    			t75 = space();
    			li19 = element("li");
    			li19.textContent = "any other purposes for which you have provided the information;";
    			t77 = space();
    			li20 = element("li");
    			li20.textContent = "and carrying out whatever else is reasonable or related to or in\r\n        connection with the above and our provision of goods and/or services to\r\n        you.";
    			t79 = space();
    			div13 = element("div");
    			div12 = element("div");
    			div12.textContent = "Disclosure of your information";
    			t81 = space();
    			p12 = element("p");
    			p12.textContent = "We may disclose your Personal Data to third parties:";
    			t83 = space();
    			ul3 = element("ul");
    			li21 = element("li");
    			li21.textContent = "for the purposes of providing products or services that you request from\r\n        us, fulfilling our obligations arising from any contracts entered into\r\n        between you and us, processing payments in connection therewith or\r\n        otherwise in connection with your use of our website;";
    			t85 = space();
    			li22 = element("li");
    			li22.textContent = "where a third party claims that any content posted or uploaded by you to\r\n        our website constitutes a violation of their rights under applicable\r\n        law, in which case we may disclose your identity to that third party;";
    			t87 = space();
    			li23 = element("li");
    			li23.textContent = "in the event that we sell or buy any business or assets, in which case\r\n        we may disclose your Personal Data to the prospective seller or buyer of\r\n        such business or assets; or";
    			t89 = space();
    			li24 = element("li");
    			li24.textContent = "if we or substantially all of our shares or assets are acquired by a\r\n        third party, in which case Personal Data held by us about our customers\r\n        will be one of the transferred assets.";
    			t91 = space();
    			p13 = element("p");
    			p13.textContent = "We may also disclose your Personal Data to a governmental or regulatory\r\n      body, law enforcement, or other authorities, in order to enforce our terms\r\n      of use for the website, to cooperate with any direction, request or order\r\n      from such parties or to report any suspected unlawful activity.";
    			t93 = space();
    			div15 = element("div");
    			div14 = element("div");
    			div14.textContent = "Consent";
    			t95 = space();
    			p14 = element("p");
    			p14.textContent = "By providing your Personal Data to us, you consent to the collection, use\r\n      and disclosure of your Data by us for the purposes set out in this privacy\r\n      policy (“Purposes”).";
    			t97 = space();
    			p15 = element("p");
    			p15.textContent = "Where any Personal Data relates to a third party, you represent and\r\n      warrant that the Personal Data is up-to-date, complete, and accurate and\r\n      that you have obtained the third party’s prior consent for our collection,\r\n      use and disclosure of their Personal Data for the Purposes. You agree that\r\n      you shall promptly provide us with written evidence of such consent upon\r\n      demand by us.";
    			t99 = space();
    			p16 = element("p");
    			p16.textContent = "Each use of our services by you shall constitute a fresh agreement for us\r\n      to collect, use and disclose the Personal Data in accordance with this\r\n      privacy policy.";
    			t101 = space();
    			p17 = element("p");
    			p17.textContent = "You may withdraw your consent and request us to stop using and/or\r\n      disclosing your Personal Data for any or all of the Purposes by submitting\r\n      your request to us in writing to Contact@esi.one. Should you withdraw your\r\n      consent to the collection, use or disclosure of your Personal Data, it may\r\n      impact our ability to proceed with your transactions, agreements or\r\n      interactions with us. Prior to you exercising your choice to withdraw your\r\n      consent, we will inform you of the consequences of the withdrawal of your\r\n      consent. Please note that your withdrawal of consent will not prevent us\r\n      from exercising our legal rights (including any remedies) or undertaking\r\n      any steps as we may be entitled to at law.";
    			t103 = space();
    			div17 = element("div");
    			div16 = element("div");
    			div16.textContent = "Your data subject rights";
    			t105 = space();
    			p18 = element("p");
    			em0 = element("em");
    			em0.textContent = "a) Information";
    			br0 = element("br");
    			t107 = text("Upon request, we will\r\n      provide you at any time and free of charge with information about all\r\n      personal data that we have stored about you.");
    			t108 = space();
    			p19 = element("p");
    			em1 = element("em");
    			em1.textContent = "b) Correction, deletion, restriction of processing (blocking),\r\n        objection";
    			br1 = element("br");
    			t110 = text("If you no longer agree with the storage of your personal data or if\r\n      this data has become incorrect, we will arrange for the deletion or\r\n      blocking of your data or make the necessary corrections (insofar as this\r\n      is possible according to the applicable law) on the basis of a\r\n      corresponding instruction. The same applies if we are only to process data\r\n      in a restrictive manner in the future. You have the right to object in\r\n      particular in cases where your data is required for the performance of a\r\n      task that is in the public interest or in our legitimate interest, as well\r\n      as profiling based on this. You also have such a right of objection in the\r\n      event of data processing for the purpose of direct advertising.");
    			t111 = space();
    			p20 = element("p");
    			em2 = element("em");
    			em2.textContent = "c) Right to revoke consent with effect for the future";
    			br2 = element("br");
    			t113 = text("You may revoke your consent at any time with effect for the future.\r\n      Your revocation will not affect the lawfulness of the processing up to the\r\n      time of revocation.");
    			t114 = space();
    			p21 = element("p");
    			em3 = element("em");
    			em3.textContent = "d) Data portability";
    			br3 = element("br");
    			t116 = text("If data is\r\n      processed on the basis of a contract, pre-contractual negotiations,\r\n      consent or with the help of automated procedures, you have the right to\r\n      data portability. Upon request, we will provide you with your data in a\r\n      common, structured and machine-readable format so that you can transfer\r\n      the data to another data controller if you wish.");
    			t117 = space();
    			p22 = element("p");
    			em4 = element("em");
    			em4.textContent = "f) Exercise of your data subject rights and right of appeal";
    			br4 = element("br");
    			t119 = text("To assert these rights, please contact us using Contact@esi.one.\r\n      The same applies if you have questions about data processing in our\r\n      company. You also have the right to lodge a complaint with a data\r\n      protection supervisory authority.");
    			t120 = space();
    			div19 = element("div");
    			div18 = element("div");
    			div18.textContent = "Accuracy";
    			t122 = space();
    			p23 = element("p");
    			p23.textContent = "We endeavour to ensure that all decisions involving your Personal Data are\r\n      based upon accurate and timely information. However, we rely on you to\r\n      disclose all relevant information to us and to inform us of any changes in\r\n      your Personal Data. As such, please disclose all relevant information\r\n      necessary for us to provide services to you and ensure all information\r\n      submitted to us is up-to-date, complete, and accurate. Kindly inform us\r\n      promptly if there are any changes in your Personal Data.";
    			t124 = space();
    			div21 = element("div");
    			div20 = element("div");
    			div20.textContent = "Assumption of Risk";
    			t126 = space();
    			p24 = element("p");
    			p24.textContent = "You agree to defend and indemnify us and any of our affiliates (if\r\n      applicable) and hold us harmless against any legal claims and demands,\r\n      including reasonable legal fees, which may arise from or relate to your\r\n      use or misuse of the website or Services, your breach of this Agreement,\r\n      or your conduct or actions. You agree that we shall be able to select its\r\n      legal counsel and may participate in its defence if we wish.";
    			t128 = space();
    			div23 = element("div");
    			div22 = element("div");
    			div22.textContent = "Retention";
    			t130 = space();
    			p25 = element("p");
    			p25.textContent = "We may retain your Personal Data for at least 10 years, or such other\r\n      longer or shorter period as may be necessary to fulfil the purpose for\r\n      which it was collected, or as required or permitted by applicable laws. We\r\n      will cease to retain your Personal Data or remove the means by which the\r\n      data can be associated with you, as soon as it is reasonable to assume\r\n      that such retention no longer serves the purpose for which the Personal\r\n      Data was collected, and is no longer necessary for legal or business\r\n      purposes.";
    			t132 = space();
    			div25 = element("div");
    			div24 = element("div");
    			div24.textContent = "Third Party Policies";
    			t134 = space();
    			p26 = element("p");
    			p26.textContent = "Our website may, from time to time, contain links to and from the websites\r\n      of our partner networks, business partners and affiliates. If you follow a\r\n      link to any of these websites, please note that these websites have their\r\n      own privacy policies and that we do not accept any responsibility or\r\n      liability for these policies. Please check these policies before you\r\n      submit any Data to these websites.";
    			t136 = space();
    			div27 = element("div");
    			div26 = element("div");
    			div26.textContent = "Automated decisions in individual cases including profiling";
    			t138 = space();
    			p27 = element("p");
    			p27.textContent = "We do not use automated decision-making - including profiling in\r\n      accordance with Article 22(1) and (4) of the GDPR.";
    			t140 = space();
    			div29 = element("div");
    			div28 = element("div");
    			div28.textContent = "Data security";
    			t142 = space();
    			p28 = element("p");
    			p28.textContent = "We use technical and organisational security measures to protect the\r\n      processing of personal data, in particular against accidental or\r\n      intentional manipulation, loss, destruction or against attack by\r\n      unauthorised persons. Our security measures are continuously improved in\r\n      line with technological developments.";
    			t144 = space();
    			div31 = element("div");
    			div30 = element("div");
    			div30.textContent = "Changes";
    			t146 = space();
    			p29 = element("p");
    			p29.textContent = "This policy and our commitment to protecting the privacy of your personal\r\n      data can result in changes to this policy. Please regularly review this\r\n      policy to keep up to date with any changes.";
    			t148 = space();
    			div33 = element("div");
    			div32 = element("div");
    			div32.textContent = "Queries and Complaints";
    			t150 = space();
    			p30 = element("p");
    			p30.textContent = "Any comments or queries on this policy should be directed to us. If you\r\n      believe that we have not complied with this policy or acted otherwise than\r\n      in accordance with data protection law, then you should notify us.";
    			t152 = space();
    			div59 = element("div");
    			p31 = element("p");
    			t153 = text("In this Cookie Policy we, ESi Holding LTD trading as Esi.one Tallinn,\r\n    Estonia, ");
    			a1 = element("a");
    			a1.textContent = "www.esi.one";
    			t155 = text(" (hereinafter \"Esi.one\"\r\n    or \"we\") inform you about cookies and ways to manage your consent. respects your\r\n    privacy and takes the protection of your personal data very seriously. We also\r\n    inform you about how and which cookies are used on this website and how you can\r\n    manage your consent to store cookies.");
    			t156 = space();
    			p32 = element("p");
    			p32.textContent = "For more information about how we protect your personal data, please see our\r\n    privacy policy.";
    			t158 = space();
    			div36 = element("div");
    			div35 = element("div");
    			div35.textContent = "What are cookies?";
    			t160 = space();
    			p33 = element("p");
    			p33.textContent = "Cookies are small files that are stored on your computer when you visit a\r\n      website. The next time you visit, the website can recognise the file. The\r\n      files are thus typically used to compile statistics or for behavioural\r\n      advertising purposes. Cookies help us to provide you with our services on\r\n      our website and are partly necessary for website functionality purposes.\r\n      The personal data stored in our cookies is encrypted.";
    			t162 = space();
    			div38 = element("div");
    			div37 = element("div");
    			div37.textContent = "Third-party cookies";
    			t164 = space();
    			p34 = element("p");
    			p34.textContent = "We collect and process data for the following purposes:";
    			t166 = space();
    			ul4 = element("ul");
    			li25 = element("li");
    			li25.textContent = "Optimisation of the website and your user experience";
    			t168 = space();
    			li26 = element("li");
    			li26.textContent = "Creation of statistics on the use of the website by you and other users";
    			t170 = space();
    			li27 = element("li");
    			li27.textContent = "Creation of statistics and analyses with the aim of improving our\r\n        products, services and technologies";
    			t172 = space();
    			li28 = element("li");
    			li28.textContent = "Advertising purposes, including profiling and behavioural advertising\r\n        initiatives, so that we can make our product information and offers as\r\n        relevant as possible to you";
    			t174 = space();
    			li29 = element("li");
    			li29.textContent = "Compliance with applicable legal requirements (e.g., General Data\r\n        Protection Regulation (GDPR) and the Privacy and Electronic\r\n        Communications Regulations (PECR)), including documentation\r\n        requirements:";
    			t176 = space();
    			li30 = element("li");
    			li30.textContent = "Compliance with basic principles concerning the processing of personal\r\n        data and legal basis for the processing (e.g., obtaining consent)";
    			t178 = space();
    			li31 = element("li");
    			li31.textContent = "Implementation and maintenance of technical and organisational security\r\n        measures";
    			t180 = space();
    			li32 = element("li");
    			li32.textContent = "Investigation of suspected or known security breaches and notification\r\n        to data subjects and authorities";
    			t182 = space();
    			li33 = element("li");
    			li33.textContent = "Statistics on the use of the website";
    			t184 = space();
    			div40 = element("div");
    			div39 = element("div");
    			div39.textContent = "How long are cookies stored?";
    			t186 = space();
    			p35 = element("p");
    			p35.textContent = "Cookies are stored on your computer for different lengths of time\r\n      depending on their type. From a technical point of view, a distinction is\r\n      made between two types of cookies:";
    			t188 = space();
    			p36 = element("p");
    			em5 = element("em");
    			em5.textContent = "Session cookies:";
    			t190 = text(" session cookies are used, for example, to temporarily\r\n      store the items in your shopping cart while you navigate the website. Session\r\n      cookies are not stored on your device and disappear when you close your browser.");
    			t191 = space();
    			p37 = element("p");
    			em6 = element("em");
    			em6.textContent = "Persistent Cookies: ";
    			t193 = text("Persistent cookies are stored as text files\r\n      on your device. Persistent cookies allow our server to recognise your\r\n      device the next time you visit our website.");
    			t194 = space();
    			div42 = element("div");
    			div41 = element("div");
    			div41.textContent = "Why do we provide information about cookies?";
    			t196 = space();
    			p38 = element("p");
    			p38.textContent = "The provision of information about our use of cookies is in accordance\r\n      with the Privacy and Electronic Communications Regulation on Mandatory\r\n      Provision of Information and Mandatory Consent in the context of data\r\n      storage or data access on end-user devices. The legal basis for the\r\n      collection of your personal data through cookies, including for profiling\r\n      purposes, is your consent.";
    			t198 = space();
    			div44 = element("div");
    			div43 = element("div");
    			div43.textContent = "Who should I contact for more information?";
    			t200 = space();
    			p39 = element("p");
    			t201 = text("If you have any questions or comments about our Cookie Policy or wish to\r\n      exercise your rights under applicable laws, please contact us using ");
    			a2 = element("a");
    			a2.textContent = "Contact@esi.one";
    			t203 = text(".");
    			t204 = space();
    			div46 = element("div");
    			div45 = element("div");
    			div45.textContent = "Why do we use cookies?";
    			t206 = space();
    			p40 = element("p");
    			p40.textContent = "We use cookies to personalise content and ads, to provide social media\r\n      features and to analyse our traffic. We also share information about your\r\n      use of our site with our social media, advertising and analytics partners\r\n      who may combine it with other information that you’ve provided to them or\r\n      that they’ve collected from your use of their services.";
    			t208 = space();
    			p41 = element("p");
    			p41.textContent = "Cookies are small text files that can be used by websites to make a user’s\r\n      experience more efficient. The law states that we can store cookies on\r\n      your device if they are strictly necessary for the operation of this site.\r\n      For all other types of cookies, we need your permission.";
    			t210 = space();
    			p42 = element("p");
    			p42.textContent = "This site uses different types of cookies. Some cookies are placed by\r\n      third party services that appear on our pages.";
    			t212 = space();
    			div48 = element("div");
    			div47 = element("div");
    			div47.textContent = "Types of cookies";
    			t214 = space();
    			p43 = element("p");
    			p43.textContent = "There are different types of cookies:";
    			t216 = space();
    			div50 = element("div");
    			div49 = element("div");
    			em7 = element("em");
    			em7.textContent = "Functional cookies";
    			t218 = space();
    			p44 = element("p");
    			p44.textContent = "Functional cookies are essential cookies to provide a correct and\r\n      user-friendly website. Some examples:";
    			t220 = space();
    			ul5 = element("ul");
    			li34 = element("li");
    			li34.textContent = "Storing your language preferences;";
    			t222 = space();
    			li35 = element("li");
    			li35.textContent = "Detecting abuse or fraud;";
    			t224 = space();
    			li36 = element("li");
    			li36.textContent = "Storing browser settings to display the website according to the screen\r\n        size.";
    			t226 = space();
    			div52 = element("div");
    			div51 = element("div");
    			em8 = element("em");
    			em8.textContent = "Analytical cookies";
    			t228 = space();
    			p45 = element("p");
    			p45.textContent = "These cookies are typical third party cookies that we use to collect\r\n      statistical data about how our website is used, including:";
    			t230 = space();
    			ul6 = element("ul");
    			li37 = element("li");
    			li37.textContent = "Average page load time;";
    			t232 = space();
    			li38 = element("li");
    			li38.textContent = "Pages visited;";
    			t234 = space();
    			li39 = element("li");
    			li39.textContent = "Browser data;";
    			t236 = space();
    			li40 = element("li");
    			li40.textContent = "IP address;";
    			t238 = space();
    			li41 = element("li");
    			li41.textContent = "MAC address;";
    			t240 = space();
    			li42 = element("li");
    			li42.textContent = "Duration of a (page) visit;";
    			t242 = space();
    			li43 = element("li");
    			li43.textContent = "Data about the operating system;";
    			t244 = space();
    			li44 = element("li");
    			li44.textContent = "Data about the device used;";
    			t246 = space();
    			li45 = element("li");
    			li45.textContent = "Clicking behaviour and other interactions on one or more pages.";
    			t248 = space();
    			p46 = element("p");
    			p46.textContent = "The main purpose of these cookies and their statistical data is, after\r\n      analysis, to optimise our performance, security, usability, content and\r\n      services.";
    			t250 = space();
    			div54 = element("div");
    			div53 = element("div");
    			div53.textContent = "Non-essential Cookies";
    			t252 = space();
    			p47 = element("p");
    			p47.textContent = "Non-essential Cookies are any cookies that do not fall within the\r\n      definition of essential cookies, such as cookies used to analyse your\r\n      behaviour on a website (‘analytical’ cookies) or cookies used to display\r\n      advertisements to you (‘advertising’ cookies).";
    			t254 = space();
    			div56 = element("div");
    			div55 = element("div");
    			div55.textContent = "How can I prevent and delete cookies?";
    			t256 = space();
    			p48 = element("p");
    			p48.textContent = "When you visit our website, one or more cookies are automatically stored\r\n      on your device. If you do not want this to happen, it is best to use the\r\n      following links (depending on the browser you use) to set your browser to\r\n      prevent cookies from being stored on your computer in the future.";
    			t258 = space();
    			ul7 = element("ul");
    			li46 = element("li");
    			t259 = text("Delete cookies in");
    			a3 = element("a");
    			a3.textContent = "Google Chrome";
    			t261 = space();
    			li47 = element("li");
    			t262 = text("Delete cookies in ");
    			a4 = element("a");
    			a4.textContent = "Mozilla Firefox";
    			t264 = space();
    			li48 = element("li");
    			t265 = text("Deleting ");
    			a5 = element("a");
    			a5.textContent = "Flash cookies";
    			t267 = space();
    			li49 = element("li");
    			t268 = text("Delete cookies in ");
    			a6 = element("a");
    			a6.textContent = "Microsoft Internet Explorer";
    			t270 = space();
    			li50 = element("li");
    			t271 = text("Delete cookies in ");
    			a7 = element("a");
    			a7.textContent = "Opera";
    			t273 = space();
    			li51 = element("li");
    			t274 = text("Delete cookies in ");
    			a8 = element("a");
    			a8.textContent = "Safari";
    			t276 = space();
    			p49 = element("p");
    			p49.textContent = "If your browser is not listed above, it's best to check your browser's\r\n      help menu or search the Internet for \"cookies\" in conjunction with your\r\n      browser's name.";
    			t278 = space();
    			div58 = element("div");
    			div57 = element("div");
    			div57.textContent = "Does this policy change?";
    			t280 = space();
    			p50 = element("p");
    			p50.textContent = "We may update our Cookie Policy from time to time. This might be for a\r\n      number of reasons, such as to reflect a change in the law or to\r\n      accommodate a change in our business practices and the way we use cookies.\r\n      We recommend that you check here periodically for any changes to our\r\n      Cookie Policy.";
    			attr_dev(a0, "title", "some title");
    			attr_dev(a0, "href", "/home");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$A, 2, 60, 99);
    			attr_dev(p0, "class", "svelte-mhunvz");
    			add_location(p0, file$A, 1, 2, 34);
    			attr_dev(p1, "class", "svelte-mhunvz");
    			add_location(p1, file$A, 9, 2, 293);
    			attr_dev(p2, "class", "svelte-mhunvz");
    			add_location(p2, file$A, 20, 2, 956);
    			attr_dev(div0, "class", "legal__row__head");
    			add_location(div0, file$A, 26, 4, 1186);
    			attr_dev(p3, "class", "svelte-mhunvz");
    			add_location(p3, file$A, 27, 4, 1254);
    			add_location(li0, file$A, 32, 6, 1390);
    			add_location(li1, file$A, 38, 6, 1711);
    			add_location(li2, file$A, 41, 6, 1818);
    			add_location(li3, file$A, 42, 6, 1893);
    			add_location(li4, file$A, 46, 6, 2053);
    			attr_dev(ul0, "role", "list");
    			add_location(ul0, file$A, 31, 4, 1366);
    			attr_dev(div1, "class", "legal__row");
    			add_location(div1, file$A, 25, 2, 1156);
    			attr_dev(div2, "class", "legal__row__head");
    			add_location(div2, file$A, 50, 4, 2172);
    			attr_dev(p4, "class", "svelte-mhunvz");
    			add_location(p4, file$A, 51, 4, 2243);
    			add_location(li5, file$A, 53, 6, 2341);
    			add_location(li6, file$A, 54, 6, 2386);
    			add_location(li7, file$A, 55, 6, 2434);
    			add_location(li8, file$A, 56, 6, 2480);
    			add_location(li9, file$A, 57, 6, 2526);
    			add_location(li10, file$A, 58, 6, 2594);
    			add_location(li11, file$A, 59, 6, 2627);
    			attr_dev(ul1, "role", "list");
    			add_location(ul1, file$A, 52, 4, 2317);
    			attr_dev(p5, "class", "svelte-mhunvz");
    			add_location(p5, file$A, 61, 4, 2677);
    			attr_dev(div3, "class", "legal__row");
    			add_location(div3, file$A, 49, 2, 2142);
    			attr_dev(div4, "class", "legal__row__head");
    			add_location(div4, file$A, 69, 4, 3038);
    			attr_dev(p6, "class", "svelte-mhunvz");
    			add_location(p6, file$A, 70, 4, 3092);
    			attr_dev(div5, "class", "legal__row");
    			add_location(div5, file$A, 68, 2, 3008);
    			attr_dev(div6, "class", "legal__row__head");
    			add_location(div6, file$A, 79, 4, 3525);
    			attr_dev(p7, "class", "svelte-mhunvz");
    			add_location(p7, file$A, 80, 4, 3574);
    			attr_dev(div7, "class", "legal__row");
    			add_location(div7, file$A, 78, 2, 3495);
    			attr_dev(div8, "class", "legal__row__head");
    			add_location(div8, file$A, 86, 4, 3723);
    			attr_dev(p8, "class", "svelte-mhunvz");
    			add_location(p8, file$A, 87, 4, 3789);
    			attr_dev(p9, "class", "svelte-mhunvz");
    			add_location(p9, file$A, 97, 4, 4413);
    			attr_dev(p10, "class", "svelte-mhunvz");
    			add_location(p10, file$A, 104, 4, 4764);
    			attr_dev(div9, "class", "legal__row");
    			add_location(div9, file$A, 85, 2, 3693);
    			attr_dev(div10, "class", "legal__row__head");
    			add_location(div10, file$A, 114, 4, 5265);
    			attr_dev(p11, "class", "svelte-mhunvz");
    			add_location(p11, file$A, 115, 4, 5335);
    			add_location(li12, file$A, 119, 6, 5460);
    			add_location(li13, file$A, 123, 6, 5616);
    			add_location(li14, file$A, 128, 6, 5841);
    			add_location(li15, file$A, 133, 6, 6039);
    			add_location(li16, file$A, 137, 6, 6176);
    			add_location(li17, file$A, 138, 6, 6237);
    			add_location(li18, file$A, 142, 6, 6383);
    			add_location(li19, file$A, 147, 6, 6635);
    			add_location(li20, file$A, 148, 6, 6715);
    			attr_dev(ul2, "role", "list");
    			add_location(ul2, file$A, 118, 4, 5436);
    			attr_dev(div11, "class", "legal__row");
    			add_location(div11, file$A, 113, 2, 5235);
    			attr_dev(div12, "class", "legal__row__head");
    			add_location(div12, file$A, 156, 4, 6956);
    			attr_dev(p12, "class", "svelte-mhunvz");
    			add_location(p12, file$A, 157, 4, 7028);
    			add_location(li21, file$A, 159, 6, 7117);
    			add_location(li22, file$A, 165, 6, 7443);
    			add_location(li23, file$A, 170, 6, 7707);
    			add_location(li24, file$A, 175, 6, 7931);
    			attr_dev(ul3, "role", "list");
    			add_location(ul3, file$A, 158, 4, 7093);
    			attr_dev(p13, "class", "svelte-mhunvz");
    			add_location(p13, file$A, 181, 4, 8172);
    			attr_dev(div13, "class", "legal__row");
    			add_location(div13, file$A, 155, 2, 6926);
    			attr_dev(div14, "class", "legal__row__head");
    			add_location(div14, file$A, 189, 4, 8542);
    			attr_dev(p14, "class", "svelte-mhunvz");
    			add_location(p14, file$A, 190, 4, 8591);
    			attr_dev(p15, "class", "svelte-mhunvz");
    			add_location(p15, file$A, 195, 4, 8801);
    			attr_dev(p16, "class", "svelte-mhunvz");
    			add_location(p16, file$A, 203, 4, 9240);
    			attr_dev(p17, "class", "svelte-mhunvz");
    			add_location(p17, file$A, 208, 4, 9441);
    			attr_dev(div15, "class", "legal__row");
    			add_location(div15, file$A, 188, 2, 8512);
    			attr_dev(div16, "class", "legal__row__head");
    			add_location(div16, file$A, 222, 4, 10265);
    			attr_dev(em0, "class", "italic__legal");
    			add_location(em0, file$A, 224, 6, 10342);
    			add_location(br0, file$A, 224, 51, 10387);
    			attr_dev(p18, "class", "svelte-mhunvz");
    			add_location(p18, file$A, 223, 4, 10331);
    			attr_dev(em1, "class", "italic__legal");
    			add_location(em1, file$A, 229, 6, 10570);
    			add_location(br1, file$A, 232, 7, 10700);
    			attr_dev(p19, "class", "svelte-mhunvz");
    			add_location(p19, file$A, 228, 4, 10559);
    			attr_dev(em2, "class", "italic__legal");
    			add_location(em2, file$A, 244, 6, 11500);
    			add_location(br2, file$A, 246, 7, 11602);
    			attr_dev(p20, "class", "svelte-mhunvz");
    			add_location(p20, file$A, 243, 4, 11489);
    			attr_dev(em3, "class", "italic__legal");
    			add_location(em3, file$A, 251, 6, 11811);
    			add_location(br3, file$A, 251, 56, 11861);
    			attr_dev(p21, "class", "svelte-mhunvz");
    			add_location(p21, file$A, 250, 4, 11800);
    			attr_dev(em4, "class", "italic__legal");
    			add_location(em4, file$A, 259, 6, 12272);
    			add_location(br4, file$A, 261, 7, 12380);
    			attr_dev(p22, "class", "svelte-mhunvz");
    			add_location(p22, file$A, 258, 4, 12261);
    			attr_dev(div17, "class", "legal__row");
    			add_location(div17, file$A, 221, 2, 10235);
    			attr_dev(div18, "class", "legal__row__head");
    			add_location(div18, file$A, 268, 4, 12693);
    			attr_dev(p23, "class", "svelte-mhunvz");
    			add_location(p23, file$A, 269, 4, 12743);
    			attr_dev(div19, "class", "legal__row");
    			add_location(div19, file$A, 267, 2, 12663);
    			attr_dev(div20, "class", "legal__row__head");
    			add_location(div20, file$A, 280, 4, 13340);
    			attr_dev(p24, "class", "svelte-mhunvz");
    			add_location(p24, file$A, 281, 4, 13400);
    			attr_dev(div21, "class", "legal__row");
    			add_location(div21, file$A, 279, 2, 13310);
    			attr_dev(div22, "class", "legal__row__head");
    			add_location(div22, file$A, 291, 4, 13917);
    			attr_dev(p25, "class", "svelte-mhunvz");
    			add_location(p25, file$A, 292, 4, 13968);
    			attr_dev(div23, "class", "legal__row");
    			add_location(div23, file$A, 290, 2, 13887);
    			attr_dev(div24, "class", "legal__row__head");
    			add_location(div24, file$A, 304, 4, 14592);
    			attr_dev(p26, "class", "svelte-mhunvz");
    			add_location(p26, file$A, 305, 4, 14654);
    			attr_dev(div25, "class", "legal__row");
    			add_location(div25, file$A, 303, 2, 14562);
    			attr_dev(div26, "class", "legal__row__head");
    			add_location(div26, file$A, 315, 4, 15150);
    			attr_dev(p27, "class", "svelte-mhunvz");
    			add_location(p27, file$A, 318, 4, 15265);
    			attr_dev(div27, "class", "legal__row");
    			add_location(div27, file$A, 314, 2, 15120);
    			attr_dev(div28, "class", "legal__row__head");
    			add_location(div28, file$A, 324, 4, 15452);
    			attr_dev(p28, "class", "svelte-mhunvz");
    			add_location(p28, file$A, 325, 4, 15507);
    			attr_dev(div29, "class", "legal__row");
    			add_location(div29, file$A, 323, 2, 15422);
    			attr_dev(div30, "class", "legal__row__head");
    			add_location(div30, file$A, 334, 4, 15909);
    			attr_dev(p29, "class", "svelte-mhunvz");
    			add_location(p29, file$A, 335, 4, 15958);
    			attr_dev(div31, "class", "legal__row");
    			add_location(div31, file$A, 333, 2, 15879);
    			attr_dev(div32, "class", "legal__row__head");
    			add_location(div32, file$A, 342, 4, 16226);
    			attr_dev(p30, "class", "svelte-mhunvz");
    			add_location(p30, file$A, 343, 4, 16290);
    			attr_dev(div33, "class", "legal__row");
    			add_location(div33, file$A, 341, 2, 16196);
    			attr_dev(div34, "class", "info__item__text");
    			add_location(div34, file$A, 0, 0, 0);
    			attr_dev(a1, "href", "/home");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$A, 353, 13, 16685);
    			attr_dev(p31, "class", "svelte-mhunvz");
    			add_location(p31, file$A, 351, 2, 16592);
    			attr_dev(p32, "class", "svelte-mhunvz");
    			add_location(p32, file$A, 359, 2, 17065);
    			attr_dev(div35, "class", "legal__row__head");
    			add_location(div35, file$A, 364, 4, 17213);
    			attr_dev(p33, "class", "svelte-mhunvz");
    			add_location(p33, file$A, 365, 4, 17272);
    			attr_dev(div36, "class", "legal__row");
    			add_location(div36, file$A, 363, 2, 17183);
    			attr_dev(div37, "class", "legal__row__head");
    			add_location(div37, file$A, 375, 4, 17791);
    			attr_dev(p34, "class", "svelte-mhunvz");
    			add_location(p34, file$A, 376, 4, 17852);
    			add_location(li25, file$A, 378, 6, 17944);
    			add_location(li26, file$A, 379, 6, 18013);
    			add_location(li27, file$A, 382, 6, 18119);
    			add_location(li28, file$A, 386, 6, 18264);
    			add_location(li29, file$A, 391, 6, 18485);
    			add_location(li30, file$A, 397, 6, 18746);
    			add_location(li31, file$A, 401, 6, 18926);
    			add_location(li32, file$A, 405, 6, 19050);
    			add_location(li33, file$A, 409, 6, 19197);
    			attr_dev(ul4, "role", "list");
    			add_location(ul4, file$A, 377, 4, 17920);
    			attr_dev(div38, "class", "legal__row");
    			add_location(div38, file$A, 374, 2, 17761);
    			attr_dev(div39, "class", "legal__row__head");
    			add_location(div39, file$A, 413, 4, 19297);
    			attr_dev(p35, "class", "svelte-mhunvz");
    			add_location(p35, file$A, 414, 4, 19367);
    			add_location(em5, file$A, 420, 6, 19593);
    			attr_dev(p36, "class", "svelte-mhunvz");
    			add_location(p36, file$A, 419, 4, 19582);
    			add_location(em6, file$A, 425, 6, 19872);
    			attr_dev(p37, "class", "svelte-mhunvz");
    			add_location(p37, file$A, 424, 4, 19861);
    			attr_dev(div40, "class", "legal__row");
    			add_location(div40, file$A, 412, 2, 19267);
    			attr_dev(div41, "class", "legal__row__head");
    			add_location(div41, file$A, 431, 4, 20126);
    			attr_dev(p38, "class", "svelte-mhunvz");
    			add_location(p38, file$A, 434, 4, 20226);
    			attr_dev(div42, "class", "legal__row");
    			add_location(div42, file$A, 430, 2, 20096);
    			attr_dev(div43, "class", "legal__row__head");
    			add_location(div43, file$A, 444, 4, 20706);
    			attr_dev(a2, "href", "mailto:Contact@esi.one");
    			add_location(a2, file$A, 449, 74, 20963);
    			attr_dev(p39, "class", "svelte-mhunvz");
    			add_location(p39, file$A, 447, 4, 20804);
    			attr_dev(div44, "class", "legal__row");
    			add_location(div44, file$A, 443, 2, 20676);
    			attr_dev(div45, "class", "legal__row__head");
    			add_location(div45, file$A, 455, 4, 21087);
    			attr_dev(p40, "class", "svelte-mhunvz");
    			add_location(p40, file$A, 456, 4, 21151);
    			attr_dev(p41, "class", "svelte-mhunvz");
    			add_location(p41, file$A, 463, 4, 21554);
    			attr_dev(p42, "class", "svelte-mhunvz");
    			add_location(p42, file$A, 469, 4, 21879);
    			attr_dev(div46, "class", "legal__row");
    			add_location(div46, file$A, 454, 2, 21057);
    			attr_dev(div47, "class", "legal__row__head");
    			add_location(div47, file$A, 475, 4, 22067);
    			attr_dev(p43, "class", "svelte-mhunvz");
    			add_location(p43, file$A, 476, 4, 22125);
    			attr_dev(div48, "class", "legal__row");
    			add_location(div48, file$A, 474, 2, 22037);
    			add_location(em7, file$A, 479, 34, 22243);
    			attr_dev(div49, "class", "legal__row__head");
    			add_location(div49, file$A, 479, 4, 22213);
    			attr_dev(p44, "class", "svelte-mhunvz");
    			add_location(p44, file$A, 480, 4, 22282);
    			add_location(li34, file$A, 485, 6, 22443);
    			add_location(li35, file$A, 486, 6, 22494);
    			add_location(li36, file$A, 487, 6, 22536);
    			attr_dev(ul5, "role", "list");
    			add_location(ul5, file$A, 484, 4, 22419);
    			attr_dev(div50, "class", "legal__row");
    			add_location(div50, file$A, 478, 2, 22183);
    			add_location(em8, file$A, 494, 34, 22734);
    			attr_dev(div51, "class", "legal__row__head");
    			add_location(div51, file$A, 494, 4, 22704);
    			attr_dev(p45, "class", "svelte-mhunvz");
    			add_location(p45, file$A, 495, 4, 22773);
    			add_location(li37, file$A, 500, 6, 22958);
    			add_location(li38, file$A, 501, 6, 22998);
    			add_location(li39, file$A, 502, 6, 23029);
    			add_location(li40, file$A, 503, 6, 23059);
    			add_location(li41, file$A, 504, 6, 23087);
    			add_location(li42, file$A, 505, 6, 23116);
    			add_location(li43, file$A, 506, 6, 23160);
    			add_location(li44, file$A, 507, 6, 23209);
    			add_location(li45, file$A, 508, 6, 23253);
    			attr_dev(ul6, "role", "list");
    			add_location(ul6, file$A, 499, 4, 22934);
    			attr_dev(p46, "class", "svelte-mhunvz");
    			add_location(p46, file$A, 510, 4, 23342);
    			attr_dev(div52, "class", "legal__row");
    			add_location(div52, file$A, 493, 2, 22674);
    			attr_dev(div53, "class", "legal__row__head");
    			add_location(div53, file$A, 517, 4, 23573);
    			attr_dev(p47, "class", "svelte-mhunvz");
    			add_location(p47, file$A, 518, 4, 23636);
    			attr_dev(div54, "class", "legal__row");
    			add_location(div54, file$A, 516, 2, 23543);
    			attr_dev(div55, "class", "legal__row__head");
    			add_location(div55, file$A, 526, 4, 23977);
    			attr_dev(p48, "class", "svelte-mhunvz");
    			add_location(p48, file$A, 527, 4, 24056);
    			attr_dev(a3, "href", "https://support.google.com/chrome/answer/95647?hl=en-GB&co=GENIE.Platform%3DDesktop");
    			attr_dev(a3, "target", "_blank");
    			add_location(a3, file$A, 535, 25, 24444);
    			add_location(li46, file$A, 534, 6, 24413);
    			attr_dev(a4, "href", "https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox");
    			attr_dev(a4, "target", "_blank");
    			add_location(a4, file$A, 543, 26, 24682);
    			add_location(li47, file$A, 542, 6, 24650);
    			attr_dev(a5, "href", "https://www.wikihow.com/Delete-Flash-Cookies");
    			attr_dev(a5, "target", "_blank");
    			add_location(a5, file$A, 549, 17, 24876);
    			add_location(li48, file$A, 548, 6, 24853);
    			attr_dev(a6, "href", "https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d");
    			attr_dev(a6, "target", "_blank");
    			add_location(a6, file$A, 555, 26, 25049);
    			add_location(li49, file$A, 554, 6, 25017);
    			attr_dev(a7, "href", "https://www.opera.com/uk/use-cases/clean-browser-and-remove-trackers");
    			attr_dev(a7, "target", "_blank");
    			add_location(a7, file$A, 561, 26, 25298);
    			add_location(li50, file$A, 560, 6, 25266);
    			attr_dev(a8, "href", "https://support.apple.com/en-gb/HT201265");
    			attr_dev(a8, "target", "_blank");
    			add_location(a8, file$A, 567, 26, 25487);
    			add_location(li51, file$A, 566, 6, 25455);
    			attr_dev(ul7, "role", "list");
    			add_location(ul7, file$A, 533, 4, 24389);
    			attr_dev(p49, "class", "svelte-mhunvz");
    			add_location(p49, file$A, 573, 4, 25626);
    			attr_dev(div56, "class", "legal__row");
    			add_location(div56, file$A, 525, 2, 23947);
    			attr_dev(div57, "class", "legal__row__head");
    			add_location(div57, file$A, 580, 4, 25863);
    			attr_dev(p50, "class", "svelte-mhunvz");
    			add_location(p50, file$A, 581, 4, 25929);
    			attr_dev(div58, "class", "legal__row");
    			add_location(div58, file$A, 579, 2, 25833);
    			attr_dev(div59, "class", "info__item__text");
    			add_location(div59, file$A, 350, 0, 16558);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div34, anchor);
    			append_dev(div34, p0);
    			append_dev(p0, t0);
    			append_dev(p0, a0);
    			append_dev(p0, t2);
    			append_dev(div34, t3);
    			append_dev(div34, p1);
    			append_dev(div34, t5);
    			append_dev(div34, p2);
    			append_dev(div34, t7);
    			append_dev(div34, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t9);
    			append_dev(div1, p3);
    			append_dev(div1, t11);
    			append_dev(div1, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t13);
    			append_dev(ul0, li1);
    			append_dev(ul0, t15);
    			append_dev(ul0, li2);
    			append_dev(ul0, t17);
    			append_dev(ul0, li3);
    			append_dev(ul0, t19);
    			append_dev(ul0, li4);
    			append_dev(div34, t21);
    			append_dev(div34, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t23);
    			append_dev(div3, p4);
    			append_dev(div3, t25);
    			append_dev(div3, ul1);
    			append_dev(ul1, li5);
    			append_dev(ul1, t27);
    			append_dev(ul1, li6);
    			append_dev(ul1, t29);
    			append_dev(ul1, li7);
    			append_dev(ul1, t31);
    			append_dev(ul1, li8);
    			append_dev(ul1, t33);
    			append_dev(ul1, li9);
    			append_dev(ul1, t35);
    			append_dev(ul1, li10);
    			append_dev(ul1, t37);
    			append_dev(ul1, li11);
    			append_dev(div3, t39);
    			append_dev(div3, p5);
    			append_dev(div34, t41);
    			append_dev(div34, div5);
    			append_dev(div5, div4);
    			append_dev(div5, t43);
    			append_dev(div5, p6);
    			append_dev(div34, t45);
    			append_dev(div34, div7);
    			append_dev(div7, div6);
    			append_dev(div7, t47);
    			append_dev(div7, p7);
    			append_dev(div34, t49);
    			append_dev(div34, div9);
    			append_dev(div9, div8);
    			append_dev(div9, t51);
    			append_dev(div9, p8);
    			append_dev(div9, t53);
    			append_dev(div9, p9);
    			append_dev(div9, t55);
    			append_dev(div9, p10);
    			append_dev(div34, t57);
    			append_dev(div34, div11);
    			append_dev(div11, div10);
    			append_dev(div11, t59);
    			append_dev(div11, p11);
    			append_dev(div11, t61);
    			append_dev(div11, ul2);
    			append_dev(ul2, li12);
    			append_dev(ul2, t63);
    			append_dev(ul2, li13);
    			append_dev(ul2, t65);
    			append_dev(ul2, li14);
    			append_dev(ul2, t67);
    			append_dev(ul2, li15);
    			append_dev(ul2, t69);
    			append_dev(ul2, li16);
    			append_dev(ul2, t71);
    			append_dev(ul2, li17);
    			append_dev(ul2, t73);
    			append_dev(ul2, li18);
    			append_dev(ul2, t75);
    			append_dev(ul2, li19);
    			append_dev(ul2, t77);
    			append_dev(ul2, li20);
    			append_dev(div34, t79);
    			append_dev(div34, div13);
    			append_dev(div13, div12);
    			append_dev(div13, t81);
    			append_dev(div13, p12);
    			append_dev(div13, t83);
    			append_dev(div13, ul3);
    			append_dev(ul3, li21);
    			append_dev(ul3, t85);
    			append_dev(ul3, li22);
    			append_dev(ul3, t87);
    			append_dev(ul3, li23);
    			append_dev(ul3, t89);
    			append_dev(ul3, li24);
    			append_dev(div13, t91);
    			append_dev(div13, p13);
    			append_dev(div34, t93);
    			append_dev(div34, div15);
    			append_dev(div15, div14);
    			append_dev(div15, t95);
    			append_dev(div15, p14);
    			append_dev(div15, t97);
    			append_dev(div15, p15);
    			append_dev(div15, t99);
    			append_dev(div15, p16);
    			append_dev(div15, t101);
    			append_dev(div15, p17);
    			append_dev(div34, t103);
    			append_dev(div34, div17);
    			append_dev(div17, div16);
    			append_dev(div17, t105);
    			append_dev(div17, p18);
    			append_dev(p18, em0);
    			append_dev(p18, br0);
    			append_dev(p18, t107);
    			append_dev(div17, t108);
    			append_dev(div17, p19);
    			append_dev(p19, em1);
    			append_dev(p19, br1);
    			append_dev(p19, t110);
    			append_dev(div17, t111);
    			append_dev(div17, p20);
    			append_dev(p20, em2);
    			append_dev(p20, br2);
    			append_dev(p20, t113);
    			append_dev(div17, t114);
    			append_dev(div17, p21);
    			append_dev(p21, em3);
    			append_dev(p21, br3);
    			append_dev(p21, t116);
    			append_dev(div17, t117);
    			append_dev(div17, p22);
    			append_dev(p22, em4);
    			append_dev(p22, br4);
    			append_dev(p22, t119);
    			append_dev(div34, t120);
    			append_dev(div34, div19);
    			append_dev(div19, div18);
    			append_dev(div19, t122);
    			append_dev(div19, p23);
    			append_dev(div34, t124);
    			append_dev(div34, div21);
    			append_dev(div21, div20);
    			append_dev(div21, t126);
    			append_dev(div21, p24);
    			append_dev(div34, t128);
    			append_dev(div34, div23);
    			append_dev(div23, div22);
    			append_dev(div23, t130);
    			append_dev(div23, p25);
    			append_dev(div34, t132);
    			append_dev(div34, div25);
    			append_dev(div25, div24);
    			append_dev(div25, t134);
    			append_dev(div25, p26);
    			append_dev(div34, t136);
    			append_dev(div34, div27);
    			append_dev(div27, div26);
    			append_dev(div27, t138);
    			append_dev(div27, p27);
    			append_dev(div34, t140);
    			append_dev(div34, div29);
    			append_dev(div29, div28);
    			append_dev(div29, t142);
    			append_dev(div29, p28);
    			append_dev(div34, t144);
    			append_dev(div34, div31);
    			append_dev(div31, div30);
    			append_dev(div31, t146);
    			append_dev(div31, p29);
    			append_dev(div34, t148);
    			append_dev(div34, div33);
    			append_dev(div33, div32);
    			append_dev(div33, t150);
    			append_dev(div33, p30);
    			insert_dev(target, t152, anchor);
    			insert_dev(target, div59, anchor);
    			append_dev(div59, p31);
    			append_dev(p31, t153);
    			append_dev(p31, a1);
    			append_dev(p31, t155);
    			append_dev(div59, t156);
    			append_dev(div59, p32);
    			append_dev(div59, t158);
    			append_dev(div59, div36);
    			append_dev(div36, div35);
    			append_dev(div36, t160);
    			append_dev(div36, p33);
    			append_dev(div59, t162);
    			append_dev(div59, div38);
    			append_dev(div38, div37);
    			append_dev(div38, t164);
    			append_dev(div38, p34);
    			append_dev(div38, t166);
    			append_dev(div38, ul4);
    			append_dev(ul4, li25);
    			append_dev(ul4, t168);
    			append_dev(ul4, li26);
    			append_dev(ul4, t170);
    			append_dev(ul4, li27);
    			append_dev(ul4, t172);
    			append_dev(ul4, li28);
    			append_dev(ul4, t174);
    			append_dev(ul4, li29);
    			append_dev(ul4, t176);
    			append_dev(ul4, li30);
    			append_dev(ul4, t178);
    			append_dev(ul4, li31);
    			append_dev(ul4, t180);
    			append_dev(ul4, li32);
    			append_dev(ul4, t182);
    			append_dev(ul4, li33);
    			append_dev(div59, t184);
    			append_dev(div59, div40);
    			append_dev(div40, div39);
    			append_dev(div40, t186);
    			append_dev(div40, p35);
    			append_dev(div40, t188);
    			append_dev(div40, p36);
    			append_dev(p36, em5);
    			append_dev(p36, t190);
    			append_dev(div40, t191);
    			append_dev(div40, p37);
    			append_dev(p37, em6);
    			append_dev(p37, t193);
    			append_dev(div59, t194);
    			append_dev(div59, div42);
    			append_dev(div42, div41);
    			append_dev(div42, t196);
    			append_dev(div42, p38);
    			append_dev(div59, t198);
    			append_dev(div59, div44);
    			append_dev(div44, div43);
    			append_dev(div44, t200);
    			append_dev(div44, p39);
    			append_dev(p39, t201);
    			append_dev(p39, a2);
    			append_dev(p39, t203);
    			append_dev(div59, t204);
    			append_dev(div59, div46);
    			append_dev(div46, div45);
    			append_dev(div46, t206);
    			append_dev(div46, p40);
    			append_dev(div46, t208);
    			append_dev(div46, p41);
    			append_dev(div46, t210);
    			append_dev(div46, p42);
    			append_dev(div59, t212);
    			append_dev(div59, div48);
    			append_dev(div48, div47);
    			append_dev(div48, t214);
    			append_dev(div48, p43);
    			append_dev(div59, t216);
    			append_dev(div59, div50);
    			append_dev(div50, div49);
    			append_dev(div49, em7);
    			append_dev(div50, t218);
    			append_dev(div50, p44);
    			append_dev(div50, t220);
    			append_dev(div50, ul5);
    			append_dev(ul5, li34);
    			append_dev(ul5, t222);
    			append_dev(ul5, li35);
    			append_dev(ul5, t224);
    			append_dev(ul5, li36);
    			append_dev(div59, t226);
    			append_dev(div59, div52);
    			append_dev(div52, div51);
    			append_dev(div51, em8);
    			append_dev(div52, t228);
    			append_dev(div52, p45);
    			append_dev(div52, t230);
    			append_dev(div52, ul6);
    			append_dev(ul6, li37);
    			append_dev(ul6, t232);
    			append_dev(ul6, li38);
    			append_dev(ul6, t234);
    			append_dev(ul6, li39);
    			append_dev(ul6, t236);
    			append_dev(ul6, li40);
    			append_dev(ul6, t238);
    			append_dev(ul6, li41);
    			append_dev(ul6, t240);
    			append_dev(ul6, li42);
    			append_dev(ul6, t242);
    			append_dev(ul6, li43);
    			append_dev(ul6, t244);
    			append_dev(ul6, li44);
    			append_dev(ul6, t246);
    			append_dev(ul6, li45);
    			append_dev(div52, t248);
    			append_dev(div52, p46);
    			append_dev(div59, t250);
    			append_dev(div59, div54);
    			append_dev(div54, div53);
    			append_dev(div54, t252);
    			append_dev(div54, p47);
    			append_dev(div59, t254);
    			append_dev(div59, div56);
    			append_dev(div56, div55);
    			append_dev(div56, t256);
    			append_dev(div56, p48);
    			append_dev(div56, t258);
    			append_dev(div56, ul7);
    			append_dev(ul7, li46);
    			append_dev(li46, t259);
    			append_dev(li46, a3);
    			append_dev(ul7, t261);
    			append_dev(ul7, li47);
    			append_dev(li47, t262);
    			append_dev(li47, a4);
    			append_dev(ul7, t264);
    			append_dev(ul7, li48);
    			append_dev(li48, t265);
    			append_dev(li48, a5);
    			append_dev(ul7, t267);
    			append_dev(ul7, li49);
    			append_dev(li49, t268);
    			append_dev(li49, a6);
    			append_dev(ul7, t270);
    			append_dev(ul7, li50);
    			append_dev(li50, t271);
    			append_dev(li50, a7);
    			append_dev(ul7, t273);
    			append_dev(ul7, li51);
    			append_dev(li51, t274);
    			append_dev(li51, a8);
    			append_dev(div56, t276);
    			append_dev(div56, p49);
    			append_dev(div59, t278);
    			append_dev(div59, div58);
    			append_dev(div58, div57);
    			append_dev(div58, t280);
    			append_dev(div58, p50);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div34);
    			if (detaching) detach_dev(t152);
    			if (detaching) detach_dev(div59);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$E.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$E($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Privacy', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Privacy> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Privacy extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$E, create_fragment$E, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Privacy",
    			options,
    			id: create_fragment$E.name
    		});
    	}
    }

    /* src\components\legal\content\TermOfServices.svelte generated by Svelte v3.48.0 */

    const file$z = "src\\components\\legal\\content\\TermOfServices.svelte";

    function create_fragment$D(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "\"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultricies\r\n  gravida enim, ac congue diam. Cras faucibus lorem et velit tempus viverra.\r\n  Nulla facilisi. Nulla neque neque, bibendum sit amet consequat id, dapibus at\r\n  purus. Etiam cursus varius turpis, vitae efficitur erat facilisis ut. Quisque\r\n  fringilla in purus non posuere. Mauris lobortis et orci at scelerisque.\r\n  Curabitur elementum consectetur eros eget congue. Morbi aliquet eleifend\r\n  elementum. Ut et tempor quam, id sodales mi. Nullam eget placerat orci.\r\n  Suspendisse rhoncus, sem eu interdum facilisis, ipsum mi egestas purus, in\r\n  vulputate erat neque eget nibh. Orci varius natoque penatibus et magnis dis\r\n  parturient montes, nascetur ridiculus mus. Integer sit amet eros nec arcu\r\n  vestibulum mattis. Pellentesque vitae mauris nunc. Mauris sed tortor ac nibh\r\n  tempor gravida. Donec cursus, nulla et auctor sollicitudin, nibh orci accumsan\r\n  nunc, ultricies malesuada risus lectus vitae mauris. Ut eu tortor porttitor\r\n  ligula venenatis sodales. Morbi sollicitudin nulla vel neque hendrerit euismod\r\n  non eget purus. Donec non nisi quis urna sagittis sagittis. Fusce ut varius\r\n  velit. Fusce ac sollicitudin tellus. Integer finibus, purus quis volutpat\r\n  dignissim, velit leo interdum est, vel auctor neque odio vel lectus. Vivamus\r\n  ac tortor nulla. Suspendisse tempor imperdiet eros, placerat maximus augue\r\n  elementum vel. Aliquam varius leo magna, ut finibus ipsum ullamcorper at.\r\n  Mauris sed tortor ac nibh tempor gravida. Donec cursus, nulla et auctor\r\n  sollicitudin, nibh orci accumsan nunc, ultricies malesuada risus lectus vitae\r\n  mauris. Ut eu tortor porttitor ligula venenatis sodales. Morbi sollicitudin\r\n  nulla vel neque hendrerit euismod non eget purus. Donec non nisi quis urna\r\n  sagittis sagittis. Fusce ut varius velit. Fusce ac sollicitudin tellus.\r\n  Integer finibus, purus quis volutpat dignissim, velit leo interdum est, vel\r\n  auctor neque odio vel lectus. Vivamus ac tortor nulla. Suspendisse tempor\r\n  imperdiet eros, placerat maximus augue elementum vel. Aliquam varius leo\r\n  magna, ut finibus ipsum ullamcorper at.\"";
    			add_location(div, file$z, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$D($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TermOfServices', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TermOfServices> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class TermOfServices extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TermOfServices",
    			options,
    			id: create_fragment$D.name
    		});
    	}
    }

    /* src\components\legal\Legal.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1$1 } = globals;
    const file$y = "src\\components\\legal\\Legal.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[15] = list;
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (79:10) 
    function create_header_slot(ctx) {
    	let div1;
    	let div0;
    	let input;
    	let t0;
    	let p;
    	let t1;
    	let t2_value = /*item*/ ctx[14].name + "";
    	let t2;
    	let t3;
    	let toggle_ico;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[9].call(input, /*item*/ ctx[14]);
    	}

    	toggle_ico = new Toggle_ico({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			p = element("p");
    			t1 = text("I agree to ");
    			t2 = text(t2_value);
    			t3 = space();
    			create_component(toggle_ico.$$.fragment);
    			t4 = space();
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "input-ch-sv svelte-1hybluk");
    			attr_dev(input, "id", /*item*/ ctx[14].name);
    			add_location(input, file$y, 80, 14, 2357);
    			attr_dev(p, "class", "label-sv svelte-1hybluk");
    			add_location(p, file$y, 89, 14, 2653);
    			attr_dev(div0, "class", "column svelte-1hybluk");
    			add_location(div0, file$y, 79, 12, 2321);
    			attr_dev(div1, "slot", "header");
    			attr_dev(div1, "class", "header svelte-1hybluk");
    			add_location(div1, file$y, 78, 10, 2273);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			input.checked = /*$checkboxStates*/ ctx[3][/*item*/ ctx[14].key];
    			append_dev(div0, t0);
    			append_dev(div0, p);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(div1, t3);
    			mount_component(toggle_ico, div1, null);
    			append_dev(div1, t4);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "click", click_handler, false, false, false),
    					listen_dev(input, "change", input_change_handler)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$checkboxStates, legalItems*/ 8) {
    				input.checked = /*$checkboxStates*/ ctx[3][/*item*/ ctx[14].key];
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toggle_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toggle_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(toggle_ico);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_header_slot.name,
    		type: "slot",
    		source: "(79:10) ",
    		ctx
    	});

    	return block;
    }

    // (94:10) 
    function create_body_slot(ctx) {
    	let div1;
    	let div0;
    	let h3;
    	let t0_value = /*item*/ ctx[14].title + "";
    	let t0;
    	let t1;
    	let p;
    	let switch_instance;
    	let t2;
    	let current;
    	var switch_value = /*legalComponents*/ ctx[5][/*item*/ ctx[14].key];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t2 = space();
    			attr_dev(h3, "class", "body__head svelte-1hybluk");
    			add_location(h3, file$y, 95, 14, 2852);
    			add_location(p, file$y, 96, 14, 2908);
    			attr_dev(div0, "class", "legal__content svelte-1hybluk");
    			add_location(div0, file$y, 94, 12, 2808);
    			attr_dev(div1, "slot", "body");
    			add_location(div1, file$y, 93, 10, 2777);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p);

    			if (switch_instance) {
    				mount_component(switch_instance, p, null);
    			}

    			append_dev(div1, t2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*legalComponents*/ ctx[5][/*item*/ ctx[14].key])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, p, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_body_slot.name,
    		type: "slot",
    		source: "(94:10) ",
    		ctx
    	});

    	return block;
    }

    // (77:6) {#each legalItems as item}
    function create_each_block$6(ctx) {
    	let accordionitem;
    	let current;

    	accordionitem = new AccordionItem({
    			props: {
    				key: /*item*/ ctx[14].key,
    				$$slots: {
    					body: [create_body_slot],
    					header: [create_header_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(accordionitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(accordionitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const accordionitem_changes = {};

    			if (dirty & /*$$scope, $checkboxStates*/ 131080) {
    				accordionitem_changes.$$scope = { dirty, ctx };
    			}

    			accordionitem.$set(accordionitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accordionitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accordionitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(accordionitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(77:6) {#each legalItems as item}",
    		ctx
    	});

    	return block;
    }

    // (76:4) <Accordion bind:key={openedKey}>
    function create_default_slot$7(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = legalItems;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*legalItems, legalComponents, $checkboxStates*/ 40) {
    				each_value = legalItems;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(76:4) <Accordion bind:key={openedKey}>",
    		ctx
    	});

    	return block;
    }

    // (121:4) {#if errorMessageState}
    function create_if_block$d(ctx) {
    	let errormessage;
    	let current;

    	errormessage = new ErrorMessage({
    			props: { errorMessage: /*errorMessage*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(errormessage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(errormessage, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const errormessage_changes = {};
    			if (dirty & /*errorMessage*/ 4) errormessage_changes.errorMessage = /*errorMessage*/ ctx[2];
    			errormessage.$set(errormessage_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(errormessage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(errormessage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(errormessage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(121:4) {#if errorMessageState}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$C(ctx) {
    	let div4;
    	let div1;
    	let h2;
    	let t0;
    	let span;
    	let t2;
    	let accordion;
    	let updating_key;
    	let t3;
    	let div0;
    	let input;
    	let t4;
    	let label;
    	let t6;
    	let div3;
    	let t7;
    	let div2;
    	let buttonleft;
    	let t8;
    	let buttonright;
    	let current;
    	let mounted;
    	let dispose;

    	function accordion_key_binding(value) {
    		/*accordion_key_binding*/ ctx[10](value);
    	}

    	let accordion_props = {
    		$$slots: { default: [create_default_slot$7] },
    		$$scope: { ctx }
    	};

    	if (/*openedKey*/ ctx[0] !== void 0) {
    		accordion_props.key = /*openedKey*/ ctx[0];
    	}

    	accordion = new Accordion({ props: accordion_props, $$inline: true });
    	binding_callbacks.push(() => bind(accordion, 'key', accordion_key_binding));
    	let if_block = /*errorMessageState*/ ctx[1] && create_if_block$d(ctx);
    	buttonleft = new ButtonLeft({ $$inline: true });
    	buttonleft.$on("click", /*prevStep*/ ctx[7]);
    	buttonright = new ButtonRight({ $$inline: true });
    	buttonright.$on("click", /*nextStep*/ ctx[8]);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			h2 = element("h2");
    			t0 = text("Legal ");
    			span = element("span");
    			span.textContent = "Agreement";
    			t2 = space();
    			create_component(accordion.$$.fragment);
    			t3 = space();
    			div0 = element("div");
    			input = element("input");
    			t4 = space();
    			label = element("label");
    			label.textContent = "I agree to all Terms & Conditions, Contract Agreement, Privacy & Cookie";
    			t6 = space();
    			div3 = element("div");
    			if (if_block) if_block.c();
    			t7 = space();
    			div2 = element("div");
    			create_component(buttonleft.$$.fragment);
    			t8 = space();
    			create_component(buttonright.$$.fragment);
    			attr_dev(span, "class", "green svelte-1hybluk");
    			add_location(span, file$y, 74, 28, 2108);
    			attr_dev(h2, "class", "h2-sv svelte-1hybluk");
    			add_location(h2, file$y, 74, 4, 2084);
    			attr_dev(input, "class", "input-ch-sv svelte-1hybluk");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "agree__all");
    			input.checked = /*$allSelected*/ ctx[4];
    			add_location(input, file$y, 105, 6, 3137);
    			attr_dev(label, "class", "label-sv svelte-1hybluk");
    			attr_dev(label, "for", "agree__all");
    			add_location(label, file$y, 114, 6, 3342);
    			attr_dev(div0, "class", "agree__all svelte-1hybluk");
    			add_location(div0, file$y, 104, 4, 3105);
    			add_location(div1, file$y, 73, 2, 2073);
    			attr_dev(div2, "class", "bottom__btns");
    			add_location(div2, file$y, 123, 4, 3622);
    			attr_dev(div3, "class", "relative__wrapper svelte-1hybluk");
    			add_location(div3, file$y, 119, 2, 3506);
    			attr_dev(div4, "class", "legal__wrapper svelte-1hybluk");
    			add_location(div4, file$y, 72, 0, 2041);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, h2);
    			append_dev(h2, t0);
    			append_dev(h2, span);
    			append_dev(div1, t2);
    			mount_component(accordion, div1, null);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			append_dev(div0, t4);
    			append_dev(div0, label);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			if (if_block) if_block.m(div3, null);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			mount_component(buttonleft, div2, null);
    			append_dev(div2, t8);
    			mount_component(buttonright, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const accordion_changes = {};

    			if (dirty & /*$$scope, $checkboxStates*/ 131080) {
    				accordion_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_key && dirty & /*openedKey*/ 1) {
    				updating_key = true;
    				accordion_changes.key = /*openedKey*/ ctx[0];
    				add_flush_callback(() => updating_key = false);
    			}

    			accordion.$set(accordion_changes);

    			if (!current || dirty & /*$allSelected*/ 16) {
    				prop_dev(input, "checked", /*$allSelected*/ ctx[4]);
    			}

    			if (/*errorMessageState*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*errorMessageState*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div3, t7);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accordion.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(buttonleft.$$.fragment, local);
    			transition_in(buttonright.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accordion.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(buttonleft.$$.fragment, local);
    			transition_out(buttonright.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(accordion);
    			if (if_block) if_block.d();
    			destroy_component(buttonleft);
    			destroy_component(buttonright);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const click_handler = e => {
    	e.stopPropagation();
    };

    function instance$C($$self, $$props, $$invalidate) {
    	let $headSteps;
    	let $checkboxStates;
    	let $allSelected;
    	validate_store(headSteps, 'headSteps');
    	component_subscribe($$self, headSteps, $$value => $$invalidate(13, $headSteps = $$value));
    	validate_store(checkboxStates, 'checkboxStates');
    	component_subscribe($$self, checkboxStates, $$value => $$invalidate(3, $checkboxStates = $$value));
    	validate_store(allSelected, 'allSelected');
    	component_subscribe($$self, allSelected, $$value => $$invalidate(4, $allSelected = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Legal', slots, []);
    	let openedKey = "a";
    	let changeCounter = 0;
    	let errorMessageState = false;
    	let errorMessage;

    	const legalComponents = {
    		a: TermsAndCond,
    		b: TermOfServices,
    		c: Privacy
    	};

    	afterUpdate(() => {
    		if ($checkboxStates.a && $checkboxStates.b && $checkboxStates.c) {
    			set_store_value(allSelected, $allSelected = true, $allSelected);
    			$$invalidate(1, errorMessageState = false);
    		} else {
    			set_store_value(allSelected, $allSelected = false, $allSelected);
    		}
    	});

    	function agreeAllTerms(e) {
    		if (e.target.checked) {
    			set_store_value(checkboxStates, $checkboxStates.a = true, $checkboxStates);
    			set_store_value(checkboxStates, $checkboxStates.b = true, $checkboxStates);
    			set_store_value(checkboxStates, $checkboxStates.c = true, $checkboxStates);
    			set_store_value(allSelected, $allSelected = true, $allSelected);
    		} else {
    			set_store_value(checkboxStates, $checkboxStates.a = false, $checkboxStates);
    			set_store_value(checkboxStates, $checkboxStates.b = false, $checkboxStates);
    			set_store_value(checkboxStates, $checkboxStates.c = false, $checkboxStates);
    			set_store_value(allSelected, $allSelected = false, $allSelected);
    		}
    	}

    	let prevStep = () => {
    		decrementStep();
    		scrollToTop$1();
    	};

    	let nextStep = () => {
    		let state = Object.values($checkboxStates).every(value => value === true);

    		if (state) {
    			set_store_value(headSteps, $headSteps.fourthStep = true, $headSteps);

    			if (changeCounter === 0) {
    				incrementStep();
    				changeCounter += 1;
    				scrollToTop$1();
    			}
    		} else {
    			$$invalidate(1, errorMessageState = true);
    			$$invalidate(2, errorMessage = "Confirm all legal agreements");
    		}
    	};

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Legal> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler(item) {
    		$checkboxStates[item.key] = this.checked;
    		checkboxStates.set($checkboxStates);
    	}

    	function accordion_key_binding(value) {
    		openedKey = value;
    		$$invalidate(0, openedKey);
    	}

    	const change_handler = e => {
    		agreeAllTerms(e);
    	};

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		Accordion,
    		AccordionItem,
    		openedKey,
    		checkboxStates,
    		legalItems,
    		allSelected,
    		headSteps,
    		incrementStep,
    		decrementStep,
    		ButtonLeft,
    		ButtonRight,
    		scrollToTop: scrollToTop$1,
    		ErrorMessage,
    		Toggle_ico,
    		TermsAndCond,
    		Privacy,
    		TermOfServices,
    		changeCounter,
    		errorMessageState,
    		errorMessage,
    		legalComponents,
    		agreeAllTerms,
    		prevStep,
    		nextStep,
    		$headSteps,
    		$checkboxStates,
    		$allSelected
    	});

    	$$self.$inject_state = $$props => {
    		if ('openedKey' in $$props) $$invalidate(0, openedKey = $$props.openedKey);
    		if ('changeCounter' in $$props) changeCounter = $$props.changeCounter;
    		if ('errorMessageState' in $$props) $$invalidate(1, errorMessageState = $$props.errorMessageState);
    		if ('errorMessage' in $$props) $$invalidate(2, errorMessage = $$props.errorMessage);
    		if ('prevStep' in $$props) $$invalidate(7, prevStep = $$props.prevStep);
    		if ('nextStep' in $$props) $$invalidate(8, nextStep = $$props.nextStep);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		openedKey,
    		errorMessageState,
    		errorMessage,
    		$checkboxStates,
    		$allSelected,
    		legalComponents,
    		agreeAllTerms,
    		prevStep,
    		nextStep,
    		input_change_handler,
    		accordion_key_binding,
    		change_handler
    	];
    }

    class Legal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$C, create_fragment$C, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Legal",
    			options,
    			id: create_fragment$C.name
    		});
    	}
    }

    async function getCountriesFromDB() {
        const url = `https://be.esi.kdg.com.ua/esi_public/esi_public/backend/getCountries`;
        try {
            const res = await fetch(url);
    		const json = await res.json();
            if (res.ok) {
    			return json;
    		} else {
    			throw new Error(json);
    		}
        } catch (error) {
          console.log(error.message);
        }
      }

    /* src\components\information\TabForms\CountryDropdown.svelte generated by Svelte v3.48.0 */
    const file$x = "src\\components\\information\\TabForms\\CountryDropdown.svelte";

    function create_fragment$B(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div0;
    	let t1_value = /*$contributionData*/ ctx[1].country.phoneCode + "";
    	let t1;
    	let div2_resize_listener;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			if (!src_url_equal(img.src, img_src_value = "data:" + (/*$contributionData*/ ctx[1].country.icon.image.mime || undefined) + ";base64," + /*$contributionData*/ ctx[1].country.icon.image.data)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*$contributionData*/ ctx[1].country.countryName);
    			attr_dev(img, "class", "flag svelte-fff7dt");
    			add_location(img, file$x, 47, 6, 1476);
    			attr_dev(div0, "class", "counry__code svelte-fff7dt");
    			add_location(div0, file$x, 53, 6, 1712);
    			attr_dev(div1, "class", "current__val svelte-fff7dt");
    			add_location(div1, file$x, 46, 4, 1442);
    			attr_dev(div2, "class", "country__tels--dropdown svelte-fff7dt");
    			add_render_callback(() => /*div2_elementresize_handler*/ ctx[2].call(div2));
    			add_location(div2, file$x, 45, 2, 1359);
    			attr_dev(div3, "class", "tels--dropdown__wrapper svelte-fff7dt");
    			add_location(div3, file$x, 44, 0, 1318);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			div2_resize_listener = add_resize_listener(div2, /*div2_elementresize_handler*/ ctx[2].bind(div2));
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$contributionData*/ 2 && !src_url_equal(img.src, img_src_value = "data:" + (/*$contributionData*/ ctx[1].country.icon.image.mime || undefined) + ";base64," + /*$contributionData*/ ctx[1].country.icon.image.data)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*$contributionData*/ 2 && img_alt_value !== (img_alt_value = /*$contributionData*/ ctx[1].country.countryName)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*$contributionData*/ 2 && t1_value !== (t1_value = /*$contributionData*/ ctx[1].country.phoneCode + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			div2_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	let $calcInputPhonePadding;
    	let $contributionData;
    	validate_store(calcInputPhonePadding, 'calcInputPhonePadding');
    	component_subscribe($$self, calcInputPhonePadding, $$value => $$invalidate(3, $calcInputPhonePadding = $$value));
    	validate_store(contributionData, 'contributionData');
    	component_subscribe($$self, contributionData, $$value => $$invalidate(1, $contributionData = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CountryDropdown', slots, []);
    	let countryDropdownWidth;

    	// function setActiveCounty(ind) {
    	//   $selectedCountry = countries[ind];
    	//   console.log($selectedCountry);
    	// }
    	// click outside dropdown
    	// function handleClickOutside(item) {
    	//   if (item === "active") {
    	//     active = false;
    	//   }
    	// }
    	onMount(async () => {
    		
    	}); // let allData = await getCountriesFromDB();
    	// console.log(allData)
    	// let parsedData = JSON.parse(allData)
    	// console.log(parsedData)

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CountryDropdown> was created with unknown prop '${key}'`);
    	});

    	function div2_elementresize_handler() {
    		countryDropdownWidth = this.clientWidth;
    		$$invalidate(0, countryDropdownWidth);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		calcInputPhonePadding,
    		selectedCountry,
    		getCountriesFromDB,
    		contributionData,
    		countryDropdownWidth,
    		$calcInputPhonePadding,
    		$contributionData
    	});

    	$$self.$inject_state = $$props => {
    		if ('countryDropdownWidth' in $$props) $$invalidate(0, countryDropdownWidth = $$props.countryDropdownWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*countryDropdownWidth*/ 1) {
    			// let countries = [];
    			{
    				set_store_value(calcInputPhonePadding, $calcInputPhonePadding = countryDropdownWidth + 15, $calcInputPhonePadding);
    			}
    		}
    	};

    	return [countryDropdownWidth, $contributionData, div2_elementresize_handler];
    }

    class CountryDropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CountryDropdown",
    			options,
    			id: create_fragment$B.name
    		});
    	}
    }

    /* src\components\information\TabForms\ContactForm.svelte generated by Svelte v3.48.0 */
    const file$w = "src\\components\\information\\TabForms\\ContactForm.svelte";

    // (29:4) {#if $loginData.err.userName}
    function create_if_block_2$7(ctx) {
    	let p;
    	let t_value = /*$loginData*/ ctx[1].err.userName + "";
    	let t;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "error__message svelte-23kwmj");
    			add_location(p, file$w, 29, 6, 867);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$loginData*/ 2) && t_value !== (t_value = /*$loginData*/ ctx[1].err.userName + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, true);
    					p_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, false);
    				p_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$7.name,
    		type: "if",
    		source: "(29:4) {#if $loginData.err.userName}",
    		ctx
    	});

    	return block;
    }

    // (44:4) {#if $loginData.err.email}
    function create_if_block_1$a(ctx) {
    	let p;
    	let t_value = /*$loginData*/ ctx[1].err.email + "";
    	let t;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "error__message svelte-23kwmj");
    			add_location(p, file$w, 44, 6, 1240);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$loginData*/ 2) && t_value !== (t_value = /*$loginData*/ ctx[1].err.email + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, true);
    					p_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, false);
    				p_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(44:4) {#if $loginData.err.email}",
    		ctx
    	});

    	return block;
    }

    // (66:4) {#if $loginData.err.phone}
    function create_if_block$c(ctx) {
    	let p;
    	let t_value = /*$loginData*/ ctx[1].err.phone + "";
    	let t;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "error__message last svelte-23kwmj");
    			add_location(p, file$w, 66, 6, 1798);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$loginData*/ 2) && t_value !== (t_value = /*$loginData*/ ctx[1].err.phone + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, true);
    					p_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, false);
    				p_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(66:4) {#if $loginData.err.phone}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$A(ctx) {
    	let div4;
    	let div0;
    	let t1;
    	let div1;
    	let t3;
    	let div3;
    	let input0;
    	let t4;
    	let t5;
    	let input1;
    	let t6;
    	let t7;
    	let div2;
    	let countrydropdown;
    	let t8;
    	let input2;
    	let t9;
    	let div4_intro;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$loginData*/ ctx[1].err.userName && create_if_block_2$7(ctx);
    	let if_block1 = /*$loginData*/ ctx[1].err.email && create_if_block_1$a(ctx);
    	countrydropdown = new CountryDropdown({ $$inline: true });
    	let if_block2 = /*$loginData*/ ctx[1].err.phone && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			div0.textContent = "Contact";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "Please put your legal Phone and Email";
    			t3 = space();
    			div3 = element("div");
    			input0 = element("input");
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			input1 = element("input");
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			div2 = element("div");
    			create_component(countrydropdown.$$.fragment);
    			t8 = space();
    			input2 = element("input");
    			t9 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div0, "class", "tab__head");
    			add_location(div0, file$w, 15, 2, 446);
    			attr_dev(div1, "class", "tab__subhead");
    			add_location(div1, file$w, 16, 2, 486);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "input-sv svelte-23kwmj");
    			attr_dev(input0, "placeholder", "Username");
    			attr_dev(input0, "autocomplete", "");
    			toggle_class(input0, "error", /*$loginData*/ ctx[1].err.userName);
    			add_location(input0, file$w, 18, 4, 596);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "class", "input-sv svelte-23kwmj");
    			attr_dev(input1, "placeholder", "Email");
    			attr_dev(input1, "autocomplete", "");
    			toggle_class(input1, "error", /*$loginData*/ ctx[1].err.email);
    			add_location(input1, file$w, 34, 4, 982);
    			set_style(input2, "padding-left", /*$calcInputPhonePadding*/ ctx[2] + "px");
    			attr_dev(input2, "type", "tel");
    			attr_dev(input2, "class", "input-sv second-tel svelte-23kwmj");
    			attr_dev(input2, "maxlength", "20");
    			attr_dev(input2, "autocomplete", "");
    			toggle_class(input2, "error", /*$loginData*/ ctx[1].err.phone);
    			add_location(input2, file$w, 51, 6, 1415);
    			attr_dev(div2, "class", "tel-wrapper svelte-23kwmj");
    			add_location(div2, file$w, 48, 4, 1350);
    			attr_dev(div3, "class", "tab__form__fields");
    			add_location(div3, file$w, 17, 2, 559);
    			attr_dev(div4, "class", "tab__wrapper");
    			add_location(div4, file$w, 14, 0, 408);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div4, t1);
    			append_dev(div4, div1);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, input0);
    			set_input_value(input0, /*$loginData*/ ctx[1].userName);
    			append_dev(div3, t4);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div3, t5);
    			append_dev(div3, input1);
    			set_input_value(input1, /*$loginData*/ ctx[1].email);
    			append_dev(div3, t6);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			mount_component(countrydropdown, div2, null);
    			append_dev(div2, t8);
    			append_dev(div2, input2);
    			set_input_value(input2, /*$loginData*/ ctx[1].phone);
    			append_dev(div3, t9);
    			if (if_block2) if_block2.m(div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(
    						input0,
    						"focus",
    						function () {
    							if (is_function(/*loginData*/ ctx[0].clear)) /*loginData*/ ctx[0].clear.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    					listen_dev(
    						input1,
    						"focus",
    						function () {
    							if (is_function(/*loginData*/ ctx[0].clear)) /*loginData*/ ctx[0].clear.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						input2,
    						"focus",
    						function () {
    							if (is_function(/*loginData*/ ctx[0].clear)) /*loginData*/ ctx[0].clear.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input2, "input", checkInputValue, false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[6])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*$loginData*/ 2 && input0.value !== /*$loginData*/ ctx[1].userName) {
    				set_input_value(input0, /*$loginData*/ ctx[1].userName);
    			}

    			if (dirty & /*$loginData*/ 2) {
    				toggle_class(input0, "error", /*$loginData*/ ctx[1].err.userName);
    			}

    			if (/*$loginData*/ ctx[1].err.userName) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$loginData*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$7(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div3, t5);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*$loginData*/ 2 && input1.value !== /*$loginData*/ ctx[1].email) {
    				set_input_value(input1, /*$loginData*/ ctx[1].email);
    			}

    			if (dirty & /*$loginData*/ 2) {
    				toggle_class(input1, "error", /*$loginData*/ ctx[1].err.email);
    			}

    			if (/*$loginData*/ ctx[1].err.email) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$loginData*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$a(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div3, t7);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*$calcInputPhonePadding*/ 4) {
    				set_style(input2, "padding-left", /*$calcInputPhonePadding*/ ctx[2] + "px");
    			}

    			if (dirty & /*$loginData*/ 2) {
    				set_input_value(input2, /*$loginData*/ ctx[1].phone);
    			}

    			if (dirty & /*$loginData*/ 2) {
    				toggle_class(input2, "error", /*$loginData*/ ctx[1].err.phone);
    			}

    			if (/*$loginData*/ ctx[1].err.phone) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*$loginData*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$c(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div3, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(countrydropdown.$$.fragment, local);
    			transition_in(if_block2);

    			if (!div4_intro) {
    				add_render_callback(() => {
    					div4_intro = create_in_transition(div4, fade, {});
    					div4_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(countrydropdown.$$.fragment, local);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(countrydropdown);
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
    	let $selectedCountry;

    	let $loginData,
    		$$unsubscribe_loginData = noop,
    		$$subscribe_loginData = () => ($$unsubscribe_loginData(), $$unsubscribe_loginData = subscribe(loginData, $$value => $$invalidate(1, $loginData = $$value)), loginData);

    	let $calcInputPhonePadding;
    	validate_store(selectedCountry, 'selectedCountry');
    	component_subscribe($$self, selectedCountry, $$value => $$invalidate(3, $selectedCountry = $$value));
    	validate_store(calcInputPhonePadding, 'calcInputPhonePadding');
    	component_subscribe($$self, calcInputPhonePadding, $$value => $$invalidate(2, $calcInputPhonePadding = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_loginData());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContactForm', slots, []);
    	let { loginData } = $$props;
    	validate_store(loginData, 'loginData');
    	$$subscribe_loginData();
    	const writable_props = ['loginData'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ContactForm> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		$loginData.userName = this.value;
    		loginData.set($loginData);
    	}

    	function input1_input_handler() {
    		$loginData.email = this.value;
    		loginData.set($loginData);
    	}

    	function input2_input_handler() {
    		$loginData.phone = this.value;
    		loginData.set($loginData);
    	}

    	$$self.$$set = $$props => {
    		if ('loginData' in $$props) $$subscribe_loginData($$invalidate(0, loginData = $$props.loginData));
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		slide,
    		checkInputValue,
    		loginData,
    		infoFormData,
    		calcInputPhonePadding,
    		selectedCountry,
    		CountryDropdown,
    		$selectedCountry,
    		$loginData,
    		$calcInputPhonePadding
    	});

    	$$self.$inject_state = $$props => {
    		if ('loginData' in $$props) $$subscribe_loginData($$invalidate(0, loginData = $$props.loginData));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$selectedCountry*/ 8) {
    			{
    				set_store_value(loginData, $loginData.phoneCode = "%2B" + $selectedCountry?.phoneCode, $loginData);
    			}
    		}
    	};

    	return [
    		loginData,
    		$loginData,
    		$calcInputPhonePadding,
    		$selectedCountry,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class ContactForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, { loginData: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContactForm",
    			options,
    			id: create_fragment$A.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*loginData*/ ctx[0] === undefined && !('loginData' in props)) {
    			console.warn("<ContactForm> was created without expected prop 'loginData'");
    		}
    	}

    	get loginData() {
    		throw new Error("<ContactForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loginData(value) {
    		throw new Error("<ContactForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* public\images\Tab_name_ico.svelte generated by Svelte v3.48.0 */

    const file$v = "public\\images\\Tab_name_ico.svelte";

    function create_fragment$z(ctx) {
    	let svg;
    	let g;
    	let path0;
    	let path1;
    	let defs;
    	let clipPath;
    	let rect;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			defs = svg_element("defs");
    			clipPath = svg_element("clipPath");
    			rect = svg_element("rect");
    			attr_dev(path0, "d", "M7 7C7.69223 7 8.36892 6.79473 8.9445 6.41015C9.52007 6.02556 9.96867 5.47894 10.2336 4.83939C10.4985 4.19985 10.5678 3.49612 10.4327 2.81719C10.2977 2.13825 9.96436 1.51461 9.47487 1.02513C8.98539 0.535644 8.36175 0.202301 7.68282 0.0672531C7.00388 -0.0677952 6.30015 0.0015165 5.66061 0.266423C5.02107 0.53133 4.47444 0.979934 4.08986 1.55551C3.70527 2.13108 3.5 2.80777 3.5 3.5C3.50093 4.42798 3.86997 5.31768 4.52615 5.97385C5.18233 6.63003 6.07203 6.99908 7 7ZM7 1.16667C7.46149 1.16667 7.91262 1.30352 8.29633 1.55991C8.68005 1.8163 8.97912 2.18071 9.15572 2.60707C9.33232 3.03343 9.37853 3.50259 9.2885 3.95521C9.19847 4.40784 8.97624 4.8236 8.64992 5.14992C8.32359 5.47624 7.90783 5.69847 7.45521 5.7885C7.00259 5.87853 6.53343 5.83233 6.10707 5.65572C5.68071 5.47912 5.31629 5.18005 5.0599 4.79633C4.80351 4.41262 4.66667 3.96149 4.66667 3.5C4.66667 2.88116 4.9125 2.28767 5.35008 1.85009C5.78767 1.4125 6.38116 1.16667 7 1.16667Z");
    			attr_dev(path0, "fill", "#E4E4E4");
    			add_location(path0, file$v, 9, 4, 191);
    			attr_dev(path1, "d", "M7 8.16675C5.60809 8.16829 4.27363 8.72191 3.28939 9.70614C2.30516 10.6904 1.75154 12.0248 1.75 13.4167C1.75 13.5715 1.81146 13.7198 1.92085 13.8292C2.03025 13.9386 2.17862 14.0001 2.33333 14.0001C2.48804 14.0001 2.63642 13.9386 2.74581 13.8292C2.85521 13.7198 2.91667 13.5715 2.91667 13.4167C2.91667 12.3338 3.34687 11.2952 4.11265 10.5294C4.87842 9.76362 5.91703 9.33341 7 9.33341C8.08297 9.33341 9.12158 9.76362 9.88735 10.5294C10.6531 11.2952 11.0833 12.3338 11.0833 13.4167C11.0833 13.5715 11.1448 13.7198 11.2542 13.8292C11.3636 13.9386 11.512 14.0001 11.6667 14.0001C11.8214 14.0001 11.9697 13.9386 12.0791 13.8292C12.1885 13.7198 12.25 13.5715 12.25 13.4167C12.2485 12.0248 11.6948 10.6904 10.7106 9.70614C9.72637 8.72191 8.39191 8.16829 7 8.16675Z");
    			attr_dev(path1, "fill", "#E4E4E4");
    			add_location(path1, file$v, 13, 4, 1187);
    			attr_dev(g, "clip-path", "url(#clip0_3547_3996)");
    			add_location(g, file$v, 8, 4, 148);
    			attr_dev(rect, "width", "14");
    			attr_dev(rect, "height", "14");
    			attr_dev(rect, "fill", "white");
    			add_location(rect, file$v, 20, 8, 2063);
    			attr_dev(clipPath, "id", "clip0_3547_3996");
    			add_location(clipPath, file$v, 19, 4, 2022);
    			add_location(defs, file$v, 18, 4, 2010);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "14");
    			attr_dev(svg, "height", "14");
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", "active");
    			add_location(svg, file$v, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    			append_dev(svg, defs);
    			append_dev(defs, clipPath);
    			append_dev(clipPath, rect);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab_name_ico', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tab_name_ico> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Tab_name_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab_name_ico",
    			options,
    			id: create_fragment$z.name
    		});
    	}
    }

    /* public\images\Tab_address_ico.svelte generated by Svelte v3.48.0 */

    const file$u = "public\\images\\Tab_address_ico.svelte";

    function create_fragment$y(ctx) {
    	let svg;
    	let g;
    	let path0;
    	let path1;
    	let defs;
    	let clipPath;
    	let rect;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			defs = svg_element("defs");
    			clipPath = svg_element("clipPath");
    			rect = svg_element("rect");
    			attr_dev(path0, "d", "M6.99935 3.5C6.53786 3.5 6.08673 3.63685 5.70302 3.89324C5.31931 4.14963 5.02024 4.51404 4.84363 4.94041C4.66703 5.36677 4.62082 5.83592 4.71085 6.28854C4.80088 6.74117 5.02311 7.15693 5.34943 7.48325C5.67576 7.80957 6.09152 8.0318 6.54414 8.12183C6.99676 8.21186 7.46592 8.16566 7.89228 7.98905C8.31864 7.81245 8.68306 7.51338 8.93945 7.12966C9.19584 6.74595 9.33268 6.29482 9.33268 5.83333C9.33268 5.21449 9.08685 4.621 8.64927 4.18342C8.21168 3.74583 7.61819 3.5 6.99935 3.5ZM6.99935 7C6.76861 7 6.54304 6.93158 6.35119 6.80338C6.15933 6.67519 6.00979 6.49298 5.92149 6.2798C5.83319 6.06662 5.81008 5.83204 5.8551 5.60573C5.90012 5.37942 6.01123 5.17154 6.17439 5.00838C6.33755 4.84521 6.54543 4.7341 6.77174 4.68908C6.99806 4.64407 7.23263 4.66717 7.44581 4.75547C7.65899 4.84378 7.8412 4.99331 7.9694 5.18517C8.09759 5.37703 8.16602 5.60259 8.16602 5.83333C8.16602 6.14275 8.0431 6.4395 7.82431 6.65829C7.60552 6.87708 7.30877 7 6.99935 7Z");
    			attr_dev(path0, "fill", "#E4E4E4");
    			add_location(path0, file$u, 9, 4, 198);
    			attr_dev(path1, "d", "M7.00018 13.9999C6.50898 14.0025 6.02433 13.8873 5.5868 13.664C5.14928 13.4407 4.77161 13.1158 4.48543 12.7166C2.26235 9.65003 1.13477 7.3447 1.13477 5.8642C1.13477 4.30859 1.75273 2.8167 2.85271 1.71672C3.95269 0.616741 5.44458 -0.0012207 7.00018 -0.0012207C8.55579 -0.0012207 10.0477 0.616741 11.1477 1.71672C12.2476 2.8167 12.8656 4.30859 12.8656 5.8642C12.8656 7.3447 11.738 9.65003 9.51493 12.7166C9.22875 13.1158 8.85109 13.4407 8.41356 13.664C7.97604 13.8873 7.49138 14.0025 7.00018 13.9999ZM7.00018 1.2722C5.78243 1.27359 4.61494 1.75795 3.75386 2.61904C2.89277 3.48012 2.40841 4.64761 2.40702 5.86536C2.40702 7.03786 3.51127 9.20611 5.5156 11.9705C5.68575 12.2049 5.90898 12.3957 6.16702 12.5272C6.42505 12.6587 6.71056 12.7273 7.00018 12.7273C7.28981 12.7273 7.57532 12.6587 7.83335 12.5272C8.09138 12.3957 8.31461 12.2049 8.48477 11.9705C10.4891 9.20611 11.5934 7.03786 11.5934 5.86536C11.592 4.64761 11.1076 3.48012 10.2465 2.61904C9.38542 1.75795 8.21794 1.27359 7.00018 1.2722Z");
    			attr_dev(path1, "fill", "#E4E4E4");
    			add_location(path1, file$u, 13, 4, 1199);
    			attr_dev(g, "clip-path", "url(#clip0_3547_4001)");
    			add_location(g, file$u, 8, 4, 155);
    			attr_dev(rect, "width", "14");
    			attr_dev(rect, "height", "14");
    			attr_dev(rect, "fill", "white");
    			add_location(rect, file$u, 20, 8, 2310);
    			attr_dev(clipPath, "id", "clip0_3547_4001");
    			add_location(clipPath, file$u, 19, 4, 2269);
    			add_location(defs, file$u, 18, 4, 2257);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "14");
    			attr_dev(svg, "height", "14");
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", svg_class_value = /*$$props*/ ctx[0].class);
    			add_location(svg, file$u, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    			append_dev(svg, defs);
    			append_dev(defs, clipPath);
    			append_dev(clipPath, rect);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && svg_class_value !== (svg_class_value = /*$$props*/ ctx[0].class)) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab_address_ico', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Tab_address_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab_address_ico",
    			options,
    			id: create_fragment$y.name
    		});
    	}
    }

    /* public\images\Tab_pw_ico.svelte generated by Svelte v3.48.0 */

    const file$t = "public\\images\\Tab_pw_ico.svelte";

    function create_fragment$x(ctx) {
    	let svg;
    	let g;
    	let path0;
    	let path1;
    	let defs;
    	let clipPath;
    	let rect;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			defs = svg_element("defs");
    			clipPath = svg_element("clipPath");
    			rect = svg_element("rect");
    			attr_dev(path0, "d", "M11.0827 4.914V4.08333C11.0827 3.00037 10.6525 1.96175 9.8867 1.19598C9.12093 0.430207 8.08232 0 6.99935 0C5.91638 0 4.87777 0.430207 4.112 1.19598C3.34622 1.96175 2.91602 3.00037 2.91602 4.08333V4.914C2.39648 5.14074 1.95427 5.51397 1.64347 5.98804C1.33268 6.46211 1.16676 7.01647 1.16602 7.58333V11.0833C1.16694 11.8566 1.47453 12.5979 2.02131 13.1447C2.56809 13.6915 3.30942 13.9991 4.08268 14H9.91602C10.6893 13.9991 11.4306 13.6915 11.9774 13.1447C12.5242 12.5979 12.8318 11.8566 12.8327 11.0833V7.58333C12.8319 7.01647 12.666 6.46211 12.3552 5.98804C12.0444 5.51397 11.6022 5.14074 11.0827 4.914ZM4.08268 4.08333C4.08268 3.30979 4.38997 2.56792 4.93695 2.02094C5.48394 1.47396 6.2258 1.16667 6.99935 1.16667C7.7729 1.16667 8.51476 1.47396 9.06174 2.02094C9.60873 2.56792 9.91602 3.30979 9.91602 4.08333V4.66667H4.08268V4.08333ZM11.666 11.0833C11.666 11.5475 11.4816 11.9926 11.1535 12.3208C10.8253 12.649 10.3801 12.8333 9.91602 12.8333H4.08268C3.61855 12.8333 3.17343 12.649 2.84525 12.3208C2.51706 11.9926 2.33268 11.5475 2.33268 11.0833V7.58333C2.33268 7.1192 2.51706 6.67408 2.84525 6.3459C3.17343 6.01771 3.61855 5.83333 4.08268 5.83333H9.91602C10.3801 5.83333 10.8253 6.01771 11.1535 6.3459C11.4816 6.67408 11.666 7.1192 11.666 7.58333V11.0833Z");
    			attr_dev(path0, "fill", "#E4E4E4");
    			add_location(path0, file$t, 9, 4, 198);
    			attr_dev(path1, "d", "M6.99935 8.16675C6.84464 8.16675 6.69627 8.22821 6.58687 8.3376C6.47747 8.447 6.41602 8.59537 6.41602 8.75008V9.91675C6.41602 10.0715 6.47747 10.2198 6.58687 10.3292C6.69627 10.4386 6.84464 10.5001 6.99935 10.5001C7.15406 10.5001 7.30243 10.4386 7.41183 10.3292C7.52122 10.2198 7.58268 10.0715 7.58268 9.91675V8.75008C7.58268 8.59537 7.52122 8.447 7.41183 8.3376C7.30243 8.22821 7.15406 8.16675 6.99935 8.16675Z");
    			attr_dev(path1, "fill", "#E4E4E4");
    			add_location(path1, file$t, 13, 4, 1511);
    			attr_dev(g, "clip-path", "url(#clip0_3547_4004)");
    			add_location(g, file$t, 8, 4, 155);
    			attr_dev(rect, "width", "14");
    			attr_dev(rect, "height", "14");
    			attr_dev(rect, "fill", "white");
    			add_location(rect, file$t, 20, 8, 2042);
    			attr_dev(clipPath, "id", "clip0_3547_4004");
    			add_location(clipPath, file$t, 19, 4, 2001);
    			add_location(defs, file$t, 18, 4, 1989);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "14");
    			attr_dev(svg, "height", "14");
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", svg_class_value = /*$$props*/ ctx[0].class);
    			add_location(svg, file$t, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    			append_dev(svg, defs);
    			append_dev(defs, clipPath);
    			append_dev(clipPath, rect);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && svg_class_value !== (svg_class_value = /*$$props*/ ctx[0].class)) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab_pw_ico', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Tab_pw_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab_pw_ico",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    /* public\images\Tab_pay_ico.svelte generated by Svelte v3.48.0 */

    const file$s = "public\\images\\Tab_pay_ico.svelte";

    function create_fragment$w(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M13.4615 6.46043H9.69231C8.51092 6.46043 7.53846 7.43289 7.53846 8.61428C7.53846 9.79566 8.51092 10.7681 9.69231 10.7681H11.8462V12.3835C11.8462 12.6791 11.6033 12.922 11.3077 12.922H2.69231C1.806 12.922 1.07692 12.1929 1.07692 11.3066V3.22966C1.07692 2.34335 1.806 1.61428 2.69231 1.61428H3.76923C4.06485 1.61428 4.30769 1.37143 4.30769 1.07582C4.30769 0.7802 4.06485 0.537354 3.76923 0.537354H2.69231C1.21531 0.537354 0 1.75266 0 3.22966V11.3066C0 12.7836 1.21531 13.9989 2.69231 13.9989H11.3077C12.194 13.9989 12.9231 13.2698 12.9231 12.3835V10.7681H13.4615C13.7572 10.7681 14 10.5253 14 10.2297V6.99889C14 6.70328 13.7572 6.46043 13.4615 6.46043ZM12.9231 9.6912H9.69231C9.10162 9.6912 8.61539 9.20497 8.61539 8.61428C8.61539 8.02358 9.10162 7.53735 9.69231 7.53735H12.9231V9.6912Z");
    			attr_dev(path0, "fill", "#E4E4E4");
    			add_location(path0, file$s, 8, 4, 155);
    			attr_dev(path1, "d", "M2.49857 2.72842C1.89765 2.99065 2.09634 3.76765 2.69242 3.76765H11.3078C11.6034 3.76765 11.8463 4.01049 11.8463 4.30611V4.84457C11.8463 5.14019 12.0891 5.38303 12.3847 5.38303C12.6803 5.38303 12.9232 5.14019 12.9232 4.84457V4.30611C12.9226 3.87803 12.7525 3.46719 12.4493 3.16457C12.1467 2.86142 11.7359 2.69126 11.3078 2.69072H11.1355L10.1932 0.337648C10.0839 0.0657245 9.77157 -0.0699679 9.49857 0.0361091L2.49857 2.72842ZM9.97242 2.69072H5.59473L9.39088 1.23149L9.97242 2.69072Z");
    			attr_dev(path1, "fill", "#E4E4E4");
    			add_location(path1, file$s, 12, 4, 988);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "14");
    			attr_dev(svg, "height", "14");
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", svg_class_value = /*$$props*/ ctx[0].class);
    			add_location(svg, file$s, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && svg_class_value !== (svg_class_value = /*$$props*/ ctx[0].class)) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab_pay_ico', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Tab_pay_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab_pay_ico",
    			options,
    			id: create_fragment$w.name
    		});
    	}
    }

    /* public\images\Tab_contacts_ico.svelte generated by Svelte v3.48.0 */

    const file$r = "public\\images\\Tab_contacts_ico.svelte";

    function create_fragment$v(ctx) {
    	let svg;
    	let g;
    	let path0;
    	let path1;
    	let defs;
    	let clipPath;
    	let rect;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			defs = svg_element("defs");
    			clipPath = svg_element("clipPath");
    			rect = svg_element("rect");
    			attr_dev(path0, "d", "M7 7C7.69223 7 8.36892 6.79473 8.9445 6.41015C9.52007 6.02556 9.96867 5.47894 10.2336 4.83939C10.4985 4.19985 10.5678 3.49612 10.4327 2.81719C10.2977 2.13825 9.96436 1.51461 9.47487 1.02513C8.98539 0.535644 8.36175 0.202301 7.68282 0.0672531C7.00388 -0.0677952 6.30015 0.0015165 5.66061 0.266423C5.02107 0.53133 4.47444 0.979934 4.08986 1.55551C3.70527 2.13108 3.5 2.80777 3.5 3.5C3.50093 4.42798 3.86997 5.31768 4.52615 5.97385C5.18233 6.63003 6.07203 6.99908 7 7ZM7 1.16667C7.46149 1.16667 7.91262 1.30352 8.29633 1.55991C8.68005 1.8163 8.97912 2.18071 9.15572 2.60707C9.33232 3.03343 9.37853 3.50259 9.2885 3.95521C9.19847 4.40784 8.97624 4.8236 8.64992 5.14992C8.32359 5.47624 7.90783 5.69847 7.45521 5.7885C7.00259 5.87853 6.53343 5.83233 6.10707 5.65572C5.68071 5.47912 5.31629 5.18005 5.0599 4.79633C4.80351 4.41262 4.66667 3.96149 4.66667 3.5C4.66667 2.88116 4.9125 2.28767 5.35008 1.85009C5.78767 1.4125 6.38116 1.16667 7 1.16667Z");
    			attr_dev(path0, "fill", "#5B9C42");
    			add_location(path0, file$r, 9, 4, 184);
    			attr_dev(path1, "d", "M7 8.16675C5.60809 8.16829 4.27363 8.72191 3.28939 9.70614C2.30516 10.6904 1.75154 12.0248 1.75 13.4167C1.75 13.5715 1.81146 13.7198 1.92085 13.8292C2.03025 13.9386 2.17862 14.0001 2.33333 14.0001C2.48804 14.0001 2.63642 13.9386 2.74581 13.8292C2.85521 13.7198 2.91667 13.5715 2.91667 13.4167C2.91667 12.3338 3.34687 11.2952 4.11265 10.5294C4.87842 9.76362 5.91703 9.33341 7 9.33341C8.08297 9.33341 9.12158 9.76362 9.88735 10.5294C10.6531 11.2952 11.0833 12.3338 11.0833 13.4167C11.0833 13.5715 11.1448 13.7198 11.2542 13.8292C11.3636 13.9386 11.512 14.0001 11.6667 14.0001C11.8214 14.0001 11.9697 13.9386 12.0791 13.8292C12.1885 13.7198 12.25 13.5715 12.25 13.4167C12.2485 12.0248 11.6948 10.6904 10.7106 9.70614C9.72637 8.72191 8.39191 8.16829 7 8.16675Z");
    			attr_dev(path1, "fill", "#E4E4E4");
    			add_location(path1, file$r, 13, 4, 1176);
    			attr_dev(g, "clip-path", "url(#clip0_4542_9216)");
    			add_location(g, file$r, 8, 2, 141);
    			attr_dev(rect, "width", "14");
    			attr_dev(rect, "height", "14");
    			attr_dev(rect, "fill", "white");
    			add_location(rect, file$r, 20, 6, 2042);
    			attr_dev(clipPath, "id", "clip0_4542_9216");
    			add_location(clipPath, file$r, 19, 4, 2003);
    			add_location(defs, file$r, 18, 2, 1991);
    			attr_dev(svg, "width", "14");
    			attr_dev(svg, "height", "14");
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", svg_class_value = /*$$props*/ ctx[0].class);
    			add_location(svg, file$r, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    			append_dev(svg, defs);
    			append_dev(defs, clipPath);
    			append_dev(clipPath, rect);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && svg_class_value !== (svg_class_value = /*$$props*/ ctx[0].class)) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab_contacts_ico', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Tab_contacts_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab_contacts_ico",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    /* src\components\information\Tabs\TabIcon.svelte generated by Svelte v3.48.0 */
    const file$q = "src\\components\\information\\Tabs\\TabIcon.svelte";

    // (38:39) 
    function create_if_block_4$2(ctx) {
    	let tab_pay_ico;
    	let t;
    	let div;
    	let div_class_value;
    	let current;

    	tab_pay_ico = new Tab_pay_ico({
    			props: { class: /*classNamePass*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab_pay_ico.$$.fragment);
    			t = space();
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "icon__line " + /*classNamePass*/ ctx[1] + " svelte-1ue5uz1");
    			add_location(div, file$q, 39, 4, 1516);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab_pay_ico, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tab_pay_ico_changes = {};
    			if (dirty & /*classNamePass*/ 2) tab_pay_ico_changes.class = /*classNamePass*/ ctx[1];
    			tab_pay_ico.$set(tab_pay_ico_changes);

    			if (!current || dirty & /*classNamePass*/ 2 && div_class_value !== (div_class_value = "icon__line " + /*classNamePass*/ ctx[1] + " svelte-1ue5uz1")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab_pay_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab_pay_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab_pay_ico, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(38:39) ",
    		ctx
    	});

    	return block;
    }

    // (35:40) 
    function create_if_block_3$4(ctx) {
    	let tab_pw_ico;
    	let t;
    	let div;
    	let div_class_value;
    	let current;

    	tab_pw_ico = new Tab_pw_ico({
    			props: { class: /*classNamePass*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab_pw_ico.$$.fragment);
    			t = space();
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "icon__line " + /*classNamePass*/ ctx[1] + " svelte-1ue5uz1");
    			add_location(div, file$q, 36, 4, 1384);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab_pw_ico, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tab_pw_ico_changes = {};
    			if (dirty & /*classNamePass*/ 2) tab_pw_ico_changes.class = /*classNamePass*/ ctx[1];
    			tab_pw_ico.$set(tab_pw_ico_changes);

    			if (!current || dirty & /*classNamePass*/ 2 && div_class_value !== (div_class_value = "icon__line " + /*classNamePass*/ ctx[1] + " svelte-1ue5uz1")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab_pw_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab_pw_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab_pw_ico, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(35:40) ",
    		ctx
    	});

    	return block;
    }

    // (32:39) 
    function create_if_block_2$6(ctx) {
    	let tab_address_ico;
    	let t;
    	let div;
    	let div_class_value;
    	let current;

    	tab_address_ico = new Tab_address_ico({
    			props: { class: /*classNameAddress*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab_address_ico.$$.fragment);
    			t = space();
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "icon__line " + /*classNameAddress*/ ctx[3] + " svelte-1ue5uz1");
    			add_location(div, file$q, 33, 4, 1249);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab_address_ico, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tab_address_ico_changes = {};
    			if (dirty & /*classNameAddress*/ 8) tab_address_ico_changes.class = /*classNameAddress*/ ctx[3];
    			tab_address_ico.$set(tab_address_ico_changes);

    			if (!current || dirty & /*classNameAddress*/ 8 && div_class_value !== (div_class_value = "icon__line " + /*classNameAddress*/ ctx[3] + " svelte-1ue5uz1")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab_address_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab_address_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab_address_ico, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(32:39) ",
    		ctx
    	});

    	return block;
    }

    // (29:40) 
    function create_if_block_1$9(ctx) {
    	let tab_contacts_ico;
    	let t;
    	let div;
    	let div_class_value;
    	let current;

    	tab_contacts_ico = new Tab_contacts_ico({
    			props: { class: /*classNameContact*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab_contacts_ico.$$.fragment);
    			t = space();
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "icon__line " + /*classNameContact*/ ctx[0] + " svelte-1ue5uz1");
    			add_location(div, file$q, 30, 4, 1107);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab_contacts_ico, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tab_contacts_ico_changes = {};
    			if (dirty & /*classNameContact*/ 1) tab_contacts_ico_changes.class = /*classNameContact*/ ctx[0];
    			tab_contacts_ico.$set(tab_contacts_ico_changes);

    			if (!current || dirty & /*classNameContact*/ 1 && div_class_value !== (div_class_value = "icon__line " + /*classNameContact*/ ctx[0] + " svelte-1ue5uz1")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab_contacts_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab_contacts_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab_contacts_ico, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(29:40) ",
    		ctx
    	});

    	return block;
    }

    // (26:2) {#if categoryName === "Name"}
    function create_if_block$b(ctx) {
    	let tab_name_ico;
    	let t;
    	let div;
    	let current;
    	tab_name_ico = new Tab_name_ico({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(tab_name_ico.$$.fragment);
    			t = space();
    			div = element("div");
    			attr_dev(div, "class", "icon__line active svelte-1ue5uz1");
    			add_location(div, file$q, 27, 4, 975);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab_name_ico, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab_name_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab_name_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab_name_ico, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(26:2) {#if categoryName === \\\"Name\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;

    	const if_block_creators = [
    		create_if_block$b,
    		create_if_block_1$9,
    		create_if_block_2$6,
    		create_if_block_3$4,
    		create_if_block_4$2
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*categoryName*/ ctx[2] === "Name") return 0;
    		if (/*categoryName*/ ctx[2] === "Contacts") return 1;
    		if (/*categoryName*/ ctx[2] === "Address") return 2;
    		if (/*categoryName*/ ctx[2] === "Password") return 3;
    		if (/*categoryName*/ ctx[2] === "Payment") return 4;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "icon__wrapper  svelte-1ue5uz1");
    			add_location(div, file$q, 24, 0, 886);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let $allowItemIndex;
    	validate_store(allowItemIndex, 'allowItemIndex');
    	component_subscribe($$self, allowItemIndex, $$value => $$invalidate(4, $allowItemIndex = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabIcon', slots, []);
    	let { categoryName } = $$props;
    	let { classNameContact = "", classNameAddress = "", classNamePass = "" } = $$props;

    	beforeUpdate(() => {
    		if ($allowItemIndex === 2) {
    			$$invalidate(0, classNameContact = "active");
    			$$invalidate(1, classNamePass = "active");
    		} else if ($allowItemIndex === 1) {
    			$$invalidate(0, classNameContact = "active");
    			$$invalidate(1, classNamePass = "");
    		}
    	});

    	const writable_props = ['categoryName', 'classNameContact', 'classNameAddress', 'classNamePass'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('categoryName' in $$props) $$invalidate(2, categoryName = $$props.categoryName);
    		if ('classNameContact' in $$props) $$invalidate(0, classNameContact = $$props.classNameContact);
    		if ('classNameAddress' in $$props) $$invalidate(3, classNameAddress = $$props.classNameAddress);
    		if ('classNamePass' in $$props) $$invalidate(1, classNamePass = $$props.classNamePass);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		categoryName,
    		allowItemIndex,
    		Tab_name_ico,
    		Tab_address_ico,
    		Tab_pw_ico,
    		Tab_pay_ico,
    		Tab_contacts_ico,
    		classNameContact,
    		classNameAddress,
    		classNamePass,
    		$allowItemIndex
    	});

    	$$self.$inject_state = $$props => {
    		if ('categoryName' in $$props) $$invalidate(2, categoryName = $$props.categoryName);
    		if ('classNameContact' in $$props) $$invalidate(0, classNameContact = $$props.classNameContact);
    		if ('classNameAddress' in $$props) $$invalidate(3, classNameAddress = $$props.classNameAddress);
    		if ('classNamePass' in $$props) $$invalidate(1, classNamePass = $$props.classNamePass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [classNameContact, classNamePass, categoryName, classNameAddress];
    }

    class TabIcon$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			categoryName: 2,
    			classNameContact: 0,
    			classNameAddress: 3,
    			classNamePass: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabIcon",
    			options,
    			id: create_fragment$u.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*categoryName*/ ctx[2] === undefined && !('categoryName' in props)) {
    			console.warn("<TabIcon> was created without expected prop 'categoryName'");
    		}
    	}

    	get categoryName() {
    		throw new Error("<TabIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categoryName(value) {
    		throw new Error("<TabIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameContact() {
    		throw new Error("<TabIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameContact(value) {
    		throw new Error("<TabIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameAddress() {
    		throw new Error("<TabIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameAddress(value) {
    		throw new Error("<TabIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNamePass() {
    		throw new Error("<TabIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNamePass(value) {
    		throw new Error("<TabIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\information\Tabs\Tabs.svelte generated by Svelte v3.48.0 */
    const file$p = "src\\components\\information\\Tabs\\Tabs.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (12:8) {#each tabItems as item, i}
    function create_each_block$5(ctx) {
    	let li;
    	let div;
    	let tabicon;
    	let t;
    	let current;

    	tabicon = new TabIcon$1({
    			props: { categoryName: /*item*/ ctx[1].name },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			create_component(tabicon.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "icon");
    			add_location(div, file$p, 13, 16, 206);
    			attr_dev(li, "class", "svelte-1xshcb4");
    			add_location(li, file$p, 12, 12, 184);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			mount_component(tabicon, div, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabicon_changes = {};
    			if (dirty & /*tabItems*/ 1) tabicon_changes.categoryName = /*item*/ ctx[1].name;
    			tabicon.$set(tabicon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(tabicon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(12:8) {#each tabItems as item, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let div;
    	let ul;
    	let current;
    	let each_value = /*tabItems*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-1xshcb4");
    			add_location(ul, file$p, 10, 4, 129);
    			attr_dev(div, "class", "tabs svelte-1xshcb4");
    			add_location(div, file$p, 9, 0, 105);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tabItems*/ 1) {
    				each_value = /*tabItems*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tabs', slots, []);
    	let { tabItems } = $$props;
    	const writable_props = ['tabItems'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('tabItems' in $$props) $$invalidate(0, tabItems = $$props.tabItems);
    	};

    	$$self.$capture_state = () => ({ TabIcon: TabIcon$1, tabItems });

    	$$self.$inject_state = $$props => {
    		if ('tabItems' in $$props) $$invalidate(0, tabItems = $$props.tabItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tabItems];
    }

    class Tabs$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { tabItems: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$t.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tabItems*/ ctx[0] === undefined && !('tabItems' in props)) {
    			console.warn("<Tabs> was created without expected prop 'tabItems'");
    		}
    	}

    	get tabItems() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabItems(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* public\images\EyePW_ico.svelte generated by Svelte v3.48.0 */

    const file$o = "public\\images\\EyePW_ico.svelte";

    function create_fragment$s(ctx) {
    	let svg;
    	let path;
    	let svg_class_value;
    	let svg_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M12.0007 9.005C13.0615 9.005 14.079 9.42643 14.8291 10.1766C15.5792 10.9267 16.0007 11.9441 16.0007 13.005C16.0007 14.0659 15.5792 15.0833 14.8291 15.8334C14.079 16.5836 13.0615 17.005 12.0007 17.005C10.9398 17.005 9.92239 16.5836 9.17225 15.8334C8.4221 15.0833 8.00067 14.0659 8.00067 13.005C8.00067 11.9441 8.4221 10.9267 9.17225 10.1766C9.92239 9.42643 10.9398 9.005 12.0007 9.005ZM12.0007 10.505C11.3376 10.505 10.7017 10.7684 10.2329 11.2372C9.76407 11.7061 9.50067 12.342 9.50067 13.005C9.50067 13.668 9.76407 14.3039 10.2329 14.7728C10.7017 15.2416 11.3376 15.505 12.0007 15.505C12.6637 15.505 13.2996 15.2416 13.7684 14.7728C14.2373 14.3039 14.5007 13.668 14.5007 13.005C14.5007 12.342 14.2373 11.7061 13.7684 11.2372C13.2996 10.7684 12.6637 10.505 12.0007 10.505ZM12.0007 5.5C16.6137 5.5 20.5967 8.65 21.7017 13.064C21.7501 13.2569 21.7198 13.4612 21.6176 13.6319C21.5154 13.8025 21.3496 13.9256 21.1567 13.974C20.9637 14.0224 20.7595 13.9922 20.5888 13.89C20.4181 13.7878 20.2951 13.6219 20.2467 13.429C19.7837 11.5925 18.7208 9.96306 17.2267 8.79913C15.7326 7.6352 13.8926 7.00338 11.9986 7.00384C10.1046 7.0043 8.26499 7.63701 6.7714 8.80167C5.27782 9.96632 4.21578 11.5962 3.75367 13.433C3.72984 13.5286 3.68741 13.6186 3.6288 13.6978C3.5702 13.777 3.49656 13.8439 3.41211 13.8946C3.32765 13.9454 3.23403 13.979 3.13658 13.9935C3.03914 14.0081 2.93978 14.0033 2.84417 13.9795C2.74857 13.9557 2.6586 13.9132 2.5794 13.8546C2.50019 13.796 2.43331 13.7224 2.38256 13.6379C2.33181 13.5535 2.2982 13.4599 2.28363 13.3624C2.26907 13.265 2.27384 13.1656 2.29767 13.07C2.83999 10.9073 4.08933 8.98777 5.84728 7.61627C7.60523 6.24476 9.77101 5.49991 12.0007 5.5Z");
    			attr_dev(path, "fill", "#053900");
    			attr_dev(path, "class", "svelte-jeqvv2");
    			add_location(path, file$o, 10, 4, 218);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", svg_class_value = "eye__icon " + /*$$props*/ ctx[0].class + " svelte-jeqvv2");
    			attr_dev(svg, "disabled", svg_disabled_value = /*$$props*/ ctx[0].disabled);
    			add_location(svg, file$o, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && svg_class_value !== (svg_class_value = "eye__icon " + /*$$props*/ ctx[0].class + " svelte-jeqvv2")) {
    				attr_dev(svg, "class", svg_class_value);
    			}

    			if (dirty & /*$$props*/ 1 && svg_disabled_value !== (svg_disabled_value = /*$$props*/ ctx[0].disabled)) {
    				attr_dev(svg, "disabled", svg_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EyePW_ico', slots, []);

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props, click_handler];
    }

    class EyePW_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EyePW_ico",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    /* src\components\information\TabForms\PasswordForm.svelte generated by Svelte v3.48.0 */
    const file$n = "src\\components\\information\\TabForms\\PasswordForm.svelte";

    // (65:39) 
    function create_if_block_3$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "At a least 8 characters, 1 capital letter, 1 number, 1 special symbol";
    			attr_dev(div, "class", "info__password__message svelte-a14u5s");
    			add_location(div, file$n, 65, 6, 2112);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(65:39) ",
    		ctx
    	});

    	return block;
    }

    // (61:4) {#if $passwordData.err.password}
    function create_if_block_2$5(ctx) {
    	let p;
    	let t_value = /*$passwordData*/ ctx[4].err.password + "";
    	let t;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "error__message svelte-a14u5s");
    			add_location(p, file$n, 61, 6, 1964);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$passwordData*/ 16) && t_value !== (t_value = /*$passwordData*/ ctx[4].err.password + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, true);
    					p_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, false);
    				p_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(61:4) {#if $passwordData.err.password}",
    		ctx
    	});

    	return block;
    }

    // (86:4) {#if $passwordData.err.confirm}
    function create_if_block_1$8(ctx) {
    	let p;
    	let t_value = /*$passwordData*/ ctx[4].err.confirm + "";
    	let t;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "error__message last svelte-a14u5s");
    			add_location(p, file$n, 86, 6, 2866);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$passwordData*/ 16) && t_value !== (t_value = /*$passwordData*/ ctx[4].err.confirm + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, true);
    					p_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, false);
    				p_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(86:4) {#if $passwordData.err.confirm}",
    		ctx
    	});

    	return block;
    }

    // (93:0) {#if $savedPassword}
    function create_if_block$a(ctx) {
    	let div;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Password successfully accepted";
    			attr_dev(div, "class", "info__password__message svelte-a14u5s");
    			add_location(div, file$n, 93, 2, 3024);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
    					div_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
    				div_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(93:0) {#if $savedPassword}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let div5;
    	let div0;
    	let t1;
    	let div1;
    	let t3;
    	let div4;
    	let div2;
    	let eyepw_ico0;
    	let t4;
    	let input0;
    	let t5;
    	let current_block_type_index;
    	let if_block0;
    	let t6;
    	let div3;
    	let eyepw_ico1;
    	let t7;
    	let input1;
    	let t8;
    	let div5_intro;
    	let t9;
    	let if_block2_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	eyepw_ico0 = new EyePW_ico({
    			props: {
    				disabled: /*$savedPassword*/ ctx[3] ? 'on' : 'off',
    				class: /*$passwordData*/ ctx[4].err.password ? 'error' : ''
    			},
    			$$inline: true
    		});

    	eyepw_ico0.$on("click", /*validatePasswordType*/ ctx[2]);
    	const if_block_creators = [create_if_block_2$5, create_if_block_3$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$passwordData*/ ctx[4].err.password) return 0;
    		if (/*$savedPassword*/ ctx[3] === false) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	eyepw_ico1 = new EyePW_ico({
    			props: {
    				disabled: /*$savedPassword*/ ctx[3] ? 'on' : 'off',
    				class: /*$passwordData*/ ctx[4].err.confirm ? 'error' : ''
    			},
    			$$inline: true
    		});

    	eyepw_ico1.$on("click", /*validatePasswordType*/ ctx[2]);
    	let if_block1 = /*$passwordData*/ ctx[4].err.confirm && create_if_block_1$8(ctx);
    	let if_block2 = /*$savedPassword*/ ctx[3] && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			div0.textContent = "Password";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "Please put your Password";
    			t3 = space();
    			div4 = element("div");
    			div2 = element("div");
    			create_component(eyepw_ico0.$$.fragment);
    			t4 = space();
    			input0 = element("input");
    			t5 = space();
    			if (if_block0) if_block0.c();
    			t6 = space();
    			div3 = element("div");
    			create_component(eyepw_ico1.$$.fragment);
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			attr_dev(div0, "class", "tab__head");
    			add_location(div0, file$n, 42, 2, 1238);
    			attr_dev(div1, "class", "tab__subhead");
    			add_location(div1, file$n, 43, 2, 1279);
    			attr_dev(input0, "type", "password");
    			attr_dev(input0, "class", "input-sv svelte-a14u5s");
    			attr_dev(input0, "placeholder", "Password");
    			attr_dev(input0, "autocomplete", "");
    			input0.value = /*passValue*/ ctx[7];
    			toggle_class(input0, "error", /*$passwordData*/ ctx[4].err.password);
    			toggle_class(input0, "success", /*$confirm_match*/ ctx[5]);
    			toggle_class(input0, "disabled", /*$savedPassword*/ ctx[3]);
    			add_location(input0, file$n, 47, 6, 1556);
    			attr_dev(div2, "class", "input__wrapper svelte-a14u5s");
    			add_location(div2, file$n, 45, 4, 1376);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "class", "input-sv svelte-a14u5s");
    			attr_dev(input1, "placeholder", "Confirm Password");
    			attr_dev(input1, "autocomplete", "");
    			input1.value = /*confirmPassValue*/ ctx[6];
    			toggle_class(input1, "error", /*$passwordData*/ ctx[4].err.confirm);
    			toggle_class(input1, "success", /*$confirm_match*/ ctx[5]);
    			toggle_class(input1, "disabled", /*$savedPassword*/ ctx[3]);
    			add_location(input1, file$n, 72, 6, 2438);
    			attr_dev(div3, "class", "input__wrapper svelte-a14u5s");
    			add_location(div3, file$n, 70, 4, 2261);
    			attr_dev(div4, "class", "tab__form__fields");
    			add_location(div4, file$n, 44, 2, 1339);
    			attr_dev(div5, "class", "tab__wrapper");
    			add_location(div5, file$n, 41, 0, 1200);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div5, t1);
    			append_dev(div5, div1);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			mount_component(eyepw_ico0, div2, null);
    			append_dev(div2, t4);
    			append_dev(div2, input0);
    			append_dev(div4, t5);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div4, null);
    			}

    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			mount_component(eyepw_ico1, div3, null);
    			append_dev(div3, t7);
    			append_dev(div3, input1);
    			append_dev(div4, t8);
    			if (if_block1) if_block1.m(div4, null);
    			insert_dev(target, t9, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						input0,
    						"focus",
    						function () {
    							if (is_function(/*passwordData*/ ctx[0].clear)) /*passwordData*/ ctx[0].clear.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input0, "input", /*onInputPass*/ ctx[9], false, false, false),
    					listen_dev(
    						input1,
    						"focus",
    						function () {
    							if (is_function(/*passwordData*/ ctx[0].clear)) /*passwordData*/ ctx[0].clear.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input1, "input", /*onInputConfirmPass*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const eyepw_ico0_changes = {};
    			if (dirty & /*$savedPassword*/ 8) eyepw_ico0_changes.disabled = /*$savedPassword*/ ctx[3] ? 'on' : 'off';
    			if (dirty & /*$passwordData*/ 16) eyepw_ico0_changes.class = /*$passwordData*/ ctx[4].err.password ? 'error' : '';
    			eyepw_ico0.$set(eyepw_ico0_changes);

    			if (dirty & /*$passwordData*/ 16) {
    				toggle_class(input0, "error", /*$passwordData*/ ctx[4].err.password);
    			}

    			if (dirty & /*$confirm_match*/ 32) {
    				toggle_class(input0, "success", /*$confirm_match*/ ctx[5]);
    			}

    			if (dirty & /*$savedPassword*/ 8) {
    				toggle_class(input0, "disabled", /*$savedPassword*/ ctx[3]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block0) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block0 = if_blocks[current_block_type_index];

    					if (!if_block0) {
    						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block0.c();
    					} else {
    						if_block0.p(ctx, dirty);
    					}

    					transition_in(if_block0, 1);
    					if_block0.m(div4, t6);
    				} else {
    					if_block0 = null;
    				}
    			}

    			const eyepw_ico1_changes = {};
    			if (dirty & /*$savedPassword*/ 8) eyepw_ico1_changes.disabled = /*$savedPassword*/ ctx[3] ? 'on' : 'off';
    			if (dirty & /*$passwordData*/ 16) eyepw_ico1_changes.class = /*$passwordData*/ ctx[4].err.confirm ? 'error' : '';
    			eyepw_ico1.$set(eyepw_ico1_changes);

    			if (dirty & /*$passwordData*/ 16) {
    				toggle_class(input1, "error", /*$passwordData*/ ctx[4].err.confirm);
    			}

    			if (dirty & /*$confirm_match*/ 32) {
    				toggle_class(input1, "success", /*$confirm_match*/ ctx[5]);
    			}

    			if (dirty & /*$savedPassword*/ 8) {
    				toggle_class(input1, "disabled", /*$savedPassword*/ ctx[3]);
    			}

    			if (/*$passwordData*/ ctx[4].err.confirm) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$passwordData*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$8(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div4, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*$savedPassword*/ ctx[3]) {
    				if (if_block2) {
    					if (dirty & /*$savedPassword*/ 8) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$a(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(eyepw_ico0.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(eyepw_ico1.$$.fragment, local);
    			transition_in(if_block1);

    			if (!div5_intro) {
    				add_render_callback(() => {
    					div5_intro = create_in_transition(div5, fade, {});
    					div5_intro.start();
    				});
    			}

    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(eyepw_ico0.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(eyepw_ico1.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(eyepw_ico0);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			destroy_component(eyepw_ico1);
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t9);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let $infoFormErrorMessage;
    	let $infoFormErrorStates;
    	let $savedPassword;

    	let $passwordData,
    		$$unsubscribe_passwordData = noop,
    		$$subscribe_passwordData = () => ($$unsubscribe_passwordData(), $$unsubscribe_passwordData = subscribe(passwordData, $$value => $$invalidate(4, $passwordData = $$value)), passwordData);

    	let $infoFormData;

    	let $confirm_match,
    		$$unsubscribe_confirm_match = noop,
    		$$subscribe_confirm_match = () => ($$unsubscribe_confirm_match(), $$unsubscribe_confirm_match = subscribe(confirm_match, $$value => $$invalidate(5, $confirm_match = $$value)), confirm_match);

    	validate_store(infoFormErrorMessage, 'infoFormErrorMessage');
    	component_subscribe($$self, infoFormErrorMessage, $$value => $$invalidate(10, $infoFormErrorMessage = $$value));
    	validate_store(infoFormErrorStates, 'infoFormErrorStates');
    	component_subscribe($$self, infoFormErrorStates, $$value => $$invalidate(11, $infoFormErrorStates = $$value));
    	validate_store(savedPassword, 'savedPassword');
    	component_subscribe($$self, savedPassword, $$value => $$invalidate(3, $savedPassword = $$value));
    	validate_store(infoFormData, 'infoFormData');
    	component_subscribe($$self, infoFormData, $$value => $$invalidate(12, $infoFormData = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_passwordData());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_confirm_match());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PasswordForm', slots, []);
    	let { passwordData, confirm_match } = $$props;
    	validate_store(passwordData, 'passwordData');
    	$$subscribe_passwordData();
    	validate_store(confirm_match, 'confirm_match');
    	$$subscribe_confirm_match();
    	let confirmPassValue = $infoFormData.confirm;
    	let passValue = $infoFormData.password;

    	let onInputConfirmPass = event => {
    		set_store_value(passwordData, $passwordData.confirm = event.target.value, $passwordData);
    		set_store_value(savedPassword, $savedPassword = false, $savedPassword);
    	}; //   console.log($passwordData.password);

    	let onInputPass = event => {
    		set_store_value(passwordData, $passwordData.password = event.target.value, $passwordData);
    		set_store_value(savedPassword, $savedPassword = false, $savedPassword);
    	}; //    console.log($passwordData.confirm);

    	const validatePasswordType = event => {
    		let input = event.target.parentElement.lastElementChild;
    		let type = input.getAttribute("type");

    		if (type === "password") {
    			input.setAttribute("type", "text");
    		} else {
    			input.setAttribute("type", "password");
    		}
    	};

    	function disableErrorState(type) {
    		set_store_value(infoFormErrorStates, $infoFormErrorStates[type] = false, $infoFormErrorStates);
    		set_store_value(infoFormErrorMessage, $infoFormErrorMessage[type] = "", $infoFormErrorMessage);
    	}

    	const writable_props = ['passwordData', 'confirm_match'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PasswordForm> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('passwordData' in $$props) $$subscribe_passwordData($$invalidate(0, passwordData = $$props.passwordData));
    		if ('confirm_match' in $$props) $$subscribe_confirm_match($$invalidate(1, confirm_match = $$props.confirm_match));
    	};

    	$$self.$capture_state = () => ({
    		infoFormData,
    		infoFormErrorStates,
    		infoFormErrorMessage,
    		savedPassword,
    		EyePW_ico,
    		fade,
    		slide,
    		passwordData,
    		confirm_match,
    		confirmPassValue,
    		passValue,
    		onInputConfirmPass,
    		onInputPass,
    		validatePasswordType,
    		disableErrorState,
    		$infoFormErrorMessage,
    		$infoFormErrorStates,
    		$savedPassword,
    		$passwordData,
    		$infoFormData,
    		$confirm_match
    	});

    	$$self.$inject_state = $$props => {
    		if ('passwordData' in $$props) $$subscribe_passwordData($$invalidate(0, passwordData = $$props.passwordData));
    		if ('confirm_match' in $$props) $$subscribe_confirm_match($$invalidate(1, confirm_match = $$props.confirm_match));
    		if ('confirmPassValue' in $$props) $$invalidate(6, confirmPassValue = $$props.confirmPassValue);
    		if ('passValue' in $$props) $$invalidate(7, passValue = $$props.passValue);
    		if ('onInputConfirmPass' in $$props) $$invalidate(8, onInputConfirmPass = $$props.onInputConfirmPass);
    		if ('onInputPass' in $$props) $$invalidate(9, onInputPass = $$props.onInputPass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		passwordData,
    		confirm_match,
    		validatePasswordType,
    		$savedPassword,
    		$passwordData,
    		$confirm_match,
    		confirmPassValue,
    		passValue,
    		onInputConfirmPass,
    		onInputPass
    	];
    }

    class PasswordForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {
    			passwordData: 0,
    			confirm_match: 1,
    			validatePasswordType: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PasswordForm",
    			options,
    			id: create_fragment$r.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*passwordData*/ ctx[0] === undefined && !('passwordData' in props)) {
    			console.warn("<PasswordForm> was created without expected prop 'passwordData'");
    		}

    		if (/*confirm_match*/ ctx[1] === undefined && !('confirm_match' in props)) {
    			console.warn("<PasswordForm> was created without expected prop 'confirm_match'");
    		}
    	}

    	get passwordData() {
    		throw new Error("<PasswordForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set passwordData(value) {
    		throw new Error("<PasswordForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get confirm_match() {
    		throw new Error("<PasswordForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set confirm_match(value) {
    		throw new Error("<PasswordForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get validatePasswordType() {
    		return this.$$.ctx[2];
    	}

    	set validatePasswordType(value) {
    		throw new Error("<PasswordForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var c$1=()=>({test:(t,e)=>e,message:"%Label% is required",required:!0});var f$1=t=>({test:t,message:"%Label% is not valid",notMessage:"%Label% is truly"});var g$1=t=>({test:e=>typeof e===t,message:`%Label% must be of type ${t}`,notMessage:`%Label% must not be of type ${t}`});var p$1=t=>({test:e=>t.test(e),message:`%Label% must match ${t.toString()}`,notMessage:`%Label% must not match ${t.toString()}`});var h=t=>({test:e=>e.length===t,message:`%Label% must have a length of ${t}`,notMessage:`%Label% must not have a length of ${t}`});var d$1=t=>({test:e=>e.length>=t,message:`%Label% must have a minimum length of ${t}`});var b=t=>({test:e=>e.length<=t,message:`%Label% must have a maximum length of ${t}`});var x=t=>({test:e=>e>=t,message:`%Label% must be greater than ${t}`});var L=t=>({test:e=>e<=t,message:`%Label% must be less than ${t}`});var v=t=>({test:e=>t.includes(e),message:`%Label% must be either ${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`,notMessage:`%Label% must be neither ${t.slice(0,-1).join(", ")} or ${t[t.length-1]}`});var $={required:c$1,is:f$1,type:g$1,match:p$1,length:h,minLength:d$1,maxLength:b,min:x,max:L,oneof:v};function w(t){for(let e in $)t.use($[e],e);}function V(t){let e={errors:null,queue:[],current:null,isnot:!1,async:null,add:(r,n)=>(e.current={name:r,label:n||r,value:t[r],exists:t[r]!==void 0&&t[r]!=="",checks:[]},e.queue.push(e.current),a),test:(r,n,o,l,s)=>{if(!o&&e.isnot)throw new Error("Using .not with unsupported validator");let i=typeof r=="function"?r:()=>r;return e.current.checks.push({fn:e.isnot?(q,E)=>!i(q,E):i,message:l||`${e.isnot?o:n}`,required:s||!1}),e.isnot=!1,a},proc:()=>{if(e.errors||e.async)return e.async;e.errors=[],e.async=null;let r=[];for(let n of e.queue)for(let o of n.checks){if(!o.required&&!n.exists)continue;let l=i=>!i&&e.errors.push({name:n.name,error:j(o.message,n)}),s=o.fn(n.value,n.exists);s&&s.then?(r.push(s),s.then(i=>{l(i);})):l(s);}return r.length&&(e.await=Promise.all(r)),e.await}},u=["check","use","not","valid","text","json","array"],a={check:e.add,use:(r,n)=>{if(n=n||r().name,u.includes(n))throw new Error("Invalid validator name:"+n);return a[n]=function(){let o=Array.from(arguments),l=o.length>r.length?o.pop():void 0,s=r.apply(null,o);return e.test(s.test,s.message,s.notMessage||!1,l,s.required)},a},get not(){return e.isnot=!0,a},get valid(){return m$1(e.proc,()=>e.errors.length===0)},text:()=>m$1(e.proc,()=>e.errors.map(r=>r.error+".").join(" ")),json:()=>m$1(e.proc,()=>JSON.stringify(e.errors)),array:()=>m$1(e.proc,()=>e.errors)};return w(a),a}function m$1(t,e){let u=t();return u&&u.then?new Promise(a=>u.then(r=>a(e(r)))):e(u)}function j(t,e){return t.replace(new RegExp("%label%","g"),e.label).replace(new RegExp("%Label%","g"),y(e.label)).replace(new RegExp("%name%","g"),e.name).replace(new RegExp("%Name%","g"),y(e.name)).replace(new RegExp("%value%","g"),String(e.value))}function y(t){return t.charAt(0).toUpperCase()+t.slice(1)}

    var f=[],s=["err","valid"],g=0;function m(r){for(let n of s)if(r[n])throw new Error(`Name of property in object "${n}" is reserved for internal use`);c(r);let{subscribe:e,set:t,update:o}=writable(r);return {subscribe:e,set:t,clear:n=>o(i=>c(i)),get aovi(){let n=l(r);return Object.defineProperty(n,"end",{get:()=>t(p(r,n.array()))}),n},error:(n,i)=>t(d(r,n,i)),load:n=>{!Array.isArray(n)||t(p(r,n));},checker(n,i){if(!r.hasOwnProperty(n))throw new Error(`Unknown property ${n}`);return derived(this,u=>i(l(u).check(n).required(),a(u)).valid)},get(){let n=Array.from(arguments);return n.length===0?a(r):Object.entries(a(r)).reduce((i,[u,v])=>(n.includes(u)&&(i[u]=v),i),{})}}}function l(r){let e=V(r);for(let t of f)e.use(t);return e}function d(r,e,t){return t&&!r.hasOwnProperty(t)?console.warn(`Got unknown property '${t}'`):(r.err[t||`noname_${g++}`]=e,r.valid=!1,r)}function c(r){return r.err=Object.keys(r).filter(e=>!s.includes(e)).reduce((e,t)=>(e[t]=!1,e),{}),r.err.toArray=()=>k(r.err),r.valid=!0,r}function p(r,e){return c(r),e.forEach(t=>{d(r,t.error,t.name);}),r}function k(r){return Object.values(r).filter(e=>typeof e=="string")}function a(r){return Object.entries(r).reduce((e,[t,o])=>(s.includes(t)||(e[t]=o),e),{})}

    function isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
      }

    async function checkIfEmailExistInDB(email) {
      const url = `https://be.esi.kdg.com.ua/esi_public/esi_public/backend/checkEmail?email=${email}`;
      let status;
      if(email)
        try {
          await fetch(url)
            .then((response) => {
              return response.json();
            })
            .then((parsedData) => {

              // let parsedData = JSON.parse(data)
              if (parsedData.status === true) {
                status = false;
              } else if (parsedData.status === false) {
                status = true;
              }
            });
        } catch (error) {
          console.log(error.message);
          status = true;
        }
      return status;
    }

    async function checkIfUserNameExistInDB(userName) {
      const url = `https://be.esi.kdg.com.ua/esi_public/esi_public/backend/checkUsername?username=${userName}`;
      let status;
      if(userName)
        try {
          await fetch(url)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              if (data.status) {
                status = false;
              } else if (!data.status) {
                status = true;
              }
            });
        } catch (error) {
          console.log(error.message);
          status = true;
        }
      return status;
    }

    async function checkIfPhoneExistInDB(phoneCode, phoneNumber) {
      const url = `https://be.esi.kdg.com.ua/esi_public/esi_public/backend/checkPhone?phoneCode=${phoneCode}&phoneNumber=${phoneNumber}`;
      let status;
      if(phoneNumber.length >= 7)
        try {
          await fetch(url)
            .then((response) => {
              return response.json();
            })
            .then((parsedData) => {
              // let parsedData = JSON.parse(data)
              if (parsedData.status === true) {
                status = false;
              } else if (parsedData.status === false) {
                status = true;
              }
            });
        } catch (error) {
          console.log(error.message);
          status = true;
        }
      return status;
    }

    /* public\images\Arrow_left_ico.svelte generated by Svelte v3.48.0 */

    const file$m = "public\\images\\Arrow_left_ico.svelte";

    function create_fragment$q(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M9.36881 12.568C9.53285 12.4039 9.625 12.1814 9.625 11.9494C9.625 11.7174 9.53285 11.4949 9.36881 11.3308L5.03756 6.99953L9.36881 2.66828C9.5282 2.50325 9.61639 2.28223 9.6144 2.0528C9.61241 1.82338 9.52038 1.60392 9.35815 1.44169C9.19592 1.27946 8.97646 1.18743 8.74704 1.18544C8.51761 1.18345 8.29659 1.27164 8.13156 1.43103L3.18169 6.38091C3.01765 6.54499 2.9255 6.76751 2.9255 6.99953C2.9255 7.23155 3.01765 7.45407 3.18169 7.61816L8.13156 12.568C8.29565 12.7321 8.51817 12.8242 8.75019 12.8242C8.98221 12.8242 9.20473 12.7321 9.36881 12.568Z");
    			attr_dev(path, "fill", "#CFCFCF");
    			attr_dev(path, "class", "svelte-o1m3tr");
    			add_location(path, file$m, 7, 4, 132);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "14");
    			attr_dev(svg, "height", "14");
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", "svelte-o1m3tr");
    			add_location(svg, file$m, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Arrow_left_ico', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Arrow_left_ico> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Arrow_left_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Arrow_left_ico",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    function hidePasswords() {
     let inputs = document.querySelectorAll('input[type="text"]');
     inputs.forEach(input => input.setAttribute("type", "password"));
    }

    /* src\components\information\Information.svelte generated by Svelte v3.48.0 */
    const file$l = "src\\components\\information\\Information.svelte";

    // (217:51) 
    function create_if_block_3$2(ctx) {
    	let passwordform;
    	let current;

    	passwordform = new PasswordForm({
    			props: {
    				passwordData: /*passwordData*/ ctx[10],
    				confirm_match: /*confirm_match*/ ctx[11]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(passwordform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(passwordform, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(passwordform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(passwordform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(passwordform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(217:51) ",
    		ctx
    	});

    	return block;
    }

    // (215:10) {#if activeItem.name === "Contacts"}
    function create_if_block_2$4(ctx) {
    	let contactform;
    	let current;

    	contactform = new ContactForm({
    			props: { loginData: /*loginData*/ ctx[9] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contactform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contactform, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contactform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contactform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contactform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(215:10) {#if activeItem.name === \\\"Contacts\\\"}",
    		ctx
    	});

    	return block;
    }

    // (224:6) {#if $allowItemIndex > 1}
    function create_if_block_1$7(ctx) {
    	let button;
    	let arrow_left_ico;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	arrow_left_ico = new Arrow_left_ico({ $$inline: true });

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow_left_ico.$$.fragment);
    			t = text("\r\n          Back");
    			attr_dev(button, "class", "btn-sv prev svelte-1xsnjcx");
    			add_location(button, file$l, 224, 8, 7224);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow_left_ico, button, null);
    			append_dev(button, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*prevTab*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arrow_left_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arrow_left_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(arrow_left_ico);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(224:6) {#if $allowItemIndex > 1}",
    		ctx
    	});

    	return block;
    }

    // (234:6) {:else}
    function create_else_block$1(ctx) {
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*formButtonText*/ ctx[0]);
    			attr_dev(button, "class", "btn-sv next svelte-1xsnjcx");
    			add_location(button, file$l, 234, 8, 7544);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*nextTab*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formButtonText*/ 1) set_data_dev(t, /*formButtonText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(234:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (230:6) {#if $savedPassword && formButtonText === "Save"}
    function create_if_block$9(ctx) {
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*formButtonText*/ ctx[0]);
    			attr_dev(button, "class", "btn-sv next svelte-1xsnjcx");
    			button.disabled = true;
    			add_location(button, file$l, 230, 8, 7416);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*nextTab*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formButtonText*/ 1) set_data_dev(t, /*formButtonText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(230:6) {#if $savedPassword && formButtonText === \\\"Save\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let div5;
    	let div3;
    	let h2;
    	let t0;
    	let span;
    	let t2;
    	let div1;
    	let form;
    	let tabs;
    	let t3;
    	let div0;
    	let current_block_type_index;
    	let if_block0;
    	let div0_intro;
    	let t4;
    	let div2;
    	let t5;
    	let t6;
    	let div4;
    	let buttonleft;
    	let t7;
    	let buttonright;
    	let current;

    	tabs = new Tabs$1({
    			props: { tabItems: /*tabItems*/ ctx[6] },
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block_2$4, create_if_block_3$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*activeItem*/ ctx[1].name === "Contacts") return 0;
    		if (/*activeItem*/ ctx[1].name === "Password") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	let if_block1 = /*$allowItemIndex*/ ctx[4] > 1 && create_if_block_1$7(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*$savedPassword*/ ctx[5] && /*formButtonText*/ ctx[0] === "Save") return create_if_block$9;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block2 = current_block_type(ctx);
    	let buttonleft_props = {};
    	buttonleft = new ButtonLeft({ props: buttonleft_props, $$inline: true });
    	/*buttonleft_binding*/ ctx[14](buttonleft);
    	buttonleft.$on("click", /*prevStep*/ ctx[12]);

    	buttonright = new ButtonRight({
    			props: {
    				buttonState: /*nextButtonState*/ ctx[2] || /*$savedPassword*/ ctx[5]
    			},
    			$$inline: true
    		});

    	buttonright.$on("click", /*nextStep*/ ctx[13]);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div3 = element("div");
    			h2 = element("h2");
    			t0 = text("Personal ");
    			span = element("span");
    			span.textContent = "Information";
    			t2 = space();
    			div1 = element("div");
    			form = element("form");
    			create_component(tabs.$$.fragment);
    			t3 = space();
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t4 = space();
    			div2 = element("div");
    			if (if_block1) if_block1.c();
    			t5 = space();
    			if_block2.c();
    			t6 = space();
    			div4 = element("div");
    			create_component(buttonleft.$$.fragment);
    			t7 = space();
    			create_component(buttonright.$$.fragment);
    			attr_dev(span, "class", "green svelte-1xsnjcx");
    			add_location(span, file$l, 208, 15, 6737);
    			attr_dev(h2, "class", "h2-sv main__head svelte-1xsnjcx");
    			add_location(h2, file$l, 207, 4, 6691);
    			add_location(div0, file$l, 213, 8, 6869);
    			attr_dev(form, "class", "svelte-1xsnjcx");
    			add_location(form, file$l, 211, 6, 6824);
    			attr_dev(div1, "class", "main__tabs svelte-1xsnjcx");
    			add_location(div1, file$l, 210, 4, 6792);
    			attr_dev(div2, "class", "buttons__wrapper svelte-1xsnjcx");
    			add_location(div2, file$l, 222, 4, 7151);
    			attr_dev(div3, "class", "info__main svelte-1xsnjcx");
    			add_location(div3, file$l, 206, 2, 6661);
    			attr_dev(div4, "class", "bottom__btns");
    			add_location(div4, file$l, 239, 2, 7657);
    			attr_dev(div5, "class", "main__wrapper svelte-1xsnjcx");
    			add_location(div5, file$l, 205, 0, 6630);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div3);
    			append_dev(div3, h2);
    			append_dev(h2, t0);
    			append_dev(h2, span);
    			append_dev(div3, t2);
    			append_dev(div3, div1);
    			append_dev(div1, form);
    			mount_component(tabs, form, null);
    			append_dev(form, t3);
    			append_dev(form, div0);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div0, null);
    			}

    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t5);
    			if_block2.m(div2, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			mount_component(buttonleft, div4, null);
    			append_dev(div4, t7);
    			mount_component(buttonright, div4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block0) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block0 = if_blocks[current_block_type_index];

    					if (!if_block0) {
    						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block0.c();
    					} else {
    						if_block0.p(ctx, dirty);
    					}

    					transition_in(if_block0, 1);
    					if_block0.m(div0, null);
    				} else {
    					if_block0 = null;
    				}
    			}

    			if (/*$allowItemIndex*/ ctx[4] > 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$allowItemIndex*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$7(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div2, t5);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div2, null);
    				}
    			}

    			const buttonleft_changes = {};
    			buttonleft.$set(buttonleft_changes);
    			const buttonright_changes = {};
    			if (dirty & /*nextButtonState, $savedPassword*/ 36) buttonright_changes.buttonState = /*nextButtonState*/ ctx[2] || /*$savedPassword*/ ctx[5];
    			buttonright.$set(buttonright_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabs.$$.fragment, local);
    			transition_in(if_block0);

    			if (!div0_intro) {
    				add_render_callback(() => {
    					div0_intro = create_in_transition(div0, fade, {});
    					div0_intro.start();
    				});
    			}

    			transition_in(if_block1);
    			transition_in(buttonleft.$$.fragment, local);
    			transition_in(buttonright.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabs.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(buttonleft.$$.fragment, local);
    			transition_out(buttonright.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(tabs);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (if_block1) if_block1.d();
    			if_block2.d();
    			/*buttonleft_binding*/ ctx[14](null);
    			destroy_component(buttonleft);
    			destroy_component(buttonright);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const emailrRegEx = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const passwordRegEx = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    function instance$p($$self, $$props, $$invalidate) {
    	let $allowItemIndex;
    	let $clickOnPrevBtn;
    	let $passwordData;
    	let $infoFormData;
    	let $loginData;
    	let $confirmPopUpState;
    	let $savedPassword;
    	let $confirm_match;
    	let $infoFormErrorState;
    	validate_store(allowItemIndex, 'allowItemIndex');
    	component_subscribe($$self, allowItemIndex, $$value => $$invalidate(4, $allowItemIndex = $$value));
    	validate_store(clickOnPrevBtn, 'clickOnPrevBtn');
    	component_subscribe($$self, clickOnPrevBtn, $$value => $$invalidate(16, $clickOnPrevBtn = $$value));
    	validate_store(infoFormData, 'infoFormData');
    	component_subscribe($$self, infoFormData, $$value => $$invalidate(18, $infoFormData = $$value));
    	validate_store(confirmPopUpState, 'confirmPopUpState');
    	component_subscribe($$self, confirmPopUpState, $$value => $$invalidate(20, $confirmPopUpState = $$value));
    	validate_store(savedPassword, 'savedPassword');
    	component_subscribe($$self, savedPassword, $$value => $$invalidate(5, $savedPassword = $$value));
    	validate_store(infoFormErrorState, 'infoFormErrorState');
    	component_subscribe($$self, infoFormErrorState, $$value => $$invalidate(22, $infoFormErrorState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Information', slots, []);

    	let tabItems = [
    		// { name: "Name", component: NameForm },
    		{ name: "Contacts", component: ContactForm },
    		// { name: "Address", component: AddressForm },
    		{
    			name: "Password",
    			component: PasswordForm
    		}
    	];

    	let formButtonText = "Next";
    	let activeItem = tabItems[0];
    	let nextButtonState = false;
    	let userNameErrorMessage;
    	let prevBtn;

    	async function nextTab() {
    		if ($allowItemIndex < 3) {
    			let index = tabItems.findIndex(object => {
    				return object.name === activeItem.name;
    			});

    			if (index === 0 && $loginData.valid) {
    				// Validate Contact
    				await doLoginData();

    				if ($infoFormErrorState === false) {
    					$$invalidate(1, activeItem = tabItems[index + 1]);
    					set_store_value(allowItemIndex, $allowItemIndex = $allowItemIndex + 1, $allowItemIndex);
    					$$invalidate(0, formButtonText = "Save");
    				}
    			} else if (index === 1) {
    				// Validate Password
    				doSignup();

    				if ($savedPassword === true) {
    					$$invalidate(2, nextButtonState = true);
    					hidePasswords();
    				}
    			}
    		}
    	}

    	function prevTab() {
    		if ($allowItemIndex > 1) {
    			let index = tabItems.findIndex(object => {
    				return object.name === activeItem.name;
    			});

    			if (index != 0) {
    				$$invalidate(1, activeItem = tabItems[index - 1]);
    				set_store_value(allowItemIndex, $allowItemIndex = $allowItemIndex - 1, $allowItemIndex);
    				$$invalidate(0, formButtonText = "Next");
    				$$invalidate(2, nextButtonState = false);
    			}
    		}
    	}

    	const loginData = m({
    		userName: $infoFormData.userName,
    		email: $infoFormData.email,
    		phone: $infoFormData.phone,
    		phoneCode: $infoFormData.phoneCode
    	});

    	validate_store(loginData, 'loginData');
    	component_subscribe($$self, loginData, value => $$invalidate(19, $loginData = value));

    	const passwordData = m({
    		password: $infoFormData.password,
    		confirm: $infoFormData.confirm
    	});

    	validate_store(passwordData, 'passwordData');
    	component_subscribe($$self, passwordData, value => $$invalidate(17, $passwordData = value));

    	// Init "checker". Will be true when confirm and password are equal, and false in other case
    	const confirm_match = passwordData.checker("confirm", aovi => aovi.is($passwordData.password === $passwordData.confirm));

    	validate_store(confirm_match, 'confirm_match');
    	component_subscribe($$self, confirm_match, value => $$invalidate(21, $confirm_match = value));

    	const validateEmailExistingInDB = async () => {
    		let emailExistinDB = await checkIfEmailExistInDB($loginData.email);
    		return !emailExistinDB;
    	};

    	const validateUserName = async () => {
    		let isNumber = isNumeric(`${$loginData.userName}`);
    		let userNameExistinDB;

    		if (isNumber) {
    			userNameErrorMessage = `Username cannot be a number`;
    			userNameExistinDB = true;
    		} else {
    			userNameErrorMessage = `User with user name ${$loginData.userName} exist in database`;
    			userNameExistinDB = await checkIfUserNameExistInDB($loginData.userName);
    		}

    		return !userNameExistinDB;
    	};

    	const validatePhoneExistingInDB = async () => {
    		let phoneExistinDB = await checkIfPhoneExistInDB($loginData.phoneCode, $loginData.phone);
    		return !phoneExistinDB;
    	};

    	async function doLoginData() {
    		$$invalidate(0, formButtonText = 'Load...');
    		loginData.aovi.check("userName").required("Please put your username").minLength(3, "User Name should be at least 3 symbols length").maxLength(20, "User Name must be no more than 20 characters").is(await validateUserName(), userNameErrorMessage).check("email").required("Please put your email").match(emailrRegEx, "Incorrect E-mail format").is(await validateEmailExistingInDB(), "Email exist in database").check("phone").required("Please put your phone").minLength(7, "Phone should be at least 7 symbols length").is(await validatePhoneExistingInDB(), "Phone exist in database").end; // use Aovi validators

    		// you must finish validation with '.end' operator
    		if ($loginData.valid) {
    			set_store_value(infoFormErrorState, $infoFormErrorState = false, $infoFormErrorState);
    		} else {
    			set_store_value(infoFormErrorState, $infoFormErrorState = true, $infoFormErrorState);
    		}

    		$$invalidate(0, formButtonText = 'Next');
    	}

    	function doSignup() {
    		passwordData.aovi.check("password").required("Please put your password").match(passwordRegEx, "Password should have at least 1 capital letter, 1 number, 1 special symbol").is($confirm_match, "Confirmation doesn't match password").check("confirm").required("Please confirm your password").minLength(8, "Password should be at least 8 symbols length").end; // use Aovi validators
    		// you must finish validation with '.end' operator

    		if ($passwordData.valid) {
    			// if validation success, do something
    			set_store_value(savedPassword, $savedPassword = true, $savedPassword);
    		} else {
    			set_store_value(savedPassword, $savedPassword = false, $savedPassword);
    		}
    	}

    	let prevStep = () => {
    		decrementStep();
    		scrollToTop$1();
    	};

    	let nextStep = () => {
    		set_store_value(confirmPopUpState, $confirmPopUpState = true, $confirmPopUpState);
    		scrollToTop$1(0);
    	};

    	afterUpdate(() => {
    		set_store_value(infoFormData, $infoFormData.email = $loginData.email, $infoFormData);
    		set_store_value(infoFormData, $infoFormData.userName = $loginData.userName, $infoFormData);
    		set_store_value(infoFormData, $infoFormData.phone = $loginData.phone, $infoFormData);
    		set_store_value(infoFormData, $infoFormData.password = $passwordData.password, $infoFormData);
    		set_store_value(infoFormData, $infoFormData.confirm = $passwordData.confirm, $infoFormData);

    		if ($clickOnPrevBtn) {
    			$$invalidate(1, activeItem = tabItems[0]);
    			set_store_value(allowItemIndex, $allowItemIndex = 1, $allowItemIndex);
    			$$invalidate(0, formButtonText = "Next");
    			set_store_value(clickOnPrevBtn, $clickOnPrevBtn = false, $clickOnPrevBtn);
    		}
    	});

    	onDestroy(() => {
    		set_store_value(allowItemIndex, $allowItemIndex = 1, $allowItemIndex);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Information> was created with unknown prop '${key}'`);
    	});

    	function buttonleft_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			prevBtn = $$value;
    			$$invalidate(3, prevBtn);
    		});
    	}

    	$$self.$capture_state = () => ({
    		ContactForm,
    		Tabs: Tabs$1,
    		PasswordForm,
    		fade,
    		aoviSvelte: m,
    		isNumeric,
    		allowItemIndex,
    		infoFormErrorMessage,
    		clickOnPrevBtn,
    		infoFormErrorState,
    		infoFormData,
    		infoFormErrorStates,
    		confirmPopUpState,
    		savedPassword,
    		headSteps,
    		decrementStep,
    		ButtonLeft,
    		checkIfEmailExistInDB,
    		checkIfUserNameExistInDB,
    		checkIfPhoneExistInDB,
    		ButtonRight,
    		afterUpdate,
    		onDestroy,
    		Arrow_left_ico,
    		hidePasswords,
    		scrollToTop: scrollToTop$1,
    		tabItems,
    		formButtonText,
    		activeItem,
    		nextButtonState,
    		userNameErrorMessage,
    		prevBtn,
    		nextTab,
    		prevTab,
    		loginData,
    		passwordData,
    		confirm_match,
    		validateEmailExistingInDB,
    		validateUserName,
    		validatePhoneExistingInDB,
    		emailrRegEx,
    		doLoginData,
    		passwordRegEx,
    		doSignup,
    		prevStep,
    		nextStep,
    		$allowItemIndex,
    		$clickOnPrevBtn,
    		$passwordData,
    		$infoFormData,
    		$loginData,
    		$confirmPopUpState,
    		$savedPassword,
    		$confirm_match,
    		$infoFormErrorState
    	});

    	$$self.$inject_state = $$props => {
    		if ('tabItems' in $$props) $$invalidate(6, tabItems = $$props.tabItems);
    		if ('formButtonText' in $$props) $$invalidate(0, formButtonText = $$props.formButtonText);
    		if ('activeItem' in $$props) $$invalidate(1, activeItem = $$props.activeItem);
    		if ('nextButtonState' in $$props) $$invalidate(2, nextButtonState = $$props.nextButtonState);
    		if ('userNameErrorMessage' in $$props) userNameErrorMessage = $$props.userNameErrorMessage;
    		if ('prevBtn' in $$props) $$invalidate(3, prevBtn = $$props.prevBtn);
    		if ('prevStep' in $$props) $$invalidate(12, prevStep = $$props.prevStep);
    		if ('nextStep' in $$props) $$invalidate(13, nextStep = $$props.nextStep);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*formButtonText, nextButtonState, activeItem*/ 7) ;
    	};

    	return [
    		formButtonText,
    		activeItem,
    		nextButtonState,
    		prevBtn,
    		$allowItemIndex,
    		$savedPassword,
    		tabItems,
    		nextTab,
    		prevTab,
    		loginData,
    		passwordData,
    		confirm_match,
    		prevStep,
    		nextStep,
    		buttonleft_binding
    	];
    }

    class Information extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Information",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* public\images\Address_ico.svelte generated by Svelte v3.48.0 */

    const file$k = "public\\images\\Address_ico.svelte";

    function create_fragment$o(ctx) {
    	let svg;
    	let g;
    	let path0;
    	let path1;
    	let defs;
    	let clipPath;
    	let rect;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			defs = svg_element("defs");
    			clipPath = svg_element("clipPath");
    			rect = svg_element("rect");
    			attr_dev(path0, "d", "M6.99935 3.5C6.53786 3.5 6.08673 3.63685 5.70302 3.89324C5.31931 4.14963 5.02024 4.51404 4.84363 4.94041C4.66703 5.36677 4.62082 5.83592 4.71085 6.28854C4.80088 6.74117 5.02311 7.15693 5.34943 7.48325C5.67576 7.80957 6.09152 8.0318 6.54414 8.12183C6.99676 8.21186 7.46592 8.16566 7.89228 7.98905C8.31864 7.81245 8.68306 7.51338 8.93945 7.12966C9.19584 6.74595 9.33268 6.29482 9.33268 5.83333C9.33268 5.21449 9.08685 4.621 8.64927 4.18342C8.21168 3.74583 7.61819 3.5 6.99935 3.5ZM6.99935 7C6.76861 7 6.54304 6.93158 6.35119 6.80338C6.15933 6.67519 6.00979 6.49298 5.92149 6.2798C5.83319 6.06662 5.81008 5.83204 5.8551 5.60573C5.90012 5.37942 6.01123 5.17154 6.17439 5.00838C6.33755 4.84521 6.54543 4.7341 6.77174 4.68908C6.99806 4.64407 7.23263 4.66717 7.44581 4.75547C7.65899 4.84378 7.8412 4.99331 7.9694 5.18517C8.09759 5.37703 8.16602 5.60259 8.16602 5.83333C8.16602 6.14275 8.0431 6.4395 7.82431 6.65829C7.60552 6.87708 7.30877 7 6.99935 7Z");
    			attr_dev(path0, "fill", "#E4E4E4");
    			add_location(path0, file$k, 9, 4, 198);
    			attr_dev(path1, "d", "M7.00018 13.9999C6.50898 14.0025 6.02433 13.8873 5.5868 13.664C5.14928 13.4407 4.77161 13.1158 4.48543 12.7166C2.26235 9.65003 1.13477 7.3447 1.13477 5.8642C1.13477 4.30859 1.75273 2.8167 2.85271 1.71672C3.95269 0.616741 5.44458 -0.0012207 7.00018 -0.0012207C8.55579 -0.0012207 10.0477 0.616741 11.1477 1.71672C12.2476 2.8167 12.8656 4.30859 12.8656 5.8642C12.8656 7.3447 11.738 9.65003 9.51493 12.7166C9.22875 13.1158 8.85109 13.4407 8.41356 13.664C7.97604 13.8873 7.49138 14.0025 7.00018 13.9999ZM7.00018 1.2722C5.78243 1.27359 4.61494 1.75795 3.75386 2.61904C2.89277 3.48012 2.40841 4.64761 2.40702 5.86536C2.40702 7.03786 3.51127 9.20611 5.5156 11.9705C5.68575 12.2049 5.90898 12.3957 6.16702 12.5272C6.42505 12.6587 6.71056 12.7273 7.00018 12.7273C7.28981 12.7273 7.57532 12.6587 7.83335 12.5272C8.09138 12.3957 8.31461 12.2049 8.48477 11.9705C10.4891 9.20611 11.5934 7.03786 11.5934 5.86536C11.592 4.64761 11.1076 3.48012 10.2465 2.61904C9.38542 1.75795 8.21794 1.27359 7.00018 1.2722Z");
    			attr_dev(path1, "fill", "#E4E4E4");
    			add_location(path1, file$k, 13, 4, 1199);
    			attr_dev(g, "clip-path", "url(#clip0_3547_4001)");
    			add_location(g, file$k, 8, 4, 155);
    			attr_dev(rect, "width", "14");
    			attr_dev(rect, "height", "14");
    			attr_dev(rect, "fill", "white");
    			add_location(rect, file$k, 20, 8, 2310);
    			attr_dev(clipPath, "id", "clip0_3547_4001");
    			add_location(clipPath, file$k, 19, 4, 2269);
    			add_location(defs, file$k, 18, 4, 2257);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "14");
    			attr_dev(svg, "height", "14");
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", svg_class_value = /*$$props*/ ctx[0].class);
    			add_location(svg, file$k, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    			append_dev(svg, defs);
    			append_dev(defs, clipPath);
    			append_dev(clipPath, rect);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && svg_class_value !== (svg_class_value = /*$$props*/ ctx[0].class)) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Address_ico', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Address_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Address_ico",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* public\images\Payment_ico.svelte generated by Svelte v3.48.0 */

    const file$j = "public\\images\\Payment_ico.svelte";

    function create_fragment$n(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M13.4615 6.46043H9.69231C8.51092 6.46043 7.53846 7.43289 7.53846 8.61428C7.53846 9.79566 8.51092 10.7681 9.69231 10.7681H11.8462V12.3835C11.8462 12.6791 11.6033 12.922 11.3077 12.922H2.69231C1.806 12.922 1.07692 12.1929 1.07692 11.3066V3.22966C1.07692 2.34335 1.806 1.61428 2.69231 1.61428H3.76923C4.06485 1.61428 4.30769 1.37143 4.30769 1.07582C4.30769 0.7802 4.06485 0.537354 3.76923 0.537354H2.69231C1.21531 0.537354 0 1.75266 0 3.22966V11.3066C0 12.7836 1.21531 13.9989 2.69231 13.9989H11.3077C12.194 13.9989 12.9231 13.2698 12.9231 12.3835V10.7681H13.4615C13.7572 10.7681 14 10.5253 14 10.2297V6.99889C14 6.70328 13.7572 6.46043 13.4615 6.46043ZM12.9231 9.6912H9.69231C9.10162 9.6912 8.61539 9.20497 8.61539 8.61428C8.61539 8.02358 9.10162 7.53735 9.69231 7.53735H12.9231V9.6912Z");
    			attr_dev(path0, "fill", "#E4E4E4");
    			add_location(path0, file$j, 8, 4, 155);
    			attr_dev(path1, "d", "M2.49857 2.72842C1.89765 2.99065 2.09634 3.76765 2.69242 3.76765H11.3078C11.6034 3.76765 11.8463 4.01049 11.8463 4.30611V4.84457C11.8463 5.14019 12.0891 5.38303 12.3847 5.38303C12.6803 5.38303 12.9232 5.14019 12.9232 4.84457V4.30611C12.9226 3.87803 12.7525 3.46719 12.4493 3.16457C12.1467 2.86142 11.7359 2.69126 11.3078 2.69072H11.1355L10.1932 0.337648C10.0839 0.0657245 9.77157 -0.0699679 9.49857 0.0361091L2.49857 2.72842ZM9.97242 2.69072H5.59473L9.39088 1.23149L9.97242 2.69072Z");
    			attr_dev(path1, "fill", "#E4E4E4");
    			add_location(path1, file$j, 12, 4, 988);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "14");
    			attr_dev(svg, "height", "14");
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", svg_class_value = /*$$props*/ ctx[0].class);
    			add_location(svg, file$j, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && svg_class_value !== (svg_class_value = /*$$props*/ ctx[0].class)) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Payment_ico', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Payment_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Payment_ico",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    const allowItemIndexBilling = writable(1);
    const addressFormStatus = writable(false);
    const billingeErrorMessage = writable({
      status: false,
      text: "Please add 1 billing method at least",
    });

    /* src\components\billing\Tabs\TabIcon.svelte generated by Svelte v3.48.0 */
    const file$i = "src\\components\\billing\\Tabs\\TabIcon.svelte";

    // (27:39) 
    function create_if_block_1$6(ctx) {
    	let payment_ico;
    	let t;
    	let div;
    	let div_class_value;
    	let current;

    	payment_ico = new Payment_ico({
    			props: { class: /*classNamePayment*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(payment_ico.$$.fragment);
    			t = space();
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "icon__line " + /*classNamePayment*/ ctx[1] + " svelte-1ue5uz1");
    			add_location(div, file$i, 28, 4, 904);
    		},
    		m: function mount(target, anchor) {
    			mount_component(payment_ico, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const payment_ico_changes = {};
    			if (dirty & /*classNamePayment*/ 2) payment_ico_changes.class = /*classNamePayment*/ ctx[1];
    			payment_ico.$set(payment_ico_changes);

    			if (!current || dirty & /*classNamePayment*/ 2 && div_class_value !== (div_class_value = "icon__line " + /*classNamePayment*/ ctx[1] + " svelte-1ue5uz1")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(payment_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(payment_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(payment_ico, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(27:39) ",
    		ctx
    	});

    	return block;
    }

    // (23:2) {#if categoryName === "Address"}
    function create_if_block$8(ctx) {
    	let address_ico;
    	let t;
    	let div;
    	let div_class_value;
    	let current;

    	address_ico = new Address_ico({
    			props: { class: /*classNameAddress*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(address_ico.$$.fragment);
    			t = space();
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "icon__line " + /*classNameAddress*/ ctx[2] + " svelte-1ue5uz1");
    			add_location(div, file$i, 24, 4, 765);
    		},
    		m: function mount(target, anchor) {
    			mount_component(address_ico, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const address_ico_changes = {};
    			if (dirty & /*classNameAddress*/ 4) address_ico_changes.class = /*classNameAddress*/ ctx[2];
    			address_ico.$set(address_ico_changes);

    			if (!current || dirty & /*classNameAddress*/ 4 && div_class_value !== (div_class_value = "icon__line " + /*classNameAddress*/ ctx[2] + " svelte-1ue5uz1")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(address_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(address_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(address_ico, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(23:2) {#if categoryName === \\\"Address\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$8, create_if_block_1$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*categoryName*/ ctx[0] === "Address") return 0;
    		if (/*categoryName*/ ctx[0] === "Payment") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "icon__wrapper  svelte-1ue5uz1");
    			add_location(div, file$i, 21, 0, 650);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let $allowItemIndexBilling;
    	validate_store(allowItemIndexBilling, 'allowItemIndexBilling');
    	component_subscribe($$self, allowItemIndexBilling, $$value => $$invalidate(3, $allowItemIndexBilling = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabIcon', slots, []);
    	let { categoryName } = $$props;
    	let classNamePayment = "";
    	let classNameAddress = "";

    	beforeUpdate(() => {
    		if ($allowItemIndexBilling === 2) {
    			$$invalidate(2, classNameAddress = "active");
    			$$invalidate(1, classNamePayment = "active");
    		} else if ($allowItemIndexBilling === 1) {
    			$$invalidate(2, classNameAddress = "active");
    			$$invalidate(1, classNamePayment = "");
    		}
    	});

    	const writable_props = ['categoryName'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('categoryName' in $$props) $$invalidate(0, categoryName = $$props.categoryName);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		Address_ico,
    		Payment_ico,
    		allowItemIndexBilling,
    		categoryName,
    		classNamePayment,
    		classNameAddress,
    		$allowItemIndexBilling
    	});

    	$$self.$inject_state = $$props => {
    		if ('categoryName' in $$props) $$invalidate(0, categoryName = $$props.categoryName);
    		if ('classNamePayment' in $$props) $$invalidate(1, classNamePayment = $$props.classNamePayment);
    		if ('classNameAddress' in $$props) $$invalidate(2, classNameAddress = $$props.classNameAddress);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [categoryName, classNamePayment, classNameAddress];
    }

    class TabIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { categoryName: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabIcon",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*categoryName*/ ctx[0] === undefined && !('categoryName' in props)) {
    			console.warn("<TabIcon> was created without expected prop 'categoryName'");
    		}
    	}

    	get categoryName() {
    		throw new Error("<TabIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categoryName(value) {
    		throw new Error("<TabIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\billing\Tabs\Tabs.svelte generated by Svelte v3.48.0 */
    const file$h = "src\\components\\billing\\Tabs\\Tabs.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (8:8) {#each tabItems as item, i}
    function create_each_block$4(ctx) {
    	let li;
    	let div;
    	let tabicon;
    	let t;
    	let current;

    	tabicon = new TabIcon({
    			props: { categoryName: /*item*/ ctx[1].name },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			create_component(tabicon.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "icon");
    			add_location(div, file$h, 9, 16, 194);
    			attr_dev(li, "class", "svelte-aph3ik");
    			add_location(li, file$h, 8, 12, 172);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			mount_component(tabicon, div, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabicon_changes = {};
    			if (dirty & /*tabItems*/ 1) tabicon_changes.categoryName = /*item*/ ctx[1].name;
    			tabicon.$set(tabicon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(tabicon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(8:8) {#each tabItems as item, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div;
    	let ul;
    	let current;
    	let each_value = /*tabItems*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-aph3ik");
    			add_location(ul, file$h, 6, 4, 117);
    			attr_dev(div, "class", "tabs svelte-aph3ik");
    			add_location(div, file$h, 5, 0, 93);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tabItems*/ 1) {
    				each_value = /*tabItems*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tabs', slots, []);
    	let { tabItems } = $$props;
    	const writable_props = ['tabItems'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('tabItems' in $$props) $$invalidate(0, tabItems = $$props.tabItems);
    	};

    	$$self.$capture_state = () => ({ TabIcon, tabItems });

    	$$self.$inject_state = $$props => {
    		if ('tabItems' in $$props) $$invalidate(0, tabItems = $$props.tabItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tabItems];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { tabItems: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tabItems*/ ctx[0] === undefined && !('tabItems' in props)) {
    			console.warn("<Tabs> was created without expected prop 'tabItems'");
    		}
    	}

    	get tabItems() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabItems(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var dayjs_min = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",$="Invalid Date",l=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},g={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},v="en",D={};D[v]=M;var p=function(t){return t instanceof _},S=function t(e,n,r){var i;if(!e)return v;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else {var a=e.name;D[a]=e,i=a;}return !r&&i&&(v=i),i||!r&&v},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=g;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t);}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(l);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return O},m.isValid=function(){return !(this.$d.toString()===$)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),$=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},l=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,g="set"+(this.$u?"UTC":"");switch(h){case c:return r?$(1,0):$(31,11);case f:return r?$(1,M):$(0,M+1);case o:var v=this.$locale().weekStart||0,D=(y<v?y+7:y)-v;return $(r?m-D:m+(6-D),M);case a:case d:return l(g+"Hours",0);case u:return l(g+"Minutes",1);case s:return l(g+"Seconds",2);case i:return l(g+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),$=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],l=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[$](l),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else $&&this.$d[$](l);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,$=this;r=Number(r);var l=O.p(h),y=function(t){var e=w($);return O.w(e.date(e.date()+Math.round(t*r)),$)};if(l===f)return this.set(f,this.$M+r);if(l===c)return this.set(c,this.$y+r);if(l===a)return y(1);if(l===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[l]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||$;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||l[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,$){var l,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,g=this-M,v=O.m(this,M);return v=(l={},l[c]=v/12,l[f]=v,l[h]=v/3,l[o]=(g-m)/6048e5,l[a]=(g-m)/864e5,l[u]=g/n,l[s]=g/e,l[i]=g/t,l)[y]||g,$?v:O.a(v)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),T=_.prototype;return w.prototype=T,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){T[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=D[v],w.Ls=D,w.p={},w}));
    });

    const PICKER_TYPES = ['days', 'months', 'years'];

    const updateSelected = (value, property) => (state) => {
    	const newState = { ...state, [property]: value };
    	return { ...newState, selected: new Date(newState.year, newState.month, newState.day) };
    };

    const pipe = (...fns) => (val) => fns.reduce((accum, fn) => fn(accum), val);

    const zeroDay = (date) => dayjs_min(date).startOf('day').toDate();

    const get = ({ selected, start, end, startOfWeekIndex = 0, shouldEnlargeDay = false }) => {
    	const { subscribe, set, update } = writable({
    		open: false,
    		hasChosen: false,
    		selected,
    		start: zeroDay(start),
    		end: zeroDay(end),
    		shouldEnlargeDay,
    		enlargeDay: false,
    		year: selected.getFullYear(),
    		month: selected.getMonth(),
    		day: selected.getDate(),
    		activeView: 'days',
    		activeViewDirection: 1,
    		startOfWeekIndex
    	});

    	return {
    		set,
    		subscribe,
    		getState() {
    			return get_store_value({ subscribe });
    		},
    		enlargeDay(enlargeDay = true) {
    			update((state) => ({ ...state, enlargeDay }));
    		},
    		getSelectableVector(date) {
    			const { start, end } = this.getState();
    			if (date < start) return -1;
    			if (date > end) return 1;
    			return 0;
    		},
    		isSelectable(date, clamping = []) {
    			const vector = this.getSelectableVector(date);
    			if (vector === 0) return true;
    			if (!clamping.length) return false;
    			const clamped = this.clampValue(dayjs_min(date), clamping).toDate();
    			return this.isSelectable(clamped);
    		},
    		clampValue(day, clampable) {
    			const vector = this.getSelectableVector(day.toDate());
    			if (vector === 0) return day;
    			const boundaryKey = vector === 1 ? 'end' : 'start';
    			const boundary = dayjs_min(this.getState()[boundaryKey]);
    			return clampable.reduce((day, type) => day[type](boundary[type]()), day);
    		},
    		add(amount, unit, clampable = []) {
    			update(({ month, year, day, ...state }) => {
    				const d = this.clampValue(dayjs_min(new Date(year, month, day)).add(amount, unit), clampable);
    				if (!this.isSelectable(d.toDate())) return { ...state, year, month, day };
    				return {
    					...state,
    					month: d.month(),
    					year: d.year(),
    					day: d.date(),
    					selected: d.toDate()
    				};
    			});
    		},
    		setActiveView(newActiveView) {
    			const newIndex = PICKER_TYPES.indexOf(newActiveView);
    			if (newIndex === -1) return;
    			update(({ activeView, ...state }) => ({
    				...state,
    				activeViewDirection: PICKER_TYPES.indexOf(activeView) > newIndex ? -1 : 1,
    				activeView: newActiveView
    			}));
    		},
    		setYear(year) {
    			update(updateSelected(year, 'year'));
    		},
    		setMonth(month) {
    			update(updateSelected(month, 'month'));
    		},
    		setDay(day) {
    			update(
    				pipe(
    					updateSelected(day.getDate(), 'day'),
    					updateSelected(day.getMonth(), 'month'),
    					updateSelected(day.getFullYear(), 'year')
    				)
    			);
    		},
    		close(extraState) {
    			update((state) => ({ ...state, ...extraState, open: false }));
    		},
    		selectDay() {
    			this.close({ hasChosen: true });
    		},
    		getCalendarPage(month, year) {
    			const { startOfWeekIndex } = this.getState();
    			let last = { date: new Date(year, month, 1), outsider: false };
    			const days = [];

    			while (last.date.getMonth() === month) {
    				days.push(last);
    				const date = new Date(last.date);
    				date.setDate(last.date.getDate() + 1);
    				last = { date, outsider: false };
    			}

    			while (days[0].date.getDay() !== startOfWeekIndex) {
    				const date = new Date(days[0].date);
    				date.setDate(days[0].date.getDate() - 1);
    				days.unshift({
    					date,
    					outsider: true
    				});
    			}

    			last.outsider = true;
    			while (days.length < 42) {
    				days.push(last);
    				last = { date: new Date(last.date), outsider: true };
    				last.date.setDate(last.date.getDate() + 1);
    			}

    			return days;
    		}
    	};
    };

    var datepickerStore = { get };

    const storeContextKey = {};
    const keyControlsContextKey = {};
    const themeContextKey = {};

    /* node_modules\svelte-calendar\components\generic\crossfade\Crossfade.svelte generated by Svelte v3.48.0 */
    const get_default_slot_changes$5 = dirty => ({ key: dirty & /*key*/ 1 });

    const get_default_slot_context$5 = ctx => ({
    	key: /*key*/ ctx[0],
    	send: /*send*/ ctx[1],
    	receive: /*receive*/ ctx[2]
    });

    function create_fragment$k(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], get_default_slot_context$5);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, key*/ 33)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, get_default_slot_changes$5),
    						get_default_slot_context$5
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Crossfade', slots, ['default']);
    	let { key = {} } = $$props;
    	let { duration = d => Math.max(150, Math.sqrt(d * 150)) } = $$props;
    	let { easing = cubicInOut } = $$props;

    	const [send, receive] = crossfade({
    		duration,
    		easing,
    		fallback(node, params) {
    			const style = getComputedStyle(node);
    			const transform = style.transform === 'none' ? '' : style.transform;

    			return {
    				duration,
    				easing,
    				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
    			};
    		}
    	});

    	const store = readable({ key, send, receive });
    	setContext('crossfade', store);
    	const writable_props = ['key', 'duration', 'easing'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Crossfade> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('key' in $$props) $$invalidate(0, key = $$props.key);
    		if ('duration' in $$props) $$invalidate(3, duration = $$props.duration);
    		if ('easing' in $$props) $$invalidate(4, easing = $$props.easing);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		readable,
    		crossfade,
    		cubicInOut,
    		key,
    		duration,
    		easing,
    		send,
    		receive,
    		store
    	});

    	$$self.$inject_state = $$props => {
    		if ('key' in $$props) $$invalidate(0, key = $$props.key);
    		if ('duration' in $$props) $$invalidate(3, duration = $$props.duration);
    		if ('easing' in $$props) $$invalidate(4, easing = $$props.easing);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [key, send, receive, duration, easing, $$scope, slots];
    }

    class Crossfade extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { key: 0, duration: 3, easing: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Crossfade",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get key() {
    		throw new Error("<Crossfade>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Crossfade>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Crossfade>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Crossfade>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get easing() {
    		throw new Error("<Crossfade>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set easing(value) {
    		throw new Error("<Crossfade>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var blurr = (node) => {
    	const click = (evt) => {
    		if (!node || node.contains(evt.target) || evt.defaultPrevented) return;
    		node.dispatchEvent(new CustomEvent('blurr', node));
    	};

    	document.addEventListener('click', click, true);

    	return {
    		destroy() {
    			document.removeEventListener('click', click, true);
    		}
    	};
    };

    /* node_modules\svelte-calendar\components\Popover.svelte generated by Svelte v3.48.0 */
    const file$g = "node_modules\\svelte-calendar\\components\\Popover.svelte";

    const get_contents_slot_changes = dirty => ({
    	key: dirty & /*key*/ 1048576,
    	send: dirty & /*send*/ 524288,
    	receive: dirty & /*receive*/ 262144
    });

    const get_contents_slot_context = ctx => ({
    	key: /*key*/ ctx[20],
    	send: /*send*/ ctx[19],
    	receive: /*receive*/ ctx[18]
    });

    const get_default_slot_changes$4 = dirty => ({
    	key: dirty & /*key*/ 1048576,
    	send: dirty & /*send*/ 524288,
    	receive: dirty & /*receive*/ 262144
    });

    const get_default_slot_context$4 = ctx => ({
    	key: /*key*/ ctx[20],
    	send: /*send*/ ctx[19],
    	receive: /*receive*/ ctx[18]
    });

    // (69:2) {:else}
    function create_else_block(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let current;
    	const contents_slot_template = /*#slots*/ ctx[10].contents;
    	const contents_slot = create_slot(contents_slot_template, ctx, /*$$scope*/ ctx[14], get_contents_slot_context);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (contents_slot) contents_slot.c();
    			attr_dev(div0, "class", "contents-inner");
    			add_location(div0, file$g, 75, 5, 1712);
    			attr_dev(div1, "class", "contents");
    			add_location(div1, file$g, 74, 4, 1684);
    			attr_dev(div2, "class", "contents-wrapper svelte-ff0ii6");
    			set_style(div2, "transform", "translate(-50%,-50%) translate(" + /*translateX*/ ctx[4] + "px, " + /*translateY*/ ctx[3] + "px)");
    			add_location(div2, file$g, 69, 3, 1523);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (contents_slot) {
    				contents_slot.m(div0, null);
    			}

    			/*div2_binding*/ ctx[12](div2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (contents_slot) {
    				if (contents_slot.p && (!current || dirty & /*$$scope, key, send, receive*/ 1851392)) {
    					update_slot_base(
    						contents_slot,
    						contents_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(contents_slot_template, /*$$scope*/ ctx[14], dirty, get_contents_slot_changes),
    						get_contents_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*translateX, translateY*/ 24) {
    				set_style(div2, "transform", "translate(-50%,-50%) translate(" + /*translateX*/ ctx[4] + "px, " + /*translateY*/ ctx[3] + "px)");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contents_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contents_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (contents_slot) contents_slot.d(detaching);
    			/*div2_binding*/ ctx[12](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(69:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (60:2) {#if !isOpen}
    function create_if_block$7(ctx) {
    	let div;
    	let div_resize_listener;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context$4);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "trigger svelte-ff0ii6");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[11].call(div));
    			add_location(div, file$g, 60, 3, 1333);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[11].bind(div));
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*openPopover*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, key, send, receive*/ 1851392)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes$4),
    						get_default_slot_context$4
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			div_resize_listener();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(60:2) {#if !isOpen}",
    		ctx
    	});

    	return block;
    }

    // (52:0) <Crossfade let:receive let:send let:key>
    function create_default_slot$6(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let div_style_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$7, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*isOpen*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "sc-popover svelte-ff0ii6");
    			attr_dev(div, "style", div_style_value = "" + (/*style*/ ctx[1] + "; min-width: " + (/*triggerWidth*/ ctx[6] + 1) + "px; min-height: " + (/*triggerHeight*/ ctx[7] + 1) + "px;"));
    			add_location(div, file$g, 52, 1, 1145);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			/*div_binding*/ ctx[13](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(blurr.call(null, div)),
    					listen_dev(div, "blurr", /*close*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}

    			if (!current || dirty & /*style, triggerWidth, triggerHeight*/ 194 && div_style_value !== (div_style_value = "" + (/*style*/ ctx[1] + "; min-width: " + (/*triggerWidth*/ ctx[6] + 1) + "px; min-height: " + (/*triggerHeight*/ ctx[7] + 1) + "px;"))) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			/*div_binding*/ ctx[13](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(52:0) <Crossfade let:receive let:send let:key>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let crossfade;
    	let current;

    	crossfade = new Crossfade({
    			props: {
    				$$slots: {
    					default: [
    						create_default_slot$6,
    						({ receive, send, key }) => ({ 18: receive, 19: send, 20: key }),
    						({ receive, send, key }) => (receive ? 262144 : 0) | (send ? 524288 : 0) | (key ? 1048576 : 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(crossfade.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(crossfade, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const crossfade_changes = {};

    			if (dirty & /*$$scope, style, triggerWidth, triggerHeight, popover, key, send, receive, isOpen, translateX, translateY, contentsWrapper*/ 1851899) {
    				crossfade_changes.$$scope = { dirty, ctx };
    			}

    			crossfade.$set(crossfade_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(crossfade.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(crossfade.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(crossfade, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Popover', slots, ['default','contents']);
    	let { isOpen = false } = $$props;
    	let { style = '' } = $$props;
    	let translateY = 0;
    	let translateX = 0;
    	let popover;
    	let triggerWidth;
    	let triggerHeight;
    	let contentsWrapper;

    	const close = () => {
    		$$invalidate(0, isOpen = false);
    	};

    	const getDistanceToEdges = () => {
    		let { top, bottom, left, right } = contentsWrapper.getBoundingClientRect();

    		return {
    			top: top + -1 * translateY,
    			bottom: window.innerHeight - bottom + translateY,
    			left: left + -1 * translateX,
    			right: document.body.clientWidth - right + translateX
    		};
    	};

    	const getY = ({ bottom, top }) => {
    		if (top < 0) return -1 * top;
    		if (bottom < 0) return bottom;
    		return 0;
    	};

    	const getX = ({ left, right }) => {
    		if (left < 0) return -1 * left;
    		if (right < 0) return right;
    		return 0;
    	};

    	const openPopover = async () => {
    		$$invalidate(0, isOpen = true);
    		await tick();
    		let dist = getDistanceToEdges();
    		$$invalidate(4, translateX = getX(dist));
    		$$invalidate(3, translateY = getY(dist));
    	};

    	const writable_props = ['isOpen', 'style'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Popover> was created with unknown prop '${key}'`);
    	});

    	function div_elementresize_handler() {
    		triggerWidth = this.offsetWidth;
    		triggerHeight = this.offsetHeight;
    		$$invalidate(6, triggerWidth);
    		$$invalidate(7, triggerHeight);
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			contentsWrapper = $$value;
    			$$invalidate(8, contentsWrapper);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			popover = $$value;
    			$$invalidate(5, popover);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Crossfade,
    		blurr,
    		tick,
    		isOpen,
    		style,
    		translateY,
    		translateX,
    		popover,
    		triggerWidth,
    		triggerHeight,
    		contentsWrapper,
    		close,
    		getDistanceToEdges,
    		getY,
    		getX,
    		openPopover
    	});

    	$$self.$inject_state = $$props => {
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    		if ('translateY' in $$props) $$invalidate(3, translateY = $$props.translateY);
    		if ('translateX' in $$props) $$invalidate(4, translateX = $$props.translateX);
    		if ('popover' in $$props) $$invalidate(5, popover = $$props.popover);
    		if ('triggerWidth' in $$props) $$invalidate(6, triggerWidth = $$props.triggerWidth);
    		if ('triggerHeight' in $$props) $$invalidate(7, triggerHeight = $$props.triggerHeight);
    		if ('contentsWrapper' in $$props) $$invalidate(8, contentsWrapper = $$props.contentsWrapper);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isOpen,
    		style,
    		close,
    		translateY,
    		translateX,
    		popover,
    		triggerWidth,
    		triggerHeight,
    		contentsWrapper,
    		openPopover,
    		slots,
    		div_elementresize_handler,
    		div2_binding,
    		div_binding,
    		$$scope
    	];
    }

    class Popover extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { isOpen: 0, style: 1, close: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Popover",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get isOpen() {
    		throw new Error("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		return this.$$.ctx[2];
    	}

    	set close(value) {
    		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const light = {
    	calendar: {
    		width: '700px',
    		maxWidth: '100vw',
    		legend: {
    			height: '45px'
    		},
    		shadow: '0px 10px 26px rgba(0, 0, 0, 0.25)',
    		colors: {
    			text: {
    				primary: '#333',
    				highlight: '#fff'
    			},
    			background: {
    				primary: '#fff',
    				highlight: '#eb7400',
    				hover: '#eee'
    			},
    			border: '#eee'
    		},
    		font: {
    			regular: '1.5em',
    			large: '37em'
    		},
    		grid: {
    			disabledOpacity: '.35',
    			outsiderOpacity: '.6'
    		}
    	}
    };

    /* node_modules\svelte-calendar\components\generic\Theme.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1 } = globals;

    const get_default_slot_changes$3 = dirty => ({
    	appliedTheme: dirty & /*appliedTheme*/ 1,
    	style: dirty & /*style*/ 2
    });

    const get_default_slot_context$3 = ctx => ({
    	appliedTheme: /*appliedTheme*/ ctx[0],
    	style: /*style*/ ctx[1]
    });

    function create_fragment$i(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], get_default_slot_context$3);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, appliedTheme, style*/ 35)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, get_default_slot_changes$3),
    						get_default_slot_context$3
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let style;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Theme', slots, ['default']);
    	let { theme = {} } = $$props;
    	let { appliedTheme } = $$props;
    	let { prefix = '--sc-theme' } = $$props;
    	let { defaultTheme = light } = $$props;
    	const store = writable();
    	setContext(themeContextKey, store);
    	const getStyle = obj => Object.entries(obj).map(([k, v]) => `${prefix}-${k}: ${v}`).join(';');

    	const getTheme = (defaults, overrides = {}, base = '') => Object.entries(defaults).reduce(
    		(acc, [k, v]) => {
    			if (typeof v === 'object') return {
    				...acc,
    				...getTheme(v, overrides[k], [base, k].filter(Boolean).join('-'))
    			};

    			return {
    				...acc,
    				[[base, k].filter(Boolean).join('-')]: overrides[k] || v
    			};
    		},
    		{}
    	);

    	const writable_props = ['theme', 'appliedTheme', 'prefix', 'defaultTheme'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Theme> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('theme' in $$props) $$invalidate(2, theme = $$props.theme);
    		if ('appliedTheme' in $$props) $$invalidate(0, appliedTheme = $$props.appliedTheme);
    		if ('prefix' in $$props) $$invalidate(3, prefix = $$props.prefix);
    		if ('defaultTheme' in $$props) $$invalidate(4, defaultTheme = $$props.defaultTheme);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		lightTheme: light,
    		themeContextKey,
    		setContext,
    		writable,
    		theme,
    		appliedTheme,
    		prefix,
    		defaultTheme,
    		store,
    		getStyle,
    		getTheme,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) $$invalidate(2, theme = $$props.theme);
    		if ('appliedTheme' in $$props) $$invalidate(0, appliedTheme = $$props.appliedTheme);
    		if ('prefix' in $$props) $$invalidate(3, prefix = $$props.prefix);
    		if ('defaultTheme' in $$props) $$invalidate(4, defaultTheme = $$props.defaultTheme);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*defaultTheme, theme*/ 20) {
    			$$invalidate(0, appliedTheme = getTheme(defaultTheme, theme));
    		}

    		if ($$self.$$.dirty & /*appliedTheme*/ 1) {
    			$$invalidate(1, style = getStyle(appliedTheme));
    		}

    		if ($$self.$$.dirty & /*appliedTheme*/ 1) {
    			store.set(appliedTheme);
    		}
    	};

    	return [appliedTheme, style, theme, prefix, defaultTheme, $$scope, slots];
    }

    class Theme extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			theme: 2,
    			appliedTheme: 0,
    			prefix: 3,
    			defaultTheme: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Theme",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*appliedTheme*/ ctx[0] === undefined && !('appliedTheme' in props)) {
    			console.warn("<Theme> was created without expected prop 'appliedTheme'");
    		}
    	}

    	get theme() {
    		throw new Error("<Theme>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<Theme>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get appliedTheme() {
    		throw new Error("<Theme>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set appliedTheme(value) {
    		throw new Error("<Theme>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error("<Theme>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error("<Theme>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defaultTheme() {
    		throw new Error("<Theme>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultTheme(value) {
    		throw new Error("<Theme>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const KEY_CODES = {
    	33: 'pageUp',
    	34: 'pageDown',
    	37: 'left',
    	38: 'up',
    	39: 'right',
    	40: 'down',
    	27: 'escape',
    	13: 'enter',
    	17: 'control'
    };

    var justThrottle = throttle;

    function throttle(fn, interval, options) {
      var timeoutId = null;
      var throttledFn = null;
      var leading = (options && options.leading);
      var trailing = (options && options.trailing);

      if (leading == null) {
        leading = true; // default
      }

      if (trailing == null) {
        trailing = !leading; //default
      }

      if (leading == true) {
        trailing = false; // forced because there should be invocation per call
      }

      var cancel = function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      };

      var flush = function() {
        var call = throttledFn;
        cancel();

        if (call) {
          call();
        }
      };

      var throttleWrapper = function() {
        var callNow = leading && !timeoutId;
        var context = this;
        var args = arguments;

        throttledFn = function() {
          return fn.apply(context, args);
        };

        if (!timeoutId) {
          timeoutId = setTimeout(function() {
            timeoutId = null;

            if (trailing) {
              return throttledFn();
            }
          }, interval);
        }

        if (callNow) {
          callNow = false;
          return throttledFn();
        }
      };

      throttleWrapper.cancel = cancel;
      throttleWrapper.flush = flush;

      return throttleWrapper;
    }

    /* node_modules\svelte-calendar\components\generic\KeyControls.svelte generated by Svelte v3.48.0 */

    function create_fragment$h(ctx) {
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					window,
    					"keydown",
    					function () {
    						if (is_function(/*eventHandler*/ ctx[0])) /*eventHandler*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let eventHandler;
    	let $currentCtx;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('KeyControls', slots, ['default']);
    	let { limit = 0 } = $$props;
    	let { ctx = null } = $$props;
    	const currentCtx = getContext(keyControlsContextKey);
    	validate_store(currentCtx, 'currentCtx');
    	component_subscribe($$self, currentCtx, value => $$invalidate(6, $currentCtx = value));

    	const key = evt => {
    		if (ctx && !ctx.includes($currentCtx)) return;
    		const mapping = $$props[KEY_CODES[evt.keyCode]];
    		if (mapping) mapping();
    	};

    	$$self.$$set = $$new_props => {
    		$$invalidate(8, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('limit' in $$new_props) $$invalidate(2, limit = $$new_props.limit);
    		if ('ctx' in $$new_props) $$invalidate(3, ctx = $$new_props.ctx);
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		KEY_CODES,
    		keyControlsContextKey,
    		throttle: justThrottle,
    		getContext,
    		limit,
    		ctx,
    		currentCtx,
    		key,
    		eventHandler,
    		$currentCtx
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(8, $$props = assign(assign({}, $$props), $$new_props));
    		if ('limit' in $$props) $$invalidate(2, limit = $$new_props.limit);
    		if ('ctx' in $$props) $$invalidate(3, ctx = $$new_props.ctx);
    		if ('eventHandler' in $$props) $$invalidate(0, eventHandler = $$new_props.eventHandler);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*limit*/ 4) {
    			$$invalidate(0, eventHandler = limit ? justThrottle(key, limit) : key);
    		}
    	};

    	$$props = exclude_internal_props($$props);
    	return [eventHandler, currentCtx, limit, ctx, $$scope, slots];
    }

    class KeyControls extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { limit: 2, ctx: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "KeyControls",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get limit() {
    		throw new Error("<KeyControls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set limit(value) {
    		throw new Error("<KeyControls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ctx() {
    		throw new Error("<KeyControls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ctx(value) {
    		throw new Error("<KeyControls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-calendar\components\generic\Grid.svelte generated by Svelte v3.48.0 */

    const file$f = "node_modules\\svelte-calendar\\components\\generic\\Grid.svelte";

    function create_fragment$g(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "grid svelte-jmgdr0");
    			set_style(div, "grid-template", /*template*/ ctx[0]);
    			add_location(div, file$f, 4, 0, 78);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*template*/ 1) {
    				set_style(div, "grid-template", /*template*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grid', slots, ['default']);
    	let { template = 'repeat(4, 1fr) / repeat(3, 1fr)' } = $$props;
    	const writable_props = ['template'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Grid> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('template' in $$props) $$invalidate(0, template = $$props.template);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ template });

    	$$self.$inject_state = $$props => {
    		if ('template' in $$props) $$invalidate(0, template = $$props.template);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [template, $$scope, slots];
    }

    class Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { template: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grid",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get template() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set template(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value) {
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            }
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled) {
                        task = null;
                    }
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    /* node_modules\svelte-calendar\components\generic\InfiniteGrid.svelte generated by Svelte v3.48.0 */
    const file$e = "node_modules\\svelte-calendar\\components\\generic\\InfiniteGrid.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	return child_ctx;
    }

    const get_default_slot_spread_changes = dirty => dirty & /*$visibleData*/ 16;
    const get_default_slot_changes$2 = dirty => ({ index: dirty & /*$visibleData*/ 16 });

    const get_default_slot_context$2 = ctx => ({
    	.../*obj*/ ctx[28].data,
    	index: /*obj*/ ctx[28].index
    });

    // (74:1) {#each $visibleData as obj (obj.data?.[idKey] || obj.index)}
    function create_each_block$3(key_1, ctx) {
    	let div;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], get_default_slot_context$2);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			set_style(div, "transform", "translateY(" + /*obj*/ ctx[28].pos + "px)");
    			attr_dev(div, "class", "svelte-198r3wi");
    			add_location(div, file$e, 74, 2, 2276);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $visibleData*/ 1048592)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[20],
    						get_default_slot_spread_changes(dirty) || !current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[20])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[20], dirty, get_default_slot_changes$2),
    						get_default_slot_context$2
    					);
    				}
    			}

    			if (!current || dirty & /*$visibleData*/ 16) {
    				set_style(div, "transform", "translateY(" + /*obj*/ ctx[28].pos + "px)");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(74:1) {#each $visibleData as obj (obj.data?.[idKey] || obj.index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let div_resize_listener;
    	let current;
    	let each_value = /*$visibleData*/ ctx[4];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*obj*/ ctx[28].data?.[/*idKey*/ ctx[0]] || /*obj*/ ctx[28].index;
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "grid svelte-198r3wi");
    			attr_dev(div, "style", /*gridStyle*/ ctx[3]);
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[22].call(div));
    			add_location(div, file$e, 72, 0, 2122);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[22].bind(div));
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$visibleData, $$scope, idKey*/ 1048593) {
    				each_value = /*$visibleData*/ ctx[4];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$3, null, get_each_context$3);
    				check_outros();
    			}

    			if (!current || dirty & /*gridStyle*/ 8) {
    				attr_dev(div, "style", /*gridStyle*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			div_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let type;
    	let gridStyle;
    	let $initialized;
    	let $dim;
    	let $offset;

    	let $visibleData,
    		$$unsubscribe_visibleData = noop,
    		$$subscribe_visibleData = () => ($$unsubscribe_visibleData(), $$unsubscribe_visibleData = subscribe(visibleData, $$value => $$invalidate(4, $visibleData = $$value)), visibleData);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_visibleData());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InfiniteGrid', slots, ['default']);
    	let { cellCount = 4 } = $$props;
    	let { itemCount = 0 } = $$props;
    	let { index = 0 } = $$props;
    	let { vertical = true } = $$props;
    	let { get } = $$props;
    	let { stiffness = 0.065 } = $$props;
    	let { damping = 0.9 } = $$props;
    	let { useCache = true } = $$props;
    	let { idKey = undefined } = $$props;

    	const move = amount => {
    		$$invalidate(8, index = Math.max(0, Math.min(itemCount - 1, index + amount)));
    	};

    	const forceUpdate = writable(false);

    	const triggerUpdate = async () => {
    		await tick();
    		forceUpdate.set(true);
    		await tick();
    		forceUpdate.set(false);
    	};

    	const getCached = index => $visibleData.find(({ index: i }) => i === index)?.data || get(index);
    	let inRange = [-Infinity, Infinity];
    	const initialized = writable(false);
    	validate_store(initialized, 'initialized');
    	component_subscribe($$self, initialized, value => $$invalidate(19, $initialized = value));
    	const dim = writable({ w: 0, h: 0 });
    	validate_store(dim, 'dim');
    	component_subscribe($$self, dim, value => $$invalidate(2, $dim = value));
    	const offset = spring(0, { stiffness, damping });
    	validate_store(offset, 'offset');
    	component_subscribe($$self, offset, value => $$invalidate(24, $offset = value));

    	const visibleData = derived(
    		[dim, offset, initialized, forceUpdate],
    		([{ w, h }, $o, $initialized, $force]) => {
    			if (!w || !h || !$initialized) return [];
    			if ($o < inRange[0] || $o > inRange[1]) return $visibleData;
    			const cellHeight = h / cellCount;
    			const start = Math.max(-1, Math.floor(-1 * $o / cellHeight) - 1);
    			const baseOffset = $o % cellHeight;

    			return Array(cellCount + 2).fill(0).map((_, i) => {
    				const index = i + start;
    				const pos = baseOffset + (i - 1) * cellHeight;
    				if (index < 0 || index >= itemCount) return undefined;
    				const data = $force || !useCache ? get(index) : getCached(index);
    				return { data, pos, index };
    			}).filter(Boolean);
    		},
    		[]
    	);

    	validate_store(visibleData, 'visibleData');
    	$$subscribe_visibleData();

    	const updateOffset = o => {
    		inRange = [o, $offset].sort((a, b) => a - b);
    		offset.set(o, { hard: !$initialized });
    	};

    	const writable_props = [
    		'cellCount',
    		'itemCount',
    		'index',
    		'vertical',
    		'get',
    		'stiffness',
    		'damping',
    		'useCache',
    		'idKey'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InfiniteGrid> was created with unknown prop '${key}'`);
    	});

    	function div_elementresize_handler() {
    		$dim.h = this.clientHeight;
    		dim.set($dim);
    		$dim.w = this.clientWidth;
    		dim.set($dim);
    	}

    	$$self.$$set = $$props => {
    		if ('cellCount' in $$props) $$invalidate(9, cellCount = $$props.cellCount);
    		if ('itemCount' in $$props) $$invalidate(10, itemCount = $$props.itemCount);
    		if ('index' in $$props) $$invalidate(8, index = $$props.index);
    		if ('vertical' in $$props) $$invalidate(11, vertical = $$props.vertical);
    		if ('get' in $$props) $$invalidate(12, get = $$props.get);
    		if ('stiffness' in $$props) $$invalidate(13, stiffness = $$props.stiffness);
    		if ('damping' in $$props) $$invalidate(14, damping = $$props.damping);
    		if ('useCache' in $$props) $$invalidate(15, useCache = $$props.useCache);
    		if ('idKey' in $$props) $$invalidate(0, idKey = $$props.idKey);
    		if ('$$scope' in $$props) $$invalidate(20, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		tick,
    		spring,
    		derived,
    		writable,
    		cellCount,
    		itemCount,
    		index,
    		vertical,
    		get,
    		stiffness,
    		damping,
    		useCache,
    		idKey,
    		move,
    		forceUpdate,
    		triggerUpdate,
    		getCached,
    		inRange,
    		initialized,
    		dim,
    		offset,
    		visibleData,
    		updateOffset,
    		type,
    		gridStyle,
    		$initialized,
    		$dim,
    		$offset,
    		$visibleData
    	});

    	$$self.$inject_state = $$props => {
    		if ('cellCount' in $$props) $$invalidate(9, cellCount = $$props.cellCount);
    		if ('itemCount' in $$props) $$invalidate(10, itemCount = $$props.itemCount);
    		if ('index' in $$props) $$invalidate(8, index = $$props.index);
    		if ('vertical' in $$props) $$invalidate(11, vertical = $$props.vertical);
    		if ('get' in $$props) $$invalidate(12, get = $$props.get);
    		if ('stiffness' in $$props) $$invalidate(13, stiffness = $$props.stiffness);
    		if ('damping' in $$props) $$invalidate(14, damping = $$props.damping);
    		if ('useCache' in $$props) $$invalidate(15, useCache = $$props.useCache);
    		if ('idKey' in $$props) $$invalidate(0, idKey = $$props.idKey);
    		if ('inRange' in $$props) inRange = $$props.inRange;
    		if ('type' in $$props) $$invalidate(18, type = $$props.type);
    		if ('gridStyle' in $$props) $$invalidate(3, gridStyle = $$props.gridStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*vertical*/ 2048) {
    			$$invalidate(18, type = vertical ? 'rows' : 'columns');
    		}

    		if ($$self.$$.dirty & /*type, cellCount*/ 262656) {
    			$$invalidate(3, gridStyle = `grid-template-${type}: repeat(${cellCount}, 1fr);`);
    		}

    		if ($$self.$$.dirty & /*$dim, cellCount, index, $initialized*/ 525060) {
    			{
    				if ($dim.w && $dim.h) {
    					updateOffset($dim.h / cellCount * index * -1);
    					if (!$initialized) initialized.set(true);
    				}
    			}
    		}
    	};

    	return [
    		idKey,
    		visibleData,
    		$dim,
    		gridStyle,
    		$visibleData,
    		initialized,
    		dim,
    		offset,
    		index,
    		cellCount,
    		itemCount,
    		vertical,
    		get,
    		stiffness,
    		damping,
    		useCache,
    		move,
    		triggerUpdate,
    		type,
    		$initialized,
    		$$scope,
    		slots,
    		div_elementresize_handler
    	];
    }

    class InfiniteGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			cellCount: 9,
    			itemCount: 10,
    			index: 8,
    			vertical: 11,
    			get: 12,
    			stiffness: 13,
    			damping: 14,
    			useCache: 15,
    			idKey: 0,
    			move: 16,
    			triggerUpdate: 17,
    			visibleData: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InfiniteGrid",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*get*/ ctx[12] === undefined && !('get' in props)) {
    			console.warn("<InfiniteGrid> was created without expected prop 'get'");
    		}
    	}

    	get cellCount() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cellCount(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemCount() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemCount(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vertical() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vertical(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get get() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set get(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stiffness() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stiffness(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get damping() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set damping(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get useCache() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set useCache(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get idKey() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set idKey(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get move() {
    		return this.$$.ctx[16];
    	}

    	set move(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get triggerUpdate() {
    		return this.$$.ctx[17];
    	}

    	set triggerUpdate(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visibleData() {
    		return this.$$.ctx[1];
    	}

    	set visibleData(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const scrollStep = 120;

    var scrollable = (node, opts) => {
    	let { y: yi = 0, step = scrollStep } = opts;
    	let lastTouch = 0;
    	let y = yi;

    	const updateY = (val) => {
    		const { maxSteps = Infinity } = opts;
    		y = Math.max(0, Math.min(maxSteps * step, val));
    	};

    	const emitY = () => {
    		if (Math.round(y / step) === Math.round(yi / step)) return;
    		yi = y;
    		node.dispatchEvent(
    			new CustomEvent('y', {
    				detail: {
    					y,
    					step: Math.round(y / step)
    				}
    			})
    		);
    	};

    	const wheelListener = ({ deltaY }) => {
    		updateY(y + deltaY);
    		emitY();
    	};
    	const touchstartListener = ({ touches: [{ pageY }] }) => {
    		lastTouch = pageY;
    		emitY();
    	};
    	const touchmoveListener = ({ touches: [{ pageY }] }) => {
    		updateY(y - (pageY - lastTouch));
    		lastTouch = pageY;
    		emitY();
    	};

    	node.addEventListener('wheel', wheelListener);
    	node.addEventListener('touchstart', touchstartListener);
    	node.addEventListener('touchmove', touchmoveListener);
    	node.style.touchAction = 'none';

    	return {
    		destroy() {
    			node.removeEventListener('wheel', wheelListener);
    			node.removeEventListener('touchstart', touchstartListener);
    			node.removeEventListener('touchmove', touchmoveListener);
    		}
    	};
    };

    /* node_modules\svelte-calendar\components\calendar\DayPicker.svelte generated by Svelte v3.48.0 */
    const file$d = "node_modules\\svelte-calendar\\components\\calendar\\DayPicker.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    // (72:2) {#each legend as label}
    function create_each_block_1(ctx) {
    	let span;
    	let t_value = /*label*/ ctx[22] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$d, 72, 3, 2148);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(72:2) {#each legend as label}",
    		ctx
    	});

    	return block;
    }

    // (88:6) {#if !$store.enlargeDay || index !== monthIndex || !dayjs(day.date).isSame($store.selected)}
    function create_if_block_1$5(ctx) {
    	let a;
    	let t0_value = /*day*/ ctx[19].date.getDate() + "";
    	let t0;
    	let t1;
    	let a_intro;
    	let a_outro;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", "#pickday");
    			attr_dev(a, "class", "svelte-1unzsxu");
    			toggle_class(a, "disabled", !/*store*/ ctx[4].isSelectable(/*day*/ ctx[19].date));
    			toggle_class(a, "selected", /*index*/ ctx[18] === /*monthIndex*/ ctx[0] && dayjs_min(/*day*/ ctx[19].date).isSame(/*$store*/ ctx[1].selected, 'day'));
    			toggle_class(a, "outsider", /*day*/ ctx[19].outsider);
    			add_location(a, file$d, 88, 7, 2659);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "keydown", prevent_default(/*keydown_handler*/ ctx[10]), false, true, false),
    					listen_dev(
    						a,
    						"click",
    						prevent_default(function () {
    							if (is_function(/*select*/ ctx[6](/*day*/ ctx[19].date))) /*select*/ ctx[6](/*day*/ ctx[19].date).apply(this, arguments);
    						}),
    						false,
    						true,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*days*/ 131072) && t0_value !== (t0_value = /*day*/ ctx[19].date.getDate() + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*store, days*/ 131088) {
    				toggle_class(a, "disabled", !/*store*/ ctx[4].isSelectable(/*day*/ ctx[19].date));
    			}

    			if (dirty & /*index, monthIndex, dayjs, days, $store*/ 393219) {
    				toggle_class(a, "selected", /*index*/ ctx[18] === /*monthIndex*/ ctx[0] && dayjs_min(/*day*/ ctx[19].date).isSame(/*$store*/ ctx[1].selected, 'day'));
    			}

    			if (dirty & /*days*/ 131072) {
    				toggle_class(a, "outsider", /*day*/ ctx[19].outsider);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (a_outro) a_outro.end(1);
    					a_intro = create_in_transition(a, /*receive*/ ctx[15], { key: /*key*/ ctx[14] });
    					a_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (a_intro) a_intro.invalidate();

    			if (local) {
    				a_outro = create_out_transition(a, /*send*/ ctx[16], { key: /*key*/ ctx[14] });
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching && a_outro) a_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(88:6) {#if !$store.enlargeDay || index !== monthIndex || !dayjs(day.date).isSame($store.selected)}",
    		ctx
    	});

    	return block;
    }

    // (87:5) {#each days as day, i (day)}
    function create_each_block$2(key_1, ctx) {
    	let first;
    	let show_if = !/*$store*/ ctx[1].enlargeDay || /*index*/ ctx[18] !== /*monthIndex*/ ctx[0] || !dayjs_min(/*day*/ ctx[19].date).isSame(/*$store*/ ctx[1].selected);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_1$5(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$store, index, monthIndex, days*/ 393219) show_if = !/*$store*/ ctx[1].enlargeDay || /*index*/ ctx[18] !== /*monthIndex*/ ctx[0] || !dayjs_min(/*day*/ ctx[19].date).isSame(/*$store*/ ctx[1].selected);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$store, index, monthIndex, days*/ 393219) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(87:5) {#each days as day, i (day)}",
    		ctx
    	});

    	return block;
    }

    // (86:4) <Grid template="repeat(6, 1fr) / repeat(7, 1fr)">
    function create_default_slot_2$1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value = /*days*/ ctx[17];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*day*/ ctx[19];
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*key, store, days, index, monthIndex, dayjs, $store, select*/ 409683) {
    				each_value = /*days*/ ctx[17];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block$2, each_1_anchor, get_each_context$2);
    			}
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(86:4) <Grid template=\\\"repeat(6, 1fr) / repeat(7, 1fr)\\\">",
    		ctx
    	});

    	return block;
    }

    // (78:3) <InfiniteGrid     cellCount={1}     itemCount={totalMonths}     bind:index={monthIndex}     {get}     let:days     let:index    >
    function create_default_slot_1$4(ctx) {
    	let grid;
    	let current;

    	grid = new Grid({
    			props: {
    				template: "repeat(6, 1fr) / repeat(7, 1fr)",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(grid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const grid_changes = {};

    			if (dirty & /*$$scope, days, key, index, monthIndex, $store*/ 33964035) {
    				grid_changes.$$scope = { dirty, ctx };
    			}

    			grid.$set(grid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(78:3) <InfiniteGrid     cellCount={1}     itemCount={totalMonths}     bind:index={monthIndex}     {get}     let:days     let:index    >",
    		ctx
    	});

    	return block;
    }

    // (107:2) {#if $store.enlargeDay}
    function create_if_block$6(ctx) {
    	let div;
    	let t_value = dayjs_min(/*$store*/ ctx[1].selected).date() + "";
    	let t;
    	let div_intro;
    	let div_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "stage selected-big svelte-1unzsxu");
    			add_location(div, file$d, 107, 3, 3181);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*$store*/ 2) && t_value !== (t_value = dayjs_min(/*$store*/ ctx[1].selected).date() + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (div_outro) div_outro.end(1);
    					div_intro = create_in_transition(div, /*receive*/ ctx[15], { key: /*key*/ ctx[14] });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();

    			if (local) {
    				div_outro = create_out_transition(div, /*send*/ ctx[16], { key: /*key*/ ctx[14] });
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(107:2) {#if $store.enlargeDay}",
    		ctx
    	});

    	return block;
    }

    // (76:1) <Crossfade {duration} let:key let:receive let:send>
    function create_default_slot$5(ctx) {
    	let div;
    	let infinitegrid;
    	let updating_index;
    	let scrollable_action;
    	let t;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	function infinitegrid_index_binding(value) {
    		/*infinitegrid_index_binding*/ ctx[11](value);
    	}

    	let infinitegrid_props = {
    		cellCount: 1,
    		itemCount: /*totalMonths*/ ctx[3],
    		get: /*get*/ ctx[8],
    		$$slots: {
    			default: [
    				create_default_slot_1$4,
    				({ days, index }) => ({ 17: days, 18: index }),
    				({ days, index }) => (days ? 131072 : 0) | (index ? 262144 : 0)
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*monthIndex*/ ctx[0] !== void 0) {
    		infinitegrid_props.index = /*monthIndex*/ ctx[0];
    	}

    	infinitegrid = new InfiniteGrid({
    			props: infinitegrid_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(infinitegrid, 'index', infinitegrid_index_binding));
    	let if_block = /*$store*/ ctx[1].enlargeDay && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(infinitegrid.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "stage svelte-1unzsxu");
    			add_location(div, file$d, 76, 2, 2242);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(infinitegrid, div, null);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(scrollable_action = scrollable.call(null, div, { y: /*initialY*/ ctx[2], step: scrollStep })),
    					listen_dev(div, "y", /*updateIndex*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const infinitegrid_changes = {};
    			if (dirty & /*totalMonths*/ 8) infinitegrid_changes.itemCount = /*totalMonths*/ ctx[3];

    			if (dirty & /*$$scope, days, key, index, monthIndex, $store*/ 33964035) {
    				infinitegrid_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_index && dirty & /*monthIndex*/ 1) {
    				updating_index = true;
    				infinitegrid_changes.index = /*monthIndex*/ ctx[0];
    				add_flush_callback(() => updating_index = false);
    			}

    			infinitegrid.$set(infinitegrid_changes);
    			if (scrollable_action && is_function(scrollable_action.update) && dirty & /*initialY*/ 4) scrollable_action.update.call(null, { y: /*initialY*/ ctx[2], step: scrollStep });

    			if (/*$store*/ ctx[1].enlargeDay) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$store*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(infinitegrid.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(infinitegrid.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(infinitegrid);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(76:1) <Crossfade {duration} let:key let:receive let:send>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let keycontrols;
    	let t0;
    	let div1;
    	let div0;
    	let t1;
    	let crossfade;
    	let current;
    	const keycontrols_spread_levels = [/*KEY_MAPPINGS*/ ctx[7], { ctx: ['days'] }];
    	let keycontrols_props = {};

    	for (let i = 0; i < keycontrols_spread_levels.length; i += 1) {
    		keycontrols_props = assign(keycontrols_props, keycontrols_spread_levels[i]);
    	}

    	keycontrols = new KeyControls({ props: keycontrols_props, $$inline: true });
    	let each_value_1 = /*legend*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	crossfade = new Crossfade({
    			props: {
    				duration,
    				$$slots: {
    					default: [
    						create_default_slot$5,
    						({ key, receive, send }) => ({ 14: key, 15: receive, 16: send }),
    						({ key, receive, send }) => (key ? 16384 : 0) | (receive ? 32768 : 0) | (send ? 65536 : 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(keycontrols.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(crossfade.$$.fragment);
    			attr_dev(div0, "class", "legend svelte-1unzsxu");
    			add_location(div0, file$d, 70, 1, 2098);
    			attr_dev(div1, "class", "container svelte-1unzsxu");
    			add_location(div1, file$d, 69, 0, 2073);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(keycontrols, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t1);
    			mount_component(crossfade, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const keycontrols_changes = (dirty & /*KEY_MAPPINGS*/ 128)
    			? get_spread_update(keycontrols_spread_levels, [get_spread_object(/*KEY_MAPPINGS*/ ctx[7]), keycontrols_spread_levels[1]])
    			: {};

    			keycontrols.$set(keycontrols_changes);

    			if (dirty & /*legend*/ 32) {
    				each_value_1 = /*legend*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			const crossfade_changes = {};

    			if (dirty & /*$$scope, key, $store, initialY, totalMonths, monthIndex*/ 33570831) {
    				crossfade_changes.$$scope = { dirty, ctx };
    			}

    			crossfade.$set(crossfade_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(keycontrols.$$.fragment, local);
    			transition_in(crossfade.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(keycontrols.$$.fragment, local);
    			transition_out(crossfade.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(keycontrols, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			destroy_component(crossfade);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const duration = 450;

    function instance$e($$self, $$props, $$invalidate) {
    	let totalMonths;
    	let monthIndex;
    	let initialY;
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DayPicker', slots, []);
    	const store = getContext(storeContextKey);
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(1, $store = value));
    	const legend = Array(7).fill(0).map((d, i) => dayjs_min().day(($store.startOfWeekIndex + i) % 7).format('ddd'));
    	const add = amount => () => store.add(amount, 'day');

    	const select = day => () => {
    		if (!store.isSelectable(day)) return;
    		store.setDay(day || $store.selected);
    		if (!$store.shouldEnlargeDay) return store.selectDay();
    		store.enlargeDay();

    		setTimeout(
    			() => {
    				store.selectDay();
    				store.enlargeDay(false);
    			},
    			duration + 60
    		);
    	};

    	const KEY_MAPPINGS = {
    		left: add(-1),
    		right: add(1),
    		up: add(-7),
    		down: add(7),
    		enter: select(),
    		escape: () => store.close()
    	};

    	const calPagesBetweenDates = (a, b) => {
    		const yearDelta = b.getFullYear() - a.getFullYear();

    		const firstPartialYear = yearDelta
    		? 12 - a.getMonth()
    		: b.getMonth() - a.getMonth() + 1;

    		const fullYears = yearDelta > 1 ? (yearDelta - 1) * 12 : 0;
    		const lastPartialYear = yearDelta ? b.getMonth() + 1 : 0;
    		return firstPartialYear + fullYears + lastPartialYear;
    	};

    	const get = index => {
    		const d = dayjs_min($store.start).add(index, 'month');

    		return {
    			days: store.getCalendarPage(d.month(), d.year())
    		};
    	};

    	const updateIndex = ({ detail: { step: newIndex } }) => {
    		store.add(newIndex - monthIndex, 'month', ['date']);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DayPicker> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function infinitegrid_index_binding(value) {
    		monthIndex = value;
    		($$invalidate(0, monthIndex), $$invalidate(1, $store));
    	}

    	$$self.$capture_state = () => ({
    		getContext,
    		storeContextKey,
    		KeyControls,
    		Grid,
    		InfiniteGrid,
    		dayjs: dayjs_min,
    		Crossfade,
    		scrollable,
    		scrollStep,
    		store,
    		duration,
    		legend,
    		add,
    		select,
    		KEY_MAPPINGS,
    		calPagesBetweenDates,
    		get,
    		updateIndex,
    		monthIndex,
    		initialY,
    		totalMonths,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('monthIndex' in $$props) $$invalidate(0, monthIndex = $$props.monthIndex);
    		if ('initialY' in $$props) $$invalidate(2, initialY = $$props.initialY);
    		if ('totalMonths' in $$props) $$invalidate(3, totalMonths = $$props.totalMonths);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$store*/ 2) {
    			$$invalidate(3, totalMonths = calPagesBetweenDates($store.start, $store.end));
    		}

    		if ($$self.$$.dirty & /*$store*/ 2) {
    			$$invalidate(0, monthIndex = calPagesBetweenDates($store.start, $store.selected) - 1);
    		}

    		if ($$self.$$.dirty & /*monthIndex*/ 1) {
    			$$invalidate(2, initialY = monthIndex * scrollStep);
    		}
    	};

    	return [
    		monthIndex,
    		$store,
    		initialY,
    		totalMonths,
    		store,
    		legend,
    		select,
    		KEY_MAPPINGS,
    		get,
    		updateIndex,
    		keydown_handler,
    		infinitegrid_index_binding
    	];
    }

    class DayPicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DayPicker",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* node_modules\svelte-calendar\components\generic\ViewTransitionEffect.svelte generated by Svelte v3.48.0 */
    const file$c = "node_modules\\svelte-calendar\\components\\generic\\ViewTransitionEffect.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file$c, 8, 0, 197);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			if (local) {
    				add_render_callback(() => {
    					if (div_outro) div_outro.end(1);

    					div_intro = create_in_transition(div, scale, {
    						start: /*$store*/ ctx[0].activeViewDirection * 0.5 + 1,
    						delay: 110
    					});

    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();

    			if (local) {
    				div_outro = create_out_transition(div, scale, {
    					start: /*$store*/ ctx[0].activeViewDirection * -0.5 + 1
    				});
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ViewTransitionEffect', slots, ['default']);
    	const store = getContext(storeContextKey);
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(0, $store = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ViewTransitionEffect> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		scale,
    		storeContextKey,
    		getContext,
    		store,
    		$store
    	});

    	return [$store, store, $$scope, slots];
    }

    class ViewTransitionEffect extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ViewTransitionEffect",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* node_modules\svelte-calendar\components\generic\Arrow.svelte generated by Svelte v3.48.0 */

    const file$b = "node_modules\\svelte-calendar\\components\\generic\\Arrow.svelte";

    function create_fragment$c(ctx) {
    	let i;
    	let i_class_value;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(/*dir*/ ctx[0]) + " svelte-1eiemu5"));
    			add_location(i, file$b, 4, 0, 46);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dir*/ 1 && i_class_value !== (i_class_value = "" + (null_to_empty(/*dir*/ ctx[0]) + " svelte-1eiemu5"))) {
    				attr_dev(i, "class", i_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Arrow', slots, []);
    	let { dir = 'left' } = $$props;
    	const writable_props = ['dir'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Arrow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('dir' in $$props) $$invalidate(0, dir = $$props.dir);
    	};

    	$$self.$capture_state = () => ({ dir });

    	$$self.$inject_state = $$props => {
    		if ('dir' in $$props) $$invalidate(0, dir = $$props.dir);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [dir];
    }

    class Arrow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { dir: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Arrow",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get dir() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dir(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-calendar\components\calendar\CalendarControls.svelte generated by Svelte v3.48.0 */
    const file$a = "node_modules\\svelte-calendar\\components\\calendar\\CalendarControls.svelte";

    function create_fragment$b(ctx) {
    	let keycontrols;
    	let t0;
    	let div2;
    	let div0;
    	let arrow0;
    	let t1;
    	let span;
    	let t2;
    	let t3;
    	let div1;
    	let arrow1;
    	let current;
    	let mounted;
    	let dispose;
    	const keycontrols_spread_levels = [{ ctx: ['days', 'months', 'years'] }, { limit: 180 }, /*KEY_MAPPINGS*/ ctx[4]];
    	let keycontrols_props = {};

    	for (let i = 0; i < keycontrols_spread_levels.length; i += 1) {
    		keycontrols_props = assign(keycontrols_props, keycontrols_spread_levels[i]);
    	}

    	keycontrols = new KeyControls({ props: keycontrols_props, $$inline: true });
    	arrow0 = new Arrow({ props: { dir: "left" }, $$inline: true });
    	arrow1 = new Arrow({ props: { dir: "right" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(keycontrols.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			create_component(arrow0.$$.fragment);
    			t1 = space();
    			span = element("span");
    			t2 = text(/*label*/ ctx[0]);
    			t3 = space();
    			div1 = element("div");
    			create_component(arrow1.$$.fragment);
    			attr_dev(div0, "class", "button svelte-1ro74h8");
    			add_location(div0, file$a, 37, 1, 1197);
    			attr_dev(span, "class", "button label svelte-1ro74h8");
    			add_location(span, file$a, 40, 1, 1269);
    			attr_dev(div1, "class", "button svelte-1ro74h8");
    			add_location(div1, file$a, 43, 1, 1345);
    			attr_dev(div2, "class", "controls svelte-1ro74h8");
    			add_location(div2, file$a, 36, 0, 1173);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(keycontrols, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(arrow0, div0, null);
    			append_dev(div2, t1);
    			append_dev(div2, span);
    			append_dev(span, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			mount_component(arrow1, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*add*/ ctx[2](-1), false, false, false),
    					listen_dev(span, "click", /*updateActiveView*/ ctx[3], false, false, false),
    					listen_dev(div1, "click", /*add*/ ctx[2](1), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const keycontrols_changes = (dirty & /*KEY_MAPPINGS*/ 16)
    			? get_spread_update(keycontrols_spread_levels, [
    					keycontrols_spread_levels[0],
    					keycontrols_spread_levels[1],
    					get_spread_object(/*KEY_MAPPINGS*/ ctx[4])
    				])
    			: {};

    			keycontrols.$set(keycontrols_changes);
    			if (!current || dirty & /*label*/ 1) set_data_dev(t2, /*label*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(keycontrols.$$.fragment, local);
    			transition_in(arrow0.$$.fragment, local);
    			transition_in(arrow1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(keycontrols.$$.fragment, local);
    			transition_out(arrow0.$$.fragment, local);
    			transition_out(arrow1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(keycontrols, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_component(arrow0);
    			destroy_component(arrow1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let visibleMonth;
    	let label;
    	let addMult;
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CalendarControls', slots, []);
    	const store = getContext(storeContextKey);
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(6, $store = value));

    	const UNIT_BY_VIEW = {
    		days: 'month',
    		months: 'year',
    		years: 'year'
    	};

    	const add = amount => () => store.add(amount * addMult, UNIT_BY_VIEW[$store.activeView]);
    	const VIEW_TRANSITIONS = ['days', 'months', 'years'];

    	const updateActiveView = () => {
    		const transitionIndex = VIEW_TRANSITIONS.indexOf($store.activeView) + 1;

    		const newView = transitionIndex
    		? VIEW_TRANSITIONS[transitionIndex]
    		: null;

    		if (newView) store.setActiveView(newView);
    	};

    	const KEY_MAPPINGS = {
    		pageDown: add(-1),
    		pageUp: add(1),
    		control: updateActiveView
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CalendarControls> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Arrow,
    		getContext,
    		storeContextKey,
    		dayjs: dayjs_min,
    		KeyControls,
    		store,
    		UNIT_BY_VIEW,
    		add,
    		VIEW_TRANSITIONS,
    		updateActiveView,
    		KEY_MAPPINGS,
    		addMult,
    		visibleMonth,
    		label,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('addMult' in $$props) addMult = $$props.addMult;
    		if ('visibleMonth' in $$props) $$invalidate(5, visibleMonth = $$props.visibleMonth);
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$store*/ 64) {
    			$$invalidate(5, visibleMonth = dayjs_min(new Date($store.year, $store.month, 1)));
    		}

    		if ($$self.$$.dirty & /*$store, visibleMonth*/ 96) {
    			$$invalidate(0, label = `${$store.activeView === 'days'
			? visibleMonth.format('MMMM ')
			: ''}${$store.year}`);
    		}

    		if ($$self.$$.dirty & /*$store*/ 64) {
    			addMult = $store.activeView === 'years' ? 10 : 1;
    		}
    	};

    	return [label, store, add, updateActiveView, KEY_MAPPINGS, visibleMonth, $store];
    }

    class CalendarControls extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CalendarControls",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* node_modules\svelte-calendar\components\generic\crossfade\CrossfadeProvider.svelte generated by Svelte v3.48.0 */

    const get_default_slot_changes$1 = dirty => ({
    	key: dirty & /*$store*/ 1,
    	send: dirty & /*$store*/ 1,
    	receive: dirty & /*$store*/ 1
    });

    const get_default_slot_context$1 = ctx => ({
    	key: /*$store*/ ctx[0].key,
    	send: /*$store*/ ctx[0].send,
    	receive: /*$store*/ ctx[0].receive
    });

    function create_fragment$a(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $store*/ 5)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CrossfadeProvider', slots, ['default']);
    	const noop = () => false;
    	const store = getContext('crossfade') || writable({ send: noop, receive: noop });
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(0, $store = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CrossfadeProvider> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		writable,
    		noop,
    		store,
    		$store
    	});

    	return [$store, store, $$scope, slots];
    }

    class CrossfadeProvider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CrossfadeProvider",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* node_modules\svelte-calendar\components\calendar\MonthPicker.svelte generated by Svelte v3.48.0 */
    const file$9 = "node_modules\\svelte-calendar\\components\\calendar\\MonthPicker.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	child_ctx[17] = i;
    	return child_ctx;
    }

    // (63:3) {#each months as month, i}
    function create_each_block$1(ctx) {
    	let a;
    	let t0_value = /*month*/ ctx[15].label + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", "#selectMonth");
    			toggle_class(a, "disabled", /*month*/ ctx[15].disabled);
    			toggle_class(a, "selected", /*$store*/ ctx[1].month === /*i*/ ctx[17] && /*$store*/ ctx[1].year === /*month*/ ctx[15].year);
    			add_location(a, file$9, 63, 4, 1837);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			append_dev(a, t1);

    			if (!mounted) {
    				dispose = listen_dev(
    					a,
    					"click",
    					prevent_default(function () {
    						if (is_function(/*select*/ ctx[7](/*month*/ ctx[15]))) /*select*/ ctx[7](/*month*/ ctx[15]).apply(this, arguments);
    					}),
    					false,
    					true,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*months*/ 16384 && t0_value !== (t0_value = /*month*/ ctx[15].label + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*months*/ 16384) {
    				toggle_class(a, "disabled", /*month*/ ctx[15].disabled);
    			}

    			if (dirty & /*$store, months*/ 16386) {
    				toggle_class(a, "selected", /*$store*/ ctx[1].month === /*i*/ ctx[17] && /*$store*/ ctx[1].year === /*month*/ ctx[15].year);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(63:3) {#each months as month, i}",
    		ctx
    	});

    	return block;
    }

    // (62:2) <Grid template="repeat(4, 1fr) / repeat(3, 1fr)">
    function create_default_slot_1$3(ctx) {
    	let each_1_anchor;
    	let each_value = /*months*/ ctx[14];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*months, $store, select*/ 16514) {
    				each_value = /*months*/ ctx[14];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(62:2) <Grid template=\\\"repeat(4, 1fr) / repeat(3, 1fr)\\\">",
    		ctx
    	});

    	return block;
    }

    // (61:1) <InfiniteGrid cellCount={1} {itemCount} bind:index={yearIndex} {get} let:months bind:this={grid}>
    function create_default_slot$4(ctx) {
    	let grid_1;
    	let current;

    	grid_1 = new Grid({
    			props: {
    				template: "repeat(4, 1fr) / repeat(3, 1fr)",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(grid_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(grid_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const grid_1_changes = {};

    			if (dirty & /*$$scope, months, $store*/ 278530) {
    				grid_1_changes.$$scope = { dirty, ctx };
    			}

    			grid_1.$set(grid_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(grid_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(61:1) <InfiniteGrid cellCount={1} {itemCount} bind:index={yearIndex} {get} let:months bind:this={grid}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let keycontrols;
    	let t;
    	let div;
    	let infinitegrid;
    	let updating_index;
    	let scrollable_action;
    	let current;
    	let mounted;
    	let dispose;
    	const keycontrols_spread_levels = [/*KEY_MAPPINGS*/ ctx[9], { ctx: ['months'] }];
    	let keycontrols_props = {};

    	for (let i = 0; i < keycontrols_spread_levels.length; i += 1) {
    		keycontrols_props = assign(keycontrols_props, keycontrols_spread_levels[i]);
    	}

    	keycontrols = new KeyControls({ props: keycontrols_props, $$inline: true });

    	function infinitegrid_index_binding(value) {
    		/*infinitegrid_index_binding*/ ctx[10](value);
    	}

    	let infinitegrid_props = {
    		cellCount: 1,
    		itemCount: /*itemCount*/ ctx[3],
    		get: /*get*/ ctx[6],
    		$$slots: {
    			default: [
    				create_default_slot$4,
    				({ months }) => ({ 14: months }),
    				({ months }) => months ? 16384 : 0
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*yearIndex*/ ctx[0] !== void 0) {
    		infinitegrid_props.index = /*yearIndex*/ ctx[0];
    	}

    	infinitegrid = new InfiniteGrid({
    			props: infinitegrid_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(infinitegrid, 'index', infinitegrid_index_binding));
    	/*infinitegrid_binding*/ ctx[11](infinitegrid);

    	const block = {
    		c: function create() {
    			create_component(keycontrols.$$.fragment);
    			t = space();
    			div = element("div");
    			create_component(infinitegrid.$$.fragment);
    			attr_dev(div, "class", "svelte-t161t");
    			add_location(div, file$9, 59, 0, 1555);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(keycontrols, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(infinitegrid, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(scrollable_action = scrollable.call(null, div, {
    						y: /*initialY*/ ctx[4],
    						step: scrollStep,
    						maxSteps: /*itemCount*/ ctx[3]
    					})),
    					listen_dev(div, "y", /*updateIndex*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const keycontrols_changes = (dirty & /*KEY_MAPPINGS*/ 512)
    			? get_spread_update(keycontrols_spread_levels, [get_spread_object(/*KEY_MAPPINGS*/ ctx[9]), keycontrols_spread_levels[1]])
    			: {};

    			keycontrols.$set(keycontrols_changes);
    			const infinitegrid_changes = {};
    			if (dirty & /*itemCount*/ 8) infinitegrid_changes.itemCount = /*itemCount*/ ctx[3];

    			if (dirty & /*$$scope, months, $store*/ 278530) {
    				infinitegrid_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_index && dirty & /*yearIndex*/ 1) {
    				updating_index = true;
    				infinitegrid_changes.index = /*yearIndex*/ ctx[0];
    				add_flush_callback(() => updating_index = false);
    			}

    			infinitegrid.$set(infinitegrid_changes);

    			if (scrollable_action && is_function(scrollable_action.update) && dirty & /*initialY, itemCount*/ 24) scrollable_action.update.call(null, {
    				y: /*initialY*/ ctx[4],
    				step: scrollStep,
    				maxSteps: /*itemCount*/ ctx[3]
    			});
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(keycontrols.$$.fragment, local);
    			transition_in(infinitegrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(keycontrols.$$.fragment, local);
    			transition_out(infinitegrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(keycontrols, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			/*infinitegrid_binding*/ ctx[11](null);
    			destroy_component(infinitegrid);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let yearIndex;
    	let initialY;
    	let itemCount;
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MonthPicker', slots, []);
    	const store = getContext(storeContextKey);
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(1, $store = value));
    	let grid;

    	const get = index => ({
    		months: Array(12).fill(0).map((d, i) => {
    			const month = dayjs_min(new Date($store.start.getFullYear() + index, i, 1));

    			return {
    				year: $store.start.getFullYear() + index,
    				label: month.format('MMM'),
    				index: i,
    				disabled: !store.isSelectable(month, ['date'])
    			};
    		})
    	});

    	const close = () => store.setActiveView('days');

    	const select = month => () => {
    		if (month.disabled) return;
    		store.setMonth(month.index);
    		close();
    	};

    	const add = amount => () => {
    		store.add(amount, 'month', ['date']);
    	};

    	const updateIndex = ({ detail: { step: newIndex } }) => {
    		store.add(newIndex - yearIndex, 'year', ['month', 'date']);
    	};

    	const KEY_MAPPINGS = {
    		left: add(-1),
    		right: add(1),
    		up: add(-3),
    		down: add(3),
    		enter: close,
    		escape: close
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MonthPicker> was created with unknown prop '${key}'`);
    	});

    	function infinitegrid_index_binding(value) {
    		yearIndex = value;
    		($$invalidate(0, yearIndex), $$invalidate(1, $store));
    	}

    	function infinitegrid_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			grid = $$value;
    			$$invalidate(2, grid);
    		});
    	}

    	$$self.$capture_state = () => ({
    		getContext,
    		storeContextKey,
    		dayjs: dayjs_min,
    		KeyControls,
    		Grid,
    		InfiniteGrid,
    		scrollable,
    		scrollStep,
    		store,
    		grid,
    		get,
    		close,
    		select,
    		add,
    		updateIndex,
    		KEY_MAPPINGS,
    		itemCount,
    		yearIndex,
    		initialY,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('grid' in $$props) $$invalidate(2, grid = $$props.grid);
    		if ('itemCount' in $$props) $$invalidate(3, itemCount = $$props.itemCount);
    		if ('yearIndex' in $$props) $$invalidate(0, yearIndex = $$props.yearIndex);
    		if ('initialY' in $$props) $$invalidate(4, initialY = $$props.initialY);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$store*/ 2) {
    			$$invalidate(0, yearIndex = $store.year - $store.start.getFullYear());
    		}

    		if ($$self.$$.dirty & /*yearIndex*/ 1) {
    			$$invalidate(4, initialY = yearIndex * scrollStep);
    		}

    		if ($$self.$$.dirty & /*$store*/ 2) {
    			$$invalidate(3, itemCount = $store.end.getFullYear() - $store.start.getFullYear() + 1);
    		}
    	};

    	return [
    		yearIndex,
    		$store,
    		grid,
    		itemCount,
    		initialY,
    		store,
    		get,
    		select,
    		updateIndex,
    		KEY_MAPPINGS,
    		infinitegrid_index_binding,
    		infinitegrid_binding
    	];
    }

    class MonthPicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MonthPicker",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* node_modules\svelte-calendar\components\calendar\YearPicker.svelte generated by Svelte v3.48.0 */
    const file$8 = "node_modules\\svelte-calendar\\components\\calendar\\YearPicker.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (64:3) {#each years as year}
    function create_each_block(ctx) {
    	let a;
    	let t0_value = /*year*/ ctx[18].number + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", "#year");
    			toggle_class(a, "selected", /*$store*/ ctx[3].year === /*year*/ ctx[18].number);
    			toggle_class(a, "disabled", !/*year*/ ctx[18].selectable);
    			add_location(a, file$8, 64, 4, 2010);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			append_dev(a, t1);

    			if (!mounted) {
    				dispose = listen_dev(
    					a,
    					"click",
    					prevent_default(function () {
    						if (is_function(/*select*/ ctx[10](/*year*/ ctx[18]))) /*select*/ ctx[10](/*year*/ ctx[18]).apply(this, arguments);
    					}),
    					false,
    					true,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*years*/ 131072 && t0_value !== (t0_value = /*year*/ ctx[18].number + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$store, years*/ 131080) {
    				toggle_class(a, "selected", /*$store*/ ctx[3].year === /*year*/ ctx[18].number);
    			}

    			if (dirty & /*years*/ 131072) {
    				toggle_class(a, "disabled", !/*year*/ ctx[18].selectable);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(64:3) {#each years as year}",
    		ctx
    	});

    	return block;
    }

    // (63:2) <Grid template="repeat({rowCount}, 1fr) / repeat({colCount}, 1fr)">
    function create_default_slot_1$2(ctx) {
    	let each_1_anchor;
    	let each_value = /*years*/ ctx[17];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$store, years, select*/ 132104) {
    				each_value = /*years*/ ctx[17];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(63:2) <Grid template=\\\"repeat({rowCount}, 1fr) / repeat({colCount}, 1fr)\\\">",
    		ctx
    	});

    	return block;
    }

    // (62:1) <InfiniteGrid cellCount={1} {itemCount} bind:index={yearIndex} {get} let:years>
    function create_default_slot$3(ctx) {
    	let grid;
    	let current;

    	grid = new Grid({
    			props: {
    				template: "repeat(" + /*rowCount*/ ctx[0] + ", 1fr) / repeat(" + /*colCount*/ ctx[1] + ", 1fr)",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(grid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const grid_changes = {};
    			if (dirty & /*rowCount, colCount*/ 3) grid_changes.template = "repeat(" + /*rowCount*/ ctx[0] + ", 1fr) / repeat(" + /*colCount*/ ctx[1] + ", 1fr)";

    			if (dirty & /*$$scope, years, $store*/ 2228232) {
    				grid_changes.$$scope = { dirty, ctx };
    			}

    			grid.$set(grid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(62:1) <InfiniteGrid cellCount={1} {itemCount} bind:index={yearIndex} {get} let:years>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let keycontrols;
    	let t;
    	let div;
    	let infinitegrid;
    	let updating_index;
    	let scrollable_action;
    	let current;
    	let mounted;
    	let dispose;
    	const keycontrols_spread_levels = [/*KEY_MAPPINGS*/ ctx[6], { ctx: ['years'] }];
    	let keycontrols_props = {};

    	for (let i = 0; i < keycontrols_spread_levels.length; i += 1) {
    		keycontrols_props = assign(keycontrols_props, keycontrols_spread_levels[i]);
    	}

    	keycontrols = new KeyControls({ props: keycontrols_props, $$inline: true });

    	function infinitegrid_index_binding(value) {
    		/*infinitegrid_index_binding*/ ctx[14](value);
    	}

    	let infinitegrid_props = {
    		cellCount: 1,
    		itemCount: /*itemCount*/ ctx[5],
    		get: /*get*/ ctx[8],
    		$$slots: {
    			default: [
    				create_default_slot$3,
    				({ years }) => ({ 17: years }),
    				({ years }) => years ? 131072 : 0
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*yearIndex*/ ctx[2] !== void 0) {
    		infinitegrid_props.index = /*yearIndex*/ ctx[2];
    	}

    	infinitegrid = new InfiniteGrid({
    			props: infinitegrid_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(infinitegrid, 'index', infinitegrid_index_binding));

    	const block = {
    		c: function create() {
    			create_component(keycontrols.$$.fragment);
    			t = space();
    			div = element("div");
    			create_component(infinitegrid.$$.fragment);
    			attr_dev(div, "class", "svelte-t161t");
    			add_location(div, file$8, 60, 0, 1733);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(keycontrols, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(infinitegrid, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(scrollable_action = scrollable.call(null, div, {
    						y: /*initialY*/ ctx[4],
    						step: scrollStep,
    						maxSteps: /*itemCount*/ ctx[5]
    					})),
    					listen_dev(div, "y", /*updateIndex*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const keycontrols_changes = (dirty & /*KEY_MAPPINGS*/ 64)
    			? get_spread_update(keycontrols_spread_levels, [get_spread_object(/*KEY_MAPPINGS*/ ctx[6]), keycontrols_spread_levels[1]])
    			: {};

    			keycontrols.$set(keycontrols_changes);
    			const infinitegrid_changes = {};
    			if (dirty & /*itemCount*/ 32) infinitegrid_changes.itemCount = /*itemCount*/ ctx[5];

    			if (dirty & /*$$scope, rowCount, colCount, years, $store*/ 2228235) {
    				infinitegrid_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_index && dirty & /*yearIndex*/ 4) {
    				updating_index = true;
    				infinitegrid_changes.index = /*yearIndex*/ ctx[2];
    				add_flush_callback(() => updating_index = false);
    			}

    			infinitegrid.$set(infinitegrid_changes);

    			if (scrollable_action && is_function(scrollable_action.update) && dirty & /*initialY, itemCount*/ 48) scrollable_action.update.call(null, {
    				y: /*initialY*/ ctx[4],
    				step: scrollStep,
    				maxSteps: /*itemCount*/ ctx[5]
    			});
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(keycontrols.$$.fragment, local);
    			transition_in(infinitegrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(keycontrols.$$.fragment, local);
    			transition_out(infinitegrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(keycontrols, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			destroy_component(infinitegrid);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let KEY_MAPPINGS;
    	let startYear;
    	let endYear;
    	let numPerPage;
    	let itemCount;
    	let yearIndex;
    	let initialY;
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('YearPicker', slots, []);
    	let { rowCount = 3 } = $$props;
    	let { colCount = 3 } = $$props;
    	const store = getContext(storeContextKey);
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(3, $store = value));
    	const close = () => store.setActiveView('months');

    	const add = amount => () => {
    		const result = $store.year + amount;
    		if (result < startYear || result > endYear) return;
    		store.add(amount, 'year', ['month', 'date']);
    	};

    	const get = index => {
    		const firstYear = startYear + index * numPerPage;

    		return {
    			years: Array(numPerPage).fill(0).map((d, i) => ({
    				number: firstYear + i,
    				selectable: firstYear + i <= endYear
    			}))
    		};
    	};

    	const updateIndex = ({ detail: { step: newIndex } }) => {
    		store.add(numPerPage * (newIndex - yearIndex), 'year', ['year', 'month', 'date']);
    	};

    	const select = year => () => {
    		if (!year.selectable) return;
    		store.setYear(year.number);
    		close();
    	};

    	const writable_props = ['rowCount', 'colCount'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<YearPicker> was created with unknown prop '${key}'`);
    	});

    	function infinitegrid_index_binding(value) {
    		yearIndex = value;
    		((((($$invalidate(2, yearIndex), $$invalidate(3, $store)), $$invalidate(12, startYear)), $$invalidate(11, numPerPage)), $$invalidate(0, rowCount)), $$invalidate(1, colCount));
    	}

    	$$self.$$set = $$props => {
    		if ('rowCount' in $$props) $$invalidate(0, rowCount = $$props.rowCount);
    		if ('colCount' in $$props) $$invalidate(1, colCount = $$props.colCount);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		storeContextKey,
    		KeyControls,
    		Grid,
    		InfiniteGrid,
    		scrollable,
    		scrollStep,
    		rowCount,
    		colCount,
    		store,
    		close,
    		add,
    		get,
    		updateIndex,
    		select,
    		yearIndex,
    		initialY,
    		numPerPage,
    		startYear,
    		endYear,
    		itemCount,
    		KEY_MAPPINGS,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('rowCount' in $$props) $$invalidate(0, rowCount = $$props.rowCount);
    		if ('colCount' in $$props) $$invalidate(1, colCount = $$props.colCount);
    		if ('yearIndex' in $$props) $$invalidate(2, yearIndex = $$props.yearIndex);
    		if ('initialY' in $$props) $$invalidate(4, initialY = $$props.initialY);
    		if ('numPerPage' in $$props) $$invalidate(11, numPerPage = $$props.numPerPage);
    		if ('startYear' in $$props) $$invalidate(12, startYear = $$props.startYear);
    		if ('endYear' in $$props) $$invalidate(13, endYear = $$props.endYear);
    		if ('itemCount' in $$props) $$invalidate(5, itemCount = $$props.itemCount);
    		if ('KEY_MAPPINGS' in $$props) $$invalidate(6, KEY_MAPPINGS = $$props.KEY_MAPPINGS);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*colCount*/ 2) {
    			$$invalidate(6, KEY_MAPPINGS = {
    				up: add(-1 * colCount),
    				down: add(colCount),
    				left: add(-1),
    				right: add(1),
    				enter: close,
    				escape: close
    			});
    		}

    		if ($$self.$$.dirty & /*$store*/ 8) {
    			$$invalidate(12, startYear = $store.start.getFullYear());
    		}

    		if ($$self.$$.dirty & /*$store*/ 8) {
    			$$invalidate(13, endYear = $store.end.getFullYear());
    		}

    		if ($$self.$$.dirty & /*rowCount, colCount*/ 3) {
    			$$invalidate(11, numPerPage = rowCount * colCount);
    		}

    		if ($$self.$$.dirty & /*endYear, startYear, numPerPage*/ 14336) {
    			$$invalidate(5, itemCount = Math.ceil(endYear - startYear + 1) / numPerPage);
    		}

    		if ($$self.$$.dirty & /*$store, startYear, numPerPage*/ 6152) {
    			$$invalidate(2, yearIndex = Math.floor(($store.year - startYear) / numPerPage));
    		}

    		if ($$self.$$.dirty & /*yearIndex*/ 4) {
    			$$invalidate(4, initialY = yearIndex * scrollStep);
    		}
    	};

    	return [
    		rowCount,
    		colCount,
    		yearIndex,
    		$store,
    		initialY,
    		itemCount,
    		KEY_MAPPINGS,
    		store,
    		get,
    		updateIndex,
    		select,
    		numPerPage,
    		startYear,
    		endYear,
    		infinitegrid_index_binding
    	];
    }

    class YearPicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { rowCount: 0, colCount: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "YearPicker",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get rowCount() {
    		throw new Error("<YearPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rowCount(value) {
    		throw new Error("<YearPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colCount() {
    		throw new Error("<YearPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colCount(value) {
    		throw new Error("<YearPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-calendar\components\calendar\Calendar.svelte generated by Svelte v3.48.0 */
    const file$7 = "node_modules\\svelte-calendar\\components\\calendar\\Calendar.svelte";

    // (26:43) 
    function create_if_block_2$3(ctx) {
    	let viewtransitioneffect;
    	let current;

    	viewtransitioneffect = new ViewTransitionEffect({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(viewtransitioneffect.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(viewtransitioneffect, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(viewtransitioneffect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(viewtransitioneffect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(viewtransitioneffect, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(26:43) ",
    		ctx
    	});

    	return block;
    }

    // (22:44) 
    function create_if_block_1$4(ctx) {
    	let viewtransitioneffect;
    	let current;

    	viewtransitioneffect = new ViewTransitionEffect({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(viewtransitioneffect.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(viewtransitioneffect, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(viewtransitioneffect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(viewtransitioneffect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(viewtransitioneffect, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(22:44) ",
    		ctx
    	});

    	return block;
    }

    // (18:3) {#if $store.activeView === 'days'}
    function create_if_block$5(ctx) {
    	let viewtransitioneffect;
    	let current;

    	viewtransitioneffect = new ViewTransitionEffect({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(viewtransitioneffect.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(viewtransitioneffect, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(viewtransitioneffect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(viewtransitioneffect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(viewtransitioneffect, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(18:3) {#if $store.activeView === 'days'}",
    		ctx
    	});

    	return block;
    }

    // (27:4) <ViewTransitionEffect>
    function create_default_slot_3(ctx) {
    	let yearpicker;
    	let current;
    	yearpicker = new YearPicker({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(yearpicker.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(yearpicker, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(yearpicker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(yearpicker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(yearpicker, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(27:4) <ViewTransitionEffect>",
    		ctx
    	});

    	return block;
    }

    // (23:4) <ViewTransitionEffect>
    function create_default_slot_2(ctx) {
    	let monthpicker;
    	let current;
    	monthpicker = new MonthPicker({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(monthpicker.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(monthpicker, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(monthpicker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(monthpicker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(monthpicker, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(23:4) <ViewTransitionEffect>",
    		ctx
    	});

    	return block;
    }

    // (19:4) <ViewTransitionEffect>
    function create_default_slot_1$1(ctx) {
    	let daypicker;
    	let current;
    	daypicker = new DayPicker({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(daypicker.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(daypicker, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(daypicker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(daypicker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(daypicker, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(19:4) <ViewTransitionEffect>",
    		ctx
    	});

    	return block;
    }

    // (14:0) <CrossfadeProvider let:key let:send let:receive>
    function create_default_slot$2(ctx) {
    	let div1;
    	let datepickercontrols;
    	let t;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let div1_intro;
    	let div1_outro;
    	let current;
    	datepickercontrols = new CalendarControls({ $$inline: true });
    	const if_block_creators = [create_if_block$5, create_if_block_1$4, create_if_block_2$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$store*/ ctx[0].activeView === 'days') return 0;
    		if (/*$store*/ ctx[0].activeView === 'months') return 1;
    		if (/*$store*/ ctx[0].activeView === 'years') return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(datepickercontrols.$$.fragment);
    			t = space();
    			div0 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "contents svelte-126ec0f");
    			add_location(div0, file$7, 16, 2, 783);
    			attr_dev(div1, "class", "grid svelte-126ec0f");
    			add_location(div1, file$7, 14, 1, 685);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(datepickercontrols, div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(datepickercontrols.$$.fragment, local);
    			transition_in(if_block);

    			if (local) {
    				add_render_callback(() => {
    					if (div1_outro) div1_outro.end(1);
    					div1_intro = create_in_transition(div1, /*receive*/ ctx[4], { key: /*key*/ ctx[2] });
    					div1_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(datepickercontrols.$$.fragment, local);
    			transition_out(if_block);
    			if (div1_intro) div1_intro.invalidate();

    			if (local) {
    				div1_outro = create_out_transition(div1, /*send*/ ctx[3], { key: /*key*/ ctx[2] });
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(datepickercontrols);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (detaching && div1_outro) div1_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(14:0) <CrossfadeProvider let:key let:send let:receive>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let crossfadeprovider;
    	let current;

    	crossfadeprovider = new CrossfadeProvider({
    			props: {
    				$$slots: {
    					default: [
    						create_default_slot$2,
    						({ key, send, receive }) => ({ 2: key, 3: send, 4: receive }),
    						({ key, send, receive }) => (key ? 4 : 0) | (send ? 8 : 0) | (receive ? 16 : 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(crossfadeprovider.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(crossfadeprovider, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const crossfadeprovider_changes = {};

    			if (dirty & /*$$scope, key, $store*/ 37) {
    				crossfadeprovider_changes.$$scope = { dirty, ctx };
    			}

    			crossfadeprovider.$set(crossfadeprovider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(crossfadeprovider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(crossfadeprovider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(crossfadeprovider, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Calendar', slots, []);
    	const store = getContext(storeContextKey);
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(0, $store = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Calendar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		DayPicker,
    		ViewTransitionEffect,
    		DatepickerControls: CalendarControls,
    		getContext,
    		storeContextKey,
    		CrossfadeProvider,
    		MonthPicker,
    		YearPicker,
    		store,
    		$store
    	});

    	return [$store, store];
    }

    class Calendar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Calendar",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const calendar = {
    	selected: new Date(),
    	start: dayjs_min().add(-100, 'year').toDate(),
    	end: dayjs_min().add(100, 'year').toDate(),
    	format: 'MM/DD/YYYY'
    };

    /* node_modules\svelte-calendar\components\Datepicker.svelte generated by Svelte v3.48.0 */
    const file$6 = "node_modules\\svelte-calendar\\components\\Datepicker.svelte";

    const get_default_slot_changes = dirty => ({
    	key: dirty & /*key*/ 16384,
    	send: dirty & /*send*/ 32768,
    	receive: dirty & /*receive*/ 65536,
    	formatted: dirty & /*formatted*/ 1
    });

    const get_default_slot_context = ctx => ({
    	key: /*key*/ ctx[14],
    	send: /*send*/ ctx[15],
    	receive: /*receive*/ ctx[16],
    	formatted: /*formatted*/ ctx[0]
    });

    // (41:43)     
    function fallback_block(ctx) {
    	let div;
    	let button;
    	let button_intro;
    	let button_outro;
    	let t0;
    	let span;
    	let t1;
    	let span_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t0 = space();
    			span = element("span");
    			t1 = text(/*formatted*/ ctx[0]);
    			attr_dev(button, "class", "svelte-18igz6t");
    			add_location(button, file$6, 42, 4, 1358);
    			attr_dev(span, "class", "button-text svelte-18igz6t");
    			add_location(span, file$6, 43, 4, 1425);
    			attr_dev(div, "class", "button-container svelte-18igz6t");
    			add_location(div, file$6, 41, 3, 1323);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(div, t0);
    			append_dev(div, span);
    			append_dev(span, t1);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (!current || dirty & /*formatted*/ 1) set_data_dev(t1, /*formatted*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (button_outro) button_outro.end(1);
    					button_intro = create_in_transition(button, /*receive*/ ctx[16], { key: /*key*/ ctx[14] });
    					button_intro.start();
    				});
    			}

    			if (local) {
    				add_render_callback(() => {
    					if (!span_transition) span_transition = create_bidirectional_transition(span, fade, { delay: 150 }, true);
    					span_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (button_intro) button_intro.invalidate();

    			if (local) {
    				button_outro = create_out_transition(button, /*send*/ ctx[15], { key: /*key*/ ctx[14] });
    			}

    			if (local) {
    				if (!span_transition) span_transition = create_bidirectional_transition(span, fade, { delay: 150 }, false);
    				span_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && button_outro) button_outro.end();
    			if (detaching && span_transition) span_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(41:43)     ",
    		ctx
    	});

    	return block;
    }

    // (40:1) <Popover {style} let:key let:send let:receive bind:isOpen={$store.open}>
    function create_default_slot_1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, key, send, receive, formatted*/ 118785)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*formatted, key*/ 16385)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(40:1) <Popover {style} let:key let:send let:receive bind:isOpen={$store.open}>",
    		ctx
    	});

    	return block;
    }

    // (47:2) <svelte:fragment slot="contents">
    function create_contents_slot(ctx) {
    	let calendar;
    	let current;
    	calendar = new Calendar({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(calendar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(calendar, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(calendar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_contents_slot.name,
    		type: "slot",
    		source: "(47:2) <svelte:fragment slot=\\\"contents\\\">",
    		ctx
    	});

    	return block;
    }

    // (39:0) <Theme {defaultTheme} {theme} let:style>
    function create_default_slot$1(ctx) {
    	let popover;
    	let updating_isOpen;
    	let current;

    	function popover_isOpen_binding(value) {
    		/*popover_isOpen_binding*/ ctx[11](value);
    	}

    	let popover_props = {
    		style: /*style*/ ctx[13],
    		$$slots: {
    			contents: [
    				create_contents_slot,
    				({ key, send, receive }) => ({ 14: key, 15: send, 16: receive }),
    				({ key, send, receive }) => (key ? 16384 : 0) | (send ? 32768 : 0) | (receive ? 65536 : 0)
    			],
    			default: [
    				create_default_slot_1,
    				({ key, send, receive }) => ({ 14: key, 15: send, 16: receive }),
    				({ key, send, receive }) => (key ? 16384 : 0) | (send ? 32768 : 0) | (receive ? 65536 : 0)
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*$store*/ ctx[4].open !== void 0) {
    		popover_props.isOpen = /*$store*/ ctx[4].open;
    	}

    	popover = new Popover({ props: popover_props, $$inline: true });
    	binding_callbacks.push(() => bind(popover, 'isOpen', popover_isOpen_binding));

    	const block = {
    		c: function create() {
    			create_component(popover.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(popover, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const popover_changes = {};
    			if (dirty & /*style*/ 8192) popover_changes.style = /*style*/ ctx[13];

    			if (dirty & /*$$scope, formatted, key, send, receive*/ 118785) {
    				popover_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_isOpen && dirty & /*$store*/ 16) {
    				updating_isOpen = true;
    				popover_changes.isOpen = /*$store*/ ctx[4].open;
    				add_flush_callback(() => updating_isOpen = false);
    			}

    			popover.$set(popover_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(popover.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(popover.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(popover, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(39:0) <Theme {defaultTheme} {theme} let:style>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let theme_1;
    	let current;

    	theme_1 = new Theme({
    			props: {
    				defaultTheme: /*defaultTheme*/ ctx[2],
    				theme: /*theme*/ ctx[1],
    				$$slots: {
    					default: [
    						create_default_slot$1,
    						({ style }) => ({ 13: style }),
    						({ style }) => style ? 8192 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(theme_1.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(theme_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const theme_1_changes = {};
    			if (dirty & /*defaultTheme*/ 4) theme_1_changes.defaultTheme = /*defaultTheme*/ ctx[2];
    			if (dirty & /*theme*/ 2) theme_1_changes.theme = /*theme*/ ctx[1];

    			if (dirty & /*$$scope, style, $store, formatted*/ 12305) {
    				theme_1_changes.$$scope = { dirty, ctx };
    			}

    			theme_1.$set(theme_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(theme_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(theme_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(theme_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $store,
    		$$unsubscribe_store = noop,
    		$$subscribe_store = () => ($$unsubscribe_store(), $$unsubscribe_store = subscribe(store, $$value => $$invalidate(4, $store = $$value)), store);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_store());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Datepicker', slots, ['default']);
    	let { selected = calendar.selected } = $$props;
    	let { start = calendar.start } = $$props;
    	let { end = calendar.end } = $$props;
    	let { format = calendar.format } = $$props;
    	let { formatted = '' } = $$props;
    	let { theme = {} } = $$props;
    	let { defaultTheme = undefined } = $$props;
    	let { startOfWeekIndex = 0 } = $$props;

    	let { store = datepickerStore.get({
    		selected,
    		start,
    		end,
    		shouldEnlargeDay: true,
    		startOfWeekIndex
    	}) } = $$props;

    	validate_store(store, 'store');
    	$$subscribe_store();
    	setContext(storeContextKey, store);
    	setContext(keyControlsContextKey, derived(store, $s => $s.activeView));

    	const writable_props = [
    		'selected',
    		'start',
    		'end',
    		'format',
    		'formatted',
    		'theme',
    		'defaultTheme',
    		'startOfWeekIndex',
    		'store'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Datepicker> was created with unknown prop '${key}'`);
    	});

    	function popover_isOpen_binding(value) {
    		if ($$self.$$.not_equal($store.open, value)) {
    			$store.open = value;
    			store.set($store);
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('selected' in $$props) $$invalidate(5, selected = $$props.selected);
    		if ('start' in $$props) $$invalidate(6, start = $$props.start);
    		if ('end' in $$props) $$invalidate(7, end = $$props.end);
    		if ('format' in $$props) $$invalidate(8, format = $$props.format);
    		if ('formatted' in $$props) $$invalidate(0, formatted = $$props.formatted);
    		if ('theme' in $$props) $$invalidate(1, theme = $$props.theme);
    		if ('defaultTheme' in $$props) $$invalidate(2, defaultTheme = $$props.defaultTheme);
    		if ('startOfWeekIndex' in $$props) $$invalidate(9, startOfWeekIndex = $$props.startOfWeekIndex);
    		if ('store' in $$props) $$subscribe_store($$invalidate(3, store = $$props.store));
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		dayjs: dayjs_min,
    		datepickerStore,
    		keyControlsContextKey,
    		storeContextKey,
    		setContext,
    		derived,
    		Popover,
    		Theme,
    		Calendar,
    		fade,
    		calendarDefaults: calendar,
    		selected,
    		start,
    		end,
    		format,
    		formatted,
    		theme,
    		defaultTheme,
    		startOfWeekIndex,
    		store,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('selected' in $$props) $$invalidate(5, selected = $$props.selected);
    		if ('start' in $$props) $$invalidate(6, start = $$props.start);
    		if ('end' in $$props) $$invalidate(7, end = $$props.end);
    		if ('format' in $$props) $$invalidate(8, format = $$props.format);
    		if ('formatted' in $$props) $$invalidate(0, formatted = $$props.formatted);
    		if ('theme' in $$props) $$invalidate(1, theme = $$props.theme);
    		if ('defaultTheme' in $$props) $$invalidate(2, defaultTheme = $$props.defaultTheme);
    		if ('startOfWeekIndex' in $$props) $$invalidate(9, startOfWeekIndex = $$props.startOfWeekIndex);
    		if ('store' in $$props) $$subscribe_store($$invalidate(3, store = $$props.store));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$store*/ 16) {
    			$$invalidate(5, selected = $store.selected);
    		}

    		if ($$self.$$.dirty & /*selected, format*/ 288) {
    			$$invalidate(0, formatted = dayjs_min(selected).format(format));
    		}
    	};

    	return [
    		formatted,
    		theme,
    		defaultTheme,
    		store,
    		$store,
    		selected,
    		start,
    		end,
    		format,
    		startOfWeekIndex,
    		slots,
    		popover_isOpen_binding,
    		$$scope
    	];
    }

    class Datepicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			selected: 5,
    			start: 6,
    			end: 7,
    			format: 8,
    			formatted: 0,
    			theme: 1,
    			defaultTheme: 2,
    			startOfWeekIndex: 9,
    			store: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Datepicker",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get selected() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set start(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get end() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set end(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get format() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set format(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatted() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatted(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get theme() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defaultTheme() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultTheme(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get startOfWeekIndex() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set startOfWeekIndex(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get store() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set store(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\billing\TabForms\AddressForm.svelte generated by Svelte v3.48.0 */
    const file$5 = "src\\components\\billing\\TabForms\\AddressForm.svelte";

    // (44:6) {#if $addressData.err.firstName}
    function create_if_block_6$1(ctx) {
    	let p;
    	let t_value = /*$addressData*/ ctx[5].err.firstName + "";
    	let t;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "error__message  svelte-12r6me0");
    			add_location(p, file$5, 44, 8, 1325);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$addressData*/ 32) && t_value !== (t_value = /*$addressData*/ ctx[5].err.firstName + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, true);
    					p_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, false);
    				p_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(44:6) {#if $addressData.err.firstName}",
    		ctx
    	});

    	return block;
    }

    // (60:6) {#if $addressData.err.lastName}
    function create_if_block_5$1(ctx) {
    	let p;
    	let t_value = /*$addressData*/ ctx[5].err.lastName + "";
    	let t;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "error__message  svelte-12r6me0");
    			add_location(p, file$5, 60, 8, 1804);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$addressData*/ 32) && t_value !== (t_value = /*$addressData*/ ctx[5].err.lastName + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, true);
    					p_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, false);
    				p_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(60:6) {#if $addressData.err.lastName}",
    		ctx
    	});

    	return block;
    }

    // (88:6) {#if $addressData.err.gender}
    function create_if_block_4$1(ctx) {
    	let p;
    	let t_value = /*$addressData*/ ctx[5].err.gender + "";
    	let t;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "error__message svelte-12r6me0");
    			add_location(p, file$5, 88, 8, 2790);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$addressData*/ 32) && t_value !== (t_value = /*$addressData*/ ctx[5].err.gender + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, true);
    					p_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, false);
    				p_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(88:6) {#if $addressData.err.gender}",
    		ctx
    	});

    	return block;
    }

    // (96:6) <Datepicker bind:store={dob} let:key let:send let:receive>
    function create_default_slot(ctx) {
    	let input;
    	let input_placeholder_value;
    	let input_intro;
    	let input_outro;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "input-sv small svelte-12r6me0");
    			set_style(input, "max-width", "240px");

    			attr_dev(input, "placeholder", input_placeholder_value = (/*$dob*/ ctx[2]?.hasChosen)
    			? dayjs_min(/*$dob*/ ctx[2].selected).format("MMM D, YYYY")
    			: "Date Of Birth*");

    			toggle_class(input, "error", /*$addressData*/ ctx[5].err.dateOfBirdth);
    			add_location(input, file$5, 96, 8, 3030);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					input,
    					"focus",
    					function () {
    						if (is_function(/*addressData*/ ctx[0].clear)) /*addressData*/ ctx[0].clear.apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty & /*$dob*/ 4 && input_placeholder_value !== (input_placeholder_value = (/*$dob*/ ctx[2]?.hasChosen)
    			? dayjs_min(/*$dob*/ ctx[2].selected).format("MMM D, YYYY")
    			: "Date Of Birth*")) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if (dirty & /*$addressData*/ 32) {
    				toggle_class(input, "error", /*$addressData*/ ctx[5].err.dateOfBirdth);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (input_outro) input_outro.end(1);
    					input_intro = create_in_transition(input, /*receive*/ ctx[21], { key: /*key*/ ctx[19] });
    					input_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (input_intro) input_intro.invalidate();

    			if (local) {
    				input_outro = create_out_transition(input, /*send*/ ctx[20], { key: /*key*/ ctx[19] });
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching && input_outro) input_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(96:6) <Datepicker bind:store={dob} let:key let:send let:receive>",
    		ctx
    	});

    	return block;
    }

    // (109:6) {#if $addressData.err.dateOfBirdth}
    function create_if_block_3$1(ctx) {
    	let p;
    	let t_value = /*$addressData*/ ctx[5].err.dateOfBirdth + "";
    	let t;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "error__message  svelte-12r6me0");
    			add_location(p, file$5, 109, 8, 3493);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$addressData*/ 32) && t_value !== (t_value = /*$addressData*/ ctx[5].err.dateOfBirdth + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, true);
    					p_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, false);
    				p_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(109:6) {#if $addressData.err.dateOfBirdth}",
    		ctx
    	});

    	return block;
    }

    // (126:6) {#if $addressData.err.streetNumber}
    function create_if_block_2$2(ctx) {
    	let p;
    	let t_value = /*$addressData*/ ctx[5].err.streetNumber + "";
    	let t;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "error__message  svelte-12r6me0");
    			add_location(p, file$5, 126, 8, 4009);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$addressData*/ 32) && t_value !== (t_value = /*$addressData*/ ctx[5].err.streetNumber + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, true);
    					p_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, false);
    				p_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(126:6) {#if $addressData.err.streetNumber}",
    		ctx
    	});

    	return block;
    }

    // (142:6) {#if $addressData.err.city}
    function create_if_block_1$3(ctx) {
    	let p;
    	let t_value = /*$addressData*/ ctx[5].err.city + "";
    	let t;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "error__message  svelte-12r6me0");
    			add_location(p, file$5, 142, 8, 4469);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$addressData*/ 32) && t_value !== (t_value = /*$addressData*/ ctx[5].err.city + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, true);
    					p_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, false);
    				p_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(142:6) {#if $addressData.err.city}",
    		ctx
    	});

    	return block;
    }

    // (170:6) {#if $addressData.err.postal}
    function create_if_block$4(ctx) {
    	let p;
    	let t_value = /*$addressData*/ ctx[5].err.postal + "";
    	let t;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "error__message  svelte-12r6me0");
    			add_location(p, file$5, 170, 8, 5198);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$addressData*/ 32) && t_value !== (t_value = /*$addressData*/ ctx[5].err.postal + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, true);
    					p_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, slide, {}, false);
    				p_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(170:6) {#if $addressData.err.postal}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div17;
    	let div0;
    	let t1;
    	let div1;
    	let t3;
    	let div16;
    	let div2;
    	let input0;
    	let t4;
    	let t5;
    	let div3;
    	let input1;
    	let t6;
    	let t7;
    	let div10;
    	let div9;
    	let div8;
    	let dropdownico;
    	let t8;
    	let div4;
    	let t9_value = (/*gender*/ ctx[4] || "Gender*") + "";
    	let t9;
    	let t10;
    	let div7;
    	let div5;
    	let t12;
    	let div6;
    	let t14;
    	let t15;
    	let div11;
    	let datepicker;
    	let updating_store;
    	let t16;
    	let t17;
    	let div12;
    	let input2;
    	let t18;
    	let t19;
    	let div13;
    	let input3;
    	let t20;
    	let t21;
    	let div14;
    	let input4;
    	let input4_value_value;
    	let t22;
    	let div15;
    	let input5;
    	let t23;
    	let div17_intro;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$addressData*/ ctx[5].err.firstName && create_if_block_6$1(ctx);
    	let if_block1 = /*$addressData*/ ctx[5].err.lastName && create_if_block_5$1(ctx);
    	dropdownico = new Dropdown_ico({ $$inline: true });
    	let if_block2 = /*$addressData*/ ctx[5].err.gender && create_if_block_4$1(ctx);

    	function datepicker_store_binding(value) {
    		/*datepicker_store_binding*/ ctx[15](value);
    	}

    	let datepicker_props = {
    		$$slots: {
    			default: [
    				create_default_slot,
    				({ key, send, receive }) => ({ 19: key, 20: send, 21: receive }),
    				({ key, send, receive }) => (key ? 524288 : 0) | (send ? 1048576 : 0) | (receive ? 2097152 : 0)
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*dob*/ ctx[1] !== void 0) {
    		datepicker_props.store = /*dob*/ ctx[1];
    	}

    	datepicker = new Datepicker({ props: datepicker_props, $$inline: true });
    	binding_callbacks.push(() => bind(datepicker, 'store', datepicker_store_binding));
    	let if_block3 = /*$addressData*/ ctx[5].err.dateOfBirdth && create_if_block_3$1(ctx);
    	let if_block4 = /*$addressData*/ ctx[5].err.streetNumber && create_if_block_2$2(ctx);
    	let if_block5 = /*$addressData*/ ctx[5].err.city && create_if_block_1$3(ctx);
    	let if_block6 = /*$addressData*/ ctx[5].err.postal && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div17 = element("div");
    			div0 = element("div");
    			div0.textContent = "Address";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "*Please make sure that all information matches your billling information";
    			t3 = space();
    			div16 = element("div");
    			div2 = element("div");
    			input0 = element("input");
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			div3 = element("div");
    			input1 = element("input");
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			create_component(dropdownico.$$.fragment);
    			t8 = space();
    			div4 = element("div");
    			t9 = text(t9_value);
    			t10 = space();
    			div7 = element("div");
    			div5 = element("div");
    			div5.textContent = "Male";
    			t12 = space();
    			div6 = element("div");
    			div6.textContent = "Female";
    			t14 = space();
    			if (if_block2) if_block2.c();
    			t15 = space();
    			div11 = element("div");
    			create_component(datepicker.$$.fragment);
    			t16 = space();
    			if (if_block3) if_block3.c();
    			t17 = space();
    			div12 = element("div");
    			input2 = element("input");
    			t18 = space();
    			if (if_block4) if_block4.c();
    			t19 = space();
    			div13 = element("div");
    			input3 = element("input");
    			t20 = space();
    			if (if_block5) if_block5.c();
    			t21 = space();
    			div14 = element("div");
    			input4 = element("input");
    			t22 = space();
    			div15 = element("div");
    			input5 = element("input");
    			t23 = space();
    			if (if_block6) if_block6.c();
    			attr_dev(div0, "class", "tab__head");
    			add_location(div0, file$5, 28, 2, 789);
    			attr_dev(div1, "class", "tab__subhead");
    			add_location(div1, file$5, 29, 2, 829);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "input-sv small svelte-12r6me0");
    			attr_dev(input0, "placeholder", "First Name*");
    			attr_dev(input0, "autocomplete", "");
    			toggle_class(input0, "error", /*$addressData*/ ctx[5].err.firstName);
    			add_location(input0, file$5, 34, 6, 1016);
    			attr_dev(div2, "class", "input-sv__wrapper svelte-12r6me0");
    			add_location(div2, file$5, 33, 4, 977);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "input-sv small svelte-12r6me0");
    			attr_dev(input1, "placeholder", "Last Name*");
    			attr_dev(input1, "autocomplete", "");
    			toggle_class(input1, "error", /*$addressData*/ ctx[5].err.lastName);
    			add_location(input1, file$5, 50, 6, 1499);
    			attr_dev(div3, "class", "input-sv__wrapper svelte-12r6me0");
    			add_location(div3, file$5, 49, 4, 1460);
    			attr_dev(div4, "class", "dropdown__item--current svelte-12r6me0");
    			add_location(div4, file$5, 76, 10, 2352);
    			attr_dev(div5, "class", "dropdown__item svelte-12r6me0");
    			add_location(div5, file$5, 78, 12, 2471);
    			attr_dev(div6, "class", "dropdown__item svelte-12r6me0");
    			add_location(div6, file$5, 81, 12, 2588);
    			attr_dev(div7, "class", "dropdown__items svelte-12r6me0");
    			add_location(div7, file$5, 77, 10, 2428);
    			attr_dev(div8, "class", "dropdown svelte-12r6me0");
    			toggle_class(div8, "activeGender", /*activeGender*/ ctx[3]);
    			toggle_class(div8, "error", /*$addressData*/ ctx[5].err.gender);
    			add_location(div8, file$5, 67, 8, 2047);
    			attr_dev(div9, "class", "dropdown__wrapper svelte-12r6me0");
    			add_location(div9, file$5, 66, 6, 1977);
    			attr_dev(div10, "class", "input-sv__wrapper svelte-12r6me0");
    			add_location(div10, file$5, 65, 4, 1938);
    			attr_dev(div11, "class", "input-sv__wrapper svelte-12r6me0");
    			add_location(div11, file$5, 94, 4, 2923);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "input-sv small street svelte-12r6me0");
    			attr_dev(input2, "placeholder", "Street Number & Street*");
    			attr_dev(input2, "autocomplete", "");
    			toggle_class(input2, "error", /*$addressData*/ ctx[5].err.streetNumber);
    			add_location(input2, file$5, 115, 6, 3670);
    			attr_dev(div12, "class", "input-sv__wrapper svelte-12r6me0");
    			add_location(div12, file$5, 114, 4, 3631);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "class", "input-sv");
    			attr_dev(input3, "placeholder", "City *");
    			attr_dev(input3, "autocomplete", "");
    			toggle_class(input3, "error", /*$addressData*/ ctx[5].err.city);
    			add_location(input3, file$5, 132, 6, 4186);
    			attr_dev(div13, "class", "input-sv__wrapper svelte-12r6me0");
    			add_location(div13, file$5, 131, 4, 4147);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "class", "input-sv");
    			attr_dev(input4, "placeholder", "City *");
    			attr_dev(input4, "autocomplete", "");
    			input4.value = input4_value_value = /*$contributionData*/ ctx[6].country.countryName;
    			input4.disabled = true;
    			add_location(input4, file$5, 148, 6, 4638);
    			attr_dev(div14, "class", "input-sv__wrapper svelte-12r6me0");
    			add_location(div14, file$5, 147, 4, 4599);
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "class", "input-sv small svelte-12r6me0");
    			attr_dev(input5, "placeholder", "Postal / Zip Code");
    			attr_dev(input5, "autocomplete", "");
    			toggle_class(input5, "error", /*$addressData*/ ctx[5].err.postal);
    			add_location(input5, file$5, 160, 6, 4892);
    			attr_dev(div15, "class", "input-sv__wrapper svelte-12r6me0");
    			add_location(div15, file$5, 159, 4, 4853);
    			attr_dev(div16, "class", "input_grid svelte-12r6me0");
    			add_location(div16, file$5, 32, 2, 947);
    			attr_dev(div17, "class", "tab__wrapper");
    			add_location(div17, file$5, 27, 0, 751);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div17, anchor);
    			append_dev(div17, div0);
    			append_dev(div17, t1);
    			append_dev(div17, div1);
    			append_dev(div17, t3);
    			append_dev(div17, div16);
    			append_dev(div16, div2);
    			append_dev(div2, input0);
    			set_input_value(input0, /*$addressData*/ ctx[5].firstName);
    			append_dev(div2, t4);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div16, t5);
    			append_dev(div16, div3);
    			append_dev(div3, input1);
    			set_input_value(input1, /*$addressData*/ ctx[5].lastName);
    			append_dev(div3, t6);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div16, t7);
    			append_dev(div16, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			mount_component(dropdownico, div8, null);
    			append_dev(div8, t8);
    			append_dev(div8, div4);
    			append_dev(div4, t9);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			append_dev(div7, div5);
    			append_dev(div7, t12);
    			append_dev(div7, div6);
    			append_dev(div10, t14);
    			if (if_block2) if_block2.m(div10, null);
    			append_dev(div16, t15);
    			append_dev(div16, div11);
    			mount_component(datepicker, div11, null);
    			append_dev(div11, t16);
    			if (if_block3) if_block3.m(div11, null);
    			append_dev(div16, t17);
    			append_dev(div16, div12);
    			append_dev(div12, input2);
    			set_input_value(input2, /*$addressData*/ ctx[5].streetNumber);
    			append_dev(div12, t18);
    			if (if_block4) if_block4.m(div12, null);
    			append_dev(div16, t19);
    			append_dev(div16, div13);
    			append_dev(div13, input3);
    			set_input_value(input3, /*$addressData*/ ctx[5].city);
    			append_dev(div13, t20);
    			if (if_block5) if_block5.m(div13, null);
    			append_dev(div16, t21);
    			append_dev(div16, div14);
    			append_dev(div14, input4);
    			append_dev(div16, t22);
    			append_dev(div16, div15);
    			append_dev(div15, input5);
    			set_input_value(input5, /*$addressData*/ ctx[5].postal);
    			append_dev(div15, t23);
    			if (if_block6) if_block6.m(div15, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(
    						input0,
    						"focus",
    						function () {
    							if (is_function(/*addressData*/ ctx[0].clear)) /*addressData*/ ctx[0].clear.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(
    						input1,
    						"focus",
    						function () {
    							if (is_function(/*addressData*/ ctx[0].clear)) /*addressData*/ ctx[0].clear.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(div5, "click", /*click_handler*/ ctx[11], false, false, false),
    					listen_dev(div6, "click", /*click_handler_1*/ ctx[12], false, false, false),
    					listen_dev(div8, "click", /*click_handler_2*/ ctx[13], false, false, false),
    					action_destroyer(clickOutside.call(null, div8)),
    					listen_dev(div8, "click_outside", /*click_outside_handler*/ ctx[14], false, false, false),
    					listen_dev(
    						div9,
    						"click",
    						function () {
    							if (is_function(/*addressData*/ ctx[0].clear)) /*addressData*/ ctx[0].clear.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[16]),
    					listen_dev(
    						input2,
    						"focus",
    						function () {
    							if (is_function(/*addressData*/ ctx[0].clear)) /*addressData*/ ctx[0].clear.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[17]),
    					listen_dev(
    						input3,
    						"focus",
    						function () {
    							if (is_function(/*addressData*/ ctx[0].clear)) /*addressData*/ ctx[0].clear.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[18]),
    					listen_dev(
    						input5,
    						"focus",
    						function () {
    							if (is_function(/*addressData*/ ctx[0].clear)) /*addressData*/ ctx[0].clear.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*$addressData*/ 32 && input0.value !== /*$addressData*/ ctx[5].firstName) {
    				set_input_value(input0, /*$addressData*/ ctx[5].firstName);
    			}

    			if (dirty & /*$addressData*/ 32) {
    				toggle_class(input0, "error", /*$addressData*/ ctx[5].err.firstName);
    			}

    			if (/*$addressData*/ ctx[5].err.firstName) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$addressData*/ 32) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_6$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div2, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*$addressData*/ 32 && input1.value !== /*$addressData*/ ctx[5].lastName) {
    				set_input_value(input1, /*$addressData*/ ctx[5].lastName);
    			}

    			if (dirty & /*$addressData*/ 32) {
    				toggle_class(input1, "error", /*$addressData*/ ctx[5].err.lastName);
    			}

    			if (/*$addressData*/ ctx[5].err.lastName) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$addressData*/ 32) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_5$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div3, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty & /*gender*/ 16) && t9_value !== (t9_value = (/*gender*/ ctx[4] || "Gender*") + "")) set_data_dev(t9, t9_value);

    			if (dirty & /*activeGender*/ 8) {
    				toggle_class(div8, "activeGender", /*activeGender*/ ctx[3]);
    			}

    			if (dirty & /*$addressData*/ 32) {
    				toggle_class(div8, "error", /*$addressData*/ ctx[5].err.gender);
    			}

    			if (/*$addressData*/ ctx[5].err.gender) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*$addressData*/ 32) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_4$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div10, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			const datepicker_changes = {};

    			if (dirty & /*$$scope, $dob, key, $addressData, addressData*/ 4718629) {
    				datepicker_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_store && dirty & /*dob*/ 2) {
    				updating_store = true;
    				datepicker_changes.store = /*dob*/ ctx[1];
    				add_flush_callback(() => updating_store = false);
    			}

    			datepicker.$set(datepicker_changes);

    			if (/*$addressData*/ ctx[5].err.dateOfBirdth) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*$addressData*/ 32) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_3$1(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div11, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*$addressData*/ 32 && input2.value !== /*$addressData*/ ctx[5].streetNumber) {
    				set_input_value(input2, /*$addressData*/ ctx[5].streetNumber);
    			}

    			if (dirty & /*$addressData*/ 32) {
    				toggle_class(input2, "error", /*$addressData*/ ctx[5].err.streetNumber);
    			}

    			if (/*$addressData*/ ctx[5].err.streetNumber) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty & /*$addressData*/ 32) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_2$2(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div12, null);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*$addressData*/ 32 && input3.value !== /*$addressData*/ ctx[5].city) {
    				set_input_value(input3, /*$addressData*/ ctx[5].city);
    			}

    			if (dirty & /*$addressData*/ 32) {
    				toggle_class(input3, "error", /*$addressData*/ ctx[5].err.city);
    			}

    			if (/*$addressData*/ ctx[5].err.city) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);

    					if (dirty & /*$addressData*/ 32) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block_1$3(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(div13, null);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*$contributionData*/ 64 && input4_value_value !== (input4_value_value = /*$contributionData*/ ctx[6].country.countryName) && input4.value !== input4_value_value) {
    				prop_dev(input4, "value", input4_value_value);
    			}

    			if (dirty & /*$addressData*/ 32 && input5.value !== /*$addressData*/ ctx[5].postal) {
    				set_input_value(input5, /*$addressData*/ ctx[5].postal);
    			}

    			if (dirty & /*$addressData*/ 32) {
    				toggle_class(input5, "error", /*$addressData*/ ctx[5].err.postal);
    			}

    			if (/*$addressData*/ ctx[5].err.postal) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);

    					if (dirty & /*$addressData*/ 32) {
    						transition_in(if_block6, 1);
    					}
    				} else {
    					if_block6 = create_if_block$4(ctx);
    					if_block6.c();
    					transition_in(if_block6, 1);
    					if_block6.m(div15, null);
    				}
    			} else if (if_block6) {
    				group_outros();

    				transition_out(if_block6, 1, 1, () => {
    					if_block6 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(dropdownico.$$.fragment, local);
    			transition_in(if_block2);
    			transition_in(datepicker.$$.fragment, local);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block5);
    			transition_in(if_block6);

    			if (!div17_intro) {
    				add_render_callback(() => {
    					div17_intro = create_in_transition(div17, fade, {});
    					div17_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(dropdownico.$$.fragment, local);
    			transition_out(if_block2);
    			transition_out(datepicker.$$.fragment, local);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block5);
    			transition_out(if_block6);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div17);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(dropdownico);
    			if (if_block2) if_block2.d();
    			destroy_component(datepicker);
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $addressData,
    		$$unsubscribe_addressData = noop,
    		$$subscribe_addressData = () => ($$unsubscribe_addressData(), $$unsubscribe_addressData = subscribe(addressData, $$value => $$invalidate(5, $addressData = $$value)), addressData);

    	let $dob,
    		$$unsubscribe_dob = noop,
    		$$subscribe_dob = () => ($$unsubscribe_dob(), $$unsubscribe_dob = subscribe(dob, $$value => $$invalidate(2, $dob = $$value)), dob);

    	let $contributionData;
    	validate_store(contributionData, 'contributionData');
    	component_subscribe($$self, contributionData, $$value => $$invalidate(6, $contributionData = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_addressData());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_dob());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AddressForm', slots, []);
    	let { addressData } = $$props;
    	validate_store(addressData, 'addressData');
    	$$subscribe_addressData();
    	let activeGender = false;
    	let gender;
    	let dob;

    	let handleClickOutside = () => {
    		$$invalidate(3, activeGender = false);
    	};

    	let setGender = item => {
    		set_store_value(addressData, $addressData.gender = item, $addressData);
    		$$invalidate(4, gender = item);
    	};

    	const writable_props = ['addressData'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AddressForm> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		$addressData.firstName = this.value;
    		addressData.set($addressData);
    	}

    	function input1_input_handler() {
    		$addressData.lastName = this.value;
    		addressData.set($addressData);
    	}

    	const click_handler = () => setGender("Male");
    	const click_handler_1 = () => setGender("Female");
    	const click_handler_2 = () => $$invalidate(3, activeGender = !activeGender);
    	const click_outside_handler = () => handleClickOutside();

    	function datepicker_store_binding(value) {
    		dob = value;
    		$$subscribe_dob($$invalidate(1, dob));
    	}

    	function input2_input_handler() {
    		$addressData.streetNumber = this.value;
    		addressData.set($addressData);
    	}

    	function input3_input_handler() {
    		$addressData.city = this.value;
    		addressData.set($addressData);
    	}

    	function input5_input_handler() {
    		$addressData.postal = this.value;
    		addressData.set($addressData);
    	}

    	$$self.$$set = $$props => {
    		if ('addressData' in $$props) $$subscribe_addressData($$invalidate(0, addressData = $$props.addressData));
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		slide,
    		Datepicker,
    		dayjs: dayjs_min,
    		DropdownIco: Dropdown_ico,
    		clickOutside,
    		contributionData,
    		addressData,
    		activeGender,
    		gender,
    		dob,
    		handleClickOutside,
    		setGender,
    		$addressData,
    		$dob,
    		$contributionData
    	});

    	$$self.$inject_state = $$props => {
    		if ('addressData' in $$props) $$subscribe_addressData($$invalidate(0, addressData = $$props.addressData));
    		if ('activeGender' in $$props) $$invalidate(3, activeGender = $$props.activeGender);
    		if ('gender' in $$props) $$invalidate(4, gender = $$props.gender);
    		if ('dob' in $$props) $$subscribe_dob($$invalidate(1, dob = $$props.dob));
    		if ('handleClickOutside' in $$props) $$invalidate(7, handleClickOutside = $$props.handleClickOutside);
    		if ('setGender' in $$props) $$invalidate(8, setGender = $$props.setGender);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*dob, $dob*/ 6) {
    			{

    				if ($dob?.hasChosen) {
    					set_store_value(addressData, $addressData.dateOfBirdth = dayjs_min($dob.selected).format("YYYY-MM-DD"), $addressData);
    				}
    			}
    		}
    	};

    	return [
    		addressData,
    		dob,
    		$dob,
    		activeGender,
    		gender,
    		$addressData,
    		$contributionData,
    		handleClickOutside,
    		setGender,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_outside_handler,
    		datepicker_store_binding,
    		input2_input_handler,
    		input3_input_handler,
    		input5_input_handler
    	];
    }

    class AddressForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { addressData: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddressForm",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*addressData*/ ctx[0] === undefined && !('addressData' in props)) {
    			console.warn("<AddressForm> was created without expected prop 'addressData'");
    		}
    	}

    	get addressData() {
    		throw new Error("<AddressForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addressData(value) {
    		throw new Error("<AddressForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\billing\TabForms\PaymentForm.svelte generated by Svelte v3.48.0 */

    const { console: console_1$1, document: document_1 } = globals;
    const file$4 = "src\\components\\billing\\TabForms\\PaymentForm.svelte";

    // (139:2) {#if !stripeLoadedStatus}
    function create_if_block_1$2(ctx) {
    	let div;
    	let preloader;
    	let current;

    	preloader = new Preloader({
    			props: {
    				loaderWidth: 7,
    				loaderHeight: 7,
    				borderWidth: 0.8
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(preloader.$$.fragment);
    			attr_dev(div, "class", "preloader__wrapper svelte-1rbw6o3");
    			add_location(div, file$4, 139, 4, 4556);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(preloader, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(preloader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(preloader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(preloader);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(139:2) {#if !stripeLoadedStatus}",
    		ctx
    	});

    	return block;
    }

    // (151:6) {#if preloaderState}
    function create_if_block$3(ctx) {
    	let div;
    	let preloader;
    	let current;

    	preloader = new Preloader({
    			props: {
    				loaderWidth: 1.5,
    				loaderHeight: 1.5,
    				borderWidth: 0.3
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(preloader.$$.fragment);
    			attr_dev(div, "class", "preload_btn_wrapper svelte-1rbw6o3");
    			add_location(div, file$4, 151, 6, 4965);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(preloader, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(preloader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(preloader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(preloader);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(151:6) {#if preloaderState}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let div2;
    	let t1;
    	let form;
    	let div0;
    	let t2;
    	let button;
    	let t3;
    	let t4;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = !/*stripeLoadedStatus*/ ctx[1] && create_if_block_1$2(ctx);
    	let if_block1 = /*preloaderState*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			div2 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			form = element("form");
    			div0 = element("div");
    			t2 = space();
    			button = element("button");
    			if (if_block1) if_block1.c();
    			t3 = text("\r\n      Confirm");
    			t4 = space();
    			div1 = element("div");
    			if (!src_url_equal(script.src, script_src_value = "https://js.stripe.com/v3/")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$4, 135, 2, 4405);
    			attr_dev(div0, "id", "payment-element");
    			add_location(div0, file$4, 146, 4, 4794);
    			attr_dev(button, "class", "btn-sv svelte-1rbw6o3");
    			attr_dev(button, "id", "submit");
    			add_location(button, file$4, 149, 4, 4894);
    			attr_dev(div1, "id", "error-message");
    			attr_dev(div1, "class", "svelte-1rbw6o3");
    			add_location(div1, file$4, 154, 4, 5116);
    			attr_dev(form, "id", "payment-form");
    			add_location(form, file$4, 145, 2, 4739);
    			attr_dev(div2, "class", "tab__wrapper svelte-1rbw6o3");
    			add_location(div2, file$4, 137, 0, 4495);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, form);
    			append_dev(form, div0);
    			append_dev(form, t2);
    			append_dev(form, button);
    			if (if_block1) if_block1.m(button, null);
    			append_dev(button, t3);
    			append_dev(form, t4);
    			append_dev(form, div1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(script, "load", /*stripeLoaded*/ ctx[2], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*stripeLoadedStatus*/ ctx[1]) {
    				if (if_block0) {
    					if (dirty & /*stripeLoadedStatus*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div2, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*preloaderState*/ ctx[0]) {
    				if (if_block1) {
    					if (dirty & /*preloaderState*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(button, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $userAuthToken;
    	let $clientSecretToken;
    	validate_store(userAuthToken, 'userAuthToken');
    	component_subscribe($$self, userAuthToken, $$value => $$invalidate(6, $userAuthToken = $$value));
    	validate_store(clientSecretToken, 'clientSecretToken');
    	component_subscribe($$self, clientSecretToken, $$value => $$invalidate(7, $clientSecretToken = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PaymentForm', slots, []);
    	let currentBillingMethod = 0;
    	let stripeReady = false;
    	let mounted = false;
    	let preloaderState = false;
    	let stripeLoadedStatus = false;
    	const client_secret = $clientSecretToken;
    	console.log(client_secret);

    	onMount(async () => {
    		mounted = true;

    		if (stripeReady) {
    			console.log("strype is ready");
    			loadStripeElements();
    		}
    	});

    	function stripeLoaded() {
    		stripeReady = true;

    		if (mounted) {
    			loadStripeElements();
    		}
    	}

    	const options = {
    		clientSecret: client_secret,
    		// Fully customizable with appearance API.
    		appearance: {}
    	};

    	function loadStripeElements() {
    		// await sleep(500);
    		// Create a Stripe client.
    		// Note: this merchant has been set up for demo purposes.
    		const stripe = Stripe("pk_test_51JAyWcC77lileg3b0o6iLVl0d1gk3KbajmNK1CZZNeh22fK67ZJg7s0fUUkToSVxPGdiLFlwyvKeihifBFS6UL1b005wevv4GM");

    		// Create an instance of Elements.
    		var elements = stripe.elements({ clientSecret: client_secret });

    		// Create an instance of the idealBank Element.
    		var paymentForm = elements.create("payment");

    		// Add an instance of the idealBank Element into the `ideal-bank-element` <div>.
    		paymentForm.mount("#payment-element");

    		paymentForm.on("ready", function (event) {
    			setTimeout(
    				() => {
    					$$invalidate(1, stripeLoadedStatus = true);
    				},
    				300
    			);

    			console.log(event);
    		});

    		document.getElementById("error-message");

    		// Handle form submission.
    		const form = document.getElementById("payment-form");

    		form.addEventListener("submit", async event => {
    			event.preventDefault();
    			$$invalidate(0, preloaderState = true);

    			// set data to pass to webflow
    			localStorage.setItem('stripe_PK', "pk_test_51JAyWcC77lileg3b0o6iLVl0d1gk3KbajmNK1CZZNeh22fK67ZJg7s0fUUkToSVxPGdiLFlwyvKeihifBFS6UL1b005wevv4GM");

    			localStorage.setItem('AuthToken', $userAuthToken);

    			const { error } = await stripe.confirmSetup({
    				//`Elements` instance that was used to create the Payment Element
    				elements,
    				confirmParams: {
    					return_url: "https://esi.webflow.io/successful-page"
    				}
    			});

    			if (error) {
    				// This point will only be reached if there is an immediate error when
    				// confirming the payment. Show error to your customer (for example, payment
    				// details incomplete)
    				$$invalidate(0, preloaderState = false);

    				const messageContainer = document.querySelector("#error-message");
    				messageContainer.textContent = error.message;
    			} // Your customer will be redirected to your `return_url`. For some payment
    			// methods like iDEAL, your customer will be redirected to an intermediate
    		}); // site first to authorize the payment, then redirected to the `return_url`.
    	} // const clientSecret = new URLSearchParams(window.location.search).get(
    	//   "setup_intent_client_secret"

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<PaymentForm> was created with unknown prop '${key}'`);
    	});

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$capture_state = () => ({
    		clientSecretToken,
    		userAuthToken,
    		onMount,
    		Preloader,
    		currentBillingMethod,
    		stripeReady,
    		mounted,
    		preloaderState,
    		stripeLoadedStatus,
    		client_secret,
    		stripeLoaded,
    		options,
    		loadStripeElements,
    		$userAuthToken,
    		$clientSecretToken
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentBillingMethod' in $$props) $$invalidate(8, currentBillingMethod = $$props.currentBillingMethod);
    		if ('stripeReady' in $$props) stripeReady = $$props.stripeReady;
    		if ('mounted' in $$props) mounted = $$props.mounted;
    		if ('preloaderState' in $$props) $$invalidate(0, preloaderState = $$props.preloaderState);
    		if ('stripeLoadedStatus' in $$props) $$invalidate(1, stripeLoadedStatus = $$props.stripeLoadedStatus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}
    	return [preloaderState, stripeLoadedStatus, stripeLoaded, submit_handler];
    }

    class PaymentForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaymentForm",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* public\images\Button_back_ico.svelte generated by Svelte v3.48.0 */

    const file$3 = "public\\images\\Button_back_ico.svelte";

    function create_fragment$3(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M9.36881 12.568C9.53285 12.4039 9.625 12.1814 9.625 11.9494C9.625 11.7174 9.53285 11.4949 9.36881 11.3308L5.03756 6.99953L9.36881 2.66828C9.5282 2.50325 9.61639 2.28223 9.6144 2.0528C9.61241 1.82338 9.52038 1.60392 9.35815 1.44169C9.19592 1.27946 8.97646 1.18743 8.74704 1.18544C8.51761 1.18345 8.29659 1.27164 8.13156 1.43103L3.18169 6.38091C3.01765 6.54499 2.9255 6.76751 2.9255 6.99953C2.9255 7.23155 3.01765 7.45407 3.18169 7.61816L8.13156 12.568C8.29565 12.7321 8.51817 12.8242 8.75019 12.8242C8.98221 12.8242 9.20473 12.7321 9.36881 12.568Z");
    			attr_dev(path, "fill", "#CFCFCF");
    			add_location(path, file$3, 7, 4, 128);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "14");
    			attr_dev(svg, "height", "14");
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", "svelte-8z8wjk");
    			add_location(svg, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button_back_ico', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button_back_ico> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Button_back_ico extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button_back_ico",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    async function updateUserInDB(userData,userToken) {
        let status = false;
      
        console.log(userData);
        const mainEndpoint =
          "https://be.esi.kdg.com.ua/esi_private/esi_private/backend/updateClient";
        try {
          const rawResponse = await fetch(mainEndpoint, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: userToken,

            },
            body: JSON.stringify(userData),
          });
          const content = await rawResponse.json();
          status = content.status;
          // $userAuthToken = content.data.token;
        } catch (e) {
          alert(e.message);
        }
        return status;
      }

    function setClientSecret(data){
        clientSecretToken.set(data);
        console.log('updated');
    }

    async function getClientSecret(userToken) {
        let status = false;
      
        const mainEndpoint =
          "https://be.esi.kdg.com.ua/esi_private/esi_private/backend/addPaymentMethod";
        try {
          const rawResponse = await fetch(mainEndpoint, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: userToken,

            },
          });
          const content = await rawResponse.json();
          setClientSecret(content.data.clientSecret);
          status = content.status;
          // $userAuthToken = content.data.token;
        } catch (e) {
          alert(e.message);
        }
        return status;
      }

    /* src\components\billing\Billing.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;
    const file$2 = "src\\components\\billing\\Billing.svelte";

    // (165:6) {#if $billingeErrorMessage.status}
    function create_if_block_2$1(ctx) {
    	let div;
    	let t_value = /*$billingeErrorMessage*/ ctx[6].text + "";
    	let t;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "error__message");
    			add_location(div, file$2, 165, 8, 5219);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$billingeErrorMessage*/ 64) && t_value !== (t_value = /*$billingeErrorMessage*/ ctx[6].text + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
    					div_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
    				div_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(165:6) {#if $billingeErrorMessage.status}",
    		ctx
    	});

    	return block;
    }

    // (171:8) {#if $allowItemIndexBilling > 1}
    function create_if_block_1$1(ctx) {
    	let button;
    	let button_back_ico;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	button_back_ico = new Button_back_ico({ $$inline: true });

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(button_back_ico.$$.fragment);
    			t = text("\r\n            Back");
    			attr_dev(button, "class", "btn-sv prev svelte-10ccn7c");
    			add_location(button, file$2, 171, 10, 5431);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(button_back_ico, button, null);
    			append_dev(button, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*prevTab*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button_back_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button_back_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(button_back_ico);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(171:8) {#if $allowItemIndexBilling > 1}",
    		ctx
    	});

    	return block;
    }

    // (177:8) {#if activeItem.name != "Payment"}
    function create_if_block$2(ctx) {
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*formButtonText*/ ctx[3]);
    			attr_dev(button, "class", "btn-sv next svelte-10ccn7c");
    			add_location(button, file$2, 177, 10, 5621);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*nextTab*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formButtonText*/ 8) set_data_dev(t, /*formButtonText*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(177:8) {#if activeItem.name != \\\"Payment\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div5;
    	let div3;
    	let h2;
    	let t0;
    	let span;
    	let t2;
    	let div2;
    	let tabs;
    	let t3;
    	let div0;
    	let switch_instance;
    	let t4;
    	let t5;
    	let div1;
    	let t6;
    	let t7;
    	let div4;
    	let buttonright;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[12]);

    	tabs = new Tabs({
    			props: { tabItems: /*tabItems*/ ctx[7] },
    			$$inline: true
    		});

    	var switch_value = /*activeItem*/ ctx[2].component;

    	function switch_props(ctx) {
    		return {
    			props: { addressData: /*addressData*/ ctx[10] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	let if_block0 = /*$billingeErrorMessage*/ ctx[6].status && create_if_block_2$1(ctx);
    	let if_block1 = /*$allowItemIndexBilling*/ ctx[5] > 1 && create_if_block_1$1(ctx);
    	let if_block2 = /*activeItem*/ ctx[2].name != "Payment" && create_if_block$2(ctx);

    	buttonright = new ButtonRight({
    			props: { buttonState: /*nextButtonState*/ ctx[0] },
    			$$inline: true
    		});

    	buttonright.$on("click", /*nextStep*/ ctx[11]);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div3 = element("div");
    			h2 = element("h2");
    			t0 = text("Payment/Withdrawal ");
    			span = element("span");
    			span.textContent = "Methode";
    			t2 = space();
    			div2 = element("div");
    			create_component(tabs.$$.fragment);
    			t3 = space();
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t6 = space();
    			if (if_block2) if_block2.c();
    			t7 = space();
    			div4 = element("div");
    			create_component(buttonright.$$.fragment);
    			attr_dev(span, "class", "green svelte-10ccn7c");
    			add_location(span, file$2, 156, 25, 4964);
    			attr_dev(h2, "class", "h2-sv main__head svelte-10ccn7c");
    			add_location(h2, file$2, 155, 4, 4884);
    			add_location(div0, file$2, 160, 6, 5074);
    			attr_dev(div1, "class", "buttons__wrapper svelte-10ccn7c");
    			add_location(div1, file$2, 169, 6, 5347);
    			attr_dev(div2, "class", "main__tabs svelte-10ccn7c");
    			add_location(div2, file$2, 158, 4, 5015);
    			attr_dev(div3, "class", "info__main svelte-10ccn7c");
    			add_location(div3, file$2, 154, 2, 4854);
    			attr_dev(div4, "class", "bottom__btns billing svelte-10ccn7c");
    			add_location(div4, file$2, 184, 2, 5774);
    			attr_dev(div5, "class", "main__wrapper svelte-10ccn7c");
    			add_location(div5, file$2, 153, 0, 4823);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div3);
    			append_dev(div3, h2);
    			append_dev(h2, t0);
    			append_dev(h2, span);
    			/*h2_binding*/ ctx[13](h2);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			mount_component(tabs, div2, null);
    			append_dev(div2, t3);
    			append_dev(div2, div0);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			append_dev(div2, t4);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t6);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			mount_component(buttonright, div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[12]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (switch_value !== (switch_value = /*activeItem*/ ctx[2].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (/*$billingeErrorMessage*/ ctx[6].status) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$billingeErrorMessage*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div2, t5);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$allowItemIndexBilling*/ ctx[5] > 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$allowItemIndexBilling*/ 32) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, t6);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*activeItem*/ ctx[2].name != "Payment") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$2(ctx);
    					if_block2.c();
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			const buttonright_changes = {};
    			if (dirty & /*nextButtonState*/ 1) buttonright_changes.buttonState = /*nextButtonState*/ ctx[0];
    			buttonright.$set(buttonright_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabs.$$.fragment, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(buttonright.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabs.$$.fragment, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(buttonright.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			/*h2_binding*/ ctx[13](null);
    			destroy_component(tabs);
    			if (switch_instance) destroy_component(switch_instance);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			destroy_component(buttonright);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $userAuthToken;
    	let $successMessageState;
    	let $addressFormStatus;
    	let $addressData;
    	let $allowItemIndexBilling;
    	let $billingeErrorMessage;
    	validate_store(userAuthToken, 'userAuthToken');
    	component_subscribe($$self, userAuthToken, $$value => $$invalidate(14, $userAuthToken = $$value));
    	validate_store(successMessageState, 'successMessageState');
    	component_subscribe($$self, successMessageState, $$value => $$invalidate(15, $successMessageState = $$value));
    	validate_store(addressFormStatus, 'addressFormStatus');
    	component_subscribe($$self, addressFormStatus, $$value => $$invalidate(16, $addressFormStatus = $$value));
    	validate_store(allowItemIndexBilling, 'allowItemIndexBilling');
    	component_subscribe($$self, allowItemIndexBilling, $$value => $$invalidate(5, $allowItemIndexBilling = $$value));
    	validate_store(billingeErrorMessage, 'billingeErrorMessage');
    	component_subscribe($$self, billingeErrorMessage, $$value => $$invalidate(6, $billingeErrorMessage = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Billing', slots, []);

    	let tabItems = [
    		{ name: "Address", component: AddressForm },
    		{ name: "Payment", component: PaymentForm }
    	];

    	let activeItem = tabItems[0];
    	let formButtonText = "Next";
    	let nextButtonState = false;
    	let windowWidth, formWrapper;

    	//$userAuthToken = 'Basic ZXNpX3ByaXZhdGUlN0M1NTU1NTU1NTV0dDpwYXNzUDEmZmY='
    	function scrollToTopInMobile() {
    		if (windowWidth < 991) {
    			scrollTo$1({ element: formWrapper });
    		}
    	}

    	function nextTab() {
    		if ($allowItemIndexBilling < 3) {
    			let index = tabItems.findIndex(object => {
    				return object.name === activeItem.name;
    			});

    			if (index === 0) {
    				checkRequiredAddressFields();

    				if ($addressFormStatus) {
    					// collect user data
    					const userData = {
    						firstName: $addressData.firstName,
    						lastName: $addressData.lastName,
    						address: $addressData.streetNumber,
    						city: $addressData.city,
    						zipCode: $addressData.postal,
    						dob: $addressData.dateOfBirdth,
    						sex: $addressData.gender
    					};

    					// update user
    					let updateUserStatus = false;

    					updateUserInDB(userData, $userAuthToken).then(data => {
    						updateUserStatus = data;
    						console.log("$userAuthToken", $userAuthToken);

    						if (updateUserStatus) {
    							$$invalidate(2, activeItem = tabItems[index + 1]);
    							set_store_value(allowItemIndexBilling, $allowItemIndexBilling = $allowItemIndexBilling + 1, $allowItemIndexBilling);
    							$$invalidate(3, formButtonText = "Confirm");
    							scrollToTop$1();
    						}
    					});
    				}
    			} else if (index === 1) {
    				$$invalidate(0, nextButtonState = true);
    				scrollToTop$1();
    			}
    		}
    	}

    	function prevTab() {
    		if ($allowItemIndexBilling > 1) {
    			let index = tabItems.findIndex(object => {
    				return object.name === activeItem.name;
    			});

    			if (index != 0) {
    				$$invalidate(2, activeItem = tabItems[index - 1]);
    				set_store_value(allowItemIndexBilling, $allowItemIndexBilling = $allowItemIndexBilling - 1, $allowItemIndexBilling);
    				$$invalidate(3, formButtonText = "Next");
    				$$invalidate(0, nextButtonState = false);
    			}
    		}

    		scrollToTop$1();
    	}

    	const addressData = m({
    		firstName: "",
    		lastName: "",
    		gender: "",
    		dateOfBirdth: "",
    		streetNumber: "",
    		city: "",
    		country: "",
    		postal: ""
    	});

    	validate_store(addressData, 'addressData');
    	component_subscribe($$self, addressData, value => $$invalidate(17, $addressData = value));

    	function checkRequiredAddressFields() {
    		addressData.aovi.check("firstName").required("First Name is required").minLength(3, "First Name should be at least 3 symbols length").maxLength(20, "First Name must be no more than 20 characters").check("lastName").required("Last Name is required").minLength(3, "Last Name should be at least 3 symbols length").maxLength(20, "Last Name must be no more than 20 characters").check("gender").required("Gender is required").check("dateOfBirdth").required("Date of Birdth is required").check("streetNumber").required("Street is required").check("city").required().check("postal").required().minLength(2, "Postcode should be at least 2 symbols length").maxLength(10, "Postcode must be no more than 10 characters").match(/^\d+$/, "Postal should contain only numbers").end; // use Aovi validators
    		// you must finish validation with '.end' operator

    		if ($addressData.valid) {
    			set_store_value(addressFormStatus, $addressFormStatus = true, $addressFormStatus);
    		} else {
    			set_store_value(addressFormStatus, $addressFormStatus = false, $addressFormStatus);
    			scrollToTopInMobile();
    		}
    	}

    	let nextStep = () => {
    		set_store_value(successMessageState, $successMessageState = true, $successMessageState);
    		scrollToTop$1();
    	};

    	onMount(() => {
    		getClientSecret($userAuthToken);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Billing> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(1, windowWidth = window.innerWidth);
    	}

    	function h2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			formWrapper = $$value;
    			$$invalidate(4, formWrapper);
    		});
    	}

    	$$self.$capture_state = () => ({
    		Tabs,
    		AddressForm,
    		PaymentForm,
    		fade,
    		slide,
    		allowItemIndexBilling,
    		addressFormStatus,
    		billingeErrorMessage,
    		successMessageState,
    		userAuthToken,
    		clientSecretToken,
    		contributionData,
    		ButtonRight,
    		Button_back_ico,
    		aoviSvelte: m,
    		animateScroll,
    		scrollToTop: scrollToTop$1,
    		updateUserInDB,
    		getClientSecret,
    		onMount,
    		tabItems,
    		activeItem,
    		formButtonText,
    		nextButtonState,
    		windowWidth,
    		formWrapper,
    		scrollToTopInMobile,
    		nextTab,
    		prevTab,
    		addressData,
    		checkRequiredAddressFields,
    		nextStep,
    		$userAuthToken,
    		$successMessageState,
    		$addressFormStatus,
    		$addressData,
    		$allowItemIndexBilling,
    		$billingeErrorMessage
    	});

    	$$self.$inject_state = $$props => {
    		if ('tabItems' in $$props) $$invalidate(7, tabItems = $$props.tabItems);
    		if ('activeItem' in $$props) $$invalidate(2, activeItem = $$props.activeItem);
    		if ('formButtonText' in $$props) $$invalidate(3, formButtonText = $$props.formButtonText);
    		if ('nextButtonState' in $$props) $$invalidate(0, nextButtonState = $$props.nextButtonState);
    		if ('windowWidth' in $$props) $$invalidate(1, windowWidth = $$props.windowWidth);
    		if ('formWrapper' in $$props) $$invalidate(4, formWrapper = $$props.formWrapper);
    		if ('nextStep' in $$props) $$invalidate(11, nextStep = $$props.nextStep);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*nextButtonState, windowWidth*/ 3) ;
    	};

    	return [
    		nextButtonState,
    		windowWidth,
    		activeItem,
    		formButtonText,
    		formWrapper,
    		$allowItemIndexBilling,
    		$billingeErrorMessage,
    		tabItems,
    		nextTab,
    		prevTab,
    		addressData,
    		nextStep,
    		onwindowresize,
    		h2_binding
    	];
    }

    class Billing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Billing",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\SuccessMessage.svelte generated by Svelte v3.48.0 */
    const file$1 = "src\\components\\SuccessMessage.svelte";

    // (43:4) {#if counterVisibility}
    function create_if_block$1(ctx) {
    	let div12;
    	let p;
    	let span0;
    	let t1;
    	let span1;
    	let t3;
    	let t4;
    	let div11;
    	let div1;
    	let div0;
    	let t5;
    	let t6;
    	let span2;
    	let t8;
    	let div2;
    	let t10;
    	let div4;
    	let div3;
    	let t11;
    	let t12;
    	let span3;
    	let t14;
    	let div5;
    	let t16;
    	let div7;
    	let div6;
    	let t17;
    	let t18;
    	let span4;
    	let t20;
    	let div8;
    	let t22;
    	let div10;
    	let div9;
    	let t23;
    	let t24;
    	let span5;

    	const block = {
    		c: function create() {
    			div12 = element("div");
    			p = element("p");
    			span0 = element("span");
    			span0.textContent = "Esi ";
    			t1 = text("is currently under development,\r\n          ");
    			span1 = element("span");
    			span1.textContent = "starting";
    			t3 = text(" September 1, 2022");
    			t4 = space();
    			div11 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t5 = text(/*inputDay*/ ctx[1]);
    			t6 = space();
    			span2 = element("span");
    			span2.textContent = "days";
    			t8 = space();
    			div2 = element("div");
    			div2.textContent = ":";
    			t10 = space();
    			div4 = element("div");
    			div3 = element("div");
    			t11 = text(/*inputHour*/ ctx[2]);
    			t12 = space();
    			span3 = element("span");
    			span3.textContent = "hours";
    			t14 = space();
    			div5 = element("div");
    			div5.textContent = ":";
    			t16 = space();
    			div7 = element("div");
    			div6 = element("div");
    			t17 = text(/*inputMin*/ ctx[3]);
    			t18 = space();
    			span4 = element("span");
    			span4.textContent = "minutes";
    			t20 = space();
    			div8 = element("div");
    			div8.textContent = ":";
    			t22 = space();
    			div10 = element("div");
    			div9 = element("div");
    			t23 = text(/*inputSec*/ ctx[4]);
    			t24 = space();
    			span5 = element("span");
    			span5.textContent = "seconds";
    			attr_dev(span0, "class", "green svelte-kjucxg");
    			add_location(span0, file$1, 45, 10, 1533);
    			attr_dev(span1, "class", "green svelte-kjucxg");
    			add_location(span1, file$1, 46, 10, 1607);
    			attr_dev(p, "class", "svelte-kjucxg");
    			add_location(p, file$1, 44, 8, 1518);
    			attr_dev(div0, "class", "value svelte-kjucxg");
    			add_location(div0, file$1, 51, 12, 1773);
    			attr_dev(span2, "class", "svelte-kjucxg");
    			add_location(span2, file$1, 52, 12, 1822);
    			attr_dev(div1, "class", "countdown__item svelte-kjucxg");
    			add_location(div1, file$1, 50, 10, 1730);
    			attr_dev(div2, "class", "dots svelte-kjucxg");
    			add_location(div2, file$1, 54, 10, 1869);
    			attr_dev(div3, "class", "value svelte-kjucxg");
    			add_location(div3, file$1, 56, 12, 1949);
    			attr_dev(span3, "class", "svelte-kjucxg");
    			add_location(span3, file$1, 57, 12, 1999);
    			attr_dev(div4, "class", "countdown__item svelte-kjucxg");
    			add_location(div4, file$1, 55, 10, 1906);
    			attr_dev(div5, "class", "dots svelte-kjucxg");
    			add_location(div5, file$1, 59, 10, 2047);
    			attr_dev(div6, "class", "value svelte-kjucxg");
    			add_location(div6, file$1, 61, 12, 2127);
    			attr_dev(span4, "class", "svelte-kjucxg");
    			add_location(span4, file$1, 62, 12, 2176);
    			attr_dev(div7, "class", "countdown__item svelte-kjucxg");
    			add_location(div7, file$1, 60, 10, 2084);
    			attr_dev(div8, "class", "dots svelte-kjucxg");
    			add_location(div8, file$1, 64, 10, 2226);
    			attr_dev(div9, "class", "value svelte-kjucxg");
    			add_location(div9, file$1, 66, 12, 2306);
    			attr_dev(span5, "class", "svelte-kjucxg");
    			add_location(span5, file$1, 67, 12, 2355);
    			attr_dev(div10, "class", "countdown__item svelte-kjucxg");
    			add_location(div10, file$1, 65, 10, 2263);
    			attr_dev(div11, "class", "countdown__wrapper svelte-kjucxg");
    			add_location(div11, file$1, 49, 8, 1686);
    			attr_dev(div12, "class", "under__development svelte-kjucxg");
    			add_location(div12, file$1, 43, 6, 1476);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div12, anchor);
    			append_dev(div12, p);
    			append_dev(p, span0);
    			append_dev(p, t1);
    			append_dev(p, span1);
    			append_dev(p, t3);
    			append_dev(div12, t4);
    			append_dev(div12, div11);
    			append_dev(div11, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t5);
    			append_dev(div1, t6);
    			append_dev(div1, span2);
    			append_dev(div11, t8);
    			append_dev(div11, div2);
    			append_dev(div11, t10);
    			append_dev(div11, div4);
    			append_dev(div4, div3);
    			append_dev(div3, t11);
    			append_dev(div4, t12);
    			append_dev(div4, span3);
    			append_dev(div11, t14);
    			append_dev(div11, div5);
    			append_dev(div11, t16);
    			append_dev(div11, div7);
    			append_dev(div7, div6);
    			append_dev(div6, t17);
    			append_dev(div7, t18);
    			append_dev(div7, span4);
    			append_dev(div11, t20);
    			append_dev(div11, div8);
    			append_dev(div11, t22);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, t23);
    			append_dev(div10, t24);
    			append_dev(div10, span5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputDay*/ 2) set_data_dev(t5, /*inputDay*/ ctx[1]);
    			if (dirty & /*inputHour*/ 4) set_data_dev(t11, /*inputHour*/ ctx[2]);
    			if (dirty & /*inputMin*/ 8) set_data_dev(t17, /*inputMin*/ ctx[3]);
    			if (dirty & /*inputSec*/ 16) set_data_dev(t23, /*inputSec*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div12);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(43:4) {#if counterVisibility}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div6;
    	let div1;
    	let div0;
    	let t1;
    	let div5;
    	let div3;
    	let t2;
    	let span0;
    	let t4;
    	let div2;
    	let t5;
    	let span1;
    	let t7;
    	let t8;
    	let button;
    	let span2;
    	let t10;
    	let button_right_ico;
    	let t11;
    	let p;
    	let t13;
    	let div4;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let a2;
    	let img2;
    	let img2_src_value;
    	let current;
    	let if_block = /*counterVisibility*/ ctx[0] && create_if_block$1(ctx);

    	button_right_ico = new Button_right_ico({
    			props: { className: "white" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "You are now a Green Saver!";
    			t1 = space();
    			div5 = element("div");
    			div3 = element("div");
    			t2 = text("You have opened your account ");
    			span0 = element("span");
    			span0.textContent = "and added a payment/ withdraw source!";
    			t4 = space();
    			div2 = element("div");
    			t5 = text("Welcome to ESi ");
    			span1 = element("span");
    			span1.textContent = "green saver!";
    			t7 = space();
    			if (if_block) if_block.c();
    			t8 = space();
    			button = element("button");
    			span2 = element("span");
    			span2.textContent = "Log In";
    			t10 = space();
    			create_component(button_right_ico.$$.fragment);
    			t11 = space();
    			p = element("p");
    			p.textContent = "Share with your friends";
    			t13 = space();
    			div4 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			a1 = element("a");
    			img1 = element("img");
    			a2 = element("a");
    			img2 = element("img");
    			add_location(div0, file$1, 32, 31, 1100);
    			attr_dev(div1, "class", "success__top-sv svelte-kjucxg");
    			add_location(div1, file$1, 32, 2, 1071);
    			attr_dev(span0, "class", "green svelte-kjucxg");
    			add_location(span0, file$1, 35, 35, 1238);
    			attr_dev(span1, "class", "green svelte-kjucxg");
    			add_location(span1, file$1, 39, 23, 1374);
    			attr_dev(div2, "class", "like_h2 svelte-kjucxg");
    			add_location(div2, file$1, 38, 6, 1328);
    			attr_dev(div3, "class", "like_h2 svelte-kjucxg");
    			add_location(div3, file$1, 34, 4, 1180);
    			attr_dev(span2, "class", "svelte-kjucxg");
    			add_location(span2, file$1, 74, 6, 2508);
    			attr_dev(button, "class", "btn-sv login svelte-kjucxg");
    			button.disabled = /*counterVisibility*/ ctx[0];
    			add_location(button, file$1, 73, 4, 2442);
    			attr_dev(p, "class", "success__content svelte-kjucxg");
    			add_location(p, file$1, 76, 4, 2589);
    			if (!src_url_equal(img0.src, img0_src_value = "https://uploads-ssl.webflow.com/627ca4b5fcfd5674acf264e6/628b8ff16ae2f89abf979078_Facebook%20-%20Negative.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "loading", "lazy");
    			attr_dev(img0, "alt", "");
    			add_location(img0, file$1, 79, 9, 2745);
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "class", "success__icon w-inline-block svelte-kjucxg");
    			add_location(a0, file$1, 78, 6, 2686);
    			if (!src_url_equal(img1.src, img1_src_value = "https://uploads-ssl.webflow.com/627ca4b5fcfd5674acf264e6/628b9087dc3e1e5c47d96b35_entypo-social_linkedin-with-circle.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "loading", "lazy");
    			attr_dev(img1, "alt", "");
    			add_location(img1, file$1, 85, 9, 3003);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "success__icon w-inline-block svelte-kjucxg");
    			add_location(a1, file$1, 84, 7, 2944);
    			if (!src_url_equal(img2.src, img2_src_value = "https://uploads-ssl.webflow.com/627ca4b5fcfd5674acf264e6/628b9097061243a2b52c214a_ant-design_twitter-circle-filled.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "loading", "lazy");
    			attr_dev(img2, "alt", "");
    			add_location(img2, file$1, 91, 9, 3272);
    			attr_dev(a2, "href", "#");
    			attr_dev(a2, "class", "success__icon w-inline-block svelte-kjucxg");
    			add_location(a2, file$1, 90, 7, 3213);
    			attr_dev(div4, "class", "success__icons svelte-kjucxg");
    			add_location(div4, file$1, 77, 4, 2650);
    			attr_dev(div5, "class", "success__body svelte-kjucxg");
    			add_location(div5, file$1, 33, 2, 1147);
    			attr_dev(div6, "class", "success__message svelte-kjucxg");
    			add_location(div6, file$1, 31, 0, 1037);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div1);
    			append_dev(div1, div0);
    			append_dev(div6, t1);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div3, t2);
    			append_dev(div3, span0);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, t5);
    			append_dev(div2, span1);
    			append_dev(div5, t7);
    			if (if_block) if_block.m(div5, null);
    			append_dev(div5, t8);
    			append_dev(div5, button);
    			append_dev(button, span2);
    			append_dev(button, t10);
    			mount_component(button_right_ico, button, null);
    			append_dev(div5, t11);
    			append_dev(div5, p);
    			append_dev(div5, t13);
    			append_dev(div5, div4);
    			append_dev(div4, a0);
    			append_dev(a0, img0);
    			append_dev(div4, a1);
    			append_dev(a1, img1);
    			append_dev(div4, a2);
    			append_dev(a2, img2);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*counterVisibility*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div5, t8);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*counterVisibility*/ 1) {
    				prop_dev(button, "disabled", /*counterVisibility*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button_right_ico.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button_right_ico.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if (if_block) if_block.d();
    			destroy_component(button_right_ico);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SuccessMessage', slots, []);
    	let inputDay, inputHour, inputMin, inputSec;
    	let counterVisibility = true;
    	let sumOfDateNumbers;

    	function countdown() {
    		const timeSpan = new Date("September 1,2022 00:00:00").getTime() - new Date().getTime();

    		// 1day = 86400000 milisec, 1hour = 3600000 milisec, 1minute = 60000 milisec
    		$$invalidate(1, inputDay = Math.floor(timeSpan / 86400000));

    		$$invalidate(2, inputHour = Math.floor(timeSpan % 86400000 / 3600000));
    		$$invalidate(3, inputMin = Math.floor(timeSpan % 3600000 / 60000));
    		$$invalidate(4, inputSec = Math.floor(timeSpan % 60000 / 1000));
    	}

    	let setTimeItnerval = setInterval(countdown, 1000);

    	afterUpdate(() => {
    		$$invalidate(5, sumOfDateNumbers = inputDay + inputHour + inputMin + inputSec);

    		if (sumOfDateNumbers <= 0) {
    			$$invalidate(0, counterVisibility = false);
    			clearInterval(setTimeItnerval);
    		}
    	});

    	onMount(countdown);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SuccessMessage> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		onMount,
    		Button_right_ico,
    		inputDay,
    		inputHour,
    		inputMin,
    		inputSec,
    		counterVisibility,
    		sumOfDateNumbers,
    		countdown,
    		setTimeItnerval
    	});

    	$$self.$inject_state = $$props => {
    		if ('inputDay' in $$props) $$invalidate(1, inputDay = $$props.inputDay);
    		if ('inputHour' in $$props) $$invalidate(2, inputHour = $$props.inputHour);
    		if ('inputMin' in $$props) $$invalidate(3, inputMin = $$props.inputMin);
    		if ('inputSec' in $$props) $$invalidate(4, inputSec = $$props.inputSec);
    		if ('counterVisibility' in $$props) $$invalidate(0, counterVisibility = $$props.counterVisibility);
    		if ('sumOfDateNumbers' in $$props) $$invalidate(5, sumOfDateNumbers = $$props.sumOfDateNumbers);
    		if ('setTimeItnerval' in $$props) setTimeItnerval = $$props.setTimeItnerval;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*sumOfDateNumbers, counterVisibility*/ 33) ;
    	};

    	return [counterVisibility, inputDay, inputHour, inputMin, inputSec, sumOfDateNumbers];
    }

    class SuccessMessage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SuccessMessage",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.48.0 */
    const file = "src\\App.svelte";

    // (64:44) 
    function create_if_block_7(ctx) {
    	let successmessage;
    	let current;
    	successmessage = new SuccessMessage({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(successmessage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(successmessage, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(successmessage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(successmessage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(successmessage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(64:44) ",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#if $successMessageState === false}
    function create_if_block_1(ctx) {
    	let div1;
    	let headsteps;
    	let t;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	headsteps = new HeadSteps({ $$inline: true });

    	const if_block_creators = [
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4,
    		create_if_block_5,
    		create_if_block_6
    	];

    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*stepCountValue*/ ctx[1] === 1) return 0;
    		if (/*stepCountValue*/ ctx[1] === 2) return 1;
    		if (/*stepCountValue*/ ctx[1] === 3) return 2;
    		if (/*stepCountValue*/ ctx[1] === 4) return 3;
    		if (/*stepCountValue*/ ctx[1] === 5) return 4;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(headsteps.$$.fragment);
    			t = space();
    			div0 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "step__content svelte-1x2f77x");
    			add_location(div0, file, 39, 8, 1297);
    			attr_dev(div1, "class", "wrapper");
    			add_location(div1, file, 37, 6, 1243);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(headsteps, div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headsteps.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headsteps.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(headsteps);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(37:4) {#if $successMessageState === false}",
    		ctx
    	});

    	return block;
    }

    // (57:41) 
    function create_if_block_6(ctx) {
    	let div;
    	let billing;
    	let div_intro;
    	let current;
    	billing = new Billing({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(billing.$$.fragment);
    			attr_dev(div, "class", "component__wrapper svelte-1x2f77x");
    			add_location(div, file, 57, 12, 2030);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(billing, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(billing.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 500 });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(billing.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(billing);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(57:41) ",
    		ctx
    	});

    	return block;
    }

    // (53:41) 
    function create_if_block_5(ctx) {
    	let div;
    	let information;
    	let div_intro;
    	let current;
    	information = new Information({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(information.$$.fragment);
    			attr_dev(div, "class", "component__wrapper svelte-1x2f77x");
    			add_location(div, file, 53, 12, 1868);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(information, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(information.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 500 });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(information.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(information);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(53:41) ",
    		ctx
    	});

    	return block;
    }

    // (49:41) 
    function create_if_block_4(ctx) {
    	let div;
    	let legal;
    	let div_intro;
    	let current;
    	legal = new Legal({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(legal.$$.fragment);
    			attr_dev(div, "class", "component__wrapper svelte-1x2f77x");
    			add_location(div, file, 49, 12, 1706);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(legal, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(legal.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 500 });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(legal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(legal);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(49:41) ",
    		ctx
    	});

    	return block;
    }

    // (45:41) 
    function create_if_block_3(ctx) {
    	let div;
    	let plan;
    	let div_intro;
    	let current;
    	plan = new Plan({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(plan.$$.fragment);
    			attr_dev(div, "class", "component__wrapper svelte-1x2f77x");
    			add_location(div, file, 45, 12, 1545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(plan, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(plan.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 500 });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(plan.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(plan);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(45:41) ",
    		ctx
    	});

    	return block;
    }

    // (41:10) {#if stepCountValue === 1}
    function create_if_block_2(ctx) {
    	let div;
    	let contribution;
    	let div_intro;
    	let current;
    	contribution = new Contribution({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(contribution.$$.fragment);
    			attr_dev(div, "class", "component__wrapper svelte-1x2f77x");
    			add_location(div, file, 41, 12, 1376);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(contribution, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contribution.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 500 });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contribution.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(contribution);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(41:10) {#if stepCountValue === 1}",
    		ctx
    	});

    	return block;
    }

    // (69:0) {#if $confirmPopUpState === true}
    function create_if_block(ctx) {
    	let finalreview;
    	let current;
    	finalreview = new FinalReview({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(finalreview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(finalreview, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(finalreview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(finalreview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(finalreview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(69:0) {#if $confirmPopUpState === true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div;
    	let current_block_type_index;
    	let if_block0;
    	let t;
    	let if_block1_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_if_block_7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$successMessageState*/ ctx[3] === false) return 0;
    		if (/*$successMessageState*/ ctx[3] === true) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	let if_block1 = /*$confirmPopUpState*/ ctx[0] === true && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(div, "class", "container__form svelte-1x2f77x");
    			add_location(div, file, 35, 2, 1164);
    			set_style(main, "height", /*mainHeight*/ ctx[2]);
    			attr_dev(main, "class", "svelte-1x2f77x");
    			add_location(main, file, 34, 0, 1125);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block0) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block0 = if_blocks[current_block_type_index];

    					if (!if_block0) {
    						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block0.c();
    					} else {
    						if_block0.p(ctx, dirty);
    					}

    					transition_in(if_block0, 1);
    					if_block0.m(div, null);
    				} else {
    					if_block0 = null;
    				}
    			}

    			if (!current || dirty & /*mainHeight*/ 4) {
    				set_style(main, "height", /*mainHeight*/ ctx[2]);
    			}

    			if (/*$confirmPopUpState*/ ctx[0] === true) {
    				if (if_block1) {
    					if (dirty & /*$confirmPopUpState*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $popUpHeight;
    	let $confirmPopUpState;
    	let $successMessageState;
    	validate_store(popUpHeight, 'popUpHeight');
    	component_subscribe($$self, popUpHeight, $$value => $$invalidate(4, $popUpHeight = $$value));
    	validate_store(confirmPopUpState, 'confirmPopUpState');
    	component_subscribe($$self, confirmPopUpState, $$value => $$invalidate(0, $confirmPopUpState = $$value));
    	validate_store(successMessageState, 'successMessageState');
    	component_subscribe($$self, successMessageState, $$value => $$invalidate(3, $successMessageState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let stepCountValue;
    	let mainHeight = "auto";

    	const unsubscribe = stepCounter.subscribe(value => {
    		$$invalidate(1, stepCountValue = value);
    	});

    	onDestroy(unsubscribe);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Contribution,
    		afterUpdate,
    		onDestroy,
    		HeadSteps,
    		Plan,
    		FinalReview,
    		stepCounter,
    		successMessageState,
    		popUpHeight,
    		headSteps,
    		Legal,
    		Information,
    		Billing,
    		confirmPopUpState,
    		SuccessMessage,
    		fade,
    		stepCountValue,
    		mainHeight,
    		unsubscribe,
    		$popUpHeight,
    		$confirmPopUpState,
    		$successMessageState
    	});

    	$$self.$inject_state = $$props => {
    		if ('stepCountValue' in $$props) $$invalidate(1, stepCountValue = $$props.stepCountValue);
    		if ('mainHeight' in $$props) $$invalidate(2, mainHeight = $$props.mainHeight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$confirmPopUpState, $popUpHeight*/ 17) {
    			{
    				if ($confirmPopUpState === true) {
    					$$invalidate(2, mainHeight = $popUpHeight + "px");
    				} else {
    					$$invalidate(2, mainHeight = "auto");
    				}
    			}
    		}
    	};

    	return [
    		$confirmPopUpState,
    		stepCountValue,
    		mainHeight,
    		$successMessageState,
    		$popUpHeight
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.querySelector('#app'),

    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
