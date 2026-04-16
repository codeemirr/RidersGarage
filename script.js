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
    "Bu gece gece sürüşü var mı?",
    "Beşiktaş'ta trafik çok yoğun, dikkat edin",
    "Maslak tarafı boş, rahat sürüş 👌"
];

// Haritayı başlat
function initMap() {
    map = L.map('map', {
        zoomControl: true,
        attributionControl: false
    }).setView([41.0082, 28.9784], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Kullanıcı marker - mavi nokta
    const userIcon = L.divIcon({
        html: '<div style="width:16px;height:16px;background:#3b82f6;border:3px solid #fff;border-radius:50%;box-shadow:0 0 10px rgba(59,130,246,0.6);"></div>',
        iconSize: [16, 16],
        className: ''
    });

    userMarker = L.marker([41.0082, 28.9784], { icon: userIcon }).addTo(map);
    userMarker.bindPopup("<b>📍 Senin Konumun</b>");

    // Sahte sürücüler - kırmızı nokta
    const riderIcon = L.divIcon({
        html: '<div style="width:12px;height:12px;background:#ef4444;border:2px solid #fff;border-radius:50%;box-shadow:0 0 6px rgba(239,68,68,0.5);"></div>',
        iconSize: [12, 12],
        className: ''
    });

    fakeUsers.forEach(user => {
        const marker = L.marker([user.lat, user.lng], { icon: riderIcon }).addTo(map);
        marker.bindPopup(`<b>🏍️ ${user.name}</b><br>Aktif sürücü`);
        fakeMarkers.push({ marker, user });
    });

    // Gerçek konum
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                map.setView([pos.coords.latitude, pos.coords.longitude], 14);
                userMarker.setLatLng([pos.coords.latitude, pos.coords.longitude]);
            },
            () => console.log("Konum izni verilmedi, demo konum kullanıldı")
        );
    }

    setTimeout(() => map.invalidateSize(), 300);
    setTimeout(() => map.invalidateSize(), 1000);
}

// Sahte kullanıcıları hareket ettir
function moveFakeUsers() {
    fakeMarkers.forEach(item => {
        const c = item.marker.getLatLng();
        item.marker.setLatLng([
            c.lat + (Math.random() - 0.5) * 0.002,
            c.lng + (Math.random() - 0.5) * 0.002
        ]);
    });
}

// Mesaj ekle
function addMessage(name, text, isSelf = false) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `msg ${isSelf ? 'self' : 'other'}`;
    div.innerHTML = `
        ${!isSelf ? `<span class="msg-name">${name}</span>` : ''}
        <div class="msg-bubble">${text}</div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// Otomatik mesajlar
function startAutoMessages() {
    setInterval(() => {
        const user = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
        const text = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        addMessage(user.name, text);
    }, 8000);
}

// Başlat
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    startAutoMessages();
    setInterval(moveFakeUsers, 3000);

    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    function send() {
        const text = input.value.trim();
        if (!text) return;
        addMessage('Sen', text, true);
        input.value = '';
    }

    sendBtn.addEventListener('click', send);
    input.addEventListener('keypress', e => { if (e.key === 'Enter') send(); });

    // Hoş geldin mesajları
    setTimeout(() => addMessage("Kaan Moto", "Merhaba Riders! Bugün neredesin?"), 1500);
    setTimeout(() => addMessage("Ece Speed", "Harita çok temiz görünüyor, tebrikler!"), 4000);
    setTimeout(() => addMessage("Deniz Rider", "Bu akşam Boğaz yolunda rüzgar müthiş! 🌬️"), 7000);
});