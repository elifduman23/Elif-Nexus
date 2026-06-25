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
            
            if(data.profile.bio) {
                // Alt satıra geçmeleri korumak için \n karakterlerini <br>'ye çeviriyoruz
                $('#profileBio').html(data.profile.bio.replace(/\n/g, '<br>'));
            } else {
                $('#profileBio').text('');
            }
            
            $('#profileImage').attr('src', data.profile.photoUrl || 'https://via.placeholder.com/200');
            
            if (data.profile.email) {
                $('#profileEmailText').text(data.profile.email);
                $('#profileEmailLink').attr('href', 'mailto:' + data.profile.email);
                $('.contact-card').fadeIn();
            } else {
                $('.contact-card').hide();
            }
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
        } else {
            $('#projectsContainer').html('<p class="text-muted">Henüz proje eklenmedi.</p>');
        }

        // Yetenekler
        if (data.skills) {
            let skillsHtml = '';
            data.skills.forEach(function(skill) {
                skillsHtml += `
                    <div class="col-md-6 mb-3">
                        <div class="d-flex justify-content-between mb-1">
                            <span class="fw-bold">${skill.name}</span>
                            <span class="text-muted small">%${skill.percentage}</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" style="width: ${skill.percentage}%" aria-valuenow="${skill.percentage}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                `;
            });
            $('#skillsContainer').html(skillsHtml);
        } else {
            $('#skillsContainer').html('<p class="text-muted">Henüz yetenek eklenmedi.</p>');
        }

        // Zaman Çizelgesi
        if (data.timeline) {
            let timelineHtml = '';
            data.timeline.forEach(function(item) {
                timelineHtml += `
                    <div class="timeline-item">
                        <div class="timeline-date">${item.period}</div>
                        <div class="timeline-title">${item.title}</div>
                        <div class="timeline-subtitle">${item.subtitle}</div>
                        ${item.description ? `<p class="small text-muted mb-0">${item.description}</p>` : ''}
                    </div>
                `;
            });
            $('#timelineContainer').html(timelineHtml);
        } else {
            $('#timelineContainer').html('<p class="text-muted">Henüz deneyim veya eğitim eklenmedi.</p>');
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
                $('#currentPhotoUrl').val(profile.photoUrl || '');
                $('#editPhotoFile').val(''); // Dosya seçimini sıfırla
                
                if (profile.photoUrl) {
                    $('#photoPreview').attr('src', profile.photoUrl).show();
                } else {
                    $('#photoPreview').hide();
                }
                
                $('#editBio').val(profile.bio);
                $('#editEmail').val(profile.email || '');
            }
            $('#editProfileModal').modal('show');
        });
    });

    // Fotoğraf seçildiğinde önizleme yap
    $('#editPhotoFile').change(function(e) {
        if (e.target.files && e.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#photoPreview').attr('src', e.target.result).show();
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Profili Kaydet Butonuna Tıklayınca
    $('#saveProfileBtn').click(function() {
        const fileInput = document.getElementById('editPhotoFile');
        const file = fileInput.files[0];
        const saveProfileBtn = $(this);
        
        saveProfileBtn.prop('disabled', true).text('Kaydediliyor...');

        const updateDatabase = (photoUrl) => {
            const newProfile = {
                name: $('#editName').val(),
                surname: $('#editSurname').val(),
                photoUrl: photoUrl || null,
                bio: $('#editBio').val(),
                email: $('#editEmail').val()
            };

            db.ref('portfolio/profile').update(newProfile).then(() => {
                $('#editProfileModal').modal('hide');
                saveProfileBtn.prop('disabled', false).text('Kaydet');
            }).catch((error) => {
                console.error("Güncelleme hatası: ", error);
                alert("Güncelleme başarısız oldu!");
                saveProfileBtn.prop('disabled', false).text('Kaydet');
            });
        };

        if (file) {
            // Firebase Storage ücretli (Blaze) plan istediği için, alternatifi kullanıyoruz:
            // Fotoğrafı Base64 metin formatına çevirip doğrudan Realtime Database'e kaydediyoruz!
            var reader = new FileReader();
            reader.onload = function(e) {
                const base64String = e.target.result;
                updateDatabase(base64String);
            };
            reader.onerror = function(error) {
                console.error("Dosya okuma hatası:", error);
                alert("Fotoğraf okunamadı!");
                saveProfileBtn.prop('disabled', false).text('Kaydet');
            };
            reader.readAsDataURL(file);
        } else {
            // Dosya seçilmemişse mevcut fotoğraf url'si ile güncelle
            updateDatabase($('#currentPhotoUrl').val());
        }
    });

    // Sosyal Linkleri Düzenle Butonuna Tıklayınca
    $('#editSocialsBtn').click(function() {
        db.ref('portfolio/socials').once('value').then((snapshot) => {
            const socials = snapshot.val();
            if (socials && Array.isArray(socials)) {
                socials.forEach(social => {
                    if (social.name === "LinkedIn") $('#editSocialLinkedin').val(social.url);
                    if (social.name === "GitHub") $('#editSocialGithub').val(social.url);
                    if (social.name === "Kaggle") $('#editSocialKaggle').val(social.url);
                    if (social.name === "YouTube") $('#editSocialYoutube').val(social.url);
                });
            }
            $('#editSocialsModal').modal('show');
        });
    });

    // Sosyal Linkleri Kaydet Butonuna Tıklayınca
    $('#saveSocialsBtn').click(function() {
        const newSocials = [
            { name: "LinkedIn", icon: "fab fa-linkedin-in", url: $('#editSocialLinkedin').val() || "#" },
            { name: "GitHub", icon: "fab fa-github", url: $('#editSocialGithub').val() || "#" },
            { name: "Kaggle", icon: "fab fa-kaggle", url: $('#editSocialKaggle').val() || "#" },
            { name: "YouTube", icon: "fab fa-youtube", url: $('#editSocialYoutube').val() || "#" }
        ];

        db.ref('portfolio/socials').set(newSocials).then(() => {
            $('#editSocialsModal').modal('hide');
        });
    });

    // ==========================================
    // PROJE DÜZENLEME İŞLEMLERİ
    // ==========================================

    // Projeleri Düzenle Butonuna Tıklayınca
    $('.edit-btn[data-edit-type="projects"]').click(function() {
        db.ref('portfolio/projects').once('value').then((snapshot) => {
            const projects = snapshot.val() || [];
            $('#projectsEditContainer').empty();
            
            if (projects.length === 0) {
                // Hiç proje yoksa bir tane boş form ekle
                addProjectForm(null);
            } else {
                projects.forEach((proj) => {
                    addProjectForm(proj);
                });
            }
            
            $('#editProjectsModal').modal('show');
        });
    });

    // Proje Formu Ekleyen Fonksiyon
    function addProjectForm(proj) {
        const title = proj ? proj.title : '';
        const desc = proj ? proj.description : '';
        const link = proj && proj.link !== '#' ? proj.link : '';
        
        const commonLangs = ["HTML", "CSS", "JavaScript", "TypeScript", "Python", "C#", "SQL", "Java", "C++", "PHP", "Swift", "Go", "Kotlin", "Ruby", "Rust", "Dart", "React", "Node.js", "Firebase", "MongoDB"];
        const currentTags = proj && proj.tags ? proj.tags : [];
        
        let checkboxesHtml = '<div class="d-flex flex-wrap gap-2 border p-2 rounded bg-white" style="max-height: 120px; overflow-y: auto;">';
        commonLangs.forEach(lang => {
            const isChecked = currentTags.includes(lang) ? 'checked' : '';
            const uniqueId = `cb_${lang.replace(/\W/g, '')}_${Math.random().toString(36).substr(2, 9)}`;
            checkboxesHtml += `
                <div class="form-check form-check-inline m-0">
                    <input class="form-check-input proj-lang-checkbox" type="checkbox" value="${lang}" id="${uniqueId}" ${isChecked}>
                    <label class="form-check-label small" style="cursor:pointer;" for="${uniqueId}">${lang}</label>
                </div>
            `;
        });
        checkboxesHtml += '</div>';
        
        const formHtml = `
            <div class="project-edit-item border rounded p-3 mb-3 position-relative bg-light shadow-sm">
                <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 remove-project-btn" title="Projeyi Sil"><i class="fas fa-trash"></i></button>
                <div class="mb-2 pe-4">
                    <label class="form-label small fw-bold mb-1">Proje Adı</label>
                    <input type="text" class="form-control form-control-sm proj-title" value="${title}" placeholder="Örn: E-Ticaret Sitesi">
                </div>
                <div class="mb-2">
                    <label class="form-label small fw-bold mb-1">Açıklama</label>
                    <textarea class="form-control form-control-sm proj-desc" rows="2" placeholder="Proje detayları...">${desc}</textarea>
                </div>
                <div class="mb-2">
                    <label class="form-label small fw-bold mb-1">Kullanılan Teknolojiler / Diller</label>
                    ${checkboxesHtml}
                </div>
                <div class="mb-2">
                    <label class="form-label small fw-bold mb-1">Proje Linki</label>
                    <input type="text" class="form-control form-control-sm proj-link" value="${link}" placeholder="https://github.com/...">
                </div>
            </div>
        `;
        $('#projectsEditContainer').append(formHtml);
    }

    // Yeni Proje Ekle Butonuna Tıklayınca
    $('#addProjectBtn').click(function() {
        addProjectForm(null);
    });

    // Proje Sil Butonuna Tıklayınca
    $(document).on('click', '.remove-project-btn', function() {
        $(this).closest('.project-edit-item').remove();
    });

    // Projeleri Kaydet Butonuna Tıklayınca
    $('#saveProjectsBtn').click(function() {
        const newProjects = [];
        const btn = $(this);
        btn.prop('disabled', true).text('Kaydediliyor...');

        $('.project-edit-item').each(function() {
            const title = $(this).find('.proj-title').val().trim();
            const desc = $(this).find('.proj-desc').val().trim();
            const link = $(this).find('.proj-link').val().trim();
            
            // Sadece başlığı olanları projeler listesine dahil et (Boşları geç)
            if (title !== '') {
                const selectedLangs = [];
                $(this).find('.proj-lang-checkbox:checked').each(function() {
                    selectedLangs.push($(this).val());
                });

                newProjects.push({
                    title: title,
                    description: desc,
                    tags: selectedLangs,
                    link: link || '#'
                });
            }
        });

        // Veritabanına boş dizi yollamak yerine null set etmek, 'projects' dalını temizler
        db.ref('portfolio/projects').set(newProjects.length > 0 ? newProjects : null).then(() => {
            $('#editProjectsModal').modal('hide');
            btn.prop('disabled', false).text('Projeleri Kaydet');
        }).catch((error) => {
            console.error("Projeler kaydedilemedi: ", error);
            alert("Projeler kaydedilirken bir hata oluştu!");
            btn.prop('disabled', false).text('Projeleri Kaydet');
        });
    });

    // ==========================================
    // YETENEK DÜZENLEME İŞLEMLERİ
    // ==========================================

    $('.edit-btn[data-edit-type="skills"]').click(function() {
        db.ref('portfolio/skills').once('value').then((snapshot) => {
            const skills = snapshot.val() || [];
            $('#skillsEditContainer').empty();
            
            if (skills.length === 0) {
                addSkillForm(null);
            } else {
                skills.forEach((skill) => addSkillForm(skill));
            }
            $('#editSkillsModal').modal('show');
        });
    });

    function addSkillForm(skill) {
        const name = skill ? skill.name : '';
        const percentage = skill ? skill.percentage : '50';
        
        const formHtml = `
            <div class="skill-edit-item border rounded p-3 mb-2 position-relative bg-light">
                <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 remove-skill-btn"><i class="fas fa-trash"></i></button>
                <div class="row g-2 align-items-center pe-4">
                    <div class="col-8">
                        <label class="form-label small fw-bold mb-1">Yetenek Adı</label>
                        <input type="text" class="form-control form-control-sm skill-name" value="${name}" placeholder="Örn: Python">
                    </div>
                    <div class="col-4">
                        <label class="form-label small fw-bold mb-1">Yüzde (%)</label>
                        <input type="number" class="form-control form-control-sm skill-percent" value="${percentage}" min="0" max="100">
                    </div>
                </div>
            </div>
        `;
        $('#skillsEditContainer').append(formHtml);
    }

    $('#addSkillBtn').click(function() { addSkillForm(null); });
    $(document).on('click', '.remove-skill-btn', function() { $(this).closest('.skill-edit-item').remove(); });

    $('#saveSkillsBtn').click(function() {
        const newSkills = [];
        const btn = $(this);
        btn.prop('disabled', true).text('Kaydediliyor...');

        $('.skill-edit-item').each(function() {
            const name = $(this).find('.skill-name').val().trim();
            let percent = parseInt($(this).find('.skill-percent').val().trim());
            if (isNaN(percent)) percent = 50;
            if (percent > 100) percent = 100;
            if (percent < 0) percent = 0;
            
            if (name !== '') {
                newSkills.push({ name: name, percentage: percent });
            }
        });

        db.ref('portfolio/skills').set(newSkills.length > 0 ? newSkills : null).then(() => {
            $('#editSkillsModal').modal('hide');
            btn.prop('disabled', false).text('Yetenekleri Kaydet');
        }).catch((error) => {
            alert("Hata oluştu!");
            btn.prop('disabled', false).text('Yetenekleri Kaydet');
        });
    });

    // ==========================================
    // ZAMAN ÇİZELGESİ (TIMELINE) DÜZENLEME İŞLEMLERİ
    // ==========================================

    $('.edit-btn[data-edit-type="timeline"]').click(function() {
        db.ref('portfolio/timeline').once('value').then((snapshot) => {
            const timeline = snapshot.val() || [];
            $('#timelineEditContainer').empty();
            
            if (timeline.length === 0) {
                addTimelineForm(null);
            } else {
                timeline.forEach((item) => addTimelineForm(item));
            }
            $('#editTimelineModal').modal('show');
        });
    });

    function addTimelineForm(item) {
        const title = item ? item.title : '';
        const subtitle = item ? item.subtitle : '';
        const period = item ? item.period : '';
        const desc = item ? item.description : '';
        
        const formHtml = `
            <div class="timeline-edit-item border rounded p-3 mb-3 position-relative bg-light">
                <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 remove-timeline-btn"><i class="fas fa-trash"></i></button>
                <div class="mb-2 pe-4">
                    <label class="form-label small fw-bold mb-1">Başlık / Pozisyon</label>
                    <input type="text" class="form-control form-control-sm tl-title" value="${title}" placeholder="Örn: Frontend Developer">
                </div>
                <div class="row g-2 mb-2">
                    <div class="col-6">
                        <label class="form-label small fw-bold mb-1">Kurum / Şirket</label>
                        <input type="text" class="form-control form-control-sm tl-subtitle" value="${subtitle}" placeholder="Örn: Google">
                    </div>
                    <div class="col-6">
                        <label class="form-label small fw-bold mb-1">Tarih / Yıl</label>
                        <input type="text" class="form-control form-control-sm tl-period" value="${period}" placeholder="Örn: 2021 - Günümüz">
                    </div>
                </div>
                <div class="mb-2">
                    <label class="form-label small fw-bold mb-1">Açıklama</label>
                    <textarea class="form-control form-control-sm tl-desc" rows="2" placeholder="Görev detayları...">${desc}</textarea>
                </div>
            </div>
        `;
        $('#timelineEditContainer').append(formHtml);
    }

    $('#addTimelineBtn').click(function() { addTimelineForm(null); });
    $(document).on('click', '.remove-timeline-btn', function() { $(this).closest('.timeline-edit-item').remove(); });

    $('#saveTimelineBtn').click(function() {
        const newTimeline = [];
        const btn = $(this);
        btn.prop('disabled', true).text('Kaydediliyor...');

        $('.timeline-edit-item').each(function() {
            const title = $(this).find('.tl-title').val().trim();
            const subtitle = $(this).find('.tl-subtitle').val().trim();
            const period = $(this).find('.tl-period').val().trim();
            const desc = $(this).find('.tl-desc').val().trim();
            
            if (title !== '') {
                newTimeline.push({
                    title: title,
                    subtitle: subtitle,
                    period: period,
                    description: desc
                });
            }
        });

        db.ref('portfolio/timeline').set(newTimeline.length > 0 ? newTimeline : null).then(() => {
            $('#editTimelineModal').modal('hide');
            btn.prop('disabled', false).text('Çizelgeyi Kaydet');
        }).catch((error) => {
            alert("Hata oluştu!");
            btn.prop('disabled', false).text('Çizelgeyi Kaydet');
        });
    });

});
