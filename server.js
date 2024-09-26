const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// قراءة الاقتراحات من ملف JSON
const readSuggestions = () => {
    const data = fs.readFileSync('suggestions.json');
    return JSON.parse(data);
};

// حفظ الاقتراحات في ملف JSON
const saveSuggestions = (suggestions) => {
    fs.writeFileSync('suggestions.json', JSON.stringify({ suggestions }, null, 2));
};

// إضافة اقتراح جديد
app.post('/suggestions', (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: 'نص الاقتراح مطلوب' });
    }

    const suggestions = readSuggestions();
    const newSuggestion = { text, likes: 0 };
    suggestions.push(newSuggestion);

    saveSuggestions(suggestions);
    res.status(201).json({ message: 'تم حفظ الاقتراح بنجاح!' });
});

// الحصول على الاقتراحات
app.get('/suggestions', (req, res) => {
    const suggestions = readSuggestions();
    res.json(suggestions);
});

// إضافة مثل للاقتراح
app.post('/suggestions/:index/like', (req, res) => {
    const index = req.params.index;

    const suggestions = readSuggestions();
    if (suggestions[index]) {
        suggestions[index].likes += 1;
        saveSuggestions(suggestions);
        return res.json(suggestions[index]);
    }
    
    res.status(404).json({ message: 'الاقتراح غير موجود' });
});

// بدء الخادم
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
