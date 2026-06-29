# 一个芯片检测公司的官方网站


## 安装nginx
- yum install nginx -y

## https证书
腾讯云 OpenCloudOS 服务器
html5静态页面
安装https免费证书： Let’s Encrypt 免费证书

 - yum install certbot python3-certbot-nginx -y

'''
[root@VM-0-8-opencloudos ~]# certbot --nginx -d xionghao.site -d www.xionghao.site
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Requesting a certificate for xionghao.site and www.xionghao.site

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/xionghao.site/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/xionghao.site/privkey.pem
This certificate expires on 2026-09-27.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.

Deploying certificate
Successfully deployed certificate for xionghao.site to /etc/nginx/conf.d/html5.conf
Successfully deployed certificate for www.xionghao.site to /etc/nginx/conf.d/html5.conf
Congratulations! You have successfully enabled HTTPS on https://xionghao.site and https://www.xionghao.site
'''