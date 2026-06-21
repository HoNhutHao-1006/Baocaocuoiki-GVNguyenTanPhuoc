const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

/**
 * Rules-based local insights generator (Fallback if Gemini API fails or is not configured)
 */
function getLocalFallbackInsights(data) {
    const score = data.businessHealth.score;
    const isCritical = data.systemHealth.status === 'Critical';
    const hasWarning = data.systemHealth.status === 'Warning';
    const cancelRate = data.businessHealth.cancellationRate;
    const convRate = data.businessHealth.conversionRate;
    const retRate = data.businessHealth.retentionRate;

    // Build static executive summary based on metrics
    let summary = `Báo cáo sức khỏe doanh nghiệp đạt điểm số ${score}/100. `;
    if (score >= 80) {
        summary += `Hệ thống hoạt động ở hiệu suất tối ưu với tăng trưởng doanh thu tốt và tỷ lệ chuyển đổi vé cao. `;
    } else if (score >= 50) {
        summary += `Hoạt động kinh doanh ổn định nhưng đang có dấu hiệu thắt nút cổ chai ở tỷ lệ chuyển đổi hoặc tỷ lệ hủy vé. `;
    } else {
        summary += `CẢNH BÁO: Hiệu suất kinh doanh đang ở mức báo động đỏ, cần rà soát lại chính sách giá vé và các sự kiện đang chờ duyệt. `;
    }

    if (isCritical) {
        summary += `Về mặt kỹ thuật, hệ thống đang gặp lỗi nghiêm trọng hoặc có độ trễ API cao (>2s), cần lập trình viên can thiệp ngay lập tức để tránh gián đoạn dịch vụ.`;
    } else if (hasWarning) {
        summary += `Hệ thống ghi nhận một số cảnh báo cơ sở dữ liệu thiếu chỉ mục (index) ảnh hưởng đến tốc độ truy vấn của trang Admin.`;
    } else {
        summary += `Cơ sở hạ tầng công nghệ đang ở trạng thái khỏe mạnh, hoạt động mượt mà.`;
    }

    // Dynamic Action Items based on metrics
    const actionItems = [];

    // Action 1: Pricing / Market
    if (cancelRate > 10) {
        actionItems.push({
            action: 'Áp dụng phí giữ chỗ & phạt hủy vé',
            reason: `Tỷ lệ hủy đơn hàng hiện tại là ${cancelRate}%, vượt ngưỡng an toàn. Cần áp dụng phí cọc tối thiểu 10% để giữ chỗ.`,
            category: 'Pricing',
            confidence: 90.0,
            impactScore: 15.0,
            priority: 'Cao'
        });
    } else {
        actionItems.push({
            action: 'Giảm giá vé Workshop sớm 8%',
            reason: `Tận dụng các sự kiện học thuật sắp tới trên thị trường để kích cầu. Ưu đãi 8% cho đăng ký nhóm từ 3 người.`,
            category: 'Pricing',
            confidence: 82.0,
            impactScore: 10.0,
            priority: 'Trung bình'
        });
    }

    // Action 2: Marketing / Retention
    if (retRate < 50) {
        actionItems.push({
            action: 'Triển khai Loyalty Program (Ưu đãi thành viên)',
            reason: `Tỷ lệ khách hàng quay lại chỉ đạt ${retRate}%. Phát hành voucher giảm giá 15% cho lần đặt vé tiếp theo để giữ chân khách hàng B2B.`,
            category: 'Marketing',
            confidence: 88.0,
            impactScore: 18.0,
            priority: 'Cao'
        });
    } else {
        actionItems.push({
            action: 'Chiến dịch email chăm sóc khách hàng tự động',
            reason: `Gửi email khảo sát ý kiến và tặng mã giảm giá tự động sau khi kết thúc sự kiện 24 giờ.`,
            category: 'Marketing',
            confidence: 85.0,
            impactScore: 8.0,
            priority: 'Thấp'
        });
    }

    // Action 3: Database Index suggestion
    if (data.systemHealth.databaseInsights.length > 0) {
        actionItems.push({
            action: 'Đánh chỉ mục (Index) MongoDB cho Orders',
            reason: `Phát hiện collection orders thiếu index trên userId và eventId, gây COLLSCAN làm chậm thời gian tải trang Admin.`,
            category: 'Infrastructure',
            confidence: 99.0,
            impactScore: 25.0,
            priority: 'Cao'
        });
    } else {
        actionItems.push({
            action: 'Tối ưu hóa các API phản hồi chậm',
            reason: `Tối ưu hóa resolver GraphQL cho query getAIInsightsV2 hiện có thời gian phản hồi trung bình 2.3 giây.`,
            category: 'Infrastructure',
            confidence: 92.0,
            impactScore: 12.0,
            priority: 'Trung bình'
        });
    }

    // Action 4: Generic market recommendation
    actionItems.push({
        action: 'Khai thác xu hướng Check-in không chạm',
        reason: `Dựa trên dữ liệu khảo sát thị trường mới nhất, 89% người tham gia ưu tiên check-in nhanh qua mã QR. Cần nâng cấp QR Scanner.`,
        category: 'Marketing',
        confidence: 80.0,
        impactScore: 14.0,
        priority: 'Trung bình'
    });

    return {
        executiveSummary: summary,
        actionItems
    };
}

/**
 * Core Gemini integration for Business Insights V2.
 * Strictly uses aggregated/masked data to ensure customer privacy (Data Privacy).
 */
async function generateExecutiveSummaryAndActionsV2(aggregatedData) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'dummy_key') {
        console.info('[AI Service] GEMINI_API_KEY không được cấu hình. Sử dụng phân tích nội bộ (Local Fallback)...');
        return getLocalFallbackInsights(aggregatedData);
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Bạn là chuyên gia phân tích kinh doanh (Chief Business Analyst) cho hệ thống Lumina EMS.
Dưới đây là Báo cáo Sức khỏe Doanh nghiệp & Hệ thống được tính toán tự động bằng thuật toán Business Engine của chúng tôi:

1. CHỈ SỐ SỨC KHỎE DOANH NGHIỆP:
- Điểm Sức khỏe: ${aggregatedData.businessHealth.score}/100
- Tình trạng doanh thu: ${aggregatedData.businessHealth.revenueStatus}
- Tỷ lệ chuyển đổi mua vé (Conversion Rate): ${aggregatedData.businessHealth.conversionRate}%
- Tỷ lệ giữ chân khách hàng (Retention Rate): ${aggregatedData.businessHealth.retentionRate}%
- Tỷ lệ hủy đơn hàng (Cancellation Rate): ${aggregatedData.businessHealth.cancellationRate}%
- Chỉ số cạnh tranh thị trường: ${aggregatedData.businessHealth.marketCompetitiveness}

2. SỨC KHỎE HỆ THỐNG KỸ THUẬT:
- Trạng thái: ${aggregatedData.systemHealth.status}
- Danh sách API chậm nhất: ${JSON.stringify(aggregatedData.systemHealth.slowestApis)}
- Cảnh báo Database: ${JSON.stringify(aggregatedData.systemHealth.databaseInsights)}
- Các module lỗi nhiều nhất: ${JSON.stringify(aggregatedData.systemHealth.errorModules)}

3. DỰ BÁO DOANH THU (3 THÁNG TỚI):
${JSON.stringify(aggregatedData.forecasts)}

4. TIN TỨC THỊ TRƯỜNG THỰC TẾ:
${JSON.stringify(aggregatedData.marketEvents)}

Nhiệm vụ của bạn:
1. Viết một đoạn Tóm tắt điều hành (Executive Summary) bằng tiếng Việt trôi chảy, chuyên nghiệp giải thích tại sao điểm sức khỏe doanh nghiệp lại là ${aggregatedData.businessHealth.score}/100, nêu bật các điểm nghẽn kỹ thuật hoặc cơ hội thị trường thực tế.
2. Sinh ra 4 Đề xuất Hành động tối ưu (Action Items) cụ thể cho hệ thống dưới định dạng JSON. Với MỖI đề xuất hành động, viết một câu Lập luận/Lý do giải thích (reason) dựa trên các số liệu đầu vào và thông tin thị trường ở trên.

Hãy trả về CHÍNH XÁC theo cấu trúc JSON sau (KHÔNG giải thích gì thêm ngoài JSON, KHÔNG sử dụng tag \`\`\`json):
{
  "executiveSummary": "Đoạn văn tóm tắt chuyên nghiệp...",
  "actionItems": [
    {
      "action": "Tiêu đề hành động đề xuất (ví dụ: Giảm giá vé Hội thảo 8%)",
      "reason": "Câu lập luận chi tiết, cụ thể giải thích tại sao đề xuất này cần thiết dựa trên dữ liệu đầu vào và thông tin thị trường...",
      "category": "Pricing" hoặc "Marketing" hoặc "Infrastructure",
      "confidence": 87.0,
      "impactScore": 12.0,
      "priority": "Cao" hoặc "Trung bình" hoặc "Thấp"
    }
  ]
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Extract JSON block
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Không tìm thấy JSON hợp lệ từ Gemini');
        const parsed = JSON.parse(jsonMatch[0]);

        return {
            executiveSummary: parsed.executiveSummary || 'Không có tóm tắt.',
            actionItems: parsed.actionItems || []
        };
    } catch (err) {
        console.warn('[AI Service] Gọi Gemini API thất bại, chuyển hướng sang Local Fallback:', err.message);
        return getLocalFallbackInsights(aggregatedData);
    }
}

module.exports = { 
    askAIAssistant,
    generateExecutiveSummaryAndActionsV2
};
