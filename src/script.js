const addLinkForm = document.getElementById("add-form")
const addLinkInput = document.getElementById("add-input")

const showAddModal = document.getElementById("show-add-modal-btn")
const addBookmarkModal = document.getElementById("add-bookmark-modal");

const addBookmarkButton = document.getElementById("submit-bookmark")
const subjectPicker = document.getElementById('subject-book-picker')
const addSubjectInput = document.getElementById('new-subject-input')

const contextTitle = document.getElementById('page-context-title')
const prevContextBtn = document.getElementById('prev-context')
const nextContextBtn = document.getElementById('next-context')
const contentContainer = document.getElementById('content')

// LISTENERS

document.addEventListener('DOMContentLoaded', (event) => {
  // localStorage.setItem("bookmarks", JSON.stringify(contentToInsert))
  // =============

  let indexContext = 0;
  buildView(indexContext) 

  
  showAddModal.addEventListener('click', (e) => {
    // addBookmarkModal.style.display = "flex";
    
    subjectPicker.addEventListener('change', (event) => {
      if(event.target.value != "new") {
        // addSubjectInput.style.display = "hidden";
        addSubjectInput.disabled = true
      } else {
        addSubjectInput.style.display = "inline-block";
      }
    })

    addBookmarkModal.classList.toggle("hidden")

    let subjects = loadBookmarks().map( ({subject}) => subject)
    console.log(subjects)
    subjects.forEach( (subject, idx) => {
      let option = document.createElement('option');
      option.value = idx;
      option.textContent = subject;

      subjectPicker.appendChild(option);
    })

  })

  addBookmarkButton.addEventListener('click', (event) => {
    event.preventDefault();
    const formData = new FormData(addLinkForm)

    let bookmarkInputed = Object.fromEntries(formData.entries())
    if(bookmarkInputed.url.indexOf("http") == (-1)) {
      bookmarkInputed.url = "http://" + bookmarkInputed.url
    }
    console.log(bookmarkInputed)


    // CURRENT BOOKMARKS SAVED
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) ? 
      JSON.parse(localStorage.getItem("bookmarks")) : []
    
    if(bookmarkInputed["subject-picker"] == "new"){
      let bookmark = {
        subject : bookmarkInputed.subject,
        data : [
          {
            title : bookmarkInputed.title,
            url : bookmarkInputed.url,
            imageSrc : bookmarkInputed.imageSrc
          }
        ]
      }

      bookmarks.push(bookmark)
    } else {
      bookmarks[bookmarkInputed["subject-picker"]].data = [...bookmarks[bookmarkInputed["subject-picker"]].data, {
        title: bookmarkInputed.title,
        url: bookmarkInputed.url,
        imageSrc : bookmarkInputed.imageSrc
      }]
    }

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
    // buildView()
  })

  prevContextBtn.addEventListener('click', () => {
    if((indexContext-1) < 0){
      indexContext = (loadBookmarks("all").length-1)
      buildView(indexContext)
    }
    else {
      indexContext -=1;
      buildView(indexContext)
    }
  })
  
  nextContextBtn.addEventListener('click', () => {
    if((indexContext+1) > (loadBookmarks("all").length - 1)){
      indexContext = 0
      buildView(indexContext)
    }
    else {
      indexContext +=1;
      buildView(indexContext)
    }
  })
});

function changeContext(direction) {
  let length = loadBookmarks("all");
  console.log("length", length);
}

// FUNCTIONS
function setPersonalSet() {
  let personalSet
  if(localStorage.getItem("personalSet") != null ) {
    personalSet = JSON.parse( localStorage.getItem("personalSet"))
  }
  else{
    if(localStorage.getItem("bookmarks")!=null ){ 
      let bookmarks = JSON.parse(localStorage.getItem("bookmarks"))
      let curContext =  bookmarks[0].context

      personalSet = { defaulContext : curContext}
      
    } else {
      personalSet  = { defaulContext : 0 , message: "no content" }
    }
  } 

  localStorage.setItem("personalSet", JSON.stringify(personalSet));
}

function saveBookmark() {
  const formData = new FormData(addLinkForm)
  let bookmarks;
  
  if(localStorage.getItem("bookmarks") === null) {
    bookmarks = [];

  } else {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  }

  let bookmark = Object.fromEntries(formData.entries())

  bookmarks.push(bookmark);

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  return bookmark;
} 

// GET BOOKMARKS FROM LOCALSTORAGE
function loadBookmarks(filter = 0) {
  if(filter.toString().toLowerCase() == "all"){
    return JSON.parse(localStorage.getItem("bookmarks"))
  }

  let bookmarks
  if(localStorage.getItem("bookmarks") != null) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"))
    bookmarks = bookmarks[filter];

  } else
    bookmarks = false;
  
  return bookmarks
}

function buildView(indexContext){  
  console.log("indexContext", indexContext)
  let contextBookmarks = loadBookmarks(indexContext)
  console.log(contextBookmarks)

  if ( contextBookmarks && (contextBookmarks.context != undefined) ) {
    contextTitle.innerText = contextBookmarks.context;
  }
  contentContainer.innerHTML = ""
  contextBookmarks && (
    contextBookmarks.data.map( block => {
      let bookmark_block = document.createElement('div');
      bookmark_block.classList.add("bookmark_block");
      
      let bookmark_block_head = document.createElement('h2');
      bookmark_block_head.classList.add("bookmark_block_head");
      bookmark_block_head.textContent = block.subject;

      bookmark_block.appendChild(bookmark_block_head);

      let bookmark_list = document.createElement('ul')
      bookmark_list.classList.add("bookmark_list")

      if(block.data) {
        block.data.forEach( bookmark => {
          bookmark_list.appendChild(addBookmark(bookmark))
        })
      
        bookmark_block.appendChild(bookmark_list)
        contentContainer.appendChild(bookmark_block)
      }
    })
  )
}

function addBookmark(bookmark) {
  let a = document.createElement('a');
  a.classList.add("bookmark");
  a.href = bookmark.url;
  a.target = "_blank";

  let img = document.createElement('img');
  img.src = bookmark.imageSrc;
  
  let h4 = document.createElement('h4');
  h4.classList.add("bookmark_title");
  h4.textContent = bookmark.title;

  a.appendChild(img)
  a.appendChild(h4)

  return (a)
}