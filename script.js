// Riders Garage - Script.js

let map;
let userMarker;
let fakeMarkers = [];

const fakeUsers = [
    { name: "Kaan Moto", lat: 41.0125, lng: 28.9850 },
    { name: "Deniz Rider", lat: 41.0050, lng: 28.9700 },
    { name: "Ece Speed", lat: 41.0150, lng: 28.9900 },
    { name: "Burak Garage", lat: 41.0000, lng: 28.9600 }
];

const sampleMessages = [
    "Bu akşam Boğaz yolunda rüzgar müthiş esiyor! 🌬️",
    "Yeni lastiklerimle 180 km yaptım, harika tutuyor 🔥",
    "Garaja dönelim mi? Bir kahve içelim ☕",
    "Herkes hazır mı? Hafta sonu grup sürüşü yapıyoruz 🏍️",
    "Dikkat! Kartal tarafında yol çalışması var ⚠️",
    "Motor sesi bugün efsane, herkes katılmalı!",
    "Kadıköy sahilden geçtim, manzara harika 🌅",
    "Yağmur geliyor gibi, dikkatli olun 🌧️",
    "Yeni kask aldım, çok rahat 🪖",
    "Bu gece gece sürüşü var mı?"
];

// Haritayı başlat
function initMap() {
    map = L.map('map', {
        zoomControl: true,
        attributionControl: false
    }).setView([41.0082, 28.9784], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Kullanıcının kendi konumu
    const userIcon = L.divIcon({
        html: '<div style="width:14px;height:14px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 8px rgba(59,130,246,0.6);"></div>',
        iconSize: [14, 14],
        className: ''
    });

    userMarker = L.marker([41.0082, 28.9784], {
        icon: userIcon,
        title: "Sen"
    }).addTo(map);
    userMarker.bindPopup("<b>📍 Senin Konumun</b>");

    // Sahte sürücüler - özel ikon
    const riderIcon = L.divIcon({
        html: '<div style="width:12px;height:12px;background:#ef4444;border:2px solid white;border-radius:50%;box-shadow:0 0 6px rgba(239,68,68,0.5);"></div>',
        iconSize: [12, 12],
        className: ''
    });

    fakeUsers.forEach(user => {
        const marker = L.marker([user.lat, user.lng], { icon: riderIcon }).addTo(map);
        marker.bindPopup(`<b>🏍️ ${user.name}</b><br>Aktif sürücü`);
        fakeMarkers.push({ marker: marker, user: user });
    });

    // Gerçek konum
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                map.setView([lat, lng], 15);
                userMarker.setLatLng([lat, lng]);
            },
            () => {
                console.log("Konum izni verilmedi, İstanbul demo konumu kullanıldı");
            }
        );
    }

    // Harita boyut düzeltmesi
    setTimeout(() => map.invalidateSize(), 300);
    setTimeout(() => map.invalidateSize(), 1000);
}

// Sahte kullanıcıları hareket ettir
function moveFakeUsers() {
    fakeMarkers.forEach(item => {
        const current = item.marker.getLatLng();
        const newLat = current.lat + (Math.random() - 0.5) * 0.002;
        const newLng = current.lng + (Math.random() - 0.5) * 0.002;
        item.marker.setLatLng([newLat, newLng]);
    });
}

// Chat mesaj ekle
function addChatMessage(name, text, isSelf = false) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `flex ${isSelf ? 'justify-end self' : 'justify-start other'}`;
    div.innerHTML = `
        <div class="flex flex-col ${isSelf ? 'items-end' : 'items-start'}" style="max-width:85%">
            ${!isSelf ? `<span class="text-xs text-zinc-400 mb-1 ml-1">${name}</span>` : ''}
            <div class="chat-bubble">${text}</div>
        </div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// Otomatik sahte mesajlar
function startFakeMessages() {
    setInterval(() => {
        const randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
        const randomText = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        addChatMessage(randomUser.name, randomText);
    }, 8000);
}

// Mobil toggle butonu
function setupMobileToggle() {
    const toggleBtn = document.getElementById('toggle-view');
    const chatPanel = document.getElementById('chat-panel');
    const mapContainer = document.getElementById('map-container');

    if (!toggleBtn) return;

    let showingChat = false;

    toggleBtn.addEventListener('click', () => {
        showingChat = !showingChat;

        if (showingChat) {
            chatPanel.classList.add('active');
            toggleBtn.textContent = '🗺️ Harita';
        } else {
            chatPanel.classList.remove('active');
            toggleBtn.textContent = '💬 Sohbet';
            setTimeout(() => map.invalidateSize(), 100);
        }
    });
}

// Başlat
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    startFakeMessages();
    setupMobileToggle();

    setInterval(moveFakeUsers, 3000);

    // Mesaj gönderme
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    function sendMessage() {
        const text = input.value.trim();
        if (text === '') return;
        addChatMessage('Sen', text, true);
        input.value = '';
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Hoş geldin mesajları
    setTimeout(() => {
        addChatMessage("Kaan Moto", "Merhaba Riders! Bugün neredesin?");
    }, 1500);

    setTimeout(() => {
        addChatMessage("Ece Speed", "Harita çok temiz görünüyor, tebrikler!");
    }, 4000);

    setTimeout(() => {
        addChatMessage("Deniz Rider", "Bu akşam Boğaz yolunda rüzgar müthiş esiyor! 🌬️");
    }, 7000);
});