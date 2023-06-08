// Inisialisasi Firebase
var firebaseConfig = {
  apiKey: "AIzaSyAJ07znAPQJb1B8S8oObzrBdm6aAfJGLD0",
  databaseURL: "https://a4class-42e4b-default-rtdb.asia-southeast1.firebasedatabase.app/",
  authDomain: "a4class-42e4b.firebaseapp.com",
  projectId: "a4class-42e4b",
  storageBucket: "a4class-42e4b.appspot.com",
  messagingSenderId: "369425879931",
  appId: "1:369425879931:web:5b42e153530645478123de"
};

firebase.initializeApp(firebaseConfig);

        // Mendapatkan ID pengguna saat ini dari localStorage atau menghasilkan yang baru jika tidak ada
        var currentUserId = localStorage.getItem("currentUserId");
        if (!currentUserId) {
            currentUserId = generateUsername();
            localStorage.setItem("currentUserId", currentUserId);
        }

        // Mengisi nilai input nama pengguna dari localStorage atau menghasilkan yang baru jika tidak ada
        var usernameInput = document.getElementById("username-input");
        var currentUsername = localStorage.getItem("currentUsername");
        if (currentUsername) {
            usernameInput.value = currentUsername;
        } else {
            currentUsername = generateUsername();
            usernameInput.value = currentUsername;
            localStorage.setItem("currentUsername", currentUsername);
        }

        // Fungsi untuk menghasilkan username berdasarkan waktu saat ini
        function generateUsername() {
            var date = new Date();
            var username = "user" + date.getTime(); // Menggunakan timestamp saat ini sebagai username
            return username;
        }

// Referensi database
var messagesRef = firebase.database().ref("messages");

// Fungsi untuk menyimpan pesan ke Firebase
function saveMessage(message) {
  var newMessageRef = messagesRef.push();
  newMessageRef.set({
    message: message,
    user: "A4CLASS_CODE: ",
    senderId: currentUserId,
    likes: 0, // Menambahkan jumlah likes awal dengan 0
    ratings: 0 // Menambahkan jumlah rating awal dengan 0
  });
}

// Fungsi untuk menambahkan like pada pesan
function likeMessage(messageId, buttonElement) {
  var buttonKey = "like-button-" + messageId;
  var isButtonClicked = localStorage.getItem(buttonKey);

  if (isButtonClicked) {
    return; // Jika tombol sudah diklik sebelumnya, keluar dari fungsi
  }

  buttonElement.disabled = true;

  var messageRef = messagesRef.child(messageId);
  messageRef.transaction(function(message) {
    if (message) {
      message.likes = (message.likes || 0) + 1;
    }
    return message;
  }, function(error, committed, snapshot) {
    if (error) {
      console.error(error);
    } else if (committed) {
      var likes = snapshot.val().likes || 0;
      var likeCounter = document.getElementById("counter-" + messageId);
      if (likeCounter) {
        likeCounter.innerText = likes;
      }

      buttonElement.classList.add("clicked");
      localStorage.setItem(buttonKey, true);
    }

    buttonElement.disabled = false;
  });
}

function scrollToBottom() {
  var chatbox = document.getElementById("chatbox");
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Mendengarkan perubahan pada database Firebase
messagesRef.on("child_added", function(snapshot) {
  var message = snapshot.val().message;
  var senderId = snapshot.val().senderId;
  var likes = snapshot.val().likes || 0;

  var chatbox = document.getElementById("chatbox");
  var newMessage = document.createElement("div");
  newMessage.setAttribute("data-sender-id", currentUserId); // Menyimpan ID pengirim pesan
  newMessage.className = "message flex mb-2";

  var avatar = document.createElement("div");
  avatar.className = "chat-image avatar";
  avatar.className = "w-10 rounded-full w-8 h-8 bg-gray-500 rounded-full mr-2";

  var messageContent = document.createElement("div");
  messageContent.className = "flex flex-col";
  messageContent.innerHTML = `<div class="chat-header">${senderId}</div >
    <div class="chat-bubble">${message}</div>
    <div class="flex items-center mt-1">
      <a href='#loved' onclick="likeMessage('${snapshot.key}', this)">
        ❤️&nbsp;
      </a>
      <span id="counter-${snapshot.key}">${likes}</span>
    </div>`;

  if (senderId === currentUserId) {
    newMessage.classList.add("justify-end");
    messageContent.classList.add("text-right");
    newMessage.appendChild(messageContent);
  } else {
    newMessage.classList.add("justify-start");
    newMessage.appendChild(avatar);
    newMessage.appendChild(messageContent);
  }

  chatbox.appendChild(newMessage);

  scrollToBottom(); // Mengatur scroll ke bawah

  // Scroll ke pesan terakhir saat refresh
  if (senderId === currentUserId) {
    newMessage.scrollIntoView();
  }

  // Tambahkan kelas 'visible' untuk memicu animasi
  setTimeout(function() {
    newMessage.classList.add("visible");
  }, 1);

  // Scroll ke bawah setiap kali ada pesan baru
  chatbox.scrollTop = chatbox.scrollHeight;
});

// Live counter saat fitur "like" digunakan
messagesRef.on("child_changed", function(snapshot) {
  var likes = snapshot.val().likes || 0; // Mengambil jumlah likes atau mengembalikan 0 jika tidak ada
  var likeCounter = document.getElementById("counter-" + snapshot.key);
  if (likeCounter) {
    likeCounter.innerText = likes + "";
  }
});

// Scroll ke pesan terakhir saat halaman dimuat
window.onload = function() {
  scrollToBottom();
  var lastMessageId = getLastMessageId();
  if (lastMessageId === currentUserId) {
    var lastMessage = document.querySelector(`[data-sender-id="${lastMessageId}"]`);
    lastMessage.scrollIntoView();
  }
};

// Fungsi untuk mengirim pesan
function sendMessage() {
  var inputBox = document.getElementById("input-box");
  var message = inputBox.value.trim();

  if (message !== "") {
    saveMessage(message);
    inputBox.value = "";

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: 'Yatta, Pesan Suksess Dikirim 💋'
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Pesan Kosong',
      text: 'Mohon isi pesan sebelum mengirim.',
      confirmButtonText: 'OK'
    });
  }
};

// Menambahkan event listener untuk tombol Enter
document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
// Live counter
messagesRef.on("value", function(snapshot) {
  var count = snapshot.numChildren();
  document.getElementsByClassName("counter")[0].innerHTML = "Jumlah Pesan: " + count;
});
// Mendapatkan referensi ke elemen input
var inputBox = document.getElementById("input-box");

// Mendengarkan aksi input pada input box
inputBox.addEventListener("input", function() {
  var message = inputBox.value.trim();
  var maxLength = 350; // Jumlah maksimum karakter pesan

  if (message.length > maxLength) {
    inputBox.value = message.slice(0, maxLength); // Memotong pesan menjadi jumlah maksimum karakter
  }
});
