import { Image, StyleSheet, Platform, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useState } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getWeatherForCity } from '@/services/weatherService';

export default function HomeScreen() {
  const [cities, setCities] = useState(['', '', '', '']); // Four cities
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const updateCity = (index: number, value: string) => {
    const newCities = [...cities];
    newCities[index] = value;
    setCities(newCities);
  };

  const fetchWeatherComparison = async () => {
    if (cities.some(city => !city)) {
      alert('Please enter all cities');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching weather for cities:', cities);
      
      const weatherResults = await Promise.all(
        cities.map(city => getWeatherForCity(city))
      );
      
      setWeatherData({
        city1: weatherResults[0],
        city2: weatherResults[1],
        city3: weatherResults[2],
        city4: weatherResults[3],
      });
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Weather Comparison</ThemedText>
        
        <ThemedView style={styles.inputContainer}>
          {cities.map((city, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder={`Enter city ${index + 1}`}
              value={city}
              onChangeText={(value) => updateCity(index, value)}
              placeholderTextColor="#666"
            />
          ))}
          <TouchableOpacity 
            style={styles.button}
            onPress={fetchWeatherComparison}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Compare Weather</ThemedText>
            )}
          </TouchableOpacity>
        </ThemedView>

        {weatherData && (
          <ThemedView style={styles.resultsContainer}>
            {cities.map((city, index) => (
              <ThemedView key={index} style={styles.cityWeather}>
                <ThemedText type="subtitle">{city}</ThemedText>
                <Image 
                  source={{ uri: `http://openweathermap.org/img/wn/${weatherData[`city${index + 1}`].icon}@2x.png` }}
                  style={styles.weatherIcon}
                />
                <ThemedText>{weatherData[`city${index + 1}`].temp}</ThemedText>
                <ThemedText>{weatherData[`city${index + 1}`].condition}</ThemedText>
                <ThemedText>Humidity: {weatherData[`city${index + 1}`].humidity}%</ThemedText>
                <ThemedText>Wind: {weatherData[`city${index + 1}`].windSpeed} m/s</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  inputContainer: {
    gap: 12,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  cityWeather: {
    width: '48%', // Two columns
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
});
