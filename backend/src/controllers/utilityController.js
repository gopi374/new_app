const getWeatherIconAndCondition = (weatherCode) => {
  if (weatherCode === 0) return { condition: 'Clear Sky', icon: '☀️' };
  if ([1, 2, 3].includes(weatherCode)) return { condition: 'Partly Cloudy', icon: '⛅' };
  if ([45, 48].includes(weatherCode)) return { condition: 'Foggy', icon: '🌫️' };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) return { condition: 'Rain', icon: '🌧️' };
  if ([71, 73, 75, 85, 86].includes(weatherCode)) return { condition: 'Snow', icon: '❄️' };
  if ([95, 96, 99].includes(weatherCode)) return { condition: 'Thunderstorm', icon: '⛈️' };
  return { condition: 'Sunny', icon: '☀️' };
};

const getWeather = async (req, res, next) => {
  try {
    const { city = 'Indore', lat, lng } = req.query;

    let temperature = 28;
    let condition = 'Sunny';
    let icon = '☀️';

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (!isNaN(latitude) && !isNaN(longitude)) {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        if (response.ok) {
          const json = await response.json();
          if (json.current_weather) {
            temperature = Math.round(json.current_weather.temperature);
            const meta = getWeatherIconAndCondition(json.current_weather.weathercode);
            condition = meta.condition;
            icon = meta.icon;
          }
        }
      } catch (e) {
        // Fallback
      }
    }

    // Return structured weather payload for location pill
    res.status(200).json({
      success: true,
      data: {
        city: city || 'Indore',
        temperature_celsius: temperature,
        condition,
        icon,
        humidity_percent: 45,
        wind_speed_kmh: 12,
        updated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getGovernmentUtilities = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        sos_helpline: {
          name: 'Tourist Police Emergency Line',
          number: '1363',
          available_hours: '24x7',
          icon: '🚨',
        },
        utilities: [
          {
            id: 'asi-ticketing',
            name: 'ASI Smart Ticketing',
            provider: 'Ministry of Culture',
            url: 'https://asi.payumoney.com/',
            icon: '🎫',
            description: 'Official online booking for UNESCO & national monuments.',
          },
          {
            id: 'audio-guides',
            name: 'Incredible India Audio Guide',
            provider: 'Ministry of Tourism',
            url: 'https://incredibleindia.org',
            icon: '🎧',
            description: 'Multilingual official audio walkthroughs.',
          },
          {
            id: 'clean-heritage',
            name: 'Swachh Bharat Clean Heritage',
            provider: 'Government of India',
            url: 'https://swachhbharatmission.gov.in',
            icon: '🧹',
            description: 'Report cleanliness issues at heritage sites.',
          },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWeather,
  getGovernmentUtilities,
};
