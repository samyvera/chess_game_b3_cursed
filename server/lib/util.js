module.exports = {
    validNick: nickname => /^\w*$/.exec(nickname) !== null,
    validKeys: keys => {
        if (keys.left && keys.right) {
            keys.left = false;
            keys.right = false;
        }
        if (keys.up && keys.down) {
            keys.down = false;
            keys.up = false;
        }
        return keys;
    },
    findIndex: (arr, id) => {
        var len = arr.length;
        while (len--)
            if (arr[len].id === id) return len;
        return -1;
    },
    is: (value, array) => {
        var result = false;
        array.forEach(element => result = value === element ? true : result);
        return result;
    }
};