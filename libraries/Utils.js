export function randint(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function extractTransforms(element) {
    return element.style.transform.split(' ').map(tf => {
        let match = tf.match(/(.*?)\((.*?)\)/);
        if (match === null) return { type: tf, value: null };
        let [, type, value] = match;
        return { type, value };
    }).reduce((transforms, tf) => { transforms[tf.type] = tf.value; return transforms; }, {});
}