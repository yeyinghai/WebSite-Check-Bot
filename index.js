// index.js

// 1. 导入依赖
const axios = require('axios');
require('dotenv').config(); // 加载 .env 文件中的环境变量

// 2. 加载和验证配置
const urls = process.env.CHECK_URLS;
const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

if (!urls || !webhookUrl) {
  console.error("❌ 错误：请确保在 .env 文件中设置了 CHECK_URLS 和 DISCORD_WEBHOOK_URL。");
  process.exit(1); // 退出脚本
}

const websites = urls.split(',').filter(url => url.trim() !== '');

/**
 * 检查单个网站的状态
 * @param {string} url - 要检查的网站 URL
 * @returns {Promise<object>} - 包含网站状态结果的对象
 */
async function checkWebsite(url) {
  try {
    const response = await axios.get(url, { timeout: 10000 }); // 10秒超时
    if (response.status >= 200 && response.status < 300) {
      return { url, status: response.status, ok: true, message: 'OK' };
    } else {
      return { url, status: response.status, ok: false, message: `HTTP 状态码: ${response.status}` };
    }
  } catch (error) {
    if (error.response) {
      // 请求已发出，但服务器响应了非 2xx 的状态码
      return { url, status: error.response.status, ok: false, message: `服务器错误: ${error.response.status}` };
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      return { url, status: 'N/A', ok: false, message: '无响应/超时' };
    } else {
      // 设置请求时发生错误
      return { url, status: 'N/A', ok: false, message: '请求设置失败' };
    }
  }
}

/**
 * 发送通知到 Discord
 */
 @param {string} title - 消息标题
 @param {string} description - 消息描述
 @param {string} color - 65280
async function sendDiscordNotification(title, description, color) {
  try {
    await axios.post(webhookUrl, {
      embeds: [{
        title: title,
        description: description,
        color: color,
        timestamp: new Date().toISOString()
      }]
    });
    console.log("✅ Discord 通知已发送。");
  } catch (error) {
    console.error("❌ 发送 Discord 通知失败:", error.message);
  }
}

/**
 * 主执行函数
 */
async function main() {
  console.log(`🚀 开始检查 ${websites.length} 个网站...`);
  
  const results = await Promise.all(websites.map(checkWebsite));
  
  const downSites = results.filter(result => !result.ok);
  const upSites = results.filter(result => result.ok);
  
  console.log("\n--- 检查结果 ---");
  results.forEach(r => {
      console.log(`[${r.ok ? '✅' : '❌'}] ${r.url} - 状态: ${r.status}, 消息: ${r.message}`);
  });
  console.log("----------------\n");

  if (downSites.length > 0) {
    const title = `🚨 ${downSites.length} 个网站出现问题！`;
    let description = downSites.map(site => 
      `**❌ ${site.url}**\n> 状态: ${site.status}\n> 原因: ${site.message}`
    ).join('\n\n');
    
    // 红色
    await sendDiscordNotification(title, description, 15548997); 
  } else {
    console.log("🎉 所有网站运行正常！");
    // 如果您希望所有网站正常时也收到通知，取消下面的注释
     const title = "✅ 所有网站运行正常";
     const description = `已成功检查 ${upSites.length} 个网站，一切正常。`;
     await sendDiscordNotification(title, description, 5763719); // 绿色
  }

  console.log("✨ 检查完成。");
}

// 运行主函数
main();
