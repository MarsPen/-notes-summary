hexo clean
hexo g
git add .
git commit -m "$1"
git push origin master
scp -r public  root@47.94.96.45:/data/www/blog/










































