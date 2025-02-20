import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useColorScheme, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, interpolate, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const dummyArticles = [
  {
    id: '1',
    brand: 'PEOPLE',
    title: 'Taylor Swift and Travis Kelce: Inside Their Whirlwind Romance',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9zwTAD6gKsOlkybtSSBfc-UR56k4Omlx0Vg&s', // Replace with a responsive image URL
    category: 'Celebrity',
    readTime: '5 min read',
    type: 'article'
  },
  {
    id: '2',
    brand: 'ENTERTAINMENT WEEKLY',
    title: 'The Last of Us Season 2: Everything We Know So Far',
    image: 'https://example.com/last-of-us-responsive.jpg', // Replace with a responsive image URL
    category: 'TV',
    readTime: '8 min read',
    type: 'video'
  },
  {
    id: '3',
    brand: 'INSTYLE',
    title: 'Spring Fashion Trends That Will Dominate 2024',
    image: 'https://example.com/spring-fashion-responsive.jpg', // Replace with a responsive image URL
    category: 'Fashion',
    readTime: '6 min read',
    type: 'article'
  },
  {
    id: '4',
    brand: 'BRIDES',
    title: "Modern Wedding Trends: What's Hot for 2024",
    image: 'https://example.com/wedding-trends-responsive.jpg', // Replace with a responsive image URL
    category: 'Weddings',
    readTime: '7 min read',
    type: 'podcast'
  }
]


const brandColors = {
  'PEOPLE': '#E31837',
  'ENTERTAINMENT WEEKLY': '#2C5282',
  'INSTYLE': '#805AD5',
  'BRIDES': '#38A169'
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeFilter, setActiveFilter] = useState('For You');
  const [likedArticles, setLikedArticles] = useState<string[]>([]);

  const filters = ['For You', 'PEOPLE', 'ENTERTAINMENT WEEKLY', 'INSTYLE', 'BRIDES'];

  const filteredArticles = activeFilter === 'For You' 
    ? dummyArticles 
    : dummyArticles.filter(article => article.brand === activeFilter);

  const toggleLike = useCallback((id: string) => {
    setLikedArticles(prev => 
      prev.includes(id) ? prev.filter(articleId => articleId !== id) : [...prev, id]
    );
  }, []);

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.logo, isDark && styles.textDark]}>C A R N I V A L</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilter,
                activeFilter === filter && { backgroundColor: filter !== 'All' ? brandColors[filter] : '#FF3B30' },
                isDark && styles.filterButtonDark,
              ]}>
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText,
                  isDark && styles.textDark,
                ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {filteredArticles.map((article, index) => (
          <Animated.View
            key={article.id}
            entering={FadeInUp.delay(index * 200).springify()}
            style={[styles.articleCard, isDark && styles.articleCardDark]}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: article.image }} style={styles.articleImage} />
              <View style={[styles.brandTag, { backgroundColor: brandColors[article.brand] }]}>
                <Text style={styles.brandTagText}>{article.brand}</Text>
              </View>
              <TouchableOpacity 
                style={styles.likeButton}
                onPress={() => toggleLike(article.id)}
              >
                <Ionicons 
                  name={likedArticles.includes(article.id) ? "heart" : "heart-outline"} 
                  size={24} 
                  color={likedArticles.includes(article.id) ? "#FF3B30" : "#FFFFFF"} 
                />
              </TouchableOpacity>
            </View>
            <View style={styles.articleContent}>
              <Text style={[styles.title, isDark && styles.textDark]}>{article.title}</Text>
              <View style={styles.articleMeta}>
                <View style={styles.metaLeft}>
                  <View style={styles.typeContainer}>
                    <Ionicons 
                      name={article.type === 'video' ? 'play-circle' : article.type === 'podcast' ? 'mic' : 'document-text'} 
                      size={16} 
                      color={isDark ? '#FFFFFF' : '#666666'} 
                    />
                    <Text style={[styles.category, isDark && styles.textDark]}>
                      {article.category}
                    </Text>
                  </View>
                  <Text style={[styles.readTime, isDark && styles.textDark]}>
                    {article.readTime}
                  </Text>
                </View>
                <TouchableOpacity style={styles.shareButton}>
                  <Ionicons name="share-outline" size={20} color={isDark ? '#FFFFFF' : '#666666'} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'System',
  },
  searchButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  filterWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  filterContainer: {
    flexGrow: 0,
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonDark: {
    backgroundColor: '#333333',
  },
  activeFilter: {
    backgroundColor: '#FF3B30',
  },
  filterText: {
    color: '#666666',
    fontWeight: '600',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
  },
  articleCard: {
    marginBottom: 25,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  articleCardDark: {
    backgroundColor: '#2A2A2A',
  },
  imageContainer: {
    position: 'relative',
    height: 220,
  },
  articleImage: {
    width: '100%',
    height: '100%',
  },
  brandTag: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  brandTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  likeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  articleContent: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000000',
    lineHeight: 28,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  category: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  readTime: {
    fontSize: 14,
    color: '#666666',
  },
  shareButton: {
    padding: 8,
  },
  textDark: {
    color: '#FFFFFF',
  },
});