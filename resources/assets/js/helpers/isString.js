export default function isString(o) {
    return Object.prototype.toString.call(o) === '[object String]';
}
