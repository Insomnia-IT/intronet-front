export function debounce(func: Function, wait: number, immediate= false) {
    var timeout, previous, args, result, context;

    var later = function () {
        var passed = +new Date() - previous;
        if (wait > passed) {
            timeout = setTimeout(later, wait - passed);
        } else {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
            // This check is needed because `func` can recursively invoke `debounced`.
            if (!timeout) args = context = null;
        }
    };

    var debounced = function (..._args) {
        context = this;
        args = _args;
        previous = +new Date();
        if (!timeout) {
            timeout = setTimeout(later, wait);
            if (immediate) result = func.apply(context, args);
        }
        return result;
    } as Function & { cancel?(); }

    debounced.cancel = function () {
        clearTimeout(timeout);
        timeout = args = context = null;
    };

    return debounced;
}

export function debounced(wait: number, immediate = false): MethodDecorator {
    return (target, key, descr) => {
        const fn = descr.value as any;
        return {
            value: debounce(fn, wait, immediate) as any
        }
    }
}