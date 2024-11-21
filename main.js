const months = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];



/* Html den eleman çekilmesi */

const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup-box .popup");
const popupTitle = popupBox.querySelector("header p");
const closeIcon = popupBox.querySelector("header i");
const form = document.querySelector("form");
const settings = document.querySelector("settings");
const wrapper = document.querySelector(".wrapper");
const button = document.querySelector(".popup button");




// console.log(form);
//console.log(closeIcon);

// Not güncellemesi için değişkenlerin oluşturulması

let isUpdate = false;
let UpdateId;
// Local Storage den not çekme

let notes = []
try {
    const storedNotes = JSON.parse(localStorage.getItem("notes"));
    if (Array.isArray(storedNotes)) {
        notes = storedNotes;
    } else {
        console.warn("notes bir dizi değil, sıfırdan başlatılıyor.");
    }
} catch (error) {
    console.error("localStorage verisi işlenemedi:", error);
}
// console.log(notes); // Burada konsola yazdırın



// Ekle  iconuna tıklayınca popup açılsın
addBox.addEventListener("click", () => {
  // popup görünür kıldık//

  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");

  // sayfa kaydırmasını engelle//

  document.querySelector("body").style.overflow = "hidden";
});

// Kapat  iconuna tıklayınca popup kapansın

closeIcon.addEventListener("click", () => {
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto"; // sayfa kaydırmasına açılması için
});

//form gönderildiğinde çalışacak 
form.addEventListener("submit", (e) => {
  // sayfa yenilemeyi engelle//
  e.preventDefault();
  
  let titleInput = e.target[0]
  let descriptionInput = e.target[1]
  
  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();

  //başlık ve açıklama varsa devam et
  if (title && description) {
    // tarih verisine eriş

    const date = new Date();
  let month =months[date.getMonth()];
  let day = date.getDate();
  let year = date.getFullYear();
 
  // Not Objesi Oluştur

  let noteInfo = {title, description, date: `${month}, ${day}, ${year}`};
 if (isUpdate) 
  
   // update
  {
  notes[UpdateId] = noteInfo;
  isUpdate = false;}
  else {
  notes.push(noteInfo);
 }

localStorage.setItem("notes", JSON.stringify(notes))
 popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");
   popupTitle.textContent = "Not Ekle"
   button.textContent ="Not Ekle";

  document.querySelector("body").style.overflow = "auto";
  }

// inputların içeriği temizlendi
  
  titleInput.value = ""
  descriptionInput.value = ""
  showNotes() // notları render et
});

// menüdeki silme işleminin fonksiyonu//

function deleteNote(noteId){
  if (confirm("Silmek istediğinize emin misiniz?")){
    //silinmek istenen notu kaldır//
    notes.splice(noteId, 1);
    // local storage güncelle
localStorage.setItem("notes" , JSON.stringify(notes));

    showNotes()

  }
}

 //note güncelleme fonksiyonu

 function updateNote(noteId, title ,description){
 isUpdate = true;
  UpdateId = noteId;
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");
 popupTitle.textContent = "Notu Güncelle"
 button.textContent = "Notu Güncelle"
 form.elements[0].value = title
 form.elements[1].value = description

 }

// Menü İçeriğini gösteren Fonksiyon

function showMenu(elem){
elem.parentElement.classList.add("show");//kapsam elemanına show classu eklendi
 document.addEventListener("click", (e) => {
if(e.target.tagName != 'I' || e.target!= elem){
  elem.parentElement.classList.remove("show")
}
})
}
    
/Ekrana notları render eden fonksiyon */
function showNotes(){
  if (!notes) return;
  // önceden eklenen notları kaldır

  document.querySelectorAll(".note").forEach((li) => li.remove());

  // Notları sayfada render et
    notes.forEach((note, id) => {
      let liTag = `
      <li class="note">
        <div class="details">
          <p>${note.title}</p>
          <span>${note.description}</span>
        </div>
        <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings">
            <i class='bx bx-dots-horizontal-rounded'></i>
            <ul class="menu">
             <li onclick='updateNote(${id},"${note.title}" ,"${note.description}")'>
                <i class='bx bx-edit'></i>Düzenle
              </li>
              <<li onclick='deleteNote(${id})'>
                <i class='bx bx-trash'></i>Sil
              </li>
            </ul>
          </div>
        </div>
      </li>
    `;
      addBox.insertAdjacentHTML("afterend", liTag);
    });
}

  // silme ve düzenleme işlemeri için düzenlemler

  wrapper.addEventListener("click", (e) => {
    //menu... iconuna tıklandığında show menu çalıştır

    if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
      showMenu(e.target);
    }

    // sil iconuna tıklandığında deleteNote çalıştır
    else if (e.target.classList.contains("bx-trash")) {
      const noteId = parseInt(e.target.closest(".note").dataset.id, 10);
      deleteNote(noteId);
    } else if (e.target.classList.contains("bx-edit")) {
      const noteElement = e.target.closest(".note");
      const noteId = parseInt(noteElement.dataset.id, 10);
      const title = noteElement.querySelector(".details p").innerText;
      const description = noteElement.querySelector(".details span").innerText;

      updateNote(noteId, title, description);
    }
  });

  document.addEventListener("DOMContentLoaded", () => showNotes());

