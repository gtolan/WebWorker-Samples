
var networking = {

          fetchWebworker:function(url, filter){
            if(window.Worker){
                console.log('init fetch WebWorker')
                var myWorker = new Worker('/fetch_webworker.js');
                myWorker.onerror = function(){
                        networking.XMLWebWorker(url,filter);
                }

                var action = {action: "fetch",
                              url: url,
                              filter: filter || ''
                              };

                myWorker.postMessage(action);
                myWorker.addEventListener('message', function(e) {

                    var webworkerResult = e.data.result;
                    if(webworkerResult === "fail"){
                      console.log('fetch WW fail')
                            return networking.XMLWebWorker(url,filter);
                    }else if(webworkerResult === "success"){
                            //do stuff with result
                            var fetchedData = e.data.reqData;
                            return networking.loadDataSuccess(fetchedData, "webworker")
                    }
                 })

              }else {
                return networking.XMLWebWorker(url,filter);
              }
          },


      		XMLWebWorker:function(url, filter){
      			if(window.Worker){
                console.log('init WebWorker')
      					var myWorker = new Worker('/xml_webworker.js');
      					myWorker.onerror = function(){
      						      networking.mainThreadXML(url,filter);
      					}

      					var action = {action: "any-action-name",
      												url: url,
                              filter: filter
      												};

      					myWorker.postMessage(action);
      					myWorker.addEventListener('message', function(e) {

      							var webworkerResult = e.data.result;
      							if(webworkerResult === "fail"){
      											return networking.mainThreadXML(url,filter);
      							}else if(webworkerResult === "success"){
      											//do stuff with result
      											var fetchedData = e.data.reqData;
      											return networking.loadDataSuccess(fetchedData, "webworker")
      							}
      					 })

      				}else {
      					return networking.mainThreadXML(url,filter);
      				}
      		},

      		mainThreadXML: function(url, filter){
      			var xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            var requrl = url + filter;
      			xhttp.open("GET", requrl, true);
      			xhttp.onload = function () {
      				  var result = this.responseText;
      					if (xhttp.readyState === xhttp.DONE) {

      							        if (xhttp.status === 200) {
      											              return networking.loadDataSuccess(result, "main-thread-xml")
      											}

      										  if (xhttp.status === 400) {
                                          return networking.loadDataFail(result, "main-thread-xml")
      										  }
      					}
      			}
      			xhttp.send();
      		},

          loadDataSuccess:function(result, service){
              var resDiv = document.getElementById('fetch_result');
              resDiv.innerHTML = "Success! We recieved this text:" + result + "from " + service;
          },

          loadDataFail:function(result, service){
              var resDiv = document.getElementById('fetch_result');
              resDiv.innerHTML = "Error: We recieved this text:" + result + "from " + service;
          }

      }
      var url = 'https://jsonplaceholder.typicode.com/todos/1'
      networking.fetchWebworker(url)
