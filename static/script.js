document.addEventListener('DOMContentLoaded', () => {

    // --- Clock and Date Logic ---
    const clockElement = document.getElementById('live-clock');
    const dateElement = document.getElementById('current-date');

    const updateClock = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    };

    const updateDate = () => {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        // Format to Indonesian locale
        dateElement.textContent = now.toLocaleDateString('id-ID', options);
    };

    // Update every second
    setInterval(updateClock, 1000);
    updateClock(); // Initial call
    updateDate();  // Initial call


    // --- API Data Fetching ---

    const fetchJadwal = async () => {
        try {
            // Call the local Flask API endpoint
            const response = await fetch('/api/jadwal');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status && data.data && data.data.jadwal) {
                const jadwal = data.data.jadwal;
                updateJadwalUI(jadwal);
                highlightCurrentPrayer(jadwal);
            } else {
                console.error("Format data API tidak sesuai:", data);
            }
        } catch (error) {
            console.error("Gagal mengambil data jadwal:", error);
            // Fallback content in case of error
            document.getElementById('current-date').textContent = "Gagal memuat jadwal solat";
        }
    };

    const updateJadwalUI = (jadwal) => {
        document.getElementById('time-subuh').textContent = jadwal.subuh;
        document.getElementById('time-dzuhur').textContent = jadwal.dzuhur;
        document.getElementById('time-ashar').textContent = jadwal.ashar;
        document.getElementById('time-maghrib').textContent = jadwal.maghrib;
        document.getElementById('time-isya').textContent = jadwal.isya;
    };

    // --- Active Highlight Logic ---
    const highlightCurrentPrayer = (jadwal) => {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes

        // Helper to convert "HH:MM" to minutes
        const toMinutes = (timeStr) => {
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
        };

        const prayerTimes = [
            { id: 'subuh', time: toMinutes(jadwal.subuh) },
            { id: 'dzuhur', time: toMinutes(jadwal.dzuhur) },
            { id: 'ashar', time: toMinutes(jadwal.ashar) },
            { id: 'maghrib', time: toMinutes(jadwal.maghrib) },
            { id: 'isya', time: toMinutes(jadwal.isya) },
        ];

        let activeId = null;

        // Logic to determine which prayer is currently "active" or next
        // For simplicity, we highlight the prayer that has most recently passed
        // until the next prayer time.
        for (let i = prayerTimes.length - 1; i >= 0; i--) {
            if (currentTime >= prayerTimes[i].time) {
                activeId = prayerTimes[i].id;
                break;
            }
        }

        // If before subuh, could highlight Isya of previous day, but we'll leave it null or highlight nothing

        // Remove active class from all
        document.querySelectorAll('.jadwal-card').forEach(card => {
            card.classList.remove('active');
        });

        if (activeId) {
            const card = document.getElementById(`card-${activeId}`);
            if (card) {
                card.classList.add('active');
            }
        }
    };

    // Initial Fetch
    fetchJadwal();

    // Refresh schedule data every hour just in case
    setInterval(fetchJadwal, 60 * 60 * 1000);
});
