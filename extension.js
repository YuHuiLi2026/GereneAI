//var button = document.getElementById("analyze_page");
//button.onclick = recommend;

var make_folder_button = document.getElementById("make_folder")
make_folder_button.onclick = setUpFolder;

//var display = document.getElementById("displayResult");

var make_bookmark_button = document.getElementById("make_bookmark");
make_bookmark_button.onclick = makeBookmark;


function recommend() {

    link = "http://127.0.0.1:5000/recommend"
    webpage = "";

    // Ask the webpage for its link
    // Sends a request from extension to content script
    (async () => {
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        const response = await chrome.tabs.sendMessage(tab.id, {command: "recommend"});
        // do something with response here, not outside the function
        console.log(response.result);
        webpage = response.result;

        alert("From extension: " + webpage)

        // send link and receive response
        fetch(link, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(webpage)
            }
        )
        .then((response) => {
            // check if response was successful
            if(response.ok) {
                // If response okay then take result and print it out
                console.log(response);
                response.json().then((result) => {
                    alert("result recieved" + result);
                    console.log(result);
                    //display.innerHTML = result;
                    // makeFolder(result, webpage);

                })
            // if response fails then...
            } else {
                alert("Something went wrong");
                // display.innerHTML = "Something went wrong";
            }
        })
        .catch((err) => console.error(err));

      })();
}

// Function to set up and create folders for categories
function setUpFolder() {

    var otherBookmarks;

    // Get the master folder
    chrome.bookmarks.getTree(function(bookmarks) {

        // Keep track of "other bookmarks" folder
        otherBookmarks = bookmarks[0].children[1];

        chrome.bookmarks.create(
            // Create Test Folder inside the "Other Bookmarks"
            {'parentId': otherBookmarks.id, 'title': "Test Folder"},
            function(testFolder) {

                // Create categories inside "Test Folder"
                chrome.bookmarks.create({'parentId': testFolder.id, 'title': "alt.atheism"});
                chrome.bookmarks.create({'parentId': testFolder.id, 'title': "soc.religion.christian"});
                chrome.bookmarks.create({'parentId': testFolder.id, 'title': "comp.graphics"});
                chrome.bookmarks.create({'parentId': testFolder.id, 'title': "sci.med"});
                chrome.bookmarks.create({'parentId': testFolder.id, 'title': "sci.space"});
            
            }
        );

    });





}


function makeFolder(title, page) {
    chrome.bookmarks.create(
        {'title': title},
        function(newFolder) {
            alert("added folder: " + newFolder.title + "with id: " + newFolder.id);
            makeBookmark(newFolder.id, page);
            
        },
    );
}


function makeBookmark() {

    var categoryFromServer; // done
    var categoryFolderId; //done
    var page_title; // done
    var page_link;  // done

    link = "http://127.0.0.1:5000/recommend"
    webpage = "";

    // Ask the webpage for its link
    // Sends a request from extension to content script
    (async () => {
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        const response = await chrome.tabs.sendMessage(tab.id, {command: "recommend"});
        // do something with response here, not outside the function
        console.log(response.result);
        webpage = response.result;
        page_link = response.result;
        page_title = response.title;

        alert("From extension: " + webpage)

        // send link and receive response
        fetch(link, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(webpage)
            }
        )
        .then((response) => {
            // check if response was successful
            if(response.ok) {
                // If response okay then take result and print it out
                response.json().then((result) => {

                    // Storing the category the server has given the page
                    categoryFromServer = result;

                    chrome.bookmarks.getTree(function(bookmarks) {

                        categoryFolderId = search_for_id(bookmarks, categoryFromServer);

                        chrome.bookmarks.create({
                            'parentId': categoryFolderId,
                            'title': page_title,
                            'url': page_link,
                        });

                    })

                    

                })
            // if response fails then...
            } else {
                alert("Something went wrong");
                // display.innerHTML = "Something went wrong";
            }
        })
        .catch((err) => console.error(err));

      })();
}

function search_for_id(bookmarks, title) {
        
    for(var i=0; i < bookmarks.length; i++) { 
        // alert("Bookmark title: " + bookmarks[i].title);
        if(bookmarks[i].url == null && bookmarks[i].title == title) {
            alert("Found Bookmark title: " + bookmarks[i].title);
            // Totally found a folder that matches!
            return bookmarks[i].id;
        } else {
            if(bookmarks[i].children) {  
                // inception recursive stuff to get into the next layer of children
                var id = search_for_id(bookmarks[i].children, title);
                if(id)
                    return id;
            }
        }
    }


    // No results :C
    return false;
}



