import { WEATHER_API_KEY, WEATHER_BASE_URL } from '@/utils/config';

interface WeatherData {
  temp: string;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

// Temporary mock function while API key activates
export async function getWeatherForCity(city: string): Promise<WeatherData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data
  const mockData: Record<string, WeatherData> = {
    'london': {
      temp: '18°C',
      condition: 'Cloudy',
      humidity: 78,
      windSpeed: 4.2,
      icon: '04d',
    },
    'tokyo': {
      temp: '25°C',
      condition: 'Clear',
      humidity: 65,
      windSpeed: 3.1,
      icon: '01d',
    },
    'new york': {
      temp: '22°C',
      condition: 'Partly Cloudy',
      humidity: 72,
      windSpeed: 5.5,
      icon: '02d',
    },
    'paris': {
      temp: '20°C',
      condition: 'Light Rain',
      humidity: 82,
      windSpeed: 3.8,
      icon: '10d',
    },
    // Default data for any other city
    'default': {
      temp: '20°C',
      condition: 'Clear',
      humidity: 70,
      windSpeed: 3.5,
      icon: '01d',
    }
  };

  const cityKey = city.toLowerCase();
  return mockData[cityKey] || mockData.default;
} 