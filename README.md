# Elif Nexus - Dynamic Portfolio CMS 🚀
![Elif Nexus](https://img.shields.io/badge/Status-Active-success) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)
Elif Nexus is a highly dynamic, serverless Personal Portfolio and Content Management System (CMS) built with pure HTML, CSS, JavaScript, and Firebase. It allows you to update your entire portfolio in real-time through a secure admin panel without ever touching the code!
*🇹🇷 Bu projenin açıklaması aşağıda Türkçe olarak da mevcuttur.*
---
## ✨ Features (Özellikler)
- **🔒 Secure Admin Panel:** A hidden admin login enables a fully functional CMS directly on the frontend. Edit your bio, skills, timeline, and projects seamlessly.
- **🌍 Bilingual Support (TR/EN):** Switch between Turkish and English instantly. The CMS supports dual-input fields so you can write translations for your content.
- **⚡ Real-time Updates:** Powered by **Firebase Realtime Database**. Any changes made in the admin panel are instantly reflected to visitors.
- **🎓 Smart Auto-Complete:** Adding a new education/experience entry? The system features a built-in database of all 81 Turkish provinces and 200+ universities for rapid auto-completion.
- **💎 Glassmorphism UI:** A sleek, modern, and responsive user interface built with Bootstrap 5 and custom CSS styling.
## 🛠️ Tech Stack (Kullanılan Teknolojiler)
- **Frontend:** HTML5, CSS3 (Glassmorphism), Vanilla JavaScript, Bootstrap 5.3
- **Backend/BaaS:** Firebase (Authentication & Realtime Database)
- **Icons & Fonts:** FontAwesome 6, Google Fonts
## 🚀 Setup & Installation (Kurulum)
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/elif-nexus.git
   ```
2. Set up Firebase:
   - Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
   - Enable **Authentication** (Email/Password) and **Realtime Database**.
   - Create an admin user from the Authentication tab.
   - Copy your Firebase config object.
3. Update Configuration:
   - Open `script.js` and replace the `firebaseConfig` object at the very top with your own credentials.
4. Run the project:
   - Since it's a static site, simply open `index.html` in your browser or host it via GitHub Pages, Netlify, or Vercel.
---
# 🇹🇷 Türkçe Açıklama
**Elif Nexus**, tek satır kod yazmanıza gerek kalmadan tüm içeriğinizi canlı olarak güncelleyebileceğiniz, Firebase altyapılı, sunucusuz (serverless) bir **Dinamik Portfolyo ve İçerik Yönetim Sistemi (CMS)** projesidir.
## 🔥 Öne Çıkan Özellikler
- **Gizli Admin Paneli:** Sitenin arayüzüne entegre edilmiş şifreli bir yönetici paneli sayesinde profilinizi, yeteneklerinizi, deneyimlerinizi ve projelerinizi anında düzenleyebilirsiniz.
- **Çoklu Dil (TR / EN):** Site İngilizce ve Türkçe olarak çift dilli çalışır. Yönetici panelinden her yazının İngilizce karşılığını da girebilirsiniz.
- **Akıllı Formlar (Üniversite & İl Seçimi):** Yeni bir eğitim eklerken Türkiye'deki 81 il ve 200'den fazla üniversite akıllı otomatik tamamlama (datalist) ile karşınıza gelir.
- **Modern Tasarım:** Bootstrap 5 ve modern "Glassmorphism" (Buzlu cam) CSS teknikleri kullanılarak tasarlanmıştır. Tüm mobil cihazlarla %100 uyumludur.
- **Canlı Veritabanı:** Firebase Realtime Database sayesinde yaptığınız tüm güncellemeler saniyeler içinde sitenize yansır.
## ⚙️ Nasıl Kullanılır?
Projenin hiçbir sunucuya (backend) ihtiyacı yoktur. `script.js` dosyasının en üstünde yer alan `firebaseConfig` değişkenine kendi Firebase ayarlarınızı yapıştırmanız yeterlidir. Ardından projeyi ister GitHub Pages'te isterseniz herhangi bir ücretsiz hosting servisinde anında yayına alabilirsiniz.
---
