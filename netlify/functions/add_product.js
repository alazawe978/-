const { neon } = require('@netlify/neon');

exports.handler = async (event) => {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const { name, price, image_url } = JSON.parse(event.body);

    try {
        await sql`INSERT INTO products (name, price, image_url) VALUES (${name}, ${price}, ${image_url})`;
        return { statusCode: 200, body: "تمت إضافة المنتج بنجاح!" };
    } catch (error) {
        return { statusCode: 500, body: error.message };
    }
};
