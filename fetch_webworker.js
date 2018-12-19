//Check for fetch and polyfil if not available
if (self.fetch || (self.importScripts("https://cdnjs.cloudflare.com/ajax/libs/native-promise-only/0.8.1/npo.js"), self.importScripts("https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.js")), !self.fetch) {
	fetch = function (e, t) {
		var s = new XMLHttpRequest,
			a = t.method || "GET";
		t.mode;
		return new Promise(function (t, o) {
			s.open(a, e, !0), s.onreadystatechange = function () {
				if (4 == s.readyState && 200 == s.status) {
					var e = s.responseText;
					return t(e)
				}
				if (4 == s.readyState && 400 == s.status) {
					e = s.responseText;
					return o(e)
				}
			}, s.send()
		})
	};
	var proxy = "https://cors-anywhere.herokuapp.com/",
		targetUrl = proxy + url;

	function fetch(e, t) {
		var s = new XMLHttpRequest;
		return "withCredentials" in s ? s.open(e, t, !0) : "undefined" != typeof XDomainRequest ? (s = new XDomainRequest).open(e, t) : s = null, s
	}
	var request = createCORSRequest("GET", targetUrl);
	request && (request.onload = function () {
		request.readyState === request.DONE && 200 === request.status && (request.onreadystatechange = function () {
			if (4 == request.readyState && 200 == request.status) {
				var e = request.responseText;
				shellPrep.FBdataSuccess(e, articles, tab)
			} else 4 == request.readyState && request.status
		})
	}, request.send())
}

//Start the fetch worker listener..

self.addEventListener("message", function (e) {
	if ("fetch" === e.data.action) {
        var options = {
                        method: "GET",
                        cache: "default",
                        headers: {
                          "Content-Type": "application/x-www-form-urlencoded"
                        },
                      },
      			url = e.data.url,
      			filter = e.data.filter,
      			requrl = url + filter;

              //console.log("fetch webworker..url", requrl);

              fetch(requrl, options).then(function (res) {
          			if (res.ok) return res.text();
          			if (400 === res.status && postMessage({
          					result: "fail",
          					requrl: requrl
          				}), !e.ok && 400 === res.status) {
          				console.log("response not ok..");
          				var t = res.text();
                  return t;
          			}
          			throw new Error("Network response was not ok.")
          		}).then(function (e) {
          			 postMessage({
          				result: "success",
          				reqData: e,
                  requrl: requrl
          			});
                close()
          		}).catch(function (e) {
          			postMessage({
          				result: "fail",
                  reqData: e,
                  requrl: requrl
          			})
          		})
	} else if ("another-fetch-request" === e.data.action) {

	}

});
