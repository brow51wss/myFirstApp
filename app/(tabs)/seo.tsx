import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface URLRank extends URLRank {
  url: string;
  score: number;
  metrics: {
    pageSpeed: number;
    backlinks: number;
    organicTraffic: number;
    mobileOptimization: number;
  };
  targetLocation: string;
  domainAge: {
    years: number;
    months: number;
  };
}

export default function SEOScreen() {
  const [urls, setUrls] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [rankedUrls, setRankedUrls] = useState<URLRank[]>([]);

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const analyzeSEO = async () => {
    if (urls.some(url => !url)) {
      alert('Please enter all URLs');
      return;
    }

    setLoading(true);
    try {
      // Mock data with additional details
      const scored: URLRank[] = urls.map(url => ({
        url,
        score: Math.random() * 100,
        metrics: {
          pageSpeed: Math.round(Math.random() * 100),
          backlinks: Math.round(Math.random() * 10000),
          organicTraffic: Math.round(Math.random() * 50000),
          mobileOptimization: Math.round(Math.random() * 100),
        },
        targetLocation: ['United States', 'United Kingdom', 'Australia', 'Canada'][Math.floor(Math.random() * 4)],
        domainAge: {
          years: Math.floor(Math.random() * 20),
          months: Math.floor(Math.random() * 12),
        }
      }));

      const sorted = scored.sort((a, b) => b.score - a.score);
      setRankedUrls(sorted);
    } catch (error) {
      alert('Error analyzing URLs');
    } finally {
      setLoading(false);
    }
  };

  // Get background color based on rank
  const getRankColor = (index: number): string => {
    const colors = [
      '#FF6B6B', // Red (best)
      '#FF9E7D', // Orange-red
      '#B8E0F6', // Light blue
      '#E1F5FE', // Ice blue (worst)
    ];
    return colors[index];
  };

  const formatDomainAge = (age: { years: number; months: number }) => {
    const years = age.years > 0 ? `${age.years} year${age.years !== 1 ? 's' : ''}` : '';
    const months = age.months > 0 ? `${age.months} month${age.months !== 1 ? 's' : ''}` : '';
    return [years, months].filter(Boolean).join(' and ');
  };

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">SEO Analysis</ThemedText>
        
        <ThemedView style={styles.inputContainer}>
          {rankedUrls.length === 0 ? (
            // Initial input fields
            urls.map((url, index) => (
              <TextInput
                key={index}
                style={styles.input}
                placeholder={`Enter URL ${index + 1}`}
                value={url}
                onChangeText={(value) => updateUrl(index, value)}
                placeholderTextColor="#666"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            ))
          ) : (
            // Ranked results
            rankedUrls.map((rankData, index) => (
              <ThemedView 
                key={index} 
                style={[
                  styles.rankedContainer,
                  { backgroundColor: getRankColor(index) }
                ]}
              >
                <ThemedText type="subtitle">Rank #{index + 1}</ThemedText>
                <ThemedText style={styles.url}>{rankData.url}</ThemedText>
                <ThemedText style={styles.score}>Overall Score: {Math.round(rankData.score)}</ThemedText>
                
                <ThemedView style={styles.detailsContainer}>
                  <ThemedText style={styles.detailsTitle}>Metrics:</ThemedText>
                  <ThemedText>• Page Speed: {rankData.metrics.pageSpeed}%</ThemedText>
                  <ThemedText>• Backlinks: {rankData.metrics.backlinks.toLocaleString()}</ThemedText>
                  <ThemedText>• Organic Traffic: {rankData.metrics.organicTraffic.toLocaleString()}/month</ThemedText>
                  <ThemedText>• Mobile Score: {rankData.metrics.mobileOptimization}%</ThemedText>
                  
                  <ThemedText style={styles.detailsTitle}>Target Location:</ThemedText>
                  <ThemedText>{rankData.targetLocation}</ThemedText>
                  
                  <ThemedText style={styles.detailsTitle}>Domain Age:</ThemedText>
                  <ThemedText>{formatDomainAge(rankData.domainAge)}</ThemedText>
                </ThemedView>
              </ThemedView>
            ))
          )}
          
          {!rankedUrls.length && (
            <TouchableOpacity 
              style={styles.button}
              onPress={analyzeSEO}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Analyze SEO</ThemedText>
              )}
            </TouchableOpacity>
          )}

          {rankedUrls.length > 0 && (
            <TouchableOpacity 
              style={styles.button}
              onPress={() => {
                setRankedUrls([]);
                setUrls(['', '', '', '']);
              }}
            >
              <ThemedText style={styles.buttonText}>Start New Analysis</ThemedText>
            </TouchableOpacity>
          )}

          {rankedUrls.length > 0 && (
            <ThemedView style={styles.metricsExplanation}>
              <ThemedText type="subtitle">Analysis Metrics:</ThemedText>
              <ThemedText>• Page Speed: Load time and performance</ThemedText>
              <ThemedText>• Backlinks: Number of referring domains</ThemedText>
              <ThemedText>• Organic Traffic: Monthly visitors</ThemedText>
              <ThemedText>• Mobile Optimization: Mobile-friendliness score</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
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
  rankedContainer: {
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  metricsExplanation: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 4,
  },
  detailsContainer: {
    marginTop: 8,
    gap: 4,
  },
  detailsTitle: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  url: {
    fontSize: 16,
    fontWeight: '500',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
  },
}); 