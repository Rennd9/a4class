function generateRandomTeam() {
  
  // Ambil nilai ukuran tim dari form
  const teamSize = parseInt(document.getElementById("teamSize").value);

  // Ambil nilai anggota tim dari form
  const teamMembers = document.getElementById("teamMembers").value.trim();

  // Cek apakah input telah diisi
  if (teamSize <= 0 || teamMembers.length == 0) {
    Swal.fire({
      icon: 'error',
      title: 'huh???...',
      text: 'data isian tidak boleh kosong!..',
    })
    return;
  }

  // Buat array tim acak
  const shuffledTeamMembers = shuffleArray(teamMembers.split("\n"));

  // Hitung jumlah tim yang dibutuhkan
  const numTeams = Math.ceil(shuffledTeamMembers.length / teamSize);

  // Buat daftar tim
  let teams = [];
  for (let i = 0; i < numTeams; i++) {
    teams.push(shuffledTeamMembers.slice(i * teamSize, (i + 1) * teamSize));
  }

  // Buat tabel daftar tim
  let tableHtml = "<thead><tr><th scope='col'>No. Kelompok</th><th scope='col'>Nama Kelompok</th></tr></thead>";
  for (let i = 0; i < teams.length; i++) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true ,
      timerProgressBarColor: '#000',
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: 'Kelompok Berhasil Dibuat.!'
    })

    const teamName = "Kelompok " + (i + 1);
    const teamMembers = teams[i].join(", ");
    tableHtml += "<tr><td>" + teamName + "</td><td>" + teamMembers + "</td></tr> " ;
    
    
  }

  // Masukkan tabel daftar tim ke dalam HTML
  document.getElementById("generatedTeams").innerHTML = tableHtml;
}

// Fungsi untuk mengacak array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Mengambil elemen button dan span untuk total klik
const generateBtn = document.getElementById("generate-btn");
const clickCounter = document.getElementById("click-counter");

// Inisialisasi variabel jumlah klik
let clickCount = 0 ;
// Menambahkan event listener pada button
generateBtn.addEventListener("click", function() {
  // Memperbarui jumlah klik
  clickCount++;
  // Memperbarui tampilan total klik pada span
  clickCounter.textContent = clickCount + " Kali Dibuat "
  // Kode untuk generate team di sini
});
