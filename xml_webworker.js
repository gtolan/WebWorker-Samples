
self.addEventListener('message', function(event){
    if(event.data.action === "any-action-name"){
              console.log('Hello from WebWorker')
        var url = event.data.url;
        var filter = event.data.filter;
        var requrl = url + filter;
        var xhr = new XMLHttpRequest();
              console.log('start xml webworker')
        xhr.open('GET', requrl , true);
        xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4 && xhr.status == 200){
                                console.log('got xml response -webworker')
                           var text = xhr.responseText;
                           postMessage({result:"success",reqData: text, url:requrl})
                           self.close()
                    }else if(xhr.readyState == 4 && xhr.status == 400){
                                console.log('webwoker xml fail', requrl)
                           var text = xhr.responseText;
                           postMessage({result:"fail", reqData: text, url:requrl})
                           self.close()
                    }
        };
        xhr.send();

    } else if (event.data.action === "some-other-action") {

        //some other Request..
     console.log('some-other-action')

    }

})
