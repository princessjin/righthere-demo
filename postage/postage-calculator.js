function $(expr, con) {
  return typeof expr === 'string' ?
    (con || document).querySelector(expr) : expr
}

function $$(expr, con) {
  return Array.prototype.slice.call(
    (con || document).querySelectorAll(expr)
  );
}

function xhr(o) {
  var xhr = new XMLHttpRequest();
  var method = o.method;
  xhr.open(method, o.url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      o.callback(xhr);
    }
  };
  xhr.send();
}

(function() {
  var g_data, g_code, g_options;
  var g_item = window.location.search.substring(3);
  var g_json_file = g_item + ".json";

  var template = ' \
        <form onsubmit="return onSubmitPostageCode();"> \
            <label> \
                Post Code \
                <input type="text" pattern="[0-9]+" /> \
                <input type="submit" value="submit" /> \
            </label> \
        </form> \
  \
        <div class="select"></div> \
  ';

  var selectTemplate = ' \
        <form> \
            <select class="select" onchange="onSelect(this);"> \
            {options} \
            </select> \
        </form> \
  \
        <div class="result"> \
        </div> \
  ';

  function _callback(xhr) {
    g_data = JSON.parse(xhr.response);
    $("#postage-calculator").innerHTML = template;
  }

  xhr({
    method: "GET",
    url: g_json_file,
    callback: _callback
  });

  function setCode(code) {
    var options = ['<option value="0">Please select suburb</option>'];
    g_code = code;
    g_options = g_data[code];
    if (!g_options) {
      return;
    }
    var keys = Object.keys(g_options);
    keys.sort();
    for (var i in keys) {
      var opt = '<option value="' + keys[i] + '">' + keys[i] + '</option>';
      options.push(opt);
    }
    var s = selectTemplate.replace('{options}', options);
    $("#postage-calculator .select").innerHTML = s;
  }

  window.onSubmitPostageCode = function() {
    var code = parseInt($("#postage-calculator input[type=text]").value);
    if (!isNaN(code)) {
      setCode(code);      
    }
    return false;
  };

  window.onSelect = function(select) {
    if (g_options[select.value]) {
      var postage = g_options[select.value];
      var s = "Postage for " + g_code + " " + select.value + ": " + postage;
      $("#postage-calculator .result").innerHTML = s;
    } else {
      $("#postage-calculator .result").innerHTML = "";
    }
  };
})();
