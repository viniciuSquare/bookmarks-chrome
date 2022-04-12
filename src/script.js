const contentContainer = document.getElementById('content')
const prevContextBtn = document.getElementById('prev-context')
const nextContextBtn = document.getElementById('next-context')

const contextTitle = document.getElementById('page-context-title')

// MODAL HANDLERS COMPONENTS
const formModal = document.getElementById("add-bookmark-modal");
const showFormModalButton = document.getElementById("show-add-modal-btn")
const showContextFieldsetButton = document.getElementById("create-context-button")
const formSubmissionButton = document.getElementById("submit-bookmark")

// FORM ELEMENTS
const creationForm = document.getElementById("form-container")
const newContextFieldset = document.getElementById('context-fieldset')
const addSubjectInput = document.getElementById('new-subject-input')
const subjectPicker = document.getElementById('subject-book-picker')
// TODO - EDIT BUTTON


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
          bookmark_list.appendChild(createBookmarkElement(bookmark))
        })
      
        bookmark_block.appendChild(bookmark_list)
        contentContainer.appendChild(bookmark_block)
      }
    })
  )
}

// LISTENERS
document.addEventListener('DOMContentLoaded', (event) => {
  // localStorage.setItem("bookmarks", JSON.stringify(contentToInsert))
  // =============

  let currentContextIdx = 0;
  buildView(currentContextIdx) 
  
  // OPEN MODAL
  showFormModalButton.addEventListener('click', (e) => {
    formModal.classList.toggle("hidden");
    
    // TODO - CLOSER HANDLER
    
    subjectPicker.addEventListener('change', (event) => { // VALIDATE IF NEW SUBJECT
      if(event.target.value != "new") {
        addSubjectInput.disabled = true
      } else
        addSubjectInput.disabled = false
    })

    let { data: subjects } = loadBookmarks();
    console.log(subjects)

    if(!subjects){ //CREATE CONTEXT INPUT
      // newContextFieldset.classList.toggle('hidden')  
      newContextFieldset.attributes.required = true
    }

    // RENDER SUBJECT OPTIONS
    if(subjects?.length > 0 ) {
      subjects = subjects.map( ({subject}) => subject);
    } else 
      subjects = [] ;
    
    subjects.forEach( (subject, idx) => {
      let option = document.createElement('option');
      option.value = idx;
      option.textContent = subject;

      subjectPicker.appendChild(option);
    })

    showContextFieldsetButton.addEventListener('click', event => {
      newContextFieldset.classList.toggle('hidden')  

    })
    
    // ADD BUTTON - SUBMIT MODAL FORM
    // TODO -> Update genic add button, handle if new bookmark
    formSubmissionButton.addEventListener('click', (event) => {
      event.preventDefault();
      const formData = new FormData(creationForm);
      
      let bookmarkInputed = Object.fromEntries(formData.entries());    
      console.log(bookmarkInputed)
  
      if(bookmarkInputed.context) {
        const { createdContextIdx } = createContext(bookmarkInputed.context);
    
        currentContextIdx = createdContextIdx;
      }
      if(bookmarkInputed.title) {
        // CURRENT BOOKMARKS SAVED
        let bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
        
        const newBookmark = {
          title: bookmarkInputed.title,
          url: bookmarkInputed.url,
          imageSrc: bookmarkInputed.imageSrc,
        }

        // HANDLE SUBJECT
        let currentSubjectIdx = 0;
    
        if(bookmarkInputed["subject-picker"] == "new") {
          let [updatedBookmarks, createdSubjectIdx] = createSubject(bookmarkInputed.subject, currentContextIdx);
          bookmarks = updatedBookmarks;
          currentSubjectIdx = createdSubjectIdx;
          console.log(createdSubjectIdx)
          
        } else {
          currentSubjectIdx = bookmarkInputed["subject-picker"];        
        }
    
        console.log("CURRENT CONTEXT IDX", currentContextIdx,"CURRENT SUBJECT IDX",currentSubjectIdx,"\nBookmarks", bookmarks)
        
        bookmarks[currentContextIdx].data[currentSubjectIdx].data =  [...bookmarks[currentContextIdx].data[currentSubjectIdx].data, newBookmark]
    
        console.log("Complete :", bookmarks)
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
      }
  
      formModal.classList.toggle("hidden");
      creationForm.reset();
      
      buildView(currentContextIdx)
    })
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

resetDataBtn.addEventListener("click", () => {
  // ASK WHAT TO RESET
    // BOOKMARKS DATA
    // PERSONAL PREFERENCES - TODO

  localStorage.setItem("bookmarks", JSON.stringify(contentToInsert))
  window.location.reload()
  
})
console.log("object")
