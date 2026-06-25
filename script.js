$(document).ready(function() {
    
    // 1. Profil Bilgilerini Doldur
    if (portfolioData && portfolioData.profile) {
        $('#profileName').text(portfolioData.profile.name);
        $('#profileSurname').text(portfolioData.profile.surname);
        $('#profileBio').text(portfolioData.profile.bio);
        
        // Fotoğraf yoksa varsayılanı kullan
        const photoUrl = portfolioData.profile.photoUrl || 'https://via.placeholder.com/200?text=Foto';
        $('#profileImage').attr('src', photoUrl);
    }

    // 2. Sosyal Medya İkonlarını Doldur
    if (portfolioData && portfolioData.socials) {
        let socialsHtml = '';
        portfolioData.socials.forEach(function(social) {
            socialsHtml += `
                <a href="${social.url}" target="_blank" class="social-icon" title="${social.name}">
                    <i class="${social.icon}"></i>
                </a>
            `;
        });
        $('#socialContainer').html(socialsHtml);
    }

    // 3. Projeleri Doldur
    if (portfolioData && portfolioData.projects) {
        let projectsHtml = '';
        portfolioData.projects.forEach(function(project, index) {
            
            // Etiketleri (Tags) oluştur
            let tagsHtml = '';
            if (project.tags && project.tags.length > 0) {
                project.tags.forEach(function(tag) {
                    tagsHtml += `<span class="tag-badge">${tag}</span>`;
                });
            }

            // Proje Kartı HTML'i
            projectsHtml += `
                <div class="col-md-6" style="display:none;" id="project-${index}">
                    <div class="project-card d-flex flex-column">
                        <h5 class="project-title">${project.title}</h5>
                        <p class="project-desc">${project.description}</p>
                        <div class="mb-3">
                            ${tagsHtml}
                        </div>
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

        // Projeleri ufak bir animasyonla sırayla göster
        portfolioData.projects.forEach(function(project, index) {
            setTimeout(function() {
                $(`#project-${index}`).fadeIn(400);
            }, index * 150); // Her proje 150ms gecikmeyle görünür
        });
    }

});
