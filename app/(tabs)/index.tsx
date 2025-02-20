import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useColorScheme, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const dummyArticles = [
  {
    id: '8',
    brand: 'ENTERTAINMENT WEEKLY',
    title: 'Top 10 Must-Watch TV Shows of 2023',
    image: 'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=800&auto=format&fit=crop',
    category: 'TV',
    readTime: '7 min read',
    type: 'article'
  },
  {
    id: '1',
    brand: 'PEOPLE',
    title: 'Taylor Swift and Travis Kelce: Inside Their Whirlwind Romance',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9zwTAD6gKsOlkybtSSBfc-UR56k4Omlx0Vg&s',
    category: 'Celebrity',
    readTime: '5 min read',
    type: 'article'
  },
  {
    id: '14',
    brand: 'BRIDES',
    title: 'How to Plan the Perfect Destination Wedding',
    image: 'https://www.varmalla.com/wp-content/uploads/2023/11/103587-weddingnama3.jpeg',
    category: 'Weddings',
    readTime: '6 min read',
    type: 'article'
  },
  {
    id: '3',
    brand: 'INSTYLE',
    title: 'Spring Fashion Trends That Will Dominate 2024',
    image: 'https://assets.vogue.com/photos/65cfb6e3c838846cb84b384b/1:1/w_1280,h_1280,c_limit/ss24_collage_cover.jpg',
    category: 'Fashion',
    readTime: '6 min read',
    type: 'article'
  },
  {
    id: '5',
    brand: 'PEOPLE',
    title: 'Hollywood’s Biggest Stars: Behind the Scenes',
    image: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=800&auto=format&fit=crop',
    category: 'Celebrity',
    readTime: '6 min read',
    type: 'video'
  },
  {
    id: '10',
    brand: 'ENTERTAINMENT WEEKLY',
    title: 'The Evolution of Streaming Services',
    image: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?w=800&auto=format&fit=crop',
    category: 'TV',
    readTime: '6 min read',
    type: 'video'
  },
  {
    id: '11',
    brand: 'INSTYLE',
    title: 'How to Style Your Wardrobe for Every Season',
    image: 'https://i.ytimg.com/vi/EuIo-k9v47c/maxresdefault.jpg',
    category: 'Fashion',
    readTime: '5 min read',
    type: 'video'
  },
  {
    id: '2',
    brand: 'ENTERTAINMENT WEEKLY',
    title: 'The Last of Us Season 2: Everything We Know So Far',
    image: 'https://www.nme.com/wp-content/uploads/2023/01/The_Last_Of_Us-696x442.jpg',
    category: 'TV',
    readTime: '8 min read',
    type: 'video'
  },
  {
    id: '16',
    brand: 'BRIDES',
    title: 'Bridal Beauty: Tips for Your Big Day',
    image: 'https://images.unsplash.com/photo-1521805103420-1f3b9c5c2a4f?w=800&auto=format&fit=crop',
    category: 'Weddings',
    readTime: '4 min read',
    type: 'podcast'
  },
  {
    id: '7',
    brand: 'PEOPLE',
    title: 'Celebrity Fashion: Best and Worst Dressed',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop',
    category: 'Fashion',
    readTime: '5 min read',
    type: 'article'
  },
  {
    id: '4',
    brand: 'BRIDES',
    title: "Modern Wedding Trends: What's Hot for 2024",
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop',
    category: 'Weddings',
    readTime: '7 min read',
    type: 'podcast'
  },
  {
    id: '6',
    brand: 'PEOPLE',
    title: 'Exclusive: Interviews with the Stars of 2025',
    image: 'https://media.vanityfair.com/photos/672287c039cf8e19f5b54c33/master/w_3940%2Cc_limit/VF1224_Cover_embed-on-site.jpg',
    category: 'Celebrity',
    readTime: '4 min read',
    type: 'podcast'
  },
  {
    id: '9',
    brand: 'ENTERTAINMENT WEEKLY',
    title: 'Movie Magic: Behind the Scenes of Blockbusters',
    image: 'https://i.ytimg.com/vi/CAHRJ5t7kp8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDEBpNfYUauMYV5jHj1X2HgKiwuMA',
    category: 'Movies',
    readTime: '5 min read',
    type: 'podcast'
  },
  {
    id: '12',
    brand: 'INSTYLE',
    title: 'The Best Accessories to Elevate Your Look',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop',
    category: 'Fashion',
    readTime: '4 min read',
    type: 'podcast'
  },
  {
    id: '15',
    brand: 'BRIDES',
    title: 'Top Wedding Venues You Need to Know About',
    image: 'https://media.weddingz.in/images/0d7c76d728071819720d4c4d6a0d9764/best-luxury-wedding-venues-in-jodhpur-for-a-regal-wedding-ceremony.jpg',
    category: 'Weddings',
    readTime: '5 min read',
    type: 'video'
  },
  {
    id: '13',
    brand: 'INSTYLE',
    title: 'Sustainable Fashion: The Future of Style',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop',
    category: 'Fashion',
    readTime: '6 min read',
    type: 'article'
  }
];


const brandColors = {
  'PEOPLE': '#E31837',
  'ENTERTAINMENT WEEKLY': '#2C5282',
  'INSTYLE': '#805AD5',
  'BRIDES': '#38A169',
  primary: '#E31837', // Cosmo red
  secondary: '#000000',
  background: '#FFFFFF',
  backgroundDark: '#000000',
  text: '#000000',
  textDark: '#FFFFFF',
  accent: '#FF3B30',
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
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text style={[styles.logo, isDark && styles.textDark]}>CARNIVAL</Text>
        <TouchableOpacity style={[styles.searchButton, isDark && styles.searchButtonDark]}>
          <Ionicons name="search" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
      </View>

      <View style={[styles.filterWrapper, isDark && styles.filterWrapperDark]}>
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
                activeFilter === filter && { backgroundColor: filter !== 'For You' ? brandColors[filter] : brandColors.primary },
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
                  color={likedArticles.includes(article.id) ? brandColors.primary : '#FFFFFF'} 
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
    backgroundColor: brandColors.background,
  },
  containerDark: {
    backgroundColor: brandColors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: brandColors.background,
  },
  headerDark: {
    backgroundColor: brandColors.backgroundDark,
    borderBottomColor: '#333333',
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: brandColors.text,
    fontFamily: 'System',
    letterSpacing: 1,
  },
  searchButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  searchButtonDark: {
    backgroundColor: '#333333',
  },
  filterWrapper: {
    backgroundColor: brandColors.background,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  filterWrapperDark: {
    backgroundColor: brandColors.backgroundDark,
    borderBottomColor: '#333333',
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
    backgroundColor: brandColors.primary,
  },
  filterText: {
    color: '#666666',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
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
    backgroundColor: brandColors.background,
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
    resizeMode: 'cover',
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
    letterSpacing: 0.5,
    textTransform: 'uppercase',
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
    color: brandColors.text,
    lineHeight: 28,
    letterSpacing: 0.5,
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
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  readTime: {
    fontSize: 14,
    color: '#666666',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  shareButton: {
    padding: 8,
  },
  textDark: {
    color: brandColors.textDark,
  },
});