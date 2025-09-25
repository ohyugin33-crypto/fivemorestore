const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { code, state } = event.queryStringParameters;

    if (!code) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing code" }) };
    }

    const client_id = "nP3SeBpkMdfZblXFfc1s";     
    const client_secret = "02XaZ8r1ax";           

    // 1. 토큰 발급
    const tokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&code=${code}&state=${state}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return { statusCode: 400, body: JSON.stringify({ error: "Token Error", detail: tokenData }) };
    }

    // 2. 사용자 정보 요청
    const userRes = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ tokenData, userData }, null, 2),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
