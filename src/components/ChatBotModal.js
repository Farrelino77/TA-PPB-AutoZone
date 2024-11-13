// components/ChatBotModal.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const ChatBotModal = ({ visible, onClose }) => {
  const [message, setMessage] = useState('');
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [initialScrollPosition, setInitialScrollPosition] = useState(0);
  const [chatHistory, setChatHistory] = useState([
    {
      id: '1',
      type: 'bot',
      message: 'Halo! Saya adalah AI Assistant yang siap membantu Anda mencari informasi tentang mobil. Apa yang ingin Anda ketahui?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setInitialScrollPosition(0);
    }
  }, [visible]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardStatus(true);
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardStatus(false);
        flatListRef.current?.scrollToOffset({ 
          offset: initialScrollPosition,
          animated: true 
        });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [initialScrollPosition]);

  const suggestedQuestions = [
    "Apa saja syarat kredit mobil?",
    "Berapa DP minimal untuk kredit?",
    "Ada mobil bekas dibawah 100 juta?",
    "Bagaimana proses nego harga?",
    "Apakah tersedia test drive?"
  ];

  const handleSend = (text = message) => {
    if (text.trim() === '') return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: text.trim()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: getBotResponse(text.trim())
      };
      setChatHistory(prev => [...prev, botResponse]);
      setIsLoading(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
  };

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('syarat') && lowerMessage.includes('kredit')) {
      return 'Syarat kredit mobil:\n\n1. KTP Suami & Istri\n2. Kartu Keluarga\n3. Slip Gaji / SKU Usaha\n4. Rekening koran 3 bulan terakhir\n5. PBB/Sertifikat Rumah';
    } else if (lowerMessage.includes('dp') || (lowerMessage.includes('uang') && lowerMessage.includes('muka'))) {
      return 'DP minimal untuk kredit mobil baru mulai dari 15-20% dari harga mobil. Untuk mobil bekas, DP minimal biasanya 25-30%. Kami menyediakan berbagai skema kredit yang bisa disesuaikan dengan kemampuan Anda.';
    } else if (lowerMessage.includes('100 juta') || lowerMessage.includes('bekas')) {
      return 'Ya, kami memiliki beberapa pilihan mobil bekas berkualitas di bawah 100 juta, seperti:\n\n- Toyota Avanza (2015-2016)\n- Daihatsu Xenia (2016-2017)\n- Honda Brio (2015-2016)\n\nSemua unit sudah melalui inspeksi ketat dan memiliki garansi mesin.';
    } else if (lowerMessage.includes('nego')) {
      return 'Anda bisa melakukan negosiasi harga dengan cara:\n\n1. Datang langsung ke showroom\n2. Diskusi dengan sales\n3. Bandingkan dengan harga pasaran\n\nKami selalu terbuka untuk negosiasi yang wajar.';
    } else if (lowerMessage.includes('test drive')) {
      return 'Ya, kami menyediakan layanan test drive untuk semua mobil yang Anda minati. Syaratnya:\n\n1. Membawa KTP\n2. SIM A aktif\n3. Reservasi minimal H-1\n\nSilakan hubungi sales kami untuk mengatur jadwal test drive.';
    } else {
      return 'Maaf, saya tidak memahami pertanyaan Anda. Silakan pilih pertanyaan yang tersedia atau ajukan pertanyaan yang lebih spesifik tentang mobil.';
    }
  };

  const renderChatItem = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.type === 'user' ? styles.userMessage : styles.botMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.type === 'user' ? styles.userMessageText : styles.botMessageText
      ]}>{item.message}</Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.suggestedContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestedContent}
          >
            {suggestedQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestedItem}
                onPress={() => handleSend(question)}
              >
                <Text style={styles.suggestedText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 5 : 0}
          style={{ flex: 1 }}
        >
          <FlatList
            ref={flatListRef}
            data={chatHistory}
            renderItem={renderChatItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.chatContainer}
            onContentSizeChange={() => {
              if (keyboardStatus) {
                flatListRef.current?.scrollToEnd({ animated: true });
              }
            }}
            onScroll={(event) => {
              if (!keyboardStatus) {
                setInitialScrollPosition(event.nativeEvent.contentOffset.y);
              }
            }}
            scrollEventThrottle={16}
          />

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0066CC" />
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ketik pesan Anda..."
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.sendButton, message.trim() ? styles.sendButtonActive : {}]}
              onPress={() => handleSend()}
              disabled={!message.trim()}
            >
              <Icon 
                name="send" 
                size={24} 
                color={message.trim() ? "#FFFFFF" : "#A0A0A0"} 
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  closeButton: {
    padding: 8,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  onlineText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  headerRight: {
    width: 40,
  },
  suggestedContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestedContent: {
    paddingHorizontal: 4,
  },
  suggestedItem: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  suggestedText: {
    fontSize: 14,
    color: '#333333',
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    backgroundColor: '#0066CC',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#F5F5F5',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: '#000000',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingRight: 48,
    marginRight: 8,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#0066CC',
  },
});

export default ChatBotModal;