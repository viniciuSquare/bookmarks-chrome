const contentContainer = document.getElementById('content')
const prevContextBtn = document.getElementById('prev-context')
const nextContextBtn = document.getElementById('next-context')

const contextTitle = document.getElementById('page-context-title')

const showAddModal = document.getElementById("show-add-modal-btn")
// TODO - EDIT BUTTON

const addBookmarkModal = document.getElementById("add-bookmark-modal");
const newContextInput = document.getElementById('new-context-input')
const addLinkInput = document.getElementById("add-input")
const addSubjectInput = document.getElementById('new-subject-input')
const subjectPicker = document.getElementById('subject-book-picker')

const addBookmarkForm = document.getElementById("add-form")
const addBookmarkButton = document.getElementById("submit-bookmark")

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

function saveBookmark(newBookmark) {
  
  if(newBookmark.url.indexOf("http") == (-1)) {
    newBookmark.url = "http://" + newBookmark.url
  }

  let bookmarks;
  
  if(localStorage.getItem("bookmarks") === null) {
    bookmarks = [];

  } else {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  }


  bookmarks.push(bookmarkInputed);

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  return bookmarkInputed;
} 

function createContext(contextTitle) {
  let newContext = [{
    context: contextTitle, 
    data: []
  }]

  let createdContextIdx = 0;

  let bookmarks = [];

  if(localStorage.getItem('bookmarks')) { // IF THERE'IS NONE CONEXT
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

    bookmarks.push(newContext);
    createdContextIdx = bookmarks.length-1;

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  } else {
    bookmarks.push(newContext);

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }

  return { bookmarks, createdContextIdx };
}

function createSubject(subjectTitle, contextIdx) {
  let updatedBookmarks = JSON.parse(localStorage.getItem('bookmarks'))
  let subject = {
    subject: subjectTitle,
    data: []
  }

 updatedBookmarks[contextIdx].data =updatedBookmarks[contextIdx].data ? [...updatedBookmarks[contextIdx].data, subject] : [subject];
  
  const createdSubjectIdx = updatedBookmarks[contextIdx].data.length-1

  console.log("CREATED NEW SUBJECT", subjectTitle,updatedBookmarks)

  
  return [updatedBookmarks, createdSubjectIdx];
}

// GET BOOKMARKS FROM LOCALSTORAGE
function loadBookmarks(contextIdx = 0) {
  if(contextIdx.toString().toLowerCase() == "all"){
    return JSON.parse(localStorage.getItem("bookmarks"))
  }

  let bookmarks
  if(localStorage.getItem("bookmarks") != null) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"))
    bookmarks = bookmarks[contextIdx];

  } else
    bookmarks = false;
  
  return bookmarks
}

function buildView(currentContextIdx){  // OK
  console.log("currentContextIdx", currentContextIdx)
  let contextBookmarks = loadBookmarks(currentContextIdx)
  console.log(contextBookmarks)

  if ( contextBookmarks && (contextBookmarks.context != undefined) ) {
    contextTitle.innerText = contextBookmarks.context;
  }
  
  contentContainer.innerHTML = ''; // RESET VIEW

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

      if(block.data) { //APPEND EACH BOOKMARK TO LIST
        block.data.forEach( bookmark => {
          bookmark_list.appendChild(addBookmark(bookmark))
        })
      
        bookmark_block.appendChild(bookmark_list)
        contentContainer.appendChild(bookmark_block)
      }
    })
  )
}

function addBookmark(bookmark) { // RETURN THE ELEMENT TO BE ADDED TO LIST
  let a = document.createElement('a');
  a.classList.add("bookmark");
  a.href = bookmark.url.indexOf("http") != -1 ? bookmark.url : "https://" + bookmark.url;
  a.target = "_blank";

  let img = document.createElement('img');
  img.src = bookmark.imageSrc ? bookmark.imageSrc : a.href + '/favicon.ico';
  
  let h4 = document.createElement('h4');
  h4.classList.add("bookmark_title");
  h4.textContent = bookmark.title;

  a.appendChild(img)
  a.appendChild(h4)

  return (a)
}

// LISTENERS

document.addEventListener('DOMContentLoaded', (event) => {
  // localStorage.setItem("bookmarks", JSON.stringify(contentToInsert))
  // =============

  let currentContextIdx = 0;
  buildView(currentContextIdx) 
  
  showAddModal.addEventListener('click', (e) => {
    addBookmarkModal.classList.toggle("hidden");
    
    // TODO - CLOSER HANDLER
    
    subjectPicker.addEventListener('change', (event) => { // VALIDATE IF NEW SUBJECT
      if(event.target.value != "new") {
        addSubjectInput.disabled = true
      } else
        addSubjectInput.disabled = false
    })

    let { data: subjects } = loadBookmarks();

    if(!subjects){ //CREATE CONTEXT INPUT
      newContextInput.classList.toggle('hidden')
      newContextInput.attributes.required = true
    }

    // RENDER SUBJECT OPTIONS
    if(subjects.length > 0 ) {
      subjects = subjects.map( ({subject}) => subject);
    } else 
      subjects = [] ;
    
    subjects.forEach( (subject, idx) => {
      let option = document.createElement('option');
      option.value = idx;
      option.textContent = subject;

      subjectPicker.appendChild(option);
    })

  })

  addBookmarkButton.addEventListener('click', (event) => {
    event.preventDefault();
    const formData = new FormData(addBookmarkForm);
    
    let bookmarkInputed = Object.fromEntries(formData.entries());    
    console.log(bookmarkInputed)

    if(bookmarkInputed.context) {
      const { bookmarks, createdContextIdx } = createContext(bookmarkInputed.context);
  
      currentContextIdx = createdContextIdx;
    }

    // CURRENT BOOKMARKS SAVED
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    
    const newBookmark = {
      title: bookmarkInputed.title,
      url: bookmarkInputed.url,
      imageSrc: bookmarkInputed.imageSrc,
    }

    let currentSujectIdx = 0;

    if(bookmarkInputed["subject-picker"] == "new") {
      let [updatedBookmarks, createdSubjectIdx] = createSubject(bookmarkInputed.subject, currentContextIdx);
      bookmarks = updatedBookmarks;
      currentSujectIdx = createdSubjectIdx
      
    } else {
      bookmarks[currentContextIdx].data.forEach((subjectData, subjectIdx) => {
        if(bookmarkInputed.subject == subjectData.subject) {
          currentSujectIdx = subjectIdx;
          console.log("SUBJECT CHANGED", currentSujectIdx)
        }
      })
      
    }

    console.log("CURRENT CONTEXT IDX", currentContextIdx, bookmarks)
    
    bookmarks[currentContextIdx].data[currentSujectIdx].data =  [...bookmarks[currentContextIdx].data[currentSujectIdx].data, newBookmark]

    console.log("Complete :", bookmarks)
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
    buildView(currentContextIdx)
  })

  prevContextBtn.addEventListener('click', () => {
    if((currentContextIdx-1) < 0){
      currentContextIdx = (loadBookmarks("all")?.length-1)
      buildView(currentContextIdx)
    }
    else {
      currentContextIdx -=1;
      buildView(currentContextIdx)
    }
  })
  
  nextContextBtn.addEventListener('click', () => {
    if((currentContextIdx+1) > (loadBookmarks("all").length - 1)){
      currentContextIdx = 0
      buildView(currentContextIdx)
    }
    else {
      currentContextIdx +=1;
      buildView(currentContextIdx)
    }
  })
});
