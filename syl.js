let list = {};
let xhr = new XMLHttpRequest();
xhr.open('GET', 'cmudict-0.7b.txt');
xhr.onload = function () {
    let res = xhr.responseText.split('\n');
    for (let i = 0; i < res.length; i++) {
        if (res[i].length <= 2) continue;
        if (res[i][0] !== ';' && res[i][1] !== ';') {
            let split = res[i].split('  ');
            list[split[0]] = split[1];
        }
    }
}
xhr.send();

let split_str = ' / ';

function convert() {
    let input = document.getElementById("input").value,
        split = input.split(/([^a-zA-Z'’])/g),
        cmu = [],
        long_v = ['AA', 'AA1', 'AA2', 'AE', 'AE1', 'AE2', 'AW', 'AW0', 'AW1', 'AW2', 'AY', 'AY0', 'AY1', 'AY2', 'ER', 'ER0', 'ER1', 'ER2', 'EY', 'EY0', 'EY1', 'EY2', 'IY', 'IY1', 'IY2', 'OW', 'OW0', 'OW1', 'OW2', 'OY', 'OY0', 'OY1', 'OY2', 'UW', 'UW0', 'UW1', 'UW2'],
        short_v = ['AA0', 'AE0', 'AH', 'AH0', 'AH1', 'AH2', 'AO', 'AO0', 'AO1', 'AO2', 'EH', 'EH0', 'EH1', 'EH2', 'IH', 'IH0', 'IH1', 'IH2', 'IY0', 'UH', 'UH0', 'UH1', 'UH2',],
        vow = long_v.concat(short_v),
        con = ['B', 'CH', 'D', 'DH', 'F', 'G', 'HH', 'JH', 'K', 'L', 'M', 'N', 'NG', 'P', 'R', 'S', 'SH', 'T', 'TH', 'V', 'W', 'Y', 'Z', 'ZH'];
    split = split.filter(e => e !== '');
    vow.sort(function (a, b) { return b.length - a.length; });
    let reg_vow = RegExp('(' + vow.join('|') + ')', 'g');
    for (let i = 0; i < split.length; i++) {
        let upper = split[i].toUpperCase();
        if (upper in list) cmu.push(syllable(upper));
        else {
            let push = '';
            if (upper.length >= 3) {
                let last2 = upper.slice(-2),
                    upper2 = upper.slice(0, -2);
                if (upper2 in list) {
                    if (last2 === 'LY') cmu.push(syllable(upper2) + split_str + 'L IY0');
                    else if (last2 === '’S') push = syllable(upper2) + ' Z';
                    else if (last2 === "'S") push = syllable(upper2) + ' Z';
                }
            }
            if (push === '') {
                push = upper.split(/(?<=[AIUEO])/g);
                for (let j = 0; j < push.length; j++) push[j] = push[j].split('').join(' ');
                push = push.join(split_str);
            }
            cmu.push(push);
        }
    }
    for (let i = 0; i < cmu.length; i++) {
        let counter = 0,
            syl = cmu[i].split(split_str);
        for (let j = 0; j < syl.length; j++) {
            let plus = syl[j].split(' ');
            if (j > 0) {
                let flag = true;
                for (let k = counter; k < split[i].length; k++) {
                    if (syl[j][0] === split[i][k].toUpperCase()) {
                        split[i] = split[i].slice(0, k) + split_str + split[i].slice(k);
                        counter = k + split_str.length;
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    for (let k = counter - 1; k < split[i].length - 1; k++) {
                        if (/[aiueo]/.test(split[i][k])) {
                            split[i] = split[i].slice(0, k + 1) + split_str + split[i].slice(k + 1);
                            counter = k + split_str.length;
                            break;
                        }
                    }
                }
            }
            counter += plus.length;
        }
        // silent E
        let last3 = split[i].slice(-3);
        if (split[i].includes(' / e /') || last3 === ' / e') {
            split[i] = split[i].replaceAll(' / e', 'e');
            cmu[i] = cmu[i].replaceAll(' / ER', ' ER');
        }
    }
    console.log(split);
    console.log(cmu);
    document.getElementById('text').innerHTML = split.join('　') + '<br><br><br>' + cmu.join('　').replace(/[0-9]/g, '').toLowerCase();


    function syllable(upper) {
        let word = list[upper].split(reg_vow);
        word = word.filter(e => e !== '');
        word = word.filter(e => e !== ' ');
        for (let j = 0; j < word.length - 1; j++) {
            let syl = word[j];
            if (vow.includes(syl)) {
                if (vow.includes(word[j + 1])) {
                    if (long_v.includes(word[j])) word.splice(j + 1, 0, split_str);
                    else word[j] = word[j] + ' ';
                }
            }
            else if (j > 0 && /[A-Z]/.test(syl)) {
                let phon = syl.split(' ');
                phon = phon.filter(e => e !== '');
                if (phon.length === 1) {
                    /*if (short_v.includes(word[j - 1])) phon.push(split_str);
                    else if (long_v.includes(word[j - 1])) phon.unshift(split_str);*/
                    phon.unshift(split_str); // original rule
                }
                else if (phon.length === 2) phon.splice(1, 0, split_str);
                else phon.splice(1, 0, split_str);
                word[j] = phon.join('');
                if (word[j][0] !== ' ') word[j] = ' ' + word[j];
                if (word[j][word[j].length - 1] !== ' ') word[j] = word[j] + ' ';
            }
        }
        return word.join('');
    }
}