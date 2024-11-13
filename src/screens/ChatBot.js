// screens/Explore.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ChatBotModal from '../components/ChatBotModal';

const { width } = Dimensions.get('window');

const ChatBot = () => {
  const [showChatBot, setShowChatBot] = useState(false);

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#0066CC" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chat Bot Assistant</Text>
            <Text style={styles.headerSubtitle}>24/7 Support</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Card container */}
          <View style={styles.card}>
            <Image
              source={require('../../assets/LOGOREL.png')}
              style={styles.botImage}
              resizeMode="contain"
            />
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>AI Chat Assistant</Text>
              <Text style={styles.description}>
                Tanyakan apa saja seputar mobil kepada AI Assistant kami. Dapatkan informasi
                tentang spesifikasi, harga, dan fitur mobil dengan cepat dan akurat.
              </Text>
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Icon name="time-outline" size={24} color="#0066CC" />
                <Text style={styles.featureText}>Respon Cepat</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="shield-checkmark-outline" size={24} color="#0066CC" />
                <Text style={styles.featureText}>Info Akurat</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="car-outline" size={24} color="#0066CC" />
                <Text style={styles.featureText}>Data Lengkap</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => setShowChatBot(true)}
              activeOpacity={0.8}
            >
              <Icon name="chatbubble-outline" size={24} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Mulai Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ChatBotModal
          visible={showChatBot}
          onClose={() => setShowChatBot(false)}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#0066CC',
    marginTop: -45
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    backgroundColor: '#0066CC',
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    marginTop: 30,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: -30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  botImage: {
    width: width * 0.5,
    height: width * 0.5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    marginTop: 16,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    marginTop: 8,
    fontSize: 14,
    color: '#4A4A4A',
    fontWeight: '500',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066CC',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#0066CC',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
});

export default ChatBot;