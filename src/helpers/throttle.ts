export function throttle(func: Function, wait: number, options = {leading: false, trailing: true}) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    var later = function () {
        previous = options.leading === false ? 0 : +new Date();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function () {
        var now = +new Date();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}

export function throttled(wait: number, options = {leading: false, trailing: true}): MethodDecorator {
    return (target, key, descr) => {
        const fn = descr.value;
        return {
            value: throttle(fn as any, wait, options) as any
        }
    }
}