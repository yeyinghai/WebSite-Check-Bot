# Site-Check Bot

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

一个简单而强大的 Node.js 机器人，用于监控网站的健康状况。它会自动检查您配置的网站列表，并在发现任何网站宕机或出现问题时，通过 Discord 发送警报。

## ✨ 特性

-   **易于配置**: 只需在一个 `.env` 文件中添加网站列表和 Discord Webhook URL。
-   **批量检查**: 并发检查多个网站，速度快效率高。
-   **清晰的通知**: 当网站出现问题时，发送格式清晰的 Discord Embed 消息。
-   **详细的日志**: 在控制台输出每个网站的检查结果。
-   **易于部署**: 可以轻松地作为定时任务 (Cron Job) 或通过 GitHub Actions 自动化运行。

## ⚙️ 安装与设置

1.  **克隆仓库**
    ```bash
    git clone [https://github.com/yeyinghai/Site-Check-Bot.git](https://github.com/yeyinghai/Site-Check-Bot.git)
    cd site-check-bot
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **创建配置文件**
    复制 `.env.example` 文件并重命名为 `.env`。
    ```bash
    cp .env.example .env
    ```

4.  **编辑 `.env` 文件**
    打开 `.env` 文件并填入您要监控的网站 URL 和您的 Discord Webhook URL。
    ```env
    # 网站列表，用逗号分隔，URL之间不要有空格
    CHECK_URLS=[https://www.google.com](https://www.google.com),[https://github.com](https://github.com),[https://a-website-that-does-not-exist.com](https://a-website-that-does-not-exist.com)

    # 你的 Discord Webhook URL
    DISCORD_WEBHOOK_URL=[https://discord.com/api/webhooks/your_webhook_id/your_webhook_token](https://discord.com/api/webhooks/your_webhook_id/your_webhook_token)
    ```
    > **如何获取 Discord Webhook URL?**
    > 在您的 Discord 服务器中，进入 `服务器设置` -> `整合` -> `Webhooks` -> `新建 Webhook`。给它取个名字，选择一个频道，然后复制 Webhook URL。

## 🚀 使用

直接运行脚本即可开始检查：
```bash
node index.js
```

## 🤖 使用 GitHub Actions 实现自动化

您无需自己的服务器即可 24/7 运行此监控。可以使用 GitHub Actions 来实现定时自动化检查。

1.  在您的 GitHub 仓库中，进入 `Settings` -> `Secrets and variables` -> `Actions`。
2.  点击 `New repository secret` 创建两个新的 Secret：
    * `CHECK_URLS`: 填入您要检查的网站列表（用逗号分隔）。
    * `DISCORD_WEBHOOK_URL`: 填入您的 Discord Webhook URL。
3.  在您的项目仓库中，创建 `.github/workflows/check.yml` 文件，并将以下内容粘贴进去：

    ```yaml
    name: Website Status Check

    on:
      schedule:
        # 每 15 分钟运行一次
        - cron: '*/15 * * * *'
      # 允许手动触发
      workflow_dispatch:

    jobs:
      check:
        runs-on: ubuntu-latest

        steps:
          - name: 检出代码
            uses: actions/checkout@v3

          - name: 设置 Node.js 环境
            uses: actions/setup-node@v3
            with:
              node-version: '18'

          - name: 安装依赖
            run: npm install

          - name: 运行检查脚本
            run: node index.js
            env:
              CHECK_URLS: ${{ secrets.CHECK_URLS }}
              DISCORD_WEBHOOK_URL: ${{ secrets.DISCORD_WEBHOOK_URL }}
    ```
4.  将更改推送到您的 GitHub 仓库。GitHub Actions 将会根据您设定的时间表（默认为每 15 分钟）自动运行检查。

## 📜 许可证

本项目使用 [MIT License](LICENSE)。
