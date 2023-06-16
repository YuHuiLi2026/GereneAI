var button = document.getElementById("analyze_page");
button.onclick = recommend;

var make_folder_button = document.getElementById("make_folder")
make_folder_button.onclick = setUpFolder;

var display = document.getElementById("displayResult");

var make_bookmark_button = document.getElementById("make_bookmark");
make_bookmark_button.onclick = makeBookmark;

async function recommend() {

    webpage = await get_webpage_url();
    result = await get_server_reponse(webpage);

    display.innerHTML = result;
}

async function get_webpage_url() {

    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {command: "recommend"});

    webpage = response.result;
    return webpage;

}

async function get_server_reponse(webpage) {

    link = "http://3.138.117.150/recommend"

    let response = await fetch(link, {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify(webpage)
                        }
                    )

    let text = await response.json();
    
    return text;

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

async function makeBookmark() {
    var page_title = await get_webpage_title(); // done
    var page_link = await get_webpage_url();  // done
    var categoryFromServer = await get_server_reponse(page_link); // done

    var bookmarks = await chrome.bookmarks.getTree();
    var categoryFolderId = search_for_id(bookmarks, categoryFromServer); //done

    chrome.bookmarks.create({
        'parentId': categoryFolderId,
        'title': page_title,
        'url': page_link,
    });
}

async function get_webpage_title() {

    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {command: "recommend"});
    return response.title;

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
