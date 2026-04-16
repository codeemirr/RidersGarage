// Tailwind çalıştır
document.documentElement.setAttribute('data-theme', 'dark')

let map
let userMarker
let fakeMarkers = []
const fakeUsers = [
    { name: "Kaan Moto", lat: 41.0125, lng: 28.9850 },
    { name: "Deniz Rider", lat: 41.0050, lng: 28.9700 },
    { name: "Ece Speed", lat: 41.0150, lng: 28.9900 },
    { name: "Burak Garage", lat: 41.0000, lng: 28.9600 }
]

const sampleMessages = [
    "Bu akşam Boğaz yolunda rüzgar müthiş esiyor! 🌬️",
    "Yeni lastiklerimle 180 km yaptım, harika tutuyor 🔥",
    "Garaja dönelim mi? Bir kahve içelim",
    "Herkes hazır mı? Hafta sonu grup sürüşü yapıyoruz 🏍️",
    "Dikkat! Kartal tarafında yol çalışması var",
    "Motor sesi bugün efsane, herkes katılmalı!"
]

// Haritayı başlat
function initMap() {
    map = L.map('map', { zoomControl: true }).setView([41.0082, 28.9784], 14)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    // Kullanıcının konumu (mavi marker)
    userMarker = L.marker([41.0082, 28.9784], {
        title: "Sen"
    }).addTo(map)
    userMarker.bindPopup("<b>Senin Konumun</b>").openPopup()

    // Sahte kullanıcılar (kırmızı marker)
    fakeUsers.forEach(user => {
        const marker = L.marker([user.lat, user.lng]).addTo(map)
        marker.bindPopup(`<b>${user.name}</b><br>Canlı sürücü`)
        fakeMarkers.push({ marker: marker, user: user })
    })

    // Tarayıcının gerçek konumunu al (izin verirse)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude
                const lng = position.coords.longitude
                map.setView([lat, lng], 15)
                userMarker.setLatLng([lat, lng])
            },
            () => console.log("Konum izni verilmedi, demo konum kullanıldı")
        )
    }
}

// Sahte kullanıcıları yavaş yavaş hareket ettir
function moveFakeUsers() {
    fakeMarkers.forEach(item => {
        const current = item.marker.getLatLng()
        const newLat = current.lat + (Math.random() - 0.5) * 0.003
        const newLng = current.lng + (Math.random() - 0.5) * 0.003
        item.marker.setLatLng([newLat, newLng])
    })
}

// Chat'e mesaj ekle
function addChatMessage(name, text, isSelf = false) {
    const container = document.getElementById('chat-messages')
    const div = document.createElement('div')
    div.className = `flex ${isSelf ? 'justify-end self' : 'justify-start other'}`
    
    div.innerHTML = `
        <div class="flex flex-col ${isSelf ? 'items-end' : 'items-start'}">
            ${!isSelf ? `<span class="text-xs text-zinc-400 mb-1">${name}</span>` : ''}
            <div class="chat-bubble">${text}</div>
        </div>
    `
    container.appendChild(div)
    container.scrollTop = container.scrollHeight
}

// Sahte mesajları otomatik gönder
function startFakeMessages() {
    setInterval(() => {
        const randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)]
        const randomText = sampleMessages[Math.floor(Math.random() * sampleMessages.length)]
        addChatMessage(randomUser.name, randomText)
    }, 8000 + Math.random() * 7000) // 8-15 saniye arası
}

// Sayfa yüklendiğinde her şeyi başlat
document.addEventListener('DOMContentLoaded', () => {
    initMap()
    startFakeMessages()

    // Sahte kullanıcıları hareket ettir
    setInterval(moveFakeUsers, 2500)

    // Kullanıcı mesaj gönderme
    const input = document.getElementById('chat-input')
    const sendBtn = document.getElementById('send-btn')

    function sendMessage() {
        const text = input.value.trim()
        if (text === '') return
        addChatMessage('Sen', text, true)
        input.value = ''
    }

    sendBtn.addEventListener('click', sendMessage)
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage()
    })

    // İlk 2 tane hoş geldin mesajı
    setTimeout(() => {
        addChatMessage("Kaan Moto", "Merhaba Riders! Bugün neredesin?")
    }, 2000)
    setTimeout(() => {
        addChatMessage("Ece Speed", "Harita çok temiz görünüyor, tebrikler!")
    }, 4500)
})
