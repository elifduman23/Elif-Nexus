// ==========================================
// FIREBASE AYARLARI (BURAYI SİZ DOLDURACAKSINIZ)
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyCzv086VubpogXgz_cd8_LWeJobUCyB8_0",
    authDomain: "elifnexus-ed699.firebaseapp.com",
    projectId: "elifnexus-ed699",
    storageBucket: "elifnexus-ed699.firebasestorage.app",
    messagingSenderId: "1059932432905",
    appId: "1:1059932432905:web:390179d431373af9bd66d8",
    measurementId: "G-51FTE23J39",
    databaseURL: "https://elifnexus-ed699-default-rtdb.firebaseio.com" // Varsayılan database URL'si
};

// Config var mı kontrol et
const isFirebaseConfigured = firebaseConfig.apiKey !== "BURAYA_API_KEY_GELECEK";

if (isFirebaseConfigured) {
    firebase.initializeApp(firebaseConfig);
}

const db = isFirebaseConfigured ? firebase.database() : null;
const auth = isFirebaseConfigured ? firebase.auth() : null;

// ==========================================
// UYGULAMA MANTIĞI
// ==========================================
$(document).ready(function() {
    
    // 1. Verileri Ekrana Basan Fonksiyon
    function renderData(data) {
        if (!data) return;

        // Profil
        if (data.profile) {
            $('#profileName').text(data.profile.name);
            $('#profileSurname').text(data.profile.surname);
            $('#profileBio').text(data.profile.bio);
            $('#profileImage').attr('src', data.profile.photoUrl || 'https://via.placeholder.com/200');
        }

        // Sosyal Linkler
        if (data.socials) {
            let socialsHtml = '';
            data.socials.forEach(function(social) {
                socialsHtml += `
                    <a href="${social.url}" target="_blank" class="social-icon" title="${social.name}">
                        <i class="${social.icon}"></i>
                    </a>
                `;
            });
            $('#socialContainer').html(socialsHtml);
        }

        // Projeler
        if (data.projects) {
            let projectsHtml = '';
            data.projects.forEach(function(project, index) {
                let tagsHtml = '';
                if (project.tags) {
                    project.tags.forEach(function(tag) {
                        tagsHtml += `<span class="tag-badge">${tag}</span>`;
                    });
                }
                projectsHtml += `
                    <div class="col-md-6" id="project-${index}">
                        <div class="project-card d-flex flex-column">
                            <h5 class="project-title">${project.title}</h5>
                            <p class="project-desc">${project.description}</p>
                            <div class="mb-3">${tagsHtml}</div>
                            <div class="mt-auto">
                                <a href="${project.link}" target="_blank" class="project-link">
                                    Projeyi İncele <i class="fas fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            });
            $('#projectsContainer').html(projectsHtml);
        }
    }

    // 2. Veritabanından Verileri Oku
    if (isFirebaseConfigured) {
        db.ref('portfolio').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                renderData(data);
            } else {
                // Veritabanı boşsa data.js içindeki eski verileri veritabanına kaydet
                db.ref('portfolio').set(portfolioData);
                renderData(portfolioData);
            }
        });
    } else {
        // Firebase ayarlanmadıysa doğrudan data.js'i göster (Hata almamak için)
        renderData(portfolioData);
        $('#profileBio').text("Firebase ayarları yapılmadı. Geçici olarak eski veriler gösteriliyor.");
    }

    // ==========================================
    // ADMİN İŞLEMLERİ
    // ==========================================

    // Auth state dinleyici (Kişi giriş yapmış mı?)
    if (isFirebaseConfigured) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                // Giriş yapıldıysa düzenleme butonlarını göster
                $('.admin-only').removeClass('d-none');
                $('#adminLockBtn').addClass('d-none');
            } else {
                // Çıkış yapıldıysa gizle
                $('.admin-only').addClass('d-none');
                $('#adminLockBtn').removeClass('d-none');
            }
        });
    }

    // Kilit ikonuna tıklayınca Modalı aç
    $('#adminLockBtn').click(function() {
        if (!isFirebaseConfigured) {
            alert("Lütfen önce Firebase ayarlarını yapın!");
            return;
        }
        $('#loginModal').modal('show');
    });

    // Giriş Yap Butonu
    $('#loginSubmitBtn').click(function() {
        const email = $('#adminEmail').val();
        const password = $('#adminPassword').val();
        
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                $('#loginModal').modal('hide');
                $('#loginError').addClass('d-none');
                $('#adminEmail').val('');
                $('#adminPassword').val('');
            })
            .catch((error) => {
                $('#loginError').removeClass('d-none').text("Hatalı e-posta veya şifre!");
            });
    });

    // Çıkış Yap Butonu
    $('#adminLogoutBtn').click(function() {
        auth.signOut();
    });

    // Profil Düzenle Butonuna Tıklayınca
    $('.edit-btn[data-edit-type="profile"]').click(function() {
        // Mevcut verileri Modala doldur
        db.ref('portfolio/profile').once('value').then((snapshot) => {
            const profile = snapshot.val();
            if (profile) {
                $('#editName').val(profile.name);
                $('#editSurname').val(profile.surname);
                $('#editPhoto').val(profile.photoUrl);
                $('#editBio').val(profile.bio);
            }
            $('#editProfileModal').modal('show');
        });
    });

    // Profili Kaydet Butonuna Tıklayınca
    $('#saveProfileBtn').click(function() {
        const newProfile = {
            name: $('#editName').val(),
            surname: $('#editSurname').val(),
            photoUrl: $('#editPhoto').val(),
            bio: $('#editBio').val()
        };

        db.ref('portfolio/profile').update(newProfile).then(() => {
            $('#editProfileModal').modal('hide');
            // Uyarı vs eklenebilir. Firebase .on('value') sayesinde arayüz otomatik güncellenir.
        });
    });

});
