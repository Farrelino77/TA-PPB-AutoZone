// screens/Home.js
import React, { useState, useEffect } from 'react';
import { 
 View, 
 Text, 
 FlatList, 
 StyleSheet, 
 ActivityIndicator,
 Image,
 TouchableOpacity,
 TextInput,
 ScrollView,
 StatusBar,
 SafeAreaView,
 Dimensions
} from 'react-native';
import { getCars } from '../service/CarsService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CarModal from '../components/CarModal';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const Home = () => {
 const [cars, setCars] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedCategory, setSelectedCategory] = useState('All');
 const [selectedCar, setSelectedCar] = useState(null);
 const [modalVisible, setModalVisible] = useState(false);
 const [imageLoadingStates, setImageLoadingStates] = useState({});

 const categories = ['All', 'SUV', 'Sedan', 'Hatchback', 'Coupe'];

 const quickCategories = [
   { id: 'new', icon: 'directions-car', label: 'Mobil Baru' },
   { id: 'used', icon: 'time-to-leave', label: 'Mobil Bekas' },
   { id: 'service', icon: 'build', label: 'Service' },
   { id: 'credit', icon: 'credit-card', label: 'Kredit' },
 ];

 useEffect(() => {
   fetchCars();
 }, []);

 const fetchCars = async () => {
   try {
     const response = await getCars();
     const carsArray = Object.keys(response).map(key => ({
       ...response[key],
       firebaseId: key
     }));
     setCars(carsArray);
     setLoading(false);
   } catch (err) {
     setError('Failed to fetch cars');
     setLoading(false);
   }
 };

 const handleCarPress = (car) => {
   setSelectedCar(car);
   setModalVisible(true);
 };

 const handleImageLoadStart = (itemId) => {
   setImageLoadingStates(prev => ({
     ...prev,
     [itemId]: true
   }));
 };

 const handleImageLoadEnd = (itemId) => {
   setImageLoadingStates(prev => ({
     ...prev,
     [itemId]: false
   }));
 };

 const filteredCars = cars.filter(car => {
   const matchesSearch = car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        car.model.toLowerCase().includes(searchQuery.toLowerCase());
   const matchesCategory = selectedCategory === 'All' || car.type === selectedCategory;
   return matchesSearch && matchesCategory;
 });

 const formatPrice = (price) => {
   return `$ ${price.toLocaleString('en-US', {
     maximumFractionDigits: 0,
     minimumFractionDigits: 0
   })}`;
 };

 const renderCarItem = ({ item }) => (
   <TouchableOpacity 
     style={styles.card}
     onPress={() => handleCarPress(item)}
     activeOpacity={0.9}
   >
     <View style={styles.imageContainer}>
       <Image 
         source={{ uri: item.image }} 
         style={styles.image}
         resizeMode="cover"
         onLoadStart={() => handleImageLoadStart(item.firebaseId)}
         onLoadEnd={() => handleImageLoadEnd(item.firebaseId)}
       />
       {imageLoadingStates[item.firebaseId] && (
         <View style={styles.imageLoading}>
           <ActivityIndicator size="small" color="#1a73e8" />
         </View>
       )}
     </View>
     <View style={styles.contentBadge}>
       <View style={styles.badge}>
         <Text style={styles.badgeText}>New</Text>
       </View>
     </View>
     <View style={styles.content}>
       <Text style={styles.brand}>{item.brand}</Text>
       <Text style={styles.model}>{item.model} ({item.year})</Text>
       <Text style={styles.price}>{formatPrice(item.price)}</Text>
       <View style={styles.specList}>
         <View style={styles.specItem}>
           <Icon name="settings" size={14} color="#858585" />
           <Text style={styles.spec}>{item.transmission}</Text>
         </View>
         <View style={styles.specItem}>
           <Icon name="local-gas-station" size={14} color="#858585" />
           <Text style={styles.spec}>{item.fuelType}</Text>
         </View>
         <View style={styles.specItem}>
           <Icon name="event-seat" size={14} color="#858585" />
           <Text style={styles.spec}>{item.seatingCapacity} Seats</Text>
         </View>
       </View>
     </View>
   </TouchableOpacity>
 );

 if (loading) {
   return (
     <View style={styles.centered}>
       <ActivityIndicator size="large" color="#4A6572" />
     </View>
   );
 }

 if (error) {
   return (
     <View style={styles.centered}>
       <Text style={styles.error}>{error}</Text>
     </View>
   );
 }

 return (
   <SafeAreaView style={styles.container}>
     <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
     
     {/* Main Header */}
     <View style={styles.mainHeader}>
       <View style={styles.headerLeft}>
         <Image 
           source={require('../../assets/LOGOREL.png')}
           style={styles.logo}
           resizeMode="contain"
         />
       </View>
       <TouchableOpacity style={styles.profileButton}>
         <Icon name="person" size={20} color="#000" />
       </TouchableOpacity>
     </View>

     {/* Search Header */}
     <View style={styles.header}>
       <View style={styles.searchContainer}>
         <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
         <TextInput
           style={styles.searchInput}
           placeholder="Search cars..."
           placeholderTextColor="#858585"
           value={searchQuery}
           onChangeText={setSearchQuery}
         />
         <TouchableOpacity style={styles.filterButton}>
           <Icon name="tune" size={20} color="#4A6572" />
         </TouchableOpacity>
       </View>
     </View>

     {/* Quick Categories */}
     <View style={styles.quickCategoriesContainer}>
       {quickCategories.map((category) => (
         <TouchableOpacity
           key={category.id}
           style={styles.quickCategoryButton}
           onPress={() => console.log(category.id)}
         >
           <View style={styles.quickCategoryIcon}>
             <Icon name={category.icon} size={24} color="#1a73e8" />
           </View>
           <Text style={styles.quickCategoryText}>{category.label}</Text>
         </TouchableOpacity>
       ))}
     </View>

     {/* Categories */}
     <View style={styles.categoriesContainer}>
       <ScrollView 
         horizontal 
         showsHorizontalScrollIndicator={false}
         contentContainerStyle={styles.categories}
       >
         {categories.map((category) => (
           <TouchableOpacity
             key={category}
             style={[
               styles.categoryButton,
               selectedCategory === category && styles.categoryButtonActive
             ]}
             onPress={() => setSelectedCategory(category)}
           >
             <Text style={[
               styles.categoryText,
               selectedCategory === category && styles.categoryTextActive
             ]}>
               {category}
             </Text>
           </TouchableOpacity>
         ))}
       </ScrollView>
     </View>

     {/* Car List */}
     <FlatList
       data={filteredCars}
       keyExtractor={item => item.firebaseId}
       renderItem={renderCarItem}
       contentContainerStyle={styles.list}
       showsVerticalScrollIndicator={false}
       numColumns={2}
       columnWrapperStyle={styles.row}
     />

     {/* Bottom Navigation */}
     <View style={styles.bottomNav}>
       <TouchableOpacity style={styles.navItem}>
         <Icon name="home" size={24} color="#FF4165" />
         <Text style={[styles.navText, { color: "#FF4165" }]}>Beranda</Text>
       </TouchableOpacity>
       <TouchableOpacity style={styles.navItem}>
         <Icon name="explore" size={24} color="#858585" />
         <Text style={styles.navText}>Jelajah</Text>
       </TouchableOpacity>
       <TouchableOpacity style={styles.navItem}>
         <Icon name="person-outline" size={24} color="#858585" />
         <Text style={styles.navText}>Profil</Text>
       </TouchableOpacity>
     </View>

     {/* Car Modal */}
     <CarModal 
       visible={modalVisible}
       car={selectedCar}
       onClose={() => setModalVisible(false)}
     />
   </SafeAreaView>
 );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F6F8FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F8FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  filterButton: {
    padding: 4,
  },
  quickCategoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  quickCategoryButton: {
    alignItems: 'center',
    width: '23%',
  },
  quickCategoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickCategoryText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  categoriesContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
  },
  categories: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F6F8FA',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#1a73e8',
  },
  categoryText: {
    fontSize: 14,
    color: '#858585',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  row: {
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '100%',
    height: cardWidth * 0.75,
    backgroundColor: '#F6F8FA',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F8FA',
  },
  card: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 15,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    padding: 12,
  },
  brand: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 2,
  },
  model: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a73e8',
    marginBottom: 8,
  },
  specList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 4,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  spec: {
    fontSize: 10,
    color: '#666666',
    marginLeft: 4,
  },
  contentBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  badge: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 68,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingBottom: 8,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#858585',
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#FF4165',
    fontSize: 14,
  },
});

export default Home;