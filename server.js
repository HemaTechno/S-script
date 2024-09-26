// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// اتصال بقاعدة البيانات
mongoose.connect('YOUR_MONGODB_URI', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// نموذج الاقتراح
const suggestionSchema = new mongoose.Schema({
    text: String,
    likes: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] }, // لتخزين المستخدمين الذين أعجبوا بالاقتراح
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

// إعدادات الجسم
app.use(bodyParser.json());
app.use(express.static('public')); // لخدمة الملفات الثابتة

// نقطة النهاية لإضافة اقتراح
app.post('/suggestions', async (req, res) => {
    const { text } = req.body;
    const newSuggestion = new Suggestion({ text });
    await newSuggestion.save();
    res.status(201).send(newSuggestion);
});

// نقطة النهاية للحصول على الاقتراحات
app.get('/suggestions', async (req, res) => {
    const suggestions = await Suggestion.find().sort({ likes: -1 }); // ترتيب الاقتراحات حسب عدد الإعجابات
    res.send(suggestions);
});

// نقطة النهاية للإعجاب بالاقتراح
app.post('/suggestions/:id/like', async (req, res) => {
    const suggestionId = req.params.id;
    const userId = req.body.userId; // يتطلب معرف المستخدم

    const suggestion = await Suggestion.findById(suggestionId);
    if (!suggestion) return res.status(404).send('Suggestion not found.');

    // تحقق مما إذا كان المستخدم قد أعجب بالفعل
    if (!suggestion.likedBy.includes(userId)) {
        suggestion.likes++;
        suggestion.likedBy.push(userId);
    } else {
        suggestion.likes--;
        suggestion.likedBy = suggestion.likedBy.filter(id => id !== userId);
    }
    
    await suggestion.save();
    res.send(suggestion);
});

// نقطة النهاية لحذف الاقتراح
app.delete('/suggestions/:id', async (req, res) => {
    const suggestionId = req.params.id;
    const password = req.body.password; // الحصول على كلمة المرور من الطلب

    if (password !== '2007') return res.status(403).send('Incorrect password.');

    await Suggestion.findByIdAndDelete(suggestionId);
    res.send('Suggestion deleted.');
});

// بدء الخادم
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
