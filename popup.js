var submitBtn = document.getElementById('submitButton');
var clearBtn = document.getElementById('clearButton');
var msgEl = document.getElementById('msg');
var progressWrap = document.getElementById('progressWrap');
var progressFill = document.getElementById('progressFill');
var progressText = document.getElementById('progressText');
var modal = document.getElementById('confirmModal');
var confirmText = document.getElementById('confirmText');
var confirmYes = document.getElementById('confirmYes');
var confirmNo = document.getElementById('confirmNo');

var DEFAULT_URL = 'https://dict.youdao.com';

function setMsg(text, type) {
    msgEl.textContent = text;
    msgEl.className = type;
}

function showProgress(done, total) {
    var pct = Math.round((done / total) * 100);
    progressFill.style.width = pct + '%';
    progressText.textContent = pct + '%';
}

function hideProgress() {
    progressWrap.classList.remove('show');
    progressFill.style.width = '0%';
}

submitBtn.addEventListener('click', function() {
    var wordStr = document.getElementById('words').value;
    var words = wordStr.split('\n').filter(function(w) { return w.trim(); });

    if (words.length === 0) { setMsg('请输入单词', 'error'); return; }

    confirmText.textContent = '本次将收藏 ' + words.length + ' 个单词，请确认';
    modal.classList.add('show');

    confirmYes.onclick = function() {
        modal.classList.remove('show');
        doSubmit(words);
    };
    confirmNo.onclick = function() {
        modal.classList.remove('show');
    };
});

function doSubmit(words) {
    submitBtn.disabled = true;
    clearBtn.disabled = true;
    setMsg('', '');
    progressWrap.classList.add('show');
    showProgress(0, words.length);

    chrome.cookies.getAll({url: DEFAULT_URL}, function(cookies) {
        if (cookies.length === 0) {
            setMsg('请先登录有道词典', 'error');
            submitBtn.disabled = false;
            clearBtn.disabled = false;
            hideProgress();
            return;
        }

        var cookieString = cookies.map(function(c) { return c.name + '=' + c.value; }).join('; ');
        var done = 0;
        var total = words.length;
        var errors = [];

        words.forEach(function(word) {
            var targetUrl = 'https://dict.youdao.com/wordbook/webapi/v2/ajax/add?word=' + encodeURIComponent(word.trim()) + '&lan=en';
            fetch(targetUrl, {
                method: 'GET',
                headers: { 'Cookie': cookieString },
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.code !== 0) errors.push(word);
            })
            .catch(function() { errors.push(word); })
            .finally(function() {
                done++;
                showProgress(done, total);
                if (done === total) {
                    submitBtn.disabled = false;
                    clearBtn.disabled = false;

                    confirmText.textContent = errors.length === 0 ? '已完成' : '部分失败: ' + errors.join(', ');
                    confirmYes.textContent = '确定';
                    confirmNo.style.display = 'none';
                    modal.classList.add('show');

                    confirmYes.onclick = function() {
                        modal.classList.remove('show');
                        confirmNo.style.display = '';
                        hideProgress();
                        clearBtn.click();
                    };
                }
            });
        });
    });
}

clearBtn.addEventListener('click', function() {
    document.getElementById('words').value = '';
    setMsg('', '');
});