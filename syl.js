function convert() {
    syllable(document.getElementById("input").value);
}

function syllable(input) {

    let input2 = input.split(/([^a-zA-Z'’])/g);
    input2.pop();

    for (let i = 0; i < input2.length; i++) {
        if (!(/[a-z]/ig.test(input2[i]))) continue;
        let flapt = /[aiueo](tt|t|dd|d)[aiueol]/ig
        while (flapt.test(input2[i])) {
            let res = input2[i].match(flapt)[0],
                res2 = res,
                res3 = res2.match(/tt|t|dd|d/)[0];
            res2 = res2.replace(res3, `<span class="flapt">${res3}</span>`);
            input2[i] = input2[i].replace(res, res2);
        }
        let reduction = /[bcfghjlmnpqrsvwxyz](t|k|d)[bcfghjlmnpqrsvwxyz]]/ig
        while (reduction.test(input2[i])) {
            let res = input2[i].match(reduction)[0],
                res2 = res,
                res3 = res2.match(/t|k|d/)[0];
            res2 = res2.replace(res3, `<span class="reduction">${res3}</span>`);
            input2[i] = input2[i].replace(res, res2);
        }
    }


    for (let i = 0; i < input2.length; i++) {
        if (!(/[a-z]/ig.test(input2[i]))) continue;
        for (let j = i + 1; j < input2.length; j++) {
            if (input2[j] === ' ') continue;

            let silente = '';

            if (input2[i].length >= 3) {
                let last3 = input2[i].slice(-3);
                if (/[aiueoy][bcdfghjklmnpqrstvwxyz]e/ig.test(last3)) {
                    silente = "(e)";
                    input2[i] = input2[i].slice(0, -1);
                }
            }

            let last1 = input2[i].slice(-1);
            if (/[tdsz]/ig.test(last1) && input2[j][0] === 'y') input2[i + 1] = '〜';
            else if (/[bcdfghjklmnpqrstvwxyz]/ig.test(last1) && /[aiueo]/ig.test(input2[j][0])) input2[i + 1] = '⌒';

            if (input2[i].length >= 2 && input2[i + 1] !== '〜') {
                let last2 = input2[i].slice(-2);
                if (/[aiueo](t|d)/ig.test(last2) && /[aiueol]/ig.test(input2[j][0])) {
                    input2[i] = input2[i].slice(0, -1) + `<span class="flapt">${last2[1]}</span>`;
                }
                else if (/[bcfghjlmnpqrsvwxyz](t|k|d)/ig.test(last2) && /[bcfghjlmnpqrsvwxyz]/ig.test(input2[j][0])) {
                    input2[i] = input2[i].slice(0, -1) + `<span class="reduction">${last2[1]}</span>`;
                }
                else if (/[dbgtpk]/ig.test(last2[1]) && /[bcdfghjklmnpqrstvwxyz]/ig.test(input2[j][0])) {
                    input2[i] = input2[i].slice(0, -1) + `<span class="reduction">${last2[1]}</span>`;
                }
                else if (/[bcdfghjklmnpqrstvwxyz]/ig.test(last2[1]) && last2[1] === input2[j][0]) {
                    input2[i] = input2[i].slice(0, -1) + `<span class="reduction">${last2[1]}</span>`;
                }
            }

            input2[i] = input2[i] + silente;
            break;
        }
    }

    let out = input2.join('');
    document.getElementById('text').innerHTML = out;
}