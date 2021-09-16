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


resetDataBtn.addEventListener("click", () => {
  // ASK WHAT TO RESET
    // BOOKMARKS DATA
    // PERSONAL PREFERENCES - TODO

  localStorage.setItem("bookmarks", JSON.stringify(contentToInsert))
  window.location.reload()
  
})
console.log("object")