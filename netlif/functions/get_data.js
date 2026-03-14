const { neon } = require('@netlify/neon');

exports.handler = async (event, context) => {
    // الاتصال بالقاعدة باستخدام الرابط المخزن في Netlify
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    try {
        // جلب البيانات من جدول المنتجات (الذي أنشأناه في الخطوة السابقة)
        const products = await sql`SELECT * FROM products`;

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(products),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
