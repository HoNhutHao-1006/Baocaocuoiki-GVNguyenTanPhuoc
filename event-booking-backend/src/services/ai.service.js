const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy_key'
});

const askAIAssistant = async (question) => {
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'dummy_key') {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { 
                        role: "system", 
                        content: `Bạn là trợ lý AI thông minh cho một Sự kiện Công nghệ lớn (Tech Event 2026).
                        Thông tin sự kiện: 
                        - Tên: Tech Innovation Summit 2026.
                        - Dresscode: Smart Casual hoặc Trang phục lịch sự.
                        - Địa điểm: Sảnh Grand Ballroom, Trung tâm Sự kiện Quốc tế.
                        - Lịch trình: 08:00 (Check-in), 09:00 (Khai mạc), 10:00 (AI Panel), 12:00 (Ăn trưa Networking).
                        Hãy trả lời các câu hỏi của khách hàng một cách ngắn gọn, thân thiện và chuyên nghiệp dựa trên thông tin trên.`
                    },
                    { role: "user", content: question }
                ],
            });
            return response.choices[0].message.content;
        } catch (error) {
            console.error("AI Assistant Error:", error);
            return "Xin lỗi, hiện tại tôi không thể kết nối tới máy chủ AI.";
        }
    } else {
        return `[Mock AI Response] Vì chưa có OPENAI_API_KEY thực tế, tôi là trợ lý ảo mô phỏng quy trình RAG. 
Bạn vừa hỏi: "${question}"
Dựa trên dữ liệu sự kiện: Dresscode là Smart Casual, sảnh chính tại Grand Ballroom.`;
    }
};

module.exports = { askAIAssistant };
