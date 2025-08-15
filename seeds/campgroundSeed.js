require('dotenv').config();
const mongoose = require('mongoose');
const Campground = require('../models/campgroundModel');
const { cloudinary } = require('../cloudinary');

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const userId = '678e89732c596a156d6853b9';

const spots = [
  {
    title: 'Red Fort',
    location: 'Netaji Subhash Marg, Chandni Chowk, Delhi',
    description: 'Iconic Mughal fort with beautiful gardens, museums, and light shows.',
    price: 100,
    image: 'https://images.unsplash.com/photo-1705861144413-f02e38354648?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Jama Masjid',
    location: 'Chandni Chowk, Delhi',
    description: 'One of India’s largest mosques with massive domes and minarets.',
    price: 0,
    image: 'https://plus.unsplash.com/premium_photo-1697730332011-11f027c6aa60?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'India Gate',
    location: 'Rajpath Marg, Delhi',
    description: 'National war memorial surrounded by lush green gardens and fountains.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Raj Ghat',
    location: 'Ring Road, Delhi',
    description: 'A peaceful memorial to Mahatma Gandhi with manicured lawns and museums.',
    price: 10,
    image: 'https://plus.unsplash.com/premium_photo-1692102550620-35f8716814b4?q=80&w=985&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Humayun’s Tomb',
    location: 'Mathura Road, Delhi',
    description: 'Spectacular Mughal architecture surrounded by Persian-style gardens.',
    price: 30,
    image: 'https://images.unsplash.com/photo-1646938691456-a03d01a8276a?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Akshardham Temple',
    location: 'NH 24, Delhi',
    description: 'Grand spiritual-cultural complex with exhibitions and water shows.',
    price: 0,
    image: 'https://plus.unsplash.com/premium_photo-1697730464803-fcede713753e?q=80&w=1765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Chandni Chowk',
    location: 'Old Delhi',
    description: 'Historic market with vibrant food lanes, textiles, and cultural energy.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1660734430854-6e5f1c50788c?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Kashmere Gate Monument',
    location: 'Kashmere Gate, Delhi',
    description: 'Historical gate with remnants from the 1857 revolt near IGDTUW.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1676360103530-2d5fab3269d4?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'St. James’ Church',
    location: 'Kashmere Gate, Delhi',
    description: 'One of the oldest churches in Delhi with colonial architecture.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1718438699088-f6d10fe02840?q=80&w=985&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Majnu Ka Tilla',
    location: 'GT Road, Delhi',
    description: 'Tibetan colony known for cafes, street food, and Buddhist temples.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1677462719028-91ba8fabb8a7?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Yamuna Ghat',
    location: 'Near Kashmere Gate, Delhi',
    description: 'Peaceful riverside spot for boat rides and birdwatching, especially during winter.',
    price: 20,
    image: 'https://images.unsplash.com/photo-1679256922332-6100fc0efc38?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Civil Lines Cafes',
    location: 'Civil Lines, Delhi',
    description: 'Trendy cafes perfect for group hangouts, coffee, and peaceful vibes.',
    price: 100,
    image: 'https://images.unsplash.com/photo-1741945120461-e2b31be01fb9?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Delhi University North Campus',
    location: 'North Campus, Delhi',
    description: 'Bustling student area with food joints, gardens, and culture.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1697120508416-89675565948d?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Ridge Road Forest',
    location: 'Near Civil Lines, Delhi',
    description: 'A quiet stretch of road through lush greenery for walking or cycling.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1691565564510-946956735169?q=80&w=985&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Nigambodh Ghat Garden',
    location: 'Kashmere Gate, Delhi',
    description: 'Serene garden space by the Yamuna, close to IGDTUW.',
    price: 0,
    image: 'https://plus.unsplash.com/premium_photo-1730078556492-8288792f35d5?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];

// Upload helper
const uploadToCloudinary = async (imageUrl, title) => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'Camp-Around',
      public_id: title.replace(/\s+/g, '_')
    });
    return { url: result.secure_url, filename: result.public_id };
  } catch (err) {
    console.error('Cloudinary upload error:', err);
  }
};

const seedDB = async () => {
  await Campground.deleteMany({});
  console.log('🧹 Old campgrounds deleted');

  for (let spot of spots) {
    const uploadedImage = await uploadToCloudinary(spot.image, spot.title);
    const camp = new Campground({
      title: spot.title,
      location: spot.location,
      description: spot.description,
      price: spot.price,
      images: [uploadedImage],
      author: userId
    });
    await camp.save();
    console.log(`✅ Seeded: ${spot.title}`);
  }

  mongoose.connection.close();
  console.log('🎉 All campgrounds seeded with Cloudinary images!');
};

seedDB();
