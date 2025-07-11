require('dotenv').config();
const mongoose = require('mongoose');
const Campground = require('../models/campgroundModel'); // Adjust if path differs

mongoose.connect('mongodb+srv://kumkum19305:c18v8KxCekhUMYo2@cluster0.11oio.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ MongoDB connection error:'));
db.once('open', () => {
  console.log('✅ Database connected');
});

// Replace this with a valid ObjectId of a registered user in your database
const userId = '68707a544866fb165cdebcf4'; 

const spots = [
  {
    title: 'Red Fort',
    location: 'Netaji Subhash Marg, Chandni Chowk, Delhi',
    description: 'Iconic Mughal fort with beautiful gardens, museums, and light shows.',
    price: 100,
    image: 'https://source.unsplash.com/featured/?redfort,delhi'
  },
  {
    title: 'Jama Masjid',
    location: 'Chandni Chowk, Delhi',
    description: 'One of India’s largest mosques with massive domes and minarets.',
    price: 0,
    image: 'https://source.unsplash.com/featured/?jamamasjid,delhi'
  },
  {
    title: 'India Gate',
    location: 'Rajpath Marg, Delhi',
    description: 'National war memorial surrounded by lush green gardens and fountains.',
    price: 0,
    image: 'https://source.unsplash.com/featured/?indiagate,delhi'
  },
  {
    title: 'Raj Ghat',
    location: 'Ring Road, Delhi',
    description: 'A peaceful memorial to Mahatma Gandhi with manicured lawns and museums.',
    price: 10,
    image: 'https://source.unsplash.com/featured/?rajghat,delhi'
  },
  {
    title: 'Humayun’s Tomb',
    location: 'Mathura Road, Delhi',
    description: 'Spectacular Mughal architecture surrounded by Persian-style gardens.',
    price: 30,
    image: 'https://source.unsplash.com/featured/?humayunstomb,delhi'
  },
  {
    title: 'Akshardham Temple',
    location: 'NH 24, Delhi',
    description: 'Grand spiritual-cultural complex with exhibitions and water shows.',
    price: 0,
    image: 'https://source.unsplash.com/featured/?akshardham,delhi'
  },
  {
    title: 'Chandni Chowk',
    location: 'Old Delhi',
    description: 'Historic market with vibrant food lanes, textiles, and cultural energy.',
    price: 0,
    image: 'https://source.unsplash.com/featured/?chandnichowk,delhi'
  },
  {
    title: 'Kashmere Gate Monument',
    location: 'Kashmere Gate, Delhi',
    description: 'Historical gate with remnants from the 1857 revolt near IGDTUW.',
    price: 0,
    image: 'https://source.unsplash.com/featured/?kashmeregate,delhi'
  },
  {
    title: 'St. James’ Church',
    location: 'Kashmere Gate, Delhi',
    description: 'One of the oldest churches in Delhi with colonial architecture.',
    price: 0,
    image: 'https://source.unsplash.com/featured/?church,delhi'
  },
  {
    title: 'Majnu Ka Tilla',
    location: 'GT Road, Delhi',
    description: 'Tibetan colony known for cafes, street food, and Buddhist temples.',
    price: 0,
    image: 'https://source.unsplash.com/featured/?majnu,delhi'
  },
  {
    title: 'Yamuna Ghat',
    location: 'Near Kashmere Gate, Delhi',
    description: 'Peaceful riverside spot for boat rides and birdwatching, especially during winter.',
    price: 20,
    image: 'https://source.unsplash.com/featured/?yamunaghat,delhi'
  },
  {
    title: 'Civil Lines Cafes',
    location: 'Civil Lines, Delhi',
    description: 'Trendy cafes perfect for group hangouts, coffee, and peaceful vibes.',
    price: 100,
    image: 'https://source.unsplash.com/featured/?cafedelhi'
  },
  {
    title: 'Delhi University North Campus',
    location: 'North Campus, Delhi',
    description: 'Bustling student area with food joints, gardens, and culture.',
    price: 0,
    image: 'https://source.unsplash.com/featured/?northcampus,delhi'
  },
  {
    title: 'Ridge Road Forest',
    location: 'Near Civil Lines, Delhi',
    description: 'A quiet stretch of road through lush greenery for walking or cycling.',
    price: 0,
    image: 'https://source.unsplash.com/featured/?forest,delhi'
  },
  {
    title: 'Nigambodh Ghat Garden',
    location: 'Kashmere Gate, Delhi',
    description: 'Serene garden space by the Yamuna, close to IGDTUW.',
    price: 0,
    image: 'https://source.unsplash.com/featured/?garden,delhi'
  }
];

const seedDB = async () => {
  await Campground.deleteMany({});
  console.log('🧹 Old campgrounds deleted');

  for (let spot of spots) {
    const camp = new Campground({
      title: spot.title,
      location: spot.location,
      description: spot.description,
      price: spot.price,
      images: [
        {
          url: spot.image,
          filename: 'seeded'
        }
      ],
      author: userId
    });
    await camp.save();
    console.log(`✅ Seeded: ${spot.title}`);
  }

  mongoose.connection.close();
  console.log('🌱 Done seeding!');
};

seedDB();
