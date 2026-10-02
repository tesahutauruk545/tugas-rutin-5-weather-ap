// ============================================
// WEATHER APP PRO - iPhone Style
// Tugas Rutin 5
// ============================================

const API_KEY = '9702dcc239c15011cacc06bb9f0c68b5'; // ✅ API Key sudah dipasang!
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// State
const state = {
    currentWeather: null,
    forecast: null,
    searchHistory: []
};

// Weather icon mapping
const weatherIcons = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '',
    '03d': '️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
};

// DOM Elements
const elements = {
    cityInput: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    geoBtn: document.getElementById('geoBtn'),
    loading: document.getElementById('loading'),
    errorMessage: document.getElementById('errorMessage'),
    weatherContent: document.getElementById('weatherContent'),
    weatherBg: document.getElementById('weatherBg'),
    rainEffect: document.getElementById('rainEffect'),
    locationLabel: document.getElementById('locationLabel'),
    locationName: document.getElementById('locationName'),
    currentTemp: document.getElementById('currentTemp'),
    currentDesc: document.getElementById('currentDesc'),
    hourlyContainer: document.getElementById('hourlyContainer'),
    forecastContainer: document.getElementById('forecastContainer'),
    feelsLikeTemp: document.getElementById('feelsLikeTemp'),
    feelsLikeDesc: document.getElementById('feelsLikeDesc'),
    uvIndex: document.getElementById('uvIndex'),
    uvLevel: document.getElementById('uvLevel'),
    uvIndicator: document.getElementById('uvIndicator'),
    uvDesc: document.getElementById('uvDesc'),
    windSpeed: document.getElementById('windSpeed'),
    windGust: document.getElementById('windGust'),
    windDirection: document.getElementById('windDirection'),
    compassNeedle: document.getElementById('compassNeedle'),
    compassSpeed: document.getElementById('compassSpeed'),
    sunsetTime: document.getElementById('sunsetTime'),
    sunriseTime: document.getElementById('sunriseTime'),
    sunPosition: document.getElementById('sunPosition'),
    precipitation: document.getElementById('precipitation'),
    precipDesc: document.getElementById('precipDesc'),
    precipForecast: document.getElementById('precipForecast'),
    visibility: document.getElementById('visibility'),
    visibilityDesc: document.getElementById('visibilityDesc'),
    humidity: document.getElementById('humidity'),
    dewPoint: document.getElementById('dewPoint'),
    pressureValue: document.getElementById('pressureValue'),
    pressureArc: document.getElementById('pressureArc'),
    pressureNeedle: document.getElementById('pressureNeedle'),
    pressureTrend: document.getElementById('pressureTrend'),
    moonPhaseName: document.getElementById('moonPhaseName'),
    moonIllumination: document.getElementById('moonIllumination'),
    moonriseTime: document.getElementById('moonriseTime'),
    nextFullMoon: document.getElementById('nextFullMoon'),
    moonVisual: document.getElementById('moonVisual')
};

// ============================================
// RAIN EFFECT
// ============================================

const createRainEffect = (intensity = 50) => {
    elements.rainEffect.innerHTML = '';
    const dropCount = Math.floor(intensity / 2);
    
    for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.height = Math.random() * 20 + 10 + 'px';
        drop.style.animationDuration = Math.random() * 0.5 + 0.5 + 's';
        drop.style.animationDelay = Math.random() * 2 + 's';
        drop.style.opacity = Math.random() * 0.5 + 0.3;
        elements.rainEffect.appendChild(drop);
    }
};

// ============================================
// BACKGROUND UPDATE
// ============================================

const updateBackground = (weatherMain, isNight) => {
    elements.weatherBg.className = 'weather-bg';
    
    if (isNight) {
        elements.weatherBg.classList.add('clear-night');
    } else {
        switch(weatherMain.toLowerCase()) {
            case 'clear':
                elements.weatherBg.classList.add('clear-day');
                break;
            case 'clouds':
                elements.weatherBg.classList.add('cloudy');
                break;
            case 'rain':
            case 'drizzle':
                elements.weatherBg.classList.add('rainy');
                createRainEffect(60);
                break;
            case 'thunderstorm':
                elements.weatherBg.classList.add('stormy');
                createRainEffect(100);
                break;
            case 'snow':
                elements.weatherBg.classList.add('snowy');
                break;
            default:
                elements.weatherBg.classList.add('cloudy');
        }
    }
};

// ============================================
// API FUNCTIONS
// ============================================

const fetchWeatherData = async (city) => {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?q=${city},ID&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('🔑 API Key tidak valid atau belum aktif. Tunggu 10-30 menit jika baru dibuat.');
            } else if (response.status === 404) {
                throw new Error('❌ Kota tidak ditemukan. Coba nama kota lain.');
            }
            throw new Error(`❌ Error ${response.status}: Terjadi kesalahan.`);
        }
        
        return await response.json();
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            throw new Error('🌐 Koneksi internet bermasalah.');
        }
        throw error;
    }
};

const fetchWeatherByCoords = async (lat, lon) => {
    const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error('Gagal mengambil data cuaca.');
    return await response.json();
};

const fetchForecastData = async (lat, lon) => {
    const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error('Gagal mengambil data prakiraan.');
    return await response.json();
};

// ============================================
// DISPLAY FUNCTIONS
// ============================================

const displayCurrentWeather = (data) => {
    state.currentWeather = data;
    
    const isNight = data.weather[0].icon.includes('n');
    elements.locationLabel.textContent = 'LOKASI SAYA';
    elements.locationName.textContent = data.name;
    elements.currentTemp.textContent = `${Math.round(data.main.temp)}°`;
    elements.currentDesc.textContent = data.weather[0].description;
    
    updateBackground(data.weather[0].main, isNight);
    
    // Feels like
    elements.feelsLikeTemp.textContent = `${Math.round(data.main.feels_like)}°`;
    const feelsDiff = data.main.feels_like - data.main.temp;
    if (feelsDiff > 2) {
        elements.feelsLikeDesc.textContent = 'Terasa lebih hangat daripada suhu sebenarnya.';
    } else if (feelsDiff < -2) {
        elements.feelsLikeDesc.textContent = 'Terasa lebih dingin daripada suhu sebenarnya.';
    } else {
        elements.feelsLikeDesc.textContent = 'Terasa seperti suhu sebenarnya.';
    }
    
    // UV Index (simulasi)
    const uvValue = Math.round(Math.random() * 10 + 1);
    elements.uvIndex.textContent = uvValue;
    const uvLevels = ['Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi', 'Ekstrem'];
    const uvLevelIndex = Math.min(Math.floor(uvValue / 2.5), 4);
    elements.uvLevel.textContent = uvLevels[uvLevelIndex];
    elements.uvIndicator.style.left = `${(uvValue / 11) * 100}%`;
    elements.uvDesc.textContent = uvValue <= 2 ? 'Aman untuk berada di luar.' : 
                                  uvValue <= 5 ? 'Gunakan tabir surya hingga 16.00.' :
                                  uvValue <= 7 ? 'Hindari sinar matahari langsung.' :
                                  'Sangat berbahaya! Tetap di dalam ruangan.';
    
    // Wind
    const windKmh = (data.wind.speed * 3.6).toFixed(0);
    elements.windSpeed.textContent = `${windKmh} km/j`;
    const gustKmh = data.wind.gust ? (data.wind.gust * 3.6).toFixed(0) : windKmh;
    elements.windGust.textContent = `${gustKmh} km/j`;
    elements.windDirection.textContent = `${data.wind.deg}° ${getWindDirection(data.wind.deg)}`;
    elements.compassSpeed.textContent = windKmh;
    elements.compassNeedle.setAttribute('transform', `rotate(${data.wind.deg}, 60, 60)`);
    
    // Sunset/Sunrise
    const sunset = new Date(data.sys.sunset * 1000);
    const sunrise = new Date(data.sys.sunrise * 1000);
    elements.sunsetTime.textContent = formatTime(sunset);
    elements.sunriseTime.textContent = formatTime(sunrise);
    
    // Sun position
    const now = new Date();
    const dayProgress = Math.max(0, Math.min(1, (now - sunrise) / (sunset - sunrise)));
    const sunX = 10 + (dayProgress * 180);
    const sunY = 50 - Math.sin(dayProgress * Math.PI) * 45;
    elements.sunPosition.setAttribute('cx', sunX);
    elements.sunPosition.setAttribute('cy', Math.max(10, sunY));
    
    // Precipitation
    const precip = data.rain ? data.rain['1h'] || 0 : 0;
    elements.precipitation.textContent = `${precip} mm`;
    elements.precipDesc.textContent = 'dalam 6j terakhir';
    elements.precipForecast.textContent = `${(precip * 2).toFixed(0)} mm diprediksi dalam 24j ke depan.`;
    
    // Visibility
    const visKm = (data.visibility / 1000).toFixed(0);
    elements.visibility.textContent = `${visKm} km`;
    elements.visibilityDesc.textContent = visKm > 10 ? 'Pemandangan jelas' :
                                          visKm > 5 ? 'Pemandangan cukup baik' : 'Pemandangan terbatas';
    
    // Humidity
    elements.humidity.textContent = `${data.main.humidity}%`;
    const dewPointCalc = data.main.temp - ((100 - data.main.humidity) / 5);
    elements.dewPoint.textContent = `Titik embun: ${dewPointCalc.toFixed(0)}° sekarang`;
    
    // Pressure
    elements.pressureValue.textContent = data.main.pressure;
    const pressurePercent = ((data.main.pressure - 950) / (1050 - 950)) * 100;
    const arcOffset = 125 - (pressurePercent / 100 * 125);
    elements.pressureArc.setAttribute('stroke-dashoffset', arcOffset);
    const needleAngle = -90 + (pressurePercent / 100 * 180);
    const needleRad = (needleAngle * Math.PI) / 180;
    const needleX = 60 + Math.cos(needleRad) * 35;
    const needleY = 70 + Math.sin(needleRad) * 35;
    elements.pressureNeedle.setAttribute('x2', needleX);
    elements.pressureNeedle.setAttribute('y2', needleY);
    
    // Moon phase (simulasi)
    const moonPhases = ['Bulan Baru', 'Sabit Muda', 'Separuh Muda', 'Cembung Muda', 
                        'Bulan Purnama', 'Cembung Tua', 'Separuh Tua', 'Sabit Tua'];
    const moonPhase = Math.floor(Math.random() * 8);
    elements.moonPhaseName.textContent = moonPhases[moonPhase].toUpperCase();
    elements.moonIllumination.textContent = `${Math.floor(Math.random() * 40 + 60)}%`;
    const moonrise = new Date(Date.now() + Math.random() * 86400000);
    elements.moonriseTime.textContent = formatTime(moonrise);
    elements.nextFullMoon.textContent = `${Math.floor(Math.random() * 14 + 7)} hr`;
    
    // Show content
    elements.weatherContent.style.display = 'block';
};

const displayHourlyForecast = (forecastData) => {
    elements.hourlyContainer.innerHTML = '';
    const hourlyData = forecastData.list.slice(0, 8);
    
    hourlyData.forEach((item, index) => {
        const time = new Date(item.dt * 1000);
        const isNow = index === 0;
        const icon = weatherIcons[item.weather[0].icon] || '️';
        const pop = Math.round(item.pop * 100);
        
        const hourlyItem = document.createElement('div');
        hourlyItem.className = 'hourly-item';
        hourlyItem.style.animationDelay = `${index * 0.1}s`;
        hourlyItem.innerHTML = `
            <div class="time">${isNow ? 'Sekarang' : formatTime(time)}</div>
            <div class="icon">${icon}</div>
            <div class="temp">${Math.round(item.main.temp)}°</div>
            ${pop > 0 ? `<div class="precip">${pop}%</div>` : ''}
        `;
        elements.hourlyContainer.appendChild(hourlyItem);
    });
};

const displayForecast = (forecastData) => {
    elements.forecastContainer.innerHTML = '';
    
    const dailyData = {};
    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData[date]) {
            dailyData[date] = { temps: [], icons: [], pops: [] };
        }
        dailyData[date].temps.push(item.main.temp);
        dailyData[date].icons.push(item.weather[0].icon);
        dailyData[date].pops.push(item.pop);
    });
    
    const days = Object.entries(dailyData).slice(0, 10);
    const allTemps = forecastData.list.map(item => item.main.temp);
    const globalMin = Math.min(...allTemps);
    const globalMax = Math.max(...allTemps);
    const tempRange = globalMax - globalMin || 1;
    
    days.forEach(([date, data], index) => {
        const dayDate = new Date(date);
        const isToday = index === 0;
        const dayName = isToday ? 'Hari Ini' : 
                       dayDate.toLocaleDateString('id-ID', { weekday: 'short' });
        
        const minTemp = Math.round(Math.min(...data.temps));
        const maxTemp = Math.round(Math.max(...data.temps));
        const maxPop = Math.round(Math.max(...data.pops) * 100);
        const icon = weatherIcons[data.icons[Math.floor(data.icons.length / 2)]] || '🌤️';
        
        const barLeft = ((minTemp - globalMin) / tempRange) * 100;
        const barWidth = ((maxTemp - minTemp) / tempRange) * 100;
        
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.style.animationDelay = `${index * 0.05}s`;
        forecastDay.innerHTML = `
            <div class="day-name">${dayName}</div>
            <div class="day-icon">
                ${icon}
                ${maxPop > 0 ? `<span class="precip-chance">${maxPop}%</span>` : ''}
            </div>
            <div class="temp-range">
                <span class="temp-low">${minTemp}°</span>
                <div class="temp-bar">
                    <div class="temp-bar-fill" style="left: ${barLeft}%; width: ${Math.max(barWidth, 5)}%"></div>
                </div>
                <span class="temp-high">${maxTemp}°</span>
            </div>
        `;
        elements.forecastContainer.appendChild(forecastDay);
    });
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const getWindDirection = (deg) => {
    const directions = ['U', 'UTL', 'TL', 'TTL', 'T', 'TGL', 'GL', 'SGL', 
                       'S', 'SBD', 'BD', 'BBD', 'B', 'UBL', 'BL', 'UBL'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
};

const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

// ============================================
// MAIN SEARCH FUNCTION
// ============================================

const searchWeather = async (city) => {
    if (!city.trim()) {
        showError('Silakan masukkan nama kota!');
        return;
    }
    
    showLoading();
    
    try {
        const weatherData = await fetchWeatherData(city);
        const forecastData = await fetchForecastData(weatherData.coord.lat, weatherData.coord.lon);
        
        displayCurrentWeather(weatherData);
        displayHourlyForecast(forecastData);
        displayForecast(forecastData);
        
        hideLoading();
    } catch (error) {
        showError(error.message);
    }
};

const searchByLocation = () => {
    if (!navigator.geolocation) {
        showError('Browser tidak mendukung geolocation.');
        return;
    }
    
    showLoading();
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const weatherData = await fetchWeatherByCoords(latitude, longitude);
                const forecastData = await fetchForecastData(latitude, longitude);
                
                displayCurrentWeather(weatherData);
                displayHourlyForecast(forecastData);
                displayForecast(forecastData);
                
                hideLoading();
            } catch (error) {
                showError(error.message);
            }
        },
        (error) => {
            let message = 'Gagal mendapatkan lokasi.';
            if (error.code === 1) message = 'Izin lokasi ditolak. Aktifkan izin lokasi di browser.';
            else if (error.code === 2) message = 'Lokasi tidak tersedia. Pastikan GPS aktif.';
            else if (error.code === 3) message = 'Timeout. Silakan coba lagi.';
            showError(message);
        }
    );
};

// ============================================
// UI STATE FUNCTIONS
// ============================================

const showLoading = () => {
    elements.loading.style.display = 'block';
    elements.errorMessage.style.display = 'none';
    elements.weatherContent.style.display = 'none';
};

const hideLoading = () => {
    elements.loading.style.display = 'none';
};

const showError = (message) => {
    hideLoading();
    elements.errorMessage.textContent = message;
    elements.errorMessage.style.display = 'block';
    elements.weatherContent.style.display = 'none';
};

// ============================================
// EVENT LISTENERS
// ============================================

elements.searchBtn.addEventListener('click', () => {
    searchWeather(elements.cityInput.value);
});

elements.cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather(elements.cityInput.value);
    }
});

elements.geoBtn.addEventListener('click', searchByLocation);

document.getElementById('mapNavBtn').addEventListener('click', () => {
    document.querySelector('.map-section').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('locationNavBtn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('menuNavBtn').addEventListener('click', () => {
    document.querySelector('.details-grid').scrollIntoView({ behavior: 'smooth' });
});

// ============================================
// INITIALIZATION
// ============================================

const init = () => {
    searchWeather('Jakarta');
};

window.addEventListener('load', init);