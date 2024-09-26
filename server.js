const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// الاتصال بقاعدة بيانات MongoDB
mongoose.connect('mongodb://localhost:27017/suggestions', {
    useNewUrlParser: true,
        useUnifiedTopology: true
        });

        const suggestionSchema = new mongoose.Schema({
            text: { type: String, required: true },
                likes: { type: Number, default: 0 }
                });

                const Suggestion = mongoose.model('Suggestion', suggestionSchema);

                // استرجاع الاقتراحات
                app.get('/suggestions', async (req, res) => {
                    const suggestions = await Suggestion.find().sort({ likes: -1 });
                        res.json(suggestions);
                        });

                        // إضافة اقتراح جديد
                        app.post('/suggestions', async (req, res) => {
                            const newSuggestion = new Suggestion({ text: req.body.text });
                                await newSuggestion.save();
                                    res.json(newSuggestion);
                                    });

                                    // إعجاب باقتراح
                                    app.put('/suggestions/:id/like', async (req, res) => {
                                        const suggestion = await Suggestion.findById(req.params.id);
                                            suggestion.likes += 1;
                                                await suggestion.save();
                                                    res.json(suggestion);
                                                    });

                                                    // حذف اقتراح
                                                    app.delete('/suggestions/:id', async (req, res) => {
                                                        await Suggestion.findByIdAndDelete(req.params.id);
                                                            res.sendStatus(204);
                                                            });

                                                            app.listen(PORT, () => {
                                                                console.log(`Server is running on http://localhost:${PORT}`);
                                                                });
                                                                