import { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, useColorScheme, Dimensions, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Video } from 'expo-av';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const { width, height } = Dimensions.get('window');

const dummyVideos = [
  {
    id: '1',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-vlogger-recording-her-message-for-her-followers-41109-large.mp4',
    title: 'Behind the Scenes: Celebrity Interview',
    likes: 15234,
    comments: 892,
    description: 'Exclusive interview with the stars of the upcoming summer blockbuster.',
    products: [
      { id: '1', name: 'Camera Setup', price: '$2,499' },
      { id: '2', name: 'Studio Lights', price: '$599' }
    ]
  },
  {
    id: '2',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-vlogging-about-cooking-recipes-41103-large.mp4',
    title: 'Cooking with Stars',
    likes: 8567,
    comments: 456,
    description: 'Join celebrity chef Maria Rodriguez as she shares her secret pasta recipe.',
    products: [
      { id: '3', name: 'Chef\'s Knife Set', price: '$299' },
      { id: '4', name: 'Signature Cookbook', price: '$45' }
    ]
  },
  {
    id: '3',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-to-the-camera-for-her-vlog-41092-large.mp4',
    title: 'Red Carpet Fashion Review',
    likes: 12789,
    comments: 934,
    description: 'Breaking down the most stunning looks from last night\'s awards ceremony.',
    products: [
      { id: '5', name: 'Designer Dress', price: '$1,899' },
      { id: '6', name: 'Luxury Clutch', price: '$799' }
    ]
  },
  {
    id: '4',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-recording-her-podcast-or-vlog-41091-large.mp4',
    title: 'Music Industry Insider',
    likes: 9876,
    comments: 567,
    description: 'Exclusive scoop on the biggest upcoming album releases and music industry news.',
    products: [
      { id: '7', name: 'Pro Microphone', price: '$349' },
      { id: '8', name: 'Studio Headphones', price: '$249' }
    ]
  }
];

const dummyArticles = [
  {
    id: '1',
    title: 'The Rise of Streaming: How Digital Platforms are Reshaping Entertainment',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop',
    summary: 'An in-depth look at how streaming services are changing the entertainment landscape.',
    readTime: '8 min read'
  },
  {
    id: '2',
    title: 'Hollywood\'s New Era: The Impact of AI on Filmmaking',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop',
    summary: 'Exploring how artificial intelligence is revolutionizing movie production.',
    readTime: '6 min read'
  },
  {
    id: '3',
    title: 'The Evolution of Reality TV: From Big Brother to Social Media Stars',
    image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755182?w=800&auto=format&fit=crop',
    summary: 'Tracing the transformation of reality television in the digital age.',
    readTime: '5 min read'
  }
];

const dummyPodcasts = [
  {
    id: '1',
    title: 'Behind the Scenes with Sarah Johnson',
    host: 'Entertainment Weekly',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop',
    duration: '45 min',
    description: 'Weekly interviews with Hollywood\'s biggest stars',
    latestEpisode: 'The Making of Summer\'s Biggest Blockbuster'
  },
  {
    id: '2',
    title: 'The Music Hour',
    host: 'Rolling Stone',
    image: 'https://images.unsplash.com/photo-1516223725307-6f76b9182f7c?w=800&auto=format&fit=crop',
    duration: '60 min',
    description: 'Your daily dose of music industry news and artist interviews',
    latestEpisode: 'Exclusive: New Album Announcements'
  },
  {
    id: '3',
    title: 'Screen Time',
    host: 'Variety',
    image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&auto=format&fit=crop',
    duration: '30 min',
    description: 'Breaking down the latest in TV and streaming',
    latestEpisode: 'Streaming Wars: The Next Chapter'
  }
];

const viewabilityConfig = {
  itemVisiblePercentThreshold: 50
};

const brandColors = {
  primary: '#E31837', // Cosmo red
  secondary: '#000000',
  background: '#FFFFFF',
  backgroundDark: '#000000',
  text: '#000000',
  textDark: '#FFFFFF',
  accent: '#FF3B30',
};

export default function DiscoverScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState('videos');
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const videoRef = useRef(null);

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig,
      onViewableItemsChanged: ({ viewableItems }) => {
        if (viewableItems?.[0]) {
          setActiveVideoIndex(viewableItems[0].index);
        }
      }
    }
  ]);

  const handleCommentsPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const renderVideo = useCallback(({ item, index }) => (
    <View style={styles.videoContainer}>
      <Video
        ref={videoRef}
        source={{ uri: item.url }}
        style={styles.video}
        resizeMode="cover"
        isLooping
        shouldPlay={index === activeVideoIndex}
        isMuted={false}
      />
      <View style={styles.videoOverlay}>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <Text style={styles.videoDescription}>{item.description}</Text>
        </View>
        <View style={styles.interactionButtons}>
          <TouchableOpacity style={styles.interactionButton}>
            <Ionicons name="heart" size={28} color="#FF3B30" />
            <Text style={styles.interactionText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.interactionButton} onPress={handleCommentsPress}>
            <Ionicons name="chatbubble" size={26} color="#FFFFFF" />
            <Text style={styles.interactionText}>{item.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.interactionButton}>
            <Ionicons name="share-social" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.productsContainer}>
          {item.products.map((product) => (
            <TouchableOpacity key={product.id} style={styles.productTag}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  ), [activeVideoIndex, handleCommentsPress]);

  const renderArticle = useCallback(({ item }) => (
    <Animated.View
      entering={FadeInUp.springify()}
      style={[styles.articleCard, isDark && styles.articleCardDark]}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.articleImage}
        />
      </View>
      <View style={styles.articleContent}>
        <Text style={[styles.articleTitle, isDark && styles.textDark]}>{item.title}</Text>
        <Text style={[styles.articleSummary, isDark && styles.textDark]}>{item.summary}</Text>
        <Text style={[styles.readTime, isDark && styles.textDark]}>{item.readTime}</Text>
      </View>
    </Animated.View>
  ), [isDark]);

  const renderPodcast = useCallback(({ item }) => (
    <Animated.View
      entering={FadeInUp.springify()}
      style={[styles.podcastCard, isDark && styles.podcastCardDark]}
    >
      <View style={styles.podcastImageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.podcastImage}
        />
        <View style={styles.podcastOverlay}>
          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play-circle" size={50} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.podcastContent}>
        <View style={styles.podcastHeader}>
          <Text style={[styles.podcastTitle, isDark && styles.textDark]}>{item.title}</Text>
          <Text style={[styles.podcastHost, isDark && styles.textDark]}>{item.host}</Text>
        </View>
        <Text style={[styles.podcastDescription, isDark && styles.textDark]}>{item.description}</Text>
        <View style={styles.podcastMeta}>
          <View style={styles.episodeInfo}>
            <Ionicons name="time-outline" size={16} color={isDark ? '#FFFFFF' : '#666666'} />
            <Text style={[styles.duration, isDark && styles.textDark]}>{item.duration}</Text>
          </View>
          <Text style={[styles.latestEpisode, isDark && styles.textDark]}>Latest: {item.latestEpisode}</Text>
        </View>
      </View>
    </Animated.View>
  ), [isDark]);

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.textDark]}>DISCOVER</Text>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              onPress={() => setActiveTab('videos')}
              style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>
                VIDEOS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('articles')}
              style={[styles.tab, activeTab === 'articles' && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === 'articles' && styles.activeTabText]}>
                ARTICLES
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('podcasts')}
              style={[styles.tab, activeTab === 'podcasts' && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === 'podcasts' && styles.activeTabText]}>
                PODCASTS
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'videos' ? (
          <FlatList
            data={dummyVideos}
            renderItem={renderVideo}
            keyExtractor={(item) => item.id}
            pagingEnabled
            vertical
            showsVerticalScrollIndicator={false}
            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
          />
        ) : activeTab === 'articles' ? (
          <FlatList
            data={dummyArticles}
            renderItem={renderArticle}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.articlesContainer}
          />
        ) : (
          <FlatList
            data={dummyPodcasts}
            renderItem={renderPodcast}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.podcastsContainer}
          />
        )}

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={['50%', '90%']}
          backdropComponent={renderBackdrop}
          backgroundStyle={[styles.bottomSheet, isDark && styles.bottomSheetDark]}
        >
          <View style={styles.commentsContainer}>
            <Text style={[styles.commentsTitle, isDark && styles.textDark]}>COMMENTS</Text>
          </View>
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: brandColors.text,
    fontFamily: 'System',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 15,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activeTab: {
    backgroundColor: brandColors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  videoContainer: {
    width: width,
    height: height,
    backgroundColor: brandColors.backgroundDark,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  videoInfo: {
    marginTop: 'auto',
    marginBottom: 100,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  videoDescription: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  interactionButtons: {
    position: 'absolute',
    right: 20,
    bottom: 100,
  },
  interactionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  interactionText: {
    color: '#FFFFFF',
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  productsContainer: {
    position: 'absolute',
    left: 20,
    bottom: 100,
  },
  productTag: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: brandColors.text,
    letterSpacing: 0.5,
  },
  productPrice: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  bottomSheet: {
    backgroundColor: brandColors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetDark: {
    backgroundColor: '#2A2A2A',
  },
  commentsContainer: {
    padding: 20,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  articlesContainer: {
    padding: 20,
  },
  articleCard: {
    backgroundColor: brandColors.background,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  articleCardDark: {
    backgroundColor: '#2A2A2A',
  },
  imageContainer: {
    height: 200,
    width: '100%',
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: '100%',
  },
  articleContent: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: brandColors.text,
    letterSpacing: 0.5,
    lineHeight: 26,
  },
  articleSummary: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 22,
  },
  readTime: {
    fontSize: 12,
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  podcastsContainer: {
    padding: 20,
  },
  podcastCard: {
    backgroundColor: brandColors.background,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  podcastCardDark: {
    backgroundColor: '#2A2A2A',
  },
  podcastImageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  podcastImage: {
    width: '100%',
    height: '100%',
  },
  podcastOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(227,24,55,0.8)', // Cosmo red with opacity
    borderRadius: 30,
  },
  podcastContent: {
    padding: 16,
  },
  podcastHeader: {
    marginBottom: 8,
  },
  podcastTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: brandColors.text,
    marginBottom: 4,
    letterSpacing: 0.5,
    lineHeight: 26,
  },
  podcastHost: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  podcastDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  podcastMeta: {
    flexDirection: 'column',
    gap: 8,
  },
  episodeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  duration: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  latestEpisode: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  textDark: {
    color: brandColors.textDark,
  },
});