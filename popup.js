document.getElementById('submitButton').addEventListener('click', function() {
    var wordStr = document.getElementById('words').value;
    var url = document.getElementById('url').value;
    var words = wordStr.split('\n');
    chrome.cookies.getAll({url: url}, function(cookies) {
      if (cookies.length === 0) {
        alert('请登录');
      } else {
        for(let word of words){
            var targetUrl =`https://dict.youdao.com/wordbook/webapi/v2/ajax/add?word=${word}&lan=en`
            var cookieString = '';
            for (var i = 0; i < cookies.length; i++) {
              cookieString += cookies[i].name + '=' + cookies[i].value + '; ';
            }
            fetch(targetUrl, {
            credentials: 'include'
          }); 
          fetch(targetUrl, {
  method: 'GET',
  credentials: 'include',
  headers: {
  'Cookie':cookieString,
  },
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => {
    alert(error);
    console.error('Error:', error)});
      }}
    });
  });
  
  document.getElementById('clearButton').addEventListener('click', function() {
    document.getElementById('words').value = '';
  });