const resetDataBtn = document.getElementById("reset-btn")

const contentToInsert = [
  {
    "context" : "Work",
    "data" : [
      {
        subject : "Controllers",
        data : [
          {
            title: "PFSense",
            url: "http://172.168.0.1",
            imageSrc: "./assets/linksIcons/pfsense.png"
          },
          {
            title: "TimeCloud",
            url: "https://172.168.1.200/index.php",
            imageSrc: "./assets/linksIcons/TimeCloud.png"
          },
          {
            title: "Unifi",
            url: "https://172.168.1.250:8443/manage/site/qqnv99lr/devices/1/50",
            imageSrc: "./assets/linksIcons/unifi.png"
          },
          {
            title: "Hostgator",
            url: "https://cliente.hostgator.com.br/meus-sites",
            imageSrc: "./assets/linksIcons/hostgator.png"
          },
          {
            title: "eSolution",
            url: "https://portal.esolution.com.br/Ticket/?ticketIntroductionType=17",
            imageSrc: "./assets/linksIcons/esico.ico"
          },
        ]
      },
      {
        subject : "Docs and Notes",
        data : [
          {
            title: "Work Activities",
            url: "https://www.notion.so/Work-activities-32ce7d01fbee4e50bb9075d63b821263",
            imageSrc: "./assets/linksIcons/notion.png"
          },
          {
            title: "TI Docs",
            url: "https://drive.google.com/drive/u/0/folders/10KC24XXI3y9CtGJjcQMfGP9y6x7mINc0",
            imageSrc: "./assets/linksIcons/drive.png"
          }
        ]
      }
    ]
  },
  {
    "context" : "College",
    "data" : [
      {
        subject : "Docs & Notes",
        data : [
          {
            title: "Home",
            url: "https://www.notion.so/squaroqlab/Home-db97490e82614520925d9414cb66031f",
            imageSrc: "./assets/linksIcons/notion.png"
          },
          {
            title: "TimeCloud",
            url: "https://172.168.1.200/index.php",
            imageSrc: "./assets/linksIcons/TimeCloud.png"
          },
          {
            title: "Unifi",
            url: "https://172.168.1.250:8443/manage/site/qqnv99lr/devices/1/50",
            imageSrc: "./assets/linksIcons/unifi.png"
          },
          {
            title: "Hostgator",
            url: "https://cliente.hostgator.com.br/meus-sites",
            imageSrc: "./assets/linksIcons/hostgator.png"
          },
          {
            title: "eSolution",
            url: "https://portal.esolution.com.br/Ticket/?ticketIntroductionType=17",
            imageSrc: "./assets/linksIcons/esico.ico"
          },
        ]
      },
      {
        subject : "Docs and Notes",
        data : [
          {
            title: "Work Activities",
            url: "https://www.notion.so/Work-activities-32ce7d01fbee4e50bb9075d63b821263",
            imageSrc: "./assets/linksIcons/notion.png"
          },
          {
            title: "TI Docs",
            url: "https://drive.google.com/drive/u/0/folders/10KC24XXI3y9CtGJjcQMfGP9y6x7mINc0",
            imageSrc: "./assets/linksIcons/drive.png"
          }
        ]
      }
    ]
  }
]


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

function deleteBookmark( bookmarkPath ) { /**BOOKMARK INDEXES PATH */  
  const { 
    contextIndex,
    subjectIndex,
    bookmarkIndex 
  } = bookmarkPath; 

  let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  
  let removed = bookmarks[contextIndex].data[subjectIndex].data.splice(bookmarkIndex, 1);
  console.log("REMOVED BOOKMARK: ", removed)

  // UPDATE VALUES
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

  buildView(contextIndex);
}

function getElementPath(event) {
  let contentContainer = event.path[4]
  let bookmarkBlock = event.path[3]
  let bookmarkParentNode = event.path[2];
  let bookmark = event.path[1]
  
  let clickedBookmarkIndex = Array.from(bookmarkParentNode.children).indexOf(bookmark);
  let subjectIndex = Array.from(contentContainer.children).indexOf(bookmarkBlock);

  // TODO -> GET CONTEXT INDEX
  let mock_contextIdx = 0

  return { 
    contextIndex: mock_contextIdx,
    bookmarkIndex: clickedBookmarkIndex, 
    subjectIndex
  } 
}

function createBookmarkElement(bookmark) { // RETURN THE ELEMENT TO BE ADDED TO LIST
  let a = document.createElement('a');
  a.classList.add("bookmark");
  a.href = bookmark.url.indexOf("http") != -1 ? bookmark.url : "https://" + bookmark.url;
  a.target = "_blank";

  let img = document.createElement('img');
  img.src = bookmark.imageSrc ? bookmark.imageSrc : a.href + '/favicon.ico';
  
  let h4 = document.createElement('h4');
  h4.classList.add("bookmark_title");
  h4.textContent = bookmark.title;
  
  const wrapper = document.createElement('div')
  wrapper.classList.add('bookmark-wrapper')
  
  let deleteButton = document.createElement('button');
  deleteButton.innerHTML = "<svg stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" viewBox=\"0 0 512 512\" height=\"2em\" width=\"2em\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"M432 144l-28.67 275.74A32 32 0 01371.55 448H140.46a32 32 0 01-31.78-28.26L80 144\"></path><rect width=\"448\" height=\"80\" x=\"32\" y=\"64\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" rx=\"16\" ry=\"16\"></rect><path fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"M312 240L200 352m112 0L200 240\"></path></svg>"
  deleteButton.classList.add('hidden');
  deleteButton.onclick =(event) => { deleteBookmark(getElementPath(event)) };

  a.appendChild(img)
  a.appendChild(h4)
  a.appendChild(deleteButton)

  
  wrapper.appendChild(a)
  wrapper.appendChild(deleteButton)

  wrapper.addEventListener('hover', ()=>{console.log("HOVERED")})

  return (wrapper)
}