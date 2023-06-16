link = window.location.href;
page_title = document.title;
//alert(link)


// Recieve request from extension and give back link of current page

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.command === "recommend")
        sendResponse({result: link, title: page_title});
        // alert("From console: " + link);
    }
  );
