class Utils {
    static number2DateString(num = Date.now()) {
        const date = new Date(parseInt(num));

        return [date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        ].join(':') + ' - ' + [date.getDate(),
            date.getMonth() + 1,
            date.getFullYear()
        ].join('/');
    }

    static wait(ms) {
        return new Promise(function(resolve, reject){
            setTimeout(resolve, ms);
        });
    }

    static objectMap (obj, fn) {
        return Object.fromEntries(
                Object.entries(obj).map(
                    ([k, v], i) => [k, fn(v, k, i)]
                )
            )
    }
}

module.exports = Utils;
