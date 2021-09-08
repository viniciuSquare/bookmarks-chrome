const addLinkForm = document.getElementById("add-form")
const addLinkInput = document.getElementById("add-input")

const showAddModal = document.getElementById("show-add-modal-btn")
const addBookmarkModal = document.getElementById("add-bookmark-modal");

const addBookmarkButton = document.getElementById("submit-bookmark")
const subjectPicker = document.getElementById('subject-book-picker')
const addSubjectInput = document.getElementById('new-subject-input')

const contentContainer = document.getElementById('content')

// LISTENERS

document.addEventListener('DOMContentLoaded', (event) => {
  buildView() 

  localStorage.setItem("bookmarks", JSON.stringify(contentToInsert))
  
  showAddModal.addEventListener('click', (e) => {
    addBookmarkModal.style.display = "flex";

    let subjects = loadBookmarks().map( ({subject}) => subject)
    // console.log(subjects)
    subjects.forEach( (subject, idx) => {
      let option = document.createElement('option');
      option.value = idx;
      option.textContent = subject;

      subjectPicker.appendChild(option);
    })

  })
});

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

subjectPicker.addEventListener('change', (event) => {
  if(event.target.value != "new") {
    addSubjectInput.style.display = "none";
  } else {
    addSubjectInput.style.display = "inline-block";
  }
})


// FUNCTIONS
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
function loadBookmarks() {
  let bookmarks = (localStorage.getItem("bookmarks") != null) ? 
    JSON.parse(localStorage.getItem("bookmarks")) 
    : false;
  
  return bookmarks
}

function buildView(){  
  let bookmarks = loadBookmarks()
  console.log(bookmarks)

  bookmarks && (
    bookmarks.map( block => {
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

const contentToInsert = [
  {
    subject : "Controllers",
    data : [
      {
        title: "PFSense",
        url: "http://172.168.0.1",
        imageSrc: "./assets/pfsense.png"
      },
      {
        title: "TimeCloud",
        url: "https://172.168.1.200/index.php",
        imageSrc: "./assets/TimeCloud.png"
      },
      {
        title: "Unifi",
        url: "https://172.168.1.250:8443/manage/site/qqnv99lr/devices/1/50",
        imageSrc: "./assets/unifi.png"
      },
      {
        title: "Hostgator",
        url: "https://cliente.hostgator.com.br/meus-sites",
        imageSrc: "./assets/hostgator.png"
      },
      {
        title: "eSolution",
        url: "https://portal.esolution.com.br/Ticket/?ticketIntroductionType=17",
        imageSrc: "./assets/esico.ico"
      },
    ]
  },
  {
    subject : "Docs and Notes",
    data : [
      {
        title: "Work Activities",
        url: "https://www.notion.so/Work-activities-32ce7d01fbee4e50bb9075d63b821263",
        imageSrc: "./assets/notion.png"
      },
      {
        title: "TI Docs",
        url: "https://drive.google.com/drive/u/0/folders/10KC24XXI3y9CtGJjcQMfGP9y6x7mINc0",
        imageSrc: "./assets/drive.png"
      }
    ]
  }
]
